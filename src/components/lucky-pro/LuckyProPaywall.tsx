import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Crown, Check } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_CONFIG, type PlanType } from "@/data/stripe-config";
import { toast } from "sonner";

interface LuckyProPaywallProps {
  open: boolean;
  onClose: () => void;
  /** Optional custom title/message */
  title?: string;
  message?: string;
}

interface PlanOption {
  key: PlanType;
  label: string;
  price: string;
  sublabel?: string;
  badge?: string;
}

const PLANS: PlanOption[] = [
  {
    key: "yearly",
    label: "Anual",
    price: "R$ 97/ano",
    sublabel: "Acesso beta durante a fase de testes",
    badge: "Plano fundador",
  },
  {
    key: "monthly",
    label: "Mensal",
    price: "R$ 29,90/mês",
  },
  {
    key: "weekly",
    label: "Semanal",
    price: "R$ 9,90/semana",
  },
];

const VALUE_PROPS = [
  "Lucky List completa",
  "IA ilimitada",
  "Viagens ilimitadas",
  "Edições ilimitadas",
  "Organização inteligente de roteiros",
];

const LuckyProPaywall = ({ open, onClose, title, message }: LuckyProPaywallProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSubscription();
  const { redirectToAuth } = useAuthRedirect();

  if (!open) return null;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      redirectToAuth({ type: "open_lucky_pro_paywall", returnTo: window.location.pathname });
      onClose();
      return;
    }

    setLoading(true);
    try {
      const plan = STRIPE_CONFIG.prices[selectedPlan];
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: plan.id },
      });
      if (error) throw error;
      if (data?.url) {
        onClose();
        window.location.href = data.url;
      }
    } catch {
      toast.error("Erro ao iniciar pagamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,20%,16%)] via-[hsl(30,15%,10%)] to-[hsl(30,10%,6%)]" />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto flex flex-col items-center px-6 pt-14 pb-8">
        {/* Crown */}
        <div className="w-16 h-16 rounded-full border-2 border-[hsl(40,60%,50%)]/40 flex items-center justify-center mb-5">
          <Crown className="w-7 h-7 text-[hsl(40,60%,50%)]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-serif font-semibold text-white text-center mb-2">
          {title || "Desbloqueie o The Lucky Trip"}
        </h1>
        <p className="text-sm text-[hsl(40,40%,65%)] text-center mb-8 max-w-xs">
          {message || "Planeje suas viagens com curadoria real e inteligência artificial."}
        </p>

        {/* Value props */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          {VALUE_PROPS.map((prop) => (
            <div key={prop} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[hsl(40,60%,50%)]/15 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-[hsl(40,60%,50%)]" />
              </div>
              <span className="text-sm text-white/80">{prop}</span>
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div className="w-full max-w-sm space-y-3 mb-6">
          {PLANS.map((p) => {
            const isSelected = selectedPlan === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setSelectedPlan(p.key)}
                className={`w-full rounded-xl border px-4 py-3.5 flex items-center gap-3 transition-all ${
                  isSelected
                    ? "border-[hsl(40,60%,50%)] bg-[hsl(40,60%,50%)]/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/5"
                }`}
              >
                {/* Radio */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? "border-[hsl(40,60%,50%)] bg-[hsl(40,60%,50%)]"
                      : "border-white/20"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-[hsl(30,10%,10%)]" />}
                </div>

                {/* Label + price */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isSelected ? "text-white" : "text-white/70"}`}>
                      {p.label}
                    </span>
                    {p.badge && (
                      <span className="text-[10px] font-semibold bg-[hsl(40,60%,50%)] text-[hsl(30,10%,10%)] px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  {p.sublabel && (
                    <p className="text-[11px] text-[hsl(40,60%,50%)]/60 mt-0.5">{p.sublabel}</p>
                  )}
                </div>

                {/* Price */}
                <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-white/50"}`}>
                  {p.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full max-w-sm py-4 rounded-xl bg-[hsl(40,60%,50%)] text-[hsl(30,10%,10%)] font-semibold text-base hover:bg-[hsl(40,60%,55%)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "Processando..." : "Entrar para o Lucky Trip"}
        </button>

        <button
          onClick={() => {
            onClose();
          }}
          className="w-full max-w-sm text-center text-xs text-white/40 mt-3 py-2"
        >
          Ver planos
        </button>

        <p className="text-[11px] text-white/30 text-center mt-2">
          Cancele quando quiser.
        </p>

        <div className="flex items-center gap-2 mt-4 text-[11px] text-white/20">
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
