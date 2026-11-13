#!/usr/bin/env python3
"""Self-test of pipeline/fetch_windows.py on format-faithful SYNTHETIC rasters (never shipped, never shown as real).

It writes small GeoTIFFs with the same projections, pixel sizes, nodata values and file layouts as the real products
(Mars equirectangular 1 m DTM and 0.5 m ortho, lunar polar stereographic 5 m DEM, a GLO-30 style 1 arc-second tile, a WMTS
tile pyramid), filled with a known analytic surface h(lon, lat). The fetcher then builds sites from them into a temporary
folder, and the result is compared with the analytic surface evaluated independently at every grid node.

  python pipeline/test_fetch_windows.py [--keep DIR]     # DIR keeps the outputs (used to try the app on high-resolution tiles)
"""
import json, math, os, shutil, sys, tempfile
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent; ROOT = HERE.parent
sys.path.insert(0, str(HERE))


def surf(body, lon, lat, lat0, lon0, R):
    """Analytic test surface in metres: broad relief, 40 m ripples, a crater and a scarp. Depends only on position on the sphere."""
    e = np.radians(lon - lon0) * R * math.cos(math.radians(lat0)) if abs(lat0) < 80 else R * np.radians(90 - np.abs(lat)) * np.sin(np.radians(lon - lon0))
    n = np.radians(lat - lat0) * R if abs(lat0) < 80 else R * np.radians(90 - np.abs(lat)) * np.cos(np.radians(lon - lon0)) - R * math.radians(90 - abs(lat0))
    h = 60 * np.sin(e / 900.0) * np.cos(n / 700.0) + 4 * np.sin(e / 40.0 + 1.3) * np.sin(n / 55.0) + 0.6 * np.sin(e / 6.0) * np.cos(n / 7.0)
    r = np.hypot(e - 300, n + 250) / 120.0; h = h - 18 * np.exp(-r ** 4) + 5 * np.exp(-((r - 1.05) / 0.12) ** 2)
    h = h + 12 / (1 + np.exp(-(e + 0.5 * n + 400) / 6.0))
    return h - 2500.0


def shade(body, lon, lat, lat0, lon0, R, d=1e-5):
    hx = (surf(body, lon + d, lat, lat0, lon0, R) - surf(body, lon - d, lat, lat0, lon0, R)) / (2 * math.radians(d) * R * max(0.02, math.cos(math.radians(lat0))))
    hy = (surf(body, lon, lat + d, lat0, lon0, R) - surf(body, lon, lat - d, lat0, lon0, R)) / (2 * math.radians(d) * R)
    return np.clip(128 + 260 * (hx * 0.7 + hy * 0.7), 5, 250)


def write_tif(path, fn, width, height, transform, crs_wkt, dtype, nodata=None, tiled=False, compress=None, chunk=1024, inv=None):
    import rasterio
    path.parent.mkdir(parents=True, exist_ok=True)
    kw = dict(driver="GTiff", width=width, height=height, count=1, dtype=dtype, transform=transform, crs=crs_wkt, nodata=nodata, BIGTIFF="IF_SAFER")
    if tiled: kw.update(tiled=True, blockxsize=512, blockysize=512)
    if compress: kw.update(compress=compress)
    with rasterio.open(path, "w", **kw) as ds:
        for r0 in range(0, height, chunk):
            rows = np.arange(r0, min(height, r0 + chunk)); cols = np.arange(width)
            x = transform.c + (cols + 0.5) * transform.a; y = transform.f + (rows + 0.5) * transform.e
            X, Y = np.meshgrid(x, y); lon, lat = inv(X, Y)
            ds.write(fn(lon, lat).astype(dtype), 1, window=rasterio.windows.Window(0, r0, width, len(rows)))


def main():
    import rasterio
    from rasterio.transform import Affine
    keep = sys.argv[sys.argv.index("--keep") + 1] if "--keep" in sys.argv else None
    tmp = Path(keep) if keep else Path(tempfile.mkdtemp(prefix="terra_fw_")); tmp.mkdir(parents=True, exist_ok=True)
    raw = tmp / "raw"; out = tmp / "processed"; out.mkdir(parents=True, exist_ok=True)
    # a private copy of the index and the patch file, so the real project data is not touched
    for f in ("patches_index.json", "patches.bin"): shutil.copy(ROOT / "data" / "processed" / f, out / f)
    import fetch_windows as FW
    FW.OUT = out; FW.RAW = raw; FW.CACHE = raw / "cache"; FW.ROOT = tmp
    Rm, Rl, Re = FW.RADIUS["mars"], FW.RADIUS["moon"], FW.RADIUS["earth"]
    mars_wkt = f"+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +R={Rm} +units=m +no_defs"
    sp_wkt = f"+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +R={Rl} +units=m +no_defs"
    sites = {}
    # ---- Mars: 1 m DTM, float32, uncompressed strips, nodata -3.4028e38 (as the Jezero mosaic), and a 0.5 m 8-bit ortho, LZW
    la0, lo0 = 18.4446, 77.4509
    x0 = Rm * math.radians(lo0) - 5600; y0 = Rm * math.radians(la0) + 5600; W = 11200
    inv = lambda X, Y: (np.degrees(X / Rm), np.degrees(Y / Rm))
    nod = np.float32(-3.4028234663852886e38)
    def f_dtm(lon, lat):
        h = surf("mars", lon, lat, la0, lo0, Rm); e = np.radians(lon - lo0) * Rm
        return np.where((e > 3800) & (np.radians(lat - la0) * Rm > 2500), nod, h)   # a nodata corner, as in the real mosaic
    if not (raw / "sites/mars_jezero/TEST_DTM_1m.tif").exists():
        write_tif(raw / "sites/mars_jezero/TEST_DTM_1m.tif", f_dtm, W, W, Affine(1, 0, x0, 0, -1, y0), mars_wkt, "float32", float(nod), inv=inv)
        xo = Rm * math.radians(lo0) - 2600; yo = Rm * math.radians(la0) + 2600
        write_tif(raw / "sites/mars_jezero/TEST_ortho_50cm.tif", lambda lon, lat: shade("mars", lon, lat, la0, lo0, Rm), 10400, 10400, Affine(0.5, 0, xo, 0, -0.5, yo), mars_wkt, "uint8", None, tiled=True, compress="lzw", inv=inv)
    sites["tgt_mars_jezero"] = dict(body="mars", site_center=[la0, lo0],
        elevation=[dict(name="t_dtm", type="geotiff", label="TEST synthetic raster (HiRISE DTM layout)", local=["raw/sites/mars_jezero/*DTM*.tif"], datum="test")],
        imagery=[dict(name="t_ortho", type="geotiff", label="TEST synthetic raster (HiRISE ortho layout)", gray=True, eight_bit=True, local=["raw/sites/mars_jezero/*ortho*.tif"])])
    # ---- Moon south pole: 5 m polar stereographic, float32, tiled deflate
    ls0, lp0 = -89.0, 0.0
    cy = Rl * 2 * math.tan(math.pi / 4 - math.radians(89.0) / 2)   # the site sits at x = 0, y = +cy (lon 0)
    def inv_sp(X, Y):
        rho = np.hypot(X, Y); return np.degrees(np.arctan2(X, Y)), -(90 - np.degrees(2 * np.arctan(rho / (2 * Rl))))
    if not (raw / "sites/moon_sp/ldem_87s_5mpp.tif").exists():
        write_tif(raw / "sites/moon_sp/ldem_87s_5mpp.tif", lambda lon, lat: surf("moon", lon, lat, ls0, lp0, Rl), 2400, 2400, Affine(5, 0, -6000, 0, -5, cy + 6000), sp_wkt, "float32", -3.4028234663852886e38, tiled=True, compress="deflate", inv=inv_sp)
    sites["tgt_moon_sp"] = dict(body="moon", site_center=[ls0, lp0], elevation=[dict(name="t_lola", type="geotiff", label="TEST synthetic raster (LOLA 5 m layout)", local=["raw/sites/moon_sp/*5mpp*.tif"])], imagery=[])
    # ---- Earth: a GLO-30 style 1 arc-second tile (3600 x 3600, deflate, tiled) and a WMTS pyramid (plate carree, level 13) for imagery
    le0, lo_e = 24.25, 67.75; name = FW.Glo30().name(24, 67)
    if not (raw / "earth/glo30" / f"{name}.tif").exists():
        write_tif(raw / "earth/glo30" / f"{name}.tif", lambda lon, lat: surf("earth", lon, lat, le0, lo_e, Re) + 3000, 3600, 3600, Affine(1 / 3600, 0, 67 - 0.5 / 3600, 0, -1 / 3600, 25 + 0.5 / 3600), "EPSG:4326", "float32", None, tiled=True, compress="deflate", inv=lambda X, Y: (X, Y))
        from PIL import Image
        z = 13; T = 256; deg = 360.0 / (2 * 2 ** z * T)
        c0, c1 = int((lo_e - 0.06 + 180) / deg // T), int((lo_e + 0.06 + 180) / deg // T); r0, r1 = int((90 - le0 - 0.06) / deg // T), int((90 - le0 + 0.06) / deg // T)
        for r in range(r0, r1 + 1):
            for c in range(c0, c1 + 1):
                lon = -180 + (c * T + np.arange(T) + 0.5) * deg; lat = 90 - (r * T + np.arange(T) + 0.5) * deg; LO, LA = np.meshgrid(lon, lat)
                g = shade("earth", LO, LA, le0, lo_e, Re).astype(np.uint8); p = raw / "wmts" / str(z) / str(r); p.mkdir(parents=True, exist_ok=True)
                Image.fromarray(np.dstack([g, (g * 0.9).astype(np.uint8), (g * 0.7).astype(np.uint8)])).save(p / f"{c}.jpg", quality=92)
    sites["earth"] = dict(body="earth", elevation=[dict(name="glo30", type="glo30", label="TEST synthetic raster (GLO-30 layout)", url="file:///nonexistent/{n}.tif")],
        imagery=[dict(name="t_wmts", type="wmts", label="TEST synthetic tiles (WMTS layout)", grid="wgs84", zmax=13, eight_bit=True, url=str(raw / "wmts") + "/{z}/{y}/{x}.jpg")])
    FW.CFG = dict(sites=sites)
    index = json.loads((out / "patches_index.json").read_text())
    class A: img_px = 2048
    fails = []
    jobs = [("tgt_mars_jezero", "mars", la0, lo0, Rm, 0.02), ("tgt_moon_sp", "moon", ls0, lp0, Rl, 0.25), ("E+024.25_+0067.75", "earth", le0, lo_e, Re, 0.9)]
    for pid, body, la, lo, R, tol in jobs:
        ok = FW.build_site(pid, body, la, lo, sites["earth" if body == "earth" else pid], index, A)
        e = index["patches"][pid]
        if not ok or not e.get("real"): fails.append(f"{pid}: not built"); continue
        n = e["real"]["n"]; q = FW.decode_h16((out / "sites" / pid / "fine.h16").read_bytes(), n).astype(np.float64) * e["real"]["hscale"] + e["real"]["hmin"]
        lon, lat = FW.grid_lonlat(body, la, lo, FW.PATCH_M, n)
        want = surf(body, lon, lat, la, lo, R) + (3000 if body == "earth" else 0)
        if pid == "tgt_mars_jezero": m = ~((np.radians(lon - lo) * R > 3700) & (np.radians(lat - la) * R > 2400))
        else: m = np.ones_like(want, bool)
        err = np.abs(q - want)[m]; rms = float(np.sqrt((err ** 2).mean())); mx = float(err.max())
        print(f"   CHECK {pid}: fine grid {n}, error against the analytic surface rms {rms:.3f} m, max {mx:.3f} m (tolerance rms {tol} m), synthetic_fine {e['synthetic_fine']}")
        if rms > tol: fails.append(f"{pid}: rms {rms:.3f} m above {tol} m")
        t = json.loads((out / "sites" / pid / "truth.json").read_text())["points"]
        te = max(abs(p["h"] - float(surf(body, np.array(p["lon"]), np.array(p["lat"]), la, lo, R) + (3000 if body == "earth" else 0))) for p in t)
        print(f"   CHECK {pid}: {len(t)} truth points, worst difference from the analytic surface {te:.3f} m")
        if te > (2.5 if body == "earth" else max(0.05, tol)): fails.append(f"{pid}: truth points off by {te:.3f} m")
        for k in ("elevation_source", "elevation_resolution_m", "imagery_source", "imagery_resolution_m", "synthetic_fine", "date_built"):
            if k not in e: fails.append(f"{pid}: field {k} missing")
        if e["real"]["img"]:
            from PIL import Image
            im = np.asarray(Image.open(out / "sites" / pid / "img.jpg").convert("L"), np.float64); px = im.shape[0]
            lon, lat = FW.grid_lonlat(body, la, lo, FW.PATCH_M, px); ws = shade(body, lon, lat, la, lo, R)
            c = float(np.corrcoef(im.ravel(), ws.ravel())[0, 1]); print(f"   CHECK {pid}: imagery against the analytic shading, correlation {c:.3f}")
            if c < 0.9: fails.append(f"{pid}: imagery correlation {c:.3f}")
    (out / "patches_index.json").write_text(json.dumps(index))
    print("\nFAILED:\n  " + "\n  ".join(fails) if fails else "\nALL FETCHER CHECKS PASSED (synthetic format-faithful rasters; real products were not read in this test)")
    if not keep: shutil.rmtree(tmp, ignore_errors=True)
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
