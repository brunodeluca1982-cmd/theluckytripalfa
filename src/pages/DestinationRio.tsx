import { Link } from "react-router-dom";

/**
 * DESTINATION ENTRY PAGE
 * 
 * Entry point for a specific destination (e.g., Rio de Janeiro).
 * Contains the 5 core modules: Como Chegar, Onde Ficar, Onde Comer, O Que Fazer, Lucky List.
 */

const DestinationRio = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
          Brasil
        </p>
        <h1 className="text-4xl font-serif font-medium text-foreground">
          Rio de Janeiro
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6">
        <div className="space-y-3 max-w-md">
          {/* ─── PRIMARY ACTION 1: Como Chegar ─── */}
          <Link
            to="/como-chegar"
            className="inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <p className="text-lg font-serif font-medium">Como Chegar</p>
            <span className="text-muted-foreground">→</span>
          </Link>

          {/* ─── PRIMARY ACTION 2: Onde Ficar ─── */}
          <Link
            to="/city-view"
            className="inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <p className="text-lg font-serif font-medium">Onde Ficar</p>
            <span className="text-muted-foreground">→</span>
          </Link>

          {/* ─── SECONDARY ACTION 3: Onde Comer ─── */}
          <Link
            to="/eat-map-view"
            className="inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <p className="text-lg font-serif font-medium">Onde Comer</p>
            <span className="text-muted-foreground">→</span>
          </Link>

          {/* ─── SECONDARY ACTION 4: O Que Fazer ─── */}
          <Link
            to="/o-que-fazer"
            className="inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <p className="text-lg font-serif font-medium">O Que Fazer</p>
            <span className="text-muted-foreground">→</span>
          </Link>

          {/* ─── SPECIAL ACTION 5: Lucky List (premium, visually discreet) ─── */}
          <Link
            to="/lucky-list"
            className="inline-flex items-center justify-between w-full py-3 px-5 bg-muted/50 border border-border/50 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <p className="text-base font-serif">Lucky List</p>
            <span className="text-xs opacity-60">✦</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DestinationRio;
