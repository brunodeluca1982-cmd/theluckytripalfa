import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

/**
 * TRIP PREFERENCES (Step 4: Travel Style)
 * 
 * Route: /meu-roteiro/preferencias
 * 
 * Multi-select trip style preferences before entering the planner.
 */

interface TripStyleOption {
  id: string;
  label: string;
  imageUrl: string;
}

const tripStyleOptions: TripStyleOption[] = [
  {
    id: 'gastronomia',
    label: 'Gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
  },
  {
    id: 'natureza',
    label: 'Natureza',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
  },
  {
    id: 'cultura',
    label: 'Cultura',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400',
  },
  {
    id: 'aventura',
    label: 'Aventura',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
  },
  {
    id: 'relaxamento',
    label: 'Relaxamento',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
  },
  {
    id: 'festa',
    label: 'Festa',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
  },
];

const TripPreferences = () => {
  const navigate = useNavigate();
  const { draft, toggleTripStyle, tripDays, isDestinationSelected } = useTripDraft();

  // If no destination selected, go back to step 1
  if (!isDestinationSelected) {
    navigate('/meu-roteiro', { replace: true });
    return null;
  }

  // If no dates selected, go back to step 3
  if (!draft.arrivalAt || !draft.departureAt) {
    navigate('/meu-roteiro/datas', { replace: true });
    return null;
  }

  const handleContinue = () => {
    // Navigate to decision step (automatic vs manual)
    navigate('/meu-roteiro/decisao');
  };

  const handleBack = () => {
    navigate('/meu-roteiro/datas');
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, "dd/MM", { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Monte seu roteiro</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        {/* Trip summary */}
        <div className="mb-6 p-3 bg-muted/50 rounded-xl space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground">Destino</p>
              <p className="font-semibold text-foreground">{draft.destinationName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Duração</p>
              <p className="font-semibold text-primary">{tripDays} dias</p>
            </div>
          </div>
          <div className="flex justify-between items-start pt-2 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground">Viajantes</p>
              <p className="text-sm text-foreground">
                {draft.adults} {draft.adults === 1 ? 'adulto' : 'adultos'}
                {draft.children > 0 && `, ${draft.children} ${draft.children === 1 ? 'criança' : 'crianças'}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Datas</p>
              <p className="text-sm text-foreground">
                {formatDate(draft.arrivalAt)} - {formatDate(draft.departureAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
            O que te inspira?
          </h2>
          <p className="text-muted-foreground text-sm">
            Selecione o que você ama para personalizarmos sua jornada.
          </p>
        </div>

        {/* Style grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {tripStyleOptions.map((style, index) => {
            const isSelected = draft.tripStyles.includes(style.id);
            
            return (
              <motion.button
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleTripStyle(style.id)}
                className={cn(
                  "relative aspect-[4/3] rounded-2xl overflow-hidden transition-all",
                  isSelected 
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                    : "ring-0"
                )}
              >
                <img
                  src={style.imageUrl}
                  alt={style.label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className={cn(
                  "absolute inset-0 transition-colors",
                  isSelected 
                    ? "bg-primary/40" 
                    : "bg-black/30"
                )} />
                
                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg drop-shadow-lg">
                    {style.label}
                  </span>
                </div>

                {/* Check indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg 
                      className="w-4 h-4 text-primary-foreground" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Fixed CTA - positioned above bottom nav with safe area */}
      <div className="fixed bottom-safe-cta left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <Button
          onClick={handleContinue}
          className="w-full h-14 text-lg font-semibold rounded-2xl"
        >
          Continuar
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TripPreferences;
