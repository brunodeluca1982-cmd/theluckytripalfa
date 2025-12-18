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

        <div className="space-y-3 max-w-xs">
          {/* Where to Stay */}
          <Link
            to="/city-view"
            className="inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <p className="text-lg font-serif font-medium">Onde Ficar</p>
            <span className="text-muted-foreground">→</span>
          </Link>

          {/* Where to Eat */}
          <Link
            to="/eat-map-view"
            className="inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <p className="text-lg font-serif font-medium">Onde Comer</p>
            <span className="text-muted-foreground">→</span>
          </Link>

          {/* What to Do */}
          <Link
            to="/o-que-fazer"
            className="inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <p className="text-lg font-serif font-medium">O Que Fazer</p>
            <span className="text-muted-foreground">→</span>
          </Link>

          {/* Lucky List */}
          <Link
            to="/lucky-list"
            className="inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <p className="text-lg font-serif font-medium">The Lucky List</p>
            <span className="text-muted-foreground">→</span>
          </Link>

          {/* How to Get There */}
          <Link
            to="/como-chegar"
            className="inline-flex items-center justify-between w-full py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            <p className="text-lg font-serif font-medium">Como Chegar</p>
            <span className="text-muted-foreground">→</span>
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
