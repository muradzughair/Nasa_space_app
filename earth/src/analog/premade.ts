/**
 * Pre-made rover videos at the best matches: a placeholder in this version.
 *
 * The plan: each land cell among the best matches for the chosen target
 * (one of the eight fixed versions or a custom lunar point) gets a video,
 * made in advance, of a rover driving around that area. No such video
 * exists yet. A marked cell is a place where one is planned, with the status
 * "To be recorded". That status is never stored as a video, never playable
 * and never counted as one.
 *
 * The rule uses the same rank the cards show ("top 0.4%"), computed by
 * heatmap.ts from the heatmap's own scores, so the mark and the card's rank
 * row cannot disagree.
 */
import { customTarget } from "./custom";
import type { Grid } from "./grid";
import { type CellScores, type CellSummary, cellCentre, percentileRank, profileKey, shownTopPercent, topShare } from "./heatmap";
import type { Profile } from "./scoring";

/** A cell is a place for a pre-made rover video when the rank shown on its card is this share of land cells or better. */
export const PREMADE_VIDEO_TOP_PERCENT = 1;
export const PREMADE_VIDEO_RULE = `the top ${PREMADE_VIDEO_TOP_PERCENT}% of land cells, by the rank shown on the card`;

/** True when a percentile rank, as the card shows it, is within PREMADE_VIDEO_TOP_PERCENT. Null (rank not computed yet): false. */
export function isPremadeVideoRank(rank: number | null): boolean {
  return rank != null && Number(shownTopPercent(rank)) <= PREMADE_VIDEO_TOP_PERCENT;
}

/** The target named as the reason will name it: a custom target by its own name. */
export function targetName(profile: Profile): string {
  const custom = customTarget(profile.id);
  if (custom) return `the custom target "${custom.name}"`;
  return `${profile.body === "moon" ? "the Moon" : "Mars"}, ${profile.name.toLowerCase()}`;
}

export interface PremadeVideoPlan {
  status: "to-be-recorded";
  targetId: string;
  targetName: string;
  custom: boolean;
  cellCentre: { lat: number; lon: number };
  cellDegrees: number;
  /** Share of land cells scoring lower, 0 to 1, and the rank as the card shows it. */
  percentileRank: number;
  shownRank: string;
  rule: string;
}

/**
 * The planned video of the cell under a card, or null when the cell is not
 * marked. `summary` must come from the heatmap's complete scores for this
 * profile (its percentileRank is null otherwise, and so is the plan).
 */
export function premadeVideoPlan(summary: CellSummary | null, profile: Profile): PremadeVideoPlan | null {
  if (!summary || !isPremadeVideoRank(summary.percentileRank)) return null;
  return {
    status: "to-be-recorded",
    targetId: profile.id,
    targetName: targetName(profile),
    custom: !!customTarget(profile.id),
    cellCentre: { lat: summary.centreLat, lon: summary.centreLon },
    cellDegrees: summary.cellDegrees,
    percentileRank: summary.percentileRank!,
    shownRank: topShare(summary.percentileRank!),
    rule: PREMADE_VIDEO_RULE,
  };
}

/**
 * THE PLACE TO PLUG IN A RECORDED VIDEO. When pre-made videos exist, return
 * the one for this cell and target here (for example from a manifest keyed
 * on target id and cell centre), and the card's "Rover video" section will
 * play it instead of showing "To be recorded". In this version none exists,
 * so this always returns null.
 */
export function premadeVideoSource(_plan: PremadeVideoPlan): { url: string; description: string } | null {
  return null;
}

/** Indices of the marked cells (grid.cells order) for a complete set of scores. */
export function premadeVideoCells(cells: CellScores): number[] {
  const out: number[] = [];
  for (let i = 0; i < cells.scores.length; i++) if (isPremadeVideoRank(percentileRank(cells, cells.scores[i]))) out.push(i);
  return out;
}

/** Pixels per grid cell on each side in the picture of the marks. */
const K = 4;

/**
 * The marks drawn on the globe over the heatmap: an outline around each
 * marked cell (the inside stays transparent, so the cell keeps its heatmap
 * colour). Same layout as the heatmap picture, K pixels per cell.
 */
export function paintPremadeMarks(grid: Grid, cells: CellScores, profile: Profile): { canvas: HTMLCanvasElement; count: number } | null {
  if (cells.key !== profileKey(profile)) return null;
  const { cols, rows } = grid.header;
  const marked = premadeVideoCells(cells);
  const canvas = document.createElement("canvas");
  canvas.width = cols * K;
  canvas.height = rows * K;
  const g = canvas.getContext("2d")!;
  const image = g.createImageData(canvas.width, canvas.height);
  const px = image.data;
  for (const i of marked) {
    const n = grid.cells[i], r0 = Math.floor(n / cols) * K, c0 = (n % cols) * K;
    for (let a = 0; a < K; a++) for (let b = 0; b < K; b++) {
      if (a > 0 && a < K - 1 && b > 0 && b < K - 1) continue;
      const at = ((r0 + a) * canvas.width + c0 + b) * 4;
      px[at] = 255; px[at + 1] = 255; px[at + 2] = 255; px[at + 3] = 255;
    }
  }
  g.putImageData(image, 0, 0);
  return { canvas, count: marked.length };
}

export { cellCentre };
