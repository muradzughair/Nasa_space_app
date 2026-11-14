/**
 * The rover simulator, loaded only when "Simulate a rover here" is pressed
 * (this module and everything it imports, Three.js included, are a separate
 * chunk). It builds the ground of the point, then opens the old Site View
 * on it in a full-screen view with its own canvas, on top of the globe. On
 * exit everything it made is freed and the globe, with its view and
 * selection untouched, is shown again.
 */
import "./rsim.css";
import { D } from "./data.js";
import { buildEarthGround, GroundUnavailable, PATCH_M, CTX_M, COARSE_N } from "./earthground";
import { earthSoil } from "./earthsoil";
import { drape, DRAPES, type DrapeId, zoomFor } from "./imagery";
import { closeSite, openSite } from "./site.js";
import { benchKind, startBench } from "./quality.js";
import { makePatch } from "./terrain.js";

export interface SimPlace {
  name: string;
  lat: number;
  lon: number;
  kind: "grid-point" | "curated-site";
}
export interface SimTarget {
  id: string;
  name: string;
  body: "mars" | "moon";
  custom: boolean;
  /** Latitude of the version's reference place; picks the ground of a custom lunar point (targetground.ts groundFor). */
  lat?: number;
}
export interface SimOptions {
  place: SimPlace;
  target: SimTarget;
  /** The globe's imagery layer: the same source is draped on the ground when it is a satellite layer. */
  imagery: DrapeId;
  /** The analog card's similarity of this place to the target, already formatted ("78%"); null hides the card in the details panel. */
  similarity?: { text: string; target: string } | null;
  onExit: () => void;
}
export interface SimHandle {
  close(): Promise<void>;
}

const esc = (x: string) => x.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

let open: SimHandle | null = null;

export async function openRoverSim(opts: SimOptions): Promise<SimHandle> {
  if (open) await open.close();
  const { place, target } = opts;
  const app = document.getElementById("root");
  const root = document.createElement("div");
  root.className = "rsim";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", `Rover simulation at ${place.name}`);
  document.body.appendChild(root);
  // The globe underneath takes no focus or input while the simulator is open, and stops drawing.
  if (app) app.inert = true;
  const abort = new AbortController();
  let closed = false;
  const close = async () => {
    if (closed) return;
    closed = true;
    abort.abort();
    try {
      await closeSite();
    } catch (e) {
      console.error(e);
    }
    root.remove();
    if (app) app.inert = false;
    open = null;
    delete (window as unknown as Record<string, unknown>).__rsim;
    opts.onExit();
  };
  const handle: SimHandle = { close };
  open = handle;

  root.innerHTML = `<div class="rs-load" role="status" aria-live="polite"><div class="rs-load-box"><div class="veil-kicker">Rover simulation</div><div class="rs-load-title">${esc(place.name)}</div><div class="rs-spin" aria-hidden="true"></div><div class="rs-load-sub" id="rsStatus">Preparing</div><button class="btn ghost" id="rsCancel">Back to globe</button></div></div>`;
  const status = (s: string) => {
    const el = root.querySelector("#rsStatus");
    if (el) el.textContent = s;
  };
  root.querySelector("#rsCancel")!.addEventListener("click", () => void close());
  const fail = (why: string) => {
    if (closed) return;
    root.innerHTML = `<div class="rs-load" role="alert"><div class="rs-load-box"><div class="veil-kicker">Rover simulation</div><div class="rs-load-title">${esc(place.name)}</div><p class="rs-load-error">This place cannot be simulated. ${esc(why)}</p><button class="btn" id="rsBack">Back to globe</button></div></div>`;
    const b = root.querySelector<HTMLButtonElement>("#rsBack")!;
    b.addEventListener("click", () => void close());
    b.focus();
  };

  try {
    const id = `pt_${place.lat.toFixed(5)}_${place.lon.toFixed(5)}`;
    const registry = fetch(`${import.meta.env.BASE_URL}rover/assets/models/rovers.json`, { signal: abort.signal }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const soilP = earthSoil(place.lat, place.lon);
    const groundP = buildEarthGround(id, place.lat, place.lon, abort.signal, status);
    const imgP = (async () => {
      if (opts.imagery === "none") return null;
      const spec = DRAPES[opts.imagery];
      try {
        const zp = Math.min(spec.maxZoom, zoomFor(place.lat, 1));
        const tileM = (156543.03392804097 * Math.cos((place.lat * Math.PI) / 180)) / 2 ** zp;
        const px = Math.min(2048, 2 ** Math.ceil(Math.log2(Math.max(256, PATCH_M / Math.max(tileM, spec.sourceRes ?? 0)))));
        const cpx = (spec.sourceRes ?? tileM) <= 5 ? 1024 : 512;
        const [img, ctx] = await Promise.all([
          drape(opts.imagery, place.lat, place.lon, PATCH_M, px, zp, abort.signal),
          drape(opts.imagery, place.lat, place.lon, CTX_M, cpx, Math.min(spec.maxZoom, zoomFor(place.lat, CTX_M / cpx)), abort.signal),
        ]);
        return img ? { spec, img, ctx } : null;
      } catch (e) {
        if ((e as Error).name === "AbortError") throw e;
        console.error(e);
        return { spec, img: null, ctx: null, error: (e as Error).message };
      }
    })();
    const [reg, soil, ground, imagery] = await Promise.all([registry, soilP, groundP, imgP]);
    if (closed) return handle;
    D.rovers = reg;
    const prov = ground.prov;
    if (imagery && imagery.img) {
      prov.imagery_source = imagery.spec.label;
      prov.imagery_resolution_m = imagery.img.tilePixelM;
      if (imagery.img.missing) prov.missing.push(`imagery: ${imagery.img.missing} of ${imagery.img.tiles} tiles were not available at zoom ${imagery.img.zoom} and were enlarged from a lower zoom`);
    } else if (imagery && "error" in imagery) prov.missing.push(`imagery: ${imagery.spec.label} could not be loaded (${imagery.error}); the generic ground texture is shown`);
    else if (opts.imagery !== "none") prov.missing.push(`imagery: ${DRAPES[opts.imagery].label} has no tiles here; the generic ground texture is shown`);
    const patch = makePatch(id, COARSE_N, ground.fine, ground.ctx, prov);
    const gravity = (reg?.gravity_mps2 ?? { moon: 1.62, mars: 3.71 })[target.body] as number;
    const ctx = {
      place,
      target: { ...target, gravity, bodyName: target.body === "moon" ? "Moon" : "Mars" },
      soil,
      traits: { soil: soil.soil, dust: soil.dust, temp_mean: soil.tempK ?? 288 },
      prov,
      similarity: opts.similarity ?? null,
    };
    root.querySelector(".rs-load")?.remove();
    await openSite({ host: root, ctx, patch, imagery: imagery && imagery.img ? imagery : null, onBack: () => void close() });
    (window as unknown as Record<string, unknown>).__rsim = { patch, prov, ctx, imagery };
    const bk = benchKind();
    if (bk) runBench(bk, abort.signal).catch((e) => console.error("benchmark failed", e));
  } catch (e) {
    if (closed || (e as Error).name === "AbortError") return handle;
    console.error(e);
    fail(e instanceof GroundUnavailable ? e.message : `The ground could not be built: ${(e as Error).message}.`);
  }
  return handle;
}

/**
 * ?bench (drive mode) or ?bench=site (Site View orbit), ported from the old app/js/main.js. The old app opened its first site by itself; here a
 * place is picked on the globe, so the benchmark starts once the simulator has opened a place ("Simulate a rover here" with ?bench in the address):
 * it waits for the route analysis, runs a 20 s scripted session after 2 s of warm-up, prints TERRA_BENCH to the console and shows a copyable summary.
 */
async function runBench(kind: "drive" | "site", signal: AbortSignal) {
  type Any = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const w = window as unknown as Any;
  const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const wait = async (fn: () => unknown, ms = 240000) => {
    const t = performance.now();
    while (!fn()) {
      if (signal.aborted) throw new Error("simulator closed");
      if (performance.now() - t > ms) throw new Error("benchmark timed out");
      await pause(100);
    }
  };
  await wait(() => w.TERRA_SITE && w.TERRA_SITE.open && w.TERRA_SITE.runs);
  await pause(1500);
  const V = w.TERRA_SITE;
  if (kind === "drive") {
    document.getElementById("driveBtn")!.click();
    await wait(() => !document.getElementById("driveChooser")!.classList.contains("hidden"));
    document.querySelector<HTMLElement>("#dcCards .dc-pick")!.click();
    await wait(() => w.TERRA_DRIVE && w.TERRA_DRIVE.active);
    w.TERRA_BENCH_INPUT = (t: number) => ({ throttle: 1, steer: Math.sin(t * 0.35) * 0.6, brake: 0 }); // forward with gentle weaving
    try {
      return await startBench("drive");
    } finally {
      w.TERRA_BENCH_INPUT = null;
    }
  }
  let on = true;
  const c = V.cams[0]; // orbit the (linked) views around their target
  const spin = () => {
    if (!on || signal.aborted || !V.open) return;
    const t = c.controls.target, dx = c.camera.position.x - t.x, dz = c.camera.position.z - t.z, a = 0.006;
    c.camera.position.x = t.x + dx * Math.cos(a) - dz * Math.sin(a);
    c.camera.position.z = t.z + dx * Math.sin(a) + dz * Math.cos(a);
    c.controls.update();
    V.dirty = 0;
    V.awake = performance.now() + 1e9; // keep drawing for the whole run, however slow a frame is
    requestAnimationFrame(spin);
  };
  requestAnimationFrame(spin);
  try {
    return await startBench("site");
  } finally {
    on = false;
    V.awake = 0;
  }
}
