import { useDroppable } from "@dnd-kit/core";
import { DraggableReferenceCard } from "./ReferenceItemCard";
import { ReferenceDay, ReferenceItem } from "@/data/reference-itineraries";
import { useDraggable } from "@dnd-kit/core";
import { GripHorizontal } from "lucide-react";

/**
 * REFERENCE DAY COLUMN
 * 
 * Displays a single day from a reference itinerary.
 * Items are draggable individually.
 * Full day block is also draggable as a group.
 * 
 * Read-only — dragging creates copies.
 */

interface ReferenceDayColumnProps {
  day: ReferenceDay;
  referenceId: string;
}

// Draggable day block header
const DraggableDayHeader = ({ day, referenceId }: { day: ReferenceDay; referenceId: string }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `day-block-${referenceId}-${day.dayNumber}`,
    data: { 
      type: 'day-block',
      day: day.dayNumber,
      items: day.items,
      referenceId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        flex items-center gap-2 mb-3 px-2 py-2 rounded-lg bg-muted/30 
        cursor-grab active:cursor-grabbing transition-all
        ${isDragging ? 'opacity-50 scale-95' : 'hover:bg-muted/50'}
      `}
    >
      <GripHorizontal className="w-4 h-4 text-muted-foreground/50" />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-foreground">
          {day.title}
        </h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
          {day.subtitle}
        </p>
      </div>
      <span className="text-[10px] text-muted-foreground">
        Arraste o dia
      </span>
    </div>
  );
};

export const ReferenceDayColumn = ({ day, referenceId }: ReferenceDayColumnProps) => {
  return (
    <div className="flex-shrink-0 w-full">
      {/* Draggable Day Header */}
      <DraggableDayHeader day={day} referenceId={referenceId} />

      {/* Items */}
      <div className="space-y-2">
        {day.items.map((item) => (
          <DraggableReferenceCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ReferenceDayColumn;
