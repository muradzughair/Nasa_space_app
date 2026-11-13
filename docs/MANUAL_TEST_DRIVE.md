# Manual test: drive mode with a real PS5 DualSense

Needs: Chrome or Edge (desktop), the app served from the project root (`python -m http.server 8000`, open http://localhost:8000/app/), a DualSense connected by USB-C cable or Bluetooth. Safari and Firefox expose the controller differently and were not considered.

1. Connect the controller. On Windows, pair it in Bluetooth settings (hold Create and PS until the light bar flashes) or plug in the USB-C cable. It must appear as a standard gamepad.
2. Open the app, pick a target and a hotspot (for example Jezero, hotspot 1), wait for Site View, press **Drive**. The chooser shows two cards (target ground, Earth hotspot).
3. Click a card. The window should go full screen (if the browser refuses, it fills the window). The top right pill reads "No controller yet: press a button..." until you press any controller button, then "Controller: DualSense Wireless Controller" and a short "Controller connected" message.
4. Check each control (the H key or the PS button opens the same sheet):
   - R2 drives forward and is analog: a light pull is a slower speed than a full pull. L2 brakes, then reverses once stopped. Left stick left or right steers; left stick up also drives.
   - Right stick orbits the camera; after about 3 seconds of no input it eases back behind the rover. L1 and R1 cycle Chase, Low follow and Top down.
   - Cross is the hand brake. Square resets both rovers to the start. Triangle turns the comparison view and the Other/Diff columns on and off. Circle exits to Site View at the same view as before (Esc does the same).
   - Options pauses and resumes. D-pad up and down change the demo speed (x1, x5, x10, x25; shown at the top). Create switches between Detailed and Basic instruments.
5. Dead zone: leave the sticks untouched. The rover must not creep or turn, and the camera must not drift. Push a stick slightly: the response should be gentle and fine.
6. Drive on each ground (choose the other card after exiting): compare how the same inputs behave. On the Moon the wheels should spin at a full-throttle start (the "Wheel spin" warning) and dust should hang longer in the air; on Earth the same rover is much slower and cannot climb gentle slopes at its default mass (use "Equal wheel load on Earth" to give it the target wheel load).
7. Vibration (optional): switch on the Vibration toggle in the instruments. Driving over rough ground and wheel slip should rumble. If nothing happens, the browser or the connection mode does not expose the vibration motor (USB-C usually works best). Adaptive triggers are not available from a web page.
8. Disconnect test: unplug the cable or turn the controller off while driving. The rover must pause and show "Controller disconnected. Paused...". Press any key to continue with the keyboard, or reconnect and press a button.
9. Look for: stutter at x25 with the comparison view on (note your laptop model), the camera ever dipping below the ground or inside the rover, and any text overlap at your screen size.

Report anything that differs, with the browser version and how the controller was connected.

What could not be tested in the build environment: a real DualSense (the Gamepad API was tested with an injected mock controller using the standard mapping, buttons 0 to 16 and axes 0 to 3, plus the vibration call), real full-screen behaviour on a physical display, real GPU frame rate (tests ran on a software renderer), and Bluetooth versus USB differences.
