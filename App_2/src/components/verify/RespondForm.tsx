import { useRef, useState } from "react";
import type { GlobeController } from "../../globe/GlobeController";
import { showToast, updateVerify } from "../../state/store";
import { save, type StoredBlob } from "../../verify/db";
import { clock } from "../../verify/exchange";
import { type LatLon, routeLength, routePosition } from "../../verify/route";
import { type Answer, type ContributorResponse, type Evidence, newId, type VerificationRequest, type Verdict } from "../../verify/types";
import { exact, Field, flyToSite, useOverlay, usePick, VideoPlayer } from "./parts";

const VERDICTS: [Verdict, string][] = [
  ["matches", "Matches"],
  ["differs", "Differs"],
  ["cannot-judge", "Cannot judge"],
];

type EvidenceDraft = Evidence & { file: File | null };

/** The contributor's screen: watch, compare with what they know of the place, and report. */
export function RespondForm({ globe, request }: { globe: GlobeController | null; request: VerificationRequest }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [contributor, setContributor] = useState("");
  const [visited, setVisited] = useState<ContributorResponse["visited"] | null>(null);
  const [visitedWhen, setVisitedWhen] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(request.questions.map((q) => [q.id, { questionId: q.id, verdict: null, videoTime: null, mapPoint: null, explanation: "" }])),
  );
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [evidence, setEvidence] = useState<EvidenceDraft[]>([]);
  const [comments, setComments] = useState("");
  const [picking, setPicking] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const answer = (id: string, patch: Partial<Answer>) => setAnswers((a) => ({ ...a, [id]: { ...a[id], ...patch } }));
  const editEvidence = (id: string, patch: Partial<EvidenceDraft>) => setEvidence((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const picks: LatLon[] = [...Object.values(answers).flatMap((a) => (a.mapPoint ? [a.mapPoint] : [])), ...evidence.flatMap((e) => (e.lat != null && e.lon != null ? [{ lat: e.lat, lon: e.lon }] : []))];
  useOverlay(globe, request, picks);
  usePick(globe, picking, (target, point) => {
    if (target.startsWith("evidence:")) editEvidence(target.slice(9), { lat: point.lat, lon: point.lon });
    else answer(target, { mapPoint: point });
    setPicking(null);
  });

  // For a preview recorded in the app the camera's place at any moment is known from the route.
  const timed = request.video.kind === "terrain-preview" && request.camera && request.route.length > 1 ? request.camera.durationS : null;
  const whereAt = (seconds: number) => (timed ? routePosition(request.route, seconds / timed) : null);

  const submit = async () => {
    if (!visited) return setProblem("Say whether you have visited the exact location.");
    const given = Object.values(answers).filter((a) => a.verdict);
    if (!given.length && !Object.values(observations).some((t) => t.trim()) && !evidence.length) return setProblem("Answer at least one question, or add an observation or evidence.");
    const unexplained = given.find((a) => a.verdict === "differs" && !a.explanation.trim());
    if (unexplained) return setProblem("Explain what differs for each question answered “Differs”.");
    setProblem(null);
    setSaving(true);
    try {
      const blobs: StoredBlob[] = [];
      const stored: Evidence[] = evidence.map(({ file, ...e }) => {
        if (!file) return e;
        const id = newId("file");
        blobs.push({ id, name: file.name, type: file.type, blob: file });
        return { ...e, attachmentId: id, fileName: file.name, fileType: file.type };
      });
      const response: ContributorResponse = {
        recordType: "contributor observation",
        id: newId("resp"),
        requestId: request.id,
        submittedAt: new Date().toISOString(),
        contributor: contributor.trim(),
        visited,
        visitedWhen: visitedWhen.trim(),
        answers: Object.values(answers),
        observations: Object.entries(observations).filter(([, text]) => text.trim()).map(([itemId, text]) => ({ itemId, text: text.trim() })),
        evidence: stored,
        comments: comments.trim(),
      };
      await save({ responses: [response] }, blobs);
      showToast("Response saved in this browser. It awaits review; the similarity score is unchanged.", 7000);
      updateVerify({ view: "request" });
    } catch (e) {
      setProblem(e instanceof Error ? `Not saved: ${e.message}` : "The response could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="verify-form">
      <section className="verify-section">
        <h3>{request.site.name}</h3>
        <p className="verify-fact">
          Marked point: <strong>{exact(request.site.lat, request.site.lon)}</strong>
          {request.route.length > 1 && ` · route of ${Math.round(routeLength(request.route)).toLocaleString("en-US")} m (cyan line)`}
        </p>
        <p>{request.purpose}</p>
        <button type="button" className="targetbar-link" onClick={() => flyToSite(globe, request.site)}>
          Show the site on the globe
        </button>
        <VideoPlayer video={request.video} videoRef={videoRef} />
        <p className="verify-hint">
          You are asked whether the landscape shown matches the real place. You are not asked about rover traction, suspension or soil mechanics, and your answers do not change the similarity score.
        </p>
      </section>

      <section className="verify-section">
        <h3>Your knowledge of the place</h3>
        <div className="verify-choice" role="radiogroup" aria-label="Have you visited the exact location?">
          {(
            [
              ["exact", "I have been at the marked point"],
              ["nearby", "I know the area, not the exact point"],
              ["not-visited", "I have not been there"],
            ] as [ContributorResponse["visited"], string][]
          ).map(([value, label]) => (
            <button key={value} type="button" role="radio" aria-checked={visited === value} onClick={() => setVisited(value)}>
              {label}
            </button>
          ))}
        </div>
        <div className="verify-inline">
          <Field label="When (optional)">
            <input value={visitedWhen} placeholder="e.g. March 2025, many times since 2010" onChange={(e) => setVisitedWhen(e.target.value)} />
          </Field>
          <Field label="Name or alias (optional)">
            <input value={contributor} onChange={(e) => setContributor(e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="verify-section">
        <h3>Questions</h3>
        {request.questions.map((q, index) => {
          const a = answers[q.id];
          const at = a.videoTime != null ? whereAt(a.videoTime) : null;
          return (
            <fieldset key={q.id} className="verify-question">
              <legend>
                {index + 1}. {q.text}
              </legend>
              <div className="verify-choice" role="radiogroup" aria-label={`Answer to question ${index + 1}`}>
                {VERDICTS.map(([value, label]) => (
                  <button key={value} type="button" role="radio" aria-checked={a.verdict === value} onClick={() => answer(q.id, { verdict: value })}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="verify-inline">
                <button type="button" className="verify-button" disabled={request.video.kind === "none"} onClick={() => answer(q.id, { videoTime: Math.round((videoRef.current?.currentTime ?? 0) * 10) / 10 })}>
                  {a.videoTime != null ? `Video time ${clock(a.videoTime)} (update)` : "Use current video time"}
                </button>
                <button type="button" className={`verify-button${picking === q.id ? " is-on" : ""}`} onClick={() => setPicking(picking === q.id ? null : q.id)}>
                  {picking === q.id ? "Click the globe…" : a.mapPoint ? `Map point ${a.mapPoint.lat.toFixed(4)}, ${a.mapPoint.lon.toFixed(4)} (change)` : "Mark a point on the globe"}
                </button>
              </div>
              {at && (
                <p className="verify-hint">
                  At {clock(a.videoTime!)} the preview camera is above {at.lat.toFixed(5)}, {at.lon.toFixed(5)} (from the route and its timing).
                </p>
              )}
              <textarea rows={2} value={a.explanation} placeholder={a.verdict === "differs" ? "What is different in reality?" : "Explanation (optional)"} aria-label="Explanation" onChange={(e) => answer(q.id, { explanation: e.target.value })} />
            </fieldset>
          );
        })}
      </section>

      {request.observationRequests.length > 0 && (
        <section className="verify-section">
          <h3>Observations the researcher is asking for</h3>
          {request.observationRequests.map((o) => (
            <Field key={o.id} label={o.text} hint={o.status === "researcher" ? undefined : `Why it is asked (${o.status}): ${o.basis}`}>
              <textarea rows={2} value={observations[o.id] ?? ""} onChange={(e) => setObservations((x) => ({ ...x, [o.id]: e.target.value }))} />
            </Field>
          ))}
        </section>
      )}

      <section className="verify-section">
        <h3>Supporting evidence</h3>
        <p className="verify-hint">Photographs, documents or links. Give the date and place of each observation where you can.</p>
        {evidence.map((e) => (
          <fieldset key={e.id} className="verify-question">
            <legend>{e.file?.name ?? "Evidence without a file"}</legend>
            <div className="verify-inline">
              <Field label="Observed on">
                <input type="date" value={e.observedOn} onChange={(x) => editEvidence(e.id, { observedOn: x.target.value })} />
              </Field>
              <Field label="Latitude">
                <input type="number" step="any" value={e.lat ?? ""} onChange={(x) => editEvidence(e.id, { lat: x.target.value === "" ? null : Number(x.target.value) })} />
              </Field>
              <Field label="Longitude">
                <input type="number" step="any" value={e.lon ?? ""} onChange={(x) => editEvidence(e.id, { lon: x.target.value === "" ? null : Number(x.target.value) })} />
              </Field>
            </div>
            <div className="verify-inline">
              <button type="button" className={`verify-button${picking === `evidence:${e.id}` ? " is-on" : ""}`} onClick={() => setPicking(picking === `evidence:${e.id}` ? null : `evidence:${e.id}`)}>
                {picking === `evidence:${e.id}` ? "Click the globe…" : "Take coordinates from the globe"}
              </button>
              <button type="button" className="verify-button" onClick={() => setEvidence((list) => list.filter((x) => x.id !== e.id))}>
                Remove
              </button>
            </div>
            <Field label="Source link (optional)">
              <input type="url" value={e.sourceUrl} placeholder="https://…" onChange={(x) => editEvidence(e.id, { sourceUrl: x.target.value })} />
            </Field>
            <Field label="What it shows">
              <input value={e.note} onChange={(x) => editEvidence(e.id, { note: x.target.value })} />
            </Field>
          </fieldset>
        ))}
        <div className="verify-inline">
          <label className="verify-button verify-file">
            Attach photographs or files
            <input
              type="file"
              multiple
              accept="image/*,application/pdf,video/*"
              onChange={(e) => {
                const files = [...(e.target.files ?? [])];
                setEvidence((list) => [...list, ...files.map((file) => ({ id: newId("ev"), file, observedOn: "", lat: null, lon: null, sourceUrl: "", note: "" }))]);
                e.target.value = "";
              }}
            />
          </label>
          <button type="button" className="verify-button" onClick={() => setEvidence((list) => [...list, { id: newId("ev"), file: null, observedOn: "", lat: null, lon: null, sourceUrl: "", note: "" }])}>
            Add a source link only
          </button>
        </div>
        <Field label="Anything else">
          <textarea rows={2} value={comments} onChange={(e) => setComments(e.target.value)} />
        </Field>
      </section>

      {problem && (
        <p className="verify-error" role="alert">
          {problem}
        </p>
      )}
      <div className="verify-actions">
        <button type="button" className="card-action is-primary" disabled={saving} onClick={() => void submit()}>
          {saving ? "Saving…" : "Submit response"}
        </button>
        <button type="button" className="card-action" onClick={() => updateVerify({ view: "request" })}>
          Cancel
        </button>
      </div>
    </div>
  );
}
