// Smoke test for Site View (run: NODE_PATH=$(npm root -g) node tests/smoke_site.mjs [--quick] [--fresh-storage]).
// Needs the project served on http://localhost:8765/ (python -m http.server 8765 from the project root) and Playwright with Chromium.
// For 3 sites (Moon target, Mars target, Earth analog hotspot) and every rover preset it checks: both 3D views are not uniformly dark or flat,
// the comparison, explanation and rover simulation panels have content, there are no console errors, page errors or failed requests.
// It also opens drive mode and leaves it. The software renderer is slow, so the timeouts are long. Output: tests/smoke_site_output.txt
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/app/index.html';
const QUICK = process.argv.includes('--quick');
const SITES = [{ name: 'Moon target (south pole), hotspot 1', card: 1, hs: 1 }, { name: 'Mars target (Gale), hotspot 1', card: 4, hs: 1 }, { name: 'Moon target (Apollo 11), hotspot 3, a different Earth analog', card: 2, hs: 3 }];
const ROVERS = ['perseverance', 'curiosity', 'scarecrow', 'lunar_generic'];
const out = []; let fails = 0;
const log = (...a) => { const s = a.join(' '); console.log(s); out.push(s); };
const check = (ok, what, extra = '') => { if (!ok) fails++; log(`${ok ? 'PASS' : 'FAIL'}  ${what}${extra ? '  (' + extra + ')' : ''}`); };
const GPU = ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const IGNORE = /GPU stall|ReadPixels|willReadFrequently|GL Driver Message/;

const browser = await chromium.launch({ args: GPU });
async function pixelStats(page, sel) {
  const box = await page.locator(sel).boundingBox(); if (!box) return null;
  const buf = await page.screenshot({ clip: { x: box.x, y: box.y, width: box.width, height: box.height }, timeout: 120000 });
  return page.evaluate(async b64 => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = 64; c.height = 64; const g = c.getContext('2d'); g.drawImage(img, 0, 0, 64, 64);
    const d = g.getImageData(0, 0, 64, 64).data; let s = 0, s2 = 0, n = 0; for (let i = 0; i < d.length; i += 4) { const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; s += l; s2 += l * l; n++; }
    const m = s / n; return { mean: +m.toFixed(1), sd: +Math.sqrt(Math.max(0, s2 / n - m * m)).toFixed(1) };
  }, buf.toString('base64'));
}
const panelText = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return e ? e.innerText.replace(/\s+/g, ' ').trim() : ''; }, sel);

for (const site of process.argv.includes('--only-inject') ? [] : SITES) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } }), page = await ctx.newPage();
  const errs = [], bad = [];
  page.on('console', m => { if (m.type() === 'error' && !IGNORE.test(m.text())) errs.push(m.text().slice(0, 300)); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  page.on('requestfailed', r => bad.push('FAILED ' + r.url().slice(0, 150)));
  page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url().slice(0, 150)); });
  log(`\n== ${site.name}`);
  await page.goto(BASE); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 }); await page.waitForTimeout(800);
  await page.click(`#targets .card:nth-child(${site.card})`); await page.waitForTimeout(500); await page.click(`#hsList li:nth-child(${site.hs})`);
  const t0 = Date.now();
  let opened = true;
  try { await page.waitForFunction(() => window.TERRA_SITE && window.TERRA_SITE.open && !document.getElementById('veil').classList.contains('on'), null, { timeout: 240000 }); } catch (e) { opened = false; }
  check(opened, 'Site View opens', opened ? `${((Date.now() - t0) / 1000).toFixed(1)} s with a software renderer` : 'timed out');
  if (!opened) { log('errors:', errs.join(' | ')); await ctx.close(); continue; }
  await page.waitForTimeout(1500);
  const roverIds = QUICK ? ROVERS.slice(0, 2) : ROVERS;
  for (const id of roverIds) {
    if (id !== (await page.evaluate(() => window.TERRA_ROVERS && TERRA_ROVERS.build.id))) {
      await page.evaluate(() => document.getElementById('rvPick').click()); await page.waitForSelector('#rvPicker:not(.hidden)', { timeout: 120000 });
      await page.evaluate(i => document.querySelector(`.rv-pick[data-id="${i}"]`).click(), id);
      await page.waitForFunction(i => TERRA_ROVERS.build.id === i && TERRA_ROVERS.instances.size === 2 && [...TERRA_ROVERS.instances].every(x => x.cfg && x.cfg.id === i), id, { timeout: 150000 }).catch(() => {});
    }
    await page.waitForTimeout(1200); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const L = await pixelStats(page, '#paneL'), R = await pixelStats(page, '#paneR');
    const live = await page.evaluate(i => TERRA_ROVERS.build.id === i && TERRA_ROVERS.instances.size === 2, id);
    const cmp = await panelText(page, '#cmpTable'), expl = await panelText(page, '#explText'), sim = await panelText(page, '#simSec');
    const ok3d = v => v && v.mean > 12 && v.sd > 6;
    check(live, `${id}: rover selected and 2 instances built`);
    check(ok3d(L) && ok3d(R), `${id}: both 3D views show something`, `left ${JSON.stringify(L)} right ${JSON.stringify(R)}`);
    check(cmp.length > 40 && expl.length > 40 && sim.length > 80, `${id}: comparison, explanation and rover simulation panels have content`, `${cmp.length} / ${expl.length} / ${sim.length} chars`);
    check(!/Could not load/.test(await panelText(page, '#site')), `${id}: no "Could not load" notice`);
  }
  if (site === SITES[0]) {   // drive mode: open and exit
    await page.evaluate(() => document.getElementById('driveBtn').click()); await page.waitForSelector('#driveChooser:not(.hidden)', { timeout: 60000 });
    await page.evaluate(() => document.querySelector('#dcCards .dc-pick:nth-child(1)').click());
    let d = true; try { await page.waitForFunction(() => window.TERRA_DRIVE && window.TERRA_DRIVE.active, null, { timeout: 120000 }); } catch (e) { d = false; }
    check(d, 'drive mode opens'); if (d) { await page.keyboard.down('KeyW'); await page.waitForTimeout(1500); await page.keyboard.up('KeyW'); await page.evaluate(() => document.getElementById('dvExit').click()); const x = await page.waitForFunction(() => !window.TERRA_DRIVE, null, { timeout: 90000 }).then(() => true, () => false); check(x, 'drive mode exits'); }
  }
  check(errs.length === 0, 'zero console and page errors', errs.slice(0, 4).join(' | '));
  check(bad.length === 0, 'zero failed requests', bad.slice(0, 4).join(' | '));
  await ctx.close();
}

// ---- failure injection: the view must still open, draw terrain and fill all panels, and say what failed (console errors are expected here)
const SCEN = [
  { name: 'registry file missing (rovers.json 404)', route: '**/assets/models/rovers.json', fulfil: { status: 404, body: 'missing' }, expect: /rover registry/i },
  { name: 'stale or wrong registry (old rover_params format)', route: '**/assets/models/rovers.json', fulfil: { status: 200, contentType: 'application/json', body: fs.readFileSync(new URL('../assets/models/rover_params.json', import.meta.url), 'utf8') }, expect: /rover registry/i },
  { name: 'rover model fails to load (GLB 404)', route: '**/assets/models/*.glb', fulfil: { status: 404, body: 'missing' }, expect: /rover model/i },
  { name: 'ground textures fail to load', route: '**/assets/textures/ground/**', fulfil: { status: 404, body: 'missing' }, expect: /ground textures/i },
];
if (process.argv.includes('--inject') || process.argv.includes('--only-inject')) for (const sc of SCEN.filter((_, i) => !process.env.SCEN || process.env.SCEN.split(',').includes(String(i)))) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } }), page = await ctx.newPage(), errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.route(sc.route, r => r.fulfill(sc.fulfil));
  log(`\n== injected failure: ${sc.name}`);
  await page.goto(BASE); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 }); await page.waitForTimeout(800);
  await page.click('#targets .card:nth-child(4)'); await page.waitForTimeout(500); await page.click('#hsList li:nth-child(1)');
  let opened = true; try { await page.waitForFunction(() => window.TERRA_SITE && window.TERRA_SITE.open && !document.getElementById('veil').classList.contains('on'), null, { timeout: 240000 }); } catch (e) { opened = false; }
  check(opened, 'Site View still opens');
  if (opened) {
    await page.waitForTimeout(2500);
    const L = await pixelStats(page, '#paneL'), R = await pixelStats(page, '#paneR'), note = await panelText(page, '#siteNote');
    const cmp = await panelText(page, '#cmpTable'), expl = await panelText(page, '#explText'), sim = await panelText(page, '#simSec');
    const draws = v => v && v.mean > 12 && v.sd > 6;
    check(draws(L) && draws(R), 'both 3D views still draw', `left ${JSON.stringify(L)} right ${JSON.stringify(R)}`);
    check(cmp.length > 40 && expl.length > 40 && sim.length > 40, 'all three panels have content', `${cmp.length} / ${expl.length} / ${sim.length} chars`);
    check(sc.expect.test(note), 'a plain "Could not load" note names the cause', note.slice(0, 160));
  }
  check(errs.length === 0, 'no uncaught page errors', errs.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
log(`\n${fails ? fails + ' CHECKS FAILED' : 'all checks passed'}`);
fs.writeFileSync(new URL('./smoke_site_output.txt', import.meta.url), out.join('\n') + '\n');
process.exit(fails ? 1 : 0);
