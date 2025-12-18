import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const neighborhoodData: Record<string, { name: string }> = {
  copacabana: { name: "Copacabana" },
  ipanema: { name: "Ipanema" },
  leblon: { name: "Leblon" },
  "santa-teresa": { name: "Santa Teresa" },
  botafogo: { name: "Botafogo" },
  lapa: { name: "Lapa" },
};

const placeholderHotels = [
  { name: "Hotel Placeholder", price: "$$$$" },
  { name: "Hotel Placeholder", price: "$$$" },
  { name: "Hotel Placeholder", price: "$$$" },
  { name: "Hotel Placeholder", price: "$$" },
  { name: "Hotel Placeholder", price: "$$" },
];

const BairroDetail = () => {
  const { id } = useParams<{ id: string }>();
  const neighborhood = neighborhoodData[id || ""] || { name: "Neighborhood" };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="px-6 py-4">
          <Link
            to="/onde-ficar-rio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Where to Stay
          </Link>
        </div>
      </header>

      {/* Content */}
      <main>
        {/* Title */}
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-4xl font-serif font-medium text-foreground">
            {neighborhood.name}
          </h1>
        </div>

        {/* Image/Video Placeholder */}
        <div className="w-full aspect-[16/10] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Image or video placeholder</p>
        </div>

        {/* Description */}
        <div className="px-6 py-6">
          <p className="text-base text-muted-foreground leading-relaxed">
            Placeholder description text for {neighborhood.name}. This section will contain a short overview of the neighborhood, its vibe, and what makes it special for travelers.
          </p>
        </div>

        {/* Hotels Section */}
        <section className="px-6 pb-8">
          <h2 className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
            Hotels
          </h2>
          
          <div className="space-y-3">
            {placeholderHotels.map((hotel, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
              >
                <p className="text-base font-serif font-medium text-foreground">
                  {hotel.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {hotel.price}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {neighborhood.name}, Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default BairroDetail;
