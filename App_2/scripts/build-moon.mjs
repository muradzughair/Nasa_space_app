// Builds public/data/moon.bin: what can be said about an arbitrary point on
// the Moon, for custom comparison targets (src/analog/custom.ts).
//
//   npm run moon                 build the file
//   npm run moon -- --check      print the reference regions as read back from the file
//
// Two things are in the file, and nothing else:
//  - Terrain: median slope, roughness and relief of a 32 km window of 450 m
//    cells at the centre of every 0.5° cell, from LOLA LDEM_64. The window,
//    the sampling and terrainMetrics() are those of planetTerrain() in
//    build-analogs.mjs and measure-profiles.mjs, which measured the terrain
//    of the three lunar profiles.
//  - Mare or not: the LROC global mare boundaries (Nelson et al. 2014),
//    rasterised to 0.125° with the name of the mare.
//
// The first run downloads LDEM_64 (530 MB) and the mare shapefile (7 MB) into
// scripts/.cache.
import { createWriteStream, existsSync, readFileSync, statSync } from "node:fs";
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { CACHE, cached, CELL, HALF, HERE, http, log, N, RAD, RADIUS, terrainMetrics } from "./common.mjs";

const PDS = "https://pds-geosciences.wustl.edu";
const LDEM = { url: `${PDS}/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/cylindrical/img/ldem_64.img`, ppd: 64, width: 23040, height: 11520, scale: 0.5, bytes: 530_841_600 };
const MARE = "https://pds.lroc.asu.edu/data/LRO-L-LROC-5-RDR-V1.0/LROLRC_2001/EXTRAS/SHAPEFILE/LROC_GLOBAL_MARE/LROC_GLOBAL_MARE_180";
const OUT = path.join(HERE, "..", "public", "data", "moon.bin");

/** Terrain grid: the Earth grid's spacing. */
const T_DEG = 0.5, T_COLS = 720, T_ROWS = 360;
/** Stored integers per unit, and the value that means "no measurement". */
const SCALES = { slope: 1000, roughness: 100, relief: 4 };
const NODATA = 65535;
/** Mare raster. */
const M_DEG = 0.125, M_COLS = 2880, M_ROWS = 1440;

// ------------------------------------------------------------------ download

/** The whole of LDEM_64, downloaded once and resumed if interrupted. */
async function ldem() {
  const file = path.join(CACHE, "ldem_64.img");
  if (!existsSync(file)) {
    await mkdir(CACHE, { recursive: true });
    const part = `${file}.part`;
    for (let attempt = 1; ; attempt++) {
      const have = existsSync(part) ? statSync(part).size : 0;
      if (have >= LDEM.bytes) break;
      log(`LDEM_64: downloading from byte ${have} of ${LDEM.bytes}`);
      try {
        const res = await fetch(LDEM.url, { headers: { Range: `bytes=${have}-` } });
        if (res.status !== 206) throw new Error(`HTTP ${res.status}`);
        await pipeline(Readable.fromWeb(res.body), createWriteStream(part, { flags: "a" }));
      } catch (error) {
        if (attempt >= 8) throw error;
        log(`  interrupted (${error.message}); resuming`);
      }
    }
    await rename(part, file);
  }
  const buffer = readFileSync(file);
  if (buffer.length !== LDEM.bytes) throw new Error(`ldem_64.img: ${buffer.length} bytes, expected ${LDEM.bytes}`);
  // The file is little-endian 16-bit integers, as is every machine this runs on.
  return new Int16Array(buffer.buffer, buffer.byteOffset, buffer.length / 2);
}

// ------------------------------------------------------------------- terrain

/**
 * planetTerrain() of build-analogs.mjs for LDEM_64, reading from memory
 * instead of a byte range. Longitude wraps at 0°/360°. Returns null where the
 * window reaches past a pole (within about 0.6° of it), which that reader
 * cannot sample.
 */
export function moonTerrain(dem, lat, lonIn) {
  const R = RADIUS.moon;
  const lon = ((lonIn % 360) + 360) % 360;
  const z = new Float64Array(N * N);
  const { width, height, ppd, scale } = LDEM;
  for (let r = 0; r < N; r++) {
    const la = lat + (HALF - (r + 0.5) * CELL) / (R * RAD);
    const y = (90 - la) * ppd - 0.5;
    const yi = Math.floor(y), fy = y - yi;
    if (yi < 0 || yi + 1 >= height) return null;
    for (let c = 0; c < N; c++) {
      const lo = lon + ((c + 0.5) * CELL - HALF) / (R * RAD * Math.cos(lat * RAD));
      const x = lo * ppd - 0.5;
      const xf = Math.floor(x), fx = x - xf;
      const x0 = ((xf % width) + width) % width, x1 = (x0 + 1) % width;
      const a = yi * width, b = a + width;
      z[r * N + c] = (dem[a + x0] * (1 - fx) * (1 - fy) + dem[a + x1] * fx * (1 - fy) + dem[b + x0] * (1 - fx) * fy + dem[b + x1] * fx * fy) * scale;
    }
  }
  return terrainMetrics(z);
}

// ---------------------------------------------------------------------- mare

/** Polygons of a shapefile (type 5) with one attribute of the DBF beside it. */
function readShapes(shp, dbf, field) {
  const names = [];
  const headerLength = dbf.readUInt16LE(8), recordLength = dbf.readUInt16LE(10), count = dbf.readUInt32LE(4);
  let offset = 1, at = null;
  for (let p = 32; dbf[p] !== 0x0d; p += 32) {
    const name = dbf.toString("latin1", p, p + 11).replace(/\0.*$/, "");
    if (name === field) at = { offset, length: dbf[p + 16] };
    offset += dbf[p + 16];
  }
  if (!at) throw new Error(`mare shapefile: no ${field} column`);
  for (let i = 0; i < count; i++) {
    const start = headerLength + i * recordLength + at.offset;
    names.push(dbf.toString("latin1", start, start + at.length).trim());
  }
  const shapes = [];
  for (let p = 100; p < shp.length; ) {
    const length = shp.readUInt32BE(p + 4) * 2;
    const body = p + 8;
    if (shp.readInt32LE(body) === 5) {
      const parts = shp.readInt32LE(body + 36), points = shp.readInt32LE(body + 40);
      const starts = Array.from({ length: parts }, (_, k) => shp.readInt32LE(body + 44 + k * 4));
      const xy = body + 44 + parts * 4;
      const rings = starts.map((s, k) => {
        const end = k + 1 < parts ? starts[k + 1] : points;
        const ring = new Float64Array((end - s) * 2);
        for (let j = s; j < end; j++) { ring[(j - s) * 2] = shp.readDoubleLE(xy + j * 16); ring[(j - s) * 2 + 1] = shp.readDoubleLE(xy + j * 16 + 8); }
        return ring;
      });
      shapes.push({ name: names[shapes.length] ?? "", rings });
    } else shapes.push({ name: names[shapes.length] ?? "", rings: [] });
    p = body + length;
  }
  return shapes;
}

/** Rasterises the polygons at pixel centres (even-odd rule, so holes stay empty). Value: index of the name + 1. */
function rasterise(shapes) {
  const names = [...new Set(shapes.map((s) => s.name || "Unnamed mare"))].sort();
  if (names.length > 254) throw new Error("mare shapefile: too many names for one byte");
  const raster = new Uint8Array(M_COLS * M_ROWS);
  for (const shape of shapes) {
    const value = names.indexOf(shape.name || "Unnamed mare") + 1;
    let south = 90, north = -90;
    for (const ring of shape.rings) for (let i = 1; i < ring.length; i += 2) { south = Math.min(south, ring[i]); north = Math.max(north, ring[i]); }
    const row0 = Math.max(0, Math.floor((90 - north) / M_DEG)), row1 = Math.min(M_ROWS - 1, Math.ceil((90 - south) / M_DEG));
    for (let row = row0; row <= row1; row++) {
      const lat = 90 - (row + 0.5) * M_DEG;
      const crossings = [];
      for (const ring of shape.rings) {
        for (let i = 0; i + 3 < ring.length; i += 2) {
          const x0 = ring[i], y0 = ring[i + 1], x1 = ring[i + 2], y1 = ring[i + 3];
          if ((y0 <= lat) !== (y1 <= lat)) crossings.push(x0 + ((lat - y0) / (y1 - y0)) * (x1 - x0));
        }
      }
      crossings.sort((a, b) => a - b);
      for (let k = 0; k + 1 < crossings.length; k += 2) {
        const c0 = Math.max(0, Math.ceil((crossings[k] + 180) / M_DEG - 0.5)), c1 = Math.min(M_COLS - 1, Math.floor((crossings[k + 1] + 180) / M_DEG - 0.5));
        for (let col = c0; col <= c1; col++) raster[row * M_COLS + col] = value;
      }
    }
  }
  return { names, raster };
}

/** Runs along the rows: value (1 byte), length (2 bytes, little-endian). */
function runLengths(raster) {
  const out = [];
  for (let i = 0; i < raster.length; ) {
    let j = i + 1;
    while (j < raster.length && raster[j] === raster[i] && j - i < 65535) j++;
    out.push(raster[i], (j - i) & 255, (j - i) >> 8);
    i = j;
  }
  return Buffer.from(out);
}

// --------------------------------------------------------------------- build

const REFERENCE = [
  ["Mare Tranquillitatis (maria profile: 0.30°, 3.5 m, 77 m)", 8.3355, 33.222],
  ["Descartes highlands (highlands profile: 2.22°, 20.6 m, 498 m)", -8.97, 15.5],
  ["Connecting Ridge (south-pole profile: 12.64°, 35.8 m, 3178 m, from the 40 m polar grid)", -89.45, -137.3],
];
const show = (t) => (t ? `slope ${t.slope.toFixed(3)}°, roughness ${t.roughness.toFixed(2)} m, relief ${Math.round(t.relief)} m` : "no measurement (window crosses the pole)");

if (process.argv[2] === "--check") {
  const file = readFileSync(OUT);
  const headerLength = file.readUInt32LE(4);
  const header = JSON.parse(file.toString("utf8", 8, 8 + headerLength));
  const count = header.terrain.cols * header.terrain.rows;
  const column = (k) => new Uint16Array(file.buffer.slice(file.byteOffset + 8 + headerLength + k * count * 2, file.byteOffset + 8 + headerLength + (k + 1) * count * 2));
  const [slope, roughness, relief] = [column(0), column(1), column(2)];
  for (const [name, lat, lon] of REFERENCE) {
    const row = Math.min(T_ROWS - 1, Math.floor((90 - lat) / T_DEG)), col = Math.floor((((lon + 180) % 360) + 360) % 360 / T_DEG);
    const i = row * T_COLS + col;
    log(`${name}\n  cell centre ${90 - (row + 0.5) * T_DEG}, ${-180 + (col + 0.5) * T_DEG}: ${slope[i] === NODATA ? "no measurement" : `slope ${slope[i] / SCALES.slope}°, roughness ${roughness[i] / SCALES.roughness} m, relief ${relief[i] / SCALES.relief} m`}`);
  }
} else {
  const dem = await ldem();
  log("Reference regions at their exact points, with this reader:");
  for (const [name, lat, lon] of REFERENCE) log(`  ${name}\n    ${show(moonTerrain(dem, lat, lon))}`);

  const count = T_COLS * T_ROWS;
  const columns = { slope: new Uint16Array(count).fill(NODATA), roughness: new Uint16Array(count).fill(NODATA), relief: new Uint16Array(count).fill(NODATA) };
  let missing = 0;
  const started = Date.now();
  for (let row = 0; row < T_ROWS; row++) {
    const lat = 90 - (row + 0.5) * T_DEG;
    for (let col = 0; col < T_COLS; col++) {
      const t = moonTerrain(dem, lat, -180 + (col + 0.5) * T_DEG);
      if (!t) { missing++; continue; }
      const i = row * T_COLS + col;
      for (const id in columns) columns[id][i] = Math.min(NODATA - 1, Math.round(t[id] * SCALES[id]));
    }
    if (row % 30 === 29) log(`  terrain: row ${row + 1} of ${T_ROWS} (${Math.round((Date.now() - started) / 1000)} s)`);
  }

  const shp = await cached(`${MARE}.SHP`, "bin", async () => (await http(`${MARE}.SHP`)).arrayBuffer());
  const dbf = await cached(`${MARE}.DBF`, "bin", async () => (await http(`${MARE}.DBF`)).arrayBuffer());
  const shapes = readShapes(shp, dbf, "MARE_NAME");
  const { names, raster } = rasterise(shapes);
  const runs = runLengths(raster);
  let marePixels = 0;
  for (const v of raster) if (v) marePixels++;

  const header = {
    version: 1,
    generated: new Date().toISOString().slice(0, 10),
    terrain: {
      cols: T_COLS, rows: T_ROWS, cellDegrees: T_DEG, fields: ["slope", "roughness", "relief"], scales: SCALES, nodata: NODATA, missing,
      windowKm: (N * CELL) / 1000, sampleMetres: CELL, source: "lola",
    },
    mare: { cols: M_COLS, rows: M_ROWS, cellDegrees: M_DEG, names, runs: runs.length / 3, latitudeLimit: 65, source: "lrocmare" },
    sources: {
      lola: { label: "LRO LOLA gridded elevation LDEM_64, 64 pixels per degree, 474 m (NASA PDS Geosciences)", url: `${PDS}/lro/lro-l-lola-3-rdr-v1/`, kind: "dataset" },
      lrocmare: { label: "LROC global mare boundaries, 65°N to 65°S, digitised at 1:200,000 to 1:500,000 (Nelson et al. 2014, LPSC 45, 2861)", url: "https://pds.lroc.asu.edu/data/LRO-L-LROC-5-RDR-V1.0/LROLRC_2001/EXTRAS/SHAPEFILE/LROC_GLOBAL_MARE/", kind: "dataset" },
    },
  };
  let json = Buffer.from(JSON.stringify(header));
  // Pad the header so the 16-bit columns start on an even byte.
  if (json.length % 2) json = Buffer.concat([json, Buffer.from(" ")]);
  const head = Buffer.alloc(8);
  head.write("AMON");
  head.writeUInt32LE(json.length, 4);
  const file = Buffer.concat([head, json, ...Object.values(columns).map((c) => Buffer.from(c.buffer)), runs]);
  await writeFile(OUT, file);
  log(`${OUT}: ${(file.length / 1e6).toFixed(2)} MB; ${count - missing} terrain cells (${missing} with no measurement), ${shapes.length} mare polygons, ${names.length} names, ${marePixels} mare pixels (${((marePixels / raster.length) * 100).toFixed(1)}% of the raster), ${runs.length / 3} runs`);
}
