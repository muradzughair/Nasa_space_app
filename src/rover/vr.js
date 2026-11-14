// View in VR: the rover simulation at real scale around the user, on top of Site View's own scenes (site.js). Nothing here changes the simulation:
// playback, rover poses, wheel contact (contact.js), wheel scale (rovers.js) and terrain level of detail (ground.js) are Site View's own, reached through
// the hooks site.js hands to initVR(). VR only draws one pane's scene at a time from the headset, with the quality governor's "vr" profile.
//
// Session: WebXR 'immersive-vr' on the shared renderer (renderer.xr), drawn with renderer.setAnimationLoop while presenting (WebXR needs it); site.js's
// own requestAnimationFrame loop stands still while V.vr is set and resumes when the session ends, with the two-pane view, cameras, canvas size,
// shadows and the user's vertical exaggeration as they were.
//
// Controls (Meta Quest, xr-standard gamepad: 0 trigger, 3 thumbstick press, 4 A/X, 5 B/Y, axes 2/3 thumbstick):
//   right trigger: teleport (arc and landing ring), or click the wrist menu / controls card with the laser
//   right A: play / pause   right B: restart   right stick left / right: speed 0.5x 1x 2x 4x   right stick click: snap turn 30°
//   left X: view mode (stand on site / follow)   left Y: switch target ground / Earth ground
import * as THREE from './three.js';
import { worldH } from './terrain.js';
import { info } from './info.js';
import { vrLevel } from './quality.js';
import { R as RS } from './rovers.js';

const SPEEDS = [0.5, 1, 2, 4];
const CARD_KEY = 'rsim.vr.controlsSeen.v1';
const BODY = { mars: 'Mars', moon: 'Moon', earth: 'Earth' };
const MENU = [['play', 'Play / pause'], ['restart', 'Restart'], ['mode', 'View mode'], ['side', 'Switch ground'], ['speed', 'Speed'], ['rings', 'Slip rings'], ['exit', 'Exit VR']];

let H = null;   // Site View hooks (site.js vrHooks)
let S = null;   // the running VR session and everything it made

const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } } };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _q = new THREE.Quaternion(), _m = new THREE.Matrix4();

/** Puts "View in VR" in the simulation's top bar when an immersive VR headset can be used, otherwise a "!" saying what VR needs. */
export async function initVR(hooks) {
  H = hooks;
  const slot = hooks.slot(); if (!slot) return;
  slot.innerHTML = '';
  let ok = false;
  try { ok = !!(navigator.xr && await navigator.xr.isSessionSupported('immersive-vr')); } catch (e) { ok = false; }
  if (H !== hooks || hooks.slot() !== slot) return;   // the simulation closed meanwhile
  if (ok) {
    slot.innerHTML = '<button id="vrBtn" class="btn small vr-btn" aria-label="View the simulation in a VR headset">View in VR</button>';
    slot.querySelector('#vrBtn').onclick = () => { enterVR().catch(e => { console.error(e); H.siteNote && H.siteNote(`VR could not start: ${e.message || e}`); }); };
  } else slot.innerHTML = info('VR needs a headset such as Meta Quest connected to this computer.', 'About VR');
}

/** State for checks (vr_check.mjs) and the console. */
export const vrState = () => (S ? { side: S.side, mode: S.mode, label: S.label.text, scene: S.rig.parent, rings: S.rings.visible, card: S.card.mesh.visible, panel: S.panel.text, speed: H.V.speed } : null);

// ---------------------------------------------------------------- text on a plane (a CanvasTexture, redrawn only when asked)
function textPlane(wm, hm, wpx, hpx) {
  const canvas = document.createElement('canvas'); canvas.width = wpx; canvas.height = hpx;
  const ctx = canvas.getContext ? canvas.getContext('2d') : null;
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(wm, hm), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false }));
  mesh.renderOrder = 20; mesh.frustumCulled = false;
  const tp = { mesh, canvas, ctx, tex, text: '', w: wpx, h: hpx,
    draw(text, paint) { tp.text = text; if (ctx) { ctx.clearRect(0, 0, wpx, hpx); paint(ctx, wpx, hpx); tex.needsUpdate = true; } },
    dispose() { mesh.geometry.dispose(); mesh.material.dispose(); tex.dispose(); } };
  return tp;
}
const box = (g, w, h, r, fill, line) => { g.beginPath(); g.roundRect(2, 2, w - 4, h - 4, r); g.fillStyle = fill; g.fill(); if (line) { g.lineWidth = 3; g.strokeStyle = line; g.stroke(); } };
const FONT = '"Inter Variable", "Inter", system-ui, "Segoe UI", sans-serif';

// ---------------------------------------------------------------- enter / leave
/** Starts a VR session on the shared renderer. `xr` is navigator.xr (a mock in vr_check.mjs). Resolves true when the session is running. */
export async function enterVR(xr = navigator.xr) {
  const V = H && H.V;
  if (S || !V || !V.open || V.drive || !V.sides.length || !V.runs || !xr) return false;
  const session = await xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] });
  let floor = true; try { await session.requestReferenceSpace('local-floor'); } catch (e) { floor = false; }
  const R = V.renderer;
  S = { session, floor, saved: { exag: V.exag }, side: clamp(H.startSide(), 0, V.sides.length - 1), mode: 'stand', last: performance.now(), panelT: 0, force: true, hands: {}, prev: {}, held: false, aim: false, hover: null, objs: [] };
  V.vr = S; cancelAnimationFrame(V.raf);   // site.js's loop stands still while V.vr is set
  try {
    if (V.exag !== 1) H.setExag(1);        // real scale: 1 unit = 1 m, true rover size, no vertical exaggeration
    build(V, R);
    R.setScissorTest(false);               // the two-pane view clips with the scissor; the headset draws both eyes over the whole frame
    R.xr.enabled = true; R.xr.setReferenceSpaceType(floor ? 'local-floor' : 'local');
    if (R.xr.setFoveation) R.xr.setFoveation(1);
    session.addEventListener('end', onEnd);
    await R.xr.setSession(session);
  } catch (e) { session.removeEventListener && session.removeEventListener('end', onEnd); restore(); try { await session.end(); } catch (er) { /* already ended */ } throw e; }
  const L = vrLevel(); V.sides.forEach(s => H.setShadowSize(s.sun, L.shadow));   // lighter: smaller shadow map in VR
  showSide(S.side, true);
  if (!store.get(CARD_KEY)) showCard(); else S.card.mesh.visible = false;
  note(true);
  R.setAnimationLoop(vrFrame);
  return true;
}
/** Ends the VR session, if one runs. The normal view comes back in onEnd(). */
export async function exitVR() { if (!S) return; try { await S.session.end(); } catch (e) { onEnd(); } }
function onEnd() { if (!S) return; restore(); }
function restore() {
  const V = H.V, R = V.renderer, st = S;
  S = null; V.vr = null;
  try { R.setAnimationLoop(null); } catch (e) { /* no loop */ }
  R.xr.enabled = false;
  st.session.removeEventListener && st.session.removeEventListener('end', onEnd);
  for (const o of st.objs) { if (o.parent) o.parent.remove(o); }
  st.panel && st.panel.dispose(); st.label && st.label.dispose(); st.menu && st.menu.dispose(); st.card && st.card.dispose();
  st.disposables.forEach(d => d.dispose());
  if (V.exag !== st.saved.exag) H.setExag(st.saved.exag);
  note(false);
  H.resume();   // scissor, canvas size, shadows (applySide), the normal requestAnimationFrame loop
}
/** A line in the 2D page while the headset is in use. */
function note(on) {
  const site = H.slot() && H.slot().closest('#site'); if (!site) return;
  let n = site.querySelector('#vrNote');
  if (!on) { if (n) n.remove(); return; }
  if (!n) { site.insertAdjacentHTML('beforeend', '<div id="vrNote" class="vr-note" role="status"><span>Viewing in VR</span><button class="btn small" id="vrExit">Exit VR</button></div>'); n = site.querySelector('#vrNote'); n.querySelector('#vrExit').onclick = () => exitVR(); }
}

// ---------------------------------------------------------------- the VR objects: rig (camera and controllers), panels, teleport arc, slip rings
function build(V, R) {
  const rig = new THREE.Group(), cam = new THREE.PerspectiveCamera(70, 1, 0.05, 60000); rig.add(cam); rig.name = 'vrRig';
  const hud = new THREE.Group(); hud.name = 'vrHud';
  const disposables = [];
  const mat = (o) => { const m = new THREE.MeshBasicMaterial({ fog: false, toneMapped: false, ...o }); disposables.push(m); return m; };
  const geo = g => { disposables.push(g); return g; };
  // controllers: a short pointer for the target ray, a small body at the grip; the wrist menu on the left grip
  for (let i = 0; i < 2; i++) {
    const ctrl = R.xr.getController(i), grip = R.xr.getControllerGrip(i);
    const ray = new THREE.Line(geo(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)])), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, fog: false }));
    disposables.push(ray.material); ray.scale.z = 0.3; ray.visible = false; ctrl.add(ray);
    const body = new THREE.Mesh(geo(new THREE.BoxGeometry(0.04, 0.03, 0.11)), mat({ color: 0x2b3648 })); grip.add(body);
    const slot = { ctrl, grip, ray, body, hand: null, src: null };
    const onConn = e => { slot.src = e.data; slot.hand = e.data && e.data.handedness; if (slot.hand) S && (S.hands[slot.hand] = slot); ray.visible = slot.hand === 'right'; if (slot.hand === 'left' && S) grip.add(S.menu.mesh); };
    const onDisc = () => { if (S && slot.hand && S.hands[slot.hand] === slot) delete S.hands[slot.hand]; slot.src = null; };
    ctrl.addEventListener('connected', onConn); ctrl.addEventListener('disconnected', onDisc);
    disposables.push({ dispose() { ctrl.removeEventListener('connected', onConn); ctrl.removeEventListener('disconnected', onDisc); ray.removeFromParent(); body.removeFromParent(); } });
    rig.add(ctrl, grip);
  }
  // teleport: arc and landing ring
  const ARC = 48, arc = new THREE.Line(geo(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC * 3), 3))), new THREE.LineBasicMaterial({ color: 0x2dd4bf, fog: false }));
  disposables.push(arc.material); arc.visible = false; arc.frustumCulled = false; hud.add(arc);
  const ring = new THREE.Mesh(geo(new THREE.RingGeometry(0.28, 0.4, 40)), mat({ color: 0x2dd4bf, side: THREE.DoubleSide, transparent: true, opacity: 0.85, depthTest: false }));
  ring.rotation.x = -Math.PI / 2; ring.visible = false; ring.renderOrder = 15; hud.add(ring);
  // panels
  const label = textPlane(1.9, 0.24, 1216, 154); hud.add(label.mesh);
  const panel = textPlane(0.9, 0.78, 600, 520); hud.add(panel.mesh);
  const menu = textPlane(0.15, 0.21, 300, 420); menu.mesh.position.set(0, 0.06, 0.06); menu.mesh.rotation.x = -Math.PI / 3; menu.mesh.renderOrder = 25;
  const card = textPlane(1.3, 0.86, 1040, 688); hud.add(card.mesh); card.mesh.visible = false;
  // slip rings: one flat ring under each wheel of the shown rover, green (gripping) to red (slipping)
  const rings = new THREE.Group(); rings.visible = false; hud.add(rings);
  const ringGeo = geo(new THREE.RingGeometry(0.75, 1, 32)), ringMats = [];
  for (let k = 0; k < 8; k++) { const m = mat({ color: 0x4ade80, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthTest: false }); ringMats.push(m); const r = new THREE.Mesh(ringGeo, m); r.rotation.x = -Math.PI / 2; r.renderOrder = 14; r.visible = false; rings.add(r); }
  Object.assign(S, { rig, cam, hud, arc, ring, label, panel, menu, card, rings, ringMats, disposables, raycaster: new THREE.Raycaster() });
  S.objs.push(rig, hud, menu.mesh);
  drawMenu();
}

// ---------------------------------------------------------------- which side is shown, and where the user stands
const sideOf = i => H.V.sides[i];
const runOf = i => H.V.runs && H.V.runs.A[i];
const kOf = i => { const A = runOf(i); return A ? clamp(Math.round(H.V.u * (A.n - 1)), 0, A.n - 1) : 0; };
/** Forward (unit, world x/z) of side i's rover at the current moment of its drive. */
function heading(i) { const A = runOf(i), k = kOf(i); const psi = A ? A.psi[k] : 0; return { fx: Math.cos(psi), fz: Math.sin(psi), psi }; }
const yawFacing = (dx, dz) => Math.atan2(-dx, -dz);   // a rig turned by this yaw looks along (dx, dz)
const groundAt = (i, x, z) => worldH(sideOf(i).patch, x, z) * H.V.exag;
/** The headset's position in the world (the rig's camera as the headset last placed it). */
function head(out) { S.cam.updateMatrixWorld(true); return out.setFromMatrixPosition(S.cam.matrixWorld); }
/** The head's offset inside the rig, turned by a rig yaw: what the rig position must subtract to put the head at a given world point. */
function headOffset(yaw) { const p = S.cam.position; const c = Math.cos(yaw), s = Math.sin(yaw); return { x: p.x * c + p.z * s, z: -p.x * s + p.z * c }; }
function placeHeadAt(i, x, z, yaw) {
  S.rig.rotation.set(0, yaw, 0);
  const o = headOffset(yaw);
  S.rig.position.set(x - o.x, groundAt(i, x, z) + (S.floor ? 0 : 1.6), z - o.z);
}
/** Stand on site: beside the route, about 25 m ahead of the rover, facing it, so it drives past. */
function standPlace(i) {
  const A = runOf(i), s = sideOf(i), half = s.patch.size / 2; if (!A) return;
  const k = kOf(i), want = A.s[k] + 25; let k2 = k; while (k2 < A.n - 1 && A.s[k2] < want) k2++;
  const psi = A.psi[k2], fx = Math.cos(psi), fz = Math.sin(psi);
  const x = A.x[k2] - half + fz * 6, z = A.z[k2] - half - fx * 6;   // 6 m to the side of the route
  const rp = s.rover ? s.rover.root.position : _v.set(A.x[k] - half, 0, A.z[k] - half);
  placeHeadAt(i, x, z, yawFacing(rp.x - x, rp.z - z));
}
/** Shows side i: the rig, panels, arc and rings move into its scene. `fresh`: place the user for the current view mode (entering VR). */
function showSide(i, fresh) {
  const V = H.V, s = sideOf(i);
  if (!fresh && S.side !== i) {
    // keep the user at the same spot relative to the rover: offsets along and across its heading, and the turn relative to it
    const a = sideOf(S.side), h0 = heading(S.side), hp = head(_w), rp = a.rover.root.position;
    const dx = hp.x - rp.x, dz = hp.z - rp.z, along = dx * h0.fx + dz * h0.fz, across = dx * h0.fz - dz * h0.fx;
    const yawRel = S.rig.rotation.y - yawFacing(h0.fx, h0.fz);
    S.side = i;
    const h1 = heading(i), rq = s.rover.root.position;
    placeHeadAt(i, rq.x + along * h1.fx + across * h1.fz, rq.z + along * h1.fz - across * h1.fx, yawRel + yawFacing(h1.fx, h1.fz));
  }
  S.side = i;
  s.scene.add(S.rig); s.scene.add(S.hud);
  V.sides.forEach(o => { o.marker.visible = false; });   // the big locator cone is for the overview, not real scale
  if (fresh) { if (S.mode === 'stand') standPlace(i); else followPlace(i, true); }
  S.force = true; S.panelT = 0;
  drawLabel(); placeLabel(); drawMenu();
}
function switchSide() { const V = H.V; if (V.sides.length < 2) { flashLabel('Only one ground is open'); return; } showSide(1 - S.side, false); }
function cycleMode() { S.mode = S.mode === 'stand' ? 'follow' : 'stand'; if (S.mode === 'stand') standPlace(S.side); else followPlace(S.side, true); drawLabel(); placeLabel(); drawMenu(); }
/** Follow: a few metres behind and to the side of the rover, eased. Only the position moves; the view is never pitched, rolled or turned with the rover. */
function followPlace(i, snap, dt = 0.016) {
  const s = sideOf(i); if (!s.rover) return;
  const h = heading(i), rp = s.rover.root.position;
  const x = rp.x - h.fx * 7 + h.fz * 3, z = rp.z - h.fz * 7 - h.fx * 3;
  if (snap) { placeHeadAt(i, x, z, yawFacing(h.fx, h.fz)); return; }
  const o = headOffset(S.rig.rotation.y), k = 1 - Math.exp(-dt * 2.2);
  const tx = x - o.x, tz = z - o.z;
  S.rig.position.x += (tx - S.rig.position.x) * k; S.rig.position.z += (tz - S.rig.position.z) * k;
  const gy = groundAt(i, S.rig.position.x + o.x, S.rig.position.z + o.z) + (S.floor ? 0 : 1.6);
  S.rig.position.y += (gy - S.rig.position.y) * Math.min(1, k * 2);
}
function snapTurn(deg) {   // about the head, so the user does not swing round the rig origin
  const hp = head(_w).clone(), yaw = S.rig.rotation.y + deg * Math.PI / 180;
  S.rig.rotation.y = yaw; const o = headOffset(yaw);
  S.rig.position.x = hp.x - o.x; S.rig.position.z = hp.z - o.z;
}
function setSpeedStep(d) { const V = H.V; let j = SPEEDS.indexOf(V.speed); if (j < 0) j = 1; j = clamp(j + d, 0, SPEEDS.length - 1); H.setSpeed(SPEEDS[j]); drawMenu(); S.panelT = 0; }

// ---------------------------------------------------------------- panels
function sideTitle(i) { return H.title(sideOf(i)); }
function drawLabel(extra) {
  const t = sideTitle(S.side), mode = S.mode === 'stand' ? 'Standing on site' : 'Following the rover', txt = extra || `${mode} · Y: switch ground · X: view`;
  const sKey = sideOf(S.side).key;
  S.label.draw(t, (g, w, h) => {
    box(g, w, h, 28, 'rgba(8,12,19,0.82)', sKey === 'target' ? '#38bdf8' : '#fb923c');
    g.fillStyle = sKey === 'target' ? '#7dd3fc' : '#fdba74'; g.font = `700 54px ${FONT}`; g.textBaseline = 'middle'; g.fillText(t, 36, h * 0.38, w - 72);
    g.fillStyle = '#9aaabf'; g.font = `400 34px ${FONT}`; g.fillText(txt, 36, h * 0.76, w - 72);
  });
}
let flashT = 0;
function flashLabel(msg) { drawLabel(msg); clearTimeout(flashT); flashT = setTimeout(() => { if (S) drawLabel(); }, 1800); }
/** The label floats 3 m in front of where the user looks, a little above eye height. Placed when the view changes, then left in the world. */
function placeLabel() {
  const hp = head(_w), yaw = S.rig.rotation.y + camYaw(), fx = -Math.sin(yaw), fz = -Math.cos(yaw);
  S.label.mesh.position.set(hp.x + fx * 3, hp.y + 0.55, hp.z + fz * 3); S.label.mesh.rotation.set(0, yaw, 0);
}
function camYaw() { _q.copy(S.cam.quaternion); const e = new THREE.Euler().setFromQuaternion(_q, 'YXZ'); return e.y; }
const fmt = (x, d) => (Number.isFinite(x) ? x.toFixed(d) : '-');
/** Live values of the shown side, from the simulation's own run (sim.js analyze): no new physics. */
function drawPanel() {
  const V = H.V, i = S.side, A = runOf(i); if (!A) return;
  const k = kOf(i), stuck = !!(A.blocked && A.blocked[k]), v = A.v[k];
  const rows = [
    ['Speed', V.playing ? `${fmt(v * 100, 1)} cm/s` : 'paused'],
    ['Slope under the rover', `${fmt(A.tilt[k], 1)}°`],
    ['Average wheel slip', `${fmt(A.slip[k], 0)} %`],
    ['Sinkage', `${fmt(A.sink ? A.sink[k] * 1000 : NaN, 1)} mm`],
    ['Body pitch, roll', `${fmt(A.pitch[k], 1)}°, ${fmt(A.roll[k], 1)}°`],
    ['Energy used', `${fmt(A.E[k] / 3600, 1)} Wh`],
    ['Distance, time', `${fmt(A.s[k], 0)} m, ${fmt(A.t[k] / 60, 1)} min`],
  ];
  const head0 = `${sideOf(i).key === 'target' && !sideOf(i).same ? BODY[sideOf(i).body] + ' ground' : 'Earth ground'} · ${V.speed}x`;
  const text = [head0, ...rows.map(r => r.join(': ')), stuck ? 'STUCK' : ''].join('\n');
  S.panel.draw(text, (g, w, h) => {
    box(g, w, h, 26, 'rgba(8,12,19,0.86)', stuck ? '#f87171' : '#2f4260');
    g.textBaseline = 'middle'; g.fillStyle = sideOf(i).key === 'target' ? '#7dd3fc' : '#fdba74'; g.font = `700 34px ${FONT}`; g.fillText(head0, 28, 40, w - 56);
    rows.forEach(([l, val], r) => { const y = 96 + r * 52; g.fillStyle = '#9aaabf'; g.font = `400 28px ${FONT}`; g.fillText(l, 28, y, w * 0.56); g.fillStyle = '#e8eef7'; g.font = `600 30px ${FONT}`; g.textAlign = 'right'; g.fillText(val, w - 28, y); g.textAlign = 'left'; });
    if (stuck) { g.fillStyle = '#f87171'; g.fillRect(28, h - 70, w - 56, 50); g.fillStyle = '#1a0606'; g.font = `800 34px ${FONT}`; g.textAlign = 'center'; g.fillText('STUCK', w / 2, h - 45); g.textAlign = 'left'; }
  });
}
function drawMenu() {
  if (!S) return;
  const V = H.V, val = { play: V.playing ? 'Pause' : 'Play', restart: 'Restart', mode: S.mode === 'stand' ? 'View: stand' : 'View: follow', side: V.sides.length > 1 ? `Show ${sideOf(1 - S.side).key === 'target' && !sideOf(1 - S.side).same ? BODY[sideOf(1 - S.side).body] : 'Earth'}` : 'One ground', speed: `Speed ${V.speed}x`, rings: S.rings.visible ? 'Slip rings: on' : 'Slip rings: off', exit: 'Exit VR' };
  S.menu.draw(MENU.map(([k]) => val[k]).join('\n'), (g, w, h) => {
    box(g, w, h, 22, 'rgba(8,12,19,0.9)', '#2f4260');
    const rh = (h - 16) / MENU.length;
    MENU.forEach(([k], r) => { const y = 8 + r * rh; if (S.hover === k) { g.fillStyle = 'rgba(45,212,191,0.28)'; g.fillRect(8, y + 3, w - 16, rh - 6); } g.fillStyle = k === 'exit' ? '#fca5a5' : '#e8eef7'; g.font = `600 30px ${FONT}`; g.textBaseline = 'middle'; g.fillText(val[k], 22, y + rh / 2, w - 44); });
  });
}
function showCard() {
  const lines = ['Controls', 'Right trigger: teleport, or click the wrist menu', 'A: play / pause     B: restart', 'Right stick left / right: speed     click: turn 30°', 'X: stand on site / follow the rover', 'Y: switch Mars or Moon ground / Earth ground', 'Wrist menu: on the left controller', 'Pull the trigger to close'];
  S.card.draw(lines.join('\n'), (g, w, h) => {
    box(g, w, h, 30, 'rgba(8,12,19,0.92)', '#2dd4bf');
    g.textBaseline = 'middle'; g.fillStyle = '#e8eef7'; g.font = `700 52px ${FONT}`; g.fillText(lines[0], 44, 66);
    lines.slice(1, -1).forEach((l, r) => { g.fillStyle = '#cbd5e1'; g.font = `400 36px ${FONT}`; g.fillText(l, 44, 150 + r * 72, w - 88); });
    g.fillStyle = '#2dd4bf'; g.font = `600 34px ${FONT}`; g.fillText(lines[lines.length - 1], 44, h - 50);
  });
  const hp = head(_w), yaw = S.rig.rotation.y + camYaw();
  S.card.mesh.position.set(hp.x - Math.sin(yaw) * 2, hp.y - 0.1, hp.z - Math.cos(yaw) * 2); S.card.mesh.rotation.set(0, yaw, 0); S.card.mesh.visible = true;
}
function hideCard() { S.card.mesh.visible = false; store.set(CARD_KEY, '1'); }
function menuAction(k) {
  if (k === 'play') H.togglePlay(); else if (k === 'restart') H.restart(); else if (k === 'mode') cycleMode(); else if (k === 'side') switchSide();
  else if (k === 'speed') { const V = H.V, j = SPEEDS.indexOf(V.speed); H.setSpeed(SPEEDS[(j + 1) % SPEEDS.length]); }
  else if (k === 'rings') S.rings.visible = !S.rings.visible; else if (k === 'exit') { exitVR(); return; }
  if (S) { drawMenu(); S.panelT = 0; }
}
/** Test hook for vr_check.mjs: run a wrist-menu action or a controller action by name. */
export function vrAction(k) { if (!S) return; if (k === 'teleport') return; if (MENU.some(m => m[0] === k)) menuAction(k); }

// ---------------------------------------------------------------- input
function pollInput() {
  for (const hand of ['left', 'right']) {
    const slot = S.hands[hand], gp = slot && slot.src && slot.src.gamepad; if (!gp) continue;
    const prev = S.prev[hand] || [], btn = i => !!(gp.buttons[i] && gp.buttons[i].pressed), edge = i => btn(i) && !prev[i];
    if (hand === 'right') {
      if (btn(0) && !prev[0]) S.aim = true;
      if (!btn(0) && prev[0]) release();
      if (edge(4)) { H.togglePlay(); drawMenu(); S.panelT = 0; }
      if (edge(5)) { H.restart(); drawMenu(); }
      if (edge(3)) snapTurn(-30);
      const x = gp.axes.length > 2 ? gp.axes[2] : gp.axes[0] || 0;
      if (!S.held && Math.abs(x) > 0.7) { S.held = true; setSpeedStep(x > 0 ? 1 : -1); } else if (Math.abs(x) < 0.3) S.held = false;
    } else {
      if (edge(4)) cycleMode();
      if (edge(5)) switchSide();
    }
    if (S.card.mesh.visible && (edge(4) || edge(5))) hideCard();   // any face button also closes the controls card (the trigger does, in release())
    S.prev[hand] = gp.buttons.map(b => b.pressed);
  }
}
/** Right trigger released: click what the laser points at (wrist menu, controls card), otherwise teleport to the arc's landing point. */
function release() {
  S.aim = false; S.arc.visible = false; S.ring.visible = false;
  if (S.hover) { menuAction(S.hover); return; }
  if (S.card.mesh.visible) { hideCard(); return; }
  if (S.landing) { const yaw = S.rig.rotation.y, o = headOffset(yaw); S.rig.position.set(S.landing.x - o.x, S.landing.y + (S.floor ? 0 : 1.6), S.landing.z - o.z); if (S.mode === 'follow') { S.mode = 'stand'; drawLabel(); drawMenu(); } S.force = true; }
}
/** The right controller's laser on the wrist menu, and the teleport arc while the trigger is held. */
function updatePointer() {
  const r = S.hands.right; S.hover = null; S.landing = null;
  if (!r) { S.arc.visible = S.ring.visible = false; return; }
  r.ctrl.updateMatrixWorld(true);
  const o = _v.setFromMatrixPosition(r.ctrl.matrixWorld), d = _w.set(0, 0, -1).applyQuaternion(r.ctrl.getWorldQuaternion(_q)).normalize();
  S.raycaster.set(o, d);
  const targets = [S.menu.mesh.parent ? S.menu.mesh : null].filter(Boolean);
  const hits = targets.length ? S.raycaster.intersectObjects(targets, false) : [];
  const before = S.hover;
  if (hits.length && hits[0].uv) { const row = clamp(Math.floor((1 - hits[0].uv.y) * MENU.length), 0, MENU.length - 1); S.hover = MENU[row][0]; r.ray.scale.z = hits[0].distance; }
  else r.ray.scale.z = 0.3;
  if (S.hover !== before) drawMenu();
  if (!S.aim || S.hover) { S.arc.visible = S.ring.visible = false; return; }
  // the arc: a thrown point at 9 m/s under gravity, until it meets the ground
  const pos = S.arc.geometry.attributes.position, N = pos.count, v0 = 9, g = 9.8, dt = 0.05, i = S.side;
  let hit = null, n = 0;
  for (let k = 0; k < N; k++) {
    const t = k * dt, x = o.x + d.x * v0 * t, y = o.y + d.y * v0 * t - 0.5 * g * t * t, z = o.z + d.z * v0 * t;
    pos.setXYZ(k, x, y, z); n = k + 1;
    const gy = groundAt(i, x, z); if (y <= gy) { pos.setXYZ(k, x, gy, z); hit = { x, y: gy, z }; break; }
  }
  pos.needsUpdate = true; S.arc.geometry.setDrawRange(0, n); S.arc.visible = true;
  if (hit) { S.landing = hit; S.ring.position.set(hit.x, hit.y + 0.03, hit.z); S.ring.visible = true; } else S.ring.visible = false;
}

// ---------------------------------------------------------------- the loop while presenting
function vrFrame() {
  if (!S) return;
  const V = H.V, now = performance.now(), dt = Math.min(0.1, (now - S.last) / 1000); S.last = now;
  const wasPlaying = V.playing;
  H.advancePlayback(dt, now);                // the same playback as the normal view: both sides at the same V.u
  if (wasPlaying !== V.playing) drawMenu();
  pollInput(); if (!S) return;               // exit from the menu ends the session
  if (S.mode === 'follow') followPlace(S.side, false, dt);
  updatePointer();
  const s = sideOf(S.side), hp = head(_w);
  // terrain level of detail: the same rules as the normal view, seen from the headset, full detail under the rover
  if (s.rover) { const f = s.focus || (s.focus = [[0, 0]]); f[0][0] = s.rover.root.position.x; f[0][1] = s.rover.root.position.z; }
  s.ground.update(hp, S.force, s.rover ? s.focus : null); S.force = false;
  if (s.rover && s.ground.rocks) s.ground.rocks.update(s.rover.root.position.x, s.rover.root.position.z);
  s.sky.position.copy(hp);
  // sun and shadow around the rover (a tighter area than the overview: vr profile)
  if (s.rover && V.sunV) {
    const t = s.rover.root.position, ext = 45 * vrLevel().ext / 0.5, sc = s.sun.shadow.camera;
    s.sun.target.position.copy(t); s.sun.position.copy(t).addScaledVector(V.sunV, s.patch.size * 1.6);
    if (Math.abs(sc.right - ext) > ext * 0.05) { sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 1; sc.far = s.patch.size * 4; sc.updateProjectionMatrix(); s.sun.shadow.normalBias = ext * 0.0025; }
  }
  // the data panel floats beside and above the rover and turns to face the user (about the vertical axis only)
  if (s.rover) {
    const rp = s.rover.root.position, h = heading(S.side);
    S.panel.mesh.position.set(rp.x - h.fz * 2.2, rp.y + 2.6, rp.z + h.fx * 2.2);
    S.panel.mesh.rotation.set(0, Math.atan2(hp.x - S.panel.mesh.position.x, hp.z - S.panel.mesh.position.z), 0);
    if (now - S.panelT > 100) { S.panelT = now; drawPanel(); }   // at most 10 times a second
    updateRings(s);
  }
  S.label.mesh.rotation.y = Math.atan2(hp.x - S.label.mesh.position.x, hp.z - S.label.mesh.position.z);
  V.renderer.render(s.scene, S.cam);
}
function updateRings(s) {
  if (!S.rings.visible) return;
  const A = runOf(S.side), slip = A ? A.slip[kOf(S.side)] : 0, col = new THREE.Color().setHSL(clamp(0.33 * (1 - slip / 30), 0, 0.33), 0.85, 0.5), r0 = (RS.cfg && RS.cfg.wheel_radius_m) || 0.26;
  const ws = s.rover.wheels || [];
  S.rings.children.forEach((m, k) => {
    const w = ws[k]; m.visible = !!w; if (!w) return;
    w.node.getWorldPosition(m.position); m.position.y -= r0 * 0.92; m.scale.setScalar(r0 * 1.15); S.ringMats[k].color.copy(col);
  });
}
