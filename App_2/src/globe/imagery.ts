/**
 * Imagery providers. Every source is a georeferenced, multiresolution tile
 * pyramid (Web Mercator / WGS84) streamed on demand — only tiles for the
 * visible region and zoom level are ever requested.
 */
import {
  createWorldImageryAsync,
  Credit,
  type Ellipsoid,
  GeographicTilingScheme,
  type ImageryProvider,
  IonWorldImageryStyle,
  OpenStreetMapImageryProvider,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider,
} from "cesium";
import type { ImageryId, OverlayId } from "../state/store";
import { type ImageryInfo, imageryInfo } from "./imageryCatalog";
import { PLANETS, type PlanetId } from "./planets";

interface ImageryFactory {
  /** A tiny tile fetched first to check the service is reachable. */
  probeUrl?: string;
  create(ellipsoid: Ellipsoid): Promise<ImageryProvider> | ImageryProvider;
}

/**
 * NASA Moon Trek and Mars Trek mosaics. They are tiled in plain geographic
 * coordinates (two square tiles at level 0, rows counted from the north),
 * not Web Mercator, so they need a geographic tiling scheme on the body's
 * own ellipsoid.
 */
function trek(body: "Moon" | "Mars", layer: string, format: "jpg" | "png", maximumLevel: number, credit: string): ImageryFactory {
  const base = `https://trek.nasa.gov/tiles/${body}/EQ/${layer}/1.0.0/default/default028mm`;
  return {
    probeUrl: `${base}/0/0/0.${format}`,
    create: (ellipsoid) =>
      new UrlTemplateImageryProvider({
        url: `${base}/{z}/{y}/{x}.${format}`,
        tilingScheme: new GeographicTilingScheme({ ellipsoid }),
        maximumLevel,
        credit: new Credit(`${credit} via ${link(`https://trek.nasa.gov/${body.toLowerCase()}/`, `NASA ${body} Trek`)}`, true),
      }),
  };
}

const GIBS = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";

/** Most recent date NASA GIBS is certain to have a complete daily mosaic for. */
function gibsDailyDate(): string {
  return new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
}

const link = (href: string, text: string) => `<a href="${href}" target="_blank" rel="noreferrer">${text}</a>`;

const FACTORIES: Record<ImageryId, ImageryFactory> = {
  ion: {
    create: () => createWorldImageryAsync({ style: IonWorldImageryStyle.AERIAL }),
  },
  esri: {
    probeUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0",
    create: () =>
      new UrlTemplateImageryProvider({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        maximumLevel: 19,
        credit: new Credit(`Imagery © ${link("https://www.esri.com/", "Esri")}, Maxar, Earthstar Geographics, and the GIS User Community`, true),
      }),
  },
  sentinel: {
    probeUrl: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/0/0/0.jpg",
    create: () =>
      new UrlTemplateImageryProvider({
        url: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg",
        maximumLevel: 15,
        credit: new Credit(`${link("https://s2maps.eu", "Sentinel-2 cloudless")} by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2020)`, true),
      }),
  },
  bluemarble: {
    probeUrl: `${GIBS}/BlueMarble_ShadedRelief_Bathymetry/default/2004-08-01/GoogleMapsCompatible_Level8/0/0/0.jpeg`,
    create: () =>
      new UrlTemplateImageryProvider({
        url: `${GIBS}/BlueMarble_ShadedRelief_Bathymetry/default/2004-08-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg`,
        maximumLevel: 8,
        credit: new Credit(`Blue Marble: Next Generation, NASA Earth Observatory via ${link("https://earthdata.nasa.gov/gibs", "NASA GIBS")}`, true),
      }),
  },
  daily: {
    probeUrl: `${GIBS}/VIIRS_NOAA20_CorrectedReflectance_TrueColor/default/${gibsDailyDate()}/GoogleMapsCompatible_Level9/0/0/0.jpg`,
    create: () =>
      new UrlTemplateImageryProvider({
        url: `${GIBS}/VIIRS_NOAA20_CorrectedReflectance_TrueColor/default/${gibsDailyDate()}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
        maximumLevel: 9,
        credit: new Credit(`VIIRS NOAA-20 true colour, ${gibsDailyDate()}, ${link("https://earthdata.nasa.gov/gibs", "NASA EOSDIS GIBS")}`, true),
      }),
  },
  osm: {
    probeUrl: "https://tile.openstreetmap.org/0/0/0.png",
    create: () => new OpenStreetMapImageryProvider({
        url: "https://tile.openstreetmap.org/",
        maximumLevel: 19,
        credit: new Credit(`© ${link("https://www.openstreetmap.org/copyright", "OpenStreetMap")} contributors`, true),
      }),
  },
  "moon-wac": trek("Moon", "LRO_WAC_Mosaic_Global_303ppd_v02", "jpg", 8, "LRO Wide Angle Camera global mosaic, NASA / GSFC / Arizona State University"),
  "moon-lola": trek("Moon", "LRO_LOLA_ClrShade_Global_128ppd_v04", "png", 6, "LRO LOLA colour shaded relief, NASA / GSFC"),
  "mars-viking": trek("Mars", "Mars_Viking_MDIM21_ClrMosaic_global_232m", "jpg", 7, "Viking Orbiter MDIM 2.1 colour mosaic, NASA / JPL / USGS"),
  "mars-mola": trek("Mars", "Mars_MGS_MOLA_ClrShade_merge_global_463m", "jpg", 6, "MGS MOLA colour shaded relief, NASA / JPL / GSFC"),
};

/** Tried in order when the requested source cannot be reached. */
const FALLBACK_ORDER: Record<PlanetId, ImageryId[]> = {
  earth: ["esri", "sentinel", "bluemarble"],
  moon: ["moon-wac", "moon-lola"],
  mars: ["mars-viking", "mars-mola"],
};

function probe(url: string, timeoutMs = 7000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = "";
      resolve(false);
    }, timeoutMs);
    const done = (ok: boolean) => () => {
      clearTimeout(timer);
      resolve(ok);
    };
    img.onload = done(true);
    img.onerror = done(false);
    img.src = url;
  });
}

/**
 * Builds the provider for `id`, falling back through the keyless sources if
 * its service is unreachable or fails to initialise. If nothing responds
 * (for example when offline) a keyless source is still returned so tiles
 * appear as soon as the connection does.
 */
export async function createImagery(
  id: ImageryId,
  planet: PlanetId,
  ellipsoid: Ellipsoid,
): Promise<{ source: ImageryInfo; provider: ImageryProvider; fellBack: boolean }> {
  const requested = imageryInfo(id, planet).id;
  const candidates = [requested, ...FALLBACK_ORDER[planet].filter((f) => f !== requested)];
  for (const candidate of candidates) {
    const factory = FACTORIES[candidate];
    try {
      if (factory.probeUrl && !(await probe(factory.probeUrl))) continue;
      return { source: imageryInfo(candidate, planet), provider: await factory.create(ellipsoid), fellBack: candidate !== requested };
    } catch {
      /* try the next source */
    }
  }
  const last = requested === "ion" ? PLANETS[planet].defaultImagery : requested;
  return { source: imageryInfo(last, planet), provider: await FACTORIES[last].create(ellipsoid), fellBack: last !== requested };
}

/** Place names and administrative boundaries, drawn over the satellite imagery. */
export function createLabelsProvider(): ImageryProvider {
  return new UrlTemplateImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    maximumLevel: 19,
    credit: "Boundaries and places © Esri, HERE, Garmin, © OpenStreetMap contributors",
  });
}

/**
 * City lights, shown only on the night side of the globe. This layer is
 * lights on black; Black Marble (used before) also carries grey-blue land
 * shading, which tinted the night side purple and drew a pale band along
 * the terminator where it blends with the daylit imagery.
 */
export function createNightLightsProvider(): ImageryProvider {
  return new UrlTemplateImageryProvider({
    url: `${GIBS}/VIIRS_CityLights_2012/default/2012-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg`,
    maximumLevel: 8,
    credit: "VIIRS city lights 2012, NASA Earth Observatory and NOAA NGDC via NASA GIBS",
  });
}

/**
 * Web Mercator imagery stops at 85° latitude. Blue Marble, requested from
 * NASA GIBS as geographic (EPSG:4326) WMS tiles, is used only over the two
 * polar caps to fill the gap.
 */
export function createPolarCapProvider(): ImageryProvider {
  return new WebMapServiceImageryProvider({
    url: "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi",
    layers: "BlueMarble_ShadedRelief_Bathymetry",
    parameters: { format: "image/jpeg", transparent: false },
    maximumLevel: 6,
    credit: "Polar imagery: Blue Marble, NASA Earth Observatory via NASA GIBS",
  });
}

/**
 * NASA GIBS science layers. Layer names, tile matrix sets and dates were
 * checked against the GIBS WMTS capabilities document (EPSG:3857, "best").
 * Monthly products are pinned to a month known to be complete.
 */
const OVERLAYS: Record<OverlayId, { layer: string; date: string; level: number; credit: string }> = {
  lst: { layer: "MODIS_Terra_L3_Land_Surface_Temp_Monthly_Day", date: "2026-07-01", level: 6, credit: "MODIS/Terra land surface temperature (monthly, day)" },
  dust: { layer: "MERRA2_Dust_Surface_Mass_Concentration_Monthly", date: "2026-07-01", level: 6, credit: "MERRA-2 dust surface mass concentration (monthly)" },
  snow: { layer: "MODIS_Terra_L3_Snow_Cover_Monthly_Average_Pct", date: "2026-01-01", level: 6, credit: "MODIS/Terra snow cover (monthly average)" },
  ndvi: { layer: "MODIS_Terra_L3_NDVI_Monthly", date: "2026-07-01", level: 7, credit: "MODIS/Terra NDVI (monthly)" },
};

export function createOverlayProvider(id: OverlayId): ImageryProvider {
  const { layer, date, level, credit } = OVERLAYS[id];
  return new UrlTemplateImageryProvider({
    url: `${GIBS}/${layer}/default/${date}/GoogleMapsCompatible_Level${level}/{z}/{y}/{x}.png`,
    maximumLevel: level,
    credit: new Credit(`${credit}, ${link("https://earthdata.nasa.gov/gibs", "NASA EOSDIS GIBS")}`, true),
  });
}
