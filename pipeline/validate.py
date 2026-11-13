#!/usr/bin/env python3
"""Validation (spec section 5): re-score from the written data files exactly as the browser does, then
1) check that well-known analogs (Atacama, Haughton, Death Valley) rank near the top of the land,
2) perturb the weights and check that the top hotspots stay stable.
Writes data/processed/validation.json. On demo data the result is NOT informative (the Earth values are synthetic) and says so."""
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import terra as T  # noqa: E402

ANALOGS = {"Atacama Desert": (-24.0, -69.5), "Haughton Crater": (75.4, -89.7), "Death Valley": (36.5, -117.0)}


def main():
    meta = json.loads((T.OUT / "earth_meta.json").read_text())
    tg = json.loads((T.OUT / "targets.json").read_text())
    man = json.loads((T.OUT / "manifest.json").read_text())
    nl, nn = meta["nlat"], meta["nlon"]
    zE = (np.fromfile(T.OUT / "earth_traits.bin", np.int8).reshape(len(T.KEYS), nl, nn) / meta["zq"]).astype(np.float32)
    land = np.fromfile(T.OUT / "scores.bin", np.uint8)[:nl * nn].reshape(nl, nn) != 255
    rng = np.random.default_rng(7)
    res = {"informative": not man["demo"], "analogs": {}, "stability": {}}
    for t in tg:
        zT = np.array(t["z"])
        for p in T.PURPOSES:
            w = T.weights_vec(T.PURPOSES[p]["w"], t["polar"])
            sc = np.where(land, T.score_from_z(zE, zT, w), -1)
            vals = np.sort(sc[land])
            row = {}
            for name, (la, lo) in ANALOGS.items():
                i, j = int((90 - la) / T.RES), int(((lo + 180) % 360) / T.RES)
                box = sc[max(0, i - 4):i + 5, max(0, j - 4):j + 5].max()
                row[name] = dict(score=float(sc[i, j]), land_percentile=float(100 * np.searchsorted(vals, sc[i, j]) / len(vals)),
                                 best_in_4deg=float(box), percentile_best_in_4deg=float(100 * np.searchsorted(vals, box) / len(vals)))
            res["analogs"][f"{t['id']}|{p}"] = row
            top = set(np.argsort(sc.ravel())[::-1][:int(0.01 * land.sum())])
            jac = []
            for _ in range(20):
                w2 = w * np.exp(rng.normal(0, 0.15, w.size))
                sc2 = np.where(land, T.score_from_z(zE, zT, w2), -1)
                top2 = set(np.argsort(sc2.ravel())[::-1][:len(top)])
                jac.append(len(top & top2) / len(top | top2))
            res["stability"][f"{t['id']}|{p}"] = dict(mean_jaccard_top1pct=float(np.mean(jac)), min=float(np.min(jac)))
    (T.OUT / "validation.json").write_text(json.dumps(res, indent=1))
    print("INFORMATIVE" if res["informative"] else "NOTE: demo data - analog ranks below are NOT meaningful (synthetic Earth values)")
    for k, v in res["analogs"].items():
        print(f"{k:22s}", "  ".join(f"{n.split()[0]}: pct {d['land_percentile']:.0f}/{d['percentile_best_in_4deg']:.0f}" for n, d in v.items()))
    print("weight-perturbation stability (mean Jaccard of top 1% cells, sigma 15%):")
    print("  " + ", ".join(f"{k}={v['mean_jaccard_top1pct']:.2f}" for k, v in res["stability"].items()))


if __name__ == "__main__":
    main()
