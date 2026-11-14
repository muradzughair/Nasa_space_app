// Rover simulation core (pure logic, no 3D): A* routing, wheel-contact pose, metrics along the route, and the match verdict.
// A screening comparison with simplified soil behaviour. Not validated against a real rover.
import { sampleH, surfaceH } from './terrain.js';
import { SoilDrag } from './soilmech.js';

const DEG = Math.PI / 180;
export const START = [0.12, 0.5], GOAL = [0.88, 0.5];   // normalised patch coordinates (x, z), the same on both terrains
export const DS = 2.0;                                  // route sample spacing (m)

export function frictionFromSoil(soil) { return Math.max(0.25, Math.min(0.95, 0.35 + 0.5 * soil)); }   // placeholder soil proxy -> friction coefficient

class Heap {
  constructor() { this.a = []; }
  push(k, v) { const a = this.a; a.push([k, v]); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { let l = 2 * i + 1, r = l + 1, m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return top; }
  get size() { return this.a.length; }
}

/** A* over a cost grid built from slope and roughness. Returns a smoothed polyline [[x,z],...] in metres. */
// Results are cached per (patch, inputs): a repeated rover build on the same site is instant. Caches hang off the patch / route objects, so they are freed with them.
const ROUTES = new WeakMap(), RUNS = new WeakMap(), AKEYS = ['mass_kg', 'n_wheels', 'wheel_radius_m', 'wheel_width_m', 'max_speed_mps', 'drive_power_max_W', 'drive_force_max_N', 'battery_wh', 'base_power_W', 'drive_efficiency', 'slope_limit_deg', 'ground_clearance_m', 'wheelbase_m', 'track_m'];
function memo(wm, obj, key, make) { let m = wm.get(obj); if (!m) wm.set(obj, m = new Map()); if (m.has(key)) { const v = m.get(key); m.delete(key); m.set(key, v); return v; } const v = make(); m.set(key, v); if (m.size > 16) m.delete(m.keys().next().value); return v; }
export const planRoute = (p, rover) => memo(ROUTES, p, rover.slope_limit_deg, () => planRouteRaw(p, rover));
function planRouteRaw(p, rover) {
  const n = p.n, lim = Math.tan(rover.slope_limit_deg * DEG);
  const sorted = Array.from(p.rough).sort((a, b) => a - b), medR = Math.max(1e-3, sorted[sorted.length >> 1]);   // roughness is judged relative to the patch median
  const cell = new Float32Array(n * n);
  for (let i = 0; i < n * n; i++) {
    const t = Math.tan(p.slope[i] * DEG) / lim;
    cell[i] = 1 + 6 * t * t + 0.25 * Math.min(4, p.rough[i] / medR) + (t > 1.2 ? 60 : 0);
  }
  const idx = (i, j) => i * n + j;
  const s = [Math.round(START[1] * (n - 1)), Math.round(START[0] * (n - 1))], g = [Math.round(GOAL[1] * (n - 1)), Math.round(GOAL[0] * (n - 1))];
  const dist = new Float32Array(n * n).fill(Infinity), prev = new Int32Array(n * n).fill(-1), open = new Heap();
  dist[idx(...s)] = 0; open.push(0, idx(...s));
  const h = (i, j) => Math.hypot(i - g[0], j - g[1]);
  while (open.size) {
    const [, u] = open.pop(), ui = (u / n) | 0, uj = u % n;
    if (ui === g[0] && uj === g[1]) break;
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      if (!di && !dj) continue;
      const vi = ui + di, vj = uj + dj; if (vi < 0 || vj < 0 || vi >= n || vj >= n) continue;
      const v = idx(vi, vj), step = Math.hypot(di, dj) * 0.5 * (cell[u] + cell[v]), nd = dist[u] + step;
      if (nd < dist[v]) { dist[v] = nd; prev[v] = u; open.push(nd + h(vi, vj), v); }
    }
  }
  let path = [], c = idx(...g);
  if (prev[c] < 0 && c !== idx(...s)) return null;
  while (c >= 0) { path.push([(c % n) * p.dx, ((c / n) | 0) * p.dx]); c = prev[c]; }
  path.reverse();
  for (let it = 0; it < 8; it++) path = path.map((q, k) => { if (k === 0 || k === path.length - 1) return q; const a = path[Math.max(0, k - 2)], b = path[Math.min(path.length - 1, k + 2)]; return [(a[0] + q[0] * 2 + b[0]) / 4, (a[1] + q[1] * 2 + b[1]) / 4]; });
  // resample at DS
  const out = [path[0]]; let acc = 0;
  for (let k = 1; k < path.length; k++) {
    let [x0, z0] = path[k - 1]; const [x1, z1] = path[k]; let seg = Math.hypot(x1 - x0, z1 - z0);
    while (acc + seg >= DS) { const f = (DS - acc) / seg; x0 += (x1 - x0) * f; z0 += (z1 - z0) * f; out.push([x0, z0]); seg = Math.hypot(x1 - x0, z1 - z0); acc = 0; }
    acc += seg;
  }
  return out;
}

/** Rolling-resistance coefficient from soil competence (0 = loose, 1 = firm). Shared by the route analysis and the drive mode. */
export function crrFromSoil(soil) { return 0.06 + 0.12 * (1 - soil); }

export function wheelPoints(r) {
  if (r.wheel_pts) return r.wheel_pts;   // effective rover config (rovercfg.js): the wheel hubs of the chosen build
  const hw = r.track_m / 2, hb = r.wheelbase_m / 2, pts = [[hb, hw], [hb, -hw], [-hb, hw], [-hb, -hw]];
  if (r.n_wheels === 6) { const m = r.mid_wheel_x_m || hw; pts.push([0, m], [0, -m]); }
  return pts;   // [forward offset, right offset]
}

/** Contact-plane fit of a rover at (x, z) with heading psi (x forward = (cos psi, sin psi) in patch coordinates). sample(x, z) returns the surface height.
 *  Returns the mean height c at the body centre, the slopes sa (rise over run along the heading) and sb (across, to the right), the wheel heights H and the fit residual. */
export function contactFit(sample, x, z, psi, W) {
  const nW = W.length, fx = Math.cos(psi), fz = Math.sin(psi), rx = fz, rz = -fx;
  let c = 0, au = 0, bv = 0, su2 = 0, sv2 = 0; const H = [];
  for (const [u, v] of W) { const hh = sample(x + u * fx + v * rx, z + u * fz + v * rz); H.push(hh); c += hh / nW; au += hh * u; bv += hh * v; su2 += u * u; sv2 += v * v; }
  const sa = au / su2, sb = bv / sv2;
  let res = 0; W.forEach(([u, v], q) => { const d = H[q] - (c + sa * u + sb * v); res += d * d; });
  return { c, sa, sb, H, resid: Math.sqrt(res / nW), fx, fz, rx, rz };
}

/** Pose and metrics along a route. g in m/s2, mass in kg, mu = friction coefficient, soil = 0..1 competence (rolling resistance),
 *  S = Bekker soil constants of the ground class (optional; without it there is no sinkage term). `rover` is the effective rover config. */
export function analyze(p, route, rover, o) {
  const { g, mass, mu, soil, S } = o, key = AKEYS.map(k => rover[k]).join(',') + '|' + (rover.wheel_pts ? rover.wheel_pts.map(w => w[0] + ':' + w[1]).join(';') : '') + `|${g},${mass},${mu},${soil},${S ? S.n + ',' + S.kc + ',' + S.kphi : ''}`;
  return memo(RUNS, route, key, () => analyzeRaw(p, route, rover, o));
}
function analyzeRaw(p, route, rover, { g, mass, mu, soil, S }) {
  const N = route.length, W = wheelPoints(rover), nW = W.length;
  const A = { n: N, x: new Float32Array(N), z: new Float32Array(N), c: new Float32Array(N), nx: new Float32Array(N), ny: new Float32Array(N), nz: new Float32Array(N), psi: new Float32Array(N),
    tilt: new Float32Array(N), pitch: new Float32Array(N), roll: new Float32Array(N), slip: new Float32Array(N), e: new Float32Array(N), v: new Float32Array(N), t: new Float32Array(N), E: new Float32Array(N), s: new Float32Array(N), fwd: new Float32Array(N), resid: new Float32Array(N) };
  const crr = crrFromSoil(soil), vmax = rover.max_speed_mps, lim = rover.slope_limit_deg * DEG, drag = S ? new SoilDrag({ ...rover, n_wheels: nW }, S) : null;
  const sink = new Float32Array(N), press = new Float32Array(N), blocked = new Uint8Array(N); A.sink = sink; A.press = press; A.blocked = blocked;
  for (let k = 0; k < N; k++) {
    const [x, z] = route[k], a = route[Math.max(0, k - 1)], b = route[Math.min(N - 1, k + 1)];
    const psi = Math.atan2(b[1] - a[1], b[0] - a[0]), fx = Math.cos(psi), fz = Math.sin(psi), rx = fz, rz = -fx;
    const { c, sa, sb, resid: res } = contactFit((px, pz) => surfaceH(p, px, pz), x, z, psi, W);   // the fine height grid the wheels touch and the view draws (not the coarse planning grid)
    const gx = sa * fx + sb * rx, gz = sa * fz + sb * rz, nl = Math.hypot(gx, 1, gz);
    const alpha = Math.atan(Math.hypot(sa, sb)), slip = Math.min(1, Math.pow(Math.tan(alpha) / mu, 2.5));
    const sinF = sa / Math.hypot(1, sa);
    const Nn = mass * g * Math.cos(alpha), d = drag ? drag.at(Nn) : null, Rc = d ? d.Rc : 0, Fres = crr * Nn + Rc, Fup = mass * g * Math.max(0, sinF);
    const eperm = (mass * g * (crr * Math.cos(Math.atan(sa)) + Math.max(0, sinF)) + Rc) / rover.drive_efficiency / (1 - 0.5 * slip);
    let speed = vmax * Math.max(0.12, Math.min(1, 1 - alpha / (lim * 1.2))) * Math.max(0.35, Math.min(1, 1 - 1.5 * res / rover.wheel_radius_m));
    speed = Math.min(speed, Math.max(0.12 * vmax, rover.drive_power_max_W / Math.max(Fres + Fup, 1e-6)));   // motor power cap: a heavy or sinking build slows down
    sink[k] = d ? d.z : 0; press[k] = d ? d.p / 1000 : 0; blocked[k] = Fres + Fup > Math.min(rover.drive_force_max_N, mu * Nn) ? 1 : 0;
    A.x[k] = x; A.z[k] = z; A.c[k] = c; A.nx[k] = -gx / nl; A.ny[k] = 1 / nl; A.nz[k] = -gz / nl; A.psi[k] = psi;
    A.pitch[k] = Math.atan(sa) / DEG; A.roll[k] = Math.atan(sb) / DEG; A.tilt[k] = alpha / DEG; A.slip[k] = slip * 100; A.e[k] = eperm; A.v[k] = speed; A.fwd[k] = sa; A.resid[k] = res;
    if (k) { const ds = Math.hypot(x - route[k - 1][0], z - route[k - 1][1]); A.s[k] = A.s[k - 1] + ds; A.t[k] = A.t[k - 1] + ds / speed; A.E[k] = A.E[k - 1] + eperm * ds; }
  }
  const mean = arr => arr.reduce((q, w) => q + w, 0) / arr.length;
  const Wh = (A.E[N - 1] + rover.base_power_W * A.t[N - 1]) / 3600, nBlock = blocked.reduce((q, w) => q + w, 0);
  const blockers = []; if (nBlock / N > 0.05) blockers.push(`cannot climb or push through on ${(100 * nBlock / N).toFixed(0)} % of the route`); if (Wh > rover.battery_wh) blockers.push(`battery too small (${Wh.toFixed(0)} Wh needed, ${rover.battery_wh.toFixed(0)} Wh available)`);
  const tsort = [...A.tilt].sort((q, w) => q - w), t98 = tsort[Math.floor(0.98 * (N - 1))];   // 98th percentile so one noisy sample on the synthetic terrain does not decide the verdict
  if (t98 > rover.slope_limit_deg) blockers.push(`route tilt ${t98.toFixed(0)}° (98th percentile) exceeds the ${rover.slope_limit_deg}° slope limit`); if (Math.max(...sink) >= rover.ground_clearance_m) blockers.push('sinks deeper than its ground clearance');
  A.totals = {
    energy_Wh: Wh, battery_wh: rover.battery_wh, reachable: !blockers.length, blockers, sink_mean_mm: 1000 * mean(sink), sink_max_mm: 1000 * Math.max(...sink), press_kPa: mean(press), blocked_frac: nBlock / N, dist: A.s[N - 1], time: A.t[N - 1], energy: A.E[N - 1], tilt_mean: mean(A.tilt), tilt_max: Math.max(...A.tilt), slip_mean: mean(A.slip), slip_max: Math.max(...A.slip),
    e_mean: A.E[N - 1] / Math.max(1, A.s[N - 1]), load_N: mass * g * Math.cos(mean(A.tilt) * DEG) / nW, max_climb_deg: Math.atan(mu) / DEG, mass, g, mu };
  return A;
}

/** State of a run at simulated time t (seconds): index and interpolation. */
export function atTime(A, t) {
  if (t >= A.t[A.n - 1]) return { k: A.n - 1, f: 0, done: true };
  let lo = 0, hi = A.n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (A.t[m] <= t) lo = m; else hi = m; }
  return { k: lo, f: (t - A.t[lo]) / Math.max(1e-9, A.t[hi] - A.t[lo]), done: false };
}

function resampleU(A, key, m = 100) { const o = new Float32Array(m); for (let q = 0; q < m; q++) { const f = (q / (m - 1)) * (A.n - 1), i = Math.floor(f), t = f - i; o[q] = A[key][i] * (1 - t) + A[key][Math.min(A.n - 1, i + 1)] * t; } return o; }
function meanAbs(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; }
function relDiff(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]) / Math.max(1e-9, Math.abs(a[i]), Math.abs(b[i])); return s / a.length; }
const clamp100 = v => Math.max(0, Math.min(100, v));

/** Compare the target run T with the Earth run (raw mass) and the Earth run with mass-equivalent test mass. Gravity-driven metrics are reported as such, not as mismatches. */
export function verdict(T, Er, Eq, ctx) {
  const tiltS = clamp100(100 * (1 - meanAbs(resampleU(T, 'tilt'), resampleU(Er, 'tilt')) / 12));
  const slipS = clamp100(100 * (1 - meanAbs(resampleU(T, 'slip'), resampleU(Er, 'slip')) / 30));
  const enS = clamp100(100 * (1 - relDiff(resampleU(T, 'e'), resampleU(Eq, 'e'))));
  const timS = clamp100(100 * (1 - Math.abs(T.totals.time - Er.totals.time) / Math.max(T.totals.time, Er.totals.time)));
  const match = (tiltS + slipS + enS + timS) / 4;
  const gR = ctx.gEarth / ctx.gTarget, T_ = T.totals, E_ = Er.totals, Q_ = Eq.totals;
  const rows = [
    { key: 'tilt', label: 'Mean tilt', a: T_.tilt_mean, b: E_.tilt_mean, unit: '°', score: tiltS, kind: 'terrain' },
    { key: 'slip', label: 'Mean slip', a: T_.slip_mean, b: E_.slip_mean, unit: '%', score: slipS, kind: 'terrain' },
    { key: 'energy_eq', label: 'Energy per metre, equal wheel load', a: T_.e_mean, b: Q_.e_mean, unit: ' J/m', score: enS, kind: 'terrain' },
    { key: 'time', label: 'Drive time', a: T_.time / 60, b: E_.time / 60, unit: ' min', score: timS, kind: 'terrain' },
    { key: 'climb', label: 'Friction-limited steepest slope', a: T_.max_climb_deg, b: E_.max_climb_deg, unit: '°', score: clamp100(100 * (1 - Math.abs(T_.max_climb_deg - E_.max_climb_deg) / 15)), kind: 'friction' },
    { key: 'energy_raw', label: 'Energy per metre, same mass', a: T_.e_mean, b: E_.e_mean, unit: ' J/m', score: null, kind: 'gravity' },
    { key: 'load', label: 'Wheel load, same mass', a: T_.load_N, b: E_.load_N, unit: ' N', score: null, kind: 'gravity' },
  ];
  // rover-build rows (not scored: they show what this build does on each ground; the Bekker term is simplified and assumed)
  if (T_.sink_mean_mm != null) rows.push(
    { key: 'sink', label: 'Wheel sinkage, mean (simplified)', a: T_.sink_mean_mm, b: E_.sink_mean_mm, unit: ' mm', score: null, kind: 'rover' },
    { key: 'press', label: 'Ground pressure under a wheel', a: T_.press_kPa, b: E_.press_kPa, unit: ' kPa', score: null, kind: 'rover' },
    { key: 'batt', label: 'Energy used on the route (battery ' + Math.round(T_.battery_wh) + ' Wh)', a: T_.energy_Wh, b: E_.energy_Wh, unit: ' Wh', score: null, kind: 'rover' });
  rows.forEach(r => { r.status = r.kind === 'gravity' ? 'gravity' : r.kind === 'rover' ? 'rover' : (r.score >= 70 ? 'match' : 'mismatch'); });
  const mism = [];
  const reachNote = [];
  if (T_.reachable === false) reachNote.push(`This build does not complete the route on the target ground (${(T_.blockers || []).join(', ') || 'battery or traction limit'}). Screening result: the model has no recharging and no detours.`);
  if (E_.reachable === false) reachNote.push(`This build does not complete the route on the Earth site (${(E_.blockers || []).join(', ') || 'battery or traction limit'}). Screening result: the model has no recharging and no detours.`);
  if (tiltS < 70) mism.push(`Tilt differs: mean ${T_.tilt_mean.toFixed(1)}° on the target vs ${E_.tilt_mean.toFixed(1)}° on the Earth site.`);
  if (slipS < 70) mism.push(`Slip differs: mean ${T_.slip_mean.toFixed(0)}% vs ${E_.slip_mean.toFixed(0)}% (the slope is compared with each site's friction, so soil matters here).`);
  if (enS < 70) mism.push(`Energy per metre differs even at equal wheel load: ${T_.e_mean.toFixed(0)} vs ${Q_.e_mean.toFixed(0)} J/m (terrain and rolling resistance, not gravity).`);
  if (timS < 70) mism.push(`Drive time differs: ${(T_.time / 60).toFixed(0)} vs ${(E_.time / 60).toFixed(0)} min (speed is limited by slope and roughness).`);
  if (rows[4].status === 'mismatch') mism.push(`The friction-limited steepest slope differs: ${T_.max_climb_deg.toFixed(0)}° vs ${E_.max_climb_deg.toFixed(0)}°. This depends on soil friction, not gravity.`);
  const worst = rows.filter(r => r.kind !== 'gravity').sort((a, b) => a.score - b.score)[0];
  const hint = { tilt: 'Look for a hotspot with a lower steep-slope (p90) value or lower relief.', slip: 'Adjust the friction sliders or choose a site with similar soil competence.', energy_eq: 'Check soil cover and slope: rolling resistance and uphill grade drive energy.', time: 'Compare slope and roughness of the two routes.', climb: 'Set the friction values deliberately; the geology class sets the default.' }[worst.key];
  const label = match >= 80 ? 'Good match' : match >= 60 ? 'Partial match' : 'Weak match';
  const grav = `Gravity differs (${ctx.gTarget} vs ${ctx.gEarth} m/s², ratio ${gR.toFixed(2)}). Wheel load and energy per metre scale with gravity at equal mass (here ${(E_.load_N / T_.load_N).toFixed(2)}x and ${(E_.e_mean / T_.e_mean).toFixed(2)}x), so they differ by design, while tilt, slip, friction-limited slope and drive time do not depend on gravity in this model. A test mass of about ${(ctx.gTarget / ctx.gEarth).toFixed(2)} times the rover mass reproduces the target wheel load on Earth.`;
  mism.push(...reachNote);
  return { match, label, rows, mismatches: mism, recommendation: match >= 80 && !mism.length ? 'The two drives behave alike on the terrain-driven metrics. Use this site for screening tests, keeping the gravity differences in mind.' : `Main mismatch: ${worst.label.toLowerCase()}. ${hint}`, gravityNote: grav };
}
