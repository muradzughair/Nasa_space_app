// Realistic Earth globe on the vendored Three.js: day texture with ocean depth shading, relief bump, specular ocean, thin country borders,
// ocean/continent/country labels, atmosphere glow, local starfield, a heat-map overlay layer (toggle, opacity, cross-fade),
// numbered hotspot markers with hover tooltips, and an eased camera fly-to. No network access: every texture is a local file.
import * as THREE from '../vendor/three-bundle.js';
import { D, ROOT } from './data.js';

const STOPS = [[0, [34, 52, 84]], [0.25, [40, 110, 160]], [0.5, [46, 196, 182]], [0.75, [255, 209, 102]], [1, [255, 107, 53]]];
export function ramp(t) {
  t = Math.max(0, Math.min(1, t));
  for (let i = 1; i < STOPS.length; i++) {
    if (t <= STOPS[i][0]) {
      const [t0, c0] = STOPS[i - 1], [t1, c1] = STOPS[i], f = (t - t0) / (t1 - t0);
      return c0.map((v, k) => Math.round(v + (c1[k] - v) * f));
    }
  }
  return STOPS[STOPS.length - 1][1];
}

const RAD = Math.PI / 180;
/** Unit-sphere position for lat/lon, matching the UV layout of THREE.SphereGeometry with an equirectangular map. */
export function ll2v(lat, lon, r = 1) { const la = lat * RAD, lo = lon * RAD; return new THREE.Vector3(r * Math.cos(la) * Math.cos(lo), r * Math.sin(la), -r * Math.cos(la) * Math.sin(lo)); }
export function v2ll(v) { const n = v.clone().normalize(); return { lat: Math.asin(n.y) / RAD, lon: Math.atan2(-n.z, n.x) / RAD }; }

export const motion = { scale: 1 };   // 1 normally, small when the user prefers reduced motion (set by main.js)
export const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth01 = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

const OCEANS = [['Pacific Ocean', 5, -150], ['North Pacific Ocean', 28, -150], ['South Pacific Ocean', -28, -125], ['Atlantic Ocean', 8, -32], ['North Atlantic Ocean', 33, -42], ['South Atlantic Ocean', -22, -14],
  ['Indian Ocean', -14, 80], ['Arctic Ocean', 86, 40], ['Southern Ocean', -62, 40], ['North Pacific Ocean', 30, 172]];
const CONTINENTS = [['Africa', 5, 20], ['Europe', 52, 16], ['Asia', 47, 92], ['North America', 46, -102], ['South America', -14, -60], ['Oceania', -24, 134], ['Antarctica', -82, 20]];

function loadTex(loader, url, srgb, aniso) {
  return new Promise((res, rej) => loader.load(url, t => { if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; t.needsUpdate = true; res(t); }, undefined, () => rej(new Error('missing ' + url))));
}

function atmosphereMaterial(color, power, strength, back) {
  return new THREE.ShaderMaterial({
    uniforms: { c: { value: new THREE.Color(color) }, p: { value: power }, s: { value: strength } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: back
      ? 'uniform vec3 c; uniform float p; uniform float s; varying vec3 vN; varying vec3 vV; void main(){ float k = pow(max(0., 0.78 - abs(dot(vN, vV))), p) * s; gl_FragColor = vec4(c * k, k); }'
      : 'uniform vec3 c; uniform float p; uniform float s; varying vec3 vN; varying vec3 vV; void main(){ float k = pow(1.0 - max(0., dot(vN, vV)), p) * s; gl_FragColor = vec4(c * k, k); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: back ? THREE.BackSide : THREE.FrontSide,
  });
}

function makeStars(n = 3200) {
  let a = 1234567;
  const rnd = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, r = Math.sqrt(1 - u * u), R = 80;
    pos.set([R * r * Math.cos(th), R * u, R * r * Math.sin(th)], i * 3);
    const b = Math.pow(rnd(), 3.2) * 0.85 + 0.12, tint = rnd();
    col.set([b * (0.85 + 0.15 * tint), b * (0.9 + 0.05 * tint), b * (1.0 - 0.12 * tint)], i * 3);
    size[i] = 1.0 + Math.pow(rnd(), 6) * 2.4;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setAttribute('size', new THREE.BufferAttribute(size, 1));
  const m = new THREE.ShaderMaterial({
    uniforms: { px: { value: Math.min(window.devicePixelRatio || 1, 2) } },
    vertexShader: 'attribute float size; attribute vec3 color; varying vec3 vC; uniform float px; void main(){ vC = color; gl_PointSize = size * px; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'varying vec3 vC; void main(){ vec2 d = gl_PointCoord - .5; float a = smoothstep(.5, .1, length(d)); gl_FragColor = vec4(vC, a); }',
    transparent: true, depthWrite: false,
  });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false;
  return pts;
}

export function createGlobe(el, { onPick, onHover }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x03050a, 1);
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;outline:none';
  renderer.domElement.setAttribute('aria-label', 'Interactive globe. Drag to rotate, scroll to zoom.');
  el.appendChild(renderer.domElement);
  const overlay = document.createElement('div'); overlay.className = 'g-overlay'; el.appendChild(overlay);
  const tip = document.createElement('div'); tip.className = 'gtip hidden'; overlay.appendChild(tip);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.02, 300);
  const DEFAULT_VIEW = { lat: 20, lon: 15, dist: 3.9 };
  const setCam = (lat, lon, dist) => { camera.position.copy(ll2v(lat, lon, dist)); camera.lookAt(0, 0, 0); };
  setCam(DEFAULT_VIEW.lat, DEFAULT_VIEW.lon, DEFAULT_VIEW.dist);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enablePan: false, enableDamping: true, dampingFactor: 0.09, minDistance: 1.12, maxDistance: 7, zoomSpeed: 0.7, rotateSpeed: 0.8 });

  // lights follow the camera so the visible hemisphere is always lit (a data tool, not a day/night view)
  const amb = new THREE.AmbientLight(0xcfe0ff, 1.55), sun = new THREE.DirectionalLight(0xfff6e8, 2.4);
  scene.add(amb, sun, sun.target);
  scene.add(makeStars());

  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 160, 96), new THREE.MeshPhongMaterial({ color: 0x8c8c8c, specular: new THREE.Color(0x3a4a5e), shininess: 22 }));
  scene.add(earth);
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.012, 96, 48), atmosphereMaterial(0x6aa8ff, 2.6, 0.9, false)));   // thin bright rim
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.16, 96, 48), atmosphereMaterial(0x4a86ff, 4.0, 2.0, true)));     // outer glow

  // ---- heat map overlay: two layers for cross-fading, each a transparent sphere with its own colour map + alpha map
  const layers = [0, 1].map(() => {
    const m = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1.004, 128, 64), m); mesh.renderOrder = 2; mesh.visible = false; scene.add(mesh);
    return { mesh, m, cur: 0, from: 0, to: 0, t0: 0, dur: 1 };
  });
  let front = 0, heatOn = true, heatOpacity = 0.8, landMask = null;
  const fade = (L, to, ms) => { L.from = L.cur; L.to = to; L.t0 = performance.now(); L.dur = Math.max(1, ms * motion.scale); };

  // ---- borders and labels
  const labelsEl = [];
  let bordersMesh = null, labelsOn = true;
  const addLabel = (text, lat, lon, cls, rank = 0) => {
    const e = document.createElement('div'); e.className = 'glabel ' + cls; e.textContent = text; overlay.appendChild(e);
    labelsEl.push({ e, v: ll2v(lat, lon, 1.0), cls, rank, text, w: 0, h: 0 });
  };
  OCEANS.forEach(([n, la, lo]) => addLabel(n, la, lo, 'ocean'));
  CONTINENTS.forEach(([n, la, lo]) => addLabel(n, la, lo, 'cont'));

  async function loadBorders() {
    const gj = await (await fetch(ROOT + 'assets/images/earth/countries.geojson')).json();
    const seg = [], countries = [];
    const slerpPts = (a, b) => {   // subdivide so long straight edges follow the sphere
      const A = ll2v(a[1], a[0]), B = ll2v(b[1], b[0]), ang = A.angleTo(B), n = Math.max(1, Math.ceil(ang / (1.5 * RAD))), out = [];
      for (let k = 0; k <= n; k++) { const v = A.clone().lerp(B, k / n).normalize(); out.push(v); }
      return out;
    };
    for (const f of gj.features) {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      let best = null, bestA = -1;
      for (const poly of polys) {
        for (const ring of poly) for (let i = 1; i < ring.length; i++) {
          if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) continue;
          const pts = slerpPts(ring[i - 1], ring[i]);
          for (let k = 1; k < pts.length; k++) { const p = pts[k - 1], q = pts[k]; seg.push(p.x * 1.006, p.y * 1.006, p.z * 1.006, q.x * 1.006, q.y * 1.006, q.z * 1.006); }
        }
        const ex = poly[0]; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, sx = 0, sy = 0;
        for (const [x, y] of ex) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); sx += x; sy += y; }
        const area = (x1 - x0) * (y1 - y0) * Math.cos(((y0 + y1) / 2) * RAD);
        if (area > bestA) { bestA = area; best = { lon: (x0 + x1) / 2 * 0.5 + (sx / ex.length) * 0.5, lat: (y0 + y1) / 2 * 0.5 + (sy / ex.length) * 0.5, area }; }
      }
      if (best && f.properties.NAME) countries.push({ name: f.properties.NAME, ...best });
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    bordersMesh = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42, depthWrite: false }));
    bordersMesh.renderOrder = 4; scene.add(bordersMesh);
    countries.sort((a, b) => b.area - a.area).forEach((c, i) => addLabel(c.name, c.lat, c.lon, 'country', i));
  }

  // ---- textures
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const tl = new THREE.TextureLoader();
  const A = ROOT + 'assets/images/earth/';
  const missing = [];
  const ready = (async () => {
    const tryLoad = async (name, srgb) => { try { return await loadTex(tl, A + name, srgb, aniso); } catch (e) { missing.push(name); return null; } };
    const [day, topo, water] = await Promise.all([tryLoad('earth_day.jpg', true), tryLoad('earth_topology.png', false), tryLoad('earth_water.png', false)]);
    const m = earth.material;
    if (day) { m.map = day; m.color.set(0xffffff); } else m.color.set(0x1d3a5f);
    if (topo) { m.bumpMap = topo; m.bumpScale = 5; }
    if (water) { m.specularMap = water; }
    m.needsUpdate = true;
    // land mask at overlay resolution, from the water map (white = water), so the heat map never colours the sea
    try {
      const img = water ? water.image : null;
      if (img) {
        const c = document.createElement('canvas'); c.width = 2048; c.height = 1024; const g = c.getContext('2d'); g.drawImage(img, 0, 0, 2048, 1024);
        const d = g.getImageData(0, 0, 2048, 1024).data; landMask = new Uint8Array(2048 * 1024);
        for (let i = 0; i < landMask.length; i++) landMask[i] = 255 - d[i * 4];
      }
    } catch (e) { /* mask optional */ }
    await loadBorders().catch(() => missing.push('countries.geojson'));
    if (last) paintHeat(...last, true);
    return { missing };
  })();

  // ---- heat map painting
  const small = document.createElement('canvas'), smallA = document.createElement('canvas');
  small.width = smallA.width = D.meta.nlon; small.height = smallA.height = D.meta.nlat;
  const bigC = document.createElement('canvas'), bigA = document.createElement('canvas'); bigC.width = bigA.width = 2048; bigC.height = bigA.height = 1024;
  let last = null, timer = null;

  function paintHeat(vals, sea255, instant) {
    const { nlon, nlat } = D.meta, N = D.N, isSea = i => (sea255 ? vals[i] === 255 : vals[i] < 0);
    let mn = 1e9, mx = -1;
    for (let i = 0; i < N; i++) if (!isSea(i)) { if (vals[i] < mn) mn = vals[i]; if (vals[i] > mx) mx = vals[i]; }
    const span = Math.max(1e-6, mx - mn), col = new Float32Array(N * 3), have = new Uint8Array(N), alpha = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      if (isSea(i)) continue;
      const t = (vals[i] - mn) / span, c = ramp(Math.pow(t, 1.25));
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; have[i] = 1; alpha[i] = Math.round(255 * (0.3 + 0.7 * Math.pow(t, 0.85)));
    }
    for (let pass = 0; pass < 5; pass++) {   // push land colours into neighbouring sea cells so coast pixels do not blend with black
      const nh = have.slice(), nc = col.slice();
      for (let i = 0; i < nlat; i++) for (let j = 0; j < nlon; j++) {
        const k = i * nlon + j; if (have[k]) continue;
        let r = 0, g = 0, b = 0, n = 0;
        for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
          const ii = i + di, jj = (j + dj + nlon) % nlon; if (ii < 0 || ii >= nlat) continue;
          const q = ii * nlon + jj; if (have[q]) { r += col[q * 3]; g += col[q * 3 + 1]; b += col[q * 3 + 2]; n++; }
        }
        if (n) { nh[k] = 1; nc[k * 3] = r / n; nc[k * 3 + 1] = g / n; nc[k * 3 + 2] = b / n; }
      }
      have.set(nh); col.set(nc);
    }
    const ic = small.getContext('2d').createImageData(nlon, nlat), ia = smallA.getContext('2d').createImageData(nlon, nlat);
    for (let i = 0; i < N; i++) {
      const o = i * 4; ic.data[o] = col[i * 3] || 12; ic.data[o + 1] = col[i * 3 + 1] || 20; ic.data[o + 2] = col[i * 3 + 2] || 34; ic.data[o + 3] = 255;
      ia.data[o] = ia.data[o + 1] = ia.data[o + 2] = alpha[i]; ia.data[o + 3] = 255;
    }
    small.getContext('2d').putImageData(ic, 0, 0); smallA.getContext('2d').putImageData(ia, 0, 0);
    for (const [src, dst] of [[small, bigC], [smallA, bigA]]) { const g = dst.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, 2048, 1024); }
    if (landMask) {   // clip to the real coastline
      const g = bigA.getContext('2d'), d = g.getImageData(0, 0, 2048, 1024), px = d.data;
      for (let i = 0; i < landMask.length; i++) { const v = (px[i * 4] * landMask[i]) / 255; px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v; }
      g.putImageData(d, 0, 0);
    }
    const nf = 1 - front, L = layers[nf], O = layers[front];
    const mk = cv => { const t = new THREE.CanvasTexture(copyCanvas(cv)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
    if (L.m.map) L.m.map.dispose(); if (L.m.alphaMap) L.m.alphaMap.dispose();
    L.m.map = mk(bigC); L.m.alphaMap = mk(bigA); L.m.alphaMap.colorSpace = THREE.NoColorSpace; L.m.needsUpdate = true; L.mesh.visible = true;
    fade(L, heatOn ? 1 : 0, instant ? 1 : 450); fade(O, 0, instant ? 1 : 450);
    front = nf;
    document.getElementById('lgLow').textContent = `lower (${Math.round(mn)})`;
    document.getElementById('lgHigh').textContent = `best match (${Math.round(mx)})`;
  }
  function copyCanvas(cv) { const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; c.getContext('2d').drawImage(cv, 0, 0); return c; }

  /** vals: Float32Array/Uint8Array of scores, negative or 255 = sea. Debounced so slider drags stay smooth. */
  function setHeat(vals, sea255, instant) {
    last = [vals, sea255]; clearTimeout(timer);
    timer = setTimeout(() => paintHeat(vals, sea255, instant), instant ? 0 : 50);
  }
  function setHeatVisible(on) { heatOn = !!on; fade(layers[front], heatOn ? 1 : 0, 300); }
  function setHeatOpacity(v) { heatOpacity = v; }
  function setLabelsVisible(on) { labelsOn = !!on; if (bordersMesh) bordersMesh.visible = labelsOn; }

  // ---- markers
  let markers = [], hoverId = null, selectedId = null;
  function showTip(m) { tip.innerHTML = `<b>${m.h.name}</b><span>${Math.round(m.h.score)}/100 &middot; rank ${m.h.rank}</span>`; tip.classList.remove('hidden'); hoverId = m.h.id; }
  function hideTip() { tip.classList.add('hidden'); hoverId = null; }
  function setMarkers(list) {
    markers.forEach(m => m.e.remove()); markers = [];
    list.forEach(h => {
      const e = document.createElement('button'); e.className = 'mk'; e.textContent = h.rank; e.dataset.id = h.id;
      e.setAttribute('aria-label', `Hotspot ${h.rank}: ${h.name}, score ${Math.round(h.score)} of 100. Open in 3D.`);
      e.onclick = () => onPick(h); e.onmouseenter = () => { showTip({ h }); onHover(h, true); }; e.onmouseleave = () => { hideTip(); onHover(h, false); };
      e.onfocus = e.onmouseenter; e.onblur = e.onmouseleave;
      overlay.appendChild(e); markers.push({ e, h, v: ll2v(h.lat, h.lon, 1.012) });
    });
  }
  function highlight(id, on) {
    markers.forEach(m => { if (m.h.id === id) { m.e.classList.toggle('hl', on); if (on) showTip(m); else hideTip(); } });
  }
  function select(id) { selectedId = id; markers.forEach(m => m.e.classList.toggle('sel', m.h.id === id)); }

  // ---- camera: views and eased fly-to
  const dist = () => camera.position.length();
  function getView() { const ll = v2ll(camera.position); return { lat: ll.lat, lon: ll.lon, dist: dist() }; }
  let fly = null;
  function flyTo(view, ms = 1200, onProgress) {
    return new Promise(resolve => {
      if (fly) fly.resolve(false);
      const from = camera.position.clone(), fd = from.length(), to = ll2v(view.lat, view.lon, 1), td = view.dist ?? fd;
      const q0 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), from.clone().normalize()), q1 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), to);
      fly = { t0: performance.now(), dur: Math.max(1, ms * motion.scale), q0, q1, fd, td, resolve, onProgress };
      controls.enabled = false;
    });
  }
  function stepFly(now) {
    if (!fly) return;
    const f = Math.min(1, (now - fly.t0) / fly.dur), e = ease(f);
    const q = fly.q0.clone().slerp(fly.q1, e), d = fly.fd + (fly.td - fly.fd) * e;
    camera.position.set(0, 0, 1).applyQuaternion(q).multiplyScalar(d); camera.up.set(0, 1, 0); camera.lookAt(0, 0, 0);
    if (fly.onProgress) fly.onProgress(f, e);
    if (f >= 1) { const r = fly.resolve; fly = null; controls.enabled = true; controls.update(); r(true); }
  }

  // ---- per-frame overlay (labels, markers) and loop
  const _p = new THREE.Vector3(), _cam = new THREE.Vector3();
  let W = 1, H = 1, raf = 0, running = false, lastT = performance.now();
  function project(v) { _p.copy(v).project(camera); return [(_p.x * 0.5 + 0.5) * W, (-_p.y * 0.5 + 0.5) * H, _p.z]; }
  function updateOverlay() {
    const d = dist(); _cam.copy(camera.position);
    const oceanA = labelsOn ? smooth01(1.55, 2.3, d) : 0, countryA = labelsOn ? 1 - smooth01(1.9, 2.4, d) : 0;
    const limit = d > 2.4 ? 0 : Math.round(8 + (2.4 - d) * 70);   // more country names as the camera gets closer
    const boxes = [];
    for (const L of labelsEl) {
      let a = L.cls === 'country' ? (L.rank < limit ? countryA : 0) : oceanA;
      let x = 0, y = 0;
      if (a > 0.01) {
        const facing = L.v.dot(_cam) / d; a *= smooth01(0.12, 0.4, facing);
        if (a > 0.01) {
          [x, y] = project(L.v);
          if (!L.w) { L.w = L.e.offsetWidth; L.h = L.e.offsetHeight; }
          const bx = [x - L.w / 2, y - L.h / 2, x + L.w / 2, y + L.h / 2];
          if (L.cls === 'country' && boxes.some(b => bx[0] < b[2] + 6 && bx[2] > b[0] - 6 && bx[1] < b[3] + 3 && bx[3] > b[1] - 3)) a = 0; else boxes.push(bx);
        }
      }
      if (a <= 0.01) { if (L.vis) { L.e.style.opacity = 0; L.vis = false; } continue; }
      L.vis = true; L.e.style.opacity = a.toFixed(2); L.e.style.transform = `translate(${(x - L.w / 2).toFixed(1)}px,${(y - L.h / 2).toFixed(1)}px)`;
    }
    for (const m of markers) {
      const facing = m.v.dot(_cam) / d, vis = facing > 1 / d + 0.02;   // point is on the visible hemisphere
      if (!vis) { m.e.style.visibility = 'hidden'; if (hoverId === m.h.id) hideTip(); continue; }
      const [x, y] = project(m.v); m.e.style.visibility = 'visible'; m.e.style.left = x + 'px'; m.e.style.top = y + 'px';
      if (hoverId === m.h.id) { tip.style.left = x + 'px'; tip.style.top = y + 'px'; }
    }
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - lastT) / 1000); lastT = now;
    stepFly(now);
    const dd = dist(); controls.rotateSpeed = 0.18 + 0.7 * Math.min(1, (dd - 1.1) / 2.2);
    if (!fly) controls.update();
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    sun.position.copy(camera.position).addScaledVector(right, -1.1).addScaledVector(up, 0.9);
    // heat layer opacity tweens
    for (const L of layers) {
      const f = Math.min(1, (now - L.t0) / L.dur); L.cur = L.from + (L.to - L.from) * (f * f * (3 - 2 * f));
      L.m.opacity = L.cur * heatOpacity; if (L.cur < 0.002 && L.to === 0) L.mesh.visible = false;
    }
    if (bordersMesh) bordersMesh.material.opacity = 0.3 + 0.35 * (1 - smooth01(1.3, 3.2, dd));
    updateOverlay();
    renderer.render(scene, camera);
  }
  function start() { if (running) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  function size() { W = el.clientWidth || 1; H = el.clientHeight || 1; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }
  new ResizeObserver(size).observe(el); size(); start();

  return {
    ready, setHeat, setMarkers, highlight, select, setHeatVisible, setHeatOpacity, setLabelsVisible, flyTo, getView, defaultView: DEFAULT_VIEW,
    resetView: () => flyTo(DEFAULT_VIEW, 900), start, stop, camera, controls, scene, renderer, missing, isFlying: () => !!fly,
    redraw: () => last && setHeat(last[0], last[1], true),
  };
}
