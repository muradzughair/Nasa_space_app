// Rover fleet tests: registry, effective config, Bekker sinkage and the drive/route physics.
// Run: node scripts/rover-check/rover_tests.mjs   (the old project's tests/rover_tests.mjs; only the paths to the modules, the registry and the models changed)     (exit code 1 on any failure)
import fs from 'node:fs';
globalThis.document = { querySelector: () => null };
const { loadRegistry, effective, defaultBuild, importBuild, exportBuild, tag, CUSTOM_KEYS, KEYS } = await import('../../src/rover/rovercfg.js');
const { wheelSinkage, estimate, groundClass, SoilDrag } = await import('../../src/rover/soilmech.js');
const { DriveSim, STEP, DEG } = await import('../../src/rover/drive.js');
const { analyze, frictionFromSoil, wheelPoints } = await import('../../src/rover/sim.js');
const reg = loadRegistry(JSON.parse(fs.readFileSync(new URL('../../public/rover/assets/models/rovers.json', import.meta.url))));
const G = reg.G;
let fails = 0; const out = [];
const log = (...a) => { console.log(...a); out.push(a.join(' ')); };
const ok = (name, cond, detail = '') => { if (!cond) fails++; log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`); };
const cfg = (id, ov = {}) => effective(reg, { id, ov, cos: {} });
const mu = 0.57, soil = 0.45, crrSoil = 0.06 + 0.12 * (1 - soil);

// ---- registry
ok('registry has four rovers', reg.order.length === 4, reg.order.join(','));
for (const id of reg.order) {
  const r = reg.rovers[id];
  const bad = [...KEYS, 'drive_force_max_N', 'drive_efficiency'].filter(k => { const f = r.fig[k]; return !f || typeof f.value !== 'number' || !f.unit && f.unit !== '' || !f.source_id || typeof f.verified !== 'boolean' || !(f.source_id in reg.sources); });
  ok(`${id}: every figure has value, unit, source_id, verified`, bad.length === 0, bad.join(','));
  ok(`${id}: model file exists and is under 6 MB`, fs.existsSync(new URL('../../public/rover/' + r.model_file, import.meta.url)) && fs.statSync(new URL('../../public/rover/' + r.model_file, import.meta.url)).size < 6e6);
  ok(`${id}: wheel nodes named in the registry`, r.wheel_node_names.length === r.fig.wheel_count.value);
}
ok('no unverified figure is marked verified without a source', reg.order.every(id => Object.values(reg.rovers[id].fig).every(f => !f.verified || reg.sources[f.source_id].url || f.source_id === 'model_measured')));

// ---- Scarecrow: equal wheel load on Earth to Curiosity on Mars
{
  const c = cfg('curiosity'), s = cfg('scarecrow'), wc = c.mass_kg * G.mars, ws = s.mass_kg * G.earth, d = Math.abs(ws - wc) / wc;
  ok('Scarecrow weight on Earth equals Curiosity weight on Mars within 2 percent', d < 0.02, `${ws.toFixed(0)} N vs ${wc.toFixed(0)} N, ${(100 * d).toFixed(2)} %`);
  ok('Scarecrow wheel load on Earth equals Curiosity wheel load on Mars', Math.abs(ws / s.n_wheels - wc / c.n_wheels) / (wc / c.n_wheels) < 0.02);
  ok('Scarecrow is badged TEST, Curiosity REAL', s.kind === 'test' && c.kind === 'real');
  ok('Scarecrow mass is flagged derived and unverified', s.fig.mass_kg.derived && !s.fig.mass_kg.verified);
}

// ---- badge: any change from a real preset flips REAL to CUSTOM, back to REAL when reset
{
  ok('preset is REAL', cfg('perseverance').kind === 'real');
  ok('changing mass flips to CUSTOM', cfg('perseverance', { mass_kg: 1200 }).kind === 'custom');
  ok('setting the preset value again stays REAL', cfg('perseverance', { mass_kg: 1025 }).kind === 'real');
  ok('overrides are clamped to realistic limits', cfg('perseverance', { mass_kg: 99999 }).mass_kg === 1500 && cfg('perseverance', { wheel_width_m: 0.001 }).wheel_width_m === 0.10);
  ok('wheel count 6 -> 4 drops the middle pair', cfg('perseverance', { wheel_count: 4 }).wheel_pts.length === 4 && wheelPoints(cfg('perseverance', { wheel_count: 4 })).length === 4);
  ok('wheel count 4 -> 6 adds a middle pair on the 4-wheel model', cfg('lunar_generic', { wheel_count: 6 }).wheel_pts.length === 6);
  const t = tag(reg, cfg('perseverance', { mass_kg: 1100 }).fig.mass_kg);
  ok('a user-set figure is tagged assumed with a "no source" tooltip', t.assumed && t.user && /no source/.test(t.title));
  ok('save and load round-trips', JSON.stringify(importBuild(reg, exportBuild({ id: 'curiosity', ov: { mass_kg: 800 }, cos: { color: '#aabbcc', dust: 0.3, decal: '7' } })).ov) === '{"mass_kg":800}');
}

// ---- sinkage
const S = { sand: reg.soils.sand, fine: reg.soils.fine_regolith, rocky: reg.soils.rocky };
const sink = (c, g, soilKey = 'fine', mass) => wheelSinkage(S[soilKey], c.wheel_width_m, c.wheel_radius_m, (mass ?? c.mass_kg) * g / c.n_wheels);
{
  const base = cfg('perseverance'), a = sink(base, G.mars).z;
  ok('heavier build sinks more (same soil, same gravity)', sink(cfg('perseverance', { mass_kg: 1400 }), G.mars).z > a, `${(1000 * a).toFixed(2)} -> ${(1000 * sink(cfg('perseverance', { mass_kg: 1400 }), G.mars).z).toFixed(2)} mm`);
  ok('narrower wheels sink more', sink(cfg('perseverance', { wheel_width_m: 0.2 }), G.mars).z > a, `${(1000 * sink(cfg('perseverance', { wheel_width_m: 0.2 }), G.mars).z).toFixed(2)} mm`);
  ok('wider wheels sink less', sink(cfg('perseverance', { wheel_width_m: 0.5 }), G.mars).z < a);
  ok('larger wheels sink less', sink(cfg('perseverance', { wheel_radius_m: 0.35 }), G.mars).z < a);
  ok('softer soil sinks more (fine regolith > rocky, sand > rocky)', sink(base, G.mars, 'fine').z > sink(base, G.mars, 'rocky').z && sink(base, G.mars, 'sand').z > sink(base, G.mars, 'rocky').z);
  const sm = sink(base, G.moon).z, se = sink(base, G.earth).z;
  ok('lower gravity sinks less (Moon < Mars < Earth for the same rover)', sm < a && a < se, `${(1000 * sm).toFixed(2)} < ${(1000 * a).toFixed(2)} < ${(1000 * se).toFixed(2)} mm`);
  ok('contact pressure matches load / (width x contact length)', (() => { const w = sink(base, G.mars), W = base.mass_kg * G.mars / 6; return Math.abs(w.p - W / (base.wheel_width_m * w.L)) / w.p < 1e-9; })());
  ok('ground class from traits', groundClass({ soil: 0.8, dust: 0.9 }) === 'rocky' && groundClass({ soil: 0.3, dust: 0.9 }) === 'fine_regolith' && groundClass({ soil: 0.3, dust: 0.2 }) === 'sand');
}

// ---- normal load, drive physics
const flat = (() => { const n = 129, size = 2000, dx = size / (n - 1), h = new Float32Array(n * n); return { n, size, dx, h }; })();
const slopeAlong = deg => { const n = 129, size = 2000, dx = size / (n - 1), h = new Float32Array(n * n); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) h[i * n + j] = (j * dx - 240) * Math.tan(deg * DEG); return { n, size, dx, h }; };
const mk = (pt, c, g, soilKey = 'fine', extra = {}) => new DriveSim(pt, c, { g, mu, soil, S: S[soilKey], ...extra });
const run = (s, secs, inp) => { for (let i = 0; i < secs / STEP; i++) s.step(inp); return s; };
const full = { throttle: 1, steer: 0, brake: 0 };
{
  const c = cfg('perseverance'), moon = mk(flat, c, G.moon), earth = mk(flat, c, G.earth); moon.step(full); earth.step(full);
  ok('lower gravity gives less normal load', moon.N < earth.N && Math.abs(moon.N / earth.N - G.moon / G.earth) < 1e-9, `${moon.N.toFixed(0)} N vs ${earth.N.toFixed(0)} N`);
}
{
  const a = cfg('lunar_generic'), b = cfg('lunar_generic', { wheel_width_m: 0.08, mass_kg: 700 });
  const sa = run(mk(flat, a, G.moon, 'fine'), 60, full), sb = run(mk(flat, b, G.moon, 'fine'), 60, full);
  ok('drive: the narrow heavy build sinks deeper and is slower on the same soil', sb.readout().sinkMm > sa.readout().sinkMm && sb.v < sa.v, `sink ${sa.readout().sinkMm.toFixed(1)} vs ${sb.readout().sinkMm.toFixed(1)} mm, speed ${sa.v.toFixed(3)} vs ${sb.v.toFixed(3)} m/s`);
}
{
  const small = cfg('lunar_generic', { battery_wh: 120 }), big = cfg('lunar_generic', { battery_wh: 280 });   // sized to run empty inside the 2 km test patch
  const dist = c => { const s = mk(flat, c, G.moon, 'fine'); let t = 0; while (!s.dead && t < 3600 * 40) { s.step(full); t += STEP; } return s.dist; };
  const d1 = dist(small), d2 = dist(big);
  ok('bigger battery drives further before it is empty', d2 > 1.8 * d1, `${d1.toFixed(0)} m vs ${d2.toFixed(0)} m`);
  const e = (c) => estimate(c, S.fine, { g: G.moon, mu, crr: crrSoil }).rangeM;
  ok('estimated range grows with battery', e(big) > e(small), `${e(small).toFixed(0)} m vs ${e(big).toFixed(0)} m`);
  ok('estimate and drive agree on range within 20 percent', Math.abs(e(big) - d2) / d2 < 0.20, `estimate ${e(big).toFixed(0)} m, drive ${d2.toFixed(0)} m`);
}
{
  const c = cfg('lunar_generic'), moon = estimate(c, S.fine, { g: G.moon, mu, crr: crrSoil }), earth = estimate(c, S.fine, { g: G.earth, mu, crr: crrSoil });
  ok('estimate: weight, pressure and sinkage rise with gravity; top speed falls', earth.weightN > moon.weightN && earth.pressure_kPa >= moon.pressure_kPa && earth.sinkage_m > moon.sinkage_m && earth.topSpeed < moon.topSpeed, `top speed ${moon.topSpeed.toFixed(3)} -> ${earth.topSpeed.toFixed(3)} m/s`);
}

// ---- route verdict: changing the build changes "reachable"
{
  const n = 65, size = 600, dx = size / (n - 1), h = new Float32Array(n * n), slope = new Float32Array(n * n).fill(6), rough = new Float32Array(n * n).fill(0.1);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) h[i * n + j] = j * dx * Math.tan(6 * DEG);
  const p = { n, size, dx, h, slope, rough }, route = []; for (let x = 60; x <= 540; x += 2) route.push([x, 300]);
  const an = (c, g, soilKey, mass) => analyze(p, route, c, { g, mass: mass ?? c.mass_kg, mu, soil, S: S[soilKey] }).totals;
  const base = cfg('lunar_generic'), t0 = an(base, G.moon, 'fine');
  ok('lunar rover on the Moon: 6 degree route reachable with the preset battery', t0.reachable, t0.blockers.join('; ') || `${t0.energy_Wh.toFixed(0)} Wh of ${t0.battery_wh}`);
  const tSmall = an(cfg('lunar_generic', { battery_wh: 100 }), G.moon, 'fine');
  ok('a small battery makes the same route unreachable', !tSmall.reachable && tSmall.blockers.some(b => /battery/.test(b)), tSmall.blockers.join('; '));
  const tBig = an(cfg('lunar_generic', { battery_wh: 3000 }), G.moon, 'fine');
  ok('a big battery restores it', tBig.reachable);
  const tWeak = an(cfg('lunar_generic', { motor_power_w: 50, top_speed_ms: 0.5 }), G.earth, 'sand');
  ok('on Earth the weak fast build cannot climb the route', !tWeak.reachable && tWeak.blockers.some(b => /climb/.test(b)), tWeak.blockers.join('; '));
  const wide = an(cfg('lunar_generic', { wheel_width_m: 0.4 }), G.moon, 'fine'), narrow = an(cfg('lunar_generic', { wheel_width_m: 0.08 }), G.moon, 'fine');
  ok('route: narrow wheels sink more and use more energy per metre', narrow.sink_mean_mm > wide.sink_mean_mm && narrow.e_mean > wide.e_mean, `${narrow.sink_mean_mm.toFixed(2)} vs ${wide.sink_mean_mm.toFixed(2)} mm; ${narrow.e_mean.toFixed(1)} vs ${wide.e_mean.toFixed(1)} J/m`);
  const T = an(cfg('perseverance'), G.mars, 'fine'), E = an(cfg('perseverance'), G.earth, 'sand');
  ok('route: Perseverance preset on Earth with raw mass has more weight and more energy than on Mars', E.e_mean > T.e_mean);
}

// ---- determinism with the soil term
{
  const c = cfg('curiosity'), A = run(mk(flat, c, G.mars, 'sand'), 30, { throttle: 0.8, steer: 0.3, brake: 0 }), B = run(mk(flat, c, G.mars, 'sand'), 30, { throttle: 0.8, steer: 0.3, brake: 0 });
  ok('deterministic with the soil term', ['x', 'z', 'psi', 'v', 'E'].every(k => A[k] === B[k]));
}
log(`\n${fails ? fails + ' FAILED' : 'all passed'}`);
fs.writeFileSync(new URL('./rover_tests_output.txt', import.meta.url), out.join('\n') + '\n');
process.exit(fails ? 1 : 0);
