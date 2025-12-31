import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, MapPin, Utensils, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { guideRestaurants, guideActivities, guideHotels, GuideRestaurant, GuideActivity, GuideHotel } from "@/data/rio-guide-data";
import { hasValidatedLocation } from "@/data/validated-locations";

/**
 * EDIT SLOT SHEET
 * Allows users to swap an itinerary item with another from the guide.
 * Reuses existing Guide content - no new data or screens.
 */

interface ItinerarySlot {
  time: string;
  type: 'activity' | 'meal' | 'sunset' | 'transport' | 'departure';
  item: { id: string; name: string; neighborhood: string; description: string; address?: string };
  timeBlock?: 'morning' | 'afternoon' | 'evening';
}

interface EditSlotSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: ItinerarySlot | null;
  onSelectAlternative: (newItem: GuideRestaurant | GuideActivity | GuideHotel) => void;
  usedIds: Set<string>; // IDs already used in the itinerary
}

export const EditSlotSheet = ({
  open,
  onOpenChange,
  slot,
  onSelectAlternative,
  usedIds,
}: EditSlotSheetProps) => {
  if (!slot) return null;

  // Categorized result with label
  type CategorizedItem = {
    item: GuideRestaurant | GuideActivity | GuideHotel;
    label: string;
  };

  const getCategorizedAlternatives = (): CategorizedItem[] => {
    // For activities (no priceLevel), categorize by type
    if (slot.type === 'activity' || slot.type === 'sunset') {
      const pool = guideActivities.filter(a => {
        if (!hasValidatedLocation(a.id)) return false;
        if (a.id === slot.item.id) return false;
        if (usedIds.has(a.id)) return false;
        if (slot.type === 'sunset') {
          return a.bestTime === 'pôr do sol' || a.bestTime === 'tarde' || a.bestTime === 'qualquer';
        }
        if (slot.timeBlock === 'morning') {
          return a.bestTime === 'manhã' || a.bestTime === 'qualquer';
        }
        if (slot.timeBlock === 'afternoon') {
          return a.bestTime === 'tarde' || a.bestTime === 'qualquer';
        }
        return true;
      });

      // Categorize by activity type
      const iconic = pool.filter(a => a.iconic === true);
      const cultural = pool.filter(a => a.category === 'cultura' || a.category === 'passeio');
      const nature = pool.filter(a => a.category === 'natureza' || a.category === 'praia' || a.category === 'mirante');

      const result: CategorizedItem[] = [];
      if (iconic.length > 0) {
        result.push({ item: iconic[Math.floor(Math.random() * iconic.length)], label: 'Clássico' });
      }
      if (cultural.length > 0) {
        const pick = cultural.find(c => !result.some(r => r.item.id === c.id));
        if (pick) result.push({ item: pick, label: 'Queridinho local' });
      }
      if (nature.length > 0) {
        const pick = nature.find(n => !result.some(r => r.item.id === n.id));
        if (pick) result.push({ item: pick, label: 'Experiência única' });
      }
      // Fill up to 3 if needed
      if (result.length < 3) {
        const remaining = pool.filter(p => !result.some(r => r.item.id === p.id));
        while (result.length < 3 && remaining.length > 0) {
          const pick = remaining.shift();
          if (pick) result.push({ item: pick, label: result.length === 0 ? 'Clássico' : result.length === 1 ? 'Queridinho local' : 'Experiência única' });
        }
      }
      return result.slice(0, 3);
    }

    // For hotels and restaurants (have priceLevel)
    let pool: (GuideRestaurant | GuideHotel)[] = [];
    
    if (slot.type === 'departure') {
      pool = guideHotels.filter(h => 
        hasValidatedLocation(h.id) && h.id !== slot.item.id
      );
    } else if (slot.type === 'meal') {
      const timeHour = parseInt(slot.time.split(':')[0]);
      const isLunch = timeHour >= 11 && timeHour < 16;
      const isDinner = timeHour >= 18;
      
      pool = guideRestaurants.filter(r => {
        if (!hasValidatedLocation(r.id)) return false;
        if (r.id === slot.item.id) return false;
        if (usedIds.has(r.id)) return false;
        if (isLunch) return r.mealType.includes('lunch');
        if (isDinner) return r.mealType.includes('dinner');
        return true;
      });
    }

    // Categorize by price level
    const classics = pool.filter(i => i.priceLevel === '$$$$');
    const locals = pool.filter(i => i.priceLevel === '$' || i.priceLevel === '$$');
    const sophisticated = pool.filter(i => i.priceLevel === '$$$');

    const result: CategorizedItem[] = [];

    if (classics.length > 0) {
      result.push({ item: classics[Math.floor(Math.random() * classics.length)], label: 'Clássico' });
    }
    if (locals.length > 0) {
      result.push({ item: locals[Math.floor(Math.random() * locals.length)], label: 'Queridinho local' });
    }
    if (sophisticated.length > 0) {
      result.push({ item: sophisticated[Math.floor(Math.random() * sophisticated.length)], label: 'Sofisticado' });
    }

    return result.slice(0, 3);
  };

  const alternatives = getCategorizedAlternatives();

  const getTypeLabel = () => {
    if (slot.type === 'departure') return 'Hotel';
    if (slot.type === 'meal') return 'Restaurante';
    if (slot.type === 'sunset') return 'Atividade (pôr do sol)';
    return 'Atividade';
  };

  const getIcon = (item: GuideRestaurant | GuideActivity | GuideHotel) => {
    if ('mealType' in item) return <Utensils className="w-4 h-4 text-orange-500" />;
    if ('category' in item && item.category === 'mirante') return <Sun className="w-4 h-4 text-amber-500" />;
    return <MapPin className="w-4 h-4 text-primary" />;
  };

  const handleSelect = (item: GuideRestaurant | GuideActivity | GuideHotel) => {
    onSelectAlternative(item);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[60vh] rounded-t-3xl">
        <SheetHeader className="text-left pb-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold">
            Trocar {getTypeLabel().toLowerCase()}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Atual: <span className="font-medium text-foreground">{slot.item.name}</span>
          </p>
        </SheetHeader>

        <div className="py-4">
          {alternatives.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Não há alternativas disponíveis para este horário.
            </p>
          ) : (
            <div className="space-y-3">
              {alternatives.map((alt) => (
                <button
                  key={alt.item.id}
                  onClick={() => handleSelect(alt.item)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border border-border",
                    "hover:border-primary/50 hover:bg-primary/5 transition-colors",
                    "flex items-start gap-3"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {getIcon(alt.item)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {alt.label}
                      </span>
                    </div>
                    <p className="font-medium text-foreground text-sm truncate">{alt.item.name}</p>
                    <p className="text-xs text-muted-foreground">{alt.item.neighborhood}</p>
                    {'priceLevel' in alt.item && (
                      <p className="text-xs text-muted-foreground mt-0.5">{alt.item.priceLevel}</p>
                    )}
                    {'duration' in alt.item && (
                      <p className="text-xs text-muted-foreground mt-0.5">{alt.item.duration}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditSlotSheet;
