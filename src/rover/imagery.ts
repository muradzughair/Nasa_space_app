/**
 * Imagery draped on the simulator's ground: Web Mercator tiles from the
 * same services as the globe's two satellite layers, resampled onto the
 * ground's local grid (north up, row 0 = the north edge), as the old
 * pipeline's img.jpg and ctx.jpg were. The colour is the image only; it
 * carries no height and nothing in the physics reads it.
 */
import { patchToLonLat } from "./earthground";

export type DrapeId = "esri" | "sentinel" | "none";

interface DrapeSpec {
  label: string;
  /** Pixel size the source can resolve at best, where known (EOX states 10 m); Esri does not state it per place. */
  sourceRes: number | null;
  maxZoom: number;
  tile(z: number, x: number, y: number): string;
  attribution: string;
  /** The credit in a few words, for the one-line credits under the simulator's details panel. */
  short: string;
  terms: string;
}

export const DRAPES: Record<Exclude<DrapeId, "none">, DrapeSpec> = {
  esri: {
    label: "Esri World Imagery",
    sourceRes: null,
    maxZoom: 18,
    // blankTile=false: a tile Esri does not have answers 404 instead of a "Map data not yet available" picture
    tile: (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}?blankTile=false`,
    attribution: "Imagery © Esri, Vantor (Maxar), Earthstar Geographics, and the GIS User Community",
    short: "© Esri, Vantor, Earthstar Geographics",
    terms: "Esri Master License Agreement.",
  },
  sentinel: {
    label: "Sentinel-2 cloudless 2020 (EOX)",
    sourceRes: 10,
    maxZoom: 15,
    tile: (z, x, y) => `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/${z}/${y}/${x}.jpg`,
    attribution: "Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2020)",
    short: "Sentinel-2 cloudless © EOX (Copernicus data)",
    terms: "CC BY-NC-SA 4.0 for non-commercial use (EOX licence summary); commercial use needs EOX's commercial licence.",
  },
};

const MERC = 156543.03392804097;

export interface Drape {
  canvas: HTMLCanvasElement;
  zoom: number;
  /** Ground size of one tile pixel at this latitude. */
  tilePixelM: number;
  /** Size of one pixel of the draped picture. */
  pixelM: number;
  tiles: number;
  missing: number;
  bytes: number;
}

async function tileImage(url: string, signal?: AbortSignal): Promise<{ img: ImageBitmap; bytes: number } | null> {
  const res = await fetch(url, { signal });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  return { img: await createImageBitmap(blob), bytes: blob.size };
}

/**
 * The picture of a square of `size` metres centred on the point, px x px,
 * from zoom `z` (lower zooms are tried, down to three levels, for tiles the
 * service does not have).
 */
export async function drape(id: Exclude<DrapeId, "none">, lat0: number, lon0: number, size: number, px: number, z: number, signal?: AbortSignal): Promise<Drape | null> {
  const spec = DRAPES[id];
  z = Math.min(spec.maxZoom, z);
  // the mapping from the output grid to Web Mercator pixels, on a coarse lattice (it is smooth over 10 km)
  const L = 33, mx = new Float64Array(L * L), my = new Float64Array(L * L);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let i = 0; i < L; i++) for (let j = 0; j < L; j++) {
    const [lon, lat] = patchToLonLat(lat0, lon0, size, (j / (L - 1)) * size, (i / (L - 1)) * size);
    const s = Math.sin((lat * Math.PI) / 180), X = ((lon + 180) / 360) * 256 * 2 ** z, Y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * 256 * 2 ** z;
    mx[i * L + j] = X; my[i * L + j] = Y;
    x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y);
  }
  const tx0 = Math.floor(x0 / 256), tx1 = Math.floor(x1 / 256), ty0 = Math.floor(y0 / 256), ty1 = Math.floor(y1 / 256);
  const W = (tx1 - tx0 + 1) * 256, H = (ty1 - ty0 + 1) * 256;
  const mosaic = document.createElement("canvas");
  mosaic.width = W; mosaic.height = H;
  const g = mosaic.getContext("2d", { willReadFrequently: true })!;
  let bytes = 0, missing = 0, tiles = 0;
  const jobs: Promise<void>[] = [];
  for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
    jobs.push((async () => {
      tiles++;
      // a missing tile: its parent at up to three levels up, enlarged into place
      for (let up = 0; up <= 3; up++) {
        const k = 2 ** up, t = await tileImage(spec.tile(z - up, Math.floor(tx / k), Math.floor(ty / k)), signal);
        if (!t) continue;
        bytes += t.bytes;
        const s = 256 / k;
        g.drawImage(t.img, (tx % k) * s, (ty % k) * s, s, s, (tx - tx0) * 256, (ty - ty0) * 256, 256, 256);
        t.img.close();
        if (up) missing++;
        return;
      }
      missing++;
    })());
  }
  await Promise.all(jobs);
  if (missing === tiles) return null;
  const src = g.getImageData(0, 0, W, H).data;
  const out = document.createElement("canvas");
  out.width = out.height = px;
  const og = out.getContext("2d")!, im = og.createImageData(px, px), d = im.data;
  for (let i = 0; i < px; i++) {
    const fi = ((i + 0.5) / px) * (L - 1), a = Math.min(L - 2, Math.floor(fi)), u = fi - a;
    for (let j = 0; j < px; j++) {
      const fj = ((j + 0.5) / px) * (L - 1), b = Math.min(L - 2, Math.floor(fj)), v = fj - b;
      const q = a * L + b, X = (mx[q] * (1 - v) + mx[q + 1] * v) * (1 - u) + (mx[q + L] * (1 - v) + mx[q + L + 1] * v) * u, Y = (my[q] * (1 - v) + my[q + 1] * v) * (1 - u) + (my[q + L] * (1 - v) + my[q + L + 1] * v) * u;
      const sx = Math.min(W - 1, Math.max(0, Math.floor(X - tx0 * 256))), sy = Math.min(H - 1, Math.max(0, Math.floor(Y - ty0 * 256))), s4 = (sy * W + sx) * 4, o = (i * px + j) * 4;
      d[o] = src[s4]; d[o + 1] = src[s4 + 1]; d[o + 2] = src[s4 + 2]; d[o + 3] = 255;
    }
  }
  og.putImageData(im, 0, 0);
  const tilePixelM = (MERC * Math.cos((lat0 * Math.PI) / 180)) / 2 ** z;
  return { canvas: out, zoom: z, tilePixelM, pixelM: size / px, tiles, missing, bytes };
}

/** Zoom whose tile pixels are about `metres` across at this latitude. */
export const zoomFor = (lat: number, metres: number) => Math.max(1, Math.round(Math.log2((MERC * Math.cos((lat * Math.PI) / 180)) / metres)));
