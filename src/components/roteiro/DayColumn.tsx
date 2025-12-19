import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableItineraryCard, SortableItineraryCard, ItineraryItem } from "./ItineraryCard";
import { Hand } from "lucide-react";

/**
 * DAY COLUMN
 * 
 * STRUCTURAL LOCK — Container for a single day's activities
 * 
 * Two modes:
 * - SOURCE (isUserColumn=false): Read-only, items are draggable copies
 * - USER (isUserColumn=true): Editable, items are sortable and removable
 * 
 * EMPTY STATE:
 * - Calm, inviting message
 * - No pressure or urgency
 * - Clear instruction to drag
 */

interface DayColumnProps {
  dayId: string;
  dayNumber: number;
  items: ItineraryItem[];
  isUserColumn?: boolean;
  onRemoveItem?: (itemId: string) => void;
}

export const DayColumn = ({ 
  dayId, 
  dayNumber, 
  items, 
  isUserColumn = false,
  onRemoveItem,
}: DayColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ 
    id: dayId,
    data: { day: dayNumber, type: isUserColumn ? 'user' : 'source' },
  });

  return (
    <div className="flex-shrink-0 w-full">
      {/* Day Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-foreground">
          Dia {dayNumber}
        </h3>
        {isUserColumn && items.length > 0 && (
          <span className="text-[10px] text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </span>
        )}
      </div>

      {/* Drop Zone / Content Area */}
      <div
        ref={setNodeRef}
        className={`
          min-h-[280px] rounded-xl transition-all duration-200
          ${isUserColumn 
            ? isOver 
              ? 'bg-primary/10 border-2 border-dashed border-primary/40' 
              : 'bg-muted/20 border-2 border-dashed border-transparent'
            : 'bg-muted/30'
          }
          ${items.length === 0 ? 'flex items-center justify-center p-4' : 'p-2'}
        `}
      >
        {items.length > 0 ? (
          isUserColumn ? (
            // USER COLUMN: Sortable items
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {items.map((item) => (
                  <SortableItineraryCard 
                    key={item.id} 
                    item={item}
                    onRemove={() => onRemoveItem?.(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          ) : (
            // SOURCE COLUMN: Draggable items (copies)
            <div className="space-y-2">
              {items.map((item) => (
                <DraggableItineraryCard key={item.id} item={item} />
              ))}
            </div>
          )
        ) : (
          // EMPTY STATE
          <div className="text-center">
            {isUserColumn ? (
              <>
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Hand className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[120px] mx-auto">
                  Arraste atividades da esquerda para montar seu dia
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sem sugestões
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayColumn;
