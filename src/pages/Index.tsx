import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <p className="text-sm tracking-widest text-muted-foreground uppercase">
          Travel Guide
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
          A calm guide to finding the perfect place to stay in the world's most beautiful destinations.
        </p>

        <Link
          to="/onde-ficar-rio"
          className="inline-flex items-center justify-between w-full max-w-xs py-4 px-6 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
        >
          <div>
            <p className="text-sm text-muted-foreground mb-1">Onde Ficar</p>
            <p className="text-lg font-serif font-medium">Rio de Janeiro</p>
          </div>
          <span className="text-muted-foreground">→</span>
        </Link>
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
