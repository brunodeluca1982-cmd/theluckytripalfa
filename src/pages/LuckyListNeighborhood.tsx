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

/** Truncate text at a word boundary near maxLen, ending with "…" */
const truncateTitle = (text: string, maxLen = 45): string => {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated) + "…";
};

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
        <section className="pt-4 pb-2 text-center">
          <h1 className="text-4xl font-serif font-semibold text-white leading-tight">
            {neighborhoodName}
          </h1>
          <p className="text-xs tracking-[0.15em] text-white/40 uppercase mt-2">The Lucky List</p>
        </section>

        {/* Progress indicator */}
        {!canAccessAll && (
          <div className="my-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-[hsl(40,60%,50%)]">
                ✦ {FREE_ITEM_COUNT} de {items.length} segredos revelados
              </p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">
                {Math.round((FREE_ITEM_COUNT / items.length) * 100)}%
              </p>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[hsl(40,60%,45%)] to-[hsl(40,70%,55%)] transition-all duration-500"
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

        {/* Locked items — blurred curiosity gap */}
        {lockedItems.length > 0 && !canAccessAll && (
          <section className="space-y-4 mt-4">
            {lockedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setLockedItem(item.title)}
                className="w-full text-left rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-[hsl(40,60%,50%)]/15 relative group"
              >
                {/* Blurred image */}
                {item.image_url && (
                  <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${item.image_url})` }}>
                    <div className="absolute inset-0 backdrop-blur-lg bg-black/50" />
                  </div>
                )}
                <div className="p-5">
                  <span className="inline-block text-[10px] tracking-[0.15em] uppercase text-[hsl(40,60%,50%)]/60 bg-[hsl(40,60%,50%)]/5 rounded-full px-2.5 py-1 mb-3">
                    {item.category}
                  </span>
                  {/* Curiosity gap — truncated title */}
                  <h3 className="text-base font-bold text-white/70 uppercase tracking-wide mb-2">
                    {truncateTitle(item.title)}
                  </h3>
                  {/* Blurred teaser */}
                  <p className="text-sm text-white/30 leading-relaxed line-clamp-2 blur-[4px] select-none">
                    {item.teaser}
                  </p>
                </div>
                {/* Unlock CTA */}
                <div className="px-5 pb-5">
                  <div className="w-full py-3 rounded-xl border border-[hsl(40,60%,50%)]/30 flex items-center justify-center gap-2 text-[hsl(40,60%,50%)] text-sm font-medium group-hover:bg-[hsl(40,60%,50%)]/10 transition-colors">
                    <Lock className="w-3.5 h-3.5" />
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
