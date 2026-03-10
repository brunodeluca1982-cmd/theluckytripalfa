import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, ArrowRight } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";

const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(30,20%,16%)] via-[hsl(30,15%,10%)] to-[hsl(30,10%,6%)]" />

      {/* Decorative particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[hsl(40,60%,50%)]/30 animate-pulse"
            style={{
              top: `${20 + Math.random() * 40}%`,
              left: `${15 + Math.random() * 70}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        {/* Crown */}
        <div className="w-20 h-20 rounded-full border-2 border-[hsl(40,60%,50%)]/40 flex items-center justify-center mb-8">
          <Crown className="w-9 h-9 text-[hsl(40,60%,50%)]" />
        </div>

        {/* Badge */}
        <span className="text-[10px] tracking-[0.2em] uppercase text-[hsl(40,60%,50%)] border border-[hsl(40,60%,50%)]/30 rounded-full px-4 py-1.5 mb-6">
          Lucky Pro
        </span>

        <h1 className="text-3xl font-serif font-semibold text-white mb-3">
          Você agora é Lucky Pro
        </h1>

        <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-10">
          O Rio de Janeiro que o Google não mostra agora está desbloqueado.
        </p>

        <button
          onClick={() => navigate("/lucky-list")}
          className="w-full max-w-xs py-4 rounded-xl bg-[hsl(40,60%,50%)] text-[hsl(30,10%,10%)] font-semibold text-base hover:bg-[hsl(40,60%,55%)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Explorar The Lucky List
          <ArrowRight className="w-4 h-4" />
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
