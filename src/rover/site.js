// Site View, ported from the old app/js/site.js: the real ground of one Earth point with orbit and follow cameras, PBR ground, the rover, the
// Slope and Elevation views, route playback with the live HUD and the verdict, Drive mode, rover choice, Customize and build comparison.
// What changed from the old file (README, "What had to change"): there is one ground (the Earth point), not a target ground beside an Earth
// hotspot. The second pane, when shown, is the same ground at the other gravity. The page builds its DOM on open and frees everything on exit
// (renderer, textures, geometries, rover models, listeners), because it lives beside the Cesium globe instead of owning the page.
// A screening model with simplified soil behaviour, not a validated rover simulation.
import * as THREE from './three.js';
import { D, ROOT } from './data.js';
import { upsample, surfaceH, worldH } from './terrain.js';
import { Ground, Tracks, slopeTexture, NRM_RANGE } from './ground.js';
import { poseOnGround } from './contact.js';
import { attach as qAttach, level as qLevel, wantAntialias, frameStart as qStart, frameEnd as qEnd, renderControl as qControl } from './quality.js';
import { planRoute, analyze, verdict, frictionFromSoil, START, GOAL, DS } from './sim.js';
import { motion, ease } from './globeview.js';
import { R as RS, initRovers, createInstance, updateInstance, evictExcept, onChange, selectRover, defaultForBody } from './rovers.js';
import { initRoverUI, refreshRoverUI, disposeRoverUI } from './roverui.js';
import { info, installInfo, closeInfo } from './info.js';
import { groundClass } from './soilmech.js';
import { initVR, exitVR } from './vr.js';

const $ = id => document.getElementById(id);
const COL_T = '#38bdf8', COL_E = '#fb923c';
const fresh = () => ({ timing: {}, awake: 0, notes: [], gl: false, ready: false, open: false, sides: [], cams: [], ctx: null, mode: 'plain', exag: 1, tex: null, runs: null, routes: null, u: 0, playing: false, speed: 1, DUR: 75, link: true, follow: true, active: 0, dirty: -1, syncing: false, shown: false, off: [] });
let V = fresh();
export const SITE = { get V() { return V; } };
const _v = new THREE.Vector3(), _t = new THREE.Vector3();
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const esc = x => String(x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const on = (el, type, fn, opt) => { el.addEventListener(type, fn, opt); V.off.push(() => el.removeEventListener(type, fn, opt)); };

// ---------------------------------------------------------------- failures are not fatal (unchanged rule from the old Site View)
const wake = (ms = 1500) => { V.awake = Math.max(V.awake, performance.now() + ms); };
const errText = e => (e && e.message) || (e && e.target && (e.target.src || e.target.currentSrc) ? `could not fetch ${e.target.src || e.target.currentSrc}` : String(e));
function siteNote(msg) { V.notes.push(msg); const n = $('siteNote'); if (!n) return; n.innerHTML = V.notes.map(m => `<div>${esc(m)}</div>`).join(''); n.classList.remove('hidden'); }
function failPanel(el, what, e) {
  const msg = `Could not load ${what}: ${errText(e)}`; console.error(msg, e);
  const n = typeof el === 'string' ? $(el) : el;
  if (n) n.innerHTML = n.tagName === 'TABLE' ? `<tr><td class="load-fail">${esc(msg)}</td></tr>` : `<span class="load-fail">${esc(msg)}</span>`;
  siteNote(msg);
}
const tick = (what, t0) => { V.timing[what] = (V.timing[what] || 0) + performance.now() - t0; };
function guard(what, el, fn) { const t0 = performance.now(); try { return fn(); } catch (e) { failPanel(el, what, e); return undefined; } finally { tick(what, t0); } }
async function guardAsync(what, el, fn) { const t0 = performance.now(); try { return await fn(); } catch (e) { failPanel(el, what, e); return undefined; } finally { tick(what, t0); } }

// ---------------------------------------------------------------- the page (old index.html #site and #driveChooser, inside the simulator's own root)
export const TEMPLATE = `
<div id="site" class="site">
  <div class="site-top">
    <button id="siteBack" class="btn ghost" aria-label="Back to the globe">&larr; Back to globe</button>
    <div id="siteTitle" class="site-title"></div>
    <span id="vrSlot" class="vr-slot"></span>
    <div class="gfx-wrap"><button id="gfxBtn" class="btn ghost small" aria-expanded="false" aria-controls="gfxPop">Graphics</button><div id="gfxPop" class="gfx-pop hidden" role="dialog" aria-label="Graphics quality"></div></div>
  </div>
  <div id="siteNote" class="site-note hidden" role="alert"></div>
  <div class="site-body">
    <div class="vp-wrap" id="vpWrap">
      <div class="vp-stage" id="vpStage">
        <canvas id="siteCanvas"></canvas>
        <div class="pane left" id="paneL" tabindex="0" role="application" aria-label="Ground view. Drag to orbit, scroll to zoom, arrow keys to move."></div>
        <div class="pane right" id="paneR" tabindex="0" role="application" aria-label="Same ground at the other gravity. Drag to orbit, scroll to zoom, arrow keys to move."></div>
        <div class="vp-divider" id="vpDivider"></div>
        <div class="vp-label left" id="vpLeft"></div>
        <div class="vp-label right" id="vpRight"></div>
        <div class="rhud left" id="hudL"></div>
        <div class="rhud right" id="hudR"></div>
        <div class="live-cmp" id="liveCmp" aria-label="Live comparison, left pane and right pane"></div>
        <div class="vp-verdict hidden" id="vpVerdict" role="status">
          <div id="vpVerdictBody" class="vv-body"></div>
          <div class="vv-actions"><button id="vpVerdictMore" class="btn ghost small">Details</button><button id="vpVerdictClose" class="btn ghost small" aria-label="Close verdict">Close</button></div>
        </div>
        <div id="driveUI" class="drive-ui hidden" aria-label="Drive mode">
          <div id="dvStage" class="dv-stage" tabindex="-1"></div>
          <div class="dv-top" id="dvTop"></div>
          <div class="dv-banner hidden" id="dvBanner" role="status" aria-live="polite"></div>
          <aside class="dv-hud" id="dvHud" aria-label="Instrument panel"></aside>
          <div class="dv-pip hidden" id="dvPip" aria-label="Comparison view, same inputs at the other gravity"><span class="dv-pip-label" id="dvPipLabel"></span></div>
          <div class="dv-hint" id="dvHint"><kbd>H</kbd> controls</div>
          <div class="dv-sheet hidden" id="dvSheet" role="dialog" aria-label="Controls"></div>
          <footer class="dv-foot" id="dvFoot"></footer>
        </div>
        <div id="dvFade" class="dv-fade" aria-hidden="true"></div>
      </div>
      <div class="vp-bars">
        <div class="play-row">
          <button id="playBtn" class="primary play" aria-label="Play"><svg class="ic-play" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 1l9 5-9 5z" fill="currentColor"/></svg><svg class="ic-pause" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor"/></svg><span class="lbl">Play</span></button>
          <button id="restartBtn" class="btn ghost" aria-label="Restart simulation">Restart</button>
          <button id="driveBtn" class="btn drive-btn" aria-label="Drive a rover yourself with a game controller or the keyboard"><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M5 5.5h6a3.5 3.5 0 0 1 3.4 4.3l-.5 2a1.6 1.6 0 0 1-2.7.7L10 11H6l-2.2 1.5a1.6 1.6 0 0 1-2.7-.7l-.5-2A3.5 3.5 0 0 1 5 5.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5 7.4v2.2M3.9 8.5h2.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="10.8" cy="7.6" r=".8" fill="currentColor"/><circle cx="12.4" cy="9" r=".8" fill="currentColor"/></svg><span>Drive</span></button>
          <div class="seg small" id="speeds" role="group" aria-label="Playback speed"></div>
          <input id="scrub" class="scrub" type="range" min="0" max="1000" value="0" aria-label="Simulation timeline">
          <output id="scrubO" class="scrub-o">0 %</output>
        </div>
        <div class="tool-row">
          <div class="seg small" id="colorModes" role="group" aria-label="Ground colouring"></div>
          <label>Vertical x<input id="exag" type="range" min="1" max="5" step="0.5" value="1"><output id="exagO">1</output></label>
          <label>Sun elevation<input id="sunEl" type="range" min="3" max="80" step="1" value="35"><output id="sunElO">35</output></label>
          <label>Sun azimuth<input id="sunAz" type="range" min="0" max="360" step="5" value="135"><output id="sunAzO">135</output>${info("The compass direction the sunlight comes from. 0 is north and 90 is east.", "About sun azimuth")}</label>
          <label class="chk"><input id="follow" type="checkbox" checked> Follow rover</label>
          <label class="chk" id="linkWrap"><input id="link" type="checkbox" checked> Link views</label>
          <button id="resetCam" class="btn ghost small" aria-label="Reset camera">Reset view</button>
          <span id="viewInfo"></span>
        </div>
      </div>
    </div>
    <aside class="site-side" id="siteSide" aria-label="Ground and simulation details">
      <div class="panel-head"><span class="ph-title">Ground and simulation details</span>${info("This is a quick estimate, not an exact rover simulation. The soil is kept simple, so treat the results as a first check.", "About this simulation")}</div>
      <div class="panel-body">
      <section id="simScore" class="sim-score hidden" aria-live="polite"></section>
      <section>
        <h3>This ground ${info("Heights come from satellite elevation data, with points about 30 m apart. Smaller bumps are filled in smoothly by the app.", "About this ground")}</h3>
        <table id="cmpTable" class="cmp gr-table"></table>
      </section>
      <section id="tgtSec" class="hidden">
        <h3><span id="tgtHead">Target ground</span> ${info("The Mars or Moon ground the rover is compared on, from orbital elevation maps. Its soil is a simple estimate for that type of ground.", "About the target ground")}</h3>
        <table id="tgtTable" class="cmp gr-table"></table>
      </section>
      <section>
        <h3>Soil inputs ${info("These are estimates for this type of ground, based on its rock and rainfall. They are not measured here. You can change the friction below.", "About the soil inputs")}</h3>
        <table id="soilTable" class="cmp gr-table"></table>
      </section>
      <section id="simSec">
        <h3>Rover simulation ${info("The same rover drives from start to goal on each ground. By default the left view is the real Mars or Moon ground and the right view is this Earth place. You can also show this Earth place at two gravities.", "About the rover simulation")}</h3>
        <div id="roverBar" class="rover-bar"></div>
        <div class="sim-inputs" id="simInputs"></div>
        <div id="simStatus" class="hint"></div>
        <div id="charts" class="charts"></div>
        <div id="verdict" class="verdict hidden"></div>
      </section>
      <footer id="siteCredits" class="site-credits"></footer>
      </div>
    </aside>
  </div>
</div>
<div id="driveChooser" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="dcTitle">
  <div class="modal-card dc-card">
    <button id="dcClose" class="btn ghost close" aria-label="Close">Close</button>
    <h1 id="dcTitle">Drive a rover ${info("Drive the rover yourself on this ground. There is no goal and no score. With both gravities, a small window shows the same moves at the other gravity.", "About drive mode")}</h1>
    <div id="dcRover" class="dc-rover"></div>
    <div class="dc-cards" id="dcCards"></div>
    <p class="hint dc-note">Controller or keyboard ${info("Use a PlayStation 5 controller or any standard gamepad (USB-C or Bluetooth), then press a button. On the keyboard, W A S D drives and Space brakes.", "About the controls")}</p>
  </div>
</div>`;

// ---------------------------------------------------------------- renderer, cameras, UI wiring (built on every open, freed on close)
/** One WebGL renderer for the life of the page, reused by every open: creating and destroying a WebGL context on each open and close is what
 *  integrated GPUs handle worst (it once took the globe's context with it in testing). On close everything drawn with it is disposed and its
 *  canvas shrinks to 1 x 1 and leaves the page, so it holds no ground, rover or texture. */
let SHARED = null;
function ensureRenderer() {
  if (V.ready) return;
  const slot = $('siteCanvas');
  if (!SHARED) {
    const renderer = new THREE.WebGLRenderer({ canvas: slot, antialias: wantAntialias(), powerPreference: 'high-performance' });   // antialiasing off when the last session needed Low quality (it can only be chosen here, when the shared renderer is first made)
    SHARED = { renderer, canvas: slot };
    // For checks from the console or a test: what the shared renderer still holds on the GPU.
    window.__rsimGL = () => ({ ...SHARED.renderer.info.memory, programs: SHARED.renderer.info.programs.length, size: [SHARED.canvas.width, SHARED.canvas.height], attached: SHARED.canvas.isConnected });
  } else slot.replaceWith(SHARED.canvas);
  const canvas = SHARED.canvas;
  V.renderer = SHARED.renderer;
  V.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, qLevel().dpr));   // quality level: 1.5, 1 or 0.75 at most (quality.js); ?hq gives 2 (applyQuality)
  V.renderer.setScissorTest(true);
  V.renderer.shadowMap.enabled = true; V.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  V.renderer.toneMapping = THREE.ACESFilmicToneMapping; V.renderer.toneMappingExposure = 0.95;
  ['paneL', 'paneR'].forEach((id, i) => {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 60000), el = $(id);
    const controls = new THREE.OrbitControls(camera, el);
    Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, maxPolarAngle: Math.PI * 0.49, minDistance: 4, maxDistance: 4000, zoomSpeed: 0.9, screenSpacePanning: false });
    controls.listenToKeyEvents(el);
    controls.addEventListener('start', () => { V.active = i; });
    controls.addEventListener('change', () => { if (!V.syncing) V.dirty = i; wake(); });
    V.cams.push({ camera, controls, el, anim: null });
  });
  V.ro = new ResizeObserver(resize); V.ro.observe($('vpStage'));
  ['pointerdown', 'pointermove', 'wheel', 'keydown', 'input', 'change', 'click'].forEach(t => on($('site'), t, e => { if (t !== 'pointermove' || e.buttons) wake(); }, { capture: true, passive: true }));
  on(document, 'visibilitychange', () => { if (!document.hidden) wake(); });
  const modes = [['plain', 'Natural'], ['slope', 'Slope'], ['elev', 'Elevation']];
  $('colorModes').innerHTML = '';
  modes.forEach(([k, l]) => {
    const b = document.createElement('button'); b.textContent = l; b.dataset.mode = k;
    b.onclick = () => { V.mode = k; paintModes(); setMode(); };
    $('colorModes').appendChild(b);
  });
  $('speeds').innerHTML = '';
  [0.5, 1, 2, 4].forEach(sp => {
    const b = document.createElement('button'); b.textContent = sp + 'x'; b.dataset.speed = sp; b.setAttribute('aria-label', `Playback speed ${sp} times`);
    b.onclick = () => { V.speed = sp; paintSpeeds(); };
    $('speeds').appendChild(b);
  });
  const bind = (id, fn) => { const e = $(id), o = $(id + 'O'); e.oninput = () => { if (o) o.textContent = e.value; fn(+e.value); }; };
  let exT = 0; bind('exag', v => { V.exag = v; clearTimeout(exT); exT = setTimeout(() => { V.sides.forEach(updateGeometry); updateAll(true); }, 60); });   // debounced: dragging the slider rebuilds once it settles
  bind('sunEl', setSun); bind('sunAz', setSun);
  $('follow').onchange = () => { V.follow = $('follow').checked; if (V.follow && V.runs) goView(true); };
  $('link').onchange = () => { V.link = $('link').checked; };
  $('resetCam').onclick = () => goView(V.follow && !!V.runs);
  $('siteBack').onclick = () => (V.onBack ? V.onBack() : closeSite());
  $('playBtn').onclick = togglePlay;
  $('driveBtn').onclick = () => import('./drivemode.js').then(m => m.openChooser(SITE.V));
  $('restartBtn').onclick = () => { V.u = 0; V.snap = true; V.shown = false; play(true); };
  $('scrub').oninput = () => { V.u = +$('scrub').value / 1000; V.snap = true; };
  $('vpVerdictClose').onclick = () => $('vpVerdict').classList.add('hidden');
  $('vpVerdictMore').onclick = () => $('verdict').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  V.ready = true; V.wake = wake;
  qAttach(V.renderer, applyQuality);
  qControl($('gfxPop'));   // graphics quality: Auto / High / Medium / Low (quality.js)
  { const b = $('gfxBtn'), pop = $('gfxPop'), show = on => { pop.classList.toggle('hidden', !on); b.setAttribute('aria-expanded', on ? 'true' : 'false'); };
    b.onclick = e => { e.stopPropagation(); show(pop.classList.contains('hidden')); };
    const away = e => { if (!pop.contains(e.target) && e.target !== b) show(false); }; document.addEventListener('click', away); V.off.push(() => document.removeEventListener('click', away)); }
}
/** Push a quality level (quality.js) into the renderer and both grounds. Cheap enough to call at any moment; a new shadow map size frees the old map. */
function applyQuality(L) {
  V.q = L; const hq = new URLSearchParams(location.search).has('hq');
  V.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, hq ? 2 : L.dpr)); resize();
  V.sides.forEach(applySide); wake(800);
}
export function setShadowSize(light, n) { if (light.shadow.mapSize.x === n) return; light.shadow.mapSize.set(n, n); if (light.shadow.map) { light.shadow.map.dispose(); light.shadow.map = null; } }
function applySide(s) {
  const L = V.q || qLevel();
  setShadowSize(s.sun, V.drive ? L.shadowDrive : L.shadow);
  s.ground.k = +new URLSearchParams(location.search).get('lod') || L.lod; s.ground.lodDirty = true;
  s.ground.ctx.forEach(m => { const r = m.userData.ring; m.visible = r == null || r <= L.ring; });   // demo grounds: fewer mirrored surround tiles at low quality
  const U = s.mat.userData.U; U.uSimple.value = L.simple; U.uNrmOn.value = L.nrm;
  if (s.ctxMat && s.ctxMat !== s.mat && s.ctxMat.userData.U) { s.ctxMat.userData.U.uSimple.value = L.simple; s.ctxMat.userData.U.uNrmOn.value = L.nrm; }
  if (s.rover) s.rover.model.traverse(o => { if (o.userData.tiny) o.visible = !!L.tiny; });
}
export const siteQuality = { applySide: s => applySide(s), level: () => V.q || qLevel() };
function paintModes() { document.querySelectorAll('#colorModes button').forEach(b => b.classList.toggle('active', b.dataset.mode === V.mode)); }
function paintSpeeds() { document.querySelectorAll('#speeds button').forEach(b => b.classList.toggle('active', +b.dataset.speed === V.speed)); }
function resize() {
  if (!V.ready || !V.renderer) return;
  const w = $('vpStage').clientWidth, h = $('vpStage').clientHeight;
  if (w && h) V.renderer.setSize(w, h, false);
  wake();
}
function sunDir() {
  const el = +$('sunEl').value * Math.PI / 180, az = +$('sunAz').value * Math.PI / 180;
  return new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), -Math.cos(el) * Math.cos(az));   // compass azimuth: 0 = north (-z), 90 = east (+x); the ground is north-up
}
function setSun() { V.sunV = sunDir(); }

// ---------------------------------------------------------------- ground textures and material (unchanged from the old file)
function avgColour(img) {
  const c = document.createElement('canvas'); c.width = c.height = 8; const g = c.getContext('2d'); g.drawImage(img, 0, 0, 8, 8);
  const d = g.getImageData(0, 0, 8, 8).data, a = [0, 0, 0];
  for (let i = 0; i < 64; i++) for (let k = 0; k < 3; k++) a[k] += d[i * 4 + k] / 255 / 64;
  return new THREE.Vector3(...a.map(v => Math.pow(v, 2.2)));   // sRGB average -> linear
}
async function loadGround() {
  if (V.tex) return V.tex;
  const L = new THREE.TextureLoader(), maxA = Math.min(8, V.renderer.capabilities.getMaxAnisotropy());
  const one = (url, srgb) => L.loadAsync(url).then(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = maxA; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; });
  const set = async name => {
    const b = `${ROOT}assets/textures/ground/${name}/${name}_`;
    const [map, normal, rough] = await Promise.all([one(b + 'color_1k.jpg', true), one(b + 'normal_gl_1k.jpg', false), one(b + 'roughness_1k.jpg', false)]);
    return { map, normal, rough, avg: avgColour(map.image) };
  };
  V.tex = { rock: await set('rocks_ground_02'), sand: await set('coast_sand_rocks_02') };
  return V.tex;
}
const LOOK = {
  moon: { set: 'rock', tint: [0.9, 0.9, 0.88], sat: 0.0, scale: 5, nrm: 1.0, bright: 1.25 },
  mars: { set: 'rock', tint: [1.05, 0.7, 0.52], sat: 0.42, scale: 5, nrm: 1.0, bright: 1.25 },
  earth: { set: 'sand', tint: [1.1, 1.05, 0.9], sat: 1.0, scale: 4, nrm: 1.0, bright: 1.45 },
};
const IMG_TINT = { moon: [1.0, 1.0, 0.98], mars: [1.28, 0.9, 0.68], earth: [1, 1, 1] };
const ROCK = { moon: 0x8d8d8a, mars: 0x8a5a41, earth: 0x8c8172 };
function groundMaterial(body, tex, traits, o) {
  const lk = { ...LOOK[body] }, t = tex && tex[lk.set];
  if (body === 'earth' && traits && !o.img) {   // rough visual hint from the site's own traits, not a land-cover map (only when there is no real image)
    if (traits.temp_mean < 270) Object.assign(lk, { tint: [1.5, 1.55, 1.65], sat: 0.15, bright: 1.55 });
    else if (traits.dust > 0.62) Object.assign(lk, { tint: [1.35, 1.15, 0.8], sat: 0.6 });
  }
  const m = t ? new THREE.MeshStandardMaterial({ map: t.map, normalMap: t.normal, roughnessMap: t.rough, roughness: 1, metalness: 0, side: THREE.DoubleSide })
    : new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(...lk.tint.map(v => v * 0.3)), roughness: 1, metalness: 0, side: THREE.DoubleSide });
  const U = { uTint: { value: new THREE.Vector3(...lk.tint).multiplyScalar(lk.bright) }, uSat: { value: lk.sat }, uScale: { value: lk.scale }, uAvg: { value: t ? t.avg : new THREE.Vector3(0.3, 0.3, 0.3) }, uNrm: { value: lk.nrm },
    uPatch: { value: o.size }, uEx: { value: 1 }, uMode: { value: 0 }, uSpan: { value: new THREE.Vector2(o.span[0], Math.max(o.span[1], o.span[0] + 1e-3)) }, uSlopeTex: { value: o.slopeTex }, uHasSlope: { value: o.slopeTex ? 1 : 0 }, uRange: { value: NRM_RANGE },
    uSimple: { value: 0 }, uNrmOn: { value: 1 },
    uImg: { value: o.img || null }, uHasImg: { value: o.img ? 1 : 0 }, uImgTint: { value: o.gray ? new THREE.Vector3(...IMG_TINT[body]) : new THREE.Vector3(1, 1, 1) } };
  m.userData.U = U;
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos; uniform float uScale;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\n vec4 _wp = modelMatrix * vec4(position, 1.0); vWPos = _wp.xyz;\n #ifdef USE_NORMALMAP\n vNormalMapUv = _wp.xz / uScale;\n #endif\n #ifdef USE_MAP\n vMapUv = _wp.xz / uScale;\n #endif\n #ifdef USE_ROUGHNESSMAP\n vRoughnessMapUv = _wp.xz / uScale;\n #endif');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vWPos; uniform vec3 uTint; uniform float uSat; uniform float uScale; uniform vec3 uAvg; uniform float uNrm;
        uniform float uPatch; uniform float uEx; uniform int uMode; uniform vec2 uSpan; uniform sampler2D uSlopeTex; uniform float uHasSlope; uniform float uRange; uniform sampler2D uImg; uniform float uHasImg; uniform vec3 uImgTint; uniform float uSimple; uniform float uNrmOn;
        vec3 ramp4(float t, vec3 a, vec3 b, vec3 c, vec3 d, float s1, float s2) { t = clamp(t, 0.0, 1.0); return t < s1 ? mix(a, b, t / s1) : t < s2 ? mix(b, c, (t - s1) / (s2 - s1)) : mix(c, d, (t - s2) / (1.0 - s2)); }`)
      .replace('#include <map_fragment>', `
        vec2 puv = vWPos.xz / uPatch + 0.5; float inP = step(0.0, puv.x) * step(puv.x, 1.0) * step(0.0, puv.y) * step(puv.y, 1.0);
        vec2 gH = vec2(0.0); float hasG = uHasSlope * inP;
        if (hasG > 0.5) gH = (texture2D(uSlopeTex, puv).rg * 2.0 - 1.0) * uRange;
        float slopeDeg = degrees(atan(length(gH)));
        vec3 gb = vec3(1.0); float w1x = 0.0;
        #ifdef USE_MAP
        mat2 R1 = mat2(0.8253, -0.5646, 0.5646, 0.8253), R2 = mat2(0.8776, 0.4794, -0.4794, 0.8776);
        vec2 w1 = vWPos.xz / uScale; vec2 w2 = vWPos.xz / (uScale * 0.21) + vec2(0.37, 0.71); vec2 w3 = vWPos.xz / (uScale * 6.3);
        vec2 w4 = (R1 * vWPos.xz) / (uScale * 1.7) + vec2(0.21, 0.55); vec2 w5 = (R2 * vWPos.xz) / (uScale * 0.47);
        if (uSimple > 0.5) gb = texture2D(map, w1).rgb;   // low quality: one texture scale, no macro variation
        else gb = mix((texture2D(map, w1).rgb + texture2D(map, w4).rgb) * 0.5, (texture2D(map, w2).rgb + texture2D(map, w5).rgb) * 0.5, 0.35);
        gb = uAvg + (gb - uAvg) * 1.6;
        float glum = dot(gb, vec3(0.299, 0.587, 0.114));
        gb = mix(vec3(glum), gb, uSat) * uTint;
        float macro = uSimple > 0.5 ? 1.0 : dot(texture2D(map, w3).rgb, vec3(0.333)) / max(0.02, dot(uAvg, vec3(0.333)));
        float farK = smoothstep(180.0, 1100.0, length(vViewPosition));
        gb *= mix(clamp(0.74 + 0.36 * macro, 0.62, 1.3), 1.0, farK);
        vec3 gmean = mix(vec3(dot(uAvg, vec3(0.299, 0.587, 0.114))), uAvg, uSat) * uTint;
        gb = mix(gb, gmean, farK * 0.85);
        if (uHasImg * inP > 0.5) {
          vec3 im = texture2D(uImg, puv).rgb * uImgTint;
          float grain = glum / max(0.02, dot(uAvg, vec3(0.299, 0.587, 0.114)));
          float nearW = (1.0 - smoothstep(20.0, 130.0, length(vViewPosition))) * mix(0.5, 0.9, clamp(slopeDeg / 25.0, 0.0, 1.0));
          gb = im * mix(1.0, clamp(grain, 0.55, 1.5), nearW);
        }
        #endif
        vec3 modeTint = vec3(1.0);
        if (uMode == 1) modeTint = 0.4 + 0.6 * ramp4(slopeDeg / 30.0, vec3(0.62, 0.86, 0.66), vec3(0.95, 0.92, 0.55), vec3(0.98, 0.7, 0.45), vec3(0.95, 0.5, 0.45), 0.35, 0.7);
        else if (uMode == 2) modeTint = 0.4 + 0.6 * ramp4((vWPos.y / uEx - uSpan.x) / (uSpan.y - uSpan.x), vec3(0.55, 0.68, 0.9), vec3(0.6, 0.85, 0.82), vec3(0.95, 0.9, 0.7), vec3(1.0, 0.97, 0.94), 0.35, 0.65);
        if (uMode != 0) gb = mix(gb, vec3(dot(gb, vec3(0.333))), 0.6) * modeTint * 1.25;
        diffuseColor.rgb *= max(gb, vec3(0.0));`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = roughness;\n #ifdef USE_ROUGHNESSMAP\n roughnessFactor *= clamp(mix(texture2D(roughnessMap, w1).g, texture2D(roughnessMap, w2).g, 0.35), 0.6, 1.0);\n #endif')
      .replace('#include <normal_fragment_maps>', `
        if (hasG > 0.5) normal = normalize((viewMatrix * vec4(normalize(vec3(-gH.x * uEx, 1.0, -gH.y * uEx)), 0.0)).xyz);
        #ifdef USE_NORMALMAP
        if (uNrmOn > 0.5) {
        mat3 tbnG = getTangentFrame(-vViewPosition, normal, vNormalMapUv);
        vec3 n1 = texture2D(normalMap, w1).xyz * 2.0 - 1.0; vec3 n2 = texture2D(normalMap, w2).xyz * 2.0 - 1.0;
        vec3 mapN = normalize(vec3(n1.xy + n2.xy * 0.8, n1.z));
        float dnear = 1.0 - smoothstep(50.0, 800.0, length(vViewPosition));
        mapN.xy *= uNrm * dnear;
        normal = normalize(tbnG * mapN);
        }
        #endif`);
  };
  return m;
}
// ---------------------------------------------------------------- sky
const SKY = {
  moon: { top: 0x000000, hor: 0x07080b, fog: 0x07080b },
  mars: { top: 0x7c5a48, hor: 0xcfa27f, fog: 0xcfa27f },
  earth: { top: 0x3b78bd, hor: 0xbcd3e6, fog: 0xbcd3e6 },
};
function makeSky(body, far) {
  const c = SKY[body];
  const m = new THREE.ShaderMaterial({
    uniforms: { top: { value: new THREE.Color(c.top) }, hor: { value: new THREE.Color(c.hor) } },
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 hor; varying vec3 vD; void main(){ float t = pow(clamp(vD.y * 1.4, 0.0, 1.0), 0.55); gl_FragColor = vec4(mix(hor, top, t), 1.0); }',
    side: THREE.BackSide, depthWrite: false, fog: false,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(far * 0.85, 32, 16), m); sky.renderOrder = -2; sky.frustumCulled = false;
  return sky;
}

// ---------------------------------------------------------------- terrain meshes (tiles, surroundings, rocks: see ground.js)
function setMode() { V.sides.forEach(s => { s.mat.userData.U.uMode.value = { plain: 0, slope: 1, elev: 2 }[V.mode]; }); wake(); }
function updateGeometry(s) {
  wake();
  const p = s.patch, ex = V.exag, half = p.size / 2;
  s.ground.setExag(ex); s.mat.userData.U.uEx.value = ex; if (s.tracks) s.tracks.reset();
  const n = 64, pts = [];
  const edge = (t, side) => { const c = t * p.size; return side === 0 ? [c, 0] : side === 1 ? [p.size, c] : side === 2 ? [p.size - c, p.size] : [0, p.size - c]; };
  for (let side = 0; side < 4; side++) for (let k = 0; k < n; k++) { const [x, z] = edge(k / n, side); pts.push(x - half, surfaceH(p, x, z) * ex + 0.6, z - half); }
  s.outline.geometry.dispose(); s.outline.geometry = new THREE.BufferGeometry(); s.outline.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  if (V.runs) drawRoutes();
}
/** The draped imagery (canvases from imagery.ts) as textures. Row 0 of the picture is the north edge = z 0. */
function imageryTextures(imagery) {
  if (!imagery || !imagery.img) return null;
  const maxA = Math.min(8, V.renderer.capabilities.getMaxAnisotropy());
  const one = c => { const t = new THREE.CanvasTexture(c); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxA; t.needsUpdate = true; return t; };
  return { gray: false, img: one(imagery.img.canvas), ctx: imagery.ctx ? one(imagery.ctx.canvas) : null };
}
function buildSide(patch, body, color, tex, idx, traits, imagery, ground) {
  const f = patch.size / 2000, far = patch.size * 30, c = SKY[body];
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(c.fog, 2200 * f, 7200 * f);
  const sky = makeSky(body, far); scene.add(sky);
  const hemi = new THREE.HemisphereLight(0xa9c4e8, 0x4a4338, 1.2);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff2dc, 3.2);
  sun.castShadow = true; sun.shadow.mapSize.set(1536, 1536); sun.shadow.bias = -0.0004;
  scene.add(sun, sun.target);
  const own = [], keepT = t => { if (t) own.push(t); return t; };
  const slopeTex = keepT(slopeTexture(patch, Math.min(4, V.renderer.capabilities.getMaxAnisotropy())));
  const im = imageryTextures(imagery);
  if (im) { keepT(im.img); keepT(im.ctx); }
  const mat = groundMaterial(body, tex, traits, { size: patch.size, span: [patch.min, patch.max], slopeTex, img: im && im.img, gray: im && im.gray });
  const ctxMat = patch.C ? (im && im.ctx ? groundMaterial(body, tex, traits, { size: patch.C.size, span: [patch.min, patch.max], slopeTex: null, img: im.ctx, gray: im.gray }) : mat) : null;
  const lod = +new URLSearchParams(location.search).get('lod') || 0.03;
  const gr = new Ground(scene, patch, mat, ctxMat, { k: lod, rock: { color: ROCK[body], abundance: clamp(0.3 + 0.03 * patch.stats.slope_med, 0.25, 0.75) } });
  const outline = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 })); outline.renderOrder = 4; scene.add(outline);
  const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 });
  const line = new THREE.Line(new THREE.BufferGeometry(), lineMat), lineOn = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff })); line.renderOrder = lineOn.renderOrder = 5; line.visible = lineOn.visible = false; scene.add(line, lineOn);
  const marker = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1, 14), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, fog: false, depthTest: false })); marker.renderOrder = 8; marker.rotation.x = Math.PI; scene.add(marker);
  const s = { idx, patch, body, scene, sky, sun, hemi, mat, ctxMat, ground: gr, tracks: new Tracks(scene), own, outline, line, lineOn, marker, color, rover: null, pose: { init: false }, ...ground };
  updateGeometry(s); applySide(s);
  return s;
}

// ---------------------------------------------------------------- rover models
async function makeRovers() {
  const cfg = RS.cfg, insts = [];
  for (let i = 0; i < V.sides.length; i++) insts.push(await createInstance(cfg));   // the same rover model and scale in every pane
  V.sides.forEach((s, i) => { if (s.rover) s.rover.dispose(); s.rover = insts[i]; s.scene.add(insts[i].root); });
  V.sides.forEach(applySide);   // tiny-part visibility of the new rover follows the quality level
  await evictExcept(cfg.model).catch(e => console.error(e));
  if (RS.modelError) siteNote(RS.modelError);
  return true;
}

// ---------------------------------------------------------------- grounds: the target's own ground beside the Earth place (default), or one Earth ground at two gravities
const gEarth = () => D.meta.gravity.earth;
const BODY = { mars: 'Mars', moon: 'Moon', earth: 'Earth' };
/** Friction of a ground entry: its slider in the panel, or the default for its soil before the panel exists. */
const muOf = g => { const el = $(g.muId); return el ? +el.value : frictionFromSoil(g.soil); };
/** The Earth place at two gravities, on its own ground and soil: [target gravity, Earth gravity]. */
function groundEntries() {
  const c = V.ctx, S = RS.reg.soils[c.soil.cls];
  const base = { soil: c.soil.soil, S, cls: S.label, clsId: c.soil.cls, patch: V.patch, body: 'earth', imagery: V.imagery, traits: c.traits, muId: 'muE', same: true };
  return [
    { ...base, key: 'target', label: `${c.target.bodyName} gravity`, short: `${c.target.bodyName} g`, g: c.target.gravity, color: 0x38bdf8, dvLine: `This Earth ground at the gravity of ${c.target.name}` },
    { ...base, key: 'earth', label: 'Earth gravity', short: 'Earth g', g: gEarth(), color: 0xfb923c, dvLine: 'This Earth ground at its own gravity' },
  ];
}
/** The old app's comparison: the target's own ground (its terrain, gravity and soil from its traits) beside the Earth place. [target ground, Earth ground]. */
function compareEntries() {
  const c = V.ctx, tg = V.tg, tr = tg.target.traits, clsT = groundClass(tr), ST = RS.reg.soils[clsT], [, e] = groundEntries();
  return [
    { key: 'target', same: false, patch: tg.patch, body: tg.target.body, imagery: null, traits: tr, soil: tr.soil, S: ST, cls: ST.label, clsId: clsT, muId: 'muT', g: tg.target.gravity, color: 0x38bdf8,
      label: `${BODY[tg.target.body]} ground`, short: tg.target.short, title: tg.title, dvLine: `${tg.target.name}, at ${BODY[tg.target.body]} gravity` },
    { ...e, same: false, label: 'Earth ground', short: 'Earth', title: `Earth: ${c.place.name} · ${gEarth()} m/s²`, dvLine: 'This Earth place at its own gravity' },
  ];
}
const comparing = () => V.gmode === 'compare' && !!V.tg;
function wantedSides() { if (comparing()) return compareEntries(); const [t, e] = groundEntries(); return V.gmode === 'both' ? [t, e] : V.gmode === 'target' ? [t] : [e]; }
/** The two drives every comparison is made of, each on its own ground with its own route and friction: [target, Earth]. */
function runEntries() {
  const cmp = comparing(), [t, e] = cmp ? compareEntries() : groundEntries();
  return [{ ...t, mu: muOf(t), route: V.routes[0] }, { ...e, mu: muOf(e), route: cmp ? V.routes[1] || V.routes[0] : V.routes[0] }];
}
function roverCtx() {
  if (!V.ctx || !V.runs) return null;
  const [t, e] = runEntries();
  // the ground on screen first: the Customize readout and "Compare two builds" open on it
  return { gT: V.ctx.target.gravity, grounds: V.gmode === 'earth' ? [e, t] : [t, e] };
}
let buildPending = 0, pendingKind = '';
async function applyBuild(kind) {
  if (!V.open || V.drive || !V.runs) return;
  if (kind === 'rover') { await makeRovers(); planAll(); } else V.sides.forEach(s => updateInstance(s.rover, RS.cfg));
  computeRuns(); V.runs.verdictShown = false; $('vpVerdict').classList.add('hidden'); $('verdict').classList.add('hidden');
  paintSimIntro(); V.sides.forEach(s => { s.pose.init = false; }); updateAll(true); refreshRoverUI();
}

/** Builds (or rebuilds, when the view choice changes) the panes. Each pane is a scene of its own, with its own ground, camera and level of detail. */
async function buildPanes() {
  V.playing = false; V.u = 0; V.snap = true; V.shown = false; V.runs = null; V.routes = null;
  guard('the old panes', null, disposeSides);
  const wanted = wantedSides(), both = wanted.length > 1;
  $('vpStage').classList.toggle('single', !both); $('linkWrap').classList.toggle('hidden', !both);
  const ok = !!(V.gl && guard('the 3D terrain', null, () => {
    V.sides = wanted.map((g, i) => buildSide(g.patch, g.body, both ? g.color : 0xfb923c, V.tex, i, g.traits, g.imagery, g));
    $('exag').value = 1; $('exagO').textContent = '1'; V.exag = 1;
    play(false); setMode();
    V.cams.forEach((c, i) => { const sz = (V.sides[i] || V.sides[0]).patch.size; c.camera.near = Math.max(0.25, sz * 0.00012); c.camera.far = sz * 30; c.camera.updateProjectionMatrix(); c.controls.maxDistance = sz * 1.9; c.anim = null; });
    return true;
  }));
  if (!ok) { V.sides = []; siteNote('The 3D view is not available. The panels still work.'); return false; }
  const roverOK = await guardAsync('the rover', 'roverBar', makeRovers);
  if (roverOK !== undefined) {
    guard('the rover simulation', 'simStatus', () => { planAll(); computeRuns(); });
    V.sides.forEach(s => { if (s.rover) s.rover.root.visible = true; s.line.visible = s.lineOn.visible = true; s.pose.init = false; });
    $('vpVerdict').classList.add('hidden'); $('verdict').classList.add('hidden');
    guard('the rover simulation', 'simStatus', () => updateAll(true));
  }
  guard('the labels', 'siteTitle', fillLabels);
  guard('the camera', null, () => goView(false, true));
  V.lodReady = false; wake();
  return true;
}

// ---------------------------------------------------------------- open / close
/** Opens Site View on a prepared ground. ctx: { place, target, soil, traits, prov, similarity } (index.ts), patch: terrain.js makePatch(), imagery: { img, ctx, spec },
 *  targetGround: { target, patch, title } of the Mars or Moon ground (targetground.ts), or null when it could not be loaded. */
export async function openSite({ host, ctx, patch, imagery, targetGround, onBack }) {
  installInfo();
  V = fresh(); V.host = host; V.ctx = ctx; V.patch = patch; V.imagery = imagery; V.onBack = onBack;
  V.tg = targetGround || null; V.gmode = V.tg ? 'compare' : 'earth';   // the target's own ground beside the Earth place is the default view
  host.insertAdjacentHTML('beforeend', TEMPLATE);
  motion.scale = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.05 : 1;
  V.gl = !!guard('the 3D renderer', null, () => { ensureRenderer(); return true; });
  guard('the rover registry', null, () => { initRovers(D.rovers, ctx.target.body); });
  if (RS.error) siteNote(RS.error);
  if (targetGround === null) siteNote(`The ${ctx.target.bodyName} ground could not be loaded, so this Earth place is shown on its own.`);
  guard('the rover panel', 'roverBar', () => {
    V.off.push(onChange(kind => { pendingKind = pendingKind === 'rover' || kind === 'rover' ? 'rover' : kind; clearTimeout(buildPending); buildPending = setTimeout(() => { const k = pendingKind; pendingKind = ''; applyBuild(k).catch(e => failPanel('simStatus', 'the rover build', e)); }, pendingKind === 'rover' ? 0 : 100); }));
    initRoverUI({ ctx: roverCtx });
  });
  if (V.gl) { try { await loadGround(); } catch (e) { console.error(e); siteNote(`Could not load the ground textures: ${errText(e)}. A plain ground colour is used.`); } }
  guard('the view layout', null, () => { resize(); paintModes(); paintSpeeds(); });
  guard('the ground table', 'cmpTable', fillGround);
  guard('the soil table', 'soilTable', fillSoil);
  guard('the target ground table', 'tgtTable', fillTarget);
  guard('the rover simulation panel', 'simInputs', buildSimPanel);
  guard('the similarity score', null, fillSimilarity);
  { const el = V.tg && V.tg.target.polar ? 8 : 35; $('sunEl').value = el; $('sunElO').textContent = String(el); }   // a polar target: low sun, as in the old app
  $('sunAz').value = 135; $('sunAzO').textContent = '135'; setSun();
  $('follow').checked = V.follow = true; $('link').checked = V.link = true;
  guard('the default rover', null, () => { if (!RS.picked && !RS.recalled && !RS.error) selectRover(defaultForBody(ctx.target.body)); });
  await buildPanes();
  V.open = true; cancelAnimationFrame(V.raf); V.last = performance.now(); V.frameErr = false; V.simErr = false; V.lodReady = false;
  if (V.sides.length) V.raf = requestAnimationFrame(frame);
  window.TERRA_SITE = V;
  guard('the VR button', null, () => initVR(vrHooks));
}
/** What vr.js may use of Site View: playback, the rovers, the grounds and the way back to the normal two-pane view. */
const vrHooks = {
  get V() { return V; },
  slot: () => $('vrSlot'),
  siteNote,
  advancePlayback,
  togglePlay,
  restart: () => { V.u = 0; V.snap = true; V.shown = false; play(true); },
  setSpeed: sp => { V.speed = sp; paintSpeeds(); },
  setExag: ex => { $('exag').value = ex; $('exagO').textContent = String(ex); V.exag = ex; V.sides.forEach(updateGeometry); updateAll(true); },
  setShadowSize,
  applySide,
  wake,
  title: s => s.title || (s.same && s.key === 'target' ? `Earth ground at ${V.ctx.target.bodyName} gravity · ${s.g} m/s²` : `Earth: ${V.ctx.place.name} · ${s.g} m/s²`),
  startSide: () => (comparing() ? 0 : Math.max(0, V.sides.findIndex(s => s.key === 'earth'))),
  /** Back to the normal loop after a VR session: canvas size, shadows, cameras and the two-pane layout are drawn as before. */
  resume: () => { if (!V.open) return; V.renderer.setScissorTest(true); resize(); V.sides.forEach(applySide); V.last = performance.now(); V.snap = true; V.lodReady = false; wake(2000); cancelAnimationFrame(V.raf); V.raf = requestAnimationFrame(frame); },
};
function disposeScene(scene) {
  const keep = new Set(); if (V.tex) for (const k in V.tex) { const t = V.tex[k]; keep.add(t.map); keep.add(t.normal); keep.add(t.rough); }
  scene.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    for (const m of [].concat(o.material || [])) { for (const key in m) { const t = m[key]; if (t && t.isTexture && !keep.has(t)) t.dispose(); } m.dispose(); }
    if (o.isLight && o.dispose) o.dispose();
  });
  scene.clear();
}
function disposeSides() {
  V.sides.forEach(s => { if (s.rover) { s.rover.dispose(); s.rover = null; } s.tracks.dispose(); s.ground.dispose(); s.own.forEach(t => t.dispose()); if (s.ctxMat && s.ctxMat !== s.mat) s.ctxMat.dispose(); disposeScene(s.scene); });
  V.sides = []; if (V.renderer) V.renderer.renderLists.dispose();
}
/** Leaves Site View and frees everything it made: GPU resources, rover models, listeners, the DOM. */
export async function closeSite() {
  await exitVR();
  if (V.drive) await V.drive.exit(true);
  closeInfo();
  V.open = false; cancelAnimationFrame(V.raf); V.playing = false; clearTimeout(buildPending);
  guard('the old terrain', null, disposeSides); V.runs = null; V.routes = null;
  // The wheel-track material is one static object shared by every pane (ground.js, unchanged). Each renderer that drew it hangs a dispose
  // listener on it, and that listener keeps the renderer alive: disposing it here lets this renderer go. A later renderer sets it up again.
  if (Tracks.mat) Tracks.mat.dispose();
  try { const dm = await import('./drivemode.js'); dm.disposeDrive(); } catch (e) { console.error(e); }
  await evictExcept(null).catch(e => console.error(e));
  if (V.tex) { for (const k in V.tex) { const t = V.tex[k]; t.map.dispose(); t.normal.dispose(); t.rough.dispose(); } V.tex = null; }
  V.cams.forEach(c => c.controls.dispose()); V.cams = [];
  if (V.ro) V.ro.disconnect();
  V.off.forEach(f => { try { f(); } catch (e) { /* ignore */ } }); V.off = [];
  disposeRoverUI();
  if (V.renderer) { V.renderer.renderLists.dispose(); V.renderer.setSize(1, 1, false); V.renderer = null; }
  if (V.host) V.host.innerHTML = '';
  delete window.TERRA_SITE;
  V = fresh();
}

function fillLabels() {
  const c = V.ctx;
  $('siteTitle').innerHTML = `<span class="r">${esc(c.place.name)}</span><span class="meta">${c.place.lat.toFixed(4)}, ${c.place.lon.toFixed(4)} &middot; 2 km patch, 10 km context &middot; target ${esc(c.target.name)}</span>`;
  const sub = s => s.key === 'target' && !s.same ? (() => { const tc = s.patch.prov && s.patch.prov.site_center || [V.tg.target.lat, V.tg.target.lon]; return `${(s.patch.size / 1000).toFixed(0)} km patch at ${tc[0].toFixed(3)}, ${tc[1].toFixed(3)}`; })()
    : !s.same ? `${c.place.lat.toFixed(3)}, ${c.place.lon.toFixed(3)}` : `g ${s.g} m/s&sup2; &middot; same Earth ground`;
  const label = s => `${s.title ? esc(s.title) : s.key === 'target' ? `At ${esc(c.target.bodyName)} gravity` : 'At Earth gravity'}<small>${sub(s)}</small>`;
  $('vpLeft').innerHTML = V.sides[0] ? label(V.sides[0]) : '';
  $('vpRight').innerHTML = V.sides[1] ? label(V.sides[1]) : '';
  $('viewInfo').innerHTML = info(comparing() ? `Left is the real ${BODY[V.tg.target.body]} ground, right is this Earth place. North is at the top in both, and the rocks are for looks only.`
    : V.sides.length > 1 ? 'Both views show the same Earth ground, and only gravity differs. North is at the top, and the rocks are for looks only.' : 'North is at the top. The close-up texture and the rocks are for looks only. The area outside the outline is the wider 10 km surroundings.', 'About this view');
}
function row(k, v) { return `<tr><td>${esc(k)}</td><td class="n">${esc(v)}</td></tr>`; }
function fillGround() {
  const e = V.patch.prov, im = V.imagery, st = V.patch.stats, m = x => (x >= 10 ? x.toFixed(0) : x.toFixed(1)) + ' m';
  $('cmpTable').innerHTML = [
    row('Elevation source', e.elevation_source),
    row('Elevation spacing', `${m(e.spacing_ns_m)} N-S${e.spacing_ew_m ? `, ${m(e.spacing_ew_m)} E-W` : ''}`),
    row('Fine grid', `${upsample(V.patch).M} x ${upsample(V.patch).M} at ${(V.patch.size / (upsample(V.patch).M - 1)).toFixed(2)} m`),
    row('Below about ' + m(2 * e.elevation_resolution_m), e.synthetic_fine ? `interpolation plus fractal detail, rms ${(e.fine_detail_rms_m * 100).toFixed(0)} cm` : 'source'),
    row('Context ring', `${e.ctx.n} x ${e.ctx.n} at 62.5 m, ${Math.round(e.ctx.valid * 100)} % with data`),
    row('Imagery', im && im.img ? `${im.spec.label}, zoom ${im.img.zoom} (${m(im.img.tilePixelM)} pixels)` : 'none'),
    row('Median slope, 90th pct', `${st.slope_med.toFixed(1)}°, ${st.slope_p90.toFixed(1)}°`),
    row('Relief in the patch', m(st.relief)),
    row('Lowest point', `${e.hmin.toFixed(1)} m (EGM2008)`),
  ].join('');
  // Attribution and licence (legally required): small and muted, at the bottom of the details panel.
  $('siteCredits').innerHTML = (im && im.img ? `<p>${esc(im.spec.attribution)}. Terms: ${esc(im.spec.terms)}</p>` : '') + `<p>${esc(e.licence[0])}.</p>`
    + (V.tg && V.tg.patch.prov && V.tg.patch.prov.licence ? V.tg.patch.prov.licence.map(l => `<p>${esc(V.tg.target.name)}: ${esc(l)}.</p>`).join('') : '');
}
/** The Mars or Moon ground of the comparison: where it is from and the soil the rover gets there (its traits through the soil classes, as in the old app). */
function fillTarget() {
  const sec = $('tgtSec');
  if (!V.tg) { sec.classList.add('hidden'); return; }
  const t = V.tg.target, p = V.tg.patch, e = p.prov || {}, st = p.stats, cls = RS.reg.soils[groundClass(t.traits)], m = x => (x >= 10 ? x.toFixed(0) : x.toFixed(1)) + ' m';
  $('tgtHead').textContent = `${BODY[t.body]} ground`;
  $('tgtTable').innerHTML = [
    row('Place', t.name),
    row('Elevation source', e.real ? e.elevation_source : 'stand-in terrain (no elevation data for this place yet)'),
    ...(e.real ? [row('Elevation spacing', m(e.size_m / (e.real.n - 1)))] : []),
    row('Median slope, 90th pct', `${st.slope_med.toFixed(1)}°, ${st.slope_p90.toFixed(1)}°`),
    row('Relief in the patch', m(st.relief)),
    row('Gravity', `${t.gravity} m/s²`),
    row('Ground class', cls.label),
    row('Soil competence, dust', `${t.traits.soil.toFixed(2)}, ${t.traits.dust.toFixed(2)}`),
    row('Friction (default)', frictionFromSoil(t.traits.soil).toFixed(2)),
  ].join('');
  sec.classList.remove('hidden');
}
function fillSoil() {
  const s = V.ctx.soil, S = RS.reg.soils[s.cls];
  $('soilTable').innerHTML = s.rows.map(r => row(r.field, r.value)).join('') +
    row('Friction (default)', frictionFromSoil(s.soil).toFixed(2)) + row(`Bekker n, kc, kphi (${S.label})`, `${S.n}, ${S.kc}, ${S.kphi}`);
}

/** The analog card's similarity of this place to the chosen Moon or Mars site, the same number and format (ctx.similarity, from index.ts). Hidden when there is none. */
function fillSimilarity() {
  const el = $('simScore'), s = V.ctx.similarity;
  if (!s || !s.text || !s.target) { el.classList.add('hidden'); el.innerHTML = ''; return; }
  el.innerHTML = `<div class="sim-score-text">Similarity to ${esc(s.target)} ${info('How closely this Earth place matches the chosen Moon or Mars site across terrain, rock, climate and other factors. Higher is closer.', 'About the similarity score')}</div><div class="sim-score-num">${esc(s.text)}</div>`;
  el.classList.remove('hidden');
}

// ---------------------------------------------------------------- simulation set-up
function paintSimIntro() {
  const c = V.ctx, par = RS.cfg, gT = c.target.gravity, eq = par.mass_kg * gT / 9.81, test = par.base_badge === 'test';
  const lab = $('eqMassLbl'); if (!lab) return;
  lab.innerHTML = test ? `Equal wheel load: not needed for this rover ${info('This test rover is already built to weigh on Earth what Curiosity weighs on Mars, so it does not need this.', 'About equal wheel load')}`
    : `Equal wheel load at Earth gravity (${eq.toFixed(0)} kg) ${info("Makes the rover lighter on Earth, so its wheels press on the ground as hard as they would on Mars or the Moon. NASA's Scarecrow test rover works the same way.", 'About equal wheel load')}`;
  $('eqMass').disabled = test; if (test) $('eqMass').checked = false;
}
function buildSimPanel() {
  const c = V.ctx;
  $('simInputs').innerHTML = `
    <div class="gsel"><span>Compare</span><div class="seg small" id="gMode" role="radiogroup" aria-label="What to compare">
      ${V.tg ? `<button data-g="compare" role="radio">${BODY[V.tg.target.body]} ground vs Earth</button>` : ''}<button data-g="both" role="radio">Same ground, two gravities</button><button data-g="earth" role="radio">Earth 9.81</button><button data-g="target" role="radio">${esc(c.target.bodyName)} ${c.target.gravity}</button></div></div>
    ${V.tg ? `<label id="muTWrap">Friction, ${BODY[V.tg.target.body]} ground<input id="muT" type="range" min="0.2" max="1" step="0.01" value="${frictionFromSoil(V.tg.target.traits.soil).toFixed(2)}"><output></output></label>` : ''}
    <label><span id="muELbl">Friction, Earth ground</span><input id="muE" type="range" min="0.2" max="1" step="0.01" value="${frictionFromSoil(c.soil.soil).toFixed(2)}"><output></output></label>
    <label class="chk"><input id="eqMass" type="checkbox"><span id="eqMassLbl"></span></label>`;
  const paintG = () => {
    $('gMode').querySelectorAll('button').forEach(b => { b.classList.toggle('active', b.dataset.g === V.gmode); b.setAttribute('aria-checked', b.dataset.g === V.gmode); });
    if ($('muTWrap')) $('muTWrap').classList.toggle('hidden', !comparing());   // the target's own friction only matters when its ground is shown
    $('muELbl').textContent = comparing() ? 'Friction, Earth ground' : 'Friction, this soil';
  };
  paintG();
  $('gMode').onclick = e => { const b = e.target.closest('button'); if (!b || b.dataset.g === V.gmode || V.drive) return; V.gmode = b.dataset.g; paintG(); buildPanes().then(() => { paintSimIntro(); refreshRoverUI(); }); };
  $('simInputs').querySelectorAll('input[type=range]').forEach(i => { const o = i.nextElementSibling; o.textContent = (+i.value).toFixed(2); i.oninput = () => { o.textContent = (+i.value).toFixed(2); if (V.runs) guard('the rover simulation', 'simStatus', () => { computeRuns(); updateAll(true); }); }; });
  $('eqMass').onchange = () => { if (V.runs) guard('the rover simulation', 'simStatus', () => { computeRuns(); updateAll(true); }); };
  paintSimIntro();
  $('charts').innerHTML = [['tilt', 'Tilt (deg)'], ['slip', 'Slip (%)'], ['e', 'Energy (J/m)'], ['v', 'Speed (m/s)']].map(([k, l]) => `<div><div class="cl">${l}</div><canvas data-k="${k}"></canvas></div>`).join('');
  $('simStatus').textContent = '';
  buildHud();
}
function straightRoute(p) { const out = [], a = [START[0] * p.size, START[1] * p.size], b = [GOAL[0] * p.size, GOAL[1] * p.size], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(L / DS)); for (let k = 0; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); return out; }
function planAll() {
  const par = RS.cfg, memo = new Map();   // one route per ground: two panes on the same ground share it
  V.routes = V.sides.map(s => { if (!memo.has(s.patch)) memo.set(s.patch, planRoute(s.patch, par) || straightRoute(s.patch)); return memo.get(s.patch); });
}
/** The runs of the open panes. Target: its ground, gravity, soil and friction. Earth: the Earth ground at Earth gravity with the rover's own mass (Er) and with
 *  the equal-wheel-load mass (Eq). On one ground at two gravities both use the Earth ground and soil, as before. */
function computeRuns() {
  const par = RS.cfg, [t, e] = runEntries(), gT = t.g, gE = e.g;
  const run = (x, g, mass) => analyze(x.patch, x.route, par, { g, mass, mu: x.mu, soil: x.soil, S: x.S });
  const T = run(t, gT, par.mass_kg), Er = run(e, gE, par.mass_kg), Eq = run(e, gE, par.base_badge === 'test' ? par.mass_kg : par.mass_kg * gT / gE);
  const E = $('eqMass').checked ? Eq : Er;
  V.runs = { A: V.sides.map(s => (s.key === 'target' ? T : E)), T, Er, Eq, ctx: { gTarget: gT, gEarth: gE, rover: par.name, kind: par.kind }, grounds: [t.clsId, e.clsId], sm: null, verdictShown: false };
  drawRoutes();
}
function drawRoutes() {
  V.sides.forEach((s, i) => {
    const r = V.routes[i], half = s.patch.size / 2, pos = new Float32Array(r.length * 3), ex = V.exag;
    r.forEach(([x, z], k) => { pos[k * 3] = x - half; pos[k * 3 + 1] = surfaceH(s.patch, x, z) * ex + 2.2; pos[k * 3 + 2] = z - half; });
    const attr = new THREE.BufferAttribute(pos, 3);
    s.line.geometry.dispose(); s.line.geometry = new THREE.BufferGeometry(); s.line.geometry.setAttribute('position', attr);
    s.lineOn.geometry.dispose(); s.lineOn.geometry = new THREE.BufferGeometry(); s.lineOn.geometry.setAttribute('position', attr);
    s.lineOn.geometry.setDrawRange(0, 1);
  });
}

// ---------------------------------------------------------------- playback
function play(on) {
  V.playing = on; wake(); $('playBtn').classList.toggle('playing', on);
  $('playBtn').setAttribute('aria-label', on ? 'Pause' : 'Play'); $('playBtn').querySelector('.lbl').textContent = on ? 'Pause' : 'Play';
  if (on) { $('vpVerdict').classList.add('hidden'); if (V.follow && V.u < 0.02 && !V.chased) goView(true); }
}
function togglePlay() { if (V.u >= 1) { V.u = 0; V.snap = true; V.shown = false; } play(!V.playing); }
function goView(chase, snap) {
  V.chased = chase; wake(2500);
  V.sides.forEach((s, i) => {
    const c = V.cams[i], p = s.patch, ex = V.exag;
    let tgt, off;
    if (chase && V.runs) {
      const r = V.routes[i], a = r[0], b = r[Math.min(r.length - 1, 6)], hd = Math.atan2(b[1] - a[1], b[0] - a[0]);
      tgt = s.rover.root.position.clone();
      off = new THREE.Vector3(-Math.cos(hd) * 15, 8, -Math.sin(hd) * 15).add(new THREE.Vector3(-Math.sin(hd) * 5, 0, Math.cos(hd) * 5));
    } else {
      const hasp = Math.max(0.5, c.camera.aspect), vf = 50 * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * hasp), d = (p.size * 0.74) / Math.sin(Math.min(vf, hf) / 2);
      tgt = new THREE.Vector3(0, surfaceH(p, p.size / 2, p.size / 2) * ex, 0); off = new THREE.Vector3(0, Math.sin(0.62), Math.cos(0.62)).multiplyScalar(d);
    }
    const toPos = tgt.clone().add(off);
    if (snap || motion.scale < 0.2) { c.camera.position.copy(toPos); c.controls.target.copy(tgt); c.controls.update(); c.anim = null; }
    else c.anim = { t0: performance.now(), dur: 900 * motion.scale, fp: c.camera.position.clone(), ft: c.controls.target.clone(), tp: toPos, tt: tgt };
  });
}

// ---------------------------------------------------------------- per-frame pose, HUD, charts (unchanged except for one or two panes)
function poseRover(i, kf, dt, snap) {
  const s = V.sides[i], A = V.runs.A[i], par = RS.cfg;
  const k = Math.min(A.n - 2, Math.floor(kf)), f = clamp(kf - k, 0, 1), k1 = k + 1;
  const x = A.x[k] + (A.x[k1] - A.x[k]) * f, z = A.z[k] + (A.z[k1] - A.z[k]) * f;
  let dpsi = A.psi[k1] - A.psi[k]; dpsi = Math.atan2(Math.sin(dpsi), Math.cos(dpsi));
  poseOnGround(s, x, z, A.psi[k] + dpsi * f, { par, ex: V.exag, dt, snap, sink: A.sink ? A.sink[k] + (A.sink[k1] - A.sink[k]) * f : 0, wheelAng: (A.s[k] + (A.s[k1] - A.s[k]) * f) / par.wheel_radius_m, moving: V.playing });
  const live = Math.round(kf); s.lineOn.geometry.setDrawRange(0, Math.min(A.n, live + 1));
}
function buildHud() {
  const row2 = (k, l) => `<div><span>${l}</span><span data-k="${k}">-</span></div>`;
  ['L', 'R'].forEach(sd => { $('hud' + sd).innerHTML = row2('time', 'Time') + row2('dist', 'Distance') + row2('tilt', 'Tilt') + row2('slip', 'Slip') + row2('e', 'Energy per m') + row2('E', 'Energy used'); });
  $('liveCmp').innerHTML = [['tilt', 'Tilt'], ['slip', 'Slip'], ['e', 'Energy per m'], ['time', 'Time']].map(([k, l]) =>
    `<div class="lc-row" data-k="${k}"><span class="lc-t"></span><div class="lc-mid"><label>${l}</label><div class="lc-bar"><i class="a"></i><i class="b"></i></div></div><span class="lc-e"></span></div>`).join('');
  const grab = id => { const o = {}; $(id).querySelectorAll('[data-k]').forEach(e => { o[e.dataset.k] = e; }); return o; };
  V.hud = { L: grab('hudL'), R: grab('hudR'), lc: {} };
  $('liveCmp').querySelectorAll('.lc-row').forEach(r => { V.hud.lc[r.dataset.k] = { t: r.querySelector('.lc-t'), e: r.querySelector('.lc-e'), a: r.querySelector('.a'), b: r.querySelector('.b') }; });
}
const put = (e, t) => { if (e.textContent !== t) e.textContent = t; };
function hudSet(h, a, q) { put(h.time, (a.t[q] / 60).toFixed(1) + ' min'); put(h.dist, a.s[q].toFixed(0) + ' m'); put(h.tilt, a.tilt[q].toFixed(1) + '°'); put(h.slip, a.slip[q].toFixed(0) + ' %'); put(h.e, a.e[q].toFixed(0) + ' J'); put(h.E, (a.E[q] / 3600).toFixed(1) + ' Wh'); }
function lcSet(r, a, b, d, unit) { const sh = (a / Math.max(1e-9, a + b)) * 100; put(r.t, a.toFixed(d) + unit); put(r.e, b.toFixed(d) + unit); r.a.style.width = sh.toFixed(1) + '%'; r.b.style.width = (100 - sh).toFixed(1) + '%'; }
function updateHud(kf) {
  const H = V.hud, A = V.runs.A; if (!H) return;
  const q0 = clamp(Math.round(kf[0]), 0, A[0].n - 1), a = A[0];
  hudSet(H.L, a, q0);
  if (A.length < 2) return;
  const q1 = clamp(Math.round(kf[1]), 0, A[1].n - 1), b = A[1];
  hudSet(H.R, b, q1);
  lcSet(H.lc.tilt, a.tilt[q0], b.tilt[q1], 1, '°'); lcSet(H.lc.slip, a.slip[q0], b.slip[q1], 0, '%'); lcSet(H.lc.e, a.e[q0], b.e[q1], 0, ' J'); lcSet(H.lc.time, a.t[q0] / 60, b.t[q1] / 60, 1, ' min');
}
function smooth(a, w = 9) { const o = new Float32Array(a.length), h = w >> 1; for (let i = 0; i < a.length; i++) { let sum = 0, c = 0; for (let k = Math.max(0, i - h); k <= Math.min(a.length - 1, i + h); k++) { sum += a[k]; c++; } o[i] = sum / c; } return o; }
function drawCharts(kf) {
  const run = V.runs; if (!run.sm) run.sm = run.A.map(A => ({ tilt: smooth(A.tilt), slip: smooth(A.slip), e: smooth(A.e), v: smooth(A.v) }));
  document.querySelectorAll('#charts canvas').forEach(c => {
    const key = c.dataset.k, dpr = window.devicePixelRatio || 1, w = c.clientWidth * dpr, h = c.clientHeight * dpr;
    if (!w) return; if (c.width !== w) { c.width = w; c.height = h; }
    const g = c.getContext('2d'); g.clearRect(0, 0, w, h);
    const mn = 0; if (!run.mx) run.mx = {}; if (!(key in run.mx)) { let m = -Infinity; for (const sm of run.sm) for (let q = 0; q < sm[key].length; q++) if (sm[key][q] > m) m = sm[key][q]; run.mx[key] = m === mn ? mn + 1 : m; }
    const mx = run.mx[key];
    run.A.forEach((A, i) => {
      const col = V.sides[i] && V.sides[i].key === 'target' && V.sides.length > 1 ? COL_T : COL_E, kk = Math.round(kf[i]);
      [[0.28, A.n - 1], [1, kk]].forEach(([alpha, last]) => {
        g.globalAlpha = alpha; g.strokeStyle = col; g.lineWidth = 1.6 * dpr; g.beginPath();
        for (let q = 0; q <= last; q += 2) { const x = (q / (A.n - 1)) * (w - 4) + 2, y = h - 3 - ((run.sm[i][key][q] - mn) / (mx - mn)) * (h - 8); q ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.stroke();
      });
    });
    g.globalAlpha = 1;
  });
}
/** The old app's results side by side: each drive's time, energy, slip, sinkage, largest tilt and whether it got stuck. Target, Earth, Earth at equal wheel load. */
function resultsTable(run, tName) {
  const cols = [[tName, run.T.totals, 't'], ['Earth', run.Er.totals, 'e'], ['Earth, equal load', run.Eq.totals, 'e']];
  const r = (label, f) => `<tr><td>${label}</td>${cols.map(([, T]) => `<td>${f(T)}</td>`).join('')}</tr>`;
  const stuck = T => T.reachable ? 'No' : `<span class="stuck" title="${esc((T.blockers || []).join('; '))}">Yes</span>`;
  return `<table class="res3"><tr><th></th>${cols.map(([n, , c]) => `<th class="${c}">${n}</th>`).join('')}</tr>
    ${r('Drive time', T => `${(T.time / 60).toFixed(0)} min`)}
    ${r('Energy used', T => `${T.energy_Wh.toFixed(0)} Wh`)}
    ${r('Average slip', T => `${T.slip_mean.toFixed(1)} %`)}
    ${r('Wheel sinkage', T => `${T.sink_mean_mm.toFixed(1)} mm`)}
    ${r('Largest tilt', T => `${T.tilt_max.toFixed(1)}°`)}
    ${r('Got stuck', stuck)}</table>`;
}
const fv = (x, r) => (r.unit === '°' || r.unit === '%' || r.unit === ' min' || r.unit === ' mm' || r.unit === ' Wh' || r.unit === ' kPa') ? x.toFixed(1) : Math.round(x).toLocaleString();
/** The verdict. Two panes: the old verdict() of the two drives (the same ground, so only gravity differs). One pane: the run's own reachability verdict. */
function showVerdict() {
  const run = V.runs;
  if (V.sides.length > 1) {
    const v = verdict(run.T, run.Er, run.Eq, run.ctx), cls = v.match >= 80 ? 'good' : v.match >= 60 ? 'mid' : 'bad';
    const tag = r => r.status === 'rover' ? '<span class="tagm gr">build</span>' : r.status === 'match' ? '<span class="tagm ok">match</span>' : r.status === 'mismatch' ? '<span class="tagm no">mismatch</span>' : '<span class="tagm gr">gravity</span>';
    const cmp = comparing(), tName = cmp ? `${BODY[V.tg.target.body]} ground` : `${esc(V.ctx.target.bodyName)} g`, eName = cmp ? 'Earth' : 'Earth g';
    const why = cmp ? `The same rover drives on the ${BODY[V.tg.target.body]} ground and on this Earth place. Big differences mean Earth testing here would mislead.`
      : 'How alike the two drives are, from 0 to 100. Both use the same ground, so any difference comes from gravity alone.';
    $('verdict').innerHTML = `<div class="big ${cls}">${Math.round(v.match)}/100 &middot; ${v.label} ${info(why, 'About the comparison')}</div>
    ${cmp ? `<p class="verdict-line">${esc(v.recommendation)}</p>${resultsTable(run, tName)}<b>Match by metric</b>` : ''}
    <table><tr><th>Metric</th><th>${tName}</th><th>${eName}</th><th></th></tr>${v.rows.map(r => `<tr><td>${r.label}</td><td>${fv(r.a, r)}${r.unit}</td><td>${fv(r.b, r)}${r.unit}</td><td>${tag(r)}</td></tr>`).join('')}</table>
    ${v.mismatches.length ? `<b>Mismatches</b><ul>${v.mismatches.map(m => `<li>${comparing() ? m : m.replace('on the target ground', `at ${esc(V.ctx.target.bodyName)} gravity`).replace('on the Earth site', 'at Earth gravity')}</li>`).join('')}</ul>` : '<b>Mismatches</b><ul><li>None on the terrain-driven metrics.</li></ul>'}
    <b>Gravity</b><p class="hint">${v.gravityNote}</p>`;
    $('vpVerdictBody').innerHTML = `<div class="big ${cls}">${Math.round(v.match)}/100</div><div><b>${v.label}</b><div class="hint">${v.mismatches.length ? v.mismatches[0] : 'The two drives behave alike on the terrain-driven metrics.'}</div></div>`;
    run.verdict = v;
  } else {
    const A = run.A[0], T = A.totals, side = V.sides[0];
    const rows = [['Distance', T.dist, ' m'], ['Drive time', T.time / 60, ' min'], ['Mean tilt', T.tilt_mean, '°'], ['Largest tilt', T.tilt_max, '°'], ['Mean slip', T.slip_mean, '%'], ['Energy per metre', T.e_mean, ' J/m'], ['Energy used on the route (battery ' + Math.round(T.battery_wh) + ' Wh)', T.energy_Wh, ' Wh'], ['Wheel sinkage, mean (simplified)', T.sink_mean_mm, ' mm'], ['Ground pressure under a wheel', T.press_kPa, ' kPa'], ['Friction-limited steepest slope', T.max_climb_deg, '°']];
    const cls = T.reachable ? 'good' : 'bad', label = T.reachable ? 'Reachable' : 'Not reachable';
    $('verdict').innerHTML = `<div class="big ${cls}">${label} ${info('Reachable means the rover can finish the route on one battery charge without hitting a slope or grip limit.', 'About reachable')}</div><div class="hint">At ${side.key === 'target' ? `${esc(V.ctx.target.bodyName)} gravity, ${side.g}` : 'Earth gravity, 9.81'} m/s&sup2;.</div>
    <table><tr><th>Metric</th><th>This drive</th></tr>${rows.map(([l, v, u]) => `<tr><td>${l}</td><td>${fv(v, { unit: u })}${u}</td></tr>`).join('')}</table>
    <b>Blockers</b><ul>${T.blockers.length ? T.blockers.map(b => `<li>${b}</li>`).join('') : '<li>None.</li>'}</ul>`;
    $('vpVerdictBody').innerHTML = `<div class="big ${cls}">${label}</div><div><b>${T.blockers.length ? 'Blocked' : 'Route completed'}</b><div class="hint">${T.blockers[0] || `${(T.time / 60).toFixed(0)} min, ${T.energy_Wh.toFixed(0)} Wh of ${Math.round(T.battery_wh)} Wh`}</div></div>`;
    run.verdict = { single: T };
  }
  $('verdict').classList.remove('hidden'); $('vpVerdict').classList.remove('hidden');
  $('simStatus').textContent = '';
  run.verdictShown = true;
}
function updateAll(snap) {
  wake();
  if (!V.runs) return;
  const kf = V.runs.A.map(A => V.u * (A.n - 1));
  V.sides.forEach((s, i) => poseRover(i, kf[i], 0.016, snap));
  updateHud(kf); drawCharts(kf); $('scrub').value = Math.round(V.u * 1000); $('scrubO').textContent = Math.round(V.u * 100) + ' %';
}

// ---------------------------------------------------------------- camera handling
function updateCamera(i, dt) {
  const s = V.sides[i], c = V.cams[i], cam = c.camera, ct = c.controls, p = s.patch, ex = V.exag;
  if (c.anim) {
    const a = c.anim, f = Math.min(1, (performance.now() - a.t0) / a.dur), e = ease(f);
    cam.position.lerpVectors(a.fp, a.tp, e); ct.target.lerpVectors(a.ft, a.tt, e);
    if (f >= 1) c.anim = null;
  } else if (V.follow && V.runs && (V.playing || V.chased)) {
    _t.copy(s.rover.root.position); _t.y += 0.8; _v.copy(_t).sub(ct.target);
    const k = V.snap ? 1 : 1 - Math.exp(-dt * 5); _v.multiplyScalar(k); ct.target.add(_v); cam.position.add(_v);
  }
  V.syncing = true; ct.update(); V.syncing = false;
  const g = worldH(p, cam.position.x, cam.position.z) * ex, clear = Math.max(1.6, 0.03 * cam.position.distanceTo(ct.target));
  if (cam.position.y < g + clear) cam.position.y = g + clear;
  const gt = worldH(p, ct.target.x, ct.target.z) * ex; if (ct.target.y < gt) ct.target.y = gt;
}
function linkCameras() {
  if (V.sides.length < 2 || !V.link || V.dirty < 0 || V.cams[0].anim || V.cams[1].anim) { V.dirty = -1; return; }
  const a = V.dirty, b = 1 - a, ca = V.cams[a], cb = V.cams[b], ex = V.exag;
  V.syncing = true;
  const off = ca.camera.position.clone().sub(ca.controls.target);
  if (!V.follow) {
    const ga = worldH(V.sides[a].patch, ca.controls.target.x, ca.controls.target.z) * ex, gb = worldH(V.sides[b].patch, ca.controls.target.x, ca.controls.target.z) * ex;
    cb.controls.target.set(ca.controls.target.x, gb + (ca.controls.target.y - ga), ca.controls.target.z);
  }
  cb.camera.position.copy(cb.controls.target).add(off); cb.controls.update();
  V.syncing = false; V.dirty = -1;
}
function updateSunShadow(i) {
  const s = V.sides[i], c = V.cams[i], size = s.patch.size, t = c.controls.target, d = c.camera.position.distanceTo(t);
  const ext = clamp(d * 1.25, 45, size * 0.95) * (V.q ? V.q.ext : 1);
  s.sun.target.position.copy(t); s.sun.position.copy(t).addScaledVector(V.sunV, size * 1.6);
  const sc = s.sun.shadow.camera;
  if (Math.abs(sc.right - ext) > ext * 0.05) { sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 1; sc.far = size * 4; sc.updateProjectionMatrix(); s.sun.shadow.normalBias = ext * 0.0025; }
}

// ---------------------------------------------------------------- frame loop
function frame(now) {
  if (!V.open || V.vr) return;   // in VR, vr.js drives drawing with renderer.setAnimationLoop (WebXR needs it)
  V.raf = requestAnimationFrame(frame);
  const drew = !!(V.drive || (V.sides.length && (V.playing || V.snap || now < V.awake || V.cams[0].anim || V.cams[1].anim))), t0 = qStart();   // quality.js measures every drawn frame (F3 overlay, auto quality, ?bench)
  try { frameBody(now); } catch (e) { if (!V.frameErr) { V.frameErr = true; console.error(e); siteNote(`A drawing error occurred: ${errText(e)}`); } }
  try { qEnd(now, t0, drew); } catch (e) { /* measuring must never break drawing */ }
}
function frameBody(now) {
  const dt = Math.min(0.1, (now - V.last) / 1000); V.last = now;
  if (V.drive) { V.drive.frame(dt, now); return; }
  if (!V.sides.length) return;
  if (!(V.playing || V.snap || now < V.awake || V.cams[0].anim || V.cams[1].anim)) return;
  advancePlayback(dt, now);
  V.lodForce = V.snap || !V.lodReady; V.lodReady = true;
  V.sides.forEach((s, i) => updateCamera(i, dt)); V.snap = false;
  frameDraw();
}
/** Playback: the shared timeline V.u moves on, every pane's rover is posed at its point of its own drive, and the HUD, charts, timeline and verdict follow.
 *  Used by the normal loop and by VR (vr.js), so both sides always stay at the same moment. */
function advancePlayback(dt, now) {
  const run = V.runs;
  if (run) try {
    if (V.playing) {
      V.u += (dt * V.speed) / V.DUR;
      if (V.u >= 1) { V.u = 1; play(false); }
    }
    const kf = V.kf || (V.kf = [0, 0]); for (let i = 0; i < run.A.length; i++) kf[i] = V.u * (run.A[i].n - 1);
    for (let i = 0; i < V.sides.length; i++) poseRover(i, kf[i], dt, V.snap);
    updateHud(kf);
    if (V.playing || V.snap) { if (!V.lastChart || now - V.lastChart > 90 || V.snap) { drawCharts(kf); V.lastChart = now; } }
    $('scrub').value = Math.round(V.u * 1000); $('scrubO').textContent = Math.round(V.u * 100) + ' %';
    if (V.u >= 1 && !run.verdictShown) showVerdict();
    if (V.u < 1 && run.verdictShown) { run.verdictShown = false; $('vpVerdict').classList.add('hidden'); }
  } catch (e) { if (!V.simErr) { V.simErr = true; failPanel('simStatus', 'the rover simulation display', e); } }
}
function frameDraw() {
  linkCameras();
  const c = $('siteCanvas'), w = c.clientWidth, h = c.clientHeight, two = V.sides.length > 1, half = Math.floor(w / 2);
  if (!w || !h) return;
  let tris = 0;
  V.sides.forEach((s, i) => {
    const cam = V.cams[i].camera, x = i ? half + 1 : 0, ww = two ? (i ? w - half - 1 : half - 1) : w;
    const asp = ww / h; if (Math.abs(cam.aspect - asp) > 1e-3) { cam.aspect = asp; cam.updateProjectionMatrix(); }
    updateSunShadow(i);
    if (s.rover) { const f = s.focus || (s.focus = [[0, 0]]); f[0][0] = s.rover.root.position.x; f[0][1] = s.rover.root.position.z; }
    if (s.ground.update(cam.position, V.lodForce, s.rover ? s.focus : null)) wake(300);   // tiles still to build: keep drawing; the tiles under the rover are always full detail
    if (s.rover && s.ground.rocks) s.ground.rocks.update(s.rover.root.position.x, s.rover.root.position.z);
    s.sky.position.copy(cam.position);
    if (s.rover) { const dist = cam.position.distanceTo(s.rover.root.position), sc = Math.max(0.2, dist * 0.06);
      s.marker.visible = dist > 70; s.marker.scale.set(sc, sc * 2.4, sc); s.marker.position.set(s.rover.root.position.x, s.rover.root.position.y + 2 + sc * 1.2, s.rover.root.position.z); } else s.marker.visible = false;
    V.renderer.setViewport(x, 0, ww, h); V.renderer.setScissor(x, 0, ww, h);
    const tr0 = V.renderer.info.render.triangles; V.renderer.render(s.scene, cam);
    tris += V.renderer.info.render.triangles - tr0;   // info is reset once per frame by quality.js, not per render call
  });
  V.frames = (V.frames || 0) + 1; V.lastTris = tris;
}

/** Called by drive mode when it hands the canvas back. */
export function refreshAfterDrive() { V.sides.forEach(s => { s.line.visible = s.lineOn.visible = true; s.pose.init = false; s.tracks.reset(); }); V.lodReady = false; V.snap = true; V.last = performance.now(); updateAll(true); V.dirty = -1; }
export function setSitePlaying(on) { play(on); }
export const siteHelpers = { setShadow: (s, n) => setShadowSize(s.sun, n), updateGeometryAll: () => V.sides.forEach(updateGeometry), setExag: ex => V.sides.forEach(s => { s.ground.setExag(ex); s.mat.userData.U.uEx.value = ex; }) };
