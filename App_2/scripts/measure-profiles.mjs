// Terrain statistics of the reference region of each Mars and Moon profile,
// on the same 32 km window of 450 m cells as every Earth cell. Prints the
// numbers that src/analog/scoring.ts carries in PROFILES[].terrain.
//
//   node scripts/measure-profiles.mjs
//
// Jezero, Arcadia, the Mare Tranquillitatis pit and the lunar south pole are
// measured by build-analogs.mjs (public/data/analogs.json, targets[].m).
import { CELL, getRange, HALF, log, N, RAD, RADIUS, terrainMetrics } from "./common.mjs";

const PDS = "https://pds-geosciences.wustl.edu";
// MEGDR tiles are 44° of latitude by 90° of longitude, named by their north and west edges.
const MOLA = (tile, north, west) => ({ url: `${PDS}/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg128/${tile}.img`, north, west, ppd: 128, width: 11520, littleEndian: false, scale: 1 });
const LOLA = { url: `${PDS}/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/cylindrical/img/ldem_64.img`, north: 90, west: 0, ppd: 64, width: 23040, littleEndian: true, scale: 0.5 };

const PLACES = [
  { id: "mars-modern", body: "mars", name: "Gale crater floor (Curiosity, Rocknest)", lat: -4.59, lon: 137.44, spec: MOLA("megt00n090hb", 0, 90) },
  { id: "mars-sulfate", body: "mars", name: "Meridiani Planum (Opportunity)", lat: -1.95, lon: -5.53, spec: MOLA("megt00n270hb", 0, 270) },
  { id: "mars-volcanic", body: "mars", name: "Daedalia Planum lava plains", lat: -22.0, lon: -122.0, spec: MOLA("megt00n180hb", 0, 180) },
  { id: "moon-highlands", body: "moon", name: "Descartes highlands (Apollo 16)", lat: -8.97, lon: 15.5, spec: LOLA },
];

/** Same reader as planetTerrain() in build-analogs.mjs. */
async function planetTerrain(target, spec) {
  const R = RADIUS[target.body];
  const lon = ((target.lon - spec.west) % 360 + 360) % 360 + spec.west;
  const dLat = (HALF + 2 * CELL) / (R * RAD);
  const row0 = Math.floor((spec.north - (target.lat + dLat)) * spec.ppd);
  const row1 = Math.ceil((spec.north - (target.lat - dLat)) * spec.ppd);
  const rowBytes = spec.width * 2;
  const buffer = await getRange(spec.url, row0 * rowBytes, (row1 + 1) * rowBytes - 1);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const sample = (row, col) => view.getInt16(((row - row0) * spec.width + col) * 2, spec.littleEndian) * spec.scale;
  const z = new Float64Array(N * N);
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const la = target.lat + (HALF - (r + 0.5) * CELL) / (R * RAD);
      const lo = lon + ((c + 0.5) * CELL - HALF) / (R * RAD * Math.cos(target.lat * RAD));
      const y = (spec.north - la) * spec.ppd - 0.5;
      const x = (lo - spec.west) * spec.ppd - 0.5;
      const yi = Math.floor(y), xi = Math.floor(x), fy = y - yi, fx = x - xi;
      z[r * N + c] =
        sample(yi, xi) * (1 - fx) * (1 - fy) + sample(yi, xi + 1) * fx * (1 - fy) +
        sample(yi + 1, xi) * (1 - fx) * fy + sample(yi + 1, xi + 1) * fx * fy;
    }
  }
  return terrainMetrics(z);
}

for (const place of PLACES) {
  const t = await planetTerrain(place, place.spec);
  log(`${place.id.padEnd(15)} ${place.name}: slope ${t.slope.toFixed(3)}°, roughness ${t.roughness.toFixed(2)} m, relief ${Math.round(t.relief)} m, elevation ${Math.round(t.elevation)} m`);
}
