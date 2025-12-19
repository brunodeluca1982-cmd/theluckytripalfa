import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, Sparkles, Star, Users } from "lucide-react";

/**
 * ITINERARY CARD
 * 
 * Draggable card for roteiro planning.
 * Shows activity details with category, duration, and source.
 */

export interface ItineraryItem {
  id: string;
  name: string;
  category: 'attraction' | 'food' | 'hotel' | 'experience';
  duration: string;
  source: 'lucky-trip' | 'partner' | 'ai' | 'user';
  imageUrl?: string;
  description?: string;
}

interface ItineraryCardProps {
  item: ItineraryItem;
  isDragging?: boolean;
  isOverlay?: boolean;
}

const categoryLabels: Record<ItineraryItem['category'], string> = {
  attraction: 'Atração',
  food: 'Gastronomia',
  hotel: 'Hospedagem',
  experience: 'Experiência',
};

const categoryColors: Record<ItineraryItem['category'], string> = {
  attraction: 'bg-blue-500/10 text-blue-600',
  food: 'bg-orange-500/10 text-orange-600',
  hotel: 'bg-purple-500/10 text-purple-600',
  experience: 'bg-green-500/10 text-green-600',
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
  'user': 'Você',
};

export const ItineraryCard = ({ item, isDragging, isOverlay }: ItineraryCardProps) => {
  return (
    <div
      className={`
        bg-card border border-border rounded-xl p-3 
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isOverlay ? 'shadow-xl rotate-2 scale-105' : 'shadow-sm hover:shadow-md'}
      `}
    >
      <div className="flex gap-3">
        {/* Square Image */}
        <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground truncate mb-1">
            {item.name}
          </h4>
          
          {/* Category Badge */}
          <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[item.category]}`}>
            {categoryLabels[item.category]}
          </span>
          
          {/* Meta Row */}
          <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.duration}
            </span>
            {item.source !== 'user' && (
              <span className="flex items-center gap-1">
                {sourceIcons[item.source]}
                {sourceLabels[item.source]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sortable wrapper for drag-and-drop
export const SortableItineraryCard = ({ item }: { item: ItineraryItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

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
      <ItineraryCard item={item} isDragging={isDragging} />
    </div>
  );
};

export default ItineraryCard;
