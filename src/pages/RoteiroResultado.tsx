import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Utensils, Sun, Moon, Coffee, Car, Hotel, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
          </div>
        )}
      </main>
    </div>
  );
};

export default RoteiroResultado;
