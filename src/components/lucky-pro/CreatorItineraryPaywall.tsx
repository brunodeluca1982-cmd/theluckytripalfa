import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Crown, ShoppingBag, Sparkles } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LuckyProPaywall from "@/components/lucky-pro/LuckyProPaywall";

/** Premium creator IDs whose itineraries require purchase */
export const PREMIUM_CREATOR_IDS = ["bruno-de-luca", "carolina-dieckmann"];

export const isPremiumCreator = (partnerId: string): boolean =>
  PREMIUM_CREATOR_IDS.includes(partnerId);

interface CreatorItineraryPaywallProps {
  partnerId: string;
  partnerName: string;
  partnerImageUrl?: string;
  children: React.ReactNode;
}

/**
 * Gates creator itinerary content.
 * Premium subscribers pass through. Otherwise checks guide purchase.
 * Falls back to a purchase screen.
 */
const CreatorItineraryPaywall = ({
  partnerId,
  partnerName,
  partnerImageUrl,
  children,
}: CreatorItineraryPaywallProps) => {
  const { isPremium, isAuthenticated, isLoading, checkGuideAccess } = useSubscription();
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showLuckyPro, setShowLuckyPro] = useState(false);
  const navigate = useNavigate();

  // Guide ID used in purchases table
  const guideId = partnerId; // e.g. "bruno-de-luca"

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
      navigate("/perfil/assinatura");
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

  return (
    <>
      <div className="min-h-screen flex flex-col relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,20%,16%)] via-[hsl(30,15%,10%)] to-[hsl(30,10%,6%)]" />

        <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-20 pb-10">
          {/* Creator avatar */}
          {partnerImageUrl && (
            <div className="w-24 h-24 rounded-full border-2 border-[hsl(40,60%,50%)]/30 overflow-hidden mb-6">
              <img
                src={partnerImageUrl}
                alt={partnerName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Lock badge */}
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-3.5 h-3.5 text-[hsl(40,60%,50%)]" />
            <span className="text-[10px] tracking-[0.15em] uppercase text-[hsl(40,60%,50%)]">
              Roteiro Premium
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-serif font-semibold text-white text-center leading-tight mb-3">
            Siga os passos de quem realmente conhece
          </h1>

          <p className="text-sm text-white/50 text-center leading-relaxed max-w-xs mb-10">
            Este roteiro foi criado a partir das experiências reais de viagem de {partnerName}.
          </p>

          {/* Itinerary preview teaser */}
          <div className="w-full max-w-sm space-y-2 mb-10">
            {["Dia 1 — Chegada e primeiras descobertas", "Dia 2 — Os segredos do bairro", "Dia 3 — Experiências únicas"].map(
              (label, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${
                    i === 0
                      ? "bg-white/5 border-white/10"
                      : "bg-white/[0.02] border-white/5 blur-[2px]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white/40">{i + 1}</span>
                  </div>
                  <p className={`text-sm ${i === 0 ? "text-white/70" : "text-white/30"}`}>
                    {label}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Purchase CTA */}
          <button
            onClick={handlePurchase}
            disabled={purchaseLoading}
            className="w-full max-w-sm py-4 rounded-xl bg-[hsl(40,60%,50%)] text-[hsl(30,10%,10%)] font-semibold text-base hover:bg-[hsl(40,60%,55%)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            {purchaseLoading ? "Processando..." : "Comprar este roteiro — R$ 197"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full max-w-sm my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] text-white/30">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Lucky Pro CTA */}
          <button
            onClick={() => setShowLuckyPro(true)}
            className="w-full max-w-sm py-3.5 rounded-xl border border-[hsl(40,60%,50%)]/30 text-[hsl(40,60%,50%)] font-medium text-sm hover:bg-[hsl(40,60%,50%)]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Desbloquear tudo com Lucky Pro
          </button>

          <p className="text-[11px] text-white/25 text-center mt-6 max-w-xs">
            Assinantes Lucky Pro têm acesso a todos os roteiros de criadores automaticamente.
          </p>
        </div>
      </div>

      <LuckyProPaywall open={showLuckyPro} onClose={() => setShowLuckyPro(false)} />
    </>
  );
};

export default CreatorItineraryPaywall;
