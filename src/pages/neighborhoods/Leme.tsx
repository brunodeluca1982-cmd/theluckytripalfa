import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useBackNavigation } from "@/hooks/use-back-navigation";

const placeholderHotels = [
  { name: "Hotel Placeholder", price: "$$$$" },
  { name: "Hotel Placeholder", price: "$$$" },
  { name: "Hotel Placeholder", price: "$$$" },
  { name: "Hotel Placeholder", price: "$$" },
  { name: "Hotel Placeholder", price: "$$" },
];

const Leme = () => {
  const backPath = useBackNavigation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Neighborhood Name */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            Leme
          </h1>
        </div>

        {/* Media Placeholder - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Image or video placeholder</p>
        </div>

        {/* Description */}
        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            Placeholder description for Leme. A short overview of the neighborhood's character and appeal.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Where to Stay Section */}
        <section className="px-6 pt-8">
          <h2 className="text-xl font-serif font-medium text-foreground mb-6">
            Where to stay
          </h2>
          
          <div className="space-y-4">
            {placeholderHotels.map((hotel, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-b border-border last:border-b-0"
              >
                <p className="text-base text-foreground">
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
          The Lucky Trip — Leme
        </p>
      </footer>
    </div>
  );
};

export default Leme;
