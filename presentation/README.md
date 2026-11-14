# Analog Atlas: presentation

Everything for the NASA Space Apps pitch: the 7-slide deck, the speaker script and the live demo script.

| File | What it is |
| --- | --- |
| `index.html` | The deck: an interactive 3D Earth, Moon and Mars. Open it in Chrome or Edge; no server needed. Edit the slides in the `SLIDES` list near the top. |
| `SCRIPT.md` | What the slides presenter says, slide by slide (about 4 minutes), plus the numbers and their sources, and likely questions. |
| `DEMO.md` | What the demo presenter clicks and says (about 3½ minutes), setup checklist, short version and fallbacks. |
| `assets/analog-cells.js` | Real heatmap output of the app (top 2% of land cells for the lunar maria and modern Mars), shown as columns on slide 3. |
| `assets/body-textures.js` | Moon (LRO WAC) and Mars (Viking MDIM 2.1) mosaics from NASA Moon Trek and Mars Trek, embedded so the deck works offline. |
| `assets/earth-textures.js` | Earth day, night and cloud maps (three.js example textures), embedded for offline use. |
| `assets/fonts.css` | Archivo and IBM Plex Mono (SIL Open Font License), embedded. |
| `vendor/three.js` | three.js r170 (MIT). |
| `vendor/qrcode.js` | qrcode-generator (MIT), for the QR code on the last slide. |
| `scripts/deck-export.mjs` | Regenerates the numbers in `assets/analog-cells.js` from the app's grid. |

## Presenting

Open `index.html`, wait for the loading bar, press **F** for full screen and **H** to hide the controls. Use **→ / ←** to move between slides.

Before presenting, set `DECK.qr` in `index.html` to the demo's public URL (it points to the GitHub repository for now).

## Regenerating the heatmap numbers

From the repository root, on a branch that has the app (`src/`, `public/data/grid.bin`):

```bash
node --import ./scripts/rover-check/ts-resolve.mjs presentation/scripts/deck-export.mjs out.json
```
