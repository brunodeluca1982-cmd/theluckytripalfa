import { useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTripDraft, PriceStyle } from "@/hooks/use-trip-draft";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import FlowHeroBackground from "@/components/roteiro/FlowHeroBackground";

const priceStyleOptions: { value: PriceStyle; label: string; description: string }[] = [
  { value: '$', label: '$', description: 'Essencial' },
  { value: '$$', label: '$$', description: 'Conforto' },
  { value: '$$$', label: '$$$', description: 'Sofisticado' },
];

interface TripStyleOption {
  id: string;
  label: string;
  imageUrl: string;
}

const tripStyleOptions: TripStyleOption[] = [
  { id: 'gastronomia', label: 'Gastronomia', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: 'natureza', label: 'Natureza', imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80' },
  { id: 'cultura', label: 'Cultura', imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&q=80' },
  { id: 'aventura', label: 'Aventura', imageUrl: 'https://images.unsplash.com/photo-1530488562579-7c1dd2e6667b?w=400&q=80' },
  { id: 'relaxamento', label: 'Relaxamento', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
  { id: 'festa', label: 'Festa', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80' },
];

const TripPreferences = () => {
  const navigate = useNavigate();
  const { draft, toggleTripStyle, setPriceStyle, tripDays, isDestinationSelected } = useTripDraft();
  const priceStyleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((ref: React.RefObject<HTMLDivElement | null>, delay = 300) => {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "center" }), delay);
  }, []);

  const redirectPath = !isDestinationSelected
    ? '/meu-roteiro'
    : (!draft.arrivalAt || !draft.departureAt)
      ? '/meu-roteiro/datas'
      : null;

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [redirectPath, navigate]);

  if (redirectPath) return null;

  const handleContinue = () => navigate('/meu-roteiro/manual');
  const handleBack = () => navigate('/meu-roteiro');

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, "dd/MM", { locale: ptBR });
  };

  return (
    <FlowHeroBackground imageUrl={draft.destinationImageUrl || undefined}>
      <div className="min-h-screen pb-32">
        {/* Header */}
        <header className="sticky top-0 z-50 px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 -m-2 text-white/80 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">Monte seu roteiro</h1>
          </div>
        </header>

        <main className="px-4 py-6 space-y-6">
          {/* Trip summary — glass panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50">Destino</p>
                <p className="font-semibold text-white">{draft.destinationName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50">Duração</p>
                <p className="font-semibold text-white">{tripDays} dias</p>
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-white/10">
              <div className="text-right">
                <p className="text-xs text-white/50">Datas</p>
                <p className="text-sm text-white/80">
                  {formatDate(draft.arrivalAt)} - {formatDate(draft.departureAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl font-serif font-semibold text-white mb-2">
              O que te inspira?
            </h2>
            <p className="text-white/60 text-sm">
              Selecione o que você ama para personalizarmos sua jornada.
            </p>
          </div>

          {/* Style grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {tripStyleOptions.map((style, index) => {
              const isSelected = draft.tripStyles.includes(style.id);

              return (
                <motion.button
                  key={style.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => { toggleTripStyle(style.id); scrollTo(priceStyleRef); }}
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden transition-all",
                    isSelected
                      ? "ring-2 ring-white ring-offset-2 ring-offset-transparent"
                      : "ring-0"
                  )}
                >
                  <img src={style.imageUrl} alt={style.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors",
                    isSelected && "from-primary/60 via-primary/20 to-transparent"
                  )} />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <span className="text-white text-xs font-medium leading-tight truncate">{style.label}</span>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-primary" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Price style — glass panel */}
          <div ref={priceStyleRef} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <p className="text-sm text-white/60 mb-3 text-center">
              Estilo de viagem <span className="text-xs">(opcional)</span>
            </p>
            <div className="flex gap-2 justify-center">
              {priceStyleOptions.map((option) => {
                const isSelected = draft.priceStyle === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => { setPriceStyle(option.value); scrollTo(ctaRef); }}
                    className={cn(
                      "flex-1 max-w-[100px] py-3 px-2 rounded-xl border transition-all text-center",
                      isSelected
                        ? "border-white bg-white/20 text-white"
                        : "border-white/20 bg-white/5 text-white/60 hover:border-white/40"
                    )}
                  >
                    <span className="block text-lg font-semibold">{option.label}</span>
                    <span className="block text-xs mt-0.5">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* Fixed CTA */}
        <div ref={ctaRef} className="fixed bottom-safe-cta left-0 right-0 p-4 z-40">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <Button
              onClick={handleContinue}
              className="w-full h-14 text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90"
            >
              Continuar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </FlowHeroBackground>
  );
};

export default TripPreferences;
