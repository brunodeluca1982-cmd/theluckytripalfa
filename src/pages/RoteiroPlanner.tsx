import { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, User, Map, Info, Ticket, Utensils, BookOpen } from "lucide-react";
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
import { ItineraryTabs } from "@/components/roteiro/ItineraryTabs";
import { MultiDayTimeline } from "@/components/roteiro/MultiDayTimeline";
import { PartnersOnTripPanel } from "@/components/roteiro/ReferencesPanel";
import { MobileReferenceDrawer } from "@/components/roteiro/MobileReferenceDrawer";
import { ItineraryCard, ItineraryItem } from "@/components/roteiro/ItineraryCard";
import { useRoteiroState } from "@/hooks/use-roteiro-state";
import { useTimelineData } from "@/hooks/use-timeline-data";
import { useTripSetup } from "@/hooks/use-trip-setup";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCuratedItinerary, getDestinationDays } from "@/data/curated-itineraries";
import { getReferenceItinerariesForDestination, ReferenceItem } from "@/data/reference-itineraries";
import { getDestination } from "@/data/destinations-database";
import { PlaceData } from "@/components/roteiro/GooglePlacesAutocomplete";
import { toast } from "@/hooks/use-toast";

/**
 * ROTEIRO PLANNER — GAMIFIED ITINERARY EXPERIENCE
 * 
 * Premium travel app with playful, calm, game-like interface.
 * Features:
 * - Tab navigation (General | Itinerary | Details | Tickets | Food)
 * - Multi-day horizontal timeline view
 * - Drag & drop between days and reorder within
 * - Travel time calculation and inconsistency detection
 * - Collapsible reference panel
 */

// Horizontal axis lock for moving items between days
const restrictToHorizontalAxis: Modifier = ({ transform }) => ({
  ...transform,
  y: 0,
});

const RoteiroPlanner = () => {
  const { destinationId = 'rio-de-janeiro' } = useParams();
  const navigate = useNavigate();
  const { tripSetup, tripDays: setupTripDays } = useTripSetup();
  
  // Get destination info
  const destination = getDestination(destinationId);
  const destinationName = destination?.name || destinationId;
  
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
    list.push({ id: 'lucky-tips', label: 'Lucky Tips', isPremium: true, isLocked: true });
    return list;
  }, [referenceItineraries]);
  
  const [selectedSources, setSelectedSources] = useState<string[]>(['lucky-trip']);
  const [showReferences, setShowReferences] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSourceToggle = useCallback((sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  }, []);
  
  // Determine total days based on trip setup or reference
  const selectedReference = referenceItineraries.find(r => selectedSources.includes(r.id));
  const sourceTotalDays = selectedReference 
    ? Object.keys(selectedReference.days).length 
    : getDestinationDays(destinationId);
  
  // Use trip setup days if available, otherwise fall back to source/default
  const totalDays = setupTripDays > 0 ? setupTripDays : Math.max(sourceTotalDays, 5);
  
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
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  // Transform items into timeline data with travel blocks
  const timelineData = useTimelineData({
    items: userItems,
    totalDays,
  });

  // Store destination context for back navigation
  useEffect(() => {
    localStorage.setItem('last-destination-context', `/destino/${destinationId}`);
  }, [destinationId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Find item in curated, reference, or user itinerary
  const findItem = useCallback((id: string): ItineraryItem | ReferenceItem | null => {
    for (const day of Object.keys(curatedItinerary)) {
      const item = curatedItinerary[Number(day)].find(i => i.id === id);
      if (item) return item;
    }
    if (selectedReference) {
      for (const day of Object.keys(selectedReference.days)) {
        const item = selectedReference.days[Number(day)].items.find(i => i.id === id);
        if (item) return item;
      }
    }
    for (const day of Object.keys(userItems)) {
      const item = userItems[Number(day)]?.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  }, [curatedItinerary, selectedReference, userItems]);

  // Determine if an ID belongs to curated, reference, or user items
  const getItemSource = useCallback((id: string): 'curated' | 'reference' | 'user' | null => {
    for (const day of Object.keys(curatedItinerary)) {
      if (curatedItinerary[Number(day)].some(i => i.id === id)) return 'curated';
    }
    if (selectedReference) {
      for (const day of Object.keys(selectedReference.days)) {
        if (selectedReference.days[Number(day)].items.some(i => i.id === id)) return 'reference';
      }
    }
    for (const day of Object.keys(userItems)) {
      if (userItems[Number(day)]?.some(i => i.id === id)) return 'user';
    }
    return null;
  }, [curatedItinerary, selectedReference, userItems]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    
    if (data?.type === 'day-block' && data.items?.length > 0) {
      setActiveItem(data.items[0]);
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
    
    // Handle day block drag
    if (data?.type === 'day-block' && overId.startsWith('timeline-day-')) {
      const targetDay = parseInt(overId.replace('timeline-day-', ''));
      const dayItems = data.items as ReferenceItem[];
      
      if (dayItems?.length > 0) {
        const newItems = dayItems.map(item => ({
          ...item,
          id: `user-${item.id}-${Date.now()}-${Math.random()}`,
        }));
        setDayItems(targetDay, [...(userItems[targetDay] || []), ...newItems]);
        toast({ title: "Dia inteiro adicionado", description: `${dayItems.length} itens → Dia ${targetDay}` });
      }
      return;
    }

    const itemSource = getItemSource(activeId);

    // Dragging from CURATED/REFERENCE to timeline
    if ((itemSource === 'curated' || itemSource === 'reference') && overId.startsWith('timeline-day-')) {
      const targetDay = parseInt(overId.replace('timeline-day-', ''));
      const item = findItem(activeId);
      
      if (!item) return;
      if (hasItem(activeId)) {
        toast({ title: "Esse já está aqui", description: `${item.name} já faz parte do seu roteiro.` });
        return;
      }

      const newItemId = `user-${activeId}-${Date.now()}`;
      addItem(targetDay, item as ItineraryItem, activeId);
      setHighlightedItemId(newItemId);
      setTimeout(() => setHighlightedItemId(null), 150);
      toast({ title: "Adicionado ✓", description: `${item.name} → Dia ${targetDay}` });
    }

    // Reordering within USER items
    if (itemSource === 'user') {
      let activeDay: number | null = null;
      for (const day of Object.keys(userItems)) {
        if (userItems[Number(day)]?.some(i => i.id === activeId)) {
          activeDay = Number(day);
          break;
        }
      }
      if (activeDay === null) return;

      // Move between days
      if (overId.startsWith('timeline-day-')) {
        const targetDay = parseInt(overId.replace('timeline-day-', ''));
        if (targetDay !== activeDay) {
          const item = userItems[activeDay].find(i => i.id === activeId);
          if (item) {
            setDayItems(activeDay, userItems[activeDay].filter(i => i.id !== activeId));
            setDayItems(targetDay, [...(userItems[targetDay] || []), item]);
            toast({ title: "Movido", description: `${item.name} → Dia ${targetDay}` });
          }
        }
        return;
      }

      // Reorder within same day
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
    toast({ title: "Adicionado ✓", description: `${name} → Dia ${day}` });
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
    toast({ title: "Adicionado ✓", description: `${place.name} → Dia ${day}` });

    // Also persist to roteiro_itens table
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.from("roteiro_itens").insert({
        roteiro_id: `${destinationId}-draft`,
        source: "google",
        ref_table: "places_cache",
        place_id: place.placeId,
        name: place.name,
        address: place.address,
        neighborhood: place.neighborhood,
        city: place.city || "Rio de Janeiro",
        lat: place.lat,
        lng: place.lng,
        day_index: day,
        order_in_day: (userItems[day]?.length || 0),
      }).then(({ error }) => {
        if (error) console.error("Failed to persist roteiro item:", error);
      });
    });
  }, [addItem, destinationId, userItems]);

  const handleAddWithAI = useCallback((prompt: string, day: number) => {
    toast({ title: "Buscando sugestões...", description: `A IA está pensando em ideias para o Dia ${day}.` });
  }, []);

  const handleShowCuratedPicker = useCallback((day: number) => {
    if (!selectedSources.includes('lucky-trip')) {
      setSelectedSources(prev => [...prev, 'lucky-trip']);
    }
    setShowReferences(true);
    toast({ title: "Referências ativadas", description: `Arraste itens do Lucky Trip para o Dia ${day}.` });
  }, [selectedSources]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            to="/meu-roteiro"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Meu Roteiro
          </Link>
          
          {totalItems > 0 && (
            <span className="text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>
      </header>

      {/* Tabs Navigation */}
      <ItineraryTabs defaultValue="itinerary">
        {{
          general: (
            <div className="p-6 text-center">
              <Map className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Visão Geral</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Resumo da sua viagem para {destinationName}
              </p>
            </div>
          ),
          itinerary: (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {/* Mobile Reference Toggle */}
              {isMobile && (
                <div className="px-4 pt-2 pb-0">
                  <button
                    onClick={() => setMobileDrawerOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Referência
                  </button>
                </div>
              )}

              <div className="flex gap-4 p-4">
                {/* Left Panel - Partners on Trip (Desktop only) */}
                {showReferences && !isMobile && (
                  <div className="w-[280px] flex-shrink-0">
                    <PartnersOnTripPanel
                      sources={sources}
                      selectedSources={selectedSources}
                      onSourceToggle={handleSourceToggle}
                      currentDay={currentDay}
                      curatedItems={curatedItinerary[currentDay] || []}
                      referenceItineraries={referenceItineraries}
                      tripDestinationIds={[destinationId]}
                    />
                  </div>
                )}

                {/* Main Timeline */}
                <div className="flex-1 min-w-0">
                  <MultiDayTimeline
                    days={timelineData}
                    onRemoveItem={(day, itemId) => removeItem(day, itemId)}
                    onActivityTap={(item, day) => setCurrentDay(day)}
                    onAddManual={handleAddManual}
                    onAddFromGoogle={handleAddFromGoogle}
                    onAddWithAI={handleAddWithAI}
                    onShowCuratedPicker={handleShowCuratedPicker}
                    highlightedItemId={highlightedItemId}
                  />
                </div>
              </div>

              {/* Mobile Reference Drawer */}
              {isMobile && (
                <MobileReferenceDrawer
                  open={mobileDrawerOpen}
                  onOpenChange={setMobileDrawerOpen}
                  sources={sources}
                  selectedSources={selectedSources}
                  onSourceToggle={handleSourceToggle}
                  currentDay={currentDay}
                  curatedItems={curatedItinerary[currentDay] || []}
                  referenceItineraries={referenceItineraries}
                  tripDestinationIds={[destinationId]}
                />
              )}

              {/* Drag Overlay */}
              <DragOverlay>
                {activeItem && (
                  <div className="w-[200px] opacity-90 rotate-2 scale-105 shadow-xl">
                    <ItineraryCard item={activeItem} isOverlay />
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          ),
          details: (
            <div className="p-6 text-center">
              <Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Detalhes</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Informações de logística e planejamento
              </p>
            </div>
          ),
          tickets: (
            <div className="p-6 text-center">
              <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Ingressos</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Reservas e ingressos para suas atividades
              </p>
            </div>
          ),
          food: (
            <div className="p-6 text-center">
              <Utensils className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Comida</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Reservas de restaurantes e experiências gastronômicas
              </p>
            </div>
          ),
        }}
      </ItineraryTabs>
    </div>
  );
};

export default RoteiroPlanner;
