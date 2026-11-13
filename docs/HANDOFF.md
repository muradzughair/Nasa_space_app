# HANDOFF

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
