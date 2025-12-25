import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Check, MapPin, Utensils, Sun, Moon, Car, Footprints, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { guideRestaurants, guideActivities, guideHotels, proximityMap } from "@/data/rio-guide-data";
import { cn } from "@/lib/utils";

/**
 * AUTOMATIC ITINERARY GENERATOR
 * Creates curated itinerary from The Lucky Trip guide data.
 * Includes accommodation anchoring, transport segments, and cost estimates.
 */

type DayOption = 2 | 3;

interface TransportSegment {
  from: string;
  to: string;
  mode: 'walking' | 'car' | 'uber';
  duration: string;
}

interface ItinerarySlot {
  time: string;
  type: 'activity' | 'meal' | 'sunset' | 'transport' | 'departure';
  item: { id: string; name: string; neighborhood: string; description: string };
  transport?: TransportSegment;
  timeBlock?: 'morning' | 'afternoon' | 'evening';
}

interface DayCosts {
  food: number;
  activities: number;
  transport: number;
  total: number;
}

// Distance estimates between neighborhoods (in km, approximate)
const neighborhoodDistances: Record<string, Record<string, number>> = {
  'Ipanema': { 'Leblon': 1.5, 'Copacabana': 3, 'Jardim Botânico': 4, 'Urca': 6, 'Centro': 10, 'Santa Teresa': 8, 'Arpoador': 0.5, 'Lagoa': 2 },
  'Leblon': { 'Ipanema': 1.5, 'Jardim Botânico': 3, 'Lagoa': 2, 'Gávea': 2 },
  'Copacabana': { 'Ipanema': 3, 'Leme': 1, 'Urca': 3, 'Centro': 7 },
  'Santa Teresa': { 'Centro': 3, 'Lapa': 2, 'Floresta da Tijuca': 5 },
  'Centro': { 'Santa Teresa': 3, 'Lapa': 1, 'Ipanema': 10 },
  'Jardim Botânico': { 'Lagoa': 1.5, 'Leblon': 3, 'Gávea': 2, 'Floresta da Tijuca': 4 },
  'Urca': { 'Copacabana': 3, 'Centro': 5, 'Ipanema': 6 },
  'Arpoador': { 'Ipanema': 0.5, 'Copacabana': 2, 'Leblon': 2 },
  'Floresta da Tijuca': { 'Jardim Botânico': 4, 'Santa Teresa': 5 },
  'Lagoa': { 'Ipanema': 2, 'Leblon': 2, 'Jardim Botânico': 1.5 },
  'Lapa': { 'Centro': 1, 'Santa Teresa': 2 },
  'Gávea': { 'Jardim Botânico': 2, 'Leblon': 2, 'Lagoa': 2 },
};

const getDistance = (from: string, to: string): number => {
  if (from === to) return 0;
  return neighborhoodDistances[from]?.[to] || neighborhoodDistances[to]?.[from] || 5;
};

const getTransportMode = (distance: number): { mode: 'walking' | 'car' | 'uber'; duration: string } => {
  if (distance <= 1) return { mode: 'walking', duration: '10-15 min' };
  if (distance <= 2) return { mode: 'walking', duration: '20-30 min' };
  if (distance <= 5) return { mode: 'uber', duration: '10-15 min' };
  return { mode: 'uber', duration: '20-30 min' };
};

const AutomaticItinerary = () => {
  const navigate = useNavigate();
  const { draft, tripDays } = useTripDraft();
  const [selectedDays, setSelectedDays] = useState<DayOption>(tripDays >= 3 ? 3 : 2);
  const [isGenerated, setIsGenerated] = useState(false);
  const [itinerary, setItinerary] = useState<Record<number, ItinerarySlot[]>>({});
  const [dayCosts, setDayCosts] = useState<Record<number, DayCosts>>({});
  const [selectedHotel, setSelectedHotel] = useState<typeof guideHotels[0] | null>(null);

  if (!draft.destinationId) {
    navigate('/meu-roteiro', { replace: true });
    return null;
  }

  const tripStyles = draft.tripStyles || [];
  const isGastronomy = tripStyles.includes('gastronomia');
  const isFamily = tripStyles.includes('familia') || draft.children > 0;
  const isAdventure = tripStyles.includes('aventura');

  const generateItinerary = () => {
    const generated: Record<number, ItinerarySlot[]> = {};
    const costs: Record<number, DayCosts> = {};
    
    // Select accommodation based on style
    let hotels = [...guideHotels];
    if (isFamily) hotels = hotels.filter(h => h.kidFriendly !== false);
    if (isGastronomy) hotels = hotels.filter(h => h.priceLevel === '$$$' || h.priceLevel === '$$$$');
    const hotel = hotels[0] || guideHotels[0];
    setSelectedHotel(hotel);
    
    // Filter activities based on style
    let activities = [...guideActivities];
    if (isFamily) activities = activities.filter(a => a.kidFriendly !== false);
    if (isAdventure) activities = activities.filter(a => ['trilha', 'esporte', 'praia'].includes(a.category));
    
    // Prioritize iconic experiences
    const iconic = activities.filter(a => a.iconic);
    const regular = activities.filter(a => !a.iconic);
    
    // Filter restaurants
    let restaurants = [...guideRestaurants];
    if (isFamily) restaurants = restaurants.filter(r => r.kidFriendly !== false);
    if (isGastronomy) restaurants = restaurants.filter(r => r.priceLevel === '$$$' || r.priceLevel === '$$$$');

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

    for (let day = 1; day <= selectedDays; day++) {
      const daySlots: ItinerarySlot[] = [];
      let currentNeighborhood = hotel.neighborhood;
      let dayCost: DayCosts = { food: 0, activities: 0, transport: 0, total: 0 };

      // Departure from hotel
      daySlots.push({
        time: '08:30',
        type: 'departure',
        item: { id: hotel.id, name: hotel.name, neighborhood: hotel.neighborhood, description: 'Saída do hotel' },
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
        
        // Add transport to activity
        const distance = getDistance(currentNeighborhood, morningActivity.neighborhood);
        const transport = getTransportMode(distance);
        
        if (distance > 0) {
          daySlots.push({
            time: '08:45',
            type: 'transport',
            item: { id: 'transport', name: `${transport.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: { from: currentNeighborhood, to: morningActivity.neighborhood, mode: transport.mode, duration: transport.duration },
            timeBlock: 'morning'
          });
          if (transport.mode !== 'walking') dayCost.transport += 25;
        }
        
        currentNeighborhood = morningActivity.neighborhood;
        daySlots.push({
          time: '09:00',
          type: 'activity',
          item: morningActivity,
          timeBlock: 'morning'
        });
        dayCost.activities += 50; // Average activity cost
      }

      // Lunch - prefer nearby
      const nearby = proximityMap[currentNeighborhood] || [];
      const lunch = restaurants.find(r => 
        !usedRestaurants.has(r.id) && 
        r.mealType.includes('lunch') &&
        (r.neighborhood === currentNeighborhood || nearby.includes(r.neighborhood))
      ) || restaurants.find(r => !usedRestaurants.has(r.id) && r.mealType.includes('lunch'));
      
      if (lunch) {
        usedRestaurants.add(lunch.id);
        
        // Add transport to restaurant
        const distance = getDistance(currentNeighborhood, lunch.neighborhood);
        const transport = getTransportMode(distance);
        
        if (distance > 0) {
          daySlots.push({
            time: '12:15',
            type: 'transport',
            item: { id: 'transport', name: `${transport.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: { from: currentNeighborhood, to: lunch.neighborhood, mode: transport.mode, duration: transport.duration },
            timeBlock: 'afternoon'
          });
          if (transport.mode !== 'walking') dayCost.transport += 25;
        }
        
        currentNeighborhood = lunch.neighborhood;
        daySlots.push({
          time: '12:30',
          type: 'meal',
          item: lunch,
          timeBlock: 'afternoon'
        });
        dayCost.food += getPriceEstimate(lunch.priceLevel);
      }

      // Afternoon activity
      const afternoonActivity = regular.find(a => 
        !usedActivities.has(a.id) && 
        (a.bestTime === 'tarde' || a.bestTime === 'qualquer') &&
        (a.neighborhood === currentNeighborhood || nearby.includes(a.neighborhood))
      ) || regular.find(a => !usedActivities.has(a.id));
      
      if (afternoonActivity) {
        usedActivities.add(afternoonActivity.id);
        
        // Add transport
        const distance = getDistance(currentNeighborhood, afternoonActivity.neighborhood);
        const transport = getTransportMode(distance);
        
        if (distance > 0) {
          daySlots.push({
            time: '14:45',
            type: 'transport',
            item: { id: 'transport', name: `${transport.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: { from: currentNeighborhood, to: afternoonActivity.neighborhood, mode: transport.mode, duration: transport.duration },
            timeBlock: 'afternoon'
          });
          if (transport.mode !== 'walking') dayCost.transport += 25;
        }
        
        currentNeighborhood = afternoonActivity.neighborhood;
        daySlots.push({
          time: '15:00',
          type: 'activity',
          item: afternoonActivity,
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
        
        const distance = getDistance(currentNeighborhood, sunsetActivity.neighborhood);
        const transport = getTransportMode(distance);
        
        if (distance > 0) {
          daySlots.push({
            time: '17:00',
            type: 'transport',
            item: { id: 'transport', name: `${transport.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: { from: currentNeighborhood, to: sunsetActivity.neighborhood, mode: transport.mode, duration: transport.duration },
            timeBlock: 'evening'
          });
          if (transport.mode !== 'walking') dayCost.transport += 25;
        }
        
        currentNeighborhood = sunsetActivity.neighborhood;
        daySlots.push({
          time: '17:30',
          type: 'sunset',
          item: sunsetActivity,
          timeBlock: 'evening'
        });
      }

      // Dinner
      const dinner = restaurants.find(r => 
        !usedRestaurants.has(r.id) && r.mealType.includes('dinner')
      );
      if (dinner) {
        usedRestaurants.add(dinner.id);
        
        const distance = getDistance(currentNeighborhood, dinner.neighborhood);
        const transport = getTransportMode(distance);
        
        if (distance > 0) {
          daySlots.push({
            time: '19:30',
            type: 'transport',
            item: { id: 'transport', name: `${transport.mode === 'walking' ? 'A pé' : 'Uber'}`, neighborhood: '', description: '' },
            transport: { from: currentNeighborhood, to: dinner.neighborhood, mode: transport.mode, duration: transport.duration },
            timeBlock: 'evening'
          });
          if (transport.mode !== 'walking') dayCost.transport += 25;
        }
        
        currentNeighborhood = dinner.neighborhood;
        daySlots.push({
          time: '20:00',
          type: 'meal',
          item: dinner,
          timeBlock: 'evening'
        });
        dayCost.food += getPriceEstimate(dinner.priceLevel);
      }

      // Return to hotel
      const returnDistance = getDistance(currentNeighborhood, hotel.neighborhood);
      const returnTransport = getTransportMode(returnDistance);
      if (returnDistance > 0) {
        daySlots.push({
          time: '22:00',
          type: 'transport',
          item: { id: 'transport', name: `${returnTransport.mode === 'walking' ? 'A pé' : 'Uber'} — retorno ao hotel`, neighborhood: '', description: '' },
          transport: { from: currentNeighborhood, to: hotel.neighborhood, mode: returnTransport.mode, duration: returnTransport.duration },
          timeBlock: 'evening'
        });
        if (returnTransport.mode !== 'walking') dayCost.transport += 25;
      }

      dayCost.total = dayCost.food + dayCost.activities + dayCost.transport;
      costs[day] = dayCost;
      generated[day] = daySlots;
    }

    setDayCosts(costs);
    setItinerary(generated);
    setIsGenerated(true);
  };

  const handleConfirm = () => {
    localStorage.setItem('generatedItinerary', JSON.stringify({
      destination: draft.destinationId,
      days: selectedDays,
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

      <main className="px-4 py-6">
        {!isGenerated ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                Quantos dias?
              </h2>
              <p className="text-muted-foreground text-sm">
                Escolha a duração do seu roteiro curado.
              </p>
            </div>

            <div className="flex gap-3 justify-center mb-8">
              {([2, 3] as DayOption[]).map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedDays(days)}
                  className={cn(
                    "w-24 h-24 rounded-2xl flex flex-col items-center justify-center transition-all",
                    selectedDays === days
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : "bg-card border border-border"
                  )}
                >
                  <span className="text-3xl font-bold">{days}</span>
                  <span className="text-sm">dias</span>
                </button>
              ))}
            </div>

            <Button onClick={generateItinerary} className="w-full h-14 text-lg font-semibold rounded-2xl">
              Gerar meu roteiro
            </Button>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Seu roteiro de {selectedDays} dias
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
                              className={cn(
                                "flex gap-3 items-start py-2",
                                slot.type === 'transport' && "opacity-70"
                              )}
                            >
                              <div className="w-12 text-xs text-muted-foreground pt-1">{slot.time}</div>
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
                                    <p className="font-medium text-foreground text-sm truncate">{slot.item.name}</p>
                                    {slot.item.neighborhood && (
                                      <p className="text-xs text-muted-foreground">{slot.item.neighborhood}</p>
                                    )}
                                  </>
                                )}
                              </div>
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

      {isGenerated && (
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
          <Button onClick={handleConfirm} className="w-full h-14 text-lg font-semibold rounded-2xl">
            <Check className="w-5 h-5 mr-2" />
            Confirmar roteiro
          </Button>
        </div>
      )}
    </div>
  );
};

export default AutomaticItinerary;
