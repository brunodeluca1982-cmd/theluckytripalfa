import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IA CHAT — CONTEXTUAL DESTINATION ASSISTANT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE:
 * - Answer questions about the current destination
 * - Only use internal curated content
 * - Suggest related internal links
 * 
 * AI RULES:
 * - Never invent places or information
 * - Calm, confident, experienced tone
 * - Every answer suggests related content
 * ═══════════════════════════════════════════════════════════════════════════
 */

const IAChatPlaceholder = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const exampleQueries = [
    "Is it better to stay in Ipanema or Leblon?",
    "What's a good plan for a rainy day?",
    "Best restaurants for a special dinner?",
    "How many days do I need in Rio?",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-border">
        <Link 
          to="/ia" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-xl font-serif font-medium text-foreground">
          Ask about this destination
        </h1>
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-2">
          Rio de Janeiro
        </p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col px-6 py-8">
        
        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          
          <p className="text-center text-foreground/80 leading-relaxed max-w-sm mb-8">
            Ask anything about Rio de Janeiro. I'll answer based on our curated guides and partner recommendations.
          </p>

          {/* Example Queries */}
          <div className="w-full max-w-sm space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 text-center">
              Try asking
            </p>
            {exampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => setMessage(query)}
                className="w-full text-left px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground/70 hover:bg-muted hover:border-border transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-border bg-background">
        <div className="flex items-center gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 h-12 rounded-xl bg-muted/50 border-border"
          />
          <button 
            className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
          Answers based on curated content only
        </p>
      </div>
    </div>
  );
};

export default IAChatPlaceholder;
