# Data manifest

Generated 2026-11-08 12:33:43 by pipeline/run_pipeline.py. Mode: **DEMO (synthetic placeholders)**.

## Sources and decisions

| Item | Source URL | Size | Status / decision |
|---|---|---|---|
| Moon LDEM_16, LDSM_16, LDRM_16 | https://imbrium.mit.edu/DATA/LOLA_GDR/CYLINDRICAL/IMG/ | about 33 MB each | NOT downloaded: host blocked (HTTP 403) by the build sandbox network policy on 2026-11-08; demo terrain used |
| Mars MOLA megt90n000eb.img | https://pds-geosciences.wustl.edu/mgs/urn-nasa-pds-mgs_mola_topography_derived/meg016/megt90n000eb.xml | about 33 MB | label present, data file NOT downloaded (host blocked, HTTP 403); demo terrain used |
| Earth ETOPO 2022 60 arc-second | https://www.ncei.noaa.gov/products/etopo-global-relief-model | about 400 MB (GeoTIFF) | NOT downloaded (host blocked, HTTP 403); demo terrain used |
| Copernicus GLO-30 hotspot windows | https://catalog.data.gov/dataset/copernicus-glo-30-digital-elevation-model | small windows | NOT downloaded (host blocked); patches are synthetic stand-ins |
| MODIS land surface temperature (MOD11) | https://lpdaac.usgs.gov/resources/e-learning/choosing-data-access-tool-appeears-area-sampler | needs Earthdata login | NOT used; temperature is a placeholder model |
| Geologic maps (USGS) | https://astrogeology.usgs.gov/search/map/unified_geologic_map_of_the_moon_1_5m_2020 | large | NOT used; soil and dust are placeholders |
| Earth land mask | PyPI package global-land-mask 1.0.0 (GLOBE-derived) | 2.5 MB | used (real land shape only; no elevation) |
| Perseverance 3D model | supplied file assets/models/25042_Perseverance.glb (NASA/JPL-Caltech) | 11.7 MB | compressed to about 2.9 MB (meshopt, 512 px textures) |
| Apollo 11 photo | supplied file assets/images/Apollo 11 - View of the Moon.jpg | 3 MB | decorative only, resized |

Dataset names and licences have NOT been verified against the challenge Resources tab (not yet added to resources.md). Verify before relying on any of them.
