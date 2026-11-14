/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CESIUM_ION_TOKEN?: string;
  readonly VITE_NOMINATIM_URL?: string;
  readonly VITE_ONLINE_GEOCODING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
