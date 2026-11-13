/**
 * Names and descriptions of the imagery sources, kept free of CesiumJS
 * imports so the settings menu does not pull the rendering engine into the
 * initial bundle. The providers themselves are built in imagery.ts.
 */
import { ION_TOKEN } from "../config";
import type { ImageryId, OverlayId } from "../state/store";
import { PLANETS, type PlanetId } from "./planets";

export interface ImageryInfo {
  id: ImageryId;
  planet: PlanetId;
  label: string;
  detail: string;
}

const ALL: ImageryInfo[] = [
  { id: "ion", planet: "earth", label: "Bing Aerial", detail: "Cesium ion · sub-metre in cities" },
  { id: "esri", planet: "earth", label: "World Imagery", detail: "Esri · Maxar · sub-metre in cities" },
  { id: "sentinel", planet: "earth", label: "Sentinel-2 Cloudless", detail: "EOX · Copernicus · 10 m" },
  { id: "bluemarble", planet: "earth", label: "Blue Marble", detail: "NASA GIBS · 500 m" },
  { id: "daily", planet: "earth", label: "Daily Satellite View", detail: "NASA GIBS · real clouds · 250 m" },
  { id: "osm", planet: "earth", label: "Street Map", detail: "OpenStreetMap" },
  { id: "moon-wac", planet: "moon", label: "LRO WAC Mosaic", detail: "NASA Moon Trek · 100 m" },
  { id: "moon-lola", planet: "moon", label: "LOLA Colour Relief", detail: "NASA Moon Trek · elevation shading" },
  { id: "mars-viking", planet: "mars", label: "Viking Colour Mosaic", detail: "NASA Mars Trek · 232 m" },
  { id: "mars-mola", planet: "mars", label: "MOLA Colour Relief", detail: "NASA Mars Trek · elevation shading" },
];

/** Sources available in this deployment (ion only when a token is configured). */
export const imageryCatalog = ALL.filter((s) => s.id !== "ion" || ION_TOKEN);

export const imageryFor = (planet: PlanetId) => imageryCatalog.filter((s) => s.planet === planet);

export const defaultImagery: ImageryId = "esri";

export const imageryInfo = (id: ImageryId, planet: PlanetId = "earth"): ImageryInfo =>
  imageryCatalog.find((s) => s.id === id && s.planet === planet) ?? imageryCatalog.find((s) => s.id === PLANETS[planet].defaultImagery)!;

export interface OverlayInfo {
  id: OverlayId;
  label: string;
  detail: string;
  /** Ends of the colour scale, low to high. */
  scale: [string, string];
}

/** NASA GIBS science layers draped over Earth, one at a time. Names and dates are from the GIBS capabilities document. */
export const overlayCatalog: OverlayInfo[] = [
  { id: "lst", label: "Land surface temperature", detail: "MODIS Terra · daytime · July 2026", scale: ["Cold", "Hot"] },
  { id: "dust", label: "Dust at the surface", detail: "MERRA-2 · July 2026", scale: ["Clear", "Dusty"] },
  { id: "snow", label: "Snow cover", detail: "MODIS Terra · January 2026", scale: ["Bare", "Snow"] },
  { id: "ndvi", label: "Vegetation", detail: "MODIS Terra NDVI · July 2026", scale: ["Bare", "Dense"] },
];
