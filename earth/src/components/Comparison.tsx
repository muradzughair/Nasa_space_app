import { type AtlasData, type Evaluation, type GroupScore, percent, type Profile, type Quality } from "../analog/data";
import { Radar } from "../analog/Radar";
import { groupsOf } from "../analog/scoring";

/** A group at or above this similarity is listed as a strength; below WEAK, as a breakdown. */
const STRONG = 0.66;
const WEAK = 0.4;
/** Mean surface pressure on Mars, in pascals. */
const MARS_PRESSURE = 610;

export const where = (profile: Profile) => (profile.body === "moon" ? "the Moon" : "Mars");

const QUALITY: Record<Quality, string> = { measured: "measured", map: "mapped", literature: "published", proxy: "estimated" };

/** "annual precipitation 8 mm; column water vapour 9.6 kg/m²": the Earth values behind one group. */
const evidence = (score: GroupScore) => score.parts.map((p) => `${p.label.toLowerCase()}: ${p.earth}`).join("; ");

interface Props {
  data: AtlasData;
  profile: Profile;
  evaluation: Evaluation;
  /** Name of the Earth place in the chart key. */
  label: string;
  /** Surface air pressure at the Earth place, in pascals, where known. */
  pressure: number | null;
}

/**
 * How one place on Earth compares with one version of Mars or the Moon: the
 * radar chart, what matches with the numbers behind it, and where the analogy
 * breaks down. Gravity, atmosphere, radiation, magnetic field and day length
 * are always listed: no place on Earth is closer to them than any other, so
 * they are never scored.
 */
export function Comparison({ data, profile, evaluation, label, pressure }: Props) {
  const body = data.bodies[profile.body];
  const earth = data.bodies.earth;
  const groups = groupsOf(profile);
  const scores = evaluation.groups;
  const scored = groups.filter((g) => scores[g.id].score != null);
  const strong = scored.filter((g) => scores[g.id].score! >= STRONG);
  const weak = scored.filter((g) => scores[g.id].score! < WEAK);
  const missing = groups.filter((g) => scores[g.id].score == null);
  const kPa = pressure == null ? 101 : Math.round(pressure / 1000);
  const air =
    profile.body === "moon"
      ? `${kPa} kPa of air here; none there (hard vacuum).`
      : `${kPa} kPa of air here; ${(MARS_PRESSURE / 1000).toFixed(2)} kPa of CO₂ there, ${Math.round((kPa * 1000) / MARS_PRESSURE)} times thinner.`;
  const { measured, proxy, missing: none } = evaluation.confidence;

  return (
    <>
      <Radar dimensions={groups} scores={scores} />
      <p className="atlas-legend">
        <i className="atlas-key atlas-key-site" /> {label} <i className="atlas-key atlas-key-target" /> {where(profile)}, {profile.name.toLowerCase()} (outer ring)
      </p>

      <section className="atlas-section">
        <h3>What matches</h3>
        {strong.length ? (
          <ul>
            {strong.map((g) => (
              <li key={g.id}>
                <strong>
                  {g.label} {percent(scores[g.id].score)}
                </strong>{" "}
                {evidence(scores[g.id])}
              </li>
            ))}
          </ul>
        ) : (
          <p>No metric group reaches {percent(STRONG)} similarity. This place is a poor analog for {where(profile)}.</p>
        )}
      </section>

      <section className="atlas-section atlas-breaks">
        <h3>Where it breaks down</h3>
        <ul>
          {weak.map((g) => (
            <li key={g.id}>
              <strong>
                {g.label} {percent(scores[g.id].score)}
              </strong>{" "}
              {evidence(scores[g.id])}
            </li>
          ))}
          {missing.map((g) => (
            <li key={g.id}>
              <strong>{g.label} not compared</strong> no data for this place, so it is left out of the score.
            </li>
          ))}
        </ul>
        <h3 className="atlas-gaps">Never matched anywhere on Earth</h3>
        <ul>
          <li>
            <strong>Gravity</strong> {earth.gravity} m/s² here, {body.gravity} on {where(profile)}: loads, traction and dust behave as if {(earth.gravity / body.gravity).toFixed(1)} times
            heavier.
          </li>
          <li>
            <strong>Atmosphere</strong> {air}
          </li>
          <li>
            <strong>Radiation</strong> about {earth.radiation.value} mSv/day at the surface of Earth; {body.radiation.value} mSv/day on {where(profile)}, roughly{" "}
            {Math.round(body.radiation.value / earth.radiation.value)} times more.
          </li>
          <li>
            <strong>Magnetic field</strong> Earth's is global; {where(profile)} has none.
          </li>
          <li>
            <strong>Day length</strong> one day on {where(profile)} lasts {body.day}.
          </li>
        </ul>
        <p className="atlas-gaps-note">
          These are left out of the score, so {percent(evaluation.overall)} means "this similar among places on Earth", not "{percent(evaluation.overall)} like {where(profile)}".
        </p>
      </section>

      <section className="atlas-section">
        <h3>Every metric group</h3>
        <dl className="atlas-dims">
          {groups.map((g) => (
            <div key={g.id} title={g.how}>
              <dt>
                {g.label} <span className="atlas-weight">{profile.weights[g.id]}%</span>
              </dt>
              <dd>
                <span className="atlas-bar" aria-hidden="true">
                  <i style={{ width: percent(scores[g.id].score ?? 0) }} />
                </span>
                {percent(scores[g.id].score)}
              </dd>
              {scores[g.id].parts.length > 0 && (
                <ul className="atlas-parts">
                  {scores[g.id].parts.map((p) => (
                    <li key={p.label}>
                      <span>
                        {p.label}: {p.earth} <span className="atlas-part-target">(target: {p.target})</span>
                      </span>
                      <span className={`atlas-quality is-${p.quality}`}>{QUALITY[p.quality]}</span>
                      <span className="atlas-part-score">{percent(p.score)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </dl>
        <p className="cell-scale">
          Data confidence: {percent(measured)} of the score rests on measured or mapped values, {percent(proxy)} on estimates inferred from other data
          {none > 0.005 ? `, and ${percent(none)} has no data and is left out` : ""}. The groups are combined with a weighted geometric mean.
        </p>
      </section>
    </>
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
