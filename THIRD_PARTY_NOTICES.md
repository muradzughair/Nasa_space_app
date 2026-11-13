# Third-party material and credits

Licences below are stated from memory of the public terms and must be checked before the repository is made public.

| Item | Where | Source and terms |
|---|---|---|
| Three.js r160 (bundled with OrbitControls and GLTFLoader) | `app/vendor/three-bundle.js` | https://threejs.org, MIT |
| globe.gl 2.32.0 | `app/vendor/globe.gl.min.js` | https://github.com/vasturiano/globe.gl, MIT |
| Inter variable font | `app/fonts/` | https://github.com/rsms/inter, SIL Open Font License 1.1 (`app/fonts/Inter-LICENSE.txt`) |
| Earth day map base image | `assets/images/earth/source/earth_blue_marble_plain.jpg` | Blue Marble image from the three-globe example images (https://github.com/vasturiano/three-globe), NASA imagery |
| Ocean depth and land elevation grey maps | `assets/images/earth/source/earth_bathymetry_gray.jpg`, `earth_elevation_gray.jpg` | NASA Earth Observatory Blue Marble Next Generation (GEBCO 08 based) |
| Earth map with ocean shading, relief and water mask | `assets/images/earth/earth_day.jpg`, `earth_topology.png`, `earth_water.png` | Derived from the images above and the three-globe example images |
| Country borders | `assets/images/earth/countries.geojson` | Natural Earth admin-0, 110m, public domain (https://www.naturalearthdata.com) |
| Ground textures (1K, converted from 4K) | `assets/textures/ground/` | Poly Haven `rocks_ground_02` and `coast_sand_rocks_02`, CC0 (https://polyhaven.com/license) |
| Perseverance rover model (converted, meshopt) | `assets/models/perseverance.glb` | NASA/JPL-Caltech 3D resource from NASA 3D Resources (https://science.nasa.gov/3d-resources/, downloaded by the project team 2026-11-13), subject to the NASA Images and Media Usage Guidelines (https://www.nasa.gov/nasa-brand-center/images-and-media/). Converted by `pipeline/build_rover_models.py`; the original file is not in the repository |
| Curiosity rover model (converted, meshopt); used also for the Scarecrow test rover | `assets/models/curiosity.glb` | NASA 3D Resources, Curiosity Rover (MSL) (Dirty), same terms as above. Converted by the pipeline; the original Blender file is not in the repository |
| Generic lunar rover model | `assets/models/lunar_generic.glb` | Procedural model made for TerraAnalog by the pipeline, not a NASA model and not the Apollo LRV or VIPER |
| Rover model previews | `assets/models/previews/` | Renders of the three models above, same terms |
| Rover build tools (not shipped) | `pipeline/build_rover_models.py` | Blender as the Python module `bpy` 5.3.0 (GPL, https://www.blender.org) and `@gltf-transform/cli` (MIT), used only at build time; no code from them is in the repository |
| Earth land mask | pipeline dependency `global-land-mask` | PyPI package, GLOBE-derived; see its own licence |
| Apollo 11 landing site height map (reference) | not in the repository | NASA Science 3D resource, https://science.nasa.gov/3d-resources/apollo-11-landing-site/ : STL, 30 x 30 km, vertical exaggeration x60, no data credit or licence on the page; NASA Brand and Usage Guidelines apply. Used as the working reference for the Apollo 11 target. |
| JPL Open Source Rover (reference) | not in the repository | https://github.com/nasa-jpl/open-source-rover , Apache License 2.0, Open-Source Hardware certified (OSHWA US002551). Used as a reference for rocker-bogie geometry; none of its files are copied. Not endorsed by JPL or NASA. |
| Jezero HiRISE DTM mosaic and Gale merged 1 m DEM | `data/raw/sites/` (git-ignored, not in the repository) | USGS Astrogeology (Astropedia) products, see `docs/REFERENCES.md`; terms must be checked on each product page. Derived 2 km tiles will be credited here when they are added. |
| Perseverance printable model kit, Perseverance GLB, Curiosity and Scarecrow models | `_local/rover_sources/` (not in the repository) | NASA 3D Resources (https://science.nasa.gov/3d-resources/), which states its assets are free to download and use, under the NASA Images and Media Usage Guidelines. The Perseverance GLB and the Curiosity Blender file are used (converted, see above); the printable kit and the Scarecrow Blender file are not used. |
| Design references | `design/refs/` | Screenshots of NASA Eyes and an Earth reference image, for visual guidance only; not part of the app; remove before making the repository public |

| Jezero real elevation tiles (2 km patch at 1 m, 10 km context ring at 62.5 m) | `data/processed/sites/tgt_mars_jezero/` | Cut on 2026-11-13 from the Mars 2020 Terrain Relative Navigation HiRISE DTM mosaic, USGS Astrogeology Science Center (Fergason et al. 2020, https://doi.org/10.5066/P9REJ9JN; HiRISE: NASA/JPL/University of Arizona). Astropedia terms as read on 2026-11-13: access constraints none, use constraints "please cite authors". |
| Gale real elevation tiles (2 km patch at 1 m, 10 km context ring at 62.5 m) | `data/processed/sites/tgt_mars_gale/` | Cut on 2026-11-13 from the MSL Gale Merged DEM, 1 m (Calef and Parker 2016, PDS Annex, USGS Astrogeology Science Center). Astropedia terms as read on 2026-11-13: "please credit authors", use constraints none. |
| Apollo 11 coarse elevation tiles (about 115 m source spacing) | `data/processed/sites/tgt_moon_a11/` | Derived on 2026-11-13 from "Apollo 11 - Landing Site" (STL height map), NASA 3D Resources (https://github.com/nasa/NASA-3D-Resources, commit 11ebb4e, and https://science.nasa.gov/3d-resources/apollo-11-landing-site/). NASA media usage guidelines apply. The page names no source dataset; heights divided by the stated 60 times exaggeration. |
| Not yet in the repository, set up in `pipeline/sites.json` | (none) | HiRISE orthomosaics for Jezero and Gale (USGS, cite authors), LROC NAC DTM and orthophoto for Apollo 11 (NASA/GSFC/Arizona State University, PDS), LOLA south pole DEM (NASA GSFC PGDA, cite Barker et al. 2021), Copernicus GLO-30 (Copernicus DEM licence: (c) DLR e.V. 2010-2014 and (c) Airbus Defence and Space GmbH 2014-2018, provided under COPERNICUS by the European Union and ESA), Sentinel-2 cloudless 2017 by EOX (CC BY 4.0: "Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2017)"; the 2018 and later mosaics are CC BY-NC-SA and are NOT used). Add each credit here when its tiles are built. |

Full list of sources used or considered: `docs/REFERENCES.md`.

Real data not in the repository (download it yourself, see README.md): LOLA lunar grids, MGS MOLA Mars grid, NOAA ETOPO 2022.

NASA and other organisation names are used to describe data sources. This project is not endorsed by NASA or any agency.
