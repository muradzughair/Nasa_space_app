// Performance measurements for Site View (run: NODE_PATH=$(npm root -g) BASE=http://localhost:8765/app/index.html node tests/perf_site.mjs [label]).
// Headless Chromium with a SOFTWARE renderer: absolute frame times are far slower than on a real GPU, so compare runs of this script with each other
// (same machine, same flags) and read the JS-side numbers (callback time, draw calls, triangles) as the part that carries over to real hardware.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/app/index.html', LABEL = process.argv[2] || 'run', CYCLES = +(process.env.CYCLES || 10);
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-precise-memory-info', '--js-flags=--expose-gc'] });
const page = await (await browser.newContext({ viewport: { width: 1366, height: 768 } })).newPage();
let bytes = 0, reqs = 0, errs = [];
page.on('response', async r => { try { const b = await r.body(); bytes += b.length; reqs++; } catch (e) { /* redirects, aborted */ } });
page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await page.addInitScript(() => {   // time every requestAnimationFrame callback and the gap between frames
  window.__f = { on: false, gap: [], cb: [], last: 0 };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = fn => raf(t => { const a = performance.now(); fn(t); const b = performance.now(); if (window.__f.on) { window.__f.cb.push(b - a); if (window.__f.last) window.__f.gap.push(t - window.__f.last); window.__f.last = t; } });
});
const stats = a => { if (!a.length) return { n: 0 }; const s = [...a].sort((x, y) => x - y), q = p => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return { n: a.length, mean: +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(2), p95: +q(0.95).toFixed(1), max: +s[s.length - 1].toFixed(1) }; };
const mem = () => page.evaluate(() => { gc(); const r = window.TERRA_SITE && TERRA_SITE.renderer && TERRA_SITE.renderer.info; return { heapMB: +(performance.memory.usedJSHeapSize / 1048576).toFixed(1), geometries: r ? r.memory.geometries : null, textures: r ? r.memory.textures : null, programs: r ? r.programs.length : null }; });
const res = { label: LABEL };
await page.goto(BASE); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 }); await page.waitForTimeout(1000);
res.bytesAtLoad = bytes; res.requestsAtLoad = reqs;
const open = async () => {
  await page.evaluate(() => document.querySelector('#targets .card:nth-child(4)').click()); await page.waitForTimeout(300);
  const t0 = Date.now(); await page.evaluate(() => document.querySelector('#hsList li:nth-child(1)').click());
  await page.waitForFunction(() => window.TERRA_SITE && window.TERRA_SITE.open && !document.getElementById('veil').classList.contains('on'), null, { timeout: 240000 });
  return Date.now() - t0;
};
const closeSite = async () => { await page.evaluate(() => document.getElementById('siteBack').click()); await page.waitForFunction(() => !document.getElementById('home').classList.contains('hidden') && !document.getElementById('veil').classList.contains('on'), null, { timeout: 120000 }); await page.waitForTimeout(4500); };   // the globe fly-back keeps the UI busy for about a second
res.clickToOpenMs = await open();
const marks = await page.evaluate(() => { const a = performance.getEntriesByName('site-open-start').pop(), b = performance.getEntriesByName('site-open-end').pop(); return a && b ? +(b.startTime - a.startTime).toFixed(0) : null; });
res.openSiteMs = marks; res.bytesAfterOpen = bytes; res.requestsAfterOpen = reqs;
await page.waitForTimeout(2000);
// idle for 10 s, then orbiting for 10 s with real mouse drags
await page.evaluate(() => { const f = window.__f; f.gap = []; f.cb = []; f.last = 0; f.on = true; }); await page.waitForTimeout(10000);
res.idle = await page.evaluate(() => { const f = window.__f; f.on = false; return { gap: f.gap, cb: f.cb }; }); res.idle = { gapMs: stats(res.idle.gap), callbackMs: stats(res.idle.cb) };
const box = await page.locator('#paneL').boundingBox(), cx = box.x + box.width / 2, cy = box.y + box.height / 2;
await page.evaluate(() => { const f = window.__f; f.gap = []; f.cb = []; f.last = 0; f.on = true; });
const t1 = Date.now(); await page.mouse.move(cx, cy); await page.mouse.down();
for (let k = 0; Date.now() - t1 < 10000; k++) { await page.mouse.move(cx + 140 * Math.sin(k / 8), cy + 50 * Math.cos(k / 11)); await page.waitForTimeout(16); }
await page.mouse.up();
const orb = await page.evaluate(() => { const f = window.__f; f.on = false; const i = TERRA_SITE.renderer.info.render; return { gap: f.gap, cb: f.cb, calls: i.calls, tris: i.triangles }; });
res.orbit = { gapMs: stats(orb.gap), callbackMs: stats(orb.cb), drawCallsPerFrame: orb.calls, trianglesPerFrame: orb.tris };
res.dpr = await page.evaluate(() => TERRA_SITE.renderer.getPixelRatio());
// memory over open/close cycles
res.memory = [await mem()];   // sample 0: first open; samples 1 to N: after each close and reopen
for (let c = 1; c <= CYCLES; c++) { await closeSite(); await open(); await page.waitForTimeout(800); res.memory.push(await mem()); }
res.errors = errs.slice(0, 5);
console.log(JSON.stringify(res, null, 1));
fs.writeFileSync(new URL(`./perf_${LABEL}.json`, import.meta.url), JSON.stringify(res, null, 1));
await browser.close();
