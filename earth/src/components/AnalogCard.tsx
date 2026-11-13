import { type AtlasData, overall, percent, rank, type Site, type Target, weightsFor, withUnit } from "../analog/data";
import { formatLat, formatLon } from "../geo/coords";
import type { GlobeController } from "../globe/GlobeController";
import { travel } from "../state/navigation";
import { updateAtlas, useStore } from "../state/store";
import { Comparison, DimensionBars, SourceList } from "./Comparison";
import { BackIcon, CloseIcon } from "./icons";

interface Props {
  globe: GlobeController | null;
  data: AtlasData;
  site: Site;
  target: Target;
}

/** The full card of one curated Earth site against the selected target. */
export function AnalogCard({ globe, data, site, target }: Props) {
  const presetId = useStore((s) => s.atlas.presetId);
  const planet = useStore((s) => s.planet);
  const weights = weightsFor(target, presetId);
  const scores = data.scores[target.id][site.id];
  const place = rank(data, target, weights).findIndex((r) => r.site.id === site.id) + 1;
  const body = data.bodies[target.body];
  const onTarget = planet !== "earth";

  const sourceIds = new Set<string>([...site.refs, ...target.refs, body.radiation.ref, data.bodies.earth.radiation.ref]);
  for (const m of [...Object.values(site.m), ...Object.values(target.m), ...target.facts]) sourceIds.add(m.src);

  const flySite = () => travel(globe, "earth", { lat: site.lat, lon: site.lon, span: 70_000, title: site.name, subtitle: site.country });
  const flyTarget = () => travel(globe, target.body, { lat: target.lat, lon: target.lon, span: 160_000, title: target.name, subtitle: target.region });
  const close = () => updateAtlas({ siteId: null });

  return (
    <aside className="card panel reading" aria-label={`${site.name} compared with ${target.name}`}>
      <button type="button" className="card-close" onClick={close} aria-label="Close">
        <CloseIcon />
      </button>
      <button type="button" className="atlas-back" onClick={() => updateAtlas({ siteId: null, listOpen: true })}>
        <BackIcon /> All curated sites
      </button>

      <div className="card-kind">{site.known ? "Known analog" : "Less-studied site"}</div>
      <h2 className="card-title atlas-title">{site.name}</h2>
      <p className="card-subtitle">
        {site.country} · {formatLat(site.lat, 2)}, {formatLon(site.lon, 2)}
      </p>
      <p className="atlas-summary">{site.summary}</p>

      <div className="atlas-match">
        <span className="atlas-match-score">{percent(overall(scores, weights))}</span>
        <span>
          match to <strong>{target.name}</strong>
          <span className="atlas-site-detail">
            ranked {place} of {data.sites.length} for this mission goal
          </span>
        </span>
      </div>

      <Comparison data={data} target={target} scores={scores} label={site.name.split(",")[0]} pressure={site.m.pressure.v} />

      <div className="atlas-actions">
        <button type="button" className={`card-action${onTarget ? " is-primary" : ""}`} onClick={flySite}>
          Fly to Earth analog
        </button>
        <button type="button" className={`card-action${onTarget ? "" : " is-primary"}`} onClick={flyTarget}>
          Fly to target
        </button>
      </div>

      <section className="atlas-section">
        <h3>How it helps exploration</h3>
        <p>{site.use}</p>
      </section>

      <section className="atlas-section">
        <h3>Every dimension</h3>
        <DimensionBars data={data} scores={scores} />
      </section>

      {(target.notes.length > 0 || target.facts.length > 0) && (
        <section className="atlas-section">
          <h3>About {target.name}</h3>
          <ul>
            {target.facts.map((f) => (
              <li key={f.label}>
                {f.label}: {withUnit(f.v, f.unit)}
              </li>
            ))}
            {target.notes.map((n) => (
              <li key={n.text}>{n.text}</li>
            ))}
          </ul>
        </section>
      )}

      <SourceList sources={[...sourceIds].filter((id) => data.sources[id]).map((id) => data.sources[id])} />
    </aside>
  );
}
