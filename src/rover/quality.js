// Render quality: levels, the automatic governor, the F3 overlay, the quality notice and the benchmark (?bench).
// The app cannot know the user's GPU in advance, so it measures itself: frame time between drawn frames, the JavaScript time of each frame and, where
// the browser offers it (EXT_disjoint_timer_query_webgl2), the GPU time of each frame. It steps down when frames are slow and back up, slowly, when
// they are fast, with hysteresis so it does not flip-flop.

// Levels, cheapest last. The three named settings map to steps 0 (High), 2 (Medium) and 4 (Low); Auto may use any step.
export const LEVELS = [
  { name: 'High', dpr: 1.5, shadow: 2048, shadowDrive: 1024, ext: 1.0, insetScale: 0.5, insetEvery: 1, lod: 0.03, ring: 2, simple: 0, nrm: 1, tiny: 1, dust: 1, insetShadowEvery: 3 },
  { name: 'High, 1x pixels', dpr: 1.0, shadow: 2048, shadowDrive: 1024, ext: 1.0, insetScale: 0.5, insetEvery: 1, lod: 0.03, ring: 2, simple: 0, nrm: 1, tiny: 1, dust: 1, insetShadowEvery: 3 },
  { name: 'Medium', dpr: 1.0, shadow: 1024, shadowDrive: 1024, ext: 0.7, insetScale: 0.5, insetEvery: 1, lod: 0.04, ring: 2, simple: 0, nrm: 1, tiny: 1, dust: 0.6, insetShadowEvery: 6 },
  { name: 'Medium, lighter', dpr: 1.0, shadow: 1024, shadowDrive: 512, ext: 0.6, insetScale: 0.5, insetEvery: 2, lod: 0.05, ring: 1, simple: 0, nrm: 1, tiny: 1, dust: 0.4, insetShadowEvery: 0 },
  { name: 'Low', dpr: 0.75, shadow: 512, shadowDrive: 512, ext: 0.5, insetScale: 0.4, insetEvery: 'move', lod: 0.06, ring: 1, simple: 1, nrm: 0, tiny: 0, dust: 0.25, insetShadowEvery: 0 },
  { name: 'Lowest', dpr: 0.75, shadow: 512, shadowDrive: 512, ext: 0.4, insetScale: 0.33, insetEvery: 'move', lod: 0.09, ring: 0, simple: 1, nrm: 0, tiny: 0, dust: 0, insetShadowEvery: 0 },
];
export const NAMED = { high: 0, medium: 2, low: 4 };
const KEY = 'terra.quality', KEY_AUTO = 'terra.quality.autoStep';
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } } };
const qs = new URLSearchParams(location.search);

/** Pure governor, testable without a browser. feed(now, intervalMs, busyMs) per drawn frame; returns the new step or -1 when unchanged.
 *  busyMs: max(JS time, GPU time) when the GPU time is known, else null (then only the frame interval is used). */
export class Governor {
  constructor(step = 0, max = LEVELS.length - 1) { Object.assign(this, { step, max, win: [], lastChange: -1e9, goodSince: null, block: new Map(), fails: new Map() }); }
  feed(now, interval, busy) {
    // interval: time between two consecutive DRAWN frames (idle gaps of render on demand never reach here, and a hidden tab resets the window), so a
    // very slow frame counts as slow, not as a pause
    if (!(interval > 0)) return -1;
    interval = Math.min(interval, 5000); this.win.push([now, interval, busy == null ? interval : Math.max(busy, 0)]);
    let sI = 0, sB = 0; for (const w of this.win) { sI += w[1]; sB += w[2]; }
    while (this.win.length > 3 && sI - this.win[0][1] >= 1000) { sI -= this.win[0][1]; sB -= this.win[0][2]; this.win.shift(); }   // the last ~1 s of frames (at least 3)
    if (this.win.length < 3 || sI < 900 || now - this.lastChange < 2500) return -1;   // need about 1 s of frames, and 2.5 s after any change
    const avgI = sI / this.win.length, avgB = sB / this.win.length;
    if (avgI > 20 && this.step < this.max) {   // slow: one step down
      const n = (this.fails.get(this.step) || 0) + 1; this.fails.set(this.step, n);
      if (now - (this.upAt || -1e9) < 8000) this.block.set(this.step, now + 30000 * Math.pow(2, n - 1));   // the step we just went up to was too heavy: block it for 30 s, 60 s, 120 s ...
      return this.change(now, this.step + 1);
    }
    const fast = avgB < 12;   // 12 ms of work per frame: room to spare (with the GPU timer this also works on 60 Hz displays)
    if (fast) { if (this.goodSince == null) this.goodSince = now; } else this.goodSince = null;
    if (this.goodSince != null && now - this.goodSince > 5000 && this.step > 0 && !((this.block.get(this.step - 1) || 0) > now)) { this.upAt = now; return this.change(now, this.step - 1); }
    return -1;
  }
  change(now, s) { this.step = s; this.lastChange = now; this.win.length = 0; this.goodSince = null; return s; }
}

// ---------------------------------------------------------------- state
const Q = {
  mode: (qs.get('q') || store.get(KEY) || 'auto').toLowerCase(),   // auto | high | medium | low
  step: 0, gov: null, apply: null, info: null, gpu: null, overlay: false, el: null, notice: null, ntimer: 0,
  frames: [], js: [], gpuMs: [], last: 0, statT: 0, calls: 0, tris: 0, bench: null,
};
if (!(Q.mode in NAMED) && Q.mode !== 'auto') Q.mode = 'auto';
Q.step = Q.mode === 'auto' ? Math.min(LEVELS.length - 1, Math.max(0, +(store.get(KEY_AUTO) || 0))) : NAMED[Q.mode];
Q.gov = new Governor(Q.step);
export const level = () => LEVELS[Q.step];
export const qualityState = () => ({ mode: Q.mode, step: Q.step, name: LEVELS[Q.step].name, aa: Q.aa, gpuTimer: !!Q.gpu });
window.TERRA_QUALITY = { state: qualityState, set: m => setMode(m), levels: LEVELS, gov: () => Q.gov };
/** Antialiasing can only be chosen when the renderer is created: on when the last session did not need Low or below. */
export function wantAntialias() { Q.aa = !(Q.step >= NAMED.low) && !qs.has('noaa'); return Q.aa; }

/** Called once by Site View with its renderer and an apply(level) callback that pushes a level into the scenes. */
export function attach(renderer, apply) {
  Q.apply = apply; Q.info = renderer.info; renderer.info.autoReset = false;   // counts are reset once per frame, so they cover every view and shadow pass
  const gl = renderer.getContext(), ext = gl.getExtension && gl.getExtension('EXT_disjoint_timer_query_webgl2');
  if (ext && gl.createQuery) Q.gpu = { gl, ext, pending: [], q: null };
  try { const d = gl.getExtension('WEBGL_debug_renderer_info'); Q.gpuName = d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); } catch (e) { Q.gpuName = 'unknown'; }
  apply(level());
}
export function setMode(m) {
  m = String(m).toLowerCase(); if (!(m in NAMED) && m !== 'auto') return;
  Q.mode = m; store.set(KEY, m);
  const s = m === 'auto' ? Q.gov.step : NAMED[m];
  if (m === 'auto') Q.gov = new Governor(Q.step); else Q.gov.step = s;
  setStep(s, null); paintControl();
}
function setStep(s, why) {
  if (s === Q.step) return;
  const down = s > Q.step; Q.step = s; if (Q.mode === 'auto') store.set(KEY_AUTO, String(s));
  if (Q.apply) Q.apply(level());
  if (why) notice(`Quality ${down ? 'lowered' : 'raised'} to ${level().name} ${down ? 'to keep speed' : '(frames have time to spare)'}`);
  if (Q.bench) Q.bench.changes.push(`${((performance.now() - Q.bench.t0) / 1000).toFixed(1)} s: ${level().name}`);
}
function notice(msg) {
  if (!Q.notice) { Q.notice = document.createElement('div'); Q.notice.className = 'q-notice'; document.body.appendChild(Q.notice); }
  Q.notice.textContent = msg; Q.notice.classList.add('on'); clearTimeout(Q.ntimer); Q.ntimer = setTimeout(() => Q.notice.classList.remove('on'), 3500);
}

// ---------------------------------------------------------------- per frame (called by site.js around every drawn frame)
export function frameStart() {
  if (Q.info) Q.info.reset();
  const g = Q.gpu; if (g && !g.q && !Q.noGpu) { g.q = g.gl.createQuery(); g.gl.beginQuery(g.ext.TIME_ELAPSED_EXT, g.q); }
  return performance.now();
}
export function frameEnd(now, t0, drew) {
  const js = performance.now() - t0, g = Q.gpu;
  if (g && g.q) { g.gl.endQuery(g.ext.TIME_ELAPSED_EXT); if (drew) g.pending.push(g.q); else g.gl.deleteQuery(g.q); g.q = null; }
  let gpuMs = null;
  if (g) {   // results arrive a few frames later
    const disjoint = g.gl.getParameter(g.ext.GPU_DISJOINT_EXT);
    while (g.pending.length && g.gl.getQueryParameter(g.pending[0], g.gl.QUERY_RESULT_AVAILABLE)) { const q = g.pending.shift(); if (!disjoint) gpuMs = g.gl.getQueryParameter(q, g.gl.QUERY_RESULT) / 1e6; g.gl.deleteQuery(q); }
    if (g.pending.length > 8) { g.pending.forEach(q => g.gl.deleteQuery(q)); g.pending.length = 0; }
    if (gpuMs != null) Q.lastGpu = gpuMs;
  }
  if (!drew) { Q.last = 0; return; }
  const interval = Q.last ? now - Q.last : 0; Q.last = now;
  if (Q.info) { Q.calls = Q.info.render.calls; Q.tris = Q.info.render.triangles; }
  if (interval) { Q.frames.push([now, interval]); Q.js.push([now, js]); if (Q.lastGpu != null) Q.gpuMs.push([now, Q.lastGpu]); }
  const cut = now - 2000; for (const a of [Q.frames, Q.js, Q.gpuMs]) while (a.length && a[0][0] < cut) a.shift();
  if (Q.bench) Q.bench.sample(interval, js, Q.calls, Q.tris);
  if (Q.mode === 'auto' && interval) { const s = Q.gov.feed(now, interval, Q.gpu && Q.lastGpu != null ? Math.max(js, Q.lastGpu) : null); if (s >= 0) setStep(s, 'auto'); }
  if (Q.overlay && now - Q.statT > 250) { Q.statT = now; paintOverlay(); }
}

// ---------------------------------------------------------------- F3 overlay
document.addEventListener('visibilitychange', () => { Q.last = 0; if (Q.gov) { Q.gov.win.length = 0; Q.gov.goodSince = null; } });   // a hidden tab is a pause, not a slow frame
document.addEventListener('keydown', e => {
  if (e.code !== 'F3' || e.repeat) return; e.preventDefault();
  Q.overlay = !Q.overlay;
  if (!Q.el) { Q.el = document.createElement('pre'); Q.el.className = 'fps-overlay'; document.body.appendChild(Q.el); }
  Q.el.classList.toggle('hidden', !Q.overlay); paintOverlay();
  if (window.TERRA_SITE && TERRA_SITE.wake) TERRA_SITE.wake(2000);
});
function paintOverlay() {
  if (!Q.el) return;
  const f = Q.frames.map(x => x[1]), mean = f.length ? f.reduce((p, q) => p + q, 0) / f.length : 0, worst = f.length ? Math.max(...f) : 0;
  const js = Q.js.length ? Q.js.reduce((p, q) => p + q[1], 0) / Q.js.length : 0, gpu = Q.gpuMs.length ? Q.gpuMs.reduce((p, q) => p + q[1], 0) / Q.gpuMs.length : null;
  const L = level(), V = window.TERRA_SITE, inDrive = V && V.drive;
  Q.el.textContent = f.length ? [
    `${(1000 / mean).toFixed(0)} fps   frame ${mean.toFixed(1)} ms (worst ${worst.toFixed(0)} ms, last 2 s)`,
    `JS ${js.toFixed(1)} ms/frame   GPU ${gpu == null ? 'n/a' : gpu.toFixed(1) + ' ms/frame'}`,
    `draw calls ${Q.calls}   triangles ${Q.tris.toLocaleString()}`,
    `quality ${L.name} (${Q.mode === 'auto' ? 'auto' : 'forced'})   pixel ratio ${(V && V.renderer ? V.renderer.getPixelRatio() : 0).toFixed(2)}   shadow ${inDrive ? L.shadowDrive : L.shadow}   AA ${Q.aa ? 'on' : 'off'}`,
  ].join('\n') : `idle: no frames drawn (render on demand)\nquality ${L.name} (${Q.mode})   F3 hides this`;
}

// ---------------------------------------------------------------- quality control in the existing quality popover
export function renderControl(host) {
  if (!host) return; let box = host.querySelector('.gfx-q');
  if (!box) { box = document.createElement('div'); box.className = 'gfx-q'; host.appendChild(box); }
  box.innerHTML = `<h4>Graphics quality</h4><div class="seg" role="group" aria-label="Graphics quality">${['auto', 'high', 'medium', 'low'].map(m => `<button type="button" data-q="${m}">${m[0].toUpperCase() + m.slice(1)}</button>`).join('')}</div><p class="hint" data-qnote></p>`;
  box.querySelectorAll('button').forEach(b => { b.onclick = e => { e.stopPropagation(); setMode(b.dataset.q); }; });
  Q.ctrl = box; paintControl();
}
function paintControl() {
  if (!Q.ctrl) return;
  Q.ctrl.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.q === Q.mode));
  Q.ctrl.querySelector('[data-qnote]').textContent = `Now: ${level().name}. Auto lowers quality when frames take longer than 20 ms and raises it slowly when they are fast. Press F3 in Site View for the frame-time overlay. Antialiasing is chosen when Site View first opens (off after Low).`;
}

// ---------------------------------------------------------------- benchmark (?bench = drive mode, ?bench=site = Site View orbit)
export const benchKind = () => (qs.has('bench') ? (qs.get('bench') === 'site' ? 'site' : 'drive') : null);
export function startBench(kind, seconds = 20, warm = 2) {
  const B = Q.bench = { kind, t0: performance.now(), iv: [], js: [], calls: [], tris: [], changes: [`0.0 s: ${level().name}`], warm, seconds, done: null };
  B.sample = (iv, js, c, t) => { const el = (performance.now() - B.t0) / 1000; if (el < warm || !iv) return; B.iv.push(iv); B.js.push(js); B.calls.push(c); B.tris.push(t); };
  return new Promise(res => { B.done = res; setTimeout(() => res(finishBench()), (seconds + warm) * 1000); });
}
function finishBench() {
  const B = Q.bench; if (!B) return null; Q.bench = null;
  const s = B.iv.slice().sort((a, b) => a - b), n = s.length, pct = p => (n ? s[Math.min(n - 1, Math.floor(p * n))] : 0), mean = a => (a.length ? a.reduce((p, q) => p + q, 0) / a.length : 0);
  const worst1 = s.slice(Math.floor(n * 0.99)), V = window.TERRA_SITE;
  const r = {
    kind: B.kind, seconds: B.seconds, frames: n, avgFps: n ? +(1000 / mean(s)).toFixed(1) : 0, low1Fps: worst1.length ? +(1000 / mean(worst1)).toFixed(1) : 0,
    frameMs: { p50: +pct(0.5).toFixed(1), p90: +pct(0.9).toFixed(1), p95: +pct(0.95).toFixed(1), p99: +pct(0.99).toFixed(1), max: +(s[n - 1] || 0).toFixed(1) },
    jsMs: +mean(B.js).toFixed(2), drawCalls: Math.round(mean(B.calls)), triangles: Math.round(mean(B.tris)), qualityEnd: level().name, mode: Q.mode, changes: B.changes,
    pixelRatio: V && V.renderer ? V.renderer.getPixelRatio() : null, devicePixelRatio: window.devicePixelRatio, viewport: `${innerWidth}x${innerHeight}`, aa: Q.aa, gpuTimer: !!Q.gpu, gpu: Q.gpuName, ua: navigator.userAgent,
  };
  const text = `TerraAnalog benchmark (${r.kind === 'site' ? 'Site View orbit' : 'drive mode'}, ${r.seconds} s)\n` +
    `average ${r.avgFps} fps, 1% low ${r.low1Fps} fps, ${r.frames} frames\n` +
    `frame time p50 ${r.frameMs.p50} ms, p90 ${r.frameMs.p90}, p95 ${r.frameMs.p95}, p99 ${r.frameMs.p99}, worst ${r.frameMs.max}\n` +
    `JS ${r.jsMs} ms/frame, draw calls ${r.drawCalls}/frame, triangles ${r.triangles.toLocaleString()}/frame\n` +
    `quality at the end: ${r.qualityEnd} (${r.mode}); changes: ${r.changes.join(' | ')}\n` +
    `pixel ratio ${r.pixelRatio} (device ${r.devicePixelRatio}), viewport ${r.viewport}, antialias ${r.aa ? 'on' : 'off'}, GPU timer ${r.gpuTimer ? 'yes' : 'no'}\nGPU: ${r.gpu}\n${r.ua}`;
  console.log('TERRA_BENCH\n' + text); console.log('TERRA_BENCH_JSON ' + JSON.stringify(r));
  window.TERRA_BENCH_RESULT = r;
  const p = document.createElement('div'); p.className = 'bench-panel';
  p.innerHTML = '<b>Benchmark finished</b><p>Copy this and send it:</p><textarea readonly rows="9"></textarea><div><button type="button" data-copy>Copy</button> <button type="button" data-close>Close</button></div>';
  p.querySelector('textarea').value = text; p.querySelector('[data-copy]').onclick = () => { const t = p.querySelector('textarea'); t.select(); try { navigator.clipboard.writeText(text); } catch (e) { document.execCommand('copy'); } };
  p.querySelector('[data-close]').onclick = () => p.remove(); document.body.appendChild(p);
  return r;
}
