import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Play, Music } from "lucide-react";
import { useCallback } from "react";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";
import { useEventMode } from "@/contexts/EventModeContext";
import { EventBanner } from "@/components/EventBanner";
import { clearVideoSeen } from "@/pages/DestinationVideoIntro";
import blocoBackground from "@/assets/highlights/o-que-fazer-bg.jpeg";

const categories = [
  { id: "classico", label: "Clássico", path: "/o-que-fazer/categoria/classico" },
  { id: "praia", label: "Praia", path: "/o-que-fazer/categoria/praia" },
  { id: "cultura", label: "Cultura", path: "/o-que-fazer/categoria/cultura" },
  { id: "aventura", label: "Aventura", path: "/o-que-fazer/categoria/aventura" },
  { id: "relax", label: "Relax", path: "/o-que-fazer/categoria/relax" },
  { id: "festa", label: "Festa", path: "/o-que-fazer/categoria/festa" },
];

const WhatToDo = () => {
  const navigate = useNavigate();
  const { active, activate, openSheet } = useSpotifyPlayer();
  const { evento, getPlacement } = useEventMode();

  const handleMusicTap = useCallback(() => {
    if (!active) activate();
    else openSheet();
  }, [active, activate, openSheet]);

  const handleReplayIntro = useCallback(() => {
    clearVideoSeen("rio-de-janeiro");
    navigate("/destino/rio-de-janeiro/intro", { replace: true });
  }, [navigate]);

  const topPlacement = getPlacement("o_que_fazer_top");

  return (
    <div className="h-screen relative overflow-hidden pb-20 flex flex-col">
      {/* Full-screen background */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${blocoBackground})` }}
      />
      <div className="absolute inset-0 bg-black/[0.27]" />

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
      <div className="relative z-10 flex flex-col items-center mt-6 mb-2 px-6">
        <h1 className="text-[2.75rem] font-serif font-medium text-white leading-none text-center drop-shadow-lg tracking-tight">
          O Que Fazer
        </h1>
        <p className="text-xs tracking-[0.35em] text-white/70 uppercase mt-2">
          no rio
        </p>

        {/* Event label (shown when event is active) */}
        {evento && (
          <div className="flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
            <span className="text-xs text-white/80 font-medium">{evento.titulo}</span>
          </div>
        )}
      </div>

      {/* Sponsor placement banner */}
      {topPlacement && (
        <div className="relative z-20 px-6 mb-2">
          <div className="p-3 rounded-xl border border-white/20 backdrop-blur-md bg-white/10">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                {topPlacement.titulo && (
                  <p className="text-sm font-semibold text-white truncate">{topPlacement.titulo}</p>
                )}
                {topPlacement.subtitulo && (
                  <p className="text-xs text-white/70">{topPlacement.subtitulo}</p>
                )}
              </div>
              {topPlacement.evento_sponsors && (
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/20 text-white/80 font-medium flex-shrink-0 uppercase">
                  {topPlacement.evento_sponsors.badge_texto}
                </span>
              )}
            </div>
            {topPlacement.cta_label && topPlacement.cta_link && (
              <a
                href={topPlacement.cta_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-medium text-white/90 hover:text-white"
              >
                {topPlacement.cta_label} →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Category Buttons */}
      <div className="relative z-20 px-6 flex flex-col gap-2 mt-auto mb-auto">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.path}
            className="flex items-center justify-center w-full py-3 px-5 rounded-2xl backdrop-blur-md transition-all duration-200 bg-white/20 border border-white/30 hover:bg-white/30"
          >
            <span className="text-white text-base font-medium tracking-wide">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WhatToDo;
