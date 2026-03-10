import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft, Loader2, MapPin, Utensils, Sun, Moon, Coffee,
  Hotel, Sparkles, ExternalLink, Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateAutomaticItineraryAsync,
  type GeneratorResult,
  type SlotItem,
  type SlotKind,
} from "@/lib/auto-roteiro-v2";
import {
  inspirationToGeneratorInput,
  getInspirationTheme,
  type InspirationAnchor,
} from "@/lib/inspiration-to-trip";
import { SlotItemPhoto } from "@/components/roteiro/SlotItemPhoto";

const slotConfig: Record<SlotKind, { label: string; icon: React.ElementType; color: string }> = {
  morning: { label: "Manhã", icon: Sun, color: "text-amber-500" },
  lunch: { label: "Almoço", icon: Utensils, color: "text-orange-500" },
  afternoon: { label: "Tarde", icon: Sun, color: "text-yellow-600" },
  evening: { label: "Noite", icon: Moon, color: "text-indigo-500" },
  extra: { label: "Extra", icon: Coffee, color: "text-emerald-500" },
};

const slotOrder: SlotKind[] = ["morning", "lunch", "afternoon", "evening", "extra"];

const InspirationTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const anchor = location.state?.anchor as InspirationAnchor | undefined;

  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!anchor) return;

    const generate = async () => {
      setIsGenerating(true);
      setError(null);
      try {
        const input = inspirationToGeneratorInput(anchor, 3);
        const generated = await generateAutomaticItineraryAsync(input);
        setResult(generated);
      } catch (e) {
        console.error("Trip generation failed:", e);
        setError("Não foi possível gerar o roteiro. Tente novamente.");
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [anchor]);

  if (!anchor) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground mb-4">Nenhuma inspiração encontrada.</p>
        <Button variant="outline" onClick={() => navigate("/minha-viagem")}>
          Voltar para Minha Viagem
        </Button>
      </div>
    );
  }

  const theme = getInspirationTheme(anchor);
  const sourceIcon = anchor.source === "instagram" ? (
    <Instagram className="w-3.5 h-3.5" />
  ) : anchor.source === "tiktok" ? (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
    </svg>
  ) : null;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Inspiration context */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
            {sourceIcon}
            <span className="text-xs font-medium text-muted-foreground capitalize">{anchor.source}</span>
            <a
              href={anchor.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Ver post
            </a>
          </div>
          <div className="p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">{anchor.interpretation}</p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-serif font-medium text-foreground mb-1">
          Seu roteiro inspirado
        </h1>
        <p className="text-sm text-muted-foreground">
          3 dias no Rio · Inspirado por {theme}
        </p>
      </header>

      {/* Loading state */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-sm font-medium text-foreground">Lucky está montando seu roteiro...</p>
          <p className="text-xs text-muted-foreground mt-1">
            Hotel, restaurantes e experiências baseados na sua inspiração
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      )}

      {/* Result */}
      {result && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 space-y-6"
        >
          {/* Hotel recommendation */}
          {result.recommendedHotel && (
            <section className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                <Hotel className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Hospedagem recomendada
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {result.recommendedHotel.name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {result.recommendedHotel.neighborhood} · {result.recommendedHotel.priceLevel}
                </p>
                {result.recommendedHotel.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {result.recommendedHotel.description}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Day plans */}
          {result.days.map((day) => (
            <section key={day.dayIndex}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{day.dayIndex}</span>
                </div>
                <h2 className="text-base font-semibold text-foreground">Dia {day.dayIndex}</h2>
                {day.totalTravelMinutes > 0 && (
                  <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    ~{day.totalTravelMinutes} min deslocamento
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {slotOrder.map((kind) => {
                  const slot = day.slots[kind];
                  if (!slot) return null;
                  const config = slotConfig[kind];
                  const Icon = config.icon;

                  return (
                    <div
                      key={`${day.dayIndex}-${kind}`}
                      className="flex gap-3 p-3 bg-card rounded-xl border border-border"
                    >
                      {/* Photo */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <SlotItemPhoto
                          itemId={slot.id}
                          itemName={slot.name}
                          neighborhood={slot.neighborhood}
                          source={slot.source}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className={`w-3 h-3 ${config.color}`} />
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            {config.label}
                          </span>
                          {slot.travelFromPrevText && (
                            <span className="text-[10px] text-muted-foreground/60 ml-auto">
                              🚗 {slot.travelFromPrevText}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {slot.name}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          {slot.neighborhood}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Footer actions */}
          <div className="pt-4 pb-6 space-y-3">
            <Button
              onClick={() => {
                // Save to localStorage and navigate to Minha Viagem
                const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");

                // Save anchor interpretation as idea
                draft.push({
                  id: `inspiration-${Date.now()}`,
                  type: "activity",
                  title: anchor.interpretation,
                  savedAt: new Date().toISOString(),
                  isPremium: false,
                  destinationId: "rio-de-janeiro",
                  destinationName: "Rio de Janeiro",
                  source: anchor.source,
                  sourceLabel: anchor.source === "instagram" ? "Instagram" : anchor.source === "tiktok" ? "TikTok" : "Link",
                  sourceUrl: anchor.sourceUrl,
                });

                // Save suggested places
                for (const s of anchor.suggestions) {
                  const typeMap: Record<string, string> = { experience: "activity", restaurant: "restaurant", hotel: "hotel" };
                  if (!draft.some((d: any) => d.id === s.id)) {
                    draft.push({
                      id: s.id,
                      type: typeMap[s.type] || "activity",
                      title: s.nome,
                      savedAt: new Date().toISOString(),
                      isPremium: false,
                      destinationId: "rio-de-janeiro",
                      destinationName: "Rio de Janeiro",
                      source: anchor.source,
                      sourceLabel: anchor.source === "instagram" ? "Instagram" : "TikTok",
                      sourceUrl: anchor.sourceUrl,
                      neighborhood: s.bairro,
                    });
                  }
                }

                localStorage.setItem("draft-roteiro", JSON.stringify(draft));
                window.dispatchEvent(new CustomEvent("roteiro-updated"));
                navigate("/minha-viagem");
              }}
              className="w-full h-12 rounded-xl"
              size="lg"
            >
              Salvar roteiro na minha viagem
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full h-10 rounded-xl"
            >
              Voltar
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InspirationTrip;
