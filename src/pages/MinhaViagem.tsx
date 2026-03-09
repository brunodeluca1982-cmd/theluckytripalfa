import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, MapPin, Sparkles, Compass, Users, Instagram, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddIdeaSection from "@/components/minha-viagem/AddIdeaSection";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useExternalExperiencias, normalizeNeighborhood } from "@/hooks/use-external-experiencias";
import { getAttractionImage } from "@/data/place-images";
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
  const { data: experiencias } = useExternalExperiencias();

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

  const getNeighborhood = (item: SavedItem): string => {
    if (!experiencias) return item.destinationName;
    const exp = experiencias.find((e) => e.id === item.id);
    return exp?.bairro || item.destinationName;
  };

  const getImage = (item: SavedItem): string => {
    if (!experiencias) return getAttractionImage(item.id);
    const exp = experiencias.find((e) => e.id === item.id);
    if (exp) {
      const slug = normalizeNeighborhood(exp.bairro);
      return getAttractionImage(slug);
    }
    return getAttractionImage(item.id);
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
            <Button
              onClick={() => navigate("/ia/criar-roteiro")}
              className="w-full max-w-[260px] h-12 text-base font-semibold rounded-xl gap-2 mb-3"
            >
              <Sparkles className="w-5 h-5" />
              Criar roteiro
            </Button>
            <Button variant="outline" asChild className="w-full max-w-[260px]">
              <Link to="/destinos">Explorar destinos</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Invite friends button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "Em breve!", description: "Convite para amigos estará disponível em breve." })}
              className="w-full h-10 rounded-xl gap-2 text-sm font-medium"
            >
              <Users className="w-4 h-4" />
              Convidar amigos
            </Button>

            <p className="text-sm text-muted-foreground mb-2">
              {items.length} {items.length === 1 ? "lugar salvo" : "lugares salvos"}
            </p>
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.type}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 bg-card rounded-xl border border-border overflow-hidden"
                >
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={getImage(item)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 py-2 pr-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </p>
                    {(item as any).sourceUrl ? (
                      <p className="text-xs text-muted-foreground truncate">
                        {(item as any).sourceUrl}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.neighborhood || getNeighborhood(item)}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {typeLabels[item.type] && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                          {typeLabels[item.type]}
                        </Badge>
                      )}
                      {item.source && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
                          {item.source === 'instagram' ? (
                            <Instagram className="w-2.5 h-2.5" />
                          ) : item.source === 'tiktok' ? (
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
                            </svg>
                          ) : (
                            <Link2 className="w-2.5 h-2.5" />
                          )}
                          {item.sourceLabel || item.source}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id, item.type)}
                    className="p-3 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    aria-label="Remover"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Fixed CTA */}
      {items.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-4 z-40 space-y-2">
          <Button
            onClick={() => navigate("/roteiro/rio-3-dias-final")}
            className="w-full h-14 text-base font-semibold rounded-xl gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Organizar com Lucky
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/ia/criar-roteiro")}
            className="w-full h-11 text-sm font-medium rounded-xl"
          >
            Criar roteiro
          </Button>
        </div>
      )}
    </div>
  );
};

export default MinhaViagem;
