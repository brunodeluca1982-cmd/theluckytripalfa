import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { RIO_NEIGHBORHOODS } from "@/data/rio-neighborhoods";

const CityView = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </header>

      {/* Map Area */}
      <div className="relative w-full aspect-[3/4] bg-muted">
        {/* Static map placeholder background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted to-muted-foreground/10">
          {/* Coastline suggestion */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5" />
        </div>

        {/* Tappable neighborhood markers */}
        {RIO_NEIGHBORHOODS.map((neighborhood) => (
          <Link
            key={neighborhood.id}
            to={`/onde-ficar/${neighborhood.id}?from=map`}
            className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 hover:border-foreground/40 transition-colors flex items-center justify-center"
            style={{ top: neighborhood.mapPosition.top, left: neighborhood.mapPosition.left }}
            aria-label={`Explore ${neighborhood.name}`}
          >
            <div className="w-2 h-2 rounded-full bg-foreground/60" />
          </Link>
        ))}
      </div>

      {/* Instruction */}
      <div className="px-6 py-8">
        <p className="text-sm text-muted-foreground text-center">
          Tap a neighborhood to explore where to stay
        </p>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default CityView;
