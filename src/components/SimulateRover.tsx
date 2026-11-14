import { useState } from "react";
import { percent } from "../analog/data";
import { isCustomId, versionLabel } from "../analog/custom";
import { PREMADE_VIDEO_TOP_PERCENT, premadeVideoSource, type PremadeVideoPlan } from "../analog/premade";
import type { Profile } from "../analog/scoring";
import type { GlobeController } from "../globe/GlobeController";
import { showToast, useStore } from "../state/store";
import { InfoTip } from "./InfoTip";

interface Props {
  globe: GlobeController | null;
  place: { name: string; lat: number; lon: number; kind: "grid-point" | "curated-site" };
  profile: Profile;
  /** The point is in a sea or ocean (Natural Earth): no ground to drive on. */
  water?: boolean;
  /** How similar this place is to the chosen version (0 to 1), as the card shows it; null or absent when there is no score. */
  similarity?: number | null;
}

/**
 * "Simulate a rover here": opens the rover simulator (src/rover, a separate
 * chunk loaded only now) on the real ground around this exact point. The
 * globe stops drawing underneath it and is shown again, as it was, on exit.
 */
export function SimulateRover({ globe, place, profile, water, similarity }: Props) {
  const imagery = useStore((s) => s.activeImagery ?? s.settings.imagery);
  const [busy, setBusy] = useState(false);
  if (water) return <p className="cell-note">Open water: there is no ground here for a rover, so this point cannot be simulated.</p>;
  const start = async () => {
    setBusy(true);
    globe?.setPaused(true);
    const done = () => {
      try {
        globe?.setPaused(false);
      } catch {
        /* the globe was rebuilt meanwhile */
      }
      setBusy(false);
    };
    try {
      const sim = await import("../rover/index");
      const targetName = isCustomId(profile.id) ? profile.name : `${profile.body === "moon" ? "Moon" : "Mars"}, ${versionLabel(profile)}`;
      await sim.openRoverSim({
        place,
        target: { id: profile.id, name: targetName, body: profile.body, custom: isCustomId(profile.id) },
        imagery: imagery === "sentinel" ? "sentinel" : "esri",
        // Formatted here with the card's own percent(), so the two numbers always agree.
        similarity: similarity != null && Number.isFinite(similarity) ? { text: percent(similarity), target: targetName } : null,
        onExit: done,
      });
    } catch (error) {
      console.error(error);
      done();
      showToast("The rover simulator could not be loaded.");
    }
  };
  return (
    <div className="rover-sim with-info">
      <button type="button" className="card-action rover-sim-button" disabled={busy} onClick={() => void start()}>
        {busy ? "Rover simulation open…" : "Simulate a rover here"}
      </button>
      <InfoTip
        label="About the rover simulation"
        text="Opens a 3D view of the real ground around this point, where a rover can drive across it. It downloads about 3 to 10 MB."
      />
    </div>
  );
}

/**
 * The place on a card where the pre-made video of a rover driving this
 * area will be shown. In this version no such video exists: the section
 * shows the status "To be recorded" and why the place was chosen.
 */
export function RoverVideoSection({ plan }: { plan: PremadeVideoPlan }) {
  const source = premadeVideoSource(plan);
  return (
    <section className="atlas-section rover-video" aria-label="Rover video">
      <h3>Rover video</h3>
      {source ? (
        <figure className="rover-video-slot has-video">
          <video src={source.url} controls playsInline preload="metadata" />
          <figcaption>{source.description}</figcaption>
        </figure>
      ) : (
        <div className="rover-video-slot" role="status">
          <span className="rover-video-status">To be recorded</span>
        </div>
      )}
      <p>
        This cell ranks in the top {PREMADE_VIDEO_TOP_PERCENT}% of land cells for {plan.targetName} ({plan.shownRank}).
      </p>
      {!source && <p className="rover-video-note">The pre-made video of a rover driving around this area has not been made yet.</p>}
    </section>
  );
}
