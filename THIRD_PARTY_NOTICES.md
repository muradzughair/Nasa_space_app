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
| Perseverance rover model (compressed) | `assets/models/perseverance.glb` | NASA/JPL-Caltech 3D resource, subject to NASA media usage guidelines (https://www.nasa.gov/nasa-brand-center/images-and-media/); the original file is not in the repository |
| Lunar rover model | built in code | Procedural model made for TerraAnalog, not a NASA model |
| Earth land mask | pipeline dependency `global-land-mask` | PyPI package, GLOBE-derived; see its own licence |
| Design references | `design/refs/` | Screenshots of NASA Eyes and an Earth reference image, for visual guidance only; not part of the app; remove before making the repository public |

Real data not in the repository (download it yourself, see README.md): LOLA lunar grids, MGS MOLA Mars grid, NOAA ETOPO 2022.

NASA and other organisation names are used to describe data sources. This project is not endorsed by NASA or any agency.
