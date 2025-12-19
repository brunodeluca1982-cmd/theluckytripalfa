import { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, User } from "lucide-react";
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
import { ReferenceItemCard } from "@/components/roteiro/ReferenceItemCard";
import { ReferenceDayColumn } from "@/components/roteiro/ReferenceDayColumn";
import { SourceSelector } from "@/components/roteiro/SourceSelector";
import { AIAssistantFAB } from "@/components/roteiro/AIAssistantFAB";
import { useRoteiroState } from "@/hooks/use-roteiro-state";
import { getCuratedItinerary, getDestinationDays } from "@/data/curated-itineraries";
import { getReferenceItinerariesForDestination, ReferenceItem } from "@/data/reference-itineraries";
import { toast } from "@/hooks/use-toast";

/**
 * ROTEIRO PLANNER
 * 
 * STRUCTURAL LOCK — Core planning interface
 * 
 * SOURCES:
 * - Lucky Trip (default curated content)
 * - Reference Itineraries (e.g., Bruno De Luca)
 * - Future: Partner on Trip, AI suggestions
 * 
 * MENTAL STATES:
 * - RASCUNHO (default): Free playground, no validation
 * - FINAL: Still editable, advisory suggestions only
 * 
 * PSYCHOLOGICAL RULES:
 * - Never imply "wrong" or "incomplete"
 * - Sources inspire, never impose
 * - System is a guide, not a judge
 */

const destinationNames: Record<string, string> = {
  'rio-de-janeiro': 'Rio de Janeiro',
};

const RoteiroPlanner = () => {
  const { destinationId = 'rio-de-janeiro' } = useParams();
  const destinationName = destinationNames[destinationId] || destinationId;
  
  // Get curated content and reference itineraries
  const curatedItinerary = getCuratedItinerary(destinationId);
  const referenceItineraries = getReferenceItinerariesForDestination(destinationId);
  
  // Build sources list
  const sources = useMemo(() => {
    const list: Array<{ id: string; label: string; author?: string; isDefault?: boolean }> = [
      { id: 'lucky-trip', label: 'Lucky Trip', isDefault: true },
    ];
    referenceItineraries.forEach(ref => {
      list.push({ id: ref.id, label: ref.title, author: ref.author });
    });
    return list;
  }, [referenceItineraries]);
  
  const [currentSourceId, setCurrentSourceId] = useState('lucky-trip');
  const currentReference = referenceItineraries.find(r => r.id === currentSourceId);
  
  // Determine total days based on source
  const sourceTotalDays = currentReference 
    ? Object.keys(currentReference.days).length 
    : getDestinationDays(destinationId);
  
  // User's roteiro state (with persistence)
  const { 
    items: userItems, 
    addItem, 
    removeItem, 
    reorderItems,
    setDayItems,
    hasItem,
    totalItems,
  } = useRoteiroState(destinationId, Math.max(sourceTotalDays, 8));
  
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

  // Find item in curated, reference, or user itinerary
  const findItem = useCallback((id: string): ItineraryItem | ReferenceItem | null => {
    // Check curated
    for (const day of Object.keys(curatedItinerary)) {
      const item = curatedItinerary[Number(day)].find(i => i.id === id);
      if (item) return item;
    }
    // Check reference itineraries
    if (currentReference) {
      for (const day of Object.keys(currentReference.days)) {
        const item = currentReference.days[Number(day)].items.find(i => i.id === id);
        if (item) return item;
      }
    }
    // Check user
    for (const day of Object.keys(userItems)) {
      const item = userItems[Number(day)]?.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  }, [curatedItinerary, currentReference, userItems]);

  // Determine if an ID belongs to curated, reference, or user items
  const getItemSource = useCallback((id: string): 'curated' | 'reference' | 'user' | null => {
    for (const day of Object.keys(curatedItinerary)) {
      if (curatedItinerary[Number(day)].some(i => i.id === id)) {
        return 'curated';
      }
    }
    if (currentReference) {
      for (const day of Object.keys(currentReference.days)) {
        if (currentReference.days[Number(day)].items.some(i => i.id === id)) {
          return 'reference';
        }
      }
    }
    for (const day of Object.keys(userItems)) {
      if (userItems[Number(day)]?.some(i => i.id === id)) {
        return 'user';
      }
    }
    return null;
  }, [curatedItinerary, currentReference, userItems]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    
    // Handle day block drag
    if (data?.type === 'day-block') {
      // Set first item as active for overlay preview
      if (data.items?.length > 0) {
        setActiveItem(data.items[0]);
      }
      return;
    }
    
    const item = findItem(active.id as string);
    setActiveItem(item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const data = active.data.current;
    
    // CASE 0: Dragging a full day block
    if (data?.type === 'day-block' && overId.startsWith('user-day-')) {
      const targetDay = parseInt(overId.replace('user-day-', ''));
      const dayItems = data.items as ReferenceItem[];
      
      if (dayItems && dayItems.length > 0) {
        const newItems = dayItems.map(item => ({
          ...item,
          id: `user-${item.id}-${Date.now()}-${Math.random()}`,
        }));
        setDayItems(targetDay, [...(userItems[targetDay] || []), ...newItems]);
        
        toast({
          title: "Dia inteiro adicionado",
          description: `${dayItems.length} itens → Dia ${targetDay}`,
        });
      }
      return;
    }

    const itemSource = getItemSource(activeId);

    // CASE 1: Dragging from CURATED or REFERENCE to USER column
    if ((itemSource === 'curated' || itemSource === 'reference') && overId.startsWith('user-day-')) {
      const targetDay = parseInt(overId.replace('user-day-', ''));
      const item = findItem(activeId);
      
      if (!item) return;

      // Already added — gentle reminder, no judgment
      if (hasItem(activeId)) {
        toast({
          title: "Esse já está aqui",
          description: `${item.name} já faz parte do seu rascunho.`,
        });
        return;
      }

      // Add copy to user roteiro
      addItem(targetDay, item as ItineraryItem, activeId);
      
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

  // AI Actions — Assistive only, never auto-edit
  // Language: "sugestão", never "erro"
  const handleAISuggest = useCallback(() => {
    toast({
      title: "Buscando ideias...",
      description: "Vou sugerir algumas opções para você.",
    });
  }, []);

  const handleAutoFill = useCallback(() => {
    let filled = false;
    
    for (let day = 1; day <= sourceTotalDays; day++) {
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
      title: filled ? "Sugestões adicionadas" : "Tudo certo",
      description: filled 
        ? "Coloquei algumas ideias nos dias vazios. Você pode mudar o que quiser." 
        : "Seus dias já têm atividades. Continue no seu ritmo.",
    });
  }, [userItems, curatedItinerary, sourceTotalDays, setDayItems]);

  const handleRebalance = useCallback(() => {
    toast({
      title: "Em breve",
      description: "Vou poder sugerir ajustes quando você quiser.",
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
            totalDays={sourceTotalDays} 
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
            {/* Source Selector */}
            <div className="mb-3">
              <SourceSelector
                currentSourceId={currentSourceId}
                sources={sources}
                onSourceChange={setCurrentSourceId}
              />
            </div>
            
            {/* Source Content */}
            {currentReference ? (
              // Reference Itinerary
              currentReference.days[currentDay] && (
                <ReferenceDayColumn 
                  day={currentReference.days[currentDay]} 
                  referenceId={currentReference.id}
                />
              )
            ) : (
              // Default Lucky Trip curated content
              <DayColumn
                dayId={`curated-day-${currentDay}`}
                dayNumber={currentDay}
                items={curatedItinerary[currentDay] || []}
                isUserColumn={false}
              />
            )}
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
