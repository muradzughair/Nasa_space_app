/**
 * What is known about an arbitrary point on the Moon, from
 * public/data/moon.bin (scripts/build-moon.mjs). Two things only: terrain
 * statistics of the 0.5° cell the point is in, measured from LOLA like the
 * terrain of the fixed lunar profiles, and whether the point lies inside a
 * mapped mare. Loaded the first time a point on the Moon is made a target.
 */
import { DATA_URL } from "../config";
import type { Source } from "./data";

interface Header {
  version: number;
  generated: string;
  terrain: {
    cols: number;
    rows: number;
    cellDegrees: number;
    fields: string[];
    scales: Record<string, number>;
    nodata: number;
    /** Cells with no measurement: the window reaches past a pole. */
    missing: number;
    windowKm: number;
    sampleMetres: number;
    source: string;
  };
  mare: {
    cols: number;
    rows: number;
    cellDegrees: number;
    names: string[];
    runs: number;
    /** The map covers latitudes up to this, north and south. */
    latitudeLimit: number;
    source: string;
  };
  sources: Record<string, Source>;
}

export interface MoonGrid {
  header: Header;
  terrain: Record<"slope" | "roughness" | "relief", Uint16Array>;
  /** 0 outside the maria, otherwise index into header.mare.names plus 1. */
  mare: Uint8Array;
}

let request: Promise<MoonGrid> | null = null;

export function loadMoon(): Promise<MoonGrid> {
  request ??= fetch(`${DATA_URL}moon.bin`)
    .then((res) => {
      if (!res.ok) throw new Error(`moon.bin: HTTP ${res.status}`);
      return res.arrayBuffer();
    })
    .then(parse)
    .catch((error: unknown) => {
      request = null;
      throw error;
    });
  return request;
}

function parse(buffer: ArrayBuffer): MoonGrid {
  const view = new DataView(buffer);
  if (new TextDecoder().decode(new Uint8Array(buffer, 0, 4)) !== "AMON") throw new Error("moon.bin: not a lunar grid file");
  const headerLength = view.getUint32(4, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 8, headerLength))) as Header;
  if (header.version !== 1) throw new Error("moon.bin: built for another version; run npm run moon");
  let offset = 8 + headerLength;
  const count = header.terrain.cols * header.terrain.rows;
  const column = () => {
    const out = new Uint16Array(buffer.slice(offset, offset + count * 2));
    offset += count * 2;
    return out;
  };
  const terrain = { slope: column(), roughness: column(), relief: column() };
  const mare = new Uint8Array(header.mare.cols * header.mare.rows);
  const runs = new Uint8Array(buffer, offset, header.mare.runs * 3);
  let at = 0;
  for (let i = 0; i < runs.length; i += 3) {
    const length = runs[i + 1] | (runs[i + 2] << 8);
    if (runs[i]) mare.fill(runs[i], at, at + length);
    at += length;
  }
  if (at !== mare.length) throw new Error("moon.bin: mare raster is damaged");
  return { header, terrain, mare };
}

const cellOf = (lat: number, lon: number, cols: number, rows: number, degrees: number) => {
  const row = Math.min(rows - 1, Math.max(0, Math.floor((90 - lat) / degrees)));
  const col = ((Math.floor((lon + 180) / degrees) % cols) + cols) % cols;
  return { row, col, centreLat: 90 - (row + 0.5) * degrees, centreLon: -180 + (col + 0.5) * degrees };
};

export interface MoonTerrain {
  /** Median slope (°), roughness (m) and relief (m) of the window, as stored. */
  slope: number;
  roughness: number;
  relief: number;
  /** Centre of the window that was measured: the centre of the grid cell, not the point itself. */
  centreLat: number;
  centreLon: number;
  /** Distance from the point to that centre, km. */
  offsetKm: number;
}

/** Terrain of the cell containing a point, or null where there is no measurement (within about 0.6° of a pole). */
export function moonTerrainAt(grid: MoonGrid, lat: number, lon: number): MoonTerrain | null {
  const t = grid.header.terrain;
  const { row, col, centreLat, centreLon } = cellOf(lat, lon, t.cols, t.rows, t.cellDegrees);
  const i = row * t.cols + col;
  if (grid.terrain.slope[i] === t.nodata) return null;
  const kmPerDegree = (Math.PI / 180) * 1737.4;
  let dLon = Math.abs(lon - centreLon) % 360;
  if (dLon > 180) dLon = 360 - dLon;
  return {
    slope: grid.terrain.slope[i] / t.scales.slope,
    roughness: grid.terrain.roughness[i] / t.scales.roughness,
    relief: grid.terrain.relief[i] / t.scales.relief,
    centreLat,
    centreLon,
    offsetKm: Math.hypot((lat - centreLat) * kmPerDegree, dLon * kmPerDegree * Math.cos((lat * Math.PI) / 180)),
  };
}

export interface MareClass {
  /** The point is inside a mapped mare. */
  mare: boolean;
  /** Name of that mare in the map, when it has one. */
  name: string | null;
  /** False beyond the latitude the map covers: "not mare" is then an assumption, not a reading. */
  covered: boolean;
}

export function mareAt(grid: MoonGrid, lat: number, lon: number): MareClass {
  const m = grid.header.mare;
  const { row, col } = cellOf(lat, lon, m.cols, m.rows, m.cellDegrees);
  const value = grid.mare[row * m.cols + col];
  const name = value ? m.names[value - 1] : null;
  return { mare: value > 0, name: name && !/^unnamed/i.test(name) ? name : null, covered: Math.abs(lat) <= m.latitudeLimit };
}
