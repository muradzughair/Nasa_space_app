// Shared by build-analogs.mjs and build-grid.mjs: the download cache, polite
// HTTP, and the terrain analysis grid that every world is measured on.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const CACHE = path.join(HERE, ".cache");

/** Local analysis grid shared by all three worlds: 71 x 71 cells of 450 m (about 32 km). */
export const CELL = 450;
export const N = 71;
export const HALF = (N * CELL) / 2;
export const RADIUS = { earth: 6_371_008, moon: 1_737_400, mars: 3_389_500 };
export const RAD = Math.PI / 180;

export const log = (message) => process.stdout.write(`${message}\n`);

// ------------------------------------------------------------------ fetching

export async function cached(key, ext, produce, dir = CACHE) {
  const file = path.join(dir, `${createHash("sha1").update(key).digest("hex").slice(0, 16)}.${ext}`);
  if (existsSync(file)) return readFile(file);
  const data = Buffer.from(await produce());
  await mkdir(dir, { recursive: true });
  await writeFile(file, data);
  return data;
}

export async function http(url, options = {}, tries = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(180_000) });
      // 404: no such tile (open ocean). 400: the ORNL service has no MODIS land product there (Antarctica).
      if (res.ok || res.status === 404 || res.status === 400) return res;
      throw new Error(`HTTP ${res.status}`);
    } catch (error) {
      if (attempt >= tries) throw new Error(`${url}: ${error.message}`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

/** Parsed JSON, or null where the service has no data for the request. */
export const getJson = async (url) =>
  JSON.parse(await cached(url, "json", async () => {
    const res = await http(url, { headers: { Accept: "application/json" } });
    return res.ok ? res.text() : "null";
  }));
export const getText = async (url) => String(await cached(url, "txt", async () => (await http(url)).text()));
export const getRange = (url, start, end) =>
  cached(`${url}#${start}-${end}`, "bin", async () => (await http(url, { headers: { Range: `bytes=${start}-${end}` } })).arrayBuffer());

/** Runs tasks a few at a time, to stay polite to shared public services. */
export async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

// ------------------------------------------------------------------- terrain

export const quantile = (sorted, q) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(q * (sorted.length - 1))))];
export const median = (values) => quantile([...values].sort((a, b) => a - b), 0.5);
export const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;

/**
 * Slope, roughness and relief of an N x N elevation grid with CELL spacing.
 *  - slope: median slope over a 900 m baseline (central differences)
 *  - roughness: RMS height difference from the local 2.25 km (5 x 5) mean
 *  - relief: 95th minus 5th percentile of elevation across the window
 */
export function terrainMetrics(z, minCoverage = 0.8) {
  const at = (r, c) => z[r * N + c];
  const slopes = [];
  const residuals = [];
  for (let r = 2; r < N - 2; r++) {
    for (let c = 2; c < N - 2; c++) {
      const dzdx = (at(r, c + 1) - at(r, c - 1)) / (2 * CELL);
      const dzdy = (at(r + 1, c) - at(r - 1, c)) / (2 * CELL);
      if (Number.isFinite(dzdx) && Number.isFinite(dzdy)) slopes.push(Math.atan(Math.hypot(dzdx, dzdy)) / RAD);
      let sum = 0;
      let count = 0;
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
        const v = at(r + i, c + j);
        if (Number.isFinite(v)) { sum += v; count++; }
      }
      if (count && Number.isFinite(at(r, c))) residuals.push((at(r, c) - sum / count) ** 2);
    }
  }
  const heights = [...z].filter(Number.isFinite).sort((a, b) => a - b);
  if (heights.length < z.length * minCoverage) throw new Error("elevation window mostly empty");
  return {
    slope: median(slopes),
    roughness: Math.sqrt(mean(residuals)),
    relief: quantile(heights, 0.95) - quantile(heights, 0.05),
    elevation: quantile(heights, 0.5),
    coverage: heights.length / z.length,
  };
}

/** Block-averages scattered samples (dx, dy in metres from the site) onto the analysis grid. */
export function gridder() {
  const sum = new Float64Array(N * N);
  const count = new Uint32Array(N * N);
  return {
    add(dx, dy, value) {
      const c = Math.floor((dx + HALF) / CELL);
      const r = Math.floor((HALF - dy) / CELL);
      if (c < 0 || c >= N || r < 0 || r >= N) return;
      sum[r * N + c] += value;
      count[r * N + c]++;
    },
    grid: () => Float64Array.from(sum, (s, i) => (count[i] ? s / count[i] : NaN)),
  };
}

/** File name of the Copernicus GLO-90 tile whose south-west corner is (lat, lon). */
export const copdemName = (lat, lon) =>
  `Copernicus_DSM_COG_30_${lat < 0 ? "S" : "N"}${String(Math.abs(lat)).padStart(2, "0")}_00_${lon < 0 ? "W" : "E"}${String(Math.abs(lon)).padStart(3, "0")}_00_DEM`;
export const copdemUrl = (lat, lon) => `https://copernicus-dem-90m.s3.amazonaws.com/${copdemName(lat, lon)}/${copdemName(lat, lon)}.tif`;
