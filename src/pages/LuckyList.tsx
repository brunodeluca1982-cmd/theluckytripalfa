import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import luckyListHero from "@/assets/highlights/lucky-list-hero.jpg";
import { useLuckyList, groupByBairro } from "@/hooks/use-lucky-list";
import { useSubscription } from "@/hooks/use-subscription";
import { PaywallGate } from "@/components/PaywallGate";

const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

const LuckyList = () => {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { data: items = [], isLoading } = useLuckyList();
  const groupedItems = groupByBairro(items);

  const neighborhoods = Object.keys(groupedItems).sort();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${luckyListHero})` }} />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />

      <header className="relative z-10 px-5 pt-12 pb-4">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      </header>

      <main className="relative z-10 flex-1 px-5 pb-12">
        <section className="pt-4 pb-10">
          <h1 className="text-4xl font-serif font-semibold text-white leading-tight mb-4">
            The Lucky List
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-md">
            Os endereços que não estão nos guias turísticos. Lugares exclusivos e segredos que só os locais (e nossos convidados) conhecem.
          </p>
        </section>

        <section className="pt-6 pb-8">
          <h2 className="text-xs tracking-[0.2em] text-white/50 uppercase mb-2">Escolha a região</h2>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            Nossos segredos estão divididos por bairro. Toque em uma área abaixo para revelar os locais exclusivos.
          </p>

          <div className="space-y-3">
            {neighborhoods.slice(0, 2).map((name) => {
              const count = groupedItems[name]?.length || 0;
              return (
                <button
                  key={name}
                  onClick={() => navigate(`/lucky-list/bairro/${slugify(name)}`)}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-[0.98]"
                >
                  <span className="text-base font-medium">{name}</span>
                  <span className="text-sm text-white/50">{count} {count === 1 ? "lugar" : "lugares"}</span>
                </button>
              );
            })}

            {neighborhoods.length > 2 && (
              <PaywallGate featureId="lucky-list">
                <div className="space-y-3">
                  {neighborhoods.slice(2).map((name) => {
                    const count = groupedItems[name]?.length || 0;
                    return (
                      <button
                        key={name}
                        onClick={() => navigate(`/lucky-list/bairro/${slugify(name)}`)}
                        className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-[0.98]"
                      >
                        <span className="text-base font-medium">{name}</span>
                        <span className="text-sm text-white/50">{count} {count === 1 ? "lugar" : "lugares"}</span>
                      </button>
                    );
                  })}
                </div>
              </PaywallGate>
            )}
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-5 py-6 border-t border-white/10">
        <p className="text-xs text-white/30 text-center">The Lucky Trip — Conteúdo exclusivo</p>
      </footer>
    </div>
  );
};

export default LuckyList;
