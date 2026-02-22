import { Suspense, lazy, useCallback } from "react";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MapItem } from "./useItemCoordinates";

const LeafletPreviewMap = lazy(() => import("./LeafletPreviewMap"));

interface Props {
  items: MapItem[];
  onOpen: () => void;
}

export default function CategoryMapPreview({ items, onOpen }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <div
        className="relative rounded-[20px] overflow-hidden cursor-pointer h-[200px] md:h-[260px] bg-muted/40"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpen()}
      >
        <Suspense
          fallback={
            <Skeleton className="w-full h-full rounded-[20px]" />
          }
        >
          <LeafletPreviewMap items={items} />
        </Suspense>

        {/* Pill overlay */}
        <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-border">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          {items.length} {items.length === 1 ? "local" : "locais"}
        </div>

        {/* Tap hint */}
        <div className="absolute inset-0 z-[999] flex items-end justify-center pb-3 pointer-events-none">
          <span className="text-[10px] tracking-widest uppercase text-muted-foreground/70 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
            Toque para expandir
          </span>
        </div>
      </div>
    </div>
  );
}
