import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PlacePhotoResult {
  photoUrl: string | null;
  photoSource: "places" | "streetview" | "none";
  isLoading: boolean;
}

// In-memory cache to avoid duplicate requests within a session
const memoryCache = new Map<string, { photoUrl: string | null; photoSource: string }>();

/**
 * Hook that auto-fetches a Google Places photo for a given item.
 * Priority: DB cache → Google Places → Street View → fallback.
 */
export function usePlacePhoto(
  itemId: string,
  itemType: "hotel" | "restaurant" | "attraction" | "block",
  placeQuery: string,
  enabled = true
): PlacePhotoResult {
  const cacheKey = `${itemId}:${itemType}`;
  const cached = memoryCache.get(cacheKey);
  
  const [photoUrl, setPhotoUrl] = useState<string | null>(cached?.photoUrl ?? null);
  const [photoSource, setPhotoSource] = useState<"places" | "streetview" | "none">(
    (cached?.photoSource as any) ?? "none"
  );
  const [isLoading, setIsLoading] = useState(!cached && enabled);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !itemId || !placeQuery || fetchedRef.current) return;
    if (memoryCache.has(cacheKey)) return;

    fetchedRef.current = true;
    let cancelled = false;

    async function fetchPhoto() {
      try {
        // 1. Check DB cache first (fast, no edge function call)
        const { data: dbCached } = await supabase
          .from("place_photos")
          .select("photo_url, photo_source")
          .eq("item_id", itemId)
          .eq("item_type", itemType)
          .maybeSingle();

        if (dbCached?.photo_url && !cancelled) {
          const result = { photoUrl: dbCached.photo_url, photoSource: dbCached.photo_source };
          memoryCache.set(cacheKey, result);
          setPhotoUrl(result.photoUrl);
          setPhotoSource(result.photoSource as any);
          setIsLoading(false);
          return;
        }

        // 2. If not cached, call edge function to fetch + cache
        const { data, error } = await supabase.functions.invoke("place-photos", {
          body: {
            action: "fetch-photo",
            item_id: itemId,
            item_type: itemType,
            place_query: placeQuery,
          },
        });

        if (!cancelled && data?.photo) {
          const result = {
            photoUrl: data.photo.photo_url || null,
            photoSource: data.photo.photo_source || "none",
          };
          memoryCache.set(cacheKey, result);
          setPhotoUrl(result.photoUrl);
          setPhotoSource(result.photoSource as any);
        }
      } catch (e) {
        console.error("[usePlacePhoto] error:", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPhoto();
    return () => { cancelled = true; };
  }, [itemId, itemType, placeQuery, enabled, cacheKey]);

  return { photoUrl, photoSource, isLoading };
}

/**
 * Build a place query string from item data.
 */
export function buildPlaceQuery(name: string, neighborhood?: string): string {
  return `${name}, ${neighborhood || "Rio de Janeiro"}, Rio de Janeiro`;
}
