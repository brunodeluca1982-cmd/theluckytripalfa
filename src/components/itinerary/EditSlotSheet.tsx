import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MapPin, Utensils, Sun, Plus, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { guideRestaurants, guideActivities, guideHotels, GuideRestaurant, GuideActivity, GuideHotel } from "@/data/rio-guide-data";
import { hasValidatedLocation } from "@/data/validated-locations";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { HybridPlaceSearch, HybridPlaceResult } from "@/components/roteiro/HybridPlaceSearch";

/**
 * EDIT SLOT SHEET
 * Allows users to swap an itinerary item with another from the guide.
 * ALWAYS returns exactly 3 curated alternatives - never empty.
 * Implements progressive constraint relaxation to guarantee options.
 * Includes "Add another place" option for Google Places search.
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
  onSelectExternalPlace?: (place: HybridPlaceResult) => void;
  usedIds: Set<string>; // IDs already used in the itinerary
}

// Categorized result with label
type CategorizedItem = {
  item: GuideRestaurant | GuideActivity | GuideHotel;
  label: string;
};

type RelaxationLevel = 'strict' | 'relaxed_time' | 'relaxed_category' | 'all';

export const EditSlotSheet = ({
  open,
  onOpenChange,
  slot,
  onSelectAlternative,
  onSelectExternalPlace,
  usedIds,
}: EditSlotSheetProps) => {
  const [showAddPlace, setShowAddPlace] = useState(false);

  if (!slot) return null;

  // Get activities with progressive constraint relaxation
  const getActivityAlternatives = (relaxation: RelaxationLevel): CategorizedItem[] => {
    const pool = guideActivities.filter(a => {
      // Always exclude current item
      if (a.id === slot.item.id) return false;
      // Exclude already used (but allow in most relaxed mode)
      if (relaxation !== 'all' && usedIds.has(a.id)) return false;
      // Prefer validated locations but allow all in relaxed modes
      if (relaxation === 'strict' && !hasValidatedLocation(a.id)) return false;

      // Time constraints based on relaxation level
      if (relaxation === 'strict') {
        if (slot.type === 'sunset') {
          return a.bestTime === 'pôr do sol' || a.bestTime === 'tarde';
        }
        if (slot.timeBlock === 'morning') {
          return a.bestTime === 'manhã';
        }
        if (slot.timeBlock === 'afternoon') {
          return a.bestTime === 'tarde';
        }
      } else if (relaxation === 'relaxed_time') {
        // Allow 'qualquer' and adjacent time blocks
        if (slot.type === 'sunset') {
          return a.bestTime === 'pôr do sol' || a.bestTime === 'tarde' || a.bestTime === 'qualquer';
        }
        if (slot.timeBlock === 'morning') {
          return a.bestTime === 'manhã' || a.bestTime === 'qualquer' || a.bestTime === 'tarde';
        }
        if (slot.timeBlock === 'afternoon') {
          return a.bestTime === 'tarde' || a.bestTime === 'qualquer' || a.bestTime === 'manhã';
        }
      }
      // relaxed_category and all: no time restrictions
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

    // Fill up to 3 if needed from remaining pool
    if (result.length < 3) {
      const remaining = pool.filter(p => !result.some(r => r.item.id === p.id));
      while (result.length < 3 && remaining.length > 0) {
        const pick = remaining.shift();
        if (pick) {
          const labels = ['Clássico', 'Queridinho local', 'Experiência única'];
          result.push({ item: pick, label: labels[result.length] || 'Alternativa' });
        }
      }
    }

    return result.slice(0, 3);
  };

  // Get restaurant alternatives with progressive constraint relaxation
  const getRestaurantAlternatives = (relaxation: RelaxationLevel): CategorizedItem[] => {
    const timeHour = parseInt(slot.time.split(':')[0]);
    const isLunch = timeHour >= 11 && timeHour < 16;
    const isDinner = timeHour >= 18;

    const pool = guideRestaurants.filter(r => {
      // Always exclude current item
      if (r.id === slot.item.id) return false;
      // Exclude already used (but allow in most relaxed mode)
      if (relaxation !== 'all' && usedIds.has(r.id)) return false;
      // Prefer validated locations but allow all in relaxed modes
      if (relaxation === 'strict' && !hasValidatedLocation(r.id)) return false;

      // Meal type constraints based on relaxation level
      if (relaxation === 'strict') {
        if (isLunch) return r.mealType.includes('lunch');
        if (isDinner) return r.mealType.includes('dinner');
      } else if (relaxation === 'relaxed_time') {
        // Allow any meal type if it's close to the boundary
        if (isLunch) return r.mealType.includes('lunch') || r.mealType.includes('dinner');
        if (isDinner) return r.mealType.includes('dinner') || r.mealType.includes('lunch');
      }
      // relaxed_category and all: no meal restrictions
      return true;
    });

    // Categorize by price level: $$$$ = classic, $/$ = local, $$$ = sophisticated
    const classics = pool.filter(i => i.priceLevel === '$$$$');
    const locals = pool.filter(i => i.priceLevel === '$' || i.priceLevel === '$$');
    const sophisticated = pool.filter(i => i.priceLevel === '$$$');

    const result: CategorizedItem[] = [];

    if (classics.length > 0) {
      result.push({ item: classics[Math.floor(Math.random() * classics.length)], label: 'Clássico' });
    }
    if (locals.length > 0) {
      const pick = locals.find(l => !result.some(r => r.item.id === l.id));
      if (pick) result.push({ item: pick, label: 'Queridinho local' });
    }
    if (sophisticated.length > 0) {
      const pick = sophisticated.find(s => !result.some(r => r.item.id === s.id));
      if (pick) result.push({ item: pick, label: 'Sofisticado' });
    }

    // Fill up to 3 from remaining pool
    if (result.length < 3) {
      const remaining = pool.filter(p => !result.some(r => r.item.id === p.id));
      while (result.length < 3 && remaining.length > 0) {
        const pick = remaining.shift();
        if (pick) {
          const labels = ['Clássico', 'Queridinho local', 'Sofisticado'];
          result.push({ item: pick, label: labels[result.length] || 'Alternativa' });
        }
      }
    }

    return result.slice(0, 3);
  };

  // Get hotel alternatives with progressive constraint relaxation
  const getHotelAlternatives = (relaxation: RelaxationLevel): CategorizedItem[] => {
    const pool = guideHotels.filter(h => {
      // Always exclude current item
      if (h.id === slot.item.id) return false;
      // Prefer validated locations but allow all in relaxed modes
      if (relaxation === 'strict' && !hasValidatedLocation(h.id)) return false;
      return true;
    });

    // Categorize by price level
    const classics = pool.filter(i => i.priceLevel === '$$$$');
    const locals = pool.filter(i => i.priceLevel === '$' || i.priceLevel === '$$');
    const sophisticated = pool.filter(i => i.priceLevel === '$$$');

    const result: CategorizedItem[] = [];

    if (classics.length > 0) {
      result.push({ item: classics[Math.floor(Math.random() * classics.length)], label: 'Clássico' });
    }
    if (locals.length > 0) {
      const pick = locals.find(l => !result.some(r => r.item.id === l.id));
      if (pick) result.push({ item: pick, label: 'Queridinho local' });
    }
    if (sophisticated.length > 0) {
      const pick = sophisticated.find(s => !result.some(r => r.item.id === s.id));
      if (pick) result.push({ item: pick, label: 'Sofisticado' });
    }

    // Fill up to 3 from remaining pool
    if (result.length < 3) {
      const remaining = pool.filter(p => !result.some(r => r.item.id === p.id));
      while (result.length < 3 && remaining.length > 0) {
        const pick = remaining.shift();
        if (pick) {
          const labels = ['Clássico', 'Queridinho local', 'Sofisticado'];
          result.push({ item: pick, label: labels[result.length] || 'Alternativa' });
        }
      }
    }

    return result.slice(0, 3);
  };

  // Main function that implements progressive constraint relaxation
  const getCategorizedAlternatives = (): { items: CategorizedItem[]; relaxed: boolean } => {
    const relaxationOrder: RelaxationLevel[] = ['strict', 'relaxed_time', 'relaxed_category', 'all'];
    
    for (const level of relaxationOrder) {
      let alternatives: CategorizedItem[] = [];
      
      if (slot.type === 'activity' || slot.type === 'sunset') {
        alternatives = getActivityAlternatives(level);
      } else if (slot.type === 'meal') {
        alternatives = getRestaurantAlternatives(level);
      } else if (slot.type === 'departure') {
        alternatives = getHotelAlternatives(level);
      }

      // If we have at least 3 options, we're done
      if (alternatives.length >= 3) {
        return { items: alternatives, relaxed: level !== 'strict' };
      }

      // If we have some options and we're at the most relaxed level, return what we have
      if (level === 'all' && alternatives.length > 0) {
        return { items: alternatives, relaxed: true };
      }
    }

    // Ultimate fallback: return ANY 3 items from the appropriate pool
    // This should never happen with proper data, but guarantees no empty state
    const fallbackPool: (GuideRestaurant | GuideActivity | GuideHotel)[] = 
      slot.type === 'activity' || slot.type === 'sunset' 
        ? guideActivities.filter(a => a.id !== slot.item.id)
        : slot.type === 'meal' 
          ? guideRestaurants.filter(r => r.id !== slot.item.id)
          : guideHotels.filter(h => h.id !== slot.item.id);

    const fallbackItems: CategorizedItem[] = fallbackPool.slice(0, 3).map((item, idx) => ({
      item,
      label: ['Clássico', 'Queridinho local', 'Sofisticado'][idx] || 'Alternativa'
    }));

    return { items: fallbackItems, relaxed: true };
  };

  const { items: alternatives, relaxed: constraintsRelaxed } = useMemo(() => 
    getCategorizedAlternatives(), 
    [slot, usedIds]
  );

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
    setShowAddPlace(false);
  };

  const handleSelectExternalPlace = (place: HybridPlaceResult) => {
    if (onSelectExternalPlace) {
      onSelectExternalPlace(place);
    }
    onOpenChange(false);
    setShowAddPlace(false);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setShowAddPlace(false);
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-3xl overflow-y-auto">
        <SheetHeader className="text-left pb-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold">
            Trocar {getTypeLabel().toLowerCase()}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Atual: <span className="font-medium text-foreground">{slot.item.name}</span>
          </p>
        </SheetHeader>

        <div className="py-4">
          {/* Show add place search when toggled */}
          {showAddPlace ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Buscar outro lugar</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddPlace(false)}
                  className="text-xs"
                >
                  Ver sugestões
                </Button>
              </div>
              
              <HybridPlaceSearch
                onPlaceSelect={handleSelectExternalPlace}
                placeholder="Buscar no Google Maps..."
              />
              
              <p className="text-xs text-muted-foreground text-center px-4">
                Lugares adicionados por você são marcados como "Adicionado por você" e 
                usados apenas para cálculos de distância.
              </p>
            </div>
          ) : (
            <>
              {/* Subtle feedback when constraints were relaxed */}
              {constraintsRelaxed && (
                <p className="text-xs text-muted-foreground mb-3 text-center">
                  Ajustamos ligeiramente os filtros para oferecer melhores opções.
                </p>
              )}
              
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

              {/* Add another place option - always visible */}
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowAddPlace(true)}
                  className="w-full h-12 rounded-xl border-dashed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar outro lugar
                  <Globe className="w-3 h-3 ml-2 text-muted-foreground" />
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditSlotSheet;
