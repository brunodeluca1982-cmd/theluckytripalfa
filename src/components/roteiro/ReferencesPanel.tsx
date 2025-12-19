import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, User, Lock } from "lucide-react";
import { DayColumn } from "./DayColumn";
import { ReferenceDayColumn } from "./ReferenceDayColumn";
import { ItineraryItem } from "./ItineraryCard";
import { ReferenceItinerary, ReferenceDay } from "@/data/reference-itineraries";

/**
 * REFERENCES PANEL
 * 
 * Left panel = idea bank, not mandatory itinerary
 * 
 * Features:
 * - Toggle show/hide
 * - Source selector (multi-select)
 * - Curated content display
 * - Cards are draggable into user's itinerary
 */

interface Source {
  id: string;
  label: string;
  author?: string;
  isDefault?: boolean;
  isPremium?: boolean;
  isLocked?: boolean;
}

interface ReferencesPanelProps {
  sources: Source[];
  selectedSources: string[];
  onSourceToggle: (sourceId: string) => void;
  currentDay: number;
  curatedItems: ItineraryItem[];
  referenceItineraries: ReferenceItinerary[];
}

export const ReferencesPanel = ({
  sources,
  selectedSources,
  onSourceToggle,
  currentDay,
  curatedItems,
  referenceItineraries,
}: ReferencesPanelProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Get current reference if selected
  const selectedReference = referenceItineraries.find(r => 
    selectedSources.includes(r.id)
  );

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-muted/80 backdrop-blur-sm border border-border shadow-lg hover:bg-muted transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
        <span className="text-xs font-medium">Referências</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Referências
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Esconder
        </button>
      </div>

      {/* Source Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sources.map((source) => {
          const isSelected = selectedSources.includes(source.id);
          const isLocked = source.isLocked;
          
          return (
            <button
              key={source.id}
              onClick={() => !isLocked && onSourceToggle(source.id)}
              disabled={isLocked}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${isLocked 
                  ? 'bg-muted/50 text-muted-foreground cursor-not-allowed' 
                  : isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }
              `}
            >
              {source.isDefault ? (
                <Star className="w-3 h-3" />
              ) : isLocked ? (
                <Lock className="w-3 h-3" />
              ) : (
                <User className="w-3 h-3" />
              )}
              {source.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {selectedSources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Selecione uma fonte para ver sugestões</p>
          </div>
        ) : (
          <>
            {/* Lucky Trip curated content */}
            {selectedSources.includes('lucky-trip') && curatedItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Lucky Trip
                  </span>
                </div>
                <DayColumn
                  dayId={`curated-day-${currentDay}`}
                  dayNumber={currentDay}
                  items={curatedItems}
                  isUserColumn={false}
                />
              </div>
            )}

            {/* Reference itineraries */}
            {selectedReference && selectedReference.days[currentDay] && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {selectedReference.author}
                  </span>
                </div>
                <ReferenceDayColumn 
                  day={selectedReference.days[currentDay]} 
                  referenceId={selectedReference.id}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Hint */}
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          Arraste para a direita para adicionar
        </p>
      </div>
    </div>
  );
};

export default ReferencesPanel;
