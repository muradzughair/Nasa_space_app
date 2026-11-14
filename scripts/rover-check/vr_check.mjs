// VR check: vr.js with a mocked WebXR (navigator.xr, the session and renderer.xr), no headset and no browser.
// Run: node --import ./scripts/rover-check/ts-resolve.mjs scripts/rover-check/vr_check.mjs     (exit code 1 on any failure; output: vr_check_output.txt)
//
// What it checks, on two different grounds as Site View opens them by default (target ground left, Earth ground right):
//   - "View in VR" appears when immersive-vr is supported, and a "!" instead when it is not;
//   - entering VR: the shared renderer presents through renderer.xr with renderer.setAnimationLoop, the normal loop stands still, the vertical
//     exaggeration is 1, the scissor (two-pane clipping) is off, shadows use the vr profile, and the target ground is shown with its label;
//   - in VR: the loop draws the shown side's scene from the headset camera; left Y switches to the Earth ground (scene and label) and back,
//     keeping the user at the same spot relative to the rover; right A plays / pauses; the right stick changes speed; left X changes the view
//     mode; the wrist menu turns the slip rings on; the data panel shows the shown side's live values;
//   - leaving VR: the animation loop is cleared, renderer.xr is off, the VR objects leave the scenes, and the normal view comes back exactly:
//     the user's exaggeration, the two cameras, the scissor, the two-pane layout (both sides, same order), the shadows and the normal loop.
import fs from 'node:fs';
const mem = new Map(); globalThis.localStorage = { getItem: k => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, String(v)), removeItem: k => mem.delete(k) };
globalThis.window = globalThis; globalThis.self = globalThis; globalThis.location = { search: '' };
const fakeEl = (extra = {}) => ({ style: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, innerHTML: '', ...extra });
globalThis.document = { querySelector: () => null, addEventListener() {}, removeEventListener() {}, createElementNS: () => fakeEl(), createElement: () => fakeEl({ getContext: () => null }), getElementById: () => null };
let rafId = 100; const rafCalls = [];
globalThis.requestAnimationFrame = fn => { rafCalls.push(fn); return ++rafId; }; globalThis.cancelAnimationFrame = () => {};

const THREE = await import('../../src/rover/three.js');
const { makePatch, hashStr, mulberry32 } = await import('../../src/rover/terrain.js');
const VR = await import('../../src/rover/vr.js');
const Q = await import('../../src/rover/quality.js');

const out = []; let fails = 0, checks = 0;
const log = (...a) => { const s = a.join(' '); console.log(s); out.push(s); };
const check = (ok, what, extra = '') => { checks++; if (!ok) fails++; log(`${ok ? 'PASS' : 'FAIL'}  ${what}${extra ? '  (' + extra + ')' : ''}`); };

// ---- two different grounds in the shape Site View uses (2 km patch, fine grid, context ring)
function ground(id, amp) {
  const M = 129, size = 2000, dx = size / (M - 1), rng = mulberry32(hashStr(id)), h = new Float32Array(M * M);
  for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) h[i * M + j] = amp * (Math.sin(j * dx / 180) + Math.cos(i * dx / 260)) + rng() * 0.2;
  let mn = Infinity; for (const v of h) mn = Math.min(mn, v); for (let k = 0; k < h.length; k++) h[k] -= mn;
  const n = 33, hc = new Float32Array(n * n).fill(amp);
  return makePatch(id, 65, { M, h, size }, { n, size: 10000, h: hc }, { synthetic_fine: false, missing: [] });
}
function run(n, psi, slip) {   // the arrays sim.js analyze() returns, as many as vr.js reads
  const A = { n, x: new Float32Array(n), z: new Float32Array(n), psi: new Float32Array(n).fill(psi), tilt: new Float32Array(n).fill(4.2), slip: new Float32Array(n).fill(slip), sink: new Float32Array(n).fill(0.012),
    pitch: new Float32Array(n).fill(2), roll: new Float32Array(n).fill(-1), v: new Float32Array(n).fill(0.04), E: new Float32Array(n), s: new Float32Array(n), t: new Float32Array(n), blocked: new Uint8Array(n) };
  for (let k = 0; k < n; k++) { A.x[k] = 300 + k * 10 * Math.cos(psi); A.z[k] = 1000 + k * 10 * Math.sin(psi); A.s[k] = k * 10; A.t[k] = k * 250; A.E[k] = k * 15000; }
  A.blocked[n - 5] = 1;
  return A;
}
function side(key, body, patch, g, title, A) {
  const scene = new THREE.Scene(), root = new THREE.Group(), sun = new THREE.DirectionalLight(), sky = new THREE.Object3D(), marker = new THREE.Object3D();
  scene.add(root, sun, sun.target, sky, marker); sun.shadow.mapSize.set(2048, 2048); marker.visible = true;
  const wheels = [0, 1, 2, 3].map(k => { const node = new THREE.Object3D(); node.position.set(k < 2 ? 1 : -1, 0.3, k % 2 ? 1 : -1); root.add(node); return { node, name: 'w' + k }; });
  const s = { key, same: false, body, patch, g, title, scene, sun, sky, marker, rover: { root, wheels }, ground: { updates: 0, update() { s.ground.updates++; return false; }, rocks: null } };
  s.pose = A; return s;
}
const half = 1000, patchT = ground('tgt_test', 40), patchE = ground('pt_test', 15);
const A0 = run(120, 0.3, 6), A1 = run(120, -0.8, 25);
const sides = [side('target', 'mars', patchT, 3.71, 'Mars ground: Jezero Crater · 3.71 m/s²', A0), side('earth', 'earth', patchE, 9.81, 'Earth: Test place · 9.81 m/s²', A1)];
const cams = sides.map((s, i) => { const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 60000); camera.position.set(100 + i, 300, 400); return { camera, controls: { target: new THREE.Vector3(5, 0, 7) } }; });

// ---- mocked WebXR: renderer.xr, the session, two controllers with xr-standard gamepads
const listeners = {}, session = { enabledFeatures: ['local-floor'], inputSources: [],
  addEventListener(t, f) { (listeners[t] ||= []).push(f); }, removeEventListener(t, f) { listeners[t] = (listeners[t] || []).filter(x => x !== f); },
  requestReferenceSpace: async () => ({}), end: async () => { renderer.xr.isPresenting = false; (listeners.end || []).slice().forEach(f => f({})); } };
const pad = () => ({ buttons: Array.from({ length: 7 }, () => ({ pressed: false, value: 0 })), axes: [0, 0, 0, 0] });
const ctrls = [new THREE.Group(), new THREE.Group()], grips = [new THREE.Group(), new THREE.Group()], pads = { left: pad(), right: pad() };
const renderer = { loop: null, scissor: true, rendered: [],
  xr: { enabled: false, isPresenting: false, ref: null, setReferenceSpaceType(t) { this.ref = t; }, setFoveation() {}, getController: i => ctrls[i], getControllerGrip: i => grips[i],
    setSession: async s => { renderer.xr.session = s; renderer.xr.isPresenting = true; ctrls.forEach((c, i) => c.dispatchEvent({ type: 'connected', data: { handedness: i ? 'right' : 'left', gamepad: i ? pads.right : pads.left } })); } },
  setAnimationLoop(fn) { this.loop = fn; }, setScissorTest(b) { this.scissor = b; }, render(scene, cam) { this.rendered.push({ scene, cam }); } };
const xr = { isSessionSupported: async m => m === 'immersive-vr', requestSession: async () => session };

// ---- Site View as vr.js sees it (site.js vrHooks), with the same effects on V
const V = { open: true, drive: null, sides, cams, runs: { A: [A0, A1] }, u: 0.3, playing: false, speed: 1, exag: 2.5, renderer, raf: 7, vr: null, sunV: new THREE.Vector3(0.3, 0.8, 0.2).normalize(), layout: 'two panes' };
const calls = { exag: [], resume: 0, togglePlay: 0, restart: 0 };
const slot = fakeEl({ querySelector: sel => (sel === '#vrBtn' ? slot.btn : null), closest: () => site, btn: { onclick: null } });
const site = fakeEl({ querySelector: () => site.noteEl, insertAdjacentHTML(_, html) { site.noteEl = fakeEl({ html, remove() { site.noteEl = null; }, querySelector: () => ({ onclick: null }) }); }, noteEl: null });
const applySide = s => { s.sun.shadow.mapSize.set(2048, 2048); };
const hooks = { get V() { return V; }, slot: () => slot, siteNote: m => log('note: ' + m),
  advancePlayback: dt => { if (V.playing) V.u = Math.min(1, V.u + dt * V.speed / 75); sides.forEach((s, i) => { const A = V.runs.A[i], k = Math.round(V.u * (A.n - 1)); s.rover.root.position.set(A.x[k] - half, 3, A.z[k] - half); s.rover.root.rotation.y = -A.psi[k]; s.rover.root.updateMatrixWorld(true); }); },
  togglePlay: () => { calls.togglePlay++; V.playing = !V.playing; }, restart: () => { calls.restart++; V.u = 0; V.playing = true; }, setSpeed: sp => { V.speed = sp; },
  setExag: ex => { calls.exag.push(ex); V.exag = ex; }, setShadowSize: (light, n) => light.shadow.mapSize.set(n, n), applySide, wake() {},
  title: s => s.title, startSide: () => 0,
  resume: () => { calls.resume++; renderer.setScissorTest(true); sides.forEach(applySide); V.raf = requestAnimationFrame(() => {}); } };
hooks.advancePlayback(0);

// ---- the button
Object.defineProperty(globalThis.navigator, 'xr', { value: { isSessionSupported: async () => false }, configurable: true });
await VR.initVR(hooks);
check(slot.innerHTML.includes('info-btn') && slot.innerHTML.includes('Meta Quest') && !slot.innerHTML.includes('View in VR'), 'without a headset: no "View in VR", a "!" instead');
Object.defineProperty(globalThis.navigator, 'xr', { value: xr, configurable: true });
await VR.initVR(hooks);
check(slot.innerHTML.includes('View in VR'), 'with immersive-vr supported: "View in VR" in the top bar');

// ---- enter
const camBefore = cams.map(c => [c.camera.position.toArray(), c.controls.target.toArray()]), sidesBefore = sides.slice();
const ok = await VR.enterVR(xr);
const st = () => VR.vrState(), step = (n = 1) => { for (let k = 0; k < n; k++) renderer.loop(performance.now()); };
check(ok && V.vr && renderer.xr.enabled && renderer.xr.isPresenting && typeof renderer.loop === 'function', 'enter VR: renderer.xr presents and drawing runs through renderer.setAnimationLoop');
check(V.exag === 1 && calls.exag[0] === 1, 'in VR the vertical exaggeration is 1 (real scale)', `exag ${V.exag}`);
check(renderer.scissor === false, 'in VR the two-pane scissor is off');
check(sides.every(s => s.sun.shadow.mapSize.x === Q.vrLevel().shadow) && Q.vrLevel().shadow <= 1024, 'in VR the shadow map follows the vr profile', `${sides[0].sun.shadow.mapSize.x} px`);
check(renderer.xr.ref === 'local-floor', 'reference space: local-floor (standing, floor at the ground)');
step(3);
const last = () => renderer.rendered[renderer.rendered.length - 1];
check(st().side === 0 && last().scene === sides[0].scene && st().scene === sides[0].scene && st().label === sides[0].title, 'starts on the target ground: its scene is drawn and the label reads its title', st().label);
check(last().cam.parent && last().cam.parent.name === 'vrRig', 'drawn from the headset camera inside the VR rig');
check(sides[0].ground.updates >= 3, 'terrain level of detail updated from the headset each frame');
check(st().card === true, 'first VR start: the controls card is shown');

// stand on site: beside the route, at ground level, facing the rover
{ const rig = st().scene.getObjectByName('vrRig'), rp = sides[0].rover.root.position, gy = patchT && rig.position.y;
  const d = Math.hypot(rig.position.x - rp.x, rig.position.z - rp.z);
  check(st().mode === 'stand' && d > 5 && d < 60 && Math.abs(gy - (rp.y - 3 + 0)) < 400, 'stand on site: placed beside the route near the rover', `${d.toFixed(1)} m from the rover`); }

// ---- input: press and release a button over two frames
const press = async (hand, i, frames = 1) => { pads[hand].buttons[i].pressed = true; step(frames); pads[hand].buttons[i].pressed = false; step(1); };
await press('right', 4);   // A: close the card (face button) and play
check(st().card === false && localStorage.getItem('rsim.vr.controlsSeen.v1') === '1', 'the controls card closes and is remembered');
check(V.playing && calls.togglePlay === 1, 'right A: play / pause');
// keep the user at the same spot relative to the rover when switching
const rel = i => { const rig = sides[i].scene.getObjectByName('vrRig'); rig.updateMatrixWorld(true); const cam = rig.children[0], h = new THREE.Vector3().setFromMatrixPosition(cam.matrixWorld), rp = sides[i].rover.root.position, A = V.runs.A[i], k = Math.round(V.u * (A.n - 1)), fx = Math.cos(A.psi[k]), fz = Math.sin(A.psi[k]), dx = h.x - rp.x, dz = h.z - rp.z; return [dx * fx + dz * fz, dx * fz - dz * fx]; };
V.playing = false; step(1);
const r0 = rel(0);
await press('left', 5);    // Y: switch ground
const r1 = rel(1);
check(st().side === 1 && last().scene === sides[1].scene && st().label === sides[1].title, 'left Y: switches to the Earth ground (scene and label)', st().label);
check(Math.abs(r0[0] - r1[0]) < 0.05 && Math.abs(r0[1] - r1[1]) < 0.05, 'switching keeps the user at the same spot relative to the rover', `along ${r0[0].toFixed(2)} -> ${r1[0].toFixed(2)} m, across ${r0[1].toFixed(2)} -> ${r1[1].toFixed(2)} m`);
check(st().panel.startsWith('Earth ground') && st().panel.includes('25 %'), 'the data panel shows the shown side', st().panel.split('\n').slice(0, 4).join(' | '));
await press('left', 5);
check(st().side === 0 && last().scene === sides[0].scene && st().label === sides[0].title, 'left Y again: back to the target ground');
const uA = V.u; V.playing = true; step(5); check(V.u > uA, 'both sides keep playing on the same timeline'); V.playing = false;
await press('left', 4);    // X: view mode
check(st().mode === 'follow', 'left X: follow mode');
{ const rig = st().scene.getObjectByName('vrRig'); step(30); check(Math.abs(rig.rotation.x) < 1e-9 && Math.abs(rig.rotation.z) < 1e-9, 'follow keeps the horizon level (no pitch or roll of the view)'); }
await press('left', 4); check(st().mode === 'stand', 'left X again: stand on site');
pads.right.axes[2] = 1; step(1); pads.right.axes[2] = 0; step(1); check(V.speed === 2, 'right stick right: faster (1x -> 2x)');
pads.right.axes[2] = -1; step(1); pads.right.axes[2] = 0; step(1); pads.right.axes[2] = -1; step(1); pads.right.axes[2] = 0; step(1); check(V.speed === 0.5, 'right stick left twice: slower (2x -> 0.5x)');
await press('right', 5); check(calls.restart === 1 && V.u < 0.01 && V.playing, 'right B: restart (back to the start, playing)', `u ${V.u.toFixed(4)}`); V.playing = false;
VR.vrAction('rings'); step(1); check(st().rings === true, 'wrist menu: slip rings on');
V.u = (A0.n - 5) / (A0.n - 1); V.playing = false; step(2); await new Promise(r => setTimeout(r, 120)); step(1);
check(st().panel.includes('STUCK'), 'the data panel warns STUCK where the run is blocked');

// ---- leave
await VR.exitVR();
const inScene = sides.some(s => s.scene.getObjectByName('vrRig') || s.scene.getObjectByName('vrHud'));
check(!V.vr && !VR.vrState() && renderer.loop === null && renderer.xr.enabled === false, 'exit VR: animation loop cleared, renderer.xr off');
check(!inScene, 'exit VR: the VR objects have left both scenes');
check(V.exag === 2.5 && calls.exag[calls.exag.length - 1] === 2.5, 'exit VR: the vertical exaggeration is restored', `${V.exag}`);
check(cams.every((c, i) => JSON.stringify([c.camera.position.toArray(), c.controls.target.toArray()]) === JSON.stringify(camBefore[i])), 'exit VR: both cameras are where they were');
check(renderer.scissor === true && calls.resume === 1 && V.sides.length === 2 && V.sides.every((s, i) => s === sidesBefore[i]) && V.layout === 'two panes', 'exit VR: scissor back, two-pane layout (both sides, same order), normal loop resumed');
check(sides.every(s => s.sun.shadow.mapSize.x === 2048), 'exit VR: shadows back to the normal quality level');
check(site.noteEl === null, 'exit VR: the "Viewing in VR" note leaves the page');
// a second session works, and starts without the card
renderer.rendered.length = 0; await VR.enterVR(xr); step(2);
check(VR.vrState() && VR.vrState().card === false && last().scene === sides[0].scene, 'a second VR session starts again, without the controls card');
await VR.exitVR(); check(!V.vr && V.exag === 2.5, 'and ends cleanly');

log(fails ? `\n${fails} of ${checks} FAILED` : `\nall ${checks} passed`);
fs.writeFileSync(new URL('./vr_check_output.txt', import.meta.url), out.join('\n') + '\n');
process.exit(fails ? 1 : 0);
