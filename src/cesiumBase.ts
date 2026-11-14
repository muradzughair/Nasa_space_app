// Must be imported before "cesium": tells CesiumJS where its static assets
// (workers, star map, credit icons) are served from. See vite.config.ts.
declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
  }
}

window.CESIUM_BASE_URL = `${import.meta.env.BASE_URL}cesium/`;

export {};
