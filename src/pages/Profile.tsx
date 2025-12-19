import { Link } from "react-router-dom";
import { BookmarkCheck, Calculator, BookOpen, CreditCard, Settings, MessageCircle } from "lucide-react";

/**
 * PROFILE — PERSONAL MANAGEMENT HUB
 * 
 * STRUCTURAL LOCK:
 * This screen is the user's personal space,
 * separate from destination exploration.
 * 
 * RESERVED MODULES (structure only, no logic):
 * 1. Meu Roteiro - saved items shortcut
 * 2. Divisão de Gastos - future split functionality
 * 3. Diário de Viagem - future memory/diary feature
 * 4. Assinatura - account/plan overview
 * 5. Configurações - account settings
 * 
 * No destination content appears here.
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
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
          Perfil
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Seu espaço pessoal
        </p>
      </header>

      {/* Profile Modules */}
      <main className="px-6">
        <div className="space-y-3">
          {profileModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                to={module.path}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-medium text-foreground">
                    {module.label}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 mt-8">
        <p className="text-xs text-muted-foreground text-center">
          The Lucky Trip
        </p>
      </footer>
    </div>
  );
};

export default Profile;
