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
  Modifier,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DayColumn } from "@/components/roteiro/DayColumn";
import { DaySwiper } from "@/components/roteiro/DaySwiper";
import { ItineraryCard, ItineraryItem } from "@/components/roteiro/ItineraryCard";
import { ReferencesPanel } from "@/components/roteiro/ReferencesPanel";
import { PlannerFAB } from "@/components/roteiro/PlannerFAB";
import { useRoteiroState } from "@/hooks/use-roteiro-state";
import { getCuratedItinerary, getDestinationDays } from "@/data/curated-itineraries";
import { getReferenceItinerariesForDestination, ReferenceItem } from "@/data/reference-itineraries";
import { PlaceData } from "@/components/roteiro/GooglePlacesAutocomplete";
import { toast } from "@/hooks/use-toast";

/**
 * ROTEIRO PLANNER — GAMIFIED
 * 
 * Premium travel app with playful, calm, game-like interface.
 * Everything is optional. Nothing is forced.
 * The user explores, drags, tests and reverts freely.
 * 
 * FEATURES:
 * - Single "+" FAB with 4 actions
 * - Left panel with show/hide references
 * - Horizontal drag lock
 * - Smooth visual feedback
 */

const destinationNames: Record<string, string> = {
  'rio-de-janeiro': 'Rio de Janeiro',
};

// Horizontal axis lock modifier for drag & drop
const restrictToHorizontalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: 0, // Lock vertical movement
  };
};

const RoteiroPlanner = () => {
  const { destinationId = 'rio-de-janeiro' } = useParams();
  const destinationName = destinationNames[destinationId] || destinationId;
  
  // Get curated content and reference itineraries
  const curatedItinerary = getCuratedItinerary(destinationId);
  const referenceItineraries = getReferenceItinerariesForDestination(destinationId);
  
  // Build sources list
  const sources = useMemo(() => {
    const list: Array<{ id: string; label: string; author?: string; isDefault?: boolean; isPremium?: boolean; isLocked?: boolean }> = [
      { id: 'lucky-trip', label: 'Lucky Trip', isDefault: true },
    ];
    referenceItineraries.forEach(ref => {
      list.push({ id: ref.id, label: ref.author, author: ref.author });
    });
    // Premium sources (locked for now)
    list.push({ id: 'lucky-tips', label: 'Lucky Tips', isPremium: true, isLocked: true });
    return list;
  }, [referenceItineraries]);
  
  const [selectedSources, setSelectedSources] = useState<string[]>(['lucky-trip']);
  
  const handleSourceToggle = useCallback((sourceId: string) => {
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        return prev.filter(id => id !== sourceId);
      }
      return [...prev, sourceId];
    });
  }, []);
  
  // Determine total days based on selected reference
  const selectedReference = referenceItineraries.find(r => selectedSources.includes(r.id));
  const sourceTotalDays = selectedReference 
    ? Object.keys(selectedReference.days).length 
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
    if (selectedReference) {
      for (const day of Object.keys(selectedReference.days)) {
        const item = selectedReference.days[Number(day)].items.find(i => i.id === id);
        if (item) return item;
      }
    }
    // Check user
    for (const day of Object.keys(userItems)) {
      const item = userItems[Number(day)]?.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  }, [curatedItinerary, selectedReference, userItems]);

  // Determine if an ID belongs to curated, reference, or user items
  const getItemSource = useCallback((id: string): 'curated' | 'reference' | 'user' | null => {
    for (const day of Object.keys(curatedItinerary)) {
      if (curatedItinerary[Number(day)].some(i => i.id === id)) {
        return 'curated';
      }
    }
    if (selectedReference) {
      for (const day of Object.keys(selectedReference.days)) {
        if (selectedReference.days[Number(day)].items.some(i => i.id === id)) {
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
  }, [curatedItinerary, selectedReference, userItems]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    
    // Handle day block drag
    if (data?.type === 'day-block') {
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

    // CASE 1: Dragging from CURATED or REFERENCE to USER column (left → right)
    if ((itemSource === 'curated' || itemSource === 'reference') && overId.startsWith('user-day-')) {
      const targetDay = parseInt(overId.replace('user-day-', ''));
      const item = findItem(activeId);
      
      if (!item) return;

      if (hasItem(activeId)) {
        toast({
          title: "Esse já está aqui",
          description: `${item.name} já faz parte do seu roteiro.`,
        });
        return;
      }

      addItem(targetDay, item as ItineraryItem, activeId);
      
      toast({
        title: "Adicionado ✓",
        description: `${item.name} → Dia ${targetDay}`,
      });
    }

    // CASE 2: Dragging from USER to outside (right → left = discard)
    if (itemSource === 'user' && (overId.startsWith('curated-day-') || !overId.startsWith('user-day-'))) {
      // Find which day the active item is in
      for (const day of Object.keys(userItems)) {
        const dayNum = Number(day);
        if (userItems[dayNum]?.some(i => i.id === activeId)) {
          removeItem(dayNum, activeId);
          const item = userItems[dayNum].find(i => i.id === activeId);
          toast({
            title: "Removido",
            description: item?.name || 'Item removido',
          });
          break;
        }
      }
      return;
    }

    // CASE 3: Reordering within USER column (same day)
    if (itemSource === 'user') {
      let activeDay: number | null = null;
      for (const day of Object.keys(userItems)) {
        if (userItems[Number(day)]?.some(i => i.id === activeId)) {
          activeDay = Number(day);
          break;
        }
      }

      if (activeDay === null) return;

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
          const oldIndex = userItems[activeDay].findIndex(i => i.id === activeId);
          const newIndex = userItems[activeDay].findIndex(i => i.id === overId);
          
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const newItems = arrayMove(userItems[activeDay], oldIndex, newIndex);
            setDayItems(activeDay, newItems);
          }
        }
      }

      if (overId.startsWith('user-day-')) {
        const targetDay = parseInt(overId.replace('user-day-', ''));
        if (targetDay !== activeDay) {
          const item = userItems[activeDay].find(i => i.id === activeId);
          if (item) {
            setDayItems(activeDay, userItems[activeDay].filter(i => i.id !== activeId));
            setDayItems(targetDay, [...(userItems[targetDay] || []), item]);
          }
        }
      }
    }
  };

  // FAB Actions
  const handleAddManual = useCallback((name: string, day: number) => {
    const item: ItineraryItem = {
      id: `manual-${Date.now()}-${Math.random()}`,
      name,
      category: 'custom',
      source: 'user',
    };
    addItem(day, item);
    toast({
      title: "Adicionado ✓",
      description: `${name} → Dia ${day}`,
    });
  }, [addItem]);

  const handleAddFromGoogle = useCallback((place: PlaceData, day: number) => {
    const item: ItineraryItem = {
      id: `google-${place.placeId}-${Date.now()}`,
      name: place.name,
      category: 'custom',
      source: 'user',
      placeId: place.placeId,
      lat: place.lat,
      lng: place.lng,
    };
    addItem(day, item);
    toast({
      title: "Adicionado ✓",
      description: `${place.name} → Dia ${day}`,
    });
  }, [addItem]);

  const handleAddWithAI = useCallback((prompt: string) => {
    toast({
      title: "Buscando sugestões...",
      description: "A IA está pensando em ideias para você.",
    });
    // Future: Call AI to generate suggestions as draggable cards
  }, []);

  const handleShowCuratedPicker = useCallback(() => {
    // Ensure Lucky Trip is selected in references
    if (!selectedSources.includes('lucky-trip')) {
      setSelectedSources(prev => [...prev, 'lucky-trip']);
    }
    toast({
      title: "Referências ativadas",
      description: "Arraste itens do Lucky Trip para seu roteiro.",
    });
  }, [selectedSources]);

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
        modifiers={[restrictToHorizontalAxis]}
      >
        <main className="grid grid-cols-2 gap-3 p-4 min-h-[60vh]">
          {/* LEFT COLUMN — References (Read-Only Idea Bank) */}
          <div className="h-full">
            <ReferencesPanel
              sources={sources}
              selectedSources={selectedSources}
              onSourceToggle={handleSourceToggle}
              currentDay={currentDay}
              curatedItems={curatedItinerary[currentDay] || []}
              referenceItineraries={referenceItineraries}
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
                  Arraste para cá
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
            <div className="w-[160px] opacity-90 rotate-2 scale-105 shadow-xl">
              <ItineraryCard item={activeItem} isOverlay />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Planner FAB */}
      <PlannerFAB
        totalDays={sourceTotalDays}
        onAddManual={handleAddManual}
        onAddFromGoogle={handleAddFromGoogle}
        onAddWithAI={handleAddWithAI}
        onShowCuratedPicker={handleShowCuratedPicker}
      />
    </div>
  );
};

export default RoteiroPlanner;
