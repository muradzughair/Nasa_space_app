/**
 * Decodes an Esri LERC elevation tile off the main thread. The heights come
 * back as a plain Float32Array grid (257x257 for Esri's World Elevation),
 * which the main thread then cuts into smaller tiles (see terrain.ts).
 */
import Lerc from "lerc";

export interface DecodeRequest {
  id: number;
  buffer: ArrayBuffer;
}

export type DecodeResponse =
  | { id: number; ok: true; heights: Float32Array; size: number }
  | { id: number; ok: false };

const post = (message: DecodeResponse, transfer: Transferable[] = []) =>
  (self as unknown as Worker).postMessage(message, transfer);

self.onmessage = (event: MessageEvent<DecodeRequest>) => {
  const { id, buffer } = event.data;
  try {
    const decoded = Lerc.decode(buffer);
    const { width, height } = decoded;
    if (decoded.statistics[0].minValue === Number.MAX_VALUE || width !== height) {
      post({ id, ok: false });
      return;
    }
    // A fresh copy owns its buffer outright, so it can be transferred.
    const heights = new Float32Array(decoded.pixels[0]);
    post({ id, ok: true, heights, size: width }, [heights.buffer]);
  } catch {
    post({ id, ok: false });
  }
};
