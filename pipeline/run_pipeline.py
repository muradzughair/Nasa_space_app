#!/usr/bin/env python3
"""TerraAnalog offline pipeline.

    python pipeline/run_pipeline.py            # auto: real files in data/raw if present, demo data otherwise
    python pipeline/run_pipeline.py --demo     # force demo data
    python pipeline/run_pipeline.py --targets moon_sp   # only some targets (M1 style run)

Writes everything the static app needs into data/processed.
"""
import argparse
import json
import os
import sys
import time
import zlib
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import terra as T  # noqa: E402

PATCH_TOP = 15      # hotspots per target and purpose that get a precomputed terrain patch
N_HOTSPOTS = 20     # hotspots kept per target and purpose
ZQ = 30.0           # int8 quantisation of z-scores in earth_traits.bin
DEMO_NOTE = "DEMO DATA: terrain, climate and soil values here are synthetic placeholders, not measurements."
PARTIAL_NOTE = "Terrain traits come from measured grids; temperature, soil and dust are placeholders."


def log(*a):
    print(f"[{time.strftime('%H:%M:%S')}]", *a, flush=True)


def load_env_key():
    env = T.ROOT / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("ANTHROPIC_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    return os.environ.get("ANTHROPIC_API_KEY")


def llm_explain(key, facts):
    """Optional: ask one hosted language model to phrase the computed numbers. Never produces rankings."""
    import urllib.request
    body = json.dumps({
        "model": os.environ.get("TERRA_LLM_MODEL", "claude-sonnet-4-5"), "max_tokens": 220,
        "messages": [{"role": "user", "content": "Explain in 3 short sentences, using ONLY these numbers, why this Earth site is or is not a good analog "
                                                 "for the Moon/Mars target. Do not invent numbers or change rankings.\n" + json.dumps(facts)}]}).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", body, {"content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())["content"][0]["text"].strip()


# ------------------------------------------------------------------ data detection and loading
def detect():
    return {
        "moon": all((T.RAW / "moon" / f).exists() for f in ["LDEM_16.IMG", "LDEM_16.LBL", "LDSM_16.IMG", "LDSM_16.LBL", "LDRM_16.IMG", "LDRM_16.LBL"]),
        "mars": (T.RAW / "mars" / "megt90n000eb.img").exists() and (T.RAW / "mars" / "megt90n000eb.xml").exists(),
        "earth": next(iter((T.RAW / "earth").glob("ETOPO*60s*.tif")), None) if (T.RAW / "earth").exists() else None,
    }


def real_moon_target(tgt):
    dem, _ = T.read_pds3_image(T.RAW / "moon" / "LDEM_16.LBL")
    slp, _ = T.read_pds3_image(T.RAW / "moon" / "LDSM_16.LBL")
    rgh, _ = T.read_pds3_image(T.RAW / "moon" / "LDRM_16.LBL")
    px = 1 / 16
    ws = [T.grid_windows(a, tgt["lat"], tgt["lon"], px, T.WIN) for a in (dem, slp, rgh)]
    flat = ws[0].ravel()
    return dict(relief=float(np.percentile(flat, 95) - np.percentile(flat, 5)), slope_med=float(np.median(ws[1])),
                slope_p90=float(np.percentile(ws[1], 90)), roughness=float(np.median(ws[2])))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--demo", action="store_true", help="force demo data")
    ap.add_argument("--targets", default="", help="comma list of target ids (default all)")
    ap.add_argument("--no-llm", action="store_true")
    ap.add_argument("--patch-km", type=float, default=2.0, help="terrain patch edge length in km (default 2)")
    a = ap.parse_args()
    t0 = time.time()
    T.PATCH_M = a.patch_km * 1000.0
    T.OUT.mkdir(parents=True, exist_ok=True)
    targets = [t for t in T.TARGETS if not a.targets or t["id"] in a.targets.split(",")]
    have = {"moon": False, "mars": False, "earth": None} if a.demo else detect()
    rng = np.random.default_rng(20261108)
    log("data found:", {k: bool(v) for k, v in have.items()})

    # --- Earth land mask (real shape, from the global-land-mask package; GLOBE-derived)
    from global_land_mask import globe
    sub = (np.arange(5) + 0.5) / 5 - 0.5
    cnt = np.zeros((T.NLAT, T.NLON))
    for dy in sub:
        for dx in sub:
            cnt += globe.is_land(np.clip(T.LAT_C[:, None] + dy * T.RES, -89.99, 89.99), ((T.LON_C[None, :] + dx * T.RES + 180) % 360) - 180)
    land = cnt >= 12.5
    log("land cells:", int(land.sum()))

    # --- Earth traits
    fields = T.demo_earth_fields(rng, land)
    raw = {k: np.where(land, fields[k], np.nan).astype(np.float32) for k in ["temp_mean", "temp_range", "soil", "dust", "sun_elev"]}
    if have["earth"]:
        log("reading real ETOPO", have["earth"])
        raw.update(T.real_earth_terrain(T.read_geotiff(have["earth"]), land))
        earth_terrain = "real"
    else:
        log("generating demo Earth terrain windows ...")
        raw.update(T.earth_terrain_demo(rng, fields, land))
        earth_terrain = "demo"

    # --- targets traits
    body_terrain = {}
    cache = {}
    for t in targets:
        b = t["body"]
        if b == "moon" and have["moon"]:
            terr, src = real_moon_target(t), "real"
        elif b == "mars" and have["mars"]:
            if "mars" not in cache:
                cache["mars"] = T.read_mola_pds4(T.RAW / "mars" / "megt90n000eb.xml")
            terr, src = T.real_target_terrain(cache["mars"], 1 / 16, 3396000.0, t), "real"
        else:
            terr, src = T.target_terrain_demo(rng, t), "demo"
        t["traits"] = {**terr, **{k: t["demo"][k] for k in ["temp_mean", "temp_range", "soil", "dust", "sun_elev"]}}
        t["terrain_source"] = src
        body_terrain[b] = src
        log(f"target {t['id']:12s} ({src}):", {k: round(v, 2) for k, v in t["traits"].items()})

    # --- normalise
    st = T.zstats(raw, land)
    zE = np.stack([np.where(land, T.to_z(k, np.nan_to_num(raw[k]), st), 0.0) for k in T.KEYS]).astype(np.float32)
    for t in targets:
        t["z"] = [float(T.to_z(k, t["traits"][k], st)) for k in T.KEYS]

    # --- scoring, hotspots
    purposes = list(T.PURPOSES)
    grids, hotspots, patch_ids = [], {}, {}
    for t in targets:
        zT = np.array(t["z"])
        hotspots[t["id"]] = {}
        for p in purposes:
            w = T.weights_vec(T.PURPOSES[p]["w"], t["polar"])
            sc = T.score_from_z(zE, zT, w)
            sc = np.where(land, sc, np.nan)
            g = np.full(sc.shape, 255, np.uint8)
            g[land] = np.clip(np.round(sc[land]), 0, 100).astype(np.uint8)
            grids.append(g)
            hs = T.merge_hotspots(np.nan_to_num(sc, nan=-1), land, N_HOTSPOTS)
            lst = []
            for rank, h in enumerate(hs):
                lat, lon = float(T.LAT_C[h["i"]]), float(T.LON_C[h["j"]])
                tr = {k: float(raw[k][h["i"], h["j"]]) for k in T.KEYS}
                sims = {k: float(T.sim_per_trait(zE[n, h["i"], h["j"]], zT[n])) for n, k in enumerate(T.KEYS)}
                hid = T.hotspot_id(lat, lon)
                lst.append(dict(id=hid, rank=rank + 1, lat=lat, lon=lon, score=round(h["score"], 1), ncells=h["ncells"], area_km2=round(h["area_km2"]),
                                name=T.nearest_name(lat, lon), traits={k: round(v, 3) for k, v in tr.items()}, sim={k: round(v, 1) for k, v in sims.items()},
                                patch=rank < PATCH_TOP))
                if rank < PATCH_TOP:
                    patch_ids[hid] = tr
            hotspots[t["id"]][p] = lst
            log(f"  {t['id']:12s} {p:8s} top hotspots:", [(h["name"], h["score"]) for h in lst[:3]])
    scores = np.stack(grids).astype(np.uint8)

    # --- terrain patches
    log(f"building {len(targets)} target patches and {len(patch_ids)} Earth patches ...")
    blob, index = bytearray(), {}

    def add(pid, counts, stats, kind, extra=None):
        index[pid] = dict(offset=len(blob), n=T.PATCH_N, size_m=T.PATCH_M, hscale=T.HSCALE, kind=kind, stats=stats, **(extra or {}))
        blob.extend(counts.astype("<u2").tobytes())
    for t in targets:
        c, s = T.make_patch(zlib.crc32(t["id"].encode()), t["traits"], t["style"], size_m=T.PATCH_M)
        add("tgt_" + t["id"], c, s, "target", dict(synthetic_fine=True, synthetic_base=t["terrain_source"] == "demo"))
        t["patch"] = "tgt_" + t["id"]
    for pid, tr in patch_ids.items():
        c, s = T.make_patch(zlib.crc32(pid.encode()), tr, "earth", size_m=T.PATCH_M)
        add(pid, c, s, "earth", dict(synthetic_fine=True, synthetic_base=True))
    (T.OUT / "patches.bin").write_bytes(bytes(blob))
    (T.OUT / "patches_index.json").write_text(json.dumps(dict(n=T.PATCH_N, size_m=T.PATCH_M, hscale=T.HSCALE, patches=index)))

    # --- explanations (cached; template, optional language model)
    key = None if a.no_llm else load_env_key()
    log("language model key:", "found" if key else "none (template sentences)")
    note = DEMO_NOTE if (earth_terrain == "demo") else PARTIAL_NOTE
    expl, llm_used = {}, 0
    for t in targets:
        for p in purposes:
            for h in hotspots[t["id"]][p][:PATCH_TOP]:
                txt = T.template_explanation(t["name"], T.PURPOSES[p]["label"], h["name"], h["score"], h["traits"], t["traits"], h["sim"], note)
                if key:
                    try:
                        txt = llm_explain(key, dict(target=t["name"], purpose=p, site=h["name"], score=h["score"], site_traits=h["traits"], target_traits=t["traits"],
                                                    per_trait_similarity=h["sim"])) + " " + note
                        llm_used += 1
                    except Exception as e:  # network or key problem: keep the template
                        log("  LLM failed, template kept:", str(e)[:80])
                        key = None
                expl[f"{t['id']}|{p}|{h['id']}"] = txt
    (T.OUT / "explanations.json").write_text(json.dumps(dict(source="llm+template" if llm_used else "template", entries=expl)))

    # --- write tables
    (T.OUT / "scores.bin").write_bytes(scores.tobytes())
    q = np.clip(np.round(zE * ZQ), -127, 127).astype(np.int8)
    (T.OUT / "earth_traits.bin").write_bytes(q.tobytes())
    (T.OUT / "hotspots.json").write_text(json.dumps(hotspots))
    tj = []
    for t in targets:
        tj.append({k: t[k] for k in ["id", "body", "name", "short", "lat", "lon", "polar", "style", "rover", "note", "traits", "z", "patch", "terrain_source"]} | dict(gravity=T.GRAVITY[t["body"]]))
    (T.OUT / "targets.json").write_text(json.dumps(tj))
    meta = dict(
        res=T.RES, nlat=T.NLAT, nlon=T.NLON, zq=ZQ, sea=255, land_cells=int(land.sum()),
        traits=[dict(key=k, label=l, unit=u, log=lg, mean=st[k][0], std=st[k][1], terrain=k in T.TERRAIN_KEYS) for k, l, u, lg in T.TRAITS],
        purposes={p: dict(label=v["label"], w=v["w"]) for p, v in T.PURPOSES.items()} | {"custom": dict(label="Custom weights", w=T.CUSTOM_DEFAULT)},
        score_layout=[f"{t['id']}|{p}" for t in targets for p in purposes], gazetteer=T.GAZETTEER, gravity=T.GRAVITY, patch_top=PATCH_TOP,
    )
    (T.OUT / "earth_meta.json").write_text(json.dumps(meta))
    manifest = dict(
        generated=time.strftime("%Y-%m-%d %H:%M:%S"), demo=earth_terrain == "demo" or "demo" in body_terrain.values(),
        earth_terrain=earth_terrain, target_terrain={t["id"]: t["terrain_source"] for t in targets}, note=note,
        placeholder_traits=["temp_mean", "temp_range", "soil", "dust", "sun_elev"] + ([] if earth_terrain == "real" else T.TERRAIN_KEYS),
        patches="synthetic stand-in terrain (see About); fine detail is always synthetic", explanations=("llm+template" if llm_used else "template"),
        land_mask="global-land-mask package (GLOBE-derived, real shape)", real_files_found={k: bool(v) for k, v in have.items()},
    )
    (T.OUT / "manifest.json").write_text(json.dumps(manifest, indent=1))
    write_manifest_md(manifest, have)
    log(f"done in {time.time() - t0:.1f}s; demo={manifest['demo']}")


def write_manifest_md(m, have):
    lines = ["# Data manifest", "", f"Generated {m['generated']} by pipeline/run_pipeline.py. Mode: **{'DEMO (synthetic placeholders)' if m['demo'] else 'real terrain'}**.", "",
             "## Sources and decisions", "",
             "| Item | Source URL | Size | Status / decision |", "|---|---|---|---|",
             "| Moon LDEM_16, LDSM_16, LDRM_16 | https://imbrium.mit.edu/DATA/LOLA_GDR/CYLINDRICAL/IMG/ | about 33 MB each | " + ("used" if have["moon"] else "NOT downloaded: host blocked (HTTP 403) by the build sandbox network policy on 2026-11-08; demo terrain used") + " |",
             "| Mars MOLA megt90n000eb.img | https://pds-geosciences.wustl.edu/mgs/urn-nasa-pds-mgs_mola_topography_derived/meg016/megt90n000eb.xml | about 33 MB | " + ("used" if have["mars"] else "label present, data file NOT downloaded (host blocked, HTTP 403); demo terrain used") + " |",
             "| Earth ETOPO 2022 60 arc-second | https://www.ncei.noaa.gov/products/etopo-global-relief-model | about 400 MB (GeoTIFF) | " + ("used" if have["earth"] else "NOT downloaded (host blocked, HTTP 403); demo terrain used") + " |",
             "| Copernicus GLO-30 hotspot windows | https://catalog.data.gov/dataset/copernicus-glo-30-digital-elevation-model | small windows | NOT downloaded (host blocked); patches are synthetic stand-ins |",
             "| MODIS land surface temperature (MOD11) | https://lpdaac.usgs.gov/resources/e-learning/choosing-data-access-tool-appeears-area-sampler | needs Earthdata login | NOT used; temperature is a placeholder model |",
             "| Geologic maps (USGS) | https://astrogeology.usgs.gov/search/map/unified_geologic_map_of_the_moon_1_5m_2020 | large | NOT used; soil and dust are placeholders |",
             "| Earth land mask | PyPI package global-land-mask 1.0.0 (GLOBE-derived) | 2.5 MB | used (real land shape only; no elevation) |",
             "| Perseverance 3D model | supplied file assets/models/25042_Perseverance.glb (NASA/JPL-Caltech) | 11.7 MB | compressed to about 2.9 MB (meshopt, 512 px textures) |",
             "| Apollo 11 photo | supplied file assets/images/Apollo 11 - View of the Moon.jpg | 3 MB | decorative only, resized |", "",
             "Dataset names and licences have NOT been verified against the challenge Resources tab (not yet added to resources.md). Verify before relying on any of them.", ""]
    (T.ROOT / "data" / "manifest.md").write_text("\n".join(lines))


if __name__ == "__main__":
    main()
