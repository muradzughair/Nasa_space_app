/**
 * Custom lunar targets: a point flagged on the Moon, turned into a Profile
 * that scoring.ts scores like any of its eight fixed ones. Nothing is scored
 * here and no formula, weight or scale is defined here.
 *
 * A custom Profile is one of the fixed lunar profiles ("base") with the
 * fields that can be established for the point replaced:
 *  - terrain: measured from LOLA for the 0.5° cell the point is in (moon.ts);
 *  - which base: Maria inside a mapped mare, Highlands elsewhere (moon.ts);
 *  - the low-Sun term: on where the point's highest Sun of the year, from
 *    its latitude, is lower than anywhere on Earth can match.
 * Everything else (mineral make-up, landform weights, albedo, group weights)
 * is the base profile's, and every field records which of these it is.
 */
import { useSyncExternalStore } from "react";
import { formatLat, formatLon } from "../geo/coords";
import { mareAt, type MoonGrid, moonTerrainAt } from "./moon";
import { type Body, type Evaluation, evaluate, type EarthMeasures, type Profile, profileById, PROFILES, profilesOf, sunElevation } from "./scoring";

/** How a field of a custom target was obtained. */
export type How = "measured" | "map" | "computed" | "inherited";
export const HOW_LABEL: Record<How, string> = {
  measured: "Measured",
  map: "From a map",
  computed: "Computed",
  inherited: "Inherited",
};

export interface ProvenanceRow {
  field: string;
  value: string;
  how: How;
  /** Where the value comes from, in words. */
  source: string;
}

export interface CustomTarget {
  /** Derived from the content below, so a different point can never share an id. */
  id: string;
  body: "moon";
  name: string;
  lat: number;
  lon: number;
  createdAt: string;
  /** The fixed profile whose remaining fields are inherited. */
  baseId: "moon-maria" | "moon-highlands";
  terrain: { slope: number; roughness: number; relief: number };
  lowSun: boolean;
  /** Highest Sun of the year at the point, degrees. */
  sun: number;
  provenance: ProvenanceRow[];
}

/** Axial tilt of the Moon to the ecliptic, degrees (the value scripts/analog-sites.mjs uses). */
const MOON_OBLIQUITY = 1.54;
/** The low end of the model's highest-Sun scale: the lowest value any place on Earth reaches. */
const LOWEST_SUN_ON_EARTH = 23.44;

const hash = (text: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
};
const listed = (v: Record<string, number>, unit: (n: number) => string) =>
  Object.entries(v).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${unit(n)}`).join(", ");

/**
 * Builds the target for a flagged point from the lunar grid. Fields that the
 * grid cannot supply are taken from a fixed profile and labelled inherited.
 */
export function buildCustomTarget(moon: MoonGrid, latIn: number, lonIn: number): CustomTarget {
  const lat = +latIn.toFixed(4);
  const lon = +lonIn.toFixed(4);
  const { header } = moon;
  const mare = mareAt(moon, lat, lon);
  const baseId = mare.mare ? "moon-maria" : "moon-highlands";
  const base = profileById(baseId);
  const pole = profileById("moon-pole");
  const measured = moonTerrainAt(moon, lat, lon);
  // With no measurement the nearest fixed region stands in: the south-pole profile's ridge in the south, the base elsewhere.
  const stand = lat < 0 ? pole : base;
  // Rounded as the fixed profiles' terrain is.
  const terrain = measured
    ? { slope: +measured.slope.toFixed(2), roughness: +measured.roughness.toFixed(1), relief: Math.round(measured.relief) }
    : { slope: stand.terrain.slope, roughness: stand.terrain.roughness, relief: stand.terrain.relief };
  const sun = sunElevation(lat, MOON_OBLIQUITY);
  const lowSun = sun < LOWEST_SUN_ON_EARTH;
  const inherited = `Inherited from the fixed profile "${base.name}"`;
  const t = header.terrain;

  const provenance: ProvenanceRow[] = [
    {
      field: "Slope, roughness, relief",
      value: `${terrain.slope}°, ${terrain.roughness} m, ${terrain.relief} m`,
      how: measured ? "measured" : "inherited",
      source: measured
        ? `LOLA LDEM_64 (474 m), ${t.windowKm} km window of ${t.sampleMetres} m cells centred ${formatLat(measured.centreLat, 2)}, ${formatLon(measured.centreLon, 2)}: the centre of the ${t.cellDegrees}° cell containing the point, ${measured.offsetKm.toFixed(1)} km from it`
        : `No measurement this close to the pole (the window would cross it). Inherited from the fixed profile "${stand.name}" (${stand.place.name})`,
    },
    {
      field: "Mare or highland",
      value: mare.mare ? `Mare${mare.name ? ` (${mare.name})` : ""}` : mare.covered ? "Not mare: highland" : "Taken as highland",
      how: mare.covered ? "map" : "inherited",
      source: mare.covered
        ? `LROC global mare boundaries (Nelson et al. 2014), read on a ${header.mare.cellDegrees}° raster (about ${Math.round(header.mare.cellDegrees * 30.3)} km)`
        : `The mare map stops at ${header.mare.latitudeLimit}° latitude; beyond it the point is assumed to be highland, not read from a map`,
    },
    {
      field: "Low-Sun term",
      value: `${lowSun ? "On" : "Off"}: highest Sun of the year ${sun.toFixed(1)}°`,
      how: "computed",
      source: `From the point's latitude and the Moon's ${MOON_OBLIQUITY}° tilt. On when lower than ${LOWEST_SUN_ON_EARTH}°, the lowest any place on Earth reaches`,
    },
    { field: "Mineral make-up", value: listed(base.minerals, (n) => `${Math.round(n * 100)}%`), how: "inherited", source: `${inherited}, chosen by the mare map. No mineral map is read at the point` },
    { field: "Landform weights", value: listed(base.landforms as Record<string, number>, String), how: "inherited", source: inherited },
    { field: "Albedo", value: base.albedo.toFixed(2), how: "inherited", source: `${inherited}. No albedo map is read at the point` },
    { field: "Group weights", value: listed(base.weights, (n) => `${n}%`), how: "inherited", source: "The Moon weights shared by all lunar profiles" },
  ];

  const place = mare.name ?? (mare.mare ? "Mare" : "Lunar point");
  return {
    id: `moon-custom-${hash(JSON.stringify([lat, lon, baseId, terrain, lowSun]))}`,
    body: "moon",
    name: `${place} ${formatLat(lat, 2)}, ${formatLon(lon, 2)}`,
    lat,
    lon,
    createdAt: new Date().toISOString(),
    baseId,
    terrain,
    lowSun,
    sun,
    provenance,
  };
}

// --------------------------------------------------------------------- store

const STORAGE_KEY = "earth.customTargets.v1";

interface Stored {
  targets: CustomTarget[];
  /** The custom target that was the chosen lunar version, so a reload returns to it. */
  active: string | null;
}

function read(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Stored;
      const targets = (stored.targets ?? []).filter((t) => t?.id?.startsWith("moon-custom-") && Number.isFinite(t.lat) && Number.isFinite(t.lon) && t.terrain && Array.isArray(t.provenance));
      return { targets, active: targets.some((t) => t.id === stored.active) ? stored.active : null };
    }
  } catch {
    /* storage unavailable or damaged: start empty */
  }
  return { targets: [], active: null };
}

let state = read();
const listeners = new Set<() => void>();

function write(next: Stored) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* the targets then last for this visit only */
  }
  listeners.forEach((l) => l());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const customTargets = () => state.targets;
export const useCustomTargets = () => useSyncExternalStore(subscribe, customTargets);
export const customTarget = (id: string) => state.targets.find((t) => t.id === id) ?? null;
export const isCustomId = (id: string) => id.startsWith("moon-custom-");
/** The custom target that was in use when the page was last open, if it still exists. */
export const activeCustomId = () => state.active;
export const setActiveCustom = (id: string | null) => {
  const active = id && customTarget(id) ? id : null;
  if (active !== state.active) write({ ...state, active });
};

/** Adds a target. Flagging the same point twice gives the one target. */
export function addCustomTarget(target: CustomTarget): CustomTarget {
  const existing = customTarget(target.id);
  if (existing) return existing;
  write({ ...state, targets: [...state.targets, target] });
  return target;
}

export function removeCustomTarget(id: string): void {
  profiles.delete(id);
  write({ targets: state.targets.filter((t) => t.id !== id), active: state.active === id ? null : state.active });
}

export function renameCustomTarget(id: string, name: string): void {
  write({ ...state, targets: state.targets.map((t) => (t.id === id ? { ...t, name } : t)) });
}

// ------------------------------------------------------------------ profiles

const profiles = new Map<string, { target: CustomTarget; profile: Profile }>();

/** The Profile of a custom target: its base profile with the per-point fields replaced. One object per target. */
export function customProfile(target: CustomTarget): Profile {
  const made = profiles.get(target.id);
  if (made?.target === target) return made.profile;
  const base = profileById(target.baseId);
  const mare = target.baseId === "moon-maria";
  const profile: Profile = {
    ...base,
    id: target.id,
    name: target.name,
    summary: `Custom target: a flagged point ${mare ? "in a mapped mare" : "outside the mapped maria"}. Terrain ${target.provenance[0]?.how === "measured" ? "measured there" : "inherited"}; materials inherited from ${base.name}.`,
    place: { name: target.name, lat: target.lat, lon: target.lon },
    terrain: { ...target.terrain, src: "lola" },
    lowSun: target.lowSun || undefined,
  };
  if (!profile.lowSun) delete profile.lowSun;
  profiles.set(target.id, { target, profile });
  return profile;
}

/** A profile by id, fixed or custom. An id that no longer exists gives the body's default, as profileById does. */
export function resolveProfile(id: string): Profile {
  const target = isCustomId(id) ? customTarget(id) : null;
  if (target) return customProfile(target);
  return isCustomId(id) ? profileById("moon-maria") : profileById(id);
}

/** The versions of a body: the fixed ones, then the custom targets. */
export const profilesFor = (body: Body): Profile[] => (body === "moon" ? [...profilesOf(body), ...state.targets.map(customProfile)] : profilesOf(body));

export const isFixed = (profile: Profile) => PROFILES.includes(profile);

/** A profile's name inside a sentence: "maria", or "custom point Mare Tranquillitatis 8.34°N, 33.22°E". */
export const versionLabel = (profile: Pick<Profile, "id" | "name">) => (isCustomId(profile.id) ? `custom point ${profile.name}` : profile.name.toLowerCase());

/**
 * evaluate() for any profile. For a custom target with the low-Sun term on,
 * the target text of that one part ("about 2°", written for the south-pole
 * profile) is replaced by the point's own value. No score changes.
 */
export function evaluateTarget(m: EarthMeasures, profile: Profile): Evaluation {
  const evaluation = evaluate(m, profile);
  const target = customTarget(profile.id);
  if (target?.lowSun) for (const part of evaluation.groups.optical.parts) if (part.label === "Highest Sun of the year") part.target = `${target.sun.toFixed(1)}° at the flagged point`;
  return evaluation;
}
