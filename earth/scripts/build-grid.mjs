// Builds public/data/grid.bin: every land cell of a global 0.5° grid, measured
// the same way as the curated sites so that the browser can score any click
// against any target with the shared scoring module (src/analog/scoring.ts).
//
//   npm run grid                 build (downloads are cached in scripts/.cache)
//   npm run grid -- --validate   compare grid cells with the curated sites
//   npm run grid -- --report     list the best-scoring regions per target
//
// The file holds measurements, not scores: the similarities are computed in
// the browser by the same code that scores the curated sites, so mission-goal
// weights apply to clicks and to the heatmap.
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { inflateRawSync } from "node:zlib";
import { compare, overall, sunElevation, windPressure } from "../src/analog/scoring.ts";
import { BODIES, TAGS } from "./analog-sites.mjs";
import { cached, HERE, http, log, pool } from "./common.mjs";
import { COLS, modisGrid, ROWS } from "./grid-modis.mjs";
import { cellTerrain, landTiles, tileStore, windowTiles } from "./grid-terrain.mjs";

const OUT = path.resolve(HERE, "../public/data/grid.bin");
const ANALOGS = path.resolve(HERE, "../public/data/analogs.json");
const YEAR = 2023;
const DEG = 0.5;
const NODATA = -32768;

const cellLat = (row) => 90 - (row + 0.5) * DEG;
const cellLon = (col) => -180 + (col + 0.5) * DEG;

const SOURCES = {
  copdem: { label: "Copernicus DEM GLO-90 (ESA / Airbus), AWS Open Data; read from the 185 m overview and block-averaged to 450 m", url: "https://registry.opendata.aws/copernicus-dem/", kind: "dataset" },
  power: { label: "NASA POWER climatology 2001–2025 (MERRA-2, CERES), 0.5° × 0.625°, interpolated to the cell centre", url: "https://power.larc.nasa.gov/", kind: "dataset" },
  mod11c3: { label: `MODIS/Terra MOD11C3 v061 monthly land surface temperature, ${YEAR}, 0.05° averaged over the cell (NASA LP DAAC)`, url: "https://doi.org/10.5067/MODIS/MOD11C3.061", kind: "dataset" },
  mod13c2: { label: `MODIS/Terra MOD13C2 v061 monthly NDVI, ${YEAR}, 0.05° averaged over the cell (NASA LP DAAC)`, url: "https://doi.org/10.5067/MODIS/MOD13C2.061", kind: "dataset" },
  glim: { label: "GLiM global lithological map, 0.5° grid (Hartmann & Moosdorf 2012, Geochem. Geophys. Geosyst. 13:Q12004), CC BY 3.0", url: "https://doi.org/10.1594/PANGAEA.788537", kind: "dataset" },
  geometry: { label: "Computed from latitude and axial tilt", url: "", kind: "computed" },
};

/**
 * GLiM's sixteen rock classes, and what each says on the atlas's geology
 * vocabulary. A lithology map can only speak to five of the seventeen terms
 * (VOCABULARY); minerals and landforms are beyond it. That is too little to
 * score: a first build that scored it ranked every cell of loose sediment or
 * ice (no score, so no penalty) above every cell of known rock. So geology is
 * never scored for a grid cell; the rock class is stored and the card says
 * in words what it shares with the target. `tags: null` means the class
 * says nothing about bedrock (loose sediment, ice, water, no data); an empty
 * object means known bedrock that is none of the five.
 */
const VOCABULARY = ["basalt", "carbonate", "sulfate", "chloride", "glass"];
const LITHOLOGY = {
  su: { label: "unconsolidated sediments", tags: null },
  vb: { label: "basic volcanic rocks", tags: { basalt: 1 } },
  ss: { label: "siliciclastic sedimentary rocks", tags: {} },
  pb: { label: "basic plutonic rocks", tags: {} },
  sm: { label: "mixed sedimentary rocks", tags: { carbonate: 0.5 } },
  sc: { label: "carbonate sedimentary rocks", tags: { carbonate: 1 } },
  va: { label: "acid volcanic rocks", tags: {} },
  mt: { label: "metamorphic rocks", tags: {} },
  pa: { label: "acid plutonic rocks", tags: {} },
  vi: { label: "intermediate volcanic rocks", tags: {} },
  wb: { label: "water bodies", tags: null },
  py: { label: "pyroclastics", tags: { glass: 1 } },
  pi: { label: "intermediate plutonic rocks", tags: {} },
  ev: { label: "evaporites", tags: { sulfate: 0.5, chloride: 0.5 } },
  nd: { label: "no data", tags: null },
  ig: { label: "ice and glaciers", tags: null },
};

/** Stored as 16-bit integers: value = stored / scale. */
const FIELDS = [
  { id: "slope", scale: 100, unit: "°", src: "copdem" },
  { id: "roughness", scale: 10, unit: "m", src: "copdem" },
  { id: "relief", scale: 1, unit: "m", src: "copdem" },
  { id: "elevation", scale: 1, unit: "m", src: "copdem" },
  { id: "tmean", scale: 10, unit: "K", src: "mod11c3" },
  { id: "tmax", scale: 10, unit: "K", src: "mod11c3" },
  { id: "ndvi", scale: 1000, unit: "", src: "mod13c2" },
  { id: "precipitation", scale: 1, unit: "mm/yr", src: "power" },
  { id: "vapour", scale: 100, unit: "kg/m²", src: "power" },
  { id: "aod", scale: 1000, unit: "", src: "power" },
  { id: "windPressure", scale: 100, unit: "Pa", src: "power" },
  { id: "pressure", scale: 0.1, unit: "Pa", src: "power" },
  { id: "lithology", scale: 1, unit: "", src: "glim" },
  // Bit 0: temperatures are MERRA-2 skin temperature from POWER, because MODIS has no value for the cell.
  { id: "flags", scale: 1, unit: "", src: "" },
];

// ---------------------------------------------------------------- lithology

/** Reads one file out of a zip archive (stored or deflated entries). */
function unzip(zip, name) {
  const end = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  let at = zip.readUInt32LE(end + 16);
  for (let i = zip.readUInt16LE(end + 10); i > 0; i--) {
    const method = zip.readUInt16LE(at + 10), size = zip.readUInt32LE(at + 20);
    const nameLength = zip.readUInt16LE(at + 28), extra = zip.readUInt16LE(at + 30), comment = zip.readUInt16LE(at + 32);
    const local = zip.readUInt32LE(at + 42);
    if (zip.toString("utf8", at + 46, at + 46 + nameLength) === name) {
      const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
      const body = zip.subarray(start, start + size);
      return method === 0 ? body : inflateRawSync(body);
    }
    at += 46 + nameLength + extra + comment;
  }
  throw new Error(`${name} is not in the archive`);
}

/** GLiM class abbreviation per cell (rows from the north), or null. */
async function lithology() {
  const url = "https://epic.awi.de/id/eprint/31092/1/hartmann-moosdorf_2012.zip";
  const zip = await cached(url, "zip", async () => (await http(url)).arrayBuffer());
  const names = {};
  for (const line of String(unzip(zip, "Classnames.txt")).split(/\r?\n/).slice(1)) {
    const [, value, , abbreviation] = line.split(";");
    if (abbreviation) names[+value] = abbreviation.replaceAll('"', "");
  }
  const lines = String(unzip(zip, "glim_wgs84_0point5deg.txt.asc")).split(/\r?\n/);
  const header = Object.fromEntries(lines.slice(0, 6).map((l) => l.trim().split(/\s+/)));
  if (+header.ncols !== COLS || +header.nrows !== ROWS || +header.xllcorner !== -180 || +header.yllcorner !== -90) throw new Error("GLiM grid is not the expected global 0.5° grid");
  const cells = new Array(COLS * ROWS).fill(null);
  for (let r = 0; r < ROWS; r++) {
    const row = lines[6 + r].trim().split(/\s+/);
    for (let c = 0; c < COLS; c++) cells[r * COLS + c] = names[+row[c]] ?? null;
  }
  return cells;
}

// ------------------------------------------------------------------ climate

const POWER_PARAMETERS = ["T2M", "TS", "TS_MAX", "TS_MIN", "PRECTOTCORR_SUM", "WS10M", "AOD_55", "TQV", "PS"];
const P_LAT = 361; // 0.5° nodes from 90°S
const P_LON = 576; // 0.625° nodes from 180°W

/**
 * Annual climatology on POWER's native grid, one parameter and one 10° box
 * per request (the service allows no more). Only boxes that hold land are
 * requested, three at a time: the service rate-limits anything faster.
 * Missing values stay NaN.
 */
async function powerClimate(boxes) {
  const fields = Object.fromEntries(POWER_PARAMETERS.map((p) => [p, new Float32Array(P_LAT * P_LON).fill(NaN)]));
  const jobs = boxes.flatMap((box) => POWER_PARAMETERS.map((parameter) => ({ ...box, parameter })));
  let done = 0;
  await pool(jobs, 3, async ({ lat, lon, parameter }) => {
    const url = `https://power.larc.nasa.gov/api/temporal/climatology/regional?parameters=${parameter}&community=AG&latitude-min=${lat}&latitude-max=${lat + 10}&longitude-min=${lon}&longitude-max=${lon + 10}&format=JSON`;
    const raw = await cached(`power-regional:v1:${url}`, "json", async () => {
      for (let attempt = 1; ; attempt++) {
        const res = await fetch(url, { signal: AbortSignal.timeout(180_000) }).catch(() => null);
        if (res?.ok) {
          const json = await res.json();
          return JSON.stringify(json.features.map((f) => [f.geometry.coordinates[0], f.geometry.coordinates[1], f.properties.parameter[parameter].ANN]));
        }
        if (attempt >= 15) throw new Error(`POWER ${parameter} ${lat},${lon}: ${res ? `HTTP ${res.status} ${(await res.text()).slice(0, 200)}` : "no response"}`);
        // HTTP 429 is the service asking for a pause: give it a minute.
        await new Promise((r) => setTimeout(r, res?.status === 429 ? 60_000 : 4000 * attempt));
      }
    });
    for (const [x, y, value] of JSON.parse(raw)) {
      if (value == null || value < -900) continue;
      const row = Math.round((y + 90) / 0.5), col = ((Math.round((x + 180) / 0.625) % P_LON) + P_LON) % P_LON;
      fields[parameter][row * P_LON + col] = value;
    }
    if (++done % 200 === 0) log(`  POWER ${done}/${jobs.length}`);
  });
  return fields;
}

/** Bilinear interpolation of a POWER field to a point, over the nodes that have data. */
function sample(field, lat, lon) {
  const y = (lat + 90) / 0.5, x = (lon + 180) / 0.625;
  const y0 = Math.floor(y), x0 = Math.floor(x), fy = y - y0, fx = x - x0;
  let sum = 0, weight = 0;
  for (const [dy, dx, w] of [[0, 0, (1 - fy) * (1 - fx)], [0, 1, (1 - fy) * fx], [1, 0, fy * (1 - fx)], [1, 1, fy * fx]]) {
    const v = field[Math.min(P_LAT - 1, y0 + dy) * P_LON + ((x0 + dx) % P_LON)];
    if (Number.isFinite(v) && w > 0) { sum += v * w; weight += w; }
  }
  return weight > 0 ? sum / weight : NaN;
}

// ------------------------------------------------------------------ terrain

/**
 * Reading and decoding the elevation tiles is the slow, processor-bound part
 * (about an hour on one core). GRID_BANDS="-60,-1" makes a run measure only
 * those latitude bands and stop, so several runs can fill the cache side by
 * side before the real build.
 */
const BANDS = (process.env.GRID_BANDS ?? "-90,89").split(",").map(Number);

/** Terrain for every land cell, one 1° latitude band at a time; each band's result is cached. */
async function terrain(land) {
  const store = tileStore(land);
  const out = new Map();
  for (let band = BANDS[0]; band <= BANDS[1]; band++) {
    const rows = [0, 1].map((k) => Math.round((90 - band) / DEG) - 1 - k); // the two cell rows inside this band
    const raw = await cached(`grid-terrain:v1:${band}`, "json", async () => {
      const cells = [];
      const needed = new Map();
      for (const row of rows) {
        for (let col = 0; col < COLS; col++) {
          const tiles = windowTiles(cellLat(row), cellLon(col)).filter(([la, lo]) => store.has(la, lo));
          if (!tiles.length) continue;
          cells.push([row, col]);
          for (const [la, lo] of tiles) needed.set(`${la},${lo}`, [la, lo]);
        }
      }
      store.keep(band - 1, band + 1);
      await pool([...needed.values()], 8, ([la, lo]) => store.get(la, lo));
      const result = [];
      for (const [row, col] of cells) {
        const t = await cellTerrain(store, cellLat(row), cellLon(col));
        if (t) result.push([row * COLS + col, +t.slope.toFixed(3), +t.roughness.toFixed(2), Math.round(t.relief), Math.round(t.elevation)]);
      }
      log(`  terrain ${band}°: ${result.length} land cells, ${needed.size} tiles`);
      return JSON.stringify(result);
    });
    for (const [index, slope, roughness, relief, elevation] of JSON.parse(raw)) out.set(index, { slope, roughness, relief, elevation });
  }
  return out;
}

// --------------------------------------------------------------------- build

async function measure() {
  log("Land mask and terrain (Copernicus GLO-90)");
  const land = await landTiles();
  const ground = await terrain(land);
  log(`  ${ground.size} land cells`);
  if (process.env.GRID_BANDS) process.exit(0);

  log("Climate (NASA POWER)");
  const boxes = new Map();
  for (const index of ground.keys()) {
    const lat = cellLat(Math.floor(index / COLS)), lon = cellLon(index % COLS);
    const box = { lat: Math.min(80, Math.floor(lat / 10) * 10), lon: Math.min(170, Math.floor(lon / 10) * 10) };
    boxes.set(`${box.lat},${box.lon}`, box);
  }
  const climate = await powerClimate([...boxes.values()]);

  log("Lithology (GLiM)");
  const rock = await lithology();

  const token = process.env.EARTHDATA_TOKEN?.trim();
  log(token ? "Land surface temperature and NDVI (MODIS CMG via Earthdata)" : "No EARTHDATA_TOKEN: temperatures fall back to POWER skin temperature and vegetation is left empty");
  const modis = await modisGrid(YEAR, token);

  const cells = [];
  for (const [index, t] of [...ground].sort((a, b) => a[0] - b[0])) {
    const lat = cellLat(Math.floor(index / COLS)), lon = cellLon(index % COLS);
    const at = (parameter) => sample(climate[parameter], lat, lon);
    const pressure = at("PS") * 1000, air = at("T2M") + 273.15, wind = at("WS10M");
    const measured = modis && Number.isFinite(modis.tmean[index]);
    const tmean = measured ? modis.tmean[index] : at("TS") + 273.15;
    const tmax = measured ? modis.tmax[index] : at("TS_MAX") + 273.15;
    // A cell with no climate at all (none of POWER's nodes around it has data) cannot be scored.
    if (![pressure, air, wind, tmean, tmax, at("PRECTOTCORR_SUM"), at("TQV"), at("AOD_55")].every(Number.isFinite)) continue;
    cells.push({
      index, lat, lon, ...t, tmean, tmax,
      ndvi: modis && Number.isFinite(modis.ndvi[index]) ? modis.ndvi[index] : null,
      precipitation: at("PRECTOTCORR_SUM"), vapour: at("TQV"), aod: at("AOD_55"),
      windPressure: windPressure(pressure, air, wind), pressure,
      lithology: rock[index], flags: measured ? 0 : 1,
    });
  }
  return { cells, modis: !!modis };
}

/** The numbers the shared scoring works on, for a grid cell. */
const earthMeasures = (cell) => ({
  ...cell,
  sun: sunElevation(cell.lat, BODIES.earth.obliquity),
  ice: null, // no global ground-ice source: the water score uses dryness and vapour only
  tags: null, // rock type is carried for the card but never scored (see LITHOLOGY)
});
const targetMeasures = (t) => ({ ...Object.fromEntries(Object.entries(t.m).map(([k, m]) => [k, m.v])), ice: t.ice, tags: t.tags, subsurface: t.subsurface });

const { cells, modis } = await measure();
const atlas = JSON.parse(readFileSync(ANALOGS, "utf8"));
const mode = process.argv[2];

if (mode === "--validate") {
  log("\nCurated site against the grid cell that contains it (site value -> cell value)");
  const byIndex = new Map(cells.map((c) => [c.index, c]));
  for (const s of atlas.sites) {
    const cell = byIndex.get(Math.floor((90 - s.lat) / DEG) * COLS + Math.floor((s.lon + 180) / DEG));
    if (!cell) { log(`${s.id.padEnd(12)} no land cell`); continue; }
    const pair = (k, d = 1) => `${k} ${s.m[k].v.toFixed(d)} -> ${cell[k] == null ? "n/a" : cell[k].toFixed(d)}`;
    log(`${s.id.padEnd(12)} ${pair("slope", 2)}  ${pair("tmean")}  ${pair("tmax")}  ${pair("ndvi", 2)}  ${pair("precipitation", 0)}  ${pair("aod", 2)}  ${pair("windPressure")}  ${cell.lithology}`);
  }
} else if (mode === "--report") {
  for (const target of atlas.targets) {
    const tm = targetMeasures(target);
    const ranked = cells
      .map((c) => ({ c, score: overall(compare(earthMeasures(c), tm, TAGS), target.weights) }))
      .sort((a, b) => b.score - a.score);
    log(`\n${target.name}: best cells (default weights)`);
    // Spread the list out: skip cells within 3° of one already listed.
    const shown = [];
    for (const r of ranked) {
      if (shown.some((s) => Math.abs(s.c.lat - r.c.lat) < 3 && Math.abs(s.c.lon - r.c.lon) < 3)) continue;
      shown.push(r);
      const d = compare(earthMeasures(r.c), tm, TAGS);
      log(`  ${(r.score * 100).toFixed(0)}%  ${r.c.lat.toFixed(2)}, ${r.c.lon.toFixed(2)}  ${Object.entries(d).map(([k, v]) => `${k} ${v.score == null ? "n/a" : Math.round(v.score * 100)}`).join(" ")}  [${r.c.lithology}]`);
      if (shown.length >= 25) break;
    }
  }
} else {
  const codes = Object.keys(LITHOLOGY);
  const header = Buffer.from(JSON.stringify({
    version: 1,
    generated: new Date().toISOString().slice(0, 10),
    cols: COLS, rows: ROWS, cellDegrees: DEG, count: cells.length, nodata: NODATA,
    fields: FIELDS.map((f) => (f.id === "tmean" || f.id === "tmax" ? { ...f, altSrc: "power" } : f)),
    modis,
    year: YEAR,
    vocabulary: VOCABULARY,
    lithology: codes.map((id) => ({ id, ...LITHOLOGY[id] })),
    sources: Object.fromEntries(Object.entries(SOURCES).filter(([id]) => modis || !id.startsWith("mod"))),
  }));
  const padded = Math.ceil(header.length / 4) * 4;
  const body = Buffer.alloc(8 + padded + cells.length * 4 + FIELDS.length * cells.length * 2);
  body.write("AGRD", 0, "ascii");
  body.writeUInt32LE(padded, 4);
  header.copy(body, 8);
  body.fill(0x20, 8 + header.length, 8 + padded);
  let at = 8 + padded;
  for (const c of cells) { body.writeUInt32LE(c.index, at); at += 4; }
  for (const f of FIELDS) {
    for (const c of cells) {
      const value = f.id === "lithology" ? (c.lithology ? codes.indexOf(c.lithology) : null) : c[f.id];
      body.writeInt16LE(value == null ? NODATA : Math.max(-32767, Math.min(32767, Math.round(value * f.scale))), at);
      at += 2;
    }
  }
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, body);
  log(`Wrote ${path.relative(process.cwd(), OUT)}: ${cells.length} cells, ${(body.length / 1e6).toFixed(2)} MB${modis ? "" : " (without MODIS)"}`);
}
