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
  const isFamily = tripStyles.includes('familia') || draft.children > 0;
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

    for (let day = 1; day <= actualTripDays; day++) {
      const daySlots: ItinerarySlot[] = [];
      let dayCost: DayCosts = { food: 0, activities: 0, transport: 0, total: 0 };
      
      // Reset to hotel at start of each day
      currentPlaceId = hotel.id;
      currentNeighborhood = hotel.neighborhood;

      // Departure from hotel
      const hotelAddr = getValidatedLocation(hotel.id);
      daySlots.push({
        time: '08:30',
        type: 'departure',
        item: { 
          id: hotel.id, 
          name: hotel.name, 
          neighborhood: hotel.neighborhood, 
          description: 'Saída do hotel',
          address: hotelAddr?.fullAddress,
        },
        timeBlock: 'morning'
      });

      // Morning activity (prefer iconic on day 1)
      const morningPool = day === 1 ? iconic : regular;
      const morningActivity = morningPool.find(a => 
        !usedActivities.has(a.id) && 
        (a.bestTime === 'manhã' || a.bestTime === 'qualquer')
      ) || regular.find(a => !usedActivities.has(a.id));
      
      if (morningActivity) {
        usedActivities.add(morningActivity.id);
        const activityLocation = getValidatedLocation(morningActivity.id);
        
        // Add transport to activity
        const transportResult = createTransportSegment(
          currentPlaceId,
          morningActivity.id,
          currentNeighborhood,
          morningActivity.neighborhood
        );
        
        if (transportResult) {
          daySlots.push({
            time: '08:45',
            type: 'transport',
            item: { id: 'transport', name: `${transportResult.segment.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: transportResult.segment,
            timeBlock: 'morning'
          });
          dayCost.transport += transportResult.cost;
        }
        
        currentPlaceId = morningActivity.id;
        currentNeighborhood = morningActivity.neighborhood;
        daySlots.push({
          time: '09:00',
          type: 'activity',
          item: { ...morningActivity, address: activityLocation?.fullAddress },
          timeBlock: 'morning'
        });
        dayCost.activities += 50;
      }

      // Lunch - prioritize price match, then proximity
      // Track upgrades per day (allow max 1 outside preferred range)
      let upgradesUsedToday = 0;
      const maxUpgradesPerDay = 1;
      
      const currentLocation = getValidatedLocation(currentPlaceId);
      let sortedRestaurants = restaurants
        .filter(r => !usedRestaurants.has(r.id) && r.mealType.includes('lunch'))
        .map(r => {
          const loc = getValidatedLocation(r.id);
          const dist = currentLocation && loc 
            ? calculateDistance(currentLocation.lat, currentLocation.lng, loc.lat, loc.lng)
            : 999;
          const priceScore = getPriceMatchScore(r.priceLevel);
          return { ...r, distance: dist, priceScore };
        })
        // Sort by price match first, then distance
        .sort((a, b) => {
          if (a.priceScore !== b.priceScore) return a.priceScore - b.priceScore;
          return a.distance - b.distance;
        });
      
      // Pick first option, checking upgrade limit
      let lunch = sortedRestaurants.find(r => {
        if (r.priceScore <= 1) return true; // Within preferred range
        if (upgradesUsedToday < maxUpgradesPerDay) {
          upgradesUsedToday++;
          return true;
        }
        return false;
      });
      
      if (lunch) {
        usedRestaurants.add(lunch.id);
        const lunchLocation = getValidatedLocation(lunch.id);
        
        const transportResult = createTransportSegment(
          currentPlaceId,
          lunch.id,
          currentNeighborhood,
          lunch.neighborhood
        );
        
        if (transportResult) {
          daySlots.push({
            time: '12:15',
            type: 'transport',
            item: { id: 'transport', name: `${transportResult.segment.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: transportResult.segment,
            timeBlock: 'afternoon'
          });
          dayCost.transport += transportResult.cost;
        }
        
        currentPlaceId = lunch.id;
        currentNeighborhood = lunch.neighborhood;
        daySlots.push({
          time: '12:30',
          type: 'meal',
          item: { ...lunch, address: lunchLocation?.fullAddress },
          timeBlock: 'afternoon'
        });
        dayCost.food += getPriceEstimate(lunch.priceLevel);
      }

      // Afternoon activity - prefer nearby
      const afternoonLocation = getValidatedLocation(currentPlaceId);
      let sortedAfternoonActivities = regular
        .filter(a => !usedActivities.has(a.id) && (a.bestTime === 'tarde' || a.bestTime === 'qualquer'))
        .map(a => {
          const loc = getValidatedLocation(a.id);
          const dist = afternoonLocation && loc
            ? calculateDistance(afternoonLocation.lat, afternoonLocation.lng, loc.lat, loc.lng)
            : 999;
          return { ...a, distance: dist };
        })
        .sort((a, b) => a.distance - b.distance);
      
      const afternoonActivity = sortedAfternoonActivities[0];
      
      if (afternoonActivity) {
        usedActivities.add(afternoonActivity.id);
        const activityLocation = getValidatedLocation(afternoonActivity.id);
        
        const transportResult = createTransportSegment(
          currentPlaceId,
          afternoonActivity.id,
          currentNeighborhood,
          afternoonActivity.neighborhood
        );
        
        if (transportResult) {
          daySlots.push({
            time: '14:45',
            type: 'transport',
            item: { id: 'transport', name: `${transportResult.segment.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: transportResult.segment,
            timeBlock: 'afternoon'
          });
          dayCost.transport += transportResult.cost;
        }
        
        currentPlaceId = afternoonActivity.id;
        currentNeighborhood = afternoonActivity.neighborhood;
        daySlots.push({
          time: '15:00',
          type: 'activity',
          item: { ...afternoonActivity, address: activityLocation?.fullAddress },
          timeBlock: 'afternoon'
        });
        dayCost.activities += 50;
      }

      // Sunset (if available)
      const sunsetActivity = activities.find(a => 
        !usedActivities.has(a.id) && a.bestTime === 'pôr do sol'
      );
      if (sunsetActivity) {
        usedActivities.add(sunsetActivity.id);
        const sunsetLocation = getValidatedLocation(sunsetActivity.id);
        
        const transportResult = createTransportSegment(
          currentPlaceId,
          sunsetActivity.id,
          currentNeighborhood,
          sunsetActivity.neighborhood
        );
        
        if (transportResult) {
          daySlots.push({
            time: '17:00',
            type: 'transport',
            item: { id: 'transport', name: `${transportResult.segment.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: transportResult.segment,
            timeBlock: 'evening'
          });
          dayCost.transport += transportResult.cost;
        }
        
        currentPlaceId = sunsetActivity.id;
        currentNeighborhood = sunsetActivity.neighborhood;
        daySlots.push({
          time: '17:30',
          type: 'sunset',
          item: { ...sunsetActivity, address: sunsetLocation?.fullAddress },
          timeBlock: 'evening'
        });
      }

      // Dinner - prioritize price match, then proximity
      const dinnerLocation = getValidatedLocation(currentPlaceId);
      let sortedDinnerRestaurants = restaurants
        .filter(r => !usedRestaurants.has(r.id) && r.mealType.includes('dinner'))
        .map(r => {
          const loc = getValidatedLocation(r.id);
          const dist = dinnerLocation && loc
            ? calculateDistance(dinnerLocation.lat, dinnerLocation.lng, loc.lat, loc.lng)
            : 999;
          const priceScore = getPriceMatchScore(r.priceLevel);
          return { ...r, distance: dist, priceScore };
        })
        // Sort by price match first, then distance
        .sort((a, b) => {
          if (a.priceScore !== b.priceScore) return a.priceScore - b.priceScore;
          return a.distance - b.distance;
        });
      
      // Pick first option, checking upgrade limit
      let dinner = sortedDinnerRestaurants.find(r => {
        if (r.priceScore <= 1) return true; // Within preferred range
        if (upgradesUsedToday < maxUpgradesPerDay) {
          upgradesUsedToday++;
          return true;
        }
        return false;
      });
      
      if (dinner) {
        usedRestaurants.add(dinner.id);
        const dinnerLoc = getValidatedLocation(dinner.id);
        
        const transportResult = createTransportSegment(
          currentPlaceId,
          dinner.id,
          currentNeighborhood,
          dinner.neighborhood
        );
        
        if (transportResult) {
          daySlots.push({
            time: '19:30',
            type: 'transport',
            item: { id: 'transport', name: `${transportResult.segment.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: transportResult.segment,
            timeBlock: 'evening'
          });
          dayCost.transport += transportResult.cost;
        }
        
        currentPlaceId = dinner.id;
        currentNeighborhood = dinner.neighborhood;
        daySlots.push({
          time: '20:00',
          type: 'meal',
          item: { ...dinner, address: dinnerLoc?.fullAddress },
          timeBlock: 'evening'
        });
        dayCost.food += getPriceEstimate(dinner.priceLevel);
      }

      // Return to hotel
      const returnTransport = createTransportSegment(
        currentPlaceId,
        hotel.id,
        currentNeighborhood,
        hotel.neighborhood
      );
      
      if (returnTransport) {
        daySlots.push({
          time: '22:00',
          type: 'transport',
          item: { id: 'transport', name: `${returnTransport.segment.mode === 'walking' ? 'A pé' : 'Uber'} — retorno ao hotel`, neighborhood: '', description: '' },
          transport: returnTransport.segment,
          timeBlock: 'evening'
        });
        dayCost.transport += returnTransport.cost;
      }

      dayCost.total = dayCost.food + dayCost.activities + dayCost.transport;
      costs[day] = dayCost;

      // ── Inject saved items from SavedItems for this day ──
      const tripStartDate = draft.arrivalAt ? new Date(draft.arrivalAt) : null;
      let dayISO: string | null = null;
      if (tripStartDate) {
        const dayDate = new Date(tripStartDate);
        dayDate.setDate(dayDate.getDate() + (day - 1));
        dayISO = dayDate.toISOString().slice(0, 10);
      }

      const allSaved = getAllSavedItems();

      // Debug: log saved items summary
      const savedBlocks = allSaved.filter(i => i.type === "block");
      if (day === 1) {
        console.log(`[AutoItinerary] Total saved items: ${allSaved.length}, blocks: ${savedBlocks.length}`);
        console.log(`[AutoItinerary] First 3 saved:`, allSaved.slice(0, 3).map(i => ({ id: i.id, type: i.type, date: i.date_iso, time: i.start_time_24h })));
        console.log(`[AutoItinerary] Trip start: ${dayISO}, days: ${actualTripDays}`);
      }

      // Strategy: match saved items to trip days
      // 1. If dayISO matches a saved item's date_iso → include it
      // 2. If no trip dates set (dayISO null), put ALL saved blocks on day 1
      // 3. Also check: if saved block date falls within trip range but doesn't match
      //    a specific day number, map it by computing the day offset
      let savedForDay: SavedItemRecord[] = [];

      if (dayISO) {
        // Direct date match
        savedForDay = allSaved.filter(i => i.date_iso === dayISO);
      } else {
        // No trip dates → all saved blocks go to day 1
        if (day === 1) {
          savedForDay = allSaved.filter(i => i.type === "block" || i.type === "attraction" || i.type === "restaurant" || i.type === "hotel");
        }
      }

      // Also: catch saved blocks whose date_iso falls within trip range but
      // maps to THIS day via offset (handles case where user sets dates that
      // don't start on the block's date)
      if (tripStartDate && dayISO) {
        const tripEnd = new Date(tripStartDate);
        tripEnd.setDate(tripEnd.getDate() + actualTripDays - 1);
        const tripEndISO = tripEnd.toISOString().slice(0, 10);

        // Find saved items with date_iso that maps to this day number
        for (const item of allSaved) {
          if (!item.date_iso) continue;
          if (savedForDay.some(s => s.id === item.id)) continue;
          // Check if this item's date is within trip range
          if (item.date_iso >= (tripStartDate.toISOString().slice(0, 10)) && item.date_iso <= tripEndISO) {
            // Compute which trip day this belongs to
            const itemDate = new Date(item.date_iso + "T12:00:00");
            const diffDays = Math.round((itemDate.getTime() - tripStartDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays + 1 === day) {
              savedForDay.push(item);
            }
          }
        }
      }

      if (day === 1) {
        console.log(`[AutoItinerary] Saved items for day ${day} (${dayISO}): ${savedForDay.length}`, savedForDay.map(i => i.id));
      }

      for (const savedItem of savedForDay) {
        const alreadyInDay = daySlots.some(s => s.item.id === savedItem.id);
        if (alreadyInDay) continue;

        const timeStr = savedItem.start_time_24h || "12:00";
        const hourNum = parseInt(timeStr);
        const timeBlock: 'morning' | 'afternoon' | 'evening' =
          hourNum < 12 ? 'morning' : hourNum < 18 ? 'afternoon' : 'evening';

        daySlots.push({
          time: timeStr.slice(0, 5),
          type: 'activity',
          item: {
            id: savedItem.id,
            name: savedItem.title,
            neighborhood: savedItem.neighborhood_full || savedItem.neighborhood_short || '',
            description: savedItem.notes_full || `📍 ${savedItem.neighborhood_short || ''}  ✨ ${savedItem.vibe_one_word || ''}`.trim(),
            address: savedItem.location_label,
          },
          timeBlock,
        });
      }

      // Re-sort all slots by time
      daySlots.sort((a, b) => a.time.localeCompare(b.time));

      generated[day] = daySlots;
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
    // Check if this is a saved carnival block
    const savedItems = getAllSavedItems();
    if (savedItems.some(i => i.id === slot.item.id && i.type === 'block')) {
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
              {Object.entries(itinerary).map(([day, slots]) => {
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
                                  <div className="w-12 text-xs text-muted-foreground pt-1 tabular-nums">{slot.time}</div>
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                                    getSlotBg(slot)
                                  )}>
                                    {renderSlotIcon(slot)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground text-sm truncate">{slot.item.name}</p>
                                    {slot.item.neighborhood && (
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
