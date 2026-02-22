import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Search, X, Trash2, MapPin, Clock, ChevronRight, PartyPopper, Music2, BedDouble, Utensils, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useSavedItems, type SavedItemRecord } from "@/hooks/use-saved-items";
import { toast } from "@/hooks/use-toast";
import { resolveHotelRoute } from "@/lib/hotel-slug";

const typeIcons: Record<string, React.ReactNode> = {
  block: <PartyPopper className="w-4 h-4" />,
  festa: <Music2 className="w-4 h-4" />,
  activity: <Camera className="w-4 h-4" />,
  hotel: <BedDouble className="w-4 h-4" />,
  restaurant: <Utensils className="w-4 h-4" />,
  attraction: <MapPin className="w-4 h-4" />,
};

const typeLabels: Record<string, string> = {
  activity: "Atividade",
  hotel: "Hotel",
  restaurant: "Restaurante",
  attraction: "Atração",
  block: "Evento",
  festa: "Evento",
};

type FilterType = "all" | "activity" | "hotel" | "restaurant";

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "activity", label: "Atividades" },
  { value: "hotel", label: "Hotéis" },
  { value: "restaurant", label: "Restaurantes" },
];

function getDetailRoute(item: SavedItemRecord): string | null {
  switch (item.type) {
    case "hotel": return resolveHotelRoute(item.id, "rio-de-janeiro");
    case "restaurant": return `/restaurante/${item.id}`;
    case "activity": return `/atividade/${item.id}`;
    default: return null;
  }
}

const Favoritos = () => {
  const navigate = useNavigate();
  const { items, remove } = useSavedItems();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");

  const filtered = useMemo(() => {
    let list = items;
    if (typeFilter !== "all") list = list.filter((i) => i.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q) || i.neighborhood_full?.toLowerCase().includes(q));
    }
    return list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  }, [items, typeFilter, search]);

  const handleRemove = (item: SavedItemRecord) => {
    remove(item.id, item.type);
    toast({ title: "Removido", description: `${item.title} foi removido dos favoritos.` });
  };

  const handleItemClick = (item: SavedItemRecord) => {
    const route = getDetailRoute(item);
    if (route) navigate(route);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Favoritos</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar nos favoritos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-8 h-11 bg-muted/50 border-0 rounded-xl"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                typeFilter === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Items */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">
              {items.length === 0 ? "Nenhum item salvo" : "Nenhum resultado"}
            </p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {items.length === 0
                ? "Salve eventos ou construa seu roteiro para vê-los aqui."
                : "Tente buscar com outros termos ou ajuste os filtros."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{filtered.length} {filtered.length === 1 ? "item" : "itens"}</p>
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                >
                  <button onClick={() => handleItemClick(item)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                      {typeIcons[item.type] || <MapPin className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{typeLabels[item.type] || item.type}</span>
                        {item.neighborhood_short && (
                          <span className="text-xs text-muted-foreground">· 📍 {item.neighborhood_short}</span>
                        )}
                        {item.date_iso && (
                          <span className="text-xs text-muted-foreground">· {item.date_iso.slice(5)}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="p-2 -m-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    aria-label="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favoritos;
