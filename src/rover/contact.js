// Rover on the ground: one pose routine shared by the Site View playback and by drive mode.
// Heights come from ONE function (terrain.js sampleGrid on the fine grid, interpolated on the mesh's own triangles), times the vertical exaggeration,
// exactly as the ground mesh is drawn (ground.js keeps the tiles under the rovers at full detail, so mesh and function agree there).
// Body: a plane fitted through the ground under each wheel's footprint (terrain.js contactSampler), lowered by the visible sinkage, with critically
// damped vertical smoothing at a fixed step. Wheels: each wheel is moved straight up or down (world vertical) until the lowest point of its own drawn rim
// (outer vertices of the wheel mesh, grousers included) sits exactly at the ground minus the visible sinkage. This is done every frame against the
// body as it is drawn, so smoothing the body never pushes a wheel into the ground. The models have wheel nodes but no rocker or bogie nodes, so this is
// a plane fit with independent wheel travel, not a rocker-bogie linkage.
import * as THREE from './three.js';
import { upsample, sampleGrid, contactSampler } from './terrain.js';
import { contactFit, wheelPoints } from './sim.js';

const _n3 = new THREE.Matrix3(), _Y = new THREE.Vector3(), _Z = new THREE.Vector3(), _X = new THREE.Vector3(), _v = new THREE.Vector3(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _t = new THREE.Vector3(), _up = new THREE.Vector3(), _p = new THREE.Vector3();
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const SINK_VIS_MAX = 0.12;   // visible sinkage is clamped to this fraction of the wheel radius
export const TRAVEL_DOWN = 0.4;     // a wheel may hang this far (m) below its rest position before it leaves the ground
export const sinkVisible = (sink, r) => clamp(sink || 0, 0, SINK_VIS_MAX * r);
const STEP = 1 / 120, OMEGA = 16;   // fixed step and natural frequency of the body's vertical smoothing (critically damped)

/** Outer vertices of a wheel node (node-local coordinates, before the node's own scale and spin): every vertex at 60 % or more of the largest distance
 *  from the axle (local x), grouped in 72 angle x 4 width x 3 radius bins. For each bin: one representative vertex and the largest distance from it to
 *  any other vertex of the bin (dmax, local units). Computed once per node. */
const NA = 72, NW = 4, NR = 3;
function rimOf(node) {
  if (node.userData.rim && node.userData.rim.rep instanceof Float32Array) return node.userData.rim;
  node.updateWorldMatrix(true, true);
  const inv = new THREE.Matrix4().copy(node.matrixWorld).invert(), sc = node.scale, v = new THREE.Vector3(), m = new THREE.Matrix4(), pts = []; let xmin = Infinity, xmax = -Infinity, rmax = 0;
  node.traverse(o => { if (!o.isMesh || !o.visible) return; m.multiplyMatrices(inv, o.matrixWorld); const P = o.geometry.attributes.position; for (let k = 0; k < P.count; k++) { v.fromBufferAttribute(P, k).applyMatrix4(m); const r = Math.hypot(v.y * sc.y, v.z * sc.z); pts.push([v.x, v.y, v.z, r]); if (v.x < xmin) xmin = v.x; if (v.x > xmax) xmax = v.x; if (r > rmax) rmax = r; } });
  const bins = Array.from({ length: NA * NW * NR }, () => []);
  for (const q of pts) { if (q[3] < 0.6 * rmax) continue; const a = Math.floor((Math.atan2(q[2], q[1]) + Math.PI) / (2 * Math.PI) * NA) % NA, w = Math.min(NW - 1, Math.floor((q[0] - xmin) / Math.max(1e-9, xmax - xmin) * NW)), rr = Math.min(NR - 1, Math.floor((q[3] / rmax - 0.6) / 0.4 * NR)); bins[(a * NW + w) * NR + rr].push(q); }
  const used = bins.filter(b => b.length), nb = used.length, rep = new Float32Array(nb * 3), dmax = new Float32Array(nb), start = new Int32Array(nb + 1), all = new Float32Array(used.reduce((n, b) => n + b.length, 0) * 3); let o = 0;
  used.forEach((b, k) => { const c = b[0]; rep.set(c.slice(0, 3), k * 3); start[k] = o / 3; let d = 0; for (const q of b) { all[o++] = q[0]; all[o++] = q[1]; all[o++] = q[2]; d = Math.max(d, Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2])); } dmax[k] = d; }); start[nb] = o / 3;
  let reach = 0; for (let k = 0; k < all.length; k += 3) reach = Math.max(reach, Math.hypot(all[k], all[k + 1], all[k + 2]));
  return (node.userData.rim = { rep, dmax, start, all, reach, cl: new Float32Array(nb) });
}
/** Lowest clearance (m; negative = below) of a wheel above the drawn ground over ALL its outer vertices, found without testing them all: the drawn
 *  ground cannot change faster than its steepest triangle near the wheel (L, times the exaggeration), so a bin whose representative is higher than the
 *  current lowest point by more than dmax x (1 + L x exaggeration) cannot hold a lower vertex and is skipped. Uses the node's current world matrix. */
function rimClearance(node, rim, U, half, ex) {
  const e = node.matrixWorld.elements, h = U.h, M = U.M, dx = U.dx, cl = rim.cl, nb = cl.length;
  const sw = Math.max(Math.hypot(e[0], e[1], e[2]), Math.hypot(e[4], e[5], e[6]), Math.hypot(e[8], e[9], e[10]));   // world metres per local unit
  // steepest triangle edge of the drawn ground under the wheel
  const R = rim.reach * sw + dx, ci = Math.round((e[14] + half) / dx), cj = Math.round((e[12] + half) / dx), n = Math.ceil(R / dx);
  let L = 0;
  for (let i = Math.max(0, ci - n); i < Math.min(M - 1, ci + n); i++) for (let j = Math.max(0, cj - n); j < Math.min(M - 1, cj + n); j++) {
    const k = i * M + j, a = h[k], b = h[k + 1], c = h[k + M], d = h[k + M + 1];
    L = Math.max(L, Math.abs(b - a), Math.abs(c - a), Math.abs(d - c), Math.abs(d - b), Math.abs(b - c));
  }
  const slack = 1 + Math.SQRT2 * L / dx * ex;
  const clear = (P, k) => { const x = P[k], y = P[k + 1], z = P[k + 2]; return e[1] * x + e[5] * y + e[9] * z + e[13] - sampleGrid(h, M, dx, e[0] * x + e[4] * y + e[8] * z + e[12] + half, e[2] * x + e[6] * y + e[10] * z + e[14] + half) * ex; };
  let lo = Infinity;
  for (let k = 0; k < nb; k++) { cl[k] = clear(rim.rep, k * 3); if (cl[k] < lo) lo = cl[k]; }
  for (let k = 0; k < nb; k++) if (cl[k] - rim.dmax[k] * sw * slack < lo) for (let q = rim.start[k]; q < rim.start[k + 1]; q++) { const c = clear(rim.all, q * 3); if (c < lo) lo = c; }
  return lo;
}
const nodeWorld = n => { n.updateMatrix(); n.matrixWorld.multiplyMatrices(n.parent.matrixWorld, n.matrix); };

/** s: Site View side ({ patch, rover, pose, tracks }); x, z: patch coordinates (m); psi: heading; o: { par, ex, dt, snap, sink (m), wheelAng, kq, moving }.
 *  Returns the contact fit (c, sa, sb, H) measured with the shared height function. */
export function poseOnGround(s, x, z, psi, o) {
  const p = s.patch, U = upsample(p), half = p.size / 2, ex = o.ex || 1, par = o.par, W = wheelPoints(par), r = par.wheel_radius_m, sv = sinkVisible(o.sink, r);
  const ps = s.pose, key = par.wheel_radius_m + ',' + par.wheel_width_m;
  if (!ps.sample || ps.sampleKey !== key || ps.sampleP !== p) { ps.sample = contactSampler(p, r, par.wheel_width_m || 0.3); ps.sampleKey = key; ps.sampleP = p; }
  const f = contactFit(ps.sample, x, z, psi, W, ps.fit || (ps.fit = {})), fx = f.fx, fz = f.fz;
  const gx = f.sa * fx + f.sb * f.rx, gz = f.sa * fz + f.sb * f.rz;
  _Y.set(-gx * ex, 1, -gz * ex).normalize(); _v.set(fx, 0, fz); _Z.copy(_v).addScaledVector(_Y, -_v.dot(_Y)).normalize(); _X.crossVectors(_Y, _Z).normalize();
  _m.makeBasis(_X, _Y, _Z); _q.setFromRotationMatrix(_m);
  const ty = (f.c - sv) * ex, root = s.rover.root, snap = o.snap || !ps.init, dt = Math.min(0.25, o.dt || 0.016);
  root.position.x = x - half; root.position.z = z - half;   // horizontal position follows the route or the physics exactly
  if (snap) { ps.y = ty; ps.vy = 0; ps.acc = 0; ps.q = (ps.q || new THREE.Quaternion()).copy(_q); ps.init = true; }
  else {
    ps.acc = (ps.acc || 0) + dt; let y = ps.y, vy = ps.vy || 0;
    while (ps.acc >= STEP) { vy += (OMEGA * OMEGA * (ty - y) - 2 * OMEGA * vy) * STEP; y += vy * STEP; ps.acc -= STEP; }
    ps.y = y; ps.vy = vy; ps.q.slerp(_q, 1 - Math.exp(-dt * (o.kq || 6)));
  }
  root.position.y = ps.y; root.quaternion.copy(ps.q);   // the smoothing state lives in s.pose, so the same rover can be posed for several views
  // wheels: rest each one on the drawn ground, against the body as it is drawn now
  root.updateWorldMatrix(true, false); const lift = s.rover.lift, model = s.rover.model; lift.updateMatrix(); lift.matrixWorld.multiplyMatrices(root.matrixWorld, lift.matrix); model.updateMatrix(); model.matrixWorld.multiplyMatrices(lift.matrixWorld, model.matrix);
  const WH = s.rover.wheels, upd = _p;
  let rl = null, rr = null;
  for (let q = 0; q < WH.length; q++) {
    const w = WH[q], n = w.node; if (!n.visible) continue;
    const rim = rimOf(n); n.rotation.x = o.wheelAng || 0;
    if (n.parent !== model) n.parent.updateWorldMatrix(true, false);
    _n3.setFromMatrix4(n.parent.matrixWorld).invert(); upd.set(0, 1, 0).applyMatrix3(_n3);   // a world-vertical metre in the wheel's parent coordinates
    if (!w.p0) w.p0 = new THREE.Vector3(n.position.x, w.y0, n.position.z);
    n.position.copy(w.p0); nodeWorld(n);
    // move the wheel straight up or down (world vertical, so the ground under its rim does not change) until its lowest outer vertex is at the
    // ground minus the visible sinkage
    let dy = 0;
    { const c = rimClearance(n, rim, U, half, ex); dy = Math.max(-TRAVEL_DOWN, -sv - c); n.position.copy(w.p0).addScaledVector(upd, dy); nodeWorld(n); }   // a world-vertical move shifts every vertex's clearance by the same amount: exact in one step
    w.dy = dy; w.hanging = dy <= -TRAVEL_DOWN + 1e-6;
    if (s.tracks && o.moving !== false) { const hx = x + w.u * fx + w.v * f.rx, hz = z + w.u * fz + w.v * f.rz; if (w.v < 0 ? (!rl || w.u < rl.u) : (!rr || w.u < rr.u)) { const e = { u: w.u, p: [hx - half, sampleGrid(U.h, U.M, U.dx, hx, hz) * ex + 0.012, hz - half] }; if (w.v < 0) rl = e; else rr = e; } }
  }
  if (s.tracks && rl && rr && o.moving !== false) s.tracks.add([rl.p, rr.p], [fx, fz], par.wheel_width_m || 0.3, clamp(0.35 + (o.sink || 0) / 0.03, 0.35, 1));
  return f;
}
/** For tests: lowest rim clearance of every visible wheel of a side (m), with the current matrices. */
export function wheelClearances(s, ex) { const U = upsample(s.patch), half = s.patch.size / 2; s.rover.root.updateMatrixWorld(true); return s.rover.wheels.filter(w => w.node.visible).map(w => ({ name: w.name, c: rimClearance(w.node, rimOf(w.node), U, half, ex), hanging: !!w.hanging })); }
