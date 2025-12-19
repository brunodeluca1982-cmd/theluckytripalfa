import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * DESTINATION ENTRY SCREEN — STRUCTURAL LOCK
 * 
 * First screen user sees after selecting a destination.
 * 
 * PRIMARY ACTIONS (FIXED, EXACTLY 5):
 * 1. Como Chegar
 * 2. Onde Ficar
 * 3. Onde Comer
 * 4. O Que Fazer
 * 5. Lucky List (highlighted special action)
 * 
 * RULES:
 * - Exists at destination level only
 * - No additional modules on this screen
 * - No editorial blocks (Meu Olhar, História, Hoje em Dia)
 * - No personalization or saved items
 * - Structure identical across all destinations
 */

interface DestinationAction {
  id: string;
  label: string;
  path: string;
  isSpecial?: boolean;
}

interface DestinationEntryProps {
  name: string;
  country: string;
  actions: DestinationAction[];
}

const DestinationEntry = ({ name, country, actions }: DestinationEntryProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header with back navigation */}
      <header className="px-6 pt-12 pb-8">
        <Link 
          to="/destinos" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Destinos
        </Link>
        <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
          {country}
        </p>
        <h1 className="text-4xl font-serif font-medium text-foreground">
          {name}
        </h1>
      </header>

      {/* Primary Actions - exactly 5 */}
      <main className="flex-1 px-6">
        <div className="space-y-3 max-w-md">
          {actions.map((action) => (
            <Link
              key={action.id}
              to={action.path}
              className={
                action.isSpecial
                  ? "inline-flex items-center justify-between w-full py-3 px-5 bg-muted/50 border border-border/50 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  : "inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
              }
            >
              <p className={action.isSpecial ? "text-base font-serif" : "text-lg font-serif font-medium"}>
                {action.label}
              </p>
              <span className={action.isSpecial ? "text-xs opacity-60" : "text-muted-foreground"}>
                {action.isSpecial ? "✦" : "→"}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DestinationEntry;
