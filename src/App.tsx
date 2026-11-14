import { useEffect, useRef, useState } from "react";
import { Controls } from "./components/Controls";
import { HeatmapLayer, TopPlacesBar } from "./components/HeatmapControls";
import { Hud } from "./components/Hud";
import { AtlasIcon, VerifyIcon } from "./components/icons";
import { InfoCard } from "./components/InfoCard";
import { PlanetSwitcher } from "./components/PlanetSwitcher";
import { SearchBox } from "./components/SearchBox";
import { SettingsMenu } from "./components/SettingsMenu";
import { TargetBar } from "./components/TargetBar";
import { VerifyPanel } from "./components/verify/VerifyPanel";
import type { GlobeController } from "./globe/GlobeController";
import { PLANETS } from "./globe/planets";
import { store, updateAtlas, updateVerify, useStore } from "./state/store";

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const [globe, setGlobe] = useState<GlobeController | null>(null);

  const ready = useStore((s) => s.ready);
  const fatal = useStore((s) => s.fatal);
  const toast = useStore((s) => s.toast);
  const planet = useStore((s) => s.planet);
  const atlasOpen = useStore((s) => s.atlas.open);
  const verifyOpen = useStore((s) => s.verify.open);
  // While the heatmap is on and no place is open, the right side shows the ranked list of its best places instead of a card.
  const showTopPlaces = useStore((s) => s.heatmap.on && s.planet === "earth" && !s.selection && !s.atlas.siteId);

  // One globe per world: switching planets tears the viewer down and builds
  // a new one on that world's ellipsoid.
  useEffect(() => {
    let cancelled = false;
    let instance: GlobeController | null = null;
    store.set({ ready: false, selection: null, activeImagery: null });
    // The rendering engine is a separate chunk so the interface paints first.
    import("./globe/GlobeController")
      .then(({ GlobeController }) => {
        if (cancelled) return;
        instance = new GlobeController(containerRef.current!, creditsRef.current!, markerRef.current!, planet);
        setGlobe(instance);
        // Handy for debugging from the console during development.
        if (import.meta.env.DEV) (window as unknown as { __earth?: GlobeController }).__earth = instance;
      })
      .catch((error: unknown) => {
        console.error(error);
        if (!cancelled) {
          store.set({
            fatal: "The 3D globe could not start. It needs a browser with WebGL and hardware acceleration enabled.",
          });
        }
      });
    return () => {
      cancelled = true;
      instance?.destroy();
      setGlobe(null);
    };
  }, [planet]);

  return (
    <div className={`app${atlasOpen ? " has-atlas" : ""}`}>
      <div ref={containerRef} className="globe" />
      <div className="scrim" aria-hidden="true" />
      <div ref={markerRef} className="marker" aria-hidden="true">
        <i />
      </div>

      <header className="topbar">
        <div className="topbar-lead">
          <h1 className="brand">Analog Atlas</h1>
          <PlanetSwitcher />
        </div>
        <div className="topbar-actions">
          <SearchBox globe={globe} planet={planet} />
          <button
            type="button"
            className={`icon-button panel${atlasOpen ? " is-active" : ""}`}
            onClick={() => updateAtlas({ open: !atlasOpen })}
            aria-label="Analog Atlas"
            aria-pressed={atlasOpen}
            title="Analog Atlas"
          >
            <AtlasIcon />
          </button>
          <button
            type="button"
            className={`icon-button panel${verifyOpen ? " is-active" : ""}`}
            onClick={() => updateVerify({ open: !verifyOpen })}
            aria-label="Site verification"
            aria-pressed={verifyOpen}
            title="Site verification"
          >
            <VerifyIcon />
          </button>
          <SettingsMenu globe={globe} />
        </div>
      </header>

      <HeatmapLayer globe={globe} />
      <TargetBar globe={globe} />
      {verifyOpen ? <VerifyPanel globe={globe} /> : showTopPlaces ? <TopPlacesBar globe={globe} /> : <InfoCard globe={globe} />}
      <Hud globe={globe} />
      <Controls globe={globe} />
      <div ref={creditsRef} className="credits" />

      <div className={`toast${toast ? " is-visible" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>

      <div className={`veil${ready && !fatal ? " is-hidden" : ""}`} aria-hidden={ready && !fatal}>
        <div className="veil-brand">{PLANETS[planet].name}</div>
        {fatal ? (
          <>
            <p className="veil-error">{fatal}</p>
            <button type="button" className="veil-reload" onClick={() => window.location.reload()}>
              Reload
            </button>
          </>
        ) : (
          <div className="veil-bar" />
        )}
      </div>
    </div>
  );
}
