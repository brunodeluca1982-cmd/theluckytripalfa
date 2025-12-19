import { Link } from "react-router-dom";
import { ChevronLeft, MessageCircle, Route, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ASSISTENTE THE LUCKY TRIP — IA SCREEN (v1.0)
 * 
 * STRUCTURAL LOCK
 * 
 * Conceptual and editorial IA screen, not full AI execution.
 * Designed to reduce anxiety, avoid overpromising, and position
 * the product as intelligent and mature.
 * 
 * SECTIONS:
 * 1. Chat Editorial (Primary) - Tire dúvidas com a curadoria
 * 2. Roteiros Inteligentes (Concept) - Combine experiences
 * 3. Ajuste de Roteiro (Support) - Review and improve
 * 
 * RULES:
 * - No backend logic or AI execution at this stage
 * - Premium, editorial, and reassuring feel
 * - Calm spacing, clean layout
 */

const IAAssistant = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 border-b border-border">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-2xl font-serif font-medium text-foreground">
          Assistente The Lucky Trip
        </h1>
      </header>

      {/* Content */}
      <div className="px-6 py-8 space-y-10">
        
        {/* SECTION 1 — CHAT EDITORIAL (PRIMARY) */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-foreground mb-2">
                Tire dúvidas com a curadoria
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pergunte sobre destinos, guias, parceiros e escolhas editoriais do The Lucky Trip.
              </p>
            </div>
          </div>
          
          <Link to="/ia/chat">
            <Button className="w-full" size="lg">
              Perguntar ao Lucky
            </Button>
          </Link>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* SECTION 2 — ROTEIROS INTELIGENTES (CONCEPT) */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Route className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-foreground mb-2">
                Crie roteiros inteligentes
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Combine experiências de diferentes Partners on Trip em um único roteiro.
              </p>
            </div>
          </div>

          {/* Example text */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground italic">
              Exemplo: Verão europeu com Bruno De Luca + Isabeli Fontana + Ronald Domingues
            </p>
          </div>
          
          <Link to="/ia/roteiros-inteligentes">
            <Button variant="outline" className="w-full" size="lg">
              Roteiros Inteligentes (em breve)
            </Button>
          </Link>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* SECTION 3 — AJUSTE DE ROTEIRO (SUPPORT) */}
        <section className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Settings2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-foreground mb-2">
                Ajuste seu roteiro
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use a inteligência do app para revisar, equilibrar e melhorar o seu roteiro.
              </p>
            </div>
          </div>
          
          <Link to="/ia/revisar-roteiro">
            <Button variant="outline" className="w-full" size="lg">
              Revisar meu roteiro (em breve)
            </Button>
          </Link>
        </section>

      </div>
    </div>
  );
};

export default IAAssistant;
