import { useState, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableTimelineCard } from "./TimelineActivityCard";
import { TravelBlock } from "./TravelBlock";
import { ActivityDetailSheet } from "./ActivityDetailSheet";
import { ItineraryItem } from "./ItineraryCard";
import { AddActivityButton } from "./AddActivityButton";
import { PlaceData } from "./GooglePlacesAutocomplete";
import { Hand, AlertTriangle } from "lucide-react";

/**
 * MULTI-DAY TIMELINE
 * 
 * Horizontal scroll view showing all days side-by-side.
 * Each day is a vertical timeline with time blocks.
 * Supports drag between days (horizontal) and reorder within (vertical).
 */

interface ActivityWithMeta extends ItineraryItem {
  startTime?: string;
  endTime?: string;
  hasConflict?: boolean;
  conflictMessage?: string;
}

interface TravelInfo {
  distanceKm: number;
  durationMinutes: number;
  isImpossible: boolean;
  warningMessage?: string;
}

interface DayData {
  dayNumber: number;
  activities: ActivityWithMeta[];
  travelBlocks: (TravelInfo | null)[];
  hasIssues: boolean;
  issueCount: number;
  weatherIcon?: string;
  weatherLabel?: string;
}

interface MultiDayTimelineProps {
  days: DayData[];
  onRemoveItem: (day: number, itemId: string) => void;
  onActivityTap?: (item: ItineraryItem, day: number) => void;
  onAddManual?: (name: string, day: number) => void;
  onAddFromGoogle?: (place: PlaceData, day: number) => void;
  onAddWithAI?: (prompt: string, day: number) => void;
  onShowCuratedPicker?: (day: number) => void;
  highlightedItemId?: string | null;
}

// Single Day Column in the timeline
const DayTimelineColumn = ({
  dayData,
  onRemoveItem,
  onActivityTap,
  onAddManual,
  onAddFromGoogle,
  onAddWithAI,
  onShowCuratedPicker,
  highlightedItemId,
}: {
  dayData: DayData;
  onRemoveItem: (itemId: string) => void;
  onActivityTap?: (item: ItineraryItem) => void;
  onAddManual?: (name: string, day: number) => void;
  onAddFromGoogle?: (place: PlaceData, day: number) => void;
  onAddWithAI?: (prompt: string, day: number) => void;
  onShowCuratedPicker?: (day: number) => void;
  highlightedItemId?: string | null;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `timeline-day-${dayData.dayNumber}`,
    data: { day: dayData.dayNumber, type: 'timeline' },
  });

  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleTap = useCallback((item: ItineraryItem) => {
    setSelectedItem(item);
    setDetailOpen(true);
    onActivityTap?.(item);
  }, [onActivityTap]);

  return (
    <div className="flex-shrink-0 w-[280px] md:w-[320px]">
      {/* Day Header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{dayData.dayNumber}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Dia {dayData.dayNumber}
              {dayData.weatherIcon && (
                <span className="ml-1.5 text-xs font-normal opacity-80">
                  {dayData.weatherIcon}
                </span>
              )}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              {dayData.activities.length} {dayData.activities.length === 1 ? 'atividade' : 'atividades'}
              {dayData.weatherLabel && (
                <span className="ml-1 opacity-70">· {dayData.weatherLabel}</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Issue Badge */}
          {dayData.hasIssues && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium">
              <AlertTriangle className="w-3 h-3" />
              {dayData.issueCount}
            </div>
          )}
          
          {/* Add Activity Button */}
          <AddActivityButton
            dayNumber={dayData.dayNumber}
            onAddManual={onAddManual}
            onAddFromGoogle={onAddFromGoogle}
            onAddWithAI={onAddWithAI}
            onShowCuratedPicker={onShowCuratedPicker}
          />
        </div>
      </div>

      {/* Timeline Content */}
      <div
        ref={setNodeRef}
        className={`
          min-h-[400px] rounded-xl transition-all duration-200 p-2
          ${isOver 
            ? 'bg-primary/10 border-2 border-dashed border-primary/40' 
            : 'bg-muted/20 border border-border/50'
          }
        `}
      >
        {dayData.activities.length > 0 ? (
          <SortableContext
            items={dayData.activities.map(a => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0">
              {dayData.activities.map((activity, index) => (
                <div 
                  key={activity.id}
                  className={highlightedItemId === activity.id ? 'drop-highlight rounded-lg' : ''}
                >
                  <SortableTimelineCard
                    item={activity}
                    onTap={() => handleTap(activity)}
                    onRemove={() => onRemoveItem(activity.id)}
                  />
                  
                  {/* Travel block between activities */}
                  {dayData.travelBlocks[index] && (
                    <TravelBlock
                      distanceKm={dayData.travelBlocks[index]!.distanceKm}
                      durationMinutes={dayData.travelBlocks[index]!.durationMinutes}
                      isImpossible={dayData.travelBlocks[index]!.isImpossible}
                      warningMessage={dayData.travelBlocks[index]!.warningMessage}
                    />
                  )}
                </div>
              ))}
            </div>
          </SortableContext>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <Hand className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-xs text-muted-foreground max-w-[160px]">
              Arraste atividades aqui para montar seu dia
            </p>
          </div>
        )}
      </div>

      {/* Activity Detail Sheet */}
      <ActivityDetailSheet
        item={selectedItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onRemove={() => {
          if (selectedItem) {
            onRemoveItem(selectedItem.id);
          }
        }}
      />
    </div>
  );
};

export const MultiDayTimeline = ({
  days,
  onRemoveItem,
  onActivityTap,
  onAddManual,
  onAddFromGoogle,
  onAddWithAI,
  onShowCuratedPicker,
  highlightedItemId,
}: MultiDayTimelineProps) => {
  const totalIssues = days.reduce((acc, day) => acc + day.issueCount, 0);

  return (
    <div className="w-full">
      {/* Issue Warning Banner */}
      {totalIssues > 0 && (
        <div className="mx-4 mb-4 p-3 rounded-xl bg-destructive/5 border border-destructive/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {totalIssues} {totalIssues === 1 ? 'inconsistência detectada' : 'inconsistências detectadas'}
            </p>
            <p className="text-xs text-muted-foreground">
              Alguns horários ou distâncias podem precisar de ajuste
            </p>
          </div>
        </div>
      )}

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {days.map((dayData) => (
            <DayTimelineColumn
              key={dayData.dayNumber}
              dayData={dayData}
              onRemoveItem={(itemId) => onRemoveItem(dayData.dayNumber, itemId)}
              onActivityTap={(item) => onActivityTap?.(item, dayData.dayNumber)}
              onAddManual={onAddManual}
              onAddFromGoogle={onAddFromGoogle}
              onAddWithAI={onAddWithAI}
              onShowCuratedPicker={onShowCuratedPicker}
              highlightedItemId={highlightedItemId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiDayTimeline;
