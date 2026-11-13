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
