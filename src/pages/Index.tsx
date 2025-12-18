import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <p className="text-sm tracking-widest text-muted-foreground uppercase">
          Guia de Viagem
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-6 pb-24">
        <h1 className="text-5xl font-serif font-medium leading-tight text-foreground mb-6">
          The Lucky
          <br />
          Trip
        </h1>
        
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-xs">
          Um guia calmo para encontrar o lugar perfeito nos destinos mais bonitos do mundo.
        </p>

        {/* Destination: Rio de Janeiro */}
        <div className="mb-6">
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-3">
            Rio de Janeiro
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            STRUCTURAL LOCK — FIRST DESTINATION SCREEN
            Destination: Rio de Janeiro
            ═══════════════════════════════════════════════════════════════════
            
            This is the user's FIRST CONTACT with the destination.
            Decision-oriented, anxiety-reducing, and practical.
            
            FIXED MODULE ORDER (EXACTLY 5, NO MORE):
            1. Como Chegar — macro arrival logistics
            2. Onde Ficar — accommodation/neighborhood decision
            3. Onde Comer — gastronomy by neighborhood
            4. O Que Fazer — activities by neighborhood, public layer
            5. Lucky List — premium discovery, visually discreet
            
            LUCKY LIST RULES:
            - Appears as smaller, highlighted element
            - Signals exclusivity and discovery
            - May include limited free teaser content
            - Full access requires subscription
            - Must NOT dominate or interrupt core decisions
            
            EXPLICIT EXCLUSIONS (belong to secondary screens only):
            - Mover / Como se locomover
            - Vida Noturna
            - Sabores Locais
            - Dinheiro
            - Documentos & Visto
            - Melhor Época
            - O Que Levar
            - Gastos da Viagem
            - Links Úteis
            - Checklist Final
            - Entender o Destino (Meu Olhar, História, Hoje em Dia)
            
            NAVIGATION RULES:
            - Users may swipe/navigate to secondary modules from here
            - This screen remains the anchor of the destination
            - Back navigation from any secondary screen returns here
            
            SCALABILITY RULE:
            - This structure must be IDENTICAL across all destinations
            - No destination may alter the order or composition
            
            ═══════════════════════════════════════════════════════════════════ */}
        
        <div className="space-y-3 max-w-xs">
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

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Prototype v0.1
        </p>
      </footer>
    </div>
  );
};

export default Index;
