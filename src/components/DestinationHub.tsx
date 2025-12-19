import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * DESTINATION HUB — EDITORIAL + INTERACTION LOCK (FINAL)
 * 
 * STRUCTURE:
 * 1. EDITORIAL HEADER ZONE (top 20-25%): Title + country, unobstructed
 * 2. INTERACTIVE BUTTON ZONE (center-lower): 5 buttons in 3+2 grid
 * 
 * BUTTON ORDER (LOCKED):
 * Row 1: Chegar, Ficar, Comer
 * Row 2: Lucky List, Fazer
 * 
 * HARD CONSTRAINTS:
 * - No overlap between zones
 * - No secondary modules on this screen
 * - No horizontal swipe
 * - No auto-repositioning
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

const DestinationHub = ({ destinationId, name, country, backgroundImage, actions }: DestinationHubProps) => {
  // Fixed order: Chegar, Ficar, Comer, Lucky List, Fazer
  const reorderedActions = [
    actions.find(a => a.id === 'chegar'),
    actions.find(a => a.id === 'ficar'),
    actions.find(a => a.id === 'comer'),
    actions.find(a => a.id === 'lucky-list'),
    actions.find(a => a.id === 'fazer'),
  ].filter(Boolean) as DestinationAction[];

  // Fallback to original if IDs don't match
  const primaryActions = reorderedActions.length === 5 ? reorderedActions : actions.slice(0, 5);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          FULL-SCREEN HERO BACKGROUND (100vh)
          ═══════════════════════════════════════════════════════════════ */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

      {/* ═══════════════════════════════════════════════════════════════
          BACK BUTTON — Top Left
          ═══════════════════════════════════════════════════════════════ */}
      <Link 
        to="/destinos" 
        className="absolute top-12 left-6 z-30 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {/* ═══════════════════════════════════════════════════════════════
          ZONE 1 — EDITORIAL HEADER (top 20-25% of screen)
          Destination title + country, fully unobstructed
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 z-20 h-[22vh] flex flex-col items-center justify-end pb-4">
        <h1 className="text-5xl font-serif font-medium text-white leading-tight text-center drop-shadow-lg">
          {name}
        </h1>
        <p className="text-xs tracking-[0.3em] text-white/80 uppercase mt-3">
          {country}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RADIAL BUTTON ZONE — FLOWER PATTERN (LOCKED)
          Center: Lucky List (largest)
          Surrounding: Chegar, Comer, Ficar, Fazer
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="relative w-[280px] h-[280px] pointer-events-auto">
          
          {/* CENTER — Lucky List (Main Node, Largest) */}
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

          {/* TOP RIGHT — Comer */}
          {primaryActions[2] && (
            <RadialButton 
              icon={primaryActions[2].icon}
              label={primaryActions[2].shortLabel}
              path={primaryActions[2].path}
              position="top-right"
            />
          )}

          {/* BOTTOM LEFT — Ficar */}
          {primaryActions[1] && (
            <RadialButton 
              icon={primaryActions[1].icon}
              label={primaryActions[1].shortLabel}
              path={primaryActions[1].path}
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

      {/* ZONE 3 — SYSTEM NAVIGATION handled by MainLayout */}
    </div>
  );
};

/**
 * Radial Button — Glass effect with absolute positioning for flower pattern
 */
interface RadialButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isCenter?: boolean;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const RadialButton = ({ icon: Icon, label, path, isCenter, position }: RadialButtonProps) => {
  // Center button is largest (96px), surrounding buttons are 74px
  const size = isCenter ? 'w-24 h-24' : 'w-[74px] h-[74px]';
  
  // Position offsets for flower pattern (equal distance from center)
  const positionStyles: Record<string, string> = {
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
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
          ? "bg-white/25 border-2 border-white/60 hover:bg-white/35 hover:scale-105 shadow-lg shadow-black/20" 
          : "bg-white/15 border border-white/30 hover:bg-white/25 hover:scale-105 shadow-md shadow-black/15"
        }
      `}
    >
      <Icon className={`${isCenter ? 'w-7 h-7' : 'w-5 h-5'} text-white mb-1.5 ${isCenter ? "drop-shadow-lg" : ""}`} />
      <span className={`text-white ${isCenter ? 'text-[11px]' : 'text-[9px]'} font-medium tracking-wide text-center px-1 leading-tight`}>
        {label}
      </span>
    </Link>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
