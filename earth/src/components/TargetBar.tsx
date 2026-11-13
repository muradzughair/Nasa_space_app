import { useEffect, useId, useMemo, useState } from "react";
import { percent, PRESETS, rank, type Target, useAtlas, weightsFor } from "../analog/data";
import { HEAT_RANGE, heatGradient, type Heatmap, renderHeatmap } from "../analog/grid";
import { formatLat, formatLon } from "../geo/coords";
import type { GlobeController } from "../globe/GlobeController";
import { travel } from "../state/navigation";
import { updateAtlas, useStore } from "../state/store";
import { ChevronIcon } from "./icons";
import { useGrid } from "./InfoCard";

/** Names short enough for four to sit in one row. */
const SHORT: Record<string, string> = {
  "moon-south-pole": "Lunar pole",
  "moon-tranquillitatis-pit": "Lunar pit",
  "mars-jezero": "Jezero",
  "mars-arcadia": "Arcadia",
};

/**
 * The compact control on the left: which target Earth is compared with, the
 * mission goal, the similarity map and, folded away until asked for, the
 * ranked list of curated sites. It stays narrow so the whole-planet view is
 * never covered; reading happens in the card on the right.
 */
export function TargetBar({ globe }: { globe: GlobeController | null }) {
  const { data, failed } = useAtlas();
  const atlas = useStore((s) => s.atlas);
  const planet = useStore((s) => s.planet);
  const [newOnly, setNewOnly] = useState(false);
  const listId = useId();
  const onEarth = planet === "earth";

  const target = data?.targets.find((t) => t.id === atlas.targetId) ?? data?.targets[0] ?? null;
  const weights = target ? weightsFor(target, atlas.presetId) : null;
  const ranked = useMemo(() => (data && target && weights ? rank(data, target, weights) : []), [data, target, weights]);

  // Dots on the globe: curated sites on Earth, targets on the Moon and Mars.
  useEffect(() => {
    if (!globe || !data) return;
    const pins =
      globe.planet.id === "earth"
        ? data.sites.map((s) => ({ lat: s.lat, lon: s.lon, active: s.id === atlas.siteId }))
        : data.targets.filter((t) => t.body === globe.planet.id).map((t) => ({ lat: t.lat, lon: t.lon, active: t.id === atlas.targetId }));
    globe.setPins(pins);
  }, [globe, data, atlas.siteId, atlas.targetId]);

  // The similarity map: every land cell scored against the selected target.
  const wantMap = atlas.heatmap && onEarth;
  const { grid, failed: gridFailed } = useGrid(wantMap);
  // Scoring every cell for a new target takes a while, so it is asynchronous;
  // until it finishes the previous map (and its legend) stays on screen.
  const [heat, setHeat] = useState<Heatmap | null>(null);
  useEffect(() => {
    if (!wantMap || !grid || !data || !target || !weights) {
      setHeat(null);
      return;
    }
    let live = true;
    renderHeatmap(grid, data, target, weights).then(
      (h) => live && setHeat(h),
      (error: unknown) => console.error(error),
    );
    return () => {
      live = false;
    };
  }, [wantMap, grid, data, target, weights]);
  useEffect(() => {
    if (!globe || globe.planet.id !== "earth") return;
    void globe.setHeatmap(heat?.canvas ?? null);
  }, [globe, heat]);

  if (!atlas.open) return null;
  if (!data || !target) {
    return (
      <aside className="targetbar panel" aria-label="Analog Atlas">
        <p className="atlas-empty">{failed ? "The analog dataset could not be loaded." : "Loading analog data…"}</p>
      </aside>
    );
  }

  const flyToTarget = (t: Target) => travel(globe, t.body, { lat: t.lat, lon: t.lon, span: 160_000, title: t.name, subtitle: t.region });

  return (
    <aside className="targetbar panel" aria-label="Analog Atlas">
      <div className="atlas-eyebrow" id={`${listId}-target`}>
        Compare Earth with
      </div>
      <div className="targetbar-targets" role="radiogroup" aria-labelledby={`${listId}-target`}>
        {data.targets.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={t.id === target.id}
            aria-label={`${t.name}, ${t.body === "moon" ? "Moon" : "Mars"}`}
            title={`${t.name} · ${t.region}`}
            onClick={() => updateAtlas({ targetId: t.id })}
          >
            {SHORT[t.id] ?? t.name}
          </button>
        ))}
      </div>

      <div className="targetbar-target">
        <span>
          <strong>{target.name}</strong>
          <span className="atlas-site-detail">{target.region}</span>
        </span>
        <button type="button" className="targetbar-link" onClick={() => flyToTarget(target)}>
          Fly there
        </button>
      </div>

      <label className="targetbar-row">
        <span>Mission goal</span>
        <select value={atlas.presetId} onChange={(e) => updateAtlas({ presetId: e.target.value })}>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      {onEarth && (
        <button type="button" role="switch" aria-checked={atlas.heatmap} className="targetbar-row" onClick={() => updateAtlas({ heatmap: !atlas.heatmap })}>
          <span>Similarity map</span>
          <span className="switch" />
        </button>
      )}
      {wantMap && (
        <div className="heat-legend">
          {heat ? (
            <>
              <div className="heat-ramp" style={{ background: heatGradient() }} role="img" aria-label={`Colour scale from ${percent(HEAT_RANGE[0])} or less to ${percent(HEAT_RANGE[1])} or more overall similarity`} />
              <div className="heat-ticks" aria-hidden="true">
                <span>≤{percent(HEAT_RANGE[0])}</span>
                <span>{percent((HEAT_RANGE[0] + HEAT_RANGE[1]) / 2)}</span>
                <span>≥{percent(HEAT_RANGE[1])}</span>
              </div>
              <p>
                Overall similarity of each 0.5° land cell (about 50 km) to {heat.target.name}. White dots are the curated sites.{" "}
                <button type="button" className="targetbar-link" onClick={() => globe?.select(heat.best.lat, heat.best.lon, { span: 220_000 })}>
                  Best cell: {percent(heat.best.score)} at {formatLat(heat.best.lat, 2)}, {formatLon(heat.best.lon, 2)}
                </button>
              </p>
            </>
          ) : (
            <p>{gridFailed ? "The global grid could not be loaded." : "Loading the global grid…"}</p>
          )}
        </div>
      )}

      <button
        type="button"
        className="targetbar-row targetbar-disclosure"
        aria-expanded={atlas.listOpen}
        aria-controls={listId}
        onClick={() => updateAtlas({ listOpen: !atlas.listOpen })}
      >
        <span>{data.sites.length} curated sites, ranked</span>
        <ChevronIcon />
      </button>

      {atlas.listOpen && (
        <div id={listId} className="targetbar-list">
          <button type="button" role="switch" aria-checked={newOnly} className="atlas-filter" onClick={() => setNewOnly((v) => !v)}>
            New sites only <span className="switch" />
          </button>
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
          <p className="atlas-foot">Seven dimensions measured from open data; the mission goal sets their weights. Data built {data.generated}.</p>
        </div>
      )}
    </aside>
  );
}
