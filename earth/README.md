# Analog Atlas

Click any spot on Earth, press **Score this spot**, and see how similar it is to Mars and to the Moon, with the reasons. Then fly to the matching region on the other world.

A researcher can also turn on a **similarity heatmap** of the whole Earth for the chosen version of Mars or the Moon, pick a promising cell, and write a **local verification request**: a video of the place with specific questions for people who know it. Contributors answer; the researcher reviews. See [Similarity heatmap](#similarity-heatmap) and [Site verification](#site-verification).

Built for the NASA Space Apps terrestrial-analog challenge. The scoring follows a written metrics brief ("Mars and Moon Analog Sites on Earth"): nine metric groups, separate weights for Mars and the Moon, eight versions of the two bodies to compare with, and a geometric mean so that one poor match pulls the whole score down. It is deliberately strict: the median land cell scores about 10%, and the best place on Earth reaches 58% for Mars and 78% for the Moon.

React, TypeScript, Vite and CesiumJS. It runs with no API keys.

## Run it

Requires Node.js 22 or newer (20.19+ also works).

```bash
npm install
```

```bash
npm run dev
```

Then open the URL Vite prints (http://localhost:5173 by default).

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks and writes a production build to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run typecheck` | Type-check only |
| `npm run analogs` | Re-measures every reference site from the open datasets and rewrites `public/data/analogs.json` |
| `npm run grid` | Rebuilds the global grid, `public/data/grid.bin` (needs `EARTHDATA_TOKEN`, see Configuration); `-- --report` prints the benchmarks |
| `npm run geodata` | Re-downloads Natural Earth and regenerates the country, sea and city files |

`npm run analogs` caches every response in `scripts/.cache`, so a second run is offline and takes seconds. The first run takes 30 to 60 minutes, almost all of it waiting on the MODIS subset service and the Mars Climate Database. `npm run grid` uses the same cache; its first run is described under [Global grid](#global-grid).

## What it does

- **Three worlds.** The switcher at the top shows Earth, the Moon or Mars. The Moon and Mars use NASA Trek global mosaics on their own ellipsoids.
- **Score a spot on demand.** Click anywhere on Earth. The card shows the place and a **Score this spot** button. Nothing is scored, and the data grid is not even downloaded, until the button is pressed; then that one spot is scored. A new click needs a new press.
- **Two headline numbers.** "Like Mars" and "like the Moon", each for the version of that body chosen in the bar on the left. Selecting a number opens its breakdown.
- **Eight versions.** Mars: modern surface (default), ancient wet environments, acid-sulfate terrain, volcanic terrain, polar and periglacial. Moon: maria (default), highlands, south pole. The card lists the score for every version of the body being read.
- **Sub-scores with their evidence.** A radar chart of the metric groups, "What matches", "Where it breaks down", and every group with its weight, its parts, the Earth value against the target, and whether each value was measured, mapped, published or estimated. A line states how much of the score rests on estimates.
- **Fidelity gaps.** Gravity, atmosphere, radiation, magnetic field and day length are listed on every result and never scored.
- **Reference sites.** 27 curated sites (8 established analogs, 19 less-studied) ranked for the chosen version, each with its own card. They use their own finer measurements and the materials reported in the cited papers.
- **Similarity heatmap.** "Show similarity heatmap" in the bar on the left scores every land cell against the chosen version with the same function as the cards and colours the globe, with an opacity slider, a highlight threshold and a legend.
- **Local verification.** "Request local verification" on any scored card starts a request; the clipboard button in the top bar opens the workspace with requests, contributor responses, review and export.
- **Fly between worlds.** "Fly to …" goes to the region that stands for the chosen version: Gale, Jezero, Meridiani, Daedalia Planum, Arcadia on Mars; Mare Tranquillitatis, the Descartes highlands and Connecting Ridge on the Moon.
- **Science overlays on Earth.** Land surface temperature, surface dust, snow cover and vegetation from NASA GIBS, in the layers menu.

## Scoring method

All of it is in `src/analog/scoring.ts`, used by the browser and by the grid builder's report.

### Metric groups and weights

| Group | Mars | Moon | Parts (share of the group) |
| --- | --- | --- | --- |
| Rock type and mineralogy | 20% | 30% | Mineral make-up, squared cosine similarity to the target's (Mars 0.8, Moon 0.6); fresh volcanic glass from a Holocene volcano within 50 km (0.2); Moon only: no water-formed minerals (0.2) |
| Aridity and water | 20% | 10% | Annual precipitation (0.45), column water vapour (0.25), surface soil wetness (0.3) |
| Temperature and ground ice | 15% | 0% | Mean surface temperature (0.5), day-to-night swing (0.2), ground ice or permafrost (0.3); the polar version weights ice 0.5 |
| Landforms and terrain | 15% | 20% | Most relevant landform present (0.6); slope, roughness and relief against the target region (0.4) |
| No vegetation or organics | 10% | 10% | Vegetation cover from NDVI |
| Soil chemistry | 8% | 0% | Soluble salts (0.6) and iron oxides (0.4); sulfates and iron oxides for the acid-sulfate version |
| Regolith physical properties | 5% | 20% | Loose, unweathered surface, inferred from rock type, young volcanism and rainfall |
| Altitude, thin air and UV | 5% | 0% | Air pressure (0.4), daily-mean UV index (0.3), cloud-free sky (0.3) |
| Albedo and illumination | 2% | 10% | Surface albedo; for the lunar south pole also the highest Sun of the year |

The weights are the starting weights of the brief (section 5.2). The overall score is the **weighted geometric mean** of the groups that have data. A group that scores 0 is counted as 0.02 so one total mismatch does not erase everything else; a group with no data is left out with its weight and reported under data confidence.

### How a measurement becomes a 0 to 1 similarity

- **One-sided scales** where Earth never reaches the target: "typical Earth" scores 0 and "most extreme on Earth" scores 1. Mean surface temperature 288 K → 0, 218 K → 1. Precipitation 800 mm → 0, 2 mm or less → 1 (log scale). Water vapour 25 kg/m² → 0, 1 kg/m² → 1 (log). Soil wetness 50% → 0, 5% → 1. Day-to-night swing 5 K → 0, 30 K → 1. Air pressure 101.3 kPa → 0, 54 kPa → 1. Daily-mean UV index 1 → 0, 3.3 → 1. Cloud 70% → 0, 15% → 1.
- **Bells on reachable targets.** Albedo: 0.25 for Mars, 0.11 for the Moon, σ 0.07. Slope, roughness and relief: a bell on a log scale against the target region (a factor of 2 apart scores 0.61, a factor of 4 scores 0.14), mean of the three.
- **Mineralogy as a whole.** Each GLiM rock class has a typical mineral make-up (textbook modal compositions, in `LITHOLOGY`); each version has a target make-up (Mars soil after the MGS-1 simulant of Rocknest, Cannon et al. 2019; lunar soils after the Lunar Sourcebook). The score is the squared cosine of the two, squared so that sharing one main mineral is not enough. Glacier ice scores 0.
- **Landforms.** Presence, 0 to 1, of impact structures (distance to the rim of a mapped structure: full within 10 km, none beyond 50 km), volcanic landforms (distance to a Holocene volcano, or volcanic rock mapped), wind landforms (loose, dry, bare ground: an estimate, no global dune map is used), relict water landforms (evaporite basins; dry sedimentary lowland as an estimate) and periglacial ground (permafrost likelihood from mean air temperature: none at −1 °C, continuous at −8 °C). Each version says how much each kind counts; the best one is used.
- **Vegetation.** NDVI 0.08 is bare, 0.50 is fully covered. South of 60°S, where MODIS has no vegetation product, cover is taken as zero and flagged as an estimate.
- **Salts.** Evaporites mapped → 1. Otherwise estimated from rainfall, because perchlorate and nitrate survive only where rain does not wash them out: 3 mm → 1, 60 mm → 0 (log).
- **Regolith.** A base value by rock class (for the Moon: pyroclastics 1, basic volcanics 0.55, loose sediment 0.25; for Mars: loose sediment 0.8, pyroclastics 0.9), raised near a Holocene volcano, and multiplied by 0.35 + 0.65 × dryness, since rain weathers sharp grains into soil. Always flagged as an estimate.

### Never scored

Gravity, atmospheric pressure and composition, ionising radiation, magnetic field and day length. No place on Earth is closer to Mars or the Moon in these than any other, so they would add a constant and no information. Every card lists them with their numbers and says that the score means "this similar among places on Earth", not "this much like Mars".

### Versions and their reference regions

| Version | Reference region | Median slope, roughness, relief (32 km window, 450 m cells) |
| --- | --- | --- |
| Mars, modern surface | Gale crater floor | 2.11°, 11.7 m, 2,725 m (MOLA) |
| Mars, ancient wet environments | Jezero crater | 1.43°, 16.9 m, 815 m (MOLA) |
| Mars, acid-sulfate terrain | Meridiani Planum | 0.30°, 3.5 m, 77 m (MOLA) |
| Mars, volcanic terrain | Daedalia Planum | 0.39°, 1.8 m, 175 m (MOLA) |
| Mars, polar and periglacial | Arcadia Planitia | 0.28°, 1.9 m, 38 m (MOLA) |
| Moon, maria | Mare Tranquillitatis | 0.30°, 3.5 m, 77 m (LOLA) |
| Moon, highlands | Descartes highlands | 2.22°, 20.6 m, 498 m (LOLA) |
| Moon, south pole | Connecting Ridge | 12.64°, 35.8 m, 3,178 m (LOLA) |

Jezero, Arcadia, Tranquillitatis and the south pole are measured by `scripts/build-analogs.mjs`; the other four by `scripts/measure-profiles.mjs`. The target mineral make-ups, landform relevances and albedos of each version are in `PROFILES` in `scoring.ts`.

## Global grid

`scripts/build-grid.mjs` measures every land cell of a global 0.5° grid (720 × 360 cells, 92,172 of them land) and writes `public/data/grid.bin`: 4.86 MB, 1.81 MB gzipped, downloaded the first time a spot is scored. The file holds measurements, not scores.

| Quantity | Source | Notes |
| --- | --- | --- |
| Slope, roughness, relief, elevation | Copernicus GLO-90, 185 m overview block-averaged to 450 m | One 32 km window at the cell centre |
| Mean surface temperature, day-to-night swing | MODIS MOD11C3 monthly, 2023 | Swing is mean monthly day minus mean monthly night. Where MODIS has no value (1,649 cells) temperature is MERRA-2 skin temperature and the swing is left out |
| NDVI | MODIS MOD13C2 monthly, 2023, 90th percentile | No value for 27,077 cells, nearly all in Antarctica |
| Precipitation, water vapour, air temperature, pressure, soil wetness, albedo, cloud, UV index | NASA POWER climatology (MERRA-2, CERES), 0.5° × 0.625° | Interpolated to the cell centre |
| Rock class | GLiM, 0.5° grid of dominant class | Sixteen classes |
| Impact structures | Wikidata (207 structures on Earth with coordinates and diameters; follows the Earth Impact Database) | The list travels in the file header, so a click measures distance from the point itself |
| Holocene volcanoes | Smithsonian Global Volcanism Program (1,214), with rock type | Same |

`npm run grid` needs `EARTHDATA_TOKEN` for MODIS (see Configuration). Everything is cached in `scripts/.cache`; a first run takes one to two hours for terrain and about 45 minutes for POWER (5,343 requests, three at a time; the service answers HTTP 429 if pushed harder). `npm run grid -- --report` prints the benchmark sites and the best cells for every version; add a version id (`--report moon-maria`) for one.

## Similarity heatmap

`src/analog/heatmap.ts`. There is no second formula: the value of a cell is `similarity(cellAt(grid, centre).measures, profile)`, the same lookup and the same function a click on the cell centre uses.

- **Computed in the browser, on demand.** Switching the heatmap on downloads `grid.bin` (if it is not there yet) and scores the 92,172 land cells in 10 ms slices, so the page stays responsive; it takes a second or two. Results are cached per version, so returning to a version is immediate. An interrupted run keeps its progress.
- **No stale maps.** When the body or version changes, the old layer is removed at once and the new one is drawn only when that version's scores exist.
- **Real resolution.** One pixel per 0.5° cell, drawn with nearest-neighbour filtering: no smoothing or interpolation.
- **Missing is not low.** Sea and land with no grid cell are fully transparent. Land below the highlight threshold is drawn as a faint grey wash, so it stays distinct from places with no score. The threshold changes drawing only; scores are untouched.
- **Colour scale.** One hue, dark to light, fixed from 0% to 60% (higher scores share the top colour; the best cell on Earth is 76%), so versions can be compared with each other.
- **Similarity and rank are separate.** The card of a selected cell shows the cell's similarity and, on its own row, its rank among land cells ("top 0.4%"). A rank is never shown as a percentage of similarity.
- **Cell, point and reference site.** A cell's value is for its sampled data (climate and rock class over about 50 km, terrain in a 32 km window, craters and volcanoes measured from the cell centre). A clicked point in the same cell can score differently because craters and volcanoes are measured from the point. A curated reference site uses its own finer measurements and published materials, so its card can differ from the cell beneath it. The card says which is which; a cell value is not a promise for every coordinate inside it.

While the heatmap is on, a click opens the breakdown directly (every cell is already scored). With it off, the **Score this spot** button works as before and the grid is not downloaded until it is pressed.

## Site verification

A local prototype of the loop "researcher asks, people who know the place answer, researcher reviews". Code in `src/verify/` and `src/components/verify/`.

**There is no backend.** Requests, responses, reviews and attached files are stored in this browser only (IndexedDB database `analog-atlas-verification`). Nothing is shared between users or sent to NASA. Records travel by hand: export a JSON bundle (attachments included), send the file, import it on the other computer.

### Three kinds of record, kept apart

| Record | Store | What it is |
| --- | --- | --- |
| Model-derived score | `requests[].model` | A snapshot of `evaluate()` when the request was made: overall score, every group and part, data confidence, the heatmap cell's value and rank, sources. Written once |
| Contributor observation | `responses` | What a contributor reported: visited or not, an answer per question, video time, map point, explanation, evidence |
| Reviewed finding | `reviews` | The researcher's decision on one response: unreviewed, needs more evidence, accepted or rejected, with a note |

Nothing copies a value from one store into another, and no code path feeds a response or a review into `scoring.ts`. "Accepted" means accepted by the reviewer in this workflow; it is not an approval by NASA or anyone else.

### The request

"Request local verification" (on a scored spot or a reference site) drafts a request with: site name and exact coordinates; the chosen version; the score, breakdown and sources as they stand; a purpose; a route; a video; dataset dates and resolutions where the project records them ("not recorded in the app" otherwise); three standard questions; and a list of observations asked for.

Items in that list marked **missing**, **estimated** or **coarse data** are generated only from the data: a metric group with no data, a part the model flags as a proxy (regolith, inferred landforms, salts, permafrost), a rock class taken from the 0.5° map, values that are 50 km cell averages, a cell with no MODIS temperature. Each carries its reason. The researcher can remove any of them and add questions and requests of their own.

### The video, and what the rover is

**No rover simulator exists in this repository, and none is connected.** The app says so on every request. What it offers instead:

- **Attach a video** by file (stored with the request) or by URL, with a line saying what it is.
- **Record a terrain preview.** `GlobeController.playWalkthrough` moves the camera along the route above the ground and records the canvas (MediaRecorder, WebM). It is satellite imagery draped on the elevation model, nothing else: no vehicle, no wheels, no soil, no generated rocks. Every frame carries the label "Terrain preview · not a rover simulation", and the heatmap is hidden while it runs. Preview, record, replay, record again and "Export video file" are provided. If the browser cannot record, or the recorder returns an empty file, the form says so and nothing is saved as a video.
- **Rover hand-off file** (the integration point). "Rover hand-off file" on a request downloads JSON (`roverHandoff()` in `src/verify/exchange.ts`) with the request id, site coordinates, version and route waypoints. An external simulator that reads it knows what to drive; its video comes back through "Attach a file". Nothing reads this file today.

Contributor feedback is about whether the landscape shown matches the real place. It says nothing about rover traction, suspension or soil physics, and the interface tells contributors so.

### Responding and reviewing

A contributor opens a request, sees the site and route on the globe, watches the video, says whether they have been at the exact point, and answers each question with Matches, Differs or Cannot judge, optionally with the current video time, a point picked on the globe and an explanation (required for Differs). They can attach photographs or files with an observation date, coordinates and a source link, and reply to the observations asked for. For a preview recorded in the app, a video time is also translated to the camera's position on the route.

The review screen lists each response with its evidence and lets the researcher set a status and a note. From a request: **Site report (Markdown)**, **Request, responses and files (JSON)** (re-importable), **Rover hand-off file**, and delete.

### Not in this version

- Sharing, accounts, moderation: needs a backend.
- A rover simulation: see above.
- **Custom targets.** The comparison targets are the eight versions listed below. Clicking an arbitrary point on the Moon or Mars does not create a target to compare with; that would need per-point Moon and Mars measurements and is a separate extension.

## Benchmarks

The brief lists established analog sites that a calibrated model should rank near the top. These are grid-cell scores (the 50 km cell containing the site), with the cell's rank among all 92,172 land cells.

| Site | Version | Score | Rank | Comment |
| --- | --- | --- | --- | --- |
| Craters of the Moon, Idaho | Moon, maria | 54% | top 0.1% | Basalt, young volcano, lava-plain terrain |
| San Francisco Volcanic Field and Meteor Crater | Moon, maria / highlands | 46% / 50% | top 0.2% / 0.1% | One cell holds both |
| Askja, Iceland | Moon, maria / Mars, modern | 37% / 24% | top 0.5% / 1.4% | Wet climate holds it down |
| Mauna Kea | Moon, maria | 31% | top 1.0% | The cell averages the wet slopes below the dry summit |
| Lonar crater | Moon, maria | 28% | top 1.5% | Right rock and an impact crater, but farmland |
| Yungay, Atacama | Mars, modern | 29% | top 0.5% | Driest; the mapped rock is loose sediment, not basalt |
| Craters of the Moon | Mars, modern / volcanic | 27% / 31% | top 0.8% / 0.4% | |
| Qaidam Basin | Mars, modern / ancient wet | 19% / 24% | top 4.3% / 2.9% | |
| McMurdo Dry Valleys | Mars, ancient wet / polar | 27% / 20% | top 1.4% / 5.4% | The cell is mostly ice and snow |
| Dallol, Danakil | Mars, acid-sulfate | 21% | top 2.2% | |
| Haughton crater | Mars, ancient wet | 24% | top 3.1% | |
| Hanksville, Utah | Mars, ancient wet | 18% | top 10% | |

**Sites the grid ranks poorly, and why.** Río Tinto (5% for acid-sulfate, bottom fifth), Lake Salda (9% for ancient wet), Stillwater (12% for highlands), Ries (15%), Mistastin (16%) and Pilbara (11 to 13%). Each is valued for something a 50 km cell and a rock-class map cannot see: an acid river a few kilometres long, a lake shore, an anorthosite body mapped as "metamorphic" or "acid plutonic", and all of them sit in vegetated, rainy country. The brief's own warning applies: the best analogs are small. The curated cards do better because they carry published materials (Umm Jirsan scores 70% for the maria against 61% for a click nearby), but they are still penalised for climate and vegetation, which is the intended behaviour of a geometric mean.

**Places that must score low do.** Amazon rainforest 3% (Mars) and 12% (Moon); Greenland ice sheet 11% and 6%; Paris basin 4% and 11%. Deccan farmland scores 11% for Mars but 28% for the lunar maria (top 1.5%): it is flood basalt with volcanic landforms, and vegetation and rain together carry only 20% of the Moon weight. That is the most lenient result the model gives.

**Best cells.** For the maria: Harrat Khaybar, Saudi Arabia (78%), then other bare desert lava fields (Harrat ash Shaam, Alu-Dalafilla, Pinacate, Zuni-Bandera). For modern Mars: a basalt cell in the Atacama at 25.25°S 69.75°W (54%), Emi Koussi in the Tibesti (53%), Harrat Lunayyir (50%). For Mars volcanic terrain: the Tibesti (58%). None has been checked in the literature.

Distribution over all land cells (median / 99th percentile / best): Mars modern 10 / 25 / 54%; ancient wet 12 / 28 / 44%; acid-sulfate 11 / 22 / 45%; volcanic 11 / 26 / 58%; polar 11 / 24 / 46%; Moon maria 9 / 31 / 78%; highlands 9 / 33 / 75%; south pole 8 / 31 / 62%.

## What a score can and cannot tell you

**It can** rank the 50 km neighbourhood of a point against a version of Mars or the Moon on rock class, dryness, cold, terrain shape, mapped craters and volcanoes, bareness, albedo and altitude, and show which of those is holding it back.

**It cannot** tell you:

- **Anything smaller than the cell.** Climate, rock class and vegetation are cell values. A lava tube, a salt crust or a single outcrop is invisible. Only impact structures and volcanoes are measured from the clicked point.
- **Actual minerals.** Rock score comes from a sixteen-class map and textbook compositions, not from spectra. Andesite scores 96% against lunar highland soil because both are mostly plagioclase, though Earth's is sodium-rich; anorthosite bodies are not a class of their own.
- **Wind and water landforms, salts and regolith** with confidence: these are estimates inferred from climate and rock class, and are labelled so on the card.
- **Soil organic carbon, soil pH, surface colour, iron-oxide band ratios, dune maps.** The brief lists them; they are not in the grid.
- **That a place is like Mars.** The score compares places on Earth with each other.

## Datasets

| Data | Used for | Source | Resolution | Licence |
| --- | --- | --- | --- | --- |
| Copernicus DEM GLO-90 | Earth terrain | ESA / Airbus, [AWS Open Data](https://registry.opendata.aws/copernicus-dem/) | 90 m | Free with attribution (Copernicus DEM licence) |
| MODIS/Terra MOD11A2 v061 | Earth land surface temperature | NASA LP DAAC via [ORNL DAAC subsets](https://modis.ornl.gov/) | 1 km, 8-day | Open (NASA EOSDIS) |
| MODIS/Terra MOD13Q1 v061 | Earth vegetation (NDVI) | NASA LP DAAC via ORNL DAAC subsets | 250 m, 16-day | Open (NASA EOSDIS) |
| NASA POWER climatology | Precipitation, wind, aerosol optical depth, water vapour, pressure; skin temperature for Antarctica | [NASA LaRC POWER](https://power.larc.nasa.gov/) (MERRA-2, CERES) | 0.5° × 0.625° | Open |
| Copernicus DEM GLO-90, 185 m overview | Grid terrain | Same files; the reduced-resolution overview stored inside each | 185 m, block-averaged to 450 m | Free with attribution (Copernicus DEM licence) |
| MODIS/Terra MOD11C3 v061 | Grid land surface temperature | NASA LP DAAC through [Earthdata OPeNDAP](https://opendap.earthdata.nasa.gov/); needs an Earthdata login | 0.05°, monthly; averaged to 0.5° | Open (NASA EOSDIS) |
| MODIS/Terra MOD13C2 v061 | Grid vegetation (NDVI) | NASA LP DAAC through Earthdata OPeNDAP; needs an Earthdata login | 0.05°, monthly; averaged to 0.5° | Open (NASA EOSDIS) |
| NASA POWER regional climatology | Grid precipitation, wind, aerosol optical depth, water vapour, pressure; skin temperature where MODIS has none | NASA LaRC POWER (MERRA-2, CERES) | 0.5° × 0.625°, 2001–2025 | Open |
| GLiM global lithological map | Rock class of each cell (rock, regolith and landform groups) | Hartmann & Moosdorf 2012, [PANGAEA](https://doi.org/10.1594/PANGAEA.788537) | 0.5° grid of dominant class | CC BY 3.0 |
| Wikidata impact structures | Distance to the nearest impact structure | [Wikidata](https://www.wikidata.org/wiki/Q55818), following the Earth Impact Database | 207 structures | CC0 |
| Volcanoes of the World, Holocene list | Distance to the nearest young volcano, and its rock type | [Smithsonian Global Volcanism Program](https://volcano.si.edu/) | 1,214 volcanoes | Free with citation |
| LOLA LDEM_64 and LDEM_85S_40M | Lunar terrain | [NASA PDS Geosciences](https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/) | 474 m; 40 m at the pole | Public domain |
| Diviner Polar Resource Product v2 | Lunar south-pole temperature and ice stability | NASA PDS Geosciences | about 500 m | Public domain |
| MOLA MEGDR | Mars terrain | [NASA PDS Geosciences](https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/) | 128 pixels/degree, 463 m | Public domain |
| Mars Odyssey GRS water | Mars water-equivalent hydrogen (shown, not scored) | NASA PDS Geosciences | 5° | Public domain |
| TES thermal inertia (Putzig & Mellon 2007) | Mars thermal inertia (shown, not scored) | NASA PDS Geosciences | 20 pixels/degree, 3 km | Public domain |
| Mars Climate Database v6.2 | Mars surface temperature, pressure, wind, dust, water vapour | [LMD / ESA / CNES](https://www-mars.lmd.jussieu.fr/mcd_python/) | Climate model, about 5.6° × 3.75° | Free for research with citation. A model, not an observation |
| LRO WAC mosaic, LOLA colour relief | Moon imagery | [NASA Moon Trek](https://trek.nasa.gov/moon/) | 100 m | Public domain |
| Viking MDIM 2.1 colour, MOLA colour relief | Mars imagery | [NASA Mars Trek](https://trek.nasa.gov/mars/) | 232 m | Public domain |
| MODIS LST, MERRA-2 dust, MODIS snow cover, MODIS NDVI (monthly) | Earth science overlays | [NASA GIBS](https://earthdata.nasa.gov/gibs) | 1 to 50 km | Public domain |
| Published papers | Geology tags, ground-ice class, pit temperature, radiation dose | Cited per value in `scripts/analog-sites.mjs` | — | — |

The Earth globe's own sources (Esri World Imagery and elevation, Sentinel-2 cloudless, Blue Marble, OpenStreetMap, Natural Earth, Nominatim) are unchanged; their terms are listed in the app under "Data attribution".

**Substitutions.** GPM/IMERG precipitation and EMIT, ASTER, CRISM and M3 mineral products need an Earthdata login or are too heavy to extract per site in a hackathon. The global MODIS grids also need a login (the no-login copy at NASA Earth Observations has been retired), so the grid build takes a token; the curated sites still use the ORNL subset service, which needs none. Precipitation uses MERRA-2 through POWER instead, and mineralogy is coded from papers. Trek layers are tiled in plain geographic coordinates (two tiles at level 0), not Web Mercator. GIBS layer names, tile matrix sets and dates were taken from the GIBS capabilities document and each tile URL was fetched to confirm it.

## Using it

| Action | Mouse / keyboard | Touch |
| --- | --- | --- |
| Rotate | Drag | Drag |
| Zoom | Wheel, or the + / − buttons | Pinch |
| Tilt | Ctrl + drag, or middle-drag | Two-finger drag |
| Select a spot | Click | Tap |
| Score the selected spot | "Score this spot" on the card | Same |
| Search | Click the search field or press `/` | Tap the search field |
| Whole globe | Globe button (bottom right) | Same |
| Choose Mars or the Moon, and the version | Bar at the top left, or the card | Bar under the top bar |
| Ranked reference sites | "27 reference sites, ranked" in the bar | Same |
| Similarity heatmap | "Show similarity heatmap" in the bar; then click a cell | Same |
| Verification workspace | Clipboard button in the top bar, or "Request local verification" on a card | Same |

On Earth, search accepts country and city names and coordinates. On the Moon and Mars it accepts coordinates. White dots mark the reference sites on Earth and the reference regions on the Moon and Mars.

## Configuration

Everything is optional. Copy `.env.example` to `.env.local` to change it.

| Variable | Purpose |
| --- | --- |
| `VITE_CESIUM_ION_TOKEN` | A [Cesium ion](https://ion.cesium.com/tokens) token. Adds Bing Aerial imagery and switches Earth terrain to Cesium World Terrain. |
| `VITE_NOMINATIM_URL` | Nominatim server for place search and reverse geocoding. |
| `EARTHDATA_TOKEN` | Build time only, for `npm run grid`: a [NASA Earthdata](https://urs.earthdata.nasa.gov/) user token (Generate Token), used to download the global MODIS grids. It has no `VITE_` prefix, so Vite never puts it in the browser bundle. |
| `VITE_ONLINE_GEOCODING` | Set to `false` to never send search text or clicked coordinates to Nominatim. |

## Architecture

```
src/
  main.tsx, App.tsx          React shell; builds one globe per world
  state/store.ts             Small external store (settings, planet, selection, chosen body and versions)
  state/navigation.ts        Switching planet and flying to a place on another world
  analog/
    scoring.ts               The whole model: groups, weights, versions, scales, evaluate()
    data.ts                  Types for analogs.json (reference sites, body facts, sources)
    grid.ts                  Loads grid.bin and looks up what is known about a point or a site
    heatmap.ts               Every land cell scored with similarity(); cache per version, ranks, colours
    Radar.tsx                SVG radar chart
  components/
    TargetBar.tsx            Mars or Moon, version, ranked reference sites (left)
    InfoCard.tsx             The clicked place, the Score button, the two headline numbers (right)
    AnalogCard.tsx           Full card of a reference site
    Comparison.tsx           Radar, what matches, where it breaks down, every group with its parts
    HeatmapControls.tsx      Heatmap switch, sliders, legend, and the layer on the globe
    verify/                  Verification workspace: request form, contributor form, review, export
    ...                      Planet switcher, search, layers menu, readout, zoom buttons
  verify/
    types.ts                 The three record kinds
    db.ts                    IndexedDB stores (requests, responses, reviews, files)
    build.ts                 Drafts a request from an evaluation; data-supported questions
    exchange.ts              JSON bundle export/import, Markdown report, rover hand-off file
    route.ts                 Route geometry
  globe/                     Cesium viewer per world, imagery, terrain
  globe/walkthrough.ts       Camera pass along a route and its recording (terrain preview)
  geo/                       Natural Earth lookup, Nominatim client, coordinate parsing
scripts/
  build-grid.mjs             Measures every land cell; writes public/data/grid.bin; --report for benchmarks
  grid-terrain.mjs           Terrain per cell from the Copernicus GLO-90 overviews
  grid-modis.mjs             Global MODIS temperature and NDVI through Earthdata OPeNDAP
  measure-profiles.mjs       Terrain statistics of four Mars and Moon reference regions
  analog-sites.mjs           Reference sites and everything taken from literature, with citations
  build-analogs.mjs          Measures the reference sites; writes public/data/analogs.json
  common.mjs                 Download cache, polite HTTP, the 450 m terrain analysis grid
  build-geodata.mjs          Builds the Natural Earth files
```

`GlobeController.setHeatmap` draws the heatmap layer; `HeatmapControls.tsx` calls it.

## What was verified

Automated run in installed Edge (headless, hardware WebGL) against the dev server at 1440×900 and 390×844:

- **Nothing is scored before the button.** After selecting a spot the card shows "Score this spot" and `grid.bin` has not been requested. Pressing it shows the two headline numbers and the breakdown. Selecting another spot shows the button again, with no scores.
- **Scores.** Harrat Khaybar (25.25°N 40.25°E): 43% like Mars (modern surface), 61% like the Moon (maria). Amazon (3.25°S 62.25°W): 3% and 12%.
- **Open ocean** says there is no ground to compare.
- **Reference sites.** The list ranks all 27 for the chosen version; the site card opens with its rank.
- **Fly to Mare Tranquillitatis** switches to the Moon.
- **Phone width.** No horizontal overflow.
- **Console.** No errors. `npm run build` passes.

Heatmap and verification run (same setup, 37 checks, all passing):

- **Scores unchanged.** Before any code change, all 92,172 cells × 8 versions, the 27 reference sites × 8 versions with full breakdowns, and four sample points were scored and saved; the same run afterwards is identical. `scoring.ts`, `grid.ts`, `data.ts`, `public/data` and `scripts/` have no changes.
- **Heatmap equals the scoring function.** In the browser, every cell's heatmap value equals `similarity(cellAt(centre).measures, profile)` exactly (0 mismatches of 92,172, for three versions), and matches the saved baseline to within 2 × 10⁻¹⁶ (Node and Edge differ in the last bit of some results).
- **Drawing.** The layer is 720 × 360, one pixel per cell, each land pixel the colour of its score; 0 sea pixels painted. With the threshold at 25%, scores are identical and land below it is drawn faint, not removed.
- **Changing body or version** removes the old layer in the same frame and draws the new version's scores; a cached version returns immediately.
- **Workflow.** Select a cell, open a request, generate a route, record a terrain preview (a playable 1280 px WebM), save, respond with a video time, a map point and a photograph, review as accepted. After a reload the request, video, photograph and review are all there. The stored model snapshot is byte-identical before and after the response and review, and equals `evaluate()` for the point. Export, delete and import restore everything.
- **Console.** No errors. `npm run build` passes. No horizontal overflow at 390 px.

Not verified for the new parts: recording on Firefox and Safari, video files larger than a few megabytes in a bundle (they are base64 in JSON and will be slow), a recording made on the integrated GPU (the run used the RTX 4070), and the forms on a phone beyond the overflow check.

Not verified: screen-reader output, widths between 640 and 1440 px, and frame rate (the rendering path was not changed).

## Known limitations

- **Weights and scales are a starting point.** They follow the brief, which calls its weights "a judgement, not a published standard". Scale end points (what counts as typical and extreme Earth) were set from the distribution of the grid.
- **Coarse climate.** Dallol reads 447 mm of rain a year because its cell includes the Ethiopian escarpment; Mauna Kea's dry summit reads 1,609 mm from the slopes below.
- **Impact list.** Taken from Wikidata, not from the Earth Impact Database itself; it includes buried structures with no surface expression (Chicxulub) and a few disputed ones. A structure with no recorded diameter is taken as 2 km across.
- **Permafrost is inferred** from mean annual air temperature, not read from a permafrost map. An ice sheet gets half credit for ground ice and zero for rock and regolith.
- **Reference-site materials are coded from papers**, on a 17-term vocabulary; where a rock class is also mapped, each supplies half of the mineral make-up. Citations in `scripts/analog-sites.mjs` should be checked against the papers before formal use.
- **Two island reference sites** (Lanzarote, Ward Hunt Island) have no grid cell, so soil wetness, albedo, UV, cloud and swing are missing from their scores.
- **One year of MODIS** (2023); POWER is a 2001–2025 climatology.
- **Moon and Mars are smooth globes** with no 3D terrain and no place names.
- **Heatmap cost.** The first heatmap of a version scores 92,172 cells on the main thread in slices; expect one to three seconds on a laptop. Eight cached versions hold about 6 MB.
- **Verification is local.** One browser profile, no accounts. Clearing site data deletes everything that was not exported.
- **Terrain preview.** It shows what the imagery source has. In remote places fine imagery tiles do not exist and the ground reads "Map data not yet available" below a few hundred metres; the capture date of the imagery is not known to the app.
- **Public services.** Trek, GIBS, Esri and Nominatim are shared public endpoints with fair-use limits.
