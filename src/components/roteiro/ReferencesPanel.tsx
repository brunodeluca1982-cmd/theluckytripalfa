import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Star, User, Lock, Users } from "lucide-react";
import { DayColumn } from "./DayColumn";
import { ReferenceDayColumn } from "./ReferenceDayColumn";
import { ItineraryItem } from "./ItineraryCard";
import { ReferenceItinerary, ReferenceDay } from "@/data/reference-itineraries";
import { getPartnersForDestination, Partner } from "@/data/partners-data";

/**
 * PARTNERS ON TRIP PANEL
 * 
 * Left panel displaying partner itineraries the user has access to.
 * 
 * RULES:
 * - Only show partner itineraries matching the destination(s) in the current trip
 * - Only show itineraries user has purchased or has access rights to
 * - Group by destination if multiple
 * - Collapsible panel
 * - Cards are draggable into user's itinerary
 */

interface Source {
  id: string;
  label: string;
  author?: string;
  isDefault?: boolean;
  isPremium?: boolean;
  isLocked?: boolean;
  destinationId?: string;
}

interface PartnersOnTripPanelProps {
  sources: Source[];
  selectedSources: string[];
  onSourceToggle: (sourceId: string) => void;
  currentDay: number;
  curatedItems: ItineraryItem[];
  referenceItineraries: ReferenceItinerary[];
  tripDestinationIds: string[]; // Destinations in the current trip
}

export const PartnersOnTripPanel = ({
  sources,
  selectedSources,
  onSourceToggle,
  currentDay,
  curatedItems,
  referenceItineraries,
  tripDestinationIds,
}: PartnersOnTripPanelProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Filter itineraries to only those matching trip destinations
  const filteredItineraries = useMemo(() => {
    return referenceItineraries.filter(r => 
      tripDestinationIds.includes(r.destinationId)
    );
  }, [referenceItineraries, tripDestinationIds]);

  // Filter sources to only those with itineraries for trip destinations
  const filteredSources = useMemo(() => {
    const validItineraryIds = new Set(filteredItineraries.map(r => r.id));
    return sources.filter(s => 
      s.isDefault || // Always show Lucky Trip
      s.isLocked || // Show locked sources (for awareness)
      validItineraryIds.has(s.id)
    );
  }, [sources, filteredItineraries]);

  // Get partners for the trip destinations
  const partnersForTrip = useMemo(() => {
    const allPartners: Partner[] = [];
    tripDestinationIds.forEach(destId => {
      const partners = getPartnersForDestination(destId);
      partners.forEach(p => {
        if (!allPartners.find(existing => existing.id === p.id)) {
          allPartners.push(p);
        }
      });
    });
    return allPartners;
  }, [tripDestinationIds]);

  // Get selected reference matching trip destinations
  const selectedReference = filteredItineraries.find(r => 
    selectedSources.includes(r.id)
  );

  // Group itineraries by destination for display
  const itinerariesByDestination = useMemo(() => {
    const grouped: Record<string, ReferenceItinerary[]> = {};
    filteredItineraries.forEach(itinerary => {
      if (!grouped[itinerary.destinationId]) {
        grouped[itinerary.destinationId] = [];
      }
      grouped[itinerary.destinationId].push(itinerary);
    });
    return grouped;
  }, [filteredItineraries]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-muted/80 backdrop-blur-sm border border-border shadow-lg hover:bg-muted transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
        <span className="text-xs font-medium">Partners</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Partners on Trip
          </h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Esconder
        </button>
      </div>

      {/* Partner/Source Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filteredSources.map((source) => {
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

      {/* Partners count info */}
      {partnersForTrip.length > 0 && (
        <div className="text-[10px] text-muted-foreground mb-3">
          {partnersForTrip.length} {partnersForTrip.length === 1 ? 'partner' : 'partners'} com roteiros para este destino
        </div>
      )}

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

// Keep backward-compatible alias
export const ReferencesPanel = PartnersOnTripPanel;
export default PartnersOnTripPanel;
