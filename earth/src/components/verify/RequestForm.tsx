import { useEffect, useRef, useState } from "react";
import type { GlobeController } from "../../globe/GlobeController";
import { imageryInfo } from "../../globe/imageryCatalog";
import type { Walkthrough } from "../../globe/walkthrough";
import { showToast, store, updateVerify, useStore } from "../../state/store";
import { getDraft, setDraft } from "../../verify/build";
import { save } from "../../verify/db";
import { download, slug } from "../../verify/exchange";
import { routeLength, straightRoute } from "../../verify/route";
import { newId, type ObservationRequest, type Question, ROVER_NOTE, type VerificationRequest, type VideoKind } from "../../verify/types";
import { exact, Field, flyToSite, ModelSummary, PremadeVideoSummary, useOverlay, usePick, VideoPlayer } from "./parts";

const STATUS_LABEL: Record<ObservationRequest["status"], string> = { missing: "missing", estimated: "estimated", coarse: "coarse data", researcher: "your request" };

const PREVIEW_TEXT =
  "Camera pass over satellite imagery draped on an elevation model, recorded in this app. No vehicle, wheels or soil are simulated, and nothing is added that the imagery and elevation data do not contain.";

/** The researcher's screen for writing a verification request from a scored place. */
export function RequestForm({ globe }: { globe: GlobeController | null }) {
  const [draft, setState] = useState<VerificationRequest | null>(getDraft);
  const planet = useStore((s) => s.planet);
  const [file, setFile] = useState<File | Blob | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [heading, setHeading] = useState(90);
  const [length, setLength] = useState(1500);
  const [camera, setCamera] = useState({ heightM: 600, pitchDeg: -25, durationS: 30 });
  const [picking, setPicking] = useState(false);
  const [run, setRun] = useState<{ handle: Walkthrough; recording: boolean; progress: number } | null>(null);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAsk, setNewAsk] = useState("");
  const runRef = useRef<Walkthrough | null>(null);

  const update = (patch: Partial<VerificationRequest>) =>
    setState((d) => {
      const next = d ? { ...d, ...patch } : d;
      setDraft(next);
      return next;
    });

  useOverlay(globe, draft);
  usePick(globe, picking ? "waypoint" : null, (_t, point) => setState((d) => (d ? { ...d, route: [...d.route, point] } : d)));
  useEffect(() => () => runRef.current?.stop(), []);
  useEffect(() => {
    if (!file) return setFileUrl(null);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!draft) {
    return <p className="verify-empty">Nothing to request yet. Score a place on Earth (or open a reference site) and press "Request local verification" on its card.</p>;
  }

  const onEarth = planet === "earth" && globe?.planet.id === "earth";
  const setKind = (kind: VideoKind) => {
    setFile(null);
    setRecordError(null);
    update({ video: { kind, description: kind === "terrain-preview" ? PREVIEW_TEXT : "" }, camera: null });
  };

  const play = (record: boolean) => {
    if (!globe || !onEarth || draft.route.length < 2) return;
    setRecordError(null);
    setPicking(false);
    if (record) setFile(null);
    const imagery = imageryInfo(store.get().activeImagery ?? store.get().settings.imagery).label;
    const handle = globe.playWalkthrough(draft.route, {
      height: camera.heightM,
      pitch: camera.pitchDeg,
      duration: camera.durationS,
      record,
      labels: ["TERRAIN PREVIEW · NOT A ROVER SIMULATION", `${draft.site.name} · ${draft.site.lat.toFixed(4)}, ${draft.site.lon.toFixed(4)}`, `Satellite imagery (${imagery}) on an elevation model`],
      onProgress: (progress) => setRun((r) => (r && r.handle === handle && progress - r.progress > 0.02 ? { ...r, progress } : r)),
    });
    runRef.current = handle;
    setRun({ handle, recording: record, progress: 0 });
    void handle.finished.then((result) => {
      setRun((r) => (r?.handle === handle ? null : r));
      if (!record) return;
      if (result.video) {
        setFile(result.video);
        update({
          video: { kind: "terrain-preview", description: PREVIEW_TEXT, fileName: `terrain-preview-${slug(draft.site.name)}.${result.video.type.includes("mp4") ? "mp4" : "webm"}` },
          camera: { ...camera, imagery },
        });
        if (result.error) setRecordError(result.error);
        else if (!result.completed) setRecordError("The pass was stopped early, so the recording covers only part of the route.");
      } else {
        setRecordError(result.error ?? "The pass was stopped before anything was recorded.");
      }
    });
  };

  const submit = async () => {
    setSaving(true);
    try {
      const request: VerificationRequest = { ...draft, questions: draft.questions.filter((q) => q.text.trim()), observationRequests: draft.observationRequests.filter((o) => o.text.trim()) };
      const blobs = [];
      if ((request.video.kind === "file" || request.video.kind === "terrain-preview") && file) {
        const id = newId("file");
        request.video = { ...request.video, attachmentId: id };
        blobs.push({ id, name: request.video.fileName ?? "video", type: file.type, blob: file });
      } else if (request.video.kind === "url" && !request.video.url?.trim()) {
        request.video = { kind: "none", description: "" };
      } else if (request.video.kind !== "url") {
        request.video = { kind: "none", description: "" };
      }
      await save({ requests: [request] }, blobs);
      setDraft(null);
      showToast("Request saved in this browser.");
      updateVerify({ view: "request", requestId: request.id });
    } catch (e) {
      showToast(e instanceof Error ? `Not saved: ${e.message}` : "The request could not be saved.", 8000);
    } finally {
      setSaving(false);
    }
  };

  const video = draft.video;
  const editQuestion = (id: string, text: string) => update({ questions: draft.questions.map((q) => (q.id === id ? { ...q, text } : q)) });

  return (
    <div className="verify-form">
      <section className="verify-section">
        <h3>Site</h3>
        <Field label="Site name">
          <input value={draft.site.name} onChange={(e) => update({ site: { ...draft.site, name: e.target.value } })} />
        </Field>
        <p className="verify-fact">
          Exact coordinates (WGS84): <strong>{exact(draft.site.lat, draft.site.lon)}</strong> · {draft.site.kind === "curated-site" ? "curated reference site" : "point inside a grid cell"}
        </p>
        <button type="button" className="targetbar-link" onClick={() => flyToSite(globe, draft.site)}>
          Show the site on the globe
        </button>
        <Field label="Purpose of the investigation">
          <textarea rows={3} value={draft.purpose} onChange={(e) => update({ purpose: e.target.value })} />
        </Field>
      </section>

      <ModelSummary model={draft.model} />

      <section className="verify-section">
        <h3>Route and camera</h3>
        <p className="verify-hint">The route tells contributors which ground you want checked. It is drawn on the globe in cyan; the yellow dot is the marked point.</p>
        <div className="verify-inline">
          <Field label="Heading °">
            <input type="number" min={0} max={359} value={heading} onChange={(e) => setHeading(Number(e.target.value))} />
          </Field>
          <Field label="Length m">
            <input type="number" min={100} max={50000} step={100} value={length} onChange={(e) => setLength(Number(e.target.value))} />
          </Field>
          <button type="button" className="verify-button" onClick={() => update({ route: straightRoute(draft.site, heading, Math.max(100, length)) })}>
            Straight line through the point
          </button>
        </div>
        <div className="verify-inline">
          <button type="button" className={`verify-button${picking ? " is-on" : ""}`} aria-pressed={picking} disabled={!onEarth} onClick={() => setPicking((v) => !v)}>
            {picking ? "Click the globe to add waypoints… (done)" : "Add waypoints by clicking the globe"}
          </button>
          <button type="button" className="verify-button" disabled={!draft.route.length} onClick={() => update({ route: draft.route.slice(0, -1) })}>
            Remove last
          </button>
          <button type="button" className="verify-button" disabled={!draft.route.length} onClick={() => update({ route: [] })}>
            Clear
          </button>
        </div>
        <p className="verify-fact">
          {draft.route.length ? `${draft.route.length} waypoints, ${Math.round(routeLength(draft.route)).toLocaleString("en-US")} m: ${draft.route.map((p) => `${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}`).join(" → ")}` : "No route yet."}
        </p>
      </section>

      <section className="verify-section">
        <h3>Walkthrough video</h3>
        <p className="verify-rover">
          <strong>Rover simulation: not linked to this request.</strong> {ROVER_NOTE}
        </p>
        {draft.premadeVideo && <PremadeVideoSummary plan={draft.premadeVideo} />}
        <div className="verify-choice" role="radiogroup" aria-label="Video source">
          {(
            [
              ["none", "None yet"],
              ["file", "Attach a file"],
              ["url", "Link a URL"],
              ["terrain-preview", "Record a terrain preview"],
            ] as [VideoKind, string][]
          ).map(([kind, label]) => (
            <button key={kind} type="button" role="radio" aria-checked={video.kind === kind} onClick={() => setKind(kind)}>
              {label}
            </button>
          ))}
        </div>

        {video.kind === "file" && (
          <>
            <Field label="Video file" hint="Stored in this browser with the request.">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const chosen = e.target.files?.[0] ?? null;
                  setFile(chosen);
                  update({ video: { ...video, fileName: chosen?.name } });
                }}
              />
            </Field>
            <Field label="What is this video?" hint="Say what made it and which details, if any, are procedurally generated rather than measured.">
              <input value={video.description} placeholder="e.g. Rover simulator run along the route above" onChange={(e) => update({ video: { ...video, description: e.target.value } })} />
            </Field>
          </>
        )}
        {video.kind === "url" && (
          <>
            <Field label="Video URL" hint="A direct link to a video file plays here; any other link opens in a new tab.">
              <input type="url" value={video.url ?? ""} placeholder="https://…" onChange={(e) => update({ video: { ...video, url: e.target.value } })} />
            </Field>
            <Field label="What is this video?">
              <input value={video.description} onChange={(e) => update({ video: { ...video, description: e.target.value } })} />
            </Field>
          </>
        )}
        {video.kind === "terrain-preview" && (
          <>
            <p className="verify-hint">{PREVIEW_TEXT} Every recorded frame carries the label "Terrain preview · not a rover simulation".</p>
            <div className="verify-inline">
              <Field label="Height m">
                <input type="number" min={30} max={3000} value={camera.heightM} onChange={(e) => setCamera({ ...camera, heightM: Number(e.target.value) })} />
              </Field>
              <Field label="Pitch °">
                <input type="number" min={-89} max={0} value={camera.pitchDeg} onChange={(e) => setCamera({ ...camera, pitchDeg: Number(e.target.value) })} />
              </Field>
              <Field label="Seconds">
                <input type="number" min={5} max={180} value={camera.durationS} onChange={(e) => setCamera({ ...camera, durationS: Number(e.target.value) })} />
              </Field>
            </div>
            <p className="verify-hint">
              The heatmap is hidden while the camera moves. If the ground shows "Map data not yet available", the imagery source has no finer pictures of this place: raise the camera, or choose
              another imagery layer.
            </p>
            {!onEarth && <p className="verify-hint">Switch to Earth to play or record the preview.</p>}
            {draft.route.length < 2 && <p className="verify-hint">Add a route first: the camera follows it.</p>}
            <div className="verify-inline">
              {run ? (
                <button type="button" className="verify-button is-on" onClick={() => run.handle.stop()}>
                  Stop ({run.recording ? "recording" : "preview"} {Math.round(run.progress * 100)}%)
                </button>
              ) : (
                <>
                  <button type="button" className="verify-button" disabled={!onEarth || draft.route.length < 2} onClick={() => play(false)}>
                    Preview on the globe
                  </button>
                  <button type="button" className="verify-button is-primary" disabled={!onEarth || draft.route.length < 2} onClick={() => play(true)}>
                    {file ? "Record again" : "Record"}
                  </button>
                </>
              )}
            </div>
            {recordError && (
              <p className="verify-error" role="alert">
                {recordError}
              </p>
            )}
          </>
        )}

        {video.kind !== "none" && (video.kind === "url" ? !!video.url : !!file) && (
          <>
            <VideoPlayer video={video} objectUrl={video.kind === "url" ? null : fileUrl} />
            {file && video.kind === "terrain-preview" && (
              <div className="verify-inline">
                <button type="button" className="verify-button" onClick={() => download(video.fileName ?? "terrain-preview.webm", file)}>
                  Export video file
                </button>
                <button type="button" className="verify-button" onClick={() => setFile(null)}>
                  Discard recording
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="verify-section">
        <h3>Questions for contributors</h3>
        <p className="verify-hint">Each is answered with Matches, Differs or Cannot judge.</p>
        <ul className="verify-items">
          {draft.questions.map((q: Question) => (
            <li key={q.id}>
              <textarea rows={2} value={q.text} aria-label="Question" onChange={(e) => editQuestion(q.id, e.target.value)} />
              <button type="button" className="verify-remove" aria-label="Remove question" onClick={() => update({ questions: draft.questions.filter((x) => x.id !== q.id) })}>
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="verify-add">
          <input value={newQuestion} placeholder="Add your own question" onChange={(e) => setNewQuestion(e.target.value)} />
          <button
            type="button"
            className="verify-button"
            disabled={!newQuestion.trim()}
            onClick={() => {
              update({ questions: [...draft.questions, { id: newId("q"), text: newQuestion.trim(), origin: "researcher" }] });
              setNewQuestion("");
            }}
          >
            Add
          </button>
        </div>
      </section>

      <section className="verify-section">
        <h3>Observations asked for</h3>
        <p className="verify-hint">Items marked missing, estimated or coarse come from the data behind this score; the reason is given under each. Remove any that do not matter for your purpose.</p>
        <ul className="verify-items">
          {draft.observationRequests.map((o) => (
            <li key={o.id}>
              <div>
                <span className={`verify-badge is-${o.status}`}>{STATUS_LABEL[o.status]}</span> {o.text}
                {o.basis && <span className="verify-hint">{o.basis}</span>}
              </div>
              <button type="button" className="verify-remove" aria-label="Remove request" onClick={() => update({ observationRequests: draft.observationRequests.filter((x) => x.id !== o.id) })}>
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="verify-add">
          <input value={newAsk} placeholder="Ask for another observation" onChange={(e) => setNewAsk(e.target.value)} />
          <button
            type="button"
            className="verify-button"
            disabled={!newAsk.trim()}
            onClick={() => {
              update({ observationRequests: [...draft.observationRequests, { id: newId("o"), text: newAsk.trim(), status: "researcher", basis: "" }] });
              setNewAsk("");
            }}
          >
            Add
          </button>
        </div>
      </section>

      <section className="verify-section">
        <h3>Datasets behind the Earth values</h3>
        <ul className="verify-datasets">
          {draft.datasets.map((d) => (
            <li key={d.label}>
              {d.label}
              <span className="verify-hint">
                Date: {d.date ?? "not recorded in the app"} · Resolution: {d.resolution ?? "not recorded in the app"}
              </span>
            </li>
          ))}
          {draft.model.gridGenerated && <li>Global grid built {draft.model.gridGenerated}.</li>}
        </ul>
      </section>

      <div className="verify-actions">
        <button type="button" className="card-action is-primary" disabled={saving || !!run} onClick={() => void submit()}>
          {saving ? "Saving…" : "Save request"}
        </button>
        <button
          type="button"
          className="card-action"
          onClick={() => {
            setDraft(null);
            updateVerify({ view: "list" });
          }}
        >
          Discard
        </button>
      </div>
    </div>
  );
}
