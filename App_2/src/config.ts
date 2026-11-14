const env = import.meta.env;

/** Optional Cesium ion token; enables Bing aerial imagery and Cesium World Terrain. */
export const ION_TOKEN = env.VITE_CESIUM_ION_TOKEN?.trim() ?? "";

export const NOMINATIM_URL = (env.VITE_NOMINATIM_URL?.trim() || "https://nominatim.openstreetmap.org").replace(/\/+$/, "");

export const ONLINE_GEOCODING = env.VITE_ONLINE_GEOCODING?.trim().toLowerCase() !== "false";

export const DATA_URL = `${env.BASE_URL}data/`;
