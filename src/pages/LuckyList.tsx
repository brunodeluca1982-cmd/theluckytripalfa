import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * Lucky List - Editorial curation
 * 
 * Rules:
 * - Can be neighborhood-linked OR city-level
 * - Must not duplicate items from "Where to Eat" or "What to Do"
 * - Uses ONE consistent Lucky List Detail template
 * - Media area always exists, even if empty
 */

// Placeholder Lucky List items
const luckyListItems = [
  {
    id: "sunset-pedra-bonita",
    title: "Sunset at Pedra Bonita",
    neighborhood: null, // City-level
    teaser: "The most magical golden hour in Rio.",
  },
  {
    id: "morning-swim-arpoador",
    title: "Morning Swim at Arpoador",
    neighborhood: "ipanema",
    teaser: "Join the locals before the crowds arrive.",
  },
  {
    id: "confeitaria-colombo",
    title: "Coffee at Confeitaria Colombo",
    neighborhood: "centro",
    teaser: "Step into Belle Époque Rio.",
  },
];

const LuckyList = () => {
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

      {/* Content */}
      <main className="pb-12">
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            The Lucky List
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Rio de Janeiro
          </p>
        </div>

        {/* Media Placeholder - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Image or video placeholder</p>
        </div>

        {/* Description */}
        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            A curated collection of experiences, places, and moments that define the soul of Rio. These are the discoveries that make a trip truly lucky.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Lucky List Items */}
        <section className="px-6 pt-8">
          <div className="space-y-4">
            {luckyListItems.map((item) => (
              <Link
                key={item.id}
                to={`/lucky-list/${item.id}`}
                className="block p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-lg font-serif font-medium text-foreground mb-1">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {item.teaser}
                </p>
                {item.neighborhood && (
                  <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                    {item.neighborhood}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default LuckyList;
