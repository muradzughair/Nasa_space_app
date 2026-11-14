import { useRef, useState } from "react";
import { percent } from "../../analog/data";
import type { GlobeController } from "../../globe/GlobeController";
import { showToast, updateVerify, useStore } from "../../state/store";
import { deleteRequest, save, useBlobUrl, useVerifyData } from "../../verify/db";
import { buildBundle, clock, download, importBundle, reportMarkdown, roverHandoff, slug } from "../../verify/exchange";
import { routeLength } from "../../verify/route";
import { type ContributorResponse, type Evidence, LOCAL_NOTE, REVIEW_LABEL, type Review, type ReviewStatus, type VerificationRequest } from "../../verify/types";
import { BackIcon, CloseIcon } from "../icons";
import { exact, flyToSite, ModelSummary, PremadeVideoSummary, useOverlay, VideoPlayer } from "./parts";
import { RequestForm } from "./RequestForm";
import { RespondForm } from "./RespondForm";

const TITLES = { list: "Site verification", new: "New verification request", request: "Verification request", respond: "Respond as a local contributor", review: "Review responses" };
const STATUSES: ReviewStatus[] = ["unreviewed", "needs-evidence", "accepted", "rejected"];

const fail = (e: unknown) => showToast(e instanceof Error ? e.message : "That did not work.", 8000);

/**
 * The verification workspace, in place of the reading card: the list of
 * requests, the researcher's form, the contributor's form and the review.
 * Everything it shows comes from the local database.
 */
export function VerifyPanel({ globe }: { globe: GlobeController | null }) {
  const verify = useStore((s) => s.verify);
  const data = useVerifyData();
  const importRef = useRef<HTMLInputElement>(null);
  const request = data.requests.find((r) => r.id === verify.requestId) ?? null;
  const responses = data.responses.filter((r) => r.requestId === verify.requestId);
  const view = verify.view !== "list" && verify.view !== "new" && !request ? "list" : verify.view;

  const exportAll = () =>
    buildBundle()
      .then((bundle) => download(`analog-atlas-verification-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(bundle)))
      .catch(fail);
  const onImport = (file: File | undefined) => {
    if (!file) return;
    importBundle(file)
      .then((n) => showToast(`Imported ${n.requests} requests, ${n.responses} responses, ${n.reviews} reviews and ${n.attachments} files into this browser.`, 7000))
      .catch(fail);
  };

  return (
    <aside className="verify panel" aria-label="Site verification">
      <button type="button" className="card-close" onClick={() => updateVerify({ open: false })} aria-label="Close">
        <CloseIcon />
      </button>
      {view !== "list" && (
        <button type="button" className="atlas-back" onClick={() => updateVerify({ view: view === "respond" || view === "review" ? "request" : "list" })}>
          <BackIcon /> {view === "respond" || view === "review" ? "Back to the request" : "All requests"}
        </button>
      )}
      <h2 className="card-title atlas-title">{TITLES[view]}</h2>
      <p className="verify-local">{LOCAL_NOTE}</p>
      {data.error && (
        <p className="verify-error" role="alert">
          {data.error}
        </p>
      )}

      {view === "list" && (
        <>
          {data.loaded && !data.requests.length && (
            <p className="verify-empty">
              No requests yet. Turn on the similarity heatmap, click a promising cell (or open a reference site), and press "Request local verification" on its card.
            </p>
          )}
          <ul className="verify-list">
            {data.requests.map((r) => {
              const mine = data.responses.filter((x) => x.requestId === r.id);
              const open = mine.filter((x) => (data.reviews.find((v) => v.responseId === x.id)?.status ?? "unreviewed") === "unreviewed").length;
              return (
                <li key={r.id}>
                  <button type="button" onClick={() => updateVerify({ view: "request", requestId: r.id })}>
                    <span className="atlas-site-name">{r.site.name}</span>
                    <span className="atlas-site-detail">
                      {r.model.body === "moon" ? "Moon" : "Mars"}, {r.model.customTarget ? `custom point ${r.model.profileName}` : r.model.profileName.toLowerCase()} · model score {percent(r.model.overall)} · {mine.length} {mine.length === 1 ? "response" : "responses"}
                      {open > 0 && `, ${open} unreviewed`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="verify-inline">
            <button type="button" className="verify-button" onClick={() => importRef.current?.click()}>
              Import a bundle…
            </button>
            <button type="button" className="verify-button" disabled={!data.requests.length} onClick={() => void exportAll()}>
              Export everything
            </button>
            <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={(e) => (onImport(e.target.files?.[0]), (e.target.value = ""))} />
          </div>
          <p className="verify-hint">
            Sharing is by hand in this prototype: export a request, send the file, and the other person imports it, responds, and exports it back. A request can be made against the eight fixed
            target profiles or a custom point flagged on the Moon; the request then records the point and where each of its fields comes from. Custom points on Mars are not supported.
          </p>
        </>
      )}

      {view === "new" && <RequestForm globe={globe} />}
      {view === "request" && request && <RequestView globe={globe} request={request} responses={responses} reviews={data.reviews} />}
      {view === "respond" && request && <RespondForm globe={globe} request={request} />}
      {view === "review" && request && <ReviewView globe={globe} request={request} responses={responses} reviews={data.reviews} />}
    </aside>
  );
}

interface ViewProps {
  globe: GlobeController | null;
  request: VerificationRequest;
  responses: ContributorResponse[];
  reviews: Review[];
}

function RequestView({ globe, request, responses, reviews }: ViewProps) {
  useOverlay(globe, request);
  const name = slug(request.site.name);
  const counts = STATUSES.map((s) => [s, responses.filter((r) => (reviews.find((v) => v.responseId === r.id)?.status ?? "unreviewed") === s).length] as const).filter(([, n]) => n > 0);

  return (
    <div className="verify-form">
      <section className="verify-section">
        <h3>{request.site.name}</h3>
        <p className="verify-fact">
          Exact coordinates (WGS84): <strong>{exact(request.site.lat, request.site.lon)}</strong> · {request.site.kind === "curated-site" ? "curated reference site" : "point inside a grid cell"} · request{" "}
          {request.id}
        </p>
        <p>{request.purpose}</p>
        <button type="button" className="targetbar-link" onClick={() => flyToSite(globe, request.site)}>
          Show the site on the globe
        </button>
      </section>

      <section className="verify-section">
        <h3>Walkthrough video</h3>
        <VideoPlayer video={request.video} />
        <p className="verify-rover">
          <strong>Rover simulation: not linked to this request.</strong> {request.rover.note}
        </p>
        {request.premadeVideo && <PremadeVideoSummary plan={request.premadeVideo} />}
        {request.route.length > 1 && (
          <p className="verify-fact">
            Route: {request.route.length} waypoints, {Math.round(routeLength(request.route)).toLocaleString("en-US")} m.
            {request.camera && ` Camera ${request.camera.heightM} m above the terrain, pitch ${request.camera.pitchDeg}°, ${request.camera.durationS} s, imagery: ${request.camera.imagery}.`}
          </p>
        )}
      </section>

      <div className="verify-actions">
        <button type="button" className="card-action is-primary" onClick={() => updateVerify({ view: "respond" })}>
          Respond as a local contributor
        </button>
        <button type="button" className="card-action" onClick={() => updateVerify({ view: "review" })}>
          Review responses ({responses.length})
        </button>
      </div>
      {counts.length > 0 && <p className="verify-fact">{counts.map(([s, n]) => `${n} ${REVIEW_LABEL[s].toLowerCase()}`).join(" · ")}</p>}

      <ModelSummary model={request.model} />

      <section className="verify-section">
        <h3>Questions</h3>
        <ol className="verify-plain">
          {request.questions.map((q) => (
            <li key={q.id}>{q.text}</li>
          ))}
        </ol>
        <h3>Observations asked for</h3>
        <ul className="verify-plain">
          {request.observationRequests.map((o) => (
            <li key={o.id}>
              {o.status !== "researcher" && <span className={`verify-badge is-${o.status}`}>{o.status === "coarse" ? "coarse data" : o.status}</span>} {o.text}
              {o.basis && <span className="verify-hint">{o.basis}</span>}
            </li>
          ))}
        </ul>
        <h3>Datasets</h3>
        <ul className="verify-datasets">
          {request.datasets.map((d) => (
            <li key={d.label}>
              {d.label}
              <span className="verify-hint">
                Date: {d.date ?? "not recorded in the app"} · Resolution: {d.resolution ?? "not recorded in the app"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="verify-section">
        <h3>Export</h3>
        <div className="verify-inline">
          <button type="button" className="verify-button" onClick={() => download(`site-report-${name}.md`, reportMarkdown(request, responses, reviews), "text/markdown")}>
            Site report (Markdown)
          </button>
          <button
            type="button"
            className="verify-button"
            onClick={() =>
              void buildBundle(request.id)
                .then((b) => download(`verification-${name}.json`, JSON.stringify(b)))
                .catch(fail)
            }
          >
            Request, responses and files (JSON)
          </button>
          <button type="button" className="verify-button" onClick={() => download(`rover-handoff-${name}.json`, JSON.stringify(roverHandoff(request), null, 2))}>
            Rover hand-off file
          </button>
        </div>
        <p className="verify-hint">
          The JSON bundle can be imported on another computer. The hand-off file carries the request id, coordinates, profile and route for an external rover simulator; none is connected here.
        </p>
        <button
          type="button"
          className="targetbar-link verify-danger"
          onClick={() => {
            if (!window.confirm(`Delete this request, its ${responses.length} responses and their files from this browser? This cannot be undone.`)) return;
            void deleteRequest(request.id).then(() => updateVerify({ view: "list", requestId: null }), fail);
          }}
        >
          Delete this request
        </button>
      </section>
    </div>
  );
}

function EvidenceItem({ evidence }: { evidence: Evidence }) {
  const { url, missing } = useBlobUrl(evidence.attachmentId);
  return (
    <li className="verify-evidence">
      {url && evidence.fileType?.startsWith("image/") ? (
        <a href={url} target="_blank" rel="noreferrer">
          <img src={url} alt={evidence.note || evidence.fileName || "Contributor photograph"} />
        </a>
      ) : url ? (
        <a className="targetbar-link" href={url} download={evidence.fileName}>
          {evidence.fileName}
        </a>
      ) : evidence.attachmentId ? (
        <span>{missing ? `${evidence.fileName} (file not in this browser)` : "Loading…"}</span>
      ) : null}
      <span>
        {evidence.note}
        <span className="verify-hint">
          {[evidence.observedOn && `observed ${evidence.observedOn}`, evidence.lat != null && evidence.lon != null && `at ${evidence.lat.toFixed(5)}, ${evidence.lon.toFixed(5)}`].filter(Boolean).join(" · ") ||
            "no date or coordinates given"}
          {evidence.sourceUrl && (
            <>
              {" · "}
              <a href={evidence.sourceUrl} target="_blank" rel="noreferrer noopener">
                source
              </a>
            </>
          )}
        </span>
      </span>
    </li>
  );
}

const VERDICT_LABEL = { matches: "Matches", differs: "Differs", "cannot-judge": "Cannot judge" };
const VISITED_LABEL = { exact: "Has been at the marked point", nearby: "Knows the area, not the exact point", "not-visited": "Has not been there" };

function ReviewView({ globe, request, responses, reviews }: ViewProps) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  useOverlay(
    globe,
    request,
    responses.flatMap((r) => r.answers.flatMap((a) => (a.mapPoint ? [a.mapPoint] : []))),
  );
  const setReview = (response: ContributorResponse, status: ReviewStatus, note: string) =>
    save({ reviews: [{ recordType: "reviewed finding", responseId: response.id, requestId: request.id, status, note, reviewedAt: new Date().toISOString() }] }).catch(fail);

  return (
    <div className="verify-form">
      <p className="verify-hint">
        Model-derived score: <strong>{percent(request.model.overall)}</strong>, as scored on {request.model.scoredAt.slice(0, 10)}. Responses and review decisions are kept as separate records and do not
        change it. "Accepted" means accepted by you in this workflow; it is not an approval by NASA or any agency.
      </p>
      {!responses.length && <p className="verify-empty">No responses to this request are stored in this browser.</p>}
      {responses.map((r) => {
        const review = reviews.find((v) => v.responseId === r.id);
        const status = review?.status ?? "unreviewed";
        const note = notes[r.id] ?? review?.note ?? "";
        return (
          <section key={r.id} className="verify-section verify-response">
            <h3>
              {r.contributor || "Anonymous contributor"} <span className={`verify-badge is-review-${status}`}>{REVIEW_LABEL[status]}</span>
            </h3>
            <p className="verify-fact">
              Contributor observation · {r.submittedAt.slice(0, 16).replace("T", " ")} UTC · {VISITED_LABEL[r.visited]}
              {r.visitedWhen && ` (${r.visitedWhen})`}
            </p>
            <ul className="verify-plain">
              {r.answers
                .filter((a) => a.verdict || a.explanation)
                .map((a) => (
                  <li key={a.questionId}>
                    {request.questions.find((q) => q.id === a.questionId)?.text}{" "}
                    <strong className={`verify-verdict is-${a.verdict ?? "none"}`}>{a.verdict ? VERDICT_LABEL[a.verdict] : "No answer"}</strong>
                    {a.explanation && <span className="verify-quote">{a.explanation}</span>}
                    {(a.videoTime != null || a.mapPoint) && (
                      <span className="verify-hint">
                        {a.videoTime != null && `Video ${clock(a.videoTime)}`}
                        {a.videoTime != null && a.mapPoint && " · "}
                        {a.mapPoint && (
                          <button type="button" className="targetbar-link" onClick={() => flyToSite(globe, { ...request.site, ...a.mapPoint! }, 1500)}>
                            map point {a.mapPoint.lat.toFixed(5)}, {a.mapPoint.lon.toFixed(5)}
                          </button>
                        )}
                      </span>
                    )}
                  </li>
                ))}
              {r.observations.map((o) => (
                <li key={o.itemId}>
                  {request.observationRequests.find((x) => x.id === o.itemId)?.text}
                  <span className="verify-quote">{o.text}</span>
                </li>
              ))}
              {r.comments && (
                <li>
                  Comments<span className="verify-quote">{r.comments}</span>
                </li>
              )}
            </ul>
            {r.evidence.length > 0 && (
              <ul className="verify-plain">
                {r.evidence.map((e) => (
                  <EvidenceItem key={e.id} evidence={e} />
                ))}
              </ul>
            )}
            <div className="verify-choice" role="radiogroup" aria-label="Review status">
              {STATUSES.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={status === s} onClick={() => void setReview(r, s, note)}>
                  {REVIEW_LABEL[s]}
                </button>
              ))}
            </div>
            <div className="verify-add">
              <input value={note} placeholder="Reviewer's note: what was decided and why" aria-label="Reviewer's note" onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))} />
              <button type="button" className="verify-button" disabled={note === (review?.note ?? "")} onClick={() => void setReview(r, status, note)}>
                Save note
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
