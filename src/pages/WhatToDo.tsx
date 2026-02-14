import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Play, Music, Sparkles } from "lucide-react";
import { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { useCarnavalMode } from "@/contexts/CarnavalModeContext";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";
import { clearVideoSeen } from "@/pages/DestinationVideoIntro";
import blocoBackground from "@/assets/highlights/bloco2.jpg";

const actions = [
  { id: "blocos", label: "Blocos de Rua", subtitle: "só os melhores", path: "/calendario-carnaval" },
  { id: "sapucai", label: "Desfiles na Sapucaí", subtitle: "o que não te contam", path: "/desfiles-sapucai" },
  { id: "camarotes", label: "Camarotes", subtitle: "ache sua vibe", path: "/atividade/festas-carnaval?from=city" },
  { id: "festas", label: "Festas e Bailes", subtitle: "só os hypes", path: "/festas-bailes" },
  { id: "lucky-list", label: "Lucky List", subtitle: "com esquema", path: "/lucky-list", isSpecial: true },
];

const WhatToDo = () => {
  const navigate = useNavigate();
  const { isCarnavalMode, toggleCarnavalMode } = useCarnavalMode();
  const { active, activate, openSheet } = useSpotifyPlayer();

  const handleMusicTap = useCallback(() => {
    if (!active) activate();
    else openSheet();
  }, [active, activate, openSheet]);

  const handleToggle = useCallback(() => {
    toggleCarnavalMode();
  }, [toggleCarnavalMode]);

  const handleReplayIntro = useCallback(() => {
    clearVideoSeen("rio-de-janeiro");
    navigate("/destino/rio-de-janeiro/intro", { replace: true });
  }, [navigate]);

  return (
    <div className="h-screen relative overflow-hidden pb-20">
      {/* Full-screen background */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center"
        style={{
          backgroundImage: `url(${blocoBackground})`,
        }}
      />
      {/* Dark overlay for readability (25–30%) */}
      <div className="absolute inset-0 bg-black/[0.27]" />

      {/* Sepia editorial overlay — visible when Carnaval OFF */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[400ms]"
        style={{
          backgroundColor: "hsla(35, 30%, 20%, 0.35)",
          mixBlendMode: "color",
          opacity: isCarnavalMode ? 0 : 1,
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
          O Que Fazer
        </h1>
        <p className="text-xs tracking-[0.35em] text-white/70 uppercase mt-2">
          no rio
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

      {/* Buttons */}
      <div className="relative z-20 px-6 flex flex-col gap-2 mt-2">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.path}
            className={`
              flex items-center justify-between w-full
              py-3 px-5 rounded-2xl
              backdrop-blur-md transition-all duration-200
              ${action.isSpecial
                ? "bg-white/25 border border-white/40 hover:bg-white/35"
                : "bg-white/20 border border-white/30 hover:bg-white/30"
              }
            `}
          >
            <span className="text-white text-base font-medium tracking-wide">
              {action.label}
            </span>
            <span className="text-white/50 text-sm font-normal lowercase">
              {action.subtitle}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WhatToDo;
