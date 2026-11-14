// Wheel-ground contact check, ported from the old project's tests/contact_check.mjs (main, commit f8c350f "Lag fix") to this app's Node runner.
// Run: node --import ./scripts/rover-check/ts-resolve.mjs scripts/rover-check/contact_check.mjs [--quick]     (exit code 1 on any failure; output: contact_check_output.txt)
//
// What is the same as the old test: for every rover preset the drive physics (drive.js) runs a fixed scripted path for 60 s of frames (60 frames per
// second, demo speed x25 so the rover crosses many terrain tiles), the app's pose routine (contact.js poseOnGround) places the rover each frame at
// Vertical x 1, 2 and 5, and every frame, for every wheel, the lowest point of the DRAWN wheel (the outer vertices of the wheel meshes of the real
// .glb, grousers included: all of them every 10th frame, a fixed 400-vertex subset on the others) is compared with the DRAWN ground (the detail
// patch or tile vertex buffers of ground.js with their own triangles, times the exaggeration):
//   lowest wheel point minus ground >= -(clamped visible sinkage) - 2 mm (float tolerance), and <= 5 cm unless the wheel hangs at its travel limit,
//   and the mesh under the wheels is drawn at full detail (stride 1).
// One change to the measurement: on the subset frames, a result that would fail (below the sinkage, or more than 5 cm above) is measured again with
// every outer vertex before it counts. On rough ground the 400-vertex subset can miss the lowest vertex and report a float that is not there.
// What differs: the old test opened the old static app in Chromium on its four demo sites with real grounds read from local files. This app builds
// a ground from the Copernicus DEM over the network and has no browser here, so the same modules run in Node (Three.js geometry needs no WebGL) on
// two synthetic Earth grounds in exactly the shape earthground.ts hands to makePatch() (513 x 513 over 2 km, 161 x 161 ring over 10 km), each at the
// two gravities a place is driven at (Mars target and Earth). No screenshots.
// Added for the target-vs-Earth comparison: the real Gale Crater target ground (public/rover/targets/, loaded by targetground.ts exactly as the
// browser loads it) must load, and the wheels must rest on it the same way at Mars gravity.
import fs from 'node:fs'; import { resolveObjectURL } from 'node:buffer';
// ---- the few browser globals the modules and GLTFLoader touch, and file access for the models under public/rover/
const PUB = new URL('../../public/', import.meta.url);
const mem = new Map(); globalThis.localStorage = { getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, String(v)), removeItem: k => mem.delete(k) };
globalThis.window = globalThis; globalThis.self = globalThis;
globalThis.document = { querySelector: () => null, addEventListener() {}, createElementNS: () => ({ style: {} }), createElement: () => ({ style: {}, getContext: () => null }) };
globalThis.Image = class { set src(v) { this.height = 1; setTimeout(() => this.onload && this.onload()); } };   // GLTFLoader's WebP support probe
globalThis.ProgressEvent = class { constructor(type, o = {}) { this.type = type; Object.assign(this, o); } };
globalThis.createImageBitmap = async () => ({ width: 1, height: 1, close() {} });   // textures are not drawn here
const realFetch = globalThis.fetch;
globalThis.Request = class { constructor(url, init = {}) { this.url = String(url); Object.assign(this, init); } };
globalThis.fetch = async (req, init) => {
  const url = typeof req === 'string' ? req : req.url;
  if (url.startsWith('blob:')) return new Response(resolveObjectURL(url));
  if (url.startsWith('/')) { const f = new URL('.' + url.split('?')[0], PUB); if (!fs.existsSync(f)) return new Response(null, { status: 404, statusText: 'Not Found' }); return new Response(fs.readFileSync(f)); }
  return realFetch(req, init);
};
const THREE = await import('../../src/rover/three.js');
const { makePatch, hashStr, mulberry32 } = await import('../../src/rover/terrain.js');
const { Ground } = await import('../../src/rover/ground.js');
const C = await import('../../src/rover/contact.js');
const DR = await import('../../src/rover/drive.js');
const SO = await import('../../src/rover/soilmech.js');
const { frictionFromSoil } = await import('../../src/rover/sim.js');
const RV = await import('../../src/rover/rovers.js');

const QUICK = process.argv.includes('--quick'), out = []; let fails = 0, checks = 0;
const log = (...a) => { const s = a.join(' '); console.log(s); out.push(s); };
const check = (ok, what, extra = '') => { checks++; if (!ok) fails++; log(`${ok ? 'PASS' : 'FAIL'}  ${what}${extra ? '  (' + extra + ')' : ''}`); };

// ---- two Earth grounds in the shape earthground.ts builds (heights in metres above the lowest point of the patch)
function earthGround(id, amp, rough) {
  const M = 513, size = 2000, dx = size / (M - 1), rng = mulberry32(hashStr(id)), waves = [];
  for (let k = 0; k < 90; k++) { const lam = size * Math.pow(2, -rng() * 8.5), th = rng() * Math.PI * 2; waves.push([2 * Math.PI / lam, Math.cos(th), Math.sin(th), rng() * 6.283, amp * Math.pow(lam / size, 0.9)]); }
  const H = (x, z) => { let v = 0; for (const w of waves) v += w[4] * Math.sin(w[0] * (x * w[1] + z * w[2]) + w[3]); return v; };
  const h = new Float32Array(M * M); for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) h[i * M + j] = H(j * dx, i * dx) + (rng() - 0.5) * rough;
  const n = 161, cs = 10000, cdx = cs / (n - 1), hc = new Float32Array(n * n);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) hc[i * n + j] = H(j * cdx - (cs - size) / 2, i * cdx - (cs - size) / 2);
  let mn = Infinity; for (const v of h) mn = Math.min(mn, v); for (let k = 0; k < h.length; k++) h[k] -= mn; for (let k = 0; k < hc.length; k++) hc[k] -= mn;
  return makePatch(id, 129, { M, h, size }, { n, size: cs, h: hc }, { synthetic_fine: true, missing: [] });
}
const GROUNDS = [['rolling', earthGround('pt_test_rolling', 60, 0.25)], ['rough', earthGround('pt_test_rough', 160, 0.6)]];
// ---- the Gale Crater target ground, read from public/rover/targets/ through the app's own loader
{
  const { loadTargetGround } = await import('../../src/rover/targetground');
  const read = async f => { const b = fs.readFileSync(new URL('rover/targets/' + f, PUB)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
  let gale = null, why = '';
  try { gale = await loadTargetGround('mars_gale', { read }); } catch (e) { why = e.message; }
  const p = gale && gale.patch;
  check(!!(p && p.U && p.U.M === 2049 && p.C && p.C.n === 161 && p.size === 2000 && gale.target.gravity === 3.71 && p.stats.relief > 1 && p.U.h.reduce((a, b) => Math.min(a, b), Infinity) === 0),   // lowest point of the fine grid at 0 m
    'Gale target ground loads (targetground.ts)', p ? `fine ${p.U.M} x ${p.U.M} over ${p.size} m, ring ${p.C.n} x ${p.C.n} over ${p.C.size} m, relief ${p.stats.relief.toFixed(1)} m, median slope ${p.stats.slope_med.toFixed(1)}°, gravity ${gale.target.gravity}` : why);
  if (p) GROUNDS.push(['Gale target', p, [['Mars gravity', gale.target.gravity]]]);
}
const REG = JSON.parse(fs.readFileSync(new URL('rover/assets/models/rovers.json', PUB)));
RV.initRovers(REG, 'mars');
const ROVERS = QUICK ? ['perseverance'] : RV.R.reg.order, EXS = [1, 2, 5], GRAV = [['Mars gravity', 3.71], ['Earth gravity', 9.81]];
const traits = { soil: 0.45, dust: 0.3 }, S = RV.R.reg.soils ? RV.R.reg.soils[SO.groundClass(traits)] : undefined;

// drawn ground (unscaled) at world (wx, wz), from the detail patch's or the tile's own vertex buffer and triangles (same as the old test)
const meshH = (G, wx, wz) => {
  if (G.dp) { const d = G.dp, U = G.U, fx = (wx + G.half) / U.dx - d.j0, fz = (wz + G.half) / U.dx - d.i0; if (fx >= 0 && fz >= 0 && fx <= d.n && fz <= d.n) { const P = G.dpMesh.geometry.attributes.position.array, m = d.n + 1, bb = Math.min(m - 2, Math.floor(fx)), a = Math.min(m - 2, Math.floor(fz)), u = fx - bb, w = fz - a, y = k => P[k * 3 + 1], v00 = a * m + bb, v10 = v00 + m, v01 = v00 + 1, v11 = v10 + 1; return { y: u + w <= 1 ? y(v00) + (y(v01) - y(v00)) * u + (y(v10) - y(v00)) * w : y(v11) + (y(v10) - y(v11)) * (1 - u) + (y(v01) - y(v11)) * (1 - w), st: 1 }; } }
  const U = G.U, x = wx + G.half, z = wz + G.half, Cc = G.C, ti = Math.min(G.T - 1, Math.max(0, Math.floor(z / (Cc * U.dx)))), tj = Math.min(G.T - 1, Math.max(0, Math.floor(x / (Cc * U.dx))));
  const T = G.tiles[ti * G.T + tj], g = T.mesh.geometry, P = g.attributes.position.array, st = g.userData.s, m = g.userData.m;
  const fx = (x - T.j0 * U.dx) / (st * U.dx), fz = (z - T.i0 * U.dx) / (st * U.dx), bb = Math.min(m - 2, Math.max(0, Math.floor(fx))), a = Math.min(m - 2, Math.max(0, Math.floor(fz))), u = fx - bb, w = fz - a, y = k => P[k * 3 + 1], v00 = a * m + bb, v10 = v00 + m, v01 = v00 + 1, v11 = v10 + 1;
  return { y: u + w <= 1 ? y(v00) + (y(v01) - y(v00)) * u + (y(v10) - y(v00)) * w : y(v11) + (y(v10) - y(v11)) * (1 - u) + (y(v01) - y(v11)) * (1 - w), st };
};

for (const id of ROVERS) {
  const build = RV.R.build.id === id ? RV.R.build : null; if (!build) RV.selectRover(id);
  const par = RV.R.cfg, rover = await RV.createInstance(par);
  if (RV.R.modelError) { check(false, `${id}: model loads`, RV.R.modelError); continue; }
  const v = new THREE.Vector3(), M4 = new THREE.Matrix4();
  // independent wheel point sets: outer vertices (radius >= 60 % of the largest) of every wheel mesh, in wheel-node coordinates
  const wheels = rover.wheels.filter(w => w.node.visible).map(w => { rover.root.updateMatrixWorld(true); const inv = M4.clone().copy(w.node.matrixWorld).invert(), pts = []; let rmax = 0; const all = [];
    w.node.traverse(o => { if (!o.isMesh) return; const m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld), P = o.geometry.attributes.position; for (let k = 0; k < P.count; k++) { v.fromBufferAttribute(P, k).applyMatrix4(m); const rr = Math.hypot(v.y * w.node.scale.y, v.z * w.node.scale.z); all.push([v.x, v.y, v.z, rr]); if (rr > rmax) rmax = rr; } });
    const outer = all.filter(q => q[3] >= 0.6 * rmax), step = Math.max(1, Math.floor(outer.length / 400)), full = []; for (let k = 0; k < outer.length; k++) { full.push(outer[k][0], outer[k][1], outer[k][2]); if (k % step === 0) pts.push(outer[k][0], outer[k][1], outer[k][2]); } return { w, pts: new Float32Array(pts), full: new Float32Array(full) }; });
  if (!wheels.length) { check(false, `${id}: wheels found`); continue; }
  // drawn wheel size: the old bug (node.scale.set(kw, kr, kr) over the dequantization scale) drew wheels about 4x too big
  { rover.root.updateMatrixWorld(true); const box = new THREE.Box3(); wheels[0].w.node.traverse(o => { if (o.isMesh) box.expandByObject(o); }); const d = box.max.y - box.min.y;
    check(Math.abs(d / (2 * par.wheel_radius_m) - 1) < 0.25, `${id}: drawn wheel diameter matches the config`, `${d.toFixed(3)} m drawn vs ${(2 * par.wheel_radius_m).toFixed(3)} m`); }
  for (const [gname, patch, grav = GRAV] of GROUNDS) {
    const scene = new THREE.Scene(), mat = new THREE.MeshBasicMaterial(), ground = new Ground(scene, patch, mat, mat, { k: 0.03 });
    for (const [side, g] of grav) {
      const sim = new DR.DriveSim(patch, par, { g, mu: frictionFromSoil(traits.soil), soil: traits.soil, mass: par.mass_kg, S });
      const poses = EXS.map(() => ({ init: false })), stat = EXS.map(() => ({ minC: Infinity, maxC: -Infinity, frames: 0, bad: 0, high: 0, hang: 0, strideMax: 0, first: null, rechecked: 0 }));
      const sides = EXS.map((ex, e) => ({ patch, rover, pose: poses[e], tracks: null }));
      const steerAt = sec => sec < 15 ? 0 : sec < 25 ? 0.5 : sec < 35 ? 0 : sec < 45 ? -0.6 : 0, svMax = C.sinkVisible(1e9, par.wheel_radius_m);
      for (let fr = 0; fr <= 3600; fr++) {
        if (fr) sim.advance(1 / 60, 25, { throttle: 1, steer: steerAt(fr / 60), brake: 0 });
        const sink = sim.drag ? sim.drag.z || 0 : 0, sv = C.sinkVisible(sink, par.wheel_radius_m), half = patch.size / 2;
        ground.update(new THREE.Vector3(sim.x - half, 1e4, sim.z - half), false, [[sim.x - half, sim.z - half]]);
        for (let e = 0; e < EXS.length; e++) {
          const ex = EXS[e]; ground.setExag(1);   // heights are compared unscaled times ex, as in the old test
          C.poseOnGround(sides[e], sim.x, sim.z, sim.psi, { par, ex, dt: 1 / 60, snap: fr === 0, sink, wheelAng: sim.wheelAng, moving: false });
          rover.root.updateMatrixWorld(true); const st = stat[e]; st.frames++;
          for (const { w, pts: sub, full } of wheels) {
            const el = w.node.matrixWorld.elements, lowest = pts => { let lo = Infinity; for (let k = 0; k < pts.length; k += 3) { const x = pts[k], y = pts[k + 1], z = pts[k + 2], wx = el[0] * x + el[4] * y + el[8] * z + el[12], wy = el[1] * x + el[5] * y + el[9] * z + el[13], wz = el[2] * x + el[6] * y + el[10] * z + el[14], mh = meshH(ground, wx, wz); if (mh.st > st.strideMax) st.strideMax = mh.st; const c = wy - mh.y * ex; if (c < lo) lo = c; } return lo; };
            let lo = lowest(fr % 10 ? sub : full);
            if (fr % 10 && (lo < -sv - 0.002 || (!w.hanging && lo > 0.05))) { lo = lowest(full); st.rechecked++; }   // the subset can miss the lowest vertex on rough ground: confirm with every vertex before counting a failure
            if (lo < st.minC) st.minC = lo; if (lo > st.maxC && !w.hanging) st.maxC = lo;
            if (lo < -sv - 0.002) { st.bad++; if (!st.first) st.first = { fr, wheel: w.name, lo: +lo.toFixed(4), sinkMm: +(sv * 1000).toFixed(1), hanging: w.hanging, x: +sim.x.toFixed(2), z: +sim.z.toFixed(2) }; }
            if (!w.hanging && lo > 0.05) st.high++; if (w.hanging) st.hang++;
          }
        }
      }
      for (const [e, st] of stat.entries()) {
        if (st.first) log('      first frame below: ' + JSON.stringify(st.first));
        check(st.bad === 0 && st.high === 0 && st.strideMax === 1, `${gname} ground, ${side}, ${id}, Vertical x ${EXS[e]}: wheels rest on the drawn ground for ${st.frames} frames (${sim.dist.toFixed(1)} m driven)`,
          `lowest wheel point minus ground: min ${(st.minC * 1000).toFixed(1)} mm (allowed -${(svMax * 1000).toFixed(1)} mm at most, the clamped sinkage), max in contact ${(st.maxC * 1000).toFixed(1)} mm; frames below ${st.bad}, above 5 cm ${st.high}; hanging wheel-frames ${st.hang}; subset results rechecked with every vertex ${st.rechecked}; mesh stride under wheels ${st.strideMax}`);
      }
    }
    ground.dispose();
  }
  rover.dispose();
}
log(fails ? `\n${fails} of ${checks} FAILED` : `\nall ${checks} passed`);
fs.writeFileSync(new URL(QUICK ? './contact_check_output_partial.txt' : './contact_check_output.txt', import.meta.url), out.join('\n') + '\n');
process.exit(fails ? 1 : 0);
