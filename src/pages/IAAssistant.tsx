import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, CalendarPlus, Sparkles, Bot } from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LUCKY TRIP — AI ASSISTANT SCREEN
 * "Inteligência Humana em Viagens"
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ██████████████████████████████████████████████████████████████████████████
 * ██  SYSTEM PROMPT LOCK — DO NOT MODIFY                                  ██
 * ██████████████████████████████████████████████████████████████████████████
 * 
 * LANGUAGE RULE:
 * - Always communicate in Brazilian Portuguese
 * - Interface labels MUST be in Portuguese
 * - No English output to user
 * - No emojis
 * 
 * SCOPE RULE (CRITICAL):
 * - ONLY use The Lucky Trip internal database
 * - Do NOT invent places, restaurants, attractions, distances or prices
 * - If unavailable, respond EXACTLY:
 *   "Ih! Essa aí eu não sei te responder… quer falar com o Bruno? 
 *   Chama ele no WhatsApp! 21998102132"
 * 
 * ROLE:
 * - You are NOT a creative travel writer
 * - You are a planner, organizer and validator
 * 
 * YOUR JOB:
 * - Organize itineraries
 * - Calculate time consistency
 * - Detect logistical problems
 * - Suggest small optimizations (distance, duration, sequence)
 * - Respect user choices
 * 
 * DO NOT:
 * - Create new attractions
 * - Suggest alternatives outside the database
 * - Write long explanations
 * - Use emojis
 * - Sound promotional or exaggerated
 * 
 * USER-ADDED PLACES:
 * - Must exist in Google Places with valid place_id
 * - Only locations found via Google Maps can be added manually
 * - AI may use user-added places ONLY for:
 *   • Distance calculation
 *   • Travel time estimation
 *   • Schedule consistency checks
 * - AI must NOT recommend, describe, or suggest user-added places
 * - All recommendations must come EXCLUSIVELY from curated database
 * 
 * OUTPUT STYLE:
 * - Short sentences
 * - Functional tone
 * - No storytelling
 * - No filler
 * 
 * ██████████████████████████████████████████████████████████████████████████
 * ██  END SYSTEM PROMPT LOCK                                              ██
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

          {/* CARD 4 — IA LUCKY TRIP (chat com curador) */}
          <button
            onClick={() => navigate("/ia/lucky-trip")}
            className="w-full p-5 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <span className="text-base font-medium text-foreground block">
                  IA – Lucky Trip
                </span>
                <span className="text-xs text-muted-foreground">
                  Seu curador inteligente
                </span>
              </div>
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
