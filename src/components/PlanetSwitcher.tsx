import { PLANET_ORDER, PLANETS } from "../globe/planets";
import { switchPlanet } from "../state/navigation";
import { useStore } from "../state/store";

export function PlanetSwitcher() {
  const planet = useStore((s) => s.planet);
  return (
    <div className="planets panel" role="radiogroup" aria-label="World">
      {PLANET_ORDER.map((id) => (
        <button key={id} type="button" role="radio" aria-checked={planet === id} onClick={() => switchPlanet(id)}>
          {PLANETS[id].name}
        </button>
      ))}
    </div>
  );
}
