import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SavedType = "hotel" | "restaurant" | "activity" | "lucky-list" | "nightlife" | "local-flavor";
type PlannedSlot = "morning" | "lunch" | "afternoon" | "sunset" | "dinner" | "night";

interface SavedCloudRow {
  id: string;
  place_id: string | null;
  name: string;
  neighborhood: string | null;
  address: string | null;
  city: string | null;
  ref_table: string | null;
  notes: string | null;
  created_at: string;
}

interface SavedCloudMeta {
  item_type?: SavedType;
  destination_id?: string;
  destination_name?: string;
}

interface SavedCloudItem {
  id: string;
  placeId: string;
  name: string;
  type: SavedType;
  neighborhood: string | null;
  address: string | null;
  city: string | null;
  refTable: string | null;
  createdAt: string;
}

type PageState = "loading" | "empty" | "auth" | "error";

const SLOT_SEQUENCE: PlannedSlot[] = ["morning", "lunch", "afternoon", "sunset", "dinner", "night"];

const slotToDb = (slot: PlannedSlot): { timeSlot: "morning" | "lunch" | "afternoon" | "evening" | "extra"; notePrefix: string } => {
  switch (slot) {
    case "morning":
      return { timeSlot: "morning", notePrefix: "Manhã" };
    case "lunch":
      return { timeSlot: "lunch", notePrefix: "Almoço" };
    case "afternoon":
      return { timeSlot: "afternoon", notePrefix: "Tarde" };
    case "sunset":
      return { timeSlot: "extra", notePrefix: "Pôr do sol" };
    case "dinner":
      return { timeSlot: "evening", notePrefix: "Jantar" };
    case "night":
      return { timeSlot: "extra", notePrefix: "Noite" };
  }
};

const normalize = (value: string | null | undefined): string =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const parseMeta = (raw: string | null): SavedCloudMeta => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
};

const inferType = (row: SavedCloudRow, meta: SavedCloudMeta): SavedType => {
  if (meta.item_type) return meta.item_type;
  const ref = normalize(row.ref_table);
  if (ref === "stay_hotels_full" || ref.includes("hotel")) return "hotel";
  if (ref === "restaurants" || ref === "restaurantes" || ref.includes("restaurant")) return "restaurant";
  if (ref === "lucky_list_rio") return "lucky-list";
  return "activity";
};

const isSunsetCandidate = (item: SavedCloudItem) => {
  const text = normalize(`${item.name} ${item.neighborhood || ""}`);
  return text.includes("por do sol") || text.includes("arpoador") || text.includes("mirante") || text.includes("praia") || text.includes("sunset");
};

const isNightCandidate = (item: SavedCloudItem) => {
  const text = normalize(item.name);
  return text.includes("bar") || text.includes("samba") || text.includes("festa") || text.includes("noite") || text.includes("lapa");
};

const buildPlan = (items: SavedCloudItem[]) => {
  const hotels = items.filter((i) => i.type === "hotel");
  const restaurants = items.filter((i) => i.type === "restaurant");
  const activities = items.filter((i) => i.type !== "hotel" && i.type !== "restaurant");

  const neighborhoods = new Map<string, number>();
  for (const item of items) {
    const bairro = normalize(item.neighborhood);
    if (!bairro) continue;
    neighborhoods.set(bairro, (neighborhoods.get(bairro) || 0) + 1);
  }

  const neighborhoodOrder = Array.from(neighborhoods.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([bairro]) => bairro);

  const totalDays = Math.max(1, Math.min(5, Math.ceil(items.length / 4)));
  const usedIds = new Set<string>();

  const pick = (
    pool: SavedCloudItem[],
    preferredNeighborhood: string | null,
    predicate?: (item: SavedCloudItem) => boolean
  ) => {
    const available = pool.filter((i) => !usedIds.has(i.id));
    const inNeighborhood = preferredNeighborhood
      ? available.filter((i) => normalize(i.neighborhood) === preferredNeighborhood)
      : [];

    const scoped = predicate ? inNeighborhood.filter(predicate) : inNeighborhood;
    if (scoped.length > 0) {
      usedIds.add(scoped[0].id);
      return scoped[0];
    }

    const globalScoped = predicate ? available.filter(predicate) : available;
    if (globalScoped.length > 0) {
      usedIds.add(globalScoped[0].id);
      return globalScoped[0];
    }

    return null;
  };

  const days: Array<{ day: number; neighborhood: string | null; slots: Array<{ slot: PlannedSlot; item: SavedCloudItem }> }> = [];

  for (let day = 1; day <= totalDays; day++) {
    const preferredNeighborhood = neighborhoodOrder.length > 0
      ? neighborhoodOrder[(day - 1) % neighborhoodOrder.length]
      : null;

    const slots: Array<{ slot: PlannedSlot; item: SavedCloudItem }> = [];

    const morning = pick(activities, preferredNeighborhood);
    if (morning) slots.push({ slot: "morning", item: morning });

    const lunch = pick(restaurants, preferredNeighborhood);
    if (lunch) slots.push({ slot: "lunch", item: lunch });

    const afternoon = pick(activities, preferredNeighborhood);
    if (afternoon) slots.push({ slot: "afternoon", item: afternoon });

    const sunset = pick(activities, preferredNeighborhood, isSunsetCandidate);
    if (sunset) slots.push({ slot: "sunset", item: sunset });

    const dinner = pick(restaurants, preferredNeighborhood);
    if (dinner) slots.push({ slot: "dinner", item: dinner });

    const night = pick(activities, preferredNeighborhood, isNightCandidate);
    if (night) slots.push({ slot: "night", item: night });

    if (slots.length === 0) {
      const fallback = pick(items, preferredNeighborhood);
      if (fallback) {
        slots.push({ slot: "afternoon", item: fallback });
      }
    }

    if (slots.length > 0) {
      const orderedSlots = SLOT_SEQUENCE
        .map((slotName) => slots.find((s) => s.slot === slotName))
        .filter((slot): slot is { slot: PlannedSlot; item: SavedCloudItem } => Boolean(slot));

      days.push({
        day,
        neighborhood: preferredNeighborhood,
        slots: orderedSlots,
      });
    }
  }

  const hotelBase = hotels[0] || null;
  return { days, hotelBase };
};

const IAFromSavedRoteiro = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState("Não foi possível gerar o roteiro agora.");

  useEffect(() => {
    const run = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setState("auth");
          return;
        }

        const savedRoteiroId = `saved-${user.id}`;
        const { data: rows, error } = await supabase
          .from("roteiro_itens")
          .select("id, place_id, name, neighborhood, address, city, ref_table, notes, created_at")
          .eq("roteiro_id", savedRoteiroId)
          .eq("source", "saved")
          .order("created_at", { ascending: true });

        if (error) throw error;

        const savedItems: SavedCloudItem[] = (rows || []).map((row: SavedCloudRow) => {
          const meta = parseMeta(row.notes);
          return {
            id: row.id,
            placeId: row.place_id || row.id,
            name: row.name,
            type: inferType(row, meta),
            neighborhood: row.neighborhood,
            address: row.address,
            city: row.city,
            refTable: row.ref_table,
            createdAt: row.created_at,
          };
        }).filter((item) => {
          const city = normalize(item.city);
          return !city || city.includes("rio");
        });

        if (savedItems.length === 0) {
          setState("empty");
          return;
        }

        const plan = buildPlan(savedItems);
        const itineraryRows = plan.days.flatMap((dayPlan) =>
          dayPlan.slots.map(({ slot, item }, index) => {
            const dbSlot = slotToDb(slot);
            return {
              day_index: dayPlan.day,
              order_in_day: index,
              source: "saved-ai",
              ref_table: item.refTable,
              place_id: item.placeId,
              name: item.name,
              neighborhood: item.neighborhood,
              address: item.address,
              city: item.city || "Rio de Janeiro",
              time_slot: dbSlot.timeSlot,
              notes: `${dbSlot.notePrefix}${dayPlan.neighborhood ? ` • ${dayPlan.neighborhood}` : ""}`,
            };
          })
        );

        if (itineraryRows.length === 0) {
          setState("empty");
          return;
        }

        const { data: itinerary, error: itineraryError } = await supabase
          .from("user_itineraries")
          .insert({
            user_id: user.id,
            destination_id: "rio-de-janeiro",
            destination_name: "Rio de Janeiro",
            status: "active",
            generated_at: new Date().toISOString(),
            travel_intentions: ["saved-items"],
            travel_company: null,
            travel_pace: null,
            budget_style: null,
            inspiration_tags: null,
          })
          .select("id")
          .single();

        if (itineraryError || !itinerary) throw itineraryError || new Error("Failed to create itinerary");

        const payload = itineraryRows.map((row) => ({
          ...row,
          roteiro_id: itinerary.id,
        }));

        const { error: itemsError } = await supabase.from("roteiro_itens").insert(payload);
        if (itemsError) throw itemsError;

        navigate(`/meu-roteiro/resultado?roteiro_id=${itinerary.id}`, { replace: true });
      } catch (error) {
        console.error("[IAFromSavedRoteiro] generation failed:", error);
        setErrorMessage("Não consegui montar o roteiro automático agora. Tente novamente.");
        setState("error");
      }
    };

    void run();
  }, [navigate]);

  const content = useMemo(() => {
    if (state === "loading") {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Montando seu roteiro com base nos itens salvos...</p>
        </div>
      );
    }

    if (state === "auth") {
      return (
        <div className="space-y-4 text-center py-20">
          <p className="text-sm text-muted-foreground">Faça login para gerar seu roteiro com IA a partir dos seus itens salvos.</p>
          <Button onClick={() => navigate("/auth")}>Entrar</Button>
        </div>
      );
    }

    if (state === "empty") {
      return (
        <div className="space-y-4 text-center py-20">
          <p className="text-sm text-muted-foreground">Nenhum item salvo em Rio de Janeiro foi encontrado.</p>
          <Button variant="outline" onClick={() => navigate("/minha-viagem")}>Voltar para Minha Viagem</Button>
        </div>
      );
    }

    return (
      <div className="space-y-4 text-center py-20">
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate("/minha-viagem")}>Voltar</Button>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }, [state, errorMessage, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/minha-viagem")}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Criar roteiro com IA
          </h1>
        </div>
      </header>

      <main className="px-4 py-6">{content}</main>
    </div>
  );
};

export default IAFromSavedRoteiro;
