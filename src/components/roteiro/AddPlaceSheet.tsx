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
import { GooglePlacesAutocomplete, PlaceData } from "./GooglePlacesAutocomplete";
import { toast } from "@/hooks/use-toast";

/**
 * ADD PLACE SHEET
 * 
 * FAB + Bottom sheet for manually adding places to the itinerary.
 * Uses Google Places Autocomplete to ensure valid place_id.
 * 
 * Rules:
 * - Only places with valid Google place_id can be added
 * - Free text is NOT allowed
 * - AI does NOT describe or recommend these places
 * - Used only for distance, time and consistency checks
 */

interface AddPlaceSheetProps {
  totalDays: number;
  onAddPlace: (day: number, place: PlaceData) => void;
}

type Step = 'search' | 'select-day';

export const AddPlaceSheet = ({ totalDays, onAddPlace }: AddPlaceSheetProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('search');
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);

  const handlePlaceSelect = (place: PlaceData) => {
    setSelectedPlace(place);
    setStep('select-day');
  };

  const handleDaySelect = (day: number) => {
    if (selectedPlace) {
      onAddPlace(day, selectedPlace);
      toast({
        title: "Local adicionado",
        description: `${selectedPlace.name} foi adicionado ao Dia ${day}.`,
      });
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
            className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="Adicionar local"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-2xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-serif">
              {step === 'search' ? 'Adicionar local manualmente' : 'Escolha o dia'}
            </SheetTitle>
          </SheetHeader>

          {step === 'search' && (
            <div className="pb-8">
              <p className="text-sm text-muted-foreground mb-4">
                Busque um local no Google para adicionar ao seu roteiro.
              </p>
              <GooglePlacesAutocomplete
                onPlaceSelect={handlePlaceSelect}
                placeholder="Buscar restaurante, hotel, atração..."
              />
              <p className="text-xs text-muted-foreground mt-3">
                Apenas locais com informações do Google podem ser adicionados.
              </p>
            </div>
          )}

          {step === 'select-day' && selectedPlace && (
            <div className="pb-8">
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <p className="font-medium text-foreground">{selectedPlace.name}</p>
                <p className="text-sm text-muted-foreground">{selectedPlace.address}</p>
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
                Buscar outro local
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AddPlaceSheet;
