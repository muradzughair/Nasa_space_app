import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { percent } from "../analog/data";
import type { Grid } from "../analog/grid";
import { resolveProfile, useCustomTargets, versionLabel } from "../analog/custom";
import { paintPremadeMarks, PREMADE_VIDEO_TOP_PERCENT, premadeVideoCells, targetName } from "../analog/premade";
import {
  belowCss,
  cachedCellScores,
  type CellScores,
  computeCellScores,
  distribution,
  paintHeatmap,
  profileKey,
  rampCss,
  SCALE_MAX,
  TOP_COUNT,
  TOP_MIN_SEPARATION_DEG,
  type TopPlace,
  topPlaces,
} from "../analog/heatmap";
import type { Profile } from "../analog/scoring";
import { formatLat, formatLon } from "../geo/coords";
import { loadGeodata, locate } from "../geo/geodata";
import type { GlobeController } from "../globe/GlobeController";
import { store, updateAtlas, updateHeatmap, useStore } from "../state/store";
import { useGrid } from "./InfoCard";
import { InfoTip } from "./InfoTip";

/**
 * Every land cell scored against a profile, once wanted. While another
 * profile's scores are being computed this returns null, never the previous
 * profile's: an old map is not shown under a new name.
 */
export function useCellScores(grid: Grid | null, profile: Profile, wanted: boolean): { cells: CellScores | null; progress: number } {
  const [state, setState] = useState<{ cells: CellScores | null; progress: number }>({ cells: null, progress: 0 });
  const key = profileKey(profile);
  useEffect(() => {
    if (!grid || !wanted) return;
    const ready = cachedCellScores(grid, profile);
    setState({ cells: ready, progress: ready ? 1 : 0 });
    if (ready) return;
    const abort = new AbortController();
    let shown = 0;
    void computeCellScores(grid, profile, abort.signal, (fraction) => {
      // A few progress updates a second are plenty.
      if (fraction - shown >= 0.04) setState({ cells: null, progress: (shown = fraction) });
    }).then((cells) => cells && !abort.signal.aborted && setState({ cells, progress: 1 }));
    return () => abort.abort();
    // Keyed on what the profile contains: renaming a custom target does not rescore, a new point always does.
  }, [grid, key, wanted]);
  const current = wanted && state.cells?.key === key ? state.cells : null;
  return { cells: current, progress: current ? 1 : state.progress };
}

/** Country of a top place, when the country outlines are loaded and the cell centre falls inside one. */
function countryOf(p: TopPlace): string | null {
  const hit = locate(p.lat, p.lon);
  // The ice shelves and coastal cells of Antarctica fall outside its outline.
  return hit.kind === "country" ? hit.name : p.lat < -60 ? "Antarctica" : null;
}

/** "Chile" or "23.5° S, 68.2° W": the name a top place is listed and announced under. */
function placeName(p: TopPlace): string {
  return countryOf(p) ?? `${formatLat(p.lat, 1)}, ${formatLon(p.lon, 1)}`;
}

/** Flies to a top place and opens its card, the same card a click on the globe there gives. */
function openTopPlace(globe: GlobeController | null, p: TopPlace) {
  if (!globe) return;
  if (store.get().atlas.siteId) updateAtlas({ siteId: null });
  try {
    globe.select(p.lat, p.lon, { span: 120_000 });
  } catch {
    /* the globe of the previous world is already destroyed */
  }
}

/** The country outlines, loaded once (the globe loads them too); re-renders when they arrive so names can replace coordinates. */
function useGeodataReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    void loadGeodata().then(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, []);
  return ready;
}

/**
 * Keeps the heatmap layer on the globe current. Mounted for the life of the
 * app, so closing the bar on the left does not take the map away. The layer
 * is removed at once when the profile changes or the map is switched off,
 * and drawn again only when the new profile's scores exist.
 */
export function HeatmapLayer({ globe }: { globe: GlobeController | null }) {
  const heatmap = useStore((s) => s.heatmap);
  const profileId = useStore((s) => s.atlas.profiles[s.atlas.body]);
  useCustomTargets();
  const profile = resolveProfile(profileId);
  const { grid } = useGrid(heatmap.on);
  const { cells } = useCellScores(grid, profile, heatmap.on);

  useEffect(() => {
    if (!globe) return;
    // Opacity is read here, not depended on, so moving its slider does not rebuild the picture.
    try {
      globe.setHeatmap(heatmap.on && grid && cells ? paintHeatmap(grid, cells, heatmap.threshold) : null, store.get().heatmap.opacity);
    } catch {
      /* the heatmap was switched on in the same step as a change of world: this globe is already destroyed, and the next one draws it */
    }
    return () => {
      try {
        globe.setHeatmap(null);
      } catch {
        /* the globe of the previous world is already destroyed */
      }
    };
  }, [globe, grid, cells, heatmap.on, heatmap.threshold]);

  // Pre-made rover video places: only from this profile's complete scores, only while the map is on. useCellScores never returns another profile's scores.
  const marks = useMemo(() => (heatmap.on && grid && cells ? paintPremadeMarks(grid, cells, profile) : null), [heatmap.on, grid, cells, profile]);
  // A layout effect: the previous target's marks are removed before the browser paints the change of target.
  useLayoutEffect(() => {
    if (!globe) return;
    try {
      globe.setPremadeMarks(marks?.canvas ?? null);
    } catch {
      /* destroyed */
    }
    return () => {
      try {
        globe.setPremadeMarks(null);
      } catch {
        /* the globe of the previous world is already destroyed */
      }
    };
  }, [globe, marks]);

  useEffect(() => {
    try {
      globe?.setHeatmapOpacity(heatmap.opacity);
    } catch {
      /* destroyed */
    }
  }, [globe, heatmap.opacity]);

  // Numbered red marks on the best places, the same list as the bar on the right.
  const geoReady = useGeodataReady();
  const top = useMemo(() => (heatmap.on && grid && cells ? topPlaces(grid, cells) : null), [heatmap.on, grid, cells]);
  useEffect(() => {
    if (!globe || !top) return;
    try {
      globe.setHotspots(
        top.map((p) => ({ lat: p.lat, lon: p.lon, rank: p.rank, label: `${p.rank}. ${placeName(p)}, ${percent(p.score)} similar. Open this place.` })),
        (h) => openTopPlace(globe, top[h.rank - 1]),
      );
    } catch {
      /* destroyed */
    }
    return () => {
      try {
        globe.setHotspots([], () => undefined);
      } catch {
        /* the globe of the previous world is already destroyed */
      }
    };
  }, [globe, top, geoReady]);

  return null;
}

/**
 * The ranked list of the heatmap's best places, on the right while the map
 * is on and no place is open (the old app's hotspot list). A row flies the
 * globe there and opens that place's card; closing the card brings the list
 * back. Follows the chosen body and version through the scores it is given.
 */
export function TopPlacesBar({ globe }: { globe: GlobeController | null }) {
  const profileId = useStore((s) => s.atlas.profiles[s.atlas.body]);
  useCustomTargets();
  const profile = resolveProfile(profileId);
  const { grid, failed } = useGrid(true);
  const { cells, progress } = useCellScores(grid, profile, true);
  useGeodataReady();
  const top = useMemo(() => (grid && cells ? topPlaces(grid, cells) : null), [grid, cells]);

  return (
    <aside className="card panel reading top-places" aria-label="Most similar places">
      <div className="top-places-head">
        <h2 className="top-places-title">Most similar places</h2>
        <InfoTip
          label="About this list"
          text={`The ${TOP_COUNT} best areas on the heatmap, at least ${TOP_MIN_SEPARATION_DEG}° apart so they are not all in one region. Each score is for a cell about 50 km wide. Click a row to fly there.`}
        />
      </div>
      <p className="top-places-sub">
        to {profile.body === "moon" ? "the Moon" : "Mars"}, {versionLabel(profile)}
      </p>
      {failed && <p className="heatmap-note">The global grid could not be loaded.</p>}
      {!failed && !top && (
        <div className="heatmap-progress" role="status">
          <span>{grid ? `Scoring land cells… ${Math.round(progress * 100)}%` : "Loading the global grid…"}</span>
          <progress max={1} value={grid ? progress : undefined} />
        </div>
      )}
      {top && (
        <ol className="top-places-list">
          {top.map((p) => {
            const country = countryOf(p);
            return (
              <li key={p.index}>
                <button
                  type="button"
                  onClick={() => openTopPlace(globe, p)}
                  aria-label={`${p.rank}. ${placeName(p)}, ${percent(p.score)} similar. Fly there and open it.`}
                >
                  <span className="top-places-rank" aria-hidden="true">
                    {p.rank}
                  </span>
                  <span className="top-places-name">
                    <span className="top-places-place">{country ?? "Unnamed area"}</span>
                    <span className="top-places-coords">
                      {formatLat(p.lat, 2)}, {formatLon(p.lon, 2)}
                    </span>
                  </span>
                  <span className="top-places-score">
                    {percent(p.score)}
                    <i aria-hidden="true">
                      <b style={{ width: `${Math.max(6, Math.min(100, (p.score / SCALE_MAX) * 100))}%` }} />
                    </i>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </aside>
  );
}

/** The switch, sliders and legend of the similarity heatmap. */
export function HeatmapControls({ profile }: { profile: Profile }) {
  const heatmap = useStore((s) => s.heatmap);
  const onEarth = useStore((s) => s.planet) === "earth";
  const { grid, failed } = useGrid(heatmap.on);
  const { cells, progress } = useCellScores(grid, profile, heatmap.on);

  const stats = useMemo(() => (cells ? distribution(cells, heatmap.threshold) : null), [cells, heatmap.threshold]);
  const videoPlaces = useMemo(() => (cells ? premadeVideoCells(cells).length : null), [cells]);
  const ticks = [0, 0.15, 0.3, 0.45, 0.6];

  return (
    <div className="heatmap">
      <div className="with-info heatmap-switch-row">
        <button type="button" role="switch" aria-checked={heatmap.on} className="targetbar-row heatmap-switch" onClick={() => updateHeatmap({ on: !heatmap.on })}>
          <span>Show similarity heatmap</span>
          <span className="switch" />
        </button>
        <InfoTip
          label="About the heatmap"
          text="Colours every land area on Earth by how similar it is to the chosen site. With it off, click any spot on Earth and press Score this spot."
        />
      </div>

      {heatmap.on && (
        <div className="heatmap-body">
          {!onEarth && <p className="heatmap-note">The heatmap is drawn on Earth. Switch to Earth to see it.</p>}
          {failed && <p className="heatmap-note">The global grid could not be loaded, so there is no heatmap.</p>}
          {!failed && !cells && (
            <div className="heatmap-progress" role="status">
              <span>{grid ? `Scoring land cells… ${Math.round(progress * 100)}%` : "Loading the global grid…"}</span>
              <progress max={1} value={grid ? progress : undefined} />
            </div>
          )}

          <label className="heatmap-slider">
            <span>Opacity</span>
            <input type="range" min={0.2} max={1} step={0.05} value={heatmap.opacity} onChange={(e) => updateHeatmap({ opacity: Number(e.target.value) })} />
            <output>{Math.round(heatmap.opacity * 100)}%</output>
          </label>
          <label className="heatmap-slider">
            <span>
              Highlight from
              <InfoTip label="About highlight from" text="Areas scoring below this value are drawn faint. Their scores do not change." />
            </span>
            <input type="range" min={0} max={0.6} step={0.01} value={heatmap.threshold} onChange={(e) => updateHeatmap({ threshold: Number(e.target.value) })} />
            <output>{percent(heatmap.threshold)}</output>
          </label>

          <div className="heatmap-legend" aria-label="Heatmap legend">
            <div className="heatmap-legend-title">
              Similarity score to {profile.body === "moon" ? "the Moon" : "Mars"}, {versionLabel(profile)}
              <InfoTip
                label="About the heatmap colours"
                text="Brighter red means more similar. Each coloured cell covers a region about 50 km wide and gets one score for that whole region. The white dots are reference sites with finer data, so their score can differ from the cell around them."
              />
            </div>
            <div className="heatmap-ramp" style={{ background: rampCss() }} />
            <div className="heatmap-ticks">
              {ticks.map((t) => (
                <span key={t}>{t === SCALE_MAX ? `${percent(t)}+` : percent(t)}</span>
              ))}
            </div>
            <ul className="heatmap-keys">
              <li>
                <i className="is-top" /> Top {TOP_COUNT} places (list on the right)
              </li>
              {heatmap.threshold > 0 && (
                <li>
                  <i style={{ background: belowCss }} /> Below {percent(heatmap.threshold)}
                </li>
              )}
              <li>
                <i className="is-empty" /> Sea, or no data
              </li>
              <li>
                <i className="is-video" />
                <span>
                  Top {PREMADE_VIDEO_TOP_PERCENT}%: rover videos planned
                  <InfoTip
                  label="About the white outlines"
                  text={`The white outlines mark the top ${PREMADE_VIDEO_TOP_PERCENT}% of cells for ${targetName(profile)}, where pre-made rover videos are planned${videoPlaces != null ? ` (${videoPlaces.toLocaleString("en-US")} cells)` : ""}.`}
                  />
                </span>
              </li>
            </ul>
          </div>

          {stats && grid && (
            <p className="heatmap-note">
              Best {percent(stats.best)}, median {percent(stats.median)}
              <InfoTip
                label="About these numbers"
                text={`${stats.count.toLocaleString("en-US")} land cells of ${grid.header.cellDegrees}° (about ${Math.round(111.2 * grid.header.cellDegrees)} km). Median ${percent(stats.median)}, 99th percentile ${percent(stats.p99)}, best ${percent(stats.best)}.${heatmap.threshold > 0 ? ` ${stats.above.toLocaleString("en-US")} cells (${((stats.above / stats.count) * 100).toFixed(stats.above / stats.count < 0.1 ? 1 : 0)}% of land) score ${percent(heatmap.threshold)} or more.` : ""}`}
              />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

