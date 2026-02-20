/**
 * GEO-CLUSTERING ENGINE
 *
 * Groups itinerary candidates into geographic clusters so that
 * each day's items are physically close. Uses validated coordinates
 * and the proximityMap from rio-guide-data as a fallback.
 *
 * The Google Distance Matrix edge function is called once per
 * generated itinerary to get real travel times with traffic.
 */

import { VALIDATED_LOCATIONS } from "@/data/validated-locations";
import { neighborhoodGroups, proximityMap } from "@/data/rio-guide-data";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const BASE = `https://${PROJECT_ID}.supabase.co/functions/v1`;

// ─── Types ──────────────────────────────────────────────────────

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoItem {
  id: string;
  name: string;
  neighborhood: string;
  coords: GeoPoint | null;
}

export interface GeoCluster {
  zone: string;
  items: GeoItem[];
  centroid: GeoPoint | null;
}

export interface DistanceResult {
  originId: string;
  destinationId: string;
  distanceMeters: number;
  durationSeconds: number;
  durationInTrafficSeconds: number | null;
  durationText: string;
  durationInTrafficText: string | null;
}

// ─── Zone assignment ────────────────────────────────────────────

const ZONE_MAP: Record<string, string> = {};
for (const [zone, neighborhoods] of Object.entries(neighborhoodGroups)) {
  for (const n of neighborhoods) {
    ZONE_MAP[n] = zone;
  }
}

export function getZone(neighborhood: string): string {
  return ZONE_MAP[neighborhood] || "especial";
}

/**
 * Haversine distance in km between two points.
 */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng * sinLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Resolve coordinates for a curated item using validated locations,
 * or fallback to neighborhood centroid from VALIDATED_NEIGHBORHOODS.
 */
export function resolveCoords(id: string, neighborhood: string): GeoPoint | null {
  const loc = VALIDATED_LOCATIONS[id];
  if (loc) return { lat: loc.lat, lng: loc.lng };

  // Fallback: find any validated item in the same neighborhood
  for (const v of Object.values(VALIDATED_LOCATIONS)) {
    if (v.neighborhood === neighborhood) return { lat: v.lat, lng: v.lng };
  }
  return null;
}

// ─── Clustering ─────────────────────────────────────────────────

/**
 * Groups items into geographic clusters by zone.
 * Items without coordinates are placed based on their neighborhood's zone.
 */
export function clusterByZone(items: GeoItem[]): GeoCluster[] {
  const clusters = new Map<string, GeoItem[]>();

  for (const item of items) {
    const zone = getZone(item.neighborhood);
    if (!clusters.has(zone)) clusters.set(zone, []);
    clusters.get(zone)!.push(item);
  }

  return Array.from(clusters.entries()).map(([zone, zoneItems]) => {
    const withCoords = zoneItems.filter((i) => i.coords);
    const centroid =
      withCoords.length > 0
        ? {
            lat: withCoords.reduce((s, i) => s + i.coords!.lat, 0) / withCoords.length,
            lng: withCoords.reduce((s, i) => s + i.coords!.lng, 0) / withCoords.length,
          }
        : null;
    return { zone, items: zoneItems, centroid };
  });
}

/**
 * Assigns clusters to days. Strategy:
 * - If days >= clusters: one cluster per day, largest clusters get priority
 * - If days < clusters: merge smallest/closest clusters
 * - Guaratiba / far zones get their own dedicated day when possible
 */
export function assignClustersTodays(
  clusters: GeoCluster[],
  totalDays: number
): GeoCluster[][] {
  // Sort clusters by size descending
  const sorted = [...clusters].sort((a, b) => b.items.length - a.items.length);

  if (totalDays >= sorted.length) {
    // Each cluster gets its own day, empty days get null
    const days: GeoCluster[][] = sorted.map((c) => [c]);
    while (days.length < totalDays) {
      days.push([]);
    }
    return days;
  }

  // Need to merge clusters — merge smallest into closest
  const merged = [...sorted];
  while (merged.length > totalDays) {
    // Find the two closest clusters (by centroid distance, or by zone proximity)
    let bestI = merged.length - 1;
    let bestJ = merged.length - 2;
    let bestDist = Infinity;

    for (let i = 0; i < merged.length; i++) {
      for (let j = i + 1; j < merged.length; j++) {
        const ci = merged[i].centroid;
        const cj = merged[j].centroid;
        const dist = ci && cj ? haversineKm(ci, cj) : areZonesClose(merged[i].zone, merged[j].zone) ? 5 : 50;
        if (dist < bestDist) {
          bestDist = dist;
          bestI = i;
          bestJ = j;
        }
      }
    }

    // Merge j into i
    merged[bestI] = {
      zone: `${merged[bestI].zone}+${merged[bestJ].zone}`,
      items: [...merged[bestI].items, ...merged[bestJ].items],
      centroid: merged[bestI].centroid || merged[bestJ].centroid,
    };
    merged.splice(bestJ, 1);
  }

  return merged.map((c) => [c]);
}

function areZonesClose(a: string, b: string): boolean {
  const closeZones: Record<string, string[]> = {
    zonaSul: ["zonaSulAlta", "centro"],
    zonaSulAlta: ["zonaSul", "barra"],
    barra: ["zonaSulAlta"],
    centro: ["zonaSul"],
    especial: [],
  };
  return closeZones[a]?.includes(b) || closeZones[b]?.includes(a) || false;
}

/**
 * Order items within a day by geographic proximity (nearest neighbor heuristic).
 */
export function orderByProximity(items: GeoItem[]): GeoItem[] {
  if (items.length <= 1) return items;

  const withCoords = items.filter((i) => i.coords);
  const withoutCoords = items.filter((i) => !i.coords);

  if (withCoords.length <= 1) return items;

  // Nearest neighbor starting from first item
  const ordered: GeoItem[] = [withCoords[0]];
  const remaining = new Set(withCoords.slice(1));

  while (remaining.size > 0) {
    const last = ordered[ordered.length - 1];
    let nearest: GeoItem | null = null;
    let nearestDist = Infinity;

    for (const item of remaining) {
      const dist = haversineKm(last.coords!, item.coords!);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = item;
      }
    }

    if (nearest) {
      ordered.push(nearest);
      remaining.delete(nearest);
    }
  }

  return [...ordered, ...withoutCoords];
}

// ─── Distance Matrix API call ───────────────────────────────────

/**
 * Calls the distance-matrix edge function to get real travel times.
 * Returns a map keyed by "originId->destinationId".
 */
export async function fetchDistanceMatrix(
  items: GeoItem[]
): Promise<Map<string, DistanceResult>> {
  const withCoords = items.filter((i) => i.coords);
  if (withCoords.length < 2) return new Map();

  // Build unique points (max 25)
  const points = withCoords.slice(0, 25).map((i) => ({
    lat: i.coords!.lat,
    lng: i.coords!.lng,
    id: i.id,
  }));

  try {
    const res = await fetch(`${BASE}/distance-matrix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
      },
      body: JSON.stringify({ origins: points, destinations: points }),
    });

    if (!res.ok) {
      console.error("Distance matrix call failed:", res.status);
      return new Map();
    }

    const data = await res.json();
    const map = new Map<string, DistanceResult>();

    for (const r of data.results || []) {
      if (r.distanceMeters > 0) {
        map.set(`${r.originId}->${r.destinationId}`, r);
      }
    }

    return map;
  } catch (e) {
    console.error("Distance matrix error:", e);
    return new Map();
  }
}

/**
 * Get travel duration between two items in minutes.
 * Uses traffic-aware duration when available, falls back to haversine estimate.
 */
export function getTravelMinutes(
  fromId: string,
  toId: string,
  distanceMap: Map<string, DistanceResult>,
  fromCoords?: GeoPoint | null,
  toCoords?: GeoPoint | null
): number {
  const key = `${fromId}->${toId}`;
  const result = distanceMap.get(key);

  if (result) {
    const seconds = result.durationInTrafficSeconds ?? result.durationSeconds;
    return Math.ceil(seconds / 60);
  }

  // Fallback: haversine estimate
  if (fromCoords && toCoords) {
    const km = haversineKm(fromCoords, toCoords);
    // Rough estimate: 25 km/h average in Rio + 10min buffer
    return Math.ceil((km / 25) * 60) + 10;
  }

  return 30; // Unknown — assume 30 min
}

/**
 * Check if two items are too far apart for the same day.
 * Threshold: >60 minutes travel time with traffic.
 */
export function areTooFarApart(
  fromId: string,
  toId: string,
  distanceMap: Map<string, DistanceResult>,
  fromCoords?: GeoPoint | null,
  toCoords?: GeoPoint | null
): boolean {
  const minutes = getTravelMinutes(fromId, toId, distanceMap, fromCoords, toCoords);
  return minutes > 60;
}
