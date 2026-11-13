// Ground rendering for one pane of Site View: level-of-detail tiles of the fine height grid with stitched edges (no cracks), the surroundings
// (real context ring, or mirrored copies on demo sites), rule-based rocks near the rover, and fading wheel tracks.
// The fine grid is the real elevation where the site has it (see patches_index.json); nothing here invents heights.
import * as THREE from '../vendor/three-bundle.js';
import { upsample, sampleGrid, hashStr, mulberry32 } from './terrain.js';

const IDX = new Map();   // one shared triangle index buffer per tile size
function sharedIndex(m) {
  if (!IDX.has(m)) { const idx = new Uint32Array((m - 1) * (m - 1) * 6); let q = 0; for (let a = 0; a < m - 1; a++) for (let b = 0; b < m - 1; b++) { const v00 = a * m + b, v10 = v00 + m, v01 = v00 + 1, v11 = v10 + 1; idx[q++] = v00; idx[q++] = v10; idx[q++] = v01; idx[q++] = v10; idx[q++] = v11; idx[q++] = v01; } IDX.set(m, new THREE.BufferAttribute(idx, 1)); }
  return IDX.get(m);
}
const pow2floor = x => { let s = 1; while (s * 2 <= x) s *= 2; return s; };

/** Slopes of the fine grid as a two-channel texture (dh/dx, dh/dz, each scaled to +-RANGE). The ground shader lights the surface and colours the
 *  Slope view from it, so relief stays visible on coarse far tiles and does not change when a tile switches level of detail. */
export const NRM_RANGE = 1.6;
export function slopeTexture(p, maxAniso = 4) {
  const U = upsample(p), M = U.M, w = Math.min(2048, M - 1), k = (M - 1) / w, d = new Uint8Array(w * w * 2), h = U.h, inv = 1 / (2 * U.dx * k), enc = g => Math.max(0, Math.min(255, Math.round((g / NRM_RANGE * 0.5 + 0.5) * 255)));
  for (let i = 0; i < w; i++) { const i0 = Math.floor(i * k), i1 = Math.min(M - 1, Math.floor((i + 1) * k)), r0 = i0 * M, r1 = i1 * M;
    for (let j = 0; j < w; j++) { const j0 = Math.floor(j * k), j1 = Math.min(M - 1, Math.floor((j + 1) * k)), a = h[r0 + j0], b = h[r0 + j1], c = h[r1 + j0], e = h[r1 + j1], o = (i * w + j) * 2;
      d[o] = enc((b - a + e - c) * inv); d[o + 1] = enc((c - a + e - b) * inv); } }
  const t = new THREE.DataTexture(d, w, w, THREE.RGFormat, THREE.UnsignedByteType);
  t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true; t.anisotropy = maxAniso; t.needsUpdate = true;
  return t;
}

export class Ground {
  /** scene: the pane's scene; patch: terrain patch; mat: ground material (the patch); ctxMat: material of the real context ring; o: { k, rock } */
  constructor(scene, patch, mat, ctxMat, o = {}) {
    const U = upsample(patch), M = U.M, cells = M - 1;
    Object.assign(this, { scene, patch, U, M, mat, half: patch.size / 2, ex: 1, k: o.k || 0.03, C: cells >= 2048 ? 128 : 64, pending: 0, tris: 0, builds: 0, lru: [] });
    this.T = cells / this.C; this.maxS = Math.max(1, this.C / 4); this.border = Math.max(1, cells / 32);   // the surroundings have nodes every 1/32 of the patch
    this.group = new THREE.Group(); scene.add(this.group);
    this.tiles = [];
    for (let ti = 0; ti < this.T; ti++) for (let tj = 0; tj < this.T; tj++) {
      const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat); mesh.castShadow = true; mesh.receiveShadow = true; mesh.visible = false; this.group.add(mesh);
      const i0 = ti * this.C, j0 = tj * this.C; let lo = Infinity, hi = -Infinity;
      for (let a = 0; a <= this.C; a += Math.max(1, this.C / 8)) for (let b = 0; b <= this.C; b += Math.max(1, this.C / 8)) { const v = U.h[(i0 + a) * M + j0 + b]; if (v < lo) lo = v; if (v > hi) hi = v; }
      this.tiles.push({ ti, tj, i0, j0, x0: j0 * U.dx - this.half, z0: i0 * U.dx - this.half, w: this.C * U.dx, lo, hi, mesh, geos: new Map(), cur: 0, want: 0, d: 0, edge: '' });
    }
    // surroundings
    this.ctx = [];
    if (patch.C) {
      const m = new THREE.Mesh(this.ringGeometry(patch.C), ctxMat); m.receiveShadow = true; this.group.add(m); this.ctx.push(m);
    } else {
      const g = this.tileGeometry({ i0: 0, j0: 0, x0: -this.half, z0: -this.half }, this.border, cells);
      for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) {
        if (!a && !b) continue;
        const m = new THREE.Mesh(g, mat); m.receiveShadow = true; m.position.set(a * patch.size, 0, b * patch.size); m.scale.set(Math.abs(a) % 2 ? -1 : 1, 1, Math.abs(b) % 2 ? -1 : 1);
        this.group.add(m); this.ctx.push(m);
      }
      this.outerGeo = g;
    }
    this.rocks = o.rock ? new Rocks(this, o.rock) : null;
  }
  setExag(ex) { this.ex = ex; this.group.scale.y = ex; if (this.rocks) this.rocks.update(null, null, true); }
  /** Grid tile: (cells / s + 1)^2 vertices at stride s of the fine grid. Positions are world metres centred on the patch (y unscaled). */
  tileGeometry(t, s, cells = this.C) {
    const { U, M } = this, m = cells / s + 1, pos = new Float32Array(m * m * 3), nor = new Float32Array(m * m * 3), h = U.h, dx = U.dx;
    for (let a = 0; a < m; a++) { const ui = t.i0 + a * s, il = Math.max(0, ui - s), ir = Math.min(M - 1, ui + s);
      for (let b = 0; b < m; b++) { const uj = t.j0 + b * s, o = (a * m + b) * 3, jl = Math.max(0, uj - s), jr = Math.min(M - 1, uj + s);
        const gx = (h[ui * M + jr] - h[ui * M + jl]) / ((jr - jl) * dx), gz = (h[ir * M + uj] - h[il * M + uj]) / ((ir - il) * dx), inv = 1 / Math.hypot(gx, 1, gz);
        pos[o] = uj * dx - this.half; pos[o + 1] = h[ui * M + uj]; pos[o + 2] = ui * dx - this.half; nor[o] = -gx * inv; nor[o + 1] = inv; nor[o + 2] = -gz * inv; } }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(sharedIndex(m));
    g.userData = { s, m, tris: (m - 1) * (m - 1) * 2 }; g.computeBoundingSphere(); this.builds++;
    return g;
  }
  /** The real context ring: a grid over the ring with the patch cut out. Its inner border has the patch's own heights at every node, and the patch's
   *  border tiles are stitched to those nodes, so the seam is closed. */
  ringGeometry(C) {
    const n = C.n, pos = new Float32Array(n * n * 3), nor = new Float32Array(n * n * 3), uv = new Float32Array(n * n * 2), h = C.h, hs = C.size / 2;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const o = (i * n + j) * 3, jl = Math.max(0, j - 1), jr = Math.min(n - 1, j + 1), il = Math.max(0, i - 1), ir = Math.min(n - 1, i + 1);
      const gx = (h[i * n + jr] - h[i * n + jl]) / ((jr - jl) * C.dx), gz = (h[ir * n + j] - h[il * n + j]) / ((ir - il) * C.dx), inv = 1 / Math.hypot(gx, 1, gz);
      pos[o] = j * C.dx - hs; pos[o + 1] = h[i * n + j]; pos[o + 2] = i * C.dx - hs; nor[o] = -gx * inv; nor[o + 1] = inv; nor[o + 2] = -gz * inv; uv[(i * n + j) * 2] = j / (n - 1); uv[(i * n + j) * 2 + 1] = i / (n - 1); }
    const a0 = Math.round((C.size / 2 - this.half) / C.dx), a1 = Math.round((C.size / 2 + this.half) / C.dx), idx = [];
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < n - 1; j++) { if (i >= a0 && i < a1 && j >= a0 && j < a1) continue; const v00 = i * n + j, v10 = v00 + n, v01 = v00 + 1, v11 = v10 + 1; idx.push(v00, v10, v01, v10, v11, v01); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx); g.computeBoundingSphere();
    return g;
  }
  tileAt(ti, tj) { return ti < 0 || tj < 0 || ti >= this.T || tj >= this.T ? null : this.tiles[ti * this.T + tj]; }
  /** Close the cracks: where a neighbour is drawn coarser (or the patch ends), this tile's edge vertices between the neighbour's nodes are put on the
   *  straight line between those nodes. Only edge vertices change. */
  stitch(t) {
    const g = t.mesh.geometry, ud = g.userData; if (!ud || !ud.m) return;
    const nb = [this.tileAt(t.ti - 1, t.tj), this.tileAt(t.ti + 1, t.tj), this.tileAt(t.ti, t.tj - 1), this.tileAt(t.ti, t.tj + 1)].map(n => (n ? (n.cur || this.maxS) : this.border));
    const key = nb.join(','); if (ud.edge === key) return; ud.edge = key;
    const { s, m } = ud, pos = g.attributes.position.array, h = this.U.h, M = this.M, C = this.C;
    for (let side = 0; side < 4; side++) {
      const S = nb[side], horiz = side < 2, fixed = side === 0 || side === 2 ? 0 : C;   // sides: north row, south row, west column, east column
      for (let q = 0; q < m; q++) {
        const c = q * s, v = horiz ? ((fixed / s) * m + q) : (q * m + fixed / s), ui = horiz ? t.i0 + fixed : t.i0 + c, uj = horiz ? t.j0 + c : t.j0 + fixed;
        let y = h[ui * M + uj];
        if (S > s && c % S) { const c0 = c - (c % S), c1 = c0 + S, f = (c - c0) / S, ya = horiz ? h[ui * M + t.j0 + c0] : h[(t.i0 + c0) * M + uj], yb = horiz ? h[ui * M + t.j0 + c1] : h[(t.i0 + c1) * M + uj]; y = ya + (yb - ya) * f; }
        pos[v * 3 + 1] = y;
      }
    }
    g.attributes.position.needsUpdate = true;
  }
  /** Choose the level of detail of every tile from the camera position and build what is missing, nearest first. A time budget keeps a frame short;
   *  force builds everything now (first frame, snaps). Returns the number of tiles still waiting. */
  update(cam, force) {
    const { tiles, U, ex } = this, budget = force ? Infinity : 4, t0 = performance.now(), changed = new Set();
    let need = [];
    for (const t of tiles) {
      const dx = Math.max(t.x0 - cam.x, 0, cam.x - t.x0 - t.w), dz = Math.max(t.z0 - cam.z, 0, cam.z - t.z0 - t.w), dy = Math.max(t.lo * ex - cam.y, 0, cam.y - t.hi * ex), d = Math.hypot(dx, dy, dz);
      t.d = d; const want = s => Math.max(1, Math.min(this.maxS, pow2floor(Math.max(1, s * this.k / U.dx))));
      let w = want(d);
      if (t.cur && t.cur !== w && t.cur >= want(d * 0.85) && t.cur <= want(d * 1.18)) w = t.cur;   // hysteresis: no flicker at a boundary
      t.want = w; if (w !== t.cur) need.push(t);
    }
    need.sort((a, b) => a.d - b.d); let left = 0;
    for (const t of need) {
      let g = t.geos.get(t.want);
      if (!g) { if (performance.now() - t0 > budget && t.cur) { left++; continue; } g = this.tileGeometry(t, t.want); t.geos.set(t.want, g); }
      t.mesh.geometry = g; t.mesh.visible = true; t.cur = t.want; g.userData.edge = ''; changed.add(t);
      for (const n of [this.tileAt(t.ti - 1, t.tj), this.tileAt(t.ti + 1, t.tj), this.tileAt(t.ti, t.tj - 1), this.tileAt(t.ti, t.tj + 1)]) if (n) changed.add(n);
      if (t.want <= 2) { const key = t; this.lru = this.lru.filter(x => x !== key); this.lru.push(key); }
    }
    for (const t of changed) if (t.cur) this.stitch(t);
    // fine geometries that are no longer shown are freed, oldest first, beyond a small cache
    if (this.lru.length > 40) { const keep = []; let extra = this.lru.length - 40; for (const t of this.lru) { if (extra > 0 && t.cur > 2) { for (const [s, g] of t.geos) if (s <= 2) { g.dispose(); t.geos.delete(s); } extra--; } else keep.push(t); } this.lru = keep; }
    if (changed.size) { let n = 0; for (const t of tiles) n += t.mesh.geometry.userData.tris || 0; this.tris = n; }
    this.pending = left; return left;
  }
  dispose() {
    for (const t of this.tiles) for (const g of t.geos.values()) g.dispose();
    this.ctx.forEach(m => m.geometry.dispose()); if (this.rocks) this.rocks.dispose();
    this.scene.remove(this.group);
  }
}

/** Rocks near a focus point. ILLUSTRATIVE: sizes and positions follow a rock-abundance rule with a fixed seed per site (the same rocks every time and
 *  in every view of the site). They are not mapped from the image, they are not in the height field, and the wheels do not feel them. */
class Rocks {
  constructor(ground, o) {
    this.g = ground; this.o = o; this.N = 700; this.cell = 6; this.R = 60; this.c = null;
    const geo = new THREE.IcosahedronGeometry(1, 1), p = geo.attributes.position, rnd = mulberry32(77);
    const bump = new Map();
    for (let i = 0; i < p.count; i++) { const key = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`; if (!bump.has(key)) bump.set(key, 0.72 + rnd() * 0.5); const k = bump.get(key); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.7, p.getZ(i) * k); }
    geo.computeVertexNormals();
    this.mat = new THREE.MeshStandardMaterial({ color: o.color, roughness: 0.95, metalness: 0, flatShading: true });
    this.mesh = new THREE.InstancedMesh(geo, this.mat, this.N); this.mesh.castShadow = true; this.mesh.receiveShadow = true; this.mesh.frustumCulled = false; this.mesh.count = 0;
    ground.scene.add(this.mesh); this.seed = hashStr(ground.patch.id + '|rocks'); this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._e = new THREE.Euler(); this._s = new THREE.Vector3(); this._p = new THREE.Vector3();
  }
  /** Re-seat the rocks when the focus (the rover, in world metres) has moved more than two cells. */
  update(x, z, force) {
    if (x == null) { if (!this.c) return; x = this.c[0]; z = this.c[1]; }
    if (!force && this.c && Math.hypot(x - this.c[0], z - this.c[1]) < this.cell * 2) return;
    this.c = [x, z];
    const { g, cell, R, o } = this, U = g.U, half = g.half, c0 = Math.floor((x - R) / cell), c1 = Math.floor((x + R) / cell), r0 = Math.floor((z - R) / cell), r1 = Math.floor((z + R) / cell); let n = 0;
    for (let r = r0; r <= r1 && n < this.N; r++) for (let c = c0; c <= c1 && n < this.N; c++) {
      const rnd = mulberry32((this.seed ^ Math.imul(c + 32768, 73856093) ^ Math.imul(r + 32768, 19349663)) >>> 0), k = rnd() < o.abundance ? 1 + (rnd() < o.abundance * 0.5 ? 1 : 0) : 0;
      for (let q = 0; q < k && n < this.N; q++) {
        const px = (c + rnd()) * cell, pz = (r + rnd()) * cell; if (Math.abs(px) > half - 1 || Math.abs(pz) > half - 1 || Math.hypot(px - x, pz - z) > R) { rnd(); rnd(); rnd(); continue; }
        const d = Math.min(0.9, 0.11 * Math.pow(1 - rnd() * 0.985, -0.6)), y = sampleGrid(U.h, U.M, U.dx, px + half, pz + half) * g.ex;   // many pebbles, few boulders
        this._e.set(rnd() * 0.5, rnd() * 6.283, rnd() * 0.5); this._q.setFromEuler(this._e); this._s.set(d, d, d); this._p.set(px, y + d * 0.18, pz);
        this.mesh.setMatrixAt(n++, this._m.compose(this._p, this._q, this._s));
      }
    }
    this.mesh.count = n; this.mesh.instanceMatrix.needsUpdate = true;
  }
  dispose() { this.g.scene.remove(this.mesh); this.mesh.geometry.dispose(); this.mat.dispose(); if (this.mesh.dispose) this.mesh.dispose(); }
}

/** Wheel tracks: one ribbon per side of the rover, laid on the ground where the rear wheels pass. Darkness follows the computed sinkage and fades
 *  slowly with distance travelled since the track was laid. Multiply-blended, so it only darkens the ground. */
export class Tracks {
  constructor(scene, N = 900) {
    this.scene = scene; this.N = N; this.n = 0; this.last = null;
    this.rib = [0, 1].map(() => {
      const g = new THREE.BufferGeometry(), pos = new Float32Array(N * 6), col = new Float32Array(N * 6).fill(1), idx = new Uint32Array((N - 1) * 6);
      for (let k = 0; k < N - 1; k++) { const a = k * 2; idx.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], k * 6); }
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(new THREE.BufferAttribute(idx, 1)); g.setDrawRange(0, 0);
      const m = new THREE.Mesh(g, Tracks.mat || (Tracks.mat = new THREE.MeshBasicMaterial({ vertexColors: true, blending: THREE.MultiplyBlending, transparent: true, depthWrite: false, fog: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide, toneMapped: false })));
      m.frustumCulled = false; m.renderOrder = 3; scene.add(m); return { g, pos, col, m, str: new Float32Array(N) };
    });
  }
  reset() { this.n = 0; this.last = null; this.rib.forEach(r => r.g.setDrawRange(0, 0)); }
  /** pts: [left, right] rear wheel contact points [x, y, z] in world metres; dir: unit travel direction [x, z]; w: wheel width; strength 0..1. */
  add(pts, dir, w, strength) {
    const l = pts[0];
    if (this.last) { const d = Math.hypot(l[0] - this.last[0], l[2] - this.last[2]); if (d < 0.3) return; if (d > 6) this.reset(); }   // a jump (scrub, reset) starts a new track
    this.last = [l[0], l[1], l[2]];
    if (this.n >= this.N) { const drop = this.N >> 3; this.rib.forEach(r => { r.pos.copyWithin(0, drop * 6); r.str.copyWithin(0, drop); }); this.n -= drop; }
    const k = this.n++, nx = -dir[1] * w / 2, nz = dir[0] * w / 2;
    this.rib.forEach((r, i) => { const p = pts[i]; r.pos.set([p[0] - nx, p[1], p[2] - nz, p[0] + nx, p[1], p[2] + nz], k * 6); r.str[k] = strength;
      for (let q = 0; q < this.n; q++) { const age = (this.n - 1 - q) / this.N, v = 1 - 0.42 * r.str[q] * Math.sqrt(Math.max(0, 1 - age)), o = q * 6; r.col[o] = r.col[o + 1] = r.col[o + 2] = r.col[o + 3] = r.col[o + 4] = r.col[o + 5] = v; }
      r.g.attributes.position.needsUpdate = true; r.g.attributes.color.needsUpdate = true; r.g.setDrawRange(0, Math.max(0, (this.n - 1) * 6)); });
  }
  dispose() { this.rib.forEach(r => { this.scene.remove(r.m); r.g.dispose(); }); }
}
