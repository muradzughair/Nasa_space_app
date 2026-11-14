// Governor check, ported from the old project's tests/quality_governor_check.mjs (main f8c350f); only the module path changed. Synthetic frame sequences: slow then fast, then a step that is too heavy.
// Run: node --import ./scripts/rover-check/ts-resolve.mjs scripts/rover-check/quality_governor_check.mjs     (exit code 1 on failure)
globalThis.localStorage = { getItem: () => null, setItem() {} }; globalThis.location = { search: '' }; globalThis.document = { addEventListener() {}, createElement: () => ({ classList: { add() {}, remove() {}, toggle() {} } }), body: { appendChild() {} } }; globalThis.window = globalThis;
const { Governor, LEVELS } = await import('../../src/rover/quality.js');
const g = new Governor(0); let t = 0, log = [];
const run = (sec, iv, busy) => { const end = t + sec * 1000; while (t < end) { t += iv; const s = g.feed(t, iv, busy); if (s >= 0) log.push(`${(t / 1000).toFixed(1)} s -> ${LEVELS[s].name}`); } };
run(10, 40, null);            // slow GPU: 25 fps
const low = g.step; run(30, 16.7, 6);   // fast again, GPU timer says 6 ms of work
const up = g.step; run(4, 40, null); run(20, 16.7, 15);  // goes up, too heavy -> back down, then 15 ms work: should not climb again
console.log(log.join('\n')); console.log('after slow:', LEVELS[low].name, '| after fast:', LEVELS[up].name, '| final:', LEVELS[g.step].name);
const g2 = new Governor(2); t = 0; for (let k = 0; k < 2000; k++) { t += 16.7; g2.feed(t, 16.7, null); } console.log('60 Hz display without GPU timer, 33 s at 16.7 ms: stays at', LEVELS[g2.step].name);
const g3 = new Governor(0); t = 0; const seen = []; for (let k = 0; k < 20; k++) { t += 4000; const s = g3.feed(t, 4000, null); if (s >= 0) seen.push(LEVELS[s].name); }
console.log('very slow frames (4 s each, software renderer):', seen.join(' -> ') || 'no change', '| final', LEVELS[g3.step].name);
if (g3.step !== LEVELS.length - 1) { console.log('FAIL: did not reach the lowest step'); process.exit(1); }
