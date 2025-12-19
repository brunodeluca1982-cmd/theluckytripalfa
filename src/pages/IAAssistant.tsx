import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, CalendarPlus, Sparkles } from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TRAVEL ASSISTANT — IA SCREEN (PT-BR)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ██████████████████████████████████████████████████████████████████████████
 * ██  BEHAVIORAL LOCK — AI ASSISTANT — DO NOT MODIFY                      ██
 * ██████████████████████████████████████████████████████████████████████████
 * 
 * LANGUAGE LOCK:
 * - ALL AI prompts and replies MUST be in Portuguese (pt-BR)
 * - No English responses ever
 * 
 * CONTENT LOCK:
 * - AI may ONLY use curated internal content
 * - No external knowledge or hallucination
 * - Never invents places, tips, or information
 * 
 * FALLBACK LOCK (VERBATIM — DO NOT MODIFY):
 * When AI cannot answer, it MUST reply EXACTLY:
 * "Ih! Essa aí eu não sei te responder… quer falar com o Bruno? 
 * Chama ele no WhatsApp! 21998102132"
 * 
 * FEATURE LOCK:
 * - No creativity modes allowed
 * - No system logic exposure
 * - No AI personality customization
 * 
 * PURPOSE:
 * - Reduce anxiety
 * - Organize decisions
 * - Transform content into action (itinerary)
 * 
 * VISUAL STYLE:
 * - Clean, premium, neutral
 * - No emojis, no playful elements
 * - Feels like a premium travel concierge
 * 
 * ██████████████████████████████████████████████████████████████████████████
 * ██  END BEHAVIORAL LOCK                                                 ██
 * ██████████████████████████████████████████████████████████████████████████
 */

const IAAssistant = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </header>

      {/* Title Section */}
      <div className="px-6 pt-4 pb-8 text-center">
        <h1 className="text-3xl font-serif font-medium text-foreground tracking-tight">
          Assistente de Viagem
        </h1>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mt-3">
          Powered by human experience
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        
        {/* Main Question */}
        <p className="text-lg text-foreground/80 font-light mb-10 text-center">
          O que você quer fazer agora?
        </p>

        {/* Action Cards */}
        <div className="w-full max-w-sm space-y-4">
          
          {/* CARD 1 — PERGUNTAR */}
          <button
            onClick={() => navigate("/ia/perguntar")}
            className="w-full p-5 rounded-2xl bg-card border border-border hover:bg-accent hover:border-border transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="text-base font-medium text-foreground text-left">
                Perguntar sobre este destino
              </span>
            </div>
          </button>

          {/* CARD 2 — CRIAR ROTEIRO */}
          <button
            onClick={() => navigate("/ia/criar-roteiro")}
            className="w-full p-5 rounded-2xl bg-card border border-border hover:bg-accent hover:border-border transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CalendarPlus className="w-5 h-5 text-primary" />
              </div>
              <span className="text-base font-medium text-foreground text-left">
                Criar meu roteiro
              </span>
            </div>
          </button>

          {/* CARD 3 — MELHORAR ROTEIRO */}
          <button
            onClick={() => navigate("/ia/melhorar-roteiro")}
            className="w-full p-5 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-border transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-base font-medium text-foreground text-left">
                Melhorar meu roteiro
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-xs mx-auto">
          Respostas baseadas exclusivamente em conteúdo curado pela nossa equipe editorial e parceiros.
        </p>
      </div>
    </div>
  );
};

export default IAAssistant;
