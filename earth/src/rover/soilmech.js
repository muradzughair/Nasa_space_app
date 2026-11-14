// Simplified Bekker-style wheel sinkage and compaction resistance. Pure logic, no 3D, no DOM.
// ASSUMED and SIMPLIFIED: the soil constants come from assets/models/rovers.json (soils) and are order-of-magnitude values, not
// measurements of any site. There is no bulldozing, no shear (Janosi) model and no grouser effect. Screening use only.
//
// Per wheel with load W (N), width b (m), radius r (m): the contact chord is L(z) = 2 sqrt(2 r z - z^2), the contact pressure is
// p = W / (b L(z)), and the plate-sinkage law is p = (kc/b + kphi) z^n. Solving both gives the sinkage z. The compaction resistance of the
// wheel is R = b (kc/b + kphi) z^(n+1) / (n+1).

/** Ground class from the site traits: firm ground, loose fine regolith (dust cover), or sand. */
export function groundClass(traits) {
  const soil = traits?.soil ?? 0.5, dust = traits?.dust ?? 0.5;
  if (soil >= 0.7) return 'rocky';
  return dust >= 0.5 ? 'fine_regolith' : 'sand';
}

const coef = (S, b) => (S.kc / b + S.kphi) * 1000;   // Pa per m^n

/** Sinkage of one wheel. Returns { z (m), L (m), p (Pa) }. S = soils[class]. */
export function wheelSinkage(S, b, r, W) {
  if (!(W > 0)) return { z: 0, L: 0, p: 0 };
  const c = coef(S, b), f = z => b * 2 * Math.sqrt(Math.max(0, 2 * r * z - z * z)) * c * Math.pow(z, S.n) - W;
  let lo = 1e-9, hi = r * 0.95;
  if (f(hi) < 0) return { z: hi, L: 2 * Math.sqrt(2 * r * hi - hi * hi), p: W / (b * 2 * Math.sqrt(2 * r * hi - hi * hi)) };   // the wheel is buried to 95 % of its radius
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; }
  const z = (lo + hi) / 2, L = 2 * Math.sqrt(2 * r * z - z * z);
  return { z, L, p: W / (b * L) };
}

export function compaction(S, b, z) { return b * coef(S, b) * Math.pow(z, S.n + 1) / (S.n + 1); }

/** Sinkage and compaction resistance of a whole rover with total normal load N (N), spread evenly over its wheels. Cached by load. */
export class SoilDrag {
  constructor(cfg, S) { this.b = cfg.wheel_width_m; this.r = cfg.wheel_radius_m; this.n = cfg.n_wheels; this.S = S; this._N = -1; this.z = 0; this.p = 0; this.Rc = 0; }
  at(N) {
    if (this._N < 0 || Math.abs(N - this._N) > 0.004 * this._N) {
      const w = wheelSinkage(this.S, this.b, this.r, N / this.n);
      this.z = w.z; this.p = w.p; this.Rc = this.n * compaction(this.S, this.b, w.z); this._N = N;
    }
    return this;
  }
}

/** Steady flat-ground numbers for a rover config on a ground: weight, ground pressure, sinkage, top speed here, range on the battery.
 *  Uses the same force balance as drive.js (motor force limited by a power cap and by traction). g in m/s2, mu friction, crr base rolling coefficient. */
export function estimate(cfg, S, { g, mu, crr, mass }) {
  const m = mass ?? cfg.mass_kg, W = m * g, w = wheelSinkage(S, cfg.wheel_width_m, cfg.wheel_radius_m, W / cfg.n_wheels);
  const Rc = cfg.n_wheels * compaction(S, cfg.wheel_width_m, w.z), Fres = crr * W + Rc, vmax = cfg.max_speed_mps;
  const Fmot = v => Math.min(cfg.drive_force_max_N * Math.max(0, 1 - v / vmax), cfg.drive_power_max_W / Math.max(v, 0.01), mu * W);
  let lo = 0, hi = vmax, vTop;
  if (Fmot(1e-3) <= Fres) vTop = 0;                                // cannot move at all
  else { for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (Fmot(mid) > Fres) lo = mid; else hi = mid; } vTop = lo; }
  const v = Math.max(vTop, 1e-6), P = Fres * v / cfg.drive_efficiency + cfg.base_power_W;   // electrical power at that speed
  return { weightN: W, wheelLoadN: W / cfg.n_wheels, pressure_kPa: w.p / 1000, sinkage_m: w.z, sinkage_over_radius: w.z / cfg.wheel_radius_m, contact_length_m: w.L,
    resistanceN: Fres, compactionN: Rc, topSpeed: vTop, powerW: P, rangeM: vTop > 0 ? cfg.battery_wh * 3600 / P * vTop : 0, jPerM: vTop > 0 ? P / vTop : Infinity, canMove: vTop > 0 };
}
