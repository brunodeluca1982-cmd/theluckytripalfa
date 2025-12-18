import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { RIO_NEIGHBORHOODS } from "@/data/rio-neighborhoods";

const placeholderHotels = [
  { name: "Hotel Placeholder", price: "$$$$" },
  { name: "Hotel Placeholder", price: "$$$" },
  { name: "Hotel Placeholder", price: "$$$" },
  { name: "Hotel Placeholder", price: "$$" },
  { name: "Hotel Placeholder", price: "$$" },
];

const OndeficarRio = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-border z-10">
        <div className="px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Home
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
      <main className="px-6 py-6">
        <div className="space-y-3">
          {RIO_NEIGHBORHOODS.map((neighborhood) => {
            const isExpanded = expandedId === neighborhood.id;
            
            return (
              <div
                key={neighborhood.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                {/* Card Header - Tappable */}
                <button
                  onClick={() => handleToggle(neighborhood.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
                >
                  <h2 className="text-lg font-serif font-medium text-foreground">
                    {neighborhood.name}
                  </h2>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`} 
                  />
                </button>

                {/* Expanded Detail Section */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {/* Neighborhood Name */}
                    <div className="px-4 pt-4">
                      <h3 className="text-2xl font-serif font-medium text-foreground">
                        {neighborhood.name}
                      </h3>
                    </div>

                    {/* Image/Video Placeholder */}
                    <div className="mx-4 mt-4 aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Image or video placeholder
                      </p>
                    </div>

                    {/* Description */}
                    <div className="px-4 py-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Placeholder description for {neighborhood.name}. This section will contain information about the neighborhood, its character, and what makes it a good choice for travelers.
                      </p>
                    </div>

                    {/* Hotels List */}
                    <div className="px-4 pb-4">
                      <h4 className="text-xs tracking-widest text-muted-foreground uppercase mb-3">
                        Hotels
                      </h4>
                      <div className="space-y-2">
                        {placeholderHotels.map((hotel, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-3 px-3 bg-background border border-border rounded-md"
                          >
                            <p className="text-sm font-medium text-foreground">
                              {hotel.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {hotel.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
