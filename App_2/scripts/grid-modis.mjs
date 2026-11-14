// Global MODIS climate-modelling-grid products for the grid builder:
// MOD11C3 (monthly land surface temperature) and MOD13C2 (monthly NDVI),
// both 0.05°. LP DAAC serves them only to signed-in Earthdata users, so this
// needs EARTHDATA_TOKEN in the environment of the build script (never in the
// browser bundle: the name has no VITE_ prefix, so Vite ignores it).
//
// The files are HDF4; rather than parse that, each variable is requested
// whole from NASA's OPeNDAP service as a DAP4 binary response, reduced to
// 0.5° cell means, and only the reduced grid is cached.
import { cached, http, log } from "./common.mjs";

const CMR = "https://cmr.earthdata.nasa.gov/search/granules.json";
export const COLS = 720;
export const ROWS = 360;
const BLOCK = 10; // 0.05° pixels per 0.5° cell, each way

/** OPeNDAP addresses of the twelve monthly granules of a product for one year (CMR needs no login). */
async function granules(shortName, year) {
  const url = `${CMR}?short_name=${shortName}&version=061&temporal=${year}-01-01T00:00:00Z,${year}-12-31T23:59:59Z&page_size=50&sort_key=start_date`;
  const json = JSON.parse(await cached(url, "json", async () => (await http(url)).text()));
  const out = [];
  for (const entry of json.feed.entry) {
    const link = entry.links.find((l) => l.href.startsWith("https://opendap.earthdata.nasa.gov/"));
    if (link) out.push({ id: entry.producer_granule_id ?? entry.title, url: link.href });
  }
  if (out.length !== 12) throw new Error(`${shortName} ${year}: expected 12 monthly granules, CMR lists ${out.length}`);
  return out;
}

async function authed(url, token) {
  for (let attempt = 1; ; attempt++) {
    let res;
    try {
      res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, redirect: "manual", signal: AbortSignal.timeout(600_000) });
    } catch (error) {
      if (attempt >= 4) throw new Error(`${url}: ${error.message}`);
      await new Promise((r) => setTimeout(r, 3000 * attempt));
      continue;
    }
    if (res.ok) return res;
    // A redirect to the sign-in page means the token was not accepted.
    if (res.status === 401 || res.status === 403 || (res.status >= 300 && res.status < 400)) {
      throw new Error("Earthdata did not accept EARTHDATA_TOKEN (expired or mistyped?). Generate a new one at https://urs.earthdata.nasa.gov/ under 'Generate Token'.");
    }
    if (attempt >= 4) throw new Error(`${url}: HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 3000 * attempt));
  }
}

/** Full DAP4 path and element type of a variable, found by its name in the dataset's DMR document. */
function findVariable(dmr, name) {
  const groups = [];
  for (const m of dmr.matchAll(/<(\/?)(Group|U?Int(?:8|16|32)|Float(?:32|64)|Byte)\b([^>]*?)(\/?)>/g)) {
    const [, closing, tag, attrs, selfClosing] = m;
    if (tag === "Group") {
      if (closing) groups.pop();
      else if (!selfClosing) groups.push(/name="([^"]*)"/.exec(attrs)?.[1] ?? "");
    } else if (!closing && /name="([^"]*)"/.exec(attrs)?.[1] === name) {
      return { path: `/${[...groups, name].join("/")}`, type: tag };
    }
  }
  throw new Error(`OPeNDAP: no variable ${name} in the dataset description`);
}

/** Strips the DAP4 chunk framing and returns the data bytes that follow the leading DMR chunk. */
export function dap4Payload(buffer) {
  const parts = [];
  let offset = 0;
  let first = true;
  let littleEndian = true;
  while (offset + 4 <= buffer.length) {
    const flags = buffer[offset];
    const size = buffer.readUIntBE(offset + 1, 3);
    offset += 4;
    if (flags & 2) throw new Error(`OPeNDAP error: ${buffer.subarray(offset, offset + size).toString().slice(0, 300)}`);
    if (first) {
      first = false; // the DMR
      littleEndian = (flags & 4) !== 0;
    } else {
      parts.push(buffer.subarray(offset, offset + size));
    }
    offset += size;
    if (flags & 1) break;
  }
  if (!littleEndian) throw new Error("OPeNDAP sent big-endian data, which this reader does not handle");
  return Buffer.concat(parts);
}

/**
 * One 0.05° variable of one granule, as per-cell sums and counts of its
 * valid pixels on the 0.5° grid (rows from the north, columns from 180°W).
 */
async function cellMeans(granule, variable, token, valid, scale) {
  const key = `modis-cmg:v1:${granule.id}:${variable}`;
  const raw = await cached(key, "f32", async () => {
    const dmr = await (await authed(`${granule.url}.dmr.xml`, token)).text();
    const { path, type } = findVariable(dmr, variable);
    const res = await authed(`${granule.url}.dap?dap4.ce=${encodeURIComponent(path)}`, token);
    const payload = dap4Payload(Buffer.from(await res.arrayBuffer()));
    const width = COLS * BLOCK, height = ROWS * BLOCK;
    if (payload.length < width * height * 2) throw new Error(`${granule.id} ${variable}: ${payload.length} bytes, expected ${width * height * 2}`);
    const read = type === "UInt16" ? (i) => payload.readUInt16LE(i * 2) : (i) => payload.readInt16LE(i * 2);
    const out = new Float32Array(COLS * ROWS).fill(NaN);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let sum = 0, count = 0;
        for (let y = r * BLOCK; y < (r + 1) * BLOCK; y++) {
          for (let x = c * BLOCK; x < (c + 1) * BLOCK; x++) {
            const v = read(y * width + x);
            if (valid(v)) { sum += v; count++; }
          }
        }
        // At least a tenth of the cell must have data for the mean to stand for it.
        if (count >= 10) out[r * COLS + c] = (sum / count) * scale;
      }
    }
    log(`    ${granule.id} ${variable}`);
    return out.buffer;
  });
  return new Float32Array(raw.buffer, raw.byteOffset, COLS * ROWS);
}

/**
 * Per-cell thermal and vegetation values for one year, or null without a
 * token. tmean: mean of the monthly day and night means. tmax: warmest
 * monthly day mean. ndvi: 90th percentile of the monthly NDVI (the growing
 * season, as for the curated sites). swing: mean monthly day temperature
 * minus mean monthly night temperature.
 */
export async function modisGrid(year, token) {
  if (!token) return null;
  const lstGranules = await granules("MOD11C3", year);
  const ndviGranules = await granules("MOD13C2", year);
  const tmean = new Float32Array(COLS * ROWS).fill(NaN), tmax = new Float32Array(COLS * ROWS).fill(NaN), ndvi = new Float32Array(COLS * ROWS).fill(NaN), swing = new Float32Array(COLS * ROWS).fill(NaN);
  const day = [], night = [], veg = [];
  // One month at a time: each response is about 50 MB.
  for (const g of lstGranules) {
    day.push(await cellMeans(g, "LST_Day_CMG", token, (v) => v >= 7500, 0.02));
    night.push(await cellMeans(g, "LST_Night_CMG", token, (v) => v >= 7500, 0.02));
  }
  for (const g of ndviGranules) veg.push(await cellMeans(g, "CMG_0_05_Deg_Monthly_NDVI", token, (v) => v > -3000, 0.0001));
  for (let i = 0; i < COLS * ROWS; i++) {
    const d = day.map((m) => m[i]).filter(Number.isFinite), n = night.map((m) => m[i]).filter(Number.isFinite);
    // The curated sites need 8 composites of each; for monthly data, at least 4 of the 12 months.
    if (d.length >= 4 && n.length >= 4) {
      tmean[i] = (d.reduce((a, b) => a + b, 0) / d.length + n.reduce((a, b) => a + b, 0) / n.length) / 2;
      tmax[i] = Math.max(...d);
      swing[i] = d.reduce((a, b) => a + b, 0) / d.length - n.reduce((a, b) => a + b, 0) / n.length;
    }
    const v = veg.map((m) => m[i]).filter(Number.isFinite).sort((a, b) => a - b);
    if (v.length >= 3) ndvi[i] = v[Math.min(v.length - 1, Math.round(0.9 * (v.length - 1)))];
  }
  return { tmean, tmax, ndvi, swing };
}
