import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const neighborhoods = [
  { id: "copacabana", name: "Copacabana", description: "Placeholder description for Copacabana neighborhood." },
  { id: "ipanema", name: "Ipanema", description: "Placeholder description for Ipanema neighborhood." },
  { id: "leblon", name: "Leblon", description: "Placeholder description for Leblon neighborhood." },
  { id: "santa-teresa", name: "Santa Teresa", description: "Placeholder description for Santa Teresa neighborhood." },
  { id: "botafogo", name: "Botafogo", description: "Placeholder description for Botafogo neighborhood." },
  { id: "lapa", name: "Lapa", description: "Placeholder description for Lapa neighborhood." },
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
            Home
          </Link>
          <h1 className="text-3xl font-serif font-medium text-foreground">
            Where to Stay
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Rio de Janeiro
          </p>
        </div>
      </header>

      {/* Neighborhood List */}
      <main className="px-6 py-6">
        <div className="space-y-4">
          {neighborhoods.map((neighborhood) => (
            <div
              key={neighborhood.id}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {/* Image Placeholder */}
              <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Image placeholder</p>
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                <h2 className="text-xl font-serif font-medium text-foreground mb-2">
                  {neighborhood.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {neighborhood.description}
                </p>
                <Link
                  to={`/bairro/${neighborhood.id}`}
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  View hotels
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border mt-4">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default OndeficarRio;
