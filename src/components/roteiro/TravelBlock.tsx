import { Car, PersonStanding, AlertTriangle } from "lucide-react";

/**
 * TRAVEL BLOCK
 * 
 * Visual connector between activities showing:
 * - Distance in km
 * - Estimated travel time
 * - Travel mode (walking/driving)
 * - Warning if travel seems impossible
 */

interface TravelBlockProps {
  distanceKm: number;
  durationMinutes: number;
  isImpossible?: boolean;
  warningMessage?: string;
}

export const TravelBlock = ({
  distanceKm,
  durationMinutes,
  isImpossible,
  warningMessage,
}: TravelBlockProps) => {
  const isWalkable = distanceKm <= 1.5;
  const TravelIcon = isWalkable ? PersonStanding : Car;
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  };

  return (
    <div className={`
      relative flex items-center gap-2 py-2 px-3 my-1 mx-4
      ${isImpossible ? 'bg-destructive/5' : 'bg-transparent'}
    `}>
      {/* Vertical line connector */}
      <div className={`
        absolute left-[30px] top-0 bottom-0 w-px
        ${isImpossible ? 'bg-destructive/30' : 'bg-border'}
      `} />
      
      {/* Content */}
      <div className={`
        relative z-10 flex items-center gap-2 px-2 py-1 rounded-full text-[10px]
        ${isImpossible 
          ? 'bg-destructive/10 text-destructive border border-destructive/20' 
          : 'bg-muted/50 text-muted-foreground border border-border/50'
        }
      `}>
        {isImpossible ? (
          <AlertTriangle className="w-3 h-3" />
        ) : (
          <TravelIcon className="w-3 h-3" />
        )}
        <span>{distanceKm.toFixed(1)} km</span>
        <span className="opacity-50">•</span>
        <span>{formatDuration(durationMinutes)}</span>
      </div>

      {/* Warning tooltip */}
      {isImpossible && warningMessage && (
        <span className="text-[9px] text-destructive">
          {warningMessage}
        </span>
      )}
    </div>
  );
};

export default TravelBlock;
