// Site View: two terrains side by side (target left, Earth hotspot right), each pane with its own camera and OrbitControls
// (optionally linked), PBR ground from local textures, a rover on each terrain, and a watchable playback of the simulation.
// The terrain shape is a stand-in in demo mode; the ground photo texture is a visual aid only and carries no measured information.
import * as THREE from '../vendor/three-bundle.js';
import { D, ROOT, fmtTrait, templateExplanation } from './data.js';
import { getPatch, upsample, sampleGrid, surfaceH, worldH, shadeUpsampled } from './terrain.js';
import { planRoute, analyze, verdict, frictionFromSoil, wheelPoints, START, GOAL, DS } from './sim.js';
import { motion, ease } from './globeview.js';

const $ = id => document.getElementById(id);
const COL_T = '#38bdf8', COL_E = '#fb923c';
const V = { ready: false, open: false, sides: [], cams: [], ctx: null, mode: 'plain', exag: 1, glb: null, tex: null, runs: null, routes: null, u: 0, playing: false, speed: 1, DUR: 75, link: true, follow: true, active: 0, dirty: -1, syncing: false, shown: false };
export const SITE = { get V() { return V; } };
const BODY_NAME = { moon: 'Moon', mars: 'Mars', earth: 'Earth' };
const _v = new THREE.Vector3(), _X = new THREE.Vector3(), _Y = new THREE.Vector3(), _Z = new THREE.Vector3(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _t = new THREE.Vector3();
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// ---------------------------------------------------------------- renderer, cameras, UI wiring (created once)
function ensureRenderer() {
  if (V.ready) return;
  const canvas = $('siteCanvas');
  V.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  V.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  V.renderer.setScissorTest(true);
  V.renderer.shadowMap.enabled = true; V.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  V.renderer.toneMapping = THREE.ACESFilmicToneMapping; V.renderer.toneMappingExposure = 0.95;
  ['paneL', 'paneR'].forEach((id, i) => {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 60000), el = $(id);
    const controls = new THREE.OrbitControls(camera, el);
    Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, maxPolarAngle: Math.PI * 0.49, minDistance: 4, maxDistance: 4000, zoomSpeed: 0.9, screenSpacePanning: false });
    controls.listenToKeyEvents(el);
    controls.addEventListener('start', () => { V.active = i; });
    controls.addEventListener('change', () => { if (!V.syncing) V.dirty = i; });
    V.cams.push({ camera, controls, el, anim: null });
  });
  new ResizeObserver(resize).observe($('vpStage'));
  const modes = [['plain', 'Natural'], ['slope', 'Slope'], ['elev', 'Elevation']];
  $('colorModes').innerHTML = '';
  modes.forEach(([k, l]) => {
    const b = document.createElement('button'); b.textContent = l; b.dataset.mode = k;
    b.onclick = () => { V.mode = k; paintModes(); V.sides.forEach(updateGeometry); };
    $('colorModes').appendChild(b);
  });
  $('speeds').innerHTML = '';
  [0.5, 1, 2, 4].forEach(sp => {
    const b = document.createElement('button'); b.textContent = sp + 'x'; b.dataset.speed = sp; b.setAttribute('aria-label', `Playback speed ${sp} times`);
    b.onclick = () => { V.speed = sp; paintSpeeds(); };
    $('speeds').appendChild(b);
  });
  const bind = (id, fn) => { const e = $(id), o = $(id + 'O'); e.oninput = () => { if (o) o.textContent = e.value; fn(+e.value); }; };
  bind('exag', v => { V.exag = v; V.sides.forEach(updateGeometry); updateAll(true); });
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
  V.ready = true;
}
function paintModes() { document.querySelectorAll('#colorModes button').forEach(b => b.classList.toggle('active', b.dataset.mode === V.mode)); }
function paintSpeeds() { document.querySelectorAll('#speeds button').forEach(b => b.classList.toggle('active', +b.dataset.speed === V.speed)); }
function resize() {
  if (!V.ready) return;
  const w = $('vpStage').clientWidth, h = $('vpStage').clientHeight;
  if (w && h) V.renderer.setSize(w, h, false);
}
function sunDir() {
  const el = +$('sunEl').value * Math.PI / 180, az = +$('sunAz').value * Math.PI / 180;
  return new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
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
function groundMaterial(body, tex, traits) {
  const lk = { ...LOOK[body] }, t = tex[lk.set];
  if (body === 'earth' && traits) {   // rough visual hint from the site's own traits, not a land-cover map
    if (traits.temp_mean < 270) Object.assign(lk, { tint: [1.5, 1.55, 1.65], sat: 0.15, bright: 1.55 });
    else if (traits.dust > 0.62) Object.assign(lk, { tint: [1.35, 1.15, 0.8], sat: 0.6 });
  }
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, map: t.map, normalMap: t.normal, roughnessMap: t.rough, roughness: 1, metalness: 0, side: THREE.DoubleSide });
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, { uTint: { value: new THREE.Vector3(...lk.tint).multiplyScalar(lk.bright) }, uSat: { value: lk.sat }, uScale: { value: lk.scale }, uAvg: { value: t.avg }, uNrm: { value: lk.nrm } });
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos; varying float vSk; attribute float sk; uniform float uScale;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\n vec4 _wp = modelMatrix * vec4(position, 1.0); vWPos = _wp.xyz; vSk = sk;\n #ifdef USE_NORMALMAP\n vNormalMapUv = _wp.xz / uScale;\n #endif');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos; varying float vSk; uniform vec3 uTint; uniform float uSat; uniform float uScale; uniform vec3 uAvg; uniform float uNrm;')
      .replace('#include <map_fragment>', `
        mat2 R1 = mat2(0.8253, -0.5646, 0.5646, 0.8253), R2 = mat2(0.8776, 0.4794, -0.4794, 0.8776);
        vec2 w1 = vWPos.xz / uScale; vec2 w2 = vWPos.xz / (uScale * 0.21) + vec2(0.37, 0.71); vec2 w3 = vWPos.xz / (uScale * 6.3);
        vec2 w4 = (R1 * vWPos.xz) / (uScale * 1.7) + vec2(0.21, 0.55); vec2 w5 = (R2 * vWPos.xz) / (uScale * 0.47);
        vec3 gb = mix((texture2D(map, w1).rgb + texture2D(map, w4).rgb) * 0.5, (texture2D(map, w2).rgb + texture2D(map, w5).rgb) * 0.5, 0.35);
        gb = uAvg + (gb - uAvg) * 1.6;
        float glum = dot(gb, vec3(0.299, 0.587, 0.114));
        gb = mix(vec3(glum), gb, uSat) * uTint;
        float macro = dot(texture2D(map, w3).rgb, vec3(0.333)) / max(0.02, dot(uAvg, vec3(0.333)));
        gb *= clamp(0.74 + 0.36 * macro, 0.62, 1.3);
        diffuseColor.rgb *= max(gb, vec3(0.0));`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = roughness * clamp(mix(texture2D(roughnessMap, w1).g, texture2D(roughnessMap, w2).g, 0.35), 0.6, 1.0);')
      .replace('#include <normal_fragment_maps>', `
        mat3 tbnG = getTangentFrame(-vViewPosition, normal, vNormalMapUv);
        vec3 n1 = texture2D(normalMap, w1).xyz * 2.0 - 1.0; vec3 n2 = texture2D(normalMap, w2).xyz * 2.0 - 1.0;
        vec3 mapN = normalize(vec3(n1.xy + n2.xy * 0.8, n1.z));
        float dnear = 1.0 - smoothstep(50.0, 800.0, length(vViewPosition));
        mapN.xy *= uNrm * dnear * (1.0 - vSk);
        if (vSk < 0.5) normal = normalize(tbnG * mapN);`);
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

// ---------------------------------------------------------------- terrain meshes
/** Grid tile of the upsampled surface: region (i0, j0, cells) sampled every `stride`, centred on (cx, cz), with a skirt to hide LOD cracks. */
function tileGeo(U, p, i0, j0, cells, stride, ex, col, cx, cz, depth) {
  const M = U.M, m = cells / stride + 1, half = p.size / 2, nv = m * m, ring = [];
  if (depth > 0) {   // optional skirt against cracks between levels of detail (off: it showed as dark seams at grazing angles)
    for (let b = 0; b < m; b++) ring.push(b);
    for (let a = 1; a < m; a++) ring.push(a * m + m - 1);
    for (let b = m - 2; b >= 0; b--) ring.push((m - 1) * m + b);
    for (let a = m - 2; a >= 1; a--) ring.push(a * m);
  }
  const nr = ring.length, tot = nv + nr, pos = new Float32Array(tot * 3), nor = new Float32Array(tot * 3), cc = new Float32Array(tot * 3), sk = new Float32Array(tot);
  for (let a = 0; a < m; a++) for (let b = 0; b < m; b++) {
    const ui = i0 + a * stride, uj = j0 + b * stride, v = a * m + b, o = v * 3, src = ui * M + uj;
    const jl = Math.max(0, uj - stride), jr = Math.min(M - 1, uj + stride), il = Math.max(0, ui - stride), ir = Math.min(M - 1, ui + stride);
    const dhx = (U.h[ui * M + jr] - U.h[ui * M + jl]) / ((jr - jl) * U.dx) * ex, dhz = (U.h[ir * M + uj] - U.h[il * M + uj]) / ((ir - il) * U.dx) * ex, inv = 1 / Math.hypot(dhx, 1, dhz);
    pos[o] = uj * U.dx - half - cx; pos[o + 1] = U.h[src] * ex; pos[o + 2] = ui * U.dx - half - cz;
    nor[o] = -dhx * inv; nor[o + 1] = inv; nor[o + 2] = -dhz * inv;
    cc[o] = col[src * 3]; cc[o + 1] = col[src * 3 + 1]; cc[o + 2] = col[src * 3 + 2];
  }
  ring.forEach((v, k) => { sk[nv + k] = 1; const o = (nv + k) * 3, s = v * 3; pos[o] = pos[s]; pos[o + 1] = pos[s + 1] - depth; pos[o + 2] = pos[s + 2]; nor[o] = nor[s]; nor[o + 1] = nor[s + 1]; nor[o + 2] = nor[s + 2]; cc[o] = cc[s]; cc[o + 1] = cc[s + 1]; cc[o + 2] = cc[s + 2]; });
  const idx = new Uint32Array(((m - 1) * (m - 1) * 2 + nr * 2) * 3); let q = 0;
  for (let a = 0; a < m - 1; a++) for (let b = 0; b < m - 1; b++) { const v00 = a * m + b, v10 = v00 + m, v01 = v00 + 1, v11 = v10 + 1; idx[q++] = v00; idx[q++] = v10; idx[q++] = v01; idx[q++] = v10; idx[q++] = v11; idx[q++] = v01; }
  for (let k = 0; k < nr; k++) { const k1 = (k + 1) % nr, r0 = ring[k], r1 = ring[k1], s0 = nv + k, s1 = nv + k1; idx[q++] = r0; idx[q++] = s0; idx[q++] = r1; idx[q++] = r1; idx[q++] = s0; idx[q++] = s1; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('color', new THREE.BufferAttribute(cc, 3)); g.setAttribute('sk', new THREE.BufferAttribute(sk, 1)); g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeBoundingSphere();
  return g;
}
const SUB = 4, STRIDES = [1, 2, 4];
function updateGeometry(s) {
  const p = s.patch, U = upsample(p), col = shadeUpsampled(p, V.mode), ex = V.exag, half = p.size / 2, cells = (U.M - 1) / SUB, depth = 0;
  s.geos.forEach(g => g.dispose()); s.geos = [];
  s.subs.forEach(sub => sub.lods.forEach((mesh, li) => { mesh.geometry = tileGeo(U, p, sub.i0, sub.j0, cells, STRIDES[li], ex, col, sub.cx, sub.cz, depth); s.geos.push(mesh.geometry); }));
  s.outerGeo = tileGeo(U, p, 0, 0, U.M - 1, 8, ex, col, 0, 0, depth); s.geos.push(s.outerGeo);
  s.outer.forEach(m => { m.geometry = s.outerGeo; });
  // patch outline (the region that carries data)
  const n = 64, pts = [];
  const edge = (t, side) => { const c = t * p.size; return side === 0 ? [c, 0] : side === 1 ? [p.size, c] : side === 2 ? [p.size - c, p.size] : [0, p.size - c]; };
  for (let side = 0; side < 4; side++) for (let k = 0; k < n; k++) { const [x, z] = edge(k / n, side); pts.push(x - half, surfaceH(p, x, z) * ex + 0.6, z - half); }
  s.outline.geometry.dispose(); s.outline.geometry = new THREE.BufferGeometry(); s.outline.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  if (V.runs) drawRoutes();
}
function buildSide(patch, body, color, tex, idx, traits) {
  const f = patch.size / 2000, far = patch.size * 30, c = SKY[body];
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(c.fog, (body === 'moon' ? 3000 : 2200) * f, (body === 'moon' ? 9000 : 7200) * f);
  const sky = makeSky(body, far); scene.add(sky);
  const hemi = new THREE.HemisphereLight({ moon: 0x9aa0ac, mars: 0xe2b496, earth: 0xa9c4e8 }[body], { moon: 0x35353a, mars: 0x4a3226, earth: 0x4a4338 }[body], { moon: 0.95, mars: 1.15, earth: 1.2 }[body]);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(body === 'earth' ? 0xfff2dc : 0xfff4e6, { moon: 3.4, mars: 3.2, earth: 3.2 }[body]);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004;
  scene.add(sun, sun.target);
  const mat = groundMaterial(body, tex, traits);
  const U = upsample(patch), cells = (U.M - 1) / SUB, subs = [], half = patch.size / 2;
  for (let ti = 0; ti < SUB; ti++) for (let tj = 0; tj < SUB; tj++) {
    const i0 = ti * cells, j0 = tj * cells, cx = (j0 + cells / 2) * U.dx - half, cz = (i0 + cells / 2) * U.dx - half;
    const lod = new THREE.LOD(), lods = [];
    [0, 520 * f, 1500 * f].forEach((d, li) => { const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat); mesh.castShadow = li < 2; mesh.receiveShadow = true; lod.addLevel(mesh, d); lods.push(mesh); });
    lod.position.set(cx, 0, cz); scene.add(lod); subs.push({ lod, lods, i0, j0, cx, cz });
  }
  const outer = [];
  for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) {
    if (!a && !b) continue;
    const m = new THREE.Mesh(new THREE.BufferGeometry(), mat); m.receiveShadow = true;
    m.position.set(a * patch.size, 0, b * patch.size); m.scale.set(Math.abs(a) % 2 ? -1 : 1, 1, Math.abs(b) % 2 ? -1 : 1);
    scene.add(m); outer.push(m);
  }
  const outline = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 })); outline.renderOrder = 4; scene.add(outline);
  const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 });
  const line = new THREE.Line(new THREE.BufferGeometry(), lineMat), lineOn = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff })); line.renderOrder = lineOn.renderOrder = 5; line.visible = lineOn.visible = false; scene.add(line, lineOn);
  const marker = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1, 14), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, fog: false, depthTest: false })); marker.renderOrder = 8; marker.rotation.x = Math.PI; scene.add(marker);
  const s = { idx, patch, body, scene, sky, sun, hemi, mat, subs, outer, outline, line, lineOn, marker, color, rover: null, geos: [], pose: { init: false } };
  updateGeometry(s);
  return s;
}

// ---------------------------------------------------------------- rover models
const matBody = () => new THREE.MeshStandardMaterial({ color: 0xc9ccd1, metalness: 0.4, roughness: 0.55 });
function proceduralRover(par) {
  const g = new THREE.Group(), r = par.wheel_radius_m, W = wheelPoints(par), wheels = [];
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(par.track_m * 0.62, 0.45, par.wheelbase_m * 0.95), matBody()); chassis.position.y = r + 0.5; g.add(chassis);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), matBody()); mast.position.set(0, r + 1.2, par.wheelbase_m * 0.3); g.add(mast);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.18), new THREE.MeshStandardMaterial({ color: 0x222831 })); head.position.set(0, r + 1.7, par.wheelbase_m * 0.3); g.add(head);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(par.track_m * 0.6, 0.04, par.wheelbase_m * 0.6), new THREE.MeshStandardMaterial({ color: 0x1b2a4a, metalness: 0.2, roughness: 0.4 })); panel.position.set(0, r + 0.78, -par.wheelbase_m * 0.05); g.add(panel);
  W.forEach(([u, v]) => {
    const wn = new THREE.Group(); wn.position.set(v, r, u);
    const spin = new THREE.Group(), wmat = new THREE.MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.9 });
    const w = new THREE.Mesh(new THREE.CylinderGeometry(r, r, r * 0.9, 20), wmat); w.rotation.z = Math.PI / 2; spin.add(w);
    for (let q = 0; q < 8; q++) { const lug = new THREE.Mesh(new THREE.BoxGeometry(r * 0.94, r * 0.16, r * 0.2), new THREE.MeshStandardMaterial({ color: 0x555d6b, roughness: 0.8 })); const an = q / 8 * Math.PI * 2; lug.position.set(0, Math.sin(an) * r * 0.97, Math.cos(an) * r * 0.97); lug.rotation.x = -an; spin.add(lug); }   // lugs make the wheel rotation visible
    wn.add(spin);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(v) - par.track_m * 0.3 + 0.1, 0.06, 0.06), matBody()); arm.position.set(-Math.sign(v) * (Math.abs(v) - par.track_m * 0.3 + 0.1) / 2, r * 0.5, 0); wn.add(arm);
    g.add(wn); wheels.push({ node: wn, spin, u, v });
  });
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return { root: g, wheels };
}
async function makeRover(par) {
  if (par.model_kind === 'procedural') return proceduralRover(par);
  if (!V.glb) { const L = new THREE.GLTFLoader(); L.setMeshoptDecoder(THREE.MeshoptDecoder); V.glb = L.loadAsync(ROOT + par.model).then(g => g.scene); }
  const model = (await V.glb).clone(true), root = new THREE.Group(); model.position.z = par.model_offset_z_m || 0;
  model.traverse(o => { if (o.isMesh) { o.castShadow = true; } });
  root.add(model);
  return { root, wheels: [] };
}
async function makeRovers(target) {
  const par = D.rovers.rovers[target.rover];
  const rovers = [await makeRover(par), await makeRover(par)];   // the same rover model and scale on both terrains
  V.sides.forEach((s, i) => { s.rover = rovers[i]; s.scene.add(rovers[i].root); });
}

// ---------------------------------------------------------------- open / close
export async function openSite({ target, purpose, hotspot, onBack }) {
  ensureRenderer();
  const tex = await loadGround();
  V.ctx = { target, purpose, hotspot }; V.onBack = onBack;
  $('site').classList.remove('hidden'); $('home').classList.add('hidden');
  resize(); paintModes(); paintSpeeds();
  V.playing = false; V.u = 0; V.snap = true; V.shown = false; V.runs = null; V.routes = null;
  disposeSides();
  const pT = getPatch(target.patch, target.traits), pE = getPatch(hotspot.id, hotspot.traits);
  V.sides = [buildSide(pT, target.body, 0x38bdf8, tex, 0, target.traits), buildSide(pE, 'earth', 0xfb923c, tex, 1, hotspot.traits)];
  $('exag').value = 1; $('exagO').textContent = '1'; V.exag = 1;
  $('sunEl').value = target.polar ? 8 : 35; $('sunElO').textContent = $('sunEl').value; $('sunAz').value = 135; $('sunAzO').textContent = '135'; setSun();
  $('follow').checked = V.follow = true; $('link').checked = V.link = true;
  play(false);
  fillLabels(target, hotspot, pT, pE); fillCompare(target, hotspot); fillExplanation(target, purpose, hotspot); buildSimPanel(target, hotspot);
  V.sides.forEach(s => updateGeometry(s));
  const sz = pT.size;
  V.cams.forEach(c => { c.camera.near = Math.max(0.25, sz * 0.00012); c.camera.far = sz * 30; c.camera.updateProjectionMatrix(); c.controls.maxDistance = sz * 1.9; c.anim = null; });
  await makeRovers(target);
  planAll(); computeRuns();
  V.sides.forEach(s => { s.rover.root.visible = true; s.line.visible = s.lineOn.visible = true; s.pose.init = false; });
  $('vpVerdict').classList.add('hidden'); $('verdict').classList.add('hidden');
  updateAll(true);
  goView(false, true);   // overview, snapped
  V.open = true; cancelAnimationFrame(V.raf); V.last = performance.now(); V.raf = requestAnimationFrame(frame);
  window.TERRA_SITE = V;
}
function disposeSides() {
  V.sides.forEach(s => s.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); }));
  V.sides = [];
}
export function closeSite() {
  if (V.drive) V.drive.exit(true);
  V.open = false; cancelAnimationFrame(V.raf); V.playing = false;
  $('site').classList.add('hidden'); $('home').classList.remove('hidden');
}

function fillLabels(t, h, pT, pE) {
  $('siteTitle').innerHTML = `<span class="l">${t.name}</span><span class="vs">vs</span><span class="r">${h.name}</span><span class="meta">hotspot ${h.rank}, score ${Math.round(h.score)}</span>`;
  $('vpLeft').innerHTML = `Target: ${t.short} (${BODY_NAME[t.body]})<small>g ${t.gravity} m/s&sup2; &middot; ${(pT.size / 1000).toFixed(0)} km patch</small>`;
  $('vpRight').innerHTML = `Earth: ${h.name}<small>${h.lat.toFixed(2)}, ${h.lon.toFixed(2)} &middot; g 9.81 m/s&sup2;</small>`;
  const notes = [D.manifest.demo ? 'Demo data: terrain shape is a synthetic stand-in' : 'Fine terrain detail is synthetic', 'ground texture is a photo for visual detail only (Earth tint follows the temperature and dust traits)', 'surroundings beyond the outline are mirrored copies'];
  if (pE.browserStandIn) notes.splice(1, 0, 'Earth terrain generated in the browser');
  $('synthNote').textContent = notes.join(' · ') + '.';
  $('siteBadges').innerHTML = D.manifest.demo ? '<span class="badge" title="' + D.manifest.note + '">DEMO DATA</span>' : '<span class="badge ok">REAL DATA</span>';
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
function buildSimPanel(t, h) {
  const par = D.rovers.rovers[t.rover], gT = t.gravity, eq = par.mass_kg * gT / 9.81;
  const unv = Object.entries(par.sources).filter(([, v]) => !v.verified).map(([k]) => k.replace(/_/g, ' '));
  $('simIntro').innerHTML = `Rover: <b>${par.name}</b>, ${par.mass_kg} kg, ${par.n_wheels} wheels, wheel radius ${par.wheel_radius_m} m. The same rover drives the same start-to-goal line on both terrains; only terrain, gravity (${gT} vs 9.81 m/s&sup2;) and soil friction differ. <span title="Unverified: ${unv.join(', ')}">Unverified figures: ${unv.length} (see About).</span>`;
  $('simInputs').innerHTML = `
    <label>Friction, target soil<input id="muT" type="range" min="0.2" max="1" step="0.01" value="${frictionFromSoil(t.traits.soil).toFixed(2)}"><output></output></label>
    <label>Friction, Earth soil<input id="muE" type="range" min="0.2" max="1" step="0.01" value="${frictionFromSoil(h.traits.soil).toFixed(2)}"><output></output></label>
    <label class="chk"><input id="eqMass" type="checkbox"><span>Use equal-wheel-load test mass on Earth (${eq.toFixed(0)} kg = ${par.mass_kg} kg x ${(gT / 9.81).toFixed(2)})</span></label>`;
  $('simInputs').querySelectorAll('input[type=range]').forEach(i => { const o = i.nextElementSibling; o.textContent = (+i.value).toFixed(2); i.oninput = () => { o.textContent = (+i.value).toFixed(2); computeRuns(); updateAll(true); }; });
  $('eqMass').onchange = () => { computeRuns(); updateAll(true); };
  $('fidelity').textContent = 'Fidelity: this is a screening comparison with simplified soil behaviour (a single friction coefficient, no sinkage model). It has not been validated against a real rover. Default friction comes from a placeholder soil class and can be adjusted.';
  $('charts').innerHTML = [['tilt', 'Tilt (deg)'], ['slip', 'Slip (%)'], ['e', 'Energy (J/m)'], ['v', 'Speed (m/s)']].map(([k, l]) => `<div><div class="cl">${l}</div><canvas data-k="${k}"></canvas></div>`).join('');
  $('simStatus').textContent = 'Press Play under the 3D view. Both rovers drive their planned route in lockstep; drag the timeline to scrub.';
  buildHud();
}
function straightRoute(p) { const out = [], a = [START[0] * p.size, START[1] * p.size], b = [GOAL[0] * p.size, GOAL[1] * p.size], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(L / DS)); for (let k = 0; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); return out; }
function planAll() {
  const par = D.rovers.rovers[V.ctx.target.rover];
  V.routes = V.sides.map(s => planRoute(s.patch, par) || straightRoute(s.patch));
}
function computeRuns() {
  const { target: t, hotspot: h } = V.ctx, par = D.rovers.rovers[t.rover], [L, R] = V.sides;
  const muT = +$('muT').value, muE = +$('muE').value, gT = t.gravity, gE = D.meta.gravity.earth;
  const T = analyze(L.patch, V.routes[0], par, { g: gT, mass: par.mass_kg, mu: muT, soil: t.traits.soil });
  const Er = analyze(R.patch, V.routes[1], par, { g: gE, mass: par.mass_kg, mu: muE, soil: h.traits.soil });
  const Eq = analyze(R.patch, V.routes[1], par, { g: gE, mass: par.mass_kg * gT / gE, mu: muE, soil: h.traits.soil });
  const E = $('eqMass').checked ? Eq : Er;
  V.runs = { A: [T, E], T, Er, Eq, ctx: { gTarget: gT, gEarth: gE }, sm: null, verdictShown: false };
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
  V.playing = on; $('playBtn').classList.toggle('playing', on);
  $('playBtn').setAttribute('aria-label', on ? 'Pause' : 'Play'); $('playBtn').querySelector('.lbl').textContent = on ? 'Pause' : 'Play';
  if (on) { $('vpVerdict').classList.add('hidden'); if (V.follow && V.u < 0.02 && !V.chased) goView(true); }
}
function togglePlay() { if (V.u >= 1) { V.u = 0; V.snap = true; V.shown = false; } play(!V.playing); }

/** Move both cameras to the overview, or to a chase view behind each pane's own rover. Animated unless snap. */
function goView(chase, snap) {
  V.chased = chase;
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
  const s = V.sides[i], A = V.runs.A[i], par = D.rovers.rovers[V.ctx.target.rover], ex = V.exag, p = s.patch, half = p.size / 2, U = upsample(p);
  const k = Math.min(A.n - 2, Math.floor(kf)), f = clamp(kf - k, 0, 1), k1 = k + 1;
  const x = A.x[k] + (A.x[k1] - A.x[k]) * f, z = A.z[k] + (A.z[k1] - A.z[k]) * f;
  let dpsi = A.psi[k1] - A.psi[k]; dpsi = Math.atan2(Math.sin(dpsi), Math.cos(dpsi));
  const psi = A.psi[k] + dpsi * f, fx = Math.cos(psi), fz = Math.sin(psi), rx = fz, rz = -fx;
  // plane through the wheel contact points of the rendered surface
  const W = wheelPoints(par); let c = 0, au = 0, bv = 0, su2 = 0, sv2 = 0;
  W.forEach(([u, v]) => { const hh = sampleGrid(U.h, U.M, U.dx, x + u * fx + v * rx, z + u * fz + v * rz); c += hh / W.length; au += hh * u; bv += hh * v; su2 += u * u; sv2 += v * v; });
  const sa = au / su2, sb = bv / sv2, gx = sa * fx + sb * rx, gz = sa * fz + sb * rz;
  _Y.set(-gx * ex, 1, -gz * ex).normalize();
  _v.set(fx, 0, fz); _Z.copy(_v).addScaledVector(_Y, -_v.dot(_Y)).normalize(); _X.crossVectors(_Y, _Z).normalize();
  _m.makeBasis(_X, _Y, _Z); _q.setFromRotationMatrix(_m);
  _t.set(x - half, c * ex, z - half);
  const root = s.rover.root;
  if (snap || !s.pose.init) { root.position.copy(_t); root.quaternion.copy(_q); s.pose.init = true; }
  else { root.position.lerp(_t, 1 - Math.exp(-dt * 16)); root.quaternion.slerp(_q, 1 - Math.exp(-dt * 6)); }   // damped pitch and roll
  if (s.rover.wheels.length) {
    s.rover.wheels.forEach(w => {
      const hh = sampleGrid(U.h, U.M, U.dx, x + w.u * fx + w.v * rx, z + w.u * fz + w.v * rz);
      w.node.position.y = par.wheel_radius_m + (hh - (c + sa * w.u + sb * w.v)) * ex;
    });
  }
  const live = Math.round(kf); s.lineOn.geometry.setDrawRange(0, Math.min(A.n, live + 1));
}
function buildHud() {
  const row = (k, l) => `<div><span>${l}</span><span data-k="${k}">-</span></div>`;
  ['L', 'R'].forEach(sd => { $('hud' + sd).innerHTML = row('time', 'Time') + row('dist', 'Distance') + row('tilt', 'Tilt') + row('slip', 'Slip') + row('e', 'Energy per m') + row('E', 'Energy used'); });
  $('liveCmp').innerHTML = [['tilt', 'Tilt'], ['slip', 'Slip'], ['e', 'Energy per m'], ['time', 'Time']].map(([k, l]) =>
    `<div class="lc-row" data-k="${k}"><span class="lc-t"></span><div class="lc-mid"><label>${l}</label><div class="lc-bar"><i class="a"></i><i class="b"></i></div></div><span class="lc-e"></span></div>`).join('');
}
function updateHud(kf) {
  const A = V.runs.A, k = A.map((a, i) => clamp(Math.round(kf[i]), 0, a.n - 1));
  [['hudL', 0], ['hudR', 1]].forEach(([id, i]) => {
    const a = A[i], q = k[i], set = (key, v) => { const e = $(id).querySelector(`[data-k="${key}"]`); if (e && e.textContent !== v) e.textContent = v; };
    set('time', (a.t[q] / 60).toFixed(1) + ' min'); set('dist', a.s[q].toFixed(0) + ' m'); set('tilt', a.tilt[q].toFixed(1) + '°'); set('slip', a.slip[q].toFixed(0) + ' %'); set('e', a.e[q].toFixed(0) + ' J'); set('E', (a.E[q] / 3600).toFixed(1) + ' Wh');
  });
  const vals = { tilt: [A[0].tilt[k[0]], A[1].tilt[k[1]], v => v.toFixed(1) + '°'], slip: [A[0].slip[k[0]], A[1].slip[k[1]], v => v.toFixed(0) + '%'], e: [A[0].e[k[0]], A[1].e[k[1]], v => v.toFixed(0) + ' J'], time: [A[0].t[k[0]] / 60, A[1].t[k[1]] / 60, v => v.toFixed(1) + ' min'] };
  document.querySelectorAll('#liveCmp .lc-row').forEach(r => {
    const [a, b, fmt] = vals[r.dataset.k], tot = Math.max(1e-9, a + b), sh = (a / tot) * 100;
    r.querySelector('.lc-t').textContent = fmt(a); r.querySelector('.lc-e').textContent = fmt(b);
    r.querySelector('.a').style.width = sh.toFixed(1) + '%'; r.querySelector('.b').style.width = (100 - sh).toFixed(1) + '%';
  });
}
function smooth(a, w = 9) { const o = new Float32Array(a.length), h = w >> 1; for (let i = 0; i < a.length; i++) { let sum = 0, c = 0; for (let k = Math.max(0, i - h); k <= Math.min(a.length - 1, i + h); k++) { sum += a[k]; c++; } o[i] = sum / c; } return o; }
function drawCharts(kf) {
  const run = V.runs; if (!run.sm) run.sm = run.A.map(A => ({ tilt: smooth(A.tilt), slip: smooth(A.slip), e: smooth(A.e), v: smooth(A.v) }));
  document.querySelectorAll('#charts canvas').forEach(c => {
    const key = c.dataset.k, dpr = window.devicePixelRatio || 1, w = c.clientWidth * dpr, h = c.clientHeight * dpr;
    if (!w) return; if (c.width !== w) { c.width = w; c.height = h; }
    const g = c.getContext('2d'); g.clearRect(0, 0, w, h);
    const all = [...run.sm[0][key], ...run.sm[1][key]]; let mx = -Infinity, mn = 0; for (const v of all) if (v > mx) mx = v; if (mx === mn) mx = mn + 1;
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
  const tag = r => r.status === 'match' ? '<span class="tagm ok">match</span>' : r.status === 'mismatch' ? '<span class="tagm no">mismatch</span>' : '<span class="tagm gr">gravity</span>';
  const f = (x, r) => (r.unit === '°' || r.unit === '%' || r.unit === ' min') ? x.toFixed(1) : Math.round(x).toLocaleString();
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
  const ext = clamp(d * 1.25, 45, size * 0.95);
  s.sun.target.position.copy(t); s.sun.position.copy(t).addScaledVector(V.sunV, size * 1.6);
  const sc = s.sun.shadow.camera;
  if (Math.abs(sc.right - ext) > ext * 0.05) { sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 1; sc.far = size * 4; sc.updateProjectionMatrix(); s.sun.shadow.normalBias = ext * 0.0025; }
}

// ---------------------------------------------------------------- frame loop
function frame(now) {
  if (!V.open) return;
  V.raf = requestAnimationFrame(frame);
  const dt = Math.min(0.1, (now - V.last) / 1000); V.last = now;
  if (V.drive) { V.drive.frame(dt, now); return; }   // drive mode owns the canvas while it is active
  const run = V.runs;
  if (run) {
    if (V.playing) {
      V.u += (dt * V.speed) / V.DUR;
      if (V.u >= 1) { V.u = 1; play(false); }
    }
    const kf = run.A.map(A => V.u * (A.n - 1));
    V.sides.forEach((s, i) => poseRover(i, kf[i], dt, V.snap));
    updateHud(kf);
    if (V.playing || V.snap) { if (!V.lastChart || now - V.lastChart > 90 || V.snap) { drawCharts(kf); V.lastChart = now; } }
    $('scrub').value = Math.round(V.u * 1000); $('scrubO').textContent = Math.round(V.u * 100) + ' %';
    if (V.u >= 1 && !run.verdictShown) showVerdict();
    if (V.u < 1 && run.verdictShown) { run.verdictShown = false; $('vpVerdict').classList.add('hidden'); }
  }
  V.sides.forEach((s, i) => updateCamera(i, dt)); V.snap = false;
  linkCameras();
  const c = $('siteCanvas'), w = c.clientWidth, h = c.clientHeight, half = Math.floor(w / 2);
  if (!w || !h) return;
  V.sides.forEach((s, i) => {
    const cam = V.cams[i].camera, x = i ? half + 1 : 0, ww = i ? w - half - 1 : half - 1;
    const asp = ww / h; if (Math.abs(cam.aspect - asp) > 1e-3) { cam.aspect = asp; cam.updateProjectionMatrix(); }
    updateSunShadow(i);
    s.sky.position.copy(cam.position);
    const dist = cam.position.distanceTo(s.rover.root.position), sc = Math.max(0.2, dist * 0.06);
    s.marker.visible = dist > 70; s.marker.scale.set(sc, sc * 2.4, sc); s.marker.position.set(s.rover.root.position.x, s.rover.root.position.y + 2 + sc * 1.2, s.rover.root.position.z);
    V.renderer.setViewport(x, 0, ww, h); V.renderer.setScissor(x, 0, ww, h);
    V.renderer.render(s.scene, cam);
  });
}

/** Called by drive mode when it hands the canvas back: re-place both rovers, routes and markers as Site View expects. */
export function refreshAfterDrive() { V.sides.forEach(s => { s.line.visible = s.lineOn.visible = true; s.pose.init = false; }); V.snap = true; V.last = performance.now(); updateAll(true); V.dirty = -1; }
export function setSitePlaying(on) { play(on); }
export const siteHelpers = { updateGeometryAll: () => V.sides.forEach(updateGeometry) };
