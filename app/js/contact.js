// Rover on the ground: one pose routine shared by the Site View playback and by drive mode.
// Every wheel contact height is a bilinear sample of the fine height grid (the grid that is drawn; real elevation where the site has it). The body
// follows a plane fitted through the wheel contacts, so it pitches and rolls with the relief; each wheel then travels up or down on its own to stay on
// the ground. The rover models have separate wheel nodes but no separate rocker or bogie nodes, so this is the plane-fit fallback with independent
// wheel travel, not a rocker-bogie linkage.
import * as THREE from '../vendor/three-bundle.js';
import { upsample, sampleGrid } from './terrain.js';
import { contactFit, wheelPoints } from './sim.js';

const _Y = new THREE.Vector3(), _Z = new THREE.Vector3(), _X = new THREE.Vector3(), _v = new THREE.Vector3(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _t = new THREE.Vector3(), _up = new THREE.Vector3();
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/** s: Site View side ({ patch, rover, pose, tracks }); x, z: patch coordinates (m); psi: heading; o: { par, ex, dt, snap, sink (m), wheelAng, kp, kq, moving }.
 *  Returns the contact fit (c, sa, sb, H) measured on the fine grid. */
export function poseOnGround(s, x, z, psi, o) {
  const p = s.patch, U = upsample(p), half = p.size / 2, ex = o.ex || 1, par = o.par, W = wheelPoints(par), sink = o.sink || 0;
  const sample = (px, pz) => sampleGrid(U.h, U.M, U.dx, px, pz), f = contactFit(sample, x, z, psi, W), fx = f.fx, fz = f.fz, rx = f.rx, rz = f.rz;
  const gx = f.sa * fx + f.sb * rx, gz = f.sa * fz + f.sb * rz;
  _Y.set(-gx * ex, 1, -gz * ex).normalize(); _v.set(fx, 0, fz); _Z.copy(_v).addScaledVector(_Y, -_v.dot(_Y)).normalize(); _X.crossVectors(_Y, _Z).normalize();
  _m.makeBasis(_X, _Y, _Z); _q.setFromRotationMatrix(_m); _t.set(x - half, (f.c - sink) * ex, z - half);
  const root = s.rover.root, snap = o.snap || !s.pose.init, dt = o.dt || 0.016;
  if (snap) { root.position.copy(_t); root.quaternion.copy(_q); s.pose.init = true; }
  else { root.position.lerp(_t, 1 - Math.exp(-dt * (o.kp || 16))); root.quaternion.slerp(_q, 1 - Math.exp(-dt * (o.kq || 6))); }
  // each wheel rides the fine surface: its travel is measured from the body plane as it is drawn now (smoothed), so wheels stay on the ground while the body settles
  _up.set(0, 1, 0).applyQuaternion(root.quaternion); const uy = Math.max(0.3, _up.y), kw = snap ? 1 : 1 - Math.exp(-dt * 22), WH = s.rover.wheels;
  let rl = null, rr = null;
  for (let q = 0; q < WH.length; q++) {
    const w = WH[q], wx = x + w.u * fx + w.v * rx, wz = z + w.u * fz + w.v * rz, hh = sample(wx, wz);
    const planeY = root.position.y - (_up.x * (wx - half - root.position.x) + _up.z * (wz - half - root.position.z)) / uy;
    const want = clamp(((hh - sink) * ex - planeY) * uy, -0.35, 0.35);
    w.dy = (w.dy || 0) + (want - (w.dy || 0)) * kw; w.node.position.y = w.y0 + w.dy; w.node.rotation.x = o.wheelAng || 0;
    if (w.v < 0 ? (!rl || w.u < rl.u) : (!rr || w.u < rr.u)) { const e = { u: w.u, p: [wx - half, hh * ex + 0.012, wz - half] }; if (w.v < 0) rl = e; else rr = e; }
  }
  if (s.tracks && rl && rr && o.moving !== false) s.tracks.add([rl.p, rr.p], [fx, fz], par.wheel_width_m || 0.3, clamp(0.35 + sink / 0.03, 0.35, 1));
  return f;
}
