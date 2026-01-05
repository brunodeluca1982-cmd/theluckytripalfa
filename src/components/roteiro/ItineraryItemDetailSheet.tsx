import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Clock, MapPin, Lightbulb, Star, Globe, RefreshCw, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { guideHotels, guideRestaurants, guideActivities, GuideHotel, GuideRestaurant, GuideActivity } from "@/data/rio-guide-data";

/**
 * ITINERARY ITEM DETAIL SHEET
 * 
 * Opens when tapping an item in the generated itinerary.
 * Shows curated details for Lucky Trip items, or basic info for external places.
 * Never shows "not found" - always displays available information.
 */

interface ItinerarySlotItem {
  id: string;
  name: string;
  neighborhood: string;
  description: string;
  address?: string;
}

interface ItineraryItemDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItinerarySlotItem | null;
  itemType: 'activity' | 'meal' | 'sunset' | 'departure' | 'transport';
  currentTime?: string;
  onSaveTime?: (time: string, duration: number) => void;
  onReplace?: () => void;
  onRemove?: () => void;
}

// Duration options in minutes
const DURATION_OPTIONS = [
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2h', value: 120 },
];

// Generate time options in 15-minute intervals
const generateTimeOptions = (): string[] => {
  const options: string[] = [];
  for (let h = 6; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

// Try to find curated data for an item by ID
const findCuratedItem = (id: string, type: string): GuideHotel | GuideRestaurant | GuideActivity | null => {
  if (type === 'departure') {
    return guideHotels.find(h => h.id === id) || null;
  }
  if (type === 'meal') {
    return guideRestaurants.find(r => r.id === id) || null;
  }
  if (type === 'activity' || type === 'sunset') {
    return guideActivities.find(a => a.id === id) || null;
  }
  return null;
};

// Check if item is external (not from curated database)
const isExternalItem = (id: string): boolean => {
  return id.startsWith('external-') || id.startsWith('google-');
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'departure': return 'Hotel';
    case 'meal': return 'Restaurante';
    case 'sunset': return 'Atividade';
    case 'activity': return 'Atividade';
    default: return 'Local';
  }
};

export const ItineraryItemDetailSheet = ({
  open,
  onOpenChange,
  item,
  itemType,
  currentTime,
  onSaveTime,
  onReplace,
  onRemove,
}: ItineraryItemDetailSheetProps) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState(currentTime || '09:00');
  const [selectedDuration, setSelectedDuration] = useState(60);

  // Reset state when opening
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setIsEditingTime(false);
    } else if (currentTime) {
      setSelectedTime(currentTime);
    }
    onOpenChange(isOpen);
  };

  const handleSaveTime = () => {
    if (onSaveTime) {
      onSaveTime(selectedTime, selectedDuration);
    }
    setIsEditingTime(false);
  };

  // Early return after all hooks
  if (!item) return null;

  const isExternal = isExternalItem(item.id);
  const curatedData = !isExternal ? findCuratedItem(item.id, itemType) : null;

  // Get additional details from curated data if available
  const displayName = curatedData?.name || item.name;
  const displayDescription = curatedData?.description || item.description;
  const displayNeighborhood = curatedData?.neighborhood || item.neighborhood;
  const displayPriceLevel = curatedData && 'priceLevel' in curatedData ? curatedData.priceLevel : null;
  const displayInstagram = curatedData && 'instagram' in curatedData ? curatedData.instagram : null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between">
            <SheetTitle className="text-left pr-8">{displayName}</SheetTitle>
          </div>
          {currentTime && !isEditingTime && (
            <p className="text-sm text-muted-foreground text-left">
              Horário: <span className="font-medium text-foreground">{currentTime}</span>
            </p>
          )}
        </SheetHeader>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {getTypeLabel(itemType)}
          </Badge>
          
          {displayNeighborhood && (
            <Badge variant="outline" className="text-xs">
              {displayNeighborhood}
            </Badge>
          )}

          {displayPriceLevel && (
            <Badge variant="outline" className="text-xs">
              {displayPriceLevel}
            </Badge>
          )}

          {/* External place indicator */}
          {isExternal && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              <Globe className="w-3 h-3 mr-1" />
              Adicionado por você
            </Badge>
          )}
          
          {/* Curated badge */}
          {!isExternal && curatedData && (
            <Badge className="text-xs bg-primary/10 text-primary border-0">
              <Star className="w-3 h-3 mr-1" />
              Dica The Lucky Trip
            </Badge>
          )}
        </div>

        {/* Description */}
        {displayDescription && displayDescription !== 'Adicionado por você' && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Sobre</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayDescription}
            </p>
          </div>
        )}

        {/* Address / Location */}
        {item.address && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Localização</h4>
            <a 
              href={item.address.startsWith('http') ? item.address : `https://maps.google.com/?q=${encodeURIComponent(item.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Ver no Google Maps
            </a>
          </div>
        )}

        {/* Instagram */}
        {displayInstagram && (
          <div className="mb-4">
            <a 
              href={`https://instagram.com/${displayInstagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {displayInstagram}
            </a>
          </div>
        )}

        {/* Tips Section (only for curated items) */}
        {!isExternal && curatedData && (
          <div className="mb-4 p-4 rounded-xl bg-accent/50 border border-accent">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Dica</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {itemType === 'activity' || itemType === 'sunset'
                ? 'Chegue cedo para aproveitar melhor a experiência e evitar filas.'
                : itemType === 'meal'
                ? 'Faça reserva com antecedência, especialmente nos finais de semana.'
                : itemType === 'departure'
                ? 'Confira as políticas de cancelamento antes de reservar.'
                : 'Aproveite ao máximo!'}
            </p>
          </div>
        )}

        {/* External place notice */}
        {isExternal && (
          <div className="mb-4 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              Este local foi adicionado por você e não faz parte da curadoria The Lucky Trip. 
              É utilizado para cálculo de distâncias e organização do roteiro.
            </p>
          </div>
        )}

        {/* Fallback notice if no curated data found and not external */}
        {!isExternal && !curatedData && (
          <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-muted-foreground">
              Conteúdo indisponível no momento. Você pode editar ou remover este item.
            </p>
          </div>
        )}

        {/* Time Edit Section - inline */}
        {isEditingTime ? (
          <div className="mb-4 p-4 rounded-xl bg-muted/50 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Editar horário
              </h4>
            </div>
            
            {/* Time selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Início</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Duration quick choices */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Duração</label>
              <div className="flex gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedDuration(opt.value)}
                    className={cn(
                      "flex-1 py-2 px-3 text-sm rounded-lg border transition-colors",
                      selectedDuration === opt.value
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Save/Cancel */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingTime(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSaveTime}
                className="flex-1"
              >
                Salvar
              </Button>
            </div>
          </div>
        ) : (
          /* Edit Actions */
          <div className="flex gap-2 mb-4">
            {onSaveTime && (
              <Button
                variant="outline"
                onClick={() => setIsEditingTime(true)}
                className="flex-1"
              >
                <Clock className="w-4 h-4 mr-2" />
                Editar horário
              </Button>
            )}
            {onReplace && (
              <Button
                variant="outline"
                onClick={() => {
                  onReplace();
                  handleOpenChange(false);
                }}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Trocar
              </Button>
            )}
          </div>
        )}

        {/* Main Actions */}
        <div className="flex gap-2 pb-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          {onRemove && (
            <Button
              variant="destructive"
              onClick={() => {
                onRemove();
                onOpenChange(false);
              }}
            >
              <X className="w-4 h-4 mr-1" />
              Remover
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ItineraryItemDetailSheet;
