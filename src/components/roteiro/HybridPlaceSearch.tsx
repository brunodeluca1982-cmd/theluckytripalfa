import { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X, Star, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { guideHotels, guideRestaurants, guideActivities } from "@/data/rio-guide-data";
import { VALIDATED_LOCATIONS } from "@/data/validated-locations";

/**
 * Unified place result from either curated DB or Google Places
 */
export interface HybridPlaceResult {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  lat: number | null;
  lng: number | null;
  source: 'curated' | 'google';
  curated: boolean;
  placeId?: string; // Google place_id (required for Google results)
  category?: string;
  description?: string;
}

interface CuratedPlace {
  id: string;
  name: string;
  neighborhood: string;
  category: string;
  description: string;
}

interface HybridPlaceSearchProps {
  onPlaceSelect: (place: HybridPlaceResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  destinationId?: string;
}

/**
 * Hybrid Place Search Component
 * 
 * 2-source search:
 * 1. First queries The Lucky Trip curated database
 * 2. Falls back to Google Places if no matches found
 * 
 * All UI in PT-BR as per requirements.
 */
export const HybridPlaceSearch = ({
  onPlaceSelect,
  placeholder = "Buscar lugar…",
  className,
  disabled = false,
  destinationId = "rio-de-janeiro",
}: HybridPlaceSearchProps) => {
  const [query, setQuery] = useState("");
  const [curatedResults, setCuratedResults] = useState<HybridPlaceResult[]>([]);
  const [googleResults, setGoogleResults] = useState<HybridPlaceResult[]>([]);
  const [isSearchingCurated, setIsSearchingCurated] = useState(false);
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
  const [showGoogleFallback, setShowGoogleFallback] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionTokenRef = useRef<string>(generateSessionToken());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build curated places list from guide data
  const getCuratedPlaces = useCallback((): CuratedPlace[] => {
    const places: CuratedPlace[] = [];
    
    // Add hotels
    guideHotels.forEach(h => {
      places.push({
        id: h.id,
        name: h.name,
        neighborhood: h.neighborhood,
        category: 'hotel',
        description: h.description,
      });
    });
    
    // Add restaurants
    guideRestaurants.forEach(r => {
      places.push({
        id: r.id,
        name: r.name,
        neighborhood: r.neighborhood,
        category: r.category,
        description: r.description,
      });
    });
    
    // Add activities
    guideActivities.forEach(a => {
      places.push({
        id: a.id,
        name: a.name,
        neighborhood: a.neighborhood,
        category: a.category,
        description: a.description,
      });
    });
    
    return places;
  }, []);

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

  // Search curated database
  const searchCurated = useCallback((input: string): HybridPlaceResult[] => {
    if (input.length < 2) return [];
    
    const normalizedInput = normalizeString(input);
    const curatedPlaces = getCuratedPlaces();
    
    const matches = curatedPlaces.filter(place => {
      const nameMatch = normalizeString(place.name).includes(normalizedInput);
      const neighborhoodMatch = normalizeString(place.neighborhood).includes(normalizedInput);
      return nameMatch || neighborhoodMatch;
    });
    
    return matches.slice(0, 5).map(place => {
      const location = VALIDATED_LOCATIONS[place.id];
      return {
        id: place.id,
        name: place.name,
        address: location?.fullAddress || place.neighborhood,
        neighborhood: place.neighborhood,
        lat: location?.lat || null,
        lng: location?.lng || null,
        source: 'curated' as const,
        curated: true,
        category: place.category,
        description: place.description,
      };
    });
  }, [getCuratedPlaces]);

  // Fetch Google Places predictions
  const searchGoogle = useCallback(async (input: string) => {
    if (input.length < 3) {
      setGoogleResults([]);
      return;
    }

    setIsSearchingGoogle(true);
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
        console.error('Google autocomplete error:', fnError);
        setError('Erro ao buscar no Google');
        setGoogleResults([]);
      } else if (data?.predictions) {
        const results: HybridPlaceResult[] = data.predictions.map((p: any) => ({
          id: `google-${p.place_id}`,
          name: p.structured_formatting.main_text,
          address: p.structured_formatting.secondary_text || '',
          neighborhood: null,
          lat: null,
          lng: null,
          source: 'google' as const,
          curated: false,
          placeId: p.place_id,
        }));
        setGoogleResults(results);
      }
    } catch (err) {
      console.error('Google search error:', err);
      setError('Erro de conexão');
      setGoogleResults([]);
    } finally {
      setIsSearchingGoogle(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowGoogleFallback(false);
    setGoogleResults([]);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 2) {
      setCuratedResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearchingCurated(true);
    
    debounceRef.current = setTimeout(async () => {
      const curated = searchCurated(value);
      setCuratedResults(curated);
      setIsSearchingCurated(false);
      setShowDropdown(true);
      
      // If no curated results and query is long enough, automatically search Google
      if (curated.length === 0 && value.length >= 3) {
        setShowGoogleFallback(true);
        // Automatically trigger Google search
        await searchGoogle(value);
      }
    }, 200);
  };

  // Trigger Google search as fallback
  const handleSearchGoogle = () => {
    searchGoogle(query);
    setShowGoogleFallback(false);
  };

  // Handle selecting a curated place
  const handleSelectCurated = (place: HybridPlaceResult) => {
    setShowDropdown(false);
    setQuery(place.name);
    onPlaceSelect(place);
  };

  // Handle selecting a Google place (needs to fetch details first)
  const handleSelectGoogle = async (place: HybridPlaceResult) => {
    if (!place.placeId) {
      setError("Local inválido");
      return;
    }

    setIsFetchingDetails(true);
    setShowDropdown(false);
    setQuery(place.name);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('google-places', {
        body: {
          action: 'details',
          placeId: place.placeId,
          sessionToken: sessionTokenRef.current,
        },
      });

      if (fnError) {
        console.error('Place details error:', fnError);
        setError('Erro ao obter detalhes do local');
      } else if (data?.place) {
        const fullPlace: HybridPlaceResult = {
          id: `google-${data.place.placeId}`,
          name: data.place.name,
          address: data.place.address,
          neighborhood: data.place.neighborhood,
          lat: data.place.lat,
          lng: data.place.lng,
          source: 'google',
          curated: false,
          placeId: data.place.placeId,
        };
        onPlaceSelect(fullPlace);
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
    setCuratedResults([]);
    setGoogleResults([]);
    setShowDropdown(false);
    setShowGoogleFallback(false);
    setError(null);
  };

  const isLoading = isSearchingCurated || isSearchingGoogle || isFetchingDetails;
  const hasResults = curatedResults.length > 0 || googleResults.length > 0 || showGoogleFallback;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => hasResults && setShowDropdown(true)}
          placeholder={placeholder}
          disabled={disabled || isFetchingDetails}
          className="pl-9 pr-9"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {query && !isLoading && (
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

      {showDropdown && hasResults && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-72 overflow-auto">
          {/* Curated results */}
          {curatedResults.map((place) => (
            <button
              key={place.id}
              onClick={() => handleSelectCurated(place)}
              className="w-full px-3 py-2.5 text-left hover:bg-accent transition-colors flex items-start gap-2 border-b border-border/50 last:border-b-0"
            >
              <Star className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm truncate">{place.name}</p>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 bg-primary/10 text-primary border-0">
                    Dica The Lucky Trip
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {place.neighborhood || place.address}
                </p>
              </div>
            </button>
          ))}

          {/* Google fallback button */}
          {showGoogleFallback && googleResults.length === 0 && (
            <div className="px-3 py-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">
                Nenhum resultado na curadoria.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearchGoogle}
                disabled={isSearchingGoogle}
                className="w-full text-sm"
              >
                {isSearchingGoogle ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                ) : (
                  <Globe className="h-3 w-3 mr-2" />
                )}
                Buscar no Google
              </Button>
            </div>
          )}

          {/* Google results */}
          {googleResults.length > 0 && (
            <>
              <div className="px-3 py-1.5 bg-muted/50 border-t border-border">
                <p className="text-xs text-muted-foreground">Resultados do Google Maps</p>
              </div>
              {googleResults.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handleSelectGoogle(place)}
                  className="w-full px-3 py-2.5 text-left hover:bg-accent transition-colors flex items-start gap-2"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm truncate">{place.name}</p>
                      <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 text-muted-foreground">
                        Fora da curadoria
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate">
                        Google Maps • {place.address}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Empty state */}
          {query.length >= 2 && curatedResults.length === 0 && googleResults.length === 0 && !showGoogleFallback && !isLoading && (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-muted-foreground">Nenhum resultado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Normalize string for search (remove accents, lowercase)
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Generate a unique session token for Google Places API
function generateSessionToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default HybridPlaceSearch;
