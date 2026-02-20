import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Check, MapPin, Utensils, Sun, Moon, Car, Footprints, Clock, Pencil, AlertTriangle, PartyPopper } from "lucide-react";
import { getAllSavedItems, SavedItemRecord } from "@/hooks/use-saved-items";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripDraft, PriceStyle } from "@/hooks/use-trip-draft";
import { guideRestaurants, guideActivities, guideHotels, GuideRestaurant, GuideActivity, GuideHotel } from "@/data/rio-guide-data";
import { cn } from "@/lib/utils";
import { calculateDistance, getTransportDetails } from "@/lib/location-validation";
import { getValidatedLocation, hasValidatedLocation } from "@/data/validated-locations";
import { EditSlotSheet } from "@/components/itinerary/EditSlotSheet";
import { HybridPlaceResult } from "@/components/roteiro/HybridPlaceSearch";
import { ItineraryItemDetailSheet } from "@/components/roteiro/ItineraryItemDetailSheet";
import { useItineraryCoherence, getTravelBetweenSlots, TravelSegment } from "@/hooks/use-itinerary-coherence";
import { TravelIndicator } from "@/components/roteiro/TravelIndicator";
import { DayCoherenceWarning } from "@/components/roteiro/DayCoherenceWarning";
// Current date reference (no longer hardcoded to carnival)
const TODAY_ISO = new Date().toISOString().slice(0, 10);

/**
 * AUTOMATIC ITINERARY GENERATOR
 * Creates curated itinerary from The Lucky Trip guide data.
 * Uses validated location data only - no guessing or approximating.
 * Includes accommodation anchoring, transport segments, and cost estimates.
 */

// No longer constrained to specific day options - uses actual trip dates

interface TransportSegment {
  from: string;
  to: string;
  mode: 'walking' | 'uber';
  duration: string;
  distanceKm: number;
}

interface ItinerarySlot {
  time: string;
  type: 'activity' | 'meal' | 'sunset' | 'transport' | 'departure';
  item: { id: string; name: string; neighborhood: string; description: string; address?: string };
  transport?: TransportSegment;
  timeBlock?: 'morning' | 'afternoon' | 'evening';
}

interface DayCosts {
  food: number;
  activities: number;
  transport: number;
  total: number;
}

/**
 * Gets real distance between two places using validated coordinates
 * Returns null if either place lacks validated location data
 */
const getRealDistance = (fromId: string, toId: string): number | null => {
  const fromLocation = getValidatedLocation(fromId);
  const toLocation = getValidatedLocation(toId);
  
  if (!fromLocation || !toLocation) {
    console.warn(`[LocationValidation] Cannot calculate distance: missing location for ${!fromLocation ? fromId : toId}`);
    return null;
  }
  
  return calculateDistance(fromLocation.lat, fromLocation.lng, toLocation.lat, toLocation.lng);
};

/**
 * Gets transport mode based on real distance
 */
const getTransportMode = (distanceKm: number): { mode: 'walking' | 'uber'; duration: string } => {
  const details = getTransportDetails(distanceKm);
  return { mode: details.mode, duration: details.durationText };
};

const STORAGE_KEY = 'automaticItinerary';

const AutomaticItinerary = () => {
  const navigate = useNavigate();
  const { draft, tripDays } = useTripDraft();
  // Use the actual trip days from dates (minimum 1 day)
  const actualTripDays = Math.max(1, tripDays);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [itinerary, setItinerary] = useState<Record<number, ItinerarySlot[]>>({});
  const [dayCosts, setDayCosts] = useState<Record<number, DayCosts>>({});
  const [selectedHotel, setSelectedHotel] = useState<typeof guideHotels[0] | null>(null);
  
  // Edit state
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{ day: number; index: number; slot: ItinerarySlot } | null>(null);
  
  // Detail view state
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [viewingSlot, setViewingSlot] = useState<{ day: number; index: number; slot: ItinerarySlot } | null>(null);
  
  // Auto-generate on mount if trip dates are valid
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false);

  // Track saved items count to detect changes and invalidate cache
  const savedItemsCount = getAllSavedItems().length;

  // Load saved itinerary from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-${draft.destinationId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Invalidate cache if saved items count changed since last build
        const cachedSavedCount = parsed.savedItemsCount ?? -1;
        if (parsed.itinerary && Object.keys(parsed.itinerary).length > 0 && cachedSavedCount === savedItemsCount) {
          setItinerary(parsed.itinerary);
          setDayCosts(parsed.dayCosts || {});
          setSelectedHotel(parsed.hotel || null);
          setIsGenerated(true);
        } else {
          // Saved items changed - clear cache so itinerary regenerates
          console.log(`[AutoItinerary] Cache invalidated: saved items changed (${cachedSavedCount} → ${savedItemsCount})`);
        }
      } catch (e) {
        console.error('Failed to load saved itinerary:', e);
      }
    }
  }, [draft.destinationId, savedItemsCount]);

  // Save itinerary to localStorage whenever it changes
  useEffect(() => {
    if (isGenerated && Object.keys(itinerary).length > 0) {
      localStorage.setItem(`${STORAGE_KEY}-${draft.destinationId}`, JSON.stringify({
        destination: draft.destinationId,
        days: actualTripDays,
        itinerary,
        dayCosts,
        hotel: selectedHotel,
        savedItemsCount,
        updatedAt: new Date().toISOString()
      }));
    }
  }, [itinerary, dayCosts, selectedHotel, isGenerated, draft.destinationId, actualTripDays, savedItemsCount]);

  if (!draft.destinationId) {
    navigate('/meu-roteiro', { replace: true });
    return null;
  }

  const tripStyles = draft.tripStyles || [];
  const priceStyle = draft.priceStyle || '$$';
  const isGastronomy = tripStyles.includes('gastronomia');
  const isFamily = tripStyles.includes('familia');
  const isAdventure = tripStyles.includes('aventura');

  /**
   * Price matching helpers
   * Maps user's $ / $$ / $$$ preference to matching price levels
   * Allows one "upgrade" item per day for variety
   */
  const getMatchingPriceLevels = (style: PriceStyle): string[] => {
    switch (style) {
      case '$': return ['$', '$$'];           // Essential: prefer $ and $$
      case '$$': return ['$$', '$$$'];        // Comfort: prefer $$ and $$$
      case '$$$': return ['$$$', '$$$$'];     // Sophisticated: prefer $$$ and $$$$
      default: return ['$$', '$$$'];
    }
  };

  const matchingPriceLevels = getMatchingPriceLevels(priceStyle);

  // Score a place by how well it matches the price preference (lower = better match)
  const getPriceMatchScore = (priceLevel: string): number => {
    if (matchingPriceLevels[0] === priceLevel) return 0;  // Perfect match
    if (matchingPriceLevels[1] === priceLevel) return 1;  // Good match
    return 2;  // Outside preferred range
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const generated: Record<number, ItinerarySlot[]> = {};
    const costs: Record<number, DayCosts> = {};
    
    // Filter to only hotels with validated locations
    // Prioritize by price preference
    let hotels = guideHotels
      .filter(h => hasValidatedLocation(h.id))
      .filter(h => !isFamily || h.kidFriendly !== false)
      .sort((a, b) => getPriceMatchScore(a.priceLevel) - getPriceMatchScore(b.priceLevel));
    
    if (hotels.length === 0) {
      console.error('[LocationValidation] No hotels with validated locations available');
      return;
    }
    
    const hotel = hotels[0];
    const hotelLocation = getValidatedLocation(hotel.id)!;
    setSelectedHotel(hotel);
    
    // Filter activities to only those with validated locations
    let activities = guideActivities.filter(a => hasValidatedLocation(a.id));
    if (isFamily) activities = activities.filter(a => a.kidFriendly !== false);
    if (isAdventure) activities = activities.filter(a => ['trilha', 'esporte', 'praia'].includes(a.category));
    
    // Prioritize iconic experiences
    const iconic = activities.filter(a => a.iconic);
    const regular = activities.filter(a => !a.iconic);
    
    // Filter restaurants to only those with validated locations
    // Sort by price match score to prioritize matching places
    let restaurants = guideRestaurants
      .filter(r => hasValidatedLocation(r.id))
      .filter(r => !isFamily || r.kidFriendly !== false)
      .sort((a, b) => getPriceMatchScore(a.priceLevel) - getPriceMatchScore(b.priceLevel));

    const usedActivities = new Set<string>();
    const usedRestaurants = new Set<string>();

    const getPriceEstimate = (priceLevel: string): number => {
      switch (priceLevel) {
        case '$': return 40;
        case '$$': return 80;
        case '$$$': return 150;
        case '$$$$': return 300;
        default: return 100;
      }
    };

    // Helper to create transport segment with real distance
    const createTransportSegment = (
      fromId: string,
      toId: string,
      fromNeighborhood: string,
      toNeighborhood: string
    ): { segment: TransportSegment; cost: number } | null => {
      const distance = getRealDistance(fromId, toId);
      if (distance === null || distance < 0.1) return null;
      
      const transport = getTransportMode(distance);
      return {
        segment: {
          from: fromNeighborhood,
          to: toNeighborhood,
          mode: transport.mode,
          duration: transport.duration,
          distanceKm: Math.round(distance * 10) / 10,
        },
        cost: transport.mode === 'uber' ? Math.ceil(distance * 5) + 10 : 0, // ~R$5/km + base
      };
    };

    let currentPlaceId = hotel.id;
    let currentNeighborhood = hotel.neighborhood;

    // Helper: parse "HH:MM" to minutes since midnight
    const parseTimeToMinutes = (t: string): number => {
      const [h, m] = t.split(":").map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    // Track pending items (saved but unschedulable)
    const pendingItems: { item: SavedItemRecord; reason: string; missing: string[] }[] = [];

    for (let day = 1; day <= actualTripDays; day++) {
      const daySlots: ItinerarySlot[] = [];
      let dayCost: DayCosts = { food: 0, activities: 0, transport: 0, total: 0 };
      
      currentPlaceId = hotel.id;
      currentNeighborhood = hotel.neighborhood;

      // ── 1) Compute dayISO and fetch saved items ──
      const tripStartDate = draft.arrivalAt ? new Date(draft.arrivalAt + "T12:00:00") : null;
      let dayISO: string | null = null;
      if (tripStartDate) {
        const dayDate = new Date(tripStartDate);
        dayDate.setDate(dayDate.getDate() + (day - 1));
        dayISO = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
      }

      const allSaved = getAllSavedItems()
        // Filter out past events
        .filter(i => {
          if (i.date_iso && i.date_iso < TODAY_ISO) {
            console.log(`[AutoItinerary] Skipping past event "${i.title}" (${i.date_iso})`);
            return false;
          }
          return true;
        });
      let savedForDay: SavedItemRecord[] = [];

      // Strategy 1: Direct date_iso match for this trip day
      if (dayISO) {
        savedForDay = allSaved.filter(i => i.date_iso === dayISO);
      }

      // Strategy 2: For items without a matching day, map by offset within trip range
      if (tripStartDate && dayISO) {
        const tripStartISO = `${tripStartDate.getFullYear()}-${String(tripStartDate.getMonth() + 1).padStart(2, '0')}-${String(tripStartDate.getDate()).padStart(2, '0')}`;
        const tripEnd = new Date(tripStartDate);
        tripEnd.setDate(tripEnd.getDate() + actualTripDays - 1);
        const tripEndISO = `${tripEnd.getFullYear()}-${String(tripEnd.getMonth() + 1).padStart(2, '0')}-${String(tripEnd.getDate()).padStart(2, '0')}`;
        for (const item of allSaved) {
          if (!item.date_iso || savedForDay.some(s => s.id === item.id)) continue;
          if (item.date_iso >= tripStartISO && item.date_iso <= tripEndISO) {
            const itemDate = new Date(item.date_iso + "T12:00:00");
            const diffDays = Math.round((itemDate.getTime() - tripStartDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays + 1 === day) savedForDay.push(item);
          }
        }
      }

      // Strategy 3: If this is Day 1, include orphan items
      if (day === 1) {
        const allDayISOs = new Set<string>();
        if (tripStartDate) {
          for (let d = 0; d < actualTripDays; d++) {
            const dt = new Date(tripStartDate);
            dt.setDate(dt.getDate() + d);
            allDayISOs.add(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`);
          }
        }
        for (const item of allSaved) {
          if (savedForDay.some(s => s.id === item.id)) continue;
          // Fixed-time items with date outside trip range → force into Day 1
          if ((item.type === "block" || item.type === "festa") && item.date_iso && !allDayISOs.has(item.date_iso)) {
            savedForDay.push(item);
            console.log(`[AutoItinerary] Orphan fixed item "${item.title}" (date=${item.date_iso}) forced into Day 1`);
          }
          // Items with no date_iso at all
          if (!item.date_iso && !savedForDay.some(s => s.id === item.id)) {
            savedForDay.push(item);
          }
        }
      }

      // ── Classify items by scheduling priority ──
      const isFixedTime = (i: SavedItemRecord) =>
        (i.type === "block" || i.type === "festa" || i.priority === "fixed") && i.start_time_24h;

      const fixedItems = savedForDay
        .filter(i => isFixedTime(i))
        .sort((a, b) => (a.start_time_24h || "").localeCompare(b.start_time_24h || ""));

      const hotelItems = savedForDay.filter(i => i.type === "hotel");
      const flexibleItems = savedForDay.filter(i => !isFixedTime(i) && i.type !== "hotel");

      // Debug
      console.log(`[AutoItinerary] Day ${day} (${dayISO || 'no-date'}): saved_total=${allSaved.length}, matched=${savedForDay.length}, fixed=${fixedItems.length}, hotels=${hotelItems.length}, flexible=${flexibleItems.length}`);

      // Build locked time ranges from fixed items (each ~2h)
      const lockedRanges: { start: number; end: number; id: string }[] = [];
      for (const item of fixedItems) {
        const startMin = parseTimeToMinutes(item.start_time_24h || "12:00");
        const duration = item.duration_minutes || 120;
        lockedRanges.push({ start: startMin, end: startMin + duration, id: item.id });
      }

      // Detect conflicts between fixed items
      const conflictIds = new Set<string>();
      for (let i = 0; i < lockedRanges.length; i++) {
        for (let j = i + 1; j < lockedRanges.length; j++) {
          if (lockedRanges[i].start < lockedRanges[j].end && lockedRanges[j].start < lockedRanges[i].end) {
            conflictIds.add(lockedRanges[j].id);
          }
        }
      }

      const overlapsLocked = (startMin: number, endMin: number): boolean =>
        lockedRanges.some(r => startMin < r.end && endMin > r.start);

      // ── 2) Insert hotel as "Base do dia" ──
      for (const hotelItem of hotelItems) {
        daySlots.push({
          time: '00:00',
          type: 'departure',
          item: {
            id: hotelItem.id,
            name: `🏨 ${hotelItem.title}`,
            neighborhood: hotelItem.neighborhood_short || hotelItem.neighborhood_full || '',
            description: 'Base do dia',
            address: hotelItem.location_label,
          },
          timeBlock: 'morning',
        });
      }

      // ── 3) Insert fixed items (blocos + festas) ──
      for (const item of fixedItems) {
        const timeStr = (item.start_time_24h || "12:00").slice(0, 5);
        const hourNum = parseInt(timeStr);
        const timeBlock: 'morning' | 'afternoon' | 'evening' =
          hourNum < 12 ? 'morning' : hourNum < 18 ? 'afternoon' : 'evening';
        
        const hasConflict = conflictIds.has(item.id);
        
        daySlots.push({
          time: timeStr,
          type: 'activity',
          item: {
            id: item.id,
            name: item.title,
            neighborhood: item.neighborhood_short || item.neighborhood_full || '',
            description: hasConflict 
              ? `⚠️ Conflito de horário | 📍 ${item.neighborhood_short || item.neighborhood_full || ''}  ✨ ${item.vibe_one_word || ''}`.trim()
              : `📍 ${item.neighborhood_short || item.neighborhood_full || ''}  ✨ ${item.vibe_one_word || ''}`.trim(),
            address: item.location_label,
          },
          timeBlock,
        });
      }

      // ── 4) Insert flexible saved items (restaurants, attractions, activities) ──
      for (const savedItem of flexibleItems) {
        // If no time at all, add to pending
        if (!savedItem.start_time_24h && !savedItem.date_iso) {
          const missing: string[] = [];
          if (!savedItem.date_iso) missing.push("data");
          if (!savedItem.start_time_24h) missing.push("horário");
          pendingItems.push({
            item: savedItem,
            reason: missing.includes("data") ? "Sem data" : "Sem horário ou janela de horário",
            missing,
          });
          continue;
        }

        // If has time but no date and this isn't day 1, skip (already added on day 1)
        const timeStr = savedItem.start_time_24h || "12:00";
        const hourNum = parseInt(timeStr);
        const timeBlock: 'morning' | 'afternoon' | 'evening' =
          hourNum < 12 ? 'morning' : hourNum < 18 ? 'afternoon' : 'evening';
        
        // Check for overlap with fixed items
        const startMin = parseTimeToMinutes(timeStr);
        if (overlapsLocked(startMin, startMin + 60)) {
          // Try to shift ±1h
          const shifted = startMin + 60;
          if (!overlapsLocked(shifted, shifted + 60)) {
            const shiftedTime = `${String(Math.floor(shifted / 60)).padStart(2, '0')}:${String(shifted % 60).padStart(2, '0')}`;
            daySlots.push({
              time: shiftedTime,
              type: savedItem.type === 'restaurant' ? 'meal' : 'activity',
              item: {
                id: savedItem.id,
                name: savedItem.title,
                neighborhood: savedItem.neighborhood_full || savedItem.neighborhood_short || '',
                description: savedItem.notes_full || '',
                address: savedItem.location_label,
              },
              timeBlock,
            });
            continue;
          }
        }
        
        daySlots.push({
          time: timeStr.slice(0, 5),
          type: savedItem.type === 'restaurant' ? 'meal' : 'activity',
          item: {
            id: savedItem.id,
            name: savedItem.title,
            neighborhood: savedItem.neighborhood_full || savedItem.neighborhood_short || '',
            description: savedItem.notes_full || '',
            address: savedItem.location_label,
          },
          timeBlock,
        });
      }

      // ── 5) NO random filling — only use saved items ──

      // ── 6) If saved hotel anchor exists, show departure from it ──
      if (hotelItems.length === 0 && selectedHotel && (fixedItems.length > 0 || flexibleItems.length > 0)) {
        if (!overlapsLocked(510, 570)) {
          const hotelAddr = getValidatedLocation(hotel.id);
          daySlots.push({
            time: '08:30', type: 'departure',
            item: { id: hotel.id, name: hotel.name, neighborhood: hotel.neighborhood, description: 'Saída do hotel', address: hotelAddr?.fullAddress },
            timeBlock: 'morning'
          });
        }
      }

      // Return to hotel only if we have items
      if (daySlots.length > 0 && selectedHotel) {
        const retTr = createTransportSegment(currentPlaceId, hotel.id, currentNeighborhood, hotel.neighborhood);
        if (retTr) {
          daySlots.push({ time: '22:00', type: 'transport', item: { id: 'transport', name: `${retTr.segment.mode === 'walking' ? 'A pé' : 'Uber'} — retorno ao hotel`, neighborhood: '', description: '' }, transport: retTr.segment, timeBlock: 'evening' });
          dayCost.transport += retTr.cost;
        }
      }

      dayCost.total = dayCost.food + dayCost.activities + dayCost.transport;
      costs[day] = dayCost;

      // Sort all slots by time (but keep hotel "Base do dia" at top)
      daySlots.sort((a, b) => {
        // Hotel base always first
        if (a.item.description === 'Base do dia') return -1;
        if (b.item.description === 'Base do dia') return 1;
        return a.time.localeCompare(b.time);
      });

      // Debug summary
      console.log(`[AutoItinerary] Day ${day} summary: total_slots=${daySlots.length}, pending=${pendingItems.length}`);

      generated[day] = daySlots;
    }

    // Store pending items in a special "day 0" key for UI rendering
    if (pendingItems.length > 0) {
      generated[0] = pendingItems.map(p => ({
        time: '--:--',
        type: 'activity' as const,
        item: {
          id: p.item.id,
          name: p.item.title,
          neighborhood: p.item.neighborhood_full || '',
          description: `⚠️ ${p.reason} (${p.missing.join(', ')})`,
          address: p.item.location_label,
        },
        timeBlock: 'morning' as const,
      }));
    }

    setDayCosts(costs);
    setItinerary(generated);
    setIsGenerating(false);
    setIsGenerated(true);
  };

  const handleConfirm = () => {
    localStorage.setItem('generatedItinerary', JSON.stringify({
      destination: draft.destinationId,
      days: actualTripDays,
      itinerary,
      dayCosts,
      hotel: selectedHotel,
      createdAt: new Date().toISOString()
    }));
    navigate('/roteiro/rio-3-dias-final');
  };

  const getTimeBlockLabel = (block: string) => {
    switch (block) {
      case 'morning': return 'Manhã';
      case 'afternoon': return 'Tarde';
      case 'evening': return 'Noite';
      default: return '';
    }
  };

  const renderSlotIcon = (slot: ItinerarySlot) => {
    if (slot.type === 'transport') {
      return slot.transport?.mode === 'walking' 
        ? <Footprints className="w-4 h-4 text-muted-foreground" />
        : <Car className="w-4 h-4 text-muted-foreground" />;
    }
    if (slot.type === 'departure') return <Clock className="w-4 h-4 text-primary" />;
    if (slot.type === 'meal') return <Utensils className="w-4 h-4 text-orange-500" />;
    if (slot.type === 'sunset') return <Sun className="w-4 h-4 text-amber-500" />;
    // Check if this is a saved event item
    const savedItems = getAllSavedItems();
    if (savedItems.some(i => i.id === slot.item.id && (i.type === 'block' || i.type === 'festa'))) {
      return <PartyPopper className="w-4 h-4 text-pink-500" />;
    }
    return <MapPin className="w-4 h-4 text-primary" />;
  };

  const getSlotBg = (slot: ItinerarySlot) => {
    if (slot.type === 'transport') return 'bg-muted/50';
    if (slot.type === 'departure') return 'bg-primary/20';
    if (slot.type === 'meal') return 'bg-orange-500/20';
    if (slot.type === 'sunset') return 'bg-amber-500/20';
    return 'bg-primary/20';
  };

  // Get detail route for an item based on type - DISABLED: we use inline editing now
  // Kept for reference only
  const getItemRoute = (slot: ItinerarySlot): string | null => {
    // Disabled navigation - all editing happens in-place via EditSlotSheet
    return null;
  };

  // Handle slot click - open detail sheet to view item
  const handleSlotClick = (day: number, index: number, slot: ItinerarySlot) => {
    if (slot.type === 'transport') return;
    setViewingSlot({ day, index, slot });
    setDetailSheetOpen(true);
  };

  // Handle edit button click - go directly to edit/replace sheet
  const handleEditClick = (day: number, index: number, slot: ItinerarySlot, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slot.type === 'transport') return;
    setEditingSlot({ day, index, slot });
    setEditSheetOpen(true);
  };

  // Open edit sheet from detail view
  const handleOpenReplaceFromDetail = () => {
    if (viewingSlot) {
      setEditingSlot(viewingSlot);
      setDetailSheetOpen(false);
      setEditSheetOpen(true);
    }
  };

  // Handle saving time changes
  const handleSaveTime = (newTime: string, duration: number) => {
    if (!viewingSlot) return;
    
    const { day, index, slot } = viewingSlot;
    
    // Update the slot with new time
    const updatedSlot: ItinerarySlot = {
      ...slot,
      time: newTime,
    };
    
    // Update itinerary state
    setItinerary(prev => {
      const daySlots = [...prev[day]];
      daySlots[index] = updatedSlot;
      return { ...prev, [day]: daySlots };
    });
    
    // Update the viewing slot to reflect changes
    setViewingSlot({ day, index, slot: updatedSlot });
  };

  // Remove item from itinerary
  const handleRemoveItem = () => {
    if (!viewingSlot) return;
    
    const { day, index } = viewingSlot;
    setItinerary(prev => {
      const daySlots = [...prev[day]];
      daySlots.splice(index, 1);
      return { ...prev, [day]: daySlots };
    });
    
    setViewingSlot(null);
    setDetailSheetOpen(false);
  };

  // Handle selecting an alternative
  const handleSelectAlternative = (newItem: GuideRestaurant | GuideActivity | GuideHotel) => {
    if (!editingSlot) return;
    
    const { day, index, slot } = editingSlot;
    const newLocation = getValidatedLocation(newItem.id);
    
    // Update the slot with new item data
    const updatedSlot: ItinerarySlot = {
      ...slot,
      item: {
        id: newItem.id,
        name: newItem.name,
        neighborhood: newItem.neighborhood,
        description: newItem.description,
        address: newLocation?.fullAddress,
      }
    };
    
    // Update itinerary state
    setItinerary(prev => {
      const daySlots = [...prev[day]];
      daySlots[index] = updatedSlot;
      return { ...prev, [day]: daySlots };
    });
    
    // If changing hotel, update selectedHotel
    if (slot.type === 'departure' && 'priceLevel' in newItem) {
      setSelectedHotel(newItem as typeof guideHotels[0]);
    }
    
    setEditingSlot(null);
  };

  // Handle selecting an external place (from Google)
  const handleSelectExternalPlace = (place: HybridPlaceResult) => {
    if (!editingSlot) return;
    
    const { day, index, slot } = editingSlot;
    
    // Update the slot with external place data
    const updatedSlot: ItinerarySlot = {
      ...slot,
      item: {
        id: `external-${place.placeId || place.id}`,
        name: place.name,
        neighborhood: place.neighborhood || 'Local adicionado',
        description: place.description || 'Adicionado por você',
        address: place.address,
      }
    };
    
    // Update itinerary state
    setItinerary(prev => {
      const daySlots = [...prev[day]];
      daySlots[index] = updatedSlot;
      return { ...prev, [day]: daySlots };
    });
    
    setEditingSlot(null);
  };

  // Get all used IDs in the itinerary (for filtering alternatives)
  const getUsedIds = (): Set<string> => {
    const ids = new Set<string>();
    Object.values(itinerary).forEach(slots => {
      slots.forEach(slot => {
        if (slot.type !== 'transport') {
          ids.add(slot.item.id);
        }
      });
    });
    return ids;
  };

  // Coherence analysis for distance/time warnings
  const coherenceAnalysis = useItineraryCoherence(itinerary);

  // Handle day optimization (simple proximity-based reordering)
  const handleOptimizeDay = (dayNumber: number) => {
    // For now, just show a toast or feedback
    // Full optimization would reorder by proximity
    console.log('Optimize day:', dayNumber);
    // This is a placeholder - full implementation would:
    // 1. Reorder items by proximity
    // 2. Show confirmation dialog
    // 3. Apply changes only if user confirms
  };

  // Get travel segment between two slots
  const getSegmentWarning = (dayNumber: number, segmentIndex: number) => {
    const dayCoherence = coherenceAnalysis[dayNumber];
    if (!dayCoherence) return undefined;
    return dayCoherence.warnings.find(w => w.segmentIndex === segmentIndex);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/meu-roteiro/decisao')}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Roteiro automático</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-32">
        {/* Skeleton Loading State */}
        {isGenerating && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Skeleton className="h-6 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
            {[1, 2].map((day) => (
              <div key={day} className="bg-card rounded-2xl p-4 space-y-4">
                <Skeleton className="h-5 w-20" />
                {[1, 2, 3, 4, 5].map((slot) => (
                  <div key={slot} className="flex gap-3 items-center">
                    <Skeleton className="w-12 h-4" />
                    <Skeleton className="w-7 h-7 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Auto-generation info (before generation) */}
        {!isGenerated && !isGenerating && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                Seu roteiro de {actualTripDays} {actualTripDays === 1 ? 'dia' : 'dias'}
              </h2>
              <p className="text-muted-foreground text-sm">
                Baseado nas suas datas de viagem.
              </p>
              {actualTripDays > 3 && (
                <p className="text-muted-foreground text-xs mt-2">
                  Viagens mais longas são organizadas em partes para facilitar ajustes.
                </p>
              )}
            </div>

            <Button onClick={generateItinerary} className="w-full h-14 text-lg font-semibold rounded-2xl shadow-sm active:scale-[0.98] transition-transform">
              Gerar meu roteiro
            </Button>
          </>
        )}
        
        {/* Generated Itinerary */}
        {isGenerated && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Seu roteiro de {actualTripDays} {actualTripDays === 1 ? 'dia' : 'dias'}
              </h2>
              <p className="text-sm text-muted-foreground">Curado pelo The Lucky Trip</p>
              {selectedHotel && (
                <p className="text-xs text-muted-foreground mt-2">
                  Hospedagem: {selectedHotel.name} ({selectedHotel.neighborhood})
                </p>
              )}
            </div>

            <div className="space-y-6">
              {Object.entries(itinerary).filter(([day]) => parseInt(day) > 0).map(([day, slots]) => {
                const dayNumber = parseInt(day);
                const costs = dayCosts[dayNumber];
                const dayCoherence = coherenceAnalysis[dayNumber];
                let currentBlock = '';
                
                // Filter place slots for travel segment calculation
                const placeSlots = slots.filter(s => s.type !== 'transport');
                let placeSlotIndex = 0;
                
                return (
                  <div key={day} className="bg-card rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Dia {day}</h3>
                      {dayCoherence && dayCoherence.totalTravelKm > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Car className="w-3 h-3" />
                          <span>{dayCoherence.totalTravelKm} km</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span>~{dayCoherence.totalTravelMin} min</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {slots.map((slot, idx) => {
                        const showBlockHeader = slot.timeBlock && slot.timeBlock !== currentBlock && slot.type !== 'transport';
                        if (slot.timeBlock && slot.type !== 'transport') currentBlock = slot.timeBlock;
                        
                        // Track place slot index for travel segments
                        const currentPlaceIndex = slot.type !== 'transport' ? placeSlotIndex++ : -1;
                        
                        // Get travel segment AFTER this slot (if it's a place slot)
                        const showTravelAfter = slot.type !== 'transport' && 
                          currentPlaceIndex < placeSlots.length - 1 &&
                          dayCoherence?.segments[currentPlaceIndex];
                        
                        const travelSegment = showTravelAfter ? dayCoherence.segments[currentPlaceIndex] : null;
                        const segmentWarning = showTravelAfter ? getSegmentWarning(dayNumber, currentPlaceIndex) : undefined;
                        
                        return (
                          <div key={idx}>
                            {showBlockHeader && (
                              <div className="flex items-center gap-2 mt-4 mb-2 first:mt-0">
                                {slot.timeBlock === 'morning' && <Sun className="w-3 h-3 text-amber-500" />}
                                {slot.timeBlock === 'afternoon' && <Sun className="w-3 h-3 text-orange-500" />}
                                {slot.timeBlock === 'evening' && <Moon className="w-3 h-3 text-indigo-400" />}
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  {getTimeBlockLabel(slot.timeBlock || '')}
                                </span>
                              </div>
                            )}
                            
                            {/* Skip transport slots - we show our own travel indicators */}
                            {slot.type === 'transport' ? null : (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  onClick={() => handleSlotClick(dayNumber, idx, slot)}
                                  className={cn(
                                    "flex gap-3 items-start py-2 group cursor-pointer hover:bg-muted/50 rounded-lg -mx-2 px-2 transition-colors"
                                  )}
                                >
                                  <div className="w-12 text-xs text-muted-foreground pt-1 tabular-nums">
                                    {/* Blocks/festas show hour only (e.g. "8h"), others show HH:MM */}
                                    {(() => {
                                      const savedItems = getAllSavedItems();
                                      const isFixedEvent = savedItems.some(i => i.id === slot.item.id && (i.type === 'block' || i.type === 'festa'));
                                      if (slot.item.description === 'Base do dia') return '🏨';
                                      return isFixedEvent ? String(parseInt(slot.time)) + 'h' : slot.time;
                                    })()}
                                  </div>
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                                    getSlotBg(slot)
                                  )}>
                                    {renderSlotIcon(slot)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground text-sm truncate">{slot.item.name}</p>
                                    {slot.item.description?.startsWith('📍') ? (
                                      <p className="text-xs text-muted-foreground">{slot.item.description}</p>
                                    ) : slot.item.neighborhood && (
                                      <p className="text-xs text-muted-foreground">{slot.item.neighborhood}</p>
                                    )}
                                  </div>
                                  <button
                                    onClick={(e) => handleEditClick(dayNumber, idx, slot, e)}
                                    className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95"
                                    aria-label="Trocar"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                </motion.div>
                                
                                {/* Travel indicator between items */}
                                {travelSegment && (
                                  <div className="ml-12 pl-5 border-l-2 border-dashed border-border">
                                    <TravelIndicator
                                      segment={travelSegment}
                                      warning={segmentWarning}
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Day Coherence Warning */}
                    {dayCoherence?.hasIssues && (
                      <DayCoherenceWarning
                        warnings={dayCoherence.warnings}
                        canOptimize={dayCoherence.canOptimize}
                        onOptimize={() => handleOptimizeDay(dayNumber)}
                      />
                    )}
                    
                    {/* Daily Cost Estimate */}
                    {costs && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Estimativa de custos do dia</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full">
                            Alimentação: R$ {costs.food}
                          </span>
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Atividades: R$ {costs.activities}
                          </span>
                          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full">
                            Transporte: R$ {costs.transport}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-foreground mt-2">
                          Total estimado: R$ {costs.total}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1 italic">
                          * Valores aproximados. Custos reais podem variar conforme escolhas e temporada.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pendentes Section */}
            {itinerary[0] && itinerary[0].length > 0 && (
              <div className="bg-card rounded-2xl p-4 mt-6 border border-dashed border-border">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="font-semibold text-foreground">Pendentes</h3>
                  <span className="text-xs text-muted-foreground">
                    ({itinerary[0].length} {itinerary[0].length === 1 ? 'item' : 'itens'})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Itens salvos que não puderam ser agendados automaticamente.
                </p>
                <div className="space-y-2">
                  {itinerary[0].map((slot, idx) => (
                    <div key={idx} className="flex gap-3 items-start py-2 bg-muted/30 rounded-lg px-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-500/20">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{slot.item.name}</p>
                        <p className="text-xs text-muted-foreground">{slot.item.description}</p>
                        {slot.item.neighborhood && (
                          <p className="text-xs text-muted-foreground mt-0.5">📍 {slot.item.neighborhood}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Fixed CTA - positioned above bottom nav with safe area */}
      {isGenerated && (
        <div className="fixed bottom-safe-cta left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40">
          <Button onClick={handleConfirm} className="w-full h-14 text-lg font-semibold rounded-2xl shadow-sm active:scale-[0.98] transition-transform">
            <Check className="w-5 h-5 mr-2" />
            Confirmar roteiro
          </Button>
        </div>
      )}

      {/* Item Detail Sheet - shows curated details and time editing */}
      <ItineraryItemDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        item={viewingSlot?.slot.item || null}
        itemType={viewingSlot?.slot.type || 'activity'}
        currentTime={viewingSlot?.slot.time}
        onSaveTime={handleSaveTime}
        onReplace={handleOpenReplaceFromDetail}
        onRemove={handleRemoveItem}
      />

      {/* Edit Slot Sheet - for replacing items */}
      <EditSlotSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        slot={editingSlot?.slot || null}
        onSelectAlternative={handleSelectAlternative}
        onSelectExternalPlace={handleSelectExternalPlace}
        usedIds={getUsedIds()}
      />
    </div>
  );
};

export default AutomaticItinerary;
