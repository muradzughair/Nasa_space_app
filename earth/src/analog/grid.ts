/**
 * The global grid built by scripts/build-grid.mjs: every land cell of a 0.5°
 * grid with the same measurements as the curated sites. Loaded on the first
 * click or when the heatmap is switched on; scored here with the shared
 * scoring module, so a cell and a curated site are compared identically.
 */
import { DATA_URL } from "../config";
import { haversine } from "../geo/coords";
import type { AtlasData, Site, Source, Target, Weights } from "./data";
import { compare, compareScores, type DimId, type DimScore, type EarthMeasures, sunElevation, type TargetMeasures } from "./scoring";

interface Field {
  id: string;
  scale: number;
  unit: string;
  src: string;
  /** Source used instead where bit 0 of the cell's flags is set. */
  altSrc?: string;
}

interface Lithology {
  id: string;
  label: string;
  /** Null: the class says nothing about bedrock. */
  tags: Record<string, number> | null;
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
  /** The geology terms a lithology map can resolve. */
  vocabulary: string[];
  lithology: Lithology[];
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
  pressure: number;
  elevation: number;
  lithology: Lithology | null;
  /** Temperatures are MERRA-2 skin temperature because MODIS has no value here. */
  modelledTemperature: boolean;
  /** Source key of each measured quantity, into Grid.header.sources. */
  sources: string[];
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

function measuresAt(grid: Grid, i: number, lat: number): { measures: EarthMeasures; lithology: Lithology | null } {
  const { header, columns, scales } = grid;
  const value = (id: string): number | null => {
    const raw = columns[id][i];
    return raw === header.nodata ? null : raw / scales[id];
  };
  const code = value("lithology");
  const lithology = code == null ? null : header.lithology[code];
  return {
    lithology,
    measures: {
      slope: value("slope")!,
      roughness: value("roughness")!,
      relief: value("relief")!,
      tmean: value("tmean")!,
      tmax: value("tmax")!,
      precipitation: value("precipitation")!,
      vapour: value("vapour")!,
      aod: value("aod")!,
      windPressure: value("windPressure")!,
      ndvi: value("ndvi"),
      sun: sunElevation(lat, 23.44),
      // No global ground-ice source: the water score uses dryness and vapour only.
      ice: null,
      // Rock type is shown on the card but not scored: a lithology map resolves too little of the vocabulary.
      tags: null,
    },
  };
}

const rowLat = (grid: Grid, row: number) => 90 - (row + 0.5) * grid.header.cellDegrees;

/** The land cell containing a point, or null over the sea. */
export function cellAt(grid: Grid, lat: number, lon: number): Cell | null {
  const { header, lookup, columns } = grid;
  const row = Math.min(header.rows - 1, Math.max(0, Math.floor((90 - lat) / header.cellDegrees)));
  const col = ((Math.floor((lon + 180) / header.cellDegrees) % header.cols) + header.cols) % header.cols;
  const i = lookup[row * header.cols + col];
  if (i < 0) return null;
  const centreLat = rowLat(grid, row);
  const modelledTemperature = (columns.flags[i] & 1) === 1;
  const sources = new Set<string>(["geometry"]);
  for (const f of header.fields) {
    if (!f.src || columns[f.id][i] === header.nodata) continue;
    sources.add(modelledTemperature && f.altSrc ? f.altSrc : f.src);
  }
  return {
    lat: centreLat,
    lon: -180 + (col + 0.5) * header.cellDegrees,
    ...measuresAt(grid, i, centreLat),
    pressure: columns.pressure[i] / grid.scales.pressure,
    elevation: columns.elevation[i],
    modelledTemperature,
    sources: [...sources],
  };
}

export const targetMeasures = (target: Target): TargetMeasures => ({
  slope: target.m.slope.v,
  roughness: target.m.roughness.v,
  relief: target.m.relief.v,
  tmean: target.m.tmean.v,
  tmax: target.m.tmax.v,
  vapour: target.m.vapour.v,
  aod: target.m.aod.v,
  windPressure: target.m.windPressure.v,
  sun: target.m.sun.v,
  ice: target.ice,
  tags: target.tags,
  subsurface: target.subsurface,
});

/** Similarities between a grid cell and a target, on the same scales as the curated sites (geology is never scored for a cell). */
export const compareCell = (data: AtlasData, cell: Cell, target: Target): Record<DimId, DimScore> =>
  compare(cell.measures, targetMeasures(target), data.tags);

/** The curated site nearest to a point, if one lies within `reach` metres. */
export function nearbySite(data: AtlasData, lat: number, lon: number, reach = 50_000): { site: Site; distance: number } | null {
  let best: { site: Site; distance: number } | null = null;
  for (const site of data.sites) {
    const distance = haversine(lat, lon, site.lat, site.lon);
    if (distance <= reach && (!best || distance < best.distance)) best = { site, distance };
  }
  return best;
}

// ------------------------------------------------------------------ heatmap

/** The heatmap's colour scale covers this range of overall similarity; values beyond it take the end colours. */
export const HEAT_RANGE: [number, number] = [0.2, 0.7];

/**
 * Dark violet to pale yellow, rising in lightness all the way so the order
 * reads without the legend and survives colour-blindness (the viridis
 * family). Pairs are [position, r, g, b].
 */
const HEAT_STOPS: [number, number, number, number][] = [
  [0, 68, 1, 84],
  [0.25, 59, 82, 139],
  [0.5, 33, 145, 140],
  [0.75, 94, 201, 98],
  [1, 253, 231, 37],
];

export function heatColor(score: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, (score - HEAT_RANGE[0]) / (HEAT_RANGE[1] - HEAT_RANGE[0])));
  let k = 1;
  while (k < HEAT_STOPS.length - 1 && HEAT_STOPS[k][0] < t) k++;
  const a = HEAT_STOPS[k - 1], b = HEAT_STOPS[k];
  const f = (t - a[0]) / (b[0] - a[0]);
  return [a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, a[3] + (b[3] - a[3]) * f];
}

export const heatGradient = () =>
  `linear-gradient(to right, ${HEAT_STOPS.map(([p, r, g, b]) => `rgb(${r} ${g} ${b}) ${p * 100}%`).join(", ")})`;

export interface Heatmap {
  /** One pixel per grid cell, north at the top; the sea is transparent. */
  canvas: HTMLCanvasElement;
  /** Highest overall similarity of any cell, and where. */
  best: { score: number; lat: number; lon: number };
  /** The target this map compares with. */
  target: Target;
}

const DIMS: DimId[] = ["terrain", "thermal", "water", "geology", "dustwind", "biology", "illumination"];
const scoreCache = new WeakMap<Grid, Map<string, Promise<Float32Array>>>();

/**
 * The seven similarities of every cell to one target (NaN where a cell has
 * no data for a dimension). Worked out once per target; changing the mission
 * goal only re-weights them.
 */
function targetScores(grid: Grid, data: AtlasData, target: Target): Promise<Float32Array> {
  let byTarget = scoreCache.get(grid);
  if (!byTarget) scoreCache.set(grid, (byTarget = new Map()));
  let scores = byTarget.get(target.id);
  if (!scores) byTarget.set(target.id, (scores = scoreInWorker(grid, data, target)));
  return scores;
}

/** Scores every cell against one target; runs in cellScores.worker.ts. */
export function cellScores(grid: Grid, tags: Record<string, string>, target: TargetMeasures): Float32Array {
  const { header, cells } = grid;
  const vocabulary = Object.keys(tags);
  const scores = new Float32Array(cells.length * DIMS.length);
  for (let i = 0; i < cells.length; i++) {
    const lat = rowLat(grid, Math.floor(cells[i] / header.cols));
    const result = compareScores(measuresAt(grid, i, lat).measures, target, vocabulary);
    for (let d = 0; d < DIMS.length; d++) scores[i * DIMS.length + d] = result[DIMS[d]] ?? NaN;
  }
  if (import.meta.env.DEV) checkAgainstCompare(grid, tags, target, scores);
  return scores;
}

/** Development guard: compareScores() must agree with compare() exactly (every 97th cell). */
function checkAgainstCompare(grid: Grid, tags: Record<string, string>, target: TargetMeasures, scores: Float32Array): void {
  for (let i = 0; i < grid.cells.length; i += 97) {
    const lat = rowLat(grid, Math.floor(grid.cells[i] / grid.header.cols));
    const full = compare(measuresAt(grid, i, lat).measures, target, tags);
    for (let d = 0; d < DIMS.length; d++) {
      const expected = Math.fround(full[DIMS[d]].score ?? NaN);
      const actual = scores[i * DIMS.length + d];
      if (!Object.is(expected, actual)) {
        console.error(`compareScores() disagrees with compare() at cell ${i}, ${DIMS[d]}: ${actual} vs ${expected}`);
        return;
      }
    }
  }
}

let worker: Worker | null = null;
/** The grid the worker holds a copy of. */
let workerGrid: Grid | null = null;
let nextRequest = 0;
const requests = new Map<number, { resolve: (scores: Float32Array) => void; reject: (error: unknown) => void }>();

/**
 * Scoring all 92,172 cells takes a few hundred milliseconds, long enough to
 * freeze the page, so it runs in a worker. The grid is copied to the worker
 * once; each request sends the target and gets the scores back transferred.
 * If the worker cannot run, the scores are computed here instead.
 */
function scoreInWorker(grid: Grid, data: AtlasData, target: Target): Promise<Float32Array> {
  const tm = targetMeasures(target);
  try {
    if (!worker) {
      worker = new Worker(new URL("./cellScores.worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (event: MessageEvent<CellScoresResponse>) => {
        requests.get(event.data.id)?.resolve(event.data.scores);
        requests.delete(event.data.id);
      };
      worker.onerror = (event) => {
        for (const r of requests.values()) r.reject(event);
        requests.clear();
        worker = null;
        workerGrid = null;
      };
    }
    const id = ++nextRequest;
    const message: CellScoresRequest = { id, target: tm, tags: data.tags };
    if (workerGrid !== grid) {
      message.grid = grid;
      workerGrid = grid;
    }
    const pending = new Promise<Float32Array>((resolve, reject) => requests.set(id, { resolve, reject }));
    worker.postMessage(message);
    return pending.catch(() => cellScores(grid, data.tags, tm));
  } catch {
    return Promise.resolve(cellScores(grid, data.tags, tm));
  }
}

export interface CellScoresRequest {
  id: number;
  /** Sent with the first request only. */
  grid?: Grid;
  target: TargetMeasures;
  tags: Record<string, string>;
}

export interface CellScoresResponse {
  id: number;
  scores: Float32Array;
}

/** Overall similarity of every land cell to one target, under one set of weights, as a picture. */
export async function renderHeatmap(grid: Grid, data: AtlasData, target: Target, weights: Weights): Promise<Heatmap> {
  const scores = await targetScores(grid, data, target);
  const { header, cells } = grid;
  const canvas = document.createElement("canvas");
  canvas.width = header.cols;
  canvas.height = header.rows;
  const context = canvas.getContext("2d")!;
  const image = context.createImageData(header.cols, header.rows);
  const best = { score: -1, lat: 0, lon: 0 };
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    let sum = 0;
    let total = 0;
    for (let d = 0; d < DIMS.length; d++) {
      const s = scores[i * DIMS.length + d];
      if (Number.isNaN(s)) continue; // no data: left out with its weight, as in overall()
      sum += weights[DIMS[d]] * s;
      total += weights[DIMS[d]];
    }
    const score = total ? sum / total : 0;
    if (score > best.score) {
      Object.assign(best, { score, lat: rowLat(grid, Math.floor(cell / header.cols)), lon: -180 + ((cell % header.cols) + 0.5) * header.cellDegrees });
    }
    const [r, g, b] = heatColor(score);
    image.data.set([r, g, b, 255], cell * 4);
  }
  context.putImageData(image, 0, 0);
  return { canvas, best, target };
}
