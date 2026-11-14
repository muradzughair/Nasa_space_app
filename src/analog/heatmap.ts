/**
 * The similarity heatmap: every land cell of the grid scored against one
 * profile. There is no scoring here. Each cell's value is
 * `similarity(cellAt(grid, centre).measures, profile)`: the same lookup and
 * the same function a click on the cell centre uses, so the map and the card
 * cannot disagree.
 *
 * A cell's value describes the data sampled for that cell (climate and rock
 * class over about 50 km, terrain in a 32 km window, impact structures and
 * volcanoes measured from the cell centre). It is not a promise that every
 * coordinate inside the cell scores the same.
 */
import { cellAt, type Grid } from "./grid";
import { type Profile, similarity } from "./scoring";

export interface CellScores {
  profileId: string;
  /** profileKey() of the profile these scores are for. */
  key: string;
  /** Similarity of each stored cell, 0 to 1, in the grid's own cell order. */
  scores: Float64Array;
  /** The same values in ascending order, for percentile ranks. */
  sorted: Float64Array;
}

/** Centre of stored cell `i`. */
export function cellCentre(grid: Grid, i: number): { lat: number; lon: number } {
  const { cols, cellDegrees } = grid.header;
  const n = grid.cells[i];
  return { lat: 90 - (Math.floor(n / cols) + 0.5) * cellDegrees, lon: -180 + ((n % cols) + 0.5) * cellDegrees };
}

/** Index of the stored cell containing a point, or −1 over the sea and where the grid has no cell. */
export function cellIndexAt(grid: Grid, lat: number, lon: number): number {
  const { cols, rows, cellDegrees } = grid.header;
  const row = Math.min(rows - 1, Math.max(0, Math.floor((90 - lat) / cellDegrees)));
  const col = ((Math.floor((lon + 180) / cellDegrees) % cols) + cols) % cols;
  return grid.lookup[row * cols + col];
}

/** The heatmap value of one cell: the shared scoring function at the cell's sample coordinates. */
export function scoreCell(grid: Grid, i: number, profile: Profile): number {
  const { lat, lon } = cellCentre(grid, i);
  return similarity(cellAt(grid, lat, lon)!.measures, profile);
}

const keys = new WeakMap<Profile, string>();
const ordered = (v: object) => Object.entries(v).sort((a, b) => (a[0] < b[0] ? -1 : 1));

/**
 * Everything similarity() reads from a profile, as text. The cache is keyed
 * on this, not on a name or an id: two targets share scores only when every
 * number that enters the score is the same, so a newly flagged point can
 * never be shown with another point's map.
 */
export function profileKey(p: Profile): string {
  let key = keys.get(p);
  if (!key) {
    key = JSON.stringify([p.body, ordered(p.minerals), p.terrain.slope, p.terrain.roughness, p.terrain.relief, ordered(p.landforms), p.thermal.mean, p.thermal.swing, p.thermal.ice, !!p.acid, p.albedo, !!p.lowSun, ordered(p.weights)]);
    keys.set(p, key);
  }
  return key;
}

interface Job {
  scores: Float64Array;
  next: number;
  done: CellScores | null;
}

/** One job per grid and profile content (profileKey). An interrupted job keeps its progress and resumes when asked for again. */
const jobs = new WeakMap<Grid, Map<string, Job>>();

/** A turn of the event loop, so input and painting run between slices of work. */
const breathe = () =>
  new Promise<void>((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => resolve();
    channel.port2.postMessage(0);
  });

/** Finished scores for a profile, if they are already in the cache. */
export function cachedCellScores(grid: Grid, profile: Profile): CellScores | null {
  const done = jobs.get(grid)?.get(profileKey(profile))?.done ?? null;
  // The same content under another id or name (a renamed custom target): same scores, current label.
  return done && done.profileId !== profile.id ? { ...done, profileId: profile.id } : done;
}

/** Forgets the scores of a profile, when a custom target is removed. */
export function dropCellScores(profile: Profile): void {
  const key = profileKey(profile);
  // A WeakMap cannot be listed, so the grid is passed in by whoever holds it; without one there is nothing cached to drop.
  if (lastGrid) jobs.get(lastGrid)?.delete(key);
}
let lastGrid: Grid | null = null;

/**
 * Scores every land cell against a profile in slices of about 10 ms.
 * Resolves with null when `signal` aborts first; whoever asked must then
 * drop the result, which is how a change of profile never shows old scores.
 */
export async function computeCellScores(
  grid: Grid,
  profile: Profile,
  signal?: AbortSignal,
  onProgress?: (fraction: number) => void,
): Promise<CellScores | null> {
  let perGrid = jobs.get(grid);
  if (!perGrid) jobs.set(grid, (perGrid = new Map()));
  lastGrid = grid;
  const key = profileKey(profile);
  let job = perGrid.get(key);
  if (!job) perGrid.set(key, (job = { scores: new Float64Array(grid.cells.length), next: 0, done: null }));
  const count = grid.cells.length;
  while (!job.done) {
    if (signal?.aborted) return null;
    const sliceEnd = performance.now() + 10;
    // Another caller may be advancing the same job; `next` is only moved after the value is stored.
    while (job.next < count && performance.now() < sliceEnd) {
      const i = job.next;
      job.scores[i] = scoreCell(grid, i, profile);
      job.next = i + 1;
    }
    if (job.next >= count) job.done ??= { profileId: profile.id, key, scores: job.scores, sorted: Float64Array.from(job.scores).sort() };
    else {
      onProgress?.(job.next / count);
      await breathe();
    }
  }
  if (signal?.aborted) return null;
  return job.done.profileId === profile.id ? job.done : { ...job.done, profileId: profile.id };
}

/**
 * Percentile rank of a score: the share of land cells that score strictly
 * lower, 0 to 1. A rank, not a similarity: the best cell on Earth ranks at
 * almost 1 whatever its score is.
 */
export function percentileRank(cells: CellScores, score: number): number {
  const { sorted } = cells;
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < score) lo = mid + 1;
    else hi = mid;
  }
  return lo / sorted.length;
}

/** The number in "top 0.4%", as text: the share of land cells scoring at least as high, rounded the way the card shows it. */
export function shownTopPercent(rank: number): string {
  const top = Math.max(0, (1 - rank) * 100);
  return top < 0.1 ? "0.1" : top < 10 ? top.toFixed(1) : `${Math.round(top)}`;
}

/** "top 0.4%": where a percentile rank puts a cell among all land cells. */
export function topShare(rank: number): string {
  return `top ${shownTopPercent(rank)}%`;
}

export interface Distribution {
  median: number;
  p99: number;
  best: number;
  /** Cells at or above the threshold. */
  above: number;
  count: number;
}

export function distribution(cells: CellScores, threshold: number): Distribution {
  const { sorted } = cells;
  const count = sorted.length;
  return {
    median: sorted[count >> 1],
    p99: sorted[Math.floor(count * 0.99)],
    best: sorted[count - 1],
    above: count - Math.round(percentileRank(cells, threshold) * count),
    count,
  };
}

// ------------------------------------------------------------------ colours

/** The colour scale ends here: scores at or above it share the top colour. The best cell on Earth is 76%. */
export const SCALE_MAX = 0.6;

/**
 * Red-hot, dark to light, evenly spaced over 0 to SCALE_MAX: magnitude only.
 * Weak matches are a dark red that recedes into the dark imagery; the best
 * places glow bright red, orange and yellow, so they stand out from the
 * whole-planet view (the old app's hotspot look, in red).
 */
export const RAMP: [number, number, number][] = [
  [42, 6, 10],
  [98, 10, 14],
  [158, 16, 18],
  [214, 34, 26],
  [246, 88, 38],
  [255, 162, 66],
  [255, 228, 150],
];
/** Land cells below the threshold: a neutral wash, so they stay distinct from places with no score. */
const BELOW: [number, number, number, number] = [150, 158, 172, 70];

export function colourOf(score: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, score / SCALE_MAX)) * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(t));
  const f = t - i;
  const a = RAMP[i];
  const b = RAMP[i + 1];
  return [Math.round(a[0] + (b[0] - a[0]) * f), Math.round(a[1] + (b[1] - a[1]) * f), Math.round(a[2] + (b[2] - a[2]) * f)];
}

export const rampCss = (direction = "to right") => `linear-gradient(${direction}, ${RAMP.map((c) => `rgb(${c.join(" ")})`).join(", ")})`;
export const belowCss = `rgb(${BELOW[0]} ${BELOW[1]} ${BELOW[2]} / ${(BELOW[3] / 255).toFixed(2)})`;

/**
 * The picture draped over the globe: one pixel per grid cell (no smoothing,
 * no interpolation between cells), north at the top. Sea and places with no
 * grid cell stay fully transparent. The threshold decides only how a cell is
 * drawn; the scores are not touched.
 */
export function paintHeatmap(grid: Grid, cells: CellScores, threshold: number): HTMLCanvasElement {
  const { cols, rows } = grid.header;
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const context = canvas.getContext("2d")!;
  const image = context.createImageData(cols, rows);
  const pixels = image.data;
  for (let i = 0; i < grid.cells.length; i++) {
    const at = grid.cells[i] * 4;
    const score = cells.scores[i];
    if (score >= threshold) {
      const [r, g, b] = colourOf(score);
      pixels[at] = r;
      pixels[at + 1] = g;
      pixels[at + 2] = b;
      pixels[at + 3] = 255;
    } else {
      pixels[at] = BELOW[0];
      pixels[at + 1] = BELOW[1];
      pixels[at + 2] = BELOW[2];
      pixels[at + 3] = BELOW[3];
    }
  }
  // Sea and empty pixels take the colour of the nearest land (they stay fully transparent), so the globe's linear filtering fades coasts
  // out instead of blending them towards black. A few passes cover the reach of the filter.
  for (let pass = 0; pass < 3; pass++) {
    const src = pixels.slice();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const at = (y * cols + x) * 4;
        if (src[at + 3] !== 0 || (src[at] | src[at + 1] | src[at + 2]) !== 0) continue;
        let r = 0, g = 0, b = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= rows) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const k = (yy * cols + ((x + dx + cols) % cols)) * 4;
            if (src[k + 3] === 0 && (src[k] | src[k + 1] | src[k + 2]) === 0) continue;
            r += src[k]; g += src[k + 1]; b += src[k + 2]; n++;
          }
        }
        if (n) { pixels[at] = r / n; pixels[at + 1] = g / n; pixels[at + 2] = b / n; }
      }
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

// ------------------------------------------------------------------ top places

export interface TopPlace {
  /** 1 for the best place. */
  rank: number;
  /** Stored cell index. */
  index: number;
  /** Centre of the cell. */
  lat: number;
  lon: number;
  score: number;
}

/** The old app's rule (pickHotspots): peaks at least this far apart, so the list is not twenty cells of one region. */
export const TOP_MIN_SEPARATION_DEG = 7;
export const TOP_COUNT = 20;
const topCache = new WeakMap<CellScores, TopPlace[]>();

/**
 * The best-scoring cells, greedily: the highest cell first, then each next
 * highest cell at least TOP_MIN_SEPARATION_DEG of arc from every one already
 * kept. Reads the scores only; nothing is rescored.
 */
export function topPlaces(grid: Grid, cells: CellScores, count = TOP_COUNT, minSepDeg = TOP_MIN_SEPARATION_DEG): TopPlace[] {
  const cached = count === TOP_COUNT && minSepDeg === TOP_MIN_SEPARATION_DEG ? topCache.get(cells) : undefined;
  if (cached) return cached;
  const { scores } = cells;
  const order = Uint32Array.from({ length: scores.length }, (_, i) => i).sort((a, b) => scores[b] - scores[a]);
  const rad = Math.PI / 180;
  const cosSep = Math.cos(minSepDeg * rad);
  const kept: (TopPlace & { sinLa: number; cosLa: number; lo: number })[] = [];
  for (let k = 0; k < order.length && kept.length < count; k++) {
    const index = order[k];
    const { lat, lon } = cellCentre(grid, index);
    const la = lat * rad;
    const lo = lon * rad;
    const sinLa = Math.sin(la);
    const cosLa = Math.cos(la);
    // Too close to a kept peak when the cosine of the arc between them is above that of the separation.
    if (kept.some((p) => sinLa * p.sinLa + cosLa * p.cosLa * Math.cos(lo - p.lo) > cosSep)) continue;
    kept.push({ rank: kept.length + 1, index, lat, lon, score: scores[index], sinLa, cosLa, lo });
  }
  const list = kept.map(({ rank, index, lat, lon, score }) => ({ rank, index, lat, lon, score }));
  if (count === TOP_COUNT && minSepDeg === TOP_MIN_SEPARATION_DEG) topCache.set(cells, list);
  return list;
}

export interface CellSummary {
  centreLat: number;
  centreLon: number;
  cellDegrees: number;
  /** Similarity of the cell, sampled at its centre. */
  score: number;
  /** Share of land cells scoring lower; null until the whole grid has been scored for this profile. */
  percentileRank: number | null;
}

/** The heatmap's value for the cell containing a point, or null where there is no cell. */
export function cellSummary(grid: Grid, profile: Profile, cells: CellScores | null, lat: number, lon: number): CellSummary | null {
  const i = cellIndexAt(grid, lat, lon);
  if (i < 0) return null;
  const centre = cellCentre(grid, i);
  const mine = cells?.key === profileKey(profile);
  const score = mine ? cells.scores[i] : scoreCell(grid, i, profile);
  return {
    centreLat: centre.lat,
    centreLon: centre.lon,
    cellDegrees: grid.header.cellDegrees,
    score,
    percentileRank: mine ? percentileRank(cells, score) : null,
  };
}
