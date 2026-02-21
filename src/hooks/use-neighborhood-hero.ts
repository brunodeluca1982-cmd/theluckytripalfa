import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// In-memory cache
const heroCache = new Map<string, string>();

/**
 * Resolves the hero image for a neighborhood:
 * 1. Supabase Storage (heros/bairros/{city}/{bairro}/01.jpg)
 * 2. Google Places photo via edge function
 * 3. Static fallback
 */
export function useNeighborhoodHero(
  citySlug: string,
  bairroSlug: string,
  cityName: string,
  bairroName: string,
  staticFallback: string
): { heroUrl: string; isLoading: boolean } {
  const cacheKey = `${citySlug}/${bairroSlug}`;
  const cached = heroCache.get(cacheKey);

  const [heroUrl, setHeroUrl] = useState(cached || staticFallback);
  const [isLoading, setIsLoading] = useState(!cached);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current || cached) return;
    if (!citySlug || !bairroSlug) return;
    fetchedRef.current = true;

    let cancelled = false;

    async function resolve() {
      try {
        // 1. Try Supabase Storage
        const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/heros/bairros/${citySlug}/${bairroSlug}/01.jpg`;
        const headRes = await fetch(storageUrl, { method: "HEAD" });

        if (headRes.ok && !cancelled) {
          heroCache.set(cacheKey, storageUrl);
          setHeroUrl(storageUrl);
          setIsLoading(false);
          return;
        }

        // 2. Check DB cache for a google photo
        const { data: dbCached } = await supabase
          .from("place_photos")
          .select("photo_url")
          .eq("item_id", cacheKey)
          .eq("item_type", "bairro_hero")
          .maybeSingle();

        if (dbCached?.photo_url && !cancelled) {
          heroCache.set(cacheKey, dbCached.photo_url);
          setHeroUrl(dbCached.photo_url);
          setIsLoading(false);
          return;
        }

        // 3. Fetch from Google via edge function
        const { data, error } = await supabase.functions.invoke("place-photos", {
          body: {
            action: "fetch-photo",
            item_id: cacheKey,
            item_type: "bairro_hero",
            place_query: `${bairroName}, ${cityName}, Brazil`,
          },
        });

        if (!cancelled && data?.photo?.photo_url) {
          heroCache.set(cacheKey, data.photo.photo_url);
          setHeroUrl(data.photo.photo_url);
        }
        // If no google photo found, keep static fallback
      } catch (e) {
        console.error("[useNeighborhoodHero] error:", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    resolve();
    return () => { cancelled = true; };
  }, [citySlug, bairroSlug, cityName, bairroName, cacheKey, cached]);

  return { heroUrl, isLoading };
}
