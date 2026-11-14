import { useState } from "react";
import {
  addCustomTarget,
  buildCustomTarget,
  customProfile,
  type CustomTarget,
  type ProvenanceRow,
  removeCustomTarget,
  renameCustomTarget,
  useCustomTargets,
} from "../analog/custom";
import { dropCellScores } from "../analog/heatmap";
import { loadMoon } from "../analog/moon";
import { formatLat, formatLon } from "../geo/coords";
import { switchPlanet } from "../state/navigation";
import { type Selection, showToast, store, updateAtlas, updateHeatmap } from "../state/store";

/** The fields of a custom target: name, value and source, one row per field. */
export function ProvenanceList({ rows }: { rows: ProvenanceRow[] }) {
  return (
    <ul className="provenance">
      {rows.map((row) => (
        <li key={row.field}>
          <div className="provenance-head">
            <span className="provenance-field">{row.field}</span>
          </div>
          <div className="provenance-value">{row.value}</div>
          <div className="provenance-source">{row.source}</div>
        </li>
      ))}
    </ul>
  );
}

/** Makes a custom target the chosen lunar version. */
export function chooseTarget(id: string): void {
  const atlas = store.get().atlas;
  updateAtlas({ body: "moon", profiles: { ...atlas.profiles, moon: id }, siteId: null });
}

/** Removes a custom target, its cached heatmap, and falls back to the maria if it was the chosen version. */
export function removeTarget(target: CustomTarget): void {
  dropCellScores(customProfile(target));
  const atlas = store.get().atlas;
  if (atlas.profiles.moon === target.id) updateAtlas({ profiles: { ...atlas.profiles, moon: "moon-maria" } });
  removeCustomTarget(target.id);
  showToast(`Removed the custom target ${target.name}.`);
}

/** The custom target folded into a card or the bar: its coordinates and the provenance of every field. */
export function TargetDetails({ target, open = false }: { target: CustomTarget; open?: boolean }) {
  return (
    <details className="target-details" open={open}>
      <summary>
        Custom target: {formatLat(target.lat)}, {formatLon(target.lon)}
      </summary>
      <ProvenanceList rows={target.provenance} />
    </details>
  );
}

/**
 * On the Moon: turns the selected point into a comparison target, or shows
 * the target already made from it, with its name, coordinates and where each
 * of its fields comes from.
 */
export function MoonTargetAction({ selection }: { selection: Selection }) {
  const targets = useCustomTargets();
  const [state, setState] = useState<"idle" | "busy" | "failed">("idle");
  const lat = +selection.lat.toFixed(4);
  const lon = +selection.lon.toFixed(4);
  const target = targets.find((t) => t.lat === lat && t.lon === lon) ?? null;

  if (!target) {
    return (
      <>
        <button
          type="button"
          className="card-action is-primary target-button"
          disabled={state === "busy"}
          onClick={() => {
            setState("busy");
            loadMoon().then(
              (moon) => {
                const made = addCustomTarget(buildCustomTarget(moon, lat, lon));
                chooseTarget(made.id);
                setState("idle");
              },
              () => setState("failed"),
            );
          }}
        >
          {state === "busy" ? "Reading the lunar grid…" : "Use this point as the target"}
        </button>
        {state === "failed" ? (
          <p className="cell-note">The lunar grid (moon.bin) could not be loaded, so no target was made. Nothing is assumed in its place.</p>
        ) : (
          <p className="target-hint">
            Makes this point a version of the Moon that Earth can be compared with. Its terrain is read from LOLA and its mare or highland class from the LROC mare map; minerals, landform
            weights and albedo are inherited from the matching fixed profile and labelled so.
          </p>
        )}
      </>
    );
  }

  return (
    <section className="atlas-section target-card">
      <h3>Custom target</h3>
      <label className="target-name">
        <span>Name</span>
        <input type="text" value={target.name} maxLength={80} onChange={(e) => renameCustomTarget(target.id, e.target.value)} />
      </label>
      <dl className="cell-heat-rows">
        <div>
          <dt>Coordinates</dt>
          <dd>
            {formatLat(target.lat)}, {formatLon(target.lon)}
          </dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{target.createdAt.slice(0, 10)}</dd>
        </div>
      </dl>
      <ProvenanceList rows={target.provenance} />
      <button
        type="button"
        className="card-action is-primary"
        onClick={() => {
          chooseTarget(target.id);
          updateHeatmap({ on: true });
          switchPlanet("earth");
        }}
      >
        Show its similarity heatmap on Earth
      </button>
      <button type="button" className="card-action" onClick={() => removeTarget(target)}>
        Remove this target
      </button>
    </section>
  );
}
