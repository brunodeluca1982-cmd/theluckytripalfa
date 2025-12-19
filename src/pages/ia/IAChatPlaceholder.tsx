import { Link } from "react-router-dom";
import { ChevronLeft, MessageCircle } from "lucide-react";

/**
 * IA CHAT — PLACEHOLDER SCREEN
 * 
 * Conceptual chat interface.
 * Does NOT function yet — placeholder only.
 */

const IAChatPlaceholder = () => {
  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-border">
        <Link 
          to="/ia" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-xl font-serif font-medium text-foreground">
          Perguntar ao Lucky
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tire dúvidas com a curadoria
        </p>
      </header>

      {/* Chat Area - Placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        
        <p className="text-center text-muted-foreground leading-relaxed max-w-sm">
          Em breve você poderá conversar com a curadoria inteligente do The Lucky Trip.
        </p>
      </div>

      {/* Input Placeholder */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
          <span className="text-sm text-muted-foreground">
            Digite sua pergunta...
          </span>
        </div>
      </div>
    </div>
  );
};

export default IAChatPlaceholder;
