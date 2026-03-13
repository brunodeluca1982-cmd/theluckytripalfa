import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import { useLuckyList, groupByBairro } from "@/hooks/use-lucky-list";
import { LuckyListCard } from "@/components/lucky-list/LuckyListCard";
import { useCityHero } from "@/contexts/CityHeroContext";
import { useFreeLimits } from "@/hooks/use-free-limits";
import LuckyProPaywall from "@/components/lucky-pro/LuckyProPaywall";

const LuckyList = () => {
  const { data: items = [], isLoading } = useLuckyList();
  const { heroUrl } = useCityHero();
  const grouped = groupByBairro(items);
  const neighborhoods = Object.keys(grouped);
  const limits = useFreeLimits();
  const [showPaywall, setShowPaywall] = useState(false);

  // Flatten all items to enforce global 3-item free limit
  const allItems = neighborhoods.flatMap((b) => grouped[b]);
  const freeLimit = 3;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    );
  }

  // Build a set of allowed item IDs for free users
  const allowedIds = new Set(
    limits.isPremium ? allItems.map((i) => i.id) : allItems.slice(0, freeLimit).map((i) => i.id)
  );

  let globalIndex = 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroUrl})` }} />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />

      {/* Header */}
      <header className="relative z-10 px-5 pt-12 pb-4">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 px-5 pb-12">
        <section className="pt-4 pb-8">
          <h1 className="text-4xl font-serif font-semibold text-white leading-tight mb-3">
            The Lucky List
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-md">
            Os endereços que não estão nos guias turísticos. Lugares exclusivos e segredos que só os locais conhecem.
          </p>
          <p className="text-sm text-white/40 mt-2">
            {items.length} {items.length === 1 ? "experiência" : "experiências"} · {neighborhoods.length} {neighborhoods.length === 1 ? "bairro" : "bairros"}
          </p>
          {/* Usage indicator */}
          {!limits.isPremium && (
            <p className="text-xs text-[hsl(40,60%,50%)]/70 mt-3">
              {limits.usageLabel('luckyListViews')} segredos disponíveis na versão gratuita.
            </p>
          )}
        </section>

        {/* Cards grouped by neighborhood */}
        {neighborhoods.map((bairro) => (
          <section key={bairro} className="mb-8">
            <h2 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-4">
              {bairro}
            </h2>
            <div className="grid gap-4">
              {grouped[bairro].map((item) => {
                const isAllowed = allowedIds.has(item.id);
                globalIndex++;

                if (isAllowed) {
                  return <LuckyListCard key={item.id} item={item} />;
                }

                // Locked card
                return (
                  <button
                    key={item.id}
                    onClick={() => setShowPaywall(true)}
                    className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 text-left"
                  >
                    <div className="relative aspect-[16/9] bg-white/5 overflow-hidden">
                      <div className="absolute inset-0 backdrop-blur-xl bg-white/5 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white/30" />
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h3 className="text-base font-semibold text-white/40 line-clamp-1 blur-[3px]">
                        {item.nome}
                      </h3>
                      <p className="text-xs text-[hsl(40,60%,50%)]/60">
                        Desbloqueie com Lucky Pro
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-5 py-6 border-t border-white/10">
        <p className="text-xs text-white/30 text-center">The Lucky Trip — Conteúdo exclusivo</p>
      </footer>

      {/* Paywall */}
      <LuckyProPaywall
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        title="Desbloqueie o The Lucky Trip"
        message="Acesse todos os segredos da Lucky List e planeje suas viagens com curadoria real."
      />
    </div>
  );
};

export default LuckyList;
