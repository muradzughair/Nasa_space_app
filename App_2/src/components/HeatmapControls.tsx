import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { percent } from "../analog/data";
import type { Grid } from "../analog/grid";
import { resolveProfile, useCustomTargets, versionLabel } from "../analog/custom";
import { paintPremadeMarks, PREMADE_VIDEO_TOP_PERCENT, premadeVideoCells, targetName } from "../analog/premade";
import { belowCss, cachedCellScores, type CellScores, computeCellScores, distribution, paintHeatmap, profileKey, rampCss, SCALE_MAX } from "../analog/heatmap";
import type { Profile } from "../analog/scoring";
import type { GlobeController } from "../globe/GlobeController";
import { store, updateHeatmap, useStore } from "../state/store";
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

  return null;
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
                text="Each coloured cell covers a region about 50 km wide and gets one score for that whole region. The white dots are reference sites with finer data, so their score can differ from the cell around them."
              />
            </div>
            <div className="heatmap-ramp" style={{ background: rampCss() }} />
            <div className="heatmap-ticks">
              {ticks.map((t) => (
                <span key={t}>{t === SCALE_MAX ? `${percent(t)}+` : percent(t)}</span>
              ))}
            </div>
            <ul className="heatmap-keys">
              {heatmap.threshold > 0 && (
                <li>
                  <i style={{ background: belowCss }} /> Below {percent(heatmap.threshold)} (drawn fainter)
                </li>
              )}
              <li>
                <i className="is-empty" /> No colour: sea, or no data
              </li>
              <li>
                <i className="is-video" /> White outline: top {PREMADE_VIDEO_TOP_PERCENT}% for {targetName(profile)}, rover videos planned
                {videoPlaces != null ? ` (${videoPlaces.toLocaleString("en-US")} cells)` : ""}
              </li>
            </ul>
          </div>

          {stats && grid && (
            <p className="heatmap-note">
              {stats.count.toLocaleString("en-US")} land cells of {grid.header.cellDegrees}° (about {Math.round(111.2 * grid.header.cellDegrees)} km). Median{" "}
              {percent(stats.median)}, 99th percentile {percent(stats.p99)}, best {percent(stats.best)}.{" "}
              {heatmap.threshold > 0 && (
                <>
                  {stats.above.toLocaleString("en-US")} cells ({((stats.above / stats.count) * 100).toFixed(stats.above / stats.count < 0.1 ? 1 : 0)}% of land) score {percent(heatmap.threshold)} or more.{" "}
                </>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

