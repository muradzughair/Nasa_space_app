import { useSyncExternalStore } from "react";
import type { Body } from "../analog/scoring";
import type { PlanetId } from "../globe/planets";

export type ImageryId =
  | "ion" | "esri" | "sentinel" | "bluemarble" | "daily" | "osm"
  | "moon-wac" | "moon-lola" | "mars-viking" | "mars-mola";

/** NASA GIBS science layers that can be draped over Earth. */
export type OverlayId = "lst" | "dust" | "snow" | "ndvi";

export interface Settings {
  /** Imagery choice on Earth; the Moon and Mars keep their own. */
  imagery: ImageryId;
  moonImagery: ImageryId;
  marsImagery: ImageryId;
  labels: boolean;
  terrain: boolean;
  lighting: boolean;
  atmosphere: boolean;
  autoRotate: boolean;
}

export type SelectionKind = "place" | "country" | "water" | "point";

export interface Selection {
  id: number;
  lat: number;
  lon: number;
  /** Terrain elevation in metres, when known. */
  elevation: number | null;
  kind: SelectionKind;
  title: string;
  subtitle: string;
  population?: number;
  /** The point is in a sea or ocean (Natural Earth), so there is no ground to compare. */
  water: boolean;
  /** True while an online lookup may still refine the name. */
  resolving: boolean;
}

/** A place to fly to once the globe for another world has been built. */
export interface Arrival {
  lat: number;
  lon: number;
  span: number;
  title: string;
  subtitle: string;
}

export interface AtlasState {
  open: boolean;
  /** The body Earth is being compared with. */
  body: Body;
  /** The chosen version (profile) of each body. */
  profiles: Record<Body, string>;
  /** Earth candidate whose card is open, if any. */
  siteId: string | null;
  /** The ranked list of curated sites is expanded. */
  listOpen: boolean;
}

/** The similarity heatmap on Earth. The scores are not kept here (see analog/heatmap.ts). */
export interface HeatmapState {
  on: boolean;
  /** Layer opacity, 0 to 1. */
  opacity: number;
  /** Cells scoring below this are drawn as a neutral wash. Display only: scores do not change. */
  threshold: number;
}

/** Which screen of the verification workspace is open. Its records live in IndexedDB (verify/db.ts). */
export interface VerifyState {
  open: boolean;
  view: "list" | "new" | "request" | "respond" | "review";
  requestId: string | null;
}

export interface AppState {
  ready: boolean;
  planet: PlanetId;
  arrival: Arrival | null;
  overlay: OverlayId | null;
  atlas: AtlasState;
  heatmap: HeatmapState;
  verify: VerifyState;
  settings: Settings;
  /** Imagery actually on screen (differs from the setting after a fallback). */
  activeImagery: ImageryId | null;
  terrainSource: string;
  selection: Selection | null;
  tilesLoading: boolean;
  toast: string | null;
  fatal: string | null;
}

const SETTINGS_KEY = "earth.settings.v1";

function loadSettings(defaults: Settings): Settings {
  // The opening rotation is a per-visit flourish, not a stored preference,
  // and is skipped for people who ask for reduced motion.
  const autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaults, ...(JSON.parse(raw) as Partial<Settings>), autoRotate };
  } catch {
    /* storage unavailable: use defaults */
  }
  return { ...defaults, autoRotate };
}

type Listener = () => void;

function createStore(initial: AppState) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set(patch: Partial<AppState>) {
      state = { ...state, ...patch };
      listeners.forEach((l) => l());
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const store = createStore({
  ready: false,
  planet: "earth",
  arrival: null,
  overlay: null,
  atlas: { open: true, body: "mars", profiles: { mars: "mars-modern", moon: "moon-maria" }, siteId: null, listOpen: false },
  heatmap: { on: false, opacity: 0.8, threshold: 0 },
  verify: { open: false, view: "list", requestId: null },
  settings: loadSettings({
    imagery: "esri",
    moonImagery: "moon-wac",
    marsImagery: "mars-viking",
    labels: true,
    terrain: true,
    lighting: true,
    atmosphere: true,
    autoRotate: true,
  }),
  activeImagery: null,
  terrainSource: "",
  selection: null,
  tilesLoading: false,
  toast: null,
  fatal: null,
});

export function updateSettings(patch: Partial<Settings>) {
  const settings = { ...store.get().settings, ...patch };
  store.set({ settings });
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function showToast(message: string, ms = 5000) {
  clearTimeout(toastTimer);
  store.set({ toast: message });
  toastTimer = setTimeout(() => store.set({ toast: null }), ms);
}

/** Subscribe a component to one slice of state; rerenders only when it changes. */
export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()));
}

export function updateAtlas(patch: Partial<AtlasState>) {
  store.set({ atlas: { ...store.get().atlas, ...patch } });
}

/** Which setting holds the imagery choice for a world. */
export const imageryKey = (planet: PlanetId) =>
  planet === "moon" ? "moonImagery" : planet === "mars" ? "marsImagery" : "imagery";

export function updateHeatmap(patch: Partial<HeatmapState>) {
  store.set({ heatmap: { ...store.get().heatmap, ...patch } });
}

export function updateVerify(patch: Partial<VerifyState>) {
  store.set({ verify: { ...store.get().verify, ...patch } });
}
