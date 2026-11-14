// Pre-made rover video places (placeholders) and the simulator at marked and unmarked places, in installed Edge against the dev server.
//  - heatmap off: no marks layer, no "Rover video" section, no legend line;
//  - while the heatmap is scoring: never a marks layer; after a change of version: never the previous version's marks;
//  - the marks drawn on the globe (read from the layer's own picture) are exactly the cells whose rank, as the card shows it, is top 1.0% or better;
//  - two flagged lunar points: their marked places differ, and each matches that target's ranks;
//  - a marked cell's card: "Rover video", "To be recorded", the reason with the target's name; an unmarked cell's card has none;
//  - "Simulate a rover here" opens at a marked and at an unmarked place;
//  - a verification request for a marked place stores the planned-video entry (target, custom, rank, rule) apart from its video; one for an
//    unmarked place has none; the Markdown report and the JSON export carry it; no request counts it as a video.
// Run: BASE=http://localhost:5183/ NODE_PATH=<playwright-core> node scripts/rover-check/premade_check.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://localhost:5183/', LUID = process.env.LUID || '0,90766', out = [];
let fails = 0;
const log = (...a) => { const s = a.join(' '); console.log(s); out.push(s); };
const check = (ok, what, extra = '') => { if (!ok) fails++; log(`${ok ? 'PASS' : 'FAIL'}  ${what}${extra ? '  (' + extra + ')' : ''}`); };
const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11', `--use-adapter-luid=${LUID}`] });
const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(), errs = [], reqs = [];
page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
page.on('request', r => reqs.push(r.url()));
await page.goto(BASE);
await page.waitForSelector('.veil.is-hidden', { timeout: 120000 });
await page.waitForTimeout(1000);

// in-page helpers: the app's own modules (the dev server serves the same module instances the app uses)
await page.evaluate(() => {
  window.__t = {
    async mods() { return { H: await import('/src/analog/heatmap.ts'), G: await import('/src/analog/grid.ts'), C: await import('/src/analog/custom.ts'), S: await import('/src/state/store.ts') }; },
    /** Marks drawn on the globe (from the layer's own picture), and the cells whose card rank is top 1.0% or better (from the card's own text function). */
    async compare() {
      const { H, G, C, S } = await this.mods(), grid = await G.loadGrid(), atlas = S.store.get().atlas, profile = C.resolveProfile(atlas.profiles[atlas.body]);
      const cells = H.cachedCellScores(grid, profile), layer = window.__earth.marksLayer;
      if (!cells || !layer) return { ready: false, layer: !!layer, cells: !!cells };
      const img = layer.imageryProvider.image, g = img.getContext('2d').getImageData(0, 0, img.width, img.height).data, cols = grid.header.cols, K = img.width / cols;
      const drawn = new Set(), shown = new Set();
      for (let i = 0; i < grid.cells.length; i++) {
        const n = grid.cells[i], r0 = Math.floor(n / cols) * K, c0 = (n % cols) * K;
        if (g[(r0 * img.width + c0) * 4 + 3] === 255) drawn.add(i);
        const text = H.topShare(H.percentileRank(cells, cells.scores[i]));
        if (Number(/top ([\d.]+)%/.exec(text)[1]) <= 1) shown.add(i);
      }
      let same = drawn.size === shown.size;
      for (const i of drawn) if (!shown.has(i)) { same = false; break; }
      let best = 0;
      for (let i = 1; i < cells.scores.length; i++) if (cells.scores[i] > cells.scores[best]) best = i;
      return { ready: true, profile: profile.id, name: profile.name, drawn: drawn.size, shown: shown.size, same, cellsKey: cells.key, list: [...drawn].sort((a, b) => a - b), best: H.cellCentre(grid, best), heat: !!window.__earth.heatmapLayer };
    },
    watch() {   // samples every frame: is a marks layer present while the heatmap is still scoring, and which picture is it
      const s = this.samples = [];
      const tick = () => { if (!this.watching) return; const L = window.__earth && window.__earth.marksLayer; s.push({ scoring: !!document.querySelector('.heatmap-progress'), marks: !!L, img: L ? L.imageryProvider.image : null, t: performance.now() }); requestAnimationFrame(tick); };
      this.watching = true; requestAnimationFrame(tick);
    },
    stop() { this.watching = false; return this.samples; },
  };
});
const search = async (q) => { const s = page.locator('input[type="search"], .search input').first(); await s.click(); await s.fill(q); await page.waitForTimeout(300); await s.press('Enter'); await page.waitForTimeout(1500); };
const card = () => page.evaluate(() => { const c = document.querySelector('aside.card.reading'); return { video: !!c?.querySelector('section.rover-video'), text: c?.querySelector('section.rover-video')?.innerText ?? '', rank: c?.querySelector('.cell-heat-rows')?.innerText ?? '', sim: !!c?.querySelector('button.rover-sim-button') }; });
const setVersion = (id) => page.selectOption('.targetbar select', id);
/** Polls in Node (a Promise returned to waitForFunction counts as truthy at once). */
async function until(fn, ms = 180000) { const t0 = Date.now(); for (;;) { const r = await page.evaluate(fn); if (r) return r; if (Date.now() - t0 > ms) throw new Error('timed out: ' + fn); await page.waitForTimeout(300); } }
const marksPresent = () => page.evaluate(() => !!window.__earth.marksLayer);

log('== Heatmap off');
await page.click('.targetbar-targets button:has-text("Moon")');
await search('25.25, 40.25');
let c = await card();
check(!c.video && c.sim, 'card of the best maria cell: no "Rover video" section, "Simulate a rover here" present', JSON.stringify(c).slice(0, 120));
check(!(await marksPresent()), 'no marks layer on the globe');
check(!(await page.evaluate(() => /pre-made/i.test(document.body.innerText))), 'nothing about pre-made videos anywhere on the page');

log('\n== Heatmap on, fixed version (Moon, maria)');
await page.evaluate(() => window.__t.watch());
await page.click('button[role="switch"]:has-text("Show similarity heatmap")');
await until(() => window.__t.compare().then(r => r.ready));
await page.waitForTimeout(500);
let samples = await page.evaluate(() => window.__t.stop().map(s => ({ scoring: s.scoring, marks: s.marks })));
check(samples.some(s => s.scoring) && !samples.some(s => s.scoring && s.marks), 'no marks while the heatmap is scoring', `${samples.filter(s => s.scoring).length} frames scoring, ${samples.filter(s => s.scoring && s.marks).length} of them with marks`);
const maria = await page.evaluate(() => window.__t.compare());
check(maria.same && maria.drawn > 0, 'marked cells = cells whose shown rank is top 1.0% or better', `${maria.drawn} drawn, ${maria.shown} by the card's rank text`);
check(await page.evaluate(() => /top 1% of land cells/.test(document.querySelector('.heatmap-keys').innerText)), 'legend line about the planned pre-made videos', await page.evaluate(() => [...document.querySelectorAll('.heatmap-keys li')].pop().innerText));
await search(`${maria.best.lat}, ${maria.best.lon}`);
c = await card();
check(c.video && /To be recorded/.test(c.text) && /top 1% of land cells for the Moon, maria/.test(c.text) && /has not been made yet/.test(c.text), 'marked cell card: "Rover video", "To be recorded", reason with the target name, not made yet', c.text.replace(/\n/g, ' | '));
check(/top 0\.1%/.test(c.rank), 'the same card shows a rank within the top 1%', c.rank.replace(/\n/g, ' | '));

log('\n== Verification request at the marked place');
await page.click('aside.card.reading button.request-button');
await page.waitForSelector('.verify-premade', { timeout: 20000 });
check(true, 'request form shows the planned pre-made video', (await page.locator('.verify-premade').innerText()).replace(/\n/g, ' '));
await page.click('button:has-text("Save request")');
await page.waitForTimeout(1500);
let db = await page.evaluate(async () => { const D = await import('/src/verify/db.ts'), X = await import('/src/verify/exchange.ts'); const all = await D.loadAll(); const r = all.requests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0]; const md = X.reportMarkdown(r, [], []); const bundle = await X.buildBundle(r.id); return { r, md: md.split('\n').filter(l => /Pre-made|No video/.test(l)), json: JSON.stringify(bundle).includes('"premadeVideo"'), n: all.requests.length }; });
const pv = db.r.premadeVideo;
check(!!pv && pv.status === 'to-be-recorded' && pv.targetId === 'moon-maria' && pv.custom === false && /top 0\.1%/.test(pv.shownRank) && pv.percentileRank > 0.99 && /top 1%/.test(pv.rule), 'stored entry: status, target id and name, custom flag, rank, rule', JSON.stringify(pv));
check(db.r.video.kind === 'none' && !db.r.video.attachmentId, 'the request video is untouched ("To be recorded" is not a video)', JSON.stringify(db.r.video));
check(db.md.some(l => /Pre-made rover video: planned, to be recorded/.test(l)) && db.json, 'Markdown report and JSON export carry it', db.md.join(' / '));
await page.evaluate(async () => (await import('/src/state/store.ts')).updateVerify({ open: false }));
await page.waitForTimeout(500);

log('\n== Unmarked cell (Amazon)');
await search('-3.25, -62.25');
c = await card();
check(!c.video && c.sim, 'unmarked cell card: no "Rover video" section, simulator offered', c.rank.replace(/\n/g, ' | '));
await page.click('aside.card.reading button.request-button');
await page.waitForSelector('button:has-text("Save request")', { timeout: 20000 });
check(!(await page.locator('.verify-premade').count()), 'request form has no planned pre-made video');
await page.click('button:has-text("Save request")');
await page.waitForTimeout(1500);
db = await page.evaluate(async () => { const D = await import('/src/verify/db.ts'), X = await import('/src/verify/exchange.ts'); const all = await D.loadAll(); const r = all.requests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0]; return { has: 'premadeVideo' in r, md: X.reportMarkdown(r, [], []).includes('Pre-made rover video'), videos: all.requests.filter(x => x.video.kind !== 'none').length, total: all.requests.length }; });
check(!db.has && !db.md, 'stored request for the unmarked place has no planned-video entry, and its report none');
check(db.videos === 0, 'no request counts a planned pre-made video as a video', `${db.videos} of ${db.total} requests have a video`);
await page.evaluate(async () => (await import('/src/state/store.ts')).updateVerify({ open: false }));
await page.waitForTimeout(500);

log('\n== Simulator at an unmarked and at a marked place');
for (const [q, what] of [['-3.25, -62.25', 'unmarked (Amazon)'], [`${maria.best.lat}, ${maria.best.lon}`, 'marked (best maria cell)']]) {
  await search(q);
  await page.click('aside.card.reading button.rover-sim-button');
  const r = await page.waitForFunction(() => (window.TERRA_SITE && window.TERRA_SITE.open && window.TERRA_SITE.runs) ? 'open' : document.querySelector('.rs-load-error')?.textContent, null, { timeout: 180000 }).then(h => h.jsonValue());
  check(r === 'open', `simulator opens at the ${what} place`, r === 'open' ? await page.evaluate(() => `${window.TERRA_SITE.sides.length} pane, ${window.__rsim.prov.elevation_source}, soil ${window.__rsim.ctx.soil.cls}`) : r);
  await page.click('#siteBack');
  await page.waitForFunction(() => !document.querySelector('.rsim'), null, { timeout: 30000 });
}

log('\n== Change of version: marks follow at once, the previous ones are never shown');
const before = await page.evaluate(() => { window.__t.old = window.__earth.marksLayer.imageryProvider.image; document.querySelector('.targetbar select').addEventListener('change', () => { window.__t.changedAt = performance.now(); }, { capture: true, once: true }); window.__t.watch(); return true; });
await setVersion('moon-highlands');
await until(() => window.__t.compare().then(r => r.ready && r.profile === 'moon-highlands'));
await page.waitForTimeout(400);
samples = await page.evaluate(() => { const s = window.__t.stop(); return s.filter(x => x.t >= window.__t.changedAt).map(x => ({ scoring: x.scoring, marks: x.marks, old: x.img === window.__t.old })); });
check(before && samples.length > 0 && !samples.some(s => s.old), 'the maria marks are gone from the first frame after the change', `${samples.length} frames sampled after the change event, ${samples.filter(s => s.old).length} with the old marks`);
const high = await page.evaluate(() => window.__t.compare());
check(high.same && high.drawn > 0, 'highlands: marked cells = cells whose shown rank is top 1.0% or better', `${high.drawn} drawn, ${high.shown} by rank text`);

log('\n== Two flagged lunar points');
const lunar = [];
for (const q of ['8.3355, 33.222', '-8.97, 15.5']) {
  await page.click('.planets button:has-text("Moon")');
  await page.waitForSelector('.veil.is-hidden', { timeout: 120000 });
  await page.waitForTimeout(1000);
  await search(q);
  await page.click('button:has-text("Use this point as the target")');
  await page.waitForTimeout(2500);
  await page.click('.planets button:has-text("Earth")');
  await page.waitForSelector('.veil.is-hidden', { timeout: 120000 });
  await until(() => window.__t.compare().then(r => r.ready && r.profile.startsWith('moon-custom-')));
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => window.__t.compare());
  lunar.push(r);
  check(r.same && r.drawn > 0, `custom target "${r.name}": marked cells = cells whose shown rank is top 1.0% or better`, `${r.drawn} drawn, ${r.shown} by rank text`);
  await search(`${r.best.lat}, ${r.best.lon}`);
  const cc = await card();
  check(cc.video && cc.text.includes(`the custom target "${r.name}"`), 'its best cell\'s card names the custom target in the reason', cc.text.split('\n').find(l => /ranks in the top/.test(l)));
}
const common = lunar[0].list.filter(i => lunar[1].list.includes(i)).length;
check(lunar[0].cellsKey !== lunar[1].cellsKey && (common < lunar[0].list.length || lunar[0].list.length !== lunar[1].list.length), 'the two flagged points mark different places', `${lunar[0].list.length} and ${lunar[1].list.length} cells marked, ${common} in common`);
await page.click('aside.card.reading button.request-button');
await page.waitForSelector('.verify-premade', { timeout: 20000 });
await page.click('button:has-text("Save request")');
await page.waitForTimeout(1500);
db = await page.evaluate(async () => { const D = await import('/src/verify/db.ts'); const all = await D.loadAll(); return all.requests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0].premadeVideo; });
check(db && db.custom === true && db.targetId.startsWith('moon-custom-') && db.targetName.includes(lunar[1].name), 'request for a custom target stores custom = true and the target\'s own name', JSON.stringify(db));
await page.evaluate(async () => (await import('/src/state/store.ts')).updateVerify({ open: false }));

log('\n== Heatmap off again');
await page.click('button[role="switch"]:has-text("Show similarity heatmap")');
await page.waitForTimeout(800);
c = await card();
check(!(await marksPresent()) && !c.video, 'switching the heatmap off removes the marks and the "Rover video" section');
check(errs.length === 0, 'zero console and page errors', errs.join(' | '));
log(fails ? `\n${fails} FAILED` : '\nall passed');
fs.writeFileSync(new URL('./premade_check_output.txt', import.meta.url), out.join('\n') + '\n');
await b.close();
process.exit(fails ? 1 : 0);
