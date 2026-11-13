/**
 * Scores every grid cell against one target off the main thread (see
 * scoreInWorker in grid.ts). Keeps its own copy of the grid.
 */
import { type CellScoresRequest, type CellScoresResponse, cellScores, type Grid } from "./grid";

let grid: Grid | null = null;

self.onmessage = (event: MessageEvent<CellScoresRequest>) => {
  const { id, target, tags } = event.data;
  if (event.data.grid) grid = event.data.grid;
  const scores = cellScores(grid!, tags, target);
  (self as unknown as Worker).postMessage({ id, scores } satisfies CellScoresResponse, [scores.buffer]);
};
