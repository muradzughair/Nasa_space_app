# Data inventory (what is in /data/raw)

## Present
- mars/megt90n000eb.xml: label file only (describes the Mars 16 pixels-per-degree topography grid). The data file megt90n000eb.img is NOT present.
- source pages (saved web pages used as link lists) are kept locally only, in `_local/source_pages/`, and are not in the repository
  - Index of _DATA_LOLA_GDR_CYLINDRICAL_IMG_.html: lists LOLA lunar grids (links to https://imbrium.mit.edu/DATA/LOLA_GDR/CYLINDRICAL/IMG/)
  - MGS MOLA ... (MEGDR).html: MOLA gridded data description
  - Astropedia - Mars 2020 Jezero Crater Landing Site Products.html: Jezero products page

## Missing (to download, respecting the 1 GB per-file rule)
- moon: LDEM_16.IMG/.LBL (33 MB), LDSM_16.IMG/.LBL (33 MB), LDRM_16.IMG/.LBL (33 MB)
- mars: megt90n000eb.img (about 33 MB)
- earth: ETOPO 2022 60 arc-second GeoTIFF
- fine-detail windows: lunar south pole site tile(s), Jezero and Gale Crater terrain windows, Earth hotspot windows (after scoring)
- geology and temperature data: not downloaded; use labeled placeholders if unavailable

Do not use LDEC_* or LDAC_* files (counts, not elevation).

## Site elevation files (received 2026-11-13, git-ignored, kept on disk)
- sites/mars_jezero/JEZ_hirise_soc_006_DTM_MOLAtopography_DeltaGeoid_1m_Eqc_latTs0_lon0_blend40.tif: HiRISE DTM mosaic, 21,400 x 21,488 px at 1 m, float32, uncompressed (1.8 GB). Equirectangular on the Mars 2000 sphere (radius 3,396,190 m), clon 0. Extent lat 18.307 to 18.669, lon 77.223 to 77.584. Nodata -3.4028e38. Heights relative to the MOLA geoid. About 65% of the area is valid.
- sites/mars_gale/MSL_Gale_DEM_Mosaic_1m_v3.tif: merged 1 m DEM, 32,980 x 57,440 px, float32, LZW (3.7 GB). Equirectangular on the Mars 2000 sphere. Extent lat -5.099 to -4.130, lon 137.124 to 137.681. Nodata -32767. About 81% valid. The file's own statistics include a few very high outliers (maximum about -357 m against a median of about -4,090 m): clip them when processing.
- Pixel to position: x (m) = radius * longitude (radians), y (m) = radius * latitude (radians); pixel (col, row) is x0 + col, y0 - row with the tie point in the GeoTIFF header (Jezero x0 4,577,366, y0 1,106,618; Gale x0 8,127,993.99, y0 -244,781.58).
- Coverage problems for the presets: the Jezero preset (18.38, 77.58) sits on the extreme eastern edge (a 2 km window there is only 86% valid) and the Gale preset (-5.4, 137.8) is outside the mosaic. Use a separate Site View centre inside the data: near the Perseverance landing site for Jezero (about 18.4446, 77.4509, window 100% valid, median slope 3.2 deg) and near Bradbury Landing for Gale (about -4.5895, 137.4417, window 100% valid, median slope 3.8 deg). Keep the scoring coordinates unchanged.
- Imagery (25 cm orthomosaics) and the Moon files are not present yet.
