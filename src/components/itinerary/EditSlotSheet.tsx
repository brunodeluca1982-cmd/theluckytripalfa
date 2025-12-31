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

  // Get alternatives based on slot type
  const getAlternatives = (): (GuideRestaurant | GuideActivity | GuideHotel)[] => {
    if (slot.type === 'departure') {
      // Hotels
      return guideHotels.filter(h => 
        hasValidatedLocation(h.id) && h.id !== slot.item.id
      );
    }
    
    if (slot.type === 'meal') {
      // Restaurants - filter by meal type based on time
      const timeHour = parseInt(slot.time.split(':')[0]);
      const isLunch = timeHour >= 11 && timeHour < 16;
      const isDinner = timeHour >= 18;
      
      return guideRestaurants.filter(r => {
        if (!hasValidatedLocation(r.id)) return false;
        if (r.id === slot.item.id) return false;
        if (usedIds.has(r.id)) return false;
        
        if (isLunch) return r.mealType.includes('lunch');
        if (isDinner) return r.mealType.includes('dinner');
        return true;
      });
    }
    
    if (slot.type === 'activity' || slot.type === 'sunset') {
      // Activities - filter by time of day
      return guideActivities.filter(a => {
        if (!hasValidatedLocation(a.id)) return false;
        if (a.id === slot.item.id) return false;
        if (usedIds.has(a.id)) return false;
        
        // For sunset, prefer sunset activities
        if (slot.type === 'sunset') {
          return a.bestTime === 'pôr do sol' || a.bestTime === 'tarde' || a.bestTime === 'qualquer';
        }
        
        // Match time block
        if (slot.timeBlock === 'morning') {
          return a.bestTime === 'manhã' || a.bestTime === 'qualquer';
        }
        if (slot.timeBlock === 'afternoon') {
          return a.bestTime === 'tarde' || a.bestTime === 'qualquer';
        }
        
        return true;
      });
    }
    
    return [];
  };

  const alternatives = getAlternatives();

  const getTypeLabel = () => {
    if (slot.type === 'departure') return 'Hotel';
    if (slot.type === 'meal') return 'Restaurante';
    if (slot.type === 'sunset') return 'Atividade (pôr do sol)';
    return 'Atividade';
  };

  const getIcon = (alt: GuideRestaurant | GuideActivity | GuideHotel) => {
    if ('mealType' in alt) return <Utensils className="w-4 h-4 text-orange-500" />;
    if ('category' in alt && alt.category === 'mirante') return <Sun className="w-4 h-4 text-amber-500" />;
    return <MapPin className="w-4 h-4 text-primary" />;
  };

  const handleSelect = (alt: GuideRestaurant | GuideActivity | GuideHotel) => {
    onSelectAlternative(alt);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader className="text-left pb-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold">
            Trocar {getTypeLabel().toLowerCase()}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Atual: <span className="font-medium text-foreground">{slot.item.name}</span>
          </p>
        </SheetHeader>

        <div className="py-4 overflow-y-auto h-[calc(100%-100px)]">
          {alternatives.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Não há alternativas disponíveis para este horário.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                {alternatives.length} {alternatives.length === 1 ? 'opção disponível' : 'opções disponíveis'}
              </p>
              
              {alternatives.map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => handleSelect(alt)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border border-border",
                    "hover:border-primary/50 hover:bg-primary/5 transition-colors",
                    "flex items-start gap-3"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {getIcon(alt)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{alt.name}</p>
                    <p className="text-xs text-muted-foreground">{alt.neighborhood}</p>
                    {'priceLevel' in alt && (
                      <p className="text-xs text-muted-foreground mt-0.5">{alt.priceLevel}</p>
                    )}
                    {'duration' in alt && (
                      <p className="text-xs text-muted-foreground mt-0.5">{alt.duration}</p>
                    )}
                  </div>
                  <Check className="w-4 h-4 text-transparent group-hover:text-primary" />
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
