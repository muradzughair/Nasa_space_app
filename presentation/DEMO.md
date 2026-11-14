# Analog Atlas: live demo script

About 3½ minutes. The demo follows the same loop as slide 4: **pick a target → score Earth → read why → request verification → contributor answers → review → rover.**

- **DO** = what to click. **SAY** = what to say. Button names are written exactly as they appear in the app.
- Talk while things load. Never wait in silence: every SAY line is long enough to cover a load.

---

## Before the judges arrive (do this once, 20 minutes early)

1. **Start the app** from the repo root:
   ```bash
   npm run build
   ```
   ```bash
   npm run preview
   ```
   Open the address it prints (usually http://localhost:4173) in **Chrome or Edge**, full screen (F11).
2. **Check the internet connection.** The globe imagery and the rover ground (Copernicus terrain) are fetched live.
3. **Warm up everything once, in this same browser window**, so nothing loads for the first time in front of the judges:
   - Set **Compare Earth with** to **Moon**, version **Maria**, and turn on **Show similarity heatmap**. Wait until the colours appear.
   - Switch to **Mars**, **Modern surface**, let the heatmap finish, then switch back to **Moon · Maria**.
   - Open **Simulate a rover here** at the Atacama reference site once, then **Back to globe**.
4. **Prepare one finished request** (recording a video live takes too long):
   - Click the top cell at Harrat Lunayyir (Saudi Arabia) → **Request local verification**.
   - Add a route (**Add waypoints by clicking the globe**, 3–4 clicks along the lava field) → **Record a terrain preview** → **Save request**.
   - Open it from **Site verification** → **Respond as a local contributor**. Answer one question **Matches**, one **Differs** (with **Use current video time**, **Mark a point on the globe**, a short explanation and a photo), then **Submit response**. Leave it **unreviewed**: the judges will see you review it.
5. **Have a backup:** a screen recording of this whole demo on the desktop, in case the Wi-Fi fails.
6. Leave the app on the whole-Earth view, heatmap **off**, every panel closed.

---

## The demo

### 0 · Hand-off from the slides (≈ 10 s)

**SAY:** "Thanks. Let me show you Analog Atlas working live. Everything you'll see runs in a normal web browser."

### 1 · Pick a target (≈ 20 s)

**DO:** In the bar on the left, **Compare Earth with** → **Moon**, version **Maria**.

**SAY:** "A researcher starts by choosing what they want to rehearse for. Here, the lunar maria: the dark lava plains the Apollo missions landed on. We have eight built-in targets on the Moon and Mars, and on the Moon you can make any point your own target."

*(Optional, only if you have time: switch the top switcher to **Moon**, click a point, show **Use this point as the target**, then switch back to **Earth**.)*

### 2 · Score all of Earth (≈ 30 s)

**DO:** Turn on **Show similarity heatmap**. Rotate and zoom slowly to the **Red Sea and Saudi Arabia**.

**SAY:** "Now the model scores every place on Earth, all 92,172 of them, against that target, right here in the browser. Brighter means more similar. It's strict on purpose: a typical place scores around 10%. And the bright spots here are lava fields in Saudi Arabia, exactly the kind of fresh, dry, basaltic ground the maria are made of."

### 3 · Read why (≈ 35 s)

**DO:** Click the brightest cell (Harrat Lunayyir). Open its breakdown.

**SAY:** "This one scores 76%, top 0.1% of all land on Earth. But a number alone isn't enough for a scientist, so every score explains itself."

**DO:** Point at **What matches**, then **Where it breaks down**, then the line on how much rests on estimates.

**SAY:** "Here is what matches (rock type, landforms, no vegetation) and where it breaks down. And here it tells you honestly how much of the score is measured and how much is **estimated**. Gravity, atmosphere and radiation are listed too, but never scored, because no place on Earth is closer to the Moon on those."

### 4 · Ask the people who know the place (≈ 30 s)

**DO:** On the card, click **Request local verification**. Scroll slowly through **Questions for contributors** and **Observations asked for**.

**SAY:** "So the researcher shortlists it and asks for local verification. Notice these questions were drafted automatically from the weakest parts of the data: what was estimated, missing or too coarse. The request includes a walkthrough of the exact area, so someone who knows it can see what we see."

**DO:** Close this draft, open **Site verification** in the top bar, and open the request you prepared earlier. Play a few seconds of the **Walkthrough video**.

### 5 · A local contributor answers (≈ 25 s)

**DO:** Show the prepared response: the **Matches** answer, then the **Differs** answer with its video time, map point and photo.

**SAY:** "A local contributor (a geologist, a guide, someone who lives there) answers each question with **Matches**, **Differs** or **Cannot judge**. They pin it to a point on the map or a moment in the video, and attach photos and sources. This one says the surface differs from what the satellite data suggests, and shows us why."

### 6 · The researcher reviews (≈ 20 s)

**DO:** **Review responses** → set **Review status** to **Accepted** → type a short **Reviewer's note** → show **Export**.

**SAY:** "Nothing counts until a researcher reviews it. I'll accept this one. It now becomes part of the site's evidence record, and you can export the whole report. One important detail: accepted evidence **never silently changes the score**. The scientist sees exactly where the data was wrong and decides what to do."

### 7 · The rover (≈ 50 s)

**DO:** Close the panel. **Compare Earth with** → **Mars**, version **Modern surface**. Open **27 reference sites, ranked** and pick **Yungay, Atacama**. On its card, click **Simulate a rover here**.

**SAY (while it loads):** "Finally, the rover. Let's switch to Mars. The Atacama Desert ranks near the top for the Martian surface. Now we load the real ground at this exact point, from 30-metre satellite terrain, with a NASA rover model on it."

**DO:** Press **Play**. Point at the live readouts (tilt, slip, energy). If the gravity bar shows a **Mars ground vs Earth** option, select it so the Mars target ground sits beside the Earth ground; otherwise choose **Same ground, two gravities**.

**SAY:** "The rover drives a route and we see its tilt, wheel slip and energy use. Here it's side by side: the same drive at Earth gravity and at Mars gravity, so test teams can see whether this ground is a meaningful test **before shipping a rover across the world**. Locals use the same view to check the landscape, and researchers use it to screen out sites that are too flat, too steep or too soft."

**DO (optional, 5 s):** **Change rover** → pick Curiosity, to show the fleet.

**DO:** **Back to globe**.

### 8 · Close (≈ 10 s)

**SAY:** "So that's the loop: find the site, check it with the people who know it, and fix the data, all in one place. Thank you. We're happy to take questions."

---

## If time is short (90-second version)

Do only steps **2 → 3 → 6 → 7**: heatmap, breakdown of the top cell, accept the prepared response, open the rover at Atacama and press **Play**. Skip the target picker (leave it on Moon · Maria) and the request draft.

## If something breaks

| Problem | What to do and say |
| --- | --- |
| Globe imagery is slow or blank | Keep talking over the heatmap. It comes from our own data file and still works. |
| Heatmap takes a few seconds | "It's scoring all 92,172 places on this laptop right now." That's true and it's a feature. |
| Rover ground won't load (no internet) | "The rover streams real terrain from open data, and the network here is blocking it." Switch to the backup recording. |
| Prepared request is missing | You used a different browser or profile: requests are stored in that browser only. Use the backup recording for steps 4–6. |
| A judge asks to try it | Let them click any spot on Earth and press **Score this spot**. It works anywhere. |

## Questions the demo person should be ready for

- **"Is the data shared between users?"** Not yet. In this prototype, requests and responses are stored in the browser and can be exported and imported as a file. A shared backend with accounts and moderation is our next step (about $28 a month to run).
- **"Is the rover physics validated?"** No, it's a screening tool: real 30 m terrain, a simplified soil model, and detail below about 60 m is synthetic. The app says so on screen. Real rover performance still needs field tests.
- **"Where do the scores come from?"** NASA MODIS, NASA POWER, LOLA and MOLA terrain, plus the Copernicus DEM, a global rock map and volcano and impact-crater lists. Every number on the card links to its source.
- **"Why does 76% not mean '76% like the Moon'?"** The score ranks places on Earth against each other. Gravity, atmosphere and radiation are listed but not scored, because every place on Earth is equally far from the Moon on those.
