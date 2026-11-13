import { type AtlasData, type DimId, type DimScore, percent, type Target, withUnit } from "../analog/data";
import { Radar } from "../analog/Radar";

/** A dimension at or above this similarity is listed as a strength; below WEAK, as a breakdown. */
const STRONG = 0.66;
const WEAK = 0.5;

export const where = (target: Target) => (target.body === "moon" ? "the Moon" : "Mars");

/** "median slope 2.1° vs 1.4°; relief 240 m vs 310 m": the numbers behind one dimension, Earth first. */
function evidence(id: DimId, score: DimScore): string {
  if (id === "geology") {
    const shared = score.shared?.length ? `shares ${score.shared.join(", ")}` : "no shared materials";
    return score.missing?.length ? `${shared}; lacks ${score.missing.join(", ")}` : shared;
  }
  return score.parts.map((p) => `${p.label.toLowerCase()} ${withUnit(p.earth, p.unit)} vs ${withUnit(p.target, p.unit)}`).join("; ");
}

interface Props {
  data: AtlasData;
  target: Target;
  scores: Record<DimId, DimScore>;
  /** Name of the Earth place in the chart key. */
  label: string;
  /** Surface air pressure at the Earth place, in pascals. */
  pressure: number;
}

/**
 * How one place on Earth compares with one target: the radar chart, what
 * matches with the numbers behind it, and where the analogy breaks down.
 * Gravity, atmosphere, radiation and day length are always listed: no place
 * on Earth can match them, so they are never scored.
 */
export function Comparison({ data, target, scores, label, pressure }: Props) {
  const body = data.bodies[target.body];
  const earth = data.bodies.earth;
  const scored = data.dimensions.filter((d) => scores[d.id].score != null);
  const strong = scored.filter((d) => scores[d.id].score! >= STRONG);
  const weak = scored.filter((d) => scores[d.id].score! < WEAK);
  const missing = data.dimensions.filter((d) => scores[d.id].score == null);
  const kPa = Math.round(pressure / 1000);
  const air =
    target.body === "moon"
      ? `${kPa} kPa of air here; none there (hard vacuum).`
      : `${kPa} kPa of air here; ${(target.m.pressure.v / 1000).toFixed(2)} kPa of CO₂ there, ${Math.round(pressure / target.m.pressure.v)} times thinner.`;

  return (
    <>
      <Radar dimensions={data.dimensions} scores={scores} />
      <p className="atlas-legend">
        <i className="atlas-key atlas-key-site" /> {label} <i className="atlas-key atlas-key-target" /> {target.name} (outer ring)
      </p>

      <section className="atlas-section">
        <h3>What matches</h3>
        {strong.length ? (
          <ul>
            {strong.map((d) => (
              <li key={d.id}>
                <strong>
                  {d.label} {percent(scores[d.id].score)}
                </strong>{" "}
                {evidence(d.id, scores[d.id])}
              </li>
            ))}
          </ul>
        ) : (
          <p>No dimension reaches {percent(STRONG)} similarity. Treat this place as a partial analog at best.</p>
        )}
      </section>

      <section className="atlas-section atlas-breaks">
        <h3>Where it breaks down</h3>
        <ul>
          {weak.map((d) => (
            <li key={d.id}>
              <strong>
                {d.label} {percent(scores[d.id].score)}
              </strong>{" "}
              {evidence(d.id, scores[d.id])}
            </li>
          ))}
          <li>
            <strong>Gravity</strong> {earth.gravity} m/s² here, {body.gravity} on {where(target)}: loads, traction and dust behave as if{" "}
            {(earth.gravity / body.gravity).toFixed(1)} times heavier.
          </li>
          <li>
            <strong>Atmosphere</strong> {air}
          </li>
          <li>
            <strong>Radiation</strong> about {earth.radiation.value} mSv/day at the surface of Earth; {body.radiation.value} mSv/day on {where(target)}, roughly{" "}
            {Math.round(body.radiation.value / earth.radiation.value)} times more.
          </li>
          <li>
            <strong>Day length</strong> one day on {where(target)} lasts {body.day}.
          </li>
          {missing.map((d) => (
            <li key={d.id}>
              <strong>{d.label} not compared</strong> no data for this place, so it is left out of the score{d.id === "geology" && " (see the note under Every dimension)"}.
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/** One bar per dimension, with the method as a tooltip. */
export function DimensionBars({ data, scores }: { data: AtlasData; scores: Record<DimId, DimScore> }) {
  return (
    <dl className="atlas-dims">
      {data.dimensions.map((d) => (
        <div key={d.id} title={d.how}>
          <dt>{d.label}</dt>
          <dd>
            <span className="atlas-bar" aria-hidden="true">
              <i style={{ width: percent(scores[d.id].score ?? 0) }} />
            </span>
            {percent(scores[d.id].score)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function SourceList({ sources }: { sources: { kind: string; label: string }[] }) {
  // The place and the target can cite the same source; list it once.
  const unique = [...new Map(sources.map((x) => [x.label, x])).values()];
  return (
    <details className="atlas-sources">
      <summary>Sources for these numbers</summary>
      <ul>
        {unique.map((s) => (
          <li key={s.label}>
            <span className="atlas-source-kind">{s.kind}</span> {s.label}
          </li>
        ))}
      </ul>
    </details>
  );
}
