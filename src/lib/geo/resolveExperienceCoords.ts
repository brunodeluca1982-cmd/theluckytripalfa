/**
 * Resolves lat/lng for an experiencia using:
 * 1) Existing lat/lng on the item (if valid)
 * 2) Edge-function pipeline: places-autocomplete → places-details
 *
 * Caches in memory + localStorage. Never writes to Supabase.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const LS_PREFIX = "geo_cache_";

const debug = () => new URLSearchParams(window.location.search).has("debug");

export interface GeoInput {
  id: string;
  nome: string;
  bairro: string;
  cidade?: string;
  lat?: number | string | null;
  lng?: number | string | null;
}

export interface GeoCoord {
  lat: number;
  lng: number;
}

/* ── In-memory cache ── */
const memCache = new Map<string, GeoCoord | null>();

/* ── Validation ── */
function isValidCoord(lat: unknown, lng: unknown): GeoCoord | null {
  const la = typeof lat === "string" ? parseFloat(lat) : (lat as number);
  const ln = typeof lng === "string" ? parseFloat(lng) : (lng as number);
  if (
    typeof la === "number" &&
    typeof ln === "number" &&
    !Number.isNaN(la) &&
    !Number.isNaN(ln) &&
    la >= -90 &&
    la <= 90 &&
    ln >= -180 &&
    ln <= 180
  ) {
    return { lat: la, lng: ln };
  }
  return null;
}

/* ── localStorage helpers ── */
function lsGet(id: string): GeoCoord | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + id);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidCoord(parsed.lat, parsed.lng);
  } catch {
    return null;
  }
}

function lsSet(id: string, coord: GeoCoord) {
  try {
    localStorage.setItem(LS_PREFIX + id, JSON.stringify(coord));
  } catch {
    /* quota exceeded — ignore */
  }
}

/* ── Edge-function pipeline ── */
async function resolveViaEdgeFunctions(
  nome: string,
  bairro: string,
  cidade: string
): Promise<GeoCoord | null> {
  const input = `${nome} ${bairro} ${cidade} Brasil`;

  // Step 1: places-autocomplete
  const acUrl = `${SUPABASE_URL}/functions/v1/places-autocomplete?input=${encodeURIComponent(
    input
  )}&city=${encodeURIComponent(cidade)}`;

  const acResp = await fetch(acUrl, {
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!acResp.ok) return null;
  const acData = await acResp.json();
  const predictions = acData?.predictions;
  if (!Array.isArray(predictions) || predictions.length === 0) return null;

  const placeId = predictions[0].place_id;
  if (!placeId) return null;

  // Step 2: places-details
  const detUrl = `${SUPABASE_URL}/functions/v1/places-details?place_id=${encodeURIComponent(
    placeId
  )}`;

  const detResp = await fetch(detUrl, {
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!detResp.ok) return null;
  const detData = await detResp.json();

  const geo = detData?.place?.lat != null && detData?.place?.lng != null
    ? isValidCoord(detData.place.lat, detData.place.lng)
    : null;

  return geo;
}

/* ── Inflight dedup ── */
const inflight = new Map<string, Promise<GeoCoord | null>>();

/* ── Public API ── */
export async function resolveExperienceCoords(
  item: GeoInput
): Promise<GeoCoord | null> {
  // 1) Memory cache
  if (memCache.has(item.id)) return memCache.get(item.id)!;

  // 2) localStorage cache
  const cached = lsGet(item.id);
  if (cached) {
    memCache.set(item.id, cached);
    if (debug()) console.log(`[geo] ${item.id} from localStorage`, cached);
    return cached;
  }

  // 3) Item's own coords
  const own = isValidCoord(item.lat, item.lng);
  if (own) {
    memCache.set(item.id, own);
    lsSet(item.id, own);
    if (debug()) console.log(`[geo] ${item.id} from DB`, own);
    return own;
  }

  // 4) Dedup inflight requests
  if (inflight.has(item.id)) return inflight.get(item.id)!;

  const promise = resolveViaEdgeFunctions(
    item.nome,
    item.bairro,
    item.cidade || "Rio de Janeiro"
  ).then((coord) => {
    inflight.delete(item.id);
    memCache.set(item.id, coord);
    if (coord) lsSet(item.id, coord);
    if (debug())
      console.log(
        `[geo] ${item.id} resolved via edge`,
        coord ?? "not_found"
      );
    return coord;
  }).catch((err) => {
    inflight.delete(item.id);
    memCache.set(item.id, null);
    if (debug()) console.error(`[geo] ${item.id} error`, err);
    return null;
  });

  inflight.set(item.id, promise);
  return promise;
}

/**
 * Synchronous check: returns cached coord or null (no fetch).
 * Useful for conditional rendering without suspense.
 */
export function getCachedCoords(id: string): GeoCoord | null {
  return memCache.get(id) ?? lsGet(id) ?? null;
}
