import { useEffect, useId, useMemo, useState } from "react";
import { percent, useAtlas } from "../analog/data";
import { siteMeasures } from "../analog/grid";
import { customTarget, isFixed, profilesFor, resolveProfile, useCustomTargets, versionLabel } from "../analog/custom";
import { type Body, type Profile, similarity } from "../analog/scoring";
import type { GlobeController } from "../globe/GlobeController";
import { travel } from "../state/navigation";
import { updateAtlas, useStore } from "../state/store";
import { removeTarget, TargetDetails } from "./CustomTarget";
import { HeatmapControls } from "./HeatmapControls";
import { ChevronIcon } from "./icons";
import { useGrid } from "./InfoCard";

const BODY_NAME: Record<Body, string> = { mars: "Mars", moon: "the Moon" };

export const flyToProfile = (globe: GlobeController | null, p: Profile) =>
  travel(globe, p.body, { lat: p.place.lat, lon: p.place.lon, span: 160_000, title: p.place.name, subtitle: `${p.body === "mars" ? "Mars" : "Moon"} · ${p.name}` });

/**
 * The compact control on the left: which body and which version of it Earth
 * is compared with and, folded away until asked for, the ranked list of
 * reference sites, and the switch for the similarity heatmap. Until that
 * switch is on, nothing on the globe is scored from here: a spot is scored
 * from its own card, when its button is pressed. It stays
 * narrow so the whole-planet view is never covered; reading happens in the
 * card on the right.
 */
export function TargetBar({ globe }: { globe: GlobeController | null }) {
  const { data, failed } = useAtlas();
  const atlas = useStore((s) => s.atlas);
  const onEarth = useStore((s) => s.planet) === "earth";
  const heatmapOn = useStore((s) => s.heatmap.on);
  const [newOnly, setNewOnly] = useState(false);
  const listId = useId();
  const customs = useCustomTargets();
  const profile = resolveProfile(atlas.profiles[atlas.body]);
  const custom = customTarget(profile.id);
  const versions = profilesFor(atlas.body);

  // Dots on the globe: curated sites on Earth; on the Moon and Mars the profiles' reference regions and the custom targets.
  useEffect(() => {
    if (!globe || !data) return;
    const pins =
      globe.planet.id === "earth"
        ? data.sites.map((s) => ({ lat: s.lat, lon: s.lon, active: s.id === atlas.siteId }))
        : profilesFor(globe.planet.id as Body).map((p) => ({ lat: p.place.lat, lon: p.place.lon, active: p.id === profile.id }));
    globe.setPins(pins);
  }, [globe, data, atlas.siteId, profile.id, customs]);

  // The grid is needed to rank the reference sites.
  const { grid, failed: gridFailed } = useGrid(atlas.listOpen);

  const ranked = useMemo(
    () =>
      data && grid && atlas.listOpen
        ? data.sites.map((site) => ({ site, score: similarity(siteMeasures(grid, site).measures, profile) })).sort((a, b) => b.score - a.score)
        : [],
    // A renamed custom target is a new object with the same content: its id is what matters here.
    [data, grid, atlas.listOpen, profile.id],
  );

  if (!atlas.open) return null;
  if (!data) {
    return (
      <aside className="targetbar panel" aria-label="Analog Atlas">
        <p className="atlas-empty">{failed ? "The analog dataset could not be loaded." : "Loading analog data…"}</p>
      </aside>
    );
  }

  return (
    <aside className="targetbar panel" aria-label="Analog Atlas">
      <div className="atlas-eyebrow" id={`${listId}-body`}>
        Compare Earth with
      </div>
      <div className="targetbar-targets" role="radiogroup" aria-labelledby={`${listId}-body`}>
        {(["mars", "moon"] as Body[]).map((body) => (
          <button key={body} type="button" role="radio" aria-checked={body === atlas.body} onClick={() => updateAtlas({ body })}>
            {body === "mars" ? "Mars" : "Moon"}
          </button>
        ))}
      </div>

      <label className="targetbar-row">
        <span>Version</span>
        <select value={profile.id} onChange={(e) => updateAtlas({ profiles: { ...atlas.profiles, [atlas.body]: e.target.value } })}>
          {versions.filter(isFixed).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          {versions.some((p) => !isFixed(p)) && (
            <optgroup label="Custom points (flagged on the Moon)">
              {versions
                .filter((p) => !isFixed(p))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </optgroup>
          )}
        </select>
      </label>

      <div className="targetbar-target">
        <span>
          <span className="atlas-site-detail">{profile.summary}</span>
        </span>
        <button type="button" className="targetbar-link" onClick={() => flyToProfile(globe, profile)}>
          Fly to {profile.place.name}
        </button>
      </div>

      {custom ? (
        <>
          <TargetDetails target={custom} />
          <button type="button" className="targetbar-link target-remove" onClick={() => removeTarget(custom)}>
            Remove this custom target
          </button>
        </>
      ) : (
        atlas.body === "moon" && <p className="target-hint">To compare with a specific lunar location, select a point on the Moon and choose "Use this point as the target".</p>
      )}

      <HeatmapControls profile={profile} />

      {onEarth && (
        <p className="targetbar-hint">
          {heatmapOn ? "Click a cell for its breakdown and to request local verification." : "Click any spot on Earth, then press Score this spot."}
        </p>
      )}

      <button
        type="button"
        className="targetbar-row targetbar-disclosure"
        aria-expanded={atlas.listOpen}
        aria-controls={listId}
        onClick={() => updateAtlas({ listOpen: !atlas.listOpen })}
      >
        <span>{data.sites.length} reference sites, ranked</span>
        <ChevronIcon />
      </button>

      {atlas.listOpen && (
        <div id={listId} className="targetbar-list">
          <button type="button" role="switch" aria-checked={newOnly} className="atlas-filter" onClick={() => setNewOnly((v) => !v)}>
            New sites only <span className="switch" />
          </button>
          {!grid && <p className="atlas-foot">{gridFailed ? "The global grid could not be loaded." : "Loading the global grid…"}</p>}
          <ol className="atlas-list">
            {ranked.map((r, index) =>
              newOnly && r.site.known ? null : (
                <li key={r.site.id}>
                  <button type="button" aria-current={r.site.id === atlas.siteId ? "true" : undefined} onClick={() => updateAtlas({ siteId: r.site.id })}>
                    <span className="atlas-rank">{index + 1}</span>
                    <span className="atlas-site">
                      <span className="atlas-site-name">{r.site.name}</span>
                      <span className="atlas-site-detail">
                        {r.site.country}
                        {r.site.known && " · known analog"}
                      </span>
                      <span className="atlas-bar" aria-hidden="true">
                        <i style={{ width: percent(r.score) }} />
                      </span>
                    </span>
                    <span className="atlas-score">{percent(r.score)}</span>
                  </button>
                </li>
              ),
            )}
          </ol>
          <p className="atlas-foot">
            Similarity to {BODY_NAME[profile.body]} ({versionLabel(profile)}): a weighted geometric mean of the metric groups, so one poor match pulls the whole score down. Data built{" "}
            {data.generated}.
          </p>
        </div>
      )}
    </aside>
  );
}
