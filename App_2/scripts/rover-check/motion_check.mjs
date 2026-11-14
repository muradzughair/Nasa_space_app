// Rover motion on the real ground, in the ported Site View (the old project's tests/motion_check.mjs, adapted).
// Part 1, the old grounds: Jezero and Gale (the old project's real 1 m tiles, read-only) are opened in the ported Site View at Mars gravity on
// fine regolith, as the old test did, and the old checks run unchanged: every wheel on the fine height grid, no popping, tiles under the rover at
// full detail with stitched edges on the grid, tracks laid, rest on the surface, drive mode. Their numbers can be compared with the old saved output.
// Part 2, two Earth points opened through "Simulate a rover here": the same checks.
// Both parts also check that the HUD tilt of every route sample is the tilt of the contact plane on the grid that is drawn.
// Run (dev server running, installed Edge, playwright-core on NODE_PATH): BASE=http://localhost:5183/ node scripts/rover-check/motion_check.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://localhost:5183/', LUID = process.env.LUID || '0,90766', out = [];
let fails = 0;
const OLD = new URL('../../../Rover_Sim_OldCode/Nasa_space_app-main/', import.meta.url);
const log = (...a) => { const s = a.join(' '); console.log(s); out.push(s); };
const check = (ok, what, extra = '') => { if (!ok) fails++; log(`${ok ? 'PASS' : 'FAIL'}  ${what}${extra ? '  (' + extra + ')' : ''}`); };
const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-gpu', '--ignore-gpu-blocklist', '--use-angle=d3d11', `--use-adapter-luid=${LUID}`] });
const idx = JSON.parse(fs.readFileSync(new URL('data/processed/patches_index.json', OLD)));

/** The body of the old test: walk the planned route through the pose routine and measure. Runs in the page. */
const WALK = async () => {
  const V = window.TERRA_SITE, C = await import('/src/rover/contact.js'), T = await import('/src/rover/terrain.js'), R = (await import('/src/rover/rovers.js')).R, THREE = await import('/src/rover/three.js'), S = await import('/src/rover/sim.js');
  const s = V.sides[0], A = V.runs.A[0], par = R.cfg, p = s.patch, U = T.upsample(p), half = p.size / 2, g = (x, z) => T.sampleGrid(U.h, U.M, U.dx, x, z), v = new THREE.Vector3();
  const res = { real: !!p.real, M: U.M, dx: U.dx, rover: par.name, steps: 0, hub: [], dBody: 0, dPitch: 0, tileCross: 0, sinkMax: 0, tiltErr: 0 };
  s.tracks.reset();
  let prev = null, lastTile = -1;
  const stepM = 0.25, total = Math.min(A.s[A.n - 1], 400);
  for (let d = 0, k = 0; d <= total; d += stepM) {
    while (k < A.n - 2 && A.s[k + 1] < d) k++;
    const f = Math.min(1, Math.max(0, (d - A.s[k]) / Math.max(1e-6, A.s[k + 1] - A.s[k]))), x = A.x[k] + (A.x[k + 1] - A.x[k]) * f, z = A.z[k] + (A.z[k + 1] - A.z[k]) * f;
    let dp = A.psi[k + 1] - A.psi[k]; dp = Math.atan2(Math.sin(dp), Math.cos(dp));
    const sink = A.sink[k];
    const fit = C.poseOnGround(s, x, z, A.psi[k] + dp * f, { par, ex: 1, dt: stepM / 0.5 / 60 * 8, snap: d === 0, sink, wheelAng: d / par.wheel_radius_m, moving: true });
    s.rover.root.updateMatrixWorld(true);
    if (d === 0) res.start = { bodyAboveGround: s.rover.root.position.y - (fit.c - sink), sinkMm: sink * 1000 };
    for (const w of s.rover.wheels) { w.node.getWorldPosition(v); res.hub.push(v.y - (g(v.x + half, v.z + half) - sink)); }
    const pitch = Math.atan(fit.sa) * 180 / Math.PI, bodyErr = s.rover.root.position.y - (fit.c - sink), tile = Math.floor(x / (s.ground.C * U.dx)) * 100 + Math.floor(z / (s.ground.C * U.dx));
    if (prev) { res.dBody = Math.max(res.dBody, Math.abs(bodyErr - prev.bodyErr)); res.dPitch = Math.max(res.dPitch, Math.abs(pitch - prev.pitch)); if (tile !== lastTile) res.tileCross++; }
    prev = { bodyErr, pitch }; lastTile = tile; res.steps++; res.sinkMax = Math.max(res.sinkMax, sink * 1000);
  }
  for (let k = 0; k < A.n; k++) { const f = S.contactFit(g, A.x[k], A.z[k], A.psi[k], S.wheelPoints(par)); res.tiltErr = Math.max(res.tiltErr, Math.abs(Math.atan(Math.hypot(f.sa, f.sb)) * 180 / Math.PI - A.tilt[k])); }
  res.tracks = s.tracks.n;
  const cam = s.rover.root.position.clone(); cam.y += 6; s.ground.update(cam, true);
  let near = 0, fine = 0, edge = 0;
  for (const t of s.ground.tiles) { if (t.d > 25) continue; near++; if (t.cur === 1) fine++; const pos = t.mesh.geometry.attributes.position.array; for (let i = 0; i < pos.length; i += 3) edge = Math.max(edge, Math.abs(pos[i + 1] - g(pos[i] + half, pos[i + 2] + half))); }
  res.near = near; res.fine = fine; res.edge = edge; res.tris = s.ground.tris;
  const srt = [...res.hub].sort((a, b2) => a - b2);
  res.hubSpread = srt[Math.floor(srt.length * 0.975)] - srt[Math.floor(srt.length * 0.025)]; res.hubMean = srt[srt.length >> 1]; res.hubWorst = Math.max(srt[srt.length - 1] - res.hubMean, res.hubMean - srt[0]);
  delete res.hub;
  V.snap = true; V.awake = performance.now() + 2000;
  return res;
};

async function checks(page, name, errs) {
  const r = await page.evaluate(WALK);
  log(`\n== ${name}: ${r.real ? 'real ground' : 'DEMO ground'}, fine grid ${r.M} at ${r.dx.toFixed(2)} m, rover ${r.rover}, ${r.steps} steps of 0.25 m, ${r.tileCross} tile borders crossed`);
  check(r.real, 'the ground is the real fine grid');
  check(Math.abs(r.start.bodyAboveGround) < 0.005, 'rests on the surface at the start', `body plane ${(r.start.bodyAboveGround * 1000).toFixed(1)} mm from the contact plane, computed sinkage ${r.start.sinkMm.toFixed(1)} mm`);
  check(r.hubSpread < 0.06 && r.hubWorst < 0.12, 'all wheels stay on the fine height grid', `hub height above its ground point: median ${r.hubMean.toFixed(3)} m, 95 % spread ${(r.hubSpread * 1000).toFixed(0)} mm, worst ${(r.hubWorst * 1000).toFixed(0)} mm`);
  check(r.dBody < 0.03 && r.dPitch < 4, 'no popping: body height and pitch change gradually', `largest step-to-step change: body ${(r.dBody * 1000).toFixed(1)} mm against the contact plane, pitch ${r.dPitch.toFixed(2)} deg per 0.25 m`);
  check(r.fine === r.near && r.near > 0 && r.edge < 0.25, 'tiles under the rover are at full detail and stitched edges stay on the grid', `${r.fine} of ${r.near} tiles within 25 m at 1:1, largest edge offset ${(r.edge * 1000).toFixed(0)} mm, ${r.tris} triangles`);
  check(r.tracks > 100, 'wheel tracks are laid', `${r.tracks} track samples, sinkage up to ${r.sinkMax.toFixed(1)} mm`);
  check(r.tiltErr < 0.01, 'HUD tilt is the contact-plane tilt on the drawn grid at every route sample', `largest difference ${r.tiltErr.toExponential(1)} deg, from the route being stored as float32; the HUD shows 0.1 deg`);
  await page.evaluate(() => document.getElementById('driveBtn').click());
  await page.waitForSelector('#driveChooser:not(.hidden)', { timeout: 60000 });
  await page.evaluate(() => document.querySelector('#dcCards .dc-pick:nth-child(1)').click());
  await page.waitForFunction(() => window.TERRA_DRIVE && window.TERRA_DRIVE.active, null, { timeout: 90000 });
  const d = await page.evaluate(async () => { const M = window.TERRA_DRIVE, s = M.sims[0]; for (let i = 0; i < 6000; i++) s.step({ throttle: 1, steer: i > 3000 ? 0.3 : 0, brake: 0 }, 1 / 60); return { dist: s.dist, pitch: s.readout().pitch, sink: s.readout().sinkMm }; });
  await page.waitForTimeout(4000);
  const d2 = await page.evaluate(() => { const s = window.TERRA_SITE.sides[0], M = window.TERRA_DRIVE; return { lod: s.ground.tiles.filter(t => t.cur === 1).length, y: s.rover.root.position.y, c: M.sims[0].fit.c, sink: M.sims[0].drag ? M.sims[0].drag.z : 0 }; });
  check(d.dist > 1 && Math.abs(d2.y - (d2.c - d2.sink)) < 0.05, 'drive mode: the rover drives and sits on the fine grid', `${d.dist.toFixed(1)} m driven, pitch ${d.pitch.toFixed(1)} deg, sinkage ${d.sink.toFixed(1)} mm, body ${((d2.y - (d2.c - d2.sink)) * 1000).toFixed(0)} mm from the contact plane, ${d2.lod} tiles at 1:1`);
  await page.screenshot({ path: fileURLToPath(new URL(`./previews/${name}_drive.png`, import.meta.url)) });
  await page.evaluate(() => document.getElementById('dvExit').click());
  await page.waitForFunction(() => !window.TERRA_DRIVE || !window.TERRA_DRIVE.active, null, { timeout: 90000 });
  check(errs.length === 0, 'zero console and page errors', errs.join(' | '));
}

fs.mkdirSync(new URL('./previews/', import.meta.url), { recursive: true });
async function newPage() {
  const page = await (await b.newContext({ viewport: { width: 1366, height: 768 } })).newPage(), errs = [];
  page.on('console', m => { if (m.type() === 'error' && !/GPU stall|ReadPixels|willReadFrequently|GL Driver/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(BASE);
  await page.waitForSelector('.veil.is-hidden', { timeout: 120000 });
  return { page, errs };
}

log('Part 1: the old real grounds in the ported Site View (compare with the old tests/motion_check_output.txt)');
for (const [id, name] of [['tgt_mars_jezero', 'mars_jezero'], ['tgt_mars_gale', 'mars_gale']]) {
  const e = idx.patches[id], dir = new URL(`data/processed/${e.real.dir}`, OLD);
  const fine = fs.readFileSync(new URL('fine.h16', dir)).toString('base64'), ctx = fs.readFileSync(new URL('ctx.h16', dir)).toString('base64');
  const { page, errs } = await newPage();
  await page.evaluate(async ({ id, e, fine, ctx }) => {
    const T = await import('/src/rover/terrain.js'), Site = await import('/src/rover/site.js'), Dt = await import('/src/rover/data.js');
    await import('/src/rover/rsim.css');
    const gun = async b64 => new Uint8Array(await new Response(new Blob([Uint8Array.from(atob(b64), c => c.charCodeAt(0))]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
    const F = T.decodeH16(await gun(fine), e.real.n, e.real.hscale), C = T.decodeH16(await gun(ctx), e.real.ctx.n, e.real.hscale);
    let mn = Infinity;
    for (const v of F) if (v < mn) mn = v;
    for (let i = 0; i < F.length; i++) F[i] -= mn;
    for (let i = 0; i < C.length; i++) C[i] -= mn;   // as the old loadReal did
    const prov = { elevation_source: e.elevation_source, elevation_source_id: 'old-real', elevation_resolution_m: e.elevation_resolution_m, spacing_ns_m: e.elevation_resolution_m, spacing_ew_m: null, synthetic_fine: e.synthetic_fine, fine_detail_rms_m: 0, site_center: e.site_center, date_built: e.date_built, bytes: 0, datum: 'as built by the old pipeline', missing: [], ctx: { n: e.real.ctx.n, valid: 1 }, hmin: 0, licence: ['old project tiles'] };
    const patch = T.makePatch(id, e.n, { M: e.real.n, h: F, size: e.size_m }, { n: e.real.ctx.n, h: C, size: e.real.ctx.size_m }, prov);
    Dt.D.rovers = await (await fetch('/rover/assets/models/rovers.json')).json();
    const host = document.createElement('div');
    host.className = 'rsim';
    document.body.appendChild(host);
    const ctx2 = { place: { name: id, lat: e.site_center[0], lon: e.site_center[1], kind: 'grid-point' }, target: { id: 'mars-wet', name: 'Mars (old test)', body: 'mars', custom: false, gravity: 3.71, bodyName: 'Mars' }, soil: { soil: 0.45, dust: 0.6, cls: 'fine_regolith', fromGrid: false, tempK: 220, rows: [] }, traits: { soil: 0.45, dust: 0.6, temp_mean: 220 } };
    await Site.openSite({ host, ctx: ctx2, patch, imagery: null, onBack: () => {} });
  }, { id, e, fine, ctx });
  await page.evaluate(() => document.querySelector('#gMode [data-g="target"]').click());
  await page.waitForFunction(() => window.TERRA_SITE && window.TERRA_SITE.runs && window.TERRA_SITE.sides[0] && window.TERRA_SITE.sides[0].key === 'target' && window.TERRA_SITE.sides[0].rover, null, { timeout: 120000 });
  await page.waitForTimeout(2000);
  await checks(page, name, errs);
  await page.close();
}

log('\nPart 2: Earth points opened through "Simulate a rover here" (Earth gravity, soil from the grid by rule)');
for (const [q, name] of [['25.62, 39.95', 'earth_harrat_khaybar'], ['-24.0833, -70.0167', 'earth_atacama_yungay']]) {
  const { page, errs } = await newPage();
  const search = page.locator('input[type="search"], .search input').first();
  await search.click(); await search.fill(q); await page.waitForTimeout(400); await search.press('Enter');
  await page.waitForSelector('button.rover-sim-button', { timeout: 30000 });
  await page.click('button.rover-sim-button');
  await page.waitForFunction(() => window.TERRA_SITE && window.TERRA_SITE.open && window.TERRA_SITE.runs && window.TERRA_SITE.sides[0].rover, null, { timeout: 180000 });
  await page.waitForTimeout(2000);
  await checks(page, name, errs);
  await page.close();
}
log(fails ? `\n${fails} FAILED` : '\nall passed');
fs.writeFileSync(new URL('./motion_check_output.txt', import.meta.url), out.join('\n') + '\n');
await b.close();
process.exit(fails ? 1 : 0);
