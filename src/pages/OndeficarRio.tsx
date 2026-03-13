import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RIO_NEIGHBORHOODS, getNeighborhoodById } from "@/data/rio-neighborhoods";
import { useExternalHotels } from "@/hooks/use-external-hotels";
import { useCityHero } from "@/contexts/CityHeroContext";
import NeighborhoodEditorialCard from "@/components/onde-ficar/NeighborhoodEditorialCard";

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
  const { data: externalHotels } = useExternalHotels();
  const { heroUrl } = useCityHero();
  const navigate = useNavigate();
  const hotelListRef = useRef<HTMLDivElement>(null);

  // Pan/zoom state
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const gestureRef = useRef({
    isPanning: false,
    startX: 0, startY: 0,
    lastX: 0, lastY: 0,
    initialDist: 0,
    initialScale: 0.7,
  });

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3.0;

  const clampTranslate = useCallback((tx: number, ty: number, s: number) => {
    const container = containerRef.current;
    if (!container) return { x: tx, y: ty };
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    // Inner content is 180% of container, then scaled
    const imgW = cw * 1.8 * s;
    const imgH = ch * 1.8 * s;
    const minX = Math.min(0, cw - imgW);
    const minY = Math.min(0, ch - imgH);
    return {
      x: Math.max(minX, Math.min(0, tx)),
      y: Math.max(minY, Math.min(0, ty)),
    };
  }, []);

  // Center map on load — zoomed in, centered horizontally
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const initScale = 0.7;
    const imgW = cw * initScale;
    const imgH = ch * initScale;
    setScale(initScale);
    setTranslate({
      x: (cw - imgW) / 2,
      y: (ch - imgH) / 2,
    });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      gestureRef.current.isPanning = true;
      gestureRef.current.startX = e.touches[0].clientX - translate.x;
      gestureRef.current.startY = e.touches[0].clientY - translate.y;
    } else if (e.touches.length === 2) {
      gestureRef.current.isPanning = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      gestureRef.current.initialDist = Math.hypot(dx, dy);
      gestureRef.current.initialScale = scale;
    }
  }, [translate, scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && gestureRef.current.isPanning) {
      const nx = e.touches[0].clientX - gestureRef.current.startX;
      const ny = e.touches[0].clientY - gestureRef.current.startY;
      setTranslate(clampTranslate(nx, ny, scale));
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, gestureRef.current.initialScale * (dist / gestureRef.current.initialDist)));
      setScale(newScale);
      setTranslate(prev => clampTranslate(prev.x, prev.y, newScale));
    }
  }, [scale, clampTranslate]);

  const handleTouchEnd = useCallback(() => {
    gestureRef.current.isPanning = false;
  }, []);

  // Desktop wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));
    setScale(newScale);
    setTranslate(prev => clampTranslate(prev.x, prev.y, newScale));
  }, [scale, clampTranslate]);

  // Desktop drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    gestureRef.current.isPanning = true;
    gestureRef.current.startX = e.clientX - translate.x;
    gestureRef.current.startY = e.clientY - translate.y;
  }, [translate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gestureRef.current.isPanning) return;
    const nx = e.clientX - gestureRef.current.startX;
    const ny = e.clientY - gestureRef.current.startY;
    setTranslate(clampTranslate(nx, ny, scale));
  }, [scale, clampTranslate]);

  const handleMouseUp = useCallback(() => {
    gestureRef.current.isPanning = false;
  }, []);

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
    <div className="min-h-screen bg-background relative">
      {/* Hero background — blurred, atmospheric */}
      {heroUrl && (
        <div className="fixed inset-0 z-0">
          <img
            src={heroUrl}
            alt=""
            className="w-full h-full object-cover opacity-30 blur-xl scale-110"
            draggable={false}
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>
      )}
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 relative z-10">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
      </header>

      {/* Header block */}
      <div className="px-6 pt-6 pb-4 relative z-10">
        <h1 className="text-2xl font-serif font-medium text-foreground">
          Onde faz mais sentido você ficar
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Escolha um bairro. A gente te ajuda a decidir onde ficar.
        </p>
      </div>

      {/* Interactive Map */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: "300px", touchAction: "none" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute origin-top-left"
          style={{
            width: "180%",
            height: "180%",
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            willChange: "transform",
          }}
        >
          <img
            src="/assets/maps/rio-3d-map.png"
            alt="Rio de Janeiro 3D Map"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />

          {/* Neighborhood pins */}
          {RIO_NEIGHBORHOODS.map((neighborhood) => {
            const isSelected = selectedNeighborhood === neighborhood.id;
            return (
              <button
                key={neighborhood.id}
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 hover:border-foreground/40 transition-colors flex items-center justify-center z-20"
                style={{ top: neighborhood.mapPosition.top, left: neighborhood.mapPosition.left }}
                aria-label={`Explorar hotéis em ${neighborhood.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSelected) {
                    navigate(`/onde-ficar/${neighborhood.id}?from=map`);
                  } else {
                    setSelectedNeighborhood(neighborhood.id);
                  }
                }}
              >
                {/* Halo ring */}
                {isSelected && (
                  <span className="absolute inset-0 -m-2 rounded-full bg-primary/20 border border-primary/30 animate-[halo-ping_0.5s_ease-out_forwards] pointer-events-none" />
                )}
                <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${isSelected ? "bg-primary" : "bg-foreground/60"}`} />
              </button>
            );
          })}
          {/* Selected neighborhood label */}
          {selectedNeighborhood && (() => {
            const n = RIO_NEIGHBORHOODS.find(nb => nb.id === selectedNeighborhood);
            if (!n) return null;
            return (
              <div
                className="absolute z-30 pointer-events-none animate-fade-in"
                style={{
                  top: n.mapPosition.top,
                  left: n.mapPosition.left,
                  transform: "translate(-50%, -140%)",
                }}
              >
                <span className="px-2 py-0.5 rounded-full bg-primary/80 text-primary-foreground text-[10px] font-medium whitespace-nowrap shadow-sm">
                  {n.name}
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Hint */}
      <div className="px-6 py-3 border-b border-white/10 relative z-10">
        <p className="text-xs text-muted-foreground">
          Arraste e dê zoom para explorar o mapa.
        </p>
      </div>

      {/* Editorial card overlay */}
      {selectedNeighborhood && (() => {
        const n = getNeighborhoodById(selectedNeighborhood);
        if (!n) return null;
        return (
          <NeighborhoodEditorialCard
            neighborhoodId={selectedNeighborhood}
            neighborhoodName={n.name}
            onViewHotels={() => {
              hotelListRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        );
      })()}

      {/* Hotel List */}
      <div className="px-6 py-6" ref={hotelListRef}>
        <h2 className="text-lg font-serif font-medium text-foreground mb-4">
          {selectedNeighborhood
            ? `Hotéis em ${getNeighborhoodById(selectedNeighborhood)?.name || selectedNeighborhood}`
            : "Hotéis"}
        </h2>

        <div className="space-y-6">
          {NEIGHBORHOOD_ORDER.filter(
            (nId) => !selectedNeighborhood || nId === selectedNeighborhood
          ).map((neighborhoodId) => {
            const neighborhoodHotels = hotelListData.filter(
              (h) => h.neighborhood === neighborhoodId
            );
            if (neighborhoodHotels.length === 0) return null;
            const neighborhoodData = getNeighborhoodById(neighborhoodId);

            return (
              <div key={neighborhoodId}>
                {!selectedNeighborhood && (
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    {neighborhoodData?.name || neighborhoodId}
                  </h3>
                )}
                <div className="space-y-1">
                  {neighborhoodHotels.map(renderHotelRow)}
                </div>
              </div>
            );
          })}
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
