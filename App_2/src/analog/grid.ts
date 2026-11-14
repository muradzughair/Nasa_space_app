/**
 * The global grid built by scripts/build-grid.mjs: every land cell of a 0.5°
 * grid with the measurements the similarity model needs. Loaded the first
 * time a spot is scored. Nothing is scored here: this file only looks up what
 * is known about a place, for scoring.ts to compare.
 */
import { DATA_URL } from "../config";
import { haversine } from "../geo/coords";
import type { AtlasData, Site, Source } from "./data";
import type { EarthMeasures } from "./scoring";

interface Field {
  id: string;
  scale: number;
  unit: string;
  src: string;
  /** Source used instead where bit 0 of the cell's flags is set. */
  altSrc?: string;
}

interface Header {
  version: number;
  generated: string;
  cols: number;
  rows: number;
  cellDegrees: number;
  count: number;
  nodata: number;
  fields: Field[];
  /** False when the grid was built without the MODIS products. */
  modis: boolean;
  year: number;
  /** GLiM rock classes, by the code stored in the lithology column. */
  lithology: { id: string; label: string }[];
  /** Impact structures: name, latitude, longitude, diameter in km. */
  impacts: [string, number, number, number][];
  /** Holocene volcanoes: name, latitude, longitude, 1 if basaltic, type. */
  volcanoes: [string, number, number, number, string][];
  sources: Record<string, Source>;
}

export interface Grid {
  header: Header;
  /** Cell number (row × cols + col, rows from the north) to position in the columns, or −1 for sea. */
  lookup: Int32Array;
  /** Cell number of each stored cell. */
  cells: Uint32Array;
  columns: Record<string, Int16Array>;
  /** Divisor of each field's stored integers, by field id. */
  scales: Record<string, number>;
}

export interface Cell {
  /** Centre of the cell. */
  lat: number;
  lon: number;
  measures: EarthMeasures;
  elevation: number;
  /** Temperatures are MERRA-2 skin temperature because MODIS has no value here. */
  modelledTemperature: boolean;
  /** Source key of each measured quantity, into Grid.header.sources. */
  sources: string[];
}

/** The mapped features near a point, with their names for the card. */
export interface Features {
  impact: number | null;
  impactName: string | null;
  volcano: number | null;
  volcanoName: string | null;
  volcanoBasaltic: boolean;
}

let request: Promise<Grid> | null = null;

export function loadGrid(): Promise<Grid> {
  request ??= fetch(`${DATA_URL}grid.bin`)
    .then((res) => {
      if (!res.ok) throw new Error(`grid.bin: HTTP ${res.status}`);
      return res.arrayBuffer();
    })
    .then(parse)
    .catch((error: unknown) => {
      request = null;
      throw error;
    });
  return request;
}

function parse(buffer: ArrayBuffer): Grid {
  const view = new DataView(buffer);
  if (new TextDecoder().decode(new Uint8Array(buffer, 0, 4)) !== "AGRD") throw new Error("grid.bin: not a grid file");
  const headerLength = view.getUint32(4, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 8, headerLength))) as Header;
  if (header.version !== 2) throw new Error("grid.bin: built for another version of the scoring; run npm run grid");
  let offset = 8 + headerLength;
  const cells = new Uint32Array(buffer.slice(offset, offset + header.count * 4));
  offset += header.count * 4;
  const columns: Record<string, Int16Array> = {};
  for (const field of header.fields) {
    columns[field.id] = new Int16Array(buffer.slice(offset, offset + header.count * 2));
    offset += header.count * 2;
  }
  const lookup = new Int32Array(header.cols * header.rows).fill(-1);
  cells.forEach((cell, i) => (lookup[cell] = i));
  const scales = Object.fromEntries(header.fields.map((f) => [f.id, f.scale]));
  return { header, lookup, cells, columns, scales };
}

/** The measurements of stored cell `i`, with features as measured from the cell centre. */
function measuresAt(grid: Grid, i: number, lat: number): EarthMeasures {
  const { header, columns, scales } = grid;
  const value = (id: string): number | null => {
    const raw = columns[id][i];
    return raw === header.nodata ? null : raw / scales[id];
  };
  const code = value("lithology");
  const volcanoId = value("volcanoId");
  return {
    lat,
    slope: value("slope"),
    roughness: value("roughness"),
    relief: value("relief"),
    tmean: value("tmean")!,
    swing: value("swing"),
    airT: value("airT"),
    precipitation: value("precipitation")!,
    vapour: value("vapour")!,
    soilWetness: value("soilWetness"),
    ndvi: value("ndvi"),
    pressure: value("pressure"),
    uv: value("uv"),
    cloud: value("cloud"),
    albedo: value("albedo"),
    lithology: code == null ? null : header.lithology[code].id,
    tags: null,
    ice: null,
    impact: value("impact"),
    volcano: value("volcano"),
    volcanoBasaltic: volcanoId != null && header.volcanoes[volcanoId][3] === 1,
  };
}

const rowLat = (grid: Grid, row: number) => 90 - (row + 0.5) * grid.header.cellDegrees;

/** Impact structures and volcanoes near an exact point (not the cell centre): the nearest of each within 60 km. */
export function featuresAt(grid: Grid, lat: number, lon: number): Features {
  const out: Features = { impact: null, impactName: null, volcano: null, volcanoName: null, volcanoBasaltic: false };
  for (const [name, fLat, fLon, diameter] of grid.header.impacts) {
    if (Math.abs(fLat - lat) > 1.5) continue;
    const km = Math.max(0, haversine(lat, lon, fLat, fLon) / 1000 - diameter / 2);
    if (km <= 60 && (out.impact == null || km < out.impact)) Object.assign(out, { impact: km, impactName: name });
  }
  for (const [name, fLat, fLon, basaltic] of grid.header.volcanoes) {
    if (Math.abs(fLat - lat) > 1) continue;
    const km = haversine(lat, lon, fLat, fLon) / 1000;
    if (km <= 60 && (out.volcano == null || km < out.volcano)) Object.assign(out, { volcano: km, volcanoName: name, volcanoBasaltic: basaltic === 1 });
  }
  return out;
}

/**
 * The land cell containing a point, or null over the sea. Climate, terrain
 * and rock type are the cell's; impact structures and volcanoes are measured
 * from the point itself.
 */
export function cellAt(grid: Grid, lat: number, lon: number): (Cell & { features: Features }) | null {
  const { header, lookup, columns } = grid;
  const row = Math.min(header.rows - 1, Math.max(0, Math.floor((90 - lat) / header.cellDegrees)));
  const col = ((Math.floor((lon + 180) / header.cellDegrees) % header.cols) + header.cols) % header.cols;
  const i = lookup[row * header.cols + col];
  if (i < 0) return null;
  const centreLat = rowLat(grid, row);
  const modelledTemperature = (columns.flags[i] & 1) === 1;
  const sources = new Set<string>();
  for (const f of header.fields) {
    if (!f.src || columns[f.id][i] === header.nodata) continue;
    sources.add(modelledTemperature && f.altSrc ? f.altSrc : f.src);
  }
  const features = featuresAt(grid, lat, lon);
  return {
    lat: centreLat,
    lon: -180 + (col + 0.5) * header.cellDegrees,
    measures: { ...measuresAt(grid, i, lat), impact: features.impact, volcano: features.volcano, volcanoBasaltic: features.volcanoBasaltic },
    features,
    elevation: columns.elevation[i],
    modelledTemperature,
    sources: [...sources],
  };
}

/**
 * A curated site: its own finer measurements and published materials over
 * the grid cell it sits in. Two island sites have no cell; what the cell
 * would have supplied is then missing and left out of their score.
 */
export function siteMeasures(grid: Grid, site: Site): { measures: EarthMeasures; features: Features } {
  const cell = cellAt(grid, site.lat, site.lon);
  const features = cell?.features ?? featuresAt(grid, site.lat, site.lon);
  const base: EarthMeasures = cell?.measures ?? {
    lat: site.lat, slope: null, roughness: null, relief: null, tmean: site.m.tmean.v, swing: null, airT: null,
    precipitation: site.m.precipitation.v, vapour: site.m.vapour.v, soilWetness: null, ndvi: null, pressure: null,
    uv: null, cloud: null, albedo: null, lithology: null, tags: null, ice: null,
    impact: features.impact, volcano: features.volcano, volcanoBasaltic: features.volcanoBasaltic,
  };
  return {
    features,
    measures: {
      ...base,
      lat: site.lat,
      slope: site.m.slope.v,
      roughness: site.m.roughness.v,
      relief: site.m.relief.v,
      tmean: site.m.tmean.v,
      precipitation: site.m.precipitation.v,
      vapour: site.m.vapour.v,
      ndvi: site.m.ndvi.v,
      pressure: site.m.pressure.v,
      tags: site.tags,
      ice: site.ice,
    },
  };
}

/** The curated site nearest to a point, if one lies within `reach` metres. */
export function nearbySite(data: AtlasData, lat: number, lon: number, reach = 50_000): { site: Site; distance: number } | null {
  let best: { site: Site; distance: number } | null = null;
  for (const site of data.sites) {
    const distance = haversine(lat, lon, site.lat, site.lon);
    if (distance <= reach && (!best || distance < best.distance)) best = { site, distance };
  }
  return best;
}
