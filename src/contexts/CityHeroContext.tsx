import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * CityHeroContext — Single source of truth for a city's hero background.
 * Priority: 1) Supabase experience_media  2) Static fallback
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
        // Try to find a hero image from experience_media linked to a city-level experience
        const { data: exp } = await supabase
          .from("experiences")
          .select("slug")
          .eq("city", cityId === "rio-de-janeiro" ? "Rio de Janeiro" : cityId)
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (exp?.slug) {
          const { data: media } = await supabase
            .from("experience_media")
            .select("media_url, media_type")
            .eq("experience_slug", exp.slug)
            .eq("is_active", true)
            .eq("media_type", "image")
            .order("sort_order", { ascending: true })
            .limit(1)
            .maybeSingle();

          if (media?.media_url && !cancelled) {
            setHeroUrl(media.media_url);
          }
        }
      } catch {
        // Keep fallback
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    // Use fallback immediately, try Supabase in background
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
