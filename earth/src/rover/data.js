// Replaces the old app/js/data.js for the ported rover modules. The old file loaded the demo score grids, hotspots and patches of the TerraAnalog
// globe; none of that exists here. What the rover modules still read from it: ROOT (where the rover assets are served from), Earth's gravity and
// the registry loaded by the simulator. ROOT + 'assets/models/...' and ROOT + 'assets/textures/ground/...' keep the old paths under public/rover/.
const base = (import.meta.env && import.meta.env.BASE_URL) || '/';
export const ROOT = base + 'rover/';
export const D = { meta: { gravity: { earth: 9.81 } }, manifest: { demo: false, note: '' }, rovers: null };
