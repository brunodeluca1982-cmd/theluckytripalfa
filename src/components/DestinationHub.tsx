import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles, Car, Moon, Coffee, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

/**
 * DESTINATION HUB — FINAL LOCK
 * 
 * LOCKED ELEMENTS (DO NOT CHANGE):
 * - Button positions (diamond layout)
 * - Button sizes (78px outer, 70px center)
 * - Transparency/glass style
 * - Typography hierarchy
 * - Background image
 * 
 * NAVIGATION:
 * - Horizontal swipe reveals secondary button groups
 * - Max 5 buttons per page
 * - Same visual style across all pages
 * - No vertical scrolling
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

// Secondary modules (page 2+)
const SECONDARY_MODULES = [
  { id: 'mover', shortLabel: 'Mover', icon: Car, path: '/destino/rio-de-janeiro/mover' },
  { id: 'noite', shortLabel: 'Noite', icon: Moon, path: '/destino/rio-de-janeiro/noite' },
  { id: 'sabores', shortLabel: 'Sabores', icon: Coffee, path: '/destino/rio-de-janeiro/sabores' },
  { id: 'dinheiro', shortLabel: 'Dinheiro', icon: Wallet, path: '/destino/rio-de-janeiro/dinheiro' },
];

const DestinationHub = ({ destinationId, name, country, backgroundImage, actions }: DestinationHubProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Fixed order: Chegar, Ficar, Comer, Lucky List, Fazer
  const reorderedActions = [
    actions.find(a => a.id === 'chegar'),
    actions.find(a => a.id === 'ficar'),
    actions.find(a => a.id === 'comer'),
    actions.find(a => a.id === 'lucky-list'),
    actions.find(a => a.id === 'fazer'),
  ].filter(Boolean) as DestinationAction[];

  const primaryActions = reorderedActions.length === 5 ? reorderedActions : actions.slice(0, 5);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          FULL-SCREEN HERO BACKGROUND (LOCKED)
          ═══════════════════════════════════════════════════════════════ */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

      {/* ═══════════════════════════════════════════════════════════════
          BACK BUTTON (LOCKED)
          ═══════════════════════════════════════════════════════════════ */}
      <Link 
        to="/destinos" 
        className="absolute top-12 left-6 z-30 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {/* ═══════════════════════════════════════════════════════════════
          EDITORIAL TITLE (LOCKED)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-[18vh] left-0 right-0 z-10 flex flex-col items-center">
        <h1 className="text-[3.25rem] font-serif font-medium text-white leading-none text-center drop-shadow-lg tracking-tight">
          {name}
        </h1>
        <p className="text-[10px] tracking-[0.35em] text-white/70 uppercase mt-2.5">
          {country}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HORIZONTAL SWIPE CAROUSEL
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          
          {/* PAGE 1 — PRIMARY ACTIONS (LOCKED DIAMOND LAYOUT) */}
          <div className="flex-none w-full h-full flex items-center justify-center" style={{ paddingTop: '8vh' }}>
            <div className="relative w-[300px] h-[300px]">
              {/* CENTER — Lucky List */}
              {primaryActions[3] && (
                <RadialButton 
                  icon={primaryActions[3].icon}
                  label={primaryActions[3].shortLabel}
                  path={primaryActions[3].path}
                  isCenter
                  position="center"
                />
              )}
              {/* TOP LEFT — Chegar */}
              {primaryActions[0] && (
                <RadialButton 
                  icon={primaryActions[0].icon}
                  label={primaryActions[0].shortLabel}
                  path={primaryActions[0].path}
                  position="top-left"
                />
              )}
              {/* TOP RIGHT — Ficar */}
              {primaryActions[1] && (
                <RadialButton 
                  icon={primaryActions[1].icon}
                  label={primaryActions[1].shortLabel}
                  path={primaryActions[1].path}
                  position="top-right"
                />
              )}
              {/* BOTTOM LEFT — Comer */}
              {primaryActions[2] && (
                <RadialButton 
                  icon={primaryActions[2].icon}
                  label={primaryActions[2].shortLabel}
                  path={primaryActions[2].path}
                  position="bottom-left"
                />
              )}
              {/* BOTTOM RIGHT — Fazer */}
              {primaryActions[4] && (
                <RadialButton 
                  icon={primaryActions[4].icon}
                  label={primaryActions[4].shortLabel}
                  path={primaryActions[4].path}
                  position="bottom-right"
                />
              )}
            </div>
          </div>

          {/* PAGE 2 — SECONDARY MODULES (SAME STYLE) */}
          <div className="flex-none w-full h-full flex items-center justify-center" style={{ paddingTop: '8vh' }}>
            <div className="relative w-[300px] h-[300px]">
              {SECONDARY_MODULES[0] && (
                <RadialButton 
                  icon={SECONDARY_MODULES[0].icon}
                  label={SECONDARY_MODULES[0].shortLabel}
                  path={SECONDARY_MODULES[0].path}
                  position="top-left"
                />
              )}
              {SECONDARY_MODULES[1] && (
                <RadialButton 
                  icon={SECONDARY_MODULES[1].icon}
                  label={SECONDARY_MODULES[1].shortLabel}
                  path={SECONDARY_MODULES[1].path}
                  position="top-right"
                />
              )}
              {SECONDARY_MODULES[2] && (
                <RadialButton 
                  icon={SECONDARY_MODULES[2].icon}
                  label={SECONDARY_MODULES[2].shortLabel}
                  path={SECONDARY_MODULES[2].path}
                  position="bottom-left"
                />
              )}
              {SECONDARY_MODULES[3] && (
                <RadialButton 
                  icon={SECONDARY_MODULES[3].icon}
                  label={SECONDARY_MODULES[3].shortLabel}
                  path={SECONDARY_MODULES[3].path}
                  position="bottom-right"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE INDICATORS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-28 left-0 right-0 z-30 flex flex-col items-center gap-2">
        <div className="flex gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === selectedIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
        <p className="text-[9px] text-white/50 tracking-wider uppercase">
          {selectedIndex === 0 ? 'Swipe to explore' : 'Mais categorias'}
        </p>
      </div>
    </div>
  );
};

/**
 * Radial Button — Glass effect (LOCKED STYLE)
 */
interface RadialButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isCenter?: boolean;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const RadialButton = ({ icon: Icon, label, path, isCenter, position }: RadialButtonProps) => {
  const size = isCenter ? 'w-[70px] h-[70px]' : 'w-[78px] h-[78px]';
  
  const positionStyles: Record<string, string> = {
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-[15px] left-[15px]',
    'top-right': 'top-[15px] right-[15px]',
    'bottom-left': 'bottom-[15px] left-[15px]',
    'bottom-right': 'bottom-[15px] right-[15px]',
  };
  
  return (
    <Link
      to={path}
      className={`
        absolute flex flex-col items-center justify-center
        ${size} rounded-full
        backdrop-blur-md transition-all duration-200
        ${positionStyles[position]}
        ${isCenter 
          ? "bg-white/15 border border-white/40 hover:bg-white/25 hover:scale-105 shadow-md shadow-black/15" 
          : "bg-white/20 border border-white/40 hover:bg-white/30 hover:scale-105 shadow-md shadow-black/15"
        }
      `}
    >
      <Icon className="w-5 h-5 text-white mb-1 drop-shadow-sm" />
      <span className="text-white text-[9px] font-medium tracking-wide text-center px-1 leading-tight">
        {label}
      </span>
    </Link>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
