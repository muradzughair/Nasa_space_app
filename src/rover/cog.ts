/**
 * A minimal reader for the Copernicus DEM Cloud Optimized GeoTIFFs: one
 * float32 band, 1024 or 512 pixel tiles, DEFLATE with or without the
 * floating-point predictor, point-registered pixels (GTRasterTypeGeoKey 2).
 * It reads the header and then only the tiles a window needs, with HTTP
 * range requests. Nothing else of the TIFF format is supported; a file that
 * is not laid out like this is rejected with the reason.
 */

export interface CogFile {
  url: string;
  width: number;
  height: number;
  tileW: number;
  tileH: number;
  offsets: number[];
  counts: number[];
  predictor: number;
  /** Longitude and latitude of the centre of pixel (0, 0), and the pixel spacing in degrees. */
  lon0: number;
  lat0: number;
  dLon: number;
  dLat: number;
  /** Bytes downloaded for this file so far (header and tiles). */
  bytes: number;
  tiles: Map<number, Promise<Float32Array>>;
}

export class NoTileError extends Error {}

async function range(url: string, start: number, end: number, signal?: AbortSignal): Promise<ArrayBuffer> {
  const res = await fetch(url, { headers: { Range: `bytes=${start}-${end}` }, signal });
  if (res.status === 404 || res.status === 403) throw new NoTileError(`HTTP ${res.status}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  // A server that ignores Range sends the whole file: keep only what was asked for.
  return res.status === 200 && buf.byteLength > end - start + 1 ? buf.slice(start, end + 1) : buf;
}

const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 11: 4, 12: 8, 16: 8 };

export async function openCog(url: string, signal?: AbortSignal): Promise<CogFile> {
  let buf = await range(url, 0, 32767, signal);
  let bytes = buf.byteLength;
  let view = new DataView(buf);
  if (view.getUint16(0, false) !== 0x4949 || view.getUint16(2, true) !== 42) throw new Error("not a little-endian classic TIFF");
  const ifd = view.getUint32(4, true);
  const count = view.getUint16(ifd, true);
  const tags = new Map<number, { type: number; n: number; at: number }>();
  let need = 0;
  for (let e = 0; e < count; e++) {
    const p = ifd + 2 + 12 * e;
    const tag = view.getUint16(p, true), type = view.getUint16(p + 2, true), n = view.getUint32(p + 4, true);
    const size = (TYPE_SIZE[type] ?? 1) * n;
    const at = size <= 4 ? p + 8 : view.getUint32(p + 8, true);
    tags.set(tag, { type, n, at });
    need = Math.max(need, at + size);
  }
  if (need > buf.byteLength) {
    buf = await range(url, 0, need + 1023, signal);
    bytes += buf.byteLength;
    view = new DataView(buf);
  }
  const values = (tag: number): number[] => {
    const t = tags.get(tag);
    if (!t) return [];
    const out: number[] = [];
    for (let k = 0; k < t.n; k++) {
      const at = t.at + k * (TYPE_SIZE[t.type] ?? 1);
      out.push(t.type === 3 ? view.getUint16(at, true) : t.type === 4 ? view.getUint32(at, true) : t.type === 12 ? view.getFloat64(at, true) : t.type === 11 ? view.getFloat32(at, true) : view.getUint8(at));
    }
    return out;
  };
  const one = (tag: number, fallback?: number) => values(tag)[0] ?? fallback;
  const width = one(256)!, height = one(257)!, bits = one(258), comp = one(259), fmt = one(339, 1), predictor = one(317, 1)!;
  const tileW = one(322), tileH = one(323);
  if (bits !== 32 || fmt !== 3) throw new Error(`unsupported sample format (${bits} bit, format ${fmt})`);
  if (comp !== 8 && comp !== 32946) throw new Error(`unsupported compression ${comp}`);
  if (!tileW || !tileH) throw new Error("the file is not tiled");
  if (predictor !== 1 && predictor !== 3) throw new Error(`unsupported predictor ${predictor}`);
  const scale = values(33550), tie = values(33922), keys = values(34735);
  if (scale.length < 2 || tie.length < 6) throw new Error("no georeferencing");
  // GeoKey 1025 (GTRasterTypeGeoKey): 2 = the tie point is the centre of pixel (0, 0); 1 = its corner.
  let rasterType = 1;
  for (let k = 4; k + 3 < keys.length; k += 4) if (keys[k] === 1025) rasterType = keys[k + 3];
  const half = rasterType === 2 ? 0 : 0.5;
  return {
    url, width, height, tileW, tileH, offsets: values(324), counts: values(325), predictor,
    lon0: tie[3] + half * scale[0], lat0: tie[4] - half * scale[1], dLon: scale[0], dLat: scale[1],
    bytes, tiles: new Map(),
  };
}

async function inflate(data: ArrayBuffer): Promise<Uint8Array> {
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Undo the floating-point predictor (TIFF predictor 3): byte planes per row, most significant first, horizontally differenced. */
function unpredict(raw: Uint8Array, w: number, h: number): Float32Array {
  const out = new Float32Array(w * h), o8 = new Uint8Array(out.buffer), row = w * 4;
  for (let i = 0; i < h; i++) {
    const r = i * row;
    for (let k = 1; k < row; k++) raw[r + k] = (raw[r + k] + raw[r + k - 1]) & 255;
    for (let j = 0; j < w; j++) {
      const q = (i * w + j) * 4;
      o8[q + 3] = raw[r + j];
      o8[q + 2] = raw[r + w + j];
      o8[q + 1] = raw[r + 2 * w + j];
      o8[q] = raw[r + 3 * w + j];
    }
  }
  return out;
}

/** Tile number k of the file, decoded to heights (tileW x tileH, row-major). */
export function cogTile(f: CogFile, k: number, signal?: AbortSignal): Promise<Float32Array> {
  let t = f.tiles.get(k);
  if (!t) {
    t = (async () => {
      const buf = await range(f.url, f.offsets[k], f.offsets[k] + f.counts[k] - 1, signal);
      f.bytes += buf.byteLength;
      const raw = await inflate(buf);
      if (raw.byteLength !== f.tileW * f.tileH * 4) throw new Error(`tile ${k}: ${raw.byteLength} bytes after inflating`);
      return f.predictor === 3 ? unpredict(raw, f.tileW, f.tileH) : new Float32Array(raw.buffer, raw.byteOffset, f.tileW * f.tileH);
    })();
    t.catch(() => f.tiles.delete(k));
    f.tiles.set(k, t);
  }
  return t;
}

export const tilesAcross = (f: CogFile) => Math.ceil(f.width / f.tileW);
