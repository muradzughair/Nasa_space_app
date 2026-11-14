/**
 * Inputs of the old soil model for an Earth point. The old simulator read
 * two site traits, soil competence (0 loose to 1 firm: friction and rolling
 * resistance through frictionFromSoil and crrFromSoil) and dust cover (the
 * ground class and the dust kicked up), and took Bekker constants per ground
 * class from rovers.json. No dataset in this app measures any of these. What
 * the 0.5° grid does hold is a rock class (GLiM) and rainfall, so the inputs
 * are chosen from those by a stated rule. The rule is an assumption of this
 * app, not a measurement, and every place that shows the soil says so.
 */
import { cellAt, type Grid, loadGrid } from "../analog/grid";
import { LITHOLOGY } from "../analog/scoring";

export type GroundClass = "rocky" | "sand" | "fine_regolith";

export interface SoilRow {
  field: string;
  value: string;
  how: "from the grid by rule" | "assumed" | "from the grid";
  basis: string;
}

export interface EarthSoil {
  /** Soil competence, 0 loose to 1 firm (the old trait "soil"). */
  soil: number;
  /** Dryness, 0 to 1: only scales the dust the wheels kick up (the old trait "dust" did that too). */
  dust: number;
  cls: GroundClass;
  /** True when the grid had a usable cell; false when every input is the assumed default. */
  fromGrid: boolean;
  /** Mean land surface temperature of the cell, K (the old ground tint rule; used only when no imagery is draped). */
  tempK: number | null;
  rows: SoilRow[];
  cellCentre: [number, number] | null;
}

/** Firm enough to be the old "rocky" class: the threshold of the old groundClass(). */
const ROCKY = 0.7;
/** Below this rainfall loose ground is taken as sand, above it as fine-grained soil. */
const ARID_MM = 250;

const DEFAULT: Omit<EarthSoil, "rows" | "cellCentre" | "tempK"> = { soil: 0.5, dust: 0.5, cls: "fine_regolith", fromGrid: false };

export async function earthSoil(lat: number, lon: number): Promise<EarthSoil> {
  let grid: Grid | null = null;
  try {
    grid = await loadGrid();
  } catch {
    /* no grid: assumed defaults below */
  }
  const cell = grid ? cellAt(grid, lat, lon) : null;
  const lith = cell?.measures.lithology ?? null;
  const rock = lith ? LITHOLOGY[lith] : null;
  if (!cell || !rock || !rock.minerals) {
    const why = !grid ? "the global grid could not be loaded" : !cell ? "no land cell of the 0.5° grid here" : lith === "ig" ? "the cell is mapped as glacier ice, which the soil model has no class for" : `the cell's rock class is "${rock?.label ?? "none"}"`;
    return {
      ...DEFAULT,
      tempK: cell?.measures.tmean ?? null,
      cellCentre: cell ? [cell.lat, cell.lon] : null,
      rows: [
        { field: "Soil competence", value: DEFAULT.soil.toFixed(2), how: "assumed", basis: `Default, because ${why}.` },
        { field: "Ground class", value: "Fine regolith", how: "assumed", basis: "Default class of the old model for competence 0.5 and dust 0.5." },
      ],
    };
  }
  const loose = rock.loose ?? 0;
  const soil = Math.round((1 - loose) * 100) / 100;
  const p = cell.measures.precipitation;
  const cls: GroundClass = soil >= ROCKY ? "rocky" : p < ARID_MM ? "sand" : "fine_regolith";
  // the same log scale ends as the model's rainfall scale: 800 mm a year -> 0, 2 mm or less -> 1
  const dust = Math.max(0, Math.min(1, (Math.log10(800) - Math.log10(Math.max(p, 2))) / (Math.log10(800) - Math.log10(2))));
  return {
    soil,
    dust: Math.round(dust * 100) / 100,
    cls,
    fromGrid: true,
    tempK: cell.measures.tmean,
    cellCentre: [cell.lat, cell.lon],
    rows: [
      { field: "Rock class", value: rock.label, how: "from the grid", basis: "GLiM, dominant class of the 0.5° cell (about 50 km)." },
      { field: "Rainfall", value: `${Math.round(p)} mm a year`, how: "from the grid", basis: "NASA POWER climatology of the cell." },
      {
        field: "Soil competence",
        value: soil.toFixed(2),
        how: "from the grid by rule",
        basis: `1 − looseness of the rock class (${loose.toFixed(2)}, the same value scoring.ts uses for loose ground). A rule, not a measurement of the ground.`,
      },
      {
        field: "Ground class",
        value: cls === "rocky" ? "Rocky, firm ground" : cls === "sand" ? "Sand" : "Fine regolith",
        how: "from the grid by rule",
        basis: `Competence ${ROCKY} or more is firm ground (the old model's threshold); otherwise sand below ${ARID_MM} mm of rain a year and fine-grained soil above. A rule, not a soil map.`,
      },
      { field: "Dust kicked up", value: dust.toFixed(2), how: "from the grid by rule", basis: "Dryness from rainfall; changes only how much dust is drawn behind the wheels." },
      { field: "Soil wetness", value: cell.measures.soilWetness != null ? cell.measures.soilWetness.toFixed(2) : "none", how: "from the grid", basis: "Shown, not used: the model has no relation between wetness and traction." },
    ],
  };
}
