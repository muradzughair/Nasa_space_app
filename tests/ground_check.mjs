// Ground check: are the heights the wheels touch the real ones, is the imagery aligned with the heights, and is the provenance complete?
// Run: node --experimental-default-type=module tests/ground_check.mjs     (exit code 1 on any failure; output: tests/ground_check_output.txt)
//  1. For every site with a real ground, decode its tiles with the app's own decoder, put a rover so that one wheel stands on each "truth" point
//     (heights read straight from the source file by the pipeline, at the source's own resolution) and compare the app's wheel-contact height
//     (contactFit + bilinear sample of the fine grid, the same code the view and the physics use) with the source. Limit: 0.5 m.
//  2. Provenance fields exist for every patch; demo patches are flagged synthetic; synthetic_fine is true exactly when the source is coarser than 5 m.
//  3. Imagery alignment (sites that have imagery): tests/ground_align.py correlates the image with the shading of the heights and checks that the
//     best match is at zero shift.
import fs from 'node:fs'; import zlib from 'node:zlib'; import { spawnSync } from 'node:child_process';
globalThis.document = { querySelector: () => null };
const { decodeH16, sampleGrid } = await import('../app/js/terrain.js');
const { contactFit, wheelPoints } = await import('../app/js/sim.js');
const { loadRegistry, effective, defaultBuild } = await import('../app/js/rovercfg.js');
const P = f => new URL('../' + f, import.meta.url);
const ix = JSON.parse(fs.readFileSync(P('data/processed/patches_index.json')));
const reg = loadRegistry(JSON.parse(fs.readFileSync(P('assets/models/rovers.json'))));
let fails = 0; const out = [];
const log = (...a) => { console.log(...a); out.push(a.join(' ')); };
const ok = (name, cond, detail = '') => { if (!cond) fails++; log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`); };
const FIELDS = ['elevation_source', 'elevation_resolution_m', 'imagery_source', 'imagery_resolution_m', 'synthetic_fine', 'date_built'];
const real = Object.entries(ix.patches).filter(([, e]) => e.real), demo = Object.entries(ix.patches).filter(([, e]) => !e.real);
log(`Sites with a real ground: ${real.length} of ${Object.keys(ix.patches).length}. Demo (synthetic) grounds: ${demo.length}.`);
const withImg = [];
for (const [id, e] of real) {
  log(`\n== ${id}: ${e.elevation_source}, ${e.elevation_resolution_m} m; imagery ${e.imagery_source}`);
  ok('provenance fields present', FIELDS.every(k => k in e), FIELDS.filter(k => !(k in e)).join(', '));
  ok('synthetic_fine matches the 5 m rule', e.synthetic_fine === (e.elevation_resolution_m > 5), `synthetic_fine ${e.synthetic_fine}, source ${e.elevation_resolution_m} m`);
  ok('not flagged as a synthetic base', e.synthetic_base === false);
  const r = e.real, dir = 'data/processed/' + r.dir, M = r.n, dx = e.size_m / (M - 1);
  const F = decodeH16(new Uint8Array(zlib.gunzipSync(fs.readFileSync(P(dir + 'fine.h16')))), M, r.hscale), C = decodeH16(new Uint8Array(zlib.gunzipSync(fs.readFileSync(P(dir + 'ctx.h16')))), r.ctx.n, r.hscale);
  const truth = JSON.parse(fs.readFileSync(P(dir + 'truth.json'))).points, sample = (x, z) => sampleGrid(F, M, dx, x, z);
  const cfg = effective(reg, defaultBuild(reg.defaults[id.includes('moon') ? 'moon' : 'mars'] || reg.order[0], reg)), W = wheelPoints(cfg);
  let worst = 0, sum = 0, n = 0;
  truth.forEach((t, k) => {
    const q = k % W.length, psi = (k * 0.7) % 6.283, [u, v] = W[q], fx = Math.cos(psi), fz = Math.sin(psi);
    const f = contactFit(sample, t.x - u * fx - v * fz, t.z - u * fz + v * fx, psi, W);   // rover placed so that wheel q stands on the truth point
    const d = Math.abs(f.H[q] + r.hmin - t.h); worst = Math.max(worst, d); sum += d; n++;
  });
  ok(`wheel-contact heights match the source at ${n} random points (limit 0.5 m)`, n >= 8 && worst <= 0.5, `worst ${worst.toFixed(3)} m, mean ${(sum / n).toFixed(3)} m, rover ${cfg.name}`);
  // the context ring agrees with the patch along the seam
  const a0 = Math.round((r.ctx.size_m - e.size_m) / 2 / (r.ctx.size_m / (r.ctx.n - 1))), a1 = a0 + Math.round(e.size_m / (r.ctx.size_m / (r.ctx.n - 1))), st = (M - 1) / (a1 - a0); let seam = 0;
  for (let k = a0; k <= a1; k++) seam = Math.max(seam, Math.abs(C[a0 * r.ctx.n + k] - F[(k - a0) * st]), Math.abs(C[k * r.ctx.n + a1] - F[(k - a0) * st * M + M - 1]));
  ok('context ring meets the patch at the seam', seam < 1e-3, `largest step ${seam.toFixed(4)} m`);
  if (r.img) withImg.push(id); else log(`NOTE  no imagery for this site: ${(e.missing || []).filter(m => m.startsWith('imagery')).map(m => m.replace(/https?:\/\/\S+/g, 'the source file').slice(0, 160)).join(' ') || 'none listed'}`);
}
log('\n== demo grounds');
ok('every demo ground is flagged synthetic', demo.every(([, e]) => e.synthetic_base === true && e.synthetic_fine === true), `${demo.length} patches`);
log('\n== imagery alignment');
if (!withImg.length) log('NOTE  no site has imagery yet, so there is nothing to align. The alignment method is exercised on synthetic rasters by pipeline/test_fetch_windows.py.');
else { const r = spawnSync('python3', [P('tests/ground_align.py').pathname, ...withImg], { encoding: 'utf8' }); log((r.stdout || '').trim()); ok('imagery is aligned with the heights', r.status === 0, (r.stderr || '').trim().split('\n').pop()); }
log(fails ? `\n${fails} FAILED` : '\nall passed');
fs.writeFileSync(P('tests/ground_check_output.txt'), out.join('\n') + '\n');
process.exit(fails ? 1 : 0);
