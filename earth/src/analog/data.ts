/**
 * The analog dataset built by scripts/build-analogs.mjs, plus the part of
 * the scoring that runs in the browser: combining the per-dimension
 * similarities with a set of weights. The similarities themselves are
 * computed offline and never change here.
 */
import { useEffect, useState } from "react";
import { DATA_URL } from "../config";
import { type DimId, type DimScore, type Dimension, overall } from "./scoring";

export type { DimId, DimScore, Dimension, Part } from "./scoring";
export { overall } from "./scoring";
export type Weights = Record<DimId, number>;

export interface Metric {
  v: number;
  unit: string;
  /** Key into AtlasData.sources. */
  src: string;
}

export interface Body {
  name: string;
  gravity: number;
  radiation: { value: number; unit: string; ref: string };
  atmosphere?: string;
  day?: string;
}

export interface Target {
  id: string;
  body: "moon" | "mars";
  name: string;
  region: string;
  lat: number;
  lon: number;
  rationale: string;
  refs: string[];
  notes: { text: string; ref: string }[];
  weights: Weights;
  /** Surface materials and landforms on the geology vocabulary (1 dominant, 0.5 present). */
  tags: Record<string, number>;
  /** Ground-ice class: 1 continuous, 0.5 sporadic, 0 none. */
  ice: number;
  /** True where the habitable volume is underground (the lava-tube pit). */
  subsurface?: boolean;
  m: Record<string, Metric>;
  facts: (Metric & { label: string })[];
}

export interface Site {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  /** True for the established analogs kept as reference points. */
  known: boolean;
  refs: string[];
  summary: string;
  use: string;
  m: Record<string, Metric>;
}

export interface Source {
  label: string;
  url: string;
  kind: "dataset" | "model" | "literature" | "computed";
}

export interface AtlasData {
  generated: string;
  dimensions: Dimension[];
  /** The geology vocabulary: key to display name. */
  tags: Record<string, string>;
  bodies: Record<"earth" | "moon" | "mars", Body>;
  targets: Target[];
  sites: Site[];
  scores: Record<string, Record<string, Record<DimId, DimScore>>>;
  sources: Record<string, Source>;
}

export interface Preset {
  id: string;
  label: string;
  /** Null means the default weights of the target. */
  weights: Weights | null;
}

/** Mission goals that re-weight the same similarities. */
export const PRESETS: Preset[] = [
  { id: "balanced", label: "Balanced", weights: null },
  { id: "rover", label: "Rover mobility", weights: { terrain: 3, dustwind: 2, geology: 1, thermal: 0.5, water: 0.5, biology: 0.5, illumination: 0.25 } },
  { id: "polar", label: "Polar Moon base", weights: { illumination: 3, thermal: 2, water: 2, terrain: 1, geology: 0.5, biology: 0.5, dustwind: 0.25 } },
  { id: "bio", label: "Biosignature search", weights: { geology: 3, water: 2, biology: 1, thermal: 0.75, terrain: 0.25, dustwind: 0.25, illumination: 0.25 } },
  { id: "tube", label: "Lava-tube habitat", weights: { geology: 3, thermal: 2, terrain: 0.5, water: 0.5, biology: 0.5, dustwind: 0.25, illumination: 0.25 } },
];

export const weightsFor = (target: Target, presetId: string): Weights =>
  PRESETS.find((p) => p.id === presetId)?.weights ?? target.weights;

export interface Ranked {
  site: Site;
  score: number;
}

export function rank(data: AtlasData, target: Target, weights: Weights): Ranked[] {
  return data.sites
    .map((site) => ({ site, score: overall(data.scores[target.id][site.id], weights) }))
    .sort((a, b) => b.score - a.score);
}

let request: Promise<AtlasData> | null = null;

export function loadAtlas(): Promise<AtlasData> {
  request ??= fetch(`${DATA_URL}analogs.json`).then((res) => {
    if (!res.ok) throw new Error(`analogs.json: HTTP ${res.status}`);
    return res.json() as Promise<AtlasData>;
  });
  return request;
}

export function useAtlas(): { data: AtlasData | null; failed: boolean } {
  const [data, setData] = useState<AtlasData | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    loadAtlas().then(
      (d) => live && setData(d),
      () => {
        request = null;
        if (live) setFailed(true);
      },
    );
    return () => {
      live = false;
    };
  }, []);
  return { data, failed };
}

export const percent = (score: number | null) => (score == null ? "n/a" : `${Math.round(score * 100)}%`);

/** "2.1°", "290 K", "0.42": a value with its unit, with no space before a degree sign. */
export function withUnit(value: number, unit: string): string {
  const text = Math.abs(value) >= 1000 ? Math.round(value).toLocaleString("en-US") : String(value);
  return unit === "°" ? `${text}°` : unit ? `${text} ${unit}` : text;
}
