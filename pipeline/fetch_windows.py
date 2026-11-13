#!/usr/bin/env python3
"""Window fetcher and tile builder for the Site View ground (G1 and G2).

For every site (the four targets and the Earth hotspots that have a terrain patch) this reads ONLY the window that is needed
from the elevation and imagery sources, reprojects it to a local metric grid (x east, z south, metres, centred on the site),
and writes small files the app loads offline:

  data/processed/sites/<patch id>/fine.h16   real heights of the 2 km patch (16 bit, delta coded, gzip)
  data/processed/sites/<patch id>/ctx.h16    heights of the 10 km context ring at 62.5 m
  data/processed/sites/<patch id>/img.jpg    imagery draped on the patch          (when an imagery source worked)
  data/processed/sites/<patch id>/ctx.jpg    imagery of the context ring
  data/processed/sites/<patch id>/truth.json heights sampled straight from the source at random points (used by tests/ground_check)

and updates data/processed/patches_index.json (provenance fields per site) and the 129 x 129 block in patches.bin.

Sources are tried in the order given in pipeline/sites.json; the first that works wins and the others are reported.
Local files are used when present (data/raw/sites/<site>/), otherwise remote files are read with HTTP range requests.
Nothing here runs in the app: the app never touches the network.

  python pipeline/fetch_windows.py --sites targets            # the four targets
  python pipeline/fetch_windows.py --sites earth --limit 20   # Earth hotspots (all with --limit 0)
  python pipeline/fetch_windows.py --sites tgt_mars_jezero --force
  python pipeline/fetch_windows.py --check-urls               # probe every remote source and exit
  python pipeline/fetch_windows.py --lat 24.25 --lon 67.75 --body earth --id E+024.25_+0067.75

Needs: numpy, scipy, pillow, rasterio (pip install rasterio).
"""
import argparse, datetime, glob, gzip, hashlib, io, json, math, os, struct, sys, time, urllib.request
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "processed"
RAW = ROOT / "data" / "raw"
CACHE = RAW / "cache"
CFG = json.loads((Path(__file__).parent / "sites.json").read_text())
RADIUS = {"moon": 1737400.0, "mars": 3396190.0, "earth": 6371008.8}
PATCH_M, CTX_M, CTX_N, COARSE_N, HSCALE_COARSE = 2000.0, 10000.0, 161, 129, 0.02
MAX_REMOTE_MB = 400     # a remote window that would need more than this is skipped with a message (put the file under data/raw instead)
UA = {"User-Agent": "TerraAnalog-pipeline/1.0 (offline build tool)"}


def log(*a):
    print(*a, flush=True)


# ------------------------------------------------------------------ local metric grid (azimuthal equidistant on a sphere, valid at the poles)
def local_to_lonlat(body, lat0, lon0, east, north):
    """Metres east and north of the site centre -> (lon, lat) in degrees on the body's sphere."""
    R = RADIUS[body]; p0 = math.radians(lat0); l0 = math.radians(lon0)
    rho = np.hypot(east, north); c = rho / R
    with np.errstate(invalid="ignore", divide="ignore"):
        lat = np.arcsin(np.clip(np.cos(c) * math.sin(p0) + np.where(rho > 0, north * np.sin(c) * math.cos(p0) / rho, 0.0), -1, 1))
        lon = l0 + np.arctan2(east * np.sin(c), rho * math.cos(p0) * np.cos(c) - north * math.sin(p0) * np.sin(c))
    lon = np.where(rho > 0, lon, l0)
    return np.degrees(lon), np.degrees(lat)


def grid_lonlat(body, lat0, lon0, size_m, n):
    """n x n grid over size_m: row i runs north to south (z = i * dx), column j runs west to east (x = j * dx)."""
    c = np.linspace(-size_m / 2, size_m / 2, n)
    east, south = np.meshgrid(c, c)
    return local_to_lonlat(body, lat0, lon0, east, -south)


# ------------------------------------------------------------------ projections of the source rasters (spheres, done by hand: no pyproj needed)
def make_forward(crs, body):
    """(lon, lat degrees) -> raster map coordinates, for the projections these products use."""
    d = crs.to_dict() if crs else {}
    proj = d.get("proj", "longlat"); R = float(d.get("R", d.get("a", RADIUS[body])))
    lon0 = math.radians(float(d.get("lon_0", 0))); x0 = float(d.get("x_0", 0)); y0 = float(d.get("y_0", 0))
    if crs and crs.is_geographic or proj == "longlat":
        return lambda lon, lat: (lon, lat), "geographic"
    if proj == "eqc":
        k = math.cos(math.radians(float(d.get("lat_ts", 0))))
        def f(lon, lat):
            dl = (np.radians(lon) - lon0 + math.pi) % (2 * math.pi) - math.pi
            return x0 + R * dl * k, y0 + R * np.radians(lat)
        return f, f"equirectangular (lat_ts {d.get('lat_ts', 0)}, R {R:.0f} m)"
    if proj == "stere":
        lat_0 = float(d.get("lat_0", -90)); k0 = float(d.get("k", d.get("k_0", 1)))
        if abs(abs(lat_0) - 90) > 1e-6: raise ValueError("only polar stereographic is supported")
        s = 1 if lat_0 > 0 else -1
        lat_ts = d.get("lat_ts")
        if lat_ts is not None and abs(abs(float(lat_ts)) - 90) > 1e-9: k0 = (1 + math.sin(math.radians(abs(float(lat_ts))))) / 2
        def f(lon, lat):
            lam = np.radians(lon) - lon0
            rho = 2 * R * k0 * np.tan(math.pi / 4 - s * np.radians(lat) / 2)
            return x0 + rho * np.sin(lam), y0 - s * rho * np.cos(lam)
        return f, f"polar stereographic (lat_0 {lat_0}, R {R:.0f} m)"
    raise ValueError(f"projection {proj} is not supported by this reader")


def bilinear(a, fx, fy, valid=None):
    """Sample array a (rows y, cols x) at fractional pixel-centre coordinates; returns values and a validity mask."""
    h, w = a.shape[:2]
    inside = (fx >= 0) & (fx <= w - 1) & (fy >= 0) & (fy <= h - 1)
    x = np.clip(fx, 0, w - 1.000001); y = np.clip(fy, 0, h - 1.000001)
    j = np.floor(x).astype(np.int64); i = np.floor(y).astype(np.int64); tx = x - j; ty = y - i
    if a.ndim == 3: tx = tx[..., None]; ty = ty[..., None]
    j1 = np.minimum(j + 1, w - 1); i1 = np.minimum(i + 1, h - 1)
    out = a[i, j] * (1 - tx) * (1 - ty) + a[i, j1] * tx * (1 - ty) + a[i1, j] * (1 - tx) * ty + a[i1, j1] * tx * ty
    if valid is not None: inside &= valid[i, j] & valid[i, j1] & valid[i1, j] & valid[i1, j1]
    return out, inside


class Raster:
    """A GeoTIFF (local path or https URL, read with HTTP range requests). sample() reads only the window it needs."""
    def __init__(self, ref, body, kind="elevation", scale=1.0, nodata=None):
        import rasterio
        self.ref = ref; self.remote = ref.startswith("http")
        self.env = rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tif,.TIF,.tiff", GTIFF_DIRECT_IO="YES", GDAL_HTTP_MAX_RETRY="3", GDAL_HTTP_RETRY_DELAY="2", VSI_CACHE="TRUE")
        self.env.__enter__()
        self.ds = rasterio.open(("/vsicurl/" + ref) if self.remote else ref)
        self.body = body; self.kind = kind; self.scale = scale
        self.fwd, self.proj_name = make_forward(self.ds.crs, body)
        self.nodata = nodata if nodata is not None else self.ds.nodata
        t = self.ds.transform
        if abs(t.b) > 1e-12 or abs(t.d) > 1e-12: raise ValueError("rotated rasters are not supported")
        self.t = t
        self.geographic = self.proj_name == "geographic"

    def describe(self):
        d = self.ds
        return f"{d.width} x {d.height} px, {d.count} band(s), {d.dtypes[0]}, {self.proj_name}, pixel {abs(self.t.a):.6g}, blocks {d.block_shapes[0]}, compression {d.compression.name if d.compression else 'none'}"

    def res_at(self, lat):
        if self.geographic: return abs(self.t.e) * math.pi / 180 * RADIUS[self.body]   # the latitude spacing is the honest figure
        return abs(self.t.a)

    def pix(self, lon, lat):
        x, y = self.fwd(lon, lat)
        if self.geographic:
            x = np.asarray(x, dtype=np.float64); x = self.t.c + ((x - self.t.c) % 360.0) if self.ds.width * abs(self.t.a) > 359 else x
        return (x - self.t.c) / self.t.a - 0.5, (y - self.t.f) / self.t.e - 0.5

    def sample(self, lon, lat, out_res_m=None):
        """Values at lon/lat (arrays). out_res_m: wanted ground sampling; coarser than the source means the window is box-averaged first."""
        import rasterio
        from rasterio.windows import Window
        from rasterio.enums import Resampling
        fx, fy = self.pix(lon, lat)
        c0 = int(max(0, math.floor(np.nanmin(fx)) - 2)); c1 = int(min(self.ds.width, math.ceil(np.nanmax(fx)) + 3))
        r0 = int(max(0, math.floor(np.nanmin(fy)) - 2)); r1 = int(min(self.ds.height, math.ceil(np.nanmax(fy)) + 3))
        shape = lon.shape + ((self.ds.count,) if self.kind == "imagery" and self.ds.count >= 3 else ())
        if c1 - c0 < 2 or r1 - r0 < 2: return np.zeros(shape, np.float32), np.zeros(lon.shape, bool)
        dec = 1
        if out_res_m: dec = max(1, int(math.floor(out_res_m / self.res_at(float(np.nanmean(lat))) + 1e-6)))
        if self.remote:
            bh, bw = self.ds.block_shapes[0]; bpp = np.dtype(self.ds.dtypes[0]).itemsize * self.ds.count
            ovr = [o for o in self.ds.overviews(1) if o <= dec]
            eff = max(ovr) if ovr else 1
            nb = (math.ceil((r1 - r0) / eff / bh) + 1) * (math.ceil((c1 - c0) / eff / bw) + 1) if bw < self.ds.width else math.ceil((r1 - r0) / eff / bh) + 1
            mb = nb * bh * (bw if bw < self.ds.width else self.ds.width / eff) * bpp / 1e6 * (0.5 if self.ds.compression else 1)
            if mb > MAX_REMOTE_MB: raise RuntimeError(f"this window needs about {mb:.0f} MB from a remote file that is not tiled for partial reads; download the file into data/raw and rerun")
        bands = [1, 2, 3] if (self.kind == "imagery" and self.ds.count >= 3) else [1]
        oh, ow = max(2, (r1 - r0) // dec), max(2, (c1 - c0) // dec)
        a = self.ds.read(bands, window=Window(c0, r0, c1 - c0, r1 - r0), out_shape=(len(bands), oh, ow), resampling=Resampling.average if dec > 1 else Resampling.nearest, masked=True)
        valid = ~np.ma.getmaskarray(a).any(axis=0)
        a = np.ma.filled(a, 0).astype(np.float32)
        if self.kind == "elevation":
            if self.nodata is not None: valid &= a[0] != self.nodata
            valid &= np.isfinite(a[0]) & (a[0] > -1e5) & (a[0] < 1e5)
        a = np.moveaxis(a, 0, -1) if len(bands) == 3 else a[0]
        sx, sy = (c1 - c0) / ow, (r1 - r0) / oh
        v, ok = bilinear(a, (fx - c0 + 0.5) / sx - 0.5, (fy - r0 + 0.5) / sy - 0.5, valid)
        return v * self.scale, ok


class Glo30:
    """Copernicus GLO-30 on AWS Open Data: one Cloud Optimized GeoTIFF per 1 x 1 degree tile, read with range requests."""
    URL = "https://copernicus-dem-30m.s3.amazonaws.com/{n}/{n}.tif"
    def __init__(self, base=None): self.base = base or self.URL; self.tiles = {}; self.res_m = 30.0; self.proj_name = "geographic"
    def name(self, la, lo): return f"Copernicus_DSM_COG_10_{'N' if la >= 0 else 'S'}{abs(la):02d}_00_{'E' if lo >= 0 else 'W'}{abs(lo):03d}_00_DEM"
    def tile(self, la, lo):
        if (la, lo) not in self.tiles:
            n = self.name(la, lo); loc = RAW / "earth" / "glo30" / f"{n}.tif"
            try: self.tiles[(la, lo)] = Raster(str(loc) if loc.exists() else self.base.format(n=n), "earth")
            except Exception as e:
                self.tiles[(la, lo)] = None; self.last_err = e
        return self.tiles[(la, lo)]
    def sample(self, lon, lat, out_res_m=None):
        out = np.zeros(lon.shape, np.float32); ok = np.zeros(lon.shape, bool); lonw = (lon + 180) % 360 - 180
        la_i = np.floor(lat).astype(int); lo_i = np.floor(lonw).astype(int)
        for la, lo in sorted(set(zip(la_i.ravel().tolist(), lo_i.ravel().tolist()))):
            t = self.tile(la, lo); m = (la_i == la) & (lo_i == lo) & ~ok
            if t is None or not m.any(): continue
            v, o = t.sample(lonw[m], lat[m], out_res_m); out[m] = v; ok[m] = o
        # samples whose bilinear cell crosses a tile edge: take the neighbour tile's own edge
        return out, ok
    def res_at(self, lat): return 30.0
    def describe(self): return f"{len([t for t in self.tiles.values() if t])} GLO-30 tile(s) opened, {len([t for t in self.tiles.values() if t is None])} missing (ocean or not public)"


def http_get(url, dest, tries=3):
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0: return dest.read_bytes()
    if url.startswith("file://") or not url.startswith("http"):
        data = Path(url.replace("file://", "")).read_bytes(); return data
    err = None
    for k in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r: data = r.read()
            dest.write_bytes(data); return data
        except Exception as e:
            err = e; time.sleep(1.5 * (k + 1))
    raise RuntimeError(f"{url}: {err}")


class Wmts:
    """Imagery from a WMTS tile pyramid. grid: 'wgs84' (2 x 1 tiles at level 0, plate carree) or 'square' (2^z x 2^z tiles over a square bounding box in
    projected metres, used by the polar Trek layers). Tiles are cached under data/raw/cache/tiles."""
    def __init__(self, tpl, body, grid="wgs84", zmax=13, bbox=None, proj=None, name="", tile_px=256, top_cols=2, top_rows=1):
        self.tpl = tpl; self.body = body; self.grid = grid; self.zmax = zmax; self.bbox = bbox; self.name = name; self.tile_px = tile_px; self.top = (top_cols, top_rows)
        self.proj = proj; self.kind = "imagery"; self.proj_name = grid
        if proj:
            class _C:   # tiny stand-in for a rasterio CRS
                is_geographic = False
                def __init__(s, d): s.d = d
                def to_dict(s): return s.d
            self.fwd, self.proj_name = make_forward(_C(proj), body)
    def res_at(self, lat, z=None):
        z = self.zmax if z is None else z
        if self.grid == "wgs84": return 360.0 / (self.top[0] * 2 ** z * self.tile_px) * math.pi / 180 * RADIUS[self.body]
        return (self.bbox[2] - self.bbox[0]) / (2 ** z * self.tile_px)
    def describe(self): return f"WMTS {self.name}, {self.grid} grid, levels 0 to {self.zmax}"
    def sample(self, lon, lat, out_res_m=None):
        from PIL import Image
        z = self.zmax
        while z > 0 and out_res_m and self.res_at(0, z - 1) <= out_res_m * 1.01: z -= 1
        T = self.tile_px
        if self.grid == "wgs84":
            n = 360.0 / (self.top[0] * 2 ** z * T)   # degrees per pixel
            fx = ((lon + 180) % 360) / n - 0.5; fy = (90 - lat) / n - 0.5
        else:
            x, y = self.fwd(lon, lat); n = (self.bbox[2] - self.bbox[0]) / (2 ** z * T)
            fx = (x - self.bbox[0]) / n - 0.5; fy = (self.bbox[3] - y) / n - 0.5
        c0, c1 = int(np.floor(np.nanmin(fx) / T)), int(np.floor((np.nanmax(fx) + 1) / T)); r0, r1 = int(np.floor(np.nanmin(fy) / T)), int(np.floor((np.nanmax(fy) + 1) / T))
        if (c1 - c0 + 1) * (r1 - r0 + 1) > 600: raise RuntimeError("too many tiles for one window")
        mos = np.zeros(((r1 - r0 + 1) * T, (c1 - c0 + 1) * T, 3), np.float32); got = np.zeros(mos.shape[:2], bool); nfail = 0; last = None
        key = hashlib.md5(self.tpl.encode()).hexdigest()[:10]
        for r in range(r0, r1 + 1):
            for c in range(c0, c1 + 1):
                url = self.tpl.format(z=z, y=r, x=c)
                try:
                    im = np.asarray(Image.open(io.BytesIO(http_get(url, CACHE / "tiles" / key / str(z) / f"{r}_{c}{Path(url).suffix}"))).convert("RGB"), np.float32)
                    mos[(r - r0) * T:(r - r0 + 1) * T, (c - c0) * T:(c - c0 + 1) * T] = im; got[(r - r0) * T:(r - r0 + 1) * T, (c - c0) * T:(c - c0 + 1) * T] = True
                except Exception as e:
                    nfail += 1; last = e
        if not got.any(): raise RuntimeError(f"no tiles could be fetched ({last})")
        self.used_res = self.res_at(0, z)
        return bilinear(mos, fx - c0 * T, fy - r0 * T, got)


class StlHeightmap:
    """Fallback elevation: a NASA 3D Resources landing-site height map (binary STL, a square model with a base). model_km is the ground size it covers,
    vertical_exag the exaggeration the page states. The model centre is taken as the site centre and +y as north (NOT stated by the source: an assumption)."""
    def __init__(self, path, body, lat0, lon0, model_km, vertical_exag):
        b = Path(path).read_bytes(); n = struct.unpack("<I", b[80:84])[0]
        v = np.frombuffer(b, dtype=np.dtype([("n", "<f4", 3), ("v", "<f4", (3, 3)), ("a", "<u2")]), count=n, offset=84)["v"].reshape(-1, 3).astype(np.float64)
        span = v[:, 0].max() - v[:, 0].min(); self.m_per_unit = model_km * 1000.0 / span
        cx, cy = (v[:, 0].max() + v[:, 0].min()) / 2, (v[:, 1].max() + v[:, 1].min()) / 2
        tri = v.reshape(-1, 3, 3); nz = np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0])[:, 2]
        up, dn = tri[nz > 1e-9], tri[nz < -1e-9]                    # the terrain is whichever non-vertical face set sits higher (some exports have inverted winding); the other is the flat base
        top = (up if (len(dn) == 0 or (len(up) and up[:, :, 2].mean() > dn[:, :, 2].mean())) else dn).reshape(-1, 3)
        from scipy.interpolate import LinearNDInterpolator
        pts, idx = np.unique(np.round(top[:, :2], 4), axis=0, return_index=True)
        self.f = LinearNDInterpolator(pts, top[idx, 2] * self.m_per_unit / vertical_exag)
        self.cx, self.cy, self.body, self.lat0, self.lon0 = cx, cy, body, lat0, lon0
        self.res_m = math.sqrt((span * self.m_per_unit) ** 2 / len(pts)); self.proj_name = "model plane"; self.npts = len(pts)
    def res_at(self, lat): return self.res_m
    def describe(self): return f"STL height map, {self.npts} surface vertices, mean spacing {self.res_m:.0f} m"
    def sample(self, lon, lat, out_res_m=None):
        R = RADIUS[self.body]
        east = np.radians(lon - self.lon0) * R * math.cos(math.radians(self.lat0)); north = np.radians(lat - self.lat0) * R
        v = self.f(self.cx + east / self.m_per_unit, self.cy + north / self.m_per_unit)
        return np.nan_to_num(v).astype(np.float32), np.isfinite(v)


# ------------------------------------------------------------------ source resolution
def find_local(patterns):
    for pat in patterns:
        hits = sorted(glob.glob(str(ROOT / pat)))
        if hits: return hits[0]
    return None


def open_source(spec, body, lat0, lon0, kind):
    """Open one source spec from sites.json. Returns (object, label) or raises with a plain reason."""
    t = spec["type"]
    if t == "geotiff":
        loc = find_local(spec.get("local", []))
        if loc: return Raster(loc, body, kind, spec.get("scale", 1.0), spec.get("nodata")), "local file " + os.path.relpath(loc, ROOT)
        if not spec.get("url"): raise RuntimeError("local file not found (" + ", ".join(spec.get("local", [])) + ")")
        if spec.get("download"):   # modest files are downloaded once into data/raw and then read locally
            dest = ROOT / spec["download"];
            if not dest.exists(): log(f"    downloading {spec['url']} -> {spec['download']}"); http_get(spec["url"], dest)
            return Raster(str(dest), body, kind, spec.get("scale", 1.0), spec.get("nodata")), "downloaded file " + spec["download"]
        return Raster(spec["url"], body, kind, spec.get("scale", 1.0), spec.get("nodata")), "remote file (range requests)"
    if t == "glo30": return Glo30(spec.get("url")), "remote tiles (range requests)"
    if t == "wmts": return Wmts(spec["url"], body, spec.get("grid", "wgs84"), spec.get("zmax", 13), spec.get("bbox"), spec.get("proj"), spec.get("name", ""), spec.get("tile_px", 256), *spec.get("top", [2, 1])), "tile service"
    if t == "stl":
        loc = find_local(spec.get("local", []))
        if not loc: raise RuntimeError("STL file not found (" + ", ".join(spec.get("local", [])) + ")")
        return StlHeightmap(loc, body, lat0, lon0, spec["model_km"], spec["vertical_exag"]), "local file " + os.path.relpath(loc, ROOT)
    raise RuntimeError("unknown source type " + t)


def first_working(specs, body, lat0, lon0, kind, probe):
    """Try the sources in order. probe(src) must return a result or raise. Returns (spec, src, how, result, tried)."""
    tried = []
    for spec in specs:
        if spec.get("max_abs_lat") is not None and abs(lat0) > spec["max_abs_lat"]:
            tried.append(f"{spec['label']}: does not cover latitude {lat0:.2f}"); continue
        try:
            src, how = open_source(spec, body, lat0, lon0, kind)
            res = probe(src)
            return spec, src, how, res, tried
        except Exception as e:
            tried.append(f"{spec['label']}: {plain_reason(e)}")
    return None, None, None, None, tried


def plain_reason(e):
    """A short reason a reader can act on, instead of a library error message."""
    m = str(e)
    if any(k in m for k in ("403", "Tunnel", "CONNECT", "407")): return "the data host could not be reached from the machine that built the tiles (refused by its network policy, HTTP 403)"
    if any(k in m for k in ("404", "does not exist", "not recognized")): return "the file was not found at the listed address (HTTP 404)"
    if "local file not found" in m or "STL file not found" in m: return "the file is not in data/raw yet"
    if any(k in m for k in ("timed out", "Temporary failure", "Name or service", "getaddrinfo", "CURL error")): return "the data host did not answer (" + m[:80] + ")"
    return m[:200]


# ------------------------------------------------------------------ outputs
def encode_h16(q):
    """uint16 grid -> gzip of [low bytes][high bytes] of the differences along each row (first column: difference down the column)."""
    q = q.astype(np.uint16); d = q.copy()
    d[:, 1:] = q[:, 1:] - q[:, :-1]; d[1:, 0] = q[1:, 0] - q[:-1, 0]
    b = d.tobytes(); a = np.frombuffer(b, np.uint8).reshape(-1, 2)
    return gzip.compress(a[:, 0].tobytes() + a[:, 1].tobytes(), 6, mtime=0)


def decode_h16(buf, n):
    raw = np.frombuffer(gzip.decompress(buf), np.uint8); m = n * n
    d = (raw[:m].astype(np.uint16) | (raw[m:].astype(np.uint16) << 8)).reshape(n, n)
    d[:, 0] = np.cumsum(d[:, 0], dtype=np.uint16); return np.cumsum(d, axis=1, dtype=np.uint16)


def fill_invalid(h, ok):
    if ok.all(): return h
    from scipy import ndimage
    idx = ndimage.distance_transform_edt(~ok, return_distances=False, return_indices=True)
    return h[tuple(idx)]


def fbm(n, seed, lo_cells, hi_cells):
    """Band-limited fractal noise, unit rms, wavelengths between lo_cells and hi_cells grid cells (fixed seed)."""
    rng = np.random.default_rng(seed); f = np.fft.rfft2(rng.standard_normal((n, n)))
    ky = np.fft.fftfreq(n)[:, None]; kx = np.fft.rfftfreq(n)[None, :]; k = np.hypot(kx, ky); k[0, 0] = 1
    band = (k >= 1.0 / hi_cells) & (k <= 1.0 / lo_cells)
    out = np.fft.irfft2(f * band * k ** -1.8, s=(n, n)); return (out / (out.std() + 1e-12)).astype(np.float32)


def slope_stats(h, dx):
    gz, gx = np.gradient(h.astype(np.float64), dx); s = np.degrees(np.arctan(np.hypot(gx, gz)))
    return float(np.median(s)), float(np.percentile(s, 90))


def to_jpeg(a, path, gray, quality=86):
    from PIL import Image
    a = np.clip(a, 0, 255).astype(np.uint8)
    im = Image.fromarray(a[..., 0] if (gray and a.ndim == 3) else a, "L" if gray or a.ndim == 2 else "RGB")
    im.save(path, quality=quality, optimize=True); return path.stat().st_size


def stretch(img, ok):
    """Linear 0.5 to 99.5 percentile stretch of single-band imagery to 8 bits (records nothing radiometric: display only)."""
    v = img[ok] if ok.any() else img.ravel()
    lo, hi = np.percentile(v, [0.5, 99.5]); return (img - lo) / max(hi - lo, 1e-6) * 235 + 10, (float(lo), float(hi))


def build_site(pid, body, lat0, lon0, spec, index, args, seed_name=None):
    t0 = time.time(); out = OUT / "sites" / pid; out.mkdir(parents=True, exist_ok=True)
    entry = index["patches"].get(pid)
    if entry is None: raise RuntimeError(f"{pid} is not in patches_index.json")
    log(f"\n== {pid}  ({body}, centre {lat0:.4f}, {lon0:.4f})")
    missing = []
    # ---- elevation: fine patch
    def probe_elev(src):
        res = src.res_at(lat0)
        n = 2049 if res <= 1.5 else 1025 if res <= 3 else 513
        lon, lat = grid_lonlat(body, lat0, lon0, PATCH_M, n)
        h, ok = src.sample(lon, lat, None)
        if ok.mean() < 0.6: raise RuntimeError(f"only {100 * ok.mean():.0f} % of the patch has data at this centre")
        lo, md, hi = np.percentile(h[ok], [0.5, 50, 99.5]); bad = ok & (np.abs(h - md) > 6 * (hi - lo) + 50)   # isolated outliers in some mosaics (noted in data/raw/INVENTORY.md)
        if bad.any(): log(f"      {int(bad.sum())} outlier samples removed and filled from their neighbours"); ok = ok & ~bad
        return res, n, h, ok
    es, esrc, ehow, eres, tried = first_working(spec["elevation"], body, lat0, lon0, "elevation", probe_elev)
    for t in tried: log("   elevation source skipped:", t)
    if es is None:
        log("   NO ELEVATION SOURCE WORKED: the site keeps its demo terrain.")
        entry.update(elevation_source="none (demo terrain kept)", elevation_resolution_m=None, imagery_source="none", imagery_resolution_m=None, missing=["elevation: " + "; ".join(tried)], date_built=datetime.date.today().isoformat())
        entry.pop("real", None); return False
    res, n, h, ok = eres
    log(f"   elevation: {es['name']} via {ehow}\n      source: {esrc.describe()}\n      source resolution {res:.2f} m -> fine grid {n} x {n} at {PATCH_M / (n - 1):.2f} m, valid {100 * ok.mean():.1f} %")
    valid_frac = float(ok.mean()); h = fill_invalid(h, ok)
    synthetic_fine = res > 5.0
    truth = make_truth(esrc, body, lat0, lon0, pid)
    if synthetic_fine:   # the source cannot show anything smaller than about two pixels: rounded interpolation plus a small, labelled synthetic detail
        from scipy import ndimage
        nsrc = max(8, int(round(PATCH_M / res)) + 1); lonc, latc = grid_lonlat(body, lat0, lon0, PATCH_M, nsrc)
        hc, okc = esrc.sample(lonc, latc, None); hc = fill_invalid(hc, okc).astype(np.float64)
        c = np.linspace(0, nsrc - 1, n); yy, xx = np.meshgrid(c, c, indexing="ij")
        rounding = ndimage.map_coordinates(hc, [yy, xx], order=3, mode="nearest") - ndimage.map_coordinates(hc, [yy, xx], order=1, mode="nearest")   # removes the creases of straight-line interpolation
        sig = float(np.median(np.abs(np.diff(hc, axis=1)))) if nsrc > 2 else 0.5
        amp = float(np.clip(0.05 * sig, 0.03, 0.07)); cells = res / (PATCH_M / (n - 1))
        detail = amp * fbm(n, int(hashlib.md5((seed_name or pid).encode()).hexdigest()[:8], 16), 2.0, max(4.0, 2 * cells))[:n, :n]
        # h stays the straight-line interpolation of the source at every node; both additions are bounded so the surface never leaves the source by more than 0.45 m
        h = (h + np.clip(rounding, -0.25, 0.25) + np.clip(detail, -0.2, 0.2)).astype(np.float32)
        log(f"      fine detail below about {2 * res:.0f} m is SYNTHETIC (rounded interpolation plus fractal detail, rms {amp:.2f} m, fixed seed; never more than 0.45 m from the source)")
    else: amp = 0.0
    # ---- elevation: context ring (lower resolution, same source if it reaches that far, else the listed context sources)
    cdx = CTX_M / (CTX_N - 1); lonC, latC = grid_lonlat(body, lat0, lon0, CTX_M, CTX_N)
    ctx_src_name = es["name"]; hC = okC = None
    for cs in [es] + [s for s in spec.get("context_elevation", [])]:
        try:
            src = esrc if cs is es else open_source(cs, body, lat0, lon0, "elevation")[0]
            hC, okC = src.sample(lonC, latC, cdx)
            if okC.mean() >= 0.35: ctx_src_name = cs["name"]; break
            log(f"   context: {cs['name']} covers only {100 * okC.mean():.0f} % of the ring")
        except Exception as e:
            log(f"   context: {cs['name']} failed: {str(e)[:200]}")
    if hC is None or okC.mean() < 0.02: hC = np.full((CTX_N, CTX_N), float(np.median(h)), np.float32); okC = np.zeros((CTX_N, CTX_N), bool); missing.append("context ring: no elevation beyond the patch (flat ring shown)")
    ctx_valid = float(okC.mean())
    # the hole of the ring is the patch: make the ring agree with the fine grid there, and fill gaps outward from valid data
    a, b = int(round((CTX_M - PATCH_M) / 2 / cdx)), int(round((CTX_M + PATCH_M) / 2 / cdx)); step = (n - 1) / (b - a)
    ii = np.round(np.arange(b - a + 1) * step).astype(int); hC[a:b + 1, a:b + 1] = h[np.ix_(ii, ii)]; okC[a:b + 1, a:b + 1] = True
    hC = fill_invalid(hC, okC)
    if ctx_valid < 0.98: missing.append(f"context ring: source covers {100 * ctx_valid:.0f} % of the 10 km ring; the rest is filled from the nearest data")
    log(f"   context ring: {ctx_src_name}, {CTX_N} x {CTX_N} at {cdx:.1f} m, valid {100 * ctx_valid:.0f} %")
    hmin = float(min(h.min(), hC.min())); hmax = float(max(h.max(), hC.max())); hs = max(0.001, math.ceil((hmax - hmin) / 65000 * 1e4) / 1e4)
    qf = np.round((h - hmin) / hs).astype(np.uint16); qc = np.round((hC - hmin) / hs).astype(np.uint16)
    (out / "fine.h16").write_bytes(encode_h16(qf)); (out / "ctx.h16").write_bytes(encode_h16(qc))
    assert np.array_equal(decode_h16((out / "fine.h16").read_bytes(), n), qf)
    # ---- imagery
    img_info = None
    def probe_img(src):
        px = int(min(args.img_px, 2 ** math.ceil(math.log2(max(256, PATCH_M / max(src.res_at(lat0), 0.05))))))
        lon, lat = grid_lonlat(body, lat0, lon0, PATCH_M, px)
        v, o = src.sample(lon, lat, PATCH_M / px)
        if o.mean() < 0.6: raise RuntimeError(f"only {100 * o.mean():.0f} % of the patch has imagery")
        if float(np.std(v[o])) < 1.0: raise RuntimeError("the imagery window is blank (no data at this place)")
        return px, v, o
    isp, isrc, ihow, ires, tried = first_working(spec.get("imagery", []), body, lat0, lon0, "imagery", probe_img)
    for t in tried: log("   imagery source skipped:", t)
    if isp is None:
        missing.append("imagery: " + ("; ".join(tried) if tried else "no source listed for this site")); log("   NO IMAGERY: the ground is drawn with the generic ground texture, and labelled so.")
        for f in ("img.jpg", "ctx.jpg"): (out / f).unlink(missing_ok=True)
    else:
        px, v, o = ires; gray = v.ndim == 2 or bool(isp.get("gray"))
        ires_m = getattr(isrc, "used_res", None) or isrc.res_at(lat0)
        if v.ndim == 2 and not isp.get("eight_bit"): v, st = stretch(v, o)
        if v.ndim == 3 and gray: v = v.mean(axis=2)
        v = np.where(o if v.ndim == 2 else o[..., None], v, float(np.median(v[o])))
        kb = to_jpeg(v, out / "img.jpg", gray) / 1024
        cpx = 1024 if ires_m <= 5 else 512; lon, lat = grid_lonlat(body, lat0, lon0, CTX_M, cpx); ctx_img = None
        try:
            cv, co = isrc.sample(lon, lat, CTX_M / cpx)
            if co.mean() > 0.3:
                if cv.ndim == 2 and not isp.get("eight_bit"): cv = (cv - st[0]) / max(st[1] - st[0], 1e-6) * 235 + 10
                if cv.ndim == 3 and gray: cv = cv.mean(axis=2)
                cv = np.where(co if cv.ndim == 2 else co[..., None], cv, float(np.median(cv[co])))
                to_jpeg(cv, out / "ctx.jpg", gray, 82); ctx_img = dict(file="ctx.jpg", px=cpx, valid=round(float(co.mean()), 3))
        except Exception as e:
            log(f"   context imagery failed: {str(e)[:200]}")
        if not ctx_img: (out / "ctx.jpg").unlink(missing_ok=True); missing.append("context ring imagery: not available (ring drawn with the generic ground texture)")
        img_info = dict(file="img.jpg", px=px, gray=gray, ctx=ctx_img)
        log(f"   imagery: {isp['name']} via {ihow}\n      source: {isrc.describe()}\n      source resolution {ires_m:.2f} m -> {px} x {px} px drape at {PATCH_M / px:.2f} m ({kb:.0f} KB){', greyscale' if gray else ''}")
    # ---- coarse 129 grid for route planning (same block in patches.bin), stats, index entry
    step = (n - 1) // (COARSE_N - 1); co = h[::step, ::step][:COARSE_N, :COARSE_N]; co = co - co.min()
    if co.max() > 65535 * HSCALE_COARSE: missing.append("relief above 1310 m was clipped in the route-planning grid")
    blob = np.clip(np.round(co / HSCALE_COARSE), 0, 65535).astype("<u2").tobytes()
    with open(OUT / "patches.bin", "r+b") as f: f.seek(entry["offset"]); f.write(blob)
    med, p90 = slope_stats(co, PATCH_M / (COARSE_N - 1))
    entry.update(stats=dict(slope_med=med, slope_p90=p90, relief=float(co.max()), fine_rms=amp), synthetic_fine=bool(synthetic_fine), synthetic_base=False,
        elevation_source=es["label"], elevation_resolution_m=round(res, 2), imagery_source=(isp["label"] if isp else "none"), imagery_resolution_m=(round(ires_m, 2) if isp else None),
        date_built=datetime.date.today().isoformat(), site_center=[lat0, lon0], licence=[es.get("licence", "")] + ([isp.get("licence", "")] if isp else []), missing=missing,
        real=dict(dir=f"sites/{pid}/", n=n, hscale=hs, hmin=round(hmin, 3), valid=round(valid_frac, 4), ctx=dict(n=CTX_N, size_m=CTX_M, src=ctx_src_name, valid=round(ctx_valid, 3)), img=img_info,
                  datum=es.get("datum", ""), fine_detail_rms_m=round(amp, 3), imagery_note=(isp.get("note", "") if isp else "")))
    (out / "truth.json").write_text(json.dumps(truth))
    log(f"   wrote {out.relative_to(ROOT)}: fine.h16 {(out / 'fine.h16').stat().st_size / 1024:.0f} KB, ctx.h16 {(out / 'ctx.h16').stat().st_size / 1024:.0f} KB; slope median {med:.1f} deg, relief {co.max():.0f} m; {time.time() - t0:.1f} s")
    return True


def make_truth(src, body, lat0, lon0, pid, k=48):
    """Heights read straight from the source at random points inside the patch (bilinear at the source's own resolution). tests/ground_check compares
    the app's wheel-contact sampler against these."""
    rng = np.random.default_rng(int(hashlib.md5(pid.encode()).hexdigest()[:8], 16))
    x = rng.uniform(40, PATCH_M - 40, k); z = rng.uniform(40, PATCH_M - 40, k)
    lon, lat = local_to_lonlat(body, lat0, lon0, x - PATCH_M / 2, -(z - PATCH_M / 2))
    v, ok = src.sample(lon, lat, None)
    return dict(note="x east and z south in metres from the patch corner; h in metres on the source datum", points=[dict(x=round(float(a), 3), z=round(float(b), 3), lat=float(c), lon=float(d), h=round(float(e), 3)) for a, b, c, d, e, o in zip(x, z, lat, lon, v, ok) if o])


def check_urls():
    """Probe every remote source: one small range request each. Prints what answered."""
    seen = set()
    def probe(url):
        if url in seen: return
        seen.add(url); t = time.time()
        try:
            req = urllib.request.Request(url, headers={**UA, "Range": "bytes=0-1023"})
            with urllib.request.urlopen(req, timeout=30) as r: log(f"  OK   {r.status} {r.headers.get('Content-Range', '') or r.headers.get('Content-Length', '')}  {url}  ({time.time() - t:.1f} s)")
        except Exception as e: log(f"  FAIL {type(e).__name__}: {str(e)[:120]}  {url}")
    for sid, s in CFG["sites"].items():
        log(sid)
        for grp in ("elevation", "context_elevation", "imagery"):
            for sp in s.get(grp, []):
                u = sp.get("url")
                if not u: continue
                if sp["type"] == "glo30": u = Glo30.URL.format(n="Copernicus_DSM_COG_10_N24_00_E067_00_DEM")
                if sp["type"] == "wmts": u = u.format(z=0, y=0, x=0)
                probe(u)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--sites", default="targets", help="targets | earth | all | comma-separated patch ids")
    ap.add_argument("--limit", type=int, default=0, help="at most this many Earth hotspots (0 = all)")
    ap.add_argument("--force", action="store_true", help="rebuild sites that are already built")
    ap.add_argument("--img-px", type=int, default=2048, help="largest drape texture edge in pixels (default 2048)")
    ap.add_argument("--check-urls", action="store_true")
    ap.add_argument("--lat", type=float); ap.add_argument("--lon", type=float); ap.add_argument("--body", default="earth"); ap.add_argument("--id")
    a = ap.parse_args()
    if a.check_urls: return check_urls()
    index = json.loads((OUT / "patches_index.json").read_text())
    jobs = []   # (patch id, body, lat, lon, spec)
    tg = CFG["sites"]
    def earth_job(pid):
        la, lo = pid[1:].split("_"); return (pid, "earth", float(la), float(lo), tg["earth"])
    if a.lat is not None:
        pid = a.id or f"E{a.lat:+07.2f}_{a.lon:+08.2f}"; key = "earth" if a.body == "earth" else a.id
        jobs.append((pid, a.body, a.lat, a.lon, tg[key]))
    else:
        want = a.sites.split(",")
        for w in want:
            if w in ("targets", "all"): jobs += [(k, s["body"], s["site_center"][0], s["site_center"][1], s) for k, s in tg.items() if k != "earth"]
            if w in ("earth", "all"):
                ej = [earth_job(p) for p in index["patches"] if p.startswith("E")]; jobs += ej[:a.limit] if a.limit else ej
            if w in tg and w != "earth": s = tg[w]; jobs.append((w, s["body"], s["site_center"][0], s["site_center"][1], s))
            if w.startswith("E") and w in index["patches"]: jobs.append(earth_job(w))
    done = failed = skipped = 0
    for pid, body, la, lo, spec in jobs:
        if not a.force and index["patches"].get(pid, {}).get("real") and (OUT / "sites" / pid / "fine.h16").exists(): skipped += 1; continue
        try:
            ok = build_site(pid, body, la, lo, spec, index, a); done += ok; failed += (not ok)
        except Exception as e:
            failed += 1; log(f"   FAILED {pid}: {type(e).__name__}: {e}")
        (OUT / "patches_index.json").write_text(json.dumps(index))
    index["real_sites"] = sorted(k for k, v in index["patches"].items() if v.get("real"))
    (OUT / "patches_index.json").write_text(json.dumps(index))
    log(f"\nbuilt {done}, failed or kept as demo {failed}, already built {skipped}. Real sites now: {len(index['real_sites'])} of {len(index['patches'])}.")


if __name__ == "__main__":
    main()
