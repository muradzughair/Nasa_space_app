// Earth ground check: are the heights the wheels touch the elevation source's own heights at the same coordinates?
// For each place, builds the ground with the app's code (src/rover/earthground.ts), then at 200 random points of the 2 km patch puts a rover
// so that one wheel stands on the point, takes the wheel-contact height the view, the physics and the HUD use (contactFit on a bilinear sample
// of the fine grid), and compares it with the Copernicus DEM read independently by geotiff.js (bilinear at the source's own resolution).
// Limit 0.5 m (the synthetic detail below the source resolution is bounded at 0.45 m). Also checks that the two grounds differ.
// Run: node --import ./scripts/rover-check/ts-resolve.mjs scripts/rover-check/earth_ground_check.mjs      (needs network)
import fs from 'node:fs';
import { fromUrl } from 'geotiff';
const G = await import('../../src/rover/earthground.ts');
const { makePatch, sampleGrid } = await import('../../src/rover/terrain.js');
const { contactFit, wheelPoints } = await import('../../src/rover/sim.js');
const { loadRegistry, effective, defaultBuild } = await import('../../src/rover/rovercfg.js');
const reg = loadRegistry(JSON.parse(fs.readFileSync(new URL('../../public/rover/assets/models/rovers.json', import.meta.url))));
const W = wheelPoints(effective(reg, defaultBuild('perseverance', reg)));
const out = []; let fails = 0;
const log = (...a) => { console.log(...a); out.push(a.join(' ')); };
const ok = (name, cond, detail = '') => { if (!cond) fails++; log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`); };
const tok = (await (await fetch('https://planetarycomputer.microsoft.com/api/sas/v1/token/elevationeuwest/copernicus-dem')).json()).token;
const files = new Map();
async function geotiffHeight(lon, lat) {   // independent reader: geotiff.js on the same Copernicus COG, pixel centres at whole arc-seconds (PixelIsPoint)
  const la = Math.ceil(lat - 1e-9) - 1, lo = Math.floor(lon), name = `Copernicus_DSM_COG_10_${la >= 0 ? 'N' : 'S'}${String(Math.abs(la)).padStart(2, '0')}_00_${lo >= 0 ? 'E' : 'W'}${String(Math.abs(lo)).padStart(3, '0')}_00_DEM`;
  if (!files.has(name)) files.set(name, fromUrl(`https://elevationeuwest.blob.core.windows.net/copernicus-dem/COP30_hh/${name}.tif?${tok}`).then(t => t.getImage()));
  const im = await files.get(name), [x0, y0] = im.getOrigin(), [rx, ry] = im.getResolution(), fx = (lon - x0) / rx, fy = (lat - y0) / ry, j = Math.floor(fx), i = Math.floor(fy);
  if (j + 1 >= im.getWidth() || i + 1 >= im.getHeight()) return null;   // the bilinear cell crosses into the next file: skipped here
  const r = (await im.readRasters({ window: [j, i, j + 2, i + 2] }))[0], tx = fx - j, ty = fy - i;
  return r[0] * (1 - tx) * (1 - ty) + r[1] * tx * (1 - ty) + r[2] * (1 - tx) * ty + r[3] * tx * ty;
}
const places = [['Harrat Khaybar lava field, Saudi Arabia', 25.62, 39.95], ['Atacama near Yungay, Chile', -24.0833, -70.0167]];
const heights = [];
for (const [name, lat, lon] of places) {
  const g = await G.buildEarthGround('chk_' + name, lat, lon), p = makePatch('chk', 129, g.fine, g.ctx, g.prov), U = p.U, rnd = (s => () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32)(12345);
  log(`\n== ${name} (${lat}, ${lon}): ${g.prov.elevation_source}; fine grid ${U.M} at ${U.dx.toFixed(2)} m; synthetic detail rms ${g.prov.fine_detail_rms_m} m; ${(g.prov.bytes / 1e6).toFixed(1)} MB`);
  const sample = (x, z) => sampleGrid(U.h, U.M, U.dx, x, z);
  let worst = 0, sum = 0, n = 0, worstLin = 0;
  for (let k = 0; k < 200; k++) {
    const x = 40 + rnd() * 1920, z = 40 + rnd() * 1920, [plon, plat] = G.patchToLonLat(lat, lon, 2000, x, z), src = await geotiffHeight(plon, plat);
    if (src == null) continue;
    const q = k % W.length, psi = (k * 0.7) % 6.283, [u, v] = W[q], fx = Math.cos(psi), fz = Math.sin(psi);
    const f = contactFit(sample, x - u * fx - v * fz, z - u * fz + v * fx, psi, W);   // rover placed so that wheel q stands on the point
    const d = Math.abs(f.H[q] + g.prov.hmin - src); worst = Math.max(worst, d); sum += d; n++;
  }
  ok(`wheel-contact heights equal the source at ${n} random points within 0.5 m`, n >= 150 && worst <= 0.5, `worst ${worst.toFixed(3)} m, mean ${(sum / n).toFixed(3)} m`);
  let tw = 0; for (const t of g.prov.truth) { const d = Math.abs(sample(t.x, t.z) + g.prov.hmin - t.h); tw = Math.max(tw, d); }
  ok(`fine grid equals the app's own reading of the source at ${g.prov.truth.length} truth points within 0.5 m`, tw <= 0.5, `worst ${tw.toFixed(3)} m`);
  const a0 = 64, st = 16, M = U.M; let seam = 0;
  for (let k = a0; k <= 96; k++) seam = Math.max(seam, Math.abs(p.C.h[a0 * 161 + k] - U.h[(k - a0) * st]), Math.abs(p.C.h[k * 161 + 96] - U.h[(k - a0) * st * M + M - 1]));
  ok('context ring meets the patch at the seam', seam < 1e-3, `largest step ${seam.toFixed(4)} m`);
  heights.push({ name, abs: Array.from({ length: 50 }, (_, k) => U.h[(k * 9973) % U.h.length] + g.prov.hmin), relief: p.stats.relief, slope: p.stats.slope_med });
  log(`   relief ${p.stats.relief.toFixed(1)} m, median slope ${p.stats.slope_med.toFixed(2)} deg, lowest point ${g.prov.hmin.toFixed(1)} m`);
}
const dd = heights[0].abs.reduce((s, v, k) => s + Math.abs(v - heights[1].abs[k]), 0) / 50;
ok('the two grounds differ', dd > 10 && Math.abs(heights[0].relief - heights[1].relief) > 1, `mean absolute difference at the same grid nodes ${dd.toFixed(1)} m; relief ${heights[0].relief.toFixed(1)} vs ${heights[1].relief.toFixed(1)} m`);
log(fails ? `\n${fails} FAILED` : '\nall passed');
fs.writeFileSync(new URL('./earth_ground_check_output.txt', import.meta.url), out.join('\n') + '\n');
process.exit(fails ? 1 : 0);
