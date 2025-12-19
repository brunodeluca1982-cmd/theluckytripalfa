import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, MapPin, GripVertical, AlertTriangle, Utensils, Building, Sparkles, Star } from "lucide-react";
import { ItineraryItem } from "./ItineraryCard";

/**
 * TIMELINE ACTIVITY CARD
 * 
 * Activity card designed for vertical timeline view.
 * Shows time, image, name, duration, category.
 * Highlights inconsistencies when detected.
 */

interface TimelineActivityCardProps {
  item: ItineraryItem & {
    startTime?: string;
    endTime?: string;
    hasConflict?: boolean;
    conflictMessage?: string;
  };
  isDragging?: boolean;
  isOverlay?: boolean;
  onTap?: () => void;
  onRemove?: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  attraction: MapPin,
  food: Utensils,
  hotel: Building,
  experience: Sparkles,
  custom: Star,
};

const categoryColors: Record<string, string> = {
  attraction: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  food: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  hotel: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  experience: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  custom: 'bg-muted text-muted-foreground border-border',
};

export const TimelineActivityCard = ({
  item,
  isDragging,
  isOverlay,
  onTap,
  onRemove,
}: TimelineActivityCardProps) => {
  const CategoryIcon = categoryIcons[item.category] || Star;

  return (
    <div
      onClick={onTap}
      className={`
        relative flex gap-3 p-3 rounded-xl bg-card border transition-all duration-200 cursor-pointer group
        ${isDragging ? 'opacity-40 scale-95' : ''}
        ${isOverlay ? 'shadow-2xl scale-105 border-primary/50 rotate-1' : 'shadow-sm hover:shadow-md border-border'}
        ${item.hasConflict ? 'border-destructive/50 bg-destructive/5' : ''}
      `}
    >
      {/* Time Column */}
      {item.startTime && (
        <div className="flex-shrink-0 w-14 text-center">
          <p className="text-sm font-semibold text-foreground">{item.startTime}</p>
          {item.endTime && (
            <p className="text-[10px] text-muted-foreground">{item.endTime}</p>
          )}
        </div>
      )}

      {/* Image */}
      <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <CategoryIcon className="w-6 h-6 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate mb-1">
          {item.name || item.title}
        </h4>
        
        {/* Category Badge */}
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColors[item.category]}`}>
          <CategoryIcon className="w-2.5 h-2.5" />
          {item.category === 'attraction' ? 'Atração' :
           item.category === 'food' ? 'Gastronomia' :
           item.category === 'hotel' ? 'Hospedagem' :
           item.category === 'experience' ? 'Experiência' : 'Local'}
        </span>

        {/* Duration */}
        {(item.duration || item.time) && (
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {item.duration || item.time}
          </div>
        )}

        {/* Conflict Warning */}
        {item.hasConflict && item.conflictMessage && (
          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-destructive">
            <AlertTriangle className="w-3 h-3" />
            {item.conflictMessage}
          </div>
        )}
      </div>

      {/* Drag Handle */}
      <div className="flex-shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-muted-foreground/50" />
      </div>
    </div>
  );
};

// Sortable version for drag and drop
export const SortableTimelineCard = ({
  item,
  onTap,
  onRemove,
}: {
  item: ItineraryItem & { startTime?: string; endTime?: string; hasConflict?: boolean; conflictMessage?: string };
  onTap?: () => void;
  onRemove?: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { item, type: 'timeline' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation"
    >
      <TimelineActivityCard
        item={item}
        isDragging={isDragging}
        onTap={onTap}
        onRemove={onRemove}
      />
    </div>
  );
};

export default TimelineActivityCard;
