import { useEffect, useMemo, useState } from "react";
import { type AtlasData, overall, percent, type Site, type Source, type Target, useAtlas, weightsFor } from "../analog/data";
import { type Cell, cellAt, compareCell, type Grid, loadGrid, nearbySite } from "../analog/grid";
import { formatDistance, formatLat, formatLon, formatPopulation } from "../geo/coords";
import type { GlobeController } from "../globe/GlobeController";
import { travel } from "../state/navigation";
import { type Selection, type SelectionKind, updateAtlas, useStore } from "../state/store";
import { AnalogCard } from "./AnalogCard";
import { Comparison, DimensionBars, SourceList } from "./Comparison";
import { CloseIcon } from "./icons";

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
 * open, otherwise the place that was clicked. On Earth a clicked place is
 * compared with all four targets from the global grid.
 */
export function InfoCard({ globe }: { globe: GlobeController | null }) {
  const selection = useStore((s) => s.selection);
  const planet = useStore((s) => s.planet);
  const atlas = useStore((s) => s.atlas);
  const { data } = useAtlas();
  const onEarth = planet === "earth";
  const { grid, failed } = useGrid(onEarth && !!selection && !selection.water);

  const site = data?.sites.find((s) => s.id === atlas.siteId) ?? null;
  const target = data?.targets.find((t) => t.id === atlas.targetId) ?? data?.targets[0] ?? null;
  if (data && site && target) return <AnalogCard globe={globe} data={data} site={site} target={target} />;
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
        ) : !data || (!grid && !failed) ? (
          <p className="cell-note">Loading the global comparison grid…</p>
        ) : !grid ? (
          <p className="cell-note">The global comparison grid could not be loaded.</p>
        ) : (
          <CellComparison key={selection.id} globe={globe} data={data} grid={grid} selection={selection} presetId={atlas.presetId} />
        ))}

      <button type="button" className="card-action" onClick={() => globe?.zoomToSelection()}>
        Zoom closer
      </button>
    </aside>
  );
}

interface CellProps {
  globe: GlobeController | null;
  data: AtlasData;
  grid: Grid;
  selection: Selection;
  presetId: string;
}

/** The clicked place against all four targets, with the best match opened. */
function CellComparison({ globe, data, grid, selection, presetId }: CellProps) {
  const cell = useMemo(() => cellAt(grid, selection.lat, selection.lon), [grid, selection.lat, selection.lon]);
  const rows = useMemo(
    () =>
      cell
        ? data.targets.map((target) => {
            const scores = compareCell(data, cell, target);
            return { target, scores, score: overall(scores, weightsFor(target, presetId)) };
          })
        : [],
    [cell, data, grid, presetId],
  );
  const best = rows.reduce<(typeof rows)[number] | null>((a, b) => (!a || b.score > a.score ? b : a), null);
  const [shownId, setShownId] = useState<string | null>(null);
  const near = useMemo(() => nearbySite(data, selection.lat, selection.lon), [data, selection.lat, selection.lon]);

  if (!cell || !best) {
    return (
      <>
        <p className="cell-note">No land cell in the grid here. Small islands and some coasts are not covered, so there is no comparison.</p>
        {near && <NearbyLink site={near.site} distance={near.distance} />}
      </>
    );
  }
  const shown = rows.find((r) => r.target.id === shownId) ?? best;
  const { header } = grid;
  const width = Math.round(111.2 * header.cellDegrees * Math.cos((cell.lat * Math.PI) / 180));
  const sources: Source[] = [
    ...cell.sources.filter((id) => header.sources[id]).map((id) => header.sources[id]),
    ...sourcesOf(data, shown.target),
  ];
  const flyTarget = (t: Target) => travel(globe, t.body, { lat: t.lat, lon: t.lon, span: 160_000, title: t.name, subtitle: t.region });

  return (
    <>
      <section className="atlas-section cell-targets">
        <h3 id="cell-targets-heading">Similarity to each target</h3>
        <div role="radiogroup" aria-labelledby="cell-targets-heading">
          {rows.map((r) => (
            <button key={r.target.id} type="button" role="radio" aria-checked={r === shown} onClick={() => setShownId(r.target.id)}>
              <span className="cell-target-name">
                <span className="atlas-target-body">{r.target.body === "moon" ? "Moon" : "Mars"}</span> {r.target.name}
                {r === best && <span className="cell-best">best match</span>}
              </span>
              <span className="atlas-bar" aria-hidden="true">
                <i style={{ width: percent(r.score) }} />
              </span>
              <span className="atlas-score">{percent(r.score)}</span>
            </button>
          ))}
        </div>
        <p className="cell-scale">
          Values are for the grid cell around this point: {Math.round(111.2 * header.cellDegrees)} km north to south, {width} km east to west. Climate values are
          averages over about 50 km; terrain is a 32 km window at the cell centre, not the exact spot clicked.
        </p>
      </section>

      <Comparison data={data} target={shown.target} scores={shown.scores} label="This cell" pressure={cell.pressure} />

      <section className="atlas-section">
        <h3>Every dimension</h3>
        <DimensionBars data={data} scores={shown.scores} />
        <ul className="cell-caveats">
          <li>{geologyNote(data, cell, shown.target, header.vocabulary)}</li>
          <li>Ground ice is not mapped globally, so water and ice uses dryness and water vapour only.</li>
          <li>
            {cell.modelledTemperature
              ? "MODIS has no land surface temperature here; thermal uses MERRA-2 skin temperature from NASA POWER."
              : `Peak temperature is the warmest monthly daytime mean of ${header.year}, which runs lower than the 8-day peak used for curated sites.`}
          </li>
          {cell.measures.ndvi == null && <li>No vegetation data here, so sterility is left out of the score.</li>}
        </ul>
      </section>

      {near && <NearbyLink site={near.site} distance={near.distance} />}
      <button type="button" className="card-action" onClick={() => flyTarget(shown.target)}>
        Fly to {shown.target.name}
      </button>

      <SourceList sources={sources} />
    </>
  );
}

/** A curated site close to the clicked point has a full card of its own. */
function NearbyLink({ site, distance }: { site: Site; distance: number }) {
  return (
    <button type="button" className="card-action is-primary" onClick={() => updateAtlas({ siteId: site.id })}>
      Full analog card: {site.name.split(",")[0]} ({Math.round(distance / 1000)} km away)
    </button>
  );
}

/**
 * Geology is not scored for a grid cell: the only global source is a rock-type
 * map, which can speak to five of the seventeen terms. What it does say is
 * reported in words.
 */
function geologyNote(data: AtlasData, cell: Cell, target: Target, vocabulary: string[]): string {
  const unscored = "Geology is not scored for grid cells: minerals and landforms are not mapped globally.";
  if (!cell.lithology) return `${unscored} The GLiM lithology map has no rock type here.`;
  const rock = `GLiM maps the rock type here as ${cell.lithology.label}`;
  const tags = cell.lithology.tags;
  if (!tags) return `${unscored} ${rock}, which says nothing about bedrock.`;
  const shared = vocabulary.filter((k) => tags[k] && target.tags[k]).map((k) => data.tags[k]);
  return `${unscored} ${rock}${shared.length ? `, which shares ${shared.join(" and ")} with ${target.name}` : `, none of the materials it could share with ${target.name}`}.`;
}

function sourcesOf(data: AtlasData, target: Target): Source[] {
  const ids = new Set<string>([...target.refs, data.bodies[target.body].radiation.ref, data.bodies.earth.radiation.ref]);
  for (const m of Object.values(target.m)) ids.add(m.src);
  return [...ids].filter((id) => data.sources[id]).map((id) => data.sources[id]);
}
