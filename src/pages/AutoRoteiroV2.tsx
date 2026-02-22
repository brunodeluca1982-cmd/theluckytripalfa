import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, MapPin, Utensils, Sun, Moon, Coffee, ChevronRight, Check, RefreshCw, Plus, Car, Footprints, Clock, Hotel, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { buildWhatsAppUrl } from "@/lib/whatsapp-concierge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  generateAutomaticItineraryAsync,
  persistItineraryToDb,
  tripStylesToPreferences,
  type GeneratorResult,
  type SlotItem,
  type SlotKind,
  type HotelRecommendation,
} from "@/lib/auto-roteiro-v2";
import { cn } from "@/lib/utils";
import { GooglePlaceSearchSection } from "@/components/GooglePlaceSearchSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SlotItemPhoto } from "@/components/roteiro/SlotItemPhoto";
import type { PlaceResult } from "@/lib/search-places";

const slotConfig: Record<SlotKind, { label: string; icon: React.ElementType; color: string; suggestedTime: string }> = {
  morning: { label: "Manhã", icon: Sun, color: "text-amber-500", suggestedTime: "09:00" },
  lunch: { label: "Almoço", icon: Utensils, color: "text-orange-500", suggestedTime: "12:30" },
  afternoon: { label: "Tarde", icon: Sun, color: "text-yellow-600", suggestedTime: "15:00" },
  evening: { label: "Noite", icon: Moon, color: "text-indigo-500", suggestedTime: "19:30" },
  extra: { label: "Extra", icon: Coffee, color: "text-emerald-500", suggestedTime: "22:00" },
};

function getItemDetailRoute(slot: SlotItem): string | null {
  if (slot.source === "google") return null;
  const id = slot.id;
  const cat = slot.category?.toLowerCase() || "";
  if (
    cat.includes("restaurante") || cat.includes("bar") || cat.includes("boteco") ||
    cat.includes("alta gastronomia") || cat.includes("café") || cat.includes("padaria") ||
    cat.includes("bistrô") || cat.includes("pizzaria") || cat.includes("japonês") ||
    cat.includes("italiano") || cat.includes("peixes") || cat.includes("contemporâne") ||
    slot.slotKind === "lunch" || (slot.slotKind === "evening" && !slot.tags.includes("festa"))
  ) return `/restaurante/${id}`;
  if (cat.includes("samba") || cat.includes("show") || cat.includes("balada") || cat.includes("festa") || slot.tags.includes("festa")) return `/atividade/${id}`;
  if (cat.includes("hotel") || cat.includes("pousada") || cat.includes("hostel")) return `/hotel/${id}`;
  return `/atividade/${id}`;
}

const AutoRoteiroV2 = () => {
  const navigate = useNavigate();
  const { draft, tripDays } = useTripDraft();
  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);

  const days = Math.max(1, tripDays);

  const waUrl = buildWhatsAppUrl({
    destino: draft.destinationName || undefined,
    datas: draft.arrivalAt && draft.departureAt
      ? `${format(draft.arrivalAt, "dd/MM", { locale: ptBR })} a ${format(draft.departureAt, "dd/MM", { locale: ptBR })}`
      : undefined,
  });

  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const preferences = tripStylesToPreferences(draft.tripStyles);
      const style = draft.priceStyle === "$$$"
        ? "luxo" as const
        : draft.priceStyle === "$"
        ? "economico" as const
        : null;

      const gen = await generateAutomaticItineraryAsync({
        city: "Rio de Janeiro",
        days,
        preferences,
        style,
      });

      setResult(gen);
      const roteiroId = `${draft.destinationId}-auto`;
      await persistItineraryToDb(roteiroId, gen);
    } catch (err) {
      console.error("Error generating itinerary:", err);
      toast({ title: "Erro ao gerar", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!draft.destinationId) {
      navigate("/meu-roteiro", { replace: true });
      return;
    }
    if (!result && !isGenerating) {
      handleGenerate();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!draft.destinationId) return null;

  const handleAddToRoteiro = async (place: PlaceResult) => {
    const { error } = await supabase.from("roteiro_itens").insert({
      roteiro_id: `${draft.destinationId}-auto`,
      source: "google",
      ref_table: "places_cache",
      place_id: place.placeId,
      name: place.name,
      address: place.address,
      city: "Rio de Janeiro",
      lat: place.lat,
      lng: place.lng,
      day_index: 1,
      order_in_day: 99,
    });
    if (error) {
      toast({ title: "Erro ao adicionar", description: "Tente novamente.", variant: "destructive" });
    } else {
      toast({ title: "Adicionado ao roteiro!", description: place.name });
    }
  };

  const handleSlotClick = (slot: SlotItem | null) => {
    if (!slot) return;
    const route = getItemDetailRoute(slot);
    if (route) {
      navigate(route);
    } else if (slot.source === "google") {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(slot.name + " " + slot.neighborhood)}`;
      window.open(mapsUrl, "_blank");
    }
  };

  const renderTravelIndicator = (slot: SlotItem) => {
    if (!slot.travelFromPrevMinutes || slot.travelFromPrevMinutes <= 0) return null;

    const meters = slot.travelFromPrevMeters || 0;
    const isWalkable = meters > 0 && meters <= 1500;
    const isLong = slot.travelFromPrevMinutes > 45;
    const distanceText = meters > 0
      ? meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1)} km`
      : "";

    return (
      <div className="flex items-center gap-2 py-1.5 ml-[52px]">
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border",
          isLong
            ? "bg-destructive/10 text-destructive border-destructive/20"
            : isWalkable
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : "bg-muted/60 text-muted-foreground border-border/50"
        )}>
          {isWalkable ? (
            <Footprints className="w-3 h-3" />
          ) : (
            <Car className="w-3 h-3" />
          )}
          <span>{isWalkable ? "A pé" : "Carro"}</span>
          <span className="opacity-50">·</span>
          <span>{slot.travelFromPrevText}</span>
          {distanceText && (
            <>
              <span className="opacity-50">·</span>
              <span>{distanceText}</span>
            </>
          )}
          {isLong && <AlertTriangle className="w-3 h-3 ml-0.5" />}
        </div>
        <div className="flex-1 border-t border-dashed border-border/40" />
      </div>
    );
  };

  const renderSlot = (slot: SlotItem | null, kind: SlotKind) => {
    const config = slotConfig[kind];
    const Icon = config.icon;

    if (!slot) {
      return (
        <div className="flex items-center gap-3">
          {/* Time */}
          <div className="w-10 text-right flex-shrink-0">
            <p className="text-[11px] font-medium text-muted-foreground/40">{config.suggestedTime}</p>
          </div>
          {/* Timeline dot */}
          <div className="relative flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
          {/* Content */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-muted/20 rounded-xl border border-dashed border-border/50">
            <Icon className={cn("w-4 h-4", config.color, "opacity-40")} />
            <p className="text-xs text-muted-foreground/50 italic">{config.label} — sem sugestão</p>
          </div>
        </div>
      );
    }

    const isClickable = slot.source === "curated" || slot.source === "google";

    return (
      <div className="flex items-start gap-3">
        {/* Time */}
        <div className="w-10 text-right flex-shrink-0 pt-2">
          <p className="text-[11px] font-semibold text-foreground/70">{config.suggestedTime}</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">{config.label}</p>
        </div>
        {/* Timeline dot */}
        <div className="relative flex-shrink-0 pt-3">
          <div className={cn("w-2.5 h-2.5 rounded-full", config.color.replace("text-", "bg-"))} />
        </div>
        {/* Card */}
        <div
          onClick={() => handleSlotClick(slot)}
          className={cn(
            "flex-1 flex gap-3 p-3 bg-card rounded-xl border border-border transition-all",
            isClickable && "cursor-pointer hover:bg-accent active:scale-[0.99]"
          )}
        >
          {/* Photo */}
          <SlotItemPhoto
            itemId={slot.id}
            itemName={slot.name}
            neighborhood={slot.neighborhood}
            slotKind={kind}
            className="w-14 h-14"
          />
          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">{slot.name}</p>
              {slot.source === "google" && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium flex-shrink-0">
                  Google
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{slot.neighborhood}</p>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">{slot.description}</p>
          </div>
          {isClickable && (
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/meu-roteiro/decisao")}
              className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Roteiro automático</h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Summary */}
        <div className="mb-6 p-3 bg-muted/50 rounded-xl space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground">Destino</p>
              <p className="font-semibold text-foreground">{draft.destinationName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Dias</p>
              <p className="font-semibold text-primary">{days}</p>
            </div>
          </div>
          {draft.tripStyles.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex flex-wrap gap-1">
                {draft.tripStyles.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">Montando roteiro inteligente...</p>
              <p className="text-xs text-muted-foreground/60">Analisando distâncias com trânsito</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !isGenerating && (
          <div className="space-y-6">
            {/* Hotel Recommendation */}
            {result.recommendedHotel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Hotel recomendado</h3>
                </div>
                <div
                  className="flex items-start gap-3 cursor-pointer hover:bg-primary/5 rounded-lg p-2 -m-1 transition-colors"
                  onClick={() => navigate(`/hotel/${result.recommendedHotel!.id}`)}
                >
                  <SlotItemPhoto
                    itemId={result.recommendedHotel.id}
                    itemName={result.recommendedHotel.name}
                    neighborhood={result.recommendedHotel.neighborhood}
                    slotKind="hotel"
                    className="w-16 h-16"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{result.recommendedHotel.name}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        {result.recommendedHotel.priceLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{result.recommendedHotel.neighborhood}</p>
                    </div>
                    <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">{result.recommendedHotel.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                </div>
              </motion.div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{result.totalItemsPlaced}</span> itens
                {" "}em <span className="font-semibold">{days}</span> dias
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Roteiro otimizado por proximidade geográfica
              </p>
            </div>

            {/* WhatsApp CTA — top */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-card rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Refinar no WhatsApp</p>
                <p className="text-xs text-muted-foreground">Falo com o Concierge The Lucky Trip e ajusto seu roteiro com você.</p>
              </div>
              <WhatsAppIcon />
            </a>

            {/* Days */}
            {result.days.map((day) => {
              const zoneLabels: Record<string, string> = {
                zonaSul: "Zona Sul",
                zonaSulAlta: "Zona Sul Alta",
                centro: "Centro & Santa Teresa",
                barra: "Barra & Recreio",
                especial: "Especial",
              };
              const zoneLabel = zoneLabels[day.zone] || day.zone;

              return (
                <motion.div
                  key={day.dayIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: day.dayIndex * 0.08 }}
                  className="space-y-1"
                >
                  {/* Day header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-foreground">Dia {day.dayIndex}</h3>
                    <div className="flex items-center gap-2">
                      {day.totalTravelMinutes > 0 && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          <Car className="w-3 h-3" />
                          {day.totalTravelMinutes < 60
                            ? `${day.totalTravelMinutes} min`
                            : `${Math.floor(day.totalTravelMinutes / 60)}h${day.totalTravelMinutes % 60 > 0 ? `${day.totalTravelMinutes % 60}` : ""}`}
                          {" total"}
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        📍 {zoneLabel}
                      </span>
                    </div>
                  </div>

                  {/* Timeline with vertical line */}
                  <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[52px] top-4 bottom-4 w-px bg-border/60" />

                    <div className="space-y-1">
                      {(["morning", "lunch", "afternoon", "evening", "extra"] as SlotKind[]).map((kind) => {
                        const slot = day.slots[kind];
                        return (
                          <div key={kind}>
                            {/* Travel indicator between slots */}
                            {slot && renderTravelIndicator(slot)}
                            {renderSlot(slot, kind)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Add place from Google */}
            <div className="pt-2">
              <button
                onClick={() => setShowAddPlace(!showAddPlace)}
                className="flex items-center gap-2 text-sm text-primary font-medium"
              >
                <Plus className="w-4 h-4" />
                {showAddPlace ? "Fechar busca" : "Adicionar lugar (Google)"}
              </button>
              {showAddPlace && (
                <div className="mt-3">
                  <GooglePlaceSearchSection
                    city="Rio de Janeiro"
                    title="Buscar no Google"
                    placeholder="Buscar restaurantes, atrações..."
                    onAddToRoteiro={handleAddToRoteiro}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 rounded-xl gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerar
              </Button>
              <Button
                onClick={() => {
                  const roteiroId = `${draft.destinationId}-auto`;
                  toast({ title: "Roteiro salvo!", description: `${result.totalItemsPlaced} itens confirmados.` });
                  navigate(`/meu-roteiro/resultado?roteiro_id=${encodeURIComponent(roteiroId)}`);
                }}
                className="flex-1 rounded-xl gap-2"
              >
                <Check className="w-4 h-4" />
                Usar roteiro
              </Button>
            </div>

            {/* WhatsApp CTA — bottom */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-sm font-medium text-foreground"
            >
              <WhatsAppIcon />
              Falar com o Concierge The Lucky Trip no WhatsApp
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default AutoRoteiroV2;
