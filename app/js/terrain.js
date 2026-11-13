// Terrain patches: decoding, fallback synthesis, slope/roughness grids and colouring.
import { D } from './data.js';

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

function finish(id, n, size, h, kind, extra) {
  const dx = size / (n - 1);
  let mn = Infinity, mx = -Infinity; for (const v of h) { if (v < mn) mn = v; if (v > mx) mx = v; }
  if (mn !== 0) { for (let i = 0; i < h.length; i++) h[i] -= mn; mx -= mn; mn = 0; }   // each terrain sits on its own datum: lowest point = 0 m
  const sl = slopeGrid(h, n, dx);
  return { id, n, size, dx, h, slope: sl, rough: roughGrid(h, n), min: mn, max: mx, kind, stats: { slope_med: median(sl), slope_p90: pct(sl, 0.9), relief: mx - mn }, ...extra };
}

/** Browser fallback for hotspots without a precomputed tile (custom weights). Sum of random waves with slope statistics from the traits. */
function synth(id, traits) {
  const n = D.patchIdx.n, size = D.patchIdx.size_m, rng = mulberry32(hashStr(id)), h = new Float32Array(n * n);
  const waves = [];
  for (let k = 0; k < 70; k++) { const lam = size * Math.pow(2, -rng() * 5.5), th = rng() * Math.PI * 2; waves.push([2 * Math.PI / lam, Math.cos(th), Math.sin(th), rng() * 6.283, Math.pow(lam, 0.82)]); }
  const dx = size / (n - 1);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { let v = 0; for (const w of waves) v += w[4] * Math.sin(w[0] * (j * dx * w[1] + i * dx * w[2]) + w[3]); h[i * n + j] = v; }
  const med = median(slopeGrid(h, n, dx)), want = Math.max(2, Math.min(28, 2 + 1.1 * traits.slope_med));
  const k = Math.tan(want * Math.PI / 180) / Math.max(1e-6, Math.tan(med * Math.PI / 180));
  const fine = Math.max(0.02, Math.min(0.5, 0.015 * Math.sqrt(Math.max(traits.roughness, 0))));
  let mn = Infinity;
  for (let i = 0; i < h.length; i++) { h[i] = h[i] * k + (rng() - 0.5) * 2 * fine; if (h[i] < mn) mn = h[i]; }
  for (let i = 0; i < h.length; i++) h[i] -= mn;
  return finish(id, n, size, h, 'earth', { synthetic: true, browserStandIn: true });
}

/** Patch for a target (id "tgt_<id>") or an Earth hotspot (hotspot id). */
export function getPatch(id, traits) {
  const e = D.patchIdx.patches[id];
  if (!e) return synth(id, traits);
  const raw = new Uint16Array(D.patchBuf, e.offset, e.n * e.n), h = new Float32Array(e.n * e.n);
  for (let i = 0; i < h.length; i++) h[i] = raw[i] * e.hscale;
  return finish(id, e.n, e.size_m, h, e.kind, { synthetic: true, syntheticBase: e.synthetic_base });
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
/** Surface height at patch coordinates (x, z in 0..size) as rendered (smooth upsampled surface). */
export function surfaceH(p, x, z) { const U = upsample(p); return sampleGrid(U.h, U.M, U.dx, x, z); }
/** Height under any world point centred on the patch, extended by mirrored repeats (the context tiles around the patch). */
export function worldH(p, wx, wz) {
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
