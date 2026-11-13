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
