import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, MapPin, Utensils, Sun, Moon, Coffee, Bug, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTripDraft } from "@/hooks/use-trip-draft";
import {
  generateAutomaticItineraryAsync,
  persistItineraryToDb,
  tripStylesToPreferences,
  type GeneratorResult,
  type SlotItem,
  type SlotKind,
} from "@/lib/auto-roteiro-v2";
import { cn } from "@/lib/utils";

const slotConfig: Record<SlotKind, { label: string; icon: React.ElementType; color: string }> = {
  morning: { label: "Manhã", icon: Sun, color: "text-amber-500" },
  lunch: { label: "Almoço", icon: Utensils, color: "text-orange-500" },
  afternoon: { label: "Tarde", icon: Sun, color: "text-yellow-600" },
  evening: { label: "Noite", icon: Moon, color: "text-indigo-500" },
  extra: { label: "Extra", icon: Coffee, color: "text-emerald-500" },
};

const AutoRoteiroV2 = () => {
  const navigate = useNavigate();
  const { draft, tripDays } = useTripDraft();
  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDebugLog, setShowDebugLog] = useState(false);

  if (!draft.destinationId) {
    navigate("/meu-roteiro", { replace: true });
    return null;
  }

  const days = Math.max(1, tripDays);

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

      // Persist to DB
      const roteiroId = `${draft.destinationId}-auto-v2`;
      await persistItineraryToDb(roteiroId, gen);
    } catch (err) {
      console.error("Error generating itinerary:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSlot = (slot: SlotItem | null, kind: SlotKind) => {
    const config = slotConfig[kind];
    const Icon = config.icon;

    if (!slot) {
      return (
        <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-xl border border-dashed border-border">
          <Icon className={cn("w-4 h-4", config.color)} />
          <div>
            <p className="text-sm text-muted-foreground">{config.label}</p>
            <p className="text-xs text-muted-foreground/60 italic">Adicionar lugar →</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3 px-4 py-3 bg-card rounded-xl border border-border">
        <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.color)} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{slot.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{slot.neighborhood}</p>
          </div>
          <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">{slot.description}</p>
          {showDebugLog && (
            <p className="text-[10px] font-mono text-primary/60 mt-1">
              score:{slot.score} | {slot.scoreBreakdown}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {slot.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-28">
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
            <h1 className="text-lg font-semibold text-foreground">Roteiro Automático V2</h1>
          </div>
          {result && (
            <button
              onClick={() => setShowDebugLog(!showDebugLog)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showDebugLog ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bug className="w-4 h-4" />
            </button>
          )}
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
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">Preferências</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {draft.tripStyles.length > 0 ? (
                draft.tripStyles.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Nenhuma selecionada</span>
              )}
            </div>
          </div>
        </div>

        {/* Generate button */}
        {!result && (
          <div className="text-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="w-full max-w-sm h-14 text-lg font-semibold rounded-2xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar roteiro inteligente"
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{result.totalItemsPlaced}</span> itens
                em <span className="font-semibold">{days}</span> dias
              </p>
            </div>

            {/* Days */}
            {result.days.map((day) => (
              <motion.div
                key={day.dayIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: day.dayIndex * 0.1 }}
                className="space-y-2"
              >
                <h3 className="text-base font-semibold text-foreground">Dia {day.dayIndex}</h3>
                <div className="space-y-2">
                  {(["morning", "lunch", "afternoon", "evening", "extra"] as SlotKind[]).map((kind) =>
                    renderSlot(day.slots[kind], kind)
                  )}
                </div>
              </motion.div>
            ))}

            {/* Debug log */}
            {showDebugLog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-4 bg-muted rounded-xl"
              >
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Debug Log
                </h4>
                <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-auto">
                  {result.log.join("\n")}
                </pre>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleGenerate}
                className="flex-1 rounded-xl"
              >
                Regenerar
              </Button>
              <Button
                onClick={() => navigate("/meu-roteiro")}
                className="flex-1 rounded-xl"
              >
                Usar roteiro
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AutoRoteiroV2;
