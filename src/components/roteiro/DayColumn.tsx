import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItineraryCard, ItineraryItem } from "./ItineraryCard";
import { Plus } from "lucide-react";

/**
 * DAY COLUMN
 * 
 * A single day's activities within a roteiro column.
 * Supports drag-and-drop reordering and receiving items.
 */

interface DayColumnProps {
  dayId: string;
  dayNumber: number;
  items: ItineraryItem[];
  isUserColumn?: boolean;
  onAddItem?: () => void;
}

export const DayColumn = ({ 
  dayId, 
  dayNumber, 
  items, 
  isUserColumn = false,
  onAddItem 
}: DayColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: dayId });

  return (
    <div className="flex-shrink-0 w-full">
      {/* Day Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-semibold text-foreground">
          Dia {dayNumber}
        </h3>
        {isUserColumn && onAddItem && (
          <button
            onClick={onAddItem}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Adicionar
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          min-h-[200px] rounded-xl p-2 transition-colors duration-200
          ${isOver ? 'bg-primary/5 border-2 border-dashed border-primary/30' : 'bg-muted/30'}
          ${items.length === 0 ? 'flex items-center justify-center' : ''}
        `}
      >
        {items.length > 0 ? (
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((item) => (
                <SortableItineraryCard key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        ) : (
          <p className="text-xs text-muted-foreground text-center px-4">
            {isUserColumn 
              ? "Arraste atividades aqui ou toque em adicionar"
              : "Nenhuma atividade para este dia"
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default DayColumn;
