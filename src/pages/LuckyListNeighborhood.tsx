import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import { getLuckyListByNeighborhood } from "@/data/lucky-list-data";
import { useSubscription } from "@/hooks/use-subscription";
import luckyListHero from "@/assets/highlights/lucky-list-hero.jpg";
import SecretLockedSheet from "@/components/lucky-pro/SecretLockedSheet";
import LuckyProPaywall from "@/components/lucky-pro/LuckyProPaywall";

const NEIGHBORHOOD_MAP: Record<string, string> = {
  copacabana: "Copacabana",
  ipanema: "Ipanema",
  leblon: "Leblon",
  botafogo: "Botafogo",
  flamengo: "Flamengo",
  "barra-da-tijuca": "Barra da Tijuca",
  urca: "Urca",
  "santa-teresa": "Santa Teresa",
  lapa: "Lapa",
  centro: "Centro",
  "fora-do-mapa": "Fora do Mapa",
};

const FREE_ITEM_COUNT = 2;

const LuckyListNeighborhood = () => {
  const { neighborhoodId } = useParams<{ neighborhoodId: string }>();
  const navigate = useNavigate();
  const { isPremium, isLoading } = useSubscription();
  const [lockedItem, setLockedItem] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const neighborhoodName = NEIGHBORHOOD_MAP[neighborhoodId || ""] || "Região";
  const groupedItems = getLuckyListByNeighborhood();
  const items = groupedItems[neighborhoodName] || [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-5">
        <p className="text-muted-foreground mb-4">Nenhum item encontrado nesta região.</p>
        <button onClick={() => navigate("/lucky-list")} className="text-primary underline">
          Voltar para Lucky List
        </button>
      </div>
    );
  }

  const freeItems = items.slice(0, FREE_ITEM_COUNT);
  const lockedItems = items.slice(FREE_ITEM_COUNT);
  const canAccessAll = isPremium || isLoading;

  const handleLockedTap = (title: string) => {
    setLockedItem(title);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero background */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${luckyListHero})` }} />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-[hsl(30,10%,6%)]/98 via-[hsl(30,10%,8%)]/85 to-black/50" />

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
        <section className="pt-4 pb-6 text-center">
          <h1 className="text-4xl font-serif font-semibold text-white leading-tight">
            {neighborhoodName}
          </h1>
          <p className="text-xs tracking-[0.15em] text-white/40 uppercase mt-2">The Lucky List</p>
        </section>

        {/* Progress bar */}
        {!canAccessAll && (
          <div className="mb-6 flex items-center gap-3 px-1">
            <p className="text-xs text-[hsl(40,60%,50%)]">
              ✦ {FREE_ITEM_COUNT} de {items.length} segredos disponíveis
            </p>
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[hsl(40,60%,50%)]"
                style={{ width: `${(FREE_ITEM_COUNT / items.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Free items */}
        <section className="space-y-4">
          {freeItems.map((item) => (
            <Link
              key={item.id}
              to={`/lucky-list/${item.id}`}
              className="block rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              {item.image_url && (
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }} />
              )}
              <div className="p-5">
                <span className="inline-block text-[10px] tracking-[0.15em] uppercase text-[hsl(40,60%,50%)] bg-[hsl(40,60%,50%)]/10 rounded-full px-2.5 py-1 mb-3">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{item.teaser}</p>
                <div className="mt-4 flex justify-center">
                  <span className="text-sm text-white/70 border border-white/20 rounded-full px-6 py-2">
                    Conhecer ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Locked items */}
        {lockedItems.length > 0 && !canAccessAll && (
          <section className="space-y-4 mt-4">
            {lockedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLockedTap(item.title)}
                className="w-full text-left rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-[hsl(40,60%,50%)]/20 relative"
              >
                {item.image_url && (
                  <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${item.image_url})` }}>
                    <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
                  </div>
                )}
                <div className="p-5 relative">
                  <span className="inline-block text-[10px] tracking-[0.15em] uppercase text-[hsl(40,60%,50%)] bg-[hsl(40,60%,50%)]/10 rounded-full px-2.5 py-1 mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-white uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed line-clamp-2 blur-[3px]">
                    {item.teaser}
                  </p>
                  {/* Blur overlay text */}
                  <div className="absolute inset-x-5 bottom-12 text-center">
                    <p className="text-xs text-[hsl(40,60%,50%)]/70">
                      Continue lendo com Lucky Pro. Esses endereços...
                    </p>
                  </div>
                </div>
                {/* Unlock CTA */}
                <div className="px-5 pb-5">
                  <div className="w-full py-3 rounded-xl border border-[hsl(40,60%,50%)]/40 flex items-center justify-center gap-2 text-[hsl(40,60%,50%)] text-sm font-medium">
                    <Lock className="w-4 h-4" />
                    Desbloquear
                  </div>
                </div>
              </button>
            ))}
          </section>
        )}

        {/* Premium user sees all items */}
        {canAccessAll && lockedItems.length > 0 && (
          <section className="space-y-4 mt-4">
            {lockedItems.map((item) => (
              <Link
                key={item.id}
                to={`/lucky-list/${item.id}`}
                className="block rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                {item.image_url && (
                  <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }} />
                )}
                <div className="p-5">
                  <span className="inline-block text-[10px] tracking-[0.15em] uppercase text-[hsl(40,60%,50%)] bg-[hsl(40,60%,50%)]/10 rounded-full px-2.5 py-1 mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-white uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{item.teaser}</p>
                  <div className="mt-4 flex justify-center">
                    <span className="text-sm text-white/70 border border-white/20 rounded-full px-6 py-2">
                      Conhecer ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>

      {/* Secret locked sheet */}
      <SecretLockedSheet
        open={!!lockedItem}
        onClose={() => setLockedItem(null)}
        onUnlock={() => {
          setLockedItem(null);
          setShowPaywall(true);
        }}
        itemTitle={lockedItem || undefined}
      />

      {/* Lucky Pro paywall */}
      <LuckyProPaywall open={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
};

export default LuckyListNeighborhood;
