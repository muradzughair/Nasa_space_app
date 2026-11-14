# TerraAnalog - project map

Read this first. Only ONE folder is the app.

| Folder | What it is | Do I work here? |
|---|---|---|
| `App_2/` | **The app: Analog Atlas.** React + Vite + Cesium globe. Score any spot on Earth against Mars or the Moon, heatmap, verification requests, and the rover simulator. | **Yes - all app work happens here.** |
| `presentation/` | **Orbit Deck.** A separate 3D Earth slide presentation. Open `presentation/index.html` directly in a browser. Edit the slides in the SLIDES list inside that file. | Only when editing the pitch slides. |
| `competition_docs/` | NASA Space Apps judging guidelines and project components (PDFs). | Read only. |
| `App_1/` | Leftovers from the old `main` branch: old data, old tests, `_local` backups and source 3D models. Not used by the app. Not tracked by git. | No. Keep it as a backup. |

## Inside the app (`App_2/`)

| Path | What it is |
|---|---|
| `App_2/src/App.tsx` | Main app screen. |
| `App_2/src/components/` | Globe UI: top target bar (`TargetBar.tsx`: Compare with / Version), info and analog cards, heatmap controls, settings, the "Simulate a rover here" button (`SimulateRover.tsx`). |
| `App_2/src/analog/` | Similarity scoring (`scoring.ts`), Moon/Mars versions, custom lunar targets, heatmap. |
| `App_2/src/rover/` | Rover simulator: physics (`drive.js`, `sim.js`, `contact.js`), terrain (`terrain.js`, `ground.js`, `earthground.ts`), rover models (`rovers.js`), the simulation screen (`site.js`, `drivemode.js`, `roverui.js`), auto quality (`quality.js`), styles (`rsim.css`). |
| `App_2/src/verify/` | Local verification requests. |
| `App_2/public/` | Data files and rover 3D models served to the browser. |
| `App_2/scripts/` | Data build scripts; `scripts/rover-check/` has the rover tests. |

## Run the app

```
cd App_2
npm install      (first time only)
npm run dev
```

## Git

- Current branch: `Amro-Earth` = Amro's app + Murad's rover fixes (wheel scale, contact physics, lag fix).
- `main` = Murad's old app (`app/` folder). Kept for history only.
