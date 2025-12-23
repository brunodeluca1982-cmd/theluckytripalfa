import { useNavigate } from "react-router-dom";
import { ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * MANUAL ITINERARY PLACEHOLDER
 * Simple placeholder for manual creation mode.
 */

const ManualItinerary = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/meu-roteiro/decisao')}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Monte manualmente</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
          Em breve
        </h2>
        
        <p className="text-muted-foreground max-w-xs mb-8">
          O modo manual estará disponível em breve. Por enquanto, use o modo automático para criar seu roteiro.
        </p>

        <Button
          onClick={() => navigate('/meu-roteiro/automatico')}
          className="h-12 px-6 rounded-xl"
        >
          Usar modo automático
        </Button>
      </main>
    </div>
  );
};

export default ManualItinerary;
