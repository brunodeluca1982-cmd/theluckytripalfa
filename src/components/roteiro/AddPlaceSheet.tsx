import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HybridPlaceSearch, HybridPlaceResult } from "./HybridPlaceSearch";
import { toast } from "@/hooks/use-toast";

/**
 * ADD PLACE SHEET (PT-BR)
 * 
 * FAB + Bottom sheet for manually adding places to the itinerary.
 * Uses 2-source search:
 * 1. Lucky Trip curated database first
 * 2. Google Places fallback only if not found
 * 
 * Rules:
 * - Curated places are marked as curated=true
 * - Google places require valid place_id and are marked curated=false
 * - AI does NOT describe or recommend non-curated places
 * - Non-curated used only for distance, time and consistency checks
 */

interface AddPlaceSheetProps {
  totalDays: number;
  onAddPlace: (day: number, place: HybridPlaceResult) => void;
  destinationId?: string;
}

type Step = 'search' | 'select-day';

export const AddPlaceSheet = ({ 
  totalDays, 
  onAddPlace,
  destinationId = "rio-de-janeiro" 
}: AddPlaceSheetProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('search');
  const [selectedPlace, setSelectedPlace] = useState<HybridPlaceResult | null>(null);

  const handlePlaceSelect = (place: HybridPlaceResult) => {
    setSelectedPlace(place);
    setStep('select-day');
  };

  const handleDaySelect = (day: number) => {
    if (selectedPlace) {
      onAddPlace(day, selectedPlace);
      
      // Different toast message based on source (PT-BR)
      if (selectedPlace.curated) {
        toast({
          title: "Local adicionado",
          description: `${selectedPlace.name} foi adicionado ao Dia ${day}.`,
        });
      } else {
        // Non-curated disclosure as per requirements
        toast({
          title: "Local adicionado",
          description: `Adicionado como 'Fora da curadoria' (Google Maps).`,
        });
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStep('search');
    setSelectedPlace(null);
  };

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <>
      {/* FAB */}
      <Sheet open={open} onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
        else setOpen(true);
      }}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-safe-nav right-4 z-40 w-14 h-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Adicionar lugar"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-2xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-serif">
              {step === 'search' ? 'Adicionar lugar' : 'Escolha o dia'}
            </SheetTitle>
          </SheetHeader>

          {step === 'search' && (
            <div className="pb-8">
              <p className="text-sm text-muted-foreground mb-4">
                Busque primeiro na nossa curadoria. Se não encontrar, pesquise no Google.
              </p>
              <HybridPlaceSearch
                onPlaceSelect={handlePlaceSelect}
                placeholder="Buscar lugar…"
                destinationId={destinationId}
              />
              <p className="text-xs text-muted-foreground mt-3">
                Locais fora da curadoria são usados apenas para cálculo de distâncias.
              </p>
            </div>
          )}

          {step === 'select-day' && selectedPlace && (
            <div className="pb-8">
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-foreground">{selectedPlace.name}</p>
                  {selectedPlace.curated ? (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      Dica The Lucky Trip
                    </span>
                  ) : (
                    <span className="text-xs px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                      Fora da curadoria
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedPlace.neighborhood || selectedPlace.address}
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Em qual dia você quer adicionar este local?
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant="outline"
                    className="h-14 text-base font-medium"
                    onClick={() => handleDaySelect(day)}
                  >
                    Dia {day}
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => {
                  setStep('search');
                  setSelectedPlace(null);
                }}
              >
                Buscar outro lugar
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AddPlaceSheet;
