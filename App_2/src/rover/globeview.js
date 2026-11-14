// The two helpers site.js and drivemode.js used from the old globe module (app/js/globeview.js), copied unchanged. The old globe itself is not ported.
export const motion = { scale: 1 };   // 1 normally, small when the user prefers reduced motion (set by the simulator on open)
export const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
