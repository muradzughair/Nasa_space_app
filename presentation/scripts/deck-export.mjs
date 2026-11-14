// Exports real heatmap scores for the presentation deck (presentation/index.html, presentation/assets/analog-cells.js).
// Use, from the repository root: node --import ./scripts/rover-check/ts-resolve.mjs presentation/scripts/deck-export.mjs <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
const buf = readFileSync(new URL('../../public/data/grid.bin', import.meta.url));
globalThis.fetch = async () => ({ ok: true, arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) });
const { loadGrid } = await import('../../src/analog/grid.ts');
const { scoreCell, cellCentre } = await import('../../src/analog/heatmap.ts');
const { PROFILES } = await import('../../src/analog/scoring.ts');
const grid = await loadGrid();
const out = { count: grid.cells.length, profiles: {} };
for (const id of ['moon-maria', 'mars-modern', 'moon-pole', 'mars-volcanic']) {
  const p = PROFILES.find(x => x.id === id);
  if (!p) { console.log('missing', id); continue; }
  const t0 = performance.now();
  const s = Array.from(grid.cells, (_, i) => scoreCell(grid, i, p));
  const ms = performance.now() - t0;
  const sorted = [...s].sort((a, b) => a - b);
  const q = f => sorted[Math.round(f * (sorted.length - 1))];
  const thr = q(0.98);
  const top = [];
  s.forEach((v, i) => { if (v >= thr) { const c = cellCentre(grid, i); top.push([+c.lat.toFixed(2), +c.lon.toFixed(2), +v.toFixed(3)]); } });
  top.sort((a, b) => b[2] - a[2]);
  out.profiles[id] = { name: p.name, ms: Math.round(ms), median: q(0.5), p99: q(0.99), max: q(1), top1: s.filter(v => v >= q(0.99)).length, cells: top };
  console.log(id, p.name, 'ms', Math.round(ms), 'median', q(0.5).toFixed(3), 'p99', q(0.99).toFixed(3), 'max', q(1).toFixed(3), 'top2%', top.length, 'best', top.slice(0, 5));
}
writeFileSync(process.argv[2], JSON.stringify(out));
const { cellAt } = await import('../../src/analog/grid.ts');
const { evaluate } = await import('../../src/analog/scoring.ts');
for (const [id, pts] of Object.entries(out.profiles)) {
  console.log('--', id);
  for (const [la, lo, v] of pts.cells.slice(0, 8)) { const c = cellAt(grid, la, lo); console.log(la, lo, v, c.measures.lithology, c.features.volcanoName, c.features.impactName, Math.round(c.measures.precipitation)+'mm'); }
}
// benchmark sites as cell values for maria / mars-modern
const B = [['Craters of the Moon',43.37,-113.49],['Yungay, Atacama',-24.08,-69.92],['Rio Tinto',37.72,-6.55],['Mauna Kea',19.82,-155.47],['Amazon',-3.25,-62.25],['Haughton',75.38,-89.67],['Lonar',19.98,76.51],['Askja',65.03,-16.75]];
for (const id of ['moon-maria','mars-modern','mars-sulfate']) { const p = PROFILES.find(x=>x.id===id); const s = Array.from(grid.cells,(_, i)=>scoreCell(grid,i,p)).sort((a,b)=>a-b);
  for (const [n,la,lo] of B) { const c = cellAt(grid,la,lo); if(!c){console.log(id,n,'none');continue;} const e = evaluate(c.measures,p); const idx = s.findIndex(x=>x>=e.overall); console.log(id, n, (e.overall*100).toFixed(0)+'%', 'top', (100*(1-idx/s.length)).toFixed(1)+'%', 'est', JSON.stringify(e.confidence ?? Object.keys(e))); } }
