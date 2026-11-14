import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { formatLat, formatLon, parseCoordinates } from "../geo/coords";
import { geocodingEnabled, searchOnline } from "../geo/geocoder";
import { loadGeodata, searchLocal, type SearchResult } from "../geo/geodata";
import type { GlobeController } from "../globe/GlobeController";
import { PLANETS, type PlanetId } from "../globe/planets";
import { updateAtlas } from "../state/store";
import { SearchIcon } from "./icons";

type OnlineState = "idle" | "searching" | "done" | "error";

/**
 * Search for countries, cities and coordinates. Suggestions while typing
 * come from the bundled Natural Earth data; the online geocoder is only
 * queried when the user explicitly asks (Enter or "Search all places").
 */
export function SearchBox({ globe, planet }: { globe: GlobeController | null; planet: PlanetId }) {
  // Place names exist only for Earth; the Moon and Mars are searched by coordinates.
  const named = PLANETS[planet].earthServices;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [online, setOnline] = useState<SearchResult[]>([]);
  const [onlineState, setOnlineState] = useState<OnlineState>("idle");
  const [dataVersion, setDataVersion] = useState(0);
  // The full hint does not fit a phone-width field; the label keeps it for screen readers.
  const [compact] = useState(() => window.matchMedia("(max-width: 480px)").matches);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const trimmed = query.trim();

  const results = useMemo<SearchResult[]>(() => {
    const coords = parseCoordinates(trimmed);
    if (coords) {
      return [
        {
          id: "coordinates",
          kind: "coordinates",
          title: `${formatLat(coords.lat)}, ${formatLon(coords.lon)}`,
          subtitle: "Go to coordinates",
          lat: coords.lat,
          lon: coords.lon,
          span: 60_000,
        },
      ];
    }
    if (!named) return [];
    if (onlineState === "done") return online;
    return searchLocal(trimmed);
    // dataVersion: recompute once the offline dataset has loaded.
  }, [trimmed, online, onlineState, dataVersion, named]);

  const isCoordinates = results[0]?.kind === "coordinates";
  const canSearchOnline = named && geocodingEnabled && trimmed.length >= 2 && !isCoordinates && onlineState !== "done";
  const rowCount = results.length + (canSearchOnline ? 1 : 0);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.key === "/" && !/^(INPUT|TEXTAREA)$/.test(target?.tagName ?? "")) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      abortRef.current?.abort();
    };
  }, []);

  const resetOnline = () => {
    abortRef.current?.abort();
    setOnline([]);
    setOnlineState("idle");
  };

  const choose = (result: SearchResult) => {
    // The place searched for takes over the card from any curated site.
    updateAtlas({ siteId: null });
    if (result.kind === "coordinates") {
      globe?.select(result.lat, result.lon, { span: result.span });
    } else {
      globe?.select(result.lat, result.lon, {
        span: result.span,
        preset: { title: result.title, subtitle: result.subtitle, kind: result.kind === "country" ? "country" : "place" },
      });
      setQuery(result.title);
    }
    resetOnline();
    setOpen(false);
    inputRef.current?.blur();
  };

  const runOnlineSearch = async () => {
    abortRef.current?.abort();
    const abort = (abortRef.current = new AbortController());
    setOnlineState("searching");
    try {
      const found = await searchOnline(trimmed, abort.signal);
      if (abort.signal.aborted) return;
      setOnline(found);
      setOnlineState("done");
      setActive(0);
    } catch {
      if (!abort.signal.aborted) setOnlineState("error");
    }
  };

  const activate = (index: number) => {
    if (index < results.length) choose(results[index]);
    else if (canSearchOnline && onlineState !== "searching") void runOnlineSearch();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!rowCount) return;
      setOpen(true);
      setActive((i) => (i + (e.key === "ArrowDown" ? 1 : rowCount - 1)) % rowCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (rowCount) activate(Math.min(active, rowCount - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showList = open && trimmed.length >= 2;

  return (
    <div className="search" ref={rootRef}>
      <label className="search-field panel">
        <SearchIcon />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder={!named ? "Coordinates, e.g. 18.4, 77.5" : compact ? "Search places" : "Search places or coordinates"}
          aria-label="Search places or coordinates"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          onChange={(e) => {
            setQuery(e.target.value);
            resetOnline();
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            void loadGeodata().then(() => setDataVersion(1));
          }}
          onKeyDown={onKeyDown}
        />
      </label>

      {showList && (
        <ul className="search-results panel" role="listbox">
          {results.map((result, index) => (
            <li key={result.id} role="option" aria-selected={index === active}>
              <button
                type="button"
                className={index === active ? "is-active" : ""}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(result)}
              >
                <span className="search-title">{result.title}</span>
                {result.subtitle && <span className="search-subtitle">{result.subtitle}</span>}
              </button>
            </li>
          ))}
          {canSearchOnline && (
            <li role="option" aria-selected={active === results.length}>
              <button
                type="button"
                className={`search-more${active === results.length ? " is-active" : ""}`}
                onPointerEnter={() => setActive(results.length)}
                onClick={() => activate(results.length)}
                disabled={onlineState === "searching"}
              >
                {onlineState === "searching"
                  ? "Searching…"
                  : onlineState === "error"
                    ? "Search failed. Try again"
                    : `Search all places for “${trimmed}”`}
              </button>
            </li>
          )}
          {rowCount === 0 && (
            <li className="search-empty">
              {!named ? `Enter coordinates on ${planet === "moon" ? "the Moon" : "Mars"}, such as 18.44, 77.45.` : onlineState === "done" ? "No places found." : "No matching country or major city."}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
