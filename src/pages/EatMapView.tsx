import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RIO_NEIGHBORHOODS, getNeighborhoodById } from "@/data/rio-neighborhoods";
import LuckyListMarker from "@/components/LuckyListMarker";
import LuckyListPreviewSheet from "@/components/LuckyListPreviewSheet";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import NeighborhoodDetailSheet from "@/components/eat/NeighborhoodDetailSheet";
import { useExternalRestaurants, normalizeNeighborhood, generateRestaurantSlug } from "@/hooks/use-external-restaurants";

// Fixed editorial neighborhood order
const NEIGHBORHOOD_ORDER = [
  "ipanema",
  "leblon",
  "copacabana",
  "jardim-botanico",
  "lagoa",
  "sao-conrado",
  "barra-da-tijuca",
  "gavea",
  "santa-teresa",
];

// Lucky List items with map positions (editorial placement)
const luckyListMarkers = [
  { id: "confeitaria-colombo", top: "20%", left: "60%" },
];

const EatMapView = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [neighborhoodSheetOpen, setNeighborhoodSheetOpen] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const { data: externalRestaurants, isLoading } = useExternalRestaurants();

  const isSubscriber = false;

  // Map external data to the shape used by NeighborhoodDetailSheet and the list
  const restaurantListData = useMemo(() => {
    if (!externalRestaurants) return [];
    return externalRestaurants.map((r) => ({
      id: String(r.id),
      name: r.nome,
      neighborhood: normalizeNeighborhood(r.bairro),
      tag: r.categoria || "",
      category: r.categoria || "",
      mapsLink: r.google_maps_url || "",
      instagram: r.instagram || "",
      editorial: r.meu_olhar || "",
    }));
  }, [externalRestaurants]);

  const handleLockedTap = () => {
    setPreviewOpen(true);
  };

  const handleNeighborhoodTap = (neighborhoodId: string) => {
    setSelectedNeighborhood(neighborhoodId);
    setNeighborhoodSheetOpen(true);
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const MAP_WIDTH = 900;

  useEffect(() => {
    if (mapContainerRef.current) {
      const container = mapContainerRef.current;
      const initialScroll = (MAP_WIDTH - container.clientWidth) / 2;
      container.scrollLeft = Math.max(0, initialScroll);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mapContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - mapContainerRef.current.offsetLeft);
    setScrollLeft(mapContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mapContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - mapContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    mapContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!mapContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - mapContainerRef.current.offsetLeft);
    setScrollLeft(mapContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !mapContainerRef.current) return;
    const x = e.touches[0].pageX - mapContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    mapContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <RoteiroAccessLink />
      </header>

      {/* Title */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-3xl font-serif font-medium text-foreground">
          Onde Comer
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Rio de Janeiro
        </p>
      </div>

      {/* Map Area */}
      <div
        ref={mapContainerRef}
        className="relative w-full h-[40vh] overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing flex-shrink-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div
          ref={mapContentRef}
          className="relative h-full"
          style={{ width: `${MAP_WIDTH}px`, minWidth: `${MAP_WIDTH}px` }}
        >
          <img
            src="/assets/maps/rio-3d-map-eat.png"
            alt="Rio de Janeiro 3D Map"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />

          {RIO_NEIGHBORHOODS.map((neighborhood) => (
            <button
              key={neighborhood.id}
              onClick={(e) => {
                e.stopPropagation();
                handleNeighborhoodTap(neighborhood.id);
              }}
              className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 hover:border-foreground/40 transition-colors flex items-center justify-center"
              style={{ top: neighborhood.mapPosition.top, left: neighborhood.mapPosition.left }}
              aria-label={`Explorar restaurantes em ${neighborhood.name}`}
            >
              <div className="w-2 h-2 rounded-full bg-foreground/60" />
            </button>
          ))}

          {luckyListMarkers.map((marker) => (
            <LuckyListMarker
              key={marker.id}
              id={marker.id}
              top={marker.top}
              left={marker.left}
              isSubscriber={isSubscriber}
              onLockedTap={handleLockedTap}
            />
          ))}
        </div>
      </div>

      {/* Instruction */}
      <div className="px-6 py-4 border-b border-border">
        <p className="text-sm text-muted-foreground text-center">
          Toque em um bairro para explorar onde comer
        </p>
      </div>

      {/* Restaurant List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <h2 className="text-lg font-serif font-medium text-foreground mb-4">
            Restaurantes
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {NEIGHBORHOOD_ORDER.map((neighborhoodId) => {
                const neighborhoodRestaurants = restaurantListData.filter(
                  (r) => r.neighborhood === neighborhoodId
                );

                if (neighborhoodRestaurants.length === 0) return null;

                const neighborhoodData = getNeighborhoodById(neighborhoodId);

                return (
                  <div key={neighborhoodId}>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      {neighborhoodData?.name || neighborhoodId}
                    </h3>
                    <div className="space-y-1">
                      {neighborhoodRestaurants.map((restaurant) => {
                        const slug = generateRestaurantSlug(restaurant.name);

                        return (
                          <Link
                            key={restaurant.id}
                            to={`/restaurante/${slug}?from=${restaurant.neighborhood}`}
                            className="flex items-center justify-between py-4 border-b border-border hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-base text-foreground truncate">{restaurant.name}</p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="text-xs text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded">
                                {restaurant.tag}
                              </span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>

      <LuckyListPreviewSheet open={previewOpen} onOpenChange={setPreviewOpen} />

      <NeighborhoodDetailSheet
        open={neighborhoodSheetOpen}
        onOpenChange={setNeighborhoodSheetOpen}
        neighborhoodId={selectedNeighborhood}
        restaurants={restaurantListData}
      />
    </div>
  );
};

export default EatMapView;
