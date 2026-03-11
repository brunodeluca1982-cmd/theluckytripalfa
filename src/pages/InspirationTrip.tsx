import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Loader2, MapPin, Utensils, Sun, Sunset, Moon, 
  Hotel, Sparkles, ExternalLink, Instagram, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { InspirationAnchor } from "@/lib/inspiration-to-trip";
import { getInspirationTheme } from "@/lib/inspiration-to-trip";
import FlowHeroBackground from "@/components/roteiro/FlowHeroBackground";

// ─── Slot config matching Day format ─────────────────────────────

type SlotKind = "morning" | "lunch" | "afternoon" | "sunset" | "dinner";

const slotConfig: Record<SlotKind, { label: string; icon: React.ElementType }> = {
  morning: { label: "Manhã", icon: Sun },
  lunch: { label: "Almoço", icon: Utensils },
  afternoon: { label: "Tarde", icon: Sun },
  sunset: { label: "Pôr do sol", icon: Sunset },
  dinner: { label: "Jantar", icon: Moon },
};

const slotOrder: SlotKind[] = ["morning", "lunch", "afternoon", "sunset", "dinner"];

interface TripSlot {
  id: string;
  name: string;
  neighborhood: string;
  type: "experience" | "restaurant" | "hotel";
  note?: string;
}

interface TripDay {
  dayIndex: number;
  zone: string;
  slots: Record<SlotKind, TripSlot | null>;
}

interface TripResult {
  hotel: { id: string; name: string; neighborhood: string; reason?: string };
  days: TripDay[];
  tripSummary: string;
  itineraryId?: string;
  anchor: InspirationAnchor;
}

const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-inspiration-trip`;

const InspirationTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const anchor = location.state?.anchor as InspirationAnchor | undefined;

  const [trip, setTrip] = useState<TripResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!anchor) return;
    setIsGenerating(true);
    setError(null);

    try {
      const resp = await fetch(GENERATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ anchor, days: 3 }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro ao gerar" }));
        throw new Error(err.error || "Erro ao gerar roteiro");
      }

      const data = await resp.json();
      setTrip(data);
    } catch (e) {
      console.error("Trip generation failed:", e);
      setError(e instanceof Error ? e.message : "Não foi possível gerar o roteiro.");
    } finally {
      setIsGenerating(false);
    }
  }, [anchor]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleSave = () => {
    if (!trip || !anchor) return;

    const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");

    // Save anchor as idea
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

    // Save all trip items
    for (const day of trip.days) {
      for (const kind of slotOrder) {
        const slot = day.slots[kind];
        if (slot && !draft.some((d: any) => d.id === slot.id)) {
          const typeMap: Record<string, string> = { experience: "activity", restaurant: "restaurant", hotel: "hotel" };
          draft.push({
            id: slot.id,
            type: typeMap[slot.type] || "activity",
            title: slot.name,
            savedAt: new Date().toISOString(),
            isPremium: false,
            destinationId: "rio-de-janeiro",
            destinationName: "Rio de Janeiro",
            neighborhood: slot.neighborhood,
            source: anchor.source,
            sourceUrl: anchor.sourceUrl,
          });
        }
      }
    }

    localStorage.setItem("draft-roteiro", JSON.stringify(draft));
    window.dispatchEvent(new CustomEvent("roteiro-updated"));
    toast.success("Roteiro salvo na sua viagem!");
    navigate("/minha-viagem");
  };

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
    <FlowHeroBackground>
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1" />
        {sourceIcon && (
          <a
            href={anchor.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs"
          >
            {sourceIcon}
            <span>Ver post</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="px-5 pb-32">
        {/* Title section */}
        <div className="pt-2 pb-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/80 text-xs mb-3">
            <Sparkles className="w-3 h-3" />
            Inspirado por {theme}
          </div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-serif)]">
            Seu roteiro inspirado
          </h1>
          <p className="text-white/60 text-sm mt-1">
            3 dias no Rio de Janeiro
          </p>
        </div>

        {/* Interpretation card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-white/70 mt-0.5 shrink-0" />
            <p className="text-sm text-white/90">{anchor.interpretation}</p>
          </div>
        </div>

        {/* Loading */}
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-5"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <p className="text-white font-medium">Lucky está montando seu roteiro...</p>
              <p className="text-white/50 text-xs mt-2">
                Hotel, restaurantes e experiências baseados na sua inspiração
              </p>
              <div className="flex gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-white/60"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && !isGenerating && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-white/70 text-sm mb-4">{error}</p>
              <Button variant="outline" onClick={generate} className="rounded-xl">
                Tentar novamente
              </Button>
            </motion.div>
          )}

          {/* Trip result */}
          {trip && !isGenerating && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Trip summary */}
              {trip.tripSummary && (
                <p className="text-white/60 text-sm text-center italic">
                  {trip.tripSummary}
                </p>
              )}

              {/* Hotel */}
              {trip.hotel && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
                    <Hotel className="w-4 h-4 text-white/50" />
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Hospedagem
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-white">{trip.hotel.name}</h3>
                    <p className="text-xs text-white/50 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {trip.hotel.neighborhood}
                    </p>
                    {trip.hotel.reason && (
                      <p className="text-xs text-white/40 mt-2 italic">{trip.hotel.reason}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Day plans */}
              {trip.days.map((day) => (
                <div key={day.dayIndex}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{day.dayIndex}</span>
                    </div>
                    <h2 className="text-base font-semibold text-white">Dia {day.dayIndex}</h2>
                    {day.zone && (
                      <span className="ml-auto text-[10px] text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                        {day.zone}
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
                          className="flex gap-3 p-3 bg-white/8 backdrop-blur-sm rounded-xl border border-white/10"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-white/60" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                                {config.label}
                              </span>
                            </div>
                            <h3 className="text-sm font-medium text-white truncate">
                              {slot.name}
                            </h3>
                            <p className="text-xs text-white/40 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              {slot.neighborhood}
                            </p>
                            {slot.note && (
                              <p className="text-[11px] text-white/30 mt-1 italic line-clamp-1">
                                {slot.note}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="pt-4 pb-6 space-y-3">
                <button
                  onClick={handleSave}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold bg-white text-foreground hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar roteiro na minha viagem
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3 rounded-xl text-sm font-medium text-white/60 border border-white/20 hover:bg-white/10 transition-all"
                >
                  Voltar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FlowHeroBackground>
  );
};

export default InspirationTrip;
