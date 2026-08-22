import boundary from "./india-boundary.json";

type Ring = [number, number][];

/**
 * Official-style outline of India (includes Jammu & Kashmir and Ladakh),
 * simplified from open data (DataMeet, CC-BY). Coordinates are [lng, lat].
 */
const polygons = (boundary as unknown as { geometry: { coordinates: Ring[][] } }).geometry
  .coordinates;

/** Exterior rings as Leaflet [lat, lng] pairs. */
export const INDIA_RINGS: [number, number][][] = polygons.map((poly) =>
  (poly[0] ?? []).map(([lng, lat]) => [lat, lng] as [number, number]),
);

/** World rectangle used as the outer ring of the "everything but India" mask. */
export const WORLD_RING: [number, number][] = [
  [-89, -179.9],
  [89, -179.9],
  [89, 179.9],
  [-89, 179.9],
];
