import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Sunset, Moon, Coffee, Sparkles, Plus, Save, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SavedItem } from "@/hooks/use-item-save";

const STORAGE_KEY = "draft-roteiro";

function readDraft(): SavedItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

interface PeriodSlot {
  label: string;
  icon: React.ReactNode;
  items: SavedItem[];
}

const periodConfig = [
  { key: "morning", label: "Manhã", icon: <Coffee className="w-4 h-4" />, types: ["activity"] },
  { key: "afternoon", label: "Tarde", icon: <Sun className="w-4 h-4" />, types: ["activity", "lucky-list"] },
  { key: "sunset", label: "Pôr do sol", icon: <Sunset className="w-4 h-4" />, types: ["activity"] },
  { key: "night", label: "Noite", icon: <Moon className="w-4 h-4" />, types: ["restaurant", "nightlife"] },
];

function distributeItemsIntoDays(items: SavedItem[], totalDays: number = 3) {
  const days: Array<{ dayNumber: number; periods: PeriodSlot[] }> = [];
  const itemsCopy = [...items];

  for (let d = 1; d <= totalDays; d++) {
    const periods: PeriodSlot[] = periodConfig.map((p) => ({
      label: p.label,
      icon: p.icon,
      items: [],
    }));

    // Distribute items round-robin across periods
    for (let pi = 0; pi < periods.length && itemsCopy.length > 0; pi++) {
      const item = itemsCopy.shift();
      if (item) periods[pi].items.push(item);
    }

    days.push({ dayNumber: d, periods });
  }

  // Distribute remaining items
  let idx = 0;
  while (itemsCopy.length > 0) {
    const item = itemsCopy.shift()!;
    const dayIdx = idx % days.length;
    const periodIdx = Math.floor(idx / days.length) % periodConfig.length;
    days[dayIdx].periods[periodIdx].items.push(item);
    idx++;
  }

  return days;
}

interface TripItineraryPreviewProps {
  onAdjust?: () => void;
  onAddExperiences?: () => void;
}

export default function TripItineraryPreview({ onAdjust, onAddExperiences }: TripItineraryPreviewProps) {
  const navigate = useNavigate();
  const [items, setItems] = useState<SavedItem[]>(readDraft);

  useEffect(() => {
    const sync = () => setItems(readDraft());
    window.addEventListener("storage", sync);
    window.addEventListener("roteiro-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("roteiro-updated", sync);
    };
  }, []);

  if (items.length === 0) return null;

  const days = distributeItemsIntoDays(items);

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        <h2 className="text-base font-serif font-semibold text-foreground">Sua viagem</h2>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-auto">
          {items.length} {items.length === 1 ? "lugar" : "lugares"}
        </Badge>
      </div>

      {/* Day blocks */}
      {days.map((day) => (
        <div key={day.dayNumber} className="space-y-1">
          <p className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
            Dia {day.dayNumber}
          </p>
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border/50">
            {day.periods.map((period, pi) => (
              <div key={pi} className="flex items-start gap-3 px-3 py-2.5">
                <span className="text-muted-foreground mt-0.5 shrink-0">{period.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    {period.label}
                  </p>
                  {period.items.length > 0 ? (
                    period.items.map((item) => (
                      <p key={`${item.id}-${item.type}`} className="text-sm text-foreground truncate mt-0.5">
                        {item.title}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground/50 italic mt-0.5">—</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <Button
          variant="outline"
          onClick={onAdjust}
          className="w-full h-10 text-sm rounded-xl gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Ajustar roteiro
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onAddExperiences}
            className="flex-1 h-10 text-sm rounded-xl gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar experiências
          </Button>
          <Button
            onClick={() => navigate("/roteiro/rio-3-dias-final")}
            className="flex-1 h-10 text-sm rounded-xl gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar alterações
          </Button>
        </div>
      </div>
    </div>
  );
}
