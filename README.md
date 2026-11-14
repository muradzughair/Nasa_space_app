# Analog Atlas

Click any spot on Earth, press **Score this spot**, and see how similar it is to Mars and to the Moon, with the reasons. Then fly to the matching region on the other world.

A point flagged on the Moon can be made a **custom target**, so the comparison is with that lunar location instead of one of the fixed versions; see [Custom lunar targets](#custom-lunar-targets).

A researcher can also turn on a **similarity heatmap** of the whole Earth for the chosen version of Mars or the Moon, pick a promising cell, and write a **local verification request**: a video of the place with specific questions for people who know it. Contributors answer; the researcher reviews. See [Similarity heatmap](#similarity-heatmap) and [Site verification](#site-verification).

Any place on Earth can be opened as a **rover simulation** on its real ground (Copernicus DEM): the old TerraAnalog Site View, with its ground rendering, wheel contact, drive physics, soil model, rover fleet and customisation, ported unchanged. It is a screening model with simplified soil behaviour, not a validated rover simulation. The best-matching places for the chosen target are marked as places for **pre-made rover videos**, which are not made yet: their cards say "To be recorded". See [Rover simulator](#rover-simulator) and [Pre-made rover videos (planned)](#pre-made-rover-videos-planned).

Built for the NASA Space Apps terrestrial-analog challenge. The scoring follows a written metrics brief ("Mars and Moon Analog Sites on Earth"): nine metric groups, separate weights for Mars and the Moon, eight versions of the two bodies to compare with, and a geometric mean so that one poor match pulls the whole score down. It is deliberately strict: the median land cell scores about 10%, and the best place on Earth reaches 58% for Mars and 78% for the Moon.

React, TypeScript, Vite and CesiumJS. It runs with no API keys.

**AI use.** The code, data-processing scripts, checks and documentation were written with the help of generative AI (Anthropic's Claude models), and the team reviewed all of it. The data values come from the cited public datasets, and the scores come from a fixed formula: no AI runs inside the app. See [AI_USE.md](AI_USE.md).

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
| `npm run moon` | Rebuilds the lunar grid for custom targets, `public/data/moon.bin`; `-- --check` prints the reference regions as stored |
| `npm run geodata` | Re-downloads Natural Earth and regenerates the country, sea and city files |
| `node scripts/rover-check/physics_check.mjs` (and `rover_tests.mjs`, `ground_check.mjs`) | The old simulator's tests, run on the ported modules; outputs beside them |
| `node --import ./scripts/rover-check/ts-resolve.mjs scripts/rover-check/earth_ground_check.mjs` | Simulator ground against the Copernicus DEM read independently (needs network) |

`npm run analogs` caches every response in `scripts/.cache`, so a second run is offline and takes seconds. The first run takes 30 to 60 minutes, almost all of it waiting on the MODIS subset service and the Mars Climate Database. `npm run grid` uses the same cache; its first run is described under [Global grid](#global-grid).

## What it does

- **Three worlds.** The switcher at the top shows Earth, the Moon or Mars. The Moon and Mars use NASA Trek global mosaics on their own ellipsoids.
- **Score a spot on demand.** Click anywhere on Earth. The card shows the place and a **Score this spot** button. Nothing is scored, and the data grid is not even downloaded, until the button is pressed; then that one spot is scored. A new click needs a new press.
- **Two headline numbers.** "Like Mars" and "like the Moon", each for the version of that body chosen in the bar on the left. Selecting a number opens its breakdown.
- **Eight versions.** Mars: modern surface (default), ancient wet environments, acid-sulfate terrain, volcanic terrain, polar and periglacial. Moon: maria (default), highlands, south pole. The card lists the score for every version of the body being read.
- **Custom lunar targets.** Select a point on the Moon and choose "Use this point as the target". The point becomes a version of the Moon beside the three fixed ones, with a list saying which of its fields were measured there, read from a map, computed, or inherited from a fixed profile.
- **Sub-scores with their evidence.** A radar chart of the metric groups, "What matches", "Where it breaks down", and every group with its weight, its parts, the Earth value against the target, and whether each value was measured, mapped, published or estimated. A line states how much of the score rests on estimates.
- **Fidelity gaps.** Gravity, atmosphere, radiation, magnetic field and day length are listed on every result and never scored.
- **Reference sites.** 27 curated sites (8 established analogs, 19 less-studied) ranked for the chosen version, each with its own card. They use their own finer measurements and the materials reported in the cited papers.
- **Similarity heatmap.** "Show similarity heatmap" in the bar on the left scores every land cell against the chosen version with the same function as the cards and colours the globe, with an opacity slider, a highlight threshold and a legend.
- **Local verification.** "Request local verification" on any scored card starts a request; the clipboard button in the top bar opens the workspace with requests, contributor responses, review and export.
- **Fly between worlds.** "Fly to …" goes to the region that stands for the chosen version: Gale, Jezero, Meridiani, Daedalia Planum, Arcadia on Mars; Mare Tranquillitatis, the Descartes highlands and Connecting Ridge on the Moon.
- **Science overlays on Earth.** Land surface temperature, surface dust, snow cover and vegetation from NASA GIBS, in the layers menu.
- **Rover simulation anywhere on Earth.** "Simulate a rover here" on the card of a selected spot or a reference site opens the rover simulator on the real ground around that exact point.
- **Pre-made rover videos (placeholder).** With the heatmap on, the top 1% of land cells for the chosen target are outlined; their cards have a "Rover video" section that says "To be recorded".

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

- **Computed in the browser, on demand.** Switching the heatmap on downloads `grid.bin` (if it is not there yet) and scores the 92,172 land cells in 10 ms slices, so the page stays responsive; it takes a second or two. Results are cached, so returning to a version is immediate. An interrupted run keeps its progress.
- **The cache is keyed on content.** The key (`profileKey()`) is every number `similarity()` reads from a profile: minerals, terrain, landform weights, albedo, the low-Sun flag and the group weights. A name or an id is not part of it. Two targets share a map only if all of those are equal, so a newly flagged point cannot be drawn with another point's scores, and renaming a custom target does not rescore anything.
- **No stale maps.** When the body or version changes, the old layer is removed at once and the new one is drawn only when that version's scores exist.
- **Real resolution.** One pixel per 0.5° cell, drawn with nearest-neighbour filtering: no smoothing or interpolation.
- **Missing is not low.** Sea and land with no grid cell are fully transparent. Land below the highlight threshold is drawn as a faint grey wash, so it stays distinct from places with no score. The threshold changes drawing only; scores are untouched.
- **Colour scale.** One hue, dark to light, fixed from 0% to 60% (higher scores share the top colour; the best cell on Earth is 76%), so versions can be compared with each other.
- **Similarity and rank are separate.** The card of a selected cell shows the cell's similarity and, on its own row, its rank among land cells ("top 0.4%"). A rank is never shown as a percentage of similarity.
- **Cell, point and reference site.** A cell's value is for its sampled data (climate and rock class over about 50 km, terrain in a 32 km window, craters and volcanoes measured from the cell centre). A clicked point in the same cell can score differently because craters and volcanoes are measured from the point. A curated reference site uses its own finer measurements and published materials, so its card can differ from the cell beneath it. The card says which is which; a cell value is not a promise for every coordinate inside it.

While the heatmap is on, a click opens the breakdown directly (every cell is already scored). With it off, the **Score this spot** button works as before and the grid is not downloaded until it is pressed.

**Pre-made rover video places.** Once the heatmap's scores for the chosen target are complete, the cells whose rank, as the card shows it, is "top 1.0%" or better get a white outline (a separate layer above the heatmap; the heatmap's colours are not touched). See [Pre-made rover videos (planned)](#pre-made-rover-videos-planned).

## Custom lunar targets

Code in `src/analog/custom.ts`, `src/analog/moon.ts` and `src/components/CustomTarget.tsx`; data in `public/data/moon.bin`, built by `scripts/build-moon.mjs`.

On the Moon, the card of a selected point has **Use this point as the target**. That builds a `Profile` object for the point and adds it to the versions of the Moon. It is scored by the same `evaluate()` and `similarity()` as the eight fixed profiles: `scoring.ts` is not changed and there is no second formula. The heatmap, the cards, the comparison view and "Request local verification" take it like any other version. Targets are kept in this browser (`localStorage`, key `earth.customTargets.v1`), survive a reload, can be renamed, and can be removed from the bar on the left or from the point's card on the Moon.

### What is specific to the point and what is not

A custom profile is one of the fixed lunar profiles with some fields replaced. Each field carries how it was obtained, and the interface shows that list wherever the target is used.

| Field | How | Source |
| --- | --- | --- |
| Slope, roughness, relief | **Measured** | LOLA LDEM_64 (474 m). A 32 km window of 450 m cells, sampled and reduced by the same code that measured the fixed profiles' regions. The window is centred on the centre of the 0.5° cell that contains the point (at most about 11 km away at the equator), not on the point itself; the card gives the centre and the distance |
| Mare or highland | **From a map** | LROC global mare boundaries (Nelson et al. 2014), rasterised to 0.125° (about 4 km). Inside a mapped mare the target inherits from Maria, otherwise from Highlands. The map covers 65°N to 65°S; beyond that the point is taken as highland and the row is labelled inherited, not mapped |
| Low-Sun term | **Computed** | Highest Sun of the year from the latitude and the Moon's 1.54° tilt, with `sunElevation()` of `scoring.ts`. The term is on when that is below 23.44°, the lowest any place on Earth reaches and the end of the model's own scale; that is poleward of about 68° |
| Mineral make-up | **Inherited** | The Maria or Highlands profile. No mineral map is read |
| Landform weights | **Inherited** | The same profile |
| Albedo | **Inherited** | The same profile (0.11) |
| Group weights | **Inherited** | The Moon weights, shared by all lunar profiles |

Within about 0.6° of a pole the terrain window would cross the pole and the reader cannot sample it. Terrain is then inherited too: from the South pole profile (Connecting Ridge) in the south, from the base profile in the north. The row says so.

For a custom target with the low-Sun term on, the comparison view shows the point's own highest Sun as the target of that part, in place of the "about 2°" written for the South pole profile. Only that text is replaced, outside `scoring.ts`; no number changes.

### What is not per-point, and why

- **Albedo.** LOLA publishes a 1064 nm normal albedo map. It is reflectance at one infrared wavelength, roughly 0.15 to 0.4, while the model's lunar albedo (0.11) and the Earth values are broadband. Putting it into the albedo bell would compare unlike quantities, so it is not used.
- **Minerals.** Lunar Prospector gives element abundances at 2° and 5°, not minerals; turning oxides into pyroxene, plagioclase, glass and ilmenite would be a new model. Mineral maps from Kaguya exist but have no glass or ilmenite and were not evaluated for this version.
- **Landform weights and group weights** are choices of the model, not properties of a place.

### The lunar grid

`npm run moon` writes `public/data/moon.bin` (1.70 MB, 1.44 MB gzipped): terrain for every 0.5° cell of the Moon (259,200 cells, 1,440 of them without a measurement next to the poles) and the mare raster with mare names. It is downloaded the first time a point is made a target. The first build downloads LDEM_64 (530 MB) and the mare shapefile (7 MB) into `scripts/.cache` and takes about ten minutes, eight of them computing; LOLA's server sends no CORS header, which is why this is precomputed instead of read by the browser.

### Mars

Not built. It would need: a terrain grid from MOLA MEGDR (16 tiles of 128 pixels per degree, about 2 GB to download) built the same way; a rule for choosing which of the five Mars profiles a point inherits from, which no single map provides; and decisions about what else to read per point (TES albedo is broadband and could be used; mineral make-up, the thermal part weights and the acid-sulfate flag would stay inherited).

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

"Request local verification" (on a scored spot or a reference site) drafts a request with: site name and exact coordinates; the chosen version, and when that is a custom lunar target, that it is custom, its lunar coordinates, the fixed profile it inherits from and the provenance of every field (`requests[].model.customTarget`, also in the Markdown report and the rover hand-off file); the score, breakdown and sources as they stand; a purpose; a route; a video; dataset dates and resolutions where the project records them ("not recorded in the app" otherwise); three standard questions; and a list of observations asked for.

Items in that list marked **missing**, **estimated** or **coarse data** are generated only from the data: a metric group with no data, a part the model flags as a proxy (regolith, inferred landforms, salts, permafrost), a rock class taken from the 0.5° map, values that are 50 km cell averages, a cell with no MODIS temperature. Each carries its reason. The researcher can remove any of them and add questions and requests of their own.

### The video, and what the rover is

**The in-app rover simulator (see [Rover simulator](#rover-simulator)) is not linked to verification requests**: no simulation result is stored in a request, and the request says so. What the request offers for its video:

- **Attach a video** by file (stored with the request) or by URL, with a line saying what it is. A video recorded from the simulator, or made elsewhere, goes here.
- **Record a terrain preview.** `GlobeController.playWalkthrough` moves the camera along the route above the ground and records the canvas (MediaRecorder, WebM). It is satellite imagery draped on the elevation model, nothing else: no vehicle, no wheels, no soil, no generated rocks. Every frame carries the label "Terrain preview · not a rover simulation", and the heatmap and the video-place outlines are hidden while it runs. Preview, record, replay, record again and "Export video file" are provided. If the browser cannot record, or the recorder returns an empty file, the form says so and nothing is saved as a video.
- **Rover hand-off file.** "Rover hand-off file" on a request downloads JSON (`roverHandoff()` in `src/verify/exchange.ts`) with the request id, site coordinates, version and route waypoints, for an external simulator. Its video comes back through "Attach a file".
- **Planned pre-made rover video.** For a place in the top 1% for its target, the request also records, apart from its video, that a pre-made rover video is planned and not yet recorded (`requests[].premadeVideo`: status `to-be-recorded`, target id and name, whether the target is custom, the cell, its percentile rank and the rank as shown, the 1% rule). The form, the Markdown report and the JSON export show it. It is a status, not a video: it has no file, it is not played and it is not counted as a video. A request for any other place has no such entry.

Requests saved before this version keep their stored rover note ("No rover simulator is connected to this build"), which was true when they were made.

Contributor feedback is about whether the landscape shown matches the real place. It says nothing about rover traction, suspension or soil physics, and the interface tells contributors so.

### Responding and reviewing

A contributor opens a request, sees the site and route on the globe, watches the video, says whether they have been at the exact point, and answers each question with Matches, Differs or Cannot judge, optionally with the current video time, a point picked on the globe and an explanation (required for Differs). They can attach photographs or files with an observation date, coordinates and a source link, and reply to the observations asked for. For a preview recorded in the app, a video time is also translated to the camera's position on the route.

The review screen lists each response with its evidence and lets the researcher set a status and a note. From a request: **Site report (Markdown)**, **Request, responses and files (JSON)** (re-importable), **Rover hand-off file**, and delete.

### Not in this version

- Sharing, accounts, moderation: needs a backend.
- A rover simulator linked to requests (a run stored with a request), and rover simulation on the Moon and Mars: see [Rover simulator](#rover-simulator).
- The pre-made rover videos themselves: see [Pre-made rover videos (planned)](#pre-made-rover-videos-planned).
- **Custom targets on Mars.** A point on the Moon can be made a target (see [Custom lunar targets](#custom-lunar-targets)); a point on Mars cannot. That section lists what Mars would need.

## Rover simulator

Code in `src/rover/` (loaded only when it is opened); assets in `public/rover/`. It is the Site View of the old TerraAnalog project (`Rover_Sim_OldCode/`), ported to run on the real ground of any Earth point.

**What it is.** A screening model with simplified soil behaviour: a single friction coefficient, a simplified Bekker sinkage term with assumed soil constants, a plane fit through the wheel contacts instead of a suspension, no bulldozing, shear or grousers. It is not a validated rover simulation, and the view says so in its header, its fidelity line and the drive-mode footer.

**How to open it.** On Earth, the card of a selected spot and the card of a reference site have **Simulate a rover here**. It opens a full-screen view over the globe with:

- the 2 km ground around that exact point and a 10 km context ring, real elevation, north up;
- orbit and follow cameras, Natural, Slope and Elevation views, vertical exaggeration, sun elevation and azimuth;
- route playback with the live HUD (time, distance, tilt, slip, energy), charts and the verdict;
- **Gravity**: Earth (9.81 m/s², the default), the chosen target's (Mars 3.71 or Moon 1.62), or both side by side on the same ground, which runs the old two-drive verdict and its gravity rows;
- **Drive** with keyboard (W A S D, Space, R, V, Esc, H) or a standard gamepad (DualSense mapping), with the old instrument panel; with both gravities, the picture-in-picture shows the same inputs at the other gravity;
- the rover bar: **Change rover** (Perseverance, Curiosity, Scarecrow, generic lunar rover), **Customize** (wheel size and width, wheel count, mass, motor power, battery, top speed, looks), **Save as JSON** and **Load JSON**, **Compare two builds** on this ground.

**Back to globe** returns to the globe exactly as it was (same view and selection: the globe is not rebuilt, only paused) and frees what the simulator made. Open water says it cannot be simulated; so does a point where no elevation can be read (see below).

### The ground of an arbitrary point

`src/rover/earthground.ts` is the old `pipeline/fetch_windows.py` (`build_site`) run in the browser, for one point, when the simulator opens.

| | |
| --- | --- |
| Source | **Copernicus DEM GLO-30**, the Cloud Optimized GeoTIFFs on Microsoft Planetary Computer (keyless SAS token from its public token endpoint). If Planetary Computer cannot be reached, the OpenTopography copy of GLO-30. Where GLO-30 has no public tile (Armenia, Azerbaijan), **GLO-90** from Planetary Computer, and the badge says so. The copy on AWS Open Data sends no CORS header, so a web page cannot read it; these two hosts do, so no proxy or build step is needed. |
| Real resolution | 1 arc-second: 30.9 m north to south everywhere; east to west 30.9 m × cos(latitude) up to 50°, then wider (1.5″ to 50°–60°, 2″ to 70°, 3″ to 80°, 5″ to 85°, 10″ beyond). The card and the badge give both spacings at the point. GLO-90: 3 arc-seconds. |
| What is read | Only the 1024 × 1024 pixel tiles of the files that cover the 10 km ring: one tile for about half of all points, two or four near tile edges. Each is 2 to 3 MB compressed, so 1 to 6 MB per place in testing (1.0 MB at Svalbard, 3.5 to 4.5 MB on Arabian lava fields, 6.1 MB in the Amazon, 5.9 MB at a corner of four files), plus 1 to 3 MB of imagery. About 1 to 3 s on this connection, including decoding. Nothing is cached between opens. |
| What the wheels feel | The fine grid is 513 × 513 over 2 km (3.9 m spacing), as the old pipeline made it for any source coarser than 3 m. At every node it is the straight-line (bilinear) interpolation of the DEM. Below about two source pixels (about 60 m) the old pipeline's two bounded additions are applied: a rounded interpolation (cubic B-spline minus linear, at most ±0.25 m) and band-limited fractal detail (rms 3 to 7 cm, at most ±0.2 m, fixed seed per point). So the surface never leaves the DEM by more than 0.45 m, and everything shorter than about 60 m is synthetic. The badge, the ground table and the provenance tooltip say so. |
| Context ring | 161 × 161 over 10 km (62.5 m), from the same DEM averaged over 2 × 2 source pixels; its centre is replaced by the patch, so the seam is closed. |
| Heights | EGM2008 orthometric heights (Copernicus); the lowest point of the patch is 0 m in the view, and its absolute height is shown. |
| No ground | Open water (Natural Earth) shows a note on the card instead of the button. A point with no DEM tile (open sea), a patch with less than 60 % data, or a patch more than half at exactly 0 m (the DEM flattens the sea) opens a page that says why it cannot be simulated. |

Rocks near the rover are the old rule-based, fixed-seed rocks: illustrative, not mapped, not in the height field, and the wheels do not feel them.

### Imagery on the ground

The ground is draped with the globe's own satellite layer when it is one: **Esri World Imagery** (zoom 17 over the patch, about 1.2 m tile pixels at the equator, zoom 14 over the ring) or **Sentinel-2 cloudless 2020** by EOX (zoom 15, 10 m source). Any other globe layer drapes Esri. Tiles are resampled onto the ground's own grid, as the old pipeline's `img.jpg` was. Missing Esri tiles are asked for with `blankTile=false` and filled from up to three zoom levels higher up, and the badge counts them. Both hosts allow CORS. The image's own resolution at a place is not known to the app for Esri (Maxar mosaics vary from about 0.3 m to 15 m); the badge says this.

Terms. **Esri**: the item page states the Esri Master License Agreement and lists ArcGIS apps; it does not address other viewers. The globe already shows these tiles with the same attribution, but whether a separate 3D view is covered is **not confirmed** by the terms, and the ground table says so. **EOX**: CC BY-NC-SA 4.0 for non-commercial use (EOX licence summary), with the attribution shown. The colour carries no height; nothing in the physics reads it.

### Soil

No dataset here measures soil mechanics. The old model's inputs are filled in like this, and each row of the Soil inputs table is tagged **from the grid**, **from the grid by rule** or **assumed**:

| Old input | Here | How |
| --- | --- | --- |
| Rock class, rainfall, soil wetness | GLiM class and NASA POWER values of the 0.5° cell (the grid the scores use, downloaded on open) | From the grid |
| Soil competence (0 loose to 1 firm), which sets friction and rolling resistance through the old formulas | 1 − the looseness `scoring.ts` already gives each rock class (loose sediment 0, siliciclastic 0.6, carbonate 0.85, crystalline 1) | From the grid by rule |
| Ground class (firm ground, sand, fine regolith), which picks the Bekker constants | Competence 0.7 or more → firm ground (the old threshold); otherwise sand below 250 mm of rain a year, fine regolith above | From the grid by rule |
| Dust kicked up (visual only) | Dryness from rainfall, on the scoring scale (800 mm → 0, 2 mm → 1) | From the grid by rule |
| Friction | `frictionFromSoil(competence)`, adjustable with the slider | Assumed (old placeholder formula) |
| Bekker n, kc, kφ | The old table in `rovers.json` | Assumed, simplified |
| Soil wetness | Shown, not used | The model has no relation between wetness and traction |

No usable cell (small islands, ice, water, no data): competence 0.5 and fine regolith, all tagged assumed. The rover figures keep their old tags: every figure without a verified source is tagged **assumed**, a changed one **set by you**, Scarecrow's mass **derived**.

### The comparison side

The old Site View put a target ground (Jezero, Gale, Apollo 11) beside an Earth hotspot. Here the default is the Earth ground alone, at Earth's gravity, with the chosen target's gravity as an option, and both side by side on the same ground: that shows what gravity alone changes (wheel load, sinkage, power-limited speed) and runs the old verdict.

**Pairing with Jezero, Gale or Apollo 11 is worth adding later for Mars targets only.** Jezero and Gale have real 1 m HiRISE ground in the old project (2.8 MB each), so the old two-ground verdict would compare this Earth place with a real Martian ground. Apollo 11's ground is a 115 m height map that is almost flat over 2 km; it would add little. It is not built in this version.

### How it sits beside Cesium

- A separate full-screen view (`.rsim`, its own DOM and its own canvas) over the globe. The globe's React tree is made `inert` and Cesium stops drawing while it is open; on exit Cesium resumes with the same camera and selection.
- One three.js WebGL renderer is kept for the life of the page and reused by every open. On exit every geometry, material, texture, shadow map and rover model is disposed, the canvas leaves the page and shrinks to 1 × 1, and listeners are removed. Creating and destroying a WebGL context on every open, as the first version did, once took the globe's context with it on the integrated GPU (1 run of 5); with one renderer, 0 of 8 runs (24 open/close cycles) lost a context.
- The old modules stay JavaScript and are imported from TypeScript (`allowJs`), so the physics files can be compared line by line with the originals. New code (`earthground.ts`, `cog.ts`, `imagery.ts`, `earthsoil.ts`, `index.ts`) is TypeScript.
- Three.js is the npm package `three@0.160.0`, the same r160 as the old vendored bundle; `src/rover/three.js` gives the ported modules the same `THREE.*` namespace (with OrbitControls, GLTFLoader, MeshoptDecoder).
- Bundle: the simulator chunk is 705 KB (195 KB gzipped), drive mode 30 KB (12 KB), its stylesheet 41 KB (8.6 KB), all loaded only when the button is pressed. The first-load chunk grew by 5.9 KB (1.9 KB gzipped: the button, the pre-made video module and the verification fields). Rover models (Perseverance 2.6 MB, Curiosity 0.95 MB), the six ground textures (1K) and `rovers.json` are fetched on open.

### Ported from the old simulator

Unchanged, byte for byte: `sim.js` (route planning, analysis, verdict), `drive.js` (drive physics), `soilmech.js` (Bekker sinkage and compaction), `rovercfg.js` (registry, effective build, save and load), `input.js` (keyboard and gamepad), `fallback.js`, `rovers.json`, the GLB models and textures. Changed only in the line that imports Three.js: `contact.js` (wheel contact and body pose), `ground.js` (level-of-detail tiles, stitching, context ring, rocks, tracks), `rovers.js` (models).

### What had to change, and why

| Where | Change | Why |
| --- | --- | --- |
| `terrain.js` | The demo-patch and real-tile loaders (`prepareReal`, `getPatch`, `synth`) are replaced by `makePatch()`, which builds the same patch object the old `getPatch()` returned for a real ground. Every height, slope and roughness function is unchanged; `finish` is exported | The ground now comes from `earthground.ts` at open time, not from files cut in advance |
| `earthground.ts` (new) | `fetch_windows.py` in TypeScript, same constants and rules. Differences: the fractal detail uses the same filter (band 2 to 2 × source pixels, k^−1.8, unit rms) but a JavaScript random generator, a periodic 512 × 512 field read with wrap-around for the 513th row and column, and an FNV hash of the point for the seed, so its pattern differs from what the Python would draw for the same seed (bounds and rms are the same). The cubic part of the rounding uses a B-spline with a mirror boundary, which can differ from scipy's `mode="nearest"` within a few nodes of the patch edge. Heights are kept as 32-bit floats instead of 16-bit steps of at least 1 mm. Invalid nodes are filled from the nearest valid node by a breadth-first search instead of an exact distance transform. The ring is averaged by four bilinear samples half a pixel apart instead of rasterio's decimated read | It runs in the browser, for one point, without numpy, scipy or rasterio |
| `site.js` | One ground instead of a target beside a hotspot; one or two panes on it at different gravities; the single-pane verdict lists the run's own totals and blockers; Ground and Soil tables replace the trait comparison and the cached explanation; the DOM is built on open; everything is freed on exit, including the static wheel-track material (see below); one shared renderer. The ground material, sky, LOD, camera, playback, HUD and charts code is unchanged | The comparison side is now gravity, not another body's ground; it lives beside the globe instead of owning the page |
| `drivemode.js` | The chooser lists the panes (one or two gravities), the comparison view exists only with two panes, the soil comes from the place; `disposeDrive()` frees the input listeners | Same reasons |
| `roverui.js` | The class `card` is `rcard`; the Escape listener is removed on close | The globe's stylesheet owns `card`; nothing may stay behind |
| `data.js`, `globeview.js` | Reduced to what the rover modules read: the asset root, Earth's gravity, the registry; `motion` and `ease` | The old globe and its demo data are not ported |
| `rsim.css` | The old stylesheet with every selector prefixed by `.rsim`, `card`, `hud` and `panel` renamed, keyframes renamed, and phone-width rules added | So neither app's styles reach the other |
| Static wheel-track material (`Tracks.mat` in `ground.js`) | Disposed by `site.js` on close; `ground.js` itself is unchanged | Each renderer that draws it hangs a dispose listener on it, which kept every closed renderer alive (about 4 MB a cycle); the old app never closed its renderer |

### Licences of what was copied

Checked on 2026-11-14 (the old `THIRD_PARTY_NOTICES.md` stated them from memory):

| Item | Terms |
| --- | --- |
| Three.js r160 (npm `three@0.160.0`), including GLTFLoader, OrbitControls and the meshopt decoder | MIT |
| Ground textures `rocks_ground_02`, `coast_sand_rocks_02` (Poly Haven, converted to 1K) | CC0; Poly Haven states attribution is not required |
| Perseverance and Curiosity models (converted by the old pipeline) | NASA 3D Resources: "free to download and use", subject to the NASA Images and Media Usage Guidelines; the GitHub repository states the assets are without copyright. No NASA endorsement is implied |
| Generic lunar rover model | Made procedurally by the old project's pipeline; not a NASA model |
| Copernicus DEM GLO-30 / GLO-90 | Copernicus DEM licence: free use with the attribution "© DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved", shown in the ground table |
| Esri World Imagery, Sentinel-2 cloudless 2020 | See [Imagery on the ground](#imagery-on-the-ground) |

The old project's `design/refs/` screenshots were not copied.

### The Moon and Mars

Not simulated in this version; their cards have no button. A lunar point would need a ground: LOLA LDEM at 118 m or 59 m (or LROC NAC DTMs, 2 to 5 m, where they exist) cut into the 2 km patch and 10 km ring, made available to the page by a build step or a small proxy, as `npm run moon` does for its grid (LOLA's PDS server sends no CORS header). It would also need lunar soil inputs (the old model's fine-regolith class would be the default, assumed) and the lunar sky and tint the old Site View already has. Mars would need the same from MOLA (463 m: everything below about 1 km synthetic) or HiRISE and CTX DTMs where they exist (1 m and 20 m, a few hundred places), again through a build step or a proxy, plus a rule for soil class from TES thermal inertia or dust cover.

## Pre-made rover videos (planned)

The plan: the places on Earth most similar to the chosen target (any of the eight fixed versions, or a custom point flagged on the Moon) each get a pre-made video of a rover driving around that area. **Those videos do not exist yet.** In this version each such place shows the status "To be recorded" where its video will go. Making the videos is not part of this version. The simulator works at these places like anywhere else and does not depend on them.

- **The rule.** A land cell is a place for a pre-made rover video when its rank for the chosen target, as the card shows it, is "top 1.0%" or better (`PREMADE_VIDEO_TOP_PERCENT = 1` in `src/analog/premade.ts`). The rank is the heatmap's own percentile rank, formatted by the same function as the card's "top x%" row, so the two cannot disagree. Because the card rounds to 0.1 point, this takes in cells up to 1.05 %: 967 of the 92,172 land cells for every target tested.
- **It follows the target.** Changing the version, choosing another custom target or flagging a new lunar point removes the previous outlines before the next frame is drawn, and the new ones appear when the new target's scores are complete. Two flagged lunar points mark different cells (686 of 967 in common in testing).
- **Only with the heatmap.** The outlines and the card sections appear only while the heatmap is on and its scores for the chosen target are complete. With the heatmap off, nothing about pre-made videos is shown and nothing extra is scored.
- **The card.** The card of a marked cell, and of a reference site whose cell is marked, has a **Rover video** section where the video will be shown. For now it holds the status "To be recorded", the reason ("This cell ranks in the top 1% of land cells for …", with a custom target's own name) and the line "The pre-made video of a rover driving around this area has not been made yet." Unmarked cells have no such section.
- **The legend.** One line: the white outline marks the top 1% of land cells for the chosen target, where pre-made rover videos are planned, still to be recorded (with the count once scored).
- **Verification requests.** See [The video, and what the rover is](#the-video-and-what-the-rover-is): a request for a marked place records the planned video apart from its video; nothing counts it as a video.
- **Where a video plugs in.** `premadeVideoSource()` in `src/analog/premade.ts` returns null today. When the videos exist, it returns the one for a target and cell (for example from a manifest keyed on target id and cell centre), and the card's Rover video section plays it instead of "To be recorded".

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
| LOLA LDEM_64, whole file | Terrain of custom lunar targets (`moon.bin`) | Same | 474 m, measured on 450 m cells per 0.5° cell | Public domain |
| LROC global mare boundaries | Mare or highland class of custom lunar targets | [LROC RDR, NASA PDS](https://pds.lroc.asu.edu/data/LRO-L-LROC-5-RDR-V1.0/LROLRC_2001/EXTRAS/SHAPEFILE/LROC_GLOBAL_MARE/); Nelson et al. 2014, LPSC 45, 2861 | Digitised at 1:200,000 to 1:500,000, 65°N to 65°S; rasterised to 0.125° | Public domain; cite the abstract |
| Diviner Polar Resource Product v2 | Lunar south-pole temperature and ice stability | NASA PDS Geosciences | about 500 m | Public domain |
| MOLA MEGDR | Mars terrain | [NASA PDS Geosciences](https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/) | 128 pixels/degree, 463 m | Public domain |
| Mars Odyssey GRS water | Mars water-equivalent hydrogen (shown, not scored) | NASA PDS Geosciences | 5° | Public domain |
| TES thermal inertia (Putzig & Mellon 2007) | Mars thermal inertia (shown, not scored) | NASA PDS Geosciences | 20 pixels/degree, 3 km | Public domain |
| Mars Climate Database v6.2 | Mars surface temperature, pressure, wind, dust, water vapour | [LMD / ESA / CNES](https://www-mars.lmd.jussieu.fr/mcd_python/) | Climate model, about 5.6° × 3.75° | Free for research with citation. A model, not an observation |
| LRO WAC mosaic, LOLA colour relief | Moon imagery | [NASA Moon Trek](https://trek.nasa.gov/moon/) | 100 m | Public domain |
| Viking MDIM 2.1 colour, MOLA colour relief | Mars imagery | [NASA Mars Trek](https://trek.nasa.gov/mars/) | 232 m | Public domain |
| MODIS LST, MERRA-2 dust, MODIS snow cover, MODIS NDVI (monthly) | Earth science overlays | [NASA GIBS](https://earthdata.nasa.gov/gibs) | 1 to 50 km | Public domain |
| Published papers | Geology tags, ground-ice class, pit temperature, radiation dose | Cited per value in `scripts/analog-sites.mjs` | — | — |

| Copernicus DEM GLO-30 (GLO-90 where GLO-30 has no public tile) | Ground of the rover simulator, read when it opens | [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/dataset/cop-dem-glo-30); fallback [OpenTopography](https://opentopography.org/) copy | 1 arc-second (30.9 m N-S); 3 arc-seconds | Copernicus DEM licence, attribution shown |
| Esri World Imagery / Sentinel-2 cloudless 2020 | Imagery draped on the simulator's ground (the globe's layer) | Esri; EOX | Zoom 17 (about 1.2 m pixels) / zoom 15 (10 m source) | Esri Master License Agreement (use in a separate 3D view not confirmed); CC BY-NC-SA 4.0 non-commercial |
| Rover models and registry, ground textures | Rover simulator | Old TerraAnalog project: NASA 3D Resources models, Poly Haven textures | — | See [Licences of what was copied](#licences-of-what-was-copied) |

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
| Compare with a specific lunar point | On the Moon, select a point, then "Use this point as the target" | Same |
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
    heatmap.ts               Every land cell scored with similarity(); cache keyed on profile content, ranks, colours
    moon.ts                  Loads moon.bin: lunar terrain per 0.5° cell and the mare raster
    custom.ts                Custom lunar targets: the Profile built for a flagged point, provenance, storage
    premade.ts               Pre-made rover video places: the 1% rule, the marks, where a recorded video plugs in
    Radar.tsx                SVG radar chart
  components/
    TargetBar.tsx            Mars or Moon, version, ranked reference sites (left)
    InfoCard.tsx             The clicked place, the Score button, the two headline numbers (right)
    AnalogCard.tsx           Full card of a reference site
    Comparison.tsx           Radar, what matches, where it breaks down, every group with its parts
    HeatmapControls.tsx      Heatmap switch, sliders, legend, and the layer on the globe
    CustomTarget.tsx         "Use this point as the target" on the Moon; the provenance list
    SimulateRover.tsx        "Simulate a rover here" and the "Rover video" section of a card
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
  rover/                     The rover simulator, a separate chunk loaded on demand
    index.ts                 Opens it: ground, soil and imagery for the point, then Site View; frees everything on exit
    earthground.ts, cog.ts   The ground of any point from the Copernicus DEM (fetch_windows.py in the browser) and a minimal COG reader
    imagery.ts, earthsoil.ts Imagery drape; soil inputs from the 0.5° grid by rule
    site.js, drivemode.js    Site View and Drive mode, ported (see "What had to change")
    sim.js, drive.js, soilmech.js, rovercfg.js, input.js, contact.js, ground.js, rovers.js, roverui.js, terrain.js   Ported; the first five unchanged
    three.js, rsim.css       Three.js r160 namespace for the ported modules; the old stylesheet scoped to .rsim
scripts/
  rover-check/               The old simulator's tests on the ported modules, and the new ground, motion and pre-made video checks
  build-grid.mjs             Measures every land cell; writes public/data/grid.bin; --report for benchmarks
  grid-terrain.mjs           Terrain per cell from the Copernicus GLO-90 overviews
  grid-modis.mjs             Global MODIS temperature and NDVI through Earthdata OPeNDAP
  measure-profiles.mjs       Terrain statistics of four Mars and Moon reference regions
  build-moon.mjs             Lunar terrain grid and mare raster; writes public/data/moon.bin
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

Custom lunar target run (same setup against the dev server, 39 checks, all passing):

- **Scores unchanged.** The same before-and-after comparison as above (92,172 cells × 8 versions, 27 sites × 8 versions with breakdowns, four points) is byte-identical in Node, and the fixed maria heatmap in Edge matches it to 1.7 × 10⁻¹⁶. `scoring.ts` has no changes.
- **Reference points.** A target at the maria profile's point (8.3355°N 33.222°E) reads 0.30°, 2.9 m, 73 m against the profile's 0.30°, 3.5 m, 77 m; one at the highlands profile's point (8.97°S 15.5°E) reads 2.96°, 22.1 m, 527 m against 2.22°, 20.6 m, 498 m. The differences are the window position: the grid measures at the cell centre (2.7 km and about 10 km from those points). At the exact points the build's reader gives 0.296°, 3.47 m, 77 m and 2.224°, 20.58 m, 498 m, which reproduces both profiles. For Connecting Ridge it gives 10.9°, 35.0 m, 2,421 m, not the profile's 12.64°, 35.8 m, 3,178 m, which was measured on the 40 m polar grid.
- **Two points, two maps.** 92,135 of 92,172 cells differ between the two targets (largest difference 0.29); for each, every cell equals `similarity()` at the cell centre (0 mismatches), and the picture on the globe changes. After removing a target the map is the fixed maria map again.
- **Labels.** Terrain shows Measured, mare class From a map, the low-Sun term Computed, and minerals, landform weights, albedo and group weights Inherited.
- **Flow.** `moon.bin` is not requested until the action is used. The target is listed beside the three fixed lunar versions, survives a reload and is chosen again, works on a cell card and a reference-site card, and a saved verification request holds `customTarget` with the coordinates and seven provenance rows; its score equals `evaluate()` for the custom profile.
- **Console.** No errors. `npm run build` passes. No horizontal overflow at 390 px.

Not verified for custom targets: a point with the low-Sun term on (poleward of about 68°), a point next to a pole with inherited terrain, and the run was on the RTX 4070, not the integrated GPU. Mare names are spelled as in the LROC table, which drops accented letters.

Not verified for the new parts: recording on Firefox and Safari, video files larger than a few megabytes in a bundle (they are base64 in JSON and will be slow), a recording made on the integrated GPU (the run used the RTX 4070), and the forms on a phone beyond the overflow check.

Not verified: screen-reader output, widths between 640 and 1440 px, and frame rate (the rendering path was not changed).

Rover simulator and pre-made video run (2026-11-14), installed Edge, headless, pinned to the Intel UHD (hardware WebGL), against the dev server and the production build:

- **Scores unchanged.** Before any change, all 92,172 cells × 8 versions and the 27 reference sites × 8 versions with full breakdowns were scored with the app's own modules and saved; the same run afterwards is byte-identical. `scoring.ts` has no changes. `topShare()` was rewritten on top of a new `shownTopPercent()`; its text is identical to the old function's for 292,173 ranks.
- **The old tests on the ported modules.** `tests/physics_check.mjs`, `tests/rover_tests.mjs` (47 checks) and `tests/ground_check.mjs`, run unchanged except for paths (`scripts/rover-check/`), write output byte-identical to the old project's saved outputs. `tests/motion_check.mjs` needs the old app; its checks were ported to `scripts/rover-check/motion_check.mjs`, which opens the old Jezero and Gale grounds in the ported Site View and reproduces the old saved numbers: hub height median 0.264 m, 95 % spread 11 and 9 mm, worst 21 and 13 mm, body step 3.1 and 2.7 mm, pitch step 1.40° and 0.80°, 233,024 and 242,720 triangles, 801 track samples, 13.7 mm sinkage. Only the body offset in drive mode differs (0 mm against 16 and −15 mm), which depends on how long the pose has settled when it is read.
- **Ground equals the source.** `earth_ground_check.mjs`, for Harrat Khaybar (25.62°N 39.95°E) and the Atacama near Yungay (24.08°S 70.02°W): at 200 random points each, the wheel-contact height (contact fit on the drawn grid) is within 0.40 m and 0.33 m of the Copernicus DEM read independently by geotiff.js (mean 0.14 and 0.05 m; the difference is the bounded synthetic detail). The app's COG reader equals geotiff.js to 4 × 10⁻¹¹ m. The ring meets the patch with no step. The two grounds differ (602 m mean difference at the same nodes; relief 205 and 216 m).
- **Wheels on the drawn surface, HUD tilt from the same grid.** On both Earth grounds, through "Simulate a rover here": hub height above the ground under it median 0.270 and 0.266 m, 95 % spread 18 and 9 mm, worst 30 and 12 mm; body steps at most 8.5 and 12.6 mm per 0.25 m; tiles under the rover at full detail with stitched edges on the grid; tracks laid; drive mode moves the rover on the grid. The HUD tilt of every route sample equals the contact-plane tilt on the drawn grid to 1.2 × 10⁻⁴° (the route is stored as 32-bit floats; the HUD shows 0.1°).
- **Marked and unmarked places.** The simulator opens at the best maria cell (marked) and in the Amazon (unmarked).
- **Open and close five times** (production build): the JS heap after each close is 67.4, 67.6, 67.6, 67.7, 67.8 MB; one canvas (the globe's) is left; no simulator DOM, rover model or instance remains; the shared renderer holds 0 geometries, 1 texture and 6 compiled programs at 1 × 1, off the page. The first open loads the 0.5° grid (for soil) and the simulator code, which stay. Over eight runs (24 open/close cycles) neither the globe nor the simulator lost its WebGL context.
- **Frame rate on the Intel UHD at 1440 × 900**: playback seen from above the whole patch 57 to 59 fps (0.54 million triangles per frame), following the rover 41 fps (0.62 million), both gravities side by side 22 fps (1.24 million), drive mode 28 to 29 fps (0.63 million). The ground tiles near the rover are 0.10 to 0.12 million triangles; the Perseverance model is 0.2 million and is drawn twice (the shadow map counts too). The globe is unchanged: load to first view, median of 7 interleaved runs, 5.46 s before and 5.29 s after; frame rate while dragging 51.9 and 53.0 fps.
- **Features.** Playback to the verdict (one pane: Reachable; two panes: the old verdict with gravity rows), Drive with the keyboard (W held), Customize (mass 1300 kg → CUSTOM), Save as JSON, Reset (→ REAL), Load JSON (→ CUSTOM 1300 kg), Compare two builds, Change rover (Curiosity). Every unverified rover figure is tagged assumed; the soil rows are tagged from the grid, by rule or assumed.
- **Pre-made video places** (`premade_check.mjs`): for maria, highlands and two flagged lunar points, the outlines drawn on the globe (read from the layer's own picture) are exactly the cells whose card rank reads top 1.0 % or better (967 each). The two lunar points share 686 of 967. No outline appears while the heatmap is scoring (23 to 30 frames sampled); after a change of version the previous outlines are absent from the first frame (103 frames). With the heatmap off there are no outlines, no Rover video section and no mention of pre-made videos. A marked card shows "To be recorded", the reason with the target's name (fixed or custom) and the not-made line; an unmarked card has none. A request at a marked place stores `premadeVideo` (target, custom flag, rank, rule) and its video stays "none"; the Markdown report and the JSON export carry it; a request at an unmarked place has none; no request counts it as a video.
- **Console and phone width.** No console errors. No horizontal overflow at 390 px on the card (with and without the Rover video section) and in the simulator.

Not verified for the simulator: a real DualSense or other gamepad (the input code is unchanged from the old project, which was tested with a mock pad), a visible (not headless) browser window, the RTX 4070, Firefox and Safari, the OpenTopography fallback in the browser (Planetary Computer always answered) and the GLO-90 path in the browser (tested in Node, at Yerevan), Sentinel-2 imagery on the ground (Esri was the globe's layer in every run), points poleward of 80° and on the antimeridian.

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
- **Rover simulator.** A screening model: one friction coefficient, simplified Bekker sinkage with assumed constants, a plane fit instead of a suspension, illustrative rocks the wheels do not feel. Below about 60 m the ground is the DEM's interpolation plus bounded synthetic detail; a rock, a boulder field or a gully smaller than that is not in it. The soil inputs are a rule on a 50 km rock-class map and rainfall, not a soil map. Drive force, power and battery figures are the old assumptions. Each open downloads the DEM tiles again (1 to 6 MB) from public services (Planetary Computer, OpenTopography, Esri, EOX), with their fair-use limits.
- **Pre-made rover videos are placeholders.** None exists; "To be recorded" is the only status.
