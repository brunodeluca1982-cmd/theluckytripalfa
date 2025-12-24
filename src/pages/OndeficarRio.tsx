import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RIO_NEIGHBORHOODS, getNeighborhoodById } from "@/data/rio-neighborhoods";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";

// Static hotel data with tags for the list
const hotelListData = [
  { id: "hotel-fasano-rio", name: "Hotel Fasano Rio de Janeiro", neighborhood: "ipanema", tag: "Luxo" },
  { id: "copacabana-palace", name: "Copacabana Palace", neighborhood: "copacabana", tag: "Ícone" },
  { id: "emiliano-rio", name: "Emiliano Rio", neighborhood: "copacabana", tag: "Elegante" },
  { id: "janeiro-hotel", name: "Janeiro Hotel", neighborhood: "leblon", tag: "Design" },
  { id: "santa-teresa-hotel", name: "Santa Teresa Hotel RJ MGallery", neighborhood: "santa-teresa", tag: "Refúgio" },
  { id: "fairmont-rio", name: "Fairmont Rio", neighborhood: "copacabana", tag: "Vista" },
  { id: "hotel-nacional", name: "Hotel Nacional", neighborhood: "sao-conrado", tag: "Histórico" },
  { id: "ritz-leblon", name: "Ritz Leblon", neighborhood: "leblon", tag: "Discreto" },
  { id: "hyatt-regency-barra", name: "Hyatt Regency Barra", neighborhood: "barra-da-tijuca", tag: "Resort" },
  { id: "mama-shelter-rio", name: "Mama Shelter Rio", neighborhood: "santa-teresa", tag: "Jovem" },
  { id: "windsor-leme", name: "Windsor Leme", neighborhood: "leme", tag: "Tranquilo" },
  { id: "c-design-hotel", name: "C Design Hotel", neighborhood: "recreio", tag: "Praia" },
];

const OndeficarRio = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Fixed map width - independent from Onde Comer
  const MAP_WIDTH = 1100;

  // Set initial scroll to center
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
          Onde Ficar
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Rio de Janeiro
        </p>
      </div>

      {/* Map Area - Fixed at top */}
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
          {/* 3D Illustrated Map Background */}
          <img 
            src="/assets/maps/rio-3d-map.png" 
            alt="Rio de Janeiro 3D Map"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />

          {/* Tappable neighborhood markers */}
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
      <div className="px-6 py-4 border-b border-border">
        <p className="text-sm text-muted-foreground text-center">
          Toque em um bairro para explorar onde ficar
        </p>
      </div>

      {/* Hotel List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <h2 className="text-lg font-serif font-medium text-foreground mb-4">
            Hotéis
          </h2>
          <div className="space-y-1">
            {hotelListData.map((hotel) => {
              const neighborhoodData = getNeighborhoodById(hotel.neighborhood);
              const slug = hotel.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");
              
              return (
                <Link
                  key={hotel.id}
                  to={`/hotel/${slug}?from=${hotel.neighborhood}`}
                  className="flex items-center justify-between py-4 border-b border-border hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-foreground truncate">{hotel.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{neighborhoodData?.name || hotel.neighborhood}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded">
                      {hotel.tag}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                </Link>
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
