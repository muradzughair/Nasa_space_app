#!/usr/bin/env python3
"""Render the small preview image of each rover model (assets/models/previews/<id>.png) with headless Chromium.
Needs the app served from the project root (python -m http.server 8765) and `pip install playwright`. Run after build_rover_models.py."""
import json, os, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
base = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8765"
ids = [r["id"] for r in json.load(open(os.path.join(ROOT, "assets/models/rovers.json")))["rovers"] if not r.get("inherit")]
os.makedirs(os.path.join(ROOT, "assets/models/previews"), exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    for i in ids:
        pg = b.new_page(viewport={"width": 640, "height": 400})
        pg.goto(f"{base}/tests/model_view.html?ids={i}&preview=1"); pg.wait_for_function("window.ready", timeout=120000)
        pg.screenshot(path=os.path.join(ROOT, f"assets/models/previews/{i}.png"), timeout=90000); pg.close()
    b.close()
