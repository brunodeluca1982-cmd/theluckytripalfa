import { supabase } from "@/integrations/supabase/client";

/**
 * SEARCH PLACES — Reusable service
 *
 * Flow: 1) Check places_cache  2) If insufficient, call Google via edge functions
 * Returns a normalized PlaceResult array.
 */

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const BASE = `https://${PROJECT_ID}.supabase.co/functions/v1`;

export interface PlaceResult {
  id: string;
  placeId: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  types: string[];
  rating: number | null;
  userRatingsTotal: number | null;
  priceLevel: number | null;
  googleMapsUrl: string | null;
  photoRefs: string[];
  source: "cache" | "google";
}

export interface SearchPlacesParams {
  query: string;
  city?: string;
  bairro?: string;
  type?: string;
  limit?: number;
}

/**
 * Search for places — cache first, Google fallback.
 */
export async function searchPlaces(params: SearchPlacesParams): Promise<PlaceResult[]> {
  const { query, city = "Rio de Janeiro", bairro, type, limit = 8 } = params;

  // 1. Cache lookup
  let cacheQuery = supabase
    .from("places_cache")
    .select("*")
    .ilike("name", `%${query}%`)
    .limit(limit);

  if (type) {
    cacheQuery = cacheQuery.contains("types", [type]);
  }

  const { data: cached } = await cacheQuery;
  const cacheResults = (cached || []).map(normalizeCacheItem);

  if (cacheResults.length >= limit) {
    return cacheResults.slice(0, limit);
  }

  // 2. Google fallback
  try {
    const urlParams = new URLSearchParams({ input: query });
    if (city) urlParams.set("city", city);
    if (bairro) urlParams.set("bairro", bairro);

    const res = await fetch(`${BASE}/places-autocomplete?${urlParams}`, {
      headers: { apikey: ANON_KEY },
    });
    const data = await res.json();

    if (!res.ok || !data.predictions) return cacheResults;

    const remaining = limit - cacheResults.length;
    const predictions = (data.predictions as { description: string; place_id: string }[])
      .filter((p) => !cacheResults.some((c) => c.placeId === p.place_id))
      .slice(0, remaining);

    // Fetch details for each (sequential to avoid rate limit spikes)
    const googleResults: PlaceResult[] = [];
    for (const pred of predictions) {
      try {
        const detailRes = await fetch(
          `${BASE}/places-details?place_id=${encodeURIComponent(pred.place_id)}`,
          { headers: { apikey: ANON_KEY } }
        );
        const detailData = await detailRes.json();
        if (detailRes.ok && detailData.place) {
          googleResults.push(normalizeGooglePlace(detailData.place));
        }
      } catch {
        // Skip failed detail lookups
      }
    }

    return [...cacheResults, ...googleResults];
  } catch {
    // Google unavailable — return cache-only
    return cacheResults;
  }
}

/**
 * Search places by Google type (e.g. "restaurant", "museum") for the auto-roteiro.
 * Uses a descriptive query instead of raw type filter.
 */
export async function searchPlacesByType(
  googleQuery: string,
  city: string = "Rio de Janeiro",
  limit: number = 5
): Promise<PlaceResult[]> {
  return searchPlaces({ query: googleQuery, city, limit });
}

// ─── Normalizers ─────────────────────────────────────────────────

function normalizeCacheItem(item: Record<string, unknown>): PlaceResult {
  return {
    id: String(item.id || item.place_id),
    placeId: String(item.place_id),
    name: String(item.name || ""),
    address: String(item.address || ""),
    lat: item.lat as number | null,
    lng: item.lng as number | null,
    types: (item.types as string[]) || [],
    rating: item.rating as number | null,
    userRatingsTotal: item.user_ratings_total as number | null,
    priceLevel: item.price_level as number | null,
    googleMapsUrl: item.google_maps_url as string | null,
    photoRefs: (item.photo_refs as string[]) || [],
    source: "cache",
  };
}

function normalizeGooglePlace(place: Record<string, unknown>): PlaceResult {
  return {
    id: String(place.place_id || place.placeId || ""),
    placeId: String(place.place_id || place.placeId || ""),
    name: String(place.name || ""),
    address: String(place.address || place.formatted_address || ""),
    lat: place.lat as number | null,
    lng: place.lng as number | null,
    types: (place.types as string[]) || [],
    rating: place.rating as number | null,
    userRatingsTotal: place.user_ratings_total as number | null,
    priceLevel: place.price_level as number | null,
    googleMapsUrl: place.google_maps_url as string | null,
    photoRefs: (place.photo_refs as string[]) || [],
    source: "google",
  };
}
