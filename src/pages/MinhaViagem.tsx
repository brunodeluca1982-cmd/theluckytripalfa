import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, MapPin, Sparkles, Compass, Users, Instagram, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddIdeaSection from "@/components/minha-viagem/AddIdeaSection";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import type { SavedItem } from "@/hooks/use-item-save";

const STORAGE_KEY = "draft-roteiro";

const typeLabels: Record<string, string> = {
  activity: "Experiência",
  restaurant: "Restaurante",
  hotel: "Hotel",
  "lucky-list": "Lucky List",
  nightlife: "Noite",
  "local-flavor": "Sabor Local",
};

function readDraft(): SavedItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

const MinhaViagem = () => {
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

  const handleRemove = useCallback((id: string, type: string) => {
    const updated = readDraft().filter(
      (i) => !(i.id === id && i.type === type)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("roteiro-updated"));
    setItems(updated);
    toast({ title: "Removido da viagem" });
  }, []);

  const getDetailPath = (item: SavedItem): string => {
    switch (item.type) {
      case "activity": return `/atividade/${item.id}`;
      case "hotel": return `/hotel/${item.id}`;
      case "restaurant": return `/restaurante/${item.id}`;
      case "lucky-list": return `/lucky-list/${item.id}`;
      default: return `/atividade/${item.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">Minha Viagem</h1>
            <p className="text-[11px] text-muted-foreground">Suas ideias salvas para a próxima viagem</p>
          </div>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Add Idea section — always visible */}
        <AddIdeaSection />
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <Compass className="w-10 h-10 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">Minha Viagem</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-[260px]">
              Salve lugares ou crie um roteiro para começar sua viagem.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button asChild variant="default" size="lg" className="w-full">
                <Link to="/o-que-fazer" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Explorar O Que Fazer
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/lucky-list" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lucky List
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
              >
                <Link to={getDetailPath(item)} className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.destinationName}</p>
                  <Badge variant="secondary" className="mt-1 text-[10px]">
                    {typeLabels[item.type] || item.type}
                  </Badge>
                </Link>
                <button
                  onClick={() => handleRemove(item.id, item.type)}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {items.length > 0 && (
          <div className="flex flex-col gap-3 pt-4">
            <Button asChild variant="default" size="lg" className="w-full">
              <Link to="/criar-roteiro" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Criar Roteiro com IA
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link to="/roteiro-planner" className="flex items-center gap-2">
                Montar Roteiro Manual
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MinhaViagem;
