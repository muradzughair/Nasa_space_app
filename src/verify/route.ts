/** Route geometry for the terrain preview. Plain maths, no rendering engine. */
import { haversine } from "../geo/coords";

export interface LatLon {
  lat: number;
  lon: number;
}

const RAD = Math.PI / 180;

/** Initial bearing from a to b, radians clockwise from north. */
export function bearing(a: LatLon, b: LatLon): number {
  const dLon = (b.lon - a.lon) * RAD;
  const y = Math.sin(dLon) * Math.cos(b.lat * RAD);
  const x = Math.cos(a.lat * RAD) * Math.sin(b.lat * RAD) - Math.sin(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.cos(dLon);
  return Math.atan2(y, x);
}

/** Length of a route in metres. */
export function routeLength(route: LatLon[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i++) total += haversine(route[i - 1].lat, route[i - 1].lon, route[i].lat, route[i].lon);
  return total;
}

/** Where a fraction (0 to 1) of the way along a route is, and which way the route is heading there (radians). */
export function routePosition(route: LatLon[], fraction: number): LatLon & { heading: number } {
  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    lengths.push(haversine(route[i - 1].lat, route[i - 1].lon, route[i].lat, route[i].lon));
    total += lengths[i - 1];
  }
  let left = Math.min(1, Math.max(0, fraction)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i] || i === lengths.length - 1) {
      const f = lengths[i] > 0 ? Math.min(1, left / lengths[i]) : 0;
      const a = route[i];
      const b = route[i + 1];
      // Segments are short, so straight interpolation in degrees is well within a pixel of the great circle.
      return { lat: a.lat + (b.lat - a.lat) * f, lon: a.lon + (b.lon - a.lon) * f, heading: bearing(a, b) };
    }
    left -= lengths[i];
  }
  return { ...route[0], heading: 0 };
}

/** A straight route of `length` metres that passes through `centre` at its midpoint, heading `degrees` from north. */
export function straightRoute(centre: LatLon, degrees: number, length: number): LatLon[] {
  const half = length / 2 / 111_320;
  const north = Math.cos(degrees * RAD) * half;
  const east = (Math.sin(degrees * RAD) * half) / Math.max(0.05, Math.cos(centre.lat * RAD));
  const round = (v: number) => +v.toFixed(6);
  return [
    { lat: round(centre.lat - north), lon: round(centre.lon - east) },
    { lat: round(centre.lat), lon: round(centre.lon) },
    { lat: round(centre.lat + north), lon: round(centre.lon + east) },
  ];
}
