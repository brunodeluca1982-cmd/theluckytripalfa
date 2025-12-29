import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTripDraft } from "@/hooks/use-trip-draft";

/**
 * ITINERARY DECISION STEP
 * After trip preferences, user chooses automatic or manual itinerary creation.
 */

const ItineraryDecision = () => {
  const navigate = useNavigate();
  const { draft } = useTripDraft();

  if (!draft.destinationId) {
    navigate('/meu-roteiro', { replace: true });
    return null;
  }

  const handleAutomatic = () => {
    navigate('/meu-roteiro/automatico');
  };

  const handleManual = () => {
    navigate('/meu-roteiro/manual');
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/meu-roteiro/preferencias')}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Criar roteiro</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Quer que o The Lucky Trip crie seu roteiro?
          </h2>
          <p className="text-muted-foreground text-sm">
            Você pode escolher: automático (curado) ou manual.
          </p>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          {/* Automatic option */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleAutomatic}
            className="w-full p-6 bg-primary/10 border-2 border-primary rounded-2xl text-left transition-all hover:bg-primary/20 active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  Criar automático
                </h3>
                <p className="text-sm text-muted-foreground">
                  Roteiro curado pelo The Lucky Trip, baseado nas suas preferências. Pronto para usar.
                </p>
              </div>
            </div>
          </motion.button>

          {/* Manual option */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleManual}
            className="w-full p-6 bg-card border border-border rounded-2xl text-left transition-all hover:bg-accent active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <PenTool className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-1">
                  Criar manualmente
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monte seu roteiro do zero, escolhendo cada experiência.
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default ItineraryDecision;
