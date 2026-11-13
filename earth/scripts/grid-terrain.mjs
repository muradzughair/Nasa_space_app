// Terrain for the global grid: the same 32 km window on 450 m cells as the
// curated sites (common.mjs), but read from the reduced-resolution overview
// stored inside each Copernicus GLO-90 file instead of the full 90 m raster.
// Overview 1 has 600 rows per degree (about 185 m); block-averaging it to
// 450 m gives nearly the same surface as block-averaging the 90 m data, at a
// quarter of the download. `npm run grid -- --validate` measures the
// difference on the curated sites.
import { fromUrl } from "geotiff";
import { copdemUrl, gridder, HALF, http, RAD, RADIUS, terrainMetrics } from "./common.mjs";

export const OVERVIEW = 1;

/** The land tiles of GLO-90 (south-west corners), from the bucket's own list. Everything else is open sea. */
export async function landTiles() {
  const text = await (await http("https://copernicus-dem-90m.s3.amazonaws.com/tileList.txt")).text();
  const tiles = new Set();
  for (const m of text.matchAll(/_([NS])(\d{2})_00_([EW])(\d{3})_00_DEM/g)) {
    tiles.add(`${m[1] === "S" ? -m[2] : +m[2]},${m[3] === "W" ? -m[4] : +m[4]}`);
  }
  return tiles;
}

/** One tile's overview: heights by row from the north, with the geographic position of pixel centres. */
async function readTile(lat, lon, level) {
  const read = async () => {
    const tiff = await fromUrl(copdemUrl(lat, lon));
    const full = await tiff.getImage(0);
    const image = await tiff.getImage(level);
    const [ox, oy] = full.getOrigin();
    const [rx, ry] = full.getResolution();
    const width = image.getWidth(), height = image.getHeight();
    const [data] = await image.readRasters();
    return { data, width, height, ox, oy, rx: (rx * full.getWidth()) / width, ry: (ry * full.getHeight()) / height };
  };
  // Patient on purpose: a dropped connection should pause a long build, not end it.
  for (let attempt = 1; ; attempt++) {
    let timer;
    try {
      return await Promise.race([read(), new Promise((_, reject) => (timer = setTimeout(() => reject(new Error("timed out")), 90_000)))]);
    } catch (error) {
      if (attempt >= 40) throw new Error(`GLO-90 ${lat},${lon}: ${error.message}`);
      await new Promise((r) => setTimeout(r, Math.min(15_000, 1500 * attempt)));
    } finally {
      clearTimeout(timer);
    }
  }
}

/**
 * Keeps recently used tiles in memory. Cells are visited in latitude bands,
 * so `keep(south, north)` drops everything outside the band being worked on.
 */
export function tileStore(land, level = OVERVIEW) {
  const tiles = new Map();
  return {
    has: (lat, lon) => land.has(`${lat},${lon}`),
    get(lat, lon) {
      const key = `${lat},${lon}`;
      if (!tiles.has(key)) tiles.set(key, readTile(lat, lon, level));
      return tiles.get(key);
    },
    keep(south, north) {
      for (const key of tiles.keys()) {
        const lat = +key.split(",")[0];
        if (lat < south || lat > north) tiles.delete(key);
      }
    },
  };
}

const wrapLon = (lon) => ((((lon + 180) % 360) + 360) % 360) - 180;

/** The 1° tiles (south-west corners) that a 32 km window centred on a point touches. */
export function windowTiles(lat, lon) {
  const dLat = HALF / (RADIUS.earth * RAD);
  const dLon = Math.min(180, dLat / Math.cos(lat * RAD));
  const out = [];
  for (let la = Math.max(-90, Math.floor(lat - dLat)); la <= Math.min(89, Math.floor(lat + dLat)); la++) {
    for (let lo = Math.floor(lon - dLon); lo <= Math.floor(lon + dLon); lo++) out.push([la, wrapLon(lo), lo]);
  }
  return out;
}

/**
 * Slope, roughness and relief of the 32 km window centred on (lat, lon), or
 * null where less than a tenth of it is land. Sea (no tile, or exactly 0 m
 * in this DEM) is left out, as for the curated coastal sites.
 */
export async function cellTerrain(store, lat, lon) {
  const dLat = HALF / (RADIUS.earth * RAD);
  const dLon = Math.min(180, dLat / Math.cos(lat * RAD));
  const g = gridder();
  let any = false;
  for (const [la, lo, unwrapped] of windowTiles(lat, lon)) {
    if (!store.has(la, lo)) continue;
    const t = await store.get(la, lo);
    // Positions are taken in the window's own longitude frame, so tiles across the antimeridian line up.
    const ox = t.ox + (unwrapped - lo);
    const x0 = Math.max(0, Math.floor((lon - dLon - ox) / t.rx)), x1 = Math.min(t.width, Math.ceil((lon + dLon - ox) / t.rx));
    const y0 = Math.max(0, Math.floor((lat + dLat - t.oy) / t.ry)), y1 = Math.min(t.height, Math.ceil((lat - dLat - t.oy) / t.ry));
    const kx = RAD * RADIUS.earth * Math.cos(lat * RAD), ky = RAD * RADIUS.earth;
    for (let y = y0; y < y1; y++) {
      const dy = (t.oy + (y + 0.5) * t.ry - lat) * ky;
      for (let x = x0; x < x1; x++) {
        const v = t.data[y * t.width + x];
        if (v === 0 || !Number.isFinite(v)) continue;
        g.add((ox + (x + 0.5) * t.rx - lon) * kx, dy, v);
        any = true;
      }
    }
  }
  if (!any) return null;
  try {
    return terrainMetrics(g.grid(), 0.1);
  } catch {
    return null;
  }
}
