import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * CityHeroContext — Single source of truth for a city's hero background.
 * Priority: 1) place_photos cache  2) Google Places via edge function  3) Static fallback
 */

interface CityHeroContextValue {
  heroUrl: string;
  isLoading: boolean;
}

const CityHeroContext = createContext<CityHeroContextValue>({
  heroUrl: "",
  isLoading: true,
});

export const useCityHero = () => useContext(CityHeroContext);

// Static fallbacks per city
import rioHeroFallback from "@/assets/highlights/rio-hero-carnaval.jpg";

const CITY_FALLBACKS: Record<string, string> = {
  "rio-de-janeiro": rioHeroFallback,
};

// City display names for Google Places queries
const CITY_QUERIES: Record<string, string> = {
  "rio-de-janeiro": "Rio de Janeiro Brazil panoramic view",
};

interface CityHeroProviderProps {
  cityId: string;
  children: ReactNode;
}

export const CityHeroProvider = ({ cityId, children }: CityHeroProviderProps) => {
  const [heroUrl, setHeroUrl] = useState(CITY_FALLBACKS[cityId] || "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      try {
        // 1) Check place_photos cache for city hero
        const cacheKey = `city-hero-${cityId}`;
        const { data: cached } = await supabase
          .from("place_photos")
          .select("photo_url")
          .eq("item_id", cacheKey)
          .eq("item_type", "city-hero")
          .maybeSingle();

        if (cached?.photo_url && !cancelled) {
          setHeroUrl(cached.photo_url);
          setIsLoading(false);
          return;
        }

        // 2) Try Google Places via edge function
        const placeQuery = CITY_QUERIES[cityId];
        if (placeQuery) {
          const { data: photoResult } = await supabase.functions.invoke("place-photos", {
            body: {
              action: "fetch-photo",
              item_id: cacheKey,
              item_type: "city-hero",
              place_query: placeQuery,
            },
          });

          if (photoResult?.photo?.photo_url && !cancelled) {
            setHeroUrl(photoResult.photo.photo_url);
          }
        }
      } catch {
        // Keep fallback
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    // Use fallback immediately, try Supabase/Google in background
    setHeroUrl(CITY_FALLBACKS[cityId] || "");
    resolve();

    return () => { cancelled = true; };
  }, [cityId]);

  return (
    <CityHeroContext.Provider value={{ heroUrl, isLoading }}>
      {children}
    </CityHeroContext.Provider>
  );
};
