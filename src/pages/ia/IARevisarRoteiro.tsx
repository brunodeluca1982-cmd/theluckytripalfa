import { Link } from "react-router-dom";
import { ChevronLeft, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * REVISAR MEU ROTEIRO — INFORMATIONAL SCREEN
 * 
 * Shows that this function will be available after the user
 * creates their roteiro.
 */

const IARevisarRoteiro = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-border">
        <Link 
          to="/ia" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-xl font-serif font-medium text-foreground">
          Revisar meu roteiro
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ajuste inteligente
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-8">
          <Settings2 className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h2 className="text-lg font-medium text-foreground text-center mb-4">
          Função em breve
        </h2>
        
        <p className="text-center text-muted-foreground leading-relaxed max-w-sm mb-8">
          Essa função será liberada após você montar seu roteiro.
        </p>

        <Link to="/meu-roteiro">
          <Button variant="outline" size="lg">
            Ir para Meu Roteiro
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default IARevisarRoteiro;
