#!/usr/bin/env python3
"""Imagery alignment check, called by tests/ground_check.mjs: python3 tests/ground_align.py <patch id> ...
An orbital image is brighter on slopes that face the sun. For each site the shading of the fine heights is computed for 24 sun azimuths; the azimuth that
correlates best with the image is kept, and the image is then shifted by up to 12 pixels in every direction. The site passes when the correlation is
clearly positive (above 0.15) and peaks within 2 pixels of zero shift. Exit code 1 on any failure."""
import json, sys, gzip
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage
ROOT = Path(__file__).resolve().parent.parent; sys.path.insert(0, str(ROOT / "pipeline"))
from fetch_windows import decode_h16
ix = json.loads((ROOT / "data/processed/patches_index.json").read_text()); bad = 0
for pid in sys.argv[1:]:
    e = ix["patches"][pid]; r = e["real"]; d = ROOT / "data/processed" / r["dir"]; n = r["n"]
    h = decode_h16((d / "fine.h16").read_bytes(), n).astype(np.float64) * r["hscale"]
    im = np.asarray(Image.open(d / r["img"]["file"]).convert("L"), np.float64); N = 512
    h = ndimage.zoom(h, N / n, order=1); im = ndimage.zoom(im, N / im.shape[0], order=1)
    gz, gx = np.gradient(h, e["size_m"] / N); hp = lambda a: a - ndimage.gaussian_filter(a, 12)
    best = max(((float(np.corrcoef(hp(-(gx * np.sin(a) - gz * np.cos(a))).ravel(), hp(im).ravel())[0, 1]), a) for a in np.linspace(0, 2 * np.pi, 24, endpoint=False)))
    sh = hp(-(gx * np.sin(best[1]) - gz * np.cos(best[1]))); him = hp(im); peak = (-1, 0, 0)
    for dy in range(-12, 13, 2):
        for dx in range(-12, 13, 2):
            c = float(np.corrcoef(sh[16:-16, 16:-16].ravel(), np.roll(him, (dy, dx), (0, 1))[16:-16, 16:-16].ravel())[0, 1]); peak = max(peak, (c, dy, dx))
    ok = best[0] > 0.15 and abs(peak[1]) <= 2 and abs(peak[2]) <= 2; bad += not ok
    print(f"{'PASS' if ok else 'FAIL'}  {pid}: image against height shading, correlation {best[0]:.2f} (sun azimuth fitted {np.degrees(best[1]):.0f} deg), best shift {peak[2] * e['size_m'] / N:.0f} m east, {peak[1] * e['size_m'] / N:.0f} m south")
sys.exit(1 if bad else 0)
