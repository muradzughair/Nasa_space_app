/**
 * The curated dataset built by scripts/build-analogs.mjs: the reference
 * sites with their own measurements and published materials, the facts about
 * each body that are never scored, and the sources. Scores are not stored:
 * they are computed in the browser by scoring.ts.
 */
import { useEffect, useState } from "react";
import { DATA_URL } from "../config";

export type { Body as BodyId, Evaluation, Group, GroupId, GroupScore, Part, Profile, Quality } from "./scoring";

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
  /** Materials and landforms coded from the cited papers: 1 dominant, 0.5 present. */
  tags: Record<string, number>;
  /** Ground-ice class: 1 continuous, 0.5 sporadic, 0 none. */
  ice: number;
  m: Record<string, Metric>;
}

export interface Source {
  label: string;
  url: string;
  kind: "dataset" | "model" | "literature" | "computed";
}

export interface AtlasData {
  generated: string;
  /** The geology vocabulary: key to display name. */
  tags: Record<string, string>;
  bodies: Record<"earth" | "moon" | "mars", Body>;
  sites: Site[];
  sources: Record<string, Source>;
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
