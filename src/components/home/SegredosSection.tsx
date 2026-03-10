import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, MapPin } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { luckyListItems } from "@/data/lucky-list-data";
import LuckyProPaywall from "@/components/lucky-pro/LuckyProPaywall";

/**
 * SEGREDOS QUE POUCOS CONHECEM
 * Home section showing Lucky List secrets to drive Lucky Pro conversion.
 * First 2 cards are fully visible, remaining are locked/blurred for free users.
 */

const FEATURED_IDS = [
  "por-do-sol-arpoador-sem-muvuca",
  "passeio-barco-urca",
  "jardim-botanico-criancas",
  "pista-claudio-coutinho-leitura",
  "sup-nascer-do-sol",
];

const SegredosSection = () => {
  const { isPremium } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const secrets = FEATURED_IDS
    .map(id => luckyListItems.find(item => item.id === id))
    .filter(Boolean) as typeof luckyListItems;

  const freeLimit = 2;

  return (
    <>
      <section className="py-8 px-5">
        <div className="border-t border-border mb-8" />

        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-2">
          Segredos que poucos conhecem
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Descobertas escolhidas a dedo por Bruno.
        </p>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {secrets.map((item, i) => {
            const isLocked = !isPremium && i >= freeLimit;

            if (isLocked) {
              return (
                <LockedSecretCard
                  key={item.id}
                  item={item}
                  onTap={() => setShowPaywall(true)}
                />
              );
            }

            return (
              <Link
                key={item.id}
                to={`/lucky-list/${item.id}`}
                className="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden border border-border bg-card"
              >
                <SecretCardContent item={item} />
              </Link>
            );
          })}
        </div>
      </section>

      <LuckyProPaywall open={showPaywall} onClose={() => setShowPaywall(false)} />
    </>
  );
};

interface SecretCardContentProps {
  item: typeof luckyListItems[number];
}

const SecretCardContent = ({ item }: SecretCardContentProps) => (
  <>
    <div className="relative aspect-[4/3] bg-muted">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary/30" />
        </div>
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
      {item.neighborhoodName && (
        <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          {item.neighborhoodName}
        </span>
      )}
    </div>
    <div className="px-3 py-3">
      <p className="text-foreground text-sm font-medium leading-tight line-clamp-2">
        {item.title}
      </p>
      <p className="text-muted-foreground text-[11px] mt-1 line-clamp-2">
        {item.teaser}
      </p>
    </div>
  </>
);

interface LockedSecretCardProps {
  item: typeof luckyListItems[number];
  onTap: () => void;
}

const LockedSecretCard = ({ item, onTap }: LockedSecretCardProps) => (
  <button
    onClick={onTap}
    className="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden border border-border bg-card text-left relative"
  >
    <div className="relative aspect-[4/3] bg-muted">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-[6px] scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 blur-[4px]" />
      )}
      {/* Lock badge */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1.5 rounded-full">
          <Lock className="w-3 h-3" />
          Lucky Pro
        </span>
      </div>
    </div>
    <div className="px-3 py-3">
      <p className="text-foreground text-sm font-medium leading-tight line-clamp-2 blur-[3px]">
        {item.title}
      </p>
      <p className="text-muted-foreground text-[11px] mt-1 blur-[3px]">
        {item.teaser}
      </p>
    </div>
  </button>
);

export default SegredosSection;
