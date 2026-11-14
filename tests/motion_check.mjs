// Rover motion on the real ground (run: NODE_PATH=$(npm root -g) node tests/motion_check.mjs; project served on http://localhost:8765/).
// For the Jezero and Gale grounds it walks the rover along its planned route in 0.25 m steps through the app's own pose routine (contact.js) and checks:
//  - every wheel stays on the fine height grid (hub height above the ground under it keeps a constant offset),
//  - the body does not pop: its height follows the contact plane and the pitch changes gradually, also where the route crosses tile borders,
//  - the tiles drawn under the rover are at full detail and their stitched edges stay close to the height grid,
//  - wheel tracks are laid, and the rover rests on the surface at the start (no floating, no sinking beyond the computed sinkage).
// Then it opens drive mode, drives forward, saves a screenshot from the rover camera to tests/previews/ and leaves. Output: tests/motion_check_output.txt
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/app/index.html', out = []; let fails = 0;
const log = (...a) => { const s = a.join(' '); console.log(s); out.push(s); };
const check = (ok, what, extra = '') => { if (!ok) fails++; log(`${ok ? 'PASS' : 'FAIL'}  ${what}${extra ? '  (' + extra + ')' : ''}`); };
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [card, name] of [[3, 'mars_jezero'], [4, 'mars_gale']]) {
  const page = await (await b.newContext({ viewport: { width: 1366, height: 768 } })).newPage(), errs = [];
  page.on('console', m => { if (m.type() === 'error' && !/GPU stall|ReadPixels|willReadFrequently|GL Driver/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(BASE); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 }); await page.waitForTimeout(800);
  await page.evaluate(c => document.querySelector(`#targets .card:nth-child(${c})`).click(), card); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector('#hsList li:nth-child(1)').click());
  await page.waitForFunction(() => window.TERRA_SITE && window.TERRA_SITE.open && !document.getElementById('veil').classList.contains('on'), null, { timeout: 240000 });
  await page.waitForTimeout(2000);
  const r = await page.evaluate(async () => {
    const V = TERRA_SITE, C = await import('./js/contact.js'), T = await import('./js/terrain.js'), R = (await import('./js/rovers.js')).R, THREE = await import('./vendor/three-bundle.js');
    const s = V.sides[0], A = V.runs.A[0], par = R.cfg, p = s.patch, U = T.upsample(p), half = p.size / 2, g = (x, z) => T.sampleGrid(U.h, U.M, U.dx, x, z), v = new THREE.Vector3();
    const res = { real: !!p.real, M: U.M, dx: U.dx, rover: par.name, steps: 0, hub: [], dBody: 0, dPitch: 0, tileCross: 0, sinkMax: 0 };
    s.tracks.reset(); let prev = null, lastTile = -1; const stepM = 0.25, total = Math.min(A.s[A.n - 1], 400);
    for (let d = 0, k = 0; d <= total; d += stepM) {
      while (k < A.n - 2 && A.s[k + 1] < d) k++;
      const f = Math.min(1, Math.max(0, (d - A.s[k]) / Math.max(1e-6, A.s[k + 1] - A.s[k]))), x = A.x[k] + (A.x[k + 1] - A.x[k]) * f, z = A.z[k] + (A.z[k + 1] - A.z[k]) * f;
      let dp = A.psi[k + 1] - A.psi[k]; dp = Math.atan2(Math.sin(dp), Math.cos(dp)); const sink = A.sink[k];
      const fit = C.poseOnGround(s, x, z, A.psi[k] + dp * f, { par, ex: 1, dt: stepM / 0.5 / 60 * 8, snap: d === 0, sink, wheelAng: d / par.wheel_radius_m, moving: true });   // dt as if driving 0.5 m per 8 frames
      s.rover.root.updateMatrixWorld(true);
      if (d === 0) res.start = { bodyAboveGround: s.rover.root.position.y - (fit.c - sink), sinkMm: sink * 1000 };
      for (const w of s.rover.wheels) { w.node.getWorldPosition(v); res.hub.push(v.y - (g(v.x + half, v.z + half) - sink)); }
      const pitch = Math.atan(fit.sa) * 180 / Math.PI, bodyErr = s.rover.root.position.y - (fit.c - sink), tile = Math.floor(x / (s.ground.C * U.dx)) * 100 + Math.floor(z / (s.ground.C * U.dx));
      if (prev) { res.dBody = Math.max(res.dBody, Math.abs(bodyErr - prev.bodyErr)); res.dPitch = Math.max(res.dPitch, Math.abs(pitch - prev.pitch)); if (tile !== lastTile) res.tileCross++; }
      prev = { bodyErr, pitch }; lastTile = tile; res.steps++; res.sinkMax = Math.max(res.sinkMax, sink * 1000);
    }
    res.tracks = s.tracks.n;
    // tiles around the rover at full detail, and how far stitched edges move from the height grid
    const cam = s.rover.root.position.clone(); cam.y += 6; s.ground.update(cam, true, [[s.rover.root.position.x, s.rover.root.position.z]]);   // the app passes the rover position every frame
    // the full-detail patch must cover the rover with margin, and its interior vertices must be the height grid itself
    const G = s.ground, d = G.dp, ri = (s.rover.root.position.z + half) / U.dx - (d ? d.i0 : 0), rj = (s.rover.root.position.x + half) / U.dx - (d ? d.j0 : 0); let edge = 0;
    if (d) { const P = G.dpMesh.geometry.attributes.position.array, m = d.n + 1; for (let a = 1; a < m - 1; a++) for (let b2 = 1; b2 < m - 1; b2++) { const k = (a * m + b2) * 3; edge = Math.max(edge, Math.abs(P[k + 1] - g(P[k] + half, P[k + 2] + half))); } }
    res.near = d ? Math.min(ri, rj, d.n - ri, d.n - rj) * U.dx : -1; res.fine = d ? 1 : 0; res.edge = edge; res.tris = G.tris;
    const srt = [...res.hub].sort((a, b) => a - b); res.hubSpread = srt[Math.floor(srt.length * 0.975)] - srt[Math.floor(srt.length * 0.025)]; res.hubMean = srt[srt.length >> 1]; res.hubWorst = Math.max(srt[srt.length - 1] - res.hubMean, res.hubMean - srt[0]); delete res.hub;
    V.snap = true; V.awake = performance.now() + 2000; return res;
  });
  log(`\n== ${name}: ${r.real ? 'real ground' : 'DEMO ground'}, fine grid ${r.M} at ${r.dx.toFixed(2)} m, rover ${r.rover}, ${r.steps} steps of 0.25 m, ${r.tileCross} tile borders crossed`);
  check(r.real, 'the ground is the real fine grid');
  check(Math.abs(r.start.bodyAboveGround) < 0.005, 'rests on the surface at the start', `body plane ${(r.start.bodyAboveGround * 1000).toFixed(1)} mm from the contact plane, computed sinkage ${r.start.sinkMm.toFixed(1)} mm`);
  check(r.hubSpread < 0.06 && r.hubWorst < 0.12, 'all wheels stay on the fine height grid', `hub height above its ground point: median ${r.hubMean.toFixed(3)} m, 95 % spread ${(r.hubSpread * 1000).toFixed(0)} mm, worst ${(r.hubWorst * 1000).toFixed(0)} mm`);
  check(r.dBody < 0.03 && r.dPitch < 4, 'no popping: body height and pitch change gradually', `largest step-to-step change: body ${(r.dBody * 1000).toFixed(1)} mm against the contact plane, pitch ${r.dPitch.toFixed(2)} deg per 0.25 m`);
  check(r.fine === 1 && r.near > 8 && r.edge < 1e-4, 'the full-detail patch covers the rover and its interior is the height grid itself', `rover ${r.near.toFixed(1)} m inside the patch edge, largest interior offset ${(r.edge * 1000).toFixed(2)} mm, ${r.tris} triangles in the ground`);
  check(r.tracks > 100, 'wheel tracks are laid', `${r.tracks} track samples, sinkage up to ${r.sinkMax.toFixed(1)} mm`);
  // drive mode: enter, drive, rover-camera screenshot, exit
  await page.evaluate(() => document.getElementById('driveBtn').click()); await page.waitForSelector('#driveChooser:not(.hidden)', { timeout: 60000 });
  await page.evaluate(() => document.querySelector('#dcCards .dc-pick:nth-child(1)').click());
  await page.waitForFunction(() => window.TERRA_DRIVE && window.TERRA_DRIVE.active, null, { timeout: 90000 });
  const d = await page.evaluate(async () => { const M = TERRA_DRIVE, s = M.sims[0], y0 = TERRA_SITE.sides[0].rover.root.position.y; for (let i = 0; i < 6000; i++) s.step({ throttle: 1, steer: i > 3000 ? 0.3 : 0, brake: 0 }, 1 / 60); return { dist: s.dist, pitch: s.readout().pitch, sink: s.readout().sinkMm, y0 }; });
  const fn0 = await page.evaluate(() => TERRA_DRIVE.frameN || 0);   // the pose is smoothed per drawn frame: wait for two frames after the scripted drive
  await page.waitForFunction(n => (TERRA_DRIVE.frameN || 0) >= n + 2, fn0, { timeout: 180000 }).catch(() => {}); await page.waitForTimeout(500);
  const d2 = await page.evaluate(() => { const s = TERRA_SITE.sides[0], M = TERRA_DRIVE; return { tr: s.tracks.n, lod: s.ground.tiles.filter(t => t.cur === 1).length, y: s.rover.root.position.y, c: M.sims[0].fit.c, sink: M.sims[0].drag ? M.sims[0].drag.z : 0 }; });
  check(d.dist > 1 && Math.abs(d2.y - (d2.c - d2.sink)) < 0.05, 'drive mode: the rover drives and sits on the fine grid', `${d.dist.toFixed(1)} m driven, pitch ${d.pitch.toFixed(1)} deg, sinkage ${d.sink.toFixed(1)} mm, body ${((d2.y - (d2.c - d2.sink)) * 1000).toFixed(0)} mm from the contact plane, ${d2.lod} tiles at 1:1`);
  await page.screenshot({ path: new URL(`./previews/${name}_drive.png`, import.meta.url).pathname, timeout: 180000 });
  await page.evaluate(() => document.getElementById('dvExit').click()); await page.waitForFunction(() => !window.TERRA_DRIVE, null, { timeout: 90000 });
  check(errs.length === 0, 'zero console and page errors', errs.join(' | '));
  await Promise.race([page.close(), new Promise(r => setTimeout(r, 20000))]);   // closing a WebGL page can hang under the software renderer
}
log(fails ? `\n${fails} FAILED` : '\nall passed');
fs.writeFileSync(new URL('./motion_check_output.txt', import.meta.url), out.join('\n') + '\n');
await b.close(); process.exit(fails ? 1 : 0);
