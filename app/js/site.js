// Site View: two terrains side by side (target left, Earth hotspot right), each pane with its own camera and OrbitControls
// (optionally linked), PBR ground from local textures, a rover on each terrain, and a watchable playback of the simulation.
// The terrain shape is a stand-in in demo mode; the ground photo texture is a visual aid only and carries no measured information.
import * as THREE from '../vendor/three-bundle.js';
import { D, ROOT, fmtTrait, templateExplanation, ensurePatches } from './data.js';
import { getPatch, upsample, surfaceH, worldH, prepareReal, realUrl } from './terrain.js';
import { Ground, Tracks, slopeTexture, NRM_RANGE } from './ground.js';
import { poseOnGround } from './contact.js';
import { attach as qAttach, level as qLevel, wantAntialias, frameStart as qStart, frameEnd as qEnd } from './quality.js';
import { planRoute, analyze, verdict, frictionFromSoil, wheelPoints, START, GOAL, DS } from './sim.js';
import { motion, ease } from './globeview.js';
import { groundClass } from './soilmech.js';
import { R as RS, initRovers, createInstance, updateInstance, evictExcept, onChange, selectRover, defaultForBody } from './rovers.js';
import { initRoverUI, refreshRoverUI } from './roverui.js';

const $ = id => document.getElementById(id);
const COL_T = '#38bdf8', COL_E = '#fb923c';
const V = { timing: {}, awake: 0, notes: [], gl: false, ready: false, open: false, sides: [], cams: [], ctx: null, mode: 'plain', exag: 1, glb: null, tex: null, runs: null, routes: null, u: 0, playing: false, speed: 1, DUR: 75, link: true, follow: true, active: 0, dirty: -1, syncing: false, shown: false };
export const SITE = { get V() { return V; } };
const BODY_NAME = { moon: 'Moon', mars: 'Mars', earth: 'Earth' };
const _v = new THREE.Vector3(), _X = new THREE.Vector3(), _Y = new THREE.Vector3(), _Z = new THREE.Vector3(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _t = new THREE.Vector3();
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const esc = x => String(x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------------- failures are not fatal
// Init must not abort when something fails: each part of Site View is built inside guard(), which logs the error, writes a plain
// "Could not load X: reason" into that part's own panel and into the note bar, and lets the rest (terrain, render loop) carry on.
// Render on demand: a frame is drawn only while something moves (playback, camera animation, orbit damping) or for a short time after any input or
// state change. wake() extends that window. With nothing happening the loop does no work and the last frame stays on screen.
const wake = (ms = 1500) => { V.awake = Math.max(V.awake, performance.now() + ms); };
const errText = e => (e && e.message) || (e && e.target && (e.target.src || e.target.currentSrc) ? `could not fetch ${e.target.src || e.target.currentSrc}` : String(e));
function siteNote(msg) { V.notes.push(msg); const n = $('siteNote'); if (!n) return; n.innerHTML = V.notes.map(m => `<div>${esc(m)}</div>`).join(''); n.classList.remove('hidden'); }
function failPanel(el, what, e) {
  const msg = `Could not load ${what}: ${errText(e)}`; console.error(msg, e);
  const n = typeof el === 'string' ? $(el) : el;
  if (n) n.innerHTML = n.tagName === 'TABLE' ? `<tr><td class="load-fail">${esc(msg)}</td></tr>` : `<span class="load-fail">${esc(msg)}</span>`;
  siteNote(msg);
}
const tick = (what, t0) => { V.timing[what] = (V.timing[what] || 0) + performance.now() - t0; };   // per-stage milliseconds of the last open, for measuring
function guard(what, el, fn) { const t0 = performance.now(); try { return fn(); } catch (e) { failPanel(el, what, e); return undefined; } finally { tick(what, t0); } }
async function guardAsync(what, el, fn) { const t0 = performance.now(); try { return await fn(); } catch (e) { failPanel(el, what, e); return undefined; } finally { tick(what, t0); } }

// ---------------------------------------------------------------- renderer, cameras, UI wiring (created once)
function ensureRenderer() {
  if (V.ready) return;
  const canvas = $('siteCanvas');
  V.renderer = new THREE.WebGLRenderer({ canvas, antialias: wantAntialias() });   // antialiasing off when the last session needed Low quality (it can only be chosen here)
  V.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, qLevel().dpr));   // quality level: 1.5, 1 or 0.75 at most (quality.js)
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
  new ResizeObserver(resize).observe($('vpStage'));
  ['pointerdown', 'pointermove', 'wheel', 'keydown', 'input', 'change', 'click'].forEach(t => $('site').addEventListener(t, e => { if (t !== 'pointermove' || e.buttons) wake(); }, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
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
  if (!V.ready) return;
  const w = $('vpStage').clientWidth, h = $('vpStage').clientHeight;
  if (w && h) V.renderer.setSize(w, h, false);
  wake();
}
function sunDir() {
  const el = +$('sunEl').value * Math.PI / 180, az = +$('sunAz').value * Math.PI / 180;
  return new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), -Math.cos(el) * Math.cos(az));   // compass azimuth: 0 = north (-z), 90 = east (+x); real sites are north-up
}
function setSun() { V.sunV = sunDir(); }

// ---------------------------------------------------------------- ground textures and material
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
const IMG_TINT = { moon: [1.0, 1.0, 0.98], mars: [1.28, 0.9, 0.68], earth: [1, 1, 1] };   // display tint for greyscale orbital images (the images themselves carry no colour)
const ROCK = { moon: 0x8d8d8a, mars: 0x8a5a41, earth: 0x8c8172 };
/** Ground material of the patch. o: { size, span: [min, max] heights, slopeTex, img, gray }.
 *  Colour: the real orbital image draped on the patch when the site has one (greyscale images get the body tint), otherwise the generic ground photo.
 *  Close to the camera the generic photo texture adds fine grain on top of the image, more on slopes. Lighting and the Slope view use the slopes of
 *  the fine height grid (slopeTex), so relief reads the same at every level of detail. */
function groundMaterial(body, tex, traits, o) {
  const lk = { ...LOOK[body] }, t = tex && tex[lk.set];
  if (body === 'earth' && traits && !o.img) {   // rough visual hint from the site's own traits, not a land-cover map (only when there is no real image)
    if (traits.temp_mean < 270) Object.assign(lk, { tint: [1.5, 1.55, 1.65], sat: 0.15, bright: 1.55 });
    else if (traits.dust > 0.62) Object.assign(lk, { tint: [1.35, 1.15, 0.8], sat: 0.6 });
  }
  const m = t ? new THREE.MeshStandardMaterial({ map: t.map, normalMap: t.normal, roughnessMap: t.rough, roughness: 1, metalness: 0, side: THREE.DoubleSide })
    : new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(...lk.tint.map(v => v * 0.3)), roughness: 1, metalness: 0, side: THREE.DoubleSide });   // textures could not be loaded: plain colour
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
        if (hasG > 0.5) gH = (texture2D(uSlopeTex, puv).rg * 2.0 - 1.0) * uRange;   // dh/dx, dh/dz of the fine height grid
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
        float farK = smoothstep(180.0, 1100.0, length(vViewPosition));   // far away the photo texture would show as a repeating pattern: fade it to its mean colour
        gb *= mix(clamp(0.74 + 0.36 * macro, 0.62, 1.3), 1.0, farK);
        vec3 gmean = mix(vec3(dot(uAvg, vec3(0.299, 0.587, 0.114))), uAvg, uSat) * uTint;
        gb = mix(gb, gmean, farK * 0.85);
        if (uHasImg * inP > 0.5) {   // real image as the colour; the photo texture only adds grain near the camera, more on slopes
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
        if (hasG > 0.5) normal = normalize((viewMatrix * vec4(normalize(vec3(-gH.x * uEx, 1.0, -gH.y * uEx)), 0.0)).xyz);   // the fine grid's own slope, the same at every level of detail
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
// ---------------------------------------------------------------- sky, stars
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
  if (body === 'moon') {
    let a = 99;
    const rnd = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const n = 900, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const u = rnd() * 0.97 + 0.03, th = rnd() * 6.283, r = Math.sqrt(1 - u * u), R = far * 0.8; pos.set([R * r * Math.cos(th), R * u, R * r * Math.sin(th)], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const st = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xcfd6e4, size: 1.3, sizeAttenuation: false, transparent: true, opacity: 0.7, depthWrite: false, fog: false }));
    st.frustumCulled = false; st.renderOrder = -1; sky.add(st);
  }
  return sky;
}

// ---------------------------------------------------------------- terrain meshes (tiles, surroundings, rocks: see ground.js)
function setMode() { V.sides.forEach(s => { s.mat.userData.U.uMode.value = { plain: 0, slope: 1, elev: 2 }[V.mode]; }); wake(); }
/** Vertical exaggeration and everything that sits on the surface. The meshes themselves are not rebuilt: the ground group is scaled. */
function updateGeometry(s) {
  wake();
  const p = s.patch, ex = V.exag, half = p.size / 2;
  s.ground.setExag(ex); s.mat.userData.U.uEx.value = ex; if (s.tracks) s.tracks.reset();
  const n = 64, pts = [];   // patch outline (the region that carries data)
  const edge = (t, side) => { const c = t * p.size; return side === 0 ? [c, 0] : side === 1 ? [p.size, c] : side === 2 ? [p.size - c, p.size] : [0, p.size - c]; };
  for (let side = 0; side < 4; side++) for (let k = 0; k < n; k++) { const [x, z] = edge(k / n, side); pts.push(x - half, surfaceH(p, x, z) * ex + 0.6, z - half); }
  s.outline.geometry.dispose(); s.outline.geometry = new THREE.BufferGeometry(); s.outline.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  if (V.runs) drawRoutes();
}
/** Real imagery of a ground, when the site has it. A missing or broken image is not fatal: the generic ground texture is used and the label says so. */
async function loadImagery(patch) {
  const e = patch.prov, im = patch.real && e && e.real && e.real.img; if (!im) return null;
  const L = new THREE.TextureLoader(), maxA = Math.min(8, V.renderer.capabilities.getMaxAnisotropy());
  const one = async f => { const t = await L.loadAsync(realUrl(e, f)); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxA; t.needsUpdate = true; return t; };   // row 0 of the image is the north edge = z 0
  const out = { gray: !!im.gray, img: null, ctx: null };
  try { out.img = await one(im.file); } catch (err) { console.error(err); patch.imgError = `Could not load the imagery of ${patch.id}: ${errText(err)}`; siteNote(patch.imgError + '. The generic ground texture is shown.'); return null; }
  if (im.ctx) try { out.ctx = await one(im.ctx.file); } catch (err) { console.error(err); }
  return out;
}
function buildSide(patch, body, color, tex, idx, traits, imagery) {
  const f = patch.size / 2000, far = patch.size * 30, c = SKY[body];
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(c.fog, (body === 'moon' ? 3000 : 2200) * f, (body === 'moon' ? 9000 : 7200) * f);
  const sky = makeSky(body, far); scene.add(sky);
  const hemi = new THREE.HemisphereLight({ moon: 0x9aa0ac, mars: 0xe2b496, earth: 0xa9c4e8 }[body], { moon: 0x35353a, mars: 0x4a3226, earth: 0x4a4338 }[body], { moon: 0.95, mars: 1.15, earth: 1.2 }[body]);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(body === 'earth' ? 0xfff2dc : 0xfff4e6, { moon: 3.4, mars: 3.2, earth: 3.2 }[body]);
  sun.castShadow = true; sun.shadow.mapSize.set(1536, 1536); sun.shadow.bias = -0.0004;
  scene.add(sun, sun.target);
  const own = [], keepT = t => { if (t) own.push(t); return t; };
  const slopeTex = keepT(slopeTexture(patch, Math.min(4, V.renderer.capabilities.getMaxAnisotropy())));
  if (imagery) { keepT(imagery.img); keepT(imagery.ctx); }
  const mat = groundMaterial(body, tex, traits, { size: patch.size, span: [patch.min, patch.max], slopeTex, img: imagery && imagery.img, gray: imagery && imagery.gray });
  // the real context ring: its own image when there is one (same shader, sized to the ring), otherwise the patch material, so the two meet in the same colour
  const ctxMat = patch.C ? (imagery && imagery.ctx ? groundMaterial(body, tex, traits, { size: patch.C.size, span: [patch.min, patch.max], slopeTex: null, img: imagery.ctx, gray: imagery.gray }) : mat) : null;
  const lod = +new URLSearchParams(location.search).get('lod') || 0.03;   // vertex spacing as a fraction of the distance to the camera
  const ground = new Ground(scene, patch, mat, ctxMat, { k: lod, rock: { color: ROCK[body], abundance: clamp(0.3 + 0.03 * patch.stats.slope_med, 0.25, 0.75) } });
  const outline = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 })); outline.renderOrder = 4; scene.add(outline);
  const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 });
  const line = new THREE.Line(new THREE.BufferGeometry(), lineMat), lineOn = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff })); line.renderOrder = lineOn.renderOrder = 5; line.visible = lineOn.visible = false; scene.add(line, lineOn);
  const marker = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1, 14), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, fog: false, depthTest: false })); marker.renderOrder = 8; marker.rotation.x = Math.PI; scene.add(marker);
  const s = { idx, patch, body, scene, sky, sun, hemi, mat, ctxMat, ground, tracks: new Tracks(scene), own, outline, line, lineOn, marker, color, rover: null, pose: { init: false } };
  updateGeometry(s); applySide(s);
  return s;
}

// ---------------------------------------------------------------- rover models
/** One rover instance per pane, built from the shared effective config. Only the selected rover's model is loaded; the old one is disposed. */
async function makeRovers() {
  const cfg = RS.cfg, insts = [await createInstance(cfg), await createInstance(cfg)];   // the same rover model and scale on both terrains
  V.sides.forEach((s, i) => { if (s.rover) s.rover.dispose(); s.rover = insts[i]; s.scene.add(insts[i].root); });
  V.sides.forEach(applySide);   // tiny-part visibility of the new rover follows the quality level
  await evictExcept(cfg.model).catch(e => console.error(e));
  if (RS.modelError) siteNote(RS.modelError);
  return true;
}
// ---------------------------------------------------------------- open / close
let buildPending = 0, pendingKind = '';
/** What the rover panels need to evaluate a build on both grounds: gravity, friction, soil class constants, patch and the planned route. */
function roverCtx() {
  if (!V.ctx || !V.runs) return null;
  const { target: t, hotspot: h } = V.ctx, soils = RS.reg.soils, cls = tr => groundClass(tr), SC = tr => soils[cls(tr)], lab = tr => soils[cls(tr)].label;
  return { gT: t.gravity, grounds: [
    { label: 'Target', short: t.short, g: t.gravity, mu: +$('muT').value, soil: t.traits.soil, S: SC(t.traits), cls: lab(t.traits), patch: V.sides[0].patch, route: V.routes[0] },
    { label: 'Earth', short: h.name, g: D.meta.gravity.earth, mu: +$('muE').value, soil: h.traits.soil, S: SC(h.traits), cls: lab(h.traits), patch: V.sides[1].patch, route: V.routes[1] }] };
}
async function applyBuild(kind) {
  if (!V.open || V.drive || !V.runs) return;
  if (kind === 'rover') { await makeRovers(); planAll(); } else V.sides.forEach(s => updateInstance(s.rover, RS.cfg));
  computeRuns(); V.runs.verdictShown = false; $('vpVerdict').classList.add('hidden'); $('verdict').classList.add('hidden');
  paintSimIntro(); V.sides.forEach(s => { s.pose.init = false; }); updateAll(true); refreshRoverUI();
}
/** Called when a hotspot is clicked, so the renderer and the ground textures load during the globe fly-in instead of after it. Never throws. */
export function prewarm() { try { ensureRenderer(); if (!V.tex && !V.groundP) V.groundP = loadGround().catch(e => { V.groundP = null; throw e; }); V.groundP && V.groundP.catch(() => {}); } catch (e) { console.warn('site prewarm failed', e); } }
export async function openSite({ target, purpose, hotspot, onBack }) {
  V.notes = []; V.timing = {}; { const n = $('siteNote'); if (n) { n.innerHTML = ''; n.classList.add('hidden'); } }
  V.gl = !!guard('the 3D renderer', null, () => { ensureRenderer(); return true; });
  guard('the rover registry', null, () => { if (!RS.reg) initRovers(D.rovers, target.body); });
  if (RS.error) siteNote(RS.error);
  guard('the rover panel', 'roverBar', () => {
    if (V.roverWired) return; V.roverWired = true;
    onChange(kind => { pendingKind = pendingKind === 'rover' || kind === 'rover' ? 'rover' : kind; clearTimeout(buildPending); buildPending = setTimeout(() => { const k = pendingKind; pendingKind = ''; applyBuild(k).catch(e => failPanel('simStatus', 'the rover build', e)); }, pendingKind === 'rover' ? 0 : 100); });
    initRoverUI({ ctx: roverCtx });
  });
  let tex = null;
  if (V.gl) { try { tex = V.tex || await (V.groundP || loadGround()); } catch (e) { console.error(e); siteNote(`Could not load the ground textures: ${errText(e)}. A plain ground colour is used.`); } }
  V.ctx = { target, purpose, hotspot }; V.onBack = onBack;
  $('site').classList.remove('hidden'); $('home').classList.add('hidden');
  guard('the view layout', null, () => { resize(); paintModes(); paintSpeeds(); });
  V.playing = false; V.u = 0; V.snap = true; V.shown = false; V.runs = null; V.routes = null;
  guard('the old terrain', null, disposeSides);
  let pT, pE;
  await guardAsync('the terrain data', null, () => ensurePatches());
  await guardAsync('the real terrain tiles', null, () => prepareReal([target.patch, hotspot.id]).catch(e => { siteNote(`Could not load the real terrain tiles (${errText(e)}). The coarse terrain grid is shown instead.`); console.error(e); }));
  guard('the terrain data', null, () => { pT = getPatch(target.patch, target.traits); pE = getPatch(hotspot.id, hotspot.traits); });
  let imT = null, imE = null;
  if (V.gl && pT && pE) [imT, imE] = await Promise.all([loadImagery(pT), loadImagery(pE)].map(q => q.catch(e => { console.error(e); return null; })));
  // the panels do not depend on the 3D view, so each is built on its own and one failing cannot blank the others
  guard('the title and labels', 'siteTitle', () => fillLabels(target, hotspot, pT, pE));
  guard('the comparison table', 'cmpTable', () => fillCompare(target, hotspot));
  guard('the explanation', 'explText', () => fillExplanation(target, purpose, hotspot));
  guard('the rover simulation panel', 'simInputs', () => buildSimPanel(target, hotspot));
  const terrainOK = !!(V.gl && pT && pE && guard('the 3D terrain', null, () => {
    V.sides = [buildSide(pT, target.body, 0x38bdf8, tex, 0, target.traits, imT), buildSide(pE, 'earth', 0xfb923c, tex, 1, hotspot.traits, imE)];
    $('exag').value = 1; $('exagO').textContent = '1'; V.exag = 1;
    $('sunEl').value = target.polar ? 8 : 35; $('sunElO').textContent = $('sunEl').value; $('sunAz').value = 135; $('sunAzO').textContent = '135'; setSun();
    $('follow').checked = V.follow = true; $('link').checked = V.link = true;
    play(false); setMode();
    const sz = pT.size;
    V.cams.forEach(c => { c.camera.near = Math.max(0.25, sz * 0.00012); c.camera.far = sz * 30; c.camera.updateProjectionMatrix(); c.controls.maxDistance = sz * 1.9; c.anim = null; });
    return true;
  }));
  if (!terrainOK) { V.sides = []; siteNote('The 3D view is not available. The comparison panels above still work.'); }
  else {
    guard('the default rover', null, () => { if (!RS.picked && !RS.recalled && !RS.error) selectRover(defaultForBody(target.body)); });
    const roverOK = await guardAsync('the rover', 'roverBar', makeRovers);
    if (roverOK !== undefined) {
      guard('the rover simulation', 'simStatus', () => { planAll(); computeRuns(); });
      V.sides.forEach(s => { if (s.rover) s.rover.root.visible = true; s.line.visible = s.lineOn.visible = true; s.pose.init = false; });
      $('vpVerdict').classList.add('hidden'); $('verdict').classList.add('hidden');
      guard('the rover simulation', 'simStatus', () => updateAll(true));
    }
    guard('the camera', null, () => goView(false, true));   // overview, snapped
  }
  V.open = true; cancelAnimationFrame(V.raf); V.last = performance.now(); V.frameErr = false; V.simErr = false; V.lodReady = false;
  if (terrainOK) V.raf = requestAnimationFrame(frame);
  window.TERRA_SITE = V;
}
/** Free everything a side owns on the GPU: geometries, materials, its own textures (the shared ground textures stay cached), shadow maps, and its rover. */
function disposeScene(scene) {
  const keep = new Set(); if (V.tex) for (const k in V.tex) { const t = V.tex[k]; keep.add(t.map); keep.add(t.normal); keep.add(t.rough); }
  scene.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    for (const m of [].concat(o.material || [])) { for (const key in m) { const t = m[key]; if (t && t.isTexture && !keep.has(t)) t.dispose(); } m.dispose(); }
    if (o.isLight && o.dispose) o.dispose();   // releases the shadow map render target
  });
  scene.clear();
}
function disposeSides() {
  V.sides.forEach(s => { if (s.rover) { s.rover.dispose(); s.rover = null; } s.tracks.dispose(); s.ground.dispose(); s.own.forEach(t => t.dispose()); if (s.ctxMat && s.ctxMat !== s.mat) s.ctxMat.dispose(); disposeScene(s.scene); });
  V.sides = []; if (V.renderer) V.renderer.renderLists.dispose();
}
export function closeSite() {
  if (V.drive) V.drive.exit(true);
  V.open = false; cancelAnimationFrame(V.raf); V.playing = false;
  guard('the old terrain', null, disposeSides); V.runs = null; V.routes = null;
  $('site').classList.add('hidden'); $('home').classList.remove('hidden');
}

/** Short provenance text of one ground, from the fields the pipeline wrote into patches_index.json. Says what is real, what is synthetic and what is missing. */
export function provenance(p) {
  const e = p.prov, res = m => (m >= 1 ? `${+m.toFixed(m < 10 ? 1 : 0)} m` : `${Math.round(m * 100)} cm`);
  if (p.browserStandIn) return { cls: 'demo', short: 'Demo terrain (generated in the browser, synthetic)', long: 'No terrain tile exists for this hotspot: the shape is a synthetic stand-in generated in the browser from the trait statistics.' };
  if (!e || !e.real) return { cls: 'demo', short: 'Demo terrain (synthetic). No real elevation or imagery yet', long: (e && e.missing && e.missing.length ? 'Real data was tried and is missing: ' + e.missing.join('; ') + '. ' : '') + 'The terrain shape is a synthetic stand-in with slope statistics from the traits. Run pipeline/fetch_windows.py to replace it with real data.' };
  const el = `Elevation: ${e.elevation_source} ${res(e.elevation_resolution_m)} (real${p.realFailed ? ', coarse grid only: fine tiles failed to load' : ''})`;
  const im = e.real.img && !p.imgError ? `Imagery: ${e.imagery_source} ${res(e.imagery_resolution_m)} (real${e.real.img.gray ? ', greyscale, tint added' : ''})` : 'Imagery: none (generic ground texture)';
  const fine = e.synthetic_fine ? ` Fine detail synthetic (below about ${res(2 * e.elevation_resolution_m)}).` : '';
  return { cls: e.real.img && !e.synthetic_fine ? 'real' : 'part', short: `${el}. ${im}.${fine}`, long: [`Site centre ${e.site_center[0].toFixed(4)}, ${e.site_center[1].toFixed(4)}. Built ${e.date_built}.`, e.real.datum ? `Heights relative to: ${e.real.datum}.` : '', ...(e.missing || []).map(m => 'Missing: ' + m.replace(/https?:\/\/\S+/g, 'the source file').slice(0, 220)), 'Rocks are illustrative (rule-based, fixed seed): they are not mapped from the image and not in the height data.'].filter(Boolean).join(' ') };
}
function fillLabels(t, h, pT, pE) {
  $('siteTitle').innerHTML = `<span class="l">${t.name}</span><span class="vs">vs</span><span class="r">${h.name}</span><span class="meta">hotspot ${h.rank}, score ${Math.round(h.score)}</span>`;
  const prT = provenance(pT), prE = provenance(pE), badge = pr => `<small class="prov ${pr.cls}" title="${esc(pr.long)}">${esc(pr.short)}</small>`;
  const cT = pT.real ? pT.prov.site_center : [t.lat, t.lon];
  $('vpLeft').innerHTML = `Target: ${t.short} (${BODY_NAME[t.body]})<small>g ${t.gravity} m/s&sup2; &middot; ${(pT.size / 1000).toFixed(0)} km patch at ${cT[0].toFixed(3)}, ${cT[1].toFixed(3)}</small>${badge(prT)}`;
  $('vpRight').innerHTML = `Earth: ${h.name}<small>${h.lat.toFixed(2)}, ${h.lon.toFixed(2)} &middot; g 9.81 m/s&sup2;</small>${badge(prE)}`;
  const anyDemo = !pT.real || !pE.real, notes = [];
  if (anyDemo) notes.push('Grounds labelled demo are synthetic stand-ins, not the real place');
  if (pT.real || pE.real) notes.push('real grounds are north-up; the sun azimuth is a compass bearing');
  notes.push('the close-up ground grain is a generic photo texture and the rocks are illustrative', (pT.C && pE.C) ? 'beyond the outline is the real 10 km context ring at 62.5 m' : 'beyond the outline: the real context ring where the ground is real, mirrored copies where it is demo');
  $('synthNote').textContent = notes.join(' · ') + '.';
  $('siteBadges').innerHTML = (anyDemo ? '<span class="badge" title="At least one ground in this view is a synthetic stand-in. Scores and traits are demo data: ' + esc(D.manifest.note || '') + '">DEMO DATA</span>' : '') + ((pT.real || pE.real) ? '<span class="badge ok" title="Real elevation is shown for: ' + [pT.real && t.short, pE.real && h.name].filter(Boolean).join(', ') + '">REAL TERRAIN: ' + [pT.real && 'target', pE.real && 'Earth'].filter(Boolean).join(' + ') + '</span>' : '');
}
function fillCompare(t, h) {
  const rows = D.meta.traits.map(tr => {
    const off = tr.key === 'sun_elev' && !t.polar, s = h.sim[tr.key], hue = 8 + s * 1.2;
    return `<tr class="${off ? 'off' : ''}"><td>${tr.label}${off ? ' <small class="hint">(not used here)</small>' : ''}</td><td class="n t">${fmtTrait(tr.key, t.traits[tr.key])}</td><td class="n e">${fmtTrait(tr.key, h.traits[tr.key])}</td><td><div class="bar" title="similarity ${Math.round(s)}/100"><i style="width:${s}%;background:hsl(${hue},75%,52%)"></i></div></td></tr>`;
  }).join('');
  $('cmpTable').innerHTML = `<tr><th>Trait</th><th class="n">Target</th><th class="n">Earth</th><th>Match</th></tr>${rows}`;
}
function fillExplanation(t, purpose, h) {
  const key = `${t.id}|${purpose}|${h.id}`, cached = D.expl[key], label = D.meta.purposes[purpose].label;
  $('explText').textContent = cached || templateExplanation(t, label, h);
  $('explSrc').textContent = cached ? `Cached explanation (${D.explSource}), written only from the numbers above. It explains the match and never produces rankings.` : 'Generated in the browser from the numbers above (template sentences). It never produces rankings.';
}

// ---------------------------------------------------------------- simulation set-up
function paintSimIntro() {
  const t = V.ctx.target, par = RS.cfg, gT = t.gravity, eq = par.mass_kg * gT / 9.81, nAss = Object.values(par.fig).filter(f => !f.verified).length, test = par.base_badge === 'test';
  $('simIntro').innerHTML = `The same rover build (<b>${par.name}</b>, ${par.kind.toUpperCase()}) drives the same start-to-goal line on both terrains; only terrain, gravity (${gT} vs 9.81 m/s&sup2;) and soil differ. <span class="assumed" title="Figures marked assumed have no verified source. See the rover panel for each one.">${nAss} figures assumed</span>`;
  const lab = $('eqMassLbl'); if (!lab) return;
  lab.innerHTML = test ? 'Scarecrow already weighs on Earth about what Curiosity weighs on Mars (JPL built it for exactly this reason), so the equal wheel load option is not needed.'
    : `Use equal-wheel-load test mass on Earth (${eq.toFixed(0)} kg = ${par.mass_kg} kg x ${(gT / 9.81).toFixed(2)}). JPL's Scarecrow test rover is the real-world version of this idea.`;
  $('eqMass').disabled = test; if (test) $('eqMass').checked = false;
}
function buildSimPanel(t, h) {
  $('simInputs').innerHTML = `
    <label>Friction, target soil<input id="muT" type="range" min="0.2" max="1" step="0.01" value="${frictionFromSoil(t.traits.soil).toFixed(2)}"><output></output></label>
    <label>Friction, Earth soil<input id="muE" type="range" min="0.2" max="1" step="0.01" value="${frictionFromSoil(h.traits.soil).toFixed(2)}"><output></output></label>
    <label class="chk"><input id="eqMass" type="checkbox"><span id="eqMassLbl"></span></label>`;
  $('simInputs').querySelectorAll('input[type=range]').forEach(i => { const o = i.nextElementSibling; o.textContent = (+i.value).toFixed(2); i.oninput = () => { o.textContent = (+i.value).toFixed(2); if (V.runs) guard('the rover simulation', 'simStatus', () => { computeRuns(); updateAll(true); }); }; });
  $('eqMass').onchange = () => { if (V.runs) guard('the rover simulation', 'simStatus', () => { computeRuns(); updateAll(true); }); };
  paintSimIntro();
  $('fidelity').textContent = 'Fidelity: this is a screening comparison with simplified soil behaviour (a single friction coefficient plus a simplified Bekker sinkage term with assumed soil constants). It has not been validated against a real rover. Default friction comes from a placeholder soil class and can be adjusted.';
  $('charts').innerHTML = [['tilt', 'Tilt (deg)'], ['slip', 'Slip (%)'], ['e', 'Energy (J/m)'], ['v', 'Speed (m/s)']].map(([k, l]) => `<div><div class="cl">${l}</div><canvas data-k="${k}"></canvas></div>`).join('');
  $('simStatus').textContent = 'Press Play under the 3D view. Both rovers drive their planned route in lockstep; drag the timeline to scrub.';
  buildHud();
}
function straightRoute(p) { const out = [], a = [START[0] * p.size, START[1] * p.size], b = [GOAL[0] * p.size, GOAL[1] * p.size], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(L / DS)); for (let k = 0; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); return out; }
function planAll() {
  const par = RS.cfg;
  V.routes = V.sides.map(s => planRoute(s.patch, par) || straightRoute(s.patch));
}
function computeRuns() {
  const { target: t, hotspot: h } = V.ctx, par = RS.cfg, [L, R] = V.sides, soils = RS.reg.soils, St = soils[groundClass(t.traits)], Se = soils[groundClass(h.traits)];
  const muT = +$('muT').value, muE = +$('muE').value, gT = t.gravity, gE = D.meta.gravity.earth;
  const T = analyze(L.patch, V.routes[0], par, { g: gT, mass: par.mass_kg, mu: muT, soil: t.traits.soil, S: St });
  const Er = analyze(R.patch, V.routes[1], par, { g: gE, mass: par.mass_kg, mu: muE, soil: h.traits.soil, S: Se });
  const Eq = analyze(R.patch, V.routes[1], par, { g: gE, mass: par.base_badge === 'test' ? par.mass_kg : par.mass_kg * gT / gE, mu: muE, soil: h.traits.soil, S: Se });
  const E = $('eqMass').checked ? Eq : Er;
  V.runs = { A: [T, E], T, Er, Eq, ctx: { gTarget: gT, gEarth: gE, rover: par.name, kind: par.kind }, grounds: [groundClass(t.traits), groundClass(h.traits)], sm: null, verdictShown: false };
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

/** Move both cameras to the overview, or to a chase view behind each pane's own rover. Animated unless snap. */
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

// ---------------------------------------------------------------- per-frame pose, HUD, charts
function poseRover(i, kf, dt, snap) {
  const s = V.sides[i], A = V.runs.A[i], par = RS.cfg;
  const k = Math.min(A.n - 2, Math.floor(kf)), f = clamp(kf - k, 0, 1), k1 = k + 1;
  const x = A.x[k] + (A.x[k1] - A.x[k]) * f, z = A.z[k] + (A.z[k1] - A.z[k]) * f;
  let dpsi = A.psi[k1] - A.psi[k]; dpsi = Math.atan2(Math.sin(dpsi), Math.cos(dpsi));
  // wheel contacts on the fine height grid, body plane through them, wheels riding the surface, sinkage from the soil model, tracks (contact.js)
  poseOnGround(s, x, z, A.psi[k] + dpsi * f, { par, ex: V.exag, dt, snap, sink: A.sink ? A.sink[k] + (A.sink[k1] - A.sink[k]) * f : 0, wheelAng: (A.s[k] + (A.s[k1] - A.s[k]) * f) / par.wheel_radius_m, moving: V.playing });
  const live = Math.round(kf); s.lineOn.geometry.setDrawRange(0, Math.min(A.n, live + 1));
}
function buildHud() {
  const row = (k, l) => `<div><span>${l}</span><span data-k="${k}">-</span></div>`;
  ['L', 'R'].forEach(sd => { $('hud' + sd).innerHTML = row('time', 'Time') + row('dist', 'Distance') + row('tilt', 'Tilt') + row('slip', 'Slip') + row('e', 'Energy per m') + row('E', 'Energy used'); });
  $('liveCmp').innerHTML = [['tilt', 'Tilt'], ['slip', 'Slip'], ['e', 'Energy per m'], ['time', 'Time']].map(([k, l]) =>
    `<div class="lc-row" data-k="${k}"><span class="lc-t"></span><div class="lc-mid"><label>${l}</label><div class="lc-bar"><i class="a"></i><i class="b"></i></div></div><span class="lc-e"></span></div>`).join('');
  const grab = id => { const o = {}; $(id).querySelectorAll('[data-k]').forEach(e => { o[e.dataset.k] = e; }); return o; };
  V.hud = { L: grab('hudL'), R: grab('hudR'), lc: {} };
  $('liveCmp').querySelectorAll('.lc-row').forEach(r => { V.hud.lc[r.dataset.k] = { t: r.querySelector('.lc-t'), e: r.querySelector('.lc-e'), a: r.querySelector('.a'), b: r.querySelector('.b') }; });
}
const put = (e, t) => { if (e.textContent !== t) e.textContent = t; };
function hudSet(h, a, q) { put(h.time, (a.t[q] / 60).toFixed(1) + ' min'); put(h.dist, a.s[q].toFixed(0) + ' m'); put(h.tilt, a.tilt[q].toFixed(1) + '°'); put(h.slip, a.slip[q].toFixed(0) + ' %'); put(h.e, a.e[q].toFixed(0) + ' J'); put(h.E, (a.E[q] / 3600).toFixed(1) + ' Wh'); }
function lcSet(r, a, b, d, unit) { const sh = (a / Math.max(1e-9, a + b)) * 100; put(r.t, a.toFixed(d) + unit); put(r.e, b.toFixed(d) + unit); r.a.style.width = sh.toFixed(1) + '%'; r.b.style.width = (100 - sh).toFixed(1) + '%'; }
function updateHud(kf) {   // element references are cached by buildHud: no DOM queries per frame
  const H = V.hud, A = V.runs.A; if (!H) return;
  const q0 = clamp(Math.round(kf[0]), 0, A[0].n - 1), q1 = clamp(Math.round(kf[1]), 0, A[1].n - 1), a = A[0], b = A[1];
  hudSet(H.L, a, q0); hudSet(H.R, b, q1);
  lcSet(H.lc.tilt, a.tilt[q0], b.tilt[q1], 1, '°'); lcSet(H.lc.slip, a.slip[q0], b.slip[q1], 0, '%'); lcSet(H.lc.e, a.e[q0], b.e[q1], 0, ' J'); lcSet(H.lc.time, a.t[q0] / 60, b.t[q1] / 60, 1, ' min');
}
function smooth(a, w = 9) { const o = new Float32Array(a.length), h = w >> 1; for (let i = 0; i < a.length; i++) { let sum = 0, c = 0; for (let k = Math.max(0, i - h); k <= Math.min(a.length - 1, i + h); k++) { sum += a[k]; c++; } o[i] = sum / c; } return o; }
function drawCharts(kf) {
  const run = V.runs; if (!run.sm) run.sm = run.A.map(A => ({ tilt: smooth(A.tilt), slip: smooth(A.slip), e: smooth(A.e), v: smooth(A.v) }));
  document.querySelectorAll('#charts canvas').forEach(c => {
    const key = c.dataset.k, dpr = window.devicePixelRatio || 1, w = c.clientWidth * dpr, h = c.clientHeight * dpr;
    if (!w) return; if (c.width !== w) { c.width = w; c.height = h; }
    const g = c.getContext('2d'); g.clearRect(0, 0, w, h);
    const mn = 0; if (!run.mx) run.mx = {}; if (!(key in run.mx)) { let m = -Infinity; for (const arr of [run.sm[0][key], run.sm[1][key]]) for (let q = 0; q < arr.length; q++) if (arr[q] > m) m = arr[q]; run.mx[key] = m === mn ? mn + 1 : m; }   // the scale is fixed per run, computed once
    const mx = run.mx[key];
    run.A.forEach((A, i) => {
      const col = i ? COL_E : COL_T, kk = Math.round(kf[i]);
      [[0.28, A.n - 1], [1, kk]].forEach(([alpha, last]) => {
        g.globalAlpha = alpha; g.strokeStyle = col; g.lineWidth = 1.6 * dpr; g.beginPath();
        for (let q = 0; q <= last; q += 2) { const x = (q / (A.n - 1)) * (w - 4) + 2, y = h - 3 - ((run.sm[i][key][q] - mn) / (mx - mn)) * (h - 8); q ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.stroke();
      });
    });
    g.globalAlpha = 1;
  });
}
function showVerdict() {
  const run = V.runs, v = verdict(run.T, run.Er, run.Eq, run.ctx), cls = v.match >= 80 ? 'good' : v.match >= 60 ? 'mid' : 'bad';
  const tag = r => r.status === 'rover' ? '<span class="tagm gr">build</span>' : r.status === 'match' ? '<span class="tagm ok">match</span>' : r.status === 'mismatch' ? '<span class="tagm no">mismatch</span>' : '<span class="tagm gr">gravity</span>';
  const f = (x, r) => (r.unit === '°' || r.unit === '%' || r.unit === ' min' || r.unit === ' mm' || r.unit === ' Wh' || r.unit === ' kPa') ? x.toFixed(1) : Math.round(x).toLocaleString();
  $('verdict').innerHTML = `<div class="big ${cls}">${Math.round(v.match)}/100 &middot; ${v.label}</div><div class="hint">Match of the two drives on terrain-driven metrics (tilt, slip, energy at equal wheel load, time).</div>
  <table><tr><th>Metric</th><th>Target</th><th>Earth</th><th></th></tr>${v.rows.map(r => `<tr><td>${r.label}</td><td>${f(r.a, r)}${r.unit}</td><td>${f(r.b, r)}${r.unit}</td><td>${tag(r)}</td></tr>`).join('')}</table>
  ${v.mismatches.length ? `<b>Mismatches</b><ul>${v.mismatches.map(m => `<li>${m}</li>`).join('')}</ul>` : '<b>Mismatches</b><ul><li>None on the terrain-driven metrics.</li></ul>'}
  <b>Gravity</b><p class="hint">${v.gravityNote}</p><b>Recommendation</b><p>${v.recommendation}</p>`;
  $('verdict').classList.remove('hidden');
  $('vpVerdictBody').innerHTML = `<div class="big ${cls}">${Math.round(v.match)}/100</div><div><b>${v.label}</b><div class="hint">${v.mismatches.length ? v.mismatches[0] : 'The two drives behave alike on the terrain-driven metrics.'}</div></div>`;
  $('vpVerdict').classList.remove('hidden');
  $('simStatus').textContent = 'Finished. Press Play to run it again, or drag the timeline.';
  run.verdict = v; run.verdictShown = true;
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
  // keep the camera above the terrain, always
  const g = worldH(p, cam.position.x, cam.position.z) * ex, clear = Math.max(1.6, 0.03 * cam.position.distanceTo(ct.target));
  if (cam.position.y < g + clear) cam.position.y = g + clear;
  const gt = worldH(p, ct.target.x, ct.target.z) * ex; if (ct.target.y < gt) ct.target.y = gt;
}
function linkCameras() {
  if (!V.link || V.dirty < 0 || V.cams[0].anim || V.cams[1].anim) { V.dirty = -1; return; }
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
  if (!V.open) return;
  V.raf = requestAnimationFrame(frame);   // re-armed first so an error in one frame never stops the loop
  const drew = !!(V.drive || V.playing || V.snap || now < V.awake || V.cams[0].anim || V.cams[1].anim), t0 = qStart();   // quality.js measures every drawn frame (F3 overlay, auto quality, ?bench)
  try { frameBody(now); } catch (e) { if (!V.frameErr) { V.frameErr = true; console.error(e); siteNote(`A drawing error occurred: ${errText(e)}`); } }
  try { qEnd(now, t0, drew); } catch (e) { /* measuring must never break drawing */ }
}
function frameBody(now) {
  const dt = Math.min(0.1, (now - V.last) / 1000); V.last = now;
  if (V.drive) { V.drive.frame(dt, now); return; }   // drive mode owns the canvas while it is active
  if (!(V.playing || V.snap || now < V.awake || V.cams[0].anim || V.cams[1].anim)) return;   // idle: draw nothing
  const run = V.runs;
  if (run) try {
    if (V.playing) {
      V.u += (dt * V.speed) / V.DUR;
      if (V.u >= 1) { V.u = 1; play(false); }
    }
    const kf = V.kf || (V.kf = [0, 0]); kf[0] = V.u * (run.A[0].n - 1); kf[1] = V.u * (run.A[1].n - 1);   // reused, no per-frame allocation
    for (let i = 0; i < V.sides.length; i++) poseRover(i, kf[i], dt, V.snap);
    updateHud(kf);
    if (V.playing || V.snap) { if (!V.lastChart || now - V.lastChart > 90 || V.snap) { drawCharts(kf); V.lastChart = now; } }
    $('scrub').value = Math.round(V.u * 1000); $('scrubO').textContent = Math.round(V.u * 100) + ' %';
    if (V.u >= 1 && !run.verdictShown) showVerdict();
    if (V.u < 1 && run.verdictShown) { run.verdictShown = false; $('vpVerdict').classList.add('hidden'); }
  } catch (e) { if (!V.simErr) { V.simErr = true; failPanel('simStatus', 'the rover simulation display', e); } }   // the terrain keeps drawing
  V.lodForce = V.snap || !V.lodReady; V.lodReady = true;
  V.sides.forEach((s, i) => updateCamera(i, dt)); V.snap = false;
  linkCameras();
  const c = $('siteCanvas'), w = c.clientWidth, h = c.clientHeight, half = Math.floor(w / 2);
  if (!w || !h) return;
  V.sides.forEach((s, i) => {
    const cam = V.cams[i].camera, x = i ? half + 1 : 0, ww = i ? w - half - 1 : half - 1;
    const asp = ww / h; if (Math.abs(cam.aspect - asp) > 1e-3) { cam.aspect = asp; cam.updateProjectionMatrix(); }
    updateSunShadow(i);
    if (s.rover) { const f = s.focus || (s.focus = [[0, 0]]); f[0][0] = s.rover.root.position.x; f[0][1] = s.rover.root.position.z; }
    if (s.ground.update(cam.position, V.lodForce, s.rover ? s.focus : null)) wake(300);   // tiles still to build: keep drawing; the tiles under the rover are always full detail
    if (s.rover && s.ground.rocks) s.ground.rocks.update(s.rover.root.position.x, s.rover.root.position.z);
    s.sky.position.copy(cam.position);
    if (s.rover) { const dist = cam.position.distanceTo(s.rover.root.position), sc = Math.max(0.2, dist * 0.06);
      s.marker.visible = dist > 70; s.marker.scale.set(sc, sc * 2.4, sc); s.marker.position.set(s.rover.root.position.x, s.rover.root.position.y + 2 + sc * 1.2, s.rover.root.position.z); } else s.marker.visible = false;
    V.renderer.setViewport(x, 0, ww, h); V.renderer.setScissor(x, 0, ww, h);
    V.renderer.render(s.scene, cam);
  });
}

/** Called by drive mode when it hands the canvas back: re-place both rovers, routes and markers as Site View expects. */
export function refreshAfterDrive() { V.sides.forEach(s => { s.line.visible = s.lineOn.visible = true; s.pose.init = false; s.tracks.reset(); }); V.lodReady = false; V.snap = true; V.last = performance.now(); updateAll(true); V.dirty = -1; }
export function setSitePlaying(on) { play(on); }
export const siteHelpers = { setShadow: (s, n) => setShadowSize(s.sun, n), updateGeometryAll: () => V.sides.forEach(updateGeometry), setExag: ex => V.sides.forEach(s => { s.ground.setExag(ex); s.mat.userData.U.uEx.value = ex; }) };
