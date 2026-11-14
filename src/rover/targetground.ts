/**
 * The Mars and Moon target grounds of the rover simulation, ported from the
 * old app (origin/murad_app: app/js/terrain.js prepareReal / loadReal /
 * getPatch). The files are in public/rover/targets/: targets.json (the
 * targets and their patch metadata) and one folder per patch.
 *
 * - Real grounds (Gale, Jezero, Apollo 11): fine.h16 and ctx.h16, gzip
 *   compressed, decoded with decodeH16 exactly as the old loadReal did; the
 *   lowest point of the fine grid is 0 m, and the context ring shares that
 *   datum. Built with makePatch(), like the Earth ground.
 * - The south pole: one 129 x 129 grid of raw uint16 heights (the old
 *   patches.bin entry), with no context ring; built with finish(), and the
 *   smooth fine surface comes from upsample() as in the old app.
 */
import { decodeH16, finish, makePatch } from "./terrain.js";

export interface TargetTraits {
  relief: number;
  slope_med: number;
  slope_p90: number;
  roughness: number;
  temp_mean: number;
  temp_range: number;
  soil: number;
  dust: number;
  sun_elev: number;
}
export interface TargetInfo {
  id: string;
  body: "mars" | "moon";
  name: string;
  short: string;
  lat: number;
  lon: number;
  polar: boolean;
  note: string;
  traits: TargetTraits;
  patch: string;
  gravity: number;
}
interface PatchInfo {
  n: number;
  size_m: number;
  hscale: number;
  elevation_source: string;
  elevation_resolution_m: number | null;
  site_center?: [number, number];
  licence?: string[];
  real?: { dir: string; n: number; hscale: number; ctx: { n: number; size_m: number }; datum: string; fine_detail_rms_m: number };
  base?: { file: string };
}
interface TargetFile {
  targets: TargetInfo[];
  patches: Record<string, PatchInfo>;
}
/** Reads one file of public/rover/targets/ as bytes. The browser fetches it; the Node checks pass their own reader. */
export type TargetReader = (file: string, signal?: AbortSignal) => Promise<ArrayBuffer>;

const BASE = `${(import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/"}rover/targets/`;
const fetchReader: TargetReader = async (file, signal) => {
  const r = await fetch(BASE + file, { signal });
  if (!r.ok) throw new Error(`${file}: HTTP ${r.status}`);
  return r.arrayBuffer();
};

async function gunzip(buf: ArrayBuffer): Promise<Uint8Array> {
  return new Uint8Array(await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer());
}

let meta: Promise<TargetFile> | null = null;
/** targets.json, read once. */
export function loadTargetFile(read: TargetReader = fetchReader): Promise<TargetFile> {
  if (!meta || read !== fetchReader) {
    const p = read("targets.json").then((b) => JSON.parse(new TextDecoder().decode(b)) as TargetFile);
    if (read !== fetchReader) return p;
    meta = p.catch((e) => {
      meta = null;
      throw e;
    });
  }
  return meta;
}

/** A target ground ready for Site View: the target and its patch (terrain.js shape: n, size, h, U fine grid, C context ring when real). */
export interface TargetGround {
  target: TargetInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: any;
}

/** Loads the ground of one target id of targets.json (for example "mars_gale"). Rejects with a plain reason. */
export async function loadTargetGround(targetId: string, opts: { signal?: AbortSignal; read?: TargetReader } = {}): Promise<TargetGround> {
  const read = opts.read ?? fetchReader;
  const file = await loadTargetFile(read);
  const target = file.targets.find((t) => t.id === targetId);
  if (!target) throw new Error(`no target ${targetId} in targets.json`);
  const e = file.patches[target.patch];
  if (!e) throw new Error(`no patch ${target.patch} in targets.json`);
  const prov = { ...e, id: target.patch, synthetic_fine: !e.real || e.real.fine_detail_rms_m > 0 };
  if (e.real) {
    const r = e.real;
    const [f, c] = await Promise.all([read(`${r.dir}fine.h16`, opts.signal).then(gunzip), read(`${r.dir}ctx.h16`, opts.signal).then(gunzip)]);
    const F = decodeH16(f, r.n, r.hscale), C = decodeH16(c, r.ctx.n, r.hscale);
    let mn = Infinity;
    for (let i = 0; i < F.length; i++) if (F[i] < mn) mn = F[i];
    for (let i = 0; i < F.length; i++) F[i] -= mn;
    for (let i = 0; i < C.length; i++) C[i] -= mn; // lowest point of the patch = 0 m, as for every ground here
    const patch = makePatch(target.patch, e.n, { M: r.n, h: F, size: e.size_m }, { n: r.ctx.n, size: r.ctx.size_m, h: C }, prov);
    patch.kind = "target";
    return { target, patch };
  }
  if (!e.base) throw new Error(`patch ${target.patch} has no height file`);
  const buf = await read(e.base.file, opts.signal);
  if (buf.byteLength < e.n * e.n * 2) throw new Error(`${e.base.file}: ${buf.byteLength} bytes, expected ${e.n * e.n * 2}`);
  const dv = new DataView(buf), h = new Float32Array(e.n * e.n);
  for (let i = 0; i < h.length; i++) h[i] = dv.getUint16(i * 2, true) * e.hscale;
  const patch = finish(target.patch, e.n, e.size_m, h, "target", { synthetic: true, syntheticBase: true, prov });
  return { target, patch };
}
