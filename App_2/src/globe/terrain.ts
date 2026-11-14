import {
  ArcGISTiledElevationTerrainProvider,
  createWorldTerrainAsync,
  type Credit,
  EllipsoidTerrainProvider,
  type Event,
  HeightmapTerrainData,
  type Request,
  type TerrainData,
  TerrainProvider,
  type TilingScheme,
} from "cesium";
import { ION_TOKEN } from "../config";
import type { DecodeRequest, DecodeResponse } from "./terrainDecimator.worker";

const ARCGIS_ELEVATION = "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer";

export interface TerrainChoice {
  provider: TerrainProvider;
  label: string;
  /** False when the globe is a smooth ellipsoid with no elevation data. */
  hasElevation: boolean;
}

export function flatTerrain(label = "Off"): TerrainChoice {
  return { provider: new EllipsoidTerrainProvider(), label, hasElevation: false };
}

/**
 * Real elevation, best source first: Cesium World Terrain when an ion token
 * is configured, otherwise Esri's keyless World Elevation service, and a
 * smooth WGS84 ellipsoid if neither can be reached.
 */
export async function createTerrain(): Promise<TerrainChoice> {
  if (ION_TOKEN) {
    try {
      const provider = await createWorldTerrainAsync({ requestVertexNormals: true, requestWaterMask: true });
      return { provider, label: "Cesium World Terrain", hasElevation: true };
    } catch {
      /* fall through to the keyless source */
    }
  }
  try {
    const source = await ArcGISTiledElevationTerrainProvider.fromUrl(ARCGIS_ELEVATION);
    // Subdivision relies on a Cesium internal; without it, use Esri's tiles
    // as Cesium serves them (correct, just slower to draw).
    const canSubdivide = !!(source as unknown as Partial<EsriInternals>)._terrainDataStructure;
    const provider = canSubdivide ? new SubdividedEsriTerrain(source) : source;
    return { provider, label: "Esri World Elevation", hasElevation: true };
  } catch {
    return flatTerrain("Unavailable");
  }
}

// ---------------------------------------------------------------------------
// Tile subdivision
//
// Esri serves 257x257 height samples per tile, and Cesium sizes its tile
// pyramid from that: each terrain tile ends up draped with a 4x4 block of
// imagery tiles from every imagery layer. The globe shader samples all of
// those textures for every pixel (and splits the tile into extra draw passes
// once they exceed the GPU's texture units), which made regional views slow
// on integrated GPUs, and rendering at lower resolution to compensate made
// the imagery blurry.
//
// Instead, each Esri tile is decoded once (in a worker) and cut into the
// 4x4 block of 65x65 tiles two levels further down Cesium's pyramid. Every
// elevation sample is kept, network traffic is unchanged, and each terrain
// tile carries a single imagery tile per layer.
// ---------------------------------------------------------------------------

/** Samples per side of the tiles handed to Cesium. */
const TILE_SIZE = 65;
/** Cesium level L is cut from the Esri tile at level L - LEVEL_OFFSET. */
const LEVEL_OFFSET = 2;
/** Decoded Esri tiles kept for cutting further sub-tiles (about 265 KB each). */
const DECODED_CACHE = 48;

/** A field of Cesium's Esri provider that is not in its public typings. */
interface EsriInternals {
  _terrainDataStructure: object;
}

type Grid = { heights: Float32Array; size: number } | null;

let worker: Worker | null = null;
let nextJob = 0;
const jobs = new Map<number, (response: DecodeResponse) => void>();

function decode(buffer: ArrayBuffer): Promise<DecodeResponse> {
  if (!worker) {
    worker = new Worker(new URL("./terrainDecimator.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<DecodeResponse>) => {
      jobs.get(event.data.id)?.(event.data);
      jobs.delete(event.data.id);
    };
    worker.onerror = () => {
      jobs.forEach((resolve, id) => resolve({ id, ok: false }));
      jobs.clear();
    };
  }
  const id = nextJob++;
  return new Promise((resolve) => {
    jobs.set(id, resolve);
    worker!.postMessage({ id, buffer } satisfies DecodeRequest, [buffer]);
  });
}

class SubdividedEsriTerrain implements TerrainProvider {
  readonly errorEvent: Event<TerrainProvider.ErrorEvent>;
  readonly credit: Credit;
  readonly tilingScheme: TilingScheme;
  readonly hasWaterMask = false;
  readonly hasVertexNormals = false;
  readonly availability = undefined;

  private readonly levelZeroError: number;
  private readonly structure: object;
  /** Decoded source tiles by "level/x/y", least recently used first. */
  private readonly grids = new Map<string, Promise<Grid>>();

  constructor(private readonly source: ArcGISTiledElevationTerrainProvider) {
    this.errorEvent = source.errorEvent;
    this.credit = source.credit;
    this.tilingScheme = source.tilingScheme;
    this.structure = (source as unknown as EsriInternals)._terrainDataStructure;
    this.levelZeroError = TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
      this.tilingScheme.ellipsoid,
      TILE_SIZE,
      this.tilingScheme.getNumberOfXTilesAtLevel(0),
    );
  }

  /** The Esri tile that tile (x, y, level) is cut from. */
  private sourceOf(x: number, y: number, level: number) {
    const sourceLevel = Math.max(level - LEVEL_OFFSET, 0);
    const shift = level - sourceLevel;
    return { x: x >> shift, y: y >> shift, level: sourceLevel, shift };
  }

  getLevelMaximumGeometricError(level: number): number {
    return this.levelZeroError / (1 << level);
  }

  getTileDataAvailable(x: number, y: number, level: number): boolean | undefined {
    const s = this.sourceOf(x, y, level);
    return this.source.getTileDataAvailable(s.x, s.y, s.level);
  }

  loadTileDataAvailability(x: number, y: number, level: number): undefined | Promise<void> {
    const s = this.sourceOf(x, y, level);
    return this.source.loadTileDataAvailability(s.x, s.y, s.level);
  }

  requestTileGeometry(x: number, y: number, level: number, request?: Request): Promise<TerrainData> | undefined {
    const s = this.sourceOf(x, y, level);
    const key = `${s.level}/${s.x}/${s.y}`;
    let grid = this.grids.get(key);
    if (grid) {
      this.grids.delete(key); // re-added below as the most recently used
    } else {
      const fetched = this.source.requestTileGeometry(s.x, s.y, s.level, request);
      if (!fetched) return undefined; // throttled; Cesium asks again later
      grid = fetched.then(async (data): Promise<Grid> => {
        const buffer = (data as unknown as { _buffer?: unknown })._buffer;
        if (!(buffer instanceof ArrayBuffer)) return null;
        const result = await decode(buffer);
        return result.ok ? { heights: result.heights, size: result.size } : null;
      });
      // A failed request must not stay cached, or its tiles could never load.
      const failed = grid;
      failed.catch(() => {
        if (this.grids.get(key) === failed) this.grids.delete(key);
      });
    }
    this.grids.set(key, grid);
    while (this.grids.size > DECODED_CACHE) this.grids.delete(this.grids.keys().next().value!);

    return grid.then((g) => this.cut(g, x, y, level, s.shift));
  }

  /** The part of a decoded Esri grid covering tile (x, y, level), as a 65x65 heightmap. */
  private cut(grid: Grid, x: number, y: number, level: number, shift: number): TerrainData {
    const heights = new Float32Array(TILE_SIZE * TILE_SIZE);
    const parts = 1 << shift;
    const span = grid ? (grid.size - 1) / parts : 0;
    const step = span / (TILE_SIZE - 1);
    // Tiles Esri cannot decode (it marks open ocean as "no data") stay at sea level.
    if (grid && Number.isInteger(step) && step >= 1) {
      const col0 = (x % parts) * span;
      const row0 = (y % parts) * span;
      for (let row = 0; row < TILE_SIZE; row++) {
        const from = (row0 + row * step) * grid.size + col0;
        for (let col = 0; col < TILE_SIZE; col++) heights[row * TILE_SIZE + col] = grid.heights[from + col * step];
      }
    }
    // Cesium's child bits: SW = 0, SE = 1, NW = 2, NE = 3 (tile y grows southward).
    let childTileMask = 0;
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 2; i++) {
        if (this.getTileDataAvailable(2 * x + i, 2 * y + j, level + 1) !== false) childTileMask |= 1 << (2 + i - 2 * j);
      }
    }
    return new HeightmapTerrainData({
      buffer: heights,
      width: TILE_SIZE,
      height: TILE_SIZE,
      childTileMask,
      structure: this.structure,
    });
  }
}
