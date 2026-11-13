// Physics checks for the drive mode (run: node --experimental-default-type=module tests/physics_check.mjs). Uses synthetic patches and rover_params.json.
import fs from 'node:fs';
globalThis.document = { querySelector: () => null };   // data.js reads a meta tag at import time
const { DriveSim, STEP, DEG } = await import('../app/js/drive.js');
const { frictionFromSoil } = await import('../app/js/sim.js');
const P = JSON.parse(fs.readFileSync(new URL('../assets/models/rover_params.json', import.meta.url)));
const BODY = { moon: 1.62, mars: 3.71, earth: 9.81 };
function patch(fn, n = 129, size = 2000) {
  const dx = size / (n - 1), h = new Float32Array(n * n); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) h[i * n + j] = fn(j * dx, i * dx);
  return { n, size, dx, h };
}
const flat = patch(() => 0);
const slopeAlong = deg => patch(x => (x - 240) * Math.tan(deg * DEG));       // rises along +x (the start heading)
const slopeSide = deg => patch((x, z) => -(z - 1000) * Math.tan(deg * DEG));  // rises to the right of the start heading (right = -z)
const mk = (pt, rover, body, soil, mass) => new DriveSim(pt, P.rovers[rover], { g: BODY[body], mu: frictionFromSoil(soil), soil, mass: mass ?? P.rovers[rover].mass_kg });
const run = (sim, secs, inp) => { for (let i = 0; i < secs / STEP; i++) sim.step(typeof inp === 'function' ? inp(i * STEP) : inp); return sim; };
const out = []; const log = (...a) => { console.log(...a); out.push(a.join(' ')); };
const soil = 0.45;
for (const rover of ['lunar_generic', 'perseverance']) {
  log(`\n== ${rover}: full throttle on flat ground, soil ${soil}, mu ${frictionFromSoil(soil).toFixed(2)}`);
  for (const body of ['moon', 'mars', 'earth']) {
    const s = mk(flat, rover, body, soil); let a0 = null;
    for (let i = 0; i < 0.5 / STEP; i++) { s.step({ throttle: 1, steer: 0, brake: 0 }); if (i === 5) a0 = s.aLong; }
    const r = s.readout(); const s2 = mk(flat, rover, body, soil); s2.step({ throttle: 1, steer: 0, brake: 0 }); const a1 = s2.v / STEP;
    run(s, 20, { throttle: 1, steer: 0, brake: 0 }); const r2 = s.readout();
    log(`${body.padEnd(5)} g=${BODY[body]}: first-step accel ${a1.toFixed(2)} m/s2 (traction cap mu N/m = ${(r.muN / s.m).toFixed(2)}, motor cap ${(P.rovers[rover].drive_force_max_N / s.m).toFixed(2)}), wheel spin at launch ${(s2.spin * 100).toFixed(0)}%, terminal speed ${r2.speed.toFixed(3)} m/s (${(100 * r2.speed / P.rovers[rover].max_speed_mps).toFixed(0)}% of max), power ${r2.power.toFixed(0)} W`);
  }
}
log('\n== Braking from terminal speed (L2): stopping distance');
for (const body of ['moon', 'mars', 'earth']) { const s = mk(flat, 'lunar_generic', body, soil); run(s, 15, { throttle: 1, steer: 0, brake: 0 }); const x0 = s.x, v0 = s.v; let t = 0; while (s.v > 1e-4 && t < 30) { s.step({ throttle: -1, steer: 0, brake: 0 }); t += STEP; } log(`${body.padEnd(5)} v0 ${v0.toFixed(3)} m/s stops in ${(s.x - x0).toFixed(4)} m, ${t.toFixed(2)} s (decel cap mu g = ${(frictionFromSoil(soil) * BODY[body]).toFixed(2)} m/s2)`); }
log('\n== Hill holding and sliding (parked, no input), friction limit atan(mu) = ' + (Math.atan(frictionFromSoil(soil)) / DEG).toFixed(1) + ' deg');
for (const body of ['moon', 'earth']) for (const deg of [20, 25, 27, 30, 35]) {
  const s = mk(slopeAlong(deg), 'perseverance', body, soil); run(s, 10, { throttle: 0, steer: 0, brake: 0 });
  const mv = Math.hypot(s.x - 240, 0); log(`${body.padEnd(5)} along-slope ${deg} deg: ${s.v < -0.01 || Math.abs(s.x - 240) > 0.5 ? 'SLIDES' : 'holds'} (v ${s.v.toFixed(3)} m/s, moved ${(s.x - 240).toFixed(2)} m)`);
}
for (const body of ['moon', 'earth']) for (const deg of [20, 25, 27, 30, 35]) {
  const s = mk(slopeSide(deg), 'perseverance', body, soil); run(s, 10, { throttle: 0, steer: 0, brake: 0 });
  log(`${body.padEnd(5)} side-slope ${deg} deg: ${Math.abs(s.u) > 0.01 || Math.abs(s.z - 1000) > 0.5 ? 'SLIDES sideways' : 'holds'} (lateral v ${s.u.toFixed(3)} m/s, moved ${(s.z - 1000).toFixed(2)} m)`);
}
log('\n== Climbing: energy per metre rises with uphill slope (lunar rover, Mars, steady 70% throttle)');
for (const deg of [0, 3, 6, 9]) {
  const s = mk(slopeAlong(deg), 'lunar_generic', 'mars', soil); run(s, 12, { throttle: 0.7, steer: 0, brake: 0 }); s.bins = []; s.binS = 0; s.binE = 0; run(s, 60, { throttle: 0.7, steer: 0, brake: 0 });
  const r = s.readout(); log(`slope ${deg} deg: speed ${r.speed.toFixed(3)} m/s, drive energy ${(r.epm ?? NaN).toFixed(0)} J/m, power ${r.power.toFixed(0)} W`);
}
log('\n== Same slope, three bodies: can the lunar rover climb 6 deg at full throttle?');
for (const body of ['moon', 'mars', 'earth']) { const s = mk(slopeAlong(6), 'lunar_generic', body, soil); run(s, 30, { throttle: 1, steer: 0, brake: 0 }); log(`${body.padEnd(5)} speed ${s.v.toFixed(3)} m/s, climbed ${(s.x - 240).toFixed(1)} m in 30 s`); }
log('\n== Downhill at full throttle (speed governor): 8 deg downhill, lunar rover, no runaway');
for (const body of ['moon', 'mars', 'earth']) { const s = mk(slopeAlong(-8), 'lunar_generic', body, soil); run(s, 40, { throttle: 1, steer: 0, brake: 0 }); log(`${body.padEnd(5)} speed ${s.v.toFixed(3)} m/s (max ${P.rovers.lunar_generic.max_speed_mps}), drive power ${((s.P - P.rovers.lunar_generic.base_power_W)).toFixed(0)} W`); }
log('\n== Determinism: two runs, same scripted inputs, bitwise equal state');
const script = t => ({ throttle: Math.sin(t * 0.7), steer: Math.cos(t * 0.3) * 0.8, brake: t > 12 && t < 13 ? 1 : 0 });
const rough = patch((x, z) => 6 * Math.sin(x * 0.011) * Math.cos(z * 0.017) + 3 * Math.sin(x * 0.05));
const A = mk(rough, 'perseverance', 'mars', 0.5), B = mk(rough, 'perseverance', 'mars', 0.5); run(A, 30, script); run(B, 30, script);
log('identical:', ['x', 'z', 'psi', 'v', 'u', 'E'].every(k => A[k] === B[k]), `(x ${A.x.toFixed(6)}, z ${A.z.toFixed(6)}, E ${(A.E / 3600).toFixed(4)} Wh)`);
log('\n== Battery: runs to empty and stops');
{ const s = mk(flat, 'lunar_generic', 'moon', 0.5); s.m = s.m; let t = 0; while (!s.dead && t < 3600 * 6) { s.step({ throttle: 1, steer: 0, brake: 0 }); t += STEP * 1; if (s.simT % 1 < STEP) { } } log(`empty after ${(s.simT / 3600).toFixed(2)} sim h, ${s.dist.toFixed(0)} m, then speed ${(run(s, 5, { throttle: 1, steer: 0, brake: 0 }).v).toFixed(4)} m/s`); }
fs.writeFileSync(new URL('./physics_check_output.txt', import.meta.url), out.join('\n') + '\n');
