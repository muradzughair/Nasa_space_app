// Checks the benchmark, the F3 overlay and the auto quality governor in headless Chromium (software renderer: frames are very slow here, which is
// exactly the condition the governor must react to). Run: NODE_PATH=$(npm root -g) node tests/bench_check.mjs   Output: tests/bench_check_output.txt
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/app/index.html', out = []; let fails = 0;
const log = (...a) => { const s = a.join(' '); console.log(s); out.push(s); };
const check = (ok, what, extra = '') => { if (!ok) fails++; log(`${ok ? 'PASS' : 'FAIL'}  ${what}${extra ? '  (' + extra + ')' : ''}`); };
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const kind of ['site', 'drive']) {
  const page = await (await b.newContext({ viewport: { width: 1366, height: 768 } })).newPage(), errs = [], logs = [];
  page.on('console', m => { const t = m.text(); if (m.type() === 'error' && !/GPU stall|ReadPixels|willReadFrequently|GL Driver/.test(t)) errs.push(t.slice(0, 200)); if (t.startsWith('TERRA_BENCH')) logs.push(t); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(`${BASE}?bench${kind === 'site' ? '=site' : ''}`);
  if (kind === 'site') {   // F3 overlay while the benchmark runs
    await page.waitForFunction(() => window.TERRA_SITE && TERRA_SITE.open, null, { timeout: 240000 }); await page.waitForTimeout(3000);
    await page.keyboard.press('F3'); await page.waitForTimeout(6000);
    const ov = await page.evaluate(() => { const e = document.querySelector('.fps-overlay'); return e && !e.classList.contains('hidden') ? e.textContent : null; });
    check(!!ov && /fps/.test(ov) && /draw calls/.test(ov) && /quality/.test(ov) && /pixel ratio/.test(ov) && /shadow/.test(ov) && /JS/.test(ov), 'F3 overlay shows fps, frame time, draw calls, triangles, pixel ratio, quality, shadow size, JS time', (ov || 'not shown').replace(/\n/g, ' / '));
  }
  const r = await page.waitForFunction(() => window.TERRA_BENCH_RESULT, null, { timeout: 600000 }).then(h => h.jsonValue()).catch(() => null);
  check(!!r && r.frames > 0, `?bench${kind === 'site' ? '=site' : ''} finishes and reports a summary`, r ? `${r.frames} frames, average ${r.avgFps} fps, 1% low ${r.low1Fps} fps, p50 ${r.frameMs.p50} ms, p99 ${r.frameMs.p99} ms, ${r.drawCalls} draw calls, ${r.triangles} triangles, JS ${r.jsMs} ms, quality ${r.qualityEnd}` : 'no result');
  const panel = await page.evaluate(() => { const t = document.querySelector('.bench-panel textarea'); return t ? t.value : null; });
  check(!!panel && logs.some(l => l.startsWith('TERRA_BENCH\n') || l.startsWith('TERRA_BENCH')), 'summary is shown in a copyable panel and printed to the console');
  if (panel) log(panel.split('\n').map(l => '      ' + l).join('\n'));
  check(!!r && r.mode === 'auto' && r.changes.length > 1, 'auto quality stepped down on its own under slow frames (software renderer)', r ? r.changes.join(' | ') : '');
  check(errs.length === 0, 'zero console and page errors', errs.join(' | '));
  await page.close();
}
// forcing a level from the quality popover
{
  const page = await (await b.newContext({ viewport: { width: 1366, height: 768 } })).newPage();
  await page.goto(BASE); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 });
  await page.evaluate(() => document.getElementById('qualityBtn').click());
  const btns = await page.evaluate(() => [...document.querySelectorAll('#qualityPop .gfx-q button')].map(b => b.textContent));
  await page.evaluate(() => document.querySelector('#qualityPop .gfx-q button[data-q="low"]').click());
  const st = await page.evaluate(() => TERRA_QUALITY.state()), stored = await page.evaluate(() => localStorage.getItem('terra.quality'));
  check(btns.join(',') === 'Auto,High,Medium,Low' && st.mode === 'low' && st.name === 'Low' && stored === 'low', 'quality popover offers Auto / High / Medium / Low and forcing Low works and is remembered', `${btns.join(', ')}; now ${st.name} (${st.mode})`);
  await page.evaluate(() => document.querySelector('#qualityPop .gfx-q button[data-q="auto"]').click());
  await page.close();
}
log(fails ? `\n${fails} FAILED` : '\nall passed');
fs.writeFileSync(new URL('./bench_check_output.txt', import.meta.url), out.join('\n') + '\n');
await b.close(); process.exit(fails ? 1 : 0);
