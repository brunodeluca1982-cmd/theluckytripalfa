import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RIO_NEIGHBORHOODS, getNeighborhoodById } from "@/data/rio-neighborhoods";
import LuckyListMarker from "@/components/LuckyListMarker";
import LuckyListPreviewSheet from "@/components/LuckyListPreviewSheet";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import NeighborhoodDetailSheet from "@/components/eat/NeighborhoodDetailSheet";
import { useExternalRestaurants, normalizeNeighborhood } from "@/hooks/use-external-restaurants";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { getRestaurantImage } from "@/data/place-images";

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

// Small thumbnail row for the restaurant list
function RestaurantRow({
  id,
  name,
  neighborhood,
  tag,
}: {
  id: string;
  name: string;
  neighborhood: string;
  tag: string;
}) {
  const placeQuery = buildPlaceQuery(name, neighborhood);
  const { photoUrl } = usePlacePhoto(id, "restaurant", placeQuery);
  const fallback = getRestaurantImage(neighborhood);
  const thumb = photoUrl || fallback;

  return (
    <Link
      to={`/restaurante/${id}?from=${neighborhood}`}
      className="flex items-center gap-3 py-3 border-b border-border hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
        {thumb ? (
          <img
            src={thumb}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-lg text-muted-foreground/30">{name.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Name + tag */}
      <div className="flex-1 min-w-0">
        <p className="text-base text-foreground truncate">{name}</p>
        {tag && (
          <p className="text-xs text-muted-foreground/70 truncate">{tag}</p>
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
    </Link>
  );
}

const EatMapView = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [neighborhoodSheetOpen, setNeighborhoodSheetOpen] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const { data: externalRestaurants, isLoading } = useExternalRestaurants();

  const isSubscriber = false;

  // Pan/zoom state (same pattern as OndeficarRio)
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
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
    const imgW = cw * 1.8 * s;
    const imgH = ch * 1.8 * s;
    const minX = Math.min(0, cw - imgW);
    const minY = Math.min(0, ch - imgH);
    return {
      x: Math.max(minX, Math.min(0, tx)),
      y: Math.max(minY, Math.min(0, ty)),
    };
  }, []);

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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));
    setScale(newScale);
    setTranslate(prev => clampTranslate(prev.x, prev.y, newScale));
  }, [scale, clampTranslate]);

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

      {/* Interactive Map (same pattern as OndeficarRio) */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing flex-shrink-0"
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
            src="/assets/maps/rio-3d-map-eat.png"
            alt="Rio de Janeiro 3D Map"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />

          {RIO_NEIGHBORHOODS.map((neighborhood) => (
            <button
              key={neighborhood.id}
              onClick={(e) => {
                e.stopPropagation();
                handleNeighborhoodTap(neighborhood.id);
              }}
              className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 hover:border-foreground/40 transition-colors flex items-center justify-center z-20"
              style={{ top: neighborhood.mapPosition.top, left: neighborhood.mapPosition.left }}
              aria-label={`Ver restaurantes em ${neighborhood.name}`}
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

      {/* Hint */}
      <div className="px-6 py-3 border-b border-border">
        <p className="text-xs text-muted-foreground text-center">
          Arraste e dê zoom para navegar no mapa.
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
                      {neighborhoodRestaurants.map((restaurant) => (
                        <RestaurantRow
                          key={restaurant.id}
                          id={restaurant.id}
                          name={restaurant.name}
                          neighborhood={restaurant.neighborhood}
                          tag={restaurant.tag}
                        />
                      ))}
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
