import { useEffect, useRef } from "react";
import { formatDistance, formatLat, formatLon } from "../geo/coords";
import type { GlobeController } from "../globe/GlobeController";
import { useStore } from "../state/store";

/**
 * Live coordinate readout. Values are written straight to the DOM from the
 * render loop, so camera movement never rerenders React.
 */
export function Hud({ globe }: { globe: GlobeController | null }) {
  const latRef = useRef<HTMLSpanElement>(null);
  const lonRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const tilesLoading = useStore((s) => s.tilesLoading);

  useEffect(() => {
    if (!globe) return;
    return globe.onHud((sample) => {
      if (latRef.current) latRef.current.textContent = formatLat(sample.lat);
      if (lonRef.current) lonRef.current.textContent = formatLon(sample.lon);
      if (altRef.current) altRef.current.textContent = formatDistance(sample.altitude);
    });
  }, [globe]);

  return (
    <div className="hud" aria-label="Position">
      <div className="hud-item">
        <span className="hud-label">Lat</span>
        <span ref={latRef} className="hud-value">
          —
        </span>
      </div>
      <div className="hud-item">
        <span className="hud-label">Lon</span>
        <span ref={lonRef} className="hud-value">
          —
        </span>
      </div>
      <div className="hud-item">
        <span className="hud-label">Alt</span>
        <span ref={altRef} className="hud-value">
          —
        </span>
      </div>
      <span className={`hud-status${tilesLoading ? " is-active" : ""}`} title="Loading imagery" aria-hidden="true" />
    </div>
  );
}
