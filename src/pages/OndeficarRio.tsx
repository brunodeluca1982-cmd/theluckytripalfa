import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const neighborhoods = [
  { id: "copacabana", name: "Copacabana", tagline: "O clássico carioca" },
  { id: "ipanema", name: "Ipanema", tagline: "Elegância à beira-mar" },
  { id: "leblon", name: "Leblon", tagline: "Sofisticação e tranquilidade" },
  { id: "santa-teresa", name: "Santa Teresa", tagline: "Boemia e arte" },
  { id: "botafogo", name: "Botafogo", tagline: "Vida urbana e cultura" },
  { id: "lapa", name: "Lapa", tagline: "Noite e tradição" },
];

const OndeficarRio = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Início
          </Link>
          <h1 className="text-3xl font-serif font-medium text-foreground">
            Onde Ficar
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Rio de Janeiro
          </p>
        </div>
      </header>

      {/* Neighborhood List */}
      <main className="px-6 py-8">
        <p className="text-sm text-muted-foreground mb-6">
          Escolha um bairro para explorar
        </p>

        <div className="space-y-3">
          {neighborhoods.map((neighborhood) => (
            <Link
              key={neighborhood.id}
              to={`/bairro/${neighborhood.id}`}
              className="block w-full p-5 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-medium text-foreground">
                    {neighborhood.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {neighborhood.tagline}
                  </p>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border mt-8">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default OndeficarRio;
