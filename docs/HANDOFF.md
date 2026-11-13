# HANDOFF

## Ground realism run (2026-11-13): state at the end

**What is real now.** Jezero and Gale show their real 1 m HiRISE elevation (2 km patch at 0.98 m, real 10 km context ring at 62.5 m), cut from the two local files by `pipeline/fetch_windows.py`. Apollo 11 shows the NASA 3D Resources height map (about 115 m, relief about 5 m in the patch, fine detail synthetic and labelled). The lunar south pole and all 144 Earth hotspot grounds are still demo terrain, and no site has imagery yet. Every ground says which of these it is in a badge on its pane.

**Why the rest is missing.** The build environments (the cloud workspace and the workspace on the project computer) could not reach any data host: USGS, NASA PGDA, LROC, NASA Trek, Copernicus on AWS and EOX all answer HTTP 403 from the network policy. Reading them through the browser was refused as a way around that policy and was not done. Nothing is wrong with the links that were read (see REFERENCES.md, "Ground realism run").

**How to get the rest (one command, on a machine with normal internet).**

```
pip install numpy scipy pillow rasterio
python pipeline/fetch_windows.py --check-urls        # one small request per source; prints what answers
python pipeline/fetch_windows.py --sites targets --force
python pipeline/fetch_windows.py --sites earth        # all 144 hotspots; --limit 20 for a first batch
node --experimental-default-type=module tests/ground_check.mjs
```

Or allow these hosts in the workspace network settings and ask for the fetch to be run again: planetarymaps.usgs.gov, asc-pds-services.s3.us-west-2.amazonaws.com, pds.lroc.im-ldi.com, pgda.gsfc.nasa.gov, trek.nasa.gov, copernicus-dem-30m.s3.amazonaws.com, tiles.maps.eox.at. Or download by hand into `data/raw/sites/<site>/` (the fetcher prefers local files): the Jezero and Gale orthomosaics, `NAC_DTM_APOLLO11.TIF` (113 MB) and its 50 cm orthophoto into `moon_a11`, `ldem_87s_5mpp.tif` into `moon_sp`. The remote code paths (range reads, WMTS, GLO-30 tiles) are tested only on format-faithful synthetic files (`python pipeline/test_fetch_windows.py`); the first real run may need a small fix, and two links are marked `verified: false` in `pipeline/sites.json`.

**What changed in the app**

- `app/js/terrain.js`: `prepareReal` loads and decodes a site's real tiles (16-bit, delta coded, gzip; local files only); `getPatch` returns the fine grid as `p.U` (what is drawn and what the wheels touch) and the context ring as `p.C`; `worldH` uses the real ring beyond the patch.
- `app/js/ground.js` (new): level-of-detail tiles of the fine grid (16 x 16 tiles on a 2049 grid, strides 1 to 32 chosen by distance, about 4 ms of building per frame, nearest first), edges stitched to the coarser neighbour so there are no cracks, the real context ring with the patch cut out, rule-based rocks near the rover (fixed seed), fading wheel tracks.
- `app/js/contact.js` (new): one pose routine for the Site View playback and for drive mode. Wheel contacts are bilinear samples of the fine grid, the body is a plane fit through them, each wheel travels on its own to stay on the ground, the computed sinkage lowers the wheels, tracks are laid behind the rear wheels. The models have wheel nodes but no rocker or bogie nodes, so this is the plane-fit fallback, not a rocker-bogie linkage.
- `app/js/site.js`: ground material rewritten (image drape when a site has imagery, generic photo grain near the camera, lighting and the Slope and Elevation views from a slope texture of the fine grid, so relief looks the same at every level of detail), provenance badges, sun azimuth is now a compass bearing (real sites are north-up), vertical exaggeration scales the ground instead of rebuilding it.
- `app/js/sim.js`: the route analysis samples the fine grid (HUD tilt and slip come from the surface the wheels touch). Route planning still uses the 129 grid. `app/js/drivemode.js`: shared pose routine, level of detail follows the drive camera, driving is always at true scale. `app/js/main.js`: About rows from the provenance fields. Build id in `app/index.html` is now `20261113b`.
- Scoring, the globe and the hotspot lists were not touched.

**Rules to keep**

- A ground may be called real only through the fields `fetch_windows.py` writes (`elevation_source`, `elevation_resolution_m`, `imagery_source`, `imagery_resolution_m`, `synthetic_fine`, `date_built`, `real`). Demo patches keep `synthetic_base: true` and the demo badge.
- Anything that needs a height must go through `surfaceH` / `worldH` / `upsample(p)` so the view, the physics and the HUD stay on the same grid.
- New code that changes what is on screen calls `wake()`; `Ground.update` must run every drawn frame (it returns the number of tiles still to build).

**Known limits**

- No imagery anywhere yet, so real grounds are drawn with the generic photo texture over the real relief. The image drape code path has only been run on synthetic test tiles.
- Apollo 11: the STL model's centre and orientation are assumed (centre = landing site, +y = north); at 115 m spacing the patch is almost flat. The 2 m NAC DTM replaces it as soon as it can be fetched.
- Rocks are illustrative and the wheels do not feel them. Sinkage is millimetres to centimetres, so it is barely visible; tracks are the visible sign.
- Real-GPU frame rate is still unmeasured (software renderer only). The rover view draws about 200,000 to 400,000 triangles per real ground; lower it with `?lod=0.05` in the address if the demo laptop stutters (default 0.03, smaller is finer).
- The first Site View open of a real site fetches and decodes about 2.8 MB of heights (about 0.6 s here).

---

## Fix and optimize run (2026-11-13): state at the end

**Rule: init must not abort on a rover failure.** `openSite` (site.js) builds every part inside `guard()`; a failing registry, rover model, texture, panel or drawing step logs to the console, writes a plain "Could not load X: reason" into its own panel and into the note bar (`#siteNote`), and the terrain and render loop carry on. Keep it that way when adding code to `openSite`.

**Root cause of the blank Site View.** `main.js` `openHotspot` wraps `openSite` in `try { ... } catch (e) { console.error(e); }` and then shows the site anyway. Any exception inside `openSite` therefore left the toolbar visible, both canvases black and the Compare, Explanation and Rover simulation panels empty. The exception reproduced here (exact match of the screenshot) was `TypeError: raw.rovers.forEach is not a function` at `rovercfg.js:30` (`loadRegistry`), called from `rovers.js:13` (`initRovers`) and `site.js:270` (top of `openSite`, before anything was drawn), when the registry that reached the page was the old `rover_params.json` format (what a browser that kept an old cached `data.js` loads). With the delivered files and a clean cache the app opens fine for every site and rover (smoke test), so the exact trigger on your machine could not be observed; the classes of failure that produce this symptom are now all non-fatal.

**What changed**

- Failure handling: new `app/js/fallback.js` (built-in stand-in registry, one generic rover), `rovers.js` (`initRovers` falls back; `createInstance` falls back to a box-with-wheels rover and sets `R.modelError`), `site.js` (`guard`, `guardAsync`, `siteNote`, `failPanel`; plain ground material if textures fail; render loop re-armed first and the simulation part wrapped so terrain keeps drawing), `data.js` (registry fetch is optional), `main.js` (message in the note bar if `openSite` itself throws), `index.html` (`#siteNote`), `style.css`.
- Stale-cache protection: `index.html` has an import map that appends `?v=<build id>` to every module URL and the entry script; `data.js` fetches JSON with `cache: 'no-cache'`. **When you release changed JS, bump the build id in the import map and the `main.js?v=` line** (both in `app/index.html`).
- Tests: `tests/smoke_site.mjs` (3 sites x 4 rovers, pixel sampling, panels, console and request errors, drive mode open and exit; `--inject` adds injected failures; output `tests/smoke_site_output.txt`) and `tests/perf_site.mjs` (measurements, see PROGRESS.md).
- Performance: render on demand (a frame is drawn only while playing, animating, orbiting, or for 1.5 s after any input or state change; call `wake()` from any new code that changes what is on screen), pixel ratio capped at 1.5 (`?hq` in the address for 2), everything disposed when leaving Site View (this was a leak of about 19 MB of JS heap and 2 textures per open/close), terrain colour buffers cached per view mode and a shared index buffer, `analyze` and `planRoute` cached per (patch, inputs), customize-drawer changes debounced by 100 ms, HUD without per-frame DOM queries, `patches.bin` (4.9 MB) fetched when a hotspot is clicked instead of at start, ground textures and the renderer prepared during the globe fly-in (`prewarm`).
- Not done: Web Worker or chunked route planning (planning plus analysis blocks the main thread 90 to 135 ms per rebuild on the software-render machine, debounced, so it was left alone); the two views already share one renderer with scissor viewports.

**Unverified here**: real-GPU frame time (the sandbox only has a software renderer, about 0.25 frames per second while rendering, so the "no frame over 33 ms" target cannot be shown; triangles and draw calls per frame are in PROGRESS.md), real GPU memory, and the first render time on a real laptop.

---

## Rover fleet and customization (2026-11-13): state at the end

R1 to R5 are done. See PROGRESS.md for the details and REFERENCES.md for sources.

**What changed**

- New: `assets/models/rovers.json` (registry, replaces `rover_params.json` in all code), `assets/models/{perseverance,curiosity,lunar_generic}.glb`, `model_report.json`, `previews/`, `pipeline/build_rover_models.py`, `pipeline/render_rover_previews.py`, `tests/model_view.html`, `tests/rover_tests.mjs` (+ output), `app/js/{rovercfg,soilmech,rovers,roverui}.js`.
- Edited: `sim.js` (analyze takes `S`, Bekker term, power-capped speed, blockers; verdict rows), `drive.js` (soil term, readout sinkage and pressure), `site.js` (rover instances, apply build, rover bar), `drivemode.js` (rover line on the chooser, wheel pose), `data.js`, `main.js` (About rows), `index.html`, `style.css`.
- Data flow: registry row + overrides -> `effective()` in `rovercfg.js` -> one flat config read by sim.js, drive.js, soilmech.js and the views. No per-rover branches. To add a rover: drop a GLB with named wheel nodes into the pipeline table, add a row to `rovers.json`, add a preview.
- Rebuild models: `python3 -I pipeline/build_rover_models.py` (needs `pip install bpy` and `npm i -g @gltf-transform/cli`; sources in `_local/rover_sources`, not in the repository), then `python3 pipeline/render_rover_previews.py`.
- Tests: `node --experimental-default-type=module tests/rover_tests.mjs` and `tests/physics_check.mjs`.

**Known limits and open items**

- No Apollo LRV or VIPER model: not reachable from the build sandbox. The Moon rover is a generic one made from primitives and labelled so. If a model is added later, put the source in `_local/rover_sources`, add it to the pipeline table and set `planet: moon`.
- Many figures are assumed (shown with an "assumed" tag): wheel width, motor power, battery, base power, drive force, drive efficiency, ground clearance for the Mars rovers; every lunar figure. Curiosity mass 899 kg is recalled, not verified. Soil constants are assumed, simplified values; the sinkage model has no bulldozing, shear or grousers.
- Model sizes: the Curiosity GLB is 3.95 m long (about 2.9 m real body, the arm is included) and the Perseverance GLB is 1.85 m high (about 2.2 m real). Wheel sizes match.
- The preset drive force and the 3000 Wh Mars battery are tuned so the default route completes; they are assumptions, not published figures. The reachability verdict is a screening result (one battery charge, no recharge).
- Real DualSense and real-GPU performance were not tested; headless Chromium with a software renderer was used.
- The old line "only the lunar rover's wheels visibly rotate" no longer applies: all three models have named wheel nodes that spin and move with the contact fit.

---

## Drive mode (2026-11-13): state at the end

D1 to D5 are all done and the app is runnable. Nothing is half done. Pipeline and scoring were not touched; the automatic Site View simulation still works after drive mode (checked: enter and exit drive on both grounds, then play the simulation to a verdict).

**What changed**

- New: `app/js/drive.js` (physics), `app/js/input.js` (controller and keyboard), `app/js/drivemode.js` (chooser, full screen, camera, HUD, comparison view), `tests/physics_check.mjs` (+ `tests/physics_check_output.txt`), `MANUAL_TEST_DRIVE.md`.
- Edited: `site.js` (Drive button, `V.drive` frame hook, rotating lugs on the procedural rover wheels, exports `refreshAfterDrive`), `sim.js` (exports `contactFit` and `crrFromSoil`, used by both the analysis and drive mode; numerically the same code as before), `index.html`, `style.css`, `rover_params.json` (new fields below).
- How to use: open a hotspot, press Drive, pick a ground, drive. H shows the controller map. Esc or Circle leaves.

**Unverified parameters (all `verified:false` in `assets/models/rover_params.json`, with a source entry, and flagged in the drive footer)**: `drive_force_max_N` (Perseverance 1600, lunar generic 700), `drive_power_max_W` (150, 200), `base_power_W` (60, 80), `battery_wh` (250, 300; an illustrative energy budget, not a real pack). They are assumptions chosen to be plausible; check them against NASA rover documents before quoting any result. The friction coefficient and soil resistance come from the existing site traits (demo data).

**Known limits**

- Real DualSense behaviour was not tested (no controller here); a mock standard-mapping gamepad was used. Follow `MANUAL_TEST_DRIVE.md`. Button numbers follow the standard mapping; PS and Create may be intercepted by the OS or browser on some systems (H and I keys work as alternatives).
- Frame rate on a real GPU and real full-screen output were not measured; tests ran on a software renderer. The comparison view refreshes its shadows every third frame to save time. If it stutters on the demo laptop, turn the comparison off (Triangle) or reduce the shadow map in `buildSide` (site.js).
- The model is a screening model, not a validated rover simulation: no suspension dynamics, no wheel-soil sinkage model beyond a rolling resistance coefficient, single friction circle. The footer says so.
- Same mass on both grounds by default, so the Perseverance model on Earth barely moves (it weighs 6 times more on Earth, which is the point of the comparison); the optional "Equal wheel load on Earth" toggle gives the Earth rover the target's wheel load.
- Only the lunar rover's wheels visibly rotate (the Perseverance GLB has its wheels fused into one mesh).
- The drive area is the data patch (about 2 km); a 3 m margin stops the rover and the HUD shows "Edge of the data patch".
- Vibration uses the dual-rumble effect (Chrome and Edge); no adaptive-trigger claims.

**Next steps**: (1) run `MANUAL_TEST_DRIVE.md` with the real DualSense over USB and Bluetooth; (2) check frame rate and shadow settings on the demo laptop; (3) verify the four new rover parameters; (4) republish the hosted artifact if wanted (it is an old snapshot).

---

## Polish run (2026-11-08): state at the end

Four weaknesses were fixed without touching the pipeline or the scoring. Everything is runnable; nothing is half done.

- **P1 globe**: `app/js/globeview.js` rewritten on the vendored Three.js. Real Earth (earth_day.jpg, topography bump, ocean specular), country borders from countries.geojson, ocean / continent / country labels, atmosphere rim, local starfield. The heat map is a separate overlay clipped to the coastline with an on/off toggle, an opacity slider and a legend. Clouds were skipped on purpose (they hide data).
- **P2 transitions**: eased 1.2 s fly-to, veil with hotspot name and loading indicator, cross-fade into Site View, reverse trip back to the same globe view, panel and heat-map fades, `prefers-reduced-motion` support (`--dur`, `motion.scale`).
- **P3 Site View**: two cameras with their own orbit controls (Link views, Follow rovers), clamps so the camera never goes under the ground, normalised heights, both rovers placed on the rendered surface and visible, PBR ground from local textures, per-body sky, fog, sun and shadows, playback controls, live HUD and comparison bars, verdict overlay.
- **P4 UI**: design-system stylesheet (`app/style.css`), local Inter font, collapsible panels, first-run hint, About brief, per-trait data-quality popover, accessibility basics. See PROGRESS.md for details and the verification list.

**Missing assets: none.** All polish assets were present (earth_day.jpg, earth_topology.png, earth_water.png, countries.geojson, the two Poly Haven ground sets, NASA Eyes references). Inter was copied from the npm package `@fontsource-variable/inter` into `app/fonts/`.

**Known limits (polish run)**

- Terrain shape, climate and soil are still synthetic demo data (labelled everywhere). Real data replaces them through the pipeline as before.
- The ground photo textures are decorative; only the tint follows the site traits (Earth: pale for cold sites, sandy for dusty ones). The Site View says so.
- Surroundings beyond the 2 km data patch are mirrored copies of the patch (labelled), so frames never show an empty background.
- At about 140 m the rover is a few pixels; a cone marker shows where it is (hidden below 70 m). Scrubbing the timeline does not move the camera unless Follow rovers has been engaged by Play or Reset view.
- At medium distance the Moon ground texture shows a faint repeating pebble pattern (two rotated scales plus macro variation reduce it; it is not eliminated).
- `app/vendor/globe.gl.min.js` is no longer loaded by the page; it can be deleted.
- Verified on a software renderer at a few frames per second; frame rate on a real GPU was not measured. If the demo laptop stutters, remove `castShadow` in `buildSide` (site.js) or lower the shadow map size.
- Clouds, atmosphere scattering and a HiRISE-quality Mars ground were not attempted.
- The hosted private page (claude.ai artifact) is a snapshot of the old build and needs republishing to show this polish; the local copy in the project folder is current.

**Next steps (polish)**: (1) look at it on the demo laptop's real GPU and tune shadow size and context-tile detail; (2) when real DEMs arrive, check the Earth tint rule and the normal-map strength per body; (3) republish the hosted copy if it is still wanted (copy the new textures, fonts and geojson, rename the binaries to .wasm as before).

---

## Build session (original handoff)

Written at the end of the build session. The app is complete and runnable on **demo data**; the real datasets could not be downloaded. Nothing is left broken.

## What works and how to verify

Run `python -m http.server 8000` in the project root and open http://localhost:8000/app/ .

1. Globe heat map, 4 targets (lunar south pole, Apollo 11 mare, Jezero, Gale) x 4 purposes (rover, habitat, thermal and dust, custom sliders), 20 ranked hotspots per list, numbered markers. Custom sliders re-score in the browser.
2. Click a hotspot: Site View with the target terrain left and the Earth terrain right, one shared camera and sun, slope / elevation / plain colouring, vertical exaggeration, level of detail, shadows. Per-trait comparison table and an explanation built only from the numbers.
3. Run simulation: A* routes on both terrains (same start and goal), Perseverance model on Mars targets and a procedural rover on lunar targets, live tilt / slip / energy / time, charts, verdict with match score, mismatch list and a recommendation. Gravity-driven metrics (wheel load, energy at equal mass) are labelled "gravity", not mismatches. Friction sliders and an equal-wheel-load test-mass option are provided.
4. About panel lists every source with status. Demo badge shows while data is synthetic.
5. Automated checks run during the build (headless Chromium): all 12 preset lists have 20 hotspots; custom weights re-rank; stand-in terrain for hotspots without a tile; full simulation on Mars and Moon targets; reset, back and reopen; About; no console errors; the app contacts only its own server.
6. `python pipeline/test_readers.py` passes (PDS3 LOLA-style and PDS4 MOLA-style readers on format-faithful synthetic files, window features on a 10 degree plane).

## What is partial

- **All terrain and climate numbers are synthetic demo data** (see PROGRESS.md decision 1 to 2). Analog ranks (Atacama, Haughton, Death Valley) are not meaningful on demo data; `validate.py` says so.
- Real-data readers exist but have only been tested on synthetic files, never on real NASA files.
- Terrain patches are synthetic stand-ins with slope statistics taken from the traits; fine roughness is synthetic by design and labelled.
- AI explanations are cached template sentences (no `/.env` key was present). The language-model path is written but untested.
- Rover figures marked `verified: false` in `assets/models/rover_params.json` (Perseverance mass and speed, all lunar-rover figures, drive efficiency) need checking against NASA sources.
- Lunar polar target on real data: the 16 pixel/degree cylindrical LOLA grid is distorted near the pole; a polar-stereographic LOLA product (pgda.gsfc.nasa.gov products 78/90) should be used for that window.

## What is missing

- Real data: LOLA LDEM_16 / LDSM_16 / LDRM_16, MOLA `megt90n000eb.img`, ETOPO 2022 60 arc-second (links in README).
- Copernicus GLO-30 windows for the top hotspots, Jezero and Gale HiRISE/CTX terrain, LOLA 5 m south pole tiles.
- Temperature (MODIS MOD11 via AppEEARS, Diviner, THEMIS), geologic maps and soil datasets; these traits are placeholders.
- Checking dataset names and licences against the challenge Resources tab (not yet added to resources.md).
- "Could" features: natural-language search, PDF site report, custom pin targets. Imagery colouring is disabled (no imagery tiles).

## Exact next three steps

1. Obtain the data (allow the data hosts in the network settings, or download the files by hand into `data/raw/moon`, `data/raw/mars`, `data/raw/earth`), then run `python pipeline/run_pipeline.py` and `python pipeline/validate.py`. Check that Atacama, Haughton and Death Valley rank near the top for the Mars targets; if not, review trait weights before the demo.
2. Replace the stand-in Earth patches with Copernicus GLO-30 windows for the top hotspots (cut 2 km x 2 km, resample to 129 x 129, write into `patches.bin` with `synthetic_base: false`), and do the same for Jezero and Gale; keep the labelled synthetic fine roughness.
3. Add real temperature, soil and dust layers (MODIS / Diviner / THEMIS / geology), verify the `verified: false` rover figures, add an `/.env` key to cache language-model explanations, then rehearse the live demo on the demo laptop.

## Commands

```
python -m http.server 8000          # then open http://localhost:8000/app/
pip install numpy scipy pillow global-land-mask
python pipeline/run_pipeline.py [--demo] [--no-llm] [--patch-km 2]
python pipeline/validate.py
python pipeline/test_readers.py
```

## Files changed most recently

`app/js/site.js` (rewritten in P3), `app/js/globeview.js` (rewritten in P1), `app/js/main.js`, `app/index.html`, `app/style.css`, `app/js/terrain.js`, `app/js/sim.js` (route cost, chart smoothing, follow camera, patch-size scaling), `pipeline/run_pipeline.py` (`--patch-km`), `pipeline/terra.py` (roughness edge fix, hotspot picking), `README.md`, `HANDOFF.md`, `PROGRESS.md`, regenerated `data/processed/*` and `data/manifest.md`.

## Open issues

- Wheel load and energy depend on gravity by design; the verdict shows them as "gravity" rows. The overall match score uses only terrain-driven metrics.
- Charts are smoothed over about 9 samples (18 m) for display; the metrics themselves are not smoothed.
- Hotspots from custom weights that have no precomputed tile (tagged "live") get a stand-in generated in the browser with a different random pattern than the pipeline tiles.
- The simulation is a screening model (single friction coefficient, no sinkage) and is not validated against a real rover; the UI says so next to the verdict.
- On weak integrated graphics the shadow map (2048) may be heavy; remove `castShadow` in `buildSide` if the demo laptop stutters.

## Assumptions made (details in PROGRESS.md)

Demo data approach (your choice); Apollo 11 as the mid-latitude Moon site (your choice); dark map-centred design and a static web app plus short live demo (notes.md defaults); 9 traits, common 2 km scale, 0.5 degree Earth cells; hotspots at least 7 degrees apart; 129 x 129 patches over 2 km; friction from a placeholder soil proxy; Perseverance model compressed to 2.85 MB.
