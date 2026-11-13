// Data loading, live scoring and hotspot picking. Mirrors pipeline/terra.py so custom weights give the same kind of result as precomputed ones.
export const ROOT = document.querySelector('meta[name="terra-root"]')?.content ?? '../';   // '../' when served from the project root (page in /app/), './' when hosted with the page at the root
const BASE = ROOT + 'data/processed/';

export const D = { meta: null, targets: [], hotspots: {}, expl: {}, manifest: null, scores: null, zq: null, patchIdx: null, patchBuf: null, rovers: null, land: null };

async function j(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r.json();
}
async function b(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r.arrayBuffer();
}

export async function loadAll(onStatus = () => {}) {
  onStatus('Loading data');
  const [meta, targets, hotspots, expl, manifest, rovers, patchIdx] = await Promise.all([
    j(BASE + 'earth_meta.json'), j(BASE + 'targets.json'), j(BASE + 'hotspots.json'), j(BASE + 'explanations.json'),
    j(BASE + 'manifest.json'), j(ROOT + 'assets/models/rover_params.json'), j(BASE + 'patches_index.json')]);
  const [scores, traits, patchBuf] = await Promise.all([b(BASE + 'scores.bin'), b(BASE + 'earth_traits.bin'), b(BASE + 'patches.bin')]);
  Object.assign(D, { meta, targets, hotspots, expl: expl.entries, explSource: expl.source, manifest, rovers, patchIdx, patchBuf });
  D.N = meta.nlat * meta.nlon;
  D.scores = new Uint8Array(scores);
  D.zq = new Int8Array(traits);
  D.land = new Uint8Array(D.N);
  for (let i = 0; i < D.N; i++) D.land[i] = D.scores[i] !== meta.sea ? 1 : 0;
  D.traitKeys = meta.traits.map(t => t.key);
  return D;
}

export const latOf = i => 90 - D.meta.res * (i + 0.5);
export const lonOf = jx => -180 + D.meta.res * (jx + 0.5);

function fmt(v, w) { return (v < 0 ? '-' : '+') + Math.abs(v).toFixed(2).padStart(w - 1, '0'); }
export const hotspotId = (lat, lon) => 'E' + fmt(lat, 7) + '_' + fmt(lon, 8);

export function nearestName(lat, lon, maxDeg = 14) {
  let best = null, bd = 1e9;
  for (const [n, la, lo] of D.meta.gazetteer) {
    const dl = ((lon - lo + 540) % 360) - 180;
    const d = Math.hypot(lat - la, dl * Math.cos(((lat + la) / 2) * Math.PI / 180));
    if (d < bd) { bd = d; best = n; }
  }
  return bd <= maxDeg ? best : `${Math.abs(lat).toFixed(1)}${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(1)}${lon >= 0 ? 'E' : 'W'}`;
}

export const targetById = id => D.targets.find(t => t.id === id);

/** Precomputed score grid (Uint8, 255 = sea) for a preset purpose. */
export function presetGrid(targetId, purpose) {
  const k = D.meta.score_layout.indexOf(`${targetId}|${purpose}`);
  return D.scores.subarray(k * D.N, (k + 1) * D.N);
}

export function weightsVec(wdict, polar) {
  const w = D.traitKeys.map(k => wdict[k]);
  if (!polar) w[D.traitKeys.indexOf('sun_elev')] = 0;
  return w;
}

/** Live score (0-100 float, -1 at sea) from the int8 z-scores. */
export function liveScore(target, w) {
  const T = D.traitKeys.length, N = D.N, out = new Float32Array(N);
  const wsum = w.reduce((a, c) => a + c, 0) || 1;
  const q = D.meta.zq;
  const zt = target.z.map(v => Math.max(-4, Math.min(4, v)));
  for (let i = 0; i < N; i++) {
    if (!D.land[i]) { out[i] = -1; continue; }
    let d2 = 0;
    for (let t = 0; t < T; t++) {
      if (w[t] === 0) continue;
      const dz = D.zq[t * N + i] / q - zt[t];
      d2 += w[t] * dz * dz;
    }
    out[i] = 100 * Math.exp(-0.5 * d2 / wsum);
  }
  return out;
}

/** Raw trait values of an Earth cell, inverted from the z-scores. */
export function cellTraits(idx) {
  const o = {}, q = D.meta.zq;
  D.meta.traits.forEach((t, n) => {
    const v = (D.zq[n * D.N + idx] / q) * t.std + t.mean;
    o[t.key] = t.log ? Math.max(0, Math.expm1(v)) : v;
  });
  return o;
}
export function cellSims(idx, target) {
  const o = {}, q = D.meta.zq;
  D.traitKeys.forEach((k, n) => { const dz = D.zq[n * D.N + idx] / q - Math.max(-4, Math.min(4, target.z[n])); o[k] = 100 * Math.exp(-0.5 * dz * dz); });
  return o;
}

/** Greedy peak picking with minimum separation and neighbour merge, same rule as the pipeline. */
export function pickHotspots(score, target, n = 20, minSep = 7, mergeFrac = 0.85) {
  const { nlat, nlon, res } = D.meta;
  const idx = [];
  for (let i = 0; i < D.N; i++) if (score[i] >= 0) idx.push(i);
  idx.sort((a, c) => score[c] - score[a]);
  const kept = [], rad = Math.PI / 180;
  for (const id of idx) {
    const i = Math.floor(id / nlon), jx = id % nlon, la = latOf(i) * rad, lo = lonOf(jx) * rad;
    let ok = true;
    for (const k of kept) {
      const c = Math.sin(la) * Math.sin(k.la) + Math.cos(la) * Math.cos(k.la) * Math.cos(lo - k.lo);
      if (Math.acos(Math.max(-1, Math.min(1, c))) / rad < minSep) { ok = false; break; }
    }
    if (!ok) continue;
    // flood fill of neighbours >= mergeFrac * peak inside +-10 cells
    const thr = mergeFrac * score[id], seen = new Set([id]), stack = [id];
    let area = 0;
    const cell = (111.32 * res) ** 2;
    while (stack.length) {
      const c = stack.pop(), ci = Math.floor(c / nlon), cj = c % nlon;
      area += Math.cos(latOf(ci) * rad) * cell;
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
        const ni = ci + di, nj = (cj + dj + nlon) % nlon;
        if (ni < 0 || ni >= nlat || Math.abs(ni - i) > 10) continue;
        let dj0 = Math.abs(nj - jx); dj0 = Math.min(dj0, nlon - dj0);
        if (dj0 > 10) continue;
        const nid = ni * nlon + nj;
        if (!seen.has(nid) && score[nid] >= thr) { seen.add(nid); stack.push(nid); }
      }
    }
    const lat = latOf(i), lon = lonOf(jx);
    const tr = cellTraits(id);
    kept.push({
      id: hotspotId(lat, lon), rank: kept.length + 1, lat, lon, score: Math.round(score[id] * 10) / 10, ncells: seen.size, area_km2: Math.round(area),
      name: nearestName(lat, lon), traits: tr, sim: cellSims(id, target), patch: false, la, lo,
    });
    if (kept.length >= n) break;
  }
  kept.forEach(h => { h.patch = !!D.patchIdx.patches[h.id]; delete h.la; delete h.lo; });
  return kept;
}

export function traitMeta(key) { return D.meta.traits.find(t => t.key === key); }
export function fmtTrait(key, v) {
  const u = traitMeta(key).unit;
  if (u === '0-1') return v.toFixed(2);
  if (key === 'slope_med' || key === 'slope_p90') return v.toFixed(1) + ' °';
  return Math.round(v) + ' ' + u;
}

/** Template explanation for hotspots without a cached sentence; built only from the computed numbers. */
export function templateExplanation(target, purposeLabel, h) {
  const keys = D.traitKeys.slice().sort((a, c) => h.sim[c] - h.sim[a]);
  const best = keys.filter(k => h.sim[k] >= 70).slice(0, 2);
  if (!best.length) best.push(keys[0]);
  const worst = keys.slice().reverse().filter(k => h.sim[k] < 70).slice(0, 2);
  const S = { relief: 'relief', slope_med: 'median slope', slope_p90: 'steep slope', roughness: 'roughness', temp_mean: 'mean temperature', temp_range: 'temperature range', soil: 'rock/soil competence', dust: 'dust cover', sun_elev: 'sun elevation' };
  const f = (k, tr) => fmtTrait(k, tr[k]);
  let s = `${h.name} scores ${Math.round(h.score)}/100 against ${target.name} for ${purposeLabel.toLowerCase()}. `;
  s += 'Closest agreement: ' + best.map(k => `${S[k]} (${f(k, h.traits)} here vs ${f(k, target.traits)} on the target)`).join('; ') + '. ';
  s += worst.length ? 'Largest gaps: ' + worst.map(k => `${S[k]} (${f(k, h.traits)} vs ${f(k, target.traits)})`).join('; ') + '. ' : 'No trait differs strongly from the target. ';
  s += 'Gravity is not part of this score; the rover simulation shows which behaviours still differ. ' + D.manifest.note;
  return s;
}
