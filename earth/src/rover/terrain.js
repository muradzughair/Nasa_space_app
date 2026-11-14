// Terrain patches: slope/roughness grids, the fine surface the wheels touch, the context ring and colouring.
// Ported from the old app/js/terrain.js. Every function that computes a height, slope or roughness is unchanged. What changed: the old
// module loaded demo patches (patches.bin) and the pipeline's real tiles (prepareReal, getPatch, synth); here a ground is built once per
// opened place by earthground.ts from the elevation source, and handed to makePatch() below.

/** Inverse of encode_h16 in the old pipeline: two byte planes of row differences (first column: differences down the column) -> metres above the stored minimum.
 *  Kept so the old ground check can decode the old project's real tiles with this module. */
export function decodeH16(u8, n, scale) {
  const m = n * n, out = new Float32Array(m); let first = 0;
  for (let i = 0; i < n; i++) {
    let v = first = (first + (u8[i * n] | (u8[m + i * n] << 8))) & 65535; out[i * n] = v * scale;
    for (let j = 1; j < n; j++) { const k = i * n + j; v = (v + (u8[k] | (u8[m + k] << 8))) & 65535; out[k] = v * scale; }
  }
  return out;
}

export function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
export function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function slopeGrid(h, n, dx) {
  const s = new Float32Array(n * n);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const i0 = Math.max(0, i - 1), i1 = Math.min(n - 1, i + 1), j0 = Math.max(0, j - 1), j1 = Math.min(n - 1, j + 1);
    const gz = (h[i1 * n + j] - h[i0 * n + j]) / ((i1 - i0) * dx), gx = (h[i * n + j1] - h[i * n + j0]) / ((j1 - j0) * dx);
    s[i * n + j] = Math.atan(Math.hypot(gx, gz)) * 180 / Math.PI;
  }
  return s;
}
function median(a) { const b = Array.from(a).sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; }
function pct(a, p) { const b = Array.from(a).sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor(p * b.length))]; }

/** Local roughness: deviation from the 3x3 mean (metres). */
export function roughGrid(h, n) {
  const r = new Float32Array(n * n);
  for (let i = 1; i < n - 1; i++) for (let j = 1; j < n - 1; j++) {
    let m = 0;
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) m += h[(i + a) * n + j + b];
    r[i * n + j] = Math.abs(h[i * n + j] - m / 9);
  }
  return r;
}

export function finish(id, n, size, h, kind, extra) {
  const dx = size / (n - 1);
  let mn = Infinity, mx = -Infinity; for (const v of h) { if (v < mn) mn = v; if (v > mx) mx = v; }
  if (mn !== 0 && !(extra && extra.real)) { for (let i = 0; i < h.length; i++) h[i] -= mn; mx -= mn; mn = 0; }   // each terrain sits on its own datum: lowest point = 0 m (a real ground is already on the datum of its fine grid)
  const sl = slopeGrid(h, n, dx);
  return { id, n, size, dx, h, slope: sl, rough: roughGrid(h, n), min: mn, max: mx, kind, stats: { slope_med: median(sl), slope_p90: pct(sl, 0.9), relief: mx - mn }, ...extra };
}

/** An opened Earth ground, in the same shape the old getPatch() returned for a real ground: the coarse grid for route planning (n x n, taken from the
 *  fine grid at a fixed stride exactly as the old getPatch did), the fine grid p.U that is drawn and that the wheels touch, and the context ring p.C.
 *  fine: { M, h (Float32Array, metres above the lowest point of the patch), size }; ctx: { n, size, h (same datum) }; prov: provenance (earthground.ts). */
export function makePatch(id, n, fine, ctx, prov) {
  const M = fine.M, step = (M - 1) / (n - 1), hc = new Float32Array(n * n);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) hc[i * n + j] = fine.h[i * step * M + j * step];
  const p = finish(id, n, fine.size, hc, 'earth', { synthetic: !!prov.synthetic_fine, syntheticBase: false, real: true, prov });
  p.U = { M, h: fine.h, dx: fine.size / (M - 1), size: fine.size, real: true };
  p.C = { n: ctx.n, size: ctx.size, dx: ctx.size / (ctx.n - 1), h: ctx.h };
  return p;
}

export function sampleH(p, x, z) {
  const n = p.n, fx = Math.max(0, Math.min(n - 1.001, x / p.dx)), fz = Math.max(0, Math.min(n - 1.001, z / p.dx));
  const j = Math.floor(fx), i = Math.floor(fz), tx = fx - j, tz = fz - i, h = p.h;
  return h[i * n + j] * (1 - tx) * (1 - tz) + h[i * n + j + 1] * tx * (1 - tz) + h[(i + 1) * n + j] * (1 - tx) * tz + h[(i + 1) * n + j + 1] * tx * tz;
}

const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function ramp(stops, t) { t = Math.max(0, Math.min(1, t)); for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) return lerp3(stops[i - 1][1], stops[i][1], (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0])); return stops[stops.length - 1][1]; }
// Muted ramps used as a gentle tint multiplied onto the ground texture (never as the surface colour itself).
const SLOPE = [[0, [0.62, 0.86, 0.66]], [0.35, [0.95, 0.92, 0.55]], [0.7, [0.98, 0.7, 0.45]], [1, [0.95, 0.5, 0.45]]];
const ELEV = [[0, [0.55, 0.68, 0.9]], [0.35, [0.6, 0.85, 0.82]], [0.65, [0.95, 0.9, 0.7]], [1, [1, 0.97, 0.94]]];

/** Catmull-Rom 2x upsampling of a patch (n -> 2n-1 samples per side) so the mesh is smooth up close. Cached on the patch. The extra detail is interpolation only. */
export function upsample(p) {
  if (p.U) return p.U;
  const n = p.n, M = 2 * n - 1, h = p.h, T = new Float32Array(n * M), U = new Float32Array(M * M);
  const cr = (a, b, c, d) => (-a + 9 * b + 9 * c - d) / 16, cl = k => Math.max(0, Math.min(n - 1, k));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    T[i * M + 2 * j] = h[i * n + j];
    if (j < n - 1) T[i * M + 2 * j + 1] = cr(h[i * n + cl(j - 1)], h[i * n + j], h[i * n + j + 1], h[i * n + cl(j + 2)]);
  }
  for (let j = 0; j < M; j++) for (let i = 0; i < n; i++) {
    U[(2 * i) * M + j] = T[i * M + j];
    if (i < n - 1) U[(2 * i + 1) * M + j] = cr(T[cl(i - 1) * M + j], T[i * M + j], T[(i + 1) * M + j], T[cl(i + 2) * M + j]);
  }
  const dx = p.dx / 2;
  p.U = { M, h: U, dx, size: p.size, slope: slopeGrid(U, M, dx) };
  return p.U;
}

/** Height of a regular grid (m samples per side, spacing dx) at metres (x, z) measured from the patch corner. */
export function sampleGrid(h, m, dx, x, z) {
  const fx = Math.max(0, Math.min(m - 1.001, x / dx)), fz = Math.max(0, Math.min(m - 1.001, z / dx));
  const j = Math.floor(fx), i = Math.floor(fz), tx = fx - j, tz = fz - i;
  return h[i * m + j] * (1 - tx) * (1 - tz) + h[i * m + j + 1] * tx * (1 - tz) + h[(i + 1) * m + j] * (1 - tx) * tz + h[(i + 1) * m + j + 1] * tx * tz;
}
/** Surface height at patch coordinates (x, z in 0..size), bilinear on the fine grid that is drawn and that the wheels touch (the real fine grid, or the smooth upsampled demo surface). */
export function surfaceH(p, x, z) { const U = upsample(p); return sampleGrid(U.h, U.M, U.dx, x, z); }
/** Height under any world point centred on the patch. Beyond the patch: the real context ring when the site has one, otherwise mirrored repeats (demo sites). */
export function worldH(p, wx, wz) {
  const half = p.size / 2;
  if (Math.abs(wx) <= half && Math.abs(wz) <= half) return surfaceH(p, wx + half, wz + half);
  if (p.C) return sampleGrid(p.C.h, p.C.n, p.C.dx, wx + p.C.size / 2, wz + p.C.size / 2);   // real context ring
  const fold = c => { let t = (((c / p.size + 0.5) % 2) + 2) % 2; if (t > 1) t = 2 - t; return t * p.size; };
  return surfaceH(p, fold(wx), fold(wz));
}

/** Per-vertex tint (RGB multipliers) for the upsampled grid. mode: 'plain' (gentle slope darkening only), 'slope', 'elev'. */
export function shadeUpsampled(p, mode) {
  const U = upsample(p), N = U.M * U.M, c = new Float32Array(N * 3), span = Math.max(1e-6, p.max - p.min);
  for (let i = 0; i < N; i++) {
    const sl = U.slope[i] / 30, dark = 1 - 0.2 * Math.min(1, sl);   // low-contrast slope darkening
    let col = [1, 1, 1];
    if (mode === 'slope') { const r = ramp(SLOPE, sl); col = [0.4 + 0.6 * r[0], 0.4 + 0.6 * r[1], 0.4 + 0.6 * r[2]]; }
    else if (mode === 'elev') { const r = ramp(ELEV, (U.h[i] - p.min) / span); col = [0.4 + 0.6 * r[0], 0.4 + 0.6 * r[1], 0.4 + 0.6 * r[2]]; }
    c[i * 3] = col[0] * dark; c[i * 3 + 1] = col[1] * dark; c[i * 3 + 2] = col[2] * dark;
  }
  return c;
}
