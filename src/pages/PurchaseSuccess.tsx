import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { useEffect } from "react";
import { useSubscription } from "@/hooks/use-subscription";

const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top gradient area */}
      <div className="flex-1 relative flex flex-col items-center justify-center bg-gradient-to-b from-[hsl(35,50%,40%)] via-[hsl(30,40%,30%)] to-[hsl(30,10%,10%)]">
        {/* Decorative particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[hsl(40,60%,50%)]/40 animate-pulse"
              style={{
                top: `${20 + Math.random() * 40}%`,
                left: `${15 + Math.random() * 70}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Crown */}
        <div className="relative z-10 w-20 h-20 rounded-full border-2 border-[hsl(40,60%,50%)]/50 flex items-center justify-center mb-8">
          <Crown className="w-9 h-9 text-[hsl(40,60%,50%)]" />
        </div>
      </div>

      {/* Bottom content */}
      <div className="bg-[hsl(30,10%,10%)] px-6 pt-10 pb-12 flex flex-col items-center rounded-t-3xl -mt-8 relative z-10">
        {/* Badge */}
        <span className="text-[10px] tracking-[0.2em] uppercase text-[hsl(40,60%,50%)] border border-[hsl(40,60%,50%)]/30 rounded-full px-4 py-1.5 mb-6">
          Seja bem-vindo
        </span>

        <h1 className="text-3xl font-serif font-semibold text-white text-center mb-4">
          Você agora é Lucky Pro
        </h1>

        <p className="text-sm text-white/50 text-center leading-relaxed max-w-xs mb-8">
          O Rio de Janeiro que o Google não te mostra está desbloqueado. Explore os segredos do Bruno.
        </p>

        {/* Preview cards */}
        <div className="flex gap-3 mb-10">
          {[
            { label: "Speakeasy do Leblon" },
            { label: "Mirante Secreto" },
            { label: "Jazz Underground" },
          ].map((item) => (
            <div
              key={item.label}
              className="w-24 h-28 rounded-xl bg-white/10 border border-white/10 flex items-end p-2"
            >
              <p className="text-[10px] text-white/80 font-medium leading-tight">{item.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/lucky-list")}
          className="w-full max-w-sm py-4 rounded-xl bg-[hsl(40,60%,50%)] text-[hsl(30,10%,10%)] font-semibold text-base hover:bg-[hsl(40,60%,55%)] transition-colors"
        >
          Explorar The Lucky List
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-white/30 hover:text-white/50 transition-colors"
        >
          Ir para o início
        </button>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
