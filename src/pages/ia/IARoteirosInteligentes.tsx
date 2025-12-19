import { Link } from "react-router-dom";
import { ChevronLeft, Route, Sparkles } from "lucide-react";

/**
 * ROTEIROS INTELIGENTES — INFORMATIONAL SCREEN
 * 
 * Explains that this feature will be released in a future update.
 * No generation or automation at this stage.
 */

const IARoteirosInteligentes = () => {
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
          Roteiros Inteligentes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Combinação de experiências
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-8">
          <Route className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h2 className="text-lg font-medium text-foreground text-center mb-4">
          Em breve
        </h2>
        
        <p className="text-center text-muted-foreground leading-relaxed max-w-sm mb-8">
          Essa função permitirá combinar experiências de diferentes Partners on Trip em um único roteiro personalizado.
        </p>

        {/* Example */}
        <div className="w-full max-w-sm p-6 rounded-2xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs tracking-widest text-muted-foreground uppercase">
              Exemplo
            </span>
          </div>
          <p className="text-sm text-foreground">
            Verão europeu com Bruno De Luca + Isabeli Fontana + Ronald Domingues
          </p>
        </div>
      </div>
    </div>
  );
};

export default IARoteirosInteligentes;
