import { percent } from "../../analog/data";
import { type CellSummary, topShare } from "../../analog/heatmap";
import type { Profile } from "../../analog/scoring";
import { formatLat, formatLon } from "../../geo/coords";
import { updateVerify } from "../../state/store";
import { type DraftInput, draftRequest, setDraft } from "../../verify/build";

interface NoteProps {
  summary: CellSummary;
  profile: Profile;
  /** The score shown on this card, for comparison with the cell's. */
  here: { label: string; score: number };
  kind: "point" | "site";
}

/**
 * The heatmap's value for the cell under a card, next to the card's own
 * score, with the reason they can differ. Similarity and percentile rank are
 * separate rows with separate units, so a rank is never read as a similarity.
 */
export function HeatmapCellNote({ summary, profile, here, kind }: NoteProps) {
  const km = Math.round(111.2 * summary.cellDegrees);
  const differs = Math.abs(summary.score - here.score) >= 0.005;
  return (
    <section className="atlas-section cell-heat">
      <h3>Heatmap cell</h3>
      <dl className="cell-heat-rows">
        <div>
          <dt>Regional cell similarity</dt>
          <dd>{percent(summary.score)}</dd>
        </div>
        {summary.percentileRank != null && (
          <div>
            <dt>Rank among land cells</dt>
            <dd title="A rank, not a similarity">
              {topShare(summary.percentileRank)} <span className="cell-heat-sub">scores higher than {(Math.floor(summary.percentileRank * 1000) / 10).toFixed(1)}% of cells</span>
            </dd>
          </div>
        )}
        <div>
          <dt>{here.label}</dt>
          <dd>{percent(here.score)}</dd>
        </div>
      </dl>
      <p>
        The cell is {summary.cellDegrees}° across (about {km} km), centred {formatLat(summary.centreLat, 2)}, {formatLon(summary.centreLon, 2)}, and its value is the score of the data sampled for it.{" "}
        {kind === "site"
          ? `This reference site is scored from finer measurements taken at the site and from materials reported in papers, so its score ${differs ? "differs from the regional value" : "need not equal the regional value, though here the two are within half a point"}. Neither replaces the other.`
          : differs
            ? "This point scores differently because impact structures and volcanoes are measured from the point itself rather than from the cell centre."
            : "Climate, rock class and terrain are the same for every point in the cell; only the distance to craters and volcanoes is measured from the point."}{" "}
        The rank says how the cell compares with other land cells for {profile.name.toLowerCase()}; it is not a similarity to {profile.body === "moon" ? "the Moon" : "Mars"}.
      </p>
    </section>
  );
}

/** Starts a verification request from the score on a card. The score is copied as it stands; nothing is recomputed. */
export function RequestVerification({ input }: { input: DraftInput }) {
  return (
    <button
      type="button"
      className="card-action is-primary request-button"
      onClick={() => {
        setDraft(draftRequest(input));
        updateVerify({ open: true, view: "new", requestId: null });
      }}
    >
      Request local verification
    </button>
  );
}
