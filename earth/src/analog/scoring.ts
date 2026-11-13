/**
 * The similarity scoring, in one place. The build scripts (build-analogs.mjs,
 * build-grid.mjs) and the browser all import this file, so a curated site, a
 * grid cell and a click are normalised in exactly the same way.
 *
 * Only erasable TypeScript here: Node runs this file directly.
 */

export type DimId = "terrain" | "thermal" | "water" | "geology" | "dustwind" | "biology" | "illumination";

export interface Part {
  label: string;
  earth: number;
  target: number;
  unit: string;
  score: number;
}

export interface DimScore {
  /** 0 to 1, or null where the place has no data for this dimension. */
  score: number | null;
  parts: Part[];
  /** Geology only: materials both places have, and dominant target materials the site lacks. */
  shared?: string[];
  missing?: string[];
}

export interface Dimension {
  id: DimId;
  label: string;
  how: string;
}

/** What is measured at a place on Earth. Null means no data, never zero. */
export interface EarthMeasures {
  slope: number;
  roughness: number;
  relief: number;
  tmean: number;
  tmax: number;
  precipitation: number;
  vapour: number;
  aod: number;
  windPressure: number;
  /** Growing-season NDVI. */
  ndvi: number | null;
  /** Highest solar elevation of the year, degrees. */
  sun: number;
  /** Ground-ice class (1 continuous, 0.5 sporadic, 0 none), where a source exists. */
  ice: number | null;
  /** Surface materials and landforms on the fixed vocabulary, where a source exists. */
  tags: Record<string, number> | null;
  /** True for cave sites, compared on cave temperature against a subsurface target. */
  cave?: boolean;
}

export interface TargetMeasures {
  slope: number;
  roughness: number;
  relief: number;
  tmean: number;
  tmax: number;
  vapour: number;
  aod: number;
  windPressure: number;
  sun: number;
  ice: number;
  tags: Record<string, number>;
  subsurface?: boolean;
}

export const DIMENSIONS: Dimension[] = [
  { id: "terrain", label: "Terrain", how: "Median slope, roughness and relief of a 32 km window on a common 450 m grid, compared on log scales (a factor of 20 apart scores 0)." },
  { id: "thermal", label: "Thermal", how: "Mean and peak surface temperature in kelvin, compared directly: 150 K apart scores 0. For the lava-tube target, cave sites are compared on cave-interior temperature." },
  { id: "water", label: "Water and ice", how: "Dryness (log of annual precipitation), column water vapour (log scale) and ground-ice class, in equal parts." },
  { id: "geology", label: "Geology", how: "Weighted overlap (Jaccard) of surface materials and landforms on a fixed 17-term vocabulary, coded from the cited papers." },
  { id: "dustwind", label: "Dust and wind", how: "Dust optical depth compared directly (1.0 apart scores 0) and wind dynamic pressure ½ρv² on a log scale, so thin Martian air counts." },
  { id: "biology", label: "Sterility", how: "One minus vegetation cover from growing-season MODIS NDVI (0.08 = bare, 0.68 = full canopy). The targets have none." },
  { id: "illumination", label: "Sun angle", how: "Highest solar elevation of the year from latitude and axial tilt; 90° apart scores 0." },
];

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Similarity of two positive quantities on a log scale: equal = 1, a factor of `span` apart = 0. */
export const logSim = (a: number, b: number, span: number, floor: number) =>
  clamp01(1 - Math.abs(Math.log(Math.max(a, floor) / Math.max(b, floor))) / Math.log(span));
/** Similarity on a linear scale: equal = 1, `span` apart = 0. */
export const linSim = (a: number, b: number, span: number) => clamp01(1 - Math.abs(a - b) / span);
/** Dryness from annual precipitation: 0 mm = 1, 3,000 mm = 0, logarithmic in between. */
export const dryness = (mm: number) => clamp01(1 - Math.log1p(mm) / Math.log1p(3000));
/** Vegetation cover from growing-season NDVI: bare ground (NDVI 0.08) = 0, dense canopy (0.68) = 1. */
export const vegCover = (ndvi: number) => clamp01((ndvi - 0.08) / 0.6);
/** Highest solar elevation of the year at a latitude, for a body with the given axial tilt. */
export const sunElevation = (lat: number, obliquity: number) => Math.min(90, 90 - Math.abs(lat) + obliquity);
/** Wind dynamic pressure ½ρv² in pascals, from surface pressure (Pa), air temperature (K) and wind speed (m/s). */
export const windPressure = (pressure: number, airTemperature: number, wind: number) =>
  0.5 * (pressure / (287.05 * airTemperature)) * wind ** 2;

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
const part = (label: string, earth: number, target: number, unit: string, score: number, digits = 1): Part => ({
  label,
  earth: +earth.toFixed(digits),
  target: +target.toFixed(digits),
  unit,
  score: +score.toFixed(3),
});
const combine = (parts: Part[]): DimScore => ({ score: +mean(parts.map((p) => p.score)).toFixed(3), parts });

/**
 * Seven similarities between a place on Earth and a target.
 *
 * `tagLabels` is the geology vocabulary (key to display name). A place
 * with no geology tags (every grid cell: no global dataset resolves the
 * vocabulary) gets no geology score, and overall() leaves the dimension out.
 */
export function compare(
  site: EarthMeasures,
  target: TargetMeasures,
  tagLabels: Record<string, string>,
): Record<DimId, DimScore> {
  const vocabulary = Object.keys(tagLabels);
  const terrain = combine([
    part("Median slope", site.slope, target.slope, "°", logSim(site.slope, target.slope, 20, 0.1), 2),
    part("Roughness", site.roughness, target.roughness, "m", logSim(site.roughness, target.roughness, 20, 0.5)),
    part("Relief", site.relief, target.relief, "m", logSim(site.relief, target.relief, 20, 5), 0),
  ]);

  // Inside a lava tube the comparison that matters is cave air, not the ground above it.
  const underground = !!target.subsurface && !!site.cave;
  const peak = underground ? site.tmean : site.tmax;
  const thermal = combine([
    part(underground ? "Cave temperature" : "Mean surface temperature", site.tmean, target.tmean, "K", linSim(site.tmean, target.tmean, 150)),
    part(underground ? "Cave peak temperature" : "Peak surface temperature", peak, target.tmax, "K", linSim(peak, target.tmax, 150)),
  ]);

  const waterParts = [
    part("Dryness index", dryness(site.precipitation), 1, "", linSim(dryness(site.precipitation), 1, 1), 2),
    part("Column water vapour", site.vapour, target.vapour, "kg/m²", logSim(site.vapour, target.vapour, 1e4, 1e-3), 3),
  ];
  if (site.ice != null) waterParts.push(part("Ground-ice class", site.ice, target.ice, "", linSim(site.ice, target.ice, 1)));
  const water = combine(waterParts);

  let geology: DimScore = { score: null, parts: [] };
  if (site.tags) {
    const tags = site.tags;
    const overlap = vocabulary.reduce((a, k) => a + Math.min(tags[k] ?? 0, target.tags[k] ?? 0), 0);
    const union = vocabulary.reduce((a, k) => a + Math.max(tags[k] ?? 0, target.tags[k] ?? 0), 0);
    geology = {
      score: union ? +(overlap / union).toFixed(3) : null,
      parts: [],
      shared: vocabulary.filter((k) => tags[k] && target.tags[k]).map((k) => tagLabels[k]),
      missing: vocabulary.filter((k) => target.tags[k] === 1 && !tags[k]).map((k) => tagLabels[k]),
    };
  }

  const dustwind = combine([
    part("Dust optical depth", site.aod, target.aod, "", linSim(site.aod, target.aod, 1), 2),
    part("Wind pressure", site.windPressure, target.windPressure, "Pa", logSim(site.windPressure, target.windPressure, 1e4, 0.01), 2),
  ]);

  const biology: DimScore =
    site.ndvi == null ? { score: null, parts: [] } : combine([part("Vegetation cover", vegCover(site.ndvi), 0, "", 1 - vegCover(site.ndvi), 2)]);
  const illumination = combine([part("Highest sun of the year", site.sun, target.sun, "°", linSim(site.sun, target.sun, 90))]);

  return { terrain, thermal, water, geology, dustwind, biology, illumination };
}

/**
 * compare()'s rounding of a part or dimension score, +v.toFixed(3), for v
 * in [0, 1]. toFixed rounds the exact decimal value of v half up, and
 * converting that string back is the same as dividing the integer by 1000.
 * Math.round(v * 1000) gives the same integer unless v * 1000 lands within
 * rounding error of a half, where the multiplication itself may have
 * rounded; those rare cases go through toFixed. About three times faster,
 * which matters at 12 roundings for each of 92,172 cells.
 */
const round3 = (v: number) => {
  const scaled = v * 1000;
  const frac = scaled - Math.floor(scaled);
  return Math.abs(frac - 0.5) < 1e-6 ? +v.toFixed(3) : Math.round(scaled) / 1000;
};
/** Rounded part scores, combined exactly as combine() does (summed left to right from 0, then rounded). */
const combined = (...scores: number[]) => {
  let sum = 0;
  for (const s of scores) sum += round3(s);
  return round3(sum / scores.length);
};

/**
 * The seven dimension scores of compare(), without the parts, labels and
 * rounded display values. Scoring every grid cell for the similarity map
 * calls this 92,172 times per target; building compare()'s part objects
 * made that the slowest step of showing the map. It must return exactly
 * compare(...)[dim].score (same functions, same rounding, same order of
 * operations); grid.ts checks a sample of cells against compare() in
 * development builds.
 */
export function compareScores(site: EarthMeasures, target: TargetMeasures, vocabulary: string[]): Record<DimId, number | null> {
  const underground = !!target.subsurface && !!site.cave;
  const peak = underground ? site.tmean : site.tmax;
  const dry = dryness(site.precipitation);
  const vapour = logSim(site.vapour, target.vapour, 1e4, 1e-3);
  let geology: number | null = null;
  if (site.tags) {
    const tags = site.tags;
    let overlap = 0;
    let union = 0;
    for (const k of vocabulary) overlap += Math.min(tags[k] ?? 0, target.tags[k] ?? 0);
    for (const k of vocabulary) union += Math.max(tags[k] ?? 0, target.tags[k] ?? 0);
    geology = union ? round3(overlap / union) : null;
  }
  return {
    terrain: combined(
      logSim(site.slope, target.slope, 20, 0.1),
      logSim(site.roughness, target.roughness, 20, 0.5),
      logSim(site.relief, target.relief, 20, 5),
    ),
    thermal: combined(linSim(site.tmean, target.tmean, 150), linSim(peak, target.tmax, 150)),
    water: site.ice != null ? combined(linSim(dry, 1, 1), vapour, linSim(site.ice, target.ice, 1)) : combined(linSim(dry, 1, 1), vapour),
    geology,
    dustwind: combined(linSim(site.aod, target.aod, 1), logSim(site.windPressure, target.windPressure, 1e4, 0.01)),
    biology: site.ndvi == null ? null : combined(1 - vegCover(site.ndvi)),
    illumination: combined(linSim(site.sun, target.sun, 90)),
  };
}

/** Weighted mean of the dimension similarities, 0 to 1. Dimensions with no data are left out, with their weight. */
export function overall(scores: Record<DimId, DimScore>, weights: Record<DimId, number>): number {
  let sum = 0;
  let total = 0;
  for (const id of Object.keys(weights) as DimId[]) {
    const score = scores[id].score;
    if (score == null) continue;
    sum += weights[id] * score;
    total += weights[id];
  }
  return total ? sum / total : 0;
}
