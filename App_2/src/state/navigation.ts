import type { GlobeController } from "../globe/GlobeController";
import type { PlanetId } from "../globe/planets";
import { type Arrival, store } from "./store";

/** Shows another world. The globe is rebuilt for it (see App). */
export function switchPlanet(planet: PlanetId): void {
  if (store.get().planet !== planet) store.set({ planet, arrival: null, selection: null, ready: false });
}

/**
 * Flies to a place on any of the three worlds. On the world already on
 * screen this is an ordinary flight; otherwise the place is left as an
 * "arrival" that the next globe flies to as soon as it exists.
 */
export function travel(globe: GlobeController | null, planet: PlanetId, place: Arrival): void {
  if (globe && globe.planet.id === planet) {
    globe.flyToPlace(place.lat, place.lon, place.span, place.title, place.subtitle);
  } else {
    store.set({ planet, arrival: place, selection: null, ready: false });
  }
}
