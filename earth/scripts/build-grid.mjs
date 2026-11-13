// Builds public/data/grid.bin: every land cell of a global 0.5° grid with the
// measurements the similarity model needs (src/analog/scoring.ts).
//
//   npm run grid                 build (downloads are cached in scripts/.cache)
//   npm run grid -- --report     benchmark sites and best cells per profile
//
// The file holds measurements, not scores: the browser scores a cell with the
// same module this script uses for the report.
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { inflateRawSync } from "node:zlib";
import { evaluate, GROUPS, LITHOLOGY, PROFILES, similarity, windPressure } from "../src/analog/scoring.ts";
import { cached, HERE, http, log, pool } from "./common.mjs";
import { COLS, modisGrid, ROWS } from "./grid-modis.mjs";
import { cellTerrain, landTiles, tileStore, windowTiles } from "./grid-terrain.mjs";

const OUT = path.resolve(HERE, "../public/data/grid.bin");
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
  impacts: { label: "Impact structures on Earth with coordinates and diameters, from Wikidata (CC0); follows the Earth Impact Database and includes buried and eroded structures", url: "https://www.wikidata.org/wiki/Q55818", kind: "dataset" },
  gvp: { label: "Global Volcanism Program, Volcanoes of the World: Holocene volcanoes (Smithsonian Institution)", url: "https://volcano.si.edu/", kind: "dataset" },
  geometry: { label: "Computed from latitude and axial tilt", url: "", kind: "computed" },
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
  { id: "swing", scale: 10, unit: "K", src: "mod11c3" },
  { id: "airT", scale: 10, unit: "°C", src: "power" },
  { id: "soilWetness", scale: 1000, unit: "", src: "power" },
  { id: "albedo", scale: 1000, unit: "", src: "power" },
  { id: "cloud", scale: 10, unit: "%", src: "power" },
  { id: "uv", scale: 100, unit: "", src: "power" },
  // Kilometres beyond the rim of the nearest impact structure (0 inside), and which one (index into the header's list).
  { id: "impact", scale: 10, unit: "km", src: "impacts" },
  { id: "impactId", scale: 1, unit: "", src: "" },
  // Kilometres to the nearest Holocene volcano, and which one.
  { id: "volcano", scale: 10, unit: "km", src: "gvp" },
  { id: "volcanoId", scale: 1, unit: "", src: "" },
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

// ----------------------------------------------------------------- features

/** Features beyond this distance earn nothing (see near() in scoring.ts), so they are not stored. */
const REACH = 60;
const RAD = Math.PI / 180;
const distanceKm = (lat1, lon1, lat2, lon2) => {
  const h = Math.sin(((lat2 - lat1) * RAD) / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(((lon2 - lon1) * RAD) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

/** Impact structures on Earth: [name, lat, lon, diameter in km]. */
async function impactStructures() {
  const query = `SELECT ?item ?itemLabel ?lat ?lon ?d WHERE { ?item wdt:P31/wdt:P279* wd:Q55818 . ?item p:P625 ?st . ?st psv:P625 ?v . ?v wikibase:geoGlobe wd:Q2 ; wikibase:geoLatitude ?lat ; wikibase:geoLongitude ?lon . OPTIONAL { ?item wdt:P2386 ?d } SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } }`;
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`;
  const raw = await cached("wikidata-impacts:v1", "json", async () => (await http(url, { headers: { Accept: "application/sparql-results+json", "User-Agent": "analog-grid-build/1.0" } })).text());
  const seen = new Map();
  for (const b of JSON.parse(raw).results.bindings) {
    const id = b.item.value;
    // A structure with no recorded diameter is taken as 2 km across.
    const entry = [b.itemLabel.value, +(+b.lat.value).toFixed(3), +(+b.lon.value).toFixed(3), b.d ? +(+b.d.value).toFixed(1) : 2];
    if (!seen.has(id) || entry[3] > seen.get(id)[3]) seen.set(id, entry);
  }
  return [...seen.values()].sort((x, y) => x[0].localeCompare(y[0]));
}

/** Holocene volcanoes: [name, lat, lon, 1 if basaltic, type]. */
async function holoceneVolcanoes() {
  const url = "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes&outputFormat=application/json";
  const raw = await cached("gvp-holocene:v1", "json", async () => {
    const json = await (await http(url)).json();
    return JSON.stringify(json.features.map((f) => [f.properties.Volcano_Name, f.properties.Latitude, f.properties.Longitude, f.properties.Major_Rock_Type ?? "", f.properties.Primary_Volcano_Type ?? ""]));
  });
  return JSON.parse(raw)
    .filter(([, lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon))
    .map(([name, lat, lon, rock, type]) => [name, +lat.toFixed(3), +lon.toFixed(3), /basalt|basanite|foidite/i.test(rock) && !/andesite/i.test(rock) ? 1 : 0, type.replace(/\(.*\)|\?/g, "").toLowerCase()]);
}

/**
 * The nearest feature to a cell: one inside the cell counts as 0 km away
 * whatever its distance from the centre; otherwise distance from the centre
 * less the feature's radius.
 */
function nearest(features, radiusOf, lat, lon) {
  let best = null;
  for (let i = 0; i < features.length; i++) {
    const [, fLat, fLon] = features[i];
    if (Math.abs(fLat - lat) > 1.5) continue;
    const inside = Math.floor((90 - fLat) / DEG) === Math.floor((90 - lat) / DEG) && Math.floor((fLon + 180) / DEG) === Math.floor((lon + 180) / DEG);
    const km = inside ? 0 : Math.max(0, distanceKm(lat, lon, fLat, fLon) - radiusOf(features[i]));
    if (km <= REACH && (!best || km < best.km)) best = { km, index: i };
  }
  return best;
}

// ------------------------------------------------------------------ climate

const POWER_PARAMETERS = ["T2M", "TS", "TS_MAX", "TS_MIN", "PRECTOTCORR_SUM", "WS10M", "AOD_55", "TQV", "PS", "GWETTOP", "ALLSKY_SRF_ALB", "CLOUD_AMT", "ALLSKY_SFC_UV_INDEX"];
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
  if (process.env.GRID_CLIMATE_ONLY) process.exit(0);

  log("Lithology (GLiM)");
  const rock = await lithology();

  const token = process.env.EARTHDATA_TOKEN?.trim();
  log(token ? "Land surface temperature and NDVI (MODIS CMG via Earthdata)" : "No EARTHDATA_TOKEN: temperatures fall back to POWER skin temperature and vegetation is left empty");
  const modis = await modisGrid(YEAR, token);

  log("Impact structures (Wikidata) and Holocene volcanoes (Global Volcanism Program)");
  const impacts = await impactStructures();
  const volcanoes = await holoceneVolcanoes();
  log(`  ${impacts.length} impact structures, ${volcanoes.length} volcanoes`);

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
    const crater = nearest(impacts, (f) => f[3] / 2, lat, lon);
    const volcano = nearest(volcanoes, () => 0, lat, lon);
    const optional = (v) => (Number.isFinite(v) ? v : null);
    cells.push({
      index, lat, lon, ...t, tmean, tmax,
      swing: measured ? optional(modis.swing[index]) : null,
      airT: at("T2M"), soilWetness: optional(at("GWETTOP")), albedo: optional(at("ALLSKY_SRF_ALB")), cloud: optional(at("CLOUD_AMT")), uv: optional(at("ALLSKY_SFC_UV_INDEX")),
      impact: crater?.km ?? null, impactId: crater?.index ?? null, volcano: volcano?.km ?? null, volcanoId: volcano?.index ?? null,
      volcanoBasaltic: volcano ? volcanoes[volcano.index][3] === 1 : false,
      ndvi: modis && Number.isFinite(modis.ndvi[index]) ? modis.ndvi[index] : null,
      precipitation: at("PRECTOTCORR_SUM"), vapour: at("TQV"), aod: at("AOD_55"),
      windPressure: windPressure(pressure, air, wind), pressure,
      lithology: rock[index], flags: measured ? 0 : 1,
    });
  }
  return { cells, modis: !!modis, impacts, volcanoes };
}

/** The numbers the shared scoring works on, for a grid cell. */
const earthMeasures = (cell) => ({ ...cell, swing: cell.swing, tags: null, ice: null });

const { cells, modis, impacts, volcanoes } = await measure();
const mode = process.argv[2];

if (mode === "--report") {
  // Established analog sites (brief, section 6): a calibrated model ranks them near the top for their body.
  const BENCHMARKS = [
    ["Yungay, Atacama", -24.08, -69.92, "mars"], ["McMurdo Dry Valleys", -77.6, 161.5, "mars"], ["Rio Tinto", 37.72, -6.55, "mars"],
    ["Mauna Kea", 19.82, -155.47, "both"], ["Askja, Iceland", 65.03, -16.75, "both"], ["Haughton crater", 75.38, -89.67, "both"],
    ["Hanksville, Utah", 38.41, -110.79, "mars"], ["Dallol, Danakil", 14.24, 40.3, "mars"], ["Pilbara", -21.15, 119.43, "mars"],
    ["Lake Salda", 37.5, 29.64, "mars"], ["Qaidam Basin", 38.5, 91.4, "mars"], ["Lanzarote", 29.03, -13.63, "both"],
    ["San Francisco Volcanic Field", 35.35, -111.5, "moon"], ["Meteor Crater", 35.03, -111.02, "moon"], ["Stillwater Complex", 45.4, -109.9, "moon"],
    ["Mistastin crater", 55.88, -63.3, "moon"], ["Lonar crater", 19.98, 76.51, "both"], ["Ries crater", 48.88, 10.57, "moon"],
    ["Craters of the Moon", 43.37, -113.49, "both"],
    // Places that must not score well.
    ["(Amazon rainforest)", -3.25, -62.25, "none"], ["(Greenland ice sheet)", 72.25, -40.25, "none"], ["(Deccan farmland)", 18.25, 75.25, "none"], ["(Rub al Khali)", 20.25, 50.25, "none"], ["(Paris basin)", 48.75, 2.25, "none"],
  ];
  const byIndex = new Map(cells.map((c) => [c.index, c]));
  const cellOf = (lat, lon) => byIndex.get(Math.floor((90 - lat) / DEG) * COLS + Math.floor((lon + 180) / DEG));
  const wanted = process.argv[3];
  for (const profile of PROFILES) {
    if (wanted && !profile.id.includes(wanted)) continue;
    const scores = cells.map((c) => similarity(earthMeasures(c), profile));
    const sorted = Float64Array.from(scores).sort();
    const rankOf = (v) => 100 * (1 - sorted.findIndex((x) => x >= v) / sorted.length);
    const q = (f) => (sorted[Math.round(f * (sorted.length - 1))] * 100).toFixed(0);
    log(`\n=== ${profile.body} / ${profile.name}: median ${q(0.5)}%, 90th ${q(0.9)}%, 99th ${q(0.99)}%, max ${q(1)}%`);
    const groups = GROUPS.filter((g) => profile.weights[g.id] > 0);
    const line = (e) => groups.map((g) => `${g.short} ${e.groups[g.id].score == null ? "n/a" : Math.round(e.groups[g.id].score * 100)}`).join(" ");
    for (const [name, lat, lon, body] of BENCHMARKS) {
      const cell = cellOf(lat, lon);
      if (!cell) { log(`  ${name.padEnd(30)} no land cell`); continue; }
      const e = evaluate(earthMeasures(cell), profile);
      const mark = body === "both" || body === profile.body ? "*" : " ";
      log(`${mark} ${name.padEnd(30)} ${(e.overall * 100).toFixed(0).padStart(3)}%  top ${rankOf(e.overall).toFixed(1).padStart(5)}%  ${line(e)}  [${cell.lithology}]`);
    }
    log("  best cells:");
    const ranked = cells.map((c, i) => ({ c, score: scores[i] })).sort((a, b) => b.score - a.score);
    const shown = [];
    for (const r of ranked) {
      // Spread the list out: skip cells within 3° of one already listed.
      if (shown.some((x) => Math.abs(x.c.lat - r.c.lat) < 3 && Math.abs(x.c.lon - r.c.lon) < 3)) continue;
      shown.push(r);
      log(`  ${(r.score * 100).toFixed(0)}%  ${r.c.lat.toFixed(2)}, ${r.c.lon.toFixed(2)}  ${line(evaluate(earthMeasures(r.c), profile))}  [${r.c.lithology}]${r.c.impactId != null ? ` ${impacts[r.c.impactId][0]}` : ""}${r.c.volcanoId != null ? ` ${volcanoes[r.c.volcanoId][0]}` : ""}`);
      if (shown.length >= 12) break;
    }
  }
} else {
  const codes = Object.keys(LITHOLOGY);
  const header = Buffer.from(JSON.stringify({
    version: 2,
    generated: new Date().toISOString().slice(0, 10),
    cols: COLS, rows: ROWS, cellDegrees: DEG, count: cells.length, nodata: NODATA,
    fields: FIELDS.map((f) => (f.id === "tmean" || f.id === "tmax" ? { ...f, altSrc: "power" } : f)),
    modis,
    year: YEAR,
    lithology: codes.map((id) => ({ id, label: LITHOLOGY[id].label })),
    impacts, volcanoes,
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
