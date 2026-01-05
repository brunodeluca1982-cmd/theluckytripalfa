/**
 * TRAVEL INDICATOR
 * 
 * Shows distance and travel time between consecutive itinerary items.
 * Displays warning icon if there's a potential issue.
 * Purely informational - never blocks user actions.
 */

import { Car, Footprints, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TravelSegment, CoherenceWarning } from "@/hooks/use-itinerary-coherence";

interface TravelIndicatorProps {
  segment: TravelSegment | null;
  warning?: CoherenceWarning;
  className?: string;
}

export const TravelIndicator = ({
  segment,
  warning,
  className,
}: TravelIndicatorProps) => {
  if (!segment) return null;

  const hasWarning = !!warning;
  const isLongTravel = segment.durationMin > 30;

  return (
    <div className={cn(
      "flex items-center gap-2 py-1.5 px-3 -mx-2 rounded-lg",
      hasWarning && "bg-amber-500/5",
      className
    )}>
      {/* Mode icon */}
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center",
        hasWarning ? "bg-amber-500/20 text-amber-600" : "bg-muted text-muted-foreground"
      )}>
        {segment.mode === 'walking' ? (
          <Footprints className="w-3 h-3" />
        ) : (
          <Car className="w-3 h-3" />
        )}
      </div>
      
      {/* Time and distance */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className={cn(
          "font-medium",
          hasWarning && "text-amber-600 dark:text-amber-400",
          isLongTravel && !hasWarning && "text-foreground"
        )}>
          {segment.durationText}
        </span>
        <span className="text-muted-foreground/50">•</span>
        <span>{segment.distanceKm} km</span>
      </div>
      
      {/* Warning indicator */}
      {hasWarning && (
        <div className="ml-auto flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] text-amber-600 dark:text-amber-400 hidden sm:inline">
            {warning.type === 'time_overlap' ? 'Apertado' : 'Longe'}
          </span>
        </div>
      )}
    </div>
  );
};

export default TravelIndicator;
