# Resources: dataset and asset sources

Status: candidate sources found by search. They have NOT yet been checked against the challenge page Resources tab. Verify product, format and license before relying on any of them, and record decisions in /data/manifest.md.

## Moon
- LOLA global grids (16 pixels per degree, about 33 MB each): https://imbrium.mit.edu/DATA/LOLA_GDR/CYLINDRICAL/IMG/
  - LDEM_16.IMG + LDEM_16.LBL = elevation
  - LDSM_16.IMG + LDSM_16.LBL = slope
  - LDRM_16.IMG + LDRM_16.LBL = roughness
  - Do NOT use LDEC_* or LDAC_* (measurement counts, not elevation).
  - LDEM_64.IMG is about 530 MB; only use if needed.
- LOLA 5 m south pole landing-site DEMs: https://core2.gsfc.nasa.gov/PGDA/LOLA_5mpp
- LOLA south pole products: https://pgda.gsfc.nasa.gov/products/90 and https://pgda.gsfc.nasa.gov/products/78
- Lunar polar illumination: https://pgda.gsfc.nasa.gov/products/69
- USGS Moon LRO south pole DEM: https://astrogeology.usgs.gov/search/map/moon_lro_south_pole_dem
- Unified Geologic Map of the Moon: https://astrogeology.usgs.gov/search/map/unified_geologic_map_of_the_moon_1_5m_2020

## Mars
- MOLA topography, 16 pixels per degree (label file already in /data/raw/mars; the .img data file still has to be downloaded from the same folder): https://pds-geosciences.wustl.edu/mgs/urn-nasa-pds-mgs_mola_topography_derived/meg016/megt90n000eb.xml
- MOLA MEGDR description: https://ode.rsl.wustl.edu/mars/pagehelp/Content/Missions_Instruments/MGS/MOLA/MEGDR.htm
- MOLA-HRSC blended DEM, 200 m (global file is large; use only windows): https://astrogeology.usgs.gov/search/map/mars_mgs_mola_mex_hrsc_blended_dem_global_200m
- Jezero Crater HiRISE/CTX DTM products (check sizes first): https://astrogeology.usgs.gov/search/map/mars-2020-jezero-crater-landing-site-products
- HiRISE DTM catalog (for Gale Crater and others): https://hirise.lpl.arizona.edu/dtm/

## Earth
- ETOPO 2022 (use the 60 arc-second version for the coarse global grid): https://www.ncei.noaa.gov/products/etopo-global-relief-model
- Copernicus GLO-30 DEM (30 m, for small windows around hotspots only): https://catalog.data.gov/dataset/copernicus-glo-30-digital-elevation-model
- MODIS land surface temperature (MOD11) via AppEEARS (needs free NASA Earthdata login): https://lpdaac.usgs.gov/resources/e-learning/choosing-data-access-tool-appeears-area-sampler
- MOD11 product page: https://modarch.gsfc.nasa.gov/data/dataprod/mod11.php
- Blue Marble Next Generation (globe texture): https://svs.gsfc.nasa.gov/12564/

## Rover model
- Perseverance 3D model (already supplied as /assets/models/25042_Perseverance.glb): https://science.nasa.gov/resource/mars-perseverance-rover-3d-model/?site=msl

## Challenge page Resources tab
Not yet added.

## Added for the visual polish (not yet verified against official pages)
- Earth day map, topography and bathymetry, equirectangular JPG (about 5400 x 2700 is enough; downsample to 4096 x 2048): NASA Earth Observatory, Blue Marble Next Generation: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/
- Quick alternative for the Earth map, relief, water and clouds: three-globe example images (look for earth-blue-marble.jpg, earth-topology.png, earth-water.png and the clouds example): https://app.unpkg.com/three-globe@2.44.0/files/example/clouds/index.html
- Country borders (Natural Earth, public domain): naturalearthdata.com, "Admin 0 Countries" 110m or 50m GeoJSON
- Ground textures (CC0): https://polyhaven.com/a/rocks_ground_02 and https://polyhaven.com/a/coast_sand_rocks_02 (1K JPG: color, normal GL, roughness). License: https://www.polyhaven.com/license
- Design references: NASA Eyes https://science.nasa.gov/eyes/ and NASA Trek https://trek.nasa.gov/ (screenshots go in /design/refs)

## Apollo 11 landing site (added, page read)
- NASA Science 3D resource, Apollo 11 - Landing Site: https://science.nasa.gov/3d-resources/apollo-11-landing-site/
  - One STL height map, 30 x 30 km around the landing site in the Sea of Tranquility, 6.81 MB (page dated Apr 21, 2025).
  - The page says the vertical axis is exaggerated 60 times: divide heights by 60 before using them as real elevation.
  - The page names no source dataset and gives no credit or licence line; NASA Brand and Usage Guidelines apply. Resolution is not stated, so treat it as regional context, not rover-scale terrain.
  - Full list of every reference used in the project: docs/REFERENCES.md

## JPL Open Source Rover (added, page read)
- README: https://github.com/nasa-jpl/open-source-rover/blob/master/README.md
  - Open-source, scaled-down 6-wheel rocker-bogie rover from JPL: differential pivot, 6-wheel Ackerman steering, 10 motors, top speed about 1.6 m/s, Raspberry Pi, LiPo 7.2 Ah, at least 3 h of driving, about $1600. Mass, size and wheel diameter are not on the README.
  - Apache License 2.0, Open-Source Hardware certified. Not a mission rover; use as a reference for rocker-bogie geometry or as a small-rover option.
  - Parts list: https://github.com/nasa-jpl/open-source-rover/blob/master/parts_list/README.md ; code: https://github.com/nasa-jpl/osr-rover-code

## Files received 2026-11-13
- Jezero HiRISE DTM (1 m) and Gale merged DEM (1 m) are now on disk in data/raw/sites/. Details, extents and coverage problems: data/raw/INVENTORY.md and docs/REFERENCES.md.
- Scarecrow, Curiosity's test rover (JPL): https://www.jpl.nasa.gov/images/pia15682-test-rover-aids-preparations-in-california-for-curiosity-rover-on-mars/
- NASA 3D Resources GitHub mirror: https://github.com/nasa/NASA-3D-Resources
