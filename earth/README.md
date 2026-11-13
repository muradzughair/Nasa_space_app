# Analog Atlas

Pick a site on the Moon or Mars, see which places on Earth resemble it and how closely, and fly between the two worlds. Click anywhere on Earth to see how that spot compares with all four targets, or drape a similarity map over the planet to look for places nobody has tried yet.

Built for the NASA Space Apps terrestrial-analog challenge. Every similarity score comes from open data, each card says where the analogy holds and where it fails, and more than two thirds of the candidate sites are outside the usual list (Atacama, Devon Island, Dry Valleys, Iceland, Hawaii).

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
| `npm run analogs` | Re-measures every site and target from the open datasets and rewrites `public/data/analogs.json` |
| `npm run grid` | Rebuilds the global comparison grid, `public/data/grid.bin` (needs `EARTHDATA_TOKEN`, see Configuration) |
| `npm run geodata` | Re-downloads Natural Earth and regenerates the country, sea and city files |

`npm run analogs` caches every response in `scripts/.cache`, so a second run is offline and takes seconds. The first run takes 30 to 60 minutes, almost all of it waiting on the MODIS subset service and the Mars Climate Database. `npm run grid` uses the same cache; its first run is described under [Global grid](#global-grid).

## What it does

- **Three worlds.** The switcher at the top shows Earth, the Moon or Mars. The Moon and Mars use NASA Trek global mosaics on their own ellipsoids (Mars: 3,396,190 m equatorial, 3,376,200 m polar). The Moon has no atmosphere; Mars has a thin dust-tinted limb.
- **Four targets.** Connecting Ridge at the lunar south pole (an Artemis III candidate region), the Mare Tranquillitatis pit (a lava-tube skylight), Jezero Crater, and Arcadia Planitia (mid-latitude ice).
- **Ranked Earth analogs.** 27 Earth sites are scored against each target on seven dimensions. 8 are established analogs kept as reference points; 19 are less-studied. "New sites only" hides the established ones.
- **Click anywhere on Earth.** The card on the right scores the clicked place against all four targets, opens the best match with a radar chart, lists what matches and where the analogy breaks down, and links to the full card of any curated site within 50 km.
- **Similarity map.** A switch in the target bar colours every land cell by its overall similarity to the selected target, with a numeric legend and a link to the best cell. The mission goal re-weights the map as well as the list.
- **Analog card.** A radar chart of the site against the target, a "Strong analogy" section with the numbers behind it, an always-visible "Where it breaks down" section, how the site helps exploration, and the source of every number.
- **Fly between worlds.** "Fly to Earth analog" and "Fly to target" switch planet and fly there.
- **Mission goals.** Rover mobility, polar Moon base, biosignature search and lava-tube habitat re-weight the same similarities and re-rank the list at once.
- **Science overlays on Earth.** Land surface temperature, surface dust, snow cover and vegetation from NASA GIBS, in the layers menu.

The interface is globe-first: a compact target bar on the left, the reading card on the right, and nothing over the planet in the whole-planet view. Everything the original Earth globe did still works: click to fly and zoom, search by name or coordinates, imagery choices, 3D terrain, day and night.

## Scoring method

`scripts/build-analogs.mjs` measures each place and compares every Earth site with every target. The browser only applies weights.

### What is measured

All terrain is resampled to the same grid before comparison: a 32 km window of 71 × 71 cells, 450 m each. Slope depends on the baseline it is measured over, so comparing a 30 m Earth DEM with a 460 m Mars DEM directly would make Earth look rougher than it is. Coastal and island sites are measured on their land cells only.

| Dimension | Earth site | Target | Similarity |
| --- | --- | --- | --- |
| Terrain | Median slope, roughness (RMS height against the local 2.25 km mean) and relief (95th minus 5th percentile) from Copernicus DEM | Same three from LOLA or MOLA | Each on a log scale: equal scores 1, a factor of 20 apart scores 0. Mean of the three. |
| Thermal | Mean and peak land surface temperature, MODIS MOD11A2, 2023 | Mars: mean and peak over 8 seasons × 12 local times from the Mars Climate Database. Lunar pole: median yearly average and median yearly maximum from Diviner. Lunar pit: 290 K, the shadowed-floor temperature | In kelvin, compared directly: 150 K apart scores 0. |
| Water and ice | Dryness from annual precipitation, column water vapour, ground-ice class | Precipitation zero; water vapour from the Mars Climate Database (zero on the Moon); ground-ice class | Dryness is `1 − ln(1+P)/ln(1+3000)` with P in mm per year. Water vapour on a log scale spanning four orders of magnitude. Ice class linear. Mean of the three. |
| Geology | Surface materials and landforms on a fixed 17-term vocabulary, 1 for dominant and 0.5 for present, coded from the cited papers | Same vocabulary | Weighted Jaccard overlap: sum of minima over sum of maxima. |
| Dust and wind | Aerosol optical depth and wind dynamic pressure ½ρv² from NASA POWER | Dust optical depth and ½ρv² from the Mars Climate Database; zero on the Moon | Optical depth compared directly (1.0 apart scores 0). Wind pressure on a log scale spanning four orders of magnitude. |
| Sterility | Vegetation cover from growing-season MODIS NDVI (90th percentile of the 2023 composites): 0.08 is bare, 0.68 is full canopy | Zero | One minus vegetation cover. |
| Sun angle | Highest solar elevation of the year, from latitude and axial tilt | Same, with the Moon's 1.54° and Mars's 25.19° tilt | Linear: 90° apart scores 0. |

The overall match is the weighted mean of the seven similarities. Each target has default weights (for example ice counts 1.5× for Arcadia, geology 1.5× for Jezero and the pit); a mission goal replaces them.

### How unlike quantities are made comparable

- **Fixed physical scales, not ranks.** A score is never relative to the other Earth sites. Earth's warmest desert is still about 80 K warmer than Jezero on average, and the thermal score says so. This is why no site scores above 70% overall.
- **Temperature** is compared in kelvin with no rescaling between worlds.
- **Wind** is compared as the pressure it exerts, not its speed. Jezero's mean wind is 4.9 m/s, similar to many Earth sites, but in air about 75 times less dense it pushes with 0.25 Pa against 5 to 20 Pa on Earth.
- **Dust optical depth** is dimensionless and is compared as measured.
- **Cave sites against the lava-tube target** are compared on cave temperature, taken as the annual mean surface temperature above the cave (deep cave air tracks the surface annual mean; Badino 2010), not on the daytime ground temperature. Other sites are compared on their surface temperature.
- **Never scored:** gravity, atmospheric pressure, radiation and day length. No Earth site can approach them, so they appear with their numbers in "Where it breaks down" on every card.

### Where each number comes from

Every value in `analogs.json` carries a source key, and the card lists them under "Sources for these numbers", tagged dataset, model, literature or computed. Geology tags, ground-ice classes and a handful of target values (pit temperature, radiation dose) come from papers and are labelled as literature with the citation. Nothing is estimated by hand.

## Global grid

`scripts/build-grid.mjs` measures every land cell of a global 0.5° grid (720 × 360 cells, 92,172 of them land) and writes `public/data/grid.bin`: 2.95 MB, 1.45 MB gzipped, loaded on the first click or when the similarity map is switched on. The file holds measurements, not scores. The browser scores a cell with `src/analog/scoring.ts`, the same module `build-analogs.mjs` uses for the curated sites, so the normalisation is identical and the mission goal re-weights clicks and the map.

### How a cell is measured

| Dimension | Grid cell | Difference from a curated site |
| --- | --- | --- |
| Terrain | The same 32 km window on 450 m cells, centred on the cell centre, from Copernicus GLO-90. Read from the 185 m overview stored in each file and block-averaged to 450 m | On the 27 curated sites the overview gives slope, roughness and relief within about 1% of the full 90 m data. The window covers the middle third of the cell, not all of it |
| Thermal | MODIS MOD11C3 monthly land surface temperature, 2023, averaged over the cell's 0.05° pixels. Mean of the monthly day and night means; peak is the warmest monthly day mean | Curated sites use 8-day composites at 1 km. Cell means agree within about 1 K where the site is typical of its cell; cell peaks run 1 to 8 K lower because a month smooths more than 8 days. Where MODIS has no value (1,649 cells), MERRA-2 skin temperature from POWER is used and the card says so |
| Water and ice | Dryness and column water vapour from NASA POWER, interpolated from its 0.5° × 0.625° nodes to the cell centre | **No ground-ice class.** No global ground-ice dataset is used, so the score is the mean of two parts instead of three |
| Geology | **Not scored.** The GLiM lithology class of the cell is stored and the card says in words what it shares with the target | See below |
| Dust and wind | Aerosol optical depth and wind pressure from POWER, as for the sites | None |
| Sterility | MODIS MOD13C2 monthly NDVI, 2023, cell mean; 90th percentile of the 12 months | Curated sites use 16-day composites at 250 m over a 2 km box. A cell averages everything in 50 km, so an oasis or a bare summit disappears into its surroundings. No value for 27,077 cells, all but about a hundred of them in Antarctica: sterility is then left out |
| Sun angle | From the latitude of the cell centre | None |

**Why geology is not scored for cells.** The only global source reachable is GLiM, a rock-type map. It can speak to five of the seventeen vocabulary terms (basalt, carbonates, sulfates, chlorides, glass) and to none of the minerals and landforms that define the targets (clays, olivine, impact structures, lava tubes, deltas, ground ice). A first build scored the overlap on those five terms; the result ranked every cell of loose sediment or ice (no rock type, so no penalty) above every cell of known rock, and gave any basalt cell 100% against Arcadia Planitia. So the dimension is left out of every cell's score, shown as "n/a" on the radar, and the card reports the rock type and whether it is one of the target's materials.

**Cell scores are not comparable with curated-site scores.** A cell's overall match is the weighted mean of six dimensions (five in Antarctica), without geology and without the ground-ice part of water. Geology is the weakest dimension for most curated sites (the Findings tables list it as weakest for 13 of the 20 top-five entries), so leaving it out raises the number: the Lut Desert site scores 60% against Jezero with geology and its grid cell scores 67% without. Compare cells with cells, and sites with sites.

### Resolution limits

- A cell is 56 km north to south and 56 km × cos(latitude) east to west: 48 km at 30°, 28 km at 60°, 5 km at 85°. Near the poles the cells are narrow slivers and the 32 km terrain windows of neighbours overlap heavily.
- Climate comes from a 0.5° × 0.625° model grid; MODIS values are means over the cell. Anything smaller than about 50 km (a crater, a lava field, a salt pan, a valley) is averaged with what surrounds it.
- Terrain is one 32 km window per cell. Poleward of about 85° the window is laid out on a local flat projection that stretches noticeably.
- A cell is land if at least a tenth of its terrain window is land and POWER has climate values there. Small islands and some coasts have no cell (Lanzarote and Ward Hunt Island, two curated sites, among them).
- One year of MODIS (2023); POWER is a 2001–2025 climatology.

### Building it

`npm run grid` needs `EARTHDATA_TOKEN` (see Configuration); without it the build still runs, falls back to POWER skin temperature everywhere and leaves vegetation empty. Everything is cached in `scripts/.cache`, so a second run takes about a minute. The first run:

| Stage | Requests | Time |
| --- | --- | --- |
| Terrain: 26,475 GLO-90 tiles, one overview each | about 26,500 files | One to two hours on one core (decoding the tiles dominates). `GRID_BANDS="-60,-1" node scripts/build-grid.mjs` measures only those latitude bands and stops, so several can run side by side |
| Climate: POWER regional climatology, one parameter and one 10° box per request | 3,699 | Roughly half an hour at three requests at a time; the service answered HTTP 429 when two builds ran at once |
| MODIS: 12 months × 3 variables through Earthdata OPeNDAP | 36 (about 50 MB each) | About 5 minutes |
| Lithology: GLiM 0.5° grid | 1 (39 kB) | Seconds |

`npm run grid -- --validate` prints each curated site beside the cell that contains it; `npm run grid -- --report` lists the best cells per target.

## What a click can and cannot tell you

**It can** tell you how the 50 km neighbourhood of a point compares with each target in terrain texture, surface temperature, dryness, dust and wind, vegetation and sun angle, on the same physical scales as the curated sites, with the numbers and their sources. It is a way to find regions worth a closer look.

**It cannot** tell you:

- **What the ground is made of.** Geology is not scored. The Rub' al Khali scores 70% against the Mare Tranquillitatis pit, a lava-tube skylight, because it is hot, bare and flat; there is no basalt and no cave within hundreds of kilometres.
- **Anything about the exact spot.** Every value is for the cell. The card states the cell size and that terrain is measured at the cell centre.
- **Whether a surface is ground at all.** Ice sheets score well against the lunar pole and Arcadia (cold, sterile, smooth). The card names the GLiM class ("ice and glaciers") but the score does not know.
- **Ground ice.** Permafrost regions get no credit for it against Arcadia or the lunar pole.
- **Gravity, atmosphere, radiation and day length.** Never scored; listed with their numbers under "Where it breaks down" on every card.

A score is a reason to look at a place, not a finding. The curated sites carry literature-coded geology and a cited rationale; a cell carries neither.

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
| GLiM global lithological map | Rock type shown on the click card (not scored) | Hartmann & Moosdorf 2012, [PANGAEA](https://doi.org/10.1594/PANGAEA.788537) | 0.5° grid of dominant class | CC BY 3.0 |
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

## Findings

Scores are the default-weight match. An asterisk marks an established analog.

### Mare Tranquillitatis pit

| Rank | Site | Match | Best dimensions | Weakest |
| --- | --- | --- | --- | --- |
| 1 | Umm Jirsan, Harrat Khaybar (Saudi Arabia) | 69% | Sterility 95%, sun angle 95%, thermal 91% | Dust and wind 46% |
| 2 | Corona lava tube, Lanzarote* | 66% | Sun angle 99%, thermal 95%, geology 71% | Terrain 26% |
| 3 | Kazumura Cave (Hawaii) | 61% | Thermal 98%, geology 83% | Sterility 0% |
| 4 | Tenoumer crater (Mauritania) | 61% | Sterility 100%, terrain 80% | Geology 25% |
| 5 | Pali Aike (Argentina / Chile) | 60% | Thermal 92%, terrain 83% | Geology 38% |

**The surprise is Umm Jirsan.** It ranks above Lanzarote, the tube astronauts already train in. Both are basalt tubes with collapse entrances, but the ground around Umm Jirsan is bare (vegetation cover 0.05 against 0.38) and gets 27 mm of rain a year against 110 mm. Kazumura and Undara are better tubes geologically and score higher under the lava-tube habitat goal, but both sit under dense vegetation (cover 1.0 and 0.83), which sinks them for any test where the surface matters. The shadowed pit floor holds near 290 K (Horvath et al. 2022), so cave interiors on Earth are a close thermal match: this is the one target where the thermal analogy holds.

### Jezero Crater

| Rank | Site | Match | Best dimensions | Weakest |
| --- | --- | --- | --- | --- |
| 1 | Kaluts, Lut Desert (Iran) | 60% | Sterility 100%, sun angle 92%, terrain 80% | Geology 21% |
| 2 | Emi Koussi, Tibesti (Chad) | 59% | Sun angle 100%, sterility 83% | Geology 20% |
| 3 | Lake Salda shore* | 59% | Terrain 74%, thermal 70%, geology 64% | Sterility 7% |
| 4 | Umm Jirsan (Saudi Arabia) | 59% | Sun angle 98%, sterility 95%, terrain 78% | Geology 14% |
| 5 | Yungay, Atacama* | 58% | Sun angle 99%, sterility 97%, terrain 86% | Geology 6% |

**Two different kinds of analog, and no site is both.** The Lut matches Jezero as a place to drive: slope 1.68° against 1.43°, roughness 14.9 m against 16.9 m, dust optical depth 0.30 against 0.51, and no vegetation. It shares almost none of Jezero's minerals. Lake Salda is the reverse: the only site with olivine-rich rock, carbonates, clays and a delta together, but its surroundings are vegetated (cover 0.93). Under the biosignature goal Salda moves to first; under rover mobility the Lut stays first with the Atacama second.

The starting hypotheses did not all survive. **Dallol** scores 6% on geology against Jezero (acid salts and iron oxides, not carbonates and clays) and is better read as an analog for acid-sulfate Mars than for this crater. **Lonar** has the right rocks for a crater in basalt but is 91% vegetated. **Pilbara** shares four of Jezero's materials but carries too much else to score well on overlap (24%), and has moderate terrain and climate scores.

### Arcadia Planitia

| Rank | Site | Match | Best dimensions | Weakest |
| --- | --- | --- | --- | --- |
| 1 | University Valley, Dry Valleys* | 59% | Sterility 100%, thermal 82%, geology 67% | Terrain 1% |
| 2 | Haughton crater, Devon Island* | 58% | Sterility 97%, thermal 78% | Terrain 28% |
| 3 | Ibyuk pingo, Tuktoyaktuk (Canada) | 57% | Terrain 84%, thermal 73% | Sterility 22% |
| 4 | Dalangtan, Qaidam Basin (China) | 57% | Sterility 100%, sun angle 100%, terrain 79% | Geology 13% |
| 5 | Tenoumer crater (Mauritania) | 57% | Sterility 100%, terrain 88% | Geology 20% |

**The classic analog fails on terrain.** Arcadia is among the flattest ground measured here (slope 0.28°, relief 38 m across 32 km). University Valley is a steep-walled mountain valley and scores 1% on terrain. Tuktoyaktuk is the only site with both massive ground ice and Arcadia's flatness (slope 0.38°, relief 29 m), which makes it the better place to rehearse landing on and drilling through an ice sheet under a thin cover; its tundra vegetation is the cost. Under rover mobility the top three are Tenoumer, Qaidam and Tuktoyaktuk.

### Connecting Ridge, lunar south pole

| Rank | Site | Match | Best dimensions | Weakest |
| --- | --- | --- | --- | --- |
| 1 | University Valley, Dry Valleys* | 58% | Sterility 100%, terrain 73% | Geology 17% |
| 2 | Ward Hunt Island (Canada) | 56% | Sterility 100%, sun angle 69%, terrain 67% | Geology 20% |
| 3 | Haughton crater, Devon Island* | 52% | Sterility 97% | Geology 31% |
| 4 | Tolbachik scoria fields (Russia) | 46% | Sterility 87%, terrain 79% | Geology 18% |
| 5 | Askja, Iceland* | 44% | Sterility 100% | Geology 8% |

**This is the weakest analogy of the four, and the data says so.** The window around the ridge has a median yearly-average temperature of 115 K, 7.6% of it never exceeds 110 K, and the Sun never rises above about 2°. The best Earth site is 128 K warmer on average and sees the Sun 30° to 36° high. Ward Hunt Island, at 83°N, comes within two points of the Dry Valleys and is far less used. **Mistastin** is the one site made of the right rock (anorthosite with impact melt, 71% on geology) and ranks eighth only because boreal forest covers it; for a sampling or geology exercise, as opposed to an operations rehearsal, it is the best choice in the list.

### What the similarity map adds

These are the best-scoring grid cells for each target under default weights (`npm run grid -- --report`), each looked at in Esri World Imagery at about 150 km across before being described. Cell scores leave out geology and ground ice (see [Global grid](#global-grid)), so they run higher than the curated-site scores above and say nothing about rock or minerals. None of these has been checked in the literature: they are places the terrain and climate data single out, with what the imagery shows.

**Connecting Ridge, lunar south pole**

| Cell | Score | What the imagery shows | Verdict |
| --- | --- | --- | --- |
| Northern Ellesmere Island, 81.75°N 75.75°W | 62% | Glaciated mountains with ice-free valleys and a lake basin | Candidate. Cold, sterile (vegetation cover 0), sun never above 32°. Mean surface temperature 251 K (the ridge: 115 K). The same polar desert as Ward Hunt Island, 150 km to the north, with more bare ground |
| Peary Land, north Greenland, 83.25°N 32.25°W | 60% | Ice-free mountains and fjords between small ice caps | Candidate. The northernmost ice-free land on Earth |
| Transantarctic Mountains, 84.75°S 171.75°E | 61% | Snow and blue ice; no bare ground visible at this scale | Not an analog on this evidence: the surface is ice |

The lunar pole remains the weakest analogy: no cell exceeds 62%, and among the best cells thermal similarity does not pass 60%.

**Mare Tranquillitatis pit**

| Cell | Score | What the imagery shows | Verdict |
| --- | --- | --- | --- |
| South-east Libya, 23.75°N 24.25°E | 77% | Featureless sand and gravel plain | Not an analog. It matches the pit's surroundings in terrain, heat and bareness, but there is no lava and no cave |
| North of the Tibesti, 23.25°N 16.25°E | 76% | Sand plain on the Libya–Chad border; GLiM maps basic volcanic rock, but none is visible at this scale | Unconfirmed. Worth checking at higher resolution for the lava GLiM reports |

For this target the map is the least useful: what makes the pit a target is a lava tube, and the grid cannot see one. The top of the list is the eastern Sahara because it is hot, flat and bare. The curated list (Umm Jirsan, Lanzarote, Kazumura) is the better guide.

**Jezero Crater**

| Cell | Score | What the imagery shows | Verdict |
| --- | --- | --- | --- |
| Northern Tibetan Plateau south of the Kunlun, 36.25°N 87.25°E | 76% | High bare plateau: an ice cap, alluvial fans running down to closed lake basins | Candidate. At 5,200 m it has the closest temperatures of the ice-free cells in the list (thermal 84%: mean 267 K against Jezero's 224 K, peak 288 K against 282 K), 54 mm of precipitation a year, and fans and lake basins. Green lake margins are visible, so the cell-mean NDVI of 0.05 hides some wet ground |
| Central Iran, 32.75°N 54.75°E | 73% | Playas, alluvial fans and bare ranges | Candidate. Dry lake beds and fans in a bare basin, about 440 km north-west of the curated Lut site |
| Hadramawt coast, Yemen, 14.25°N 47.75°E | 73% | Dissected bare plateau, a dune field against the coast, wadis reaching the sea | Candidate for terrain and dust (optical depth 0.36 against Jezero's 0.51; 15 mm of precipitation a year). Hot: mean 306 K. Part of the cell is sea |
| Altun Shan foot, 38.75°N 90.25°E | 75% | Bare mountain front with a large alluvial fan | Same region as the curated Dalangtan (Qaidam) site, 100 km away: confirms it rather than adding to it |

The cell next to the curated Yungay (Atacama) site appears in the top ten by itself (73%), which is a useful check on the map.

**Arcadia Planitia**

| Cell | Score | What the imagery shows | Verdict |
| --- | --- | --- | --- |
| Selima sand sheet, Egypt–Sudan border, 22.25°N 29.25°E | 73% | Flat, featureless sand sheet; centre-pivot farms at its northern edge | Candidate for terrain only. Slope 0.21° and relief 44 m across 32 km against Arcadia's 0.28° and 38 m, 1 mm of precipitation a year; but its mean temperature is 303 K against 203 K, and there is no ground ice: the reverse of what makes Arcadia a resource site |
| East Antarctic plateau, 78.75°S 115.25°E | 71% | Featureless ice sheet | Partial. As flat as the Selima cell, cold (mean 218 K against 203 K) and literally a thick ice sheet, but the surface is ice, not a dry cover over ice. No vegetation data, so scored on five dimensions |
| Western Qaidam, 38.25°N 92.25°E | 70% | Bare, wind-streaked basin floor | Same region as the curated Dalangtan site |

Because the grid has no ground-ice data, the map cannot find what Arcadia is wanted for. Tuktoyaktuk and the Dry Valleys, which have the ice, stay the reference analogs; the map adds only places that are as flat.

**Under the rover-mobility goal** the best cell for Arcadia moves to 19.75°N 3.75°E in southern Algeria (84%), which was not checked against imagery.

## Using it

| Action | Mouse / keyboard | Touch |
| --- | --- | --- |
| Rotate | Drag | Drag |
| Zoom | Wheel, or the + / − buttons | Pinch |
| Tilt | Ctrl + drag, or middle-drag | Two-finger drag |
| Fly to a point and compare it | Click | Tap |
| Search | Click the search field or press `/` | Tap the search field |
| Whole globe | Globe button (bottom right) | Same |
| Show or hide the target bar | Button left of the layers button | Same |
| Choose the target and mission goal | Target bar, top left | Target bar, under the top bar |
| Similarity map | Switch in the target bar (Earth only) | Same |
| Ranked curated sites | "27 curated sites, ranked" in the target bar | Same |

On Earth, search accepts country and city names and coordinates. On the Moon and Mars it accepts coordinates. White dots mark the curated sites on Earth and the targets on the Moon and Mars. Every control is a button, switch or select with a name, reachable with Tab; on a phone the reading card is a sheet at the bottom of the screen.

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
  state/store.ts             Small external store (settings, planet, selection, atlas state)
  state/navigation.ts        Switching planet and flying to a place on another world
  analog/
    scoring.ts               The similarity functions, shared by the build scripts and the browser
    data.ts                  Types for analogs.json, mission-goal presets, ranking
    grid.ts                  Loads grid.bin, looks up and scores a cell, paints the similarity map
    Radar.tsx                SVG radar chart
  components/
    TargetBar.tsx            Target, mission goal, similarity map and legend, ranked list (left)
    InfoCard.tsx             The reading card (right): clicked place against all four targets
    AnalogCard.tsx           Full card of a curated site
    Comparison.tsx           Radar, "What matches" and "Where it breaks down", used by both cards
    ...                      Planet switcher, search, layers menu, readout, zoom buttons
  globe/
    planets.ts               What differs per world: ellipsoid, imagery, atmosphere, Earth-only services
    GlobeController.ts       Owns the Cesium viewer for one world
    imagery.ts               Imagery providers (Esri, GIBS, Trek), overlays, fallback chain
    imageryCatalog.ts        Names of imagery sources and overlays (no Cesium import)
    terrain.ts               Earth terrain; cuts Esri tiles into 65x65 sub-tiles
  geo/                       Natural Earth lookup, Nominatim client, coordinate parsing
scripts/
  analog-sites.mjs           Targets, Earth sites and everything taken from literature, with citations
  common.mjs                 Download cache, polite HTTP, the 450 m terrain analysis grid
  build-analogs.mjs          Measures and scores the curated sites; writes public/data/analogs.json
  build-grid.mjs             Measures every land cell; writes public/data/grid.bin
  grid-terrain.mjs           Terrain per cell from the Copernicus GLO-90 overviews
  grid-modis.mjs             Global MODIS temperature and NDVI through Earthdata OPeNDAP
  build-geodata.mjs          Builds the Natural Earth files
```

`GlobeController` takes a planet id. Everything that used to assume Earth (WGS84, ground atmosphere, night lights, the label overlay, Esri terrain, polar caps, Natural Earth and Nominatim lookups) is behind `planets.ts`. Switching planet destroys the viewer and builds a new one on that world's ellipsoid; a pending "arrival" in the store tells the new globe where to fly. Camera distances scale with planet radius.

The Earth rendering path, its performance work (render on demand, terrain tile subdivision, adaptive quality) and its measurements are unchanged from the original globe.

## What was verified

Automated runs in installed Edge (headless, hardware WebGL) against the dev server, pinned to the Intel integrated GPU with `--use-adapter-luid`. WebGL renderer reported: `ANGLE (Intel, Intel(R) UHD Graphics (0x0000A788) Direct3D11 vs_5_0 ps_5_0, D3D11)`. Viewports 1440×900 and 390×844 with touch.

- **Clicks on land.** Lut Desert (a curated site), Rub' al Khali, Amazon, Greenland ice sheet, northern Tibet and a real mouse click in Niger each show four target scores, the radar for the best match, "What matches" and "Where it breaks down" with gravity, atmosphere, radiation and day length. Example: the Lut cell scores 35 / 68 / 67 / 58% against the lunar pole, the pit, Jezero and Arcadia; the Amazon 14 / 50 / 44 / 48%.
- **Clicks on ocean.** Atlantic and Pacific points say there is no ground to compare.
- **Curated link.** The Lut click offers "Full analog card: Kaluts (0 km away)", which opens the curated card.
- **Similarity map.** Renders for each of the four targets with the legend (≤20%, 45%, ≥70%) and a best-cell link; changing the mission goal changes the map; the best-cell link flies there and opens the comparison.
- **Layout.** At 1440×900 the target bar ends at 328 px and the planet's disc starts at 366 px; the reading card ends 16 px above the zoom buttons. At 390×844 there is no horizontal overflow and the reading card is a bottom sheet (top at 439 px).
- **Existing flows.** Ranked list and its re-ordering by mission goal; curated card; "Fly to target" lands on Arcadia on Mars (40°N, 160°W) and "Fly to Earth analog" returns to the Dry Valleys; a click on the Moon; search by name (Jordan) and by coordinates; all four GIBS overlays with no failed requests; terrain, day and night, labels and atmosphere switches; three imagery sources.
- **Console.** No errors in any run.
- `npm run build` passes, and the Earthdata token does not appear in `dist/`.

**Frame rate on the Intel UHD** (frames drawn per second while the camera turns steadily for six seconds; two runs):

| View | Similarity map off | Similarity map on |
| --- | --- | --- |
| Whole globe | 77 and 91 | 74 and 75 |
| Regional (about 220 km across) | 70 and 77 | 66 and 73 |

The map is one extra imagery layer and costs about 4 frames per second in the regional view; the whole-globe figures vary more between runs than the map changes them. The first time a target's map is shown, scoring 92,172 cells blocks the page for a moment; the time was not measured.

Not verified: screen-reader output (roles, names and states are set and every control is reachable by keyboard, but no screen reader was run), and widths between 640 and 1440 px.

## Known limitations

**Science**

- **Coarse climate grid.** Precipitation, wind, dust and water vapour come from a 0.5° grid, about 50 km. Where climate changes sharply over that distance the value is wrong for the site: Dallol reads 447 mm of rain a year because its cell includes the Ethiopian escarpment, and Mauna Kea's dry summit reads 1,609 mm from the wet slopes below. Both sites would score higher on dryness with a finer dataset.
- **Mineralogy is coded from papers, not measured.** The geology score depends on a 17-term vocabulary and on which materials were judged dominant. It is the most subjective dimension. Citations in `scripts/analog-sites.mjs` should be checked against the papers before formal use; only the six papers behind target values were checked against their abstracts.
- **Mars climate is a model.** The Mars Climate Database is a validated general circulation model, not a measurement, and it is not a NASA product.
- **Grid cells are scored on fewer dimensions than curated sites** (no geology, no ground-ice class), so their scores are higher and not comparable. See [Global grid](#global-grid).
- **One year of MODIS.** Earth temperatures and vegetation are from 2023 only.
- **Terrain at 450 m.** The pit itself (100 m across), lava-tube entrances, yardangs and polygons are below the grid. Landforms enter only through the geology tags.
- **Point sites.** Each site is one coordinate and a 32 km window. A site such as Lake Salda scores as vegetated because its surroundings are, though the shoreline itself is bare.
- **Lunar pit temperature** is the modelled 290 K of the shadowed floor. Cave temperature on Earth is inferred from the surface annual mean, not measured in the cave.
- **Sun angle** uses only latitude and tilt, not local horizon. It is lenient: 30° of difference still scores 67%.

**Application**

- **Moon and Mars are smooth globes** with no 3D terrain, evenly lit, with no place names. The mosaics run out of detail below about 12 km (Moon) and 25 km (Mars), so the camera stops there.
- **Below about 1,380 px wide** the target bar and the reading card start to overlap the edge of the planet in the whole-planet view; at 1,440 px and wider they clear it.
- **The click card does not refine terrain** from the elevation mesh under the camera (it was optional): terrain is always the 32 km window at the cell centre.
- **Science overlays are fixed months** (July 2026, and January 2026 for snow), not a time series, and show the GIBS colour scale without a numeric legend (the similarity map has one).
- **Public services.** Trek, GIBS, Esri and Nominatim are shared public endpoints with fair-use limits. A tile request occasionally fails and is logged by the browser; the globe keeps the coarser tile.
- The original globe's limits still apply on Earth: polar caps beyond 85° without a Cesium ion token, Natural Earth's boundary choices, softer labels on phones, and a reload prompt if the WebGL context is lost.
