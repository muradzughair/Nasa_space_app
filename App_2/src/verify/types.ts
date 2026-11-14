/**
 * Records of the site-verification workflow. Three kinds are kept apart, in
 * separate stores, and nothing copies a value from one into another:
 *
 *  1. Model-derived scores: a snapshot of what scoring.ts returned when the
 *     request was made (ModelSnapshot, inside the request, never edited).
 *  2. Contributor observations: what a person who knows the place reported
 *     (ContributorResponse).
 *  3. Reviewed findings: what a researcher decided about an observation
 *     (Review).
 *
 * An observation or a review never changes a similarity score.
 */
import type { Evaluation } from "../analog/scoring";
import type { LatLon } from "./route";

export interface SourceNote {
  label: string;
  url: string;
  kind: string;
}

export interface DatasetNote {
  label: string;
  /** Null where this app's data does not record it. */
  date: string | null;
  resolution: string | null;
  url: string;
}

/** 1. Model-derived. Written once, when the request is created. */
export interface ModelSnapshot {
  recordType: "model-derived score";
  scoredAt: string;
  method: string;
  profileId: string;
  profileName: string;
  body: "mars" | "moon";
  /** What the score describes: a curated site's own measurements, or the grid cell's data with features measured from the point. */
  basis: "curated-site" | "grid-point";
  /** Similarity, 0 to 1. */
  overall: number;
  evaluation: Evaluation;
  /** The heatmap value of the grid cell containing the point, when the heatmap had been computed. */
  heatmapCell: {
    centreLat: number;
    centreLon: number;
    cellDegrees: number;
    /** Similarity of the cell, 0 to 1, sampled at its centre. */
    score: number;
    /** Share of land cells that score lower, 0 to 1. A rank, not a similarity. */
    percentileRank: number | null;
  } | null;
  /** Why the numbers above can differ from each other. */
  note: string;
  gridGenerated: string | null;
  sources: SourceNote[];
  /**
   * Set when the comparison target was not one of the fixed profiles but a
   * point flagged on the Moon: where it is, which fixed profile it inherits
   * from, and how each of its fields was obtained. Absent or null otherwise.
   */
  customTarget?: CustomTargetNote | null;
}

export interface CustomTargetNote {
  custom: true;
  name: string;
  lat: number;
  lon: number;
  createdAt: string;
  baseProfileId: string;
  baseProfileName: string;
  terrain: { slope: number; roughness: number; relief: number };
  lowSun: boolean;
  /** One row per field of the target: measured, map, computed or inherited, with its source. */
  provenance: { field: string; value: string; how: "measured" | "map" | "computed" | "inherited"; source: string }[];
}

export interface Question {
  id: string;
  text: string;
  origin: "standard" | "from-data" | "researcher";
}

export interface ObservationRequest {
  id: string;
  text: string;
  /**
   * Why it is asked. "missing", "estimated" and "coarse" are set only from
   * the data (a group with no data, a part flagged as a proxy, a value taken
   * from a 50 km cell or a rock-class map); "researcher" items make no claim.
   */
  status: "missing" | "estimated" | "coarse" | "researcher";
  /** The data behind the status, in words. */
  basis: string;
}

export type VideoKind = "none" | "file" | "url" | "terrain-preview";

export interface VideoRef {
  kind: VideoKind;
  /** Blob id in the attachment store (file and terrain-preview). */
  attachmentId?: string;
  url?: string;
  fileName?: string;
  /** What the video is, in the researcher's words for attached videos, fixed text for the preview. */
  description: string;
}

export interface CameraInfo {
  heightM: number;
  pitchDeg: number;
  durationS: number;
  imagery: string;
}

export interface SiteRef {
  name: string;
  lat: number;
  lon: number;
  kind: "curated-site" | "grid-point";
  siteId?: string;
  country?: string;
}

/**
 * A pre-made rover video planned for this place: the cell ranks within the
 * top 1% of land cells for the target (analog/premade.ts). A status, not a
 * video: it is kept apart from `video`, is never played and is never
 * counted as a video. Absent when the place is not one of those cells.
 */
export interface PremadeVideoNote {
  recordType: "planned pre-made rover video";
  status: "to-be-recorded";
  targetId: string;
  targetName: string;
  custom: boolean;
  cellCentre: { lat: number; lon: number };
  cellDegrees: number;
  /** Share of land cells scoring lower, 0 to 1, and the rank as the card showed it. */
  percentileRank: number;
  shownRank: string;
  rule: string;
  note: string;
}

export interface VerificationRequest {
  id: string;
  createdAt: string;
  site: SiteRef;
  model: ModelSnapshot;
  purpose: string;
  video: VideoRef;
  /** Waypoints chosen by the researcher. */
  route: LatLon[];
  camera: CameraInfo | null;
  datasets: DatasetNote[];
  questions: Question[];
  observationRequests: ObservationRequest[];
  rover: { status: "not-integrated"; note: string };
  /** Only for a place where a pre-made rover video is planned; see PremadeVideoNote. */
  premadeVideo?: PremadeVideoNote;
}

export type Verdict = "matches" | "differs" | "cannot-judge";

export interface Answer {
  questionId: string;
  verdict: Verdict | null;
  /** Seconds into the video. */
  videoTime: number | null;
  mapPoint: LatLon | null;
  explanation: string;
}

export interface Evidence {
  id: string;
  /** Blob id in the attachment store, when a file was attached. */
  attachmentId?: string;
  fileName?: string;
  fileType?: string;
  observedOn: string;
  lat: number | null;
  lon: number | null;
  sourceUrl: string;
  note: string;
}

/** 2. Contributor observation. */
export interface ContributorResponse {
  recordType: "contributor observation";
  id: string;
  requestId: string;
  submittedAt: string;
  contributor: string;
  visited: "exact" | "nearby" | "not-visited";
  visitedWhen: string;
  answers: Answer[];
  /** Replies to the request's observation requests. */
  observations: { itemId: string; text: string }[];
  evidence: Evidence[];
  comments: string;
}

export type ReviewStatus = "unreviewed" | "needs-evidence" | "accepted" | "rejected";

export const REVIEW_LABEL: Record<ReviewStatus, string> = {
  unreviewed: "Unreviewed",
  "needs-evidence": "Needs more evidence",
  accepted: "Accepted",
  rejected: "Rejected",
};

/** 3. Reviewed finding, one per response. */
export interface Review {
  recordType: "reviewed finding";
  responseId: string;
  requestId: string;
  status: ReviewStatus;
  note: string;
  reviewedAt: string;
}

export const ROVER_NOTE =
  "The in-app rover simulator (\"Simulate a rover here\" on a card) is a screening model and is not linked to requests: no simulation result is stored here. A rover video made elsewhere can be attached as a video; the built-in camera pass is a terrain preview only.";

export const PREMADE_NOTE = "Planned, not recorded: no pre-made rover video exists for this place yet. This is a status, not a video.";

export const LOCAL_NOTE =
  "Local prototype: requests, responses, reviews and attachments are stored in this browser only (IndexedDB). Nothing is sent to other people or to NASA. Use Export and Import to pass records by hand.";

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
