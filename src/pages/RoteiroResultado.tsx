import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Utensils, Sun, Moon, Coffee, Car, Hotel, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp-concierge";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RoteiroItem {
  id: string;
  name: string;
  neighborhood: string | null;
  address: string | null;
  day_index: number;
  order_in_day: number;
  time_slot: string | null;
  source: string;
  notes: string | null;
}

const slotIcons: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  morning: { icon: Sun, label: "Manhã", color: "text-amber-500" },
  lunch: { icon: Utensils, label: "Almoço", color: "text-orange-500" },
  afternoon: { icon: Sun, label: "Tarde", color: "text-yellow-600" },
  evening: { icon: Moon, label: "Noite", color: "text-indigo-500" },
  extra: { icon: Coffee, label: "Extra", color: "text-emerald-500" },
};

const RoteiroResultado = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roteiroId = searchParams.get("roteiro_id");
  const [items, setItems] = useState<RoteiroItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { draft } = useTripDraft();

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

  useEffect(() => {
    if (!roteiroId) {
      navigate("/meu-roteiro", { replace: true });
      return;
    }

    async function load() {
      const { data, error } = await supabase
        .from("roteiro_itens")
        .select("*")
        .eq("roteiro_id", roteiroId!)
        .order("day_index", { ascending: true })
        .order("order_in_day", { ascending: true });

      if (error) {
        console.error("Error loading roteiro:", error);
      } else {
        setItems(data || []);
      }
      setIsLoading(false);
    }

    load();
  }, [roteiroId, navigate]);

  // Group by day
  const days = items.reduce<Record<number, RoteiroItem[]>>((acc, item) => {
    if (!acc[item.day_index]) acc[item.day_index] = [];
    acc[item.day_index].push(item);
    return acc;
  }, {});

  const dayKeys = Object.keys(days).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/meu-roteiro")}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Seu roteiro</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-muted-foreground">Nenhum item encontrado neste roteiro.</p>
            <Button variant="outline" onClick={() => navigate("/meu-roteiro")}>
              Voltar
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">{items.length}</span> itens
                {" "}em <span className="font-semibold">{dayKeys.length}</span> dias
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
                <p className="text-xs text-muted-foreground">Eu ajusto seu roteiro em 5 minutos com você.</p>
              </div>
              <WhatsAppIcon />
            </a>

            {dayKeys.map((dayIndex) => (
              <motion.div
                key={dayIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.08 }}
                className="space-y-2"
              >
                <h3 className="text-base font-semibold text-foreground">Dia {dayIndex}</h3>
                <div className="space-y-1">
                  {days[dayIndex].map((item) => {
                    const slot = slotIcons[item.time_slot || "extra"] || slotIcons.extra;
                    const Icon = slot.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 px-4 py-3 bg-card rounded-xl border border-border"
                      >
                        <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", slot.color)} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          {item.neighborhood && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">{item.neighborhood}</p>
                            </div>
                          )}
                          {item.notes && (
                            <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">{item.notes}</p>
                          )}
                        </div>
                        {item.source === "google" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium flex-shrink-0">
                            Google
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-xl gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Voltar e regenerar
              </Button>
              <Button
                onClick={() => navigate("/")}
                className="flex-1 rounded-xl"
              >
                Explorar destino
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
              Falar com Concierge no WhatsApp
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoteiroResultado;
