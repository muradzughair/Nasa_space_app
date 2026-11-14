// Per-view render cost (run: NODE_PATH=$(npm root -g) BASE=... node tests/perf_views.mjs <label> [quality]; output tests/perf_views_<label>.json).
// Gale target, top Earth analog, 1366x768. Wraps renderer.render to record draw calls and triangles of every render call (shadow passes included),
// then reports per frame: Site View while orbiting (both panes) and drive mode while driving (main view and the Earth inset separately), the JS time
// per frame, and the JS heap sampled every second over 60 s of driving (to see sawtooth growth). quality: auto|high|medium|low (?q= on the URL).
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/app/index.html', LABEL = process.argv[2] || 'run', Q = process.argv[3] || '', HEAP_S = +(process.env.HEAP_S || 60);
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-precise-memory-info'] });
const page = await (await b.newContext({ viewport: { width: 1366, height: 768 } })).newPage(), errs = [];
page.on('console', m => { if (m.type() === 'error' && !/GPU stall|ReadPixels|willReadFrequently|GL Driver/.test(m.text())) errs.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
await page.addInitScript(() => { const raf = window.requestAnimationFrame.bind(window); window.__J = { on: false, js: [] }; window.requestAnimationFrame = cb => raf(t => { const t0 = performance.now(); try { cb(t); } finally { if (window.__J.on) window.__J.js.push(performance.now() - t0); } }); });
await page.goto(BASE + (Q ? (BASE.includes('?') ? '&' : '?') + 'q=' + Q : '')); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 }); await page.waitForTimeout(600);
await page.evaluate(() => document.querySelector('#targets .card:nth-child(4)').click()); await page.waitForTimeout(500);
await page.evaluate(() => document.querySelector('#hsList li:nth-child(1)').click());
await page.waitForFunction(() => window.TERRA_SITE && TERRA_SITE.open && !document.getElementById('veil').classList.contains('on'), null, { timeout: 240000 });
await page.waitForTimeout(3000);
await page.evaluate(() => { const r = TERRA_SITE.renderer, orig = r.render.bind(r); window.__R = { on: false, calls: [] }; r.render = (sc, cam) => { orig(sc, cam); if (window.__R.on) window.__R.calls.push({ s: sc.uuid, c: r.info.render.calls, t: r.info.render.triangles }); }; });
const grab = async (ms, act) => { await page.evaluate(() => { __R.calls = []; __R.on = true; __J.js = []; __J.on = true; }); await act(ms); return page.evaluate(() => { __R.on = false; __J.on = false; const V = TERRA_SITE, js = __J.js.slice().sort((a, b) => a - b); return { calls: __R.calls, sides: V.sides.map(s => s.scene.uuid), js: js.length ? { n: js.length, mean: +(js.reduce((p, q) => p + q, 0) / js.length).toFixed(2), p95: +js[Math.floor(js.length * 0.95)].toFixed(1), max: +js[js.length - 1].toFixed(1) } : null, q: window.TERRA_QUALITY ? TERRA_QUALITY.state() : null }; }); };
const sum = (a, k) => a.reduce((p, q) => p + q[k], 0);
const res = { label: LABEL, quality: Q || 'default' };
const site = await grab(8000, async ms => { const box = await page.locator('#paneL').boundingBox(); const t = Date.now(); let k = 0; while (Date.now() - t < ms) { const x = box.x + box.width / 2, y = box.y + box.height / 2; await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + (k++ % 2 ? -50 : 50), y, { steps: 3 }); await page.mouse.up(); } });
const pl = site.calls.filter(c => c.s === site.sides[0]), pr = site.calls.filter(c => c.s === site.sides[1]);
res.site = { frames: pl.length, leftPane: { calls: pl.length ? Math.round(sum(pl, 'c') / pl.length) : 0, tris: pl.length ? Math.round(sum(pl, 't') / pl.length) : 0 }, rightPane: { calls: pr.length ? Math.round(sum(pr, 'c') / pr.length) : 0, tris: pr.length ? Math.round(sum(pr, 't') / pr.length) : 0 }, js: site.js, q: site.q };
await page.evaluate(() => document.getElementById('driveBtn').click()); await page.waitForSelector('#driveChooser:not(.hidden)', { timeout: 90000 });
await page.evaluate(() => document.querySelector('#dcCards .dc-pick:nth-child(1)').click()); await page.waitForFunction(() => window.TERRA_DRIVE && TERRA_DRIVE.active, null, { timeout: 120000 }); await page.waitForTimeout(2000);
const heap = [];
const drive = await grab(HEAP_S * 1000, async ms => { await page.keyboard.down('KeyW'); const t = Date.now(); while (Date.now() - t < ms) { await page.waitForTimeout(1000); heap.push(await page.evaluate(() => +(performance.memory.usedJSHeapSize / 1048576).toFixed(2))); } await page.keyboard.up('KeyW'); });
const main = drive.calls.filter(c => c.s === drive.sides[0]), inset = drive.calls.filter(c => c.s === drive.sides[1]);
res.drive = { mainFrames: main.length, insetRenders: inset.length, main: { calls: main.length ? Math.round(sum(main, 'c') / main.length) : 0, tris: main.length ? Math.round(sum(main, 't') / main.length) : 0 }, inset: { calls: inset.length ? Math.round(sum(inset, 'c') / inset.length) : 0, tris: inset.length ? Math.round(sum(inset, 't') / inset.length) : 0 }, js: drive.js, q: drive.q };
res.heapMB = heap; res.heapSlopeMBperMin = heap.length > 4 ? +(((heap[heap.length - 1] - heap[1]) / ((heap.length - 2) / 60))).toFixed(2) : null; res.errors = errs;
console.log(JSON.stringify(res));
fs.writeFileSync(new URL(`./perf_views_${LABEL}.json`, import.meta.url), JSON.stringify(res, null, 1));
await b.close();
