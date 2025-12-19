import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Bus, Moon, Pizza, Wallet, FileText, Sun, Briefcase, Calculator, Link2, CheckSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SECONDARY_MODULES } from "@/data/secondary-modules-data";

/**
 * SECONDARY MODULE DETAIL — PLACEHOLDER
 * 
 * Individual secondary module content page.
 * Provides placeholder structure for each module.
 * 
 * MODULES:
 * - Mover (Como se locomover)
 * - Vida Noturna
 * - Sabores Locais
 * - Dinheiro
 * - Documentos & Visto
 * - Melhor Época
 * - O Que Levar
 * - Gastos da Viagem
 * - Links Úteis
 * - Checklist Final
 */

const MODULE_ICONS: Record<string, LucideIcon> = {
  'mover': Bus,
  'vida-noturna': Moon,
  'sabores-locais': Pizza,
  'dinheiro': Wallet,
  'documentos-visto': FileText,
  'melhor-epoca': Sun,
  'o-que-levar': Briefcase,
  'gastos-viagem': Calculator,
  'links-uteis': Link2,
  'checklist-final': CheckSquare,
};

const MODULE_DESCRIPTIONS: Record<string, string> = {
  'mover': 'Como se locomover pelo destino',
  'vida-noturna': 'Bares, clubes e entretenimento noturno',
  'sabores-locais': 'Gastronomia típica e experiências culinárias',
  'dinheiro': 'Câmbio, pagamentos e dicas financeiras',
  'documentos-visto': 'Requisitos de entrada e documentação',
  'melhor-epoca': 'Clima e temporadas ideais para visitar',
  'o-que-levar': 'Lista essencial de itens para a viagem',
  'gastos-viagem': 'Estimativas e controle de orçamento',
  'links-uteis': 'Recursos e referências importantes',
  'checklist-final': 'Verificação pré-viagem completa',
};

const DESTINATION_NAMES: Record<string, string> = {
  'rio-de-janeiro': 'Rio de Janeiro',
};

const SecondaryModuleDetail = () => {
  const { destinationId = 'rio-de-janeiro', moduleId = '' } = useParams();
  const destinationName = DESTINATION_NAMES[destinationId] || 'Destino';
  
  const module = SECONDARY_MODULES.find(m => m.route === `/${moduleId}`);
  const Icon = MODULE_ICONS[module?.id || ''] || CheckSquare;
  const description = MODULE_DESCRIPTIONS[module?.id || ''] || '';

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to={`/destino/${destinationId}/explorar`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Explorar {destinationName}
        </Link>
      </header>

      {/* Content */}
      <main className="px-6 pt-8">
        <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight mb-2">
          {module?.label || 'Módulo'}
        </h1>
        
        <p className="text-base text-muted-foreground mb-8">
          {description}
        </p>

        {/* Placeholder */}
        <div className="py-12 text-center border border-dashed border-border rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-base text-muted-foreground mb-2">
            Conteúdo em desenvolvimento
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Esta seção será preenchida com informações detalhadas sobre {module?.label?.toLowerCase() || 'este módulo'}.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border mt-8">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip • {destinationName}
        </p>
      </footer>
    </div>
  );
};

export default SecondaryModuleDetail;
