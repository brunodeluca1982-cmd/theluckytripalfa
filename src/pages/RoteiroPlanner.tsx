import { useState, useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, BookOpen, User } from "lucide-react";
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
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DayColumn } from "@/components/roteiro/DayColumn";
import { DaySwiper } from "@/components/roteiro/DaySwiper";
import { ItineraryCard, ItineraryItem } from "@/components/roteiro/ItineraryCard";
import { AIAssistantFAB } from "@/components/roteiro/AIAssistantFAB";
import { useRoteiroState } from "@/hooks/use-roteiro-state";
import { getCuratedItinerary, getDestinationDays } from "@/data/curated-itineraries";
import { toast } from "@/hooks/use-toast";

/**
 * ROTEIRO PLANNER
 * 
 * STRUCTURAL LOCK — Core planning interface
 * 
 * TWO-COLUMN MODEL:
 * - LEFT: Curated source (read-only) — items dragged FROM here
 * - RIGHT: User roteiro (editable) — items dropped TO here
 * 
 * PRIMARY INTERACTION:
 * - Drag & drop is the main gesture
 * - No secondary flows replace this
 * 
 * DAY STRUCTURE:
 * - Days displayed horizontally
 * - Swipe left/right to change days
 * - Days are containers, not timelines
 * 
 * STATE PERSISTENCE:
 * - User roteiro auto-saves to localStorage
 * - State preserved across sessions
 */

const destinationNames: Record<string, string> = {
  'rio-de-janeiro': 'Rio de Janeiro',
};

const RoteiroPlanner = () => {
  const { destinationId = 'rio-de-janeiro' } = useParams();
  const destinationName = destinationNames[destinationId] || destinationId;
  
  // Get curated content for this destination
  const curatedItinerary = getCuratedItinerary(destinationId);
  const totalDays = getDestinationDays(destinationId);
  
  // User's roteiro state (with persistence)
  const { 
    items: userItems, 
    addItem, 
    removeItem, 
    reorderItems,
    setDayItems,
    hasItem,
    totalItems,
  } = useRoteiroState(destinationId, totalDays);
  
  const [currentDay, setCurrentDay] = useState(1);
  const [activeItem, setActiveItem] = useState<ItineraryItem | null>(null);

  // Store destination context for back navigation
  useEffect(() => {
    localStorage.setItem('last-destination-context', `/destino/${destinationId}`);
  }, [destinationId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find item in curated or user itinerary
  const findItem = useCallback((id: string): ItineraryItem | null => {
    // Check curated
    for (const day of Object.keys(curatedItinerary)) {
      const item = curatedItinerary[Number(day)].find(i => i.id === id);
      if (item) return item;
    }
    // Check user
    for (const day of Object.keys(userItems)) {
      const item = userItems[Number(day)]?.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  }, [curatedItinerary, userItems]);

  // Determine if an ID belongs to curated or user items
  const getItemSource = useCallback((id: string): 'curated' | 'user' | null => {
    for (const day of Object.keys(curatedItinerary)) {
      if (curatedItinerary[Number(day)].some(i => i.id === id)) {
        return 'curated';
      }
    }
    for (const day of Object.keys(userItems)) {
      if (userItems[Number(day)]?.some(i => i.id === id)) {
        return 'user';
      }
    }
    return null;
  }, [curatedItinerary, userItems]);

  const handleDragStart = (event: DragStartEvent) => {
    const item = findItem(event.active.id as string);
    setActiveItem(item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const itemSource = getItemSource(activeId);

    // CASE 1: Dragging from CURATED to USER column
    if (itemSource === 'curated' && overId.startsWith('user-day-')) {
      const targetDay = parseInt(overId.replace('user-day-', ''));
      const item = findItem(activeId);
      
      if (!item) return;

      // Check if already added
      if (hasItem(activeId)) {
        toast({
          title: "Já adicionado",
          description: `${item.name} já está no seu roteiro.`,
        });
        return;
      }

      // Add copy to user roteiro
      addItem(targetDay, item, activeId);
      
      toast({
        title: "Adicionado",
        description: `${item.name} → Dia ${targetDay}`,
      });
    }

    // CASE 2: Reordering within USER column (same day)
    if (itemSource === 'user') {
      // Find which day the active item is in
      let activeDay: number | null = null;
      for (const day of Object.keys(userItems)) {
        if (userItems[Number(day)]?.some(i => i.id === activeId)) {
          activeDay = Number(day);
          break;
        }
      }

      if (activeDay === null) return;

      // If dropping on another item in the same day
      const overSource = getItemSource(overId);
      if (overSource === 'user') {
        let overDay: number | null = null;
        for (const day of Object.keys(userItems)) {
          if (userItems[Number(day)]?.some(i => i.id === overId)) {
            overDay = Number(day);
            break;
          }
        }

        if (overDay === activeDay) {
          // Same day reorder
          const oldIndex = userItems[activeDay].findIndex(i => i.id === activeId);
          const newIndex = userItems[activeDay].findIndex(i => i.id === overId);
          
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const newItems = arrayMove(userItems[activeDay], oldIndex, newIndex);
            setDayItems(activeDay, newItems);
          }
        }
      }

      // If dropping on a user day zone
      if (overId.startsWith('user-day-')) {
        const targetDay = parseInt(overId.replace('user-day-', ''));
        if (targetDay !== activeDay) {
          // Move between days
          const item = userItems[activeDay].find(i => i.id === activeId);
          if (item) {
            setDayItems(activeDay, userItems[activeDay].filter(i => i.id !== activeId));
            setDayItems(targetDay, [...(userItems[targetDay] || []), item]);
          }
        }
      }
    }
  };

  // AI Actions (assistive only)
  const handleAISuggest = useCallback(() => {
    toast({
      title: "Analisando...",
      description: "Buscando sugestões personalizadas.",
    });
  }, []);

  const handleAutoFill = useCallback(() => {
    let filled = false;
    
    for (let day = 1; day <= totalDays; day++) {
      if ((userItems[day]?.length || 0) === 0 && curatedItinerary[day]) {
        const itemsToAdd = curatedItinerary[day].map(item => ({
          ...item,
          id: `user-${item.id}-${Date.now()}-${Math.random()}`,
          source: 'ai' as const,
        }));
        setDayItems(day, itemsToAdd);
        filled = true;
      }
    }

    toast({
      title: filled ? "Dias preenchidos" : "Nenhum dia vazio",
      description: filled 
        ? "A IA sugeriu atividades para os dias vazios." 
        : "Todos os dias já têm atividades.",
    });
  }, [userItems, curatedItinerary, totalDays, setDayItems]);

  const handleRebalance = useCallback(() => {
    toast({
      title: "Função em breve",
      description: "Reequilíbrio automático será adicionado.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            to={`/destino/${destinationId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          
          {totalItems > 0 && (
            <span className="text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'itens'} salvos
            </span>
          )}
        </div>
        
        {/* Day Navigation */}
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
        onDragEnd={handleDragEnd}
      >
        <main className="grid grid-cols-2 gap-3 p-4">
          {/* LEFT COLUMN — Source (Read-Only) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <div>
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Lucky Trip
                </h2>
                <p className="text-[10px] text-muted-foreground">
                  {destinationName}
                </p>
              </div>
            </div>
            
            <DayColumn
              dayId={`curated-day-${currentDay}`}
              dayNumber={currentDay}
              items={curatedItinerary[currentDay] || []}
              isUserColumn={false}
            />
          </div>

          {/* RIGHT COLUMN — User Roteiro (Editable) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-2.5 h-2.5 text-primary" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Meu Roteiro
                </h2>
                <p className="text-[10px] text-muted-foreground">
                  Arraste para adicionar
                </p>
              </div>
            </div>
            
            <DayColumn
              dayId={`user-day-${currentDay}`}
              dayNumber={currentDay}
              items={userItems[currentDay] || []}
              isUserColumn={true}
              onRemoveItem={(itemId) => removeItem(currentDay, itemId)}
            />
          </div>
        </main>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem && (
            <div className="w-[160px]">
              <ItineraryCard item={activeItem} isOverlay />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* AI Assistant (Assistive Only) */}
      <AIAssistantFAB
        onSuggestActivities={handleAISuggest}
        onAutoFill={handleAutoFill}
        onRebalance={handleRebalance}
      />
    </div>
  );
};

export default RoteiroPlanner;
