# TerraAnalog

Finds places on Earth that resemble a Moon or Mars site, shows them on a world heat map, opens any hotspot as linked 3D terrain next to the target, and runs a rover simulation on both. Worldwide scope. Project state and next steps: `docs/HANDOFF.md`; build log: `docs/PROGRESS.md`.

**Current data state: DEMO DATA.** The real NASA/USGS/NOAA files could not be downloaded when this was built (the data hosts were blocked). Terrain, climate and soil values are synthetic placeholders; only the Earth land shape is real. The app shows a DEMO DATA badge and the About panel lists every source and its status.

## Run the app

```
python -m http.server 8000        # run in the project root (not in /app)
# open http://localhost:8000/app/
```

Everything is static files; no live data download and no back end. A local server is needed because browsers block `fetch()` from `file://`. Any static host works if it serves the project root.

## Run the pipeline

```
pip install -r requirements.txt
python pipeline/run_pipeline.py              # real files in data/raw if present, otherwise demo data
python pipeline/run_pipeline.py --demo       # force demo data
python pipeline/validate.py                  # analog ranks and weight-perturbation stability
python pipeline/test_readers.py              # checks the real-file readers on synthetic files in the right formats
```

Optional: copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY=...` (and optionally `TERRA_LLM_MODEL`) to have a language model phrase the cached explanations from the computed numbers. Without a key, template sentences are cached. Keys never go into source files.

## Switch to real data

Put the files here (keep each `.LBL` beside its `.IMG`), then rerun `python pipeline/run_pipeline.py`:

| Folder | Files | Source |
|---|---|---|
| `data/raw/moon/` | `LDEM_16.IMG/.LBL`, `LDSM_16.IMG/.LBL`, `LDRM_16.IMG/.LBL` (about 33 MB each; never `LDEC_*` or `LDAC_*`) | https://imbrium.mit.edu/DATA/LOLA_GDR/CYLINDRICAL/IMG/ |
| `data/raw/mars/` | `megt90n000eb.img` (label `megt90n000eb.xml` is already there) | https://pds-geosciences.wustl.edu/mgs/urn-nasa-pds-mgs_mola_topography_derived/meg016/ |
| `data/raw/earth/` | ETOPO 2022 60 arc-second GeoTIFF, file name containing `ETOPO` and `60s` | https://www.ncei.noaa.gov/products/etopo-global-relief-model |

With real terrain files the four terrain traits become measured; temperature, soil and dust stay placeholders until MODIS / Diviner / THEMIS / geologic maps are added. Terrain patches stay synthetic stand-ins until Copernicus GLO-30 windows are cut for the hotspots (see HANDOFF.md).

## Real ground for Site View

`pipeline/fetch_windows.py` cuts the real elevation and imagery for each site (2 km patch plus a 10 km context ring), reprojects them to a local metric grid and writes small tiles under `data/processed/sites/`. It prefers local files in `data/raw/sites/<site>/` and otherwise reads remote files with range requests; sources and licences are in `pipeline/sites.json` and `docs/REFERENCES.md`. The app itself never uses the network.

```
pip install numpy scipy pillow rasterio
python pipeline/fetch_windows.py --check-urls
python pipeline/fetch_windows.py --sites targets      # the four targets
python pipeline/fetch_windows.py --sites earth        # Earth hotspots (--limit 20 for a first batch)
python pipeline/test_fetch_windows.py                 # self-test on synthetic rasters
node --experimental-default-type=module tests/ground_check.mjs
NODE_PATH=$(npm root -g) node tests/previews.mjs      # rover-camera screenshots into tests/previews/
```

Today Jezero and Gale have real 1 m elevation, Apollo 11 a coarse real height map, and everything else is labelled demo (see `docs/HANDOFF.md`).

## Drive mode

In Site View press Drive, choose the target ground or the Earth hotspot, and drive the rover yourself (PS5 DualSense, other standard gamepads, or the keyboard: W A S D, Space, R, V, Esc; H shows the full map). A small picture-in-picture shows the same inputs on the other ground, with a live comparison of speed, tilt, slip, power and energy. Physics checks: `node --experimental-default-type=module tests/physics_check.mjs`. Real-controller test: `docs/MANUAL_TEST_DRIVE.md`. Drive-force, power and battery figures are unverified assumptions (see `assets/models/rovers.json`).

## Rover fleet

Four rovers can be chosen on the site view and on the drive start screen: Perseverance and Curiosity (REAL), Scarecrow (TEST ROVER, the Curiosity geometry with the mass JPL built it to have on Earth) and a generic lunar rover (GENERIC, not a NASA rover). **Customize** changes wheel size and width, wheel count, mass, motor power, battery and top speed; these change sinkage, speed, energy and the verdict through a simplified Bekker-style soil model (assumed, simplified soil constants). Any change flips the badge to CUSTOM; a custom build is not a real mission rover. Builds can be saved and loaded as JSON. **Compare two builds** drives the same route with build A and B on one ground. Every figure that is not verified is tagged assumed. Registry: `assets/models/rovers.json`. Models are rebuilt with `python3 -I pipeline/build_rover_models.py` (needs `bpy` and `@gltf-transform/cli`). Tests: `node --experimental-default-type=module tests/rover_tests.mjs`.

Site View smoke test (needs Playwright, the project served on port 8765): `NODE_PATH=$(npm root -g) node tests/smoke_site.mjs [--inject]`; performance measurements: `node tests/perf_site.mjs`. If the app shows a stale or half-loaded view after you update files, do a hard reload (Ctrl+Shift+R); module URLs carry a build id (see `docs/HANDOFF.md`).

## Layout

```
app/            web app: index.html, style.css, js/ (globe, site view, simulation, drive mode), vendor/ (Three.js, globe.gl), fonts/
assets/         images/earth (globe textures, borders, source/ = how the map was made), textures/ground (1K PBR), models (rover GLBs, rovers.json registry, model_report.json, previews)
data/raw/       source data you download (large files are git-ignored); INVENTORY.md lists what is expected
data/processed/ files the app reads (scores, hotspots, patches), produced by the pipeline
pipeline/       Python pipeline, validation and reader tests
tests/          physics, rover, ground, motion, smoke and performance checks (generated screenshots go to tests/previews/, git-ignored)
design/refs/    visual reference screenshots (remove before making the repo public)
docs/           HANDOFF, PROGRESS, MANUAL_TEST_DRIVE, notes, resources, REFERENCES
```

Credits and licences: `THIRD_PARTY_NOTICES.md`. Every source used or considered: `docs/REFERENCES.md`. A local-only `_local/` folder (git-ignored) holds heavy or private files and is not part of the repository.
