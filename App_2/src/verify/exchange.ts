/**
 * Getting records out of and into the local database: a JSON bundle that
 * carries requests, responses, reviews and attachment files (re-importable),
 * a readable Markdown report, and the hand-off file for an external rover
 * simulator.
 */
import { getBlob, loadAll, save, type StoredBlob, type VerifyData } from "./db";
import { routeLength } from "./route";
import { type ContributorResponse, LOCAL_NOTE, REVIEW_LABEL, type Review, type VerificationRequest } from "./types";

const FORMAT = "analog-atlas-verification";

interface BundleFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface Bundle extends VerifyData {
  format: typeof FORMAT;
  version: 1;
  exportedAt: string;
  notes: string[];
  attachments: BundleFile[];
}

const toDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("An attachment could not be read."));
    reader.readAsDataURL(blob);
  });

const attachmentIds = (requests: VerificationRequest[], responses: ContributorResponse[]) => [
  ...requests.flatMap((r) => (r.video.attachmentId ? [r.video.attachmentId] : [])),
  ...responses.flatMap((r) => r.evidence.flatMap((e) => (e.attachmentId ? [e.attachmentId] : []))),
];

/** One request with its responses and reviews, or everything when no id is given. */
export async function buildBundle(requestId?: string): Promise<Bundle> {
  const all = await loadAll();
  const requests = requestId ? all.requests.filter((r) => r.id === requestId) : all.requests;
  const keep = new Set(requests.map((r) => r.id));
  const responses = all.responses.filter((r) => keep.has(r.requestId));
  const reviews = all.reviews.filter((r) => keep.has(r.requestId));
  const attachments: BundleFile[] = [];
  for (const id of attachmentIds(requests, responses)) {
    const stored = await getBlob(id);
    if (stored) attachments.push({ id, name: stored.name, type: stored.type, size: stored.blob.size, dataUrl: await toDataUrl(stored.blob) });
  }
  return {
    format: FORMAT,
    version: 1,
    exportedAt: new Date().toISOString(),
    notes: [
      LOCAL_NOTE,
      "Three kinds of record are kept apart: requests[].model is the model-derived score (a snapshot, never edited by responses); responses[] are contributor observations; reviews[] are reviewed findings.",
      '"Accepted" means accepted by the reviewer in this workflow. It is not an approval by NASA or any agency.',
      "requests[].premadeVideo, where present, records that a pre-made rover video is planned for the place and not yet recorded (status to-be-recorded). It is not a video and has no file; requests[].video is the request's only video.",
    ],
    requests,
    responses,
    reviews,
    attachments,
  };
}

/** Reads a bundle file into the local database. Records with the same id are replaced. */
export async function importBundle(file: File): Promise<{ requests: number; responses: number; reviews: number; attachments: number }> {
  let bundle: Bundle;
  try {
    bundle = JSON.parse(await file.text()) as Bundle;
  } catch {
    throw new Error("That file is not JSON.");
  }
  if (bundle?.format !== FORMAT || !Array.isArray(bundle.requests) || !Array.isArray(bundle.responses)) throw new Error("That file is not an Analog Atlas verification export.");
  if (bundle.version !== 1) throw new Error(`That export is version ${String(bundle.version)}; this build reads version 1.`);
  const blobs: StoredBlob[] = [];
  for (const a of bundle.attachments ?? []) {
    const blob = await (await fetch(a.dataUrl)).blob();
    blobs.push({ id: a.id, name: a.name, type: a.type, blob });
  }
  await save({ requests: bundle.requests, responses: bundle.responses, reviews: bundle.reviews ?? [] }, blobs);
  return { requests: bundle.requests.length, responses: bundle.responses.length, reviews: (bundle.reviews ?? []).length, attachments: blobs.length };
}

export function download(name: string, content: Blob | string, type = "application/json"): void {
  const blob = typeof content === "string" ? new Blob([content], { type }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "site";
const pct = (v: number | null) => (v == null ? "n/a" : `${Math.round(v * 100)}%`);
export const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
const coords = (lat: number, lon: number) => `${lat.toFixed(5)}, ${lon.toFixed(5)}`;

/** The site report: request, model score with breakdown and sources, each response and its review status. */
export function reportMarkdown(request: VerificationRequest, responses: ContributorResponse[], reviews: Review[]): string {
  const { model, site } = request;
  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);
  push(`# Site verification report: ${site.name}`, "", `Request ${request.id}, created ${request.createdAt}. Report written ${new Date().toISOString()}.`, "", `> ${LOCAL_NOTE}`, "");
  push("## Site", "", `- Name: ${site.name}`, `- Coordinates (latitude, longitude, WGS84): ${coords(site.lat, site.lon)}`, `- Kind: ${site.kind === "curated-site" ? "curated reference site" : "point in a grid cell"}`, `- Purpose: ${request.purpose}`, "");
  push("## 1. Model-derived score (not changed by any response)", "");
  push(`- Target profile: ${model.body === "moon" ? "Moon" : "Mars"}, ${model.customTarget ? "custom point " : ""}${model.profileName} (${model.profileId})`);
  if (model.customTarget) {
    const t = model.customTarget;
    push(
      `- Custom target: yes. A point flagged on the Moon at ${coords(t.lat, t.lon)}, created ${t.createdAt.slice(0, 10)}; fields not established for the point are inherited from the fixed profile "${t.baseProfileName}" (${t.baseProfileId}).`,
      ...t.provenance.map((row) => `  - ${row.field}: ${row.value} [${row.how}] ${row.source}`),
    );
  }
  push(`- Similarity: ${pct(model.overall)}`, `- Method: ${model.method}`);
  if (model.heatmapCell) {
    const h = model.heatmapCell;
    push(`- Heatmap cell (${h.cellDegrees}° cell centred ${coords(h.centreLat, h.centreLon)}): similarity ${pct(h.score)}${h.percentileRank != null ? `; percentile rank ${(h.percentileRank * 100).toFixed(1)} among land cells (a rank, not a similarity)` : ""}`);
  }
  const c = model.evaluation.confidence;
  push(`- Data confidence: ${pct(c.measured)} of the weight on measured or mapped values, ${pct(c.proxy)} on estimates, ${pct(c.missing)} with no data`, `- Note: ${model.note}`, "", "| Group | Score | Parts |", "| --- | --- | --- |");
  for (const [id, group] of Object.entries(model.evaluation.groups)) {
    if (!group.parts.length && group.score == null) continue;
    push(`| ${id} | ${pct(group.score)} | ${group.parts.map((p) => `${p.label}: ${p.earth} [${p.quality}] ${pct(p.score)}`).join("; ")} |`);
  }
  push("", "### Datasets", "", "| Dataset | Date | Resolution |", "| --- | --- | --- |");
  for (const d of request.datasets) push(`| ${d.label} | ${d.date ?? "not recorded"} | ${d.resolution ?? "not recorded"} |`);
  push("", "### Sources", "", ...model.sources.map((s) => `- [${s.kind}] ${s.label}${s.url ? ` ${s.url}` : ""}`), "");
  push("## Video and route", "");
  const v = request.video;
  push(
    v.kind === "none" ? "- No video attached." : v.kind === "terrain-preview" ? `- Terrain preview recorded in the app (${v.fileName ?? "video"}). ${v.description}` : v.kind === "url" ? `- Video link: ${v.url}. ${v.description}` : `- Attached video file: ${v.fileName}. ${v.description}`,
    `- Rover integration: ${request.rover.note}`,
  );
  if (request.premadeVideo) {
    const p = request.premadeVideo;
    push(
      `- Pre-made rover video: planned, to be recorded (not a video; nothing to play). Target ${p.targetName} (${p.targetId}${p.custom ? ", custom lunar target" : ""}); the ${p.cellDegrees}° cell centred ${coords(p.cellCentre.lat, p.cellCentre.lon)} ranks ${p.shownRank} of land cells (percentile rank ${(p.percentileRank * 100).toFixed(2)}); rule: ${p.rule}. ${p.note}`,
    );
  }
  if (request.route.length) push(`- Route (${Math.round(routeLength(request.route))} m): ${request.route.map((p) => coords(p.lat, p.lon)).join(" → ")}`);
  if (request.camera) push(`- Camera: ${request.camera.heightM} m above the terrain, pitch ${request.camera.pitchDeg}°, ${request.camera.durationS} s; imagery: ${request.camera.imagery}`);
  push("", "## Questions", "", ...request.questions.map((q, i) => `${i + 1}. ${q.text}`), "", "## Observations asked for", "");
  push(...request.observationRequests.map((o, i) => `${i + 1}. ${o.text}${o.status === "researcher" ? "" : ` (${o.status}: ${o.basis})`}`), "");
  push(`## 2. Contributor observations (${responses.length})`, "");
  if (!responses.length) push("None yet.", "");
  for (const r of responses) {
    const review = reviews.find((x) => x.responseId === r.id);
    push(`### ${r.contributor || "Anonymous contributor"}, ${r.submittedAt}`, "");
    push(`- Has visited: ${r.visited === "exact" ? "the exact location" : r.visited === "nearby" ? "the surrounding area, not the exact point" : "no"}${r.visitedWhen ? ` (${r.visitedWhen})` : ""}`);
    for (const a of r.answers) {
      const q = request.questions.find((x) => x.id === a.questionId);
      if (!a.verdict && !a.explanation) continue;
      push(`- ${q?.text ?? a.questionId}: **${a.verdict === "matches" ? "Matches" : a.verdict === "differs" ? "Differs" : a.verdict === "cannot-judge" ? "Cannot judge" : "no answer"}**${a.videoTime != null ? `, video ${clock(a.videoTime)}` : ""}${a.mapPoint ? `, map point ${coords(a.mapPoint.lat, a.mapPoint.lon)}` : ""}${a.explanation ? `. ${a.explanation}` : ""}`);
    }
    for (const o of r.observations) if (o.text) push(`- Re "${request.observationRequests.find((x) => x.id === o.itemId)?.text ?? o.itemId}": ${o.text}`);
    for (const e of r.evidence) push(`- Evidence: ${e.fileName ?? "no file"}${e.observedOn ? `, observed ${e.observedOn}` : ""}${e.lat != null && e.lon != null ? `, at ${coords(e.lat, e.lon)}` : ""}${e.sourceUrl ? `, source ${e.sourceUrl}` : ""}${e.note ? `. ${e.note}` : ""}`);
    if (r.comments) push(`- Comments: ${r.comments}`);
    push("", `**3. Reviewed finding:** ${REVIEW_LABEL[review?.status ?? "unreviewed"]}${review?.note ? `. ${review.note}` : ""}${review ? ` (${review.reviewedAt})` : ""}`, "");
  }
  push("---", '"Accepted" means accepted by the reviewer in this workflow; it is not an approval by NASA or any agency. Contributor feedback concerns whether the represented landscape matches reality. It does not validate rover traction, suspension or soil physics, and it does not change the similarity score.');
  return out.join("\n");
}

/**
 * The integration point for an external rover simulator. This app has no
 * rover engine; a simulator that reads this file knows which site, profile
 * and route to drive and which request to label its video with. The video it
 * produces comes back through "Attach a video" on the request.
 */
export function roverHandoff(request: VerificationRequest) {
  return {
    format: "analog-atlas-rover-handoff",
    version: 1,
    requestId: request.id,
    site: { name: request.site.name, lat: request.site.lat, lon: request.site.lon, datum: "WGS84" },
    profile: { id: request.model.profileId, body: request.model.body, name: request.model.profileName, customTarget: request.model.customTarget ?? null },
    route: { waypoints: request.route, lengthM: Math.round(routeLength(request.route)), note: "Waypoints chosen by the researcher on the globe. Heights are not included; take them from your own elevation data." },
    camera: request.camera,
    expectedReturn: "A video file or URL of the simulated walkthrough, attached to this request id. State which details are procedurally generated: they must not be presented to contributors as measured site features.",
  };
}
