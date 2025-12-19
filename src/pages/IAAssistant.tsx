import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, CalendarPlus, Sparkles } from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TRAVEL ASSISTANT — IA SCREEN (FINAL / LOCKED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This is NOT a generic chatbot.
 * This is a curated, contextual, human-guided travel assistant.
 * 
 * PURPOSE:
 * - Reduce anxiety
 * - Organize decisions
 * - Transform content into action (itinerary)
 * 
 * AI RULES:
 * - Only uses curated content (Bruno, Partners, Lucky List, Guides)
 * - Never invents places, tips or information
 * - Calm, confident, human, experienced tone
 * 
 * VISUAL STYLE:
 * - Clean, premium, neutral
 * - No emojis, no playful elements
 * - Feels like a premium travel concierge
 * ═══════════════════════════════════════════════════════════════════════════
 */

const IAAssistant = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <header className="px-6 pt-12 pb-6">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          TITLE SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <div className="px-6 pt-4 pb-8 text-center">
        <h1 className="text-3xl font-serif font-medium text-foreground tracking-tight">
          Travel Assistant
        </h1>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mt-3">
          Powered by human experience
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        
        {/* Main Question */}
        <p className="text-lg text-foreground/80 font-light mb-10 text-center">
          What do you want to do now?
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          
          {/* BUTTON 1 — ASK A QUESTION */}
          <ActionButton
            icon={MessageCircle}
            label="Ask about this destination"
            onClick={() => navigate("/ia/chat")}
          />

          {/* BUTTON 2 — CREATE ITINERARY */}
          <ActionButton
            icon={CalendarPlus}
            label="Create my itinerary"
            onClick={() => navigate("/ia/create-itinerary")}
          />

          {/* BUTTON 3 — IMPROVE ITINERARY */}
          <ActionButton
            icon={Sparkles}
            label="Improve my itinerary"
            onClick={() => navigate("/ia/improve-itinerary")}
            subtle
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER NOTE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-xs mx-auto">
          Answers are based exclusively on curated content from our editorial team and trusted partners.
        </p>
      </div>
    </div>
  );
};

/**
 * Premium Action Button Component
 */
interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  subtle?: boolean;
}

const ActionButton = ({ icon: Icon, label, onClick, subtle }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-5 rounded-2xl
        border transition-all duration-200
        ${subtle 
          ? "bg-muted/30 border-border/50 hover:bg-muted/50 hover:border-border" 
          : "bg-card border-border hover:bg-accent hover:border-border"
        }
      `}
    >
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
        ${subtle ? "bg-muted" : "bg-primary/10"}
      `}>
        <Icon className={`w-5 h-5 ${subtle ? "text-muted-foreground" : "text-primary"}`} />
      </div>
      <span className="text-base font-medium text-foreground text-left">
        {label}
      </span>
    </button>
  );
};

export default IAAssistant;
