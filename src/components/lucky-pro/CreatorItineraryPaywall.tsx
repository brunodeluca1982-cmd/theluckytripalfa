import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Crown, ShoppingBag, MapPin, Eye, EyeOff, ChevronLeft, Music } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LuckyProPaywall from "@/components/lucky-pro/LuckyProPaywall";
import { Progress } from "@/components/ui/progress";
import { ReferenceItinerary } from "@/data/reference-itineraries";
import { useCityHero } from "@/contexts/CityHeroContext";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";

/** Premium creator IDs whose itineraries require purchase */
export const PREMIUM_CREATOR_IDS = ["bruno-de-luca", "carolina-dieckmann"];

export const isPremiumCreator = (partnerId: string): boolean =>
  PREMIUM_CREATOR_IDS.includes(partnerId);

const CREATOR_QUOTES: Record<string, string> = {
  "bruno-de-luca": "Esse é o tipo de viagem que eu faria se estivesse trazendo um amigo para conhecer o Rio.",
  "carolina-dieckmann": "São os lugares que me fazem sentir em casa toda vez que volto ao Rio.",
};

interface CreatorItineraryPaywallProps {
  partnerId: string;
  partnerName: string;
  partnerImageUrl?: string;
  itinerary?: ReferenceItinerary | null;
  children: React.ReactNode;
}

const CreatorItineraryPaywall = ({
  partnerId,
  partnerName,
  partnerImageUrl,
  itinerary,
  children,
}: CreatorItineraryPaywallProps) => {
  const { isPremium, isAuthenticated, isLoading, checkGuideAccess } = useSubscription();
  const { redirectToAuth } = useAuthRedirect();
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showLuckyPro, setShowLuckyPro] = useState(false);
  const navigate = useNavigate();
  const { heroUrl } = useCityHero();
  const { openSheet } = useSpotifyPlayer();

  const guideId = partnerId;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Premium or already purchased → show content
  if (isPremium || checkGuideAccess(guideId)) {
    return <>{children}</>;
  }

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      redirectToAuth({ type: "buy_creator_itinerary", payload: { partnerId }, returnTo: window.location.pathname });
      return;
    }
    setPurchaseLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-guide-purchase", {
        body: { guideId, guideName: `Roteiro ${partnerName}` },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Erro ao iniciar compra");
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Gather all items from itinerary for preview
  const allItems = itinerary
    ? Object.values(itinerary.days).flatMap(day => day.items)
    : [];
  const totalPlaces = allItems.length;
  const revealedCount = 2;
  const revealedItems = allItems.slice(0, revealedCount);
  const lockedCount = totalPlaces - revealedCount;
  const progressPercent = totalPlaces > 0 ? (revealedCount / totalPlaces) * 100 : 0;

  const lockedTeasers = [
    "Speakeasy escondido no Centro",
    "Restaurante que só cariocas conhecem",
    "Pôr do sol secreto em Santa Teresa",
    "Mirante escondido com vista panorâmica",
  ];

  const firstName = partnerName.split(" ")[0];
  const quote = CREATOR_QUOTES[partnerId];

  return (
    <>
      <div className="relative min-h-screen pb-24">
        {/* City hero background */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroUrl})` }}
        />
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />

        {/* Header — glass controls */}
        <header className="sticky top-0 z-30 px-5 pt-12 pb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={openSheet}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white active:scale-95 transition-transform"
            aria-label="Música"
          >
            <Music className="w-5 h-5" />
          </button>
        </header>

        {/* Partner hero section */}
        <div className="relative z-10 px-5 pb-6">
          <div className="flex flex-col items-center">
            {partnerImageUrl && (
              <div className="w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden mb-4 shadow-lg">
                <img src={partnerImageUrl} alt={partnerName} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-2xl font-serif font-medium text-white text-center leading-tight">
              {partnerName}
            </h1>
            <p className="text-sm text-white/60 text-center mt-2 max-w-xs">
              O roteiro que {firstName} faria se tivesse poucos dias na cidade.
            </p>
            {quote && (
              <blockquote className="mt-4 text-xs text-white/50 italic text-center max-w-xs border-l-2 border-white/20 pl-3">
                "{quote}"
              </blockquote>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="relative z-10 px-5 py-4">
          <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-white/70" />
                <span className="text-xs font-medium text-white/90">
                  {revealedCount} de {totalPlaces} lugares revelados
                </span>
              </div>
              <span className="text-[10px] text-white/50">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-1.5 bg-white/10 [&>div]:bg-white/70" />
          </div>
        </div>

        {/* Revealed items */}
        <div className="relative z-10 px-5 space-y-3">
          <p className="text-[10px] tracking-[0.12em] uppercase text-white/40 font-medium">
            Prévia do roteiro
          </p>
          {revealedItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white text-sm">{item.name}</h3>
                {item.editorial && (
                  <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                    {item.editorial}
                  </p>
                )}
                {item.time && (
                  <span className="inline-block mt-1 text-[10px] font-mono text-white/40 bg-white/10 px-2 py-0.5 rounded">
                    {item.time}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Locked content */}
        <div className="relative z-10 px-5 mt-6 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] tracking-[0.12em] uppercase text-white/40 font-medium">
              + {lockedCount} lugares neste roteiro
            </span>
          </div>

          {lockedTeasers.map((teaser, i) => (
            <div
              key={i}
              className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 overflow-hidden"
            >
              <div className="absolute inset-0 backdrop-blur-[6px] bg-black/30 z-10 flex items-center justify-center">
                <EyeOff className="w-4 h-4 text-white/20" />
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white/40" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">{teaser}</h3>
                  <p className="text-xs text-white/40 mt-0.5">Local exclusivo selecionado por {firstName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="relative z-10 px-5 mt-8 pb-12 space-y-3">
          <button
            onClick={handlePurchase}
            disabled={purchaseLoading}
            className="w-full py-4 rounded-full bg-white text-black font-semibold text-sm active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" />
            {purchaseLoading ? "Processando..." : `Viajar com o roteiro do ${firstName} — R$ 197`}
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-[11px] text-white/40">ou</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          <p className="text-xs text-white/50 text-center">
            Ou desbloqueie todos os roteiros com Lucky Pro
          </p>
          <button
            onClick={() => setShowLuckyPro(true)}
            className="w-full py-3.5 rounded-full border border-white/20 text-white font-medium text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 backdrop-blur-md bg-white/5"
          >
            <Crown className="w-4 h-4" />
            Desbloquear Lucky Pro
          </button>

          <p className="text-[11px] text-white/30 text-center mt-4">
            Assinantes Lucky Pro têm acesso a todos os roteiros de criadores automaticamente.
          </p>
        </div>
      </div>

      <LuckyProPaywall open={showLuckyPro} onClose={() => setShowLuckyPro(false)} />
    </>
  );
};

export default CreatorItineraryPaywall;
