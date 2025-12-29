import { useState } from "react";
import { Sparkles, X, Wand2, Calendar, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * AI ASSISTANT FAB
 * 
 * Floating action button for AI assistance in roteiro planning.
 * Can suggest activities, auto-fill, and rebalance schedules.
 */

interface AIAssistantFABProps {
  onSuggestActivities?: () => void;
  onAutoFill?: () => void;
  onRebalance?: () => void;
}

export const AIAssistantFAB = ({ 
  onSuggestActivities, 
  onAutoFill, 
  onRebalance 
}: AIAssistantFABProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Actions are advisory only — never auto-edit, never override user
  const actions = [
    {
      id: 'suggest',
      label: 'Me dá umas ideias',
      icon: Wand2,
      onClick: onSuggestActivities,
    },
    {
      id: 'autofill',
      label: 'Preencher dias vazios',
      icon: Calendar,
      onClick: onAutoFill,
    },
    {
      id: 'rebalance',
      label: 'Sugerir ajustes',
      icon: RotateCcw,
      onClick: onRebalance,
    },
  ];

  return (
    <div className="fixed bottom-safe-nav right-4 z-40 flex flex-col items-end gap-3">
      {/* Action Menu */}
      {isOpen && (
        <div className="flex flex-col gap-2 animate-fade-in">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                action.onClick?.();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 bg-card border border-border rounded-full pl-4 pr-3 py-2 shadow-lg hover:bg-accent transition-colors"
            >
              <span className="text-sm text-foreground whitespace-nowrap">
                {action.label}
              </span>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <action.icon className="w-4 h-4 text-primary" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={`
          w-14 h-14 rounded-full shadow-lg transition-all duration-300
          ${isOpen ? 'bg-muted text-muted-foreground rotate-45' : 'bg-primary text-primary-foreground'}
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Sparkles className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default AIAssistantFAB;
