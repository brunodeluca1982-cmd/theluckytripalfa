import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * DESTINATION HUB — DIAMOND LAYOUT LOCK (FINAL)
 * 
 * BUTTON POSITIONS (LOCKED):
 * - TOP LEFT: Chegar
 * - TOP RIGHT: Ficar  
 * - BOTTOM LEFT: Comer
 * - BOTTOM RIGHT: Fazer
 * - CENTER: Lucky List (smaller, subtle, curiosity trigger)
 * 
 * CONSTRAINTS:
 * - All outer buttons SAME SIZE (78px)
 * - Lucky List 10% SMALLER (70px)
 * - No overlap with title/country
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
          EDITORIAL TITLE — Centered, Premium Typography
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
          DIAMOND BUTTON LAYOUT (LOCKED)
          Center: Lucky List (smaller, subtle)
          Diamond: Chegar, Ficar, Comer, Fazer (same size)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ paddingTop: '8vh' }}>
        <div className="relative w-[300px] h-[300px] pointer-events-auto">
          
          {/* CENTER — Lucky List (Smaller, Subtle, Curiosity Trigger) */}
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
  // Outer buttons: 78px (same size), Center: 70px (10% smaller, subtle)
  const size = isCenter ? 'w-[70px] h-[70px]' : 'w-[78px] h-[78px]';
  
  // Diamond position offsets with generous spacing
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
      <Icon className={`${isCenter ? 'w-5 h-5' : 'w-5 h-5'} text-white mb-1 drop-shadow-sm`} />
      <span className={`text-white text-[9px] font-medium tracking-wide text-center px-1 leading-tight`}>
        {label}
      </span>
    </Link>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
