/**
 * What differs between the three worlds, kept free of CesiumJS imports so
 * the interface can read it without loading the rendering engine. The
 * controller turns this into an ellipsoid, layers and an atmosphere.
 */
import type { ImageryId } from "../state/store";

export type PlanetId = "earth" | "moon" | "mars";

export interface PlanetInfo {
  id: PlanetId;
  name: string;
  /** Equatorial and polar radii in metres. */
  radius: number;
  polarRadius: number;
  defaultImagery: ImageryId;
  /** Colour shown before imagery arrives. */
  baseColor: string;
  /** Earth only: label overlay, streamed terrain, real sun position, polar caps, place lookups. */
  earthServices: boolean;
  atmosphere: "earth" | "dusty" | "none";
  /** Closest useful view: the global mosaics run out of detail below this height. */
  minViewHeight: number;
  /** What a click on unnamed ground is called. */
  surface: string;
}

export const PLANETS: Record<PlanetId, PlanetInfo> = {
  earth: {
    id: "earth",
    name: "Earth",
    radius: 6_378_137,
    polarRadius: 6_356_752.3,
    defaultImagery: "esri",
    baseColor: "#0a1626",
    earthServices: true,
    atmosphere: "earth",
    minViewHeight: 500,
    surface: "Open water or unmapped land",
  },
  moon: {
    id: "moon",
    name: "Moon",
    radius: 1_737_400,
    polarRadius: 1_737_400,
    defaultImagery: "moon-wac",
    baseColor: "#262626",
    earthServices: false,
    atmosphere: "none",
    minViewHeight: 12_000,
    surface: "Lunar surface",
  },
  mars: {
    id: "mars",
    name: "Mars",
    radius: 3_396_190,
    polarRadius: 3_376_200,
    defaultImagery: "mars-viking",
    baseColor: "#4a2f22",
    earthServices: false,
    atmosphere: "dusty",
    minViewHeight: 25_000,
    surface: "Martian surface",
  },
};

export const PLANET_ORDER: PlanetId[] = ["earth", "moon", "mars"];
