import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Check, MapPin, Utensils, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { guideRestaurants, guideActivities, proximityMap } from "@/data/rio-guide-data";
import { cn } from "@/lib/utils";

/**
 * AUTOMATIC ITINERARY GENERATOR
 * Creates curated itinerary from The Lucky Trip guide data.
 */

type DayOption = 2 | 3;

interface ItinerarySlot {
  time: string;
  type: 'activity' | 'meal' | 'sunset';
  item: { id: string; name: string; neighborhood: string; description: string };
}

const AutomaticItinerary = () => {
  const navigate = useNavigate();
  const { draft, tripDays } = useTripDraft();
  const [selectedDays, setSelectedDays] = useState<DayOption>(tripDays >= 3 ? 3 : 2);
  const [isGenerated, setIsGenerated] = useState(false);
  const [itinerary, setItinerary] = useState<Record<number, ItinerarySlot[]>>({});

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

    for (let day = 1; day <= selectedDays; day++) {
      const daySlots: ItinerarySlot[] = [];
      let currentNeighborhood = '';

      // Morning activity (prefer iconic on day 1)
      const morningPool = day === 1 ? iconic : regular;
      const morningActivity = morningPool.find(a => 
        !usedActivities.has(a.id) && 
        (a.bestTime === 'manhã' || a.bestTime === 'qualquer')
      ) || regular.find(a => !usedActivities.has(a.id));
      
      if (morningActivity) {
        usedActivities.add(morningActivity.id);
        currentNeighborhood = morningActivity.neighborhood;
        daySlots.push({
          time: '09:00',
          type: 'activity',
          item: morningActivity
        });
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
        currentNeighborhood = lunch.neighborhood;
        daySlots.push({
          time: '12:30',
          type: 'meal',
          item: lunch
        });
      }

      // Afternoon activity
      const afternoonActivity = regular.find(a => 
        !usedActivities.has(a.id) && 
        (a.bestTime === 'tarde' || a.bestTime === 'qualquer') &&
        (a.neighborhood === currentNeighborhood || nearby.includes(a.neighborhood))
      ) || regular.find(a => !usedActivities.has(a.id));
      
      if (afternoonActivity) {
        usedActivities.add(afternoonActivity.id);
        currentNeighborhood = afternoonActivity.neighborhood;
        daySlots.push({
          time: '15:00',
          type: 'activity',
          item: afternoonActivity
        });
      }

      // Sunset (if available)
      const sunsetActivity = activities.find(a => 
        !usedActivities.has(a.id) && a.bestTime === 'pôr do sol'
      );
      if (sunsetActivity) {
        usedActivities.add(sunsetActivity.id);
        daySlots.push({
          time: '17:30',
          type: 'sunset',
          item: sunsetActivity
        });
      }

      // Dinner
      const dinner = restaurants.find(r => 
        !usedRestaurants.has(r.id) && r.mealType.includes('dinner')
      );
      if (dinner) {
        usedRestaurants.add(dinner.id);
        daySlots.push({
          time: '20:00',
          type: 'meal',
          item: dinner
        });
      }

      generated[day] = daySlots;
    }

    setItinerary(generated);
    setIsGenerated(true);
  };

  const handleConfirm = () => {
    localStorage.setItem('generatedItinerary', JSON.stringify({
      destination: draft.destinationId,
      days: selectedDays,
      itinerary,
      createdAt: new Date().toISOString()
    }));
    navigate(`/planejar/${draft.destinationSlug}`);
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
            </div>

            <div className="space-y-6">
              {Object.entries(itinerary).map(([day, slots]) => (
                <div key={day} className="bg-card rounded-2xl p-4">
                  <h3 className="font-semibold text-foreground mb-4">Dia {day}</h3>
                  <div className="space-y-3">
                    {slots.map((slot, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-3 items-start"
                      >
                        <div className="w-14 text-xs text-muted-foreground pt-1">{slot.time}</div>
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          slot.type === 'meal' ? "bg-orange-500/20" : 
                          slot.type === 'sunset' ? "bg-amber-500/20" : "bg-primary/20"
                        )}>
                          {slot.type === 'meal' ? <Utensils className="w-4 h-4 text-orange-500" /> :
                           slot.type === 'sunset' ? <Sun className="w-4 h-4 text-amber-500" /> :
                           <MapPin className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{slot.item.name}</p>
                          <p className="text-xs text-muted-foreground">{slot.item.neighborhood}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
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
