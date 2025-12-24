import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RIO_NEIGHBORHOODS, getNeighborhoodById } from "@/data/rio-neighborhoods";
import LuckyListMarker from "@/components/LuckyListMarker";
import LuckyListPreviewSheet from "@/components/LuckyListPreviewSheet";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";

// Lucky List items with map positions (editorial placement)
const luckyListMarkers = [
  { id: "confeitaria-colombo", top: "20%", left: "60%" },
];

// Static restaurant data with tags for the list
const restaurantListData = [
  { id: "lasai", name: "Lasai", neighborhood: "botafogo", tag: "Alta Gastronomia" },
  { id: "oteque", name: "Oteque", neighborhood: "botafogo", tag: "Alta Gastronomia" },
  { id: "satyricon", name: "Satyricon", neighborhood: "leblon", tag: "Clássico" },
  { id: "mr-lam", name: "Mr. Lam", neighborhood: "leblon", tag: "Japonesa" },
  { id: "nido-ristorante", name: "Nido Ristorante", neighborhood: "ipanema", tag: "Italiana" },
  { id: "jobi", name: "Jobi", neighborhood: "ipanema", tag: "Boteco" },
  { id: "mee", name: "Mee", neighborhood: "copacabana", tag: "Alta Gastronomia" },
  { id: "cipriani", name: "Cipriani", neighborhood: "copacabana", tag: "Italiana" },
  { id: "braseiro-da-gavea", name: "Braseiro da Gávea", neighborhood: "gavea", tag: "Boteco" },
  { id: "chez-claude", name: "Chez Claude", neighborhood: "jardim-botanico", tag: "Francesa" },
  { id: "elena", name: "Elena", neighborhood: "jardim-botanico", tag: "Experiência" },
  { id: "academia-da-cachaca", name: "Academia da Cachaça", neighborhood: "leblon", tag: "Brasileira" },
];

const EatMapView = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Mock subscriber state - replace with actual auth logic
  const isSubscriber = false;

  const handleLockedTap = () => {
    setPreviewOpen(true);
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Fixed map width - reduced for less horizontal panning
  // Smaller value = more zoomed out overview, less dragging required
  const MAP_WIDTH = 900;

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
      {/* Header with Meu Roteiro access */}
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
        {/* Map content wrapper - fixed pixel width for consistent pan range */}
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

          {/* Tappable neighborhood markers - anchored to map coordinates */}
          {RIO_NEIGHBORHOODS.map((neighborhood) => (
            <Link
              key={neighborhood.id}
              to={`/onde-comer/${neighborhood.id}?from=map`}
              className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 hover:border-foreground/40 transition-colors flex items-center justify-center"
              style={{ top: neighborhood.mapPosition.top, left: neighborhood.mapPosition.left }}
              aria-label={`Explorar restaurantes em ${neighborhood.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-2 h-2 rounded-full bg-foreground/60" />
            </Link>
          ))}

          {/* Lucky List markers */}
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
          <div className="space-y-1">
            {restaurantListData.map((restaurant) => {
              const neighborhoodData = getNeighborhoodById(restaurant.neighborhood);
              const slug = restaurant.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");
              
              return (
                <Link
                  key={restaurant.id}
                  to={`/restaurante/${slug}?from=${restaurant.neighborhood}`}
                  className="flex items-center justify-between py-4 border-b border-border hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-foreground truncate">{restaurant.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{neighborhoodData?.name || restaurant.neighborhood}</p>
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
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>

      {/* Lucky List Preview Sheet */}
      <LuckyListPreviewSheet open={previewOpen} onOpenChange={setPreviewOpen} />
    </div>
  );
};

export default EatMapView;
