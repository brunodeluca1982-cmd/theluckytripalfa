import { useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Columns } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DayColumn } from "@/components/roteiro/DayColumn";
import { DaySwiper } from "@/components/roteiro/DaySwiper";
import { ItineraryCard, ItineraryItem } from "@/components/roteiro/ItineraryCard";
import { AIAssistantFAB } from "@/components/roteiro/AIAssistantFAB";
import { toast } from "@/hooks/use-toast";

/**
 * ROTEIRO PLANNER
 * 
 * Dual-column itinerary planning interface.
 * Left: Curated Lucky Trip itinerary (read-only source)
 * Right: User's personal itinerary (editable)
 * 
 * Features:
 * - Drag cards from source to user column
 * - Reorder within days
 * - Swipe between days
 * - AI assistant for suggestions
 */

// Sample curated itinerary data
const sampleCuratedItinerary: Record<number, ItineraryItem[]> = {
  1: [
    { id: 'c1', name: 'Cristo Redentor', category: 'attraction', duration: '3h', source: 'lucky-trip', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=200' },
    { id: 'c2', name: 'Confeitaria Colombo', category: 'food', duration: '1h30', source: 'lucky-trip', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200' },
    { id: 'c3', name: 'Pão de Açúcar', category: 'attraction', duration: '2h', source: 'lucky-trip', imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=200' },
  ],
  2: [
    { id: 'c4', name: 'Praia de Ipanema', category: 'experience', duration: '4h', source: 'lucky-trip', imageUrl: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=200' },
    { id: 'c5', name: 'Feira de Ipanema', category: 'experience', duration: '2h', source: 'partner' },
    { id: 'c6', name: 'Restaurante Zuka', category: 'food', duration: '2h', source: 'lucky-trip' },
  ],
  3: [
    { id: 'c7', name: 'Jardim Botânico', category: 'attraction', duration: '3h', source: 'lucky-trip', imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=200' },
    { id: 'c8', name: 'Lagoa Rodrigo de Freitas', category: 'experience', duration: '2h', source: 'ai' },
    { id: 'c9', name: 'Copacabana Palace', category: 'hotel', duration: 'Noite', source: 'partner' },
  ],
};

const RoteiroPlanner = () => {
  const { destinationId = 'rio-de-janeiro' } = useParams();
  const destinationName = destinationId === 'rio-de-janeiro' ? 'Rio de Janeiro' : destinationId;
  
  const [currentDay, setCurrentDay] = useState(1);
  const [totalDays] = useState(3);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<ItineraryItem | null>(null);
  
  // User's itinerary state
  const [userItinerary, setUserItinerary] = useState<Record<number, ItineraryItem[]>>({
    1: [],
    2: [],
    3: [],
  });

  // Curated itinerary (read-only)
  const [curatedItinerary] = useState<Record<number, ItineraryItem[]>>(sampleCuratedItinerary);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string): { container: 'curated' | 'user'; day: number } | null => {
    // Check curated
    for (const day of Object.keys(curatedItinerary)) {
      if (curatedItinerary[Number(day)].some(item => item.id === id)) {
        return { container: 'curated', day: Number(day) };
      }
    }
    // Check user
    for (const day of Object.keys(userItinerary)) {
      if (userItinerary[Number(day)].some(item => item.id === id)) {
        return { container: 'user', day: Number(day) };
      }
    }
    return null;
  };

  const findItem = (id: string): ItineraryItem | null => {
    for (const day of Object.keys(curatedItinerary)) {
      const item = curatedItinerary[Number(day)].find(i => i.id === id);
      if (item) return item;
    }
    for (const day of Object.keys(userItinerary)) {
      const item = userItinerary[Number(day)].find(i => i.id === id);
      if (item) return item;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveItem(findItem(active.id as string));
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic for visual feedback
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setActiveItem(null);

    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overId = over.id as string;
    
    // Determine target day from droppable ID (e.g., "user-day-1")
    const isUserDayDrop = overId.startsWith('user-day-');
    const targetDay = isUserDayDrop ? parseInt(overId.replace('user-day-', '')) : currentDay;

    if (!activeContainer) return;

    // If dragging from curated to user column
    if (activeContainer.container === 'curated' && isUserDayDrop) {
      const item = findItem(active.id as string);
      if (!item) return;

      // Check if already in user itinerary
      const alreadyAdded = Object.values(userItinerary).some(
        dayItems => dayItems.some(i => i.id === item.id)
      );

      if (alreadyAdded) {
        toast({
          title: "Já adicionado",
          description: `${item.name} já está no seu roteiro.`,
        });
        return;
      }

      // Add to user itinerary with new ID to allow multiple instances
      const newItem = { ...item, id: `user-${item.id}-${Date.now()}`, source: 'user' as const };
      setUserItinerary(prev => ({
        ...prev,
        [targetDay]: [...prev[targetDay], newItem],
      }));

      toast({
        title: "Adicionado ao roteiro",
        description: `${item.name} foi adicionado ao Dia ${targetDay}.`,
      });
    }

    // If reordering within user column
    if (activeContainer.container === 'user') {
      const overContainer = findContainer(over.id as string);
      
      if (overContainer?.container === 'user') {
        const oldDay = activeContainer.day;
        const newDay = overContainer.day;
        
        if (oldDay === newDay) {
          // Reorder within same day
          const oldIndex = userItinerary[oldDay].findIndex(i => i.id === active.id);
          const newIndex = userItinerary[newDay].findIndex(i => i.id === over.id);
          
          if (oldIndex !== newIndex) {
            setUserItinerary(prev => ({
              ...prev,
              [oldDay]: arrayMove(prev[oldDay], oldIndex, newIndex),
            }));
          }
        } else {
          // Move between days
          const item = userItinerary[oldDay].find(i => i.id === active.id);
          if (item) {
            setUserItinerary(prev => ({
              ...prev,
              [oldDay]: prev[oldDay].filter(i => i.id !== active.id),
              [newDay]: [...prev[newDay], item],
            }));
          }
        }
      }
    }
  };

  const handleAISuggest = useCallback(() => {
    toast({
      title: "Sugestões da IA",
      description: "Analisando seu roteiro para sugestões personalizadas...",
    });
  }, []);

  const handleAutoFill = useCallback(() => {
    // Auto-fill empty days with curated content
    const newUserItinerary = { ...userItinerary };
    let filled = false;

    for (let day = 1; day <= totalDays; day++) {
      if (newUserItinerary[day].length === 0 && curatedItinerary[day]) {
        newUserItinerary[day] = curatedItinerary[day].map(item => ({
          ...item,
          id: `user-${item.id}-${Date.now()}`,
          source: 'ai' as const,
        }));
        filled = true;
      }
    }

    if (filled) {
      setUserItinerary(newUserItinerary);
      toast({
        title: "Dias preenchidos",
        description: "A IA preencheu os dias vazios com sugestões.",
      });
    } else {
      toast({
        title: "Nenhum dia vazio",
        description: "Todos os dias já possuem atividades.",
      });
    }
  }, [userItinerary, curatedItinerary, totalDays]);

  const handleRebalance = useCallback(() => {
    toast({
      title: "Reequilibrando",
      description: "Redistribuindo atividades para melhor experiência...",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3">
          <Link
            to={`/destino/${destinationId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
        
        {/* Day Swiper */}
        <div className="pb-3">
          <DaySwiper 
            totalDays={totalDays} 
            currentDay={currentDay} 
            onDayChange={setCurrentDay} 
          />
        </div>
      </header>

      {/* Main Content - Dual Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="grid grid-cols-2 gap-4 p-4">
          {/* LEFT COLUMN - Curated Itinerary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Columns className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Lucky Trip
              </h2>
            </div>
            <p className="text-[10px] text-muted-foreground -mt-2 mb-3">
              {destinationName}
            </p>
            
            <DayColumn
              dayId={`curated-day-${currentDay}`}
              dayNumber={currentDay}
              items={curatedItinerary[currentDay] || []}
              isUserColumn={false}
            />
          </div>

          {/* RIGHT COLUMN - User Itinerary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[8px] font-bold text-primary">EU</span>
              </div>
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Meu Roteiro
              </h2>
            </div>
            <p className="text-[10px] text-muted-foreground -mt-2 mb-3">
              Arraste para adicionar
            </p>
            
            <DayColumn
              dayId={`user-day-${currentDay}`}
              dayNumber={currentDay}
              items={userItinerary[currentDay] || []}
              isUserColumn={true}
              onAddItem={() => {
                toast({
                  title: "Adicionar item",
                  description: "Arraste itens da coluna Lucky Trip.",
                });
              }}
            />
          </div>
        </main>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem ? (
            <ItineraryCard item={activeItem} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* AI Assistant FAB */}
      <AIAssistantFAB
        onSuggestActivities={handleAISuggest}
        onAutoFill={handleAutoFill}
        onRebalance={handleRebalance}
      />
    </div>
  );
};

export default RoteiroPlanner;
