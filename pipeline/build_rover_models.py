#!/usr/bin/env python3
"""Convert the rover source files into the web models shipped in assets/models/<id>.glb.

Run once at build time (never in the browser):

    pip install bpy                      # Blender as a Python module (Blender 4/5 files open fine)
    npm install -g @gltf-transform/cli   # compression
    python3 -I pipeline/build_rover_models.py [id ...]

(`-I` keeps user site-packages out; without it bpy can abort with a glog "initialised twice" error.)

Input : _local/rover_sources/...  (git-ignored, see docs/REFERENCES.md)
Output: assets/models/<id>.glb (meshopt compressed, webp textures <= 1024 px) and assets/models/model_report.json.

Every output model follows one convention, so the app needs no per-rover code:
  * metres, forward = +Z, up = +Y, origin on the ground at the centre of the wheel contact plane
  * wheels are separate named nodes wheel_<row>_<L|R> (row 1 = front), origin on the hub, axle along local X
  * the model is rigid apart from the wheels (no armature, no animation)
"""
import json, math, os, re, subprocess, sys, shutil
import bpy
from mathutils import Vector, Matrix

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_local", "rover_sources")
WORK = os.path.join(ROOT, "_local", "work")
OUT = os.path.join(ROOT, "assets", "models")
TEX_MAX = 1024

# One row of data per model. No per-model code below this table.
MODELS = {
    "curiosity": dict(src=os.path.join(SRC, "curiosity", "Curiosity Rover (MSL) (Dirty)", "Curiosity Rover (MSL) (Dirty).blend"), kind="blend", front_obj="HazCam - front",
                      wheel_re=r"^wheel_\d\d_[LR]$", drop_re=r"^(_Hemi.*|.*_p)$"),   # _p objects are Blender pivot cubes (6 triangles), not parts of the rover
    "perseverance": dict(src=os.path.join(SRC, "perseverance_glb_draco", "Mars 2020 Perseverance Rover.glb"), kind="glb_draco", front_obj="hazcams_front",
                         wheel_re=r"^Wheels_objs$", split_wheels=6, drop_re=r"^(Icosphere)$"),
    "lunar_generic": dict(src=None, kind="procedural"),
}


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def world_bbox(objs):
    lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
    for o in objs:
        if o.type != "MESH":
            continue
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
    return lo, hi


def select_only(objs):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]


def bake_armatures():
    """Freeze skinned meshes in their rest pose so the model is rigid, then delete the armatures."""
    for o in [o for o in bpy.data.objects if o.type == "MESH" and any(m.type == "ARMATURE" for m in o.modifiers)]:
        select_only([o])
        for m in list(o.modifiers):
            if m.type == "ARMATURE":
                bpy.ops.object.modifier_apply(modifier=m.name)
    for a in [o for o in bpy.data.objects if o.type == "ARMATURE"]:
        for c in a.children:
            m = c.matrix_world.copy(); c.parent = None; c.matrix_world = m
        bpy.data.objects.remove(a, do_unlink=True)


def split_wheels(name, count):
    """The Perseverance wheels are one fused mesh. Split it into loose parts, group the parts by hub position into
    `count` wheels (left/right, then 3 rows front to back) and make each a separate object with its origin on the hub."""
    src = bpy.data.objects[name]
    select_only([src]); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.separate(type="LOOSE"); bpy.ops.object.mode_set(mode="OBJECT")
    parts = [o for o in bpy.data.objects if o.type == "MESH" and (o.name == name or o.name.startswith(name + "."))]
    cen = [sum((o.matrix_world @ Vector(c) for c in o.bound_box), Vector()) / 8 for o in parts]
    left = [i for i, c in enumerate(cen) if c.x > 0]; right = [i for i, c in enumerate(cen) if c.x <= 0]
    rows = count // 2
    groups = []
    for side, idx in (("L", left), ("R", right)):
        ys = sorted(cen[i].y for i in idx)
        # 1D k-means on the long axis, seeded from the sorted extremes and the middle
        seeds = [ys[0] + (ys[-1] - ys[0]) * k / (rows - 1) for k in range(rows)]
        for _ in range(30):
            cl = [[] for _ in range(rows)]
            for i in idx:
                cl[min(range(rows), key=lambda k: abs(cen[i].y - seeds[k]))].append(i)
            seeds = [sum(cen[i].y for i in c) / len(c) if c else seeds[k] for k, c in enumerate(cl)]
        for k, c in enumerate(cl):
            groups.append((side, seeds[k], c))
    # row 1 = front: the caller flips order after the front axis is known, so name by sorted y here (low y first)
    out = []
    for side in ("L", "R"):
        gs = sorted([g for g in groups if g[0] == side], key=lambda g: g[1])
        for r, (_, _, idx) in enumerate(gs):
            objs = [parts[i] for i in idx]
            select_only(objs); bpy.ops.object.join()
            w = bpy.context.view_layer.objects.active; w.name = f"wheel_{r + 1:02d}_{side}"; out.append(w)
    return out


def front_sign(front_obj):
    """+1 when the named front object lies at larger Blender Y than the body centre, else -1."""
    o = bpy.data.objects[front_obj]
    lo, hi = world_bbox([x for x in bpy.data.objects if x.type == "MESH"])
    return 1 if (o.matrix_world.translation.y > (lo.y + hi.y) / 2) else -1


def set_origin_to_hub(w):
    """Origin on the wheel hub (bbox centre), rotation and scale applied, axle along local X (checked, reported)."""
    select_only([w]); bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    lo = Vector(map(min, *[Vector(c) for c in w.bound_box])); hi = Vector(map(max, *[Vector(c) for c in w.bound_box]))
    ctr = w.matrix_world @ ((lo + hi) / 2)
    cur = bpy.context.scene.cursor; cur.location = ctr
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR")


def wheel_geometry(w):
    ex = [max(c[i] for c in w.bound_box) - min(c[i] for c in w.bound_box) for i in range(3)]
    axle = min(range(3), key=lambda i: ex[i])
    return axle, ex[axle], (ex[(axle + 1) % 3] + ex[(axle + 2) % 3]) / 2   # axle axis, width, diameter


def build_procedural_lunar():
    """Generic lunar rover from primitives. Not a NASA model and not a real mission rover."""
    mat = lambda n, c, m=0.4, r=0.5: _mat(n, c, m, r)
    body = _box("body", (1.15, 1.5, 0.35), (0, 0, 0.62), mat("body_mat", (0.78, 0.8, 0.83, 1)))
    _box("panel", (1.35, 1.0, 0.04), (0, -0.1, 0.92), mat("panel_mat", (0.1, 0.16, 0.3, 1), 0.2, 0.35)).parent = body
    _cyl("mast", 0.035, 0.75, (0, -0.55, 1.12), mat("mast_mat", (0.7, 0.72, 0.75, 1))).parent = body
    _box("camhead", (0.28, 0.12, 0.14), (0, -0.55, 1.55), mat("cam_mat", (0.12, 0.14, 0.18, 1))).parent = body
    wm = mat("wheel_mat", (0.16, 0.18, 0.21, 1), 0.2, 0.85)
    r, wdt, track, base = 0.25, 0.2, 1.4, 1.5
    for ri, y in zip((1, 3), (-base / 2, base / 2)):     # rows 1 (front) and 3 (rear); row 2 is the middle pair a 6-wheel build adds
        for side, x in (("L", track / 2), ("R", -track / 2)):
            w = _cyl(f"wheel_{ri:02d}_{side}", r, wdt, (x, y, r), wm)
            w.rotation_euler = (0, math.radians(90), 0); select_only([w]); bpy.ops.object.transform_apply(rotation=True)
            for k in range(12):      # grousers
                g = _box(f"g{ri}{side}{k}", (wdt * 0.98, 0.035, 0.05), (0, 0, 0), wm)
                a = k / 12 * math.tau; g.location = (x, y + math.sin(a) * r, r + math.cos(a) * r); g.rotation_euler = (-a, 0, 0)
                select_only([g]); bpy.ops.object.transform_apply(rotation=True, location=False)
                select_only([w, g]); bpy.context.view_layer.objects.active = w; bpy.ops.object.join()
            arm = _box(f"arm_{ri}{side}", (abs(x) - 0.3, 0.07, 0.07), (math.copysign((abs(x) + 0.3) / 2, x), y, r + 0.12), mat("arm_mat", (0.7, 0.72, 0.75, 1)))
            arm.parent = body
    return body


def _mat(name, rgba, metal, rough):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = rgba; b.inputs["Metallic"].default_value = metal; b.inputs["Roughness"].default_value = rough
    return m


def _box(name, size, loc, m):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.active_object; o.name = name; o.scale = tuple(s / 2 for s in size)
    bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m); return o


def _cyl(name, r, h, loc, m):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, vertices=28, location=loc); o = bpy.context.active_object; o.name = name
    o.data.materials.append(m); return o


def normalise_and_export(mid, cfg):
    objs = [o for o in bpy.data.objects]
    # drop lights, cameras, empties that carry nothing, helper meshes
    for o in objs:
        if o.type in ("LIGHT", "CAMERA") or (cfg.get("drop_re") and re.match(cfg["drop_re"], o.name)):
            for c in list(o.children):                 # keep the children where they are when their parent goes
                m = c.matrix_world.copy(); c.parent = o.parent; c.matrix_world = m
            bpy.data.objects.remove(o, do_unlink=True)
    bake_armatures()
    # wheels
    if cfg.get("split_wheels"):
        split_wheels([n for n in (o.name for o in bpy.data.objects) if re.match(cfg["wheel_re"], n)][0], cfg["split_wheels"])
    wheels = sorted([o for o in bpy.data.objects if o.type == "MESH" and re.match(r"^wheel_\d\d_[LR]$", o.name)], key=lambda o: o.name)
    # flatten the hierarchy that is not needed for wheel motion: keep parents (they hold the suspension look), wheels keep their parents' frame
    # orientation: forward must be Blender -Y (glTF +Z)
    sgn = front_sign(cfg["front_obj"]) if cfg.get("front_obj") else -1
    root = bpy.data.objects.new("rover_root", None); bpy.context.scene.collection.objects.link(root)
    for o in [o for o in bpy.data.objects if o.parent is None and o is not root]:
        m = o.matrix_world.copy(); o.parent = root; o.matrix_parent_inverse = Matrix.Identity(4); o.matrix_world = m
    if sgn > 0:
        root.rotation_euler[2] = math.pi
    bpy.context.view_layer.update()
    for w in wheels:
        set_origin_to_hub(w)
    bpy.context.view_layer.update()
    # contact plane: lowest wheel point to z = 0, centre of the wheel hubs to x = y = 0
    lo, hi = world_bbox(wheels)
    hubs = [w.matrix_world.translation.copy() for w in wheels]
    cx = sum(h.x for h in hubs) / len(hubs); cy = sum(h.y for h in hubs) / len(hubs)
    root.location = (root.location.x - cx, root.location.y - cy, root.location.z - lo.z)
    bpy.context.view_layer.update()
    # re-number rows so row 1 is the front (largest forward coordinate = most negative Blender y after the flip)
    for side in "LR":
        ws = sorted([w for w in wheels if w.name.endswith("_" + side)], key=lambda w: w.matrix_world.translation.y)
        for w in ws:
            w.name = "tmp_" + w.name
        rows = [1, 3] if len(ws) == 2 else list(range(1, len(ws) + 1))   # a 4-wheel model keeps row 2 free for the middle pair
        for r, w in zip(rows, ws):                     # most negative y first = front
            w.name = f"wheel_{r:02d}_{side}"
    wheels = sorted([o for o in bpy.data.objects if o.type == "MESH" and re.match(r"^wheel_\d\d_[LR]$", o.name)], key=lambda o: o.name)
    # report in glTF axes (x right, y up, z forward): from Blender (x, y, z) -> (x, z, -y)
    allm = [o for o in bpy.data.objects if o.type == "MESH"]
    blo, bhi = world_bbox(allm)
    wl = []
    for w in wheels:
        t = w.matrix_world.translation; axle, wid, dia = wheel_geometry(w)
        wl.append(dict(name=w.name, x=round(t.x, 4), y=round(t.z, 4), z=round(-t.y, 4), axle="xyz"[axle], width_m=round(wid, 4), diameter_m=round(dia, 4)))
    rep = dict(id=mid, length_m=round(bhi.y - blo.y, 3), width_m=round(bhi.x - blo.x, 3), height_m=round(bhi.z - blo.z, 3),
               tris=sum(len(o.data.polygons) for o in allm), wheels=wl)
    os.makedirs(WORK, exist_ok=True)
    raw = os.path.join(WORK, mid + "_raw.glb")
    bpy.ops.export_scene.gltf(filepath=raw, export_format="GLB", export_yup=True, export_apply=False, export_materials="EXPORT",
                              export_image_format="AUTO", export_cameras=False, export_lights=False, export_animations=False, use_selection=False)
    return raw, rep


def compress(raw, out):
    """Resize textures, convert to webp, meshopt-compress. gltf-transform is the cheapest way to get a browser-ready file."""
    t1 = os.path.join(WORK, os.path.basename(out) + ".1.glb"); t2 = t1 + ".2.glb"
    run = lambda *a: subprocess.run(a, check=True, capture_output=True, text=True)
    run("gltf-transform", "dedup", raw, t1)
    run("gltf-transform", "prune", t1, t2)
    run("gltf-transform", "resize", t2, t1, "--width", str(TEX_MAX), "--height", str(TEX_MAX))
    run("gltf-transform", "webp", t1, t2, "--quality", "82")
    run("gltf-transform", "meshopt", t2, out, "--level", "medium")


def main():
    ids = sys.argv[1:] or list(MODELS)
    rep_path = os.path.join(OUT, "model_report.json")
    report = json.load(open(rep_path)) if os.path.exists(rep_path) else {}
    for mid in ids:
        cfg = MODELS[mid]; reset()
        if cfg["kind"] == "blend":
            bpy.ops.wm.open_mainfile(filepath=cfg["src"])
        elif cfg["kind"] == "glb_draco":
            plain = os.path.join(WORK, mid + "_plain.glb"); os.makedirs(WORK, exist_ok=True)   # bpy cannot load Draco in a pip install, so decode first
            subprocess.run(["gltf-transform", "copy", cfg["src"], plain], check=True, capture_output=True)
            bpy.ops.import_scene.gltf(filepath=plain)
        else:
            build_procedural_lunar()
        raw, rep = normalise_and_export(mid, cfg)
        out = os.path.join(OUT, mid + ".glb"); compress(raw, out)
        rep["file"] = f"assets/models/{mid}.glb"; rep["size_mb"] = round(os.path.getsize(out) / 1e6, 2)
        report[mid] = rep
        print(mid, rep["length_m"], "x", rep["width_m"], "x", rep["height_m"], "m,", rep["tris"], "tris,", rep["size_mb"], "MB,", len(rep["wheels"]), "wheels")
    json.dump(report, open(rep_path, "w"), indent=1)


if __name__ == "__main__":
    main()
