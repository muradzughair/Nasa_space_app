import { useEffect, useRef, useState } from "react";
import type { GlobeController } from "../globe/GlobeController";
import { imageryFor, overlayCatalog } from "../globe/imageryCatalog";
import { PLANETS } from "../globe/planets";
import { type ImageryId, imageryKey, type OverlayId, type Settings, store, updateSettings, useStore } from "../state/store";
import { LayersIcon } from "./icons";

type ToggleKey = "labels" | "terrain" | "lighting" | "atmosphere" | "autoRotate";

const TOGGLES: { key: ToggleKey; label: string; earthOnly?: boolean }[] = [
  { key: "labels", label: "Place names and borders", earthOnly: true },
  { key: "terrain", label: "3D terrain", earthOnly: true },
  { key: "lighting", label: "Day and night", earthOnly: true },
  { key: "atmosphere", label: "Atmosphere" },
  { key: "autoRotate", label: "Slow rotation" },
];

export function SettingsMenu({ globe }: { globe: GlobeController | null }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const settings = useStore((s) => s.settings);
  const planet = useStore((s) => s.planet);
  const overlay = useStore((s) => s.overlay);
  const activeImagery = useStore((s) => s.activeImagery);
  const terrainSource = useStore((s) => s.terrainSource);
  const world = PLANETS[planet];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const chooseImagery = (id: ImageryId) => {
    updateSettings({ [imageryKey(planet)]: id } as Partial<Settings>);
    void globe?.setImagery(id);
  };

  const chooseOverlay = (id: OverlayId | null) => {
    store.set({ overlay: id });
    globe?.setOverlay(id);
  };

  const toggle = (key: ToggleKey) => {
    const value = !settings[key];
    updateSettings({ [key]: value });
    if (key === "labels") globe?.setLabels(value);
    else if (key === "terrain") void globe?.setTerrain(value);
    else if (key === "lighting") globe?.setLighting(value);
    else if (key === "atmosphere") globe?.setAtmosphere(value);
  };

  // Show the source actually on screen, which differs after a fallback.
  const shownImagery = activeImagery ?? settings[imageryKey(planet)];
  const toggles = TOGGLES.filter((t) => (world.earthServices || !t.earthOnly) && (t.key !== "atmosphere" || world.atmosphere !== "none"));
  const activeOverlay = overlayCatalog.find((o) => o.id === overlay);

  return (
    <div className="settings" ref={rootRef}>
      <button
        type="button"
        className={`icon-button panel${open ? " is-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Layers and settings"
        aria-expanded={open}
        title="Layers and settings"
      >
        <LayersIcon />
      </button>

      {open && (
        <div className="settings-panel panel" role="dialog" aria-label="Layers and settings">
          <div className="settings-heading">Imagery</div>
          <div role="radiogroup" aria-label="Imagery">
            {imageryFor(planet).map((source) => (
              <button
                type="button"
                key={source.id}
                role="radio"
                aria-checked={shownImagery === source.id}
                className="settings-option"
                onClick={() => chooseImagery(source.id)}
              >
                <span className="radio" />
                <span>
                  <span className="settings-option-label">{source.label}</span>
                  <span className="settings-option-detail">{source.detail}</span>
                </span>
              </button>
            ))}
          </div>

          {world.earthServices && (
            <>
              <div className="settings-heading">Science overlay</div>
              <div role="radiogroup" aria-label="Science overlay">
                <button type="button" role="radio" aria-checked={overlay === null} className="settings-option" onClick={() => chooseOverlay(null)}>
                  <span className="radio" />
                  <span className="settings-option-label">None</span>
                </button>
                {overlayCatalog.map((layer) => (
                  <button
                    type="button"
                    key={layer.id}
                    role="radio"
                    aria-checked={overlay === layer.id}
                    className="settings-option"
                    onClick={() => chooseOverlay(layer.id)}
                  >
                    <span className="radio" />
                    <span>
                      <span className="settings-option-label">{layer.label}</span>
                      <span className="settings-option-detail">{layer.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
              {activeOverlay && (
                <p className="settings-note">
                  NASA GIBS colour scale runs from {activeOverlay.scale[0].toLowerCase()} to {activeOverlay.scale[1].toLowerCase()}. Grey or clear areas have no data.
                </p>
              )}
            </>
          )}

          <div className="settings-heading">Display</div>
          {toggles.map(({ key, label }) => (
            <button type="button" key={key} role="switch" aria-checked={settings[key]} className="settings-toggle" onClick={() => toggle(key)}>
              <span>
                {label}
                {key === "terrain" && settings.terrain && terrainSource && <span className="settings-option-detail">{terrainSource}</span>}
              </span>
              <span className="switch" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
