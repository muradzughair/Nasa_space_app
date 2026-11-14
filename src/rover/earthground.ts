/**
 * The ground of any Earth point, cut when the simulator is opened: a 2 km
 * patch and a 10 km context ring from the Copernicus DEM, put on a local
 * metric grid centred on the point (x east, z south, north up).
 *
 * This is the old project's pipeline/fetch_windows.py (build_site), run in
 * the browser for one point instead of at build time. The same constants
 * and the same rules: a 513 x 513 fine grid over 2 km when the source is
 * coarser than 3 m; below about two source pixels the surface is the
 * straight-line interpolation of the source plus a bounded, labelled
 * synthetic part (a rounded interpolation and fractal detail, never more
 * than 0.45 m from the source); a 161 x 161 ring over 10 km at 62.5 m whose
 * centre is replaced by the patch so the seam is closed. What differs from
 * the Python is listed in README ("What had to change").
 *
 * Source, in order: Copernicus GLO-30 Cloud Optimized GeoTIFFs on Microsoft
 * Planetary Computer (keyless token, CORS allowed); the OpenTopography copy
 * of GLO-30 if Planetary Computer cannot be reached; GLO-90 where GLO-30 has
 * no public tile (Armenia, Azerbaijan). The AWS copy of the same files sends
 * no CORS header, so a web page cannot read it.
 */
import { type CogFile, cogTile, NoTileError, openCog, tilesAcross } from "./cog";
import { hashStr, mulberry32 } from "./terrain.js";

export const PATCH_M = 2000;
export const CTX_M = 10000;
export const CTX_N = 161;
export const COARSE_N = 129;
const R_EARTH = 6371008.8;
const DEG = Math.PI / 180;

// ------------------------------------------------------------------ local metric grid (azimuthal equidistant on a sphere, as in fetch_windows.py)
/** Metres east and north of the centre -> longitude, latitude in degrees. */
export function localToLonLat(lat0: number, lon0: number, east: number, north: number): [number, number] {
  const p0 = lat0 * DEG, l0 = lon0 * DEG, rho = Math.hypot(east, north), c = rho / R_EARTH;
  const lat = Math.asin(Math.min(1, Math.max(-1, Math.cos(c) * Math.sin(p0) + (rho > 0 ? (north * Math.sin(c) * Math.cos(p0)) / rho : 0))));
  const lon = rho > 0 ? l0 + Math.atan2(east * Math.sin(c), rho * Math.cos(p0) * Math.cos(c) - north * Math.sin(p0) * Math.sin(c)) : l0;
  return [((((lon / DEG + 180) % 360) + 360) % 360) - 180, lat / DEG];
}
/** Patch coordinates (x east from the west edge, z south from the north edge, metres) of a square of side `size` -> longitude, latitude. */
export const patchToLonLat = (lat0: number, lon0: number, size: number, x: number, z: number) => localToLonLat(lat0, lon0, x - size / 2, size / 2 - z);

// ------------------------------------------------------------------ elevation sources
interface SourceSpec {
  id: string;
  label: string;
  /** Spacing of rows in degrees (1 or 3 arc-seconds). */
  dLat: number;
  /** The resolution figure the old pipeline used for this source (Glo30.res_at returned 30.0). */
  resM: number;
  file(la: number, lo: number, token: string): string;
}
const tileName = (prefix: string, la: number, lo: number) =>
  `${prefix}_${la >= 0 ? "N" : "S"}${String(Math.abs(la)).padStart(2, "0")}_00_${lo >= 0 ? "E" : "W"}${String(Math.abs(lo)).padStart(3, "0")}_00_DEM`;
const PC_BLOB = "https://elevationeuwest.blob.core.windows.net/copernicus-dem";
const SOURCES: Record<string, SourceSpec> = {
  "glo30-pc": { id: "glo30-pc", label: "Copernicus DEM GLO-30 (Microsoft Planetary Computer)", dLat: 1 / 3600, resM: 30, file: (la, lo, t) => `${PC_BLOB}/COP30_hh/${tileName("Copernicus_DSM_COG_10", la, lo)}.tif?${t}` },
  "glo30-ot": { id: "glo30-ot", label: "Copernicus DEM GLO-30 (OpenTopography copy)", dLat: 1 / 3600, resM: 30, file: (la, lo) => `https://opentopography.s3.sdsc.edu/raster/COP30/COP30_hh/${tileName("Copernicus_DSM_10", la, lo)}.tif` },
  "glo90-pc": { id: "glo90-pc", label: "Copernicus DEM GLO-90 (Microsoft Planetary Computer)", dLat: 1 / 1200, resM: 90, file: (la, lo, t) => `${PC_BLOB}/COP90_hh/${tileName("Copernicus_DSM_COG_30", la, lo)}.tif?${t}` },
};

let token: { value: string; expires: number } | null = null;
async function pcToken(signal?: AbortSignal): Promise<string> {
  if (token && token.expires > Date.now() + 120_000) return token.value;
  const res = await fetch("https://planetarycomputer.microsoft.com/api/sas/v1/token/elevationeuwest/copernicus-dem", { signal });
  if (!res.ok) throw new Error(`Planetary Computer token: HTTP ${res.status}`);
  const j = (await res.json()) as { token: string; "msft:expiry"?: string };
  token = { value: j.token, expires: j["msft:expiry"] ? Date.parse(j["msft:expiry"]) : Date.now() + 3_600_000 };
  return token.value;
}

/** One elevation source over the tiles a window needs. sample() is synchronous once prefetch() has loaded the tiles. */
class Dem {
  readonly files = new Map<string, CogFile | null>();
  readonly data = new Map<string, Float32Array>();
  readonly spec: SourceSpec;
  private readonly tok: string;
  constructor(spec: SourceSpec, tok: string) {
    this.spec = spec;
    this.tok = tok;
  }
  bytes() {
    let b = 0;
    for (const f of this.files.values()) if (f) b += f.bytes;
    return b;
  }
  private key = (la: number, lo: number) => `${la},${lo}`;
  async openFile(la: number, lo: number, signal?: AbortSignal): Promise<CogFile | null> {
    const k = this.key(la, lo);
    if (this.files.has(k)) return this.files.get(k)!;
    let f: CogFile | null = null;
    try {
      f = await openCog(this.spec.file(la, lo, this.tok), signal);
    } catch (e) {
      if (!(e instanceof NoTileError)) throw e;
    }
    this.files.set(k, f);
    return f;
  }
  /** Loads every tile covering the latitude/longitude box (plus one source pixel all round). */
  async prefetch(south: number, north: number, west: number, east: number, signal?: AbortSignal) {
    const pad = 2 * this.spec.dLat;
    const jobs: Promise<void>[] = [];
    for (let la = Math.floor(south - pad); la <= Math.floor(north + pad); la++) {
      for (let lo = Math.floor(west - 10 * pad); lo <= Math.floor(east + 10 * pad); lo++) {
        const loW = ((((lo + 180) % 360) + 360) % 360) - 180;
        jobs.push(
          this.openFile(la, loW, signal).then(async (f) => {
            if (!f) return;
            const r0 = Math.max(0, Math.floor((f.lat0 - (north + pad)) / f.dLat)), r1 = Math.min(f.height - 1, Math.ceil((f.lat0 - (south - pad)) / f.dLat));
            const w = ((((west - 10 * pad - f.lon0 + 180) % 360) + 360) % 360) - 180, e = w + (east - west) + 20 * pad;
            const c0 = Math.max(0, Math.floor(w / f.dLon)), c1 = Math.min(f.width - 1, Math.ceil(e / f.dLon));
            if (r0 > r1 || c0 > c1) return;
            const across = tilesAcross(f), loads: Promise<void>[] = [];
            for (let ti = Math.floor(r0 / f.tileH); ti <= Math.floor(r1 / f.tileH); ti++) {
              for (let tj = Math.floor(c0 / f.tileW); tj <= Math.floor(c1 / f.tileW); tj++) {
                const k = ti * across + tj, key = `${this.key(la, loW)}#${k}`;
                if (!this.data.has(key)) loads.push(cogTile(f, k, signal).then((d) => void this.data.set(key, d)));
              }
            }
            await Promise.all(loads);
          }),
        );
      }
    }
    await Promise.all(jobs);
  }
  /** Height of pixel (row, col) of the file of tile (la, lo); NaN where there is no file, no loaded tile or no data. */
  private pixel(la: number, lo: number, row: number, col: number): number {
    const f = this.files.get(this.key(la, lo));
    if (!f || row < 0 || col < 0 || row >= f.height) return NaN;
    if (col >= f.width) {
      // the column east of the last one is the first column of the next tile
      const loE = lo + 1 >= 180 ? -180 : lo + 1;
      const g = this.files.get(this.key(la, loE));
      if (!g) return NaN;
      return this.pixelOf(g, la, loE, Math.round((g.lat0 - (f.lat0 - row * f.dLat)) / g.dLat), col - f.width);
    }
    return this.pixelOf(f, la, lo, row, col);
  }
  private pixelOf(f: CogFile, la: number, lo: number, row: number, col: number): number {
    if (row < 0 || row >= f.height || col < 0 || col >= f.width) return NaN;
    const k = Math.floor(row / f.tileH) * tilesAcross(f) + Math.floor(col / f.tileW);
    const d = this.data.get(`${this.key(la, lo)}#${k}`);
    if (!d) return NaN;
    const v = d[(row % f.tileH) * f.tileW + (col % f.tileW)];
    return Number.isFinite(v) && v > -1000 && v < 9000 ? v : NaN;
  }
  /** Linear interpolation along one row of pixels (a row is a line of constant latitude). */
  private along(rowLat: number, lon: number): number {
    // the tile holding a row at latitude L: its north edge is the first integer above L (row 0 of a tile is its north edge)
    const la = Math.ceil(rowLat - 1e-9) - 1, lo = Math.floor(lon);
    const f = this.files.get(this.key(la, lo));
    if (!f) return NaN;
    const row = Math.round((f.lat0 - rowLat) / f.dLat), fx = (lon - f.lon0) / f.dLon, j = Math.floor(fx), t = fx - j;
    const a = this.pixel(la, lo, row, j);
    if (t < 1e-9) return a;
    const b = this.pixel(la, lo, row, j + 1);
    return a * (1 - t) + b * t;
  }
  /** Bilinear height at a longitude and latitude, from the four surrounding source pixels (NaN if any is missing). */
  sample(lon: number, lat: number): number {
    const d = this.spec.dLat, r = Math.floor((90 - lat) / d + 1e-9), latA = 90 - r * d, t = (latA - lat) / d;
    const a = this.along(latA, lon);
    if (t < 1e-9) return a;
    return a * (1 - t) + this.along(latA - d, lon) * t;
  }
  /** Spacing of columns at this latitude, in degrees (Copernicus widens it towards the poles). */
  lonSpacing(lat: number, lon: number): number | null {
    const f = this.files.get(this.key(Math.ceil(lat - 1e-9) - 1, Math.floor(lon))) ?? [...this.files.values()].find((x) => x);
    return f ? f.dLon : null;
  }
}

// ------------------------------------------------------------------ small numeric helpers (numpy / scipy equivalents)
function percentile(sorted: Float64Array, q: number): number {
  const p = (q / 100) * (sorted.length - 1), i = Math.floor(p), t = p - i;
  return i + 1 < sorted.length ? sorted[i] * (1 - t) + sorted[i + 1] * t : sorted[i];
}
/** Every invalid node takes the value of the nearest valid one (breadth first, 8-connected). */
function fillInvalid(h: Float32Array, ok: Uint8Array, n: number) {
  let front: number[] = [];
  for (let i = 0; i < h.length; i++) if (ok[i]) front.push(i);
  if (front.length === h.length || !front.length) return;
  const seen = Uint8Array.from(ok);
  while (front.length) {
    const next: number[] = [];
    for (const k of front) {
      const i = (k / n) | 0, j = k % n;
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
        const a = i + di, b = j + dj;
        if (a < 0 || b < 0 || a >= n || b >= n) continue;
        const q = a * n + b;
        if (!seen[q]) { seen[q] = 1; h[q] = h[k]; next.push(q); }
      }
    }
    front = next;
  }
}
/** In-place radix-2 FFT of one line (re, im of length N, a power of two). */
function fft1(re: Float64Array, im: Float64Array, inverse: boolean) {
  const N = re.length;
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = ((inverse ? 2 : -2) * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < N; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2, tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}
function fft2(re: Float64Array, im: Float64Array, N: number, inverse: boolean) {
  const lr = new Float64Array(N), li = new Float64Array(N);
  for (let i = 0; i < N; i++) { lr.set(re.subarray(i * N, i * N + N)); li.set(im.subarray(i * N, i * N + N)); fft1(lr, li, inverse); re.set(lr, i * N); im.set(li, i * N); }
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) { lr[i] = re[i * N + j]; li[i] = im[i * N + j]; }
    fft1(lr, li, inverse);
    for (let i = 0; i < N; i++) { re[i * N + j] = lr[i]; im[i * N + j] = li[i]; }
  }
}
/**
 * fbm() of fetch_windows.py: band-limited fractal noise, unit rms, wavelengths between lo and hi grid cells, spectrum k^-1.8, fixed seed.
 * Generated on a periodic 512 x 512 field (a power of two for the FFT) and read with wrap-around for the 513th row and column.
 */
function fbm(n: number, seed: number, lo: number, hi: number): Float32Array {
  const N = 512, rnd = mulberry32(seed), re = new Float64Array(N * N), im = new Float64Array(N * N);
  for (let i = 0; i < N * N; i += 2) {
    const u = Math.max(1e-12, rnd()), v = rnd(), r = Math.sqrt(-2 * Math.log(u));
    re[i] = r * Math.cos(2 * Math.PI * v); re[i + 1] = r * Math.sin(2 * Math.PI * v);
  }
  fft2(re, im, N, false);
  const freq = (k: number) => (k < N / 2 ? k : k - N) / N;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const k = Math.hypot(freq(i), freq(j)) || 1, q = i * N + j, w = k >= 1 / hi && k <= 1 / lo ? Math.pow(k, -1.8) : 0;
    re[q] *= w; im[q] *= w;
  }
  fft2(re, im, N, true);
  const out = new Float32Array(n * n);
  let s = 0, s2 = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = re[(i % N) * N + (j % N)]; out[i * n + j] = v; s += v; s2 += v * v; }
  const m = s / out.length, sd = Math.sqrt(Math.max(0, s2 / out.length - m * m)) + 1e-12;
  for (let i = 0; i < out.length; i++) out[i] /= sd;
  return out;
}
/** Cubic B-spline coefficients of a grid (scipy's spline prefilter, mirror boundary), in place, rows then columns. */
function splineFilter(c: Float64Array, n: number) {
  const z = Math.sqrt(3) - 2, line = new Float64Array(n);
  const run = () => {
    for (let k = 0; k < n; k++) line[k] *= 6;
    let s = line[0], zk = z;
    for (let k = 1; k < Math.min(n, 30); k++) { s += zk * line[k]; zk *= z; }
    line[0] = s;
    for (let k = 1; k < n; k++) line[k] += z * line[k - 1];
    line[n - 1] = (z / (z * z - 1)) * (line[n - 1] + z * line[n - 2]);
    for (let k = n - 2; k >= 0; k--) line[k] = z * (line[k + 1] - line[k]);
  };
  for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) line[j] = c[i * n + j]; run(); for (let j = 0; j < n; j++) c[i * n + j] = line[j]; }
  for (let j = 0; j < n; j++) { for (let i = 0; i < n; i++) line[i] = c[i * n + j]; run(); for (let i = 0; i < n; i++) c[i * n + j] = line[i]; }
}
const bspline = (t: number) => { const a = Math.abs(t); return a < 1 ? 2 / 3 - a * a + (a * a * a) / 2 : a < 2 ? Math.pow(2 - a, 3) / 6 : 0; };

// ------------------------------------------------------------------ the ground
export interface GroundProvenance {
  elevation_source: string;
  elevation_source_id: string;
  /** The figure the old pipeline used for the source (30 m for GLO-30), and the true spacings here. */
  elevation_resolution_m: number;
  spacing_ns_m: number;
  spacing_ew_m: number | null;
  imagery_source: string;
  imagery_resolution_m: number | null;
  synthetic_fine: boolean;
  fine_detail_rms_m: number;
  date_built: string;
  site_center: [number, number];
  /** Absolute height (metres, EGM2008) of the lowest point of the patch: every height of the ground is measured from it. */
  hmin: number;
  datum: string;
  valid: number;
  ctx: { n: number; size_m: number; src: string; valid: number };
  /** Share of the patch at exactly 0 m in the DEM (the sea, and some water bodies, are flattened to 0 m). */
  sea_frac: number;
  missing: string[];
  licence: string[];
  bytes: number;
  ms: number;
  /** Heights read straight from the source at random points of the patch (for the ground check). */
  truth: { x: number; z: number; lon: number; lat: number; h: number }[];
}

export interface EarthGroundData {
  fine: { M: number; h: Float32Array; size: number };
  ctx: { n: number; h: Float32Array; size: number };
  prov: GroundProvenance;
}

export class GroundUnavailable extends Error {}

const now = () => performance.now();

async function openDem(lat: number, lon: number, signal: AbortSignal | undefined, status: (s: string) => void): Promise<{ dem: Dem; notes: string[] }> {
  const notes: string[] = [];
  const la = Math.floor(lat), lo = Math.floor(lon);
  let tok = "";
  try {
    tok = await pcToken(signal);
  } catch (e) {
    notes.push(`Planetary Computer did not answer (${(e as Error).message}); the OpenTopography copy of GLO-30 is used.`);
  }
  if (tok) {
    const dem = new Dem(SOURCES["glo30-pc"], tok);
    status("Reading the Copernicus GLO-30 tile");
    try {
      if (await dem.openFile(la, lo, signal)) return { dem, notes };
      // No public GLO-30 tile here (the sea, or Armenia and Azerbaijan): GLO-90 covers both of those.
      const d90 = new Dem(SOURCES["glo90-pc"], tok);
      if (await d90.openFile(la, lo, signal)) {
        notes.push("GLO-30 has no public tile here; GLO-90 (3 arc-seconds) is used.");
        return { dem: d90, notes };
      }
      throw new GroundUnavailable("The Copernicus DEM has no land tile here: open sea, so there is no ground to drive on.");
    } catch (e) {
      if (e instanceof GroundUnavailable || (e as Error).name === "AbortError") throw e;
      notes.push(`Planetary Computer failed (${(e as Error).message}); the OpenTopography copy of GLO-30 is used.`);
    }
  }
  const ot = new Dem(SOURCES["glo30-ot"], "");
  if (await ot.openFile(la, lo, signal)) return { dem: ot, notes };
  throw new GroundUnavailable("No elevation tile could be read for this point (Planetary Computer and OpenTopography).");
}

/**
 * Builds the ground of a point. Rejects with GroundUnavailable (and a reason
 * in plain words) where there is no usable elevation: open sea, a tile
 * missing from every source, or a patch that is mostly without data.
 */
export async function buildEarthGround(id: string, lat0: number, lon0: number, signal?: AbortSignal, status: (s: string) => void = () => {}): Promise<EarthGroundData> {
  const t0 = now();
  const { dem, notes } = await openDem(lat0, lon0, signal, status);
  const missing = [...notes];
  // the box that holds the 10 km ring (its corners are about 7.1 km from the centre)
  const corners = [[-1, -1], [-1, 1], [1, -1], [1, 1], [0, 1], [0, -1], [1, 0], [-1, 0]].map(([a, b]) => localToLonLat(lat0, lon0, (a * CTX_M) / 2, (b * CTX_M) / 2));
  const lats = corners.map((c) => c[1]), lonsRel = corners.map((c) => ((((c[0] - lon0 + 540) % 360) + 360) % 360) - 180);
  status("Downloading elevation tiles");
  await dem.prefetch(Math.min(...lats), Math.max(...lats), lon0 + Math.min(...lonsRel), lon0 + Math.max(...lonsRel), signal);
  status("Building the ground");
  const res = dem.spec.resM;

  // ---- fine patch (probe_elev)
  const n = res <= 1.5 ? 2049 : res <= 3 ? 1025 : 513, dx = PATCH_M / (n - 1);
  const h = new Float32Array(n * n), ok = new Uint8Array(n * n);
  let zeros = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const [lon, lat] = patchToLonLat(lat0, lon0, PATCH_M, j * dx, i * dx), v = dem.sample(lon, lat), k = i * n + j;
    if (Number.isFinite(v)) { h[k] = v; ok[k] = 1; if (v === 0) zeros++; }
  }
  let nOk = ok.reduce((a, b) => a + b, 0);
  const seaFrac = zeros / (n * n);
  if (nOk / (n * n) < 0.6) throw new GroundUnavailable(`Only ${Math.round((100 * nOk) / (n * n))} % of the 2 km patch has elevation data here, so it cannot be simulated.`);
  if (seaFrac > 0.5) throw new GroundUnavailable(`${Math.round(100 * seaFrac)} % of the 2 km patch is at exactly 0 m in the DEM, where it flattens the sea: this is open water, not ground.`);
  {
    const vals = new Float64Array(nOk);
    let q = 0;
    for (let k = 0; k < h.length; k++) if (ok[k]) vals[q++] = h[k];
    vals.sort();
    const lo = percentile(vals, 0.5), md = percentile(vals, 50), hi = percentile(vals, 99.5);
    let bad = 0;
    for (let k = 0; k < h.length; k++) if (ok[k] && Math.abs(h[k] - md) > 6 * (hi - lo) + 50) { ok[k] = 0; bad++; }
    if (bad) missing.push(`${bad} outlier samples removed and filled from their neighbours`);
    nOk -= bad;
  }
  const validFrac = nOk / (n * n);
  fillInvalid(h, ok, n);
  if (validFrac < 0.999) missing.push(`elevation: ${(100 * (1 - validFrac)).toFixed(1)} % of the patch had no data and was filled from the nearest data`);
  if (seaFrac > 0.02) missing.push(`${Math.round(100 * seaFrac)} % of the patch is at exactly 0 m in the DEM (sea or water flattened by the DEM)`);

  // truth points: the source itself at random points of the patch (make_truth)
  const rt = mulberry32(hashStr(id + "|truth")), truth: GroundProvenance["truth"] = [];
  for (let k = 0; k < 48; k++) {
    const x = 40 + rt() * (PATCH_M - 80), z = 40 + rt() * (PATCH_M - 80), [lon, lat] = patchToLonLat(lat0, lon0, PATCH_M, x, z), v = dem.sample(lon, lat);
    if (Number.isFinite(v)) truth.push({ x, z, lon, lat, h: v });
  }

  const syntheticFine = res > 5.0;
  let amp = 0;
  if (syntheticFine) {
    // rounded interpolation plus fractal detail below about two source pixels, both bounded (never more than 0.45 m from the source)
    const ns = Math.max(8, Math.round(PATCH_M / res) + 1), dxs = PATCH_M / (ns - 1), hc = new Float32Array(ns * ns), okc = new Uint8Array(ns * ns);
    for (let i = 0; i < ns; i++) for (let j = 0; j < ns; j++) {
      const [lon, lat] = patchToLonLat(lat0, lon0, PATCH_M, j * dxs, i * dxs), v = dem.sample(lon, lat);
      if (Number.isFinite(v)) { hc[i * ns + j] = v; okc[i * ns + j] = 1; }
    }
    fillInvalid(hc, okc, ns);
    const coef = Float64Array.from(hc);
    splineFilter(coef, ns);
    const cl = (k: number) => Math.max(0, Math.min(ns - 1, k)), c = (k: number) => (k * (ns - 1)) / (n - 1);
    const diffs = new Float64Array(ns * (ns - 1));
    for (let i = 0, q = 0; i < ns; i++) for (let j = 0; j < ns - 1; j++) diffs[q++] = Math.abs(hc[i * ns + j + 1] - hc[i * ns + j]);
    diffs.sort();
    const sig = ns > 2 ? percentile(diffs, 50) : 0.5;
    amp = Math.min(0.07, Math.max(0.03, 0.05 * sig));
    const cells = res / dx;
    const detail = fbm(n, hashStr(id), 2.0, Math.max(4.0, 2 * cells));
    for (let i = 0; i < n; i++) {
      const y = c(i), iy = Math.floor(y), ty = y - iy;
      for (let j = 0; j < n; j++) {
        const x = c(j), ix = Math.floor(x), tx = x - ix;
        let cub = 0;
        for (let a = -1; a <= 2; a++) { const wy = bspline(ty - a); if (!wy) continue; for (let b = -1; b <= 2; b++) { const wx = bspline(tx - b); if (wx) cub += wy * wx * coef[cl(iy + a) * ns + cl(ix + b)]; } }
        const i1 = cl(iy + 1), j1 = cl(ix + 1), i0 = cl(iy), j0 = cl(ix);
        const lin = hc[i0 * ns + j0] * (1 - tx) * (1 - ty) + hc[i0 * ns + j1] * tx * (1 - ty) + hc[i1 * ns + j0] * (1 - tx) * ty + hc[i1 * ns + j1] * tx * ty;
        const k = i * n + j;
        h[k] = h[k] + Math.max(-0.25, Math.min(0.25, cub - lin)) + Math.max(-0.2, Math.min(0.2, amp * detail[k]));
      }
    }
  }

  // ---- context ring: 161 x 161 at 62.5 m, the source averaged over about dec x dec pixels (out_res_m = 62.5 m in the pipeline)
  const cdx = CTX_M / (CTX_N - 1), dec = Math.max(1, Math.floor(cdx / res + 1e-6)), hC = new Float32Array(CTX_N * CTX_N), okC = new Uint8Array(CTX_N * CTX_N);
  const offs: number[] = [];
  for (let a = 0; a < dec; a++) offs.push((a - (dec - 1) / 2) * dem.spec.dLat);
  for (let i = 0; i < CTX_N; i++) for (let j = 0; j < CTX_N; j++) {
    const [lon, lat] = patchToLonLat(lat0, lon0, CTX_M, j * cdx, i * cdx), dLon = (dem.lonSpacing(lat, lon) ?? dem.spec.dLat);
    let s = 0, m = 0;
    for (const oy of offs) for (const ox of offs) { const v = dem.sample(lon + (ox / dem.spec.dLat) * dLon, lat + oy); if (Number.isFinite(v)) { s += v; m++; } }
    if (m === offs.length * offs.length) { hC[i * CTX_N + j] = s / m; okC[i * CTX_N + j] = 1; }
  }
  let ctxValid = okC.reduce((a, b) => a + b, 0) / okC.length;
  if (ctxValid < 0.02) {
    const sorted = Float64Array.from(h).sort();
    hC.fill(percentile(sorted, 50)); okC.fill(0); ctxValid = 0;
    missing.push("context ring: no elevation beyond the patch (flat ring shown)");
  }
  const a0 = Math.round((CTX_M - PATCH_M) / 2 / cdx), b0 = Math.round((CTX_M + PATCH_M) / 2 / cdx), step = (n - 1) / (b0 - a0);
  for (let i = a0; i <= b0; i++) for (let j = a0; j <= b0; j++) { hC[i * CTX_N + j] = h[Math.round((i - a0) * step) * n + Math.round((j - a0) * step)]; okC[i * CTX_N + j] = 1; }
  fillInvalid(hC, okC, CTX_N);
  if (ctxValid < 0.98) missing.push(`context ring: the source covers ${Math.round(100 * ctxValid)} % of the 10 km ring; the rest is filled from the nearest data`);

  // lowest point of the patch = 0 m, as the old app did when it decoded a real ground (terrain.js loadReal)
  let mn = Infinity;
  for (let k = 0; k < h.length; k++) if (h[k] < mn) mn = h[k];
  for (let k = 0; k < h.length; k++) h[k] -= mn;
  for (let k = 0; k < hC.length; k++) hC[k] -= mn;

  const lonSp = dem.lonSpacing(lat0, lon0);
  const prov: GroundProvenance = {
    elevation_source: dem.spec.label,
    elevation_source_id: dem.spec.id,
    elevation_resolution_m: res,
    spacing_ns_m: dem.spec.dLat * DEG * R_EARTH,
    spacing_ew_m: lonSp ? lonSp * DEG * R_EARTH * Math.cos(lat0 * DEG) : null,
    imagery_source: "none",
    imagery_resolution_m: null,
    synthetic_fine: syntheticFine,
    fine_detail_rms_m: Math.round(amp * 1000) / 1000,
    date_built: new Date().toISOString(),
    site_center: [lat0, lon0],
    hmin: mn,
    datum: "EGM2008 geoid (Copernicus DEM heights), lowest point of the patch = 0 m",
    valid: Math.round(validFrac * 1e4) / 1e4,
    ctx: { n: CTX_N, size_m: CTX_M, src: dem.spec.label, valid: Math.round(ctxValid * 1000) / 1000 },
    sea_frac: seaFrac,
    missing,
    licence: ["Copernicus DEM: © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018, provided under COPERNICUS by the European Union and ESA; all rights reserved"],
    bytes: dem.bytes(),
    ms: Math.round(now() - t0),
    truth,
  };
  return { fine: { M: n, h, size: PATCH_M }, ctx: { n: CTX_N, h: hC, size: CTX_M }, prov };
}
