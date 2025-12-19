import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles, Car, Moon, Coffee, Wallet, Palette, Shield, Cloud, Lightbulb, Star, Map, Route, Calendar } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DESTINATION HUB — STRUCTURAL LOCK (FINAL)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CORE PRINCIPLE:
 * Game-like, swipe-based, calm and intuitive. No vertical scrolling.
 * 
 * LOCKED ELEMENTS (DO NOT CHANGE):
 * - Same hero image across all swipes
 * - Same typography, opacity and blur treatment
 * - Same circular, semi-transparent buttons
 * - No lists, no cards, no grids
 * - No text blocks or explanations
 * - No additional CTAs
 * - No auto-reordering
 * - No resizing except where explicitly stated
 * 
 * SWIPE STRUCTURE:
 * - Swipe 0: Primary Hub (Chegar, Ficar, Comer, Fazer + Lucky List center)
 * - Swipe 1: Living the Destination (Mover, Noite, Sabores, Dinheiro)
 * - Swipe 2: Context & Safety (Cultura, Segurança, Clima, Dicas Locais)
 * - Swipe 3: Experiences & Discovery (Experiências, Fora do Óbvio, Bate-volta, Sazonal)
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
// SWIPE 1 — Living the Destination
// ═══════════════════════════════════════════════════════════════════════════
const SWIPE_1_MODULES = [
  { id: 'mover', shortLabel: 'Mover', icon: Car, path: '/destino/rio-de-janeiro/mover' },
  { id: 'noite', shortLabel: 'Noite', icon: Moon, path: '/destino/rio-de-janeiro/noite' },
  { id: 'sabores', shortLabel: 'Sabores', icon: Coffee, path: '/destino/rio-de-janeiro/sabores' },
  { id: 'dinheiro', shortLabel: 'Dinheiro', icon: Wallet, path: '/destino/rio-de-janeiro/dinheiro' },
];

// ═══════════════════════════════════════════════════════════════════════════
// SWIPE 2 — Context & Safety
// ═══════════════════════════════════════════════════════════════════════════
const SWIPE_2_MODULES = [
  { id: 'cultura', shortLabel: 'Cultura', icon: Palette, path: '/destino/rio-de-janeiro/cultura' },
  { id: 'seguranca', shortLabel: 'Segurança', icon: Shield, path: '/destino/rio-de-janeiro/seguranca' },
  { id: 'clima', shortLabel: 'Clima', icon: Cloud, path: '/destino/rio-de-janeiro/clima' },
  { id: 'dicas-locais', shortLabel: 'Dicas Locais', icon: Lightbulb, path: '/destino/rio-de-janeiro/dicas-locais' },
];

// ═══════════════════════════════════════════════════════════════════════════
// SWIPE 3 — Experiences & Discovery
// ═══════════════════════════════════════════════════════════════════════════
const SWIPE_3_MODULES = [
  { id: 'experiencias', shortLabel: 'Experiências', icon: Star, path: '/destino/rio-de-janeiro/experiencias' },
  { id: 'fora-do-obvio', shortLabel: 'Fora do Óbvio', icon: Map, path: '/destino/rio-de-janeiro/fora-do-obvio' },
  { id: 'bate-volta', shortLabel: 'Bate-volta', icon: Route, path: '/destino/rio-de-janeiro/bate-volta' },
  { id: 'sazonal', shortLabel: 'Sazonal', icon: Calendar, path: '/destino/rio-de-janeiro/sazonal' },
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
              SWIPE 1 — LIVING THE DESTINATION
              Purpose: day-to-day experience
              ═══════════════════════════════════════════════════════════ */}
          <div className="flex-none w-full h-full flex items-center justify-center" style={{ paddingTop: '8vh' }}>
            <div className="relative w-[300px] h-[300px]">
              {/* TOP LEFT — Mover */}
              <RadialButton 
                icon={SWIPE_1_MODULES[0].icon}
                label={SWIPE_1_MODULES[0].shortLabel}
                path={SWIPE_1_MODULES[0].path}
                position="top-left"
              />
              {/* TOP RIGHT — Noite */}
              <RadialButton 
                icon={SWIPE_1_MODULES[1].icon}
                label={SWIPE_1_MODULES[1].shortLabel}
                path={SWIPE_1_MODULES[1].path}
                position="top-right"
              />
              {/* BOTTOM LEFT — Sabores */}
              <RadialButton 
                icon={SWIPE_1_MODULES[2].icon}
                label={SWIPE_1_MODULES[2].shortLabel}
                path={SWIPE_1_MODULES[2].path}
                position="bottom-left"
              />
              {/* BOTTOM RIGHT — Dinheiro */}
              <RadialButton 
                icon={SWIPE_1_MODULES[3].icon}
                label={SWIPE_1_MODULES[3].shortLabel}
                path={SWIPE_1_MODULES[3].path}
                position="bottom-right"
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SWIPE 2 — CONTEXT & SAFETY
              Purpose: reduce anxiety, increase confidence
              ═══════════════════════════════════════════════════════════ */}
          <div className="flex-none w-full h-full flex items-center justify-center" style={{ paddingTop: '8vh' }}>
            <div className="relative w-[300px] h-[300px]">
              {/* TOP LEFT — Cultura */}
              <RadialButton 
                icon={SWIPE_2_MODULES[0].icon}
                label={SWIPE_2_MODULES[0].shortLabel}
                path={SWIPE_2_MODULES[0].path}
                position="top-left"
              />
              {/* TOP RIGHT — Segurança */}
              <RadialButton 
                icon={SWIPE_2_MODULES[1].icon}
                label={SWIPE_2_MODULES[1].shortLabel}
                path={SWIPE_2_MODULES[1].path}
                position="top-right"
              />
              {/* BOTTOM LEFT — Clima */}
              <RadialButton 
                icon={SWIPE_2_MODULES[2].icon}
                label={SWIPE_2_MODULES[2].shortLabel}
                path={SWIPE_2_MODULES[2].path}
                position="bottom-left"
              />
              {/* BOTTOM RIGHT — Dicas Locais */}
              <RadialButton 
                icon={SWIPE_2_MODULES[3].icon}
                label={SWIPE_2_MODULES[3].shortLabel}
                path={SWIPE_2_MODULES[3].path}
                position="bottom-right"
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SWIPE 3 — EXPERIENCES & DISCOVERY
              Purpose: desire, differentiation, inspiration
              ═══════════════════════════════════════════════════════════ */}
          <div className="flex-none w-full h-full flex items-center justify-center" style={{ paddingTop: '8vh' }}>
            <div className="relative w-[300px] h-[300px]">
              {/* TOP LEFT — Experiências */}
              <RadialButton 
                icon={SWIPE_3_MODULES[0].icon}
                label={SWIPE_3_MODULES[0].shortLabel}
                path={SWIPE_3_MODULES[0].path}
                position="top-left"
              />
              {/* TOP RIGHT — Fora do Óbvio */}
              <RadialButton 
                icon={SWIPE_3_MODULES[1].icon}
                label={SWIPE_3_MODULES[1].shortLabel}
                path={SWIPE_3_MODULES[1].path}
                position="top-right"
              />
              {/* BOTTOM LEFT — Bate-volta */}
              <RadialButton 
                icon={SWIPE_3_MODULES[2].icon}
                label={SWIPE_3_MODULES[2].shortLabel}
                path={SWIPE_3_MODULES[2].path}
                position="bottom-left"
              />
              {/* BOTTOM RIGHT — Sazonal */}
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
