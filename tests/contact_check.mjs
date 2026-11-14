// Wheel-ground contact check (A3). Run: NODE_PATH=$(npm root -g) node tests/contact_check.mjs [--quick]   (project on http://localhost:8765/)
// For every rover preset, on every target site and its top Earth analog, the drive physics runs a fixed scripted path for 60 s of frames (60 frames
// per second, demo speed x25 so the rover crosses several terrain tiles), and the app's pose routine (contact.js) places the rover each frame at
// Vertical x 1, 2 and 5. At every frame and for every wheel the test measures, against the DRAWN ground mesh (the detail patch or tile vertex buffers with their
// own triangles, times the exaggeration) and the DRAWN wheel (every outer vertex of each wheel mesh, grousers included, on every 10th frame; a fixed 400-vertex subset on the others):
//   lowest wheel point minus ground >= -(clamped visible sinkage) - 2 mm (float tolerance), and <= 5 cm unless the wheel hangs at its travel limit.
// Screenshots from a low side camera at 3 points of the path (Vertical x 1) go to tests/previews/contact_<site>_<n>.png. Output: tests/contact_check_output.txt
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8765/app/index.html', QUICK = process.argv.includes('--quick'), out = []; let fails = 0;
const log = (...a) => { const s = a.join(' '); console.log(s); out.push(s); };
const check = (ok, what, extra = '') => { if (!ok) fails++; log(`${ok ? 'PASS' : 'FAIL'}  ${what}${extra ? '  (' + extra + ')' : ''}`); };
const SITES = [[1, 'moon_south_pole'], [2, 'moon_apollo11'], [3, 'mars_jezero'], [4, 'mars_gale']], ROVERS = ['perseverance', 'curiosity', 'scarecrow', 'lunar_generic'], EXS = [1, 2, 5];
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean), SHOTS_ONLY = !!process.env.SHOTS_ONLY;   // SHOTS_ONLY=1: drive and take the side views, no contact checks   // e.g. ONLY=moon_south_pole,lunar_generic
const siteOnly = ONLY.filter(o => SITES.some(([, n]) => n === o));
for (const [card, name] of (QUICK ? SITES.slice(2, 3) : SITES).filter(([, n]) => !siteOnly.length || siteOnly.includes(n))) {
  const page = await (await b.newContext({ viewport: { width: 1100, height: 640 } })).newPage(), errs = [];
  page.on('console', m => { if (m.type() === 'error' && !/GPU stall|ReadPixels|willReadFrequently|GL Driver/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(BASE); await page.waitForFunction(() => window.TERRA, null, { timeout: 90000 }); await page.waitForTimeout(600);
  await page.evaluate(c => document.querySelector(`#targets .card:nth-child(${c})`).click(), card); await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector('#hsList li:nth-child(1)').click());
  await page.waitForFunction(() => window.TERRA_SITE && TERRA_SITE.open && !document.getElementById('veil').classList.contains('on'), null, { timeout: 240000 });
  await page.waitForTimeout(1500);
  for (const id of (QUICK ? ROVERS.slice(0, 1) : ROVERS).filter(r => !ONLY.length || ONLY.includes(r) || !ONLY.some(o => ROVERS.includes(o)))) {
    const r = await page.evaluate(async ([id, EXS, SHOTS_ONLY]) => {
      const V = TERRA_SITE, RV = await import('./js/rovers.js'), C = await import('./js/contact.js'), DR = await import('./js/drive.js'), SO = await import('./js/soilmech.js'), THREE = await import('./vendor/three-bundle.js'), D = (await import('./js/data.js')).D;
      if (RV.R.build.id !== id) { RV.selectRover(id); for (let k = 0; k < 600 && !(V.sides.every(s => s.rover && s.rover.cfg && s.rover.cfg.id === id) && V.runs); k++) await new Promise(r => setTimeout(r, 50)); }
      V.playing = false; V.drive = { frame() {}, exit() {} };   // keep the Site View loop from posing the rovers while the test does
      const par = RV.R.cfg, t = V.ctx.target, h = V.ctx.hotspot, v = new THREE.Vector3(), M4 = new THREE.Matrix4(), res = [];
      const meshH = (G, wx, wz) => {   // drawn ground (unscaled) at world (wx, wz), from the tile's own vertex buffer and triangles
        if (G.dp) { const d = G.dp, U = G.U, fx = (wx + G.half) / U.dx - d.j0, fz = (wz + G.half) / U.dx - d.i0; if (fx >= 0 && fz >= 0 && fx <= d.n && fz <= d.n) { const P = G.dpMesh.geometry.attributes.position.array, m = d.n + 1, bb = Math.min(m - 2, Math.floor(fx)), a = Math.min(m - 2, Math.floor(fz)), u = fx - bb, w = fz - a, y = k => P[k * 3 + 1], v00 = a * m + bb, v10 = v00 + m, v01 = v00 + 1, v11 = v10 + 1; return { y: u + w <= 1 ? y(v00) + (y(v01) - y(v00)) * u + (y(v10) - y(v00)) * w : y(v11) + (y(v10) - y(v11)) * (1 - u) + (y(v01) - y(v11)) * (1 - w), st: 1 }; } }   // the full-detail patch around the rover
        const U = G.U, x = wx + G.half, z = wz + G.half, C = G.C, ti = Math.min(G.T - 1, Math.max(0, Math.floor(z / (C * U.dx)))), tj = Math.min(G.T - 1, Math.max(0, Math.floor(x / (C * U.dx))));
        const T = G.tiles[ti * G.T + tj], g = T.mesh.geometry, P = g.attributes.position.array, st = g.userData.s, m = g.userData.m;
        const fx = (x - T.j0 * U.dx) / (st * U.dx), fz = (z - T.i0 * U.dx) / (st * U.dx), bb = Math.min(m - 2, Math.max(0, Math.floor(fx))), a = Math.min(m - 2, Math.max(0, Math.floor(fz))), u = fx - bb, w = fz - a, y = k => P[k * 3 + 1], v00 = a * m + bb, v10 = v00 + m, v01 = v00 + 1, v11 = v10 + 1;
        return { y: u + w <= 1 ? y(v00) + (y(v01) - y(v00)) * u + (y(v10) - y(v00)) * w : y(v11) + (y(v10) - y(v11)) * (1 - u) + (y(v01) - y(v11)) * (1 - w), st };
      };
      for (const [j, s] of V.sides.entries()) {
        const tr = j ? h.traits : t.traits, g = j ? D.meta.gravity.earth : t.gravity, S = RV.R.reg.soils[SO.groundClass(tr)];
        const sim = new DR.DriveSim(s.patch, par, { g, mu: 0.6, soil: tr.soil, mass: par.mass_kg, S });
        // independent wheel point sets: up to 400 outer vertices per wheel mesh (radius >= 75 % of the largest), in node-local coordinates
        const wheels = s.rover.wheels.filter(w => w.node.visible).map(w => { s.rover.root.updateMatrixWorld(true); const inv = M4.clone().copy(w.node.matrixWorld).invert(), pts = []; let rmax = 0; const all = [];
          w.node.traverse(o => { if (!o.isMesh) return; const m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld), P = o.geometry.attributes.position; for (let k = 0; k < P.count; k++) { v.fromBufferAttribute(P, k).applyMatrix4(m); const rr = Math.hypot(v.y * w.node.scale.y, v.z * w.node.scale.z); all.push([v.x, v.y, v.z, rr]); if (rr > rmax) rmax = rr; } });
          const outer = all.filter(q => q[3] >= 0.6 * rmax), step = Math.max(1, Math.floor(outer.length / 400)), full = []; for (let k = 0; k < outer.length; k++) { full.push(outer[k][0], outer[k][1], outer[k][2]); if (k % step === 0) pts.push(outer[k][0], outer[k][1], outer[k][2]); } return { w, pts: new Float32Array(pts), full: new Float32Array(full) }; });
        if (!wheels.length) throw new Error(`no wheels found on ${par.id}`);
        const poses = EXS.map(() => ({ init: false })), stat = EXS.map(() => ({ minC: Infinity, maxC: -Infinity, worst: null, frames: 0, bad: 0, high: 0, hang: 0, strideMax: 0 })), shots = [];
        const sides = EXS.map((ex, e) => ({ patch: s.patch, rover: s.rover, pose: poses[e], tracks: null }));
        const steerAt = sec => sec < 15 ? 0 : sec < 25 ? 0.5 : sec < 35 ? 0 : sec < 45 ? -0.6 : 0, svMax = C.sinkVisible(1e9, par.wheel_radius_m);
        for (let fr = 0; fr <= 3600; fr++) {
          if (fr) sim.advance(1 / 60, 25, { throttle: 1, steer: steerAt(fr / 60), brake: 0 });
          const sink = sim.drag ? sim.drag.z || 0 : 0, sv = C.sinkVisible(sink, par.wheel_radius_m);
          s.ground.update(new THREE.Vector3(sim.x - s.patch.size / 2, 1e4, sim.z - s.patch.size / 2), false, [[sim.x - s.patch.size / 2, sim.z - s.patch.size / 2]]);
          for (let e = 0; e < EXS.length; e++) {
            const ex = EXS[e]; C.poseOnGround(sides[e], sim.x, sim.z, sim.psi, { par, ex, dt: 1 / 60, snap: fr === 0, sink, wheelAng: sim.wheelAng, moving: false });
            if (SHOTS_ONLY) continue;
            s.rover.root.updateMatrixWorld(true); const st = stat[e]; st.frames++;
            for (const { w, pts: sub, full } of wheels) {
              const el = w.node.matrixWorld.elements, pts = fr % 10 ? sub : full; let lo = Infinity;
              for (let k = 0; k < pts.length; k += 3) { const x = pts[k], y = pts[k + 1], z = pts[k + 2], wx = el[0] * x + el[4] * y + el[8] * z + el[12], wy = el[1] * x + el[5] * y + el[9] * z + el[13], wz = el[2] * x + el[6] * y + el[10] * z + el[14], mh = meshH(s.ground, wx, wz); if (mh.st > st.strideMax) st.strideMax = mh.st; const c = wy - mh.y * ex; if (c < lo) lo = c; }
              if (lo < st.minC) { st.minC = lo; st.worst = { fr, wheel: w.name, sinkMm: +(sv * 1000).toFixed(1) }; } if (lo > st.maxC && !w.hanging) st.maxC = lo;
              if (lo < -sv - 0.002) { st.bad++; if (!st.first) { const sc = C.wheelClearances(sides[e], ex).find(q => q.name === w.name); st.first = { fr, wheel: w.name, lo: +lo.toFixed(4), solver: sc && +sc.c.toFixed(4), hanging: w.hanging, dy: +(w.dy || 0).toFixed(3), x: +sim.x.toFixed(2), z: +sim.z.toFixed(2), full: !(fr % 10) }; } } if (!w.hanging && lo > 0.05) st.high++; if (w.hanging) st.hang++;
            }
          }
          if (j === 0 && (fr === 60 || fr === 1800 || fr === 3540)) shots.push({ fr, x: sim.x, z: sim.z, psi: sim.psi });
        }
        res.push({ side: j ? 'Earth' : 'target', dist: +sim.dist.toFixed(1), sinkVisMaxMm: +(svMax * 1000).toFixed(1), stats: stat.map((st, e) => ({ ex: EXS[e], ...st, minC: +st.minC.toFixed(4), maxC: +st.maxC.toFixed(4) })), shots });
      }
      return { id: par.id, r: par.wheel_radius_m, res };
    }, [id, SHOTS_ONLY ? [1] : EXS, SHOTS_ONLY]);
    for (const sd of SHOTS_ONLY ? [] : r.res) for (const st of sd.stats) {
      if (st.first) log('      first frame below: ' + JSON.stringify(st.first));
      check(st.bad === 0 && st.high === 0 && st.strideMax === 1, `${name} ${sd.side}, ${r.id}, Vertical x ${st.ex}: wheels rest on the drawn ground for ${st.frames} frames (${sd.dist} m driven)`,
        `lowest wheel point minus ground: min ${(st.minC * 1000).toFixed(1)} mm (allowed -${sd.sinkVisMaxMm} mm at most, the clamped sinkage), max in contact ${(st.maxC * 1000).toFixed(1)} mm; frames below ${st.bad}, above 5 cm ${st.high}; hanging wheel-frames ${st.hang}; mesh stride under wheels ${st.strideMax}`);
    }
    if (id === (QUICK ? ROVERS[0] : 'perseverance')) {   // side-view screenshots at Vertical x 1
      const shots = r.res[0].shots;
      for (const [n, sh] of shots.entries()) {
        await page.evaluate(async sh => {
          const V = TERRA_SITE, C = await import('./js/contact.js'), RV = await import('./js/rovers.js'), s = V.sides[0], half = s.patch.size / 2, THREE = await import('./vendor/three-bundle.js');
          const ex = document.getElementById('exag'); ex.value = 1; ex.dispatchEvent(new Event('input'));
          s.pose.init = false; C.poseOnGround(s, sh.x, sh.z, sh.psi, { par: RV.R.cfg, ex: 1, dt: 0.016, snap: true, sink: 0, moving: false });
          const c = V.cams[0], p = s.rover.root.position, rx = Math.sin(sh.psi), rz = -Math.cos(sh.psi);
          const T = await import('./js/terrain.js'), cx = p.x + rx * 6, cz = p.z + rz * 6, gy = T.worldH(s.patch, cx, cz);   // low side camera, kept clear of the ground between it and the rover
          let cy = Math.max(p.y, gy) + 0.9; for (let k = 1; k < 6; k++) { const f = k / 6; cy = Math.max(cy, T.worldH(s.patch, p.x + rx * 6 * f, p.z + rz * 6 * f) + 0.5 + (cy - p.y) * 0); }
          c.camera.position.set(cx, cy, cz); c.controls.target.set(p.x, p.y + 0.35, p.z); c.controls.update(); c.anim = null; V.follow = false; V.link = false;
          s.ground.update(c.camera.position, true, [[p.x, p.z]]);
          V.shotFrames = 0; V.drive = { exit() {}, frame() {   // draw only the left pane with this camera; the Site View loop must not re-pose the rover
            const r = V.renderer, cv = document.getElementById('siteCanvas'), w = Math.floor(cv.clientWidth / 2) - 1, h = cv.clientHeight; c.camera.aspect = w / h; c.camera.updateProjectionMatrix();
            s.sun.target.position.copy(p); s.sun.position.copy(p).addScaledVector(V.sunV, s.patch.size * 1.6); s.sky.position.copy(c.camera.position);
            r.setViewport(0, 0, w, h); r.setScissor(0, 0, w, h); r.render(s.scene, c.camera); V.shotFrames++; } };
        }, sh);
        await page.waitForFunction(() => TERRA_SITE.shotFrames >= 2, null, { timeout: 120000 }).catch(() => {});
        const box = await page.locator('#paneL').boundingBox();
        await page.screenshot({ path: new URL(`./previews/contact_${name}_${n + 1}.png`, import.meta.url).pathname, clip: box, timeout: 180000 });
      }
      log(`      side-view screenshots: tests/previews/contact_${name}_1..3.png`);
    }
    await page.evaluate(() => { TERRA_SITE.drive = null; });
  }
  check(errs.length === 0, `${name}: zero console and page errors`, errs.join(' | '));
  await Promise.race([page.close(), new Promise(r => setTimeout(r, 20000))]);
}
log(fails ? `\n${fails} FAILED` : '\nall passed');
fs.writeFileSync(new URL(ONLY.length || QUICK ? './contact_check_output_partial.txt' : './contact_check_output.txt', import.meta.url), out.join('\n') + '\n');
await b.close(); process.exit(fails ? 1 : 0);
