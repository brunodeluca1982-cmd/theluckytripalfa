import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Crown, ShoppingBag, Sparkles, MapPin, Eye, EyeOff } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LuckyProPaywall from "@/components/lucky-pro/LuckyProPaywall";
import { Progress } from "@/components/ui/progress";
import { ReferenceItinerary } from "@/data/reference-itineraries";
import { Progress } from "@/components/ui/progress";
import { ReferenceItinerary } from "@/data/reference-itineraries";

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

  const guideId = partnerId;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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

  // Sample locked teasers
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
      <div className="min-h-screen flex flex-col bg-background">
        {/* Hero */}
        <div className="relative bg-gradient-to-b from-[hsl(30,20%,12%)] to-background pt-14 pb-8 px-6">
          <div className="flex flex-col items-center">
            {partnerImageUrl && (
              <div className="w-20 h-20 rounded-full border-2 border-primary/30 overflow-hidden mb-4 shadow-lg">
                <img src={partnerImageUrl} alt={partnerName} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-xl font-serif font-semibold text-foreground text-center leading-tight">
              {partnerName}
            </h1>
            <p className="text-sm text-muted-foreground text-center mt-2 max-w-xs">
              O roteiro que {firstName} faria se tivesse poucos dias na cidade.
            </p>
            {quote && (
              <blockquote className="mt-4 text-xs text-muted-foreground/70 italic text-center max-w-xs border-l-2 border-primary/30 pl-3">
                "{quote}"
              </blockquote>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">
                {revealedCount} de {totalPlaces} lugares revelados
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        {/* Revealed items */}
        <div className="px-6 space-y-3">
          <p className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground font-medium">
            Prévia do roteiro
          </p>
          {revealedItems.map((item, i) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-card border border-border flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                {item.editorial && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {item.editorial}
                  </p>
                )}
                {item.time && (
                  <span className="inline-block mt-1 text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {item.time}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Locked content */}
        <div className="px-6 mt-6 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground font-medium">
              + {lockedCount} lugares neste roteiro
            </span>
          </div>

          {lockedTeasers.map((teaser, i) => (
            <div
              key={i}
              className="relative p-4 rounded-xl bg-card/50 border border-border/50 overflow-hidden"
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-[6px] bg-background/40 z-10 flex items-center justify-center">
                <EyeOff className="w-4 h-4 text-muted-foreground/40" />
              </div>
              <div className="flex items-start gap-3 opacity-40">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm">{teaser}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Local exclusivo selecionado por {firstName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="px-6 mt-8 pb-12 space-y-3">
          {/* Primary CTA */}
          <button
            onClick={handlePurchase}
            disabled={purchaseLoading}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            {purchaseLoading ? "Processando..." : `Viajar com o roteiro do ${firstName} — R$ 197`}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Secondary CTA */}
          <p className="text-xs text-muted-foreground text-center">
            Ou desbloqueie todos os roteiros com Lucky Pro
          </p>
          <button
            onClick={() => setShowLuckyPro(true)}
            className="w-full py-3.5 rounded-xl border border-primary/30 text-primary font-medium text-sm hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Desbloquear Lucky Pro
          </button>

          <p className="text-[11px] text-muted-foreground/50 text-center mt-4">
            Assinantes Lucky Pro têm acesso a todos os roteiros de criadores automaticamente.
          </p>
        </div>
      </div>

      <LuckyProPaywall open={showLuckyPro} onClose={() => setShowLuckyPro(false)} />
    </>
  );
};

export default CreatorItineraryPaywall;
