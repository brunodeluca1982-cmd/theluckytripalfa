import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getLuckyListByNeighborhood } from "@/data/lucky-list-data";
import luckyListHero from "@/assets/highlights/lucky-list-hero.jpg";

const NEIGHBORHOOD_MAP: Record<string, string> = {
  "copacabana": "Copacabana",
  "ipanema": "Ipanema",
  "leblon": "Leblon",
  "botafogo": "Botafogo",
  "flamengo": "Flamengo",
  "barra-da-tijuca": "Barra da Tijuca",
  "urca": "Urca",
  "santa-teresa": "Santa Teresa",
  "lapa": "Lapa",
  "centro": "Centro",
  "fora-do-mapa": "Fora do Mapa",
};

const LuckyListNeighborhood = () => {
  const { neighborhoodId } = useParams<{ neighborhoodId: string }>();
  const navigate = useNavigate();
  
  const neighborhoodName = NEIGHBORHOOD_MAP[neighborhoodId || ""] || "Região";
  const groupedItems = getLuckyListByNeighborhood();
  const items = groupedItems[neighborhoodName] || [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-5">
        <p className="text-muted-foreground mb-4">Nenhum item encontrado nesta região.</p>
        <button
          onClick={() => navigate("/lucky-list")}
          className="text-primary underline"
        >
          Voltar para Lucky List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${luckyListHero})` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />

      {/* Header */}
      <header className="relative z-10 px-5 pt-12 pb-4">
        <Link
          to="/lucky-list"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 px-5 pb-12">
        {/* Title */}
        <section className="pt-4 pb-8">
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase mb-2">
            The Lucky List
          </p>
          <h1 className="text-3xl font-serif font-semibold text-white leading-tight">
            {neighborhoodName}
          </h1>
          <p className="text-sm text-white/60 mt-2">
            {items.length} {items.length === 1 ? "lugar exclusivo" : "lugares exclusivos"}
          </p>
        </section>

        {/* Items list */}
        <section className="space-y-4">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/lucky-list/${item.id}`}
              className="block p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all active:scale-[0.98]"
            >
              <p className="text-xs tracking-wider text-white/50 uppercase mb-2">
                {item.category}
              </p>
              <h3 className="text-lg font-serif font-medium text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                {item.teaser}
              </p>
            </Link>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-5 py-6 border-t border-white/10">
        <p className="text-xs text-white/30 text-center">
          The Lucky Trip — Conteúdo exclusivo
        </p>
      </footer>
    </div>
  );
};

export default LuckyListNeighborhood;
