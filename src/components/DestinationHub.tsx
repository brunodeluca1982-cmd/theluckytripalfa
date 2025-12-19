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
          ZONE 2 — INTERACTIVE BUTTON ZONE
          Positioned below editorial header, slightly below vertical center
          Optimized for thumb reach
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute left-0 right-0 z-20 flex flex-col items-center" style={{ top: 'calc(22vh + 28px)' }}>
        
        {/* Row 1: Chegar, Ficar, Comer (3 buttons) */}
        <div className="flex justify-center gap-4 mb-4">
          {primaryActions.slice(0, 3).map((action) => (
            <CircularButton 
              key={action.id} 
              icon={action.icon}
              label={action.shortLabel}
              path={action.path}
            />
          ))}
        </div>

        {/* Row 2: Lucky List (special), Fazer (2 buttons) */}
        <div className="flex justify-center gap-5">
          {primaryActions[3] && (
            <CircularButton 
              key={primaryActions[3].id} 
              icon={primaryActions[3].icon}
              label={primaryActions[3].shortLabel}
              path={primaryActions[3].path}
              isSpecial={primaryActions[3].isSpecial}
              isLarge
            />
          )}
          {primaryActions[4] && (
            <CircularButton 
              key={primaryActions[4].id} 
              icon={primaryActions[4].icon}
              label={primaryActions[4].shortLabel}
              path={primaryActions[4].path}
            />
          )}
        </div>
      </div>

      {/* ZONE 3 — SYSTEM NAVIGATION handled by MainLayout */}
    </div>
  );
};

/**
 * Primary Circular Button — 68-74px (5-8% smaller), glass effect
 */
interface CircularButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isSpecial?: boolean;
  isLarge?: boolean;
}

const CircularButton = ({ icon: Icon, label, path, isSpecial, isLarge }: CircularButtonProps) => {
  // Reduced sizes: standard 74px (was 80), large 86px (was 92)
  const size = isLarge ? 'w-[86px] h-[86px]' : 'w-[74px] h-[74px]';
  
  return (
    <Link
      to={path}
      className={`
        flex flex-col items-center justify-center flex-shrink-0
        ${size} rounded-full
        backdrop-blur-md transition-all duration-200
        ${isSpecial 
          ? "bg-white/25 border-2 border-white/60 hover:bg-white/35 hover:scale-105 shadow-lg shadow-white/20" 
          : "bg-white/15 border border-white/30 hover:bg-white/25 hover:scale-105"
        }
      `}
    >
      <Icon className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'} text-white mb-1.5 ${isSpecial ? "drop-shadow-lg" : ""}`} />
      <span className={`text-white ${isLarge ? 'text-[10px]' : 'text-[9px]'} font-medium tracking-wide text-center px-1 leading-tight`}>
        {label}
      </span>
    </Link>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
