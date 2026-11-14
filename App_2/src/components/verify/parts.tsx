import { type ReactNode, type Ref, useEffect, useState } from "react";
import { percent } from "../../analog/data";
import { GROUPS } from "../../analog/scoring";
import { topShare } from "../../analog/heatmap";
import { formatLat, formatLon } from "../../geo/coords";
import { ProvenanceList } from "../CustomTarget";
import type { GlobeController } from "../../globe/GlobeController";
import { travel } from "../../state/navigation";
import { useBlobUrl } from "../../verify/db";
import type { LatLon } from "../../verify/route";
import type { ModelSnapshot, PremadeVideoNote, SiteRef, VerificationRequest, VideoRef } from "../../verify/types";

const QUALITY: Record<string, string> = { measured: "measured", map: "mapped", literature: "published", proxy: "estimated" };

export const exact = (lat: number, lon: number) => `${formatLat(lat, 5)}, ${formatLon(lon, 5)}`;

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="verify-field">
      <span className="verify-label">{label}</span>
      {children}
      {hint && <span className="verify-hint">{hint}</span>}
    </label>
  );
}

export function flyToSite(globe: GlobeController | null, site: SiteRef, span = 6000) {
  travel(globe, "earth", { lat: site.lat, lon: site.lon, span, title: site.name, subtitle: site.country ?? "" });
}

/** The model-derived score as it was when the request was made. Read-only everywhere. */
/** The planned pre-made rover video of a request, kept apart from its video: a status, not something to play. */
export function PremadeVideoSummary({ plan }: { plan: PremadeVideoNote }) {
  return (
    <div className="verify-premade" role="note">
      <p>
        <span className="verify-badge is-planned">To be recorded</span> <strong>Pre-made rover video: planned, not recorded.</strong>
      </p>
      <p className="verify-fact">
        Target {plan.targetName} ({plan.targetId}{plan.custom ? ", custom lunar target" : ""}). The {plan.cellDegrees}° cell centred {formatLat(plan.cellCentre.lat, 2)}, {formatLon(plan.cellCentre.lon, 2)} ranks {plan.shownRank} of land cells
        (percentile rank {(plan.percentileRank * 100).toFixed(2)}); rule: {plan.rule}. {plan.note}
      </p>
    </div>
  );
}

export function ModelSummary({ model }: { model: ModelSnapshot }) {
  const c = model.evaluation.confidence;
  const h = model.heatmapCell;
  return (
    <section className="verify-section verify-model">
      <h3>
        Model-derived score <span className="verify-tag">record 1 of 3</span>
      </h3>
      <dl className="cell-heat-rows">
        <div>
          <dt>
            Similarity to {model.body === "moon" ? "the Moon" : "Mars"}, {model.customTarget ? `custom point ${model.profileName}` : model.profileName.toLowerCase()}
          </dt>
          <dd>{percent(model.overall)}</dd>
        </div>
        {h && (
          <div>
            <dt>Heatmap cell similarity (regional)</dt>
            <dd>{percent(h.score)}</dd>
          </div>
        )}
        {h?.percentileRank != null && (
          <div>
            <dt>Cell rank among land cells</dt>
            <dd>{topShare(h.percentileRank)}</dd>
          </div>
        )}
      </dl>
      <p className="verify-hint">
        {model.note} Scored {model.scoredAt.slice(0, 10)} by the app's shared scoring function. Contributor responses and reviews are stored separately and never change it.
      </p>
      {model.customTarget && (
        <details className="atlas-sources" open>
          <summary>Custom target: a point flagged on the Moon</summary>
          <p className="verify-hint">
            The comparison target of this request is not one of the fixed profiles. It is {model.customTarget.name}, at {formatLat(model.customTarget.lat)}, {formatLon(model.customTarget.lon)} on the
            Moon, created {model.customTarget.createdAt.slice(0, 10)}. Fields that could not be established for the point are inherited from the fixed profile "{model.customTarget.baseProfileName}".
          </p>
          <ProvenanceList rows={model.customTarget.provenance} />
        </details>
      )}
      <details className="atlas-sources">
        <summary>Score breakdown and data confidence</summary>
        <ul className="verify-groups">
          {GROUPS.filter((g) => model.evaluation.groups[g.id].score != null || model.evaluation.groups[g.id].parts.length > 0).map((g) => (
            <li key={g.id}>
              <strong>
                {g.label}: {percent(model.evaluation.groups[g.id].score)}
              </strong>
              <ul>
                {model.evaluation.groups[g.id].parts.map((p) => (
                  <li key={p.label}>
                    {p.label}: {p.earth} <span className={`atlas-quality is-${p.quality}`}>{QUALITY[p.quality]}</span> {percent(p.score)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="verify-hint">
          {percent(c.measured)} of the weight rests on measured or mapped values, {percent(c.proxy)} on estimates{c.missing > 0.005 ? `, ${percent(c.missing)} has no data` : ""}.
        </p>
      </details>
      <details className="atlas-sources">
        <summary>Sources</summary>
        <ul>
          {model.sources.map((s) => (
            <li key={s.label}>
              <span className="atlas-source-kind">{s.kind}</span> {s.label}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

export const VIDEO_KIND_LABEL: Record<VideoRef["kind"], string> = {
  none: "No video",
  file: "Attached video",
  url: "Linked video",
  "terrain-preview": "Terrain preview, not a rover simulation",
};

/**
 * The request's video with a plain statement of what it is. `objectUrl`
 * shows a file that is not stored yet (a fresh recording or a chosen file).
 */
export function VideoPlayer({ video, objectUrl, videoRef }: { video: VideoRef; objectUrl?: string | null; videoRef?: Ref<HTMLVideoElement> }) {
  const stored = useBlobUrl(objectUrl ? undefined : video.attachmentId);
  const [broken, setBroken] = useState(false);
  const src = objectUrl ?? (video.kind === "url" ? video.url : stored.url) ?? null;
  useEffect(() => setBroken(false), [src]);

  if (video.kind === "none") return <p className="verify-empty">No video is attached to this request yet.</p>;
  return (
    <figure className="verify-video">
      <figcaption>
        <span className={`verify-badge${video.kind === "terrain-preview" ? " is-preview" : ""}`}>{VIDEO_KIND_LABEL[video.kind]}</span>
        {video.description && <span> {video.description}</span>}
      </figcaption>
      {src && !broken ? (
        <video ref={videoRef} src={src} controls playsInline preload="metadata" onError={() => setBroken(true)} />
      ) : stored.missing ? (
        <p className="verify-empty">The video file is not in this browser's storage. It may have been left out of an import.</p>
      ) : broken ? (
        <p className="verify-empty">This video cannot be played here. {video.kind === "url" ? "The link may be a web page rather than a video file." : "The browser does not support its format."}</p>
      ) : (
        <p className="verify-empty">Loading video…</p>
      )}
      {video.kind === "url" && video.url && (
        <a className="targetbar-link" href={video.url} target="_blank" rel="noreferrer noopener">
          Open the video link in a new tab
        </a>
      )}
    </figure>
  );
}

/** Site point, route and picked points of a request, drawn on the globe while a screen is open. */
export function useOverlay(globe: GlobeController | null, request: Pick<VerificationRequest, "site" | "route"> | null, picks: LatLon[] = []) {
  const key = JSON.stringify([request?.site.lat, request?.site.lon, request?.route, picks]);
  useEffect(() => {
    if (!globe || !request || globe.planet.id !== "earth") return;
    globe.setVerifyOverlay({
      route: request.route,
      points: [
        ...request.route.map((p) => ({ ...p, kind: "waypoint" as const })),
        { lat: request.site.lat, lon: request.site.lon, kind: "site" as const },
        ...picks.map((p) => ({ ...p, kind: "pick" as const })),
      ],
    });
    return () => {
      try {
        globe.setVerifyOverlay({});
      } catch {
        /* globe destroyed */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globe, key]);
}

/**
 * Picking a point on the globe: while `target` is set, the next click on the
 * globe is handed to `onPick` instead of selecting a place.
 */
export function usePick(globe: GlobeController | null, target: string | null, onPick: (target: string, point: LatLon) => void) {
  useEffect(() => {
    if (!globe || !target) return;
    globe.setClickHandler((lat, lon) => onPick(target, { lat: +lat.toFixed(6), lon: +lon.toFixed(6) }));
    return () => {
      try {
        globe.setClickHandler(null);
      } catch {
        /* globe destroyed */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globe, target]);
}
