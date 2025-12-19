import { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/**
 * Place data returned from Google Places API
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
}

/**
 * Autocomplete prediction from Google Places
 */
interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceData) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Google Places Autocomplete Component
 * 
 * Allows users to search for places and returns validated place data
 * with place_id for mapping and export functionality.
 */
export const GooglePlacesAutocomplete = ({
  onPlaceSelect,
  placeholder = "Buscar local...",
  className,
  disabled = false,
}: GooglePlacesAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionTokenRef = useRef<string>(generateSessionToken());
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch autocomplete predictions
  const fetchPredictions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('google-places', {
        body: {
          action: 'autocomplete',
          input,
          sessionToken: sessionTokenRef.current,
        },
      });

      if (fnError) {
        console.error('Autocomplete error:', fnError);
        setError('Erro ao buscar locais');
        setPredictions([]);
      } else if (data?.predictions) {
        setPredictions(data.predictions);
        setShowDropdown(data.predictions.length > 0);
      }
    } catch (err) {
      console.error('Autocomplete fetch error:', err);
      setError('Erro de conexão');
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (value: string) => {
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchPredictions(value);
    }, 300);
  };

  // Fetch place details and call onPlaceSelect
  const handleSelectPlace = async (prediction: Prediction) => {
    setIsFetchingDetails(true);
    setShowDropdown(false);
    setQuery(prediction.structured_formatting.main_text);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('google-places', {
        body: {
          action: 'details',
          placeId: prediction.place_id,
          sessionToken: sessionTokenRef.current,
        },
      });

      if (fnError) {
        console.error('Place details error:', fnError);
        setError('Erro ao obter detalhes do local');
      } else if (data?.place) {
        onPlaceSelect(data.place);
        // Generate new session token for next search
        sessionTokenRef.current = generateSessionToken();
      }
    } catch (err) {
      console.error('Place details fetch error:', err);
      setError('Erro de conexão');
    } finally {
      setIsFetchingDetails(false);
    }
  };

  // Clear input
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

      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => handleSelectPlace(prediction)}
              className="w-full px-3 py-2 text-left hover:bg-accent transition-colors flex items-start gap-2"
            >
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">
                  {prediction.structured_formatting.main_text}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {prediction.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Generate a unique session token for Google Places API
function generateSessionToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default GooglePlacesAutocomplete;
