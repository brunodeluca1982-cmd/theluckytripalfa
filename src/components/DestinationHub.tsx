import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin, Bed, Utensils, Compass, Sparkles, Bus, Moon, Pizza, Wallet, FileText, Sun, Briefcase, Calculator, Link2, CheckSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SCREEN_GROUPS, type SecondaryModule } from "@/data/secondary-modules-data";

/**
 * DESTINATION HUB — SWIPE NAVIGATION LOCK
 * 
 * Full-screen horizontal swipe navigation for destination exploration.
 * 
 * SCREEN MODEL:
 * - SCREEN 0 (Hub): 5 primary action buttons only
 * - SCREEN 1: Mover, Vida Noturna, Sabores Locais, Dinheiro
 * - SCREEN 2: Documentos & Visto, Melhor Época, O Que Levar, Gastos da Viagem
 * - SCREEN 3: Links Úteis, Checklist Final
 * 
 * RULES:
 * - Horizontal swipe navigates between SCREENS
 * - No vertical stacking of modules on hub
 * - Lucky List is on hub only, never in swipe screens
 * - Swipe left from Screen 1 returns to Hub
 */

interface DestinationAction {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  icon: LucideIcon;
  isSpecial?: boolean;
}

interface DestinationHubProps {
  destinationId: string;
  name: string;
  country: string;
  backgroundImage: string;
  actions: DestinationAction[];
}

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

const DestinationHub = ({ destinationId, name, country, backgroundImage, actions }: DestinationHubProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const screens = [
    { id: 'hub', label: 'Hub' },
    { id: 'A', label: 'Screen 1', modules: SCREEN_GROUPS.A },
    { id: 'B', label: 'Screen 2', modules: SCREEN_GROUPS.B },
    { id: 'C', label: 'Screen 3', modules: SCREEN_GROUPS.C },
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Split primary actions for hub layout
  const topRow = actions.slice(0, 3);
  const bottomRow = actions.slice(3, 5);

  return (
    <div className="h-screen overflow-hidden">
      {/* Swiper Container */}
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          
          {/* SCREEN 0: Primary Hub */}
          <div className="flex-[0_0_100%] min-w-0 h-full relative">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col pb-24">
              {/* Header */}
              <header className="px-6 pt-12 pb-8">
                <Link 
                  to="/destinos" 
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors mb-6"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                
                <h1 className="text-5xl font-serif font-medium text-white leading-tight">
                  {name}
                </h1>
                <p className="text-sm tracking-[0.3em] text-white/80 uppercase mt-2">
                  {country}
                </p>
              </header>

              {/* Action Buttons Grid */}
              <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-8">
                <div className="flex justify-center gap-4 mb-4">
                  {topRow.map((action) => (
                    <ActionButton key={action.id} action={action} />
                  ))}
                </div>
                <div className="flex justify-center gap-4">
                  {bottomRow.map((action) => (
                    <ActionButton key={action.id} action={action} />
                  ))}
                </div>
              </main>

              {/* Swipe Hint */}
              {canScrollNext && selectedIndex === 0 && (
                <div className="px-6 pb-28">
                  <div className="flex items-center justify-center gap-2 py-3 text-white/70 animate-pulse">
                    <span className="text-sm">Deslize para explorar</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SCREENS 1-3: Secondary Modules */}
          {screens.slice(1).map((screen) => (
            <div 
              key={screen.id}
              className="flex-[0_0_100%] min-w-0 h-full bg-background flex flex-col"
            >
              {/* Screen Header */}
              <header className="px-6 pt-12 pb-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{name}</p>
                    <h2 className="text-2xl font-serif font-medium text-foreground">
                      Explorar
                    </h2>
                  </div>
                  
                  {/* Page Indicators */}
                  <div className="flex gap-1.5">
                    {screens.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === selectedIndex 
                            ? 'w-4 bg-foreground' 
                            : 'w-1.5 bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </header>

              {/* Module Grid */}
              <main className="flex-1 overflow-y-auto px-6 py-6 pb-28">
                <div className="grid grid-cols-2 gap-4">
                  {screen.modules?.map((module) => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      destinationId={destinationId}
                    />
                  ))}
                </div>
                
                {/* Navigation Hint */}
                <div className="mt-8 text-center">
                  <p className="text-xs text-muted-foreground">
                    {selectedIndex < screens.length - 1 
                      ? "Deslize para mais →" 
                      : "← Deslize para voltar"
                    }
                  </p>
                </div>
              </main>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ action }: { action: DestinationAction }) => {
  const Icon = action.icon;
  
  return (
    <Link
      to={action.path}
      className={`
        flex flex-col items-center justify-center
        w-24 h-24 rounded-full
        backdrop-blur-md transition-all duration-200
        ${action.isSpecial 
          ? "bg-white/30 border-2 border-white/50 hover:bg-white/40 hover:scale-105" 
          : "bg-white/20 border border-white/30 hover:bg-white/30 hover:scale-105"
        }
      `}
    >
      <Icon className={`w-7 h-7 text-white mb-1.5 ${action.isSpecial ? "drop-shadow-lg" : ""}`} />
      <span className="text-white text-sm font-medium tracking-wide">
        {action.shortLabel}
      </span>
    </Link>
  );
};

interface ModuleCardProps {
  module: SecondaryModule;
  destinationId: string;
}

const ModuleCard = ({ module, destinationId }: ModuleCardProps) => {
  const Icon = MODULE_ICONS[module.id] || CheckSquare;
  
  return (
    <Link
      to={`/destino/${destinationId}/modulo${module.route}`}
      className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors aspect-square"
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <span className="text-sm font-medium text-foreground text-center">
        {module.label}
      </span>
    </Link>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
