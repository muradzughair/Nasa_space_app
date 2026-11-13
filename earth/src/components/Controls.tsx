import type { GlobeController } from "../globe/GlobeController";
import { GlobeIcon, MinusIcon, PlusIcon } from "./icons";

export function Controls({ globe }: { globe: GlobeController | null }) {
  return (
    <div className="controls panel" role="group" aria-label="Zoom">
      <button type="button" onClick={() => globe?.zoomBy(0.5)} aria-label="Zoom in" title="Zoom in">
        <PlusIcon />
      </button>
      <button type="button" onClick={() => globe?.zoomBy(2)} aria-label="Zoom out" title="Zoom out">
        <MinusIcon />
      </button>
      <button type="button" onClick={() => globe?.reset()} aria-label="Reset to the whole globe" title="Reset to the whole globe">
        <GlobeIcon />
      </button>
    </div>
  );
}
