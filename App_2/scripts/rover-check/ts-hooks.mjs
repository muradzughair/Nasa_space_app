// Resolve hooks for ts-resolve.mjs (see there).
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const CONFIG = 'data:text/javascript,' + encodeURIComponent('export const DATA_URL = ""; export const ION_TOKEN = ""; export const NOMINATIM_URL = ""; export const ONLINE_GEOCODING = false;');
export async function resolve(spec, ctx, next) {
  const parent = ctx.parentURL || '';
  if ((spec === '../config' || spec === './config') && parent.includes('/src/')) return { url: CONFIG, shortCircuit: true };
  if (spec.startsWith('.') && !/\.\w+$/.test(spec) && parent.startsWith('file:')) {
    for (const ext of ['.ts', '.tsx']) { const u = new URL(spec + ext, parent); if (existsSync(fileURLToPath(u))) return { url: u.href, shortCircuit: true }; }
  }
  return next(spec, ctx);
}
