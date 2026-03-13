import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { RIO_NEIGHBORHOODS } from "@/data/rio-neighborhoods";
import LuckyListMarker from "@/components/LuckyListMarker";
import LuckyListPreviewSheet from "@/components/LuckyListPreviewSheet";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";

// Lucky List items with map positions (editorial placement)
const luckyListMarkers = [
  { id: "sunset-pedra-bonita", top: "35%", left: "30%" },
  { id: "morning-swim-arpoador", top: "40%", left: "58%" },
];

const CityView = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const isSubscriber = false;

  const handleLockedTap = () => {
    setPreviewOpen(true);
  };

  // Map panning state
  const viewportRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [bounds, setBounds] = useState({ minX: 0, maxX: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, translateX: 0 });

  // Calculate bounds after image loads
  const handleImageLoad = useCallback(() => {
    if (viewportRef.current && layerRef.current) {
      const viewportWidth = viewportRef.current.clientWidth;
      const layerWidth = layerRef.current.scrollWidth;
      const minX = viewportWidth - layerWidth; // rightmost pan (shows Leme)
      const maxX = 0; // leftmost pan (shows Recreio)
      setBounds({ minX, maxX });
      // Center initially
      const initialX = minX / 2;
      setTranslateX(Math.min(maxX, Math.max(minX, initialX)));
    }
  }, []);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => handleImageLoad();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleImageLoad]);

  // Clamp helper
  const clamp = (value: number) => Math.min(bounds.maxX, Math.max(bounds.minX, value));

  // Pointer/Touch handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, translateX };
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const newX = dragStartRef.current.translateX + deltaX;
    setTranslateX(clamp(newX));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => handleDragEnd();

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX);
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX);
    }
  };
  const onTouchEnd = () => handleDragEnd();

  // Prevent wheel zoom
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
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

      {/* Map Viewport - fixed overflow, horizontal pan only */}
      <div 
        ref={viewportRef}
        className="relative w-full h-[65vh] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: "pan-x" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        {/* Map Layer - translated horizontally only, fixed scale */}
        <div 
          ref={layerRef}
          className="absolute top-0 left-0 h-full"
          style={{ 
            transform: `translate3d(${translateX}px, 0, 0)`,
            willChange: "transform"
          }}
        >
          {/* Map Image - fixed scale, no zoom */}
          <img 
            src="/assets/maps/rio-3d-map.png" 
            alt="Rio de Janeiro 3D Map"
            className="h-full w-auto max-w-none pointer-events-none"
            style={{ 
              userSelect: "none",
              WebkitUserDrag: "none",
              userDrag: "none"
            } as React.CSSProperties}
            draggable={false}
            onLoad={handleImageLoad}
          />

          {/* Tappable neighborhood markers - anchored to map coordinates */}
          {RIO_NEIGHBORHOODS.map((neighborhood) => (
            <Link
              key={neighborhood.id}
              to={`/onde-ficar/${neighborhood.id}?from=map`}
              className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 hover:border-foreground/40 transition-colors flex items-center justify-center"
              style={{ top: neighborhood.mapPosition.top, left: neighborhood.mapPosition.left }}
              aria-label={`Ver ${neighborhood.name}`}
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
      <div className="px-6 py-8">
        <p className="text-sm text-muted-foreground text-center">
          Toque em um bairro para explorar onde ficar
        </p>
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

export default CityView;
