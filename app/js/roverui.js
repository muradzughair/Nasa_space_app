// Rover interface: the rover bar in Site View, the rover picker, the Customize drawer and the "compare two builds" window.
// All state lives in rovers.js; all numbers come from the effective config (rovercfg.js) and soilmech.js. No per-rover code.
import { R, selectRover, setOverride, setCosmetic, resetBuild, loadBuildText, saveBuildText, cfgOf } from './rovers.js';
import { CUSTOM_KEYS, LABEL, UNIT, tag, effective } from './rovercfg.js';
import { estimate } from './soilmech.js';
import { crrFromSoil, analyze } from './sim.js';
import { ROOT } from './data.js';

const $ = id => document.getElementById(id);
const BADGE = { real: 'REAL', custom: 'CUSTOM', test: 'TEST ROVER', generic: 'GENERIC' };
const PLANET = { mars: 'Mars rover', moon: 'Moon rover', test: 'Earth test rover' };
const FMT = { mass_kg: v => v.toFixed(0), wheel_count: v => v.toFixed(0), wheel_radius_m: v => v.toFixed(3), wheel_width_m: v => v.toFixed(3), top_speed_ms: v => v.toFixed(3), motor_power_w: v => v.toFixed(0), battery_wh: v => v.toFixed(0), base_power_w: v => v.toFixed(0), ground_clearance_m: v => v.toFixed(2), max_slope_deg: v => v.toFixed(0), drive_force_max_N: v => v.toFixed(0), drive_efficiency: v => v.toFixed(2) };
const STEP = { mass_kg: 5, wheel_radius_m: 0.005, wheel_width_m: 0.005, motor_power_w: 5, battery_wh: 10, top_speed_ms: 0.001 };
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const H = { ctx: () => null };
const badge = cfg => `<span class="rb rb-${cfg.kind}">${BADGE[cfg.kind]}</span>`;
const assumedTag = f => { const t = tag(R.reg, f); return t.assumed ? `<span class="assumed" tabindex="0" title="${esc(t.title)}">${t.user ? 'set by you' : t.derived ? 'derived' : 'assumed'}</span>` : `<span class="verif" title="${esc(t.title)}">sourced</span>`; };
const fmt = (k, v) => FMT[k](v) + (UNIT[k] ? ' ' + UNIT[k] : '');

export function initRoverUI(hooks) {
  Object.assign(H, hooks);
  const host = $('site');
  host.insertAdjacentHTML('beforeend', `
    <div id="rvPicker" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="rvPickT"><div class="modal-card rv-card"><button class="btn ghost close" data-close aria-label="Close">Close</button>
      <h1 id="rvPickT">Choose a rover</h1><p class="hint">Real rovers use NASA models and published figures where they could be checked; every figure that could not is tagged assumed. Any rover can be tried on any ground.</p><div class="rv-cards" id="rvCards"></div></div></div>
    <div id="rvDrawer" class="rv-drawer hidden" role="dialog" aria-modal="false" aria-labelledby="rvDrawT"><div class="rv-dhead"><h2 id="rvDrawT">Customize rover</h2><button class="icon-btn" data-close aria-label="Close the customize panel">&times;</button></div><div class="rv-dbody" id="rvDrawBody"></div></div>
    <div id="rvCompare" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="rvCmpT"><div class="modal-card rv-card wide"><button class="btn ghost close" data-close aria-label="Close">Close</button>
      <h1 id="rvCmpT">Compare two rover builds</h1><p class="hint">Build A and build B drive the same route on one ground. Speed, energy, sinkage and the verdict come from the same screening model as the simulation.</p><div id="rvCmpBody"></div></div></div>`);
  for (const id of ['rvPicker', 'rvCompare']) { const m = $(id); m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) m.classList.add('hidden'); }); }
  $('rvDrawer').addEventListener('click', e => { if (e.target.closest('[data-close]')) closeDrawer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { for (const id of ['rvPicker', 'rvCompare']) $(id).classList.add('hidden'); } });
  refreshRoverUI();
}

// ---------------------------------------------------------------- rover bar (Site View) and the one-line rover chooser (Drive start screen)
export function roverSummary(cfg) {
  return `<div class="rv-sum"><div class="rv-name"><b>${esc(cfg.name)}</b> ${badge(cfg)}<small>${esc(cfg.mission)} &middot; ${esc(PLANET[cfg.planet])}</small></div>
    <div class="rv-figs">${['mass_kg', 'wheel_count', 'wheel_radius_m', 'wheel_width_m', 'top_speed_ms'].map(k => `<span>${esc(LABEL[k])} <b>${fmt(k, k === 'wheel_count' ? cfg.n_wheels : cfg.fig[k].value)}</b> ${assumedTag(cfg.fig[k])}</span>`).join('')}</div></div>`;
}
export function refreshRoverUI() {
  const bar = $('roverBar'); if (!bar || !R.cfg) return;
  bar.innerHTML = roverSummary(R.cfg) + `<div class="rv-actions"><button class="btn small" id="rvPick">Change rover</button><button class="btn small" id="rvCust">Customize</button><button class="btn small ghost" id="rvCmp">Compare two builds</button></div>`;
  $('rvPick').onclick = () => openPicker(); $('rvCust').onclick = () => openDrawer(); $('rvCmp').onclick = () => openCompare();
  if (!$('rvDrawer').classList.contains('hidden')) {
    const body = $('rvDrawBody'), a = document.activeElement;
    if (a && a.type === 'range' && body.contains(a)) {            // while a slider is dragged, update the numbers only so the slider keeps focus
      $('rvRead').innerHTML = readout(R.cfg); const sm = body.querySelector('.rv-sum2'); if (sm) sm.innerHTML = roverSummary(R.cfg) + (R.cfg.kind === 'custom' ? `<p class="hint">Changed from the preset: ${R.cfg.changed.map(k => LABEL[k].toLowerCase()).join(', ')}. This is a custom build, not a real mission rover.</p>` : '');
      body.querySelectorAll('input[data-k]').forEach(i => { const t = i.parentElement.querySelector('.rv-t'); if (t) t.innerHTML = assumedTag(R.cfg.fig[i.dataset.k]); });
    } else paintDrawer(true);
  }
}
export function mountRoverLine(el, onChange) {
  const paint = () => { el.innerHTML = roverSummary(R.cfg) + `<div class="rv-actions"><button class="btn small" data-a="pick">Change rover</button><button class="btn small" data-a="cust">Customize</button></div>`; };
  paint();
  el.onclick = e => { const a = e.target.closest('[data-a]')?.dataset.a; if (a === 'pick') openPicker(() => { paint(); onChange && onChange(); }); if (a === 'cust') { openDrawer(); } };
  return paint;
}

// ---------------------------------------------------------------- picker
export function openPicker(done) {
  const cards = R.reg.order.map(id => {
    const row = R.reg.rovers[id], c = cfgOf({ id, ov: {}, cos: {} }), n = Object.values(c.fig).filter(f => !f.verified).length;
    return `<button class="card rv-pick${id === R.build.id ? ' active' : ''}" data-id="${id}"><img src="${ROOT}assets/models/previews/${row.inherit || id}.png" alt="" width="160" height="100" loading="lazy"><div class="t"><span>${esc(row.display_name)}</span>${badge(c)}</div>
      <div class="n">${esc(row.mission)} &middot; ${esc(PLANET[row.planet])}</div><div class="n">${c.mass_kg.toFixed(0)} kg, ${c.n_wheels} wheels, wheel radius ${c.wheel_radius_m} m</div><div class="n"><span class="assumed">${n} of 12 figures assumed</span></div></button>`;
  }).join('');
  $('rvCards').innerHTML = cards;
  $('rvCards').onclick = e => { const b = e.target.closest('.rv-pick'); if (!b) return; R.picked = true; selectRover(b.dataset.id); $('rvPicker').classList.add('hidden'); done && done(); };
  $('rvPicker').classList.remove('hidden');
}

// ---------------------------------------------------------------- customize drawer
let drawerOpen = false;
export function openDrawer() { $('rvDrawer').classList.remove('hidden'); drawerOpen = true; paintDrawer(false); }
function closeDrawer() { $('rvDrawer').classList.add('hidden'); drawerOpen = false; }
function slider(cfg, k) {
  const lim = cfg.limits?.[k] || R.reg.rovers[cfg.id].limits[k], f = cfg.fig[k], v = k === 'wheel_count' ? cfg.n_wheels : f.value;
  if (k === 'wheel_count') return `<div class="rv-row"><label>${LABEL[k]}</label><div class="seg" role="group" aria-label="Wheel count">${[4, 6].map(n => `<button data-wc="${n}" class="${cfg.n_wheels === n ? 'on' : ''}">${n}</button>`).join('')}</div><span class="rv-t">${assumedTag(f)}</span></div>`;
  return `<div class="rv-row"><label for="rv_${k}">${LABEL[k]}</label><input id="rv_${k}" data-k="${k}" type="range" min="${lim[0]}" max="${lim[1]}" step="${STEP[k]}" value="${v}"><output id="rvo_${k}">${fmt(k, v)}</output><span class="rv-t">${assumedTag(f)}</span></div>`;
}
function readout(cfg) {
  const c = H.ctx(); if (!c) return '';
  const cols = c.grounds.map(g => ({ g, e: estimate(cfg, g.S, { g: g.g, mu: g.mu, crr: crrFromSoil(g.soil), mass: cfg.mass_kg }) }));
  const row = (lab, f, hint) => `<tr><td title="${esc(hint || '')}">${lab}</td>${cols.map(({ e }) => `<td>${f(e)}</td>`).join('')}</tr>`;
  const km = m => m >= 1000 ? (m / 1000).toFixed(2) + ' km' : m.toFixed(0) + ' m';
  return `<table class="rv-read"><thead><tr><th></th>${cols.map(({ g }, i) => `<th class="${i ? 'e' : 't'}">${esc(g.label)}<small>g ${g.g} &middot; ${esc(g.cls)}</small></th>`).join('')}</tr></thead><tbody>
    ${row('Weight', e => e.weightN.toFixed(0) + ' N', 'mass times local gravity')}
    ${row('Ground pressure', e => e.pressure_kPa.toFixed(1) + ' kPa', 'wheel load divided by wheel width times contact length')}
    ${row('Expected sinkage', e => (1000 * e.sinkage_m).toFixed(1) + ' mm', 'simplified Bekker sinkage on the ground class, assumed soil constants')}
    ${row('Top speed here', e => e.canMove ? e.topSpeed.toFixed(3) + ' m/s' : 'stuck', 'flat ground, force balance with motor, power and traction limits')}
    ${row('Range on battery', e => e.canMove ? km(e.rangeM) : '0 m', 'flat ground at that speed, drive plus base power')}</tbody></table>
    <p class="hint">All of this is the screening model: soil constants are assumed and simplified (Bekker sinkage), not measured at the site.</p>`;
}
function paintDrawer(keepScroll) {
  const body = $('rvDrawBody'), top = body.scrollTop, cfg = R.cfg, row = R.reg.rovers[cfg.id];
  body.innerHTML = `
    <div class="rv-sum2">${roverSummary(cfg)}${cfg.note ? `<p class="hint">${esc(cfg.note)}</p>` : ''}${cfg.kind === 'custom' ? `<p class="hint">Changed from the ${esc(row.display_name)} preset: ${cfg.changed.map(k => LABEL[k].toLowerCase()).join(', ')}. This is a custom build, not a real mission rover.</p>` : ''}</div>
    <h3>Rover</h3><div class="rv-presets">${R.reg.order.map(id => `<button class="btn small${id === cfg.id ? ' on' : ''}" data-pre="${id}">${esc(R.reg.rovers[id].display_name)}</button>`).join('')}</div>
    <h3>Build (changes the physics)</h3>${CUSTOM_KEYS.map(k => slider(cfg, k)).join('')}
    <p class="hint">Ranges are limited to realistic values for ${esc(PLANET[cfg.planet].toLowerCase())}s. Motor power sets the drive force and power cap, top speed is the gear (higher gear, less force). Wheel size and width change sinkage.</p>
    <h3>Fixed figures of the preset</h3><div class="rv-fixed">${['base_power_w', 'ground_clearance_m', 'max_slope_deg', 'drive_force_max_N', 'drive_efficiency'].map(k => `<div><span>${LABEL[k]}</span><b>${fmt(k, cfg.fig[k].value)}</b> ${assumedTag(cfg.fig[k])}</div>`).join('')}</div>
    <h3>Live readout on each ground</h3><div id="rvRead">${readout(cfg)}</div>
    <h3>Looks only (no effect on the physics)</h3>
    <div class="rv-row"><label for="rv_col">Body colour</label><input id="rv_col" type="color" value="${cfg.cos.color}"><span></span><span class="rv-t"></span></div>
    <div class="rv-row"><label for="rv_dust">Dust level</label><input id="rv_dust" type="range" min="0" max="1" step="0.05" value="${cfg.cos.dust}"><output>${(100 * cfg.cos.dust).toFixed(0)} %</output><span class="rv-t"></span></div>
    <div class="rv-row"><label for="rv_dec">Number plate</label><input id="rv_dec" type="text" maxlength="3" value="${esc(cfg.cos.decal)}" placeholder="e.g. 7"><span></span><span class="rv-t"></span></div>
    <div class="rv-foot"><button class="btn small" id="rvReset">Reset to preset</button><button class="btn small" id="rvSave">Save as JSON</button><label class="btn small">Load JSON<input id="rvLoad" type="file" accept="application/json,.json" hidden></label></div><div id="rvMsg" class="hint" role="status"></div>`;
  if (keepScroll) body.scrollTop = top;
  body.oninput = e => {
    const t = e.target;
    if (t.dataset.k) { $('rvo_' + t.dataset.k).textContent = fmt(t.dataset.k, +t.value); setOverride(t.dataset.k, +t.value); }
    else if (t.id === 'rv_col') setCosmetic('color', t.value);
    else if (t.id === 'rv_dust') { t.nextElementSibling.textContent = (100 * t.value).toFixed(0) + ' %'; setCosmetic('dust', +t.value); }
    else if (t.id === 'rv_dec') setCosmetic('decal', t.value.replace(/[^0-9A-Za-z]/g, '').slice(0, 3));
  };
  body.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.wc) setOverride('wheel_count', +b.dataset.wc); else if (b.dataset.pre) { R.picked = true; selectRover(b.dataset.pre); } else if (b.id === 'rvReset') resetBuild();
    else if (b.id === 'rvSave') { const blob = new Blob([saveBuildText()], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `terraanalog-rover-${R.build.id}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
  };
  const ld = $('rvLoad'); if (ld) ld.onchange = async () => { try { loadBuildText(await ld.files[0].text()); R.picked = true; $('rvMsg').textContent = 'Loaded.'; } catch (err) { $('rvMsg').textContent = err.message; } ld.value = ''; };
}
export function refreshReadout() { if (drawerOpen && $('rvRead')) $('rvRead').innerHTML = readout(R.cfg); }

// ---------------------------------------------------------------- compare two builds on one ground
const cmp = { A: null, B: null, ground: 0 };
export function openCompare() {
  cmp.A = { id: R.build.id, ov: { ...R.build.ov }, cos: {} }; cmp.B = cmp.B && cmp.B.id in R.reg.rovers ? cmp.B : { id: R.build.id, ov: { ...R.build.ov }, cos: {} };
  paintCompare(); $('rvCompare').classList.remove('hidden');
}
function buildEditor(w) {
  const cfg = effective(R.reg, cmp[w]), row = R.reg.rovers[cfg.id];
  return `<div class="rv-col" data-w="${w}"><h3>Build ${w} ${badge(cfg)}</h3><select aria-label="Rover for build ${w}" data-sel>${R.reg.order.map(id => `<option value="${id}"${id === cfg.id ? ' selected' : ''}>${esc(R.reg.rovers[id].display_name)}</option>`).join('')}</select>
    ${CUSTOM_KEYS.map(k => { const lim = row.limits[k], v = k === 'wheel_count' ? cfg.n_wheels : cfg.fig[k].value; return k === 'wheel_count'
      ? `<div class="rv-row"><label>${LABEL[k]}</label><div class="seg">${[4, 6].map(n => `<button data-wc="${n}" class="${cfg.n_wheels === n ? 'on' : ''}">${n}</button>`).join('')}</div><span class="rv-t"></span></div>`
      : `<div class="rv-row"><label>${LABEL[k]}</label><input data-k="${k}" type="range" min="${lim[0]}" max="${lim[1]}" step="${STEP[k]}" value="${v}"><output>${fmt(k, v)}</output><span class="rv-t">${assumedTag(cfg.fig[k])}</span></div>`; }).join('')}</div>`;
}
function ground() { const c = H.ctx(); return c.grounds[cmp.ground]; }
function evalBuild(b) {
  const g = ground(), cfg = effective(R.reg, b), c = H.ctx();
  const A = analyze(g.patch, g.route, cfg, { g: g.g, mass: cfg.mass_kg, mu: g.mu, soil: g.soil, S: g.S }), T = A.totals, e = estimate(cfg, g.S, { g: g.g, mu: g.mu, crr: crrFromSoil(g.soil) });
  return { cfg, T, e, vmean: T.dist / T.time };
}
function paintCompare() {
  const c = H.ctx(), body = $('rvCmpBody'); if (!c) { body.innerHTML = '<p class="hint">Open a hotspot first.</p>'; return; }
  const a = evalBuild(cmp.A), b = evalBuild(cmp.B), g = ground();
  const better = (x, y, lowerBetter) => Math.abs(x - y) / Math.max(1e-9, Math.abs(x), Math.abs(y)) < 0.01 ? '' : ((lowerBetter ? x < y : x > y) ? 'win' : '');
  const row = (lab, f, key, lowerBetter, hint) => { const x = key(a), y = key(b); return `<tr><td title="${esc(hint || '')}">${lab}</td><td class="${better(x, y, lowerBetter)}">${f(x)}</td><td class="${better(y, x, lowerBetter)}">${f(y)}</td></tr>`; };
  const verdict = r => r.T.reachable ? '<span class="tagm ok">reachable</span>' : `<span class="tagm no">not reachable</span><small class="blk">${r.T.blockers.map(esc).join('; ')}</small>`;
  body.innerHTML = `<div class="rv-gsel" role="group" aria-label="Ground">${c.grounds.map((gg, i) => `<button data-g="${i}" class="btn small${i === cmp.ground ? ' on' : ''}">${esc(gg.label)}: ${esc(gg.short)}</button>`).join('')}</div>
    <div class="rv-two">${buildEditor('A')}${buildEditor('B')}</div>
    <table class="rv-read cmp2"><thead><tr><th>Same route on ${esc(g.short)} (g ${g.g}, ${esc(g.cls)})</th><th>Build A</th><th>Build B</th></tr></thead><tbody>
    ${row('Top speed here (flat)', v => v.toFixed(3) + ' m/s', r => r.e.topSpeed, false, 'force balance with motor, power and traction limits')}
    ${row('Mean speed on the route', v => v.toFixed(3) + ' m/s', r => r.vmean, false)}
    ${row('Drive time', v => (v / 60).toFixed(0) + ' min', r => r.T.time, true)}
    ${row('Energy per metre', v => v.toFixed(0) + ' J/m', r => r.T.e_mean, true)}
    ${row('Energy for the route', v => v.toFixed(0) + ' Wh', r => r.T.energy_Wh, true, 'drive energy plus base power over the drive time')}
    ${row('Battery', v => v.toFixed(0) + ' Wh', r => r.T.battery_wh, false)}
    ${row('Mean sinkage', v => v.toFixed(1) + ' mm', r => r.T.sink_mean_mm, true, 'simplified Bekker sinkage, assumed soil constants')}
    ${row('Ground pressure', v => v.toFixed(1) + ' kPa', r => r.T.press_kPa, true)}
    <tr><td>Verdict</td><td>${verdict(a)}</td><td>${verdict(b)}</td></tr></tbody></table>
    <p class="hint">Green marks the better value when the two differ by more than 1 percent. Verdict: reachable means the route fits the battery, the slope limit and the available drive force. Screening model, assumed soil constants.</p>`;
  body.oninput = e => { const t = e.target; if (!t.dataset.k) return; const w = t.closest('[data-w]').dataset.w, row = R.reg.rovers[cmp[w].id]; const v = Math.max(row.limits[t.dataset.k][0], Math.min(row.limits[t.dataset.k][1], +t.value)); cmp[w] = { ...cmp[w], ov: { ...cmp[w].ov, [t.dataset.k]: v } }; t.nextElementSibling.textContent = fmt(t.dataset.k, v); repaintTable(); };
  body.onchange = e => { if (e.target.matches('[data-sel]')) { const w = e.target.closest('[data-w]').dataset.w; cmp[w] = { id: e.target.value, ov: {}, cos: {} }; paintCompare(); } };
  body.onclick = e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.g) { cmp.ground = +b.dataset.g; paintCompare(); } else if (b.dataset.wc) { const w = b.closest('[data-w]').dataset.w; cmp[w] = { ...cmp[w], ov: { ...cmp[w].ov, wheel_count: +b.dataset.wc } }; paintCompare(); } };
}
function repaintTable() { const keep = document.activeElement?.dataset?.k, w = document.activeElement?.closest('[data-w]')?.dataset.w, tb = $('rvCmpBody'); const sc = tb.parentElement.scrollTop; paintCompare(); tb.parentElement.scrollTop = sc; if (keep) { const el = tb.querySelector(`[data-w="${w}"] [data-k="${keep}"]`); el && el.focus(); } }
