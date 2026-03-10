import { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const functionsBase = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1`;

/**
 * Place data returned from places-details edge function
 */
export interface PlaceData {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  types: string[];
  neighborhood: string | null;
  city: string | null;
  rating?: number | null;
  user_ratings_total?: number | null;
  price_level?: number | null;
  google_maps_url?: string | null;
  photo_refs?: string[];
}

interface Prediction {
  description: string;
  place_id: string;
}

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceData) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  city?: string;
  bairro?: string;
}

export const GooglePlacesAutocomplete = ({
  onPlaceSelect,
  placeholder = "Buscar local...",
  className,
  disabled = false,
  city = "Rio de Janeiro",
  bairro,
}: GooglePlacesAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchPredictions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ input });
      if (city) params.set("city", city);
      if (bairro) params.set("bairro", bairro);

      const res = await fetch(`${functionsBase}/places-autocomplete?${params}`, {
        headers: { apikey: SUPABASE_ANON_KEY },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao buscar");
        setPredictions([]);
      } else {
        setPredictions(data.predictions || []);
        setShowDropdown((data.predictions || []).length > 0);
      }
    } catch {
      setError("Erro de conexão");
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, [city, bairro]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(value), 300);
  };

  const handleSelectPlace = async (prediction: Prediction) => {
    setIsFetchingDetails(true);
    setShowDropdown(false);
    setQuery(prediction.description.split(",")[0]);

    try {
      const params = new URLSearchParams({ place_id: prediction.place_id });
      const res = await fetch(`${functionsBase}/places-details?${params}`, {
        headers: { apikey: SUPABASE_ANON_KEY },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao obter detalhes");
      } else if (data.place) {
        const p = data.place;
        onPlaceSelect({
          placeId: p.place_id,
          name: p.name,
          address: p.address || "",
          lat: p.lat,
          lng: p.lng,
          types: p.types || [],
          neighborhood: extractNeighborhood(p.address),
          city: extractCity(p.address),
          rating: p.rating,
          user_ratings_total: p.user_ratings_total,
          price_level: p.price_level,
          google_maps_url: p.google_maps_url,
          photo_refs: p.photo_refs || [],
        });
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setPredictions([]);
    setShowDropdown(false);
    setError(null);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => predictions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          disabled={disabled || isFetchingDetails}
          className="pl-9 pr-9"
        />
        {(isLoading || isFetchingDetails) && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {query && !isLoading && !isFetchingDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((p) => (
            <button
              key={p.place_id}
              onClick={() => handleSelectPlace(p)}
              className="w-full px-3 py-2 text-left hover:bg-accent transition-colors flex items-start gap-2"
            >
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
              <p className="text-sm truncate">{p.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function extractNeighborhood(address: string | null): string | null {
  if (!address) return null;
  const parts = address.split(",").map((s) => s.trim());
  return parts.length >= 3 ? parts[1] : null;
}

function extractCity(address: string | null): string | null {
  if (!address) return null;
  if (address.includes("Rio de Janeiro")) return "Rio de Janeiro";
  const parts = address.split(",").map((s) => s.trim());
  return parts.length >= 4 ? parts[2] : null;
}

export default GooglePlacesAutocomplete;
