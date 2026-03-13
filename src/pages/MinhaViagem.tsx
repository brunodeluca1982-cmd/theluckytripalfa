import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, Sparkles, Compass, MapPin } from "lucide-react";
import AddIdeaSection from "@/components/minha-viagem/AddIdeaSection";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import type { SavedItem } from "@/hooks/use-item-save";
import { useCityHero } from "@/contexts/CityHeroContext";
import { CityHeroProvider } from "@/contexts/CityHeroContext";

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

function GlassButton({
  children,
  className = "",
  onClick,
  disabled,
}: { children: React.ReactNode; className?: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-medium text-foreground rounded-full backdrop-blur-xl bg-white/18 border border-white/35 shadow-lg hover:bg-white/25 transition-colors duration-200 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

function MinhaViagemInner() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SavedItem[]>(readDraft);
  const { heroUrl } = useCityHero();

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
    <div className="min-h-screen pb-32 relative">
      {/* Atmospheric hero background */}
      {heroUrl && (
        <div className="fixed inset-0 z-0">
          <img
            src={heroUrl}
            alt=""
            className="w-full h-full object-cover opacity-30 blur-xl scale-110"
            draggable={false}
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/10 border-b border-white/15 px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="p-2 -m-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <div className="text-center">
            <h1 className="text-xl font-serif font-semibold text-foreground tracking-tight">Minha Viagem</h1>
            <p className="text-[11px] text-muted-foreground/80">Suas ideias salvas para a próxima viagem</p>
          </div>
          <div className="w-9" />
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 relative z-10">
        {/* Add Idea section — always visible */}
        <AddIdeaSection />

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col items-center justify-center pt-16 text-center"
          >
            <div className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
              <Compass className="w-7 h-7 text-foreground/50" />
            </div>
            <p className="text-xl font-serif font-medium text-foreground mb-1.5">Minha Viagem</p>
            <p className="text-sm text-muted-foreground/80 mb-8 max-w-[260px] leading-relaxed">
              Salve lugares ou crie um roteiro para começar sua viagem.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Link to="/o-que-fazer">
                <GlassButton className="w-full bg-white/22 border-white/40">
                  <Sparkles className="w-4 h-4" />
                  Explorar O Que Fazer
                </GlassButton>
              </Link>
              <Link to="/lucky-list">
                <GlassButton className="w-full">
                  <MapPin className="w-4 h-4" />
                  Lucky List
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.28, ease: "easeOut", delay: index * 0.04 }}
                  className="flex items-center gap-3 p-4 rounded-2xl backdrop-blur-2xl bg-white/12 border border-white/18 shadow-lg"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl backdrop-blur-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">{item.type === "hotel" ? "🏨" : item.type === "restaurant" ? "🍽️" : "✨"}</span>
                  </div>

                  <Link to={getDetailPath(item)} className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.destinationName}</p>
                    <Badge
                      variant="secondary"
                      className="mt-1 text-[10px] bg-white/10 border-white/15 text-foreground/70 backdrop-blur-sm"
                    >
                      {typeLabels[item.type] || item.type}
                    </Badge>
                  </Link>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleRemove(item.id, item.type)}
                    className="p-2 rounded-full text-foreground/40 hover:text-foreground hover:bg-white/10 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.15 }}
            className="flex flex-col gap-3 pt-4"
          >
            <Link to="/criar-roteiro">
              <GlassButton className="w-full bg-white/22 border-white/40">
                <Sparkles className="w-4 h-4" />
                Criar Roteiro com IA
              </GlassButton>
            </Link>
            <Link to="/roteiro-planner">
              <GlassButton className="w-full">
                Montar Roteiro Manual
              </GlassButton>
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}

const MinhaViagem = () => (
  <CityHeroProvider cityId="rio-de-janeiro">
    <MinhaViagemInner />
  </CityHeroProvider>
);

export default MinhaViagem;
