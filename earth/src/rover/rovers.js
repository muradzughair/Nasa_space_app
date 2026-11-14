// Rover state and rover 3D models. One build (registry rover + overrides) is shared by Site View and Drive mode.
// Models are lazy: only the selected rover's GLB is loaded. The loaded template is cached and shared by the two panes (each pane gets a
// clone with its own materials); when another rover is selected the old template and its instances are disposed.
// No per-rover code lives here: everything comes from the registry row and the effective config (rovercfg.js).
import * as THREE from './three.js';
import { ROOT } from './data.js';
import { FALLBACK_REGISTRY } from './fallback.js';
import { loadRegistry, effective, defaultBuild, recall, remember, importBuild, exportBuild, clampOv, CUSTOM_KEYS, COSMETIC_DEFAULT } from './rovercfg.js';

export const R = { reg: null, build: null, cfg: null, listeners: new Set(), templates: new Map(), instances: new Set(), stats: { loaded: 0, disposedGeometries: 0, disposedMaterials: 0, disposedTextures: 0 } };
window.TERRA_ROVERS = R;

export function initRovers(raw, body) {
  R.error = null; R.modelError = null;
  try {
    R.reg = loadRegistry(raw);
    const rec = recall(R.reg); R.recalled = !!rec; R.picked = false;
    setBuild(rec || defaultBuild(R.reg.defaults[body] || R.reg.order[0], R.reg), true);
  } catch (e) {   // init must not abort on a rover failure: use the built-in stand-in rover and say so
    console.error('Rover registry failed, using the built-in stand-in rover', e);
    R.error = `Could not load the rover registry (${e && e.message ? e.message : e}). A simple built-in rover is used.`;
    R.reg = loadRegistry(FALLBACK_REGISTRY); R.recalled = false; R.picked = false;
    setBuild(defaultBuild('fallback', R.reg), true);
  }
}
/** Choose the default rover for a target body when the person has not picked one in this session. */
export function defaultForBody(body) { return R.reg.defaults[body] || R.reg.order[0]; }

const emit = (kind) => R.listeners.forEach(fn => fn(kind, R.cfg));
export const onChange = fn => (R.listeners.add(fn), () => R.listeners.delete(fn));
function setBuild(b, silent) {
  const idChanged = !R.build || R.build.id !== b.id;
  R.build = { id: b.id, ov: { ...(b.ov || {}) }, cos: { ...COSMETIC_DEFAULT, ...(b.cos || {}) } }; R.cfg = effective(R.reg, R.build);
  if (!R.error) remember(R.build); if (!silent) emit(idChanged ? 'rover' : 'config');
}
export const cfgOf = build => effective(R.reg, build);
export function selectRover(id) { if (id === R.build.id) return; setBuild({ id, ov: {}, cos: R.build.cos }); }
export function setOverride(key, value) {
  const row = R.reg.rovers[R.build.id], ov = { ...R.build.ov }, v = clampOv(row, key, value);
  if (Math.abs(v - row.fig[key].value) < 1e-9 * Math.max(1, Math.abs(v))) delete ov[key]; else ov[key] = v;
  setBuild({ ...R.build, ov });
}
export function setCosmetic(key, value) { setBuild({ ...R.build, cos: { ...R.build.cos, [key]: value } }); }
export function resetBuild() { setBuild({ id: R.build.id, ov: {}, cos: { ...COSMETIC_DEFAULT } }); }
export function loadBuildText(text) { setBuild(importBuild(R.reg, text)); }
export const saveBuildText = () => exportBuild(R.build);

// ---------------------------------------------------------------- models
const loader = () => { const L = new THREE.GLTFLoader(); L.setMeshoptDecoder(THREE.MeshoptDecoder); return L; };
function loadTemplate(file) {
  if (!R.templates.has(file)) {
    R.templates.set(file, loader().loadAsync(ROOT + file).then(g => { R.stats.loaded++; return g.scene; }).catch(e => { R.templates.delete(file); throw e; }));
  }
  return R.templates.get(file);
}
function disposeObject(o3, count = true) {
  const seen = new Set();
  o3.traverse(o => {
    if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); if (count) R.stats.disposedGeometries++; }
    for (const m of [].concat(o.material || [])) {
      if (seen.has(m)) continue; seen.add(m); for (const k in m) { const t = m[k]; if (t && t.isTexture && !seen.has(t)) { seen.add(t); t.dispose(); R.stats.disposedTextures++; } }
      m.dispose(); R.stats.disposedMaterials++;
    }
  });
}
/** Dispose every cached template except the one for `keepFile` (called when another rover is selected). Returns how many geometries were freed. */
export async function evictExcept(keepFile) {
  const before = R.stats.disposedGeometries;
  for (const [file, p] of [...R.templates]) if (file !== keepFile) { R.templates.delete(file); try { disposeObject(await p); } catch (e) { /* load failed */ } }
  return R.stats.disposedGeometries - before;
}
/** A plain box with wheels, built from the config's hub positions. Used when the rover model cannot be loaded. */
function boxTemplate(cfg) {
  const g = new THREE.Group(), r = cfg.wheel_radius_model_m || 0.25, w = cfg.wheel_width_model_m || 0.2, hubs = Object.entries(cfg.hub_by_name), zs = hubs.map(h => h[1][0]);
  const body = new THREE.Mesh(new THREE.BoxGeometry((cfg.track_m || 1.4) * 0.8, 0.4, Math.max(1.2, Math.max(...zs) - Math.min(...zs) + 0.9)), new THREE.MeshStandardMaterial({ color: 0xb9bdc6, roughness: 0.7 }));
  body.position.y = r + 0.45; g.add(body);
  const wm = new THREE.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.9 }), wg = new THREE.CylinderGeometry(r, r, w, 20);
  for (const [name, [u, v]] of hubs) { const n = new THREE.Group(), m = new THREE.Mesh(wg, wm); m.rotation.z = Math.PI / 2; n.add(m); n.name = name; n.position.set(v, r, u); g.add(n); }
  return g;
}
export async function createInstance(cfg) {
  R.modelError = null;
  try {
    if (!cfg.model) return buildInstance(cfg, boxTemplate(cfg), true);
    return buildInstance(cfg, await loadTemplate(cfg.model), false);
  } catch (e) {   // a model that fails to load (missing file, decoder, bad wheel nodes) must not take Site View down
    console.error('Rover model failed', e);
    R.modelError = `Could not load the rover model (${cfg.model}): ${e && e.message ? e.message : e}. A simple box rover is shown instead.`;
    return buildInstance(cfg, boxTemplate(cfg), true);
  }
}
function buildInstance(cfg, tmpl, own) {
  const model = tmpl.clone(true), root = new THREE.Group(), lift = new THREE.Group(), mats = [];
  const isWheel = o => /^wheel_\d\d_[LR]$/.test(o.name);
  model.traverse(o => { if (o.isMesh) { o.castShadow = true; let w = o; while (w && !isWheel(w)) w = w.parent; o.userData.isWheelPart = !!w; o.material = Array.isArray(o.material) ? o.material.map(m => m.clone()) : o.material.clone(); for (const m of [].concat(o.material)) { if (m.metalness > 0.35) m.metalness = 0.35;   /* no environment map in the scenes, so strong metals render black */ m.userData.base = m.color ? m.color.clone() : null; mats.push([m, o.userData.isWheelPart]); } } });
  lift.add(model); root.add(lift); lift.scale.setScalar(cfg.model_scale);
  const inst = { root, lift, model, mats, cfg: null, wheels: [], file: cfg.model, decal: null, extra: [], own, dispose() { disposeInstance(inst); } };
  const nodes = {}; cfg.wheel_nodes.forEach(n => { nodes[n] = model.getObjectByName(n); });
  inst.nodes = nodes; inst.y0 = {}; for (const n in nodes) if (nodes[n]) inst.y0[n] = nodes[n].position.y;
  R.instances.add(inst); updateInstance(inst, cfg); return inst;
}
/** Apply an effective config to an instance: wheel size and width, wheel count (hide or duplicate), ride height, cosmetics. */
export function updateInstance(inst, cfg) {
  inst.cfg = cfg;
  const kr = cfg.wheel_radius_m / cfg.wheel_radius_model_m, kw = cfg.wheel_width_m / cfg.wheel_width_model_m;
  inst.lift.position.y = cfg.wheel_radius_m - cfg.wheel_radius_model_m;       // wheels grow about their hubs, so the whole rover rises or sinks by the change in radius
  inst.extra.forEach(n => n.parent && n.parent.remove(n)); inst.extra = [];
  const six = cfg.n_wheels === 6, hasMid = cfg.wheel_nodes.some(n => n.startsWith('wheel_02_'));
  for (const name of cfg.wheel_nodes) {
    const node = inst.nodes[name]; if (!node) continue;
    node.visible = !(name.startsWith('wheel_02_') && !six && hasMid);
    node.scale.set(kw, kr, kr);
  }
  if (six && !hasMid) {              // a 4-wheel model asked for 6 wheels: duplicate the front wheels at the middle row
    for (const side of ['L', 'R']) { const src = inst.nodes['wheel_01_' + side]; if (!src) continue; const c = src.clone(); c.name = 'wheel_02_' + side; c.position.z = 0; src.parent.add(c); inst.extra.push(c); inst.nodes[c.name] = c; inst.y0[c.name] = c.position.y; }
  }
  // wheel list for posing: one entry per active hub, with its forward and right offsets from the effective config
  inst.wheels = Object.keys(cfg.hub_by_name).filter(n => inst.nodes[n]).map(n => ({ node: inst.nodes[n], name: n, u: cfg.hub_by_name[n][0], v: cfg.hub_by_name[n][1], y0: inst.y0[n] }));
  // cosmetics
  const tint = new THREE.Color(cfg.cos.color), dust = new THREE.Color(0.62, 0.5, 0.38), d = cfg.cos.dust;
  for (const [m, wheelPart] of inst.mats) {
    if (!m.userData.base) continue;
    m.color.copy(m.userData.base); if (!wheelPart) m.color.multiply(tint); if (d > 0) m.color.lerp(dust, 0.65 * d);
  }
  setDecal(inst, cfg);
}
function setDecal(inst, cfg) {
  if (inst.decal) { inst.decal.parent && inst.decal.parent.remove(inst.decal); inst.decal.material.map.dispose(); inst.decal.material.dispose(); inst.decal.geometry.dispose(); inst.decal = null; }
  const txt = cfg.cos.decal; if (!txt) return;
  const c = document.createElement('canvas'); c.width = 256; c.height = 160; const g = c.getContext('2d');
  g.fillStyle = '#f4f4f0'; g.fillRect(0, 0, 256, 160); g.strokeStyle = '#1b1f27'; g.lineWidth = 8; g.strokeRect(4, 4, 248, 152); g.fillStyle = '#1b1f27'; g.font = 'bold 110px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 128, 88);
  const tex = new THREE.CanvasTexture(c), mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.31), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
  const zs = cfg.wheel_pts.map(p => p[0]); mesh.position.set(0, 0.95, Math.min(...zs) - 0.62); mesh.rotation.y = Math.PI;   // a number plate on the rear, visible from the chase camera
  inst.model.add(mesh); inst.decal = mesh;
}
function disposeInstance(inst) {
  R.instances.delete(inst); inst.root.parent && inst.root.parent.remove(inst.root);
  for (const [m] of inst.mats) { m.dispose(); R.stats.disposedMaterials++; }
  if (inst.own) inst.model.traverse(o => { if (o.geometry) { o.geometry.dispose(); R.stats.disposedGeometries++; } });   // box rovers own their geometry; model geometry is shared with the cached template
  if (inst.decal) { inst.decal.material.map.dispose(); inst.decal.material.dispose(); inst.decal.geometry.dispose(); }
}
export { CUSTOM_KEYS };
