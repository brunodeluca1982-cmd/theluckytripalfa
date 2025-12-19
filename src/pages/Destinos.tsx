import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * DESTINOS PAGE
 * 
 * List of all available destinations.
 * Accessible from bottom navigation.
 */

interface Destination {
  id: string;
  name: string;
  country: string;
  available: boolean;
  path: string;
}

const destinations: Destination[] = [
  {
    id: "rio-de-janeiro",
    name: "Rio de Janeiro",
    country: "Brasil",
    available: true,
    path: "/destino/rio-de-janeiro/intro",
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    country: "Brasil",
    available: false,
    path: "/destino/sao-paulo",
  },
  {
    id: "lisboa",
    name: "Lisboa",
    country: "Portugal",
    available: false,
    path: "/destino/lisboa",
  },
];

const Destinos = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 pt-12 pb-6">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-serif font-medium text-foreground">
          Destinos
        </h1>
      </header>

      {/* Destinations List */}
      <main className="px-6">
        <div className="space-y-3">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              to={destination.available ? destination.path : "#"}
              className={`block py-4 px-6 bg-card border rounded-lg transition-colors ${
                destination.available
                  ? "border-border hover:bg-accent cursor-pointer"
                  : "border-border/50 opacity-50 cursor-not-allowed"
              }`}
              onClick={(e) => !destination.available && e.preventDefault()}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {destination.country}
              </p>
              <h2 className="text-lg font-serif font-medium text-foreground">
                {destination.name}
              </h2>
              {!destination.available && (
                <span className="text-xs text-muted-foreground">Em breve</span>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Destinos;
