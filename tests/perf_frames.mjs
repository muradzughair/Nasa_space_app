// Frame-time profile of Site View and drive mode (run: NODE_PATH=$(npm root -g) BASE=... node tests/perf_frames.mjs <label>; output tests/perf_frames_<label>.json).
// At 1366x768, Mars Gale target with its top Earth analog: 10 s of orbiting (mouse drags), 10 s of driving (W key held), 10 s of Play (auto route).
// For each: rAF interval (frame time as displayed; with a software renderer this is dominated by rasterising), the JS time of each frame callback
// (CPU cost of the app plus three.js draw submission), renderer.info (draw calls, triangles, geometries, textures), and the functions with the most
// self time in a CPU profile of the same 10 s.
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/app/index.html', LABEL = process.argv[2] || 'run';
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } }), page = await ctx.newPage(), cdp = await ctx.newCDPSession(page);
await page.addInitScript(() => {   // time every animation-frame callback
  const raf = window.requestAnimationFrame.bind(window); window.__F = { on: false, gap: [], js: [], last: 0 };
  window.requestAnimationFrame = cb => raf(t => { const F = window.__F, t0 = performance.now(); try { cb(t); } finally { if (F.on) { const t1 = performance.now(); F.js.push(t1 - t0); if (F.last) F.gap.push(t0 - F.last); F.last = t0; } } });
});
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto(BASE); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 }); await page.waitForTimeout(800);
await page.evaluate(() => document.querySelector('#targets .card:nth-child(4)').click()); await page.waitForTimeout(500);
await page.evaluate(() => document.querySelector('#hsList li:nth-child(1)').click());
await page.waitForFunction(() => window.TERRA_SITE && TERRA_SITE.open && !document.getElementById('veil').classList.contains('on'), null, { timeout: 240000 });
await page.waitForTimeout(4000);
const stats = a => { if (!a.length) return { n: 0 }; const s = [...a].sort((x, y) => x - y); return { n: a.length, mean: +(a.reduce((p, q) => p + q, 0) / a.length).toFixed(2), p95: +s[Math.floor(s.length * 0.95)].toFixed(1), max: +s[s.length - 1].toFixed(1), over33: a.filter(x => x > 33.4).length }; };
async function window10(name, act) {
  await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); await cdp.send('Profiler.start');
  await page.evaluate(() => { const F = window.__F; F.gap = []; F.js = []; F.last = 0; F.on = true; });
  await act();
  const r = await page.evaluate(() => { const F = window.__F; F.on = false; const V = window.TERRA_SITE, i = V.renderer.info; return { gap: F.gap, js: F.js, calls: i.render.calls, tris: i.render.triangles, geos: i.memory.geometries, tex: i.memory.textures, progs: i.programs.length, heap: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : null }; });
  const { profile } = await cdp.send('Profiler.stop');
  const self = new Map(), dtById = new Map(), nodes = new Map(profile.nodes.map(n => [n.id, n]));
  profile.samples.forEach((id, k) => dtById.set(id, (dtById.get(id) || 0) + (profile.timeDeltas[k] || 0)));
  for (const [id, us] of dtById) { const n = nodes.get(id), f = n.callFrame, key = `${f.functionName || '(anonymous)'} ${(f.url || '').split('/').pop().split('?')[0]}:${f.lineNumber + 1}`; self.set(key, (self.get(key) || 0) + us); }
  const top = [...self].filter(([k]) => !/^\((idle|program|garbage collector)\)/.test(k)).sort((a, c) => c[1] - a[1]).slice(0, 12).map(([k, us]) => `${(us / 1000).toFixed(0)} ms  ${k}`);
  const gc = [...self].filter(([k]) => /garbage collector/.test(k)).reduce((p, q) => p + q[1], 0) / 1000;
  return { name, frameMs: stats(r.gap), jsMs: stats(r.js), drawCalls: r.calls, triangles: r.tris, geometries: r.geos, textures: r.tex, programs: r.progs, heapMB: r.heap, gcMs: +gc.toFixed(0), topSelf: top };
}
const res = { label: LABEL, base: BASE, windows: [] };
res.windows.push(await window10('orbit', async () => { const box = await page.locator('#paneL').boundingBox(); const t = Date.now(); let k = 0; while (Date.now() - t < 10000) { const x = box.x + box.width / 2, y = box.y + box.height / 2; await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + (k++ % 2 ? -60 : 60), y + 10, { steps: 4 }); await page.mouse.up(); } }));
res.windows.push(await window10('play', async () => { await page.evaluate(() => { TERRA_SITE.u = 0.1; document.getElementById('playBtn').click(); }); await page.waitForTimeout(10000); await page.evaluate(() => document.getElementById('playBtn').click()); }));
await page.evaluate(() => document.getElementById('driveBtn').click()); await page.waitForSelector('#driveChooser:not(.hidden)', { timeout: 90000 });
await page.evaluate(() => document.querySelector('#dcCards .dc-pick:nth-child(1)').click()); await page.waitForFunction(() => window.TERRA_DRIVE && TERRA_DRIVE.active, null, { timeout: 120000 }); await page.waitForTimeout(2000);
res.windows.push(await window10('drive', async () => { await page.keyboard.down('KeyW'); await page.waitForTimeout(10000); await page.keyboard.up('KeyW'); }));
res.errors = errs;
for (const w of res.windows) console.log(`${w.name}: frame ms ${JSON.stringify(w.frameMs)}; JS ms ${JSON.stringify(w.jsMs)}; calls ${w.drawCalls}, tris ${w.triangles}, geos ${w.geometries}, tex ${w.textures}, heap ${w.heapMB} MB, GC ${w.gcMs} ms\n   ${w.topSelf.slice(0, 8).join('\n   ')}`);
fs.writeFileSync(new URL(`./perf_frames_${LABEL}.json`, import.meta.url), JSON.stringify(res, null, 1));
await b.close();
