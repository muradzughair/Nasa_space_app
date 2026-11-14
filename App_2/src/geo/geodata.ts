/**
 * Offline geographic lookup built on Natural Earth 1:50m data
 * (see scripts/build-geodata.mjs). Answers "which country / sea is this
 * point in" and powers instant search suggestions without any network call.
 */
import { DATA_URL } from "../config";
import { haversine } from "./coords";

interface Poly {
  /** Bounding box: west, south, east, north. */
  b: [number, number, number, number];
  /** Rings as flat [lon, lat, ...] arrays; first is the outer ring. */
  r: number[][];
}

interface Country {
  n: string;
  a: string;
  iso: string;
  c: string;
  s: string;
  p: number;
  y: [number, number];
  g: Poly[];
}

interface Marine {
  n: string;
  t: string;
  g: Poly[];
}

/** name, country, region, lat, lon, population */
type Place = [string, string, string, number, number, number];

export interface LocalHit {
  kind: "country" | "water" | "none";
  name: string;
  detail: string;
  population?: number;
  /** Largest ground extent of the polygon that was hit, in metres. */
  span: number;
  /** Outline of the hit country, for highlighting. */
  rings?: number[][];
}

export interface SearchResult {
  id: string;
  kind: "country" | "place" | "coordinates";
  title: string;
  subtitle: string;
  lat: number;
  lon: number;
  /** Approximate ground extent in metres, used to choose the camera height. */
  span: number;
}

let countries: Country[] = [];
let marine: Marine[] = [];
let places: Place[] = [];
let loading: Promise<void> | null = null;

async function fetchJson<T>(file: string): Promise<T | null> {
  try {
    const res = await fetch(DATA_URL + file);
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase()) : s;

/** Loads the datasets once. Failures leave the lookups empty rather than throwing. */
export function loadGeodata(): Promise<void> {
  loading ??= Promise.all([
    fetchJson<Country[]>("countries.json"),
    fetchJson<Marine[]>("marine.json"),
    fetchJson<Place[]>("places.json"),
  ]).then(([c, m, p]) => {
    countries = c ?? [];
    marine = (m ?? []).map((x) => ({ ...x, n: titleCase(x.n) }));
    places = p ?? [];
  });
  return loading;
}

function inRing(ring: number[], lon: number, lat: number): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
    const xi = ring[i];
    const yi = ring[i + 1];
    const xj = ring[j];
    const yj = ring[j + 1];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function inPoly(poly: Poly, lon: number, lat: number): boolean {
  const [w, s, e, n] = poly.b;
  if (lon < w || lon > e || lat < s || lat > n) return false;
  // Even-odd over outer ring and holes.
  let inside = false;
  for (const ring of poly.r) if (inRing(ring, lon, lat)) inside = !inside;
  return inside;
}

function polySpan(poly: Poly): number {
  const [w, s, e, n] = poly.b;
  const midLat = (s + n) / 2;
  return Math.max(haversine(s, w, n, w), haversine(midLat, w, midLat, Math.min(e, w + 179.9)));
}

const bboxArea = (p: Poly) => (p.b[2] - p.b[0]) * (p.b[3] - p.b[1]);

/** Identifies the country or named body of water containing a point. */
export function locate(lat: number, lon: number): LocalHit {
  for (const c of countries) {
    for (const poly of c.g) {
      if (!inPoly(poly, lon, lat)) continue;
      return {
        kind: "country",
        name: c.n,
        detail: c.s && c.s !== c.c ? `${c.s} · ${c.c}` : c.c,
        population: c.p || undefined,
        span: polySpan(poly),
        rings: c.g.flatMap((p) => p.r),
      };
    }
  }
  // Seas nest inside oceans: prefer the most specific (smallest) match.
  let best: { m: Marine; poly: Poly } | null = null;
  for (const m of marine) {
    for (const poly of m.g) {
      if (inPoly(poly, lon, lat) && (!best || bboxArea(poly) < bboxArea(best.poly))) best = { m, poly };
    }
  }
  if (best) {
    return {
      kind: "water",
      name: best.m.n,
      detail: titleCase(best.m.t.toUpperCase()),
      span: polySpan(best.poly),
    };
  }
  return { kind: "none", name: "", detail: "", span: 0 };
}

export interface NearbyPlace {
  name: string;
  region: string;
  country: string;
  distance: number;
  population: number;
}

/** Nearest major city within `maxDistance` metres, if any. */
export function nearestPlace(lat: number, lon: number, maxDistance: number): NearbyPlace | null {
  let best: NearbyPlace | null = null;
  const latWindow = maxDistance / 111_000;
  for (const p of places) {
    if (Math.abs(p[3] - lat) > latWindow) continue;
    const d = haversine(lat, lon, p[3], p[4]);
    if (d <= maxDistance && (!best || d < best.distance)) {
      best = { name: p[0], country: p[1], region: p[2], distance: d, population: p[5] };
    }
  }
  return best;
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/** Instant, offline suggestions: countries first, then cities by population. */
export function searchLocal(query: string, limit = 6): SearchResult[] {
  const q = norm(query);
  if (q.length < 2) return [];
  const out: SearchResult[] = [];
  const rank = (name: string) => {
    const n = norm(name);
    if (n === q) return 0;
    if (n.startsWith(q)) return 1;
    if (n.includes(` ${q}`)) return 2;
    return -1;
  };

  const countryHits = countries
    .map((c) => ({ c, r: Math.min(...[c.n, c.a].map(rank).filter((r) => r >= 0), 9) }))
    .filter((x) => x.r < 9)
    .sort((x, y) => x.r - y.r || y.c.p - x.c.p)
    .slice(0, 3);
  for (const { c } of countryHits) {
    const main = c.g.reduce((a, b) => (bboxArea(b) > bboxArea(a) ? b : a));
    const hasLabel = Number.isFinite(c.y[0]) && Number.isFinite(c.y[1]);
    out.push({
      id: `country:${c.n}`,
      kind: "country",
      title: c.n,
      subtitle: c.s && c.s !== c.c ? `${c.s} · ${c.c}` : c.c,
      lat: hasLabel ? c.y[0] : (main.b[1] + main.b[3]) / 2,
      lon: hasLabel ? c.y[1] : (main.b[0] + main.b[2]) / 2,
      span: polySpan(main),
    });
  }

  const placeHits = places
    .map((p) => ({ p, r: rank(p[0]) }))
    .filter((x) => x.r >= 0)
    .sort((x, y) => x.r - y.r || y.p[5] - x.p[5])
    .slice(0, limit);
  for (const { p } of placeHits) {
    out.push({
      id: `place:${p[0]}:${p[3]}:${p[4]}`,
      kind: "place",
      title: p[0],
      subtitle: [p[2] !== p[0] ? p[2] : "", p[1]].filter(Boolean).join(", "),
      lat: p[3],
      lon: p[4],
      span: 30_000,
    });
  }
  return out.slice(0, limit);
}
