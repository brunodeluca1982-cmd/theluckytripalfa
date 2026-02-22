import { useState, useEffect } from "react";

/**
 * USE WEATHER ICONS
 * 
 * Fetches minimal weather icons from external edge function.
 * Returns a map of ISO date → { icon, label }.
 * Fetches once per mount, caches in local state.
 * Silently returns empty map on failure.
 */

interface WeatherDay {
  date: string; // YYYY-MM-DD
  icon: string; // ☀️ ⛅ ☁️ 🌧️
  label: string;
}

interface WeatherResponse {
  days: WeatherDay[];
}

export type WeatherMap = Record<string, { icon: string; label: string }>;

const EXTERNAL_BASE_URL = "https://lsibzflaaqzvtzjlvrxw.supabase.co/functions/v1";
const EXTERNAL_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaWJ6ZmxhYXF6dnR6amx2cnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTE0NTQsImV4cCI6MjA3OTc2NzQ1NH0.8NzMek4d-XzysR4OiUXKLJ7APgiiio-6X35RG4XMKX4";

// Default city center coords for known destinations
const CITY_CENTER_COORDS: Record<string, { lat: number; lon: number }> = {
  "rio-de-janeiro": { lat: -22.9068, lon: -43.1729 },
  "rio": { lat: -22.9068, lon: -43.1729 },
  "sao-paulo": { lat: -23.5505, lon: -46.6333 },
  "buenos-aires": { lat: -34.6037, lon: -58.3816 },
  "lisboa": { lat: 38.7223, lon: -9.1393 },
  "porto": { lat: 41.1579, lon: -8.6291 },
  "florianopolis": { lat: -27.5954, lon: -48.5480 },
  "salvador": { lat: -12.9714, lon: -38.5124 },
  "paraty": { lat: -23.2178, lon: -44.7131 },
  "buzios": { lat: -22.7469, lon: -41.8817 },
};

interface UseWeatherIconsParams {
  lat?: number;
  lon?: number;
  destinationId?: string;
}

export const useWeatherIcons = ({ lat, lon, destinationId }: UseWeatherIconsParams): WeatherMap => {
  const [weatherMap, setWeatherMap] = useState<WeatherMap>({});

  useEffect(() => {
    // Resolve coordinates
    let finalLat = lat;
    let finalLon = lon;

    if ((finalLat === undefined || finalLon === undefined) && destinationId) {
      const fallback = CITY_CENTER_COORDS[destinationId.toLowerCase()];
      if (fallback) {
        finalLat = fallback.lat;
        finalLon = fallback.lon;
      }
    }

    if (finalLat === undefined || finalLon === undefined) return;

    const fetchWeather = async () => {
      try {
        const url = `${EXTERNAL_BASE_URL}/get_weather_icons?lat=${finalLat}&lon=${finalLon}`;
        const res = await fetch(url, {
          headers: {
            "apikey": EXTERNAL_ANON_KEY,
            "Authorization": `Bearer ${EXTERNAL_ANON_KEY}`,
          },
        });

        if (!res.ok) return;

        const data: WeatherResponse = await res.json();
        if (!data?.days?.length) return;

        const map: WeatherMap = {};
        for (const day of data.days) {
          if (day.date && day.icon) {
            map[day.date] = { icon: day.icon, label: day.label || "" };
          }
        }
        setWeatherMap(map);
      } catch {
        // Silently fail — weather is optional
      }
    };

    fetchWeather();
  }, [lat, lon, destinationId]);

  return weatherMap;
};

/**
 * Helper: format ISO date to BR format
 * "2026-02-27" → "27-02-2026"
 */
export const formatDateBR = (isoDate: string): string => {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

/**
 * Helper: get ISO date for a trip day given arrival date
 * dayIndex is 1-based
 */
export const getTripDayDate = (arrivalDate: Date, dayIndex: number): string => {
  const date = new Date(arrivalDate);
  date.setDate(date.getDate() + (dayIndex - 1));
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default useWeatherIcons;
