/**
 * A low camera pass along a route, with optional recording. What it shows is
 * the globe as it is: satellite imagery draped on the elevation model. It is
 * a terrain preview, and every recorded frame says so. It is not a rover
 * simulation: there is no vehicle, no wheel-ground contact, no soil model,
 * and nothing is added to the scene that the data does not contain.
 */
import { Cartesian3, Cartographic, type CesiumWidget, Math as CesiumMath } from "cesium";
import { type LatLon as Point, routePosition } from "../verify/route";

export interface WalkthroughOptions {
  /** Camera height above the terrain, metres. */
  height: number;
  /** Camera pitch in degrees; negative looks down. */
  pitch: number;
  /** Seconds from the first waypoint to the last. */
  duration: number;
  record: boolean;
  /** Lines burned into every recorded frame, top to bottom. */
  labels: string[];
  onProgress?: (fraction: number) => void;
}

export interface WalkthroughResult {
  /** The recording, when one was asked for and succeeded. */
  video: Blob | null;
  /** Why there is no recording, in words for the user. Null when nothing went wrong. */
  error: string | null;
  /** False when the pass was stopped before the end. */
  completed: boolean;
}

export interface Walkthrough {
  stop(): void;
  finished: Promise<WalkthroughResult>;
}

const RECORDING_TYPES = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];

export function runWalkthrough(viewer: CesiumWidget, route: Point[], options: WalkthroughOptions): Walkthrough {
  const { scene, camera } = viewer;
  let stopped = false;
  let removePostRender: (() => void) | null = null;
  let recorder: MediaRecorder | null = null;
  let error: string | null = null;
  const chunks: Blob[] = [];

  const finished = (async (): Promise<WalkthroughResult> => {
    if (route.length < 2) return { video: null, error: "A route needs at least two waypoints.", completed: false };

    const scratch = new Cartographic();
    let ground = 0;
    let heading = routePosition(route, 0).heading;
    const place = (fraction: number) => {
      const at = routePosition(route, fraction);
      // The elevation of whatever terrain tiles are loaded; the last known value bridges gaps.
      ground = scene.globe.getHeight(Cartographic.fromDegrees(at.lon, at.lat, 0, scratch)) ?? ground;
      // Turn through corners over a few frames instead of snapping.
      const turn = CesiumMath.negativePiToPi(at.heading - heading);
      heading += turn * (fraction === 0 ? 1 : 0.08);
      camera.setView({
        destination: Cartesian3.fromDegrees(at.lon, at.lat, Math.max(ground, 0) + options.height),
        orientation: { heading, pitch: CesiumMath.toRadians(options.pitch), roll: 0 },
      });
      scene.requestRender();
    };

    // Stand at the start until the terrain and imagery there have streamed in (or ten seconds have passed).
    place(0);
    const waitUntil = performance.now() + 10_000;
    await new Promise<void>((resolve) => {
      const check = () => {
        place(0);
        if (stopped || (scene.globe.tilesLoaded && performance.now() > waitUntil - 9_000) || performance.now() > waitUntil) resolve();
        else setTimeout(check, 200);
      };
      setTimeout(check, 400);
    });
    if (stopped) return { video: null, error: null, completed: false };

    // Recording: each rendered frame is copied to a 2D canvas with the label burned in, and that canvas is recorded.
    let stream: MediaStream | null = null;
    if (options.record) {
      try {
        if (typeof MediaRecorder === "undefined") throw new Error("This browser has no MediaRecorder, so the preview cannot be recorded here.");
        const type = RECORDING_TYPES.find((t) => MediaRecorder.isTypeSupported(t));
        if (!type) throw new Error("This browser cannot record WebM or MP4 video.");
        const source = scene.canvas;
        const copy = document.createElement("canvas");
        copy.width = 1280;
        copy.height = Math.max(2, Math.round((1280 * source.height) / Math.max(source.width, 1) / 2) * 2);
        const context = copy.getContext("2d");
        if (!context) throw new Error("A canvas for the recording could not be created.");
        const size = Math.round(copy.height / 34);
        removePostRender = scene.postRender.addEventListener(() => {
          context.drawImage(source, 0, 0, copy.width, copy.height);
          context.font = `600 ${size}px system-ui, sans-serif`;
          context.textBaseline = "top";
          options.labels.forEach((text, i) => {
            const y = 12 + i * (size + 10);
            context.fillStyle = "rgba(0, 0, 0, 0.62)";
            context.fillRect(12, y, context.measureText(text).width + 16, size + 8);
            context.fillStyle = i === 0 ? "#ffd166" : "#ffffff";
            context.fillText(text, 20, y + 4);
          });
        });
        stream = copy.captureStream(30);
        recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 5_000_000 });
        recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
        recorder.onerror = () => (error = "The browser's video recorder reported an error; the recording may be incomplete.");
        recorder.start(500);
      } catch (e) {
        error = e instanceof Error ? e.message : "Recording could not start.";
        recorder = null;
      }
    }

    const started = performance.now();
    const completed = await new Promise<boolean>((resolve) => {
      const step = () => {
        if (stopped) return resolve(false);
        const fraction = Math.min(1, (performance.now() - started) / (options.duration * 1000));
        place(fraction);
        options.onProgress?.(fraction);
        if (fraction >= 1) return resolve(true);
        requestAnimationFrame(step);
      };
      step();
    });

    let video: Blob | null = null;
    const active = recorder as MediaRecorder | null;
    if (active) {
      if (active.state !== "inactive") {
        await new Promise<void>((resolve) => {
          active.onstop = () => resolve();
          active.stop();
        });
      }
      video = new Blob(chunks, { type: active.mimeType.split(";")[0] });
      if (video.size === 0) {
        video = null;
        error ??= "The recorder produced an empty file. Nothing was saved; try again, or attach a video made another way.";
      }
    }
    removePostRender?.();
    stream?.getTracks().forEach((t) => t.stop());
    return { video, error, completed };
  })();

  return {
    stop() {
      // The running step sees the flag on its next frame and winds the recording down properly.
      stopped = true;
    },
    finished,
  };
}
