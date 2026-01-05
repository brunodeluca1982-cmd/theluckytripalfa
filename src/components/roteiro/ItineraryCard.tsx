import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, Sparkles, Star, Users, GripVertical, Trash2 } from "lucide-react";

/**
 * ITINERARY CARD
 * 
 * STRUCTURAL LOCK — Card component for roteiro items
 * 
 * Each card displays:
 * - Square image (or placeholder)
 * - Name
 * - Category badge
 * - Duration
 * - Source indicator
 * 
 * Behavior:
 * - In SOURCE column: draggable, read-only
 * - In USER column: sortable, deletable
 */

export interface ItineraryItem {
  id: string;
  name?: string;
  title?: string; // Alternative to name for compatibility
  category: 'attraction' | 'food' | 'hotel' | 'experience' | 'custom';
  duration?: string;
  time?: string; // Alternative to duration
  source?: 'lucky-trip' | 'partner' | 'ai' | 'user';
  imageUrl?: string;
  description?: string;
  location?: string;
  // Curator attribution (required for AI-generated itineraries)
  curatorId?: string;
  curatorName?: string;
  neighborhood?: string;
  // Google Places data for custom items
  placeId?: string;
  lat?: number;
  lng?: number;
  // Editable time slots
  startTime?: string;
  endTime?: string;
  // External place flag (from Google, not curated)
  isExternal?: boolean;
}

interface ItineraryCardProps {
  item: ItineraryItem;
  isDragging?: boolean;
  isOverlay?: boolean;
  isUserColumn?: boolean;
  onRemove?: () => void;
}

const categoryLabels: Record<ItineraryItem['category'], string> = {
  attraction: 'Atração',
  food: 'Gastronomia',
  hotel: 'Hospedagem',
  experience: 'Experiência',
  custom: 'Local Adicionado',
};

const categoryColors: Record<ItineraryItem['category'], string> = {
  attraction: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  food: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  hotel: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  experience: 'bg-green-500/10 text-green-600 dark:text-green-400',
  custom: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
};

const sourceIcons: Record<ItineraryItem['source'], React.ReactNode> = {
  'lucky-trip': <Star className="w-3 h-3" />,
  'partner': <Users className="w-3 h-3" />,
  'ai': <Sparkles className="w-3 h-3" />,
  'user': null,
};

const sourceLabels: Record<ItineraryItem['source'], string> = {
  'lucky-trip': 'Lucky Trip',
  'partner': 'Parceiro',
  'ai': 'IA',
  'user': '',
};

export const ItineraryCard = ({ 
  item, 
  isDragging, 
  isOverlay,
  isUserColumn,
  onRemove 
}: ItineraryCardProps) => {
  return (
    <div
      className={`
        bg-card border border-border rounded-xl p-3 
        transition-all duration-200 group
        ${isDragging ? 'opacity-40 scale-95' : ''}
        ${isOverlay ? 'shadow-2xl rotate-3 scale-105 border-primary/50' : 'shadow-sm hover:shadow-md'}
      `}
    >
      <div className="flex gap-3">
        {/* Drag Handle for user column */}
        {isUserColumn && (
          <div className="flex-shrink-0 flex items-center text-muted-foreground/50">
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        {/* Square Image */}
        <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <span className="text-muted-foreground/40 text-lg">
                {(item.name || item.title || '?').charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground truncate mb-1">
            {item.name || item.title}
          </h4>
          
          {/* Category Badge */}
          <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[item.category]}`}>
            {categoryLabels[item.category]}
          </span>
          
          {/* Meta Row */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
            {(item.duration || item.time) && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.duration || item.time}
              </span>
            )}
            {/* Curator Badge — Shows "By [Name]" if curator is set */}
            {item.curatorName ? (
              <span className="flex items-center gap-1 text-primary/80 font-medium">
                <Users className="w-3 h-3" />
                By {item.curatorName.split(' ')[0]}
              </span>
            ) : item.source && item.source !== 'user' && sourceLabels[item.source] && (
              <span className="flex items-center gap-1 text-primary/70">
                {sourceIcons[item.source]}
                {sourceLabels[item.source]}
              </span>
            )}
          </div>
          {/* Location/Neighborhood if available */}
          {(item.neighborhood || item.location) && (
            <p className="text-[9px] text-muted-foreground/70 mt-0.5 truncate">
              {item.neighborhood || item.location}
            </p>
          )}
        </div>

        {/* Remove button for user column */}
        {isUserColumn && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-destructive"
            aria-label="Remover"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Draggable card for SOURCE column (read-only, drag to copy)
export const DraggableItineraryCard = ({ item }: { item: ItineraryItem }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: { item, type: 'source' },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="touch-manipulation cursor-grab active:cursor-grabbing"
    >
      <ItineraryCard item={item} isDragging={isDragging} isUserColumn={false} />
    </div>
  );
};

// Sortable card for USER column (editable, reorderable)
export const SortableItineraryCard = ({ 
  item,
  onRemove 
}: { 
  item: ItineraryItem;
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
    data: { item, type: 'user' },
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
      className="touch-manipulation cursor-grab active:cursor-grabbing"
    >
      <ItineraryCard 
        item={item} 
        isDragging={isDragging} 
        isUserColumn={true}
        onRemove={onRemove}
      />
    </div>
  );
};

export default ItineraryCard;
