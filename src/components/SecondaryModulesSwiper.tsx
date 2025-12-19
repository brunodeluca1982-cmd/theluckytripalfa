import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Bus, Moon, Pizza, Wallet, FileText, Sun, Briefcase, Calculator, Link2, CheckSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SCREEN_GROUPS, type SecondaryModule } from "@/data/secondary-modules-data";

/**
 * SECONDARY MODULES SWIPER — NAVIGATION LOCK
 * 
 * Horizontal swipe navigation for secondary destination modules.
 * Accessed after the first destination screen.
 * 
 * SCREEN GROUPING (FIXED ORDER):
 * Screen 1: Mover, Vida Noturna, Sabores Locais, Dinheiro
 * Screen 2: Documentos & Visto, Melhor Época, O Que Levar, Gastos da Viagem
 * Screen 3: Links Úteis, Checklist Final
 * 
 * RULES:
 * - Swipe feels continuous and lightweight
 * - User always feels inside the same destination
 * - Back navigation returns to destination context
 * - Module order is fixed across all destinations
 */

interface SecondaryModulesProps {
  destinationId: string;
  destinationName: string;
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

const SecondaryModulesSwiper = ({ destinationId, destinationName }: SecondaryModulesProps) => {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const screens = [
    { id: 'A', modules: SCREEN_GROUPS.A },
    { id: 'B', modules: SCREEN_GROUPS.B },
    { id: 'C', modules: SCREEN_GROUPS.C },
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
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

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleBackNavigation = () => {
    navigate(`/destino/${destinationId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <button
          onClick={handleBackNavigation}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {destinationName}
        </button>
      </header>

      {/* Page Indicator */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex gap-1.5">
          {screens.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === selectedIndex 
                  ? 'w-6 bg-foreground' 
                  : 'w-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Swiper Container */}
      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {screens.map((screen) => (
            <div
              key={screen.id}
              className="flex-[0_0_100%] min-w-0 px-6 py-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {screen.modules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    destinationId={destinationId}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swipe Hint */}
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          {selectedIndex < screens.length - 1 
            ? "Deslize para explorar mais →" 
            : "← Deslize para voltar"
          }
        </p>
      </div>
    </div>
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

export default SecondaryModulesSwiper;
