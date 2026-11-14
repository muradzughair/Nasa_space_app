# TerraAnalog references

Every resource used or considered for the project, with what it is for. Status: Used = in the app or its build today. Planned = intended for the real-data or ground-realism runs. Candidate = found, not committed to. Reference = guidance only.

Only the Apollo 11 landing-site page was opened and read when this list was made. All other links were found by search or recalled, and their file names, sizes and licences must be checked before relying on them or making the repository public. See also `THIRD_PARTY_NOTICES.md` for licences and `data/manifest.md` for data status.

## Challenge
| Item | Notes | Status |
|---|---|---|
| NASA Space Apps Challenge 2026, "Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars" | The challenge this project answers. Organizer guideline PDFs are kept locally, not in the repository. | Used |

## Moon
| Resource | Link | Used for | Status |
|---|---|---|---|
| Apollo 11 - Landing Site (NASA Science 3D resources) | https://science.nasa.gov/3d-resources/apollo-11-landing-site/ | Height map of the Apollo 11 area, 30 x 30 km in the Sea of Tranquility, as one STL file (6.81 MB, dated Apr 21, 2025). The page states the vertical axis is exaggerated 60 times, so divide heights by 60 before real use. The page names no source dataset and gives no credit or licence line. Heavily used as the working reference for the Apollo 11 target. | Used (reference) |
| NASA 3D Resources catalog | https://science.nasa.gov/3d-resources/ | Where the Apollo 11 terrain, rover and other NASA models are listed | Reference |
| Apollo 11 mission page | https://science.nasa.gov/mission/apollo-11/ | Background for the Apollo 11 target | Reference |
| NASA SVS, A New Look at the Apollo 11 Landing Site | https://svs.gsfc.nasa.gov/4185 | Background and imagery for the Apollo 11 site | Reference |
| LROC Apollo 11 NAC DTM and 0.5 m orthophoto | https://lroc.im-ldi.com/images/downloads and https://data.lroc.im-ldi.com/lroc/view_rdr_product/NAC_DTM_APOLLO11_M150361817_50CM | Rover-scale elevation and imagery for the Apollo 11 target | Planned |
| LOLA global grids (LDEM_16, LDSM_16, LDRM_16 with labels) | https://imbrium.mit.edu/DATA/LOLA_GDR/CYLINDRICAL/IMG/ | Global Moon elevation, slope and roughness traits (never the LDEC or LDAC count files) | Planned |
| LOLA 5 m south pole site DEMs | https://pgda.gsfc.nasa.gov/data/LOLA_5mpp/ and https://core2.gsfc.nasa.gov/PGDA/LOLA_5mpp | South pole rover-scale elevation | Planned |
| LOLA south pole products | https://pgda.gsfc.nasa.gov/products/78, https://pgda.gsfc.nasa.gov/products/90 | South pole topography | Candidate |
| Lunar polar illumination | https://pgda.gsfc.nasa.gov/products/69 | Sun and shadow at the poles | Candidate |
| USGS Moon LRO south pole DEM | https://astrogeology.usgs.gov/search/map/moon_lro_south_pole_dem | Alternative south pole elevation | Candidate |
| Unified Geologic Map of the Moon | https://astrogeology.usgs.gov/search/map/unified_geologic_map_of_the_moon_1_5m_2020 | Soil and geology traits (currently placeholders) | Candidate |

## Mars
| Resource | Link | Used for | Status |
|---|---|---|---|
| MOLA topography, 16 pixels per degree (megt90n000eb) | https://pds-geosciences.wustl.edu/mgs/urn-nasa-pds-mgs_mola_topography_derived/meg016/megt90n000eb.xml | Global Mars elevation traits (label in repo, data file not yet downloaded) | Planned |
| MOLA MEGDR description | https://ode.rsl.wustl.edu/mars/pagehelp/Content/Missions_Instruments/MGS/MOLA/MEGDR.htm | How to read the MOLA grid | Reference |
| MOLA-HRSC blended DEM, 200 m | https://astrogeology.usgs.gov/search/map/mars_mgs_mola_mex_hrsc_blended_dem_global_200m | Mid-resolution Mars terrain windows | Candidate |
| Mars 2020 Jezero landing site products | https://astrogeology.usgs.gov/search/map/mars-2020-jezero-crater-landing-site-products | Jezero data index | Planned |
| Mars 2020 HiRISE DTM mosaic | https://astrogeology.usgs.gov/search/map/mars_2020_terrain_relative_navigation_hirise_dtm_mosaic | Jezero rover-scale elevation | Used (Site View ground, see Ground realism run) |
| Mars 2020 HiRISE orthomosaic, 25 cm | https://astrogeology.usgs.gov/search/map/Mars/Mars2020/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first | Jezero imagery | Planned |
| Mars MSL Gale merged DEM, 1 m | https://astrogeology.usgs.gov/search/map/mars_msl_gale_merged_dem_1m | Gale rover-scale elevation | Used (Site View ground, see Ground realism run) |
| Mars MSL Gale merged orthophoto mosaic, 25 cm | https://astrogeology.usgs.gov/search/map/mars_msl_gale_merged_orthophoto_mosaic_25cm | Gale imagery | Planned |
| HiRISE DTM catalog | https://hirise.lpl.arizona.edu/dtm/ and https://www.uahirise.org/dtm/PSP_001488_1750 | Other Gale and Mars terrain models | Candidate |

## Earth
| Resource | Link | Used for | Status |
|---|---|---|---|
| ETOPO 2022 (60 arc-second) | https://www.ncei.noaa.gov/products/etopo-global-relief-model | Global Earth elevation traits | Planned |
| Copernicus GLO-30 DEM | https://catalog.data.gov/dataset/copernicus-glo-30-digital-elevation-model and https://registry.opendata.aws/copernicus-dem/ | 30 m elevation around Earth hotspots | Planned |
| Sentinel-2 L2A cloud-optimized GeoTIFFs | https://registry.opendata.aws/sentinel-2-l2a-cogs/ | 10 m true colour around Earth hotspots | Planned |
| Terrain Tiles on AWS | https://registry.opendata.aws/terrain-tiles | Global elevation tiles for a pick-anywhere Earth mode | Candidate |
| MODIS land surface temperature (MOD11) via AppEEARS | https://lpdaac.usgs.gov/resources/e-learning/choosing-data-access-tool-appeears-area-sampler and https://modarch.gsfc.nasa.gov/data/dataprod/mod11.php | Temperature trait (currently placeholder) | Planned |

## Streaming and tile services
| Resource | Link | Used for | Status |
|---|---|---|---|
| NASA Moon Trek and Mars Trek WMTS | https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon and https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars | Live Moon and Mars imagery tiles | Candidate |
| NASA Mars WMTS catalog | https://api.nasa.gov/mars-wmts/catalog | Mars tile layers | Candidate |
| EOX Sentinel-2 cloudless | https://eox.at/2017/08/sentinel-2-global-cloudless-mosaic (licence: https://cloudless.eox.at/license-non-commercial) | 10 m Earth colour, free for non-commercial use | Candidate |
| Esri ArcGIS licensing and attribution | https://developers.arcgis.com/javascript/latest/licensing/ | Terms to read before using Esri imagery | Reference |

## Globe imagery, borders and textures
| Resource | Link | Used for | Status |
|---|---|---|---|
| Blue Marble Next Generation, topography and bathymetry maps | https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/topography-bathymetry-maps | GEBCO-based ocean depth and land elevation grey maps used to shade the oceans | Used |
| Visible Earth Blue Marble collection | https://visibleearth.nasa.gov/collection/1484/blue?page=3 | Other Blue Marble months | Reference |
| Blue Marble, NASA SVS 12564 | https://svs.gsfc.nasa.gov/12564/ | Wrongly downloaded files (print still and movie) came from here; not used | Reference |
| three-globe example images | https://github.com/vasturiano/three-globe | Earth base map, relief and water mask | Used |
| Natural Earth admin-0 countries | https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/ and https://github.com/nvkelso/natural-earth-vector | Country borders on the globe | Used |
| Poly Haven rocks_ground_02 | https://polyhaven.com/a/rocks_ground_02 | Moon and Mars ground texture (CC0) | Used |
| Poly Haven coast_sand_rocks_02 | https://polyhaven.com/a/coast_sand_rocks_02 | Earth ground texture (CC0) | Used |
| Poly Haven rock_boulder_dry | https://polyhaven.com/a/rock_boulder_dry | Rock model for scattering | Planned |
| Poly Haven licence | https://www.polyhaven.com/license | CC0 terms | Reference |

## Rover models and specifications
| Resource | Link | Used for | Status |
|---|---|---|---|
| Mars Perseverance rover 3D model | https://science.nasa.gov/resource/mars-perseverance-rover-3d-model/ | Perseverance model in the app: the Draco GLB supplied from NASA 3D Resources, decoded and re-encoded (meshopt, 1024 px WebP) by `pipeline/build_rover_models.py`; wheels split into six named nodes. Model size check: height 1.85 m against about 2.2 m real, so the proportions are approximate (see `assets/models/model_report.json`). | Used |
| Curiosity Rover (MSL) (Dirty).blend, NASA 3D Resources | https://science.nasa.gov/3d-resources/ | Curiosity model in the app (and Scarecrow, which reuses it): converted from the supplied Blender file by the pipeline. Model length 3.95 m against about 2.9 m real body length (the model includes the arm), wheels 0.485 m diameter against 0.50 m real (PIA15682). | Used |
| Generic lunar rover (procedural) | `pipeline/build_rover_models.py` (`build_procedural_lunar`) | Illustrative 4-wheel lunar rover built from primitives. Not the Apollo LRV and not VIPER. Reason: no official LRV or VIPER model could be downloaded from this build environment (NASA hosts and the GitHub API were not reachable, and a licence could not be checked). All its figures are marked assumed. | Used (fallback) |
| Perseverance wheels | https://mars.nasa.gov/mars2020/spacecraft/rover/wheels | Wheel size and mobility figures | Used in `rovers.json` where stated (wheel radius, wheel count) |
| Perseverance rover components | https://science.nasa.gov/mission/mars-2020-perseverance/rover-components/ | Mass (1025 kg), wheel count, wheel diameter, top speed, slope limit (source id `nasa_p_components`) | Used |
| Perseverance rover, JPL press kit | https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/spacecraft/perseverance_rover | Specification figures to verify | Planned |
| VIPER updated technical briefing (Feb 2025) | https://assets.science.nasa.gov/content/dam/science/psd/lunar-science/documents/2025-02-13_VIPER_Updated_Technical_Briefing_Presentation-Shared.pdf | Lunar rover figures (VIPER) to verify; not used yet | Planned |
| VIPER mobility hardware (NASA NTRS) | https://ntrs.nasa.gov/api/citations/20240013903/downloads/LSIC_2024-Tech%20Infusion_Panel-VIPER_Mob-HW.pdf | Lunar rover wheel and mobility figures; not used yet | Planned |
| JPL Open Source Rover (README, read) | https://github.com/nasa-jpl/open-source-rover/blob/master/README.md | Open-source, build-it-yourself, scaled-down version of the 6-wheel rover design JPL uses on Mars, from off-the-shelf parts. The README states: 6 wheels, rocker-bogie suspension with a differential pivot, 6-wheel Ackerman steering, 10 motors, top speed about 1.6 m/s, Raspberry Pi controller, LiPo battery (7.2 Ah, at least 3 hours of rough-terrain driving), cost about $1600. It gives no mass, size or wheel diameter. Licence: Apache 2.0, Open-Source Hardware certified (OSHWA US002551). Reference for rocker-bogie geometry and for a small, scaled-down rover option; it is not a mission rover. | Reference |
| JPL Open Source Rover parts list | https://github.com/nasa-jpl/open-source-rover/blob/master/parts_list/README.md | Where mass and dimensions can be worked out (not stated on the README) | Candidate |
| JPL OSR rover code (osr-rover-code) | https://github.com/nasa-jpl/osr-rover-code | Control software for the same rover | Reference |
| JPL, Test Rover Aids Preparations in California for Curiosity (PIA15682, read) | https://www.jpl.nasa.gov/images/pia15682-test-rover-aids-preparations-in-california-for-curiosity-rover-on-mars/ | Source `jpl_pia15682`. Describes Scarecrow, the Curiosity test rover: a full-scale version of Curiosity's mobility system without an onboard computer, stripped down "so that it weighs about the same on Earth as Curiosity will weigh in the lesser gravity of Mars", 20 inch (50 cm) wheels, tested on the Dumont Dunes near Death Valley in May 2012. It is the real-world version of the app's equal-wheel-load test mass idea. The page gives no mass figures. | Reference |
| NASA 3D Resources (GitHub mirror) | https://github.com/nasa/NASA-3D-Resources | Mirror of the NASA 3D models. The NASA 3D Resources page says its assets are free to download and use. | Reference |
| NASA Images and Media Usage Guidelines | https://www.nasa.gov/nasa-brand-center/images-and-media/ | Terms to follow when using NASA models and images | Reference |

## Files received (kept on disk, not in the repository)
| File or folder | What it is | Key facts (measured from the files, 2026-11-13) | Location |
|---|---|---|---|
| JEZ_hirise_soc_006_DTM_MOLAtopography_DeltaGeoid_1m_Eqc_latTs0_lon0_blend40.tif | Jezero HiRISE DTM mosaic | 21,400 x 21,488 px at 1 m (21.4 x 21.5 km), float32, uncompressed, 1.8 GB. Equirectangular, Mars 2000 sphere (radius 3,396,190 m). Extent lat 18.307 to 18.669, lon 77.223 to 77.584. Nodata -3.4028e38. Heights relative to the MOLA geoid, about -2,660 to -1,655 m. About 65% valid. The preset target (18.38, 77.58) lies on the extreme eastern edge. | data/raw/sites/mars_jezero/ |
| MSL_Gale_DEM_Mosaic_1m_v3.tif | Gale merged DEM mosaic | 32,980 x 57,440 px at 1 m (33.0 x 57.4 km), float32, LZW compressed, 3.7 GB. Equirectangular, Mars 2000 sphere. Extent lat -5.099 to -4.130, lon 137.124 to 137.681. Nodata -32767. About 81% valid. The preset target (-5.4, 137.8) is outside the mosaic (about 18 km south and 7 km east of it). | data/raw/sites/mars_gale/ |
| Mars 2020 Perseverance Rover.glb | Perseverance model, Draco compressed | 252 mesh parts, 47 materials, about 200,000 triangles. Used: decoded with `gltf-transform copy` and re-encoded to meshopt (no Draco decoder is shipped; the app already vendors the meshopt decoder). | _local/rover_sources/perseverance_glb_draco/ |
| Mars 2020 Perseverance Rover parts, assembly instructions | 3D-printable scale model kit (STL parts and instruction images) | 40 STL parts and 10 instruction images, for example mobility arms, differential bar, wheels, chassis. Print scale, not full size (a printed wheel is about 43 mm across against 525 mm real). | _local/rover_sources/perseverance_printable_kit/ |
| Mars 2020 5 inch wheel.stl | A single wheel model | 5 inch (127 mm) diameter, 2.9 inch wide, watertight, 45,000 triangles | _local/rover_sources/perseverance_printable_kit/ |
| Curiosity Rover (MSL) (Dirty).blend, Curiosity Scarecrow Test Rover.blend | Blender 4 files of Curiosity and its Scarecrow test rover | Curiosity (Dirty) converted by the pipeline with Blender (bpy) into `assets/models/curiosity.glb`. The Scarecrow blend is not used: Scarecrow reuses the Curiosity geometry, as the brief asks. | _local/rover_sources/curiosity/ |
| Curiosity (200uM).stl | Curiosity printable model | 385,000 triangles, exact duplicate of a file already kept locally; not suited to the web app | _local/duplicates/ |
| Nasa_space_app-main (GitHub zip) | Snapshot of the GitHub repository as it was when downloaded | 12 files only (docs, pipeline, prompt, build spec), no app | _local/github_snapshot_2026-11-13/ |

## Libraries and design
| Resource | Link | Used for | Status |
|---|---|---|---|
| Three.js | https://threejs.org | 3D rendering | Used |
| globe.gl | https://github.com/vasturiano/globe.gl | Globe | Used |
| Inter font | https://github.com/rsms/inter | Interface type | Used |
| NASA Eyes | https://science.nasa.gov/eyes/ | Interface style reference | Reference |
| NASA Trek | https://trek.nasa.gov/ | Interface style reference | Reference |

## Rover fleet and customization (added 2026-11-13)
| Item | Where | Notes |
|---|---|---|
| Rover registry | `assets/models/rovers.json` | One row per rover; every figure is {value, unit, source_id, verified}. `verified:false` shows as "assumed" in the app. Source ids: `nasa_p_components`, `nasa_msl_factsheet`, `jpl_pia15682`, `model_measured`, `recalled_public`, `assumed`, `derived_scarecrow`, `generic_lunar`. |
| Scarecrow mass | derived in `loadRegistry` | Curiosity mass x g_mars / g_earth (about 340 kg), labelled "derived: JPL built Scarecrow to weigh on Earth about what Curiosity weighs on Mars (PIA15682)". Test rover badge. |
| Soil constants (Bekker) | `rovers.json` `soils` | Fine regolith n=1.0 kc=1.4 kphi=820; sand n=1.1 kc=1.0 kphi=1530; rocky n=0.8 kc=30 kphi=9000 (kc in kN/m^(n+1), kphi in kN/m^(n+2)). ASSUMED, SIMPLIFIED: order-of-magnitude values in the range of published lunar and terrestrial soil tests, not copied from a specific source and not measurements of any site. |
| Sinkage model | `app/js/soilmech.js` | Contact chord L = 2 sqrt(2 r z - z^2), pressure p = W / (b L), plate law p = (kc/b + kphi) z^n solved for z, compaction resistance b (kc/b + kphi) z^(n+1) / (n+1). No bulldozing, no shear model, no grousers. |
| Drive force scaling | `app/js/rovercfg.js` | Assumption: drive force follows motor power and falls with a higher top speed (gear). Ground clearance changes with the wheel radius. Preset drive force is about 0.8 of the Mars weight and the battery for the two Mars rovers is sized so that a 2 km drive completes on one charge; both are assumed, not published. |
| Moon rover | not downloaded | No official Apollo LRV or VIPER model was reachable. Generic lunar rover from primitives instead. |
| Build tools (not shipped) | pip `bpy` 5.3.0 (Blender as a Python module, GPL), npm `@gltf-transform/cli` (MIT) | Used only by `pipeline/build_rover_models.py`; nothing from them is in the repository. |

## Ground realism run (added 2026-11-13)

What the Site View ground is built from, per site. "Read" means the provider's own page was opened on 2026-11-13 and the link and terms were copied from it. "Pattern" means the link follows the provider's naming pattern but could not be opened, so `pipeline/fetch_windows.py` probes it when it runs. The data hosts were not reachable from the build environment (network policy, HTTP 403 on every NASA, USGS, LROC, Copernicus and EOX host, both in the cloud workspace and in the workspace on the project computer), so only sources that were already on disk or on GitHub could be used.

| Site | Layer | Source and link | Resolution | Licence and credit | Status |
|---|---|---|---|---|---|
| Jezero | Elevation | Mars 2020 TRN HiRISE DTM mosaic, local file `data/raw/sites/mars_jezero/JEZ_hirise_soc_006_DTM_..._blend40.tif` (https://planetarymaps.usgs.gov/mosaic/mars2020_trn/HiRISE/JEZ_hirise_soc_006_DTM_MOLAtopography_DeltaGeoid_1m_Eqc_latTs0_lon0_blend40.tif, read) | 1 m, heights on the MOLA geoid | USGS Astrogeology: access constraints none, "please cite authors". Fergason et al. 2020, doi 10.5066/P9REJ9JN | **Used** (2 km patch at 0.98 m, 10 km ring at 62.5 m), centre 18.4446, 77.4509 |
| Jezero | Imagery | HiRISE orthomosaic 25 cm, https://planetarymaps.usgs.gov/mosaic/mars2020_trn/HiRISE/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first.tif (pattern; the Astropedia page could not be opened) | 0.25 m, greyscale | USGS Astrogeology, cite authors | **Missing**: host not reachable |
| Gale | Elevation | MSL Gale Merged DEM, local file `data/raw/sites/mars_gale/MSL_Gale_DEM_Mosaic_1m_v3.tif` (https://planetarymaps.usgs.gov/mosaic/Mars/MSL/MSL_Gale_DEM_Mosaic_1m_v3.tif, read) | 1 m, MOLA geoid | USGS Astrogeology: "please credit authors". Calef and Parker 2016 | **Used**, centre -4.5895, 137.4417 |
| Gale | Imagery | MSL Gale HiRISE colour mosaic, cloud-optimized, https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/Mars/MSL/MSL_Gale_HiRISE-LRGB_78quads_sharp_cog.tif (read, about 1 GB); or the 25 cm greyscale mosaic https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic/MSL_Gale_Orthophoto_Mosaic_25cm_v3.tif (read, 23 GB) | 0.25 m | USGS Astrogeology: "please credit authors". Calef and Parker 2016 | **Missing**: host not reachable |
| Apollo 11 | Elevation, first choice | LROC NAC stereo DTM, https://pds.lroc.im-ldi.com/data/LRO-L-LROC-5-RDR-V1.0/LROLRC_2001/DATA/SDP/NAC_DTM/APOLLO11/NAC_DTM_APOLLO11.TIF (read, 112.67 MB; product page https://data.lroc.im-ldi.com/lroc/view_rdr_product/NAC_DTM_APOLLO11) | 2 m | NASA PDS, credit NASA/GSFC/Arizona State University | **Missing**: host not reachable |
| Apollo 11 | Elevation, fallback | "Apollo 11 - Landing Site" STL, https://github.com/nasa/NASA-3D-Resources (commit 11ebb4e, file `3D Printing/Apollo 11 - Landing Site/Apollo 11 - Landing Site.stl`, 7.1 MB) | 256 x 256 grid over 30 km, about 115 m; heights divided by 60 | NASA 3D Resources, NASA media guidelines; no source dataset named | **Used**. Assumptions: the model is centred on the landing site and its +y axis is north (not stated by the source). Relief in the patch is about 5 m; fine detail below about 230 m is synthetic and labelled |
| Apollo 11 | Imagery | LROC NAC orthophoto 50 cm, https://pds.lroc.im-ldi.com/data/LRO-L-LROC-5-RDR-V1.0/LROLRC_2001/DATA/SDP/NAC_DTM/APOLLO11/NAC_DTM_APOLLO11_M150361817_50CM.TIF (pattern) | 0.5 m | NASA PDS, credit NASA/GSFC/Arizona State University | **Missing**: host not reachable |
| Lunar south pole | Elevation | South Pole LOLA DEM Mosaic 87 to 90 S, https://pgda.gsfc.nasa.gov/data/LOLA_5mpp/87S/ldem_87s_5mpp.tif (read, 3.3 GB; https://pgda.gsfc.nasa.gov/products/81); second choice https://pgda.gsfc.nasa.gov/data/LOLA_20mpp/LDEM_80S_20MPP_ADJ.TIF (read, 2.6 GB, cloud-optimized; https://pgda.gsfc.nasa.gov/products/90) | 5 m (20 m) | NASA GSFC PGDA. Cite Barker et al. 2021, doi 10.1016/j.pss.2020.105119 (2023, doi 10.3847/PSJ/acf3e1) | **Missing**: host not reachable. The site still shows demo terrain |
| Lunar south pole | Imagery | LROC NAC averaged mosaic, NASA Moon Trek WMTS, https://trek.nasa.gov/tiles/Moon/SP/LRO_NAC_AvgMosaic_SPole855_1mp/1.0.0/WMTSCapabilities.xml (read; tile layout assumed) | about 1 m | NASA Moon Trek / LROC | **Missing**: host not reachable |
| Earth hotspots | Elevation | Copernicus GLO-30 on AWS Open Data, https://registry.opendata.aws/copernicus-dem/ (read), tiles `https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_<N|S>ll_00_<E|W>lll_00_DEM/<same>.tif` (pattern) | 30 m | Copernicus DEM licence, credit line in THIRD_PARTY_NOTICES.md | **Missing**: host not reachable. All 144 hotspot grounds are still demo |
| Earth hotspots | Imagery | Sentinel-2 cloudless 2017 by EOX, WMTS https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml (read), layer `s2cloudless-2017`, matrix set WGS84 | about 10 m | CC BY 4.0 (2016 and 2017 only; 2018 to 2025 are CC BY-NC-SA and are not used). Attribution in THIRD_PARTY_NOTICES.md | **Missing**: host not reachable |

Other notes: the local metric grid is an azimuthal equidistant projection on the body's sphere (Mars 3,396,190 m, Moon 1,737,400 m, Earth 6,371,008.8 m), x east, z south. Rocks in Site View are rule-based and illustrative. The source list the fetcher reads is `pipeline/sites.json` (each entry has `verified: true` when its link was read from the provider's page).

## Drive mode lag fix (added 2026-11-13)

No downloads. `assets/models/perseverance.glb` was simplified locally from the existing model (same NASA 3D Resources source, see above) with `@gltf-transform/cli` 4.5.1 (`simplify --ratio 0.25 --error 0.008`, `meshopt --level medium`); the full 199,521-triangle model is kept in `_local/models_full/perseverance_200k.glb`.
