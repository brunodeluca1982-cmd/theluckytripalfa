import { Link } from "react-router-dom";
import { BookmarkCheck, Calculator, BookOpen, CreditCard, Settings, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { getDestination } from "@/data/destinations-database";
import { cn } from "@/lib/utils";
import rioHeroFallback from "@/assets/highlights/rio-de-janeiro-hero.jpg";

/**
 * PROFILE — Hero/Glass redesign
 * Matches the iOS premium pattern used across the app.
 */

interface ProfileModule {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const profileModules: ProfileModule[] = [
  {
    id: "meu-roteiro",
    label: "Meu Roteiro",
    description: "Seus lugares salvos",
    icon: BookmarkCheck,
    path: "/meu-roteiro",
  },
  {
    id: "divisao-gastos",
    label: "Divisão de Gastos",
    description: "Dividir despesas de viagem",
    icon: Calculator,
    path: "/perfil/divisao-gastos",
  },
  {
    id: "diario-viagem",
    label: "Diário de Viagem",
    description: "Suas memórias e anotações",
    icon: BookOpen,
    path: "/perfil/diario",
  },
  {
    id: "assinatura",
    label: "Assinatura",
    description: "Seu plano e conta",
    icon: CreditCard,
    path: "/perfil/assinatura",
  },
  {
    id: "configuracoes",
    label: "Configurações",
    description: "Preferências e ajustes",
    icon: Settings,
    path: "/perfil/configuracoes",
  },
  {
    id: "suporte-humano",
    label: "Falar com o Concierge",
    description: "Ajuda humana personalizada",
    icon: MessageCircle,
    path: "/perfil/suporte",
  },
];

const Profile = () => {
  const { draft } = useTripDraft();
  const destination = draft.destinationId ? getDestination(draft.destinationId) : null;
  const heroImage = destination?.imageUrl || draft.destinationImageUrl || rioHeroFallback;

  return (
    <div className="relative min-h-screen pb-24">
      {/* Hero background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
      <div className="fixed inset-0 z-0 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 px-5 pt-14 pb-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-white/80" />
            <h1 className="text-2xl font-serif font-medium text-white tracking-tight">
              Perfil
            </h1>
          </div>
          <p className="text-sm text-white/60 font-light">
            Seu espaço pessoal
          </p>
        </header>

        {/* Glass card with modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 p-4 space-y-3"
        >
          {profileModules.map((module, i) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Link
                  to={module.path}
                  className="flex items-center gap-3.5 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-white/90" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{module.label}</p>
                    <p className="text-xs text-white/50 mt-0.5">{module.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <p className="text-[10px] text-white/30 text-center mt-8">
          The Lucky Trip
        </p>
      </div>
    </div>
  );
};

export default Profile;
