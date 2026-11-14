// Drive-mode physics: a dynamic, gravity-aware rover on a terrain patch. Pure logic, no 3D, deterministic for the same inputs.
// A screening model, not validated against a real rover. All drive-force, power and battery figures come from the effective rover config (rovercfg.js, built from
// assets/models/rovers.json) and are flagged verified:false there when they are assumptions. Terrain contact (wheel points, plane fit), friction and rolling resistance come from sim.js so both stay in step.
import { contactSampler, upsample } from './terrain.js';
import { wheelPoints, contactFit, crrFromSoil, START } from './sim.js';
import { SoilDrag } from './soilmech.js';

export const STEP = 1 / 120;                 // fixed physics step, simulated seconds
export const DEMO_SCALES = [1, 5, 10, 25];   // demo speed scale: multiplies simulated time per real second, never the forces
export const DEG = Math.PI / 180;
const MAX_STEPS = 240, TAU_LAT = 0.12, OM0 = 0.12, V_CAP = 3;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const sgn = x => (x > 0 ? 1 : x < 0 ? -1 : 0);

export class DriveSim {
  /** patch: terrain patch; par: effective rover config (rovercfg.js); g: local gravity; mu: friction coefficient; soil: 0..1; mass: kg;
   *  S: Bekker soil constants of the ground class (optional, adds sinkage and compaction resistance). */
  constructor(patch, par, { g, mu, soil, mass, S }) {
    this.p = patch; this.par = par; this.W = wheelPoints(par); this.U = upsample(patch);
    this.g = g; this.mu = mu; this.crr = crrFromSoil(soil); this.m = mass ?? par.mass_kg; this.drag = S ? new SoilDrag(par, S) : null;
    this.sample = contactSampler(patch, par.wheel_radius_m, par.wheel_width_m || 0.3);   // the shared height function over the wheel footprint (terrain.js), as the view and the HUD
    this.reset();
  }
  reset() {
    const p = this.p;
    Object.assign(this, { x: START[0] * p.size, z: START[1] * p.size, psi: 0, v: 0, u: 0, om: 0, acc: 0, simT: 0, E: 0, Ed: 0, dist: 0, wheelAng: 0, edge: false,
      spin: 0, sliding: false, P: 0, Fx: 0, N: 0, muN: 0, binE: 0, binS: 0, bins: [], aLong: 0, dead: false, battery: 1, lastRes: 0 });
    this.fit = contactFit(this.sample, this.x, this.z, this.psi, this.W, this._fit || (this._fit = {}));
  }
  /** Advance by real time realDt at demo scale `scale`, in fixed simulated steps. inp = { throttle -1..1, steer -1..1 (right positive), brake 0..1 }. */
  advance(realDt, scale, inp) {
    this.acc += realDt * scale; let n = 0;
    while (this.acc >= STEP && n < MAX_STEPS) { this.step(inp); this.acc -= STEP; n++; }
    if (n >= MAX_STEPS) this.acc = 0;
    return n;
  }
  step(inp, dt = STEP) {
    const { par, m, g, mu, crr } = this, W = this.W;
    const f = contactFit(this.sample, this.x, this.z, this.psi, W, this._fit || (this._fit = {})); this.fit = f;
    const sa = f.sa, sb = f.sb, alpha = Math.atan(Math.hypot(sa, sb)), cosA = Math.cos(alpha);
    const N = m * g * cosA, muN = mu * N, Fres = crr * N + (this.drag ? this.drag.at(N).Rc : 0);                    // wheel normal load, traction limit, rolling resistance (newtons)
    const Fg = -m * g * (sa / Math.hypot(1, sa)), Fgr = -m * g * (sb / Math.hypot(1, sb));   // gravity components along the heading and to the right
    const vmax = par.max_speed_mps;
    const d = this.dead ? 0 : clamp(inp.throttle, -1, 1), hb = clamp(inp.brake || 0, 0, 1), v = this.v;
    const opposing = d * v < 0 && Math.abs(v) > 1e-3;                      // throttle against the direction of travel = brake
    const idle = Math.abs(d) < 0.03 && hb === 0;
    // ---- longitudinal forces
    let Fd = 0;
    if (!opposing && Math.abs(d) >= 0.03 && hb === 0) {
      const av = Math.abs(v), Fmot = Math.min(par.drive_force_max_N * Math.max(0, 1 - av / vmax), par.drive_power_max_W / Math.max(av, 0.01));
      Fd = d * Fmot;
      // speed governor: above the commanded speed (throttle x max speed) the motors brake, so the rover does not run away downhill
      const vcmd = Math.abs(d) * vmax, over = Math.sign(v) === Math.sign(d) ? av - vcmd : 0;
      if (over > 0) Fd = -sgn(v) * Math.min(par.drive_force_max_N, 4 * par.drive_force_max_N * over / vmax);
    }
    let Feff = Fd, spin = 0;
    if (Math.abs(Fd) > muN) { Feff = sgn(Fd) * muN; spin = 1 - muN / Math.abs(Fd); }   // traction limit: the excess spins the wheels
    const Fb = Math.min(muN, Math.max(hb, opposing ? Math.abs(d) : 0) * muN + (idle ? 0.25 * muN : 0));   // braking is limited by traction too
    const locked = Feff === 0;
    let vNew = v;
    if (Math.abs(v) < 1e-4) {
      const Fnet0 = Feff + Fg, Fstat = locked ? muN : Fres;
      if (Math.abs(Fnet0) > Fstat) vNew = v + ((Fnet0 - sgn(Fnet0) * (locked ? muN : Fres)) / m) * dt; else vNew = 0;
    } else {
      const dir = sgn(v), a = (Feff + Fg - dir * (Fres + Fb)) / m - this.om * this.u;
      vNew = v + a * dt;
      if (v * vNew <= 0) { const Fdg = Feff + Fg; vNew = (sgn(Fdg) !== dir && Math.abs(Fdg) > Fres + Fb) ? vNew : 0; }
    }
    vNew = clamp(vNew, -V_CAP, V_CAP);
    // ---- lateral grip with a friction circle: drive and brake force reduce what is left for side force
    const Fxu = Math.abs(Feff) + Fb, capLat = Math.max(0.1 * muN, Math.sqrt(Math.max(0, muN * muN - Fxu * Fxu)));
    const FtDes = -m * this.u / TAU_LAT - Fgr - m * this.om * v;
    const Ft = clamp(FtDes, -capLat, capLat); this.sliding = Math.abs(FtDes) > capLat * 1.0001 && (Math.abs(Fgr) > 0.2 * muN || Math.abs(this.u) > 0.02);
    const uNew = this.u + ((Fgr + Ft) / m + this.om * v) * dt;
    // ---- yaw: turn in place or on the move, rate limited by traction and by the lateral grip
    const trF = clamp(Math.sqrt(mu * g * cosA / 3), 0.35, 1);
    let omT = -clamp(inp.steer, -1, 1) * OM0 * trF;
    const omLat = 0.8 * mu * g * cosA / Math.max(Math.abs(v), 0.05); omT = clamp(omT, -omLat, omLat);
    this.om += (omT - this.om) * (1 - Math.exp(-dt / 0.25));
    // ---- integrate pose (patch coordinates; forward = (cos psi, sin psi), right = (sin psi, -cos psi))
    this.psi += this.om * dt;
    const fx = Math.cos(this.psi), fz = Math.sin(this.psi), rx = fz, rz = -fx;
    const vx = vNew * fx + uNew * rx, vz = vNew * fz + uNew * rz;
    this.x += vx * dt; this.z += vz * dt;
    const mg = 3, s = this.p.size; this.edge = false;
    if (this.x < mg || this.x > s - mg || this.z < mg || this.z > s - mg) { this.x = clamp(this.x, mg, s - mg); this.z = clamp(this.z, mg, s - mg); vNew *= 0.5; this.edge = true; }
    this.aLong += ((vNew - v) / dt - this.aLong) * 0.02;
    this.v = vNew; this.u = uNew;
    // ---- power and energy: mechanical drive power over efficiency, plus base load
    const vRim = Math.abs(vNew) / Math.max(0.1, 1 - spin), turn = 0.05 * par.drive_power_max_W * Math.abs(this.om) / OM0;
    const Pd = ((Feff * vNew < 0 ? 0 : Math.abs(Feff) * vRim) + turn) / par.drive_efficiency, P = Pd + par.base_power_W;
    this.P = P; this.Fx = Feff; this.N = N; this.muN = muN; this.spin = spin;
    this.E += P * dt; this.Ed += Pd * dt; this.simT += dt;
    const ds = Math.hypot(vx, vz) * dt; this.dist += ds; this.binS += ds; this.binE += Pd * dt;
    if (this.binS >= 1) { this.bins.push(this.binE / this.binS); if (this.bins.length > 20) this.bins.shift(); this.binS = 0; this.binE = 0; }
    this.wheelAng += (sgn(vNew) * vRim / par.wheel_radius_m) * dt;
    this.battery = Math.max(0, 1 - this.E / 3600 / par.battery_wh); this.dead = this.battery <= 0;
    this.lastRes = f.resid;
  }
  /** Everything the HUD and the renderer need, in SI units (angles in degrees). */
  readout() {
    const f = this.fit, par = this.par, fx = Math.cos(this.psi), fz = Math.sin(this.psi);
    const alpha = Math.atan(Math.hypot(f.sa, f.sb)), ax = clamp(this.x + 2 * fx, 0, this.p.size), az = clamp(this.z + 2 * fz, 0, this.p.size);
    const slopeAhead = Math.atan((this.sample(ax, az) - this.sample(this.x, this.z)) / Math.max(0.5, Math.hypot(ax - this.x, az - this.z))) / DEG;
    const baseSlip = Math.min(1, Math.pow(Math.tan(alpha) / this.mu, 2.5));
    const dsum = this.bins.length + this.binS, epm = dsum >= 0.25 ? (this.bins.reduce((a, b) => a + b, 0) + this.binE) / dsum : null;   // J/m over the last ~20 m (bins of 1 m), drive energy only
    const bearing = ((Math.atan2(fx, -fz) / DEG) + 360) % 360;
    return { speed: this.v, lat: this.u, ground: Math.hypot(this.v, this.u), bearing, pitch: Math.atan(f.sa) / DEG, roll: Math.atan(f.sb) / DEG, tilt: alpha / DEG, slopeAhead,
      dist: this.dist, simT: this.simT, power: this.P, energyWh: this.E / 3600, epm, battery: this.battery, slip: Math.max(this.spin, baseSlip), spin: this.spin, sliding: this.sliding, sinkMm: this.drag ? 1000 * this.drag.z : 0, pressKPa: this.drag ? this.drag.p / 1000 : 0,
      N: this.N, muN: this.muN, mu: this.mu, g: this.g, mass: this.m, edge: this.edge, dead: this.dead, accel: this.aLong, tiltLimit: par.slope_limit_deg, resid: this.lastRes, yawRate: this.om / DEG };
  }
}
