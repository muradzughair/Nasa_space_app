// Input layer for drive mode: Gamepad API (standard mapping, DualSense and other standard controllers) plus a keyboard and mouse fallback.
// poll(dt) returns one normalised state per frame: { throttle, steer, brake, orbitX, orbitY, pressed:[button events], connected, name, source }.
// Standard mapping buttons: 0 Cross, 1 Circle, 2 Square, 3 Triangle, 4 L1, 5 R1, 6 L2, 7 R2, 8 Create/Select, 9 Options, 10 L3, 11 R3, 12-15 D-pad, 16 PS. Axes: 0 LX, 1 LY, 2 RX, 3 RY.

export const MAPPING = [
  ['R2', 'Throttle forward (analog)', 'W or Up arrow'],
  ['L2', 'Reverse and brake (analog)', 'S or Down arrow'],
  ['Left stick', 'Steer (up and down also work as throttle)', 'A D or Left Right arrows'],
  ['Cross', 'Hand brake', 'Space'],
  ['Right stick', 'Orbit the camera', 'Drag the mouse'],
  ['L1 / R1', 'Previous / next camera (chase, low follow, top down)', 'Q / E or C'],
  ['Square', 'Reset both rovers to the start', 'R'],
  ['Triangle', 'Comparison view on or off', 'V'],
  ['Circle', 'Exit drive mode', 'Esc'],
  ['Options', 'Pause', 'P'],
  ['D-pad up / down', 'Demo speed scale up / down', '+ / -'],
  ['Create', 'Detailed HUD on or off', 'I'],
  ['PS button', 'Show this sheet', 'H'],
];

const BTN = { 0: 'cross', 1: 'circle', 2: 'square', 3: 'triangle', 4: 'l1', 5: 'r1', 8: 'create', 9: 'options', 12: 'up', 13: 'down', 14: 'left', 15: 'right', 16: 'ps' };
const KEYS = { KeyR: 'square', KeyV: 'triangle', KeyP: 'options', KeyI: 'create', KeyQ: 'l1', KeyE: 'r1', KeyC: 'r1', Equal: 'up', NumpadAdd: 'up', Minus: 'down', NumpadSubtract: 'down', KeyH: 'ps', Escape: 'circle' };
const DZ = 0.12;

/** Radial dead zone with rescaling and a gentle response curve (finer control near the centre). */
export function stick(x, y, dz = DZ, curve = 1.5) {
  const m = Math.hypot(x, y); if (m <= dz) return [0, 0];
  const r = Math.min(1, (m - dz) / (1 - dz)), k = Math.pow(r, curve) / m; return [x * k, y * k];
}
export function trigger(b) { const v = b ? (typeof b === 'object' ? b.value : +b) : 0; return v < 0.03 ? 0 : Math.pow(Math.min(1, v), 1.2); }

export function createInput(target = window) {
  const I = { keys: new Set(), pressedQ: [], kb: { throttle: 0, steer: 0 }, orbit: [0, 0], drag: null, prevBtn: [], pad: null, padName: '', wasConnected: false, everConnected: false, disconnected: false, lastRumble: 0, rumble: false, state: null, active: false };
  const onKey = (e, down) => {
    if (!I.active) return;
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    if (down) { I.anyKey = true; if (!e.repeat) { I.keys.add(e.code); const b = KEYS[e.code]; if (b) I.pressedQ.push(b); } } else I.keys.delete(e.code);
  };
  const kd = e => onKey(e, true), ku = e => onKey(e, false), blur = () => I.keys.clear();
  const md = e => { if (I.active && e.target.closest && e.target.closest('#dvStage')) { I.drag = [e.clientX, e.clientY]; } };
  const mm = e => { if (I.drag) { I.orbit[0] += (e.clientX - I.drag[0]) * 0.006; I.orbit[1] += (e.clientY - I.drag[1]) * 0.006; I.drag = [e.clientX, e.clientY]; } };
  const mu = () => { I.drag = null; };
  target.addEventListener('keydown', kd); target.addEventListener('keyup', ku); target.addEventListener('blur', blur);
  target.addEventListener('mousedown', md); target.addEventListener('mousemove', mm); target.addEventListener('mouseup', mu);
  const gamepads = () => { try { return (navigator.getGamepads && navigator.getGamepads()) || []; } catch (e) { return []; } };
  I.start = () => { I.active = true; I.keys.clear(); I.pressedQ.length = 0; I.prevBtn = []; I.disconnected = false; I.kb.throttle = I.kb.steer = 0; };
  I.stop = () => { I.active = false; I.keys.clear(); };
  I.dispose = () => { target.removeEventListener('keydown', kd); target.removeEventListener('keyup', ku); target.removeEventListener('blur', blur); target.removeEventListener('mousedown', md); target.removeEventListener('mousemove', mm); target.removeEventListener('mouseup', mu); };
  I.poll = function (dt) {
    const gps = gamepads(); let gp = null;
    for (const g of gps) if (g && g.connected) { gp = g; break; }
    const events = I.pressedQ.splice(0);
    const s = { throttle: 0, steer: 0, brake: 0, orbitX: 0, orbitY: 0, pressed: events, connected: !!gp, name: '', source: 'keyboard', hold: {} };
    // ---- keyboard (smoothed so a key press is not a binary jump)
    const k = I.keys, tk = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0), sk = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    const ramp = (cur, tgt, r) => cur + Math.max(-r * dt, Math.min(r * dt, tgt - cur));
    I.kb.throttle = ramp(I.kb.throttle, tk, 5); I.kb.steer = ramp(I.kb.steer, sk, 5);
    s.throttle = I.kb.throttle; s.steer = I.kb.steer; s.brake = k.has('Space') ? 1 : 0;
    s.orbitX = I.orbit[0]; s.orbitY = I.orbit[1]; I.orbit = [0, 0];
    if (k.has('ArrowUp') || k.has('ArrowDown') || k.has('ArrowLeft') || k.has('ArrowRight') || k.has('KeyW') || k.has('KeyA') || k.has('KeyS') || k.has('KeyD')) s.source = 'keyboard';
    // ---- gamepad
    if (gp) {
      I.pad = gp; I.everConnected = true; I.disconnected = false; s.name = gp.id.replace(/\s*\(.*?\)\s*/g, ' ').trim() || 'Gamepad';
      const ax = i => gp.axes[i] || 0, [lx, ly] = stick(ax(0), ax(1)), [rx, ry] = stick(ax(2), ax(3));
      const r2 = trigger(gp.buttons[7]), l2 = trigger(gp.buttons[6]);
      const pt = clamp(r2 - l2 - ly, -1, 1), ps = lx;
      const used = Math.abs(pt) > 0.01 || Math.abs(ps) > 0.01 || Math.abs(rx) > 0.01 || Math.abs(ry) > 0.01;
      if (used || gp.buttons.some(b => b && b.pressed)) s.source = 'controller';
      if (s.source === 'controller') { s.throttle = pt; s.steer = ps; s.brake = Math.max(s.brake, gp.buttons[0] && gp.buttons[0].pressed ? 1 : 0); }
      s.orbitX += rx * 2.2 * dt; s.orbitY += ry * 1.6 * dt;
      gp.buttons.forEach((b, i) => { const down = !!(b && b.pressed), was = !!I.prevBtn[i]; if (down && !was && BTN[i]) s.pressed.push(BTN[i]); I.prevBtn[i] = down; });
      I.wasConnected = true;
    } else if (I.wasConnected) { I.wasConnected = false; I.disconnected = true; I.pad = null; }
    if (I.disconnected && I.anyKey && !gp) I.disconnected = false;   // any key continues with the keyboard
    I.anyKey = false;
    s.disconnected = I.disconnected && !gp;
    I.state = s; return s;
  };
  /** Vibration through the dual-rumble actuator (Chrome and Edge). Terrain roughness drives the weak motor, wheel slip the strong one. Rate limited. */
  I.vibrate = function (rough, slip, now = performance.now()) {
    const gp = I.pad, act = gp && gp.vibrationActuator; if (!I.rumble || !act || now - I.lastRumble < 90) return;
    I.lastRumble = now;
    try { act.playEffect('dual-rumble', { startDelay: 0, duration: 100, weakMagnitude: Math.max(0, Math.min(1, rough)), strongMagnitude: Math.max(0, Math.min(1, slip)) }); } catch (e) { /* not supported */ }
  };
  return I;
}
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
