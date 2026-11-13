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

## Drive mode

In Site View press Drive, choose the target ground or the Earth hotspot, and drive the rover yourself (PS5 DualSense, other standard gamepads, or the keyboard: W A S D, Space, R, V, Esc; H shows the full map). A small picture-in-picture shows the same inputs on the other ground, with a live comparison of speed, tilt, slip, power and energy. Physics checks: `node --experimental-default-type=module tests/physics_check.mjs`. Real-controller test: `docs/MANUAL_TEST_DRIVE.md`. Drive-force, power and battery figures are unverified assumptions (see `assets/models/rover_params.json`).

## Layout

```
app/            web app: index.html, style.css, js/ (globe, site view, simulation, drive mode), vendor/ (Three.js, globe.gl), fonts/
assets/         images/earth (globe textures, borders, source/ = how the map was made), textures/ground (1K PBR), models (rover model, rover_params.json)
data/raw/       source data you download (large files are git-ignored); INVENTORY.md lists what is expected
data/processed/ files the app reads (scores, hotspots, patches), produced by the pipeline
pipeline/       Python pipeline, validation and reader tests
tests/          drive-mode physics checks
design/refs/    visual reference screenshots (remove before making the repo public)
docs/           HANDOFF, PROGRESS, MANUAL_TEST_DRIVE, notes, resources
```

Credits and licences: `THIRD_PARTY_NOTICES.md`. A local-only `_local/` folder (git-ignored) holds heavy or private files and is not part of the repository.
