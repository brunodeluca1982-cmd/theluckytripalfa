import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles, Play, Music } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback } from "react";
import { clearVideoSeen } from "@/pages/DestinationVideoIntro";
import { Switch } from "@/components/ui/switch";
import { useCarnavalMode } from "@/contexts/CarnavalModeContext";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DESTINATION HUB — VERTICAL LIST LAYOUT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Primary destination entry screen with:
 * - Full-screen hero background at top
 * - Title and subtitle
 * - Vertically stacked navigation buttons
 * - Clear, tappable buttons following iOS usability patterns
 * 
 * BUTTON ORDER (FIXED):
 * 1. Onde ficar
 * 2. Onde comer
 * 3. O que fazer
 * 4. Lucky List
 * 5. Como chegar (secondary position at bottom)
 * 
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

const DestinationHub = ({ destinationId, name, country, backgroundImage, actions }: DestinationHubProps) => {
  const navigate = useNavigate();
  const { isCarnavalMode, toggleCarnavalMode } = useCarnavalMode();
  const { active, activate, openSheet } = useSpotifyPlayer();

  const handleMusicTap = useCallback(() => {
    if (!active) {
      activate();
    } else {
      openSheet();
    }
  }, [active, activate, openSheet]);

  const handleToggle = useCallback(() => {
    toggleCarnavalMode();
  }, [toggleCarnavalMode]);

  // Fixed order for buttons: Ficar, Fazer, Comer, Lucky List, Chegar
  const orderedActions = [
    actions.find(a => a.id === 'ficar'),
    actions.find(a => a.id === 'fazer'),
    actions.find(a => a.id === 'comer'),
    actions.find(a => a.id === 'lucky-list'),
    actions.find(a => a.id === 'chegar'),
  ].filter(Boolean) as DestinationAction[];

  // Replay intro handler - clears the seen flag and navigates to intro
  const handleReplayIntro = useCallback(() => {
    clearVideoSeen(destinationId);
    navigate(`/destino/${destinationId}/intro`, { replace: true });
  }, [destinationId, navigate]);

  return (
    <div className="h-screen relative overflow-hidden pb-20">
      {/* ═══════════════════════════════════════════════════════════════
          FULL-SCREEN HERO BACKGROUND
          ═══════════════════════════════════════════════════════════════ */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed transition-[filter] duration-300"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: isCarnavalMode
            ? "saturate(1.35) contrast(1.1) brightness(1.02)"
            : "saturate(1) contrast(1) brightness(1)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

      {/* Sepia editorial overlay — visible when Carnaval OFF, removed when ON */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[400ms]"
        style={{
          backgroundColor: "hsla(35, 30%, 20%, 0.35)",
          mixBlendMode: "color",
          opacity: isCarnavalMode ? 0 : 1,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          HEADER BUTTONS (BACK, REPLAY, SAVE)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-30 flex items-center justify-end px-4 pt-8">
        <div className="w-10" />
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReplayIntro}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
            aria-label="Replay intro video"
          >
            <Play className="w-4 h-4" />
          </button>
          <button 
            onClick={handleMusicTap}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-colors"
            style={{ backgroundColor: "hsla(141, 73%, 42%, 0.25)", color: "hsla(141, 73%, 72%, 1)" }}
            aria-label="Abrir player de música"
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DESTINATION TITLE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center mt-10 mb-4 px-6">
        <h1 className="text-[2.75rem] font-serif font-medium text-white leading-none text-center drop-shadow-lg tracking-tight">
          {name}
        </h1>
        <p className="text-xs tracking-[0.35em] text-white/70 uppercase mt-2">
          {country}
        </p>

        {/* Modo Carnaval Toggle */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-sm text-white/80 font-medium">Modo Carnaval</span>
          <Switch
            checked={isCarnavalMode}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          VERTICAL BUTTON LIST
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 px-6 flex flex-col gap-2 mt-2">
        {orderedActions.map((action) => (
          <ListButton 
            key={action.id}
            icon={action.icon}
            label={action.label}
            path={action.path}
            isSpecial={action.isSpecial}
          />
        ))}
      </div>

    </div>
  );
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LIST BUTTON — HORIZONTAL STACKED STYLE
 * ═══════════════════════════════════════════════════════════════════════════
 */
interface ListButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isSpecial?: boolean;
}

const ListButton = ({ icon: Icon, label, path, isSpecial }: ListButtonProps) => {
  return (
    <Link
      to={path}
      className={`
        flex items-center gap-4 w-full
        py-3 px-5 rounded-2xl
        backdrop-blur-md transition-all duration-200
        ${isSpecial 
          ? "bg-white/25 border border-white/40 hover:bg-white/35" 
          : "bg-white/20 border border-white/30 hover:bg-white/30"
        }
      `}
    >
      <Icon className="w-5 h-5 text-white/90 flex-shrink-0" />
      <span className="text-white text-base font-medium tracking-wide">
        {label}
      </span>
    </Link>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
