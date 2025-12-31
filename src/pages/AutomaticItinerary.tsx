import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Check, MapPin, Utensils, Sun, Moon, Car, Footprints, Clock, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripDraft, PriceStyle } from "@/hooks/use-trip-draft";
import { guideRestaurants, guideActivities, guideHotels, GuideRestaurant, GuideActivity, GuideHotel } from "@/data/rio-guide-data";
import { cn } from "@/lib/utils";
import { calculateDistance, getTransportDetails } from "@/lib/location-validation";
import { getValidatedLocation, hasValidatedLocation } from "@/data/validated-locations";
import { EditSlotSheet } from "@/components/itinerary/EditSlotSheet";

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
  
  // Auto-generate on mount if trip dates are valid
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false);

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
    return <MapPin className="w-4 h-4 text-primary" />;
  };

  const getSlotBg = (slot: ItinerarySlot) => {
    if (slot.type === 'transport') return 'bg-muted/50';
    if (slot.type === 'departure') return 'bg-primary/20';
    if (slot.type === 'meal') return 'bg-orange-500/20';
    if (slot.type === 'sunset') return 'bg-amber-500/20';
    return 'bg-primary/20';
  };

  // Get detail route for an item based on type
  const getItemRoute = (slot: ItinerarySlot): string | null => {
    if (slot.type === 'transport') return null;
    if (slot.type === 'departure') return `/hotel/${slot.item.id}`;
    if (slot.type === 'meal') return `/restaurante/${slot.item.id}`;
    if (slot.type === 'activity' || slot.type === 'sunset') return `/atividade/${slot.item.id}`;
    return null;
  };

  const handleSlotClick = (slot: ItinerarySlot) => {
    const route = getItemRoute(slot);
    if (route) {
      navigate(route);
    }
  };

  // Handle edit button click
  const handleEditClick = (day: number, index: number, slot: ItinerarySlot, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slot.type === 'transport') return;
    setEditingSlot({ day, index, slot });
    setEditSheetOpen(true);
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
                let currentBlock = '';
                
                return (
                  <div key={day} className="bg-card rounded-2xl p-4">
                    <h3 className="font-semibold text-foreground mb-4">Dia {day}</h3>
                    <div className="space-y-2">
                      {slots.map((slot, idx) => {
                        const showBlockHeader = slot.timeBlock && slot.timeBlock !== currentBlock && slot.type !== 'transport';
                        if (slot.timeBlock && slot.type !== 'transport') currentBlock = slot.timeBlock;
                        
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
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => handleSlotClick(slot)}
                              className={cn(
                                "flex gap-3 items-start py-2 group",
                                slot.type === 'transport' && "opacity-60",
                                getItemRoute(slot) && "cursor-pointer hover:bg-muted/50 rounded-lg -mx-2 px-2 transition-colors"
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
                                {slot.type === 'transport' ? (
                                  <p className="text-xs text-muted-foreground">
                                    {slot.transport?.mode === 'walking' ? '🚶' : '🚗'} {slot.transport?.from} → {slot.transport?.to} ({slot.transport?.duration})
                                  </p>
                                ) : (
                                  <>
                                    <p className={cn(
                                      "font-medium text-foreground text-sm truncate",
                                      getItemRoute(slot) && "underline decoration-dotted underline-offset-2 decoration-muted-foreground/50"
                                    )}>{slot.item.name}</p>
                                    {slot.item.neighborhood && (
                                      <p className="text-xs text-muted-foreground">{slot.item.neighborhood}</p>
                                    )}
                                  </>
                                )}
                              </div>
                              {/* Edit button - only for non-transport slots */}
                              {slot.type !== 'transport' && (
                                <button
                                  onClick={(e) => handleEditClick(dayNumber, idx, slot, e)}
                                  className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95"
                                  aria-label="Trocar"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                    
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

      {/* Edit Slot Sheet */}
      <EditSlotSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        slot={editingSlot?.slot || null}
        onSelectAlternative={handleSelectAlternative}
        usedIds={getUsedIds()}
      />
    </div>
  );
};

export default AutomaticItinerary;
