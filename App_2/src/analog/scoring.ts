/**
 * The similarity model, in one place. The grid builder and the browser both
 * import this file, so a grid cell, a curated site and a click are scored by
 * exactly the same code.
 *
 * The model follows "Mars and Moon Analog Sites on Earth" (the metrics brief):
 *  - Mars and the Moon are scored separately, each with its own weights.
 *  - Nine metric groups, each a 0 to 1 similarity built from its parts.
 *  - Reachable targets (albedo, slope, mineral make-up) use a bell or a cosine
 *    on the target; targets Earth never reaches (temperature, rainfall,
 *    altitude) use a one-sided scale from "typical Earth" (0) to "most extreme
 *    on Earth" (1).
 *  - Rainfall, water vapour and terrain statistics are compared on log scales.
 *  - The groups are combined with a weighted geometric mean, so one poor
 *    match pulls the total down instead of being averaged away.
 *  - Gravity, air pressure and composition, radiation, magnetic field and day
 *    length are never scored: no place on Earth is closer than another.
 *
 * Only erasable TypeScript here: Node runs this file directly.
 */

export type Body = "mars" | "moon";
export type GroupId = "rock" | "aridity" | "thermal" | "landforms" | "barren" | "chemistry" | "regolith" | "altitude" | "optical";
/** How a part's Earth value was obtained. A proxy is inferred from other data, not observed. */
export type Quality = "measured" | "map" | "literature" | "proxy";

export interface Group {
  id: GroupId;
  label: string;
  /** Short name for the radar chart. */
  short: string;
  how: string;
}

export interface Part {
  label: string;
  /** 0 to 1. */
  score: number;
  /** Share of the group, before leaving out parts with no data. */
  weight: number;
  quality: Quality;
  /** The Earth value and what it is compared with, as text. */
  earth: string;
  target: string;
}

export interface GroupScore {
  /** 0 to 1, or null where the place has no data for this group. */
  score: number | null;
  parts: Part[];
}

export interface Evaluation {
  /** Weighted geometric mean of the groups that have data, 0 to 1. */
  overall: number;
  groups: Record<GroupId, GroupScore>;
  /** Shares of the profile's total weight, adding up to 1. */
  confidence: { measured: number; proxy: number; missing: number };
}

export const GROUPS: Group[] = [
  { id: "rock", label: "Rock type and mineralogy", short: "Rock", how: "Mineral make-up of the mapped rock type (or the site's published materials) against the target's, as a squared cosine similarity; plus fresh volcanic glass from Holocene volcanoes and, for the Moon, the absence of water-formed minerals." },
  { id: "aridity", label: "Aridity and water", short: "Aridity", how: "Annual precipitation and column water vapour on log scales, and surface soil wetness. One-sided: typical Earth scores 0, the driest places on Earth score 1." },
  { id: "thermal", label: "Temperature and ground ice", short: "Cold", how: "Mean surface temperature from 288 K (0) down to 218 K (1), day-to-night swing of the monthly mean surface temperature from 5 K (0) to 30 K (1), and permafrost. Mars only." },
  { id: "landforms", label: "Landforms and terrain", short: "Landforms", how: "The most relevant landform found (impact structure, volcano or lava, wind, relict water, periglacial) and how close median slope, roughness and relief are to the target region's, on a log scale." },
  { id: "barren", label: "No vegetation or organics", short: "Barren", how: "One minus vegetation cover from growing-season NDVI (0.08 = bare, 0.50 = fully covered)." },
  { id: "chemistry", label: "Soil chemistry", short: "Chemistry", how: "Soluble salts (perchlorate, sulfate, chloride) and iron oxides. Mars only." },
  { id: "regolith", label: "Regolith physical properties", short: "Regolith", how: "How loose, angular and unweathered the surface material is likely to be, inferred from rock type, young volcanism and climate." },
  { id: "altitude", label: "Altitude, thin air and UV", short: "Altitude", how: "Surface air pressure from sea level (0) down to 54 kPa (1), daily-mean UV index from 1 (0) to 3.3 (1) and cloud-free sky. Mars only." },
  { id: "optical", label: "Albedo and illumination", short: "Albedo", how: "Surface albedo on a bell around the target's (0.25 for Mars, 0.11 for the Moon); for the lunar south pole, how low the Sun stays." },
];

// ------------------------------------------------------------------ helpers

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** One-sided scale: `typical` scores 0, `extreme` scores 1, linear between and clamped beyond. */
export const oneSided = (v: number, typical: number, extreme: number) => clamp01((v - typical) / (extreme - typical));
/** The same on a log scale, for quantities spanning orders of magnitude. */
export const oneSidedLog = (v: number, typical: number, extreme: number) =>
  clamp01(Math.log(Math.max(v, Math.min(typical, extreme)) / typical) / Math.log(extreme / typical));
/** Bell centred on a target: equal scores 1, `sigma` away scores 0.61. */
export const bell = (v: number, target: number, sigma: number) => Math.exp(-0.5 * ((v - target) / sigma) ** 2);
/** Bell on a log scale: equal scores 1, a factor of 2 apart 0.61, a factor of 4 apart 0.14. */
export const logBell = (a: number, b: number, floor: number) => Math.exp(-0.5 * (Math.log(Math.max(a, floor) / Math.max(b, floor)) / Math.LN2) ** 2);
/** Dryness from annual precipitation: 800 mm (about the land average) scores 0, 2 mm or less scores 1. */
export const dryness = (mm: number) => oneSidedLog(mm, 800, 2);
/** Vegetation cover from growing-season NDVI: bare ground (0.08) = 0, closed cover (0.50) = 1. */
export const vegCover = (ndvi: number) => clamp01((ndvi - 0.08) / 0.42);
/** Highest solar elevation of the year at a latitude, for a body with the given axial tilt. */
export const sunElevation = (lat: number, obliquity: number) => Math.min(90, 90 - Math.abs(lat) + obliquity);
/** Wind dynamic pressure ½ρv² in pascals, from surface pressure (Pa), air temperature (K) and wind speed (m/s). */
export const windPressure = (pressure: number, airTemperature: number, wind: number) =>
  0.5 * (pressure / (287.05 * airTemperature)) * wind ** 2;
/** Credit for a mapped feature by distance: full within 10 km, none beyond 50 km. */
export const near = (km: number | null) => (km == null ? 0 : clamp01(1 - Math.max(0, km - 10) / 40));
/** Likelihood of permafrost from mean annual air temperature: none at −1 °C, continuous at −8 °C. */
export const permafrost = (airC: number) => oneSided(airC, -1, -8);

// ---------------------------------------------------------------- mineralogy

type Minerals = Record<string, number>;

/**
 * GLiM's sixteen rock classes with a typical mineral make-up of each
 * (fractions of the rock, textbook modal compositions). `minerals: null`
 * means the class says nothing about the ground (water, no data); glacier
 * ice is ground with no rock at all.
 */
export const LITHOLOGY: Record<string, { label: string; minerals: Minerals | null; ice?: boolean; loose?: number; volcanic?: number }> = {
  su: { label: "unconsolidated sediments", minerals: { quartz: 0.55, clay: 0.25, kfeldspar: 0.1, plagioclase: 0.1 }, loose: 1 },
  vb: { label: "basic volcanic rocks", minerals: { plagioclase: 0.45, pyroxene: 0.3, olivine: 0.08, glass: 0.12, ilmenite: 0.03, ironoxide: 0.02 }, volcanic: 0.6 },
  ss: { label: "siliciclastic sedimentary rocks", minerals: { quartz: 0.6, clay: 0.25, kfeldspar: 0.1, plagioclase: 0.05 }, loose: 0.4 },
  pb: { label: "basic plutonic rocks", minerals: { plagioclase: 0.55, pyroxene: 0.3, olivine: 0.1, ilmenite: 0.03, ironoxide: 0.02 } },
  sm: { label: "mixed sedimentary rocks", minerals: { quartz: 0.35, clay: 0.25, carbonate: 0.3, kfeldspar: 0.1 }, loose: 0.4 },
  sc: { label: "carbonate sedimentary rocks", minerals: { carbonate: 0.9, clay: 0.1 }, loose: 0.15 },
  va: { label: "acid volcanic rocks", minerals: { quartz: 0.3, kfeldspar: 0.3, plagioclase: 0.25, glass: 0.15 }, volcanic: 0.3 },
  mt: { label: "metamorphic rocks", minerals: { quartz: 0.35, plagioclase: 0.2, kfeldspar: 0.15, mafic: 0.3 } },
  pa: { label: "acid plutonic rocks", minerals: { quartz: 0.3, kfeldspar: 0.35, plagioclase: 0.25, mafic: 0.1 } },
  vi: { label: "intermediate volcanic rocks", minerals: { plagioclase: 0.55, pyroxene: 0.15, mafic: 0.05, quartz: 0.05, glass: 0.2 }, volcanic: 0.3 },
  wb: { label: "water bodies", minerals: null },
  py: { label: "pyroclastics", minerals: { glass: 0.6, plagioclase: 0.2, pyroxene: 0.1, quartz: 0.1 }, loose: 0.6, volcanic: 0.6 },
  pi: { label: "intermediate plutonic rocks", minerals: { plagioclase: 0.6, mafic: 0.25, quartz: 0.1, kfeldspar: 0.05 } },
  ev: { label: "evaporites", minerals: { sulfate: 0.5, salt: 0.4, carbonate: 0.1 }, loose: 0.3 },
  nd: { label: "no data", minerals: null },
  ig: { label: "ice and glaciers", minerals: null, ice: true },
};

/** What each literature tag of a curated site means as minerals. Landform tags carry none. */
const TAG_MINERALS: Record<string, Minerals> = {
  basalt: LITHOLOGY.vb.minerals!,
  anorthosite: { plagioclase: 0.95, pyroxene: 0.05 },
  ultramafic: { olivine: 0.75, pyroxene: 0.25 },
  carbonate: { carbonate: 1 },
  clay: { clay: 1 },
  sulfate: { sulfate: 1 },
  chloride: { salt: 1 },
  perchlorate: { salt: 1 },
  ironoxide: { ironoxide: 1 },
  silica: { silica: 1 },
  glass: { glass: 1 },
};
/** Minerals that form in water; lunar rock has none. */
const WATER_FORMED = ["clay", "carbonate", "sulfate", "salt", "silica", "ironoxide"];

const dot = (a: Minerals, b: Minerals) => {
  let sum = 0;
  for (const k in a) sum += a[k] * (b[k] ?? 0);
  return sum;
};
/** Squared cosine similarity of two mineral make-ups: sharing the main mineral is not enough to score well. */
export const mineralMatch = (a: Minerals, b: Minerals) => {
  const d = dot(a, b);
  return (d * d) / (dot(a, a) * dot(b, b));
};
const describe = (v: Minerals, count = 3) =>
  Object.entries(v).sort((a, b) => b[1] - a[1]).slice(0, count).map(([k, f]) => `${MINERAL_NAMES[k] ?? k} ${Math.round(f * 100)}%`).join(", ");
const MINERAL_NAMES: Record<string, string> = { kfeldspar: "K-feldspar", mafic: "amphibole and mica", salt: "chloride salts", ironoxide: "iron oxides", glass: "glass", silica: "opaline silica" };

// ------------------------------------------------------------------ profiles

export type Landform = "impact" | "volcanic" | "aeolian" | "fluvial" | "periglacial";
const LANDFORM_NAMES: Record<Landform, string> = {
  impact: "impact structure",
  volcanic: "volcanic landforms",
  aeolian: "wind landforms",
  fluvial: "relict water landforms",
  periglacial: "periglacial ground",
};

export interface Profile {
  id: string;
  body: Body;
  name: string;
  /** One line: what this version of the body is. */
  summary: string;
  /** The region whose terrain statistics stand for the profile, and where "Fly there" goes. */
  place: { name: string; lat: number; lon: number };
  minerals: Minerals;
  /** Median slope (°), roughness (m) and relief (m) of a 32 km window at `place`, measured like every Earth cell. */
  terrain: { slope: number; roughness: number; relief: number; src: "mola" | "lola" };
  /** How much each kind of landform counts, 0 to 1. */
  landforms: Partial<Record<Landform, number>>;
  /** Part weights inside the temperature group. */
  thermal: { mean: number; swing: number; ice: number };
  /** Acid-sulfate chemistry (sulfates and iron oxides) instead of salty, mildly alkaline soil. */
  acid?: boolean;
  albedo: number;
  /** The Sun never climbs far above the horizon (lunar south pole). */
  lowSun?: boolean;
  weights: Record<GroupId, number>;
}

/** Starting weights of the metrics brief, section 5.2, in percent. */
const MARS_WEIGHTS: Record<GroupId, number> = { rock: 20, aridity: 20, thermal: 15, landforms: 15, barren: 10, chemistry: 8, regolith: 5, altitude: 5, optical: 2 };
const MOON_WEIGHTS: Record<GroupId, number> = { rock: 30, aridity: 10, thermal: 0, landforms: 20, barren: 10, chemistry: 0, regolith: 20, altitude: 0, optical: 10 };

/** Rocknest soil at Gale crater as modelled by the MGS-1 simulant (Cannon et al. 2019). */
const MARS_SOIL: Minerals = { plagioclase: 0.27, glass: 0.23, pyroxene: 0.2, olivine: 0.14, sulfate: 0.06, ironoxide: 0.06, silica: 0.03, carbonate: 0.01 };
/** Apollo 16 regolith: calcium-rich plagioclase with impact glass (Lunar Sourcebook). */
const HIGHLAND_SOIL: Minerals = { plagioclase: 0.75, glass: 0.12, pyroxene: 0.08, olivine: 0.05 };

/**
 * The versions of Mars and the Moon a place can be compared with (brief,
 * section 5.1). The first of each body is its default. Terrain numbers are
 * measured from MOLA and LOLA by scripts/build-analogs.mjs (Jezero, Arcadia,
 * Tranquillitatis, south pole) and scripts/measure-profiles.mjs (the rest).
 */
export const PROFILES: Profile[] = [
  {
    id: "mars-modern", body: "mars", name: "Modern surface",
    summary: "Cold, hyper-arid, basaltic, wind-dominated, salty soil.",
    place: { name: "Gale crater floor", lat: -4.59, lon: 137.44 },
    minerals: MARS_SOIL,
    terrain: { slope: 2.11, roughness: 11.7, relief: 2725, src: "mola" },
    landforms: { aeolian: 1, volcanic: 0.8, impact: 0.8, fluvial: 0.6, periglacial: 0.4 },
    thermal: { mean: 0.5, swing: 0.2, ice: 0.3 },
    albedo: 0.25, weights: MARS_WEIGHTS,
  },
  {
    id: "mars-wet", body: "mars", name: "Ancient wet environments",
    summary: "Dry river deltas and lake beds with clays and carbonates, as at Jezero.",
    place: { name: "Jezero crater", lat: 18.44, lon: 77.45 },
    minerals: { olivine: 0.2, clay: 0.25, carbonate: 0.2, pyroxene: 0.15, plagioclase: 0.15, glass: 0.05 },
    terrain: { slope: 1.43, roughness: 16.9, relief: 815, src: "mola" },
    landforms: { fluvial: 1, impact: 0.7, aeolian: 0.5, volcanic: 0.5, periglacial: 0.2 },
    thermal: { mean: 0.5, swing: 0.2, ice: 0.3 },
    albedo: 0.25, weights: MARS_WEIGHTS,
  },
  {
    id: "mars-sulfate", body: "mars", name: "Acid-sulfate terrain",
    summary: "Iron oxides and sulfates such as jarosite, as at Meridiani Planum.",
    place: { name: "Meridiani Planum", lat: -1.95, lon: -5.53 },
    minerals: { sulfate: 0.38, silica: 0.2, ironoxide: 0.12, plagioclase: 0.1, pyroxene: 0.1, clay: 0.1 },
    terrain: { slope: 0.3, roughness: 3.5, relief: 77, src: "mola" },
    landforms: { fluvial: 0.9, aeolian: 0.8, impact: 0.6, volcanic: 0.5 },
    thermal: { mean: 0.5, swing: 0.2, ice: 0.3 },
    acid: true, albedo: 0.25, weights: MARS_WEIGHTS,
  },
  {
    id: "mars-volcanic", body: "mars", name: "Volcanic terrain",
    summary: "Lava plains, shield volcanoes and lava tubes.",
    place: { name: "Daedalia Planum", lat: -22, lon: -122 },
    minerals: { plagioclase: 0.4, pyroxene: 0.35, olivine: 0.15, glass: 0.1 },
    terrain: { slope: 0.39, roughness: 1.8, relief: 175, src: "mola" },
    landforms: { volcanic: 1, impact: 0.6, aeolian: 0.5 },
    thermal: { mean: 0.5, swing: 0.3, ice: 0.2 },
    albedo: 0.25, weights: MARS_WEIGHTS,
  },
  {
    id: "mars-polar", body: "mars", name: "Polar and periglacial",
    summary: "Ground ice, patterned ground and gullies at mid to high latitudes.",
    place: { name: "Arcadia Planitia", lat: 40, lon: -160 },
    minerals: MARS_SOIL,
    terrain: { slope: 0.28, roughness: 1.9, relief: 38, src: "mola" },
    landforms: { periglacial: 1, impact: 0.6, aeolian: 0.5, volcanic: 0.4 },
    thermal: { mean: 0.4, swing: 0.1, ice: 0.5 },
    albedo: 0.25, weights: MARS_WEIGHTS,
  },
  {
    id: "moon-maria", body: "moon", name: "Maria",
    summary: "Dark basalt plains, lava tubes and rilles.",
    place: { name: "Mare Tranquillitatis", lat: 8.3355, lon: 33.222 },
    minerals: { pyroxene: 0.4, plagioclase: 0.25, glass: 0.2, ilmenite: 0.08, olivine: 0.07 },
    terrain: { slope: 0.3, roughness: 3.5, relief: 77, src: "lola" },
    landforms: { volcanic: 1, impact: 1 },
    thermal: { mean: 1, swing: 0, ice: 0 },
    albedo: 0.11, weights: MOON_WEIGHTS,
  },
  {
    id: "moon-highlands", body: "moon", name: "Highlands",
    summary: "Bright anorthosite, heavily cratered.",
    place: { name: "Descartes highlands", lat: -8.97, lon: 15.5 },
    minerals: HIGHLAND_SOIL,
    terrain: { slope: 2.22, roughness: 20.6, relief: 498, src: "lola" },
    landforms: { impact: 1, volcanic: 0.4 },
    thermal: { mean: 1, swing: 0, ice: 0 },
    albedo: 0.11, weights: MOON_WEIGHTS,
  },
  {
    id: "moon-pole", body: "moon", name: "South pole",
    summary: "Highland material, low sun angles, extreme cold traps.",
    place: { name: "Connecting Ridge", lat: -89.45, lon: -137.3 },
    minerals: HIGHLAND_SOIL,
    terrain: { slope: 12.64, roughness: 35.8, relief: 3178, src: "lola" },
    landforms: { impact: 1, volcanic: 0.3 },
    thermal: { mean: 1, swing: 0, ice: 0 },
    albedo: 0.11, lowSun: true, weights: MOON_WEIGHTS,
  },
];

export const profilesOf = (body: Body) => PROFILES.filter((p) => p.body === body);
export const profileById = (id: string) => PROFILES.find((p) => p.id === id) ?? PROFILES[0];

// ------------------------------------------------------------------ measures

/** What is known about a place on Earth. Null means no data, never zero. */
export interface EarthMeasures {
  lat: number;
  /** Median slope (°), roughness (m) and relief (m) of a 32 km window on 450 m cells. */
  slope: number | null;
  roughness: number | null;
  relief: number | null;
  /** Mean land surface temperature, K. */
  tmean: number;
  /** Mean day-minus-night land surface temperature, K. */
  swing: number | null;
  /** Mean annual air temperature, °C. */
  airT: number | null;
  /** mm per year. */
  precipitation: number;
  /** Column water vapour, kg/m². */
  vapour: number;
  /** Surface soil wetness, 0 (dry) to 1 (saturated). */
  soilWetness: number | null;
  /** Growing-season NDVI. */
  ndvi: number | null;
  /** Surface air pressure, Pa. */
  pressure: number | null;
  /** UV index averaged over day and night, all year. */
  uv: number | null;
  /** Cloud amount, percent. */
  cloud: number | null;
  /** Surface albedo, 0 to 1. */
  albedo: number | null;
  /** GLiM rock class (a key of LITHOLOGY). */
  lithology: string | null;
  /** Materials and landforms coded from papers (curated sites only): 1 dominant, 0.5 present. */
  tags: Record<string, number> | null;
  /** Ground-ice class from the literature (curated sites only): 1 continuous, 0.5 sporadic, 0 none. */
  ice: number | null;
  /** Distance beyond the rim of the nearest known impact structure in km (0 inside), null if none within reach. */
  impact: number | null;
  /** Distance to the nearest Holocene volcano in km, null if none within reach. */
  volcano: number | null;
  /** That volcano erupts basalt. */
  volcanoBasaltic: boolean;
}

// ------------------------------------------------------------------- scoring

/** Collects the parts of one group. In fast mode it keeps only the running sums. */
interface Collector {
  sum: number;
  weight: number;
  proxy: number;
  parts: Part[] | null;
}
const collector = (detail: boolean): Collector => ({ sum: 0, weight: 0, proxy: 0, parts: detail ? [] : null });
function add(c: Collector, label: string, score: number, weight: number, quality: Quality, earth: () => string, target: string): void {
  if (weight <= 0) return;
  c.sum += score * weight;
  c.weight += weight;
  if (quality === "proxy") c.proxy += weight;
  if (c.parts) c.parts.push({ label, score: +score.toFixed(3), weight, quality, earth: earth(), target });
}

const fixed = (v: number, digits = 0) => v.toFixed(digits);

/** The mineral make-up of a place: published materials where there are any, over the mapped rock class. */
function mineralsAt(m: EarthMeasures): { minerals: Minerals; quality: Quality; label: string } | null {
  const mapped = m.lithology ? LITHOLOGY[m.lithology] : null;
  let tagged: Minerals | null = null;
  let total = 0;
  const names: string[] = [];
  if (m.tags) {
    for (const tag in m.tags) {
      const unit = TAG_MINERALS[tag];
      if (!unit) continue;
      tagged ??= {};
      for (const k in unit) tagged[k] = (tagged[k] ?? 0) + unit[k] * m.tags[tag];
      total += m.tags[tag];
      names.push(tag);
    }
  }
  if (tagged) {
    // Tags name the notable materials, not the whole rock: where a rock class is mapped it fills half.
    const share = mapped?.minerals ? 0.5 : 1;
    const minerals: Minerals = {};
    for (const k in tagged) minerals[k] = (tagged[k] / total) * share;
    if (mapped?.minerals) for (const k in mapped.minerals) minerals[k] = (minerals[k] ?? 0) + mapped.minerals[k] * 0.5;
    return { minerals, quality: "literature", label: `${names.join(", ")} (published)${mapped?.minerals ? ` over ${mapped.label}` : ""}` };
  }
  if (mapped?.minerals) return { minerals: mapped.minerals, quality: "map", label: mapped.label };
  if (mapped?.ice) return null;
  // No rock type mapped (coasts, lakes, gaps in the map): the commonest land surface is assumed, as an estimate.
  return { minerals: LITHOLOGY.su.minerals!, quality: "proxy", label: "no rock type mapped; loose sediments assumed" };
}

/** How strongly each kind of landform is present, 0 to 1, with the evidence. */
function landformsAt(m: EarthMeasures, dry: number, bare: number | null): Record<Landform, number> {
  const rock = m.lithology ? LITHOLOGY[m.lithology] : null;
  const tags = m.tags ?? {};
  if (rock?.ice && !m.tags) return { impact: near(m.impact), volcanic: 0, aeolian: 0, fluvial: 0, periglacial: 0 };
  const loose = rock?.loose ?? 0.15;
  const frozen = Math.max(m.ice ?? 0, m.airT != null ? permafrost(m.airT) : oneSided(m.tmean, 272, 265));
  return {
    impact: Math.max(near(m.impact), tags.impact ?? 0),
    volcanic: Math.max(near(m.volcano) * (m.volcanoBasaltic ? 1 : 0.7), rock?.volcanic ?? 0, tags.lavatube ?? 0, (tags.basalt ?? 0) * 0.6),
    // No global map of dunes and yardangs: loose, dry, bare ground is where wind does the work.
    aeolian: Math.max(tags.aeolian ?? 0, loose * dry * (bare ?? 1)),
    // Evaporite basins are dry lake beds; elsewhere, dry sedimentary lowland (fans, playas, channels).
    fluvial: Math.max(tags.delta ?? 0, m.lithology === "ev" ? 1 : 0, (m.lithology === "su" || m.lithology === "ss" || m.lithology === "sm" ? 0.6 : 0) * dry),
    periglacial: Math.max(tags.periglacial ?? 0, tags.groundice ?? 0, frozen),
  };
}

const GROUP_IDS: GroupId[] = ["rock", "aridity", "thermal", "landforms", "barren", "chemistry", "regolith", "altitude", "optical"];
/** A group that scores 0 is counted as this, so one total mismatch does not erase every other group. */
const FLOOR = 0.02;

function run(m: EarthMeasures, p: Profile, detail: boolean): Evaluation | number {
  const mars = p.body === "mars";
  const rockClass = m.lithology ? LITHOLOGY[m.lithology] : null;
  const iceSheet = !!rockClass?.ice && !m.tags;
  const dry = dryness(m.precipitation);
  const bare = m.ndvi != null ? 1 - vegCover(m.ndvi) : m.lat < -60 ? 1 : null;
  const volcanoNear = near(m.volcano) * (m.volcanoBasaltic ? 1 : 0.6);
  const c: Record<GroupId, Collector> = {} as Record<GroupId, Collector>;
  for (const id of GROUP_IDS) c[id] = collector(detail);

  // 1. Rock type and mineralogy
  const made = mineralsAt(m);
  if (iceSheet) {
    add(c.rock, "Mineral make-up", 0, 1, "map", () => "glacier ice, no rock at the surface", describe(p.minerals));
  } else if (made) {
    add(c.rock, "Mineral make-up", mineralMatch(made.minerals, p.minerals), mars ? 0.8 : 0.6, made.quality, () => `${made.label}: ${describe(made.minerals)}`, describe(p.minerals));
    const glass = Math.max(volcanoNear, m.tags?.glass ?? 0);
    add(c.rock, "Fresh volcanic glass", glass, 0.2, m.tags?.glass ? "literature" : "map",
      () => (m.volcano == null ? (m.tags?.glass ? "glass reported" : "no Holocene volcano within 50 km") : `Holocene volcano ${fixed(m.volcano)} km away${m.volcanoBasaltic ? " (basaltic)" : ""}`),
      mars ? "about a third of the soil is amorphous" : "impact glass and agglutinates");
    if (!mars) {
      let wet = 0;
      for (const k of WATER_FORMED) wet += made.minerals[k] ?? 0;
      add(c.rock, "No water-formed minerals", 1 - clamp01(wet), 0.2, made.quality, () => `${Math.round(wet * 100)}% clays, carbonates, salts or oxides`, "none");
    }
  }

  // 2. Aridity and water availability
  add(c.aridity, "Annual precipitation", dry, 0.45, "measured", () => `${fixed(m.precipitation)} mm`, "none");
  add(c.aridity, "Column water vapour", oneSidedLog(m.vapour, 25, 1), 0.25, "measured", () => `${fixed(m.vapour, 1)} kg/m²`, mars ? "about 0.01 kg/m²" : "none");
  if (m.soilWetness != null) add(c.aridity, "Surface soil wetness", oneSided(m.soilWetness, 0.5, 0.05), 0.3, "measured", () => `${Math.round(m.soilWetness! * 100)}% of saturation`, "dry");

  // 3. Temperature regime and ground ice (Mars)
  if (mars) {
    add(c.thermal, "Mean surface temperature", oneSided(m.tmean, 288, 218), p.thermal.mean, "measured", () => `${fixed(m.tmean)} K`, "210 K; colder is better");
    if (m.swing != null) add(c.thermal, "Day-to-night swing", oneSided(m.swing, 5, 30), p.thermal.swing, "measured", () => `${fixed(m.swing!)} K`, "60 K or more");
    if (m.ice != null) add(c.thermal, "Ground ice", m.ice, p.thermal.ice, "literature", () => (m.ice === 1 ? "continuous ice-rich ground" : m.ice ? "sporadic ground ice" : "none"), "ice-cemented ground");
    else if (iceSheet) add(c.thermal, "Ground ice", 0.5, p.thermal.ice, "map", () => "an ice sheet, not ice-cemented soil", "ice-cemented ground");
    else if (m.airT != null) add(c.thermal, "Permafrost", permafrost(m.airT), p.thermal.ice, "proxy", () => `mean air temperature ${fixed(m.airT!, 1)} °C`, "ice-cemented ground");
  }

  // 4. Landforms and terrain
  const forms = landformsAt(m, dry, bare);
  let best: Landform | null = null;
  let bestScore = 0;
  for (const kind in p.landforms) {
    const s = forms[kind as Landform] * p.landforms[kind as Landform]!;
    if (s > bestScore) { bestScore = s; best = kind as Landform; }
  }
  const mapped = best === "impact" || (best === "volcanic" && m.volcano != null) || (m.tags != null && best != null && (m.tags[best === "fluvial" ? "delta" : best] ?? 0) > 0);
  if (m.lithology != null || m.tags != null || m.impact != null || m.volcano != null) {
    add(c.landforms, "Relevant landforms", bestScore, 0.6, mapped ? "map" : "proxy",
      () => {
        const found = (Object.keys(p.landforms) as Landform[]).filter((k) => forms[k] >= 0.3).map((k) => `${LANDFORM_NAMES[k]} ${Math.round(forms[k] * 100)}%`);
        return found.length ? found.join(", ") : "none of the relevant kinds found";
      },
      (Object.keys(p.landforms) as Landform[]).map((k) => LANDFORM_NAMES[k]).join(", "));
  }
  if (m.slope != null && m.roughness != null && m.relief != null) {
    const shape = (logBell(m.slope, p.terrain.slope, 0.1) + logBell(m.roughness, p.terrain.roughness, 0.5) + logBell(m.relief, p.terrain.relief, 5)) / 3;
    add(c.landforms, "Slope, roughness and relief", shape, 0.4, "measured",
      () => `${fixed(m.slope!, 2)}°, ${fixed(m.roughness!, 1)} m, ${fixed(m.relief!)} m`, `${p.terrain.slope}°, ${p.terrain.roughness} m, ${p.terrain.relief} m at ${p.place.name}`);
  }

  // 5. Absence of vegetation and organics
  if (m.ndvi != null) add(c.barren, "Vegetation cover", bare!, 1, "measured", () => `${Math.round((1 - bare!) * 100)}% (NDVI ${fixed(m.ndvi!, 2)})`, "none");
  else if (bare != null) add(c.barren, "Vegetation cover", bare, 1, "proxy", () => "no satellite vegetation product; Antarctica has no plant cover to speak of", "none");

  // 6. Soil chemistry (Mars)
  if (mars && !iceSheet) {
    const t = m.tags;
    if (p.acid) {
      if (t) add(c.chemistry, "Sulfates and iron oxides", clamp01(((t.sulfate ?? 0) + (t.ironoxide ?? 0)) / 2 + (t.sulfate && t.ironoxide ? 0.25 : 0)), 1, "literature", () => [t.sulfate && "sulfates", t.ironoxide && "iron oxides"].filter(Boolean).join(" and ") || "neither reported", "jarosite and hematite");
      else if (m.lithology === "ev") add(c.chemistry, "Sulfates", 0.5, 1, "map", () => "evaporites mapped (sulfates likely, acidity unknown)", "jarosite and hematite");
    } else {
      // Perchlorate and nitrate build up only where almost no rain washes them out.
      const leached = oneSidedLog(m.precipitation, 60, 3);
      if (t) {
        add(c.chemistry, "Soluble salts", Math.max(t.perchlorate ?? 0, (t.sulfate ?? 0) * 0.7, (t.chloride ?? 0) * 0.7, leached * 0.5), 0.6, "literature", () => ["perchlorate", "sulfate", "chloride"].filter((k) => t[k]).join(", ") || "none reported", "perchlorate about 0.5%, sulfates, chlorides");
        add(c.chemistry, "Iron oxides", t.ironoxide ?? 0, 0.4, "literature", () => (t.ironoxide ? "reported" : "not reported"), "high; red-brown");
      } else {
        add(c.chemistry, "Soluble salts", m.lithology === "ev" ? 1 : leached, 1, m.lithology === "ev" ? "map" : "proxy", () => (m.lithology === "ev" ? "evaporites mapped" : `inferred from ${fixed(m.precipitation)} mm of rain a year`), "perchlorate about 0.5%, sulfates, chlorides");
      }
    }
  }

  // 7. Regolith physical properties
  if (iceSheet) {
    add(c.regolith, "Loose, unweathered surface", 0, 1, "map", () => "glacier ice", mars ? "wind-sorted dust and sand" : "sharp, glassy, fine regolith");
  } else {
    const id = rockClass?.minerals ? m.lithology! : m.tags ? "" : "su";
    // Fresh ash and cinder are the nearest natural match to lunar soil; wind-sorted sand and dust to Martian.
    let base = mars
      ? id === "su" ? 0.8 : id === "py" ? 0.9 : id === "vb" ? 0.6 : id === "ss" || id === "sm" ? 0.45 : id === "ev" ? 0.4 : 0.3
      : id === "py" ? 1 : id === "vb" ? 0.55 : id === "su" ? 0.25 : id === "ss" ? 0.2 : id === "sm" || id === "sc" || id === "ev" ? 0.1 : 0.3;
    if (m.volcano != null) base = Math.max(base, (0.6 + (mars ? 0.3 : 0.4)) * volcanoNear);
    if (m.tags?.glass) base = Math.max(base, (mars ? 0.8 : 0.9) * m.tags.glass);
    if (mars && m.tags?.aeolian) base = Math.max(base, 0.9 * m.tags.aeolian);
    // Rain weathers sharp fresh grains into rounded, clay-rich soil.
    add(c.regolith, "Loose, unweathered surface", base * (0.35 + 0.65 * dry), 1, "proxy",
      () => `${rockClass?.minerals ? rockClass.label : m.tags ? "published materials" : "no rock type mapped"}${m.volcano != null ? ", young volcanics nearby" : ""}, ${fixed(m.precipitation)} mm of rain a year`,
      mars ? "wind-sorted dust and sand" : "sharp, glassy, fine regolith");
  }

  // 8. Elevation, air pressure and ultraviolet (Mars)
  if (mars) {
    if (m.pressure != null) add(c.altitude, "Air pressure", oneSided(m.pressure, 101_325, 54_000), 0.4, "measured", () => `${fixed(m.pressure! / 1000)} kPa`, "0.6 kPa; never close");
    if (m.uv != null) add(c.altitude, "UV index, daily mean", oneSided(m.uv, 1, 3.3), 0.3, "measured", () => fixed(m.uv!, 1), "UV-C reaches the ground");
    if (m.cloud != null) add(c.altitude, "Cloud-free sky", oneSided(m.cloud, 70, 15), 0.3, "measured", () => `${fixed(100 - m.cloud!)}% clear`, "clear");
  }

  // 9. Albedo, colour and illumination
  if (m.albedo != null) add(c.optical, "Surface albedo", bell(m.albedo, p.albedo, 0.07), p.lowSun ? 0.5 : 1, "measured", () => fixed(m.albedo!, 2), fixed(p.albedo, 2));
  if (p.lowSun) {
    const sun = sunElevation(m.lat, 23.44);
    add(c.optical, "Highest Sun of the year", oneSided(sun, 70, 23.44), 0.5, "measured", () => `${fixed(sun)}°`, "about 2°");
  }

  // Weighted geometric mean over the groups that have data.
  let logSum = 0, used = 0, total = 0, proxy = 0;
  for (const id of GROUP_IDS) {
    const w = p.weights[id];
    if (w <= 0) continue;
    total += w;
    if (c[id].weight <= 0) continue;
    logSum += w * Math.log(Math.max(FLOOR, c[id].sum / c[id].weight));
    used += w;
    proxy += (w * c[id].proxy) / c[id].weight;
  }
  const overall = used ? Math.exp(logSum / used) : 0;
  if (!detail) return overall;
  const groups = {} as Record<GroupId, GroupScore>;
  for (const id of GROUP_IDS) groups[id] = { score: c[id].weight > 0 ? +(c[id].sum / c[id].weight).toFixed(3) : null, parts: c[id].parts! };
  return { overall, groups, confidence: { measured: (used - proxy) / total, proxy: proxy / total, missing: (total - used) / total } };
}

/** The full comparison of one place with one profile: every group, its parts and the data behind them. */
export const evaluate = (m: EarthMeasures, p: Profile): Evaluation => run(m, p, true) as Evaluation;
/** Only the overall similarity; the same arithmetic without building the parts. */
export const similarity = (m: EarthMeasures, p: Profile): number => run(m, p, false) as number;
/** The groups a profile scores, in display order. */
export const groupsOf = (p: Profile): Group[] => GROUPS.filter((g) => p.weights[g.id] > 0);
