import { useEffect, useMemo, useState } from "react";
import { type AtlasData, percent, type Site, type Source, useAtlas } from "../analog/data";
import { customTarget, evaluateTarget, profilesFor, resolveProfile, useCustomTargets } from "../analog/custom";
import { cellAt, type Features, type Grid, loadGrid, nearbySite } from "../analog/grid";
import { cellSummary } from "../analog/heatmap";
import { premadeVideoPlan } from "../analog/premade";
import { type Body, type EarthMeasures, type Profile, similarity } from "../analog/scoring";
import { formatDistance, formatLat, formatLon, formatPopulation } from "../geo/coords";
import type { GlobeController } from "../globe/GlobeController";
import { type AtlasState, type Selection, type SelectionKind, updateAtlas, useStore } from "../state/store";
import { AnalogCard } from "./AnalogCard";
import { Comparison, SourceList } from "./Comparison";
import { MoonTargetAction, TargetDetails } from "./CustomTarget";
import { useCellScores } from "./HeatmapControls";
import { CloseIcon } from "./icons";
import { flyToProfile } from "./TargetBar";
import { RoverVideoSection, SimulateRover } from "./SimulateRover";
import { HeatmapCellNote, RequestVerification } from "./verify/RequestAction";

const KIND_LABEL: Record<SelectionKind, string> = {
  country: "Country",
  place: "Place",
  water: "Water",
  point: "Location",
};

/** The grid, loaded the first time it is wanted. */
export function useGrid(wanted: boolean): { grid: Grid | null; failed: boolean } {
  const [grid, setGrid] = useState<Grid | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!wanted || grid) return;
    let live = true;
    setFailed(false);
    loadGrid().then(
      (g) => live && setGrid(g),
      () => live && setFailed(true),
    );
    return () => {
      live = false;
    };
  }, [wanted, grid]);
  return { grid, failed };
}

/**
 * The reading surface, on the right: a curated site's full card when one is
 * open, otherwise the place that was clicked. On Earth the card offers a
 * button; pressing it scores that one place against Mars and the Moon. While
 * the heatmap is on, the breakdown opens without the button.
 */
export function InfoCard({ globe }: { globe: GlobeController | null }) {
  const selection = useStore((s) => s.selection);
  const planet = useStore((s) => s.planet);
  const atlas = useStore((s) => s.atlas);
  const { data } = useAtlas();
  const onEarth = planet === "earth";
  // Nothing is scored until the button is pressed, and only the selected spot.
  const [scoredId, setScoredId] = useState<number | null>(null);
  // With the heatmap on, every cell has been scored already, so a click opens the breakdown directly.
  const heatmapOn = useStore((s) => s.heatmap.on);
  const scored = !!selection && (scoredId === selection.id || heatmapOn);
  const { grid, failed } = useGrid(onEarth && scored);
  useCustomTargets();
  const chosen = resolveProfile(atlas.profiles[atlas.body]);
  // The headline score of this spot (the same number the card shows), handed to the rover simulation. None until the spot is scored.
  const spotScore = useMemo(() => {
    if (!onEarth || !scored || !grid || !selection || selection.water) return null;
    const cell = cellAt(grid, selection.lat, selection.lon);
    return cell ? similarity(cell.measures, chosen) : null;
  }, [onEarth, scored, grid, selection, chosen]);

  const site = data?.sites.find((s) => s.id === atlas.siteId) ?? null;
  if (data && site) return <AnalogCard globe={globe} data={data} site={site} />;
  if (!selection) return null;

  return (
    <aside className="card panel reading" key={selection.id} aria-live="polite" aria-label="Selected place">
      <button type="button" className="card-close" onClick={() => globe?.clearSelection()} aria-label="Close">
        <CloseIcon />
      </button>
      <div className="card-kind">
        {KIND_LABEL[selection.kind]}
        {selection.resolving && <span className="card-resolving" />}
      </div>
      <h2 className="card-title">{selection.title}</h2>
      {selection.subtitle && <p className="card-subtitle">{selection.subtitle}</p>}

      <dl className="card-facts">
        <div>
          <dt>Coordinates</dt>
          <dd>
            {formatLat(selection.lat)}, {formatLon(selection.lon)}
          </dd>
        </div>
        {selection.elevation != null && (
          <div>
            <dt>Elevation</dt>
            <dd>{formatDistance(selection.elevation)}</dd>
          </div>
        )}
        {selection.population != null && (
          <div>
            <dt>Population</dt>
            <dd>{formatPopulation(selection.population)}</dd>
          </div>
        )}
      </dl>

      {onEarth &&
        (selection.water ? (
          <p className="cell-note">Open water: there is no ground here to compare with the Moon or Mars.</p>
        ) : !scored ? (
          <button type="button" className="card-action is-primary score-button" onClick={() => setScoredId(selection.id)}>
            Score this spot
          </button>
        ) : !data || (!grid && !failed) ? (
          <p className="cell-note">Scoring…</p>
        ) : !grid ? (
          <p className="cell-note">The global grid could not be loaded.</p>
        ) : (
          <CellComparison key={selection.id} globe={globe} data={data} grid={grid} selection={selection} atlas={atlas} />
        ))}

      {onEarth && (
        <SimulateRover
          globe={globe}
          place={{ name: selection.title, lat: selection.lat, lon: selection.lon, kind: "grid-point" }}
          profile={chosen}
          water={selection.water}
          similarity={spotScore}
        />
      )}

      {planet === "moon" && <MoonTargetAction key={selection.id} selection={selection} />}

      <button type="button" className="card-action" onClick={() => globe?.zoomToSelection()}>
        Zoom closer
      </button>
    </aside>
  );
}

const BODIES: Body[] = ["mars", "moon"];
const bodyName = (body: Body) => (body === "moon" ? "the Moon" : "Mars");

/**
 * The two headline numbers (how similar this place is to Mars and to the
 * Moon, for the chosen version of each) and, for the body being read, every
 * version of it.
 */
export function BodyScores({ measures, atlas }: { measures: EarthMeasures; atlas: AtlasState }) {
  const customs = useCustomTargets();
  const rows = useMemo(() => profilesFor(atlas.body).map((profile) => ({ profile, score: similarity(measures, profile) })), [measures, atlas.body, customs]);
  return (
    <section className="atlas-section cell-targets">
      <div className="body-scores" role="radiogroup" aria-label="Similarity to Mars and to the Moon">
        {BODIES.map((body) => {
          const profile = resolveProfile(atlas.profiles[body]);
          return (
            <button key={body} type="button" role="radio" aria-checked={body === atlas.body} onClick={() => updateAtlas({ body })}>
              <span className="body-score">{percent(similarity(measures, profile))}</span>
              <span className="body-name">like {bodyName(body)}</span>
              <span className="atlas-site-detail">{profile.name}</span>
            </button>
          );
        })}
      </div>
      <h3 id="cell-targets-heading">Versions of {bodyName(atlas.body)}</h3>
      <div role="radiogroup" aria-labelledby="cell-targets-heading">
        {rows.map((r) => (
          <button
            key={r.profile.id}
            type="button"
            role="radio"
            aria-checked={r.profile.id === atlas.profiles[atlas.body]}
            title={r.profile.summary}
            onClick={() => updateAtlas({ profiles: { ...atlas.profiles, [atlas.body]: r.profile.id } })}
          >
            <span className="cell-target-name">{r.profile.name}</span>
            <span className="atlas-bar" aria-hidden="true">
              <i style={{ width: percent(r.score) }} />
            </span>
            <span className="atlas-score">{percent(r.score)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** What was found near the point, in words. */
export function featureNote(features: Features): string | null {
  const parts: string[] = [];
  if (features.impactName) parts.push(`${features.impactName} (impact structure) ${features.impact! < 0.5 ? "is here" : `is ${Math.round(features.impact!)} km from its rim`}`);
  if (features.volcanoName) parts.push(`${features.volcanoName} (Holocene volcano) is ${Math.round(features.volcano!)} km away`);
  return parts.length ? `${parts.join("; ")}.` : null;
}

interface CellProps {
  globe: GlobeController | null;
  data: AtlasData;
  grid: Grid;
  selection: Selection;
  atlas: AtlasState;
}

/** The clicked place against Mars and the Moon, with the chosen version opened. */
function CellComparison({ globe, data, grid, selection, atlas }: CellProps) {
  const cell = useMemo(() => cellAt(grid, selection.lat, selection.lon), [grid, selection.lat, selection.lon]);
  useCustomTargets();
  const profile = resolveProfile(atlas.profiles[atlas.body]);
  const custom = customTarget(profile.id);
  const evaluation = useMemo(() => (cell ? evaluateTarget(cell.measures, profile) : null), [cell, profile]);
  const near = useMemo(() => nearbySite(data, selection.lat, selection.lon), [data, selection.lat, selection.lon]);
  const heatmapOn = useStore((s) => s.heatmap.on);
  const { cells } = useCellScores(grid, profile, heatmapOn);
  const summary = useMemo(() => cellSummary(grid, profile, cells, selection.lat, selection.lon), [grid, profile, cells, selection.lat, selection.lon]);
  // A place for a pre-made rover video: only from the heatmap's complete scores for this profile.
  const plan = heatmapOn ? premadeVideoPlan(summary, profile) : null;

  // Outline the grid cell on the globe, so it is plain that the numbers are for a region, not a point.
  useEffect(() => {
    if (!globe || !summary || !heatmapOn) return;
    const half = summary.cellDegrees / 2;
    globe.setVerifyOverlay({ cell: { south: summary.centreLat - half, north: summary.centreLat + half, west: summary.centreLon - half, east: summary.centreLon + half } });
    return () => {
      try {
        globe.setVerifyOverlay({});
      } catch {
        /* globe destroyed */
      }
    };
  }, [globe, heatmapOn, summary?.centreLat, summary?.centreLon, summary?.cellDegrees]);

  if (!cell || !evaluation) {
    return (
      <>
        <p className="cell-note">No land cell in the grid here. Small islands and some coasts are not covered, so there is no score.</p>
        {near && <NearbyLink site={near.site} distance={near.distance} />}
      </>
    );
  }
  const { header } = grid;
  const width = Math.round(111.2 * header.cellDegrees * Math.cos((cell.lat * Math.PI) / 180));
  const sources: Source[] = [...cell.sources.filter((id) => header.sources[id]).map((id) => header.sources[id]), ...sourcesOf(data, profile)];
  const found = featureNote(cell.features);

  return (
    <>
      <BodyScores measures={cell.measures} atlas={atlas} />

      {heatmapOn && summary && <HeatmapCellNote summary={summary} profile={profile} here={{ label: "This point", score: evaluation.overall }} kind="point" />}
      {plan && <RoverVideoSection plan={plan} />}
      <RequestVerification
        input={{
          site: { name: selection.title, lat: selection.lat, lon: selection.lon, kind: "grid-point", country: selection.subtitle || undefined },
          profile,
          evaluation,
          basis: "grid-point",
          customTarget: custom,
          heatmapCell: summary,
          premadeVideo: plan,
          datasets: cell.sources.filter((id) => header.sources[id]).map((id) => ({ id, source: header.sources[id] })),
          sources: sourcesOf(data, profile),
          gridGenerated: header.generated,
          cellDegrees: header.cellDegrees,
          modelledTemperature: cell.modelledTemperature,
        }}
      />

      {custom && <TargetDetails target={custom} />}

      <Comparison data={data} profile={profile} evaluation={evaluation} label="This spot" pressure={cell.measures.pressure} />

      <section className="atlas-section">
        <h3>About these numbers</h3>
        <ul className="cell-caveats">
          <li>
            Values are for the grid cell around this point: {Math.round(111.2 * header.cellDegrees)} km north to south, {width} km east to west. Climate and rock type are averages
            over about 50 km; terrain is a 32 km window at the cell centre. Impact structures and volcanoes are measured from the point itself.
          </li>
          {found && <li>{found}</li>}
          {cell.modelledTemperature && (
            <li>MODIS has no land surface temperature here; temperature is MERRA-2 skin temperature from NASA POWER and the day-to-night swing is left out.</li>
          )}
          <li>Soil organic carbon, soil pH, surface colour and spectrometer mineral maps are not in the grid; their groups rest on the parts listed above.</li>
        </ul>
      </section>

      {near && <NearbyLink site={near.site} distance={near.distance} />}
      <button type="button" className="card-action" onClick={() => flyToProfile(globe, profile)}>
        Fly to {profile.place.name} on {bodyName(profile.body)}
      </button>

      <SourceList sources={sources} />
    </>
  );
}

/** A curated site close to the clicked point has a full card of its own. */
function NearbyLink({ site, distance }: { site: Site; distance: number }) {
  return (
    <button type="button" className="card-action is-primary" onClick={() => updateAtlas({ siteId: site.id })}>
      Reference site: {site.name.split(",")[0]} ({Math.round(distance / 1000)} km away)
    </button>
  );
}

/** Sources behind a profile: its terrain statistics and the facts about its body. */
export function sourcesOf(data: AtlasData, profile: Profile): Source[] {
  const ids = [profile.terrain.src, data.bodies[profile.body].radiation.ref, data.bodies.earth.radiation.ref];
  return ids.filter((id) => data.sources[id]).map((id) => data.sources[id]);
}
