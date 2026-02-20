import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RIO_NEIGHBORHOODS, getNeighborhoodById } from "@/data/rio-neighborhoods";
import { useExternalHotels, type ExternalHotel } from "@/hooks/use-external-hotels";

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

function normalizeNeighborhood(bairro: string): string {
  return bairro
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

const OndeficarRio = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { data: externalHotels, isLoading: hotelsLoading } = useExternalHotels();

  const MAP_WIDTH = 900;

  // Map external hotels to the display format
  const hotelListData = useMemo(() => {
    if (!externalHotels || externalHotels.length === 0) return [];
    return externalHotels.map((h) => ({
      id: h.id,
      name: h.nome,
      neighborhood: normalizeNeighborhood(h.bairro),
      tag: h.categoria?.trim() || "Hotel",
      meuOlhar: h.meu_olhar,
      instagram: h.instagram,
    }));
  }, [externalHotels]);

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

  const renderHotelRow = (hotel: typeof hotelListData[0]) => {
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

      {/* Instruction */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Toque em um bairro para explorar onde ficar
        </p>
      </div>

      {/* Hotel List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <h2 className="text-lg font-serif font-medium text-foreground mb-4">
            Hotéis
          </h2>

          {/* Grouped by neighborhood */}
          <div className="space-y-6">
            {NEIGHBORHOOD_ORDER.map((neighborhoodId) => {
              const neighborhoodHotels = hotelListData.filter(
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