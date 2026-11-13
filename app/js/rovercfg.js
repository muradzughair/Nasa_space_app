// Rover registry and the effective rover config. Pure logic, no DOM, no 3D.
// assets/models/rovers.json holds one row of data per rover. A "build" is { id, ov: {overrides}, cos: {cosmetic} }.
// effective(reg, build) returns the one flat object that drive.js, sim.js, soilmech.js and the views read. Nothing else reads the registry.

export const KEYS = ['mass_kg', 'wheel_count', 'wheel_radius_m', 'wheel_width_m', 'top_speed_ms', 'motor_power_w', 'battery_wh', 'base_power_w', 'ground_clearance_m', 'max_slope_deg'];
export const CUSTOM_KEYS = ['mass_kg', 'wheel_count', 'wheel_radius_m', 'wheel_width_m', 'motor_power_w', 'battery_wh', 'top_speed_ms'];
export const LABEL = { mass_kg: 'Mass', wheel_count: 'Wheel count', wheel_radius_m: 'Wheel radius', wheel_width_m: 'Wheel width', top_speed_ms: 'Top speed', motor_power_w: 'Motor power', battery_wh: 'Battery', base_power_w: 'Base power', ground_clearance_m: 'Ground clearance', max_slope_deg: 'Slope limit', drive_force_max_N: 'Drive force', drive_efficiency: 'Drive efficiency' };
export const UNIT = { mass_kg: 'kg', wheel_count: '', wheel_radius_m: 'm', wheel_width_m: 'm', top_speed_ms: 'm/s', motor_power_w: 'W', battery_wh: 'Wh', base_power_w: 'W', ground_clearance_m: 'm', max_slope_deg: 'deg', drive_force_max_N: 'N', drive_efficiency: '' };
export const COSMETIC_DEFAULT = { color: '#ffffff', dust: 0, decal: '' };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/** Resolve inherit and derived figures into plain rows. Returns { rovers: {id: row}, order: [ids], raw }. */
export function loadRegistry(raw) {
  const G = raw.gravity_mps2, rovers = {}, order = [];
  const resolve = id => {
    if (rovers[id]) return rovers[id];
    const src = raw.rovers.find(r => r.id === id); if (!src) throw new Error('unknown rover ' + id);
    const base = src.inherit ? resolve(src.inherit) : null;
    const row = { ...(base || {}), ...src, fig: { ...(base ? base.fig : {}) } };
    for (const [k, v] of Object.entries(src.fig || {})) row.fig[k] = { ...v };
    for (const [k, v] of Object.entries(src.fig_override || {})) {
      if (v.derive_from) {
        const [rid, fk] = v.derive_from.split('.'), o = resolve(rid).fig[fk], f = v.scale.split('/').map(s => G[s.replace('g_', '')]);
        row.fig[k] = { value: +(o.value * f[0] / f[1]).toFixed(1), unit: v.unit, source_id: v.source_id, verified: false, derived: true, note: `derived from ${rid} ${fk}` };
      } else row.fig[k] = { ...v };
    }
    row.limits = raw.limits[row.planet];
    rovers[id] = row; return row;
  };
  raw.rovers.forEach(r => { resolve(r.id); order.push(r.id); });
  return { rovers, order, raw, soils: raw.soils, sources: raw.sources, G, defaults: raw.defaults_by_body };
}

export const defaultBuild = (id, reg) => ({ id: id in reg.rovers ? id : reg.order[0], ov: {}, cos: { ...COSMETIC_DEFAULT } });

/** Clamp an override value to the planet's realistic range. */
export function clampOv(row, key, v) {
  const lim = row.limits?.[key]; if (!lim || !Number.isFinite(+v)) return +v;
  v = clamp(+v, lim[0], lim[1]); return key === 'wheel_count' ? (v >= 5 ? 6 : 4) : v;
}

/** Effective config = registry rover + clamped user overrides. */
export function effective(reg, build) {
  const row = reg.rovers[build.id], ov = {}, changed = [];
  for (const k of CUSTOM_KEYS) {
    const base = row.fig[k].value;
    if (build.ov && build.ov[k] != null) { const v = clampOv(row, k, build.ov[k]); if (Math.abs(v - base) > 1e-9 * Math.max(1, Math.abs(base))) { ov[k] = v; changed.push(k); } }
  }
  const val = k => (k in ov ? ov[k] : row.fig[k].value), g = row.geometry;
  const n = val('wheel_count'), r = val('wheel_radius_m'), r0 = row.fig.wheel_radius_m.value, P = val('motor_power_w'), v = val('top_speed_ms');
  const F0 = row.fig.drive_force_max_N.value, P0 = row.fig.motor_power_w.value, v0 = row.fig.top_speed_ms.value;
  // wheel hub positions [forward, right] for the active wheels: the model's six hubs, middle pair dropped for 4 wheels, middle pair added for 6 on a 4-wheel model
  const hasMid = g.hubs.length === 6;
  const hubMap = {};   // active wheel hubs by node name: [forward, right]
  for (const h of g.hubs) if (!(n === 4 && hasMid && /wheel_02_/.test(h.name))) hubMap[h.name] = [h.u, h.v];
  if (n === 6 && !hasMid) { const m = g.mid_wheel_x_m || g.track_m / 2 * 1.1; hubMap.wheel_02_L = [0, m]; hubMap.wheel_02_R = [0, -m]; }
  const pts = Object.values(hubMap);
  const fig = {};
  for (const k of [...KEYS, 'drive_force_max_N', 'drive_efficiency']) fig[k] = { ...row.fig[k], ...(k in ov ? { value: ov[k], source_id: 'user', verified: false, user: true } : {}) };
  const Fmax = F0 * (P / P0) * (v0 / v);   // assumption: same gearing family, drive force follows motor power, and falls with a higher top speed (gear)
  fig.drive_force_max_N = { ...fig.drive_force_max_N, value: Fmax, ...(changed.some(k => k === 'motor_power_w' || k === 'top_speed_ms') ? { source_id: 'user', verified: false, user: true, note: 'scaled from the preset: proportional to motor power, inversely to top speed' } : {}) };
  fig.ground_clearance_m = { ...fig.ground_clearance_m, value: Math.max(0.05, row.fig.ground_clearance_m.value + (r - r0)), ...(r !== r0 ? { note: 'preset clearance plus the change in wheel radius' } : {}) };
  const cfg = {
    id: row.id, name: row.display_name, mission: row.mission, planet: row.planet, kind: changed.length ? 'custom' : row.badge, changed, base_badge: row.badge,
    // flat names read by drive.js, sim.js and soilmech.js
    mass_kg: val('mass_kg'), n_wheels: n, wheel_radius_m: r, wheel_width_m: val('wheel_width_m'), max_speed_mps: v, drive_power_max_W: P, battery_wh: val('battery_wh'),
    base_power_W: row.fig.base_power_w.value, drive_force_max_N: Fmax, drive_efficiency: row.fig.drive_efficiency.value, slope_limit_deg: row.fig.max_slope_deg.value,
    ground_clearance_m: fig.ground_clearance_m.value, wheelbase_m: g.wheelbase_m, track_m: g.track_m, mid_wheel_x_m: g.mid_wheel_x_m || g.track_m / 2 * 1.1, wheel_pts: pts, hub_by_name: hubMap,
    model: row.model_file, model_scale: row.model_scale || 1, wheel_nodes: row.wheel_node_names, wheel_radius_model_m: g.wheel_radius_model_m, wheel_width_model_m: g.wheel_width_model_m,
    model_dims: [g.model_width_m, g.model_height_m, g.model_length_m], fig, note: row.note || '', cos: { ...COSMETIC_DEFAULT, ...(build.cos || {}) },
  };
  return cfg;
}

/** "assumed" tag for a figure: true when it is not verified. title names the source or says there is none. */
export function tag(reg, f) {
  const s = reg.sources[f.source_id];
  return { assumed: !f.verified, user: !!f.user, derived: !!f.derived, title: f.user ? 'Set by you (custom build), no source' : (s ? `${s.label}${f.note ? ' - ' + f.note : ''}` : 'no source') };
}

export const gravityOf = (reg, body) => reg.G[body];

// ---- save, load, remember
export function exportBuild(build) { return JSON.stringify({ app: 'TerraAnalog rover build', version: 1, id: build.id, overrides: build.ov, cosmetic: build.cos }, null, 1); }
export function importBuild(reg, text) {
  let j; try { j = JSON.parse(text); } catch (e) { throw new Error('Not a JSON file'); }
  if (!j || j.app !== 'TerraAnalog rover build' || !(j.id in reg.rovers)) throw new Error('Not a TerraAnalog rover build, or the rover is unknown');
  const row = reg.rovers[j.id], ov = {};
  for (const k of CUSTOM_KEYS) if (j.overrides && Number.isFinite(+j.overrides[k])) ov[k] = clampOv(row, k, j.overrides[k]);
  const c = j.cosmetic || {};
  return { id: j.id, ov, cos: { color: /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : '#ffffff', dust: clamp(+c.dust || 0, 0, 1), decal: String(c.decal || '').replace(/[^0-9A-Za-z]/g, '').slice(0, 3) } };
}
const LS = 'terraanalog.rover.build';
export function remember(build) { try { localStorage.setItem(LS, exportBuild(build)); } catch (e) { /* storage blocked */ } }
export function recall(reg) { try { const t = localStorage.getItem(LS); return t ? importBuild(reg, t) : null; } catch (e) { return null; } }
