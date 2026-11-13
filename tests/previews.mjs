// Rover-camera screenshots of every target site (with its top Earth analog beside it), saved to tests/previews/.
// Run: NODE_PATH=$(npm root -g) node tests/previews.mjs     (project served on http://localhost:8765/, Playwright with Chromium)
// For each target: the chase view behind the rover part-way along its route (low sun, so relief shows), and the overview. Look at them: a real ground
// must show the real place's relief; a ground labelled demo is a synthetic stand-in. Output list: tests/previews/README.txt
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/app/index.html', OUT = new URL('./previews/', import.meta.url).pathname;
const SITES = [[1, 'moon_south_pole'], [2, 'moon_apollo11'], [3, 'mars_jezero'], [4, 'mars_gale']];
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }), lines = []; let fails = 0;
for (const [card, name] of SITES) {
  const page = await (await b.newContext({ viewport: { width: 1366, height: 768 } })).newPage(), errs = [];
  page.on('console', m => { if (m.type() === 'error' && !/GPU stall|ReadPixels|willReadFrequently|GL Driver/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(BASE); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 }); await page.waitForTimeout(800);
  await page.evaluate(c => document.querySelector(`#targets .card:nth-child(${c})`).click(), card); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector('#hsList li:nth-child(1)').click());
  await page.waitForFunction(() => window.TERRA_SITE && window.TERRA_SITE.open && !document.getElementById('veil').classList.contains('on'), null, { timeout: 240000 });
  const settle = async ms => { await page.evaluate(ms => { const V = TERRA_SITE; V.cams.forEach(c => { if (c.anim) { c.camera.position.copy(c.anim.tp); c.controls.target.copy(c.anim.tt); c.anim = null; c.controls.update(); } }); V.sides.forEach((s, i) => s.ground.update(V.cams[i].camera.position, true)); V.awake = performance.now() + ms; }, ms); await page.waitForTimeout(ms + 1500); };
  const clip = await page.locator('#vpStage').boundingBox(), labels = await page.evaluate(() => [...document.querySelectorAll('.vp-label .prov')].map(e => e.textContent));
  await settle(2500); await page.screenshot({ path: `${OUT}${name}_overview.png`, clip, timeout: 180000 });
  await page.evaluate(() => { const e = document.getElementById('sunEl'); e.value = 18; e.dispatchEvent(new Event('input')); const V = TERRA_SITE; V.u = 0.3; V.snap = true; V.awake = performance.now() + 3000; }); await page.waitForTimeout(6000);
  await page.evaluate(() => { TERRA_SITE.chased = false; document.getElementById('resetCam').click(); }); await page.waitForTimeout(2500); await settle(3000); await settle(2500);
  await page.screenshot({ path: `${OUT}${name}_rover.png`, clip, timeout: 180000 });
  const st = await page.evaluate(() => TERRA_SITE.sides.map(s => ({ tris: s.ground.tris, real: !!s.patch.real })));
  lines.push(`${name}: ${name}_overview.png, ${name}_rover.png`, `  target ground: ${labels[0]}`, `  Earth ground:  ${labels[1]}`, `  triangles in the rover view: target ${st[0].tris}, Earth ${st[1].tris}; console errors: ${errs.length ? errs.join(' | ') : 'none'}`);
  if (errs.length) fails++; console.log(lines.slice(-4).join('\n')); await page.close();
}
fs.writeFileSync(OUT + 'README.txt', 'Rover-camera previews written by tests/previews.mjs (software renderer). Left: target. Right: Earth analog.\n\n' + lines.join('\n') + '\n');
await b.close(); process.exit(fails ? 1 : 0);
