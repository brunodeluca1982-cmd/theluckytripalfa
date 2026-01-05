import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Clock, MapPin, Lightbulb, Star, Users, X, Pencil, RefreshCw, Globe } from "lucide-react";
import { ItineraryItem } from "./ItineraryCard";
import { Button } from "@/components/ui/button";
import { TimeEditSheet } from "./TimeEditSheet";
import { Badge } from "@/components/ui/badge";

/**
 * ACTIVITY DETAIL SHEET
 * 
 * Opens when tapping an activity in the timeline.
 * Shows expanded information with:
 * - Image
 * - Name & category
 * - Description
 * - Tips
 * - Duration
 * - Why it matters
 * - Edit time button
 * - Replace item button
 */

interface ActivityDetailSheetProps {
  item: ItineraryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove?: () => void;
  onEditTime?: (startTime: string, endTime: string) => void;
  onReplace?: () => void;
}

const categoryLabels: Record<string, string> = {
  attraction: 'Atração',
  food: 'Gastronomia',
  hotel: 'Hospedagem',
  experience: 'Experiência',
  custom: 'Local Adicionado',
};

export const ActivityDetailSheet = ({
  item,
  open,
  onOpenChange,
  onRemove,
  onEditTime,
  onReplace,
}: ActivityDetailSheetProps) => {
  const [showTimeEdit, setShowTimeEdit] = useState(false);

  if (!item) return null;

  const handleSaveTime = (startTime: string, endTime: string) => {
    if (onEditTime) {
      onEditTime(startTime, endTime);
    }
    setShowTimeEdit(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-start justify-between">
              <SheetTitle className="text-left pr-8">{item.name || item.title}</SheetTitle>
            </div>
          </SheetHeader>

          {/* Hero Image */}
          {item.imageUrl && (
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {categoryLabels[item.category]}
            </span>
            
            {/* Time display with edit option */}
            {(item.startTime || item.endTime || item.duration || item.time) && (
              <button
                onClick={() => onEditTime && setShowTimeEdit(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium hover:bg-accent transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                {item.startTime && item.endTime 
                  ? `${item.startTime} - ${item.endTime}`
                  : item.duration || item.time}
                {onEditTime && <Pencil className="w-3 h-3 ml-1" />}
              </button>
            )}

            {item.curatorName && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                <Users className="w-3.5 h-3.5" />
                By {item.curatorName}
              </span>
            )}

            {/* External place indicator */}
            {item.isExternal && (
              <Badge variant="outline" className="text-xs px-2 py-1 text-muted-foreground">
                <Globe className="w-3 h-3 mr-1" />
                Adicionado por você
              </Badge>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Sobre</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Neighborhood */}
          {(item.neighborhood || item.location) && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">Localização</h4>
              <p className="text-sm text-muted-foreground">
                {item.neighborhood || item.location}
              </p>
            </div>
          )}

          {/* Tips Section (only for curated items) */}
          {!item.isExternal && (
            <div className="mb-4 p-4 rounded-xl bg-accent/50 border border-accent">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Dica</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.category === 'attraction' 
                  ? 'Chegue cedo para evitar filas e aproveitar melhor a experiência.'
                  : item.category === 'food'
                  ? 'Faça reserva com antecedência, especialmente nos finais de semana.'
                  : item.category === 'hotel'
                  ? 'Confira as políticas de cancelamento antes de reservar.'
                  : 'Aproveite ao máximo e tire fotos para guardar as memórias!'}
              </p>
            </div>
          )}

          {/* Why it matters (only for curated items) */}
          {!item.isExternal && (
            <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">Por que visitar</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.category === 'attraction'
                  ? 'Um dos pontos mais icônicos do destino, imperdível para qualquer viajante.'
                  : item.category === 'food'
                  ? 'Gastronomia local autêntica que representa a cultura do destino.'
                  : item.category === 'hotel'
                  ? 'Localização privilegiada e experiência única de hospedagem.'
                  : 'Uma experiência autêntica que enriquece sua viagem.'}
              </p>
            </div>
          )}

          {/* Edit Actions */}
          <div className="flex gap-2 mb-4">
            {onEditTime && (
              <Button
                variant="outline"
                onClick={() => setShowTimeEdit(true)}
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
                  onOpenChange(false);
                }}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Trocar
              </Button>
            )}
          </div>

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

      {/* Time Edit Sheet */}
      <TimeEditSheet
        open={showTimeEdit}
        onOpenChange={setShowTimeEdit}
        itemName={item.name || item.title || ''}
        startTime={item.startTime || '09:00'}
        endTime={item.endTime || '10:00'}
        onSave={handleSaveTime}
      />
    </>
  );
};

export default ActivityDetailSheet;
