import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * Lucky List Detail - Consistent template for all Lucky List items
 * 
 * Rules:
 * - Media area (video or photo gallery) always exists, even if empty
 * - Uses ONE consistent template for all items
 */

// Placeholder data - will be replaced with real content
const luckyListData: Record<string, { title: string; neighborhood: string | null; content: string }> = {
  "sunset-pedra-bonita": {
    title: "Sunset at Pedra Bonita",
    neighborhood: null,
    content: "Pedra Bonita offers what might be the most spectacular sunset viewpoint in Rio. The hike is moderate and rewards you with 360-degree views of the city, mountains, and ocean.",
  },
  "morning-swim-arpoador": {
    title: "Morning Swim at Arpoador",
    neighborhood: "Ipanema",
    content: "Before the sun gets too strong and the crowds arrive, Arpoador beach offers a perfect morning ritual. The water is calm, the light is golden, and you'll share the waves with dedicated locals.",
  },
  "confeitaria-colombo": {
    title: "Coffee at Confeitaria Colombo",
    neighborhood: "Centro",
    content: "Step through the doors of Confeitaria Colombo and travel back to 1894. The ornate mirrors, carved wood, and Belle Époque atmosphere make this more than just a café—it's a living museum.",
  },
};

const LuckyListDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const item = luckyListData[id || ""] || {
    title: "Lucky List Item",
    neighborhood: null,
    content: "Content coming soon.",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/lucky-list"
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
            {item.title}
          </h1>
          {item.neighborhood && (
            <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest">
              {item.neighborhood}
            </p>
          )}
        </div>

        {/* Media Placeholder - Full Width (always present) */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Image or video placeholder</p>
        </div>

        {/* Content */}
        <div className="px-6 pt-8">
          <p className="text-base text-muted-foreground leading-relaxed">
            {item.content}
          </p>
        </div>

        {/* Inactive CTA Placeholder */}
        <div className="px-6 pt-8">
          <div className="py-3 px-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Learn more
            </p>
          </div>
        </div>
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

export default LuckyListDetail;
