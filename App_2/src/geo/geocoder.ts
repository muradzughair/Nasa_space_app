/**
 * Online place search and reverse geocoding through Nominatim
 * (OpenStreetMap data, ODbL). Follows the public instance's usage policy:
 * at most one request per second, results cached, and no autocomplete —
 * `searchOnline` is only called when the user submits a query.
 */
import { NOMINATIM_URL, ONLINE_GEOCODING } from "../config";
import { haversine } from "./coords";
import type { SearchResult } from "./geodata";

const MIN_INTERVAL = 1100;
let nextSlot = 0;

/** Waits for the next free request slot; rejects if aborted while waiting. */
function waitForSlot(signal?: AbortSignal): Promise<void> {
  const now = Date.now();
  const at = Math.max(now, nextSlot);
  nextSlot = at + MIN_INTERVAL;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, at - now);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        // Give the unused slot back if nobody queued behind us.
        if (nextSlot === at + MIN_INTERVAL) nextSlot = Math.max(Date.now(), at);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

async function request<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  await waitForSlot(signal);
  const url = `${NOMINATIM_URL}/${path}?${new URLSearchParams({ format: "jsonv2", "accept-language": "en", ...params })}`;
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Geocoder responded ${res.status}`);
  return (await res.json()) as T;
}

interface NominatimAddress {
  [key: string]: string | undefined;
}

interface NominatimItem {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  addresstype?: string;
  boundingbox?: [string, string, string, string];
  address?: NominatimAddress;
  error?: string;
}

function context(address: NominatimAddress | undefined, title: string): string {
  if (!address) return "";
  const parts = [address.city ?? address.town ?? address.municipality, address.state ?? address.region, address.country];
  return [...new Set(parts.filter((p): p is string => !!p && p !== title))].join(", ");
}

export const geocodingEnabled = ONLINE_GEOCODING;

export async function searchOnline(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  if (!ONLINE_GEOCODING) return [];
  const items = await request<NominatimItem[]>("search", { q: query, limit: "6", addressdetails: "1" }, signal);
  return items.map((item) => {
    const lat = Number(item.lat);
    const lon = Number(item.lon);
    const title = item.name || item.display_name.split(",")[0];
    let span = 20_000;
    if (item.boundingbox) {
      const [s, n, w, e] = item.boundingbox.map(Number);
      let dLon = Math.abs(e - w);
      if (dLon > 180) dLon = 360 - dLon;
      span = Math.max(haversine(s, 0, n, 0), haversine(lat, 0, lat, Math.min(dLon, 179.9)));
    }
    return {
      id: `osm:${item.place_id}`,
      kind: item.addresstype === "country" ? "country" : "place",
      title,
      subtitle: context(item.address, title) || item.display_name.split(",").slice(1, 3).join(",").trim(),
      lat,
      lon,
      span,
    } satisfies SearchResult;
  });
}

export interface ReverseResult {
  title: string;
  subtitle: string;
  isCountry: boolean;
}

const reverseCache = new Map<string, ReverseResult | null>();

/**
 * Names the place at a coordinate. `zoom` is Nominatim's detail level
 * (3 country … 10 city … 14 suburb … 18 building). Resolves null over open
 * water or when nothing is mapped there.
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
  zoom: number,
  signal?: AbortSignal,
): Promise<ReverseResult | null> {
  if (!ONLINE_GEOCODING) return null;
  const digits = zoom >= 12 ? 4 : zoom >= 8 ? 2 : 1;
  const key = `${lat.toFixed(digits)},${lon.toFixed(digits)},${zoom}`;
  if (reverseCache.has(key)) return reverseCache.get(key) ?? null;

  const item = await request<NominatimItem>(
    "reverse",
    { lat: lat.toFixed(6), lon: lon.toFixed(6), zoom: String(zoom), addressdetails: "1" },
    signal,
  );
  let result: ReverseResult | null = null;
  if (!item.error && item.display_name) {
    const title = item.name || (item.addresstype && item.address?.[item.addresstype]) || item.display_name.split(",")[0];
    result = { title, subtitle: context(item.address, title), isCountry: item.addresstype === "country" };
  }
  if (reverseCache.size > 300) reverseCache.clear();
  reverseCache.set(key, result);
  return result;
}

/** Maps the camera's height above ground to a Nominatim detail level. */
export function zoomForHeight(height: number): number {
  if (height > 1_500_000) return 3;
  if (height > 400_000) return 5;
  if (height > 90_000) return 8;
  if (height > 20_000) return 10;
  if (height > 5_000) return 13;
  if (height > 1_500) return 15;
  return 17;
}
