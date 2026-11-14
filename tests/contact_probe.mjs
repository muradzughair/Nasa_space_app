// A1 measurement: where are the wheels relative to the drawn ground? (run: NODE_PATH=$(npm root -g) node tests/contact_probe.mjs [exag]; project on http://localhost:8765/)
// For each rover preset, each target site and both grounds, the rover is posed by the app's own routine at rest (route start) and at 5 points along
// its route. For every wheel it prints: (a) the DRAWN mesh height under the wheel hub (read from the tile's vertex buffer, with the tile's own
// triangulation and the vertical exaggeration), (b) the height the physics uses at the same point, (c) the lowest world point of the wheel mesh and
// the drawn ground under that exact point, (d) the exaggeration. Output: tests/contact_probe_output.txt
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/app/index.html', EX = +(process.argv[2] || 1), out = [];
const log = (...a) => { const s = a.join(' '); console.log(s); out.push(s); };
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await b.newContext({ viewport: { width: 1000, height: 600 } })).newPage();
page.on('pageerror', e => log('PAGEERROR', e.message));
await page.goto(BASE); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 });
for (const card of [1, 2, 3, 4]) {
  await page.evaluate(c => { if (window.TERRA_SITE && TERRA_SITE.open) document.getElementById('siteBack').click(); }, card); await page.waitForTimeout(4500);
  await page.evaluate(c => document.querySelector(`#targets .card:nth-child(${c})`).click(), card); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector('#hsList li:nth-child(1)').click());
  await page.waitForFunction(() => window.TERRA_SITE && TERRA_SITE.open && !document.getElementById('veil').classList.contains('on'), null, { timeout: 240000 });
  for (const id of ['perseverance', 'curiosity', 'scarecrow', 'lunar_generic']) {
    const res = await page.evaluate(async ([id, EX]) => {
      const V = TERRA_SITE, RV = await import('./js/rovers.js'), T = await import('./js/terrain.js'), S = await import('./js/sim.js'), THREE = await import('./vendor/three-bundle.js');
      if (RV.R.build.id !== id) { RV.selectRover(id); for (let k = 0; k < 400 && !(RV.R.build.id === id && [...RV.R.instances].every(x => x.cfg && x.cfg.id === id) && V.sides.every(s => s.rover && s.rover.cfg.id === id)); k++) await new Promise(r => setTimeout(r, 50)); }
      const ex = document.getElementById('exag'); ex.value = EX; ex.dispatchEvent(new Event('input'));
      const meshH = (s, wx, wz) => {   // drawn surface (world y) at world (wx, wz): the tile's own vertices and triangulation
        const G = s.ground, half = G.half, U = G.U, x = wx + half, z = wz + half, C = G.C, ti = Math.min(G.T - 1, Math.max(0, Math.floor(z / (C * U.dx)))), tj = Math.min(G.T - 1, Math.max(0, Math.floor(x / (C * U.dx))));
        const t = G.tiles[ti * G.T + tj], g = t.mesh.geometry, ud = g.userData, P = g.attributes.position.array, st = ud.s, m = ud.m;
        const fx = (x - t.j0 * U.dx) / (st * U.dx), fz = (z - t.i0 * U.dx) / (st * U.dx), b = Math.min(m - 2, Math.max(0, Math.floor(fx))), a = Math.min(m - 2, Math.max(0, Math.floor(fz))), u = fx - b, w = fz - a;
        const y = k => P[k * 3 + 1], v00 = a * m + b, v10 = v00 + m, v01 = v00 + 1, v11 = v10 + 1;
        const h = u + w <= 1 ? y(v00) + (y(v01) - y(v00)) * u + (y(v10) - y(v00)) * w : y(v11) + (y(v10) - y(v11)) * (1 - u) + (y(v01) - y(v11)) * (1 - w);
        return { h: h * G.ex, stride: st };
      };
      const rows = [], box = new THREE.Box3(), v = new THREE.Vector3();
      for (const [i, s] of V.sides.entries()) {
        const A = V.runs.A[i];
        for (const u of [0, 0.15, 0.3, 0.5, 0.7, 0.9]) {
          V.u = u; V.snap = true; V.playing = false; V.sides.forEach((sd, k) => { const kf = u * (V.runs.A[k].n - 1); }); 
          V.sides.forEach((sd, k) => sd.pose.init = false);
          const kf = u * (A.n - 1), k = Math.floor(kf), x = A.x[k], z = A.z[k];
          (await import('./js/contact.js')).poseOnGround(s, x, z, A.psi[k], { par: RV.R.cfg, ex: V.exag, dt: 0.016, snap: true, sink: A.sink[k], wheelAng: 0 });
          const cam = s.rover.root.position.clone(); cam.y += 8; s.ground.update(cam, true); s.rover.root.updateMatrixWorld(true);
          for (const w of s.rover.wheels) {
            if (!w.node.visible) continue;
            w.node.getWorldPosition(v); const hubX = v.x, hubZ = v.z;
            const a = meshH(s, hubX, hubZ), phys = T.sampleH(s.patch, hubX + s.patch.size / 2, hubZ + s.patch.size / 2) * V.exag, surf = T.surfaceH(s.patch, hubX + s.patch.size / 2, hubZ + s.patch.size / 2) * V.exag;
            // lowest wheel point: over the wheel mesh vertices in world space
            let lo = Infinity, lx = 0, lz = 0, worstClear = Infinity;
            w.node.traverse(o => { if (!o.isMesh) return; const P = o.geometry.attributes.position; o.updateMatrixWorld(true); const step = Math.max(1, Math.floor(P.count / 3000)); for (let q = 0; q < P.count; q += step) { v.fromBufferAttribute(P, q).applyMatrix4(o.matrixWorld); if (v.y < lo) { lo = v.y; lx = v.x; lz = v.z; } const c = v.y - meshH(s, v.x, v.z).h; if (c < worstClear) worstClear = c; } });
            const under = meshH(s, lx, lz).h;
            rows.push({ side: i, u, w: w.name, meshHub: +a.h.toFixed(3), stride: a.stride, physCoarse: +phys.toFixed(3), physFine: +surf.toFixed(3), wheelLow: +lo.toFixed(3), groundUnderLow: +under.toFixed(3), lowMinusGround: +(lo - under).toFixed(3), worstClear: +worstClear.toFixed(3), sinkMm: +(A.sink[k] * 1000).toFixed(1), dy: +(w.dy || 0).toFixed(3), nodeScaleY: +w.node.scale.y.toFixed(3), parentIsRootModel: w.node.parent === s.rover.model });
          }
        }
      }
      return { id: RV.R.build.id, ex: V.exag, rows, cfgR: RV.R.cfg.wheel_radius_m, liftY: [...RV.R.instances][0].lift.position.y };
    }, [id, EX]);
    const R = res.rows; R.forEach(r => { r.d1 = +(r.meshHub - r.physCoarse).toFixed(3); r.d2 = +(r.meshHub - r.physFine).toFixed(3); });
    const st = (k, f) => { const a = R.filter(f || (() => true)).map(r => r[k]); return a.length ? `${Math.min(...a).toFixed(3)} / ${(a.reduce((p, q) => p + q, 0) / a.length).toFixed(3)} / ${Math.max(...a).toFixed(3)}` : '-'; };
    log(`\n== site card ${card}, rover ${res.id}, exag ${res.ex}, wheel radius ${res.cfgR}, lift ${res.liftY.toFixed(3)}`);
    for (const side of [0, 1]) {
      const f = r => r.side === side;
      log(`  ${side ? 'Earth ' : 'target'}: wheel lowest point minus drawn ground under it (min/mean/max) ${st('lowMinusGround', f)} m; worst clearance over all wheel vertices ${st('worstClear', f)} m`);
      log(`          drawn mesh at hub minus physics coarse grid ${st('d1', f)}; drawn mesh minus fine height function ${st('d2', f)}; tile stride under hubs ${[...new Set(R.filter(f).map(r => r.stride))].join(',')}; sinkage mm ${st('sinkMm', f)}; wheel travel dy ${st('dy', f)}`);
    }
    out.push(...R.filter(r => r.u === 0).map(r => '   ' + JSON.stringify(r)));
  }
}
fs.writeFileSync(new URL(`./contact_probe_output${EX === 1 ? '' : '_x' + EX}.txt`, import.meta.url), out.join('\n') + '\n');
await b.close();
