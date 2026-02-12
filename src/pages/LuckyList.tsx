import { Link } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import { luckyListIntro, getLuckyListByNeighborhood } from "@/data/lucky-list-data";
import luckyListHero from "@/assets/highlights/lucky-list-hero.jpg";
import { useCarnavalMode } from "@/contexts/CarnavalModeContext";

/**
 * LUCKY LIST — RIO DE JANEIRO
 * 
 * PREMIUM LAYER - Subscriber-only content
 * 
 * Rules:
 * - Every block labeled: "Lucky List only — premium layer"
 * - Uses consistent Lucky List Detail template
 * - Reserved fields: "External booking / partner link", "Media area"
 * - Items outside base map ONLY live here
 */

const LuckyList = () => {
  const groupedItems = getLuckyListByNeighborhood();
  const neighborhoods = Object.keys(groupedItems);
  const { isCarnavalMode, carnavalSuggestions, removeCarnavalSuggestion } = useCarnavalMode();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
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

        {/* Hero Image - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted overflow-hidden">
          <img 
            src={luckyListHero} 
            alt="Lucky List - Rio de Janeiro"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description */}
        <div className="px-6 pt-8 pb-10">
          {luckyListIntro.split('\n').map((paragraph, index) => (
            <p key={index} className="text-base text-muted-foreground leading-relaxed mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Sugestões do Carnaval — shown only when toggle ON */}
        {isCarnavalMode && carnavalSuggestions.length > 0 && (
          <section className="px-6 pt-8">
            <div className="mb-4">
              <h2 className="text-xs tracking-widest text-muted-foreground uppercase mb-1">
                Sugestões do Carnaval
              </h2>
              <p className="text-xs text-muted-foreground/60 italic">
                Modo Carnaval ativo
              </p>
            </div>
            <div className="space-y-3">
              {carnavalSuggestions.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
                >
                  <span className="text-base text-foreground">{item}</span>
                  <button
                    onClick={() => removeCarnavalSuggestion(item)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Remover ${item}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-border" />
          </section>
        )}

        {/* Lucky List Items by Neighborhood */}
        {neighborhoods.map((neighborhoodName) => (
          <section key={neighborhoodName} className="px-6 pt-8">
            {/* Neighborhood Header */}
            <div className="mb-4">
              <h2 className="text-xs tracking-widest text-muted-foreground uppercase mb-1">
                {neighborhoodName}
              </h2>
              <p className="text-xs text-muted-foreground/60 italic">
                Lucky List only — premium layer
              </p>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {groupedItems[neighborhoodName].map((item) => (
                <Link
                  key={item.id}
                  to={`/lucky-list/${item.id}`}
                  className="block p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-serif font-medium text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.teaser}
                  </p>
                </Link>
              ))}
            </div>

            {/* Section Divider */}
            <div className="mt-8 border-t border-border" />
          </section>
        ))}
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
