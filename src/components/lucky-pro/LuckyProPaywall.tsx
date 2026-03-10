import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Crown, Map, Sparkles, Download, Users, Heart } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_CONFIG, type PlanType } from "@/data/stripe-config";
import { toast } from "sonner";

interface LuckyProPaywallProps {
  open: boolean;
  onClose: () => void;
}

const FEATURES = [
  { icon: Map, label: "The Lucky List completa", desc: "127 segredos exclusivos por cidade, por bairro" },
  { icon: Sparkles, label: "Melhorar roteiro com IA", desc: "Deixe a IA refinar seu roteiro com curadoria Lucky" },
  { icon: Download, label: "Acesso offline", desc: "Leve seus roteiros para qualquer lugar sem internet" },
  { icon: Users, label: "Colaboração em tempo real", desc: "Planeje viagens em grupo sem limites" },
  { icon: Heart, label: "Salvar locais ilimitados", desc: "Monte sua lista de favoritos sem restrições" },
];

const PLANS: { key: PlanType; label: string; savings?: string }[] = [
  { key: "monthly", label: "Mensal" },
  { key: "yearly", label: "Anual", savings: "Economize 40%" },
];

const LuckyProPaywall = ({ open, onClose }: LuckyProPaywallProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSubscription();
  const navigate = useNavigate();

  if (!open) return null;

  const plan = STRIPE_CONFIG.prices[selectedPlan];
  const displayPrice = selectedPlan === "yearly"
    ? `R$ ${(plan.amount / 1200).toFixed(2).replace(".", ",")}/mês`
    : `R$ ${(plan.amount / 100).toFixed(2).replace(".", ",")}/mês`;
  const subtext = selectedPlan === "yearly"
    ? `Cobrado anualmente · R$ ${(plan.amount / 100).toFixed(2).replace(".", ",")}/ano`
    : undefined;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/perfil/assinatura");
      onClose();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: plan.id },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Erro ao iniciar pagamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,20%,18%)] via-[hsl(30,15%,12%)] to-[hsl(30,10%,8%)]" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto flex flex-col items-center px-6 pt-16 pb-8">
        {/* Crown icon */}
        <div className="w-16 h-16 rounded-full border-2 border-[hsl(40,60%,50%)] flex items-center justify-center mb-6">
          <Crown className="w-7 h-7 text-[hsl(40,60%,50%)]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-serif font-semibold text-white text-center mb-2">
          Lucky Pro
        </h1>
        <p className="text-sm text-[hsl(40,40%,65%)] text-center mb-10">
          Viaje com quem realmente conhece
        </p>

        {/* Features */}
        <div className="w-full max-w-sm space-y-5 mb-10">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <f.icon className="w-5 h-5 text-white/60 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{f.label}</p>
                <p className="text-xs text-white/50">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Plan toggle */}
        <div className="w-full max-w-sm bg-white/5 rounded-xl p-1 flex mb-6">
          {PLANS.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPlan(p.key)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all relative ${
                selectedPlan === p.key
                  ? "bg-white text-[hsl(30,10%,10%)]"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              {p.label}
              {p.savings && selectedPlan === p.key && (
                <span className="absolute -top-2 right-2 text-[10px] bg-[hsl(40,60%,50%)] text-[hsl(30,10%,10%)] px-2 py-0.5 rounded-full font-semibold">
                  {p.savings}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Price display */}
        <div className="text-center mb-2">
          <p className="text-3xl font-bold text-white">
            {displayPrice}
          </p>
          {subtext && (
            <p className="text-xs text-white/40 mt-1">{subtext}</p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full max-w-sm mt-6 py-4 rounded-xl bg-[hsl(40,60%,50%)] text-[hsl(30,10%,10%)] font-semibold text-base hover:bg-[hsl(40,60%,55%)] transition-colors disabled:opacity-50"
        >
          {loading ? "Processando..." : "Começar agora"}
        </button>

        <p className="text-[11px] text-white/30 text-center mt-3">
          7 dias grátis · Cancele quando quiser
        </p>

        <div className="flex items-center gap-2 mt-3 text-[11px] text-white/25">
          <span>Restaurar compra</span>
          <span>·</span>
          <span>Termos</span>
          <span>·</span>
          <span>Privacidade</span>
        </div>
      </div>
    </div>
  );
};

export default LuckyProPaywall;
