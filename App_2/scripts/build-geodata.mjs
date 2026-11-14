// Downloads Natural Earth (public domain) vector data and writes compact JSON
// files into public/data. Run with `npm run geodata`. The generated files are
// committed, so this only needs re-running to refresh the data.
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BASE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/";
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/data");

async function get(name) {
  const res = await fetch(BASE + name);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return res.json();
}

/** Flatten a ring to [lon, lat, lon, lat, ...], rounded, without repeated points. */
function ring(coords, digits) {
  const k = 10 ** digits;
  const out = [];
  let px, py;
  for (const [x, y] of coords) {
    const rx = Math.round(x * k) / k;
    const ry = Math.round(y * k) / k;
    if (rx === px && ry === py) continue;
    out.push(rx, ry);
    px = rx;
    py = ry;
  }
  return out;
}

function polygons(geometry, digits) {
  if (!geometry) return [];
  const list = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  const out = [];
  for (const poly of list) {
    const rings = poly.map((r) => ring(r, digits)).filter((r) => r.length >= 8);
    if (!rings.length) continue;
    const outer = rings[0];
    let w = 180, s = 90, e = -180, n = -90;
    for (let i = 0; i < outer.length; i += 2) {
      w = Math.min(w, outer[i]); e = Math.max(e, outer[i]);
      s = Math.min(s, outer[i + 1]); n = Math.max(n, outer[i + 1]);
    }
    out.push({ b: [w, s, e, n], r: rings });
  }
  return out;
}

const iso = (p) => [p.ISO_A2_EH, p.ISO_A2, p.WB_A2].find((v) => v && v !== "-99") ?? "";

await mkdir(OUT, { recursive: true });

const countries = (await get("ne_50m_admin_0_countries.geojson")).features
  .map((f) => ({
    n: f.properties.NAME_LONG || f.properties.NAME,
    a: f.properties.NAME,
    iso: iso(f.properties),
    c: f.properties.CONTINENT,
    s: f.properties.SUBREGION,
    p: Math.round(f.properties.POP_EST || 0),
    y: [Number(f.properties.LABEL_Y), Number(f.properties.LABEL_X)],
    g: polygons(f.geometry, 3),
  }))
  .filter((c) => c.g.length);
await writeFile(path.join(OUT, "countries.json"), JSON.stringify(countries));

const marine = (await get("ne_50m_geography_marine_polys.geojson")).features
  .filter((f) => f.properties.name)
  .map((f) => ({ n: f.properties.name, t: f.properties.featurecla, g: polygons(f.geometry, 2) }))
  .filter((m) => m.g.length);
await writeFile(path.join(OUT, "marine.json"), JSON.stringify(marine));

const places = (await get("ne_50m_populated_places_simple.geojson")).features
  .map((f) => f.properties)
  .map((p) => [p.name, p.adm0name, p.adm1name || "", +p.latitude.toFixed(4), +p.longitude.toFixed(4), p.pop_max || 0])
  .sort((a, b) => b[5] - a[5]);
await writeFile(path.join(OUT, "places.json"), JSON.stringify(places));

console.log(`countries: ${countries.length}, marine: ${marine.length}, places: ${places.length}`);
