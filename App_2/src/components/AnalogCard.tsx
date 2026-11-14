import { useMemo } from "react";
import type { AtlasData, Site } from "../analog/data";
import { type Grid, siteMeasures } from "../analog/grid";
import { cellSummary } from "../analog/heatmap";
import { premadeVideoPlan } from "../analog/premade";
import { customTarget, evaluateTarget, resolveProfile, useCustomTargets, versionLabel } from "../analog/custom";
import { similarity } from "../analog/scoring";
import { formatLat, formatLon } from "../geo/coords";
import type { GlobeController } from "../globe/GlobeController";
import { travel } from "../state/navigation";
import { updateAtlas, useStore } from "../state/store";
import { TargetDetails } from "./CustomTarget";
import { Comparison, SourceList, where } from "./Comparison";
import { BackIcon, CloseIcon } from "./icons";
import { useCellScores } from "./HeatmapControls";
import { BodyScores, featureNote, sourcesOf, useGrid } from "./InfoCard";
import { RoverVideoSection, SimulateRover } from "./SimulateRover";
import { HeatmapCellNote, RequestVerification } from "./verify/RequestAction";
import { flyToProfile } from "./TargetBar";

interface Props {
  globe: GlobeController | null;
  data: AtlasData;
  site: Site;
}

/** The full card of one curated Earth site against the chosen version of Mars or the Moon. */
export function AnalogCard({ globe, data, site }: Props) {
  const { grid, failed } = useGrid(true);

  return (
    <aside className="card panel reading" aria-label={site.name}>
      <button type="button" className="card-close" onClick={() => updateAtlas({ siteId: null })} aria-label="Close">
        <CloseIcon />
      </button>
      <button type="button" className="atlas-back" onClick={() => updateAtlas({ siteId: null, listOpen: true })}>
        <BackIcon /> All reference sites
      </button>

      <div className="card-kind">{site.known ? "Known analog" : "Less-studied site"}</div>
      <h2 className="card-title atlas-title">{site.name}</h2>
      <p className="card-subtitle">
        {site.country} · {formatLat(site.lat, 2)}, {formatLon(site.lon, 2)}
      </p>
      <p className="atlas-summary">{site.summary}</p>

      {grid ? (
        <SiteScores globe={globe} data={data} site={site} grid={grid} />
      ) : (
        <p className="cell-note">{failed ? "The global grid could not be loaded." : "Loading the global grid…"}</p>
      )}
    </aside>
  );
}

function SiteScores({ globe, data, site, grid }: Props & { grid: Grid }) {
  const atlas = useStore((s) => s.atlas);
  const planet = useStore((s) => s.planet);
  useCustomTargets();
  const profile = resolveProfile(atlas.profiles[atlas.body]);
  const custom = customTarget(profile.id);
  const { measures, features } = useMemo(() => siteMeasures(grid, site), [grid, site]);
  const evaluation = useMemo(() => evaluateTarget(measures, profile), [measures, profile]);
  const place = useMemo(
    () => 1 + data.sites.filter((other) => other.id !== site.id && similarity(siteMeasures(grid, other).measures, profile) > evaluation.overall).length,
    [data, grid, site, profile, evaluation],
  );
  const onTarget = planet !== "earth";
  const heatmapOn = useStore((s) => s.heatmap.on);
  const { cells } = useCellScores(grid, profile, heatmapOn);
  const summary = useMemo(() => cellSummary(grid, profile, cells, site.lat, site.lon), [grid, profile, cells, site]);
  // The site's cell is a place for a pre-made rover video: only from the heatmap's complete scores for this profile.
  const plan = heatmapOn ? premadeVideoPlan(summary, profile) : null;
  const siteDatasets = [...new Set(Object.values(site.m).map((m) => m.src))].filter((id) => data.sources[id]?.kind === "dataset");
  const gridDatasets = Object.entries(grid.header.sources).filter(([, x]) => /POWER|GLiM|Impact|Volcanism/.test(x.label));
  const found = featureNote(features);

  const sourceIds = new Set<string>(site.refs);
  for (const m of Object.values(site.m)) sourceIds.add(m.src);
  const flySite = () => travel(globe, "earth", { lat: site.lat, lon: site.lon, span: 70_000, title: site.name, subtitle: site.country });

  return (
    <>
      <BodyScores measures={measures} atlas={atlas} />
      <p className="cell-scale">
        Ranked {place} of {data.sites.length} reference sites for {where(profile)}, {versionLabel(profile)}.
      </p>

      {heatmapOn && summary && <HeatmapCellNote summary={summary} profile={profile} here={{ label: "This reference site", score: evaluation.overall }} kind="site" />}
      {plan && <RoverVideoSection plan={plan} />}
      <RequestVerification
        input={{
          site: { name: site.name, lat: site.lat, lon: site.lon, kind: "curated-site", siteId: site.id, country: site.country },
          profile,
          evaluation,
          basis: "curated-site",
          customTarget: custom,
          heatmapCell: summary,
          premadeVideo: plan,
          datasets: [
            ...siteDatasets.map((id) => ({ id, source: data.sources[id], fromSite: true })),
            ...gridDatasets.filter(([id]) => !siteDatasets.includes(id)).map(([id, source]) => ({ id, source })),
          ],
          sources: [...site.refs.filter((id) => data.sources[id]).map((id) => data.sources[id]), ...sourcesOf(data, profile)],
          gridGenerated: grid.header.generated,
          cellDegrees: grid.header.cellDegrees,
          modelledTemperature: false,
        }}
      />

      {custom && <TargetDetails target={custom} />}

      <Comparison data={data} profile={profile} evaluation={evaluation} label={site.name.split(",")[0]} pressure={measures.pressure} />

      {planet === "earth" && <SimulateRover globe={globe} place={{ name: site.name, lat: site.lat, lon: site.lon, kind: "curated-site" }} profile={profile} />}

      <div className="atlas-actions">
        <button type="button" className={`card-action${onTarget ? " is-primary" : ""}`} onClick={flySite}>
          Fly to this site
        </button>
        <button type="button" className={`card-action${onTarget ? "" : " is-primary"}`} onClick={() => flyToProfile(globe, profile)}>
          Fly to {profile.place.name}
        </button>
      </div>

      <section className="atlas-section">
        <h3>How it helps exploration</h3>
        <p>{site.use}</p>
      </section>

      <section className="atlas-section">
        <h3>About these numbers</h3>
        <ul className="cell-caveats">
          <li>
            Terrain, temperature, rainfall and vegetation are measured at the site; rock and soil materials are coded from the cited papers. Soil wetness, albedo, UV, cloud and
            the day-to-night swing come from the 50 km grid cell around it
            {measures.albedo == null ? ", which does not exist for this island, so they are left out" : ""}.
          </li>
          {found && <li>{found}</li>}
        </ul>
      </section>

      <SourceList
        sources={[
          ...[...sourceIds].filter((id) => data.sources[id]).map((id) => data.sources[id]),
          ...Object.values(grid.header.sources).filter((x) => /POWER|GLiM|Impact|Volcanism/.test(x.label)),
          ...sourcesOf(data, profile),
        ]}
      />
    </>
  );
}
