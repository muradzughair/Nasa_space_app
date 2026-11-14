// Drive mode: pick one ground, go full screen and drive the rover freely with a game controller (or the keyboard).
// The other ground runs in the background with the same control inputs (picture-in-picture and a column of differences in the instrument panel).
// Ported from the old app/js/drivemode.js. Changed: the panes are the open Earth ground at one or two gravities (site.js), so the chooser lists
// those panes, and with a single pane there is no comparison view. The physics (drive.js), contact (contact.js) and input (input.js) are unchanged.
// Physics: drive.js. Input: input.js. Scenes, terrain, rovers and the renderer are the ones Site View already built.
import * as THREE from './three.js';
import { D } from './data.js';
import { worldH } from './terrain.js';
import { poseOnGround } from './contact.js';
import { frictionFromSoil } from './sim.js';
import { DriveSim, DEMO_SCALES } from './drive.js';
import { createInput, MAPPING } from './input.js';
import { refreshAfterDrive, setSitePlaying, siteHelpers, siteQuality } from './site.js';
import { motion } from './globeview.js';
import { R as RS } from './rovers.js';
import { mountRoverLine } from './roverui.js';
import { info } from './info.js';

const $ = id => document.getElementById(id);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const COL = ['#38bdf8', '#fb923c'];
const CAMS = ['Chase', 'Low follow', 'Top down'];
const M = { active: false, busy: false, V: null, sims: [], main: 0, other: 1, input: null, scale: 10, cam: 0, pip: true, detailed: true, paused: false, equalLoad: false, realT: 0, saved: [], camState: [], dust: [], orbit: [0, 0], orbitIdle: 0, thr: 0, str: 0, hudT: 0, toastT: 0, fs: false, showSheet: false, rumble: false, padSeen: 0, frameN: 0, perf: { phys: 0, dust: 0, hud: 0, draw: 0, frame: 0 } };
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _X = new THREE.Vector3(), _Y = new THREE.Vector3(), _Z = new THREE.Vector3(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _t = new THREE.Vector3();
const wait = ms => new Promise(r => setTimeout(r, ms * motion.scale));
const roverPar = () => RS.cfg;   // the effective rover config shared with Site View (rovers.js)
const roverName = () => roverPar().name.replace(/\s*\(.*?\)\s*/g, ' ').trim();
const perf = (k, v) => { M.perf[k] += (v - M.perf[k]) * 0.05; };   // moving averages in ms, read by the tests
const compass = b => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(b / 45) % 8];

// ---------------------------------------------------------------- chooser (D1)
export function openChooser(V) {
  M.V = V; if (M.active || !V.runs) return;
  const place = V.ctx.place;
  const paintCards = () => {
  const par = roverPar(), card = (i, kind, name, line, g) => `<button class="rcard dc-pick" data-i="${i}" style="--c:${COL[i]}"><div class="t"><span>${name}</span><span class="body">${kind}</span></div><div class="n">${line}</div><div class="dc-facts"><span>Gravity <b>${g} m/s&sup2;</b></span><span>Rover <b>${par.name}</b></span></div></button>`;
  $('dcCards').innerHTML = V.sides.map((s, i) => card(i, s.key === 'target' ? `${V.ctx.target.bodyName} gravity` : 'Earth gravity', place.name, s.key === 'target' ? `This Earth ground at the gravity of ${V.ctx.target.name}` : 'This Earth ground at its own gravity', s.g)).join('');
  $('dcCards').querySelectorAll('.dc-pick').forEach(b => { b.onclick = () => startDrive(+b.dataset.i); });
  };
  paintCards(); mountRoverLine($('dcRover'), paintCards);
  const m = $('driveChooser'); m.classList.remove('hidden'); $('dcCards').querySelector('.dc-pick').focus();
  $('dcClose').onclick = () => m.classList.add('hidden');
  m.onclick = e => { if (e.target === m) m.classList.add('hidden'); };
  m.onkeydown = e => { if (e.key === 'Escape') m.classList.add('hidden'); };
}

async function fade(to, ms = 260) { const f = $('dvFade'); f.style.transition = `opacity ${Math.max(30, ms * motion.scale)}ms ease`; f.style.opacity = to; f.classList.toggle('on', to > 0); await wait(ms + 30); }

async function startDrive(i) {
  const V = M.V; if (M.active || M.busy || !V) return; M.busy = true;
  $('driveChooser').classList.add('hidden');
  try { const r = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); if (r && r.then) r.then(() => { M.fs = true; }).catch(() => { M.fs = false; }); } catch (e) { M.fs = false; }   // from the click; if refused we fill the window instead
  setSitePlaying(false);
  await fade(1);
  M.main = i; M.other = V.sides.length > 1 ? 1 - i : -1;
  M.saved = V.cams.map(c => ({ p: c.camera.position.clone(), q: c.camera.quaternion.clone(), t: c.controls.target.clone() }));
  const par = roverPar();
  M.sims = V.sides.map(sd => new DriveSim(sd.patch, par, { g: sd.g, mu: +($('muE') || { value: frictionFromSoil(sd.soil) }).value, soil: sd.soil, mass: par.mass_kg, S: sd.S }));
  applyMass();
  V.sides.forEach(s => { s.marker.visible = false; s.line.visible = s.lineOn.visible = false; s.rover.root.visible = true; s.pose.init = false; });
  M.dust = V.sides.map((s, j) => makeDust(s, j));
  if (!M.input) M.input = createInput();
  M.input.start(); M.input.rumble = M.rumble; M.pipInit = false; if (M.other < 0) M.pip = false;
  M.lod = [false, false]; V.sides.forEach(sd => sd.tracks.reset()); siteHelpers.setExag(1);   // driving is always at true scale
  M.thr = M.str = 0; M.realT = 0; M.paused = false; M.orbit = [0, 0]; M.camState = [null, null]; M.hudT = 0; M.padSeen = 0; M.showSheet = false;
  $('site').classList.add('drive'); $('driveUI').classList.remove('hidden');
  buildUI(); setPip(M.pip); sheet(false);
  V.drive = { frame, exit };
  window.TERRA_DRIVE = M;
  document.addEventListener('fullscreenchange', onFs);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));   // let layout settle at the new size
  M.sims.forEach(s => s.reset()); placeAll(0.016, true); cameraAll(0.016, true);
  M.active = true; V.last = performance.now();
  await fade(0, 320); M.busy = false;
  setTimeout(() => $('dvHint').classList.add('dim'), 7000);
  $('dvStage').focus();
}

async function exit(immediate) {
  if (!M.active) return; const V = M.V; M.active = false; M.busy = true;
  if (!immediate) await fade(1);
  document.removeEventListener('fullscreenchange', onFs);
  if (document.fullscreenElement && document.exitFullscreen) { try { document.exitFullscreen(); } catch (e) { /* ignore */ } }
  M.input.stop(); V.drive = null; V.renderer.shadowMap.autoUpdate = true;
  M.dust.forEach(d => d.dispose()); M.dust = [];
  if (M.rt) { M.rt.dispose(); M.rt = null; } if (M.blit) { M.blit.m.dispose(); M.blit.scene.children[0].geometry.dispose(); M.blit = null; }
  siteQuality.applySide(V.sides[M.main]);   // back to the Site View shadow size
  $('site').classList.remove('drive'); $('driveUI').classList.add('hidden'); $('dvPip').classList.add('hidden');
  V.cams.forEach((c, i) => { const s = M.saved[i]; c.camera.position.copy(s.p); c.camera.quaternion.copy(s.q); c.controls.target.copy(s.t); c.controls.update(); c.anim = null; });
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  siteHelpers.setExag(V.exag); refreshAfterDrive(); V.chased = false;
  if (!immediate) await fade(0, 320); else { $('dvFade').style.opacity = 0; $('dvFade').classList.remove('on'); }
  M.busy = false; delete window.TERRA_DRIVE;
}
function onFs() { if (M.active && !document.fullscreenElement && M.fs) exit(); if (document.fullscreenElement) M.fs = true; }

function applyMass() {
  const par = roverPar(), gT = M.V.ctx.target.gravity, gE = D.meta.gravity.earth;
  M.sims.forEach((sim, j) => { sim.m = M.equalLoad && M.V.sides[j].key === 'earth' ? par.mass_kg * gT / gE : par.mass_kg; });
}

// ---------------------------------------------------------------- dust (ballistic, local gravity, no drag on the Moon)
function makeDust(side, j) {
  const N = 260, geo = new THREE.BufferGeometry(), pos = new Float32Array(N * 3), life = new Float32Array(N), vel = new Float32Array(N * 3), drag = [0, 0.15, 1.6][['moon', 'mars', 'earth'].indexOf(side.body)];
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aLife', new THREE.BufferAttribute(life, 1));
  const col = { moon: 0x9a9a9a, mars: 0xb5774e, earth: 0xa8916a }[side.body];
  const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uK: { value: 600 }, uCol: { value: new THREE.Color(col) } },
    vertexShader: 'attribute float aLife; varying float vL; uniform float uK; void main(){ vL=aLife; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize = aLife>0.0 ? uK*(0.16+0.5*(1.0-aLife))/max(1.0,-mv.z) : 0.0; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 uCol; varying float vL; void main(){ vec2 c=gl_PointCoord-0.5; float d=length(c)*2.0; if(d>1.0||vL<=0.0) discard; gl_FragColor=vec4(uCol, 0.42*vL*(1.0-d*d)); }' });
  const pts = new THREE.Points(geo, mat); pts.frustumCulled = false; pts.renderOrder = 6; side.scene.add(pts);
  let n = 0, acc = 0, seed = 12345 + j; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  return {
    mat, geo, pts,
    dispose() { side.scene.remove(pts); geo.dispose(); mat.dispose(); },
    clear() { life.fill(0); geo.attributes.aLife.needsUpdate = true; },
    update(dt, sim, scale, rover, par) {
      const g = sim.g, f = sim.fit, vis = Math.abs(sim.v) * scale, rate = (vis * 22 + sim.spin * 70 + (sim.sliding ? 50 : 0)) * (0.4 + M.V.ctx.traits.dust) * siteQuality.level().dust;
      acc += rate * dt; const half = sim.p.size / 2;
      while (acc >= 1) {
        acc -= 1; const k = n++ % N, wp = sim.W[Math.floor(rnd() * sim.W.length)], fx = f.fx, fz = f.fz, rx = f.rx, rz = f.rz;
        const x = sim.x + wp[0] * fx + wp[1] * rx, z = sim.z + wp[0] * fz + wp[1] * rz, y = worldH(sim.p, x - half, z - half) + par.wheel_radius_m * 0.4;
        const back = -Math.sign(sim.v || 1) * (0.25 * vis + 0.9 * sim.spin + 0.2), up = 0.5 + rnd() * 1.3, sd = (rnd() - 0.5) * 0.9;
        pos[k * 3] = x - half; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z - half;
        vel[k * 3] = fx * back + rx * sd; vel[k * 3 + 1] = up; vel[k * 3 + 2] = fz * back + rz * sd; life[k] = 1;
      }
      const decay = Math.exp(-drag * dt);
      for (let k = 0; k < N; k++) {
        if (life[k] <= 0) continue;
        vel[k * 3 + 1] -= g * dt; vel[k * 3] *= decay; vel[k * 3 + 1] *= decay; vel[k * 3 + 2] *= decay;
        pos[k * 3] += vel[k * 3] * dt; pos[k * 3 + 1] += vel[k * 3 + 1] * dt; pos[k * 3 + 2] += vel[k * 3 + 2] * dt;
        const gh = worldH(sim.p, pos[k * 3], pos[k * 3 + 2]);
        life[k] -= dt / 2.4; if (pos[k * 3 + 1] < gh) { pos[k * 3 + 1] = gh; vel[k * 3 + 1] = 0; vel[k * 3] *= 0.5; vel[k * 3 + 2] *= 0.5; life[k] -= dt * 1.5; }
      }
      geo.attributes.position.needsUpdate = true; geo.attributes.aLife.needsUpdate = true;
    },
  };
}

// ---------------------------------------------------------------- pose and camera
function placeAll(dt, snap) { M.sims.forEach((sim, j) => placeRover(j, sim, dt, snap)); }
function placeRover(j, sim, dt, snap) {
  // wheel contacts on the fine height grid, the same grid the physics samples; sinkage from the soil model lowers the wheels; tracks are laid behind (contact.js)
  poseOnGround(M.V.sides[j], sim.x, sim.z, sim.psi, { par: roverPar(), ex: 1, dt, snap, kq: 7, sink: sim.drag ? sim.drag.z || 0 : 0, wheelAng: sim.wheelAng, moving: Math.abs(sim.v) > 0.005 });
}
function cameraAll(dt, snap) { cameraFor(M.main, M.sims[M.main], dt, snap, M.V.cams[M.main].camera); if (M.other >= 0) cameraFor(M.other, M.sims[M.other], dt, snap, M.V.cams[M.other].camera); }
function cameraFor(j, sim, dt, snap, cam) {
  const par = roverPar(), L = par.wheelbase_m, s = M.V.sides[j], half = sim.p.size / 2, root = s.rover.root;
  const cs = M.camState[j] || (M.camState[j] = { psi: sim.psi, pos: new THREE.Vector3(), look: new THREE.Vector3(), init: false });
  let dpsi = sim.psi - cs.psi; dpsi = Math.atan2(Math.sin(dpsi), Math.cos(dpsi)); cs.psi += dpsi * (snap ? 1 : 1 - Math.exp(-dt * 3.2));
  const mode = M.cam, yaw = M.orbit[0], pit = M.orbit[1];
  const back = [3.4, 2.2, 0.7][mode] * L, up = [1.5, 0.55, 11][mode] * L, lookUp = [0.45, 0.35, 0][mode] * L, lookFwd = [1.0, 0.8, 0.0][mode] * L;
  const elev = clamp(Math.atan2(up, back) + pit, 0.06, 1.5), dist = Math.hypot(up, back), hh = Math.cos(elev) * dist, vv = Math.sin(elev) * dist;
  const ang = cs.psi + Math.PI + yaw;
  _a.set(root.position.x + Math.cos(ang) * hh, root.position.y + vv, root.position.z + Math.sin(ang) * hh);
  _b.set(root.position.x + Math.cos(cs.psi) * lookFwd, root.position.y + lookUp + L * 0.15, root.position.z + Math.sin(cs.psi) * lookFwd);
  const g = worldH(sim.p, _a.x, _a.z) + Math.max(0.55, 0.12 * L);                    // never below the terrain, never inside the ground
  if (_a.y < g) _a.y = g;
  const dx = _a.x - root.position.x, dz = _a.z - root.position.z, dy = _a.y - root.position.y, dd = Math.hypot(dx, dy, dz), minD = 1.9 * L;   // never inside the rover
  if (dd < minD) { const k = minD / Math.max(1e-3, dd); _a.set(root.position.x + dx * k, root.position.y + dy * k, root.position.z + dz * k); }
  if (!cs.init || snap) { cs.pos.copy(_a); cs.look.copy(_b); cs.init = true; }
  else { cs.pos.lerp(_a, 1 - Math.exp(-dt * 6)); cs.look.lerp(_b, 1 - Math.exp(-dt * 9)); const g2 = worldH(sim.p, cs.pos.x, cs.pos.z) + Math.max(0.55, 0.12 * L); if (cs.pos.y < g2) cs.pos.y = g2; }
  cam.position.copy(cs.pos); cam.lookAt(cs.look); cam.updateMatrixWorld();
}
function sunFor(j, target, ext) {
  const s = M.V.sides[j], size = s.patch.size, sc = s.sun.shadow.camera;
  s.sun.target.position.copy(target); s.sun.position.copy(target).addScaledVector(M.V.sunV, size * 1.6);
  if (Math.abs(sc.right - ext) > ext * 0.05) { sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 1; sc.far = size * 4; sc.updateProjectionMatrix(); s.sun.shadow.normalBias = ext * 0.0025; }
  s.sun.target.updateMatrixWorld();
}

// ---------------------------------------------------------------- UI
const ROWS = [
  // key, label, unit, basic?, compare?, floor (for the difference colour), format
  ['speed', 'Speed', 'm/s', true, true, 0.02, v => v.toFixed(3)],
  ['screen', 'On screen', 'm/s', false, true, 0.2, v => v.toFixed(2)],
  ['heading', 'Heading', '', true, false, 0, null],
  ['pitch', 'Pitch', '°', false, true, 4, v => v.toFixed(1)],
  ['roll', 'Roll', '°', false, true, 4, v => v.toFixed(1)],
  ['tilt', 'Tilt', '°', true, true, 4, v => v.toFixed(1)],
  ['ahead', 'Slope ahead', '°', false, true, 4, v => v.toFixed(1)],
  ['slip', 'Wheel slip', '%', true, true, 10, v => v.toFixed(0)],
  ['dist', 'Distance', 'm', false, true, 5, v => v.toFixed(1)],
  ['tsim', 'Time, simulated', '', false, false, 0, null],
  ['treal', 'Time, real', '', false, false, 0, null],
  ['power', 'Power', 'W', true, true, 20, v => v.toFixed(0)],
  ['energy', 'Energy used', 'Wh', false, true, 1, v => v.toFixed(2)],
  ['epm', 'Energy per metre', 'J/m', false, true, 80, v => v.toFixed(0)],
  ['sink', 'Sinkage', 'mm', false, true, 5, v => v.toFixed(1)],
  ['press', 'Ground pressure', 'kPa', false, true, 5, v => v.toFixed(1)],
];
const mmss = s => { s = Math.max(0, s); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), q = Math.floor(s % 60); return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(q).padStart(2, '0'); };
function names() { const V = M.V; return V.sides.map(s => ({ short: s.key === 'target' ? `${V.ctx.target.bodyName} gravity` : 'Earth gravity', name: V.ctx.place.name, g: s.g })); }

function buildUI() {
  const nm = names(), par = roverPar(), mn = nm[M.main], ot = nm[M.other] || mn;
  $('dvTop').innerHTML = `<div class="dv-id"><span class="dv-dot" style="background:${COL[M.main]}"></span><div><b>${mn.name}</b><small>${mn.short} &middot; g ${mn.g} m/s&sup2; &middot; ${roverName()}</small></div></div>
    <div class="dv-mid"><div class="seg small" id="dvScale" role="group" aria-label="Demo speed scale">${DEMO_SCALES.map(s => `<button data-s="${s}" aria-label="Demo speed ${s} times">x${s}</button>`).join('')}</div><span class="dv-lbl">Demo speed</span><span class="dv-sep"></span><button class="btn ghost small" id="dvCam" aria-label="Change camera">Camera: <b id="dvCamName"></b></button></div>
    <div class="dv-right"><span class="dv-pad" id="dvPad"></span><button class="btn ghost small" id="dvHelp" aria-label="Show the controls">Controls (H)</button><button class="btn small dv-exit" id="dvExit" aria-label="Exit drive mode">Exit (Circle)</button></div>`;
  $('dvScale').querySelectorAll('button').forEach(b => { b.onclick = () => setScale(+b.dataset.s); });
  $('dvCam').onclick = () => cycleCam(1); $('dvHelp').onclick = () => sheet(!M.showSheet); $('dvExit').onclick = () => exit();
  $('dvHud').innerHTML = `<div class="dv-hh"><span class="ph-title">Instruments</span><span class="dv-mode" id="dvModeTag"></span><button class="icon-btn" id="dvHudToggle" aria-label="Collapse the instrument panel" aria-expanded="true"><svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 8l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
    <div class="dv-hb" id="dvHb"><div class="dv-warns" id="dvWarns" aria-live="polite"></div>
    <table class="dv-tab"><thead><tr><th></th><th><span class="dv-dot" style="background:${COL[M.main]}"></span>${mn.short}</th><th class="cmp"><span class="dv-dot" style="background:${COL[M.other]}"></span>${ot.short}</th><th class="cmp">Diff</th></tr></thead><tbody id="dvRows">${ROWS.map(r => `<tr data-k="${r[0]}" data-basic="${r[3] ? 1 : 0}"><td>${r[1]}</td><td class="v"></td><td class="cmp o"></td><td class="cmp d"></td></tr>`).join('')}
    <tr data-k="battery" data-basic="1"><td>Battery</td><td class="v"></td><td class="cmp o"></td><td class="cmp d"></td></tr></tbody></table>
    <div class="dv-btns"><button class="btn ghost small" id="dvResync">${M.other >= 0 ? 'Resync both to start' : 'Back to the start'}</button>${M.other >= 0 ? info('The second rover gets the same moves at the other gravity. Their paths slowly drift apart, so Resync puts both back at the start.', 'About the comparison rover') : ''}<button class="tog" id="dvRumble" aria-pressed="false" title="Needs a controller with a vibration motor (Chrome or Edge)"><i class="sw"></i>Vibration</button>${M.other >= 0 && M.V.sides.some(sd => sd.key === 'earth') ? '<button class="tog" id="dvEq" aria-pressed="false" title="Give the Earth rover the mass that reproduces the target wheel load"><i class="sw"></i>Equal wheel load on Earth</button>' : ''}</div></div>`;
  $('dvHudToggle').onclick = () => { const c = $('dvHud').classList.toggle('collapsed'); $('dvHudToggle').setAttribute('aria-expanded', c ? 'false' : 'true'); };
  $('dvResync').onclick = resetAll;
  const tg = (id, on, fn) => { const b = $(id); if (!b) return; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.onclick = () => { const v = b.getAttribute('aria-pressed') !== 'true'; b.classList.toggle('on', v); b.setAttribute('aria-pressed', v); fn(v); }; };
  tg('dvRumble', M.rumble, v => { M.rumble = v; M.input.rumble = v; toast(v ? 'Vibration on (needs a controller with a rumble motor)' : 'Vibration off'); });
  tg('dvEq', M.equalLoad, v => { M.equalLoad = v; applyMass(); toast(v ? 'Earth rover mass reduced to the target wheel load' : 'Same rover mass on both grounds'); });
  $('dvFoot').innerHTML = `<span>${mn.name}, ${mn.short} g ${mn.g} m/s&sup2;</span><span>Rover ${roverName()}</span><span id="dvMass"></span><span class="dv-phys">Physics ${info('A quick estimate, not an exact rover simulation. The soil is kept simple, and the power and battery figures are approximate.', 'About the physics')}</span>`;
  $('dvPipLabel').innerHTML = M.other >= 0 ? `<span class="dv-dot" style="background:${COL[M.other]}"></span>${ot.short}: same inputs, same ground, other gravity` : '';
  $('dvSheet').innerHTML = `<h3>Controls</h3><table>${MAPPING.map(r => `<tr><td><kbd>${r[0]}</kbd></td><td>${r[1]}</td><td class="kb">${r[2]}</td></tr>`).join('')}</table><p class="hint">Connect a DualSense (or any standard gamepad) by USB-C or Bluetooth, then press a button. Adaptive triggers are not available in the browser; vibration is optional.</p><button class="btn ghost small" id="dvSheetClose">Close (H)</button>`;
  $('dvSheetClose').onclick = () => sheet(false);
  $('dvHint').classList.remove('dim');
  $('dvHud').classList.remove('collapsed');
  paintTop(); paintHudMode();
}
function paintTop() {
  $('dvScale').querySelectorAll('button').forEach(b => b.classList.toggle('active', +b.dataset.s === M.scale));
  $('dvCamName').textContent = CAMS[M.cam];
}
function paintHudMode() { $('dvHud').classList.toggle('basic', !M.detailed); $('dvHud').classList.toggle('nocmp', !M.pip); $('dvModeTag').textContent = M.detailed ? 'Detailed' : 'Basic'; }
function sheet(on) { M.showSheet = on; $('dvSheet').classList.toggle('hidden', !on); }
function setPip(on) { if (M.other < 0) on = false; M.pip = on; $('dvPip').classList.toggle('hidden', !on); if ($('dvHud').innerHTML) paintHudMode(); }
function setScale(s) { M.scale = s; paintTop(); toast(`Demo speed x${s}: simulated time runs ${s} times faster than real time; forces are unchanged`); }
function cycleCam(d) { M.cam = (M.cam + d + CAMS.length) % CAMS.length; paintTop(); toast('Camera: ' + CAMS[M.cam]); }
function resetAll() { M.sims.forEach(s => s.reset()); M.dust.forEach(d => d.clear()); M.V.sides.forEach(sd => sd.tracks.reset()); M.realT = 0; M.thr = M.str = 0; placeAll(0.016, true); cameraAll(0.016, true); toast(M.other >= 0 ? 'Both rovers reset to the start' : 'Rover reset to the start'); }
function toast(msg, ms = 3200) { const b = $('dvBanner'); b.textContent = msg; b.classList.remove('hidden'); b.classList.remove('alert'); M.toastT = performance.now() + ms; M.toastKeep = false; }
function alertBanner(msg) { const b = $('dvBanner'); b.textContent = msg; b.classList.remove('hidden'); b.classList.add('alert'); M.toastKeep = true; }

function diffClass(a, b, floor) { const d = Math.abs(a - b), rel = d / (Math.max(Math.abs(a), Math.abs(b)) + floor); return rel < 0.1 ? 'd0' : rel < 0.35 ? 'd1' : 'd2'; }
function updateHud() {
  const R = M.sims.map(s => s.readout()), a = R[M.main], b = R[M.other] || a, par = roverPar();
  const vals = r => ({ speed: r.speed, screen: r.speed * M.scale, pitch: r.pitch, roll: r.roll, tilt: r.tilt, ahead: r.slopeAhead, slip: r.slip * 100, dist: r.dist, power: r.power, energy: r.energyWh, epm: r.epm, sink: r.sinkMm, press: r.pressKPa, battery: r.battery * 100 });
  const A = vals(a), B = vals(b), cmp = M.pip;
  const set = (el, t) => { if (el.textContent !== t) el.textContent = t; };
  $('dvRows').querySelectorAll('tr').forEach(tr => {
    const k = tr.dataset.k, row = ROWS.find(r => r[0] === k), v = tr.children[1], o = tr.children[2], d = tr.children[3];
    if (k === 'heading') { set(v, `${String(Math.round(a.bearing) % 360).padStart(3, '0')}° ${compass(a.bearing)}`); set(o, `${String(Math.round(b.bearing) % 360).padStart(3, '0')}° ${compass(b.bearing)}`); set(d, ''); return; }
    if (k === 'tsim') { set(v, mmss(a.simT)); set(o, mmss(b.simT)); set(d, ''); return; }
    if (k === 'treal') { set(v, mmss(M.realT)); set(o, ''); set(d, ''); return; }
    if (k === 'battery') {
      set(v, A.battery.toFixed(0) + '%'); set(o, B.battery.toFixed(0) + '%'); set(d, (B.battery - A.battery >= 0 ? '+' : '') + (B.battery - A.battery).toFixed(0)); d.className = 'cmp d ' + diffClass(A.battery, B.battery, 15);
      v.style.setProperty('--bat', A.battery + '%'); v.classList.add('bat'); v.classList.toggle('low', A.battery < 15); return;
    }
    const x = A[k], y = B[k], f = row[6];
    set(v, x == null ? '-' : f(x) + ' ' + row[2]);
    set(o, y == null ? '-' : f(y)); set(d, (x == null || y == null) ? '' : ((y - x >= 0 ? '+' : '') + f(y - x)));
    d.className = 'cmp d ' + ((x == null || y == null) ? '' : diffClass(x, y, row[5]));
  });
  // warnings, with the design-system warning colour; the limits come from the rover config
  const W = [], lim = par.slope_limit_deg;
  if (a.tilt > lim) W.push(['bad', `Tilt ${a.tilt.toFixed(0)}° is past the ${lim}° slope limit`]); else if (a.tilt > 0.75 * lim) W.push(['warn', `Tilt ${a.tilt.toFixed(0)}°, limit ${lim}°`]);
  if (Math.abs(a.slopeAhead) > lim) W.push(['warn', `Steep slope ahead (${a.slopeAhead.toFixed(0)}°)`]);
  if (a.sliding) W.push(['bad', 'Sliding sideways']); else if (Math.abs(a.roll) > 0.6 * a.mu * 57.3 * 0.5 && Math.abs(a.roll) > 12) W.push(['warn', `Side slope ${Math.abs(a.roll).toFixed(0)}° (grip limit about ${(Math.atan(a.mu) * 57.2958).toFixed(0)}°)`]);
  if (a.spin > 0.05) W.push(['warn', `Wheel spin ${(a.spin * 100).toFixed(0)}%`]);
  if (a.dead) W.push(['bad', 'Battery empty, rover stopped']); else if (a.battery < 0.15) W.push(['warn', 'Battery low']);
  if (a.edge) W.push(['warn', 'Edge of the data patch']);
  const html = W.map(w => `<span class="dv-w ${w[0]}">${w[1]}</span>`).join('') || '<span class="dv-w ok">No warnings</span>';
  if ($('dvWarns').dataset.h !== html) { $('dvWarns').innerHTML = html; $('dvWarns').dataset.h = html; }
  set($('dvMass'), `Mass ${a.mass.toFixed(0)} kg${M.equalLoad && M.main === 1 ? ' (equal wheel load)' : ''}, friction ${a.mu.toFixed(2)}`);
  M.lastRead = R;
}

// ---------------------------------------------------------------- frame
function frame(dt, now) {
  const V = M.V; if (!M.active) { renderOnly(); return; }
  const st = M.input.poll(dt); if (window.TERRA_BENCH_INPUT) Object.assign(st, window.TERRA_BENCH_INPUT(M.realT));   // ?bench: scripted throttle and steering
  for (const e of st.pressed) {
    if (e === 'circle') { exit(); return; }
    if (e === 'options') { M.paused = !M.paused; if (!M.paused) { $('dvBanner').classList.add('hidden'); } }
    if (e === 'square') resetAll();
    if (e === 'triangle') { setPip(!M.pip); }
    if (e === 'create') { M.detailed = !M.detailed; paintHudMode(); }
    if (e === 'l1') cycleCam(-1);
    if (e === 'r1') cycleCam(1);
    if (e === 'ps') sheet(!M.showSheet);
    if (e === 'up') setScale(DEMO_SCALES[Math.min(DEMO_SCALES.length - 1, DEMO_SCALES.indexOf(M.scale) + 1)]);
    if (e === 'down') setScale(DEMO_SCALES[Math.max(0, DEMO_SCALES.indexOf(M.scale) - 1)]);
  }
  if (st.connected) { M.padName = st.name; if (!M.padSeen) { toast('Controller connected: ' + st.name); } M.padSeen = 1; }
  const disc = st.disconnected; if (disc) { M.paused = true; alertBanner('Controller disconnected. Paused. Reconnect it, or press any key to continue with the keyboard.'); }
  else if (M.toastKeep) { M.toastKeep = false; if (M.paused && !st.pressed.includes('options')) M.paused = false; $('dvBanner').classList.add('hidden'); }
  const pad = $('dvPad'), txt = st.connected ? `Controller: ${st.name}` : (M.padSeen ? 'Controller lost: keyboard in use' : 'No controller yet: press a button on it, or use the keyboard');
  if (pad.textContent !== txt) { pad.textContent = txt; pad.classList.toggle('on', st.connected); }
  if (M.paused && !disc) { const b = $('dvBanner'); if (b.textContent !== 'Paused (Options or P to resume)') { b.textContent = 'Paused (Options or P to resume)'; b.classList.remove('hidden', 'alert'); M.toastT = Infinity; } }
  else if (!M.paused && M.toastT === Infinity) { $('dvBanner').classList.add('hidden'); M.toastT = 0; }
  if (M.toastT && M.toastT !== Infinity && now > M.toastT && !M.toastKeep) { $('dvBanner').classList.add('hidden'); M.toastT = 0; }
  // camera orbit from the right stick or the mouse; it eases back behind the rover after a pause
  if (Math.abs(st.orbitX) + Math.abs(st.orbitY) > 1e-4) { M.orbit[0] += st.orbitX; M.orbit[1] += st.orbitY; M.orbitIdle = 0; } else { M.orbitIdle += dt; if (M.orbitIdle > 3) { const k = Math.exp(-dt * 1.4); M.orbit[0] *= k; M.orbit[1] *= k; } }
  M.orbit[0] = ((M.orbit[0] + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; M.orbit[1] = clamp(M.orbit[1], -0.9, 0.9);
  // physics: shaped input, identical for both grounds, fixed steps in simulated time
  if (!M.paused) {
    M.thr += (st.throttle - M.thr) * (1 - Math.exp(-dt / 0.12)); M.str += (st.steer - M.str) * (1 - Math.exp(-dt / 0.1));
    const inp = { throttle: M.thr, steer: M.str, brake: st.brake };
    const t0 = performance.now(); M.sims.forEach(s => s.advance(dt, M.scale, inp)); M.realT += dt; perf('phys', performance.now() - t0);
  }
  const rd = M.lastRead && M.lastRead[M.main]; if (rd) M.input.vibrate(Math.min(1, M.sims[M.main].lastRes * 8) * Math.min(1, Math.abs(rd.speed) * M.scale / 1.5), rd.spin + (rd.sliding ? 0.5 : 0), now);
  placeAll(dt, false); cameraAll(dt, false);
  const t1 = performance.now(); M.V.sides.forEach((s, j) => M.dust[j].update(dt, M.sims[j], M.scale, s.rover, roverPar())); perf('dust', performance.now() - t1);
  if (now - M.hudT > 90) { M.hudT = now; const t2 = performance.now(); updateHud(); perf('hud', performance.now() - t2); }
  const t3 = performance.now(); renderOnly(); perf('draw', performance.now() - t3); perf('frame', dt * 1000);
}

function renderOnly() {
  const V = M.V, r = V.renderer, c = $('siteCanvas'), W = c.clientWidth, H = c.clientHeight; if (!W || !H) return;
  const L = siteQuality.level();
  M.frameN++; r.shadowMap.autoUpdate = false;   // shadows are refreshed by hand: every frame for the main view, at a lower rate (or never) for the inset
  const draw = (j, x, y, w, h, ext, shadows, target) => {
    const s = V.sides[j], cam = V.cams[j].camera, asp = w / h; if (Math.abs(cam.aspect - asp) > 1e-3) { cam.aspect = asp; cam.updateProjectionMatrix(); }
    if (shadows) { sunFor(j, s.rover.root.position, ext * L.ext); r.shadowMap.needsUpdate = true; } s.sky.position.copy(cam.position);
    { const f = s.focus || (s.focus = [[0, 0]]); f[0][0] = s.rover.root.position.x; f[0][1] = s.rover.root.position.z; s.ground.update(cam.position, !M.lod[j], f); } M.lod[j] = true; if (s.ground.rocks) s.ground.rocks.update(s.rover.root.position.x, s.rover.root.position.z);   // level of detail follows the drive camera
    M.dust[j] && (M.dust[j].mat.uniforms.uK.value = h / (2 * Math.tan(cam.fov * Math.PI / 360)));
    if (target) { r.setRenderTarget(target); r.setViewport(0, 0, target.width, target.height); r.setScissor(0, 0, target.width, target.height); r.clear(); r.render(s.scene, cam); r.setRenderTarget(null); }
    else { r.setViewport(x, y, w, h); r.setScissor(x, y, w, h); r.render(s.scene, cam); }
  };
  siteHelpers.setShadow(V.sides[M.main], L.shadowDrive);   // drive mode defaults lower than Site View: 1024 at High
  draw(M.main, 0, 0, W, H, clamp(roverPar().wheelbase_m * 22, 45, 70), true);
  if (M.pip && M.other >= 0) {
    const pr = $('dvPip').getBoundingClientRect(), cr = c.getBoundingClientRect(), w = Math.round(pr.width), h = Math.round(pr.height);
    if (w > 20 && h > 20) {
      // the inset is drawn into a texture at reduced resolution, then copied into its corner; at lower quality it is redrawn every 2nd frame or only
      // when its rover or camera moved, and the copy is reused in between
      const dpr = r.getPixelRatio(), tw = Math.max(32, Math.round(w * dpr * L.insetScale)), th = Math.max(24, Math.round(h * dpr * L.insetScale));
      if (!M.rt || M.rt.width !== tw || M.rt.height !== th) { if (M.rt) M.rt.dispose(); M.rt = new THREE.WebGLRenderTarget(tw, th, { type: THREE.HalfFloatType, depthBuffer: true }); M.pipInit = false; }
      const ro = V.sides[M.other].rover.root, cam = V.cams[M.other].camera, key = M.pipKey || (M.pipKey = new Float64Array(7));
      const moved = Math.abs(ro.position.x - key[0]) + Math.abs(ro.position.y - key[1]) + Math.abs(ro.position.z - key[2]) > 0.02 || Math.abs(cam.position.x - key[3]) + Math.abs(cam.position.y - key[4]) + Math.abs(cam.position.z - key[5]) > 0.05 || Math.abs(ro.quaternion.y - key[6]) > 0.002;
      const due = !M.pipInit || (L.insetEvery === 'move' ? moved || M.frameN % 30 === 0 : M.frameN % L.insetEvery === 0);
      if (due) {
        const sh = !M.pipInit || (L.insetShadowEvery > 0 && M.frameN % L.insetShadowEvery === 0);
        draw(M.other, 0, 0, w, h, clamp(roverPar().wheelbase_m * 16, 35, 55), sh, M.rt); M.pipInit = true;
        key[0] = ro.position.x; key[1] = ro.position.y; key[2] = ro.position.z; key[3] = cam.position.x; key[4] = cam.position.y; key[5] = cam.position.z; key[6] = ro.quaternion.y;
      }
      if (!M.blit) { const m = new THREE.MeshBasicMaterial({ map: M.rt.texture, depthTest: false, depthWrite: false }); M.blit = { scene: new THREE.Scene(), cam: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), m }; M.blit.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m)); }
      M.blit.m.map = M.rt.texture; const x = Math.round(pr.left - cr.left), y = Math.round(cr.bottom - pr.bottom);
      r.setViewport(x, y, w, h); r.setScissor(x, y, w, h); r.render(M.blit.scene, M.blit.cam);
    }
  }
}

/** Frees what drive mode keeps between drives (the input listeners). Called when the simulator closes. */
export function disposeDrive() { if (M.input) { M.input.stop(); M.input.dispose(); M.input = null; } M.dust.forEach(d => d.dispose()); M.dust = []; if (M.rt) { M.rt.dispose(); M.rt = null; } if (M.blit) { M.blit.m.dispose(); M.blit.scene.children[0].geometry.dispose(); M.blit = null; } M.sims = []; M.V = null; M.active = false; M.busy = false; delete window.TERRA_DRIVE; }
