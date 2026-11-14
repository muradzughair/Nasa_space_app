export interface LatLon {
  lat: number;
  lon: number;
}

const ALLOWED = /^[\s\d.,+\-°º'’′"”″nsew]+$/i;
const PART =
  /([nsew])?\s*([+-]?\d+(?:\.\d+)?)\s*[°º]?\s*(?:(\d+(?:\.\d+)?)\s*['’′]\s*)?(?:(\d+(?:\.\d+)?)\s*["”″]\s*)?([nsew])?/gi;

/**
 * Parses "31.95, 35.93", "31.95N 35.93E", "35.93 E, 31.95 N" and
 * degrees/minutes/seconds such as 31°57'N 35°56'E. Returns null when the text
 * is not an unambiguous coordinate pair.
 */
export function parseCoordinates(text: string): LatLon | null {
  const input = text.trim();
  if (!input || !ALLOWED.test(input)) return null;
  const parts: { value: number; hemi: string }[] = [];
  for (const m of input.matchAll(PART)) {
    const sign = m[2].startsWith("-") ? -1 : 1;
    const value = sign * (Math.abs(Number(m[2])) + Number(m[3] ?? 0) / 60 + Number(m[4] ?? 0) / 3600);
    parts.push({ value, hemi: (m[1] ?? m[5] ?? "").toUpperCase() });
  }
  if (parts.length !== 2) return null;
  let [a, b] = parts;
  const isLon = (h: string) => h === "E" || h === "W";
  const isLat = (h: string) => h === "N" || h === "S";
  if (isLon(a.hemi) || isLat(b.hemi)) [a, b] = [b, a];
  if (isLon(a.hemi) || isLat(b.hemi)) return null;
  const lat = a.hemi === "S" ? -Math.abs(a.value) : a.value;
  const lon = b.hemi === "W" ? -Math.abs(b.value) : b.value;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

export function formatLat(lat: number, digits = 4): string {
  return `${Math.abs(lat).toFixed(digits)}° ${lat >= 0 ? "N" : "S"}`;
}

export function formatLon(lon: number, digits = 4): string {
  return `${Math.abs(lon).toFixed(digits)}° ${lon >= 0 ? "E" : "W"}`;
}

export function formatDistance(metres: number): string {
  const abs = Math.abs(metres);
  if (abs >= 100_000) return `${Math.round(metres / 1000).toLocaleString("en-US")} km`;
  if (abs >= 1000) return `${(metres / 1000).toFixed(1)} km`;
  return `${Math.round(metres)} m`;
}

export function formatPopulation(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
  return Math.round(n).toLocaleString("en-US");
}

const R = 6371008.8;
const RAD = Math.PI / 180;

/** Great-circle distance in metres. */
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = (lat2 - lat1) * RAD;
  const dLon = (lon2 - lon1) * RAD;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
