import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles, Play, Music } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback } from "react";
import { clearVideoSeen } from "@/pages/DestinationVideoIntro";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";
import { useEventMode } from "@/contexts/EventModeContext";
import { EventTopBanner } from "@/components/EventBanner";

/**
 * DESTINATION HUB — VERTICAL LIST LAYOUT
 *
 * Uses generic EventMode for dynamic event banners.
 * Event banner appears below title when an event is active.
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
  const { active, activate, openSheet } = useSpotifyPlayer();
  const { evento } = useEventMode();

  const handleMusicTap = useCallback(() => {
    if (!active) activate();
    else openSheet();
  }, [active, activate, openSheet]);

  const handleReplayIntro = useCallback(() => {
    clearVideoSeen(destinationId);
    navigate(`/destino/${destinationId}/intro`, { replace: true });
  }, [destinationId, navigate]);

  // Fixed order for buttons
  const orderedActions = [
    actions.find(a => a.id === 'ficar'),
    actions.find(a => a.id === 'fazer'),
    actions.find(a => a.id === 'comer'),
    actions.find(a => a.id === 'lucky-list'),
    actions.find(a => a.id === 'chegar'),
  ].filter(Boolean) as DestinationAction[];

  return (
    <div className="h-screen relative overflow-hidden pb-20">
      {/* Full-screen hero background */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "50% 20%",
          filter: evento
            ? "saturate(1.15) contrast(1.05) brightness(1)"
            : "saturate(0.9) brightness(0.85)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: evento
            ? "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))"
            : "linear-gradient(to top, rgba(0,0,0,0.35), transparent 60%)",
        }}
      />

      {/* Sepia editorial overlay — visible when no event */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[400ms]"
        style={{
          backgroundColor: "hsla(35, 30%, 20%, 0.35)",
          mixBlendMode: "color",
          opacity: evento ? 0 : 1,
        }}
      />

      {/* Header buttons */}
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

      {/* Title */}
      <div className="relative z-10 flex flex-col items-center mt-10 mb-4 px-6">
        <h1 className="text-[2.75rem] font-serif font-medium text-white leading-none text-center drop-shadow-lg tracking-tight">
          {name}
        </h1>
        <p className="text-xs tracking-[0.35em] text-white/70 uppercase mt-2">
          {country}
        </p>
      </div>

      {/* Event banner */}
      {evento && (
        <div className="relative z-20 mb-2">
          <EventTopBanner />
        </div>
      )}

      {/* Vertical button list */}
      <div className="relative z-20 px-6 flex flex-col gap-2 mt-2">
        {orderedActions.map((action) => (
          <ListButton
            key={action.id}
            icon={action.icon}
            label={action.label}
            path={action.path}
            isSpecial={action.isSpecial}
            badge={evento && action.id === 'fazer' ? evento.titulo : undefined}
          />
        ))}
      </div>
    </div>
  );
};

interface ListButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isSpecial?: boolean;
  badge?: string;
}

const ListButton = ({ icon: Icon, label, path, isSpecial, badge }: ListButtonProps) => {
  return (
    <Link
      to={path}
      className={`
        flex items-center justify-center w-full
        py-3 px-5 rounded-2xl
        backdrop-blur-md transition-all duration-200
        ${isSpecial
          ? "bg-white/25 border border-white/40 hover:bg-white/35"
          : "bg-white/20 border border-white/30 hover:bg-white/30"
        }
      `}
    >
      <span className="text-white text-base font-medium tracking-wide">
        {label}
      </span>
    </Link>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
