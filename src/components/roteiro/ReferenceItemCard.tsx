import { useDraggable } from "@dnd-kit/core";
import { Clock, Star, User } from "lucide-react";
import { ReferenceItem } from "@/data/reference-itineraries";

/**
 * REFERENCE ITEM CARD
 * 
 * Card specifically for reference itinerary items.
 * Shows time, editorial content, and source attribution.
 * 
 * Always draggable — creates a copy when dropped.
 */

interface ReferenceItemCardProps {
  item: ReferenceItem;
  isDragging?: boolean;
  isOverlay?: boolean;
}

const categoryColors: Record<string, string> = {
  attraction: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  food: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  hotel: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  experience: 'bg-green-500/10 text-green-600 dark:text-green-400',
};

const categoryLabels: Record<string, string> = {
  attraction: 'Atração',
  food: 'Gastronomia',
  hotel: 'Hospedagem',
  experience: 'Experiência',
};

export const ReferenceItemCard = ({ item, isDragging, isOverlay }: ReferenceItemCardProps) => {
  return (
    <div
      className={`
        bg-card border border-border rounded-xl p-3 
        transition-all duration-200
        ${isDragging ? 'opacity-40 scale-95' : ''}
        ${isOverlay ? 'shadow-2xl rotate-2 scale-105 border-primary/50' : 'shadow-sm hover:shadow-md'}
      `}
    >
      <div className="flex gap-3">
        {/* Time badge or image */}
        <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : item.time ? (
            <div className="text-center">
              <span className="text-xs font-semibold text-foreground">{item.time}</span>
            </div>
          ) : (
            <span className="text-muted-foreground/40 text-lg">
              {item.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground leading-tight mb-1">
            {item.name}
          </h4>
          
          {/* Category Badge */}
          <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[item.category]}`}>
            {categoryLabels[item.category]}
          </span>
          
          {/* Editorial (if exists) */}
          {item.editorial && (
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
              {item.editorial.split('\n')[0]}
            </p>
          )}
          
          {/* Meta Row */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Draggable wrapper
export const DraggableReferenceCard = ({ item }: { item: ReferenceItem }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: { item, type: 'reference' },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="touch-manipulation cursor-grab active:cursor-grabbing"
    >
      <ReferenceItemCard item={item} isDragging={isDragging} />
    </div>
  );
};

export default ReferenceItemCard;
