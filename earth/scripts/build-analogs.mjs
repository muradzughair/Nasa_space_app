// Builds public/data/analogs.json: measures every Earth candidate and every
// Moon/Mars target from open data, then scores each pair on seven dimensions.
// Run with `npm run analogs`. Raw responses are cached in scripts/.cache, so
// re-runs are offline; delete that folder to re-download.
//
// Every number written out names its source. Values that could not be
// measured from a dataset come from analog-sites.mjs with a citation.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fromUrl } from "geotiff";
import { compare, DIMENSIONS, sunElevation as sunAt } from "../src/analog/scoring.ts";
import { BODIES, REFS, SITES, TAGS, TARGETS } from "./analog-sites.mjs";
import { cached, CELL, copdemUrl, getJson, getRange, getText, gridder, HALF, HERE, http, log, mean, median, N, pool, quantile, RAD, RADIUS, terrainMetrics } from "./common.mjs";

const OUT = path.resolve(HERE, "../public/data/analogs.json");
const PDS = "https://pds-geosciences.wustl.edu";
const YEAR = 2023;

const SOURCES = {
  copdem: { label: "Copernicus DEM GLO-90 (ESA / Airbus), AWS Open Data", url: "https://registry.opendata.aws/copernicus-dem/", kind: "dataset" },
  mod11: { label: `MODIS/Terra MOD11A2 v061 land surface temperature, ${YEAR} (NASA LP DAAC via ORNL DAAC subsets)`, url: "https://modis.ornl.gov/", kind: "dataset" },
  mod13: { label: `MODIS/Terra MOD13Q1 v061 NDVI, ${YEAR} (NASA LP DAAC via ORNL DAAC subsets)`, url: "https://modis.ornl.gov/", kind: "dataset" },
  power: { label: "NASA POWER climatology (MERRA-2, CERES)", url: "https://power.larc.nasa.gov/", kind: "dataset" },
  lola: { label: "LRO LOLA gridded elevation: LDEM_64 and LDEM_85S_40M (NASA PDS)", url: `${PDS}/lro/lro-l-lola-3-rdr-v1/`, kind: "dataset" },
  diviner: { label: "LRO Diviner Polar Resource Product v2 (NASA PDS)", url: `${PDS}/lro/urn-nasa-pds-lro_diviner_derived1/`, kind: "dataset" },
  mola: { label: "MGS MOLA MEGDR 128 pixel/degree topography (NASA PDS)", url: `${PDS}/mgs/mgs-m-mola-5-megdr-l3-v1/`, kind: "dataset" },
  grs: { label: "Mars Odyssey GRS water-equivalent hydrogen, 5° smoothed (NASA PDS)", url: `${PDS}/ody/ody-m-grs-5-elements-v1/`, kind: "dataset" },
  tes: { label: "MGS TES night-side thermal inertia, Putzig & Mellon 2007 (NASA PDS)", url: `${PDS}/mgs/mgs-m-tes-5-timap-v1/`, kind: "dataset" },
  mcd: { label: "Mars Climate Database v6.2, climatology scenario (LMD / ESA / CNES)", url: "https://www-mars.lmd.jussieu.fr/mcd_python/", kind: "model" },
  geometry: { label: "Computed from latitude and axial tilt", url: "", kind: "computed" },
  physical: { label: "Physical constraint: no liquid precipitation, no vegetation", url: "", kind: "computed" },
};
for (const [id, label] of Object.entries(REFS)) SOURCES[id] = { label, url: "", kind: "literature" };


/** Earth: Copernicus GLO-90 cloud-optimised GeoTIFFs, one per 1° cell; missing cells are open ocean. */
async function earthTerrain(site) {
  const dLat = HALF / (RADIUS.earth * RAD);
  const dLon = dLat / Math.cos(site.lat * RAD);
  const key = `copdem:${site.lat},${site.lon}`;
  const raw = await cached(key, "f64", async () => {
    const g = gridder();
    for (let la = Math.floor(site.lat - dLat); la <= Math.floor(site.lat + dLat); la++) {
      for (let lo = Math.floor(site.lon - dLon); lo <= Math.floor(site.lon + dLon); lo++) {
        const url = copdemUrl(la, lo);
        const head = await http(url, { method: "HEAD" });
        const west = Math.max(lo, site.lon - dLon), east = Math.min(lo + 1, site.lon + dLon);
        const south = Math.max(la, site.lat - dLat), north = Math.min(la + 1, site.lat + dLat);
        if (head.status === 404) {
          // Open ocean: sea level on a 90 m lattice.
          for (let y = south; y < north; y += 0.0008) for (let x = west; x < east; x += 0.0008)
            g.add((x - site.lon) * RAD * RADIUS.earth * Math.cos(site.lat * RAD), (y - site.lat) * RAD * RADIUS.earth, 0);
          continue;
        }
        const image = await (await fromUrl(url)).getImage();
        const [ox, oy] = image.getOrigin();
        const [rx, ry] = image.getResolution();
        const x0 = Math.max(0, Math.floor((west - ox) / rx)), x1 = Math.min(image.getWidth(), Math.ceil((east - ox) / rx));
        const y0 = Math.max(0, Math.floor((north - oy) / ry)), y1 = Math.min(image.getHeight(), Math.ceil((south - oy) / ry));
        if (x1 <= x0 || y1 <= y0) continue;
        const [data] = await image.readRasters({ window: [x0, y0, x1, y1] });
        const width = x1 - x0;
        for (let i = 0; i < data.length; i++) {
          const lon = ox + (x0 + (i % width) + 0.5) * rx;
          const lat = oy + (y0 + Math.floor(i / width) + 0.5) * ry;
          g.add((lon - site.lon) * RAD * RADIUS.earth * Math.cos(site.lat * RAD), (lat - site.lat) * RAD * RADIUS.earth, data[i]);
        }
      }
    }
    return g.grid().buffer;
  });
  // The sea (exactly 0 m in this DEM) is not terrain a rover could cross:
  // coastal and island sites are measured on their land only.
  const grid = Float64Array.from(new Float64Array(raw.buffer, raw.byteOffset, N * N), (v) => (v === 0 ? NaN : v));
  return terrainMetrics(grid, 0.1);
}

/**
 * Moon and Mars equirectangular grids (LOLA LDEM_64, MOLA MEGDR 128), read
 * with HTTP range requests and sampled bilinearly at the analysis cells;
 * their native pixels (about 470 m) match the cell size.
 */
async function planetTerrain(target, spec) {
  const R = RADIUS[target.body];
  const lon = ((target.lon - spec.west) % 360 + 360) % 360 + spec.west;
  const dLat = (HALF + 2 * CELL) / (R * RAD);
  const row0 = Math.floor((spec.north - (target.lat + dLat)) * spec.ppd);
  const row1 = Math.ceil((spec.north - (target.lat - dLat)) * spec.ppd);
  const rowBytes = spec.width * 2;
  const buffer = await getRange(spec.url, row0 * rowBytes, (row1 + 1) * rowBytes - 1);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const sample = (row, col) => view.getInt16(((row - row0) * spec.width + col) * 2, spec.littleEndian) * spec.scale;
  const z = new Float64Array(N * N);
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const la = target.lat + (HALF - (r + 0.5) * CELL) / (R * RAD);
      const lo = lon + ((c + 0.5) * CELL - HALF) / (R * RAD * Math.cos(target.lat * RAD));
      const y = (spec.north - la) * spec.ppd - 0.5;
      const x = (lo - spec.west) * spec.ppd - 0.5;
      const yi = Math.floor(y), xi = Math.floor(x), fy = y - yi, fx = x - xi;
      z[r * N + c] =
        sample(yi, xi) * (1 - fx) * (1 - fy) + sample(yi, xi + 1) * fx * (1 - fy) +
        sample(yi + 1, xi) * (1 - fx) * fy + sample(yi + 1, xi + 1) * fx * fy;
    }
  }
  return terrainMetrics(z);
}

/** South-pole stereographic position in metres (x toward 90°E, y toward 0°E). */
function polarXY(lat, lon, R = RADIUS.moon) {
  const r = 2 * R * Math.tan((Math.PI / 2 + lat * RAD) / 2);
  return [r * Math.sin(lon * RAD), r * Math.cos(lon * RAD)];
}

/** Lunar south pole: LOLA 40 m polar stereographic DEM, block-averaged to the analysis grid. */
async function lunarPoleTerrain(target) {
  const url = `${PDS}/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_85s_40m.img`;
  const size = 7584, scale = 40, offset = 3791.5;
  const [xs, ys] = polarXY(target.lat, target.lon);
  const row0 = Math.floor(offset - (ys + HALF) / scale), row1 = Math.ceil(offset - (ys - HALF) / scale);
  const buffer = await getRange(url, row0 * size * 2, (row1 + 1) * size * 2 - 1);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const g = gridder();
  const col0 = Math.floor(offset + (xs - HALF) / scale), col1 = Math.ceil(offset + (xs + HALF) / scale);
  for (let row = row0; row <= row1; row++) {
    for (let col = col0; col <= col1; col++) {
      const height = view.getInt16(((row - row0) * size + col) * 2, true) * 0.5;
      g.add((col - offset) * scale - xs, (offset - row) * scale - ys, height);
    }
  }
  return terrainMetrics(g.grid());
}

// ------------------------------------------------------------ Earth climate

async function modisSeries(product, site, km) {
  const base = `https://modis.ornl.gov/rst/api/v1/${product}`;
  const where = `latitude=${site.lat}&longitude=${site.lon}`;
  const listing = await getJson(`${base}/dates?${where}`);
  if (!listing) return null;
  const dates = listing.dates.map((d) => d.modis_date).filter((d) => d.startsWith(`A${YEAR}`));
  const rows = [];
  for (let i = 0; i < dates.length; i += 10) {
    const chunk = dates.slice(i, i + 10);
    const json = await getJson(`${base}/subset?${where}&startDate=${chunk[0]}&endDate=${chunk.at(-1)}&kmAboveBelow=${km}&kmLeftRight=${km}`);
    if (json) rows.push(...json.subset);
  }
  return rows;
}

/** MOD11A2: clear-sky land surface temperature in kelvin, day (about 10:30) and night (about 22:30). */
async function landSurfaceTemperature(site) {
  const rows = await modisSeries("MOD11A2", site, 1);
  if (!rows) return null;
  const series = (band) =>
    rows.filter((r) => r.band === band).map((r) => r.data.filter((v) => v > 7500).map((v) => v * 0.02)).filter((d) => d.length).map(mean);
  const day = series("LST_Day_1km"), night = series("LST_Night_1km");
  if (day.length < 8 || night.length < 8) return null;
  return { tmean: (mean(day) + mean(night)) / 2, tmax: Math.max(...day), tmin: Math.min(...night), composites: day.length + night.length };
}

/**
 * MOD13Q1: growing-season NDVI over a 2 km box, as the 90th percentile of
 * the year's 16-day composites. An annual mean would count months of snow
 * cover as bare ground and understate vegetation at boreal and Arctic sites.
 */
async function vegetation(site) {
  const rows = await modisSeries("MOD13Q1", site, 1);
  if (!rows) return null;
  const composites = rows
    .filter((r) => r.band === "250m_16_days_NDVI")
    .map((r) => r.data.filter((v) => v > -3000).map((v) => v * 0.0001))
    .filter((d) => d.length)
    .map(mean);
  if (composites.length < 6) return null;
  return quantile(composites.sort((a, b) => a - b), 0.9);
}

async function powerClimate(site) {
  const params = "T2M,TS,TS_MAX,TS_MIN,PRECTOTCORR_SUM,WS10M,AOD_55,TQV,PS";
  const json = await getJson(`https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=${params}&community=AG&longitude=${site.lon}&latitude=${site.lat}&format=JSON`);
  const p = json.properties.parameter;
  const ann = (k) => {
    const v = p[k]?.ANN;
    if (v == null || v < -900) throw new Error(`${site.id}: POWER has no ${k}`);
    return v;
  };
  const density = (ann("PS") * 1000) / (287.05 * (ann("T2M") + 273.15));
  return {
    precipitation: ann("PRECTOTCORR_SUM"),
    wind: ann("WS10M"),
    aod: ann("AOD_55"),
    vapour: ann("TQV"),
    pressure: ann("PS") * 1000,
    windPressure: 0.5 * density * ann("WS10M") ** 2,
    // MERRA-2 skin temperature: the fallback where MODIS has no land product.
    skin: { tmean: ann("TS") + 273.15, tmax: ann("TS_MAX") + 273.15, tmin: ann("TS_MIN") + 273.15 },
  };
}

// ------------------------------------------------------------- Moon and Mars

/** Mars Climate Database point queries over a Mars year: 8 seasons x 12 local times. */
async function marsClimate(target) {
  const lon = ((target.lon % 360) + 360) % 360;
  const jobs = [];
  for (let ls = 0; ls < 360; ls += 45) for (let lt = 0; lt < 24; lt += 2) jobs.push({ ls, lt });
  const read = (text, label) => {
    const m = new RegExp(`${label}[^.]*\\.{3,}\\s*([-\\d.eE+]+)`).exec(text);
    if (!m) throw new Error(`MCD: no "${label}" in response`);
    return Number(m[1]);
  };
  const samples = await pool(jobs, 3, async ({ ls, lt }) => {
    const q = `datekeyhtml=1&ls=${ls}&localtime=${lt}&latitude=${target.lat}&longitude=${lon}&altitude=10&zkey=3&isfixedlt=off&dust=1&hrkey=1&averaging=off&dpi=80&islog=off&colorm=jet&minval=&maxval=&proj=cyl&palt=&plon=&plat=&trans=&iswind=off&latpoint=&lonpoint=`;
    const base = "https://www-mars.lmd.jussieu.fr/mcd_python/cgi-bin/mcdcgi.py?";
    const a = (await getText(`${base}${q}&var1=tsurf&var2=ps&var3=wind&var4=dod`)).replace(/<[^>]*>/g, " ");
    const b = (await getText(`${base}${q}&var1=rho&var2=col_h2ovapor&var3=t&var4=tsurf`)).replace(/<[^>]*>/g, " ");
    const wind = read(a, "Horizontal wind speed"), rho = read(b, "Density");
    return {
      t: read(a, "Surface temperature"), ps: read(a, "Surface pressure"), wind, dod: read(a, "dust column visible optical depth"),
      vapour: read(b, "Water vapor column"), q: 0.5 * rho * wind ** 2,
    };
  });
  const col = (k) => samples.map((s) => s[k]);
  return {
    tmean: mean(col("t")), tmax: Math.max(...col("t")), tmin: Math.min(...col("t")),
    pressure: mean(col("ps")), wind: mean(col("wind")), aod: mean(col("dod")), vapour: mean(col("vapour")), windPressure: mean(col("q")),
  };
}

async function marsWaterAndInertia(target) {
  const table = await getText(`${PDS}/ody/ody-m-grs-5-elements-v1/odgm_xxxx/data/smoothed/h2o_sr_5x5.tab`);
  let best = null;
  for (const line of table.split("\n")) {
    const [lat, lon, value] = line.trim().split(/\s+/).map(Number);
    if (!Number.isFinite(value) || value > 9000) continue;
    const d = Math.hypot(lat - target.lat, (((lon - target.lon) % 360) + 540) % 360 - 180);
    if (!best || d < best.d) best = { d, value };
  }
  if (!best || best.d > 4) throw new Error(`${target.id}: no GRS cell nearby`);
  const row = Math.round(1800.5 - target.lat * 20 - 1), col = Math.round(3600.5 + target.lon * 20 - 1);
  const url = `${PDS}/mgs/mgs-m-tes-5-timap-v1/mgst_9001/data/global_ti_night_2007.img`;
  const px = await getRange(url, (row * 7200 + col) * 2, (row * 7200 + col) * 2 + 1);
  return { weh: best.value, inertia: px.readInt16BE(0) };
}

/**
 * Diviner Polar Resource Product: bolometric temperature (annual average
 * and maximum) and modelled ice-stability depth on a 500 m polar grid.
 * Rows are ordered in strips of constant x, 2,400 triangles per strip.
 */
async function lunarPoleThermal(target) {
  const url = `${PDS}/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_prp/dlre_prp_south.tab`;
  const ROW = 210, STRIP = 2400, reach = HALF / 1000;
  const r = RADIUS.moon / 1000 * Math.cos(target.lat * RAD);
  const xs = r * Math.cos(target.lon * RAD), ys = r * Math.sin(target.lon * RAD);
  const first = Math.max(0, Math.floor((299.52 - (xs + reach)) / 0.5) - 2), last = Math.ceil((299.52 - (xs - reach)) / 0.5) + 2;
  const avg = [], max = [];
  let iceStable = 0;
  for (let strip = first; strip <= last; strip++) {
    const text = String(await getRange(url, ROW + strip * STRIP * ROW, ROW + (strip + 1) * STRIP * ROW - 1));
    for (const line of text.split("\n")) {
      const f = line.split(",").map(Number);
      if (f.length < 15) continue;
      const x = (f[0] + f[3] + f[6]) / 3, y = (f[1] + f[4] + f[7]) / 3;
      if (Math.abs(x - xs) > reach || Math.abs(y - ys) > reach || !(f[12] > 0)) continue;
      avg.push(f[12]);
      max.push(f[13]);
      if (f[14] >= 0) iceStable++;
    }
  }
  if (avg.length < 2000) throw new Error(`Diviner PRP: only ${avg.length} cells near ${target.id}`);
  return {
    tmean: median(avg), tmax: Math.max(...max), tmaxMedian: median(max), tmin: Math.min(...avg),
    coldTrap: max.filter((t) => t < 110).length / max.length, iceStable: iceStable / avg.length, cells: avg.length,
  };
}

// -------------------------------------------------------------------- scoring
// The similarity functions live in src/analog/scoring.ts, shared with the grid builder and the browser.

const sunElevation = (lat, body) => sunAt(lat, BODIES[body].obliquity);
/** The plain numbers the shared scoring works on, from a measured site or target. */
const measures = (x) => ({
  ...Object.fromEntries(Object.entries(x.m).map(([k, m]) => [k, m.v])),
  ice: x.ice, tags: x.tags, cave: x.cave, subsurface: x.subsurface,
});

// ----------------------------------------------------------------------- main

const metric = (v, unit, src, digits = 2) => ({ v: +Number(v).toFixed(digits), unit, src });

async function measureSite(site) {
  const [terrain, modisLst, modisNdvi, climate] = await Promise.all([earthTerrain(site), landSurfaceTemperature(site), vegetation(site), powerClimate(site)]);
  const lst = modisLst ?? climate.skin;
  const lstSource = modisLst ? "mod11" : "power";
  // No MODIS vegetation product: only acceptable where the literature documents bare ground.
  if (modisNdvi == null && !site.barren) throw new Error(`${site.id}: no NDVI and no documented bare ground`);
  const ndvi = modisNdvi ?? 0;
  const ndviSource = modisNdvi == null ? site.barren : "mod13";
  log(`  ${site.id}: slope ${terrain.slope.toFixed(2)}°, LST ${lst.tmean.toFixed(0)} K, NDVI ${ndvi.toFixed(2)}, rain ${climate.precipitation.toFixed(0)} mm`);
  return {
    ...site,
    m: {
      slope: metric(terrain.slope, "°", "copdem"), roughness: metric(terrain.roughness, "m", "copdem", 1), relief: metric(terrain.relief, "m", "copdem", 0),
      elevation: metric(terrain.elevation, "m", "copdem", 0),
      tmean: metric(lst.tmean, "K", lstSource, 1), tmax: metric(lst.tmax, "K", lstSource, 1), tmin: metric(lst.tmin, "K", lstSource, 1),
      ndvi: metric(ndvi, "", ndviSource, 3),
      precipitation: metric(climate.precipitation, "mm/yr", "power", 0), vapour: metric(climate.vapour, "kg/m²", "power"),
      wind: metric(climate.wind, "m/s", "power"), aod: metric(climate.aod, "", "power"),
      pressure: metric(climate.pressure, "Pa", "power", 0), windPressure: metric(climate.windPressure, "Pa", "power"),
      sun: metric(sunElevation(site.lat, "earth"), "°", "geometry", 1),
    },
  };
}

async function measureTarget(target) {
  const sun = metric(sunElevation(target.lat, target.body), "°", "geometry", 1);
  const facts = [];
  let m;
  if (target.body === "mars") {
    const tile = target.lon < 0 ? "megt44n180hb" : "megt44n000hb"; // both Mars targets lie in 0–44°N
    const west = target.lon < 0 ? 180 : 0;
    const terrain = await planetTerrain(target, { url: `${PDS}/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/meg128/${tile}.img`, north: 44, west, ppd: 128, width: 11520, littleEndian: false, scale: 1 });
    const climate = await marsClimate(target);
    const extra = await marsWaterAndInertia(target);
    m = {
      slope: metric(terrain.slope, "°", "mola"), roughness: metric(terrain.roughness, "m", "mola", 1), relief: metric(terrain.relief, "m", "mola", 0),
      elevation: metric(terrain.elevation, "m", "mola", 0),
      tmean: metric(climate.tmean, "K", "mcd", 1), tmax: metric(climate.tmax, "K", "mcd", 1), tmin: metric(climate.tmin, "K", "mcd", 1),
      vapour: metric(climate.vapour, "kg/m²", "mcd", 4), wind: metric(climate.wind, "m/s", "mcd"), aod: metric(climate.aod, "", "mcd"),
      pressure: metric(climate.pressure, "Pa", "mcd", 0), windPressure: metric(climate.windPressure, "Pa", "mcd", 3), sun,
    };
    facts.push({ label: "Water-equivalent hydrogen, top metre", ...metric(extra.weh, "wt%", "grs", 1) });
    facts.push({ label: "Thermal inertia", ...metric(extra.inertia, "J m⁻² K⁻¹ s⁻½", "tes", 0) });
  } else {
    const airless = { vapour: metric(0, "kg/m²", "physical"), wind: metric(0, "m/s", "physical"), aod: metric(0, "", "physical"), pressure: metric(0, "Pa", "physical"), windPressure: metric(0, "Pa", "physical") };
    if (target.lat < -85) {
      const terrain = await lunarPoleTerrain(target);
      const thermal = await lunarPoleThermal(target);
      m = {
        slope: metric(terrain.slope, "°", "lola"), roughness: metric(terrain.roughness, "m", "lola", 1), relief: metric(terrain.relief, "m", "lola", 0),
        elevation: metric(terrain.elevation, "m", "lola", 0),
        // Typical ground, not the single hottest sun-facing slope: medians over the window.
        tmean: metric(thermal.tmean, "K", "diviner", 1), tmax: metric(thermal.tmaxMedian, "K", "diviner", 1), tmin: metric(thermal.tmin, "K", "diviner", 1),
        ...airless, sun,
      };
      facts.push({ label: "Ground with yearly maximum below 110 K (cold traps)", ...metric(thermal.coldTrap * 100, "% of window", "diviner", 1) });
      facts.push({ label: "Ground where ice is stable in the top metre or so", ...metric(thermal.iceStable * 100, "% of window", "diviner", 1) });
      facts.push({ label: "Hottest ground in the window (sun-facing slope)", ...metric(thermal.tmax, "K", "diviner", 0) });
      facts.push({ label: "Coldest yearly-average ground in the window", ...metric(thermal.tmin, "K", "diviner", 0) });
    } else {
      const terrain = await planetTerrain(target, { url: `${PDS}/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/cylindrical/img/ldem_64.img`, north: 90, west: 0, ppd: 64, width: 23040, littleEndian: true, scale: 0.5 });
      // The habitable volume is the shadowed pit and any cave behind it (Horvath et al. 2022).
      m = {
        slope: metric(terrain.slope, "°", "lola"), roughness: metric(terrain.roughness, "m", "lola", 1), relief: metric(terrain.relief, "m", "lola", 0),
        elevation: metric(terrain.elevation, "m", "lola", 0),
        tmean: metric(290, "K", "horvath2022", 0), tmax: metric(290, "K", "horvath2022", 0), tmin: metric(290, "K", "horvath2022", 0),
        ...airless, sun,
      };
      facts.push({ label: "Open surface nearby, before dawn", ...metric(95, "K", "williams2017", 0) });
      facts.push({ label: "Open surface nearby, noon (upper value)", ...metric(397, "K", "williams2017", 0) });
    }
  }
  m.precipitation = metric(0, "mm/yr", "physical", 0);
  m.ndvi = metric(0, "", "physical");
  log(`  ${target.id}: slope ${m.slope.v}°, T ${m.tmean.v}–${m.tmax.v} K`);
  return { ...target, m, facts };
}

log("Targets");
const targets = [];
for (const target of TARGETS) targets.push(await measureTarget(target));
log("Earth sites");
const sites = await pool(SITES, 3, measureSite);

const scores = {};
for (const target of targets) {
  scores[target.id] = {};
  for (const s of sites) scores[target.id][s.id] = compare(measures(s), measures(target), TAGS);
}

const used = new Set();
for (const m of JSON.stringify({ targets, sites, BODIES }).matchAll(/"(?:src|ref)":"([^"]+)"/g)) used.add(m[1]);
for (const x of [...targets, ...sites]) x.refs.forEach((r) => used.add(r));

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  window: { cell: CELL, size: N },
  dimensions: DIMENSIONS,
  tags: TAGS,
  bodies: BODIES,
  targets,
  sites,
  scores,
  sources: Object.fromEntries(Object.entries(SOURCES).filter(([id]) => used.has(id))),
}));
log(`Wrote ${path.relative(process.cwd(), OUT)}: ${targets.length} targets, ${sites.length} sites`);