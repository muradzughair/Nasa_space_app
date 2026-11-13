/**
 * Owns the CesiumJS viewer and everything that happens inside the canvas:
 * imagery and terrain streaming, lighting, camera flights, click-to-zoom,
 * the selection marker and adaptive render quality. One controller shows one
 * world (Earth, the Moon or Mars, see planets.ts); switching worlds builds a
 * new controller. React never touches
 * Cesium directly — components call the public methods here and read
 * results from the store.
 */
import "../cesiumBase";
// Only the canvas widget's own styles: none of Viewer's UI widgets are used.
import "cesium/Build/Cesium/Widgets/CesiumWidget/CesiumWidget.css";
import {
  Cartesian2,
  Cartesian3,
  Cartographic,
  CesiumWidget,
  Color,
  EasingFunction,
  Ellipsoid,
  EllipsoidalOccluder,
  type Entity,
  HeightReference,
  ImageryLayer,
  Ion,
  JulianDate,
  Math as CesiumMath,
  PerspectiveFrustum,
  Rectangle,
  RequestErrorEvent,
  RequestScheduler,
  SceneTransforms,
  SingleTileImageryProvider,
  TextureMagnificationFilter,
  TextureMinificationFilter,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  WebMercatorTilingScheme,
} from "cesium";
import { ION_TOKEN } from "../config";
import { clamp, formatLat, formatLon, haversine } from "../geo/coords";
import { geocodingEnabled, reverseGeocode, zoomForHeight } from "../geo/geocoder";
import { loadGeodata, locate, type LocalHit, nearestPlace } from "../geo/geodata";
import { type ImageryId, imageryKey, type OverlayId, type Selection, type SelectionKind, showToast, store, updateAtlas, updateSettings } from "../state/store";
import { createImagery, createLabelsProvider, createNightLightsProvider, createOverlayProvider, createPolarCapProvider } from "./imagery";
import { type PlanetId, type PlanetInfo, PLANETS } from "./planets";
import { createTerrain, flatTerrain } from "./terrain";
import { runWalkthrough, type Walkthrough, type WalkthroughOptions } from "./walkthrough";

const EARTH_RADIUS = 6_378_137;
const TOP_DOWN = { heading: 0, pitch: -CesiumMath.PI_OVER_TWO, roll: 0 };

/** Camera distances below are for Earth; other worlds scale them by their radius. */
const MAX_CAMERA_HEIGHT = 6e7;
/** Stands in for the Natural Earth lookup on worlds that have no countries or seas. */
const NO_HIT: LocalHit = { kind: "none", name: "", detail: "", span: 0 };

export interface VerifyOverlay {
  /** Bounds of a grid cell, in degrees. */
  cell?: { south: number; north: number; west: number; east: number };
  route?: { lat: number; lon: number }[];
  points?: { lat: number; lon: number; kind: "site" | "waypoint" | "pick" }[];
}

export interface Pin {
  lat: number;
  lon: number;
  active: boolean;
}
/**
 * Camera heights between which day/night shading fades away, so the surface
 * is always fully lit and readable once you are zoomed in.
 */
const LIGHTING_FADE_OUT = 2.5e6;
const LIGHTING_FADE_IN = 9e6;

/**
 * Render-quality ladder, best first. The controller moves along it to hold a
 * smooth frame rate: `scale` multiplies the render resolution, `detail` is
 * added to the terrain screen-space error (higher means coarser tiles).
 */
const QUALITY_LEVELS = [
  { msaa: 4, scale: 1, detail: 0 },
  { msaa: 1, scale: 1, detail: 0 },
  { msaa: 1, scale: 0.85, detail: 0.4 },
  { msaa: 1, scale: 0.72, detail: 0.8 },
  { msaa: 1, scale: 0.6, detail: 1.2 },
  { msaa: 1, scale: 0.5, detail: 1.6 },
] as const;
/**
 * Frames drawn while more tiles than this are queued are not used to judge
 * GPU speed: steady panning keeps a handful queued, a flight or jump dozens.
 */
const LOADING_BURST = 12;
/** v2: levels stored by earlier versions were measured against much costlier terrain. */
const QUALITY_KEY = "earth.quality.v2";
/** GPUs that should start one step down rather than discover it the slow way. */
const MODEST_GPU = /Intel(?!.*Arc)|SwiftShader|llvmpipe|Basic Render|Mali|Adreno|PowerVR/i;
/** Auto-rotation only makes sense from orbit. */
const AUTO_ROTATE_MIN_HEIGHT = 6e6;
const AUTO_ROTATE_SPEED = 0.022; // rad/s, one revolution in about five minutes

export interface HudSample {
  lat: number;
  lon: number;
  altitude: number;
  /** True when lat/lon is the point under the cursor rather than the view centre. */
  cursor: boolean;
}

export interface SelectOptions {
  /** Terrain height at the point, if already known from a pick. */
  elevation?: number | null;
  /** Ground extent to frame, in metres. When omitted the zoom is adaptive. */
  span?: number;
  /** Name already known (e.g. from a search result). */
  preset?: { title: string; subtitle: string; kind: SelectionKind };
}

export class GlobeController {
  /**
   * CesiumWidget rather than Viewer: Viewer only adds UI widgets (timeline,
   * animation, base-layer picker, geocoder...) that this app turns off, yet
   * bundles them and their stylesheet. Entities, the clock and picking all
   * live on CesiumWidget.
   */
  readonly viewer: CesiumWidget;

  private readonly handler: ScreenSpaceEventHandler;
  private readonly cleanup: (() => void)[] = [];
  private readonly hudListeners = new Set<(s: HudSample) => void>();
  readonly planet: PlanetInfo;
  private readonly ellipsoid: Ellipsoid;
  /** This world's radius relative to Earth's, for scaling camera distances. */
  private readonly scale: number;
  private readonly occluder: EllipsoidalOccluder;
  private readonly scratchWindow = new Cartesian2();

  /** Layers that sit beneath the base imagery (the polar caps). */
  private underlayCount = 0;
  private baseLayer: ImageryLayer | null = null;
  private nightLayer: ImageryLayer | null = null;
  private labelLayer: ImageryLayer | null = null;
  private overlayLayer: ImageryLayer | null = null;
  private heatmapLayer: ImageryLayer | null = null;
  private clickHandler: ((lat: number, lon: number) => void) | null = null;
  private verifyEntities: Entity[] = [];
  private walkthrough: Walkthrough | null = null;
  private pins: Entity[] = [];
  private imageryRequest = 0;
  private terrainRequest = 0;
  private hasElevation = false;
  /** Terrain data ends here (85.05° for Web Mercator sources); beyond it there is no elevation to report. */
  private elevationMaxLatitude = 90;

  private flightId = 0;
  private flying = false;
  private pendingZoomHeight: number | null = null;
  private lastTick = performance.now();

  private selectionId = 0;
  private markerPosition: Cartesian3 | null = null;
  private outline: Entity[] = [];
  private polarCaps: Entity[] = [];
  private reverseAbort: AbortController | null = null;

  /** Last pointer position over the globe, in canvas pixels. */
  private cursor: Cartesian2 | null = null;
  private readonly scratchCursor = new Cartographic();
  private lastHud = 0;

  private readonly maxResolutionScale: number;
  private readonly baseScreenSpaceError: number;
  private lightingEnabled = false;
  private atmosphereEnabled = true;
  private qualityLevel = 0;
  private lastFrame = 0;
  private frameTimes: number[] = [];
  private frameTime = 0;
  private slowWindows = 0;
  /** Tiles waiting to load, as last reported by the globe. */
  private queuedTiles = 0;
  /**
   * No stepping up while the first tiles stream in: a half-loaded globe draws
   * far faster than a loaded one and would mislead the measurement.
   */
  private stepUpAfter = performance.now() + 15_000;
  private stepUpDelay = 20_000;

  private destroyed = false;

  constructor(
    container: HTMLElement,
    creditContainer: HTMLElement,
    private readonly marker: HTMLElement,
    planetId: PlanetId = "earth",
  ) {
    const planet = (this.planet = PLANETS[planetId]);
    const earth = planet.earthServices;
    this.ellipsoid =
      planetId === "moon" ? Ellipsoid.MOON : planetId === "mars" ? new Ellipsoid(planet.radius, planet.radius, planet.polarRadius) : Ellipsoid.WGS84;
    this.scale = planet.radius / EARTH_RADIUS;
    this.occluder = new EllipsoidalOccluder(this.ellipsoid);
    // Everything Cesium builds from here on (globe, camera, terrain, sky)
    // takes its shape from the default ellipsoid.
    Ellipsoid.default = this.ellipsoid;
    // The marker element outlives the globe of the previous world.
    marker.style.display = "none";

    if (ION_TOKEN) Ion.defaultAccessToken = ION_TOKEN;
    // The tile hosts speak HTTP/2, so more parallel requests than Cesium's
    // conservative default of 6 fills the view noticeably faster.
    RequestScheduler.maximumRequestsPerServer = 12;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    // Cesium's resolutionScale multiplies the device pixel ratio, so express
    // the cap (2x on desktop, 1.5x on touch devices) relative to it.
    const pixelRatio = window.devicePixelRatio || 1;
    this.maxResolutionScale = Math.min(pixelRatio, coarsePointer ? 1.5 : 2) / pixelRatio;
    this.baseScreenSpaceError = coarsePointer ? 2.5 : 1.6;

    const viewer = (this.viewer = new CesiumWidget(container, {
      baseLayer: false,
      scene3DOnly: true,
      creditContainer,
      msaaSamples: coarsePointer ? 2 : 4,
      // Only redraw when something changed: idle views cost no GPU time.
      requestRenderMode: true,
      maximumRenderTimeChange: Number.POSITIVE_INFINITY,
      useBrowserRecommendedResolution: false,
      showRenderLoopErrors: false,
      contextOptions: { webgl: { powerPreference: "high-performance" } },
    }));

    const { scene, camera } = viewer;
    const globe = scene.globe;

    // Real sun position for the current moment; refreshed once a minute.
    viewer.clock.shouldAnimate = false;
    viewer.clock.currentTime = JulianDate.now();
    const clockTimer = setInterval(() => {
      viewer.clock.currentTime = JulianDate.now();
      scene.requestRender();
    }, 60_000);
    this.cleanup.push(() => clearInterval(clockTimer));

    globe.baseColor = Color.fromCssColorString(planet.baseColor);
    globe.maximumScreenSpaceError = this.baseScreenSpaceError;
    // Terrain tiles are small (65x65 samples, see terrain.ts), so a typical
    // view shows 100-200 of them; the cache holds a view and a half or so.
    globe.tileCacheSize = coarsePointer ? 200 : 400;
    globe.preloadAncestors = true;
    // Cesium places the sun and moon for an observer on Earth, so the other
    // worlds are shown evenly lit rather than with a made-up terminator.
    globe.dynamicAtmosphereLighting = earth;
    globe.dynamicAtmosphereLightingFromSun = earth;
    if (scene.moon) scene.moon.show = earth;
    if (scene.sun) scene.sun.show = earth;
    // Cesium measures these fade distances from the planet's centre.
    globe.lightingFadeOutDistance = planet.radius + LIGHTING_FADE_OUT;
    globe.lightingFadeInDistance = planet.radius + LIGHTING_FADE_IN;
    if (planet.atmosphere === "dusty" && scene.skyAtmosphere) {
      // Mars: a thin shell that scatters red more than blue (suspended dust),
      // the reverse of Earth's Rayleigh sky.
      scene.skyAtmosphere.atmosphereRayleighCoefficient = new Cartesian3(19.9e-6, 13.6e-6, 5.8e-6);
      scene.skyAtmosphere.atmosphereMieCoefficient = new Cartesian3(6e-6, 6e-6, 6e-6);
      scene.skyAtmosphere.atmosphereLightIntensity = 14;
    }
    // Pushing the night fade out of reach keeps the ground atmosphere on its
    // per-vertex path at every height (several times cheaper than per-pixel
    // scattering) and stops it blacking out the night side, so city lights show.
    globe.nightFadeOutDistance = 1e9;
    globe.nightFadeInDistance = 2e9;

    // Without HDR, Cesium runs the imagery through an exposure curve whenever
    // the ground atmosphere is on, which doubles dark tones and washes oceans
    // and deserts out to pastel. The HDR path keeps the imagery's own colours
    // under a neutral tone map (and also quietens the faint-star noise).
    // Measured cost on an Intel UHD: about 15-20% of frame time.
    scene.highDynamicRange = scene.highDynamicRangeSupported;

    this.setQuality(this.initialQuality());
    scene.backgroundColor = Color.BLACK;

    // If the GPU context is lost or a frame fails, say so instead of freezing.
    const onRenderFailure = () =>
      store.set({ fatal: "The 3D view stopped because the graphics context was lost. Reload to continue." });
    this.cleanup.push(scene.renderError.addEventListener(onRenderFailure));
    scene.canvas.addEventListener("webglcontextlost", onRenderFailure);
    this.cleanup.push(() => scene.canvas.removeEventListener("webglcontextlost", onRenderFailure));

    const controller = scene.screenSpaceCameraController;
    controller.minimumZoomDistance = 80;
    controller.maximumZoomDistance = MAX_CAMERA_HEIGHT * this.scale;

    // The default double-click "track entity" and click-select behaviours are not used.
    viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);

    // Open on the sunlit side of the Earth, or above the place we were sent to.
    const now = new Date();
    const subsolarLon = (12 - (now.getUTCHours() + now.getUTCMinutes() / 60)) * 15;
    const arrival = store.get().arrival;
    const openLon = arrival ? arrival.lon : earth ? ((subsolarLon - 18 + 540) % 360) - 180 : 20;
    camera.setView({
      destination: Cartesian3.fromDegrees(openLon, arrival ? clamp(arrival.lat, -50, 50) : 16, this.homeHeight()),
      orientation: TOP_DOWN,
    });

    // Cesium's LEFT_CLICK only fires when the pointer barely moved between
    // press and release, so drags never count as clicks (mouse and touch).
    this.handler = new ScreenSpaceEventHandler(scene.canvas);
    this.handler.setInputAction((e: { position: Cartesian2 }) => this.onClick(e.position), ScreenSpaceEventType.LEFT_CLICK);
    this.handler.setInputAction((e: { endPosition: Cartesian2 }) => this.onPointerMove(e.endPosition), ScreenSpaceEventType.MOUSE_MOVE);

    const canvas = scene.canvas;
    const onInput = () => this.onUserInput();
    const onLeave = () => this.clearCursor();
    const onUp = (e: PointerEvent) => e.pointerType !== "mouse" && this.clearCursor();
    canvas.addEventListener("pointerdown", onInput);
    canvas.addEventListener("wheel", onInput, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerup", onUp);
    this.cleanup.push(() => {
      canvas.removeEventListener("pointerdown", onInput);
      canvas.removeEventListener("wheel", onInput);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerup", onUp);
    });

    this.cleanup.push(viewer.clock.onTick.addEventListener(() => this.onTick()));
    this.cleanup.push(scene.postRender.addEventListener(() => this.onPostRender()));

    let ready = false;
    const markReady = () => {
      if (ready || this.destroyed) return;
      ready = true;
      store.set({ ready: true });
    };
    const readyTimer = setTimeout(markReady, 9000);
    this.cleanup.push(() => clearTimeout(readyTimer));
    let loadingFlag = false;
    this.cleanup.push(
      globe.tileLoadProgressEvent.addEventListener((queued: number) => {
        this.queuedTiles = queued;
        const loading = queued > 0;
        if (!loading && this.baseLayer) markReady();
        if (loading !== loadingFlag) {
          loadingFlag = loading;
          store.set({ tilesLoading: loading });
        }
      }),
    );

    const onOffline = () => showToast("You are offline. Showing imagery already loaded.", 8000);
    const onOnline = () => {
      showToast("Back online.", 2500);
      scene.requestRender();
    };
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    this.cleanup.push(() => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    });

    // Cesium's Esri terrain provider leaves some failed tile-availability
    // requests unhandled when the network drops. They are harmless (the tile
    // is simply retried later), so keep them out of the console.
    const onRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof RequestErrorEvent) event.preventDefault();
    };
    window.addEventListener("unhandledrejection", onRejection);
    this.cleanup.push(() => window.removeEventListener("unhandledrejection", onRejection));

    // Fill the polar caps that Web Mercator imagery cannot reach.
    for (const [south, north] of earth
      ? [
          [84.8, 90],
          [-90, -84.8],
        ]
      : []) {
      const provider = createPolarCapProvider();
      provider.errorEvent.addEventListener(() => undefined);
      viewer.imageryLayers.add(new ImageryLayer(provider, { rectangle: Rectangle.fromDegrees(-180, south, 180, north) }), 0);
      this.underlayCount++;
    }

    const settings = store.get().settings;
    void this.setImagery(settings[imageryKey(planetId)]);
    void this.setTerrain(earth && settings.terrain);
    this.setAtmosphere(settings.atmosphere);
    if (earth) {
      this.setLabels(settings.labels);
      this.setLighting(settings.lighting);
      this.setOverlay(store.get().overlay);
      void loadGeodata();
    }

    if (arrival) {
      store.set({ arrival: null });
      const timer = setTimeout(() => this.flyToPlace(arrival.lat, arrival.lon, arrival.span, arrival.title, arrival.subtitle), 900);
      this.cleanup.push(() => clearTimeout(timer));
    }
  }

  // ---------------------------------------------------------------- layers

  async setImagery(id: ImageryId): Promise<void> {
    const request = ++this.imageryRequest;
    const { imageryLayers } = this.viewer;
    try {
      const { source, provider, fellBack } = await createImagery(id, this.planet.id, this.ellipsoid);
      if (this.destroyed || request !== this.imageryRequest) return;
      // Missing or failed tiles keep showing their lower-resolution parent;
      // listening here stops Cesium logging every one of them.
      provider.errorEvent.addEventListener(() => undefined);
      const layer = new ImageryLayer(provider);
      imageryLayers.add(layer, this.underlayCount);
      if (this.baseLayer) imageryLayers.remove(this.baseLayer, true);
      this.baseLayer = layer;
      store.set({ activeImagery: source.id });
      if (fellBack) showToast(`That imagery source is unreachable. Showing ${source.label} instead.`);
    } catch {
      if (!this.destroyed && request === this.imageryRequest) {
        showToast("Satellite imagery could not be loaded. Check your connection.", 8000);
      }
    }
    this.viewer.scene.requestRender();
  }

  async setTerrain(enabled: boolean): Promise<void> {
    const request = ++this.terrainRequest;
    const choice = enabled ? await createTerrain() : flatTerrain();
    if (this.destroyed || request !== this.terrainRequest) return;
    this.viewer.terrainProvider = choice.provider;
    this.hasElevation = choice.hasElevation;
    const mercator = choice.provider.tilingScheme instanceof WebMercatorTilingScheme;
    this.elevationMaxLatitude = mercator ? CesiumMath.toDegrees(choice.provider.tilingScheme.rectangle.north) : 90;
    this.setPolarCaps(mercator);
    store.set({ terrainSource: choice.label });
    if (enabled && !choice.hasElevation && this.planet.earthServices) showToast("Terrain elevation is unavailable. Showing a smooth globe.");
    this.viewer.scene.requestRender();
  }

  /**
   * Web Mercator terrain (Esri's elevation service) has no tiles beyond 85°
   * latitude, which would leave a hole in the globe at each pole. Two simple
   * surfaces close it: Arctic Ocean blue in the north, ice in the south at
   * the height of the Antarctic plateau.
   */
  private setPolarCaps(needed: boolean): void {
    if (needed && !this.polarCaps.length) {
      const cap = (latitude: number, height: number, color: string) =>
        this.viewer.entities.add({
          position: Cartesian3.fromDegrees(0, latitude),
          ellipse: {
            semiMajorAxis: 560_000,
            semiMinorAxis: 560_000,
            height,
            material: Color.fromCssColorString(color),
          },
        });
      this.polarCaps = [cap(90, 0, "#174258"), cap(-90, 2800, "#eef2f6")];
    }
    for (const entity of this.polarCaps) entity.show = needed;
  }

  setLabels(enabled: boolean): void {
    const { imageryLayers } = this.viewer;
    if (enabled && !this.labelLayer) {
      const provider = createLabelsProvider();
      provider.errorEvent.addEventListener(() => undefined);
      this.labelLayer = imageryLayers.addImageryProvider(provider);
      this.updateNightLights(); // sets its night-side opacity
    }
    if (this.labelLayer) this.labelLayer.show = enabled;
    this.viewer.scene.requestRender();
  }

  /** Drapes one NASA GIBS science layer over Earth, between the imagery and the labels. */
  setOverlay(id: OverlayId | null): void {
    const { imageryLayers } = this.viewer;
    if (this.overlayLayer) {
      imageryLayers.remove(this.overlayLayer, true);
      this.overlayLayer = null;
    }
    if (id && this.planet.earthServices) {
      const provider = createOverlayProvider(id);
      provider.errorEvent.addEventListener(() => undefined);
      this.overlayLayer = new ImageryLayer(provider, { alpha: 0.72 });
      imageryLayers.add(this.overlayLayer, this.labelLayer ? imageryLayers.indexOf(this.labelLayer) : imageryLayers.length);
    }
    this.viewer.scene.requestRender();
  }

  /**
   * Drapes a whole-Earth picture (plain latitude/longitude, north at the
   * top) over the globe: the similarity heatmap. One texture, so it costs a
   * single extra imagery layer however the camera moves. Null removes it.
   */
  setHeatmap(image: HTMLCanvasElement | null, alpha = 0.8): void {
    const { imageryLayers } = this.viewer;
    const previous = this.heatmapLayer;
    let next: ImageryLayer | null = null;
    if (image && this.planet.earthServices) {
      // Nearest-neighbour both ways: one pixel is one grid cell and must look like one, with no blending into the sea.
      next = new ImageryLayer(new CanvasImageryProvider(image), {
        alpha,
        magnificationFilter: TextureMagnificationFilter.NEAREST,
        minificationFilter: TextureMinificationFilter.NEAREST,
      });
      imageryLayers.add(next, this.labelLayer ? imageryLayers.indexOf(this.labelLayer) : imageryLayers.length);
    }
    if (previous) imageryLayers.remove(previous, true);
    this.heatmapLayer = next;
    this.viewer.scene.requestRender();
  }

  setHeatmapOpacity(alpha: number): void {
    if (this.heatmapLayer) this.heatmapLayer.alpha = alpha;
    this.viewer.scene.requestRender();
  }

  /**
   * Sends the next clicks on the globe to `handler` instead of selecting a
   * place: used to pick a map point or a route waypoint. Null restores
   * ordinary selection.
   */
  setClickHandler(handler: ((lat: number, lon: number) => void) | null): void {
    this.clickHandler = handler;
    this.viewer.scene.canvas.style.cursor = handler ? "crosshair" : "";
  }

  /**
   * Lines and dots drawn for the verification workflow: the outline of a
   * grid cell, a route, and marked points. Replaces whatever was drawn
   * before; an empty object clears it.
   */
  setVerifyOverlay(overlay: VerifyOverlay): void {
    const { entities } = this.viewer;
    for (const entity of this.verifyEntities) entities.remove(entity);
    this.verifyEntities = [];
    const line = (points: { lat: number; lon: number }[], color: string, width: number) => {
      if (points.length < 2) return;
      this.verifyEntities.push(
        entities.add({
          polyline: {
            positions: Cartesian3.fromDegreesArray(points.flatMap((p) => [p.lon, p.lat])),
            clampToGround: true,
            width,
            material: Color.fromCssColorString(color),
          },
        }),
      );
    };
    if (overlay.cell) {
      const { south, north, west, east } = overlay.cell;
      line(
        [
          { lat: south, lon: west },
          { lat: south, lon: east },
          { lat: north, lon: east },
          { lat: north, lon: west },
          { lat: south, lon: west },
        ],
        "rgba(255,255,255,0.85)",
        1.5,
      );
    }
    if (overlay.route) line(overlay.route, "#5fe3ff", 3);
    for (const point of overlay.points ?? []) {
      this.verifyEntities.push(
        entities.add({
          position: Cartesian3.fromDegrees(point.lon, point.lat),
          point: {
            pixelSize: point.kind === "site" ? 11 : 8,
            color: Color.fromCssColorString(point.kind === "site" ? "#ffd166" : point.kind === "pick" ? "#ff7ab6" : "#5fe3ff"),
            outlineColor: Color.BLACK.withAlpha(0.8),
            outlineWidth: 2,
            heightReference: HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        }),
      );
    }
    this.viewer.scene.requestRender();
  }

  /**
   * Moves the camera along a route close to the ground, optionally recording
   * the canvas. A terrain preview of satellite imagery on an elevation model:
   * not a rover simulation. One at a time; starting another stops the first.
   */
  playWalkthrough(route: { lat: number; lon: number }[], options: WalkthroughOptions): Walkthrough {
    this.walkthrough?.stop();
    this.onUserInput();
    // The preview shows the place as imaged. Model colours (the heatmap) and science overlays stay out of it.
    const hidden = [this.heatmapLayer, this.overlayLayer].filter((layer): layer is ImageryLayer => !!layer && layer.show);
    for (const layer of hidden) layer.show = false;
    const run = runWalkthrough(this.viewer, route, options);
    this.walkthrough = run;
    void run.finished.then(() => {
      if (this.destroyed) return;
      for (const layer of hidden) if (!layer.isDestroyed()) layer.show = true;
      if (this.walkthrough === run) this.walkthrough = null;
      this.viewer.scene.requestRender();
    });
    return run;
  }

  /** Small dots for the analog sites (on Earth) or the targets (on the Moon and Mars). */
  setPins(pins: Pin[]): void {
    const { entities } = this.viewer;
    for (const entity of this.pins) entities.remove(entity);
    this.pins = pins.map((pin) =>
      entities.add({
        position: Cartesian3.fromDegrees(pin.lon, pin.lat),
        point: {
          pixelSize: pin.active ? 9 : 6,
          color: Color.fromCssColorString(pin.active ? "#8fb8ff" : "#ffffff").withAlpha(pin.active ? 1 : 0.75),
          outlineColor: Color.BLACK.withAlpha(0.6),
          outlineWidth: 1,
        },
      }),
    );
    this.viewer.scene.requestRender();
  }

  setLighting(enabled: boolean): void {
    const { scene, imageryLayers } = this.viewer;
    scene.globe.enableLighting = enabled;
    this.lightingEnabled = enabled;
    if (enabled && !this.nightLayer) {
      // Lazily created: city lights that only show on the night side.
      const provider = createNightLightsProvider();
      provider.errorEvent.addEventListener(() => undefined);
      this.nightLayer = new ImageryLayer(provider, { dayAlpha: 0, nightAlpha: 1, brightness: 1.6 });
      imageryLayers.add(this.nightLayer, this.underlayCount + (this.baseLayer ? 1 : 0));
    }
    this.updateNightLights();
    scene.requestRender();
  }

  setAtmosphere(enabled: boolean): void {
    const { scene } = this.viewer;
    const kind = this.planet.atmosphere;
    // Ground haze and fog belong to Earth; Mars keeps only its thin limb glow.
    this.atmosphereEnabled = enabled && kind === "earth";
    if (scene.skyAtmosphere) scene.skyAtmosphere.show = enabled && kind !== "none";
    scene.fog.enabled = this.atmosphereEnabled;
    this.updateGroundAtmosphere();
    scene.requestRender();
  }

  /**
   * Cesium blends the ground atmosphere in by camera distance, over the same
   * range as the day/night shading: below LIGHTING_FADE_OUT it contributes
   * nothing to the picture, yet it is still evaluated for every vertex and
   * pixel. Switching it off there is invisible and was worth about 40% more
   * frame rate on regional views with an integrated GPU.
   */
  private updateGroundAtmosphere(): void {
    const globe = this.viewer.scene.globe;
    const height = this.viewer.camera.positionCartographic.height;
    // A margin below the fade start covers the Earth's flattening (Cesium
    // measures from the centre); the hysteresis avoids flipping every frame.
    const threshold = LIGHTING_FADE_OUT - (globe.showGroundAtmosphere ? 80_000 : 50_000);
    const show = this.atmosphereEnabled && height > threshold;
    if (globe.showGroundAtmosphere !== show) globe.showGroundAtmosphere = show;
  }

  // ---------------------------------------------------------------- camera

  /**
   * Camera height from which the whole globe fits the viewport: about 80% of
   * the short side in landscape (leaving room for the bars above and below)
   * and 88% of the width in portrait, where the short side is the width.
   */
  private homeHeight(): number {
    const { canvas, camera } = this.viewer.scene;
    const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1) || 1;
    const fov = camera.frustum instanceof PerspectiveFrustum ? (camera.frustum.fov ?? Math.PI / 3) : Math.PI / 3;
    // Cesium applies the field of view to the larger viewport dimension.
    const halfAngle = Math.atan(Math.tan(fov / 2) * Math.min(aspect, 1 / aspect));
    const fill = aspect < 1 ? 0.88 : 0.8;
    const radius = this.planet.radius;
    return clamp(radius / Math.sin(halfAngle * fill) - radius, 1.0e7 * this.scale, MAX_CAMERA_HEIGHT * 0.9 * this.scale);
  }

  private fly(
    destination: Cartesian3,
    duration: number,
    options: { orientation?: typeof TOP_DOWN; maximumHeight?: number; easing?: EasingFunction.Callback; done?: () => void } = {},
  ): void {
    const id = ++this.flightId;
    this.flying = true;
    const finish = (completed: boolean) => () => {
      if (id !== this.flightId) return;
      this.flying = false;
      this.pendingZoomHeight = null;
      if (completed) options.done?.();
    };
    this.viewer.camera.flyTo({
      destination,
      orientation: options.orientation,
      duration,
      maximumHeight: options.maximumHeight,
      easingFunction: options.easing,
      complete: finish(true),
      cancel: finish(false),
    });
  }

  /** Any direct input takes over from an animation in progress. */
  private onUserInput(): void {
    if (this.flying) {
      this.flightId++;
      this.flying = false;
      this.pendingZoomHeight = null;
      this.viewer.camera.cancelFlight();
    }
    if (store.get().settings.autoRotate) updateSettings({ autoRotate: false });
  }

  private groundHeight(position: Cartographic): number {
    return Math.max(this.viewer.scene.globe.getHeight(position) ?? 0, 0);
  }

  /** Zoom buttons: scale the camera height, keeping position and orientation. */
  zoomBy(factor: number): void {
    const { camera } = this.viewer;
    if (store.get().settings.autoRotate) updateSettings({ autoRotate: false });
    const position = camera.positionCartographic;
    const ground = this.groundHeight(position);
    const current = this.pendingZoomHeight ?? position.height;
    const target = clamp((current - ground) * factor + ground, ground + this.planet.minViewHeight, MAX_CAMERA_HEIGHT * 0.75 * this.scale);
    if (Math.abs(target - position.height) < 1) return;
    const orientation = { heading: camera.heading, pitch: camera.pitch, roll: camera.roll };
    this.fly(Cartesian3.fromRadians(position.longitude, position.latitude, target), 0.75, {
      orientation,
      maximumHeight: Math.max(target, position.height),
      easing: EasingFunction.CUBIC_OUT,
    });
    this.pendingZoomHeight = target;
  }

  /** Back to the full-Earth view, staying over the current longitude. */
  reset(): void {
    const { camera } = this.viewer;
    const position = camera.positionCartographic;
    const height = this.homeHeight();
    this.clearSelection();
    const ratio = Math.abs(Math.log(Math.max(position.height, 1) / height));
    this.fly(
      Cartesian3.fromRadians(position.longitude, clamp(position.latitude, -0.45, 0.45), height),
      clamp(1.2 + ratio * 0.3, 1.4, 3.6),
      { orientation: TOP_DOWN, done: () => updateSettings({ autoRotate: true }) },
    );
  }

  // ------------------------------------------------------------- selection

  private onClick(windowPosition: Cartesian2): void {
    const { scene, camera } = this.viewer;
    const ray = camera.getPickRay(windowPosition);
    const hit = (ray && scene.globe.pick(ray, scene)) ?? camera.pickEllipsoid(windowPosition);
    if (!hit) return; // clicked on space
    const point = Cartographic.fromCartesian(hit);
    const lat = CesiumMath.toDegrees(point.latitude);
    if (this.clickHandler) {
      this.clickHandler(lat, CesiumMath.toDegrees(point.longitude));
      return;
    }
    // A click on the ground replaces a curated site's card with the comparison for that point.
    if (store.get().atlas.siteId) updateAtlas({ siteId: null });
    this.select(lat, CesiumMath.toDegrees(point.longitude), {
      elevation: this.elevationKnownAt(lat) ? point.height : null,
    });
  }

  /** True where the terrain source has real heights (not the bare ellipsoid under the polar caps). */
  private elevationKnownAt(lat: number): boolean {
    return this.hasElevation && Math.abs(lat) < this.elevationMaxLatitude;
  }

  /**
   * Flies to a geographic point and describes it. Without `span` the zoom is
   * adaptive: from orbit the first step frames the surrounding country or
   * sea; each further step moves about three times closer.
   */
  select(lat: number, lon: number, options: SelectOptions = {}): void {
    const { camera } = this.viewer;
    if (store.get().settings.autoRotate) updateSettings({ autoRotate: false });

    const local = this.planet.earthServices ? locate(lat, lon) : NO_HIT;
    const floor = this.planet.minViewHeight;
    const from = camera.positionCartographic;
    const target = Cartographic.fromDegrees(lon, lat);
    const ground = Math.max(options.elevation ?? this.groundHeight(target), 0);

    let viewHeight: number;
    /** True when this step frames a whole country, which is then also the name to show. */
    let framingCountry = false;
    if (options.span != null) {
      viewHeight = clamp(options.span * 1.6, Math.max(1500, floor), 6e6 * this.scale);
    } else {
      const regional = local.kind === "country" ? clamp(local.span * 1.5, 3e5, 5e6) : 2.8e6 * this.scale;
      const framing = from.height > regional * 1.35;
      framingCountry = framing && local.kind === "country";
      viewHeight = framing ? regional : Math.max(from.height * 0.3, floor);
    }
    const destinationHeight = ground + viewHeight;

    // Longer hops and bigger zoom changes get more time, within a calm range.
    const arc = haversine(CesiumMath.toDegrees(from.latitude), CesiumMath.toDegrees(from.longitude), lat, lon) / EARTH_RADIUS;
    const zoomChange = Math.abs(Math.log(Math.max(from.height, 1) / destinationHeight));
    const duration = clamp(1.0 + arc * 1.3 + zoomChange * 0.22, 1.2, 4.2);

    const selection = this.describe(lat, lon, options, local, viewHeight);
    store.set({ selection });
    this.markerPosition = Cartesian3.fromDegrees(lon, lat, options.elevation != null ? ground : 0);
    this.showOutline(local);

    this.fly(Cartesian3.fromDegrees(lon, lat, destinationHeight), duration, {
      orientation: TOP_DOWN,
      // From orbit, descend directly instead of arcing higher first.
      maximumHeight: from.height > 3e6 * this.scale ? Math.max(from.height, destinationHeight) : undefined,
      done: () => this.refreshElevation(selection.id, target, local),
    });

    void this.refineName(selection, local, viewHeight, !!options.preset || framingCountry);
  }

  /** Flies to a named place, framing about `span` metres of ground. */
  flyToPlace(lat: number, lon: number, span: number, title: string, subtitle: string): void {
    this.select(lat, lon, { span, preset: { title, subtitle, kind: "place" } });
  }

  /** Zoom one step closer to the current selection. */
  zoomToSelection(): void {
    const selection = store.get().selection;
    if (selection) this.select(selection.lat, selection.lon, { elevation: selection.elevation });
  }

  clearSelection(): void {
    this.reverseAbort?.abort();
    this.markerPosition = null;
    this.marker.style.display = "none";
    this.showOutline(null);
    if (store.get().selection) store.set({ selection: null });
    this.viewer.scene.requestRender();
  }

  private describe(lat: number, lon: number, options: SelectOptions, local: LocalHit, viewHeight: number): Selection {
    const base = {
      id: ++this.selectionId,
      lat,
      lon,
      elevation: local.kind === "water" ? null : (options.elevation ?? null),
      water: local.kind === "water",
      resolving: false,
    };
    if (options.preset) {
      const population = options.preset.kind === "country" ? local.population : undefined;
      return { ...base, ...options.preset, population };
    }
    if (local.kind === "country") {
      const city = viewHeight < 4e5 ? nearestPlace(lat, lon, Math.max(25_000, viewHeight * 0.4)) : null;
      if (city) {
        const subtitle = [city.region !== city.name ? city.region : "", local.name].filter(Boolean).join(", ");
        return { ...base, kind: "place", title: city.name, subtitle };
      }
      return { ...base, kind: "country", title: local.name, subtitle: local.detail, population: local.population };
    }
    if (local.kind === "water") {
      return { ...base, kind: "water", title: local.name, subtitle: local.detail };
    }
    return {
      ...base,
      kind: "point",
      title: `${formatLat(lat, 2)}, ${formatLon(lon, 2)}`,
      subtitle: this.planet.surface,
    };
  }

  /** Asks the online geocoder for a more specific name when one is likely to exist. */
  private async refineName(selection: Selection, local: LocalHit, viewHeight: number, keepName: boolean): Promise<void> {
    this.reverseAbort?.abort();
    const worthAsking =
      local.kind === "none" || (local.kind === "country" && viewHeight < 1.2e6) || (local.kind === "water" && viewHeight < 3e5);
    if (keepName || !this.planet.earthServices || !geocodingEnabled || !worthAsking || !navigator.onLine) return;

    const abort = (this.reverseAbort = new AbortController());
    const isCurrent = () => store.get().selection?.id === selection.id;
    store.set({ selection: { ...selection, resolving: true } });
    try {
      const found = await reverseGeocode(selection.lat, selection.lon, zoomForHeight(viewHeight), abort.signal);
      if (!isCurrent()) return;
      const current = store.get().selection!;
      if (found && !(found.isCountry && local.kind === "country")) {
        store.set({
          selection: {
            ...current,
            kind: found.isCountry ? "country" : "place",
            title: found.title,
            subtitle: found.subtitle || (found.isCountry ? "" : current.subtitle),
            population: undefined,
            resolving: false,
          },
        });
      } else {
        store.set({ selection: { ...current, resolving: false } });
      }
    } catch {
      if (isCurrent()) store.set({ selection: { ...store.get().selection!, resolving: false } });
    }
  }

  /** Once detailed terrain has streamed in, report the elevation it gives. */
  private refreshElevation(id: number, point: Cartographic, local: LocalHit): void {
    if (!this.elevationKnownAt(CesiumMath.toDegrees(point.latitude)) || local.kind === "water") return;
    const update = () => {
      const selection = store.get().selection;
      const height = this.destroyed ? undefined : this.viewer.scene.globe.getHeight(point);
      if (!selection || selection.id !== id || height == null) return;
      if (selection.elevation == null || Math.abs(selection.elevation - height) >= 1) {
        store.set({ selection: { ...selection, elevation: height } });
      }
      this.markerPosition = Cartesian3.fromRadians(point.longitude, point.latitude, Math.max(height, 0));
      this.viewer.scene.requestRender();
    };
    update();
    const timer = setTimeout(update, 2500);
    this.cleanup.push(() => clearTimeout(timer));
  }

  /** Draws the selected country's border, draped on the terrain. */
  private showOutline(local: LocalHit | null): void {
    const { entities } = this.viewer;
    for (const entity of this.outline) entities.remove(entity);
    this.outline = [];
    if (!local?.rings) return;
    const rings = [...local.rings].sort((a, b) => b.length - a.length).slice(0, 60);
    for (const ring of rings) {
      for (const positions of outlineSegments(ring)) {
        this.outline.push(
          entities.add({
            polyline: { positions, clampToGround: true, width: 1.6, material: Color.WHITE.withAlpha(0.6) },
          }),
        );
      }
    }
  }

  // ------------------------------------------------------------ per-frame

  private onTick(): void {
    const now = performance.now();
    const dt = Math.min((now - this.lastTick) / 1000, 0.1);
    this.lastTick = now;
    if (this.flying || !store.get().settings.autoRotate) return;
    const { camera } = this.viewer;
    if (camera.positionCartographic.height < AUTO_ROTATE_MIN_HEIGHT * this.scale) return;
    camera.rotate(Cartesian3.UNIT_Z, AUTO_ROTATE_SPEED * dt);
  }

  private onPostRender(): void {
    const now = performance.now();
    this.updateMarker();
    this.updateNightLights();
    this.updateGroundAtmosphere();
    if (now - this.lastHud > 80) this.emitHud(now);
    this.adaptQuality(now);
  }

  /** Keeps the HTML marker pinned to its geographic position. */
  private updateMarker(): void {
    const { marker } = this;
    if (!this.markerPosition) return;
    const { scene, camera } = this.viewer;
    this.occluder.cameraPosition = camera.positionWC;
    const visible = this.occluder.isPointVisible(this.markerPosition);
    const at = visible ? SceneTransforms.worldToWindowCoordinates(scene, this.markerPosition, this.scratchWindow) : undefined;
    if (!at) {
      marker.style.display = "none";
      return;
    }
    marker.style.display = "block";
    marker.style.transform = `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0)`;
  }

  /** City lights fade out together with the day/night shading as the camera descends. */
  private updateNightLights(): void {
    const height = this.viewer.camera.positionCartographic.height;
    const t = clamp((height - LIGHTING_FADE_OUT) / (LIGHTING_FADE_IN - LIGHTING_FADE_OUT), 0, 1);

    // Borders and names recede on the night side, where they would otherwise
    // be the brightest thing on the planet, but only while the night side is
    // actually drawn dark: zoomed in, the ground is fully lit and so are they.
    // (Linear in t, like Cesium's own fade of the day/night shading.)
    const labels = this.labelLayer;
    if (labels) {
      const nightAlpha = this.lightingEnabled ? 1 - 0.7 * t : 1;
      if (Math.abs(labels.nightAlpha - nightAlpha) > 0.01) labels.nightAlpha = nightAlpha;
    }

    const layer = this.nightLayer;
    if (!layer) return;
    const alpha = t * t * (3 - 2 * t);
    // Hidden entirely once faded, so it stops costing a texture pass when zoomed in.
    const visible = this.lightingEnabled && alpha > 0.01;
    if (layer.show !== visible) layer.show = visible;
    if (visible && Math.abs(layer.alpha - alpha) > 0.01) layer.alpha = alpha;
  }

  private onPointerMove(windowPosition: Cartesian2): void {
    this.cursor = Cartesian2.clone(windowPosition, this.cursor ?? new Cartesian2());
    const now = performance.now();
    if (now - this.lastHud > 50) this.emitHud(now);
  }

  private clearCursor(): void {
    this.cursor = null;
    this.emitHud(performance.now());
  }

  private emitHud(now: number): void {
    this.lastHud = now;
    if (!this.hudListeners.size) return;
    const camera = this.viewer.camera.positionCartographic;
    // Re-pick every time: the point under a resting cursor changes as the camera moves.
    const hit = this.cursor ? this.viewer.camera.pickEllipsoid(this.cursor) : undefined;
    const point = hit ? Cartographic.fromCartesian(hit, this.ellipsoid, this.scratchCursor) : camera;
    const sample: HudSample = {
      lat: CesiumMath.toDegrees(point.latitude),
      lon: CesiumMath.toDegrees(point.longitude),
      altitude: camera.height,
      cursor: !!hit,
    };
    this.hudListeners.forEach((listener) => listener(sample));
  }

  /** Live coordinate readout. Delivered outside React to avoid rerenders. */
  onHud(listener: (s: HudSample) => void): () => void {
    this.hudListeners.add(listener);
    this.emitHud(performance.now());
    return () => {
      this.hudListeners.delete(listener);
    };
  }

  /** Where on the quality ladder to start: last session's level, else a guess from the GPU. */
  private initialQuality(): number {
    try {
      const stored = Number(localStorage.getItem(QUALITY_KEY));
      if (localStorage.getItem(QUALITY_KEY) !== null && Number.isInteger(stored)) {
        return clamp(stored, 0, QUALITY_LEVELS.length - 1);
      }
    } catch {
      /* storage unavailable */
    }
    let renderer = "";
    try {
      const gl = this.viewer.scene.canvas.getContext("webgl2") ?? this.viewer.scene.canvas.getContext("webgl");
      const info = gl?.getExtension("WEBGL_debug_renderer_info");
      if (gl && info) renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
    } catch {
      /* renderer string is optional */
    }
    return MODEST_GPU.test(renderer) || window.matchMedia("(pointer: coarse)").matches ? 1 : 0;
  }

  private setQuality(level: number): void {
    const { viewer } = this;
    const quality = QUALITY_LEVELS[level];
    this.qualityLevel = level;
    viewer.scene.msaaSamples = quality.msaa;
    // Without multisampling, a cheap post-process pass smooths edges instead.
    viewer.scene.postProcessStages.fxaa.enabled = quality.msaa === 1;
    viewer.resolutionScale = this.maxResolutionScale * quality.scale;
    viewer.scene.globe.maximumScreenSpaceError = this.baseScreenSpaceError + quality.detail;
    try {
      localStorage.setItem(QUALITY_KEY, String(level));
    } catch {
      /* ignore */
    }
    viewer.scene.requestRender();
  }

  /**
   * Trades sharpness for smoothness on slower GPUs. Frame times are sampled
   * over runs of consecutive frames (the view only redraws while something
   * is moving) and judged by their median. Frames drawn while a large batch
   * of tiles is streaming in (after a flight or a jump) are left out: that
   * cost is texture uploads and mesh building, which a lower render
   * resolution would not shorten, and counting it used to drive the quality
   * to the bottom of the ladder after a single flight. The quality steps
   * down one level after two slow windows in a row, and steps back up when
   * there is clear headroom. Each time a step up has to be undone, the wait
   * before trying again doubles, so it settles instead of oscillating.
   */
  private adaptQuality(now: number): void {
    const dt = now - this.lastFrame;
    this.lastFrame = now;
    if (dt <= 0 || dt > 400 || document.hidden) {
      this.frameTimes.length = 0;
      this.frameTime = 0;
      return;
    }
    if (this.queuedTiles > LOADING_BURST) return;
    this.frameTimes.push(dt);
    this.frameTime += dt;
    if (this.frameTimes.length < 12 || this.frameTime < 1500) return;
    const sorted = this.frameTimes.sort((a, b) => a - b);
    const fps = 1000 / sorted[sorted.length >> 1];
    this.frameTimes = [];
    this.frameTime = 0;

    const last = QUALITY_LEVELS.length - 1;
    const slow = fps < 28;
    this.slowWindows = slow ? this.slowWindows + 1 : 0;
    if (slow) {
      if (this.slowWindows < 2 || this.qualityLevel >= last) return;
      this.slowWindows = 0;
      this.setQuality(this.qualityLevel + 1);
      this.stepUpAfter = now + this.stepUpDelay;
      this.stepUpDelay = Math.min(this.stepUpDelay * 2, 300_000);
    } else if (fps > (this.qualityLevel === 1 ? 90 : 55) && this.qualityLevel > 0 && now > this.stepUpAfter) {
      // 4x MSAA roughly halves the frame rate on integrated GPUs, so moving
      // up to it needs far more headroom than the other steps.
      this.setQuality(this.qualityLevel - 1);
      this.stepUpAfter = now + 4000;
    }
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.reverseAbort?.abort();
    this.walkthrough?.stop();
    this.cleanup.forEach((fn) => fn());
    this.hudListeners.clear();
    this.handler.destroy();
    this.viewer.destroy();
  }
}

/**
 * A single-image provider for a picture already in memory. The stock
 * SingleTileImageryProvider only loads from a URL, which meant encoding the
 * heatmap canvas to a PNG data URL and decoding it again; on an integrated
 * GPU the encode alone took 20 to 450 ms, depending on how busy the GPU was.
 * The URL given to the base class is never fetched.
 */
class CanvasImageryProvider extends SingleTileImageryProvider {
  constructor(private readonly image: HTMLCanvasElement) {
    super({ url: "data:,", tileWidth: image.width, tileHeight: image.height, rectangle: Rectangle.MAX_VALUE });
  }

  override requestImage(): Promise<HTMLCanvasElement> {
    return Promise.resolve(this.image);
  }
}

/**
 * Converts a flat [lon, lat, ...] ring into polylines, dropping the
 * artificial edges Natural Earth adds along the antimeridian and the pole.
 */
function outlineSegments(ring: number[]): Cartesian3[][] {
  const segments: number[][] = [];
  let current: number[] = [];
  let previousOnSeam = false;
  for (let i = 0; i < ring.length; i += 2) {
    const lon = ring[i];
    const lat = ring[i + 1];
    const onSeam = Math.abs(lon) >= 179.99 || lat <= -89.9;
    if (onSeam && previousOnSeam) {
      if (current.length >= 4) segments.push(current);
      current = [];
    }
    current.push(lon, lat);
    previousOnSeam = onSeam;
  }
  if (current.length >= 4) segments.push(current);
  return segments.map((s) => Cartesian3.fromDegreesArray(s));
}
