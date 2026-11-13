#!/usr/bin/env python3
"""Round-trip test of the real-data readers using format-faithful synthetic files written to a temp folder
(the real NASA files could not be downloaded in the build sandbox). Run: python pipeline/test_readers.py"""
import sys
import tempfile
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import terra as T  # noqa: E402


def main():
    d = Path(tempfile.mkdtemp())
    # PDS3 LOLA-style label + image (int16 MSB, scaling factor 0.5, offset 1737400)
    lines, samples = 90, 180
    truth = (np.random.default_rng(1).normal(0, 800, (lines, samples))).round(0)
    dn = ((truth - 0) / 0.5 + 0).astype(">i2")
    dn.tofile(d / "LDEM_T.IMG")
    (d / "LDEM_T.LBL").write_text(f'PDS_VERSION_ID = PDS3\nOBJECT = IMAGE\n  LINES = {lines}\n  LINE_SAMPLES = {samples}\n  SAMPLE_TYPE = MSB_INTEGER\n'
                                  f'  SAMPLE_BITS = 16\n  SCALING_FACTOR = 0.5 <METER>\n  OFFSET = 0.0 <METER>\nEND_OBJECT = IMAGE\nEND\n')
    arr, kv = T.read_pds3_image(d / "LDEM_T.LBL")
    assert arr.shape == (lines, samples) and np.allclose(arr, truth, atol=0.5), "PDS3 reader mismatch"
    # PDS4 MOLA-style: use the supplied real label next to a synthetic image of the right size
    real_xml = T.RAW / "mars" / "megt90n000eb.xml"
    if real_xml.exists():
        (d / "m.xml").write_text(real_xml.read_text().replace("megt90n000eb.img", "m.img"))
        mola = np.random.default_rng(2).integers(-8000, 21000, (2880, 5760)).astype(">i2")
        mola.tofile(d / "m.img")
        out = T.read_mola_pds4(d / "m.xml", d / "m.img")
        assert out.shape == (2880, 5760) and np.array_equal(out, mola.astype(np.float32)), "PDS4 reader mismatch"
        f = T.real_target_terrain(out, 1 / 16, 3396000.0, T.TARGETS[2])
        assert all(np.isfinite(v) for v in f.values()), "Mars target extraction failed"
        print("MOLA reader and target extraction OK:", {k: round(v, 1) for k, v in f.items()})
    # window feature sanity: a tilted plane of 10 degrees must give slope_med of about 10 and zero roughness
    x = np.tile(np.arange(T.WIN) * 2000.0, (T.WIN, 1))
    w = (x * np.tan(np.radians(10)))[None].astype(np.float32)
    f = T.window_features(w, 2000.0, 2000.0)
    assert abs(float(f["slope_med"][0]) - 10) < 0.1 and float(f["roughness"][0]) < 1e-3 * 2000, f
    print("PDS3 reader OK; window features OK (10 degree plane ->", round(float(f["slope_med"][0]), 2), "deg)")


if __name__ == "__main__":
    main()
