import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles, Bus, Moon, Pizza, Wallet, FileText, Sun, Briefcase, Calculator, Link2, CheckSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SCREEN_GROUPS, type SecondaryModule } from "@/data/secondary-modules-data";

/**
 * DESTINATION HUB — STRUCTURAL + NAVIGATION LOCK
 * 
 * Single container with horizontal swipe pagination.
 * All pages maintain the same hero background and circular transparent button style.
 * 
 * PAGE MODEL:
 * - PAGE 1: 5 primary buttons (Como Chegar, Onde Ficar, Onde Comer, O Que Fazer, Lucky List)
 * - PAGE 2: 4 secondary buttons (Mover, Vida Noturna, Sabores Locais, Dinheiro)
 * - PAGE 3: 4 secondary buttons (Documentos & Visto, Melhor Época, O Que Levar, Gastos da Viagem)
 * - PAGE 4: 2 secondary buttons (Links Úteis, Checklist Final)
 * 
 * RULES:
 * - Same hero background throughout all pages
 * - Same circular translucent button style
 * - No separate routes for secondary modules
 * - URL remains /destino/rio-de-janeiro
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

  // Build page structure
  const pages = [
    { id: 'primary', modules: null }, // Primary actions passed via props
    { id: 'A', modules: SCREEN_GROUPS.A },
    { id: 'B', modules: SCREEN_GROUPS.B },
    { id: 'C', modules: SCREEN_GROUPS.C },
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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

  // Split primary actions for hub layout (3 top, 2 bottom)
  const topRow = actions.slice(0, 3);
  const bottomRow = actions.slice(3, 5);

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Shared Background - persists across all pages */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

      {/* Fixed Header */}
      <header className="relative z-20 px-6 pt-12 pb-4">
        <Link 
          to="/destinos" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors mb-4"
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

      {/* Page Indicator Dots */}
      <div className="relative z-20 flex justify-center gap-2 py-4">
        {pages.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === selectedIndex 
                ? 'w-6 bg-white' 
                : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Swiper Container */}
      <div className="relative z-10 flex-1" ref={emblaRef}>
        <div className="flex h-full">
          
          {/* PAGE 1: Primary Actions */}
          <div className="flex-[0_0_100%] min-w-0 h-full flex flex-col items-center justify-center px-6 pb-32">
            {/* Top Row - 3 buttons */}
            <div className="flex justify-center gap-4 mb-4">
              {topRow.map((action) => (
                <CircularButton 
                  key={action.id} 
                  icon={action.icon}
                  label={action.shortLabel}
                  path={action.path}
                  isSpecial={action.isSpecial}
                />
              ))}
            </div>
            {/* Bottom Row - 2 buttons */}
            <div className="flex justify-center gap-4">
              {bottomRow.map((action) => (
                <CircularButton 
                  key={action.id} 
                  icon={action.icon}
                  label={action.shortLabel}
                  path={action.path}
                  isSpecial={action.isSpecial}
                />
              ))}
            </div>
          </div>

          {/* PAGES 2-4: Secondary Modules */}
          {pages.slice(1).map((page) => (
            <div 
              key={page.id}
              className="flex-[0_0_100%] min-w-0 h-full flex flex-col items-center justify-center px-6 pb-32"
            >
              <SecondaryButtonGrid 
                modules={page.modules || []} 
                destinationId={destinationId}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Swipe Hint */}
      <div className="absolute bottom-28 left-0 right-0 z-20 text-center">
        <p className="text-sm text-white/60">
          {selectedIndex < pages.length - 1 
            ? "Deslize para explorar →" 
            : "← Deslize para voltar"
          }
        </p>
      </div>
    </div>
  );
};

/**
 * Circular Button - Same style for primary and secondary actions
 */
interface CircularButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isSpecial?: boolean;
}

const CircularButton = ({ icon: Icon, label, path, isSpecial }: CircularButtonProps) => {
  return (
    <Link
      to={path}
      className={`
        flex flex-col items-center justify-center
        w-24 h-24 rounded-full
        backdrop-blur-md transition-all duration-200
        ${isSpecial 
          ? "bg-white/30 border-2 border-white/50 hover:bg-white/40 hover:scale-105" 
          : "bg-white/20 border border-white/30 hover:bg-white/30 hover:scale-105"
        }
      `}
    >
      <Icon className={`w-7 h-7 text-white mb-1.5 ${isSpecial ? "drop-shadow-lg" : ""}`} />
      <span className="text-white text-xs font-medium tracking-wide text-center px-1">
        {label}
      </span>
    </Link>
  );
};

/**
 * Secondary Button Grid - Arranges modules in 2x2 grid with circular buttons
 */
interface SecondaryButtonGridProps {
  modules: SecondaryModule[];
  destinationId: string;
}

const SecondaryButtonGrid = ({ modules, destinationId }: SecondaryButtonGridProps) => {
  // Arrange in rows of 2
  const rows: SecondaryModule[][] = [];
  for (let i = 0; i < modules.length; i += 2) {
    rows.push(modules.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-4">
          {row.map((module) => {
            const Icon = MODULE_ICONS[module.id] || CheckSquare;
            return (
              <CircularButton
                key={module.id}
                icon={Icon}
                label={module.label}
                path={`/destino/${destinationId}/modulo${module.route}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
