// Home screen: target and purpose pickers, globe heat map, ranked hotspot list, About panel.
import { D, ROOT, loadAll, ensurePatches, presetGrid, liveScore, weightsVec, pickHotspots, targetById, fmtTrait } from './data.js';
import { createGlobe, motion } from './globeview.js';

const S = { target: null, purpose: 'rover', custom: null, hotspots: [] };
let G = null;
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

function renderTargets() {
  const box = $('targets'); box.innerHTML = '';
  for (const t of D.targets) {
    const b = el('button', 'card' + (t.id === S.target ? ' active' : ''), `<div class="t"><span>${t.short}</span><span class="body">${t.body}</span></div><div class="n">${t.name}. ${t.note}</div>`);
    b.setAttribute('aria-pressed', t.id === S.target ? 'true' : 'false');
    b.onclick = () => { S.target = t.id; renderTargets(); refresh(); };
    box.appendChild(b);
  }
}

const PURPOSE_HINT = {
  rover: 'Driving. Finds ground a rover could cross: gentle slopes, few rocks, firm soil with little loose sand or dust.',
  habitat: 'Building a base. Finds ground that is level enough to build on, with stable geology and (at the poles) similar sunlight.',
  thermal: 'Temperature. Finds places with a similar daily and seasonal temperature swing and similar dust cover.',
  custom: 'Your own mix. Set how much each trait matters; scores are recomputed in your browser.',
};
function renderPurposes() {
  const box = $('purposes'); box.innerHTML = '';
  for (const p of ['rover', 'habitat', 'thermal', 'custom']) {
    const b = el('button', p === S.purpose ? 'active' : '', D.meta.purposes[p].label);
    b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', p === S.purpose ? 'true' : 'false');
    b.onclick = () => { S.purpose = p; renderPurposes(); refresh(); };
    box.appendChild(b);
  }
  $('purposeHint').textContent = PURPOSE_HINT[S.purpose];
  $('customPanel').classList.toggle('hidden', S.purpose !== 'custom');
}

function renderCustom() {
  const box = $('customPanel'); box.innerHTML = '';
  D.meta.traits.forEach(t => {
    const l = el('label', '', `<span>${t.label}</span><input type="range" min="0" max="3" step="0.1" value="${S.custom[t.key]}"><output>${S.custom[t.key].toFixed(1)}</output>`);
    const inp = l.querySelector('input'), out = l.querySelector('output');
    inp.oninput = () => { S.custom[t.key] = +inp.value; out.textContent = (+inp.value).toFixed(1); if (S.purpose === 'custom') refresh(); };
    l.dataset.key = t.key;
    box.appendChild(l);
  });
  const note = el('p', 'hint', 'Sun elevation counts only for polar targets.'); box.appendChild(note);
  const r = el('button', 'btn ghost small', 'Reset to equal weights');
  r.onclick = () => { S.custom = { ...D.meta.purposes.custom.w }; renderCustom(); refresh(); };
  box.appendChild(r);
  updateCustomDim();
}
function updateCustomDim() {
  const polar = targetById(S.target)?.polar;
  document.querySelectorAll('#customPanel label').forEach(l => l.classList.toggle('off', l.dataset.key === 'sun_elev' && !polar));
}

function renderList() {
  const ol = $('hsList'); ol.innerHTML = '';
  const t = targetById(S.target), p = D.meta.purposes[S.purpose];
  $('hsMeta').textContent = `Top ${S.hotspots.length} Earth hotspots for ${t.short}, ${p.label.toLowerCase()}. Score 0 to 100 (higher is a closer match).`;
  S.hotspots.forEach((h, idx) => {
    const li = el('li', '', `<span class="rk">${h.rank}</span><div><b>${h.name}</b>${h.patch ? '' : '<span class="tag3d" title="No precomputed terrain tile; a stand-in is generated in the browser">live</span>'}<small>${h.lat.toFixed(2)}, ${h.lon.toFixed(2)} &middot; about ${h.area_km2.toLocaleString()} km&sup2;</small></div><div class="sc">${Math.round(h.score)}<i style="width:${Math.max(6, h.score)}%"></i></div>`);
    li.dataset.id = h.id; li.style.setProperty('--i', idx);
    li.tabIndex = 0; li.setAttribute('role', 'button'); li.setAttribute('aria-label', `Open hotspot ${h.rank}, ${h.name}, score ${Math.round(h.score)}`);
    li.onclick = () => openHotspot(h);
    li.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openHotspot(h); } };
    li.onfocus = () => G.highlight(h.id, true); li.onblur = () => G.highlight(h.id, false);
    li.onmouseenter = () => G.highlight(h.id, true);
    li.onmouseleave = () => G.highlight(h.id, false);
    ol.appendChild(li);
  });
}

function refresh() {
  const t = targetById(S.target);
  updateCustomDim();
  if (S.purpose === 'custom') {
    const sc = liveScore(t, weightsVec(S.custom, t.polar));
    S.hotspots = pickHotspots(sc, t);
    G.setHeat(sc, false);
  } else {
    const g = presetGrid(t.id, S.purpose);
    S.hotspots = D.hotspots[t.id][S.purpose];
    G.setHeat(g, true);
  }
  G.setMarkers(S.hotspots);
  renderList();
}

const raf2 = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
const wait = ms => new Promise(r => setTimeout(r, ms * motion.scale));
let busy = false, savedView = null, siteMod = null;

function veilShow(h, t) {
  $('veilKicker').textContent = `Opening site view`; $('veilTitle').textContent = h.name;
  $('veilSub').textContent = `Hotspot ${h.rank}, score ${Math.round(h.score)}/100, compared with ${t.name}`;
}
const veilOpacity = o => { const v = $('veil'); v.style.transition = 'none'; v.style.opacity = o; v.classList.toggle('on', o > 0.02); };
async function veilFade(to, ms = 320) { const v = $('veil'); v.style.transition = `opacity ${Math.max(30, ms * motion.scale)}ms ease`; v.style.opacity = to; await wait(ms + 30); if (to === 0) v.classList.remove('on'); }

async function openHotspot(h) {
  if (busy) return; busy = true;
  $('firstRun').classList.add('gone');
  const target = targetById(S.target);
  savedView = G.getView(); G.select(h.id); veilShow(h, target);
  ensurePatches().catch(() => {});   // starts the terrain download now so it overlaps the globe fly-in; openSite awaits it and reports a failure
  import('./terrain.js').then(m => m.prepareReal([target.patch, h.id])).catch(() => {});   // same for the real terrain tiles of the two grounds (local files); openSite awaits them and reports a failure
  $('veilBox').classList.remove('busy');
  // 1. fly the globe camera to the hotspot (ease in/out), fading the veil in over the last part
  siteMod = siteMod || import('./site.js');
  siteMod.then(mod => mod.prewarm && mod.prewarm()).catch(() => {});
  await G.flyTo({ lat: h.lat, lon: h.lon, dist: 1.16 }, 1200, f => veilOpacity(Math.max(0, (f - 0.5) / 0.5) * 0.96));
  // 2. build the terrain behind the veil, showing the loading indicator
  veilOpacity(1); $('veilBox').classList.add('busy'); await raf2();
  const { openSite } = await siteMod;
  performance.mark('site-open-start');
  try {
    await openSite({ target, purpose: S.purpose, hotspot: h, onBack: backToGlobe });
  } catch (e) { console.error(e); const n = $('siteNote'); if (n) { n.textContent = `Could not open Site View: ${e && e.message ? e.message : e}`; n.classList.remove('hidden'); } }   // never a silent black view
  performance.mark('site-open-end');
  G.stop();
  $('home').classList.add('hidden'); $('site').classList.remove('hidden');
  await raf2();
  // 3. dissolve into Site View
  await veilFade(0, 420); $('veilBox').classList.remove('busy');
  busy = false;
}

async function backToGlobe() {
  if (busy) return; busy = true;
  const { closeSite } = await siteMod;
  const h = V_hotspot();
  $('veilKicker').textContent = 'Returning to the globe'; $('veilTitle').textContent = h ? h.name : ''; $('veilSub').textContent = ''; $('veilBox').classList.add('busy');
  await veilFade(1, 280);
  closeSite(); $('site').classList.add('hidden'); $('home').classList.remove('hidden');
  G.start(); await raf2();
  $('veilBox').classList.remove('busy');
  const fl = G.flyTo(savedView || G.defaultView, 1100);
  veilFade(0, 420);
  await fl; G.select(null);
  busy = false;
}
const V_hotspot = () => (window.TERRA_SITE && window.TERRA_SITE.ctx ? window.TERRA_SITE.ctx.hotspot : null);

function wireLayers() {
  const tg = $('heatToggle'), op = $('heatOpacity'), bt = $('bordersToggle');
  const paint = (b, on) => { b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.classList.toggle('on', on); };
  paint(tg, true); paint(bt, true);
  tg.onclick = () => { const on = tg.getAttribute('aria-pressed') !== 'true'; paint(tg, on); G.setHeatVisible(on); $('legend').classList.toggle('dim', !on); };
  bt.onclick = () => { const on = bt.getAttribute('aria-pressed') !== 'true'; paint(bt, on); G.setLabelsVisible(on); };
  op.oninput = () => { G.setHeatOpacity(+op.value / 100); $('heatOpacityO').textContent = op.value + '%'; };
  $('resetGlobe').onclick = () => G.resetView();
}

/** Site View ground, one row per target plus one for the Earth hotspots, from the provenance fields the pipeline wrote (patches_index.json). */
function groundRows(row) {
  const P = D.patchIdx.patches, res = m => (m >= 1 ? `${+m.toFixed(1)} m` : `${Math.round(m * 100)} cm`), short = m => m.replace(/https?:\/\/\S+/g, 'the source file').slice(0, 150);
  const one = (name, e) => {
    if (!e || !e.real) return row(`Site View ground: ${name}`, 'demo', 'demo', 'Synthetic stand-in terrain (slope statistics from the traits), labelled demo in Site View.' + (e && e.missing && e.missing.length ? ' Real data was tried and is missing: ' + short(e.missing[0]) : ' Real data not fetched yet: run pipeline/fetch_windows.py.'));
    const img = e.real.img ? `Imagery: ${e.imagery_source}, ${res(e.imagery_resolution_m)} (real${e.real.img.gray ? ', greyscale, tint added' : ''}).` : 'Imagery: none yet (generic ground texture).';
    return row(`Site View ground: ${name}`, e.real.img && !e.synthetic_fine ? 'real' : 'real, partial', e.real.img && !e.synthetic_fine ? 'real' : 'sup', `Elevation: ${e.elevation_source}, ${res(e.elevation_resolution_m)} (real). ${img}${e.synthetic_fine ? ' Fine detail synthetic.' : ''} Centre ${e.site_center[0].toFixed(4)}, ${e.site_center[1].toFixed(4)}, built ${e.date_built}.`);
  };
  const earth = Object.entries(P).filter(([k]) => k.startsWith('E')), er = earth.filter(([, e]) => e.real);
  return D.targets.map(t => one(t.short, P[t.patch])).join('') + row('Site View ground: Earth hotspots', er.length ? `${er.length} of ${earth.length} real` : 'demo', er.length === earth.length ? 'real' : 'demo',
    (er.length ? `${er.length} hotspot windows use ${er[0][1].elevation_source} (30 m) with ${er[0][1].imagery_source}; fine detail below about 60 m is synthetic and labelled. ` : 'Copernicus GLO-30 elevation and Sentinel-2 cloudless imagery are set up in pipeline/fetch_windows.py but were not fetched (data hosts not reachable from the build environment). ') + (er.length < earth.length ? `${earth.length - er.length} hotspot grounds are synthetic stand-ins, labelled demo.` : '')) +
    row('Rocks and close-up ground grain', 'illustrative', 'sup', 'Rocks follow a rock-abundance rule with a fixed seed; the close-up grain is a generic photo texture (Poly Haven, CC0). Neither is measured data, and the wheels do not feel the rocks');
}
function renderAbout() {
  const m = D.manifest, demo = m.demo;
  const row = (name, status, kind, note) => `<tr><td>${name}</td><td><span class="pill ${kind}">${status}</span></td><td>${note}</td></tr>`;
  $('aboutBody').innerHTML = `
  <h1>TerraAnalog</h1>
  <p>Finds places on Earth that resemble a chosen Moon or Mars site, shows them on a world heat map, opens any hotspot as 3D terrain next to the target terrain, and runs a rover simulation on both. Built for the 2026 NASA Space Apps challenge "Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars". Worldwide scope.</p>
  ${demo ? `<p><span class="pill demo">DEMO DATA</span> ${m.note} The real files could not be downloaded when this build was made (the data hosts were blocked). The pipeline switches to real terrain automatically when the files are placed in data/raw; see README.</p>` : `<p>${m.note}</p>`}
  <h4>Data sources and status</h4>
  <table><tr><th>Item</th><th>Status</th><th>Detail</th></tr>
  ${row('Moon LOLA LDEM_16, LDSM_16, LDRM_16', m.real_files_found.moon ? 'real' : 'not used', m.real_files_found.moon ? 'real' : 'demo', 'imbrium.mit.edu LOLA GDR cylindrical grids, 16 pixels per degree')}
  ${row('Mars MOLA MEGDR megt90n000eb', m.real_files_found.mars ? 'real' : 'not used', m.real_files_found.mars ? 'real' : 'demo', 'PDS Geosciences Node, 16 pixels per degree. Only the label file was supplied')}
  ${row('Earth ETOPO 2022 (60 arc-second)', m.real_files_found.earth ? 'real' : 'not used', m.real_files_found.earth ? 'real' : 'demo', 'NOAA NCEI global relief model')}
  ${groundRows(row)}
  ${row('Temperature, soil and dust traits', 'placeholder', 'demo', 'Stand-ins for MODIS / Diviner / THEMIS and geologic maps; lower default weights')}
  ${row('Earth land mask', 'real', 'real', 'PyPI global-land-mask (GLOBE-derived). Shape only, no elevation')}
  ${row('Perseverance and Curiosity rover models', 'supplied', 'sup', 'NASA 3D Resources, converted and compressed for the web. Scarecrow reuses the Curiosity model')}
  ${row('Generic lunar rover model', 'procedural', 'sup', 'Built for this app from primitives; not a NASA model, not the Apollo LRV or VIPER')}
  ${row('Rover figures and soil constants', 'mixed', 'sup', 'Each figure is sourced or tagged assumed (assets/models/rovers.json). Soil constants are assumed and simplified')}
  </table>
  <p class="hint">Dataset names, formats and licences have not yet been verified against the challenge Resources tab. Generated: ${m.generated}. Explanations: ${D.explSource}.</p>
  <h4>How it works</h4>
  <p>Every place is described by nine traits (relief, median and steep slope, roughness, mean temperature and range, soil competence, dust cover, sun elevation). Traits are compared on one common scale, z-scored, weighted by purpose and turned into a 0 to 100 score. Hotspots are peaks at least 7 degrees apart. Language models, if used, only phrase the computed numbers and never produce rankings.</p>
  <h4>Limits</h4>
  <p>The rover simulation is a screening comparison with simplified soil behaviour and is not validated against a real rover. Gravity changes some metrics (wheel load, energy per metre, sinkage) and not others (the slope limit set by friction), so the verdict reports which metrics match and which do not. Rover figures that could not be checked against a source are tagged assumed (assets/models/rovers.json); the soil constants are assumed and simplified.</p>
  <h4>Libraries</h4><p class="hint">Three.js (MIT), meshopt decoder (MIT), Inter typeface (SIL OFL). Earth imagery, topography and water mask, country outlines and ground textures are local files (see README).</p>`;
}

const TRAIT_NAME = { relief: 'Relief', slope_med: 'Median slope', slope_p90: 'Steep slope (90th percentile)', roughness: 'Roughness', temp_mean: 'Mean temperature', temp_range: 'Temperature range', soil: 'Soil competence', dust: 'Dust cover', sun_elev: 'Sun elevation' };
function renderQuality() {
  const m = D.manifest, ph = new Set(m.placeholder_traits || []), anyDemo = !!m.demo || ph.size > 0;
  const b = $('qualityBtn'); b.textContent = anyDemo ? 'DEMO DATA' : 'REAL DATA'; b.classList.toggle('ok', !anyDemo);
  const pill = (demo) => `<span class="pill ${demo ? 'demo' : 'real'}">${demo ? 'Demo' : 'Real'}</span>`;
  const rows = D.meta.traits.map(t => `<tr><td>${TRAIT_NAME[t.key] || t.label}</td><td>${pill(ph.has(t.key) || m.earth_terrain === 'demo' && ['relief', 'slope_med', 'slope_p90', 'roughness'].includes(t.key))}</td></tr>`).join('');
  const tg = Object.entries(m.target_terrain || {}).map(([k, v]) => { const t = D.targets.find(x => x.id === k); return `<tr><td>${t ? t.short : k} terrain</td><td>${pill(v === 'demo')}</td></tr>`; }).join('');
  $('qualityPop').innerHTML = `<h4>Data quality, per trait</h4><table>${rows}${tg}<tr><td>Earth land shape</td><td>${pill(false)}</td></tr></table><p>${anyDemo ? 'Demo means a synthetic placeholder, not a measurement. Rankings are for demonstrating the method until the real NASA files are added.' : 'All traits come from real data.'} The About panel lists every source.</p>`;
  const open = on => { $('qualityPop').classList.toggle('hidden', !on); b.setAttribute('aria-expanded', on ? 'true' : 'false'); };
  b.onclick = e => { e.stopPropagation(); open($('qualityPop').classList.contains('hidden')); };
  document.addEventListener('click', e => { if (!$('qualityPop').contains(e.target)) open(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('qualityPop').classList.contains('hidden')) { open(false); b.focus(); } });
}
function wireCollapse() {
  const pair = (btn, host, cls) => { const b = $(btn); b.onclick = () => { const c = host().classList.toggle(cls); b.setAttribute('aria-expanded', c ? 'false' : 'true'); b.setAttribute('aria-label', (c ? 'Expand' : 'Collapse') + b.getAttribute('aria-label').replace(/^(Collapse|Expand)/, '')); setTimeout(() => window.dispatchEvent(new Event('resize')), 320); }; };
  pair('collapseLeft', () => $('home'), 'l-col'); pair('collapseRight', () => $('home'), 'r-col'); pair('collapseSide', () => $('site'), 's-col');
}
function wireAbout() {
  const m = $('about'); let last = null;
  const open = () => { last = document.activeElement; m.classList.remove('hidden'); $('aboutClose').focus(); };
  const close = () => { m.classList.add('hidden'); last && last.focus && last.focus(); };
  $('aboutBtn').onclick = open; $('aboutClose').onclick = close;
  m.onclick = e => { if (e.target.id === 'about') close(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !m.classList.contains('hidden')) close(); });
}

function initMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const apply = () => { motion.scale = mq.matches ? 0.12 : 1; document.documentElement.classList.toggle('reduce', mq.matches); };
  apply(); mq.addEventListener?.('change', apply);
}

async function start() {
  initMotion();
  try {
    await loadAll(s => ($('loading').textContent = s));
  } catch (e) {
    $('loading').innerHTML = `Could not load the data files (${e.message}).<br>Serve the project root with a local server, for example: python -m http.server 8000, then open /app/.<br>If data/processed is empty, run: python pipeline/run_pipeline.py`;
    return;
  }
  S.target = D.targets[0].id; S.custom = { ...D.meta.purposes.custom.w };
    G = createGlobe($('globe'), { onPick: h => openHotspot(h), onHover: (h, on) => document.querySelector(`#hsList li[data-id="${h.id}"]`)?.classList.toggle('hl', on) });
  $('loading').textContent = 'Loading Earth';
  renderTargets(); renderPurposes(); renderCustom(); renderAbout(); renderQuality(); refresh();
  wireLayers(); wireCollapse(); wireAbout();
  $('firstRunClose').onclick = () => $('firstRun').classList.add('gone');
  const gr = await G.ready;
  if (gr.missing.length) $('hsMeta').textContent += ` Missing local files: ${gr.missing.join(', ')}.`;
  $('loading').classList.add('hidden');
  window.TERRA = { S, D, G };   // handy for debugging in the console and for automated tests
}
start();
