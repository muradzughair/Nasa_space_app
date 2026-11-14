/**
 * Turns a scored place into a draft verification request. Nothing is scored
 * here: the evaluation is the one scoring.ts produced for the card, copied
 * as a snapshot. The questions that call something missing, estimated or
 * coarse are generated only from what that evaluation and the grid say.
 */
import { type CustomTarget, versionLabel } from "../analog/custom";
import { type Evaluation, groupsOf, type Profile, profileById } from "../analog/scoring";
import type { PremadeVideoPlan } from "../analog/premade";
import { type DatasetNote, newId, type ObservationRequest, PREMADE_NOTE, type Question, ROVER_NOTE, type SiteRef, type SourceNote, type VerificationRequest } from "./types";

/** Dates and resolutions that this project's build scripts and README state for each dataset. Null: not recorded. */
const DATASET_FACTS: Record<string, { date: string | null; resolution: string | null }> = {
  copdem: { date: null, resolution: "90 m elevation model; terrain statistics from a 32 km window of 450 m cells" },
  power: { date: "2001–2025 climatology", resolution: "0.5° × 0.625°" },
  "site:power": { date: null, resolution: "0.5° × 0.625°" },
  mod11c3: { date: "2023", resolution: "0.05° monthly, averaged over the 0.5° cell" },
  mod13c2: { date: "2023", resolution: "0.05° monthly, averaged over the 0.5° cell" },
  mod11: { date: "2023", resolution: "1 km, 8-day" },
  mod13: { date: "2023", resolution: "250 m, 16-day" },
  glim: { date: "map published 2012", resolution: "0.5° grid of the dominant rock class" },
  impacts: { date: null, resolution: "list of structures with coordinates and diameters" },
  gvp: { date: null, resolution: "list of volcanoes with coordinates" },
};

export interface DraftInput {
  site: SiteRef;
  profile: Profile;
  evaluation: Evaluation;
  basis: "curated-site" | "grid-point";
  /** The custom lunar target behind `profile`, when it is not one of the fixed profiles. */
  customTarget?: CustomTarget | null;
  heatmapCell: VerificationRequest["model"]["heatmapCell"];
  /** Set when the place's cell is one where a pre-made rover video is planned (from the heatmap's complete scores). */
  premadeVideo?: PremadeVideoPlan | null;
  /** Datasets behind the Earth values, by their id in the grid header or in analogs.json. */
  datasets: { id: string; source: SourceNote; fromSite?: boolean }[];
  /** Other sources (papers, the target body's datasets). */
  sources: SourceNote[];
  gridGenerated: string | null;
  cellDegrees: number;
  /** MODIS has no land surface temperature in this cell. */
  modelledTemperature: boolean;
}

const bodyName = (profile: Profile) => (profile.body === "moon" ? "the Moon" : "Mars");

/** What to ask about a part of the score that the model estimated instead of observing. */
const ESTIMATE_PROMPTS: [RegExp, string][] = [
  [/loose, unweathered/i, "What is the ground at the marked point made of (bedrock, boulders, gravel, sand, ash, soil), and is it loose or cemented?"],
  [/landforms/i, "Which landforms are really there (dunes, dry channels or fans, lava flows, a crater rim, patterned ground)?"],
  [/soluble salts/i, "Are salt crusts, white efflorescence or evaporite deposits visible on the ground?"],
  [/permafrost/i, "Is the ground frozen at depth, or is patterned ground (polygons, sorted circles) visible?"],
  [/vegetation/i, "How much of the ground at the marked point is covered by plants, lichen or moss?"],
  [/mineral make-up/i, "What rock is exposed at the marked point?"],
];

export function draftRequest(input: DraftInput): VerificationRequest {
  const { site, profile, evaluation, basis } = input;
  const custom = input.customTarget ?? null;
  const cellKm = Math.round(111.2 * input.cellDegrees);

  const questions: Question[] = [
    "Does the terrain shape in the video (slopes, relief, large landforms) match this exact location?",
    "Are important visible features missing or misplaced in the video?",
    "Does the ground appearance (colour, surface material, vegetation) differ from the reconstruction?",
  ].map((text) => ({ id: newId("q"), text, origin: "standard" }));

  const asks: ObservationRequest[] = [
    {
      id: newId("o"),
      text: "Can you provide a recent photograph of the marked point, with its date and the direction you were facing?",
      status: "missing",
      basis: "This app holds no ground-level photographs of any place; the video is built from satellite imagery and an elevation model.",
    },
  ];
  for (const group of groupsOf(profile)) {
    const score = evaluation.groups[group.id];
    if (score.score == null) {
      asks.push({
        id: newId("o"),
        text: `Anything you know about "${group.label.toLowerCase()}" at this place.`,
        status: "missing",
        basis: `The data has no value for this group here, so it is left out of the score (${profile.weights[group.id]}% of the weight).`,
      });
      continue;
    }
    for (const part of score.parts) {
      if (part.quality === "proxy") {
        const prompt = ESTIMATE_PROMPTS.find(([pattern]) => pattern.test(part.label))?.[1] ?? `What can you report about "${part.label.toLowerCase()}" at the marked point?`;
        asks.push({ id: newId("o"), text: prompt, status: "estimated", basis: `"${part.label}" was inferred from other data, not observed. The model used: ${part.earth}.` });
      } else if (part.quality === "map" && /mineral make-up/i.test(part.label)) {
        asks.push({
          id: newId("o"),
          text: "What rock is actually exposed at the marked point?",
          status: "coarse",
          basis: `Rock type is the dominant class of a 0.5° map cell (${part.earth}), with a textbook mineral make-up; it is not a measurement at the point.`,
        });
      }
    }
  }
  if (basis === "grid-point") {
    asks.push({
      id: newId("o"),
      text: `Is the marked point typical of the ${cellKm} km around it, or is it wetter, drier, greener or barer than its surroundings?`,
      status: "coarse",
      basis: `Rainfall, humidity, vegetation, albedo and rock class are values for a ${input.cellDegrees}° grid cell (about ${cellKm} km), not for the marked point.`,
    });
  }
  if (input.modelledTemperature) {
    asks.push({
      id: newId("o"),
      text: "Any ground or air temperature records for this place.",
      status: "missing",
      basis: "MODIS has no land surface temperature for this cell; a modelled skin temperature is used and the day-to-night swing is left out.",
    });
  }

  const datasets: DatasetNote[] = input.datasets.map(({ id, source, fromSite }) => {
    const facts = (fromSite && DATASET_FACTS[`site:${id}`]) || DATASET_FACTS[id] || { date: null, resolution: null };
    return { label: source.label, url: source.url, ...facts };
  });

  const heat = input.heatmapCell;
  const note =
    basis === "curated-site"
      ? `The site score uses the reference site's own finer measurements (terrain, temperature, rainfall and vegetation measured at the site, materials coded from the cited papers) over the ${cellKm} km grid cell it sits in. ` +
        (heat ? `The heatmap cell around it is scored from regional grid data alone, so the two numbers describe different things and can differ.` : "")
      : `The score is for the ${cellKm} km grid cell that contains the point, with impact structures and volcanoes measured from the point itself. ` +
        (heat ? `The heatmap value is the same cell sampled at its centre; it can differ from the point's score where a crater or volcano is near. ` : "") +
        `A cell value does not guarantee the same score at every coordinate inside the cell.`;

  return {
    id: newId("req"),
    createdAt: new Date().toISOString(),
    site,
    model: {
      recordType: "model-derived score",
      scoredAt: new Date().toISOString(),
      method: "evaluate() in src/analog/scoring.ts: weighted geometric mean of the metric groups that have data",
      profileId: profile.id,
      profileName: profile.name,
      body: profile.body,
      basis,
      overall: evaluation.overall,
      evaluation,
      heatmapCell: heat,
      note,
      gridGenerated: input.gridGenerated,
      customTarget: custom
        ? {
            custom: true,
            name: custom.name,
            lat: custom.lat,
            lon: custom.lon,
            createdAt: custom.createdAt,
            baseProfileId: custom.baseId,
            baseProfileName: profileById(custom.baseId).name,
            terrain: custom.terrain,
            lowSun: custom.lowSun,
            provenance: custom.provenance,
          }
        : null,
      sources: [...new Map([...input.datasets.map((d) => d.source), ...input.sources].map((s) => [s.label, s])).values()],
    },
    purpose: `Check that ${site.name} is represented correctly before it is considered further as an Earth analog for ${bodyName(profile)} (${versionLabel(profile)}).`,
    video: { kind: "none", description: "" },
    route: [],
    camera: null,
    datasets,
    questions,
    observationRequests: asks,
    rover: { status: "not-integrated", note: ROVER_NOTE },
    ...(input.premadeVideo ? { premadeVideo: { recordType: "planned pre-made rover video" as const, ...input.premadeVideo, note: PREMADE_NOTE } } : {}),
  };
}

/** A draft waiting to be edited in the request form. Kept in memory only until it is saved. */
let pending: VerificationRequest | null = null;
export const setDraft = (draft: VerificationRequest | null) => (pending = draft);
export const getDraft = () => pending;
