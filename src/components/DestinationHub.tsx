import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles, Car, Moon, Coffee, Wallet, Shield, Calendar, Lightbulb, Map } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DESTINATION HUB — STRUCTURAL, UX & NAVIGATION LOCK (VALIDATED / FROZEN)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION LOCK — LATERAL SWIPE ONLY
 * ═══════════════════════════════════════════════════════════════════════════
 * - ONLY lateral swipe navigation allowed
 * - NO vertical scrolling
 * - NO "explore more" buttons
 * - NO new pages may be introduced
 * - All swipes MUST preserve identical layout and background
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SWIPE 1 — PRIMARY (LOCKED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. Como Chegar (top-left)
 * 2. Onde Ficar (top-right)
 * 3. Onde Comer (bottom-left)
 * 4. O Que Fazer (bottom-right)
 * 5. Lucky List (CENTER, smaller, emphasized)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SWIPE 2 — SECONDARY (LOCKED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. Mover (Como se locomover)
 * 2. Vida Noturna
 * 3. Sabores Locais
 * 4. Dinheiro
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SWIPE 3 — SUPPORT (LOCKED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. Documentos & Visto
 * 2. Melhor Época
 * 3. O Que Levar
 * 4. Links Úteis + Checklist Final (merged as "Links & Checklist")
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * IMMUTABILITY RULES — DO NOT MODIFY:
 * ═══════════════════════════════════════════════════════════════════════════
 * - Buttons MUST remain centered on screen
 * - Buttons MUST remain transparent (glass effect)
 * - NO list-based layout allowed
 * - NO additional modules allowed
 * - NO reordering of button positions
 * - NO relabeling of button text
 * - Same hero image across ALL swipes
 * - Same typography, opacity, blur treatment
 * - NO text blocks or explanations
 * - NO additional CTAs or "explore more"
 * - NO auto-reordering
 * - NO new swipes may be added
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SCALABILITY:
 * ═══════════════════════════════════════════════════════════════════════════
 * - This structure applies IDENTICALLY to ALL destinations
 * - Future destinations MUST follow this exact layout
 * - No destination-specific variations allowed
 * ═══════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════
// SWIPE 2 — MOBILITY & LIFESTYLE (LOCKED)
// ═══════════════════════════════════════════════════════════════════════════
const SWIPE_2_MODULES = [
  { id: 'mover', shortLabel: 'Mover', icon: Car, path: '/destino/rio-de-janeiro/mover' },
  { id: 'vida-noturna', shortLabel: 'Vida noturna', icon: Moon, path: '/destino/rio-de-janeiro/vida-noturna' },
  { id: 'sabores-locais', shortLabel: 'Sabores locais', icon: Coffee, path: '/destino/rio-de-janeiro/sabores-locais' },
  { id: 'dinheiro', shortLabel: 'Dinheiro', icon: Wallet, path: '/destino/rio-de-janeiro/dinheiro' },
];

// ═══════════════════════════════════════════════════════════════════════════
// SWIPE 3 — PLANNING & CLOSURE (LOCKED)
// ═══════════════════════════════════════════════════════════════════════════
const SWIPE_3_MODULES = [
  { id: 'documentos-visto', shortLabel: 'Documentos & Visto', icon: Shield, path: '/destino/rio-de-janeiro/documentos-visto' },
  { id: 'melhor-epoca', shortLabel: 'Melhor época', icon: Calendar, path: '/destino/rio-de-janeiro/melhor-epoca' },
  { id: 'o-que-levar', shortLabel: 'O que levar', icon: Lightbulb, path: '/destino/rio-de-janeiro/o-que-levar' },
  { id: 'links-checklist', shortLabel: 'Links & Checklist', icon: Map, path: '/destino/rio-de-janeiro/links-checklist' },
];

const DestinationHub = ({ destinationId, name, country, backgroundImage, actions }: DestinationHubProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Fixed order for Swipe 0: Chegar, Ficar, Comer, Lucky List (center), Fazer
  const primaryActions = {
    chegar: actions.find(a => a.id === 'chegar'),
    ficar: actions.find(a => a.id === 'ficar'),
    comer: actions.find(a => a.id === 'comer'),
    luckyList: actions.find(a => a.id === 'lucky-list'),
    fazer: actions.find(a => a.id === 'fazer'),
  };

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
          FULL-SCREEN HERO BACKGROUND (LOCKED — SAME ACROSS ALL SWIPES)
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
          HORIZONTAL SWIPE CAROUSEL (4 PAGES)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          
          {/* ═══════════════════════════════════════════════════════════
              SWIPE 0 — PRIMARY HUB (ENTRY POINT)
              Purpose: immediate decision, zero cognitive load
              ═══════════════════════════════════════════════════════════ */}
          <div className="flex-none w-full h-full flex items-center justify-center" style={{ paddingTop: '8vh' }}>
            <div className="relative w-[300px] h-[300px]">
              {/* CENTER — Lucky List (slightly smaller, curiosity trigger) */}
              {primaryActions.luckyList && (
                <RadialButton 
                  icon={primaryActions.luckyList.icon}
                  label={primaryActions.luckyList.shortLabel}
                  path={primaryActions.luckyList.path}
                  isCenter
                  position="center"
                />
              )}
              {/* TOP LEFT — Chegar */}
              {primaryActions.chegar && (
                <RadialButton 
                  icon={primaryActions.chegar.icon}
                  label={primaryActions.chegar.shortLabel}
                  path={primaryActions.chegar.path}
                  position="top-left"
                />
              )}
              {/* TOP RIGHT — Ficar */}
              {primaryActions.ficar && (
                <RadialButton 
                  icon={primaryActions.ficar.icon}
                  label={primaryActions.ficar.shortLabel}
                  path={primaryActions.ficar.path}
                  position="top-right"
                />
              )}
              {/* BOTTOM LEFT — Comer */}
              {primaryActions.comer && (
                <RadialButton 
                  icon={primaryActions.comer.icon}
                  label={primaryActions.comer.shortLabel}
                  path={primaryActions.comer.path}
                  position="bottom-left"
                />
              )}
              {/* BOTTOM RIGHT — Fazer */}
              {primaryActions.fazer && (
                <RadialButton 
                  icon={primaryActions.fazer.icon}
                  label={primaryActions.fazer.shortLabel}
                  path={primaryActions.fazer.path}
                  position="bottom-right"
                />
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SWIPE 2 — MOBILITY & LIFESTYLE (LOCKED)
              Purpose: day-to-day movement and local experience
              ═══════════════════════════════════════════════════════════ */}
          <div className="flex-none w-full h-full flex items-center justify-center" style={{ paddingTop: '8vh' }}>
            <div className="relative w-[300px] h-[300px]">
              {/* TOP LEFT — Mover */}
              <RadialButton 
                icon={SWIPE_2_MODULES[0].icon}
                label={SWIPE_2_MODULES[0].shortLabel}
                path={SWIPE_2_MODULES[0].path}
                position="top-left"
              />
              {/* TOP RIGHT — Vida noturna */}
              <RadialButton 
                icon={SWIPE_2_MODULES[1].icon}
                label={SWIPE_2_MODULES[1].shortLabel}
                path={SWIPE_2_MODULES[1].path}
                position="top-right"
              />
              {/* BOTTOM LEFT — Sabores locais */}
              <RadialButton 
                icon={SWIPE_2_MODULES[2].icon}
                label={SWIPE_2_MODULES[2].shortLabel}
                path={SWIPE_2_MODULES[2].path}
                position="bottom-left"
              />
              {/* BOTTOM RIGHT — Dinheiro */}
              <RadialButton 
                icon={SWIPE_2_MODULES[3].icon}
                label={SWIPE_2_MODULES[3].shortLabel}
                path={SWIPE_2_MODULES[3].path}
                position="bottom-right"
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SWIPE 3 — PLANNING & CLOSURE (LOCKED)
              Purpose: preparation, final checks, and travel readiness
              ═══════════════════════════════════════════════════════════ */}
          <div className="flex-none w-full h-full flex items-center justify-center" style={{ paddingTop: '8vh' }}>
            <div className="relative w-[300px] h-[300px]">
              {/* TOP LEFT — Documentos & Visto */}
              <RadialButton 
                icon={SWIPE_3_MODULES[0].icon}
                label={SWIPE_3_MODULES[0].shortLabel}
                path={SWIPE_3_MODULES[0].path}
                position="top-left"
              />
              {/* TOP RIGHT — Melhor época */}
              <RadialButton 
                icon={SWIPE_3_MODULES[1].icon}
                label={SWIPE_3_MODULES[1].shortLabel}
                path={SWIPE_3_MODULES[1].path}
                position="top-right"
              />
              {/* BOTTOM LEFT — O que levar */}
              <RadialButton 
                icon={SWIPE_3_MODULES[2].icon}
                label={SWIPE_3_MODULES[2].shortLabel}
                path={SWIPE_3_MODULES[2].path}
                position="bottom-left"
              />
              {/* BOTTOM RIGHT — Links & Checklist */}
              <RadialButton 
                icon={SWIPE_3_MODULES[3].icon}
                label={SWIPE_3_MODULES[3].shortLabel}
                path={SWIPE_3_MODULES[3].path}
                position="bottom-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PAGE INDICATORS (SUBTLE)
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
      </div>
    </div>
  );
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RADIAL BUTTON — LOCKED GLASS STYLE
 * ═══════════════════════════════════════════════════════════════════════════
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
