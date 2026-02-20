import { useState, useCallback, useRef } from "react";
import { Search, MapPin, Star, ExternalLink, Plus, Loader2, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { searchPlaces, type PlaceResult } from "@/lib/search-places";
import { cn } from "@/lib/utils";

/**
 * Reusable Google Places search section.
 * Shows a search bar and results list with "Adicionar ao Roteiro" action.
 */

interface GooglePlaceSearchSectionProps {
  city?: string;
  bairro?: string;
  type?: string;
  title?: string;
  placeholder?: string;
  onAddToRoteiro?: (place: PlaceResult) => void;
  className?: string;
}

export const GooglePlaceSearchSection = ({
  city = "Rio de Janeiro",
  bairro,
  type,
  title = "Buscar no Google",
  placeholder = "Buscar lugares...",
  onAddToRoteiro,
  className,
}: GooglePlaceSearchSectionProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    async (value: string) => {
      if (value.length < 3) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const places = await searchPlaces({ query: value, city, bairro, type, limit: 8 });
        setResults(places);
      } catch {
        setError("Busca do Google indisponível no momento.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [city, bairro, type]
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(value), 300);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <section className={cn("space-y-4", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-9"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {query && !isLoading && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {results.map((place) => (
              <div
                key={place.placeId}
                className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border"
              >
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{place.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {place.rating && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {place.rating}
                        {place.userRatingsTotal && (
                          <span className="text-muted-foreground/60">({place.userRatingsTotal})</span>
                        )}
                      </span>
                    )}
                    {place.googleMapsUrl && (
                      <a
                        href={place.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-0.5 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Maps
                      </a>
                    )}
                  </div>
                </div>
                {onAddToRoteiro && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddToRoteiro(place)}
                    className="flex-shrink-0 h-8 text-xs gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Roteiro
                  </Button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {hasSearched && !isLoading && results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum resultado encontrado.
        </p>
      )}
    </section>
  );
};

export default GooglePlaceSearchSection;
