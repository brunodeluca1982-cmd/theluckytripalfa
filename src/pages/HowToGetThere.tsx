import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * How to Get There - City-level only
 * 
 * Rules:
 * - City-level only (not neighborhood-based)
 * - May contain outbound links (flights, transport, tickets)
 */

const transportOptions = [
  {
    title: "By Air",
    description: "Rio de Janeiro has two airports: Galeão International (GIG) for most international flights, and Santos Dumont (SDU) for domestic routes.",
    ctaLabel: "Search flights",
  },
  {
    title: "From the Airport",
    description: "Options include official taxis, rideshare apps, airport buses (BRT), and private transfers. Journey to Zona Sul takes 30-60 minutes depending on traffic.",
    ctaLabel: "Book transfer",
  },
  {
    title: "Getting Around",
    description: "The Metro connects key neighborhoods. Taxis and rideshares are affordable. For beaches, walking is often the best option.",
    ctaLabel: "View transit map",
  },
];

const HowToGetThere = () => {
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
            How to Get There
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
            Everything you need to know about reaching Rio de Janeiro and navigating the city once you arrive.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Transport Options */}
        <section className="px-6 pt-8">
          <div className="space-y-6">
            {transportOptions.map((option, index) => (
              <div key={index} className="pb-6 border-b border-border last:border-0">
                <h2 className="text-lg font-serif font-medium text-foreground mb-2">
                  {option.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {option.description}
                </p>
                {/* Inactive CTA Placeholder */}
                <div className="py-2 px-3 bg-muted/50 rounded inline-block">
                  <p className="text-sm text-muted-foreground">
                    {option.ctaLabel}
                  </p>
                </div>
              </div>
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

export default HowToGetThere;
