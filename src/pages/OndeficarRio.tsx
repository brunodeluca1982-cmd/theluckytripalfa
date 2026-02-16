import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RIO_NEIGHBORHOODS, getNeighborhoodById } from "@/data/rio-neighborhoods";

import { useCarnavalMode } from "@/contexts/CarnavalModeContext";

// Fixed editorial neighborhood order
const NEIGHBORHOOD_ORDER = [
  "ipanema",
  "leblon",
  "arpoador",
  "copacabana",
  "leme",
  "santa-teresa",
  "centro",
  "recreio",
  "barra-da-tijuca",
  "sao-conrado",
  "botafogo",
  "jardim-botanico",
  "gavea",
];

// Carnaval hotspots with verified lat/lng
const CARNAVAL_HOTSPOTS = [
  { name: "Sapucaí", lat: -22.9117, lng: -43.1958 },
  { name: "Cinelândia", lat: -22.9094, lng: -43.1762 },
  { name: "Aterro do Flamengo", lat: -22.9326, lng: -43.1729 },
  { name: "Lapa", lat: -22.9152, lng: -43.1791 },
  { name: "Glória", lat: -22.9242, lng: -43.1761 },
  { name: "Ipanema (Posto 9)", lat: -22.9868, lng: -43.2035 },
  { name: "Leblon", lat: -22.9862, lng: -43.2246 },
  { name: "Botafogo", lat: -22.9511, lng: -43.1822 },
];

// Haversine distance in km
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function minDistToHotspot(lat: number, lng: number): number {
  return Math.min(...CARNAVAL_HOTSPOTS.map((h) => haversineKm(lat, lng, h.lat, h.lng)));
}

// Static hotel data with lat/lng from validated-locations
const hotelListData = [
  { id: "hotel-fasano-rio", name: "Hotel Fasano Rio de Janeiro", neighborhood: "ipanema", tag: "Luxo", lat: -22.9867, lng: -43.2022 },
  { id: "copacabana-palace", name: "Copacabana Palace", neighborhood: "copacabana", tag: "Ícone", lat: -22.9669, lng: -43.1782 },
  { id: "emiliano-rio", name: "Emiliano Rio", neighborhood: "copacabana", tag: "Elegante", lat: -22.9781, lng: -43.1903 },
  { id: "janeiro-hotel", name: "Janeiro Hotel", neighborhood: "leblon", tag: "Design", lat: -22.9872, lng: -43.2297 },
  { id: "santa-teresa-hotel", name: "Santa Teresa Hotel RJ MGallery", neighborhood: "santa-teresa", tag: "Refúgio", lat: -22.9227, lng: -43.1873 },
  { id: "fairmont-rio", name: "Fairmont Rio", neighborhood: "copacabana", tag: "Vista", lat: -22.9812, lng: -43.1923 },
  { id: "hotel-nacional", name: "Hotel Nacional", neighborhood: "sao-conrado", tag: "Histórico", lat: -22.9989, lng: -43.2644 },
  { id: "ritz-leblon", name: "Ritz Leblon", neighborhood: "leblon", tag: "Discreto", lat: -22.9838, lng: -43.2234 },
  { id: "hyatt-regency-barra", name: "Hyatt Regency Barra", neighborhood: "barra-da-tijuca", tag: "Resort", lat: -22.9998, lng: -43.3652 },
  { id: "mama-shelter-rio", name: "Mama Shelter Rio", neighborhood: "santa-teresa", tag: "Jovem", lat: -22.9230, lng: -43.1880 },
  { id: "windsor-leme", name: "Windsor Leme", neighborhood: "leme", tag: "Tranquilo", lat: -22.9634, lng: -43.1713 },
  { id: "c-design-hotel", name: "C Design Hotel", neighborhood: "recreio", tag: "Praia", lat: -23.0130, lng: -43.4470 },
];

type SortMode = "editorial" | "blocos";

const OndeficarRio = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [sortMode, setSortMode] = useState<SortMode>("editorial");

  const { isCarnavalMode } = useCarnavalMode();

  const MAP_WIDTH = 900;

  // Pre-compute distances
  const hotelsWithDist = useMemo(
    () =>
      hotelListData.map((h) => ({
        ...h,
        distBlocos: minDistToHotspot(h.lat, h.lng),
      })),
    []
  );

  // Sorted flat list for "blocos" mode
  const sortedByBlocos = useMemo(
    () => [...hotelsWithDist].sort((a, b) => a.distBlocos - b.distBlocos),
    [hotelsWithDist]
  );

  // Persist and restore map scroll position across navigations
  useEffect(() => {
    if (mapContainerRef.current) {
      const container = mapContainerRef.current;
      const saved = sessionStorage.getItem("ondeficar-map-scroll");
      if (saved !== null) {
        container.scrollLeft = Number(saved);
      } else {
        const initialScroll = (MAP_WIDTH - container.clientWidth) / 2;
        container.scrollLeft = Math.max(0, initialScroll);
      }
    }
  }, []);

  // Save scroll position on unmount
  useEffect(() => {
    const container = mapContainerRef.current;
    return () => {
      if (container) {
        sessionStorage.setItem("ondeficar-map-scroll", String(container.scrollLeft));
      }
    };
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

  const handleMouseUp = () => setIsDragging(false);

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

  const makeSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const renderHotelRow = (hotel: typeof hotelsWithDist[0]) => {
    const slug = makeSlug(hotel.name);
    return (
      <Link
        key={hotel.id}
        to={`/hotel/${slug}?from=${hotel.neighborhood}`}
        className="flex items-center justify-between py-4 border-b border-border hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
      >
        <div className="flex-1 min-w-0">
          <p className="text-base text-foreground truncate">{hotel.name}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {sortMode === "blocos" && (
            <span className="text-[11px] text-accent-foreground bg-accent/60 px-2 py-0.5 rounded">
              {hotel.distBlocos < 1
                ? `${Math.round(hotel.distBlocos * 1000)}m dos blocos`
                : `${hotel.distBlocos.toFixed(1)} km dos blocos`}
            </span>
          )}
          <span className="text-xs text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded">
            {hotel.tag}
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
      </header>

      {/* Header block */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl font-serif font-medium text-foreground">
          Onde faz mais sentido você ficar
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Escolha um bairro. A gente te ajuda a decidir onde ficar.
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
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        <div
          ref={mapContentRef}
          className="relative h-full"
          style={{ width: `${MAP_WIDTH}px`, minWidth: `${MAP_WIDTH}px` }}
        >
          <img
            src="/assets/maps/rio-3d-map.png"
            alt="Rio de Janeiro 3D Map"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />
          {RIO_NEIGHBORHOODS.map((neighborhood) => (
            <Link
              key={neighborhood.id}
              to={`/onde-ficar/${neighborhood.id}?from=map`}
              className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 hover:border-foreground/40 transition-colors flex items-center justify-center"
              style={{ top: neighborhood.mapPosition.top, left: neighborhood.mapPosition.left }}
              aria-label={`Explorar hotéis em ${neighborhood.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-2 h-2 rounded-full bg-foreground/60" />
            </Link>
          ))}
        </div>
      </div>

      {/* Instruction + Filter */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Toque em um bairro para explorar onde ficar
        </p>
        {isCarnavalMode && (
          <button
            onClick={() => setSortMode(sortMode === "editorial" ? "blocos" : "editorial")}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              sortMode === "blocos"
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-transparent text-muted-foreground border-border"
            }`}
          >
            Perto dos blocos
          </button>
        )}
      </div>

      {/* Hotel List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <h2 className="text-lg font-serif font-medium text-foreground mb-4">
            Hotéis
          </h2>

          {sortMode === "blocos" ? (
            /* Flat list sorted by distance */
            <div className="space-y-1">
              {sortedByBlocos.map(renderHotelRow)}
            </div>
          ) : (
            /* Grouped by neighborhood */
            <div className="space-y-6">
              {NEIGHBORHOOD_ORDER.map((neighborhoodId) => {
                const neighborhoodHotels = hotelsWithDist.filter(
                  (h) => h.neighborhood === neighborhoodId
                );
                if (neighborhoodHotels.length === 0) return null;
                const neighborhoodData = getNeighborhoodById(neighborhoodId);

                return (
                  <div key={neighborhoodId}>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      {neighborhoodData?.name || neighborhoodId}
                    </h3>
                    <div className="space-y-1">
                      {neighborhoodHotels.map(renderHotelRow)}
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
    </div>
  );
};

export default OndeficarRio;
