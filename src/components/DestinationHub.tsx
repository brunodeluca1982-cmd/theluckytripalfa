import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles, Play, Bookmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useState, useRef } from "react";
import { clearVideoSeen } from "@/pages/DestinationVideoIntro";
import { Switch } from "@/components/ui/switch";
import { useCarnavalMode } from "@/contexts/CarnavalModeContext";
import { AnimatePresence, motion } from "framer-motion";

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

/** Play a subtle samba hit using Web Audio API */
const playSambaDrum = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(800, ctx.currentTime + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
    gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.25);

    setTimeout(() => ctx.close(), 500);
  } catch { /* audio not available */ }
};

const DestinationHub = ({ destinationId, name, country, backgroundImage, actions }: DestinationHubProps) => {
  const navigate = useNavigate();
  const { isCarnavalMode, toggleCarnavalMode } = useCarnavalMode();
  const [showActivation, setShowActivation] = useState(false);
  const [warmOverlay, setWarmOverlay] = useState(isCarnavalMode);
  const activationTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleToggle = useCallback(() => {
    const willBeOn = !isCarnavalMode;
    toggleCarnavalMode();
    if (willBeOn) {
      playSambaDrum();
      setShowActivation(true);
      setWarmOverlay(true);
      if (activationTimeout.current) clearTimeout(activationTimeout.current);
      activationTimeout.current = setTimeout(() => setShowActivation(false), 1800);
    } else {
      setShowActivation(false);
      setWarmOverlay(false);
    }
  }, [isCarnavalMode, toggleCarnavalMode]);

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
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />

      {/* Subtle warm overlay when Carnaval is active */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: "linear-gradient(135deg, hsla(35,80%,50%,0.08) 0%, hsla(20,90%,45%,0.06) 100%)",
          opacity: warmOverlay ? 1 : 0,
        }}
      />

      {/* Golden light sweep on activation */}
      <AnimatePresence>
        {showActivation && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Sweep */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(105deg, transparent 0%, hsla(42,90%,65%,0.18) 40%, hsla(38,85%,55%,0.12) 60%, transparent 100%)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {/* Centered text */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.p
                className="text-lg font-serif font-medium text-white drop-shadow-lg"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Modo Carnaval ativado
              </motion.p>
              <motion.p
                className="text-sm text-white/70 mt-1 tracking-wide"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                O Rio no seu auge
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          HEADER BUTTONS (BACK, REPLAY, SAVE)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-30 flex items-center justify-between px-4 pt-8">
        <Link 
          to="/destinos" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReplayIntro}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
            aria-label="Replay intro video"
          >
            <Play className="w-4 h-4" />
          </button>
          <button 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
            aria-label="Salvar destino"
          >
            <Bookmark className="w-4 h-4" />
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
