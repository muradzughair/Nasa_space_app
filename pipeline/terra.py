"""TerraAnalog pipeline library.

Everything the offline pipeline needs: real-file readers (PDS3 / PDS4 / GeoTIFF),
demo-data generators used when the real files are missing, trait extraction on a
common scale, the similarity engine, hotspot merging, terrain-patch synthesis and
template explanations.

Design rule: demo data only replaces the *readers*. Trait extraction, normalisation,
scoring and hotspot merging are the same code for demo and real data.
"""
import json
import math
import re
from pathlib import Path

import numpy as np
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data" / "processed"

# ---------------------------------------------------------------- grid
RES = 0.5                      # degrees per Earth scoring cell
NLAT, NLON = int(180 / RES), int(360 / RES)
LAT_C = 90 - RES * (np.arange(NLAT) + 0.5)
LON_C = -180 + RES * (np.arange(NLON) + 0.5)
WIN = 28                       # window size in ~2 km pixels (about 0.5 degree on Earth)
PX_M = 2000.0                  # common working pixel size (m)
PATCH_N = 129                  # terrain patch samples per side
PATCH_M = 2000.0               # terrain patch size (m)
HSCALE = 0.02                  # patch height quantisation (m per count)

# key, label, unit, log-transformed before z-scoring, group
TRAITS = [
    ("relief", "Local relief (p95-p5)", "m", True),
    ("slope_med", "Median slope", "deg", True),
    ("slope_p90", "Steep slope (p90)", "deg", True),
    ("roughness", "Surface roughness", "m", True),
    ("temp_mean", "Mean surface temperature", "K", False),
    ("temp_range", "Temperature range", "K", False),
    ("soil", "Soil / rock competence", "0-1", False),
    ("dust", "Dust and regolith cover", "0-1", False),
    ("sun_elev", "Mean noon sun elevation", "deg", False),
]
KEYS = [t[0] for t in TRAITS]
LOGK = {t[0] for t in TRAITS if t[3]}
# traits that come from real terrain data when DEMs are present; the rest are proxies/placeholders
TERRAIN_KEYS = ["relief", "slope_med", "slope_p90", "roughness"]

PURPOSES = {
    "rover": {"label": "Rover mobility", "w": dict(relief=0.5, slope_med=2, slope_p90=2, roughness=2, temp_mean=0.2, temp_range=0.2, soil=1.5, dust=1.5, sun_elev=0.1)},
    "habitat": {"label": "Habitat siting", "w": dict(relief=1.5, slope_med=1.5, slope_p90=1.5, roughness=0.3, temp_mean=0.6, temp_range=0.6, soil=1.0, dust=0.5, sun_elev=1.5)},
    "thermal": {"label": "Thermal and dust", "w": dict(relief=0.2, slope_med=0.3, slope_p90=0.3, roughness=0.3, temp_mean=1.2, temp_range=2.5, soil=0.4, dust=2.0, sun_elev=0.3)},
}
CUSTOM_DEFAULT = {k: 1.0 for k in KEYS}

TARGETS = [
    dict(id="moon_sp", body="moon", name="Lunar south pole region", short="South pole", lat=-89.0, lon=0.0, polar=True, style="crater",
         rover="lunar_generic", note="Shackleton / de Gerlache rim area, permanent-shadow and near-permanent-light terrain",
         demo=dict(relief=2200, hurst=0.70, temp_mean=125, temp_range=70, soil=0.30, dust=0.90, sun_elev=1.5)),
    dict(id="moon_a11", body="moon", name="Apollo 11, Mare Tranquillitatis", short="Apollo 11 mare", lat=0.674, lon=23.473, polar=False, style="plain",
         rover="lunar_generic", note="Mid-latitude lunar mare plain, mostly gentle slopes with small craters",
         demo=dict(relief=90, hurst=0.62, temp_mean=215, temp_range=280, soil=0.35, dust=0.95, sun_elev=89)),
    dict(id="mars_jezero", body="mars", name="Jezero Crater", short="Jezero", lat=18.38, lon=77.58, polar=False, style="delta",
         rover="perseverance", note="Mars 2020 landing site: crater floor, river delta and scarps",
         demo=dict(relief=1300, hurst=0.75, temp_mean=212, temp_range=90, soil=0.45, dust=0.65, sun_elev=72)),
    dict(id="mars_gale", body="mars", name="Gale Crater", short="Gale", lat=-5.4, lon=137.8, polar=False, style="mound",
         rover="perseverance", note="Curiosity site: crater floor beside the Aeolis Mons layered mound",
         demo=dict(relief=3500, hurst=0.80, temp_mean=215, temp_range=90, soil=0.50, dust=0.55, sun_elev=85)),
]
GRAVITY = {"moon": 1.62, "mars": 3.71, "earth": 9.81}

# well-known analog and desert regions, used for naming hotspots and for validation
GAZETTEER = [
    ("Atacama Desert", -24.0, -69.5), ("Death Valley", 36.5, -117.0), ("Haughton Crater, Devon Island", 75.4, -89.7),
    ("Sahara", 23.0, 13.0), ("Libyan Desert", 26.0, 25.0), ("Namib Desert", -24.0, 15.0), ("Kalahari", -23.0, 22.0),
    ("Rub al Khali", 20.0, 50.0), ("Dasht-e Lut", 31.0, 59.0), ("Gobi Desert", 43.0, 103.0), ("Taklamakan", 39.0, 83.0),
    ("Tibetan Plateau", 33.0, 88.0), ("Himalaya", 28.0, 86.0), ("Antarctic Dry Valleys", -77.5, 162.0),
    ("Antarctic Plateau", -82.0, 60.0), ("Greenland ice sheet", 72.0, -40.0), ("Svalbard", 78.5, 16.0), ("Iceland", 65.0, -18.0),
    ("Ellesmere Island", 80.0, -85.0), ("Altiplano", -19.0, -68.0), ("Patagonia", -47.0, -70.0), ("Great Basin", 40.0, -116.0),
    ("Colorado Plateau", 37.0, -110.0), ("Mojave Desert", 35.0, -116.0), ("Sonoran Desert", 32.0, -112.0),
    ("Chihuahuan Desert", 29.0, -105.0), ("Australian Outback", -25.0, 134.0), ("Great Sandy Desert", -21.0, 125.0),
    ("Sinai", 29.0, 34.0), ("Ethiopian Highlands", 9.0, 39.0), ("Danakil Depression", 11.5, 41.0), ("Atlas Mountains", 32.0, -5.0),
    ("Iranian Plateau", 33.0, 55.0), ("Pamir Mountains", 38.0, 73.0), ("Rocky Mountains", 45.0, -110.0), ("Alps", 46.5, 10.0),
    ("Siberian Plateau", 65.0, 105.0), ("Canadian Arctic", 70.0, -100.0), ("Andes", -33.0, -70.0), ("Hoggar Mountains", 23.0, 6.0),
    ("Arabian Peninsula", 24.0, 45.0), ("Thar Desert", 27.0, 71.0), ("Karakum Desert", 40.0, 60.0), ("Victoria Land", -75.0, 160.0),
]


def nearest_name(lat, lon, max_deg=14.0):
    best, bd = None, 1e9
    for n, la, lo in GAZETTEER:
        dl = (lon - lo + 180) % 360 - 180
        d = math.hypot(lat - la, dl * math.cos(math.radians((lat + la) / 2)))
        if d < bd:
            best, bd = n, d
    return best if bd <= max_deg else f"{abs(lat):.1f}{'N' if lat >= 0 else 'S'} {abs(lon):.1f}{'E' if lon >= 0 else 'W'}"


# ---------------------------------------------------------------- readers (real data)
def parse_pds3_label(path):
    """Minimal PDS3 .LBL parser for the keywords needed to read a simple IMAGE object."""
    txt = Path(path).read_text(errors="ignore")
    kv = {}
    for m in re.finditer(r"^\s*([A-Z_^]+)\s*=\s*(.+?)\s*$", txt, re.M):
        k, v = m.group(1), m.group(2).split("<")[0].strip().strip('"')
        kv.setdefault(k, v)
    return kv


def read_pds3_image(lbl_path):
    """Read a LOLA GDR cylindrical IMG using its label: returns (array float32 in physical units, label dict)."""
    lbl = Path(lbl_path)
    kv = parse_pds3_label(lbl)
    img = lbl.with_suffix(".IMG")
    if not img.exists():
        img = lbl.with_suffix(".img")
    lines, samples = int(kv["LINES"]), int(kv["LINE_SAMPLES"])
    bits = int(kv["SAMPLE_BITS"])
    st = kv.get("SAMPLE_TYPE", "MSB_INTEGER")
    endian = ">" if st.startswith("MSB") or "SUN" in st else "<"
    kind = "f" if "REAL" in st else ("u" if "UNSIGNED" in st else "i")
    arr = np.fromfile(img, dtype=np.dtype(f"{endian}{kind}{bits // 8}")).reshape(lines, samples).astype(np.float32)
    arr = arr * float(kv.get("SCALING_FACTOR", 1)) + float(kv.get("OFFSET", 0))
    return arr, kv


def read_mola_pds4(xml_path, img_path=None):
    """MOLA MEGDR 16 pixel/deg: Array_2D_Image, SignedMSB2, metres, row 0 = 90N, column 0 = 0E."""
    xml = Path(xml_path)
    t = xml.read_text(errors="ignore")
    lines = int(re.search(r"<axis_name>Line</axis_name>\s*<elements>(\d+)", t).group(1))
    samples = int(re.search(r"<axis_name>Sample</axis_name>\s*<elements>(\d+)", t).group(1))
    img = Path(img_path) if img_path else xml.with_suffix(".img")
    return np.fromfile(img, dtype=">i2").reshape(lines, samples).astype(np.float32)


def read_geotiff(path):
    """Global north-up GeoTIFF (ETOPO 2022 60 arc-second). Tries rasterio, then Pillow."""
    try:
        import rasterio  # type: ignore
        with rasterio.open(path) as ds:
            return ds.read(1).astype(np.float32)
    except ImportError:
        from PIL import Image
        Image.MAX_IMAGE_PIXELS = None
        return np.asarray(Image.open(path), dtype=np.float32)


# ---------------------------------------------------------------- synthetic generators (demo data)
def fbm_batch(rng, n, h, w, hurst):
    """Batch of n spectral-synthesis surfaces, unit std. hurst scalar or array of length n."""
    kx, ky = np.fft.fftfreq(w)[None, :], np.fft.fftfreq(h)[:, None]
    k = np.sqrt(kx ** 2 + ky ** 2)
    k[0, 0] = 1
    hh = np.broadcast_to(np.asarray(hurst, dtype=np.float32), (n,))[:, None, None]
    amp = k[None] ** (-(hh + 1.0))
    amp[:, 0, 0] = 0
    out = np.fft.ifft2(np.fft.fft2(rng.standard_normal((n, h, w)).astype(np.float32)) * amp).real
    return (out / (out.std(axis=(1, 2), keepdims=True) + 1e-9)).astype(np.float32)


def smooth_noise(rng, shape, corr):
    f = ndimage.gaussian_filter(rng.standard_normal(shape), corr, mode="wrap")
    return ((f - f.mean()) / f.std()).astype(np.float32)


def _bump(la, lo, la0, lo0, sla, slo, amp):
    dl = (lo - lo0 + 180) % 360 - 180
    return amp * np.exp(-0.5 * (((la - la0) / sla) ** 2 + (dl / slo) ** 2))


MOUNTAINS = [(-20, -68, 25, 4, 1.0), (-45, -71, 8, 3, 0.7), (33, 88, 7, 14, 1.0), (37, 72, 5, 9, 0.8), (45, -112, 8, 5, 0.8), (36, -118, 5, 4, 0.3),
             (46, 10, 2.5, 6, 0.8), (32, -5, 3, 6, 0.6), (9, 39, 4, 4, 0.7), (63, 10, 5, 5, 0.6), (-37, 147, 5, 4, 0.4), (60, 150, 8, 12, 0.35),
             (-77, 160, 5, 8, 0.6), (35, 55, 5, 8, 0.5), (23, 6, 3, 4, 0.5), (-5, 37, 6, 4, 0.3), (40, -112, 5, 4, 0.4), (10, -75, 5, 4, 0.5)]
DESERTS = [(23, 13, 8, 24, 0.7), (21, 48, 6, 10, 0.6), (31, 59, 5, 6, 0.4), (43, 103, 4, 10, 0.5), (39, 83, 3, 6, 0.5), (-24, -69, 7, 2.5, 0.9),
           (36, -117, 3, 3, 0.7), (33, -111, 4, 5, 0.5), (-25, 134, 7, 12, 0.6), (-24, 18, 8, 6, 0.6), (75, -90, 4, 10, 0.35), (-77, 162, 3, 6, 0.6),
           (80, -50, 6, 18, 0.5), (-82, 60, 7, 40, 0.4), (27, 71, 4, 6, 0.5)]


def demo_earth_fields(rng, land):
    """Synthetic Earth trait inputs on the 0.5 degree grid. Land shape is real (global-land-mask); everything else is invented."""
    la, lo = np.meshgrid(LAT_C, LON_C, indexing="ij")
    rug = 0.42 + 0.22 * smooth_noise(rng, la.shape, 6) + 0.1 * smooth_noise(rng, la.shape, 2)
    for a in MOUNTAINS:
        rug = rug + _bump(la, lo, *a)
    rug = np.where(la < -70, rug * 0.5, rug)
    rug = np.clip(rug, 0.02, 1.0)
    arid = 0.32 + 0.18 * smooth_noise(rng, la.shape, 5) + 0.28 * np.exp(-(((np.abs(la) - 25) / 10) ** 2))
    for a in DESERTS:
        arid = arid + _bump(la, lo, *a)
    arid = np.clip(arid, 0, 1)
    hurst = np.clip(0.72 + 0.08 * smooth_noise(rng, la.shape, 4) - 0.12 * rug, 0.5, 0.95)
    dist = ndimage.distance_transform_edt(land)  # cells from coast, inside land
    cont = np.clip(dist / 30.0, 0, 1)
    elev_km = 2.5 * rug ** 1.5
    return dict(
        la=la, lo=lo, rug=rug, arid=arid, hurst=hurst,
        relief=40 + 2200 * rug ** 1.7,
        temp_mean=301 - 0.0058 * la ** 2 - 6.5 * elev_km - 4 * cont * (np.abs(la) > 55),
        temp_range=18 + 0.30 * np.abs(la) * (0.4 + 0.6 * cont) + 22 * arid + 6 * cont,
        soil=np.clip(0.28 + 0.40 * rug + 0.25 * arid + 0.06 * smooth_noise(rng, la.shape, 3), 0, 1),
        dust=np.clip(0.12 + 0.70 * arid * (1 - 0.55 * rug) + 0.05 * smooth_noise(rng, la.shape, 3), 0, 1),
        sun_elev=90 - np.abs(la),
    )


# ---------------------------------------------------------------- trait extraction (common for demo and real)
def window_features(wins, dx, dy):
    """wins (n,H,W) heights in m; dx,dy pixel size in m (scalar or (n,)). Returns dict of (n,) arrays."""
    dx = np.broadcast_to(np.asarray(dx, np.float32), (wins.shape[0],))[:, None, None]
    dy = np.broadcast_to(np.asarray(dy, np.float32), (wins.shape[0],))[:, None, None]
    gy = np.gradient(wins, axis=1) / dy
    gx = np.gradient(wins, axis=2) / dx
    slope = np.degrees(np.arctan(np.hypot(gx, gy))).reshape(wins.shape[0], -1)
    flat = wins.reshape(wins.shape[0], -1)
    resid = wins - ndimage.uniform_filter(wins, size=(1, 3, 3), mode="nearest")
    return dict(
        relief=np.percentile(flat, 95, axis=1) - np.percentile(flat, 5, axis=1),
        slope_med=np.median(slope, axis=1),
        slope_p90=np.percentile(slope, 90, axis=1),
        roughness=np.sqrt((resid[:, 1:-1, 1:-1] ** 2).reshape(wins.shape[0], -1).mean(axis=1)),  # interior only: no edge padding bias
    )


def earth_terrain_demo(rng, fields, land):
    """Per-cell terrain traits for land cells from synthetic windows; returns dict of (NLAT,NLON) arrays (NaN at sea)."""
    out = {k: np.full((NLAT, NLON), np.nan, np.float32) for k in TERRAIN_KEYS}
    for i in range(NLAT):
        idx = np.where(land[i])[0]
        if idx.size == 0:
            continue
        w = fbm_batch(rng, idx.size, WIN, WIN, fields["hurst"][i, idx])
        w *= (fields["relief"][i, idx] / 3.29)[:, None, None]
        f = window_features(w, PX_M, PX_M)
        for k in TERRAIN_KEYS:
            out[k][i, idx] = f[k]
    return out


def target_terrain_demo(rng, tgt):
    """Median features over 9 synthetic windows (mimics the 3x3 neighbour windows used for real data)."""
    d = tgt["demo"]
    w = fbm_batch(rng, 9, WIN, WIN, d["hurst"]) * (d["relief"] / 3.29)
    f = window_features(w, PX_M, PX_M)
    return {k: float(np.median(f[k])) for k in TERRAIN_KEYS}


def grid_windows(arr, lat_c, lon_c, px_deg, size=WIN):
    """Cut a size x size window centred on (lat_c, lon_c) from an equirectangular grid (row 0 = north, col 0 = lon 0 or -180)."""
    h, w = arr.shape
    r = int(round((90 - lat_c) / px_deg - 0.5)) - size // 2
    c = int(round((lon_c % 360) / px_deg - 0.5)) - size // 2
    rows = np.clip(np.arange(r, r + size), 0, h - 1)
    cols = np.arange(c, c + size) % w
    return arr[np.ix_(rows, cols)]


def real_target_terrain(dem, px_deg, radius_m, tgt):
    """Median features over the 3x3 windows around the target. For Mars (3.7 km px) the windows are upsampled to ~2 km first."""
    zoom = max(1.0, (px_deg * math.pi / 180 * radius_m) / PX_M)
    lat0, lon0 = tgt["lat"], tgt["lon"]
    wins = []
    for di in (-1, 0, 1):
        for dj in (-1, 0, 1):
            la = float(np.clip(lat0 + di * WIN * px_deg, -89.9, 89.9))
            lo = lon0 + dj * WIN * px_deg / max(math.cos(math.radians(la)), 0.05)
            w = grid_windows(dem, la, lo, px_deg, WIN)
            wins.append(ndimage.zoom(w, zoom, order=1)[:WIN, :WIN] if zoom > 1.2 else w)
    wins = np.stack([x[:WIN, :WIN] for x in wins]).astype(np.float32)
    dy = px_deg * math.pi / 180 * radius_m / (zoom if zoom > 1.2 else 1)
    dx = dy * max(math.cos(math.radians(tgt["lat"])), 0.05)
    f = window_features(wins, dx, dy)
    return {k: float(np.median(f[k])) for k in TERRAIN_KEYS}


def real_earth_terrain(etopo, land):
    """ETOPO 60 arc-second (21600x10800): each 0.5 degree cell = 30x30 px window. Returns per-cell terrain traits."""
    h, w = etopo.shape
    step = int(round(RES * h / 180))
    out = {k: np.full((NLAT, NLON), np.nan, np.float32) for k in TERRAIN_KEYS}
    for i in range(NLAT):
        idx = np.where(land[i])[0]
        if idx.size == 0:
            continue
        strip = etopo[i * step:(i + 1) * step]
        wins = np.stack([strip[:, j * step:(j + 1) * step] for j in idx])
        dy = 180 / h * 111320.0  # metres per row
        dx = dy * max(math.cos(math.radians(LAT_C[i])), 0.05)
        f = window_features(wins.astype(np.float32), dx, dy)
        for k in TERRAIN_KEYS:
            out[k][i, idx] = f[k]
    return out


# ---------------------------------------------------------------- similarity engine
def tf(key, v):
    return np.log1p(np.maximum(v, 0)) if key in LOGK else np.asarray(v, np.float64)


def zstats(raw, land):
    return {k: (float(np.nanmean(tf(k, raw[k][land]))), float(np.nanstd(tf(k, raw[k][land])) + 1e-9)) for k in KEYS}


def to_z(key, v, st):
    return np.clip((tf(key, v) - st[key][0]) / st[key][1], -4, 4)


def weights_vec(wdict, polar):
    w = np.array([wdict[k] for k in KEYS], float)
    if not polar:
        w[KEYS.index("sun_elev")] = 0.0
    return w


def score_from_z(zE, zT, w):
    """zE (T, ...) normalised Earth traits, zT (T,) target; returns 0-100 score array."""
    sh = (len(KEYS),) + (1,) * (zE.ndim - 1)
    d2 = (w.reshape(sh) * (zE - zT.reshape(sh)) ** 2).sum(0) / w.sum()
    return 100.0 * np.exp(-0.5 * d2)


def sim_per_trait(zE_cell, zT):
    return 100.0 * np.exp(-0.5 * (zE_cell - zT) ** 2)


MIN_SEP_DEG = 7.0
MERGE_FRAC = 0.85   # neighbouring cells within 85 percent of the peak score are merged into the hotspot


def merge_hotspots(score, land, n=20):
    """Greedy peak picking with non-maximum suppression (hotspots at least MIN_SEP_DEG apart). Each peak absorbs the connected
    neighbouring cells scoring at least MERGE_FRAC of the peak (window of +-10 cells, longitude wraps), which gives its extent."""
    s = np.where(land, score, -1.0)
    order = np.argsort(s.ravel())[::-1]
    cell_km2 = (111.32 * RES) ** 2
    kept, kla, klo = [], [], []
    for idx in order:
        i, j = divmod(int(idx), NLON)
        if s[i, j] < 0:
            break
        la, lo = math.radians(LAT_C[i]), math.radians(LON_C[j])
        if kla:
            c = np.sin(la) * np.sin(kla) + np.cos(la) * np.cos(kla) * np.cos(lo - np.array(klo))
            if np.degrees(np.arccos(np.clip(c, -1, 1))).min() < MIN_SEP_DEG:
                continue
        rows = np.arange(max(0, i - 10), min(NLAT, i + 11))
        cols = np.arange(j - 10, j + 11) % NLON
        sub = s[np.ix_(rows, cols)] >= MERGE_FRAC * s[i, j]
        lab, _ = ndimage.label(sub, structure=np.ones((3, 3)))
        reg = lab == lab[i - rows[0], 10]
        rr = rows[np.where(reg)[0]]
        kept.append(dict(i=i, j=j, score=float(s[i, j]), ncells=int(reg.sum()), area_km2=float((np.cos(np.radians(LAT_C[rr])) * cell_km2).sum())))
        kla.append(la)
        klo.append(lo)
        if len(kept) >= n:
            break
    return kept


def hotspot_id(lat, lon):
    return f"E{lat:+07.2f}_{lon:+08.2f}"


# ---------------------------------------------------------------- terrain patches (synthetic stand-in, labelled in the UI)
def _smoothstep(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def _stamp_crater(h, X, Y, cx, cy, r, depth):
    d = np.hypot(X - cx, Y - cy)
    h += -depth * np.clip(1 - (d / r) ** 2, 0, None) + 0.12 * depth * np.exp(-(((d - r) / (0.14 * r)) ** 2))


def make_patch(seed, tr, style, n=PATCH_N, size_m=PATCH_M):
    """Synthetic terrain patch from trait values; slope statistics follow the traits. Returns (uint16 counts, stats dict)."""
    rng = np.random.default_rng(seed)
    dx = size_m / (n - 1)
    base = fbm_batch(rng, 1, n, n, 0.82)[0]
    gy, gx = np.gradient(base, dx)
    med = np.median(np.degrees(np.arctan(np.hypot(gx, gy))))
    slope_deg = float(np.clip(2.0 + 1.1 * tr["slope_med"], 2.0, 28.0))
    # scale so that the median slope of the fBm part matches slope_deg (tan is ~linear for small angles)
    h = base * (math.tan(math.radians(slope_deg)) / max(math.tan(math.radians(med)), 1e-6))
    X, Y = np.meshgrid(np.linspace(0, size_m, n), np.linspace(0, size_m, n))
    if style == "crater":
        _stamp_crater(h, X, Y, 0.38 * size_m, 0.55 * size_m, 0.30 * size_m, 130)
    elif style == "plain":
        for _ in range(16):
            r = rng.uniform(25, 90)
            _stamp_crater(h, X, Y, rng.uniform(0, size_m), rng.uniform(0, size_m), r, 0.17 * r)
    elif style == "delta":
        h += 32 * _smoothstep((X / size_m - 0.45) / 0.2) - 6 * _smoothstep((0.3 - X / size_m) / 0.3)
    elif style == "mound":
        h += 140 * np.exp(-(((X / size_m - 0.62) ** 2 + (Y / size_m - 0.5) ** 2) / (2 * 0.18 ** 2)))
    elif style == "earth":
        pass
    fine_rms = float(np.clip(0.015 * math.sqrt(max(tr["roughness"], 0.0)), 0.02, 0.5))
    h += fbm_batch(rng, 1, n, n, 0.45)[0] * fine_rms
    h -= h.min()
    counts = np.clip(np.round(h / HSCALE), 0, 65535).astype(np.uint16)
    gy, gx = np.gradient(counts.astype(np.float32) * HSCALE, dx)
    sl = np.degrees(np.arctan(np.hypot(gx, gy)))
    stats = dict(slope_med=float(np.median(sl)), slope_p90=float(np.percentile(sl, 90)), relief=float(h.max() - h.min()), fine_rms=fine_rms)
    return counts, stats


# ---------------------------------------------------------------- explanations (template; optional LLM in run_pipeline)
TRAIT_FMT = {"relief": "{:.0f} m", "slope_med": "{:.1f} deg", "slope_p90": "{:.1f} deg", "roughness": "{:.0f} m", "temp_mean": "{:.0f} K",
             "temp_range": "{:.0f} K", "soil": "{:.2f}", "dust": "{:.2f}", "sun_elev": "{:.0f} deg"}
SHORT = {"relief": "relief", "slope_med": "median slope", "slope_p90": "steep slope", "roughness": "roughness", "temp_mean": "mean temperature",
         "temp_range": "temperature range", "soil": "rock/soil competence", "dust": "dust cover", "sun_elev": "sun elevation"}


def template_explanation(target, purpose_label, site, score, tr_e, tr_t, sims, demo_note):
    order = [k for k in sorted(KEYS, key=lambda k: -sims[k])]
    best = [k for k in order if sims[k] >= 70][:2] or order[:1]
    worst = [k for k in reversed(order) if sims[k] < 70][:2]
    f = lambda k, tr: TRAIT_FMT[k].format(tr[k])
    s = f"{site} scores {score:.0f}/100 against {target} for {purpose_label.lower()}. "
    s += "Closest agreement: " + "; ".join(f"{SHORT[k]} ({f(k, tr_e)} here vs {f(k, tr_t)} on the target)" for k in best) + ". "
    if worst:
        s += "Largest gaps: " + "; ".join(f"{SHORT[k]} ({f(k, tr_e)} vs {f(k, tr_t)})" for k in worst) + ". "
    else:
        s += "No trait differs strongly from the target. "
    s += "Gravity is not part of this score; the rover simulation shows which behaviours still differ. " + demo_note
    return s
