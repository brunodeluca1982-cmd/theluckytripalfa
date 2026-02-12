import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface HeroVideoProps {
  onEnd: () => void;
  onSkip: () => void;
  fading: boolean;
}

const HeroVideo = ({ onEnd, onSkip, fading }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [showSoundHint, setShowSoundHint] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Try unmuted autoplay first
    v.muted = false;
    v.play().then(() => {
      // Unmuted autoplay worked
      setMuted(false);
    }).catch(() => {
      // Blocked — fallback to muted autoplay
      v.muted = true;
      setMuted(true);
      setShowSoundHint(true);
      v.play().catch(() => {
        // Even muted blocked — skip
        onEnd();
      });
      // Hide hint after 3s
      setTimeout(() => setShowSoundHint(false), 3000);
    });
  }, [onEnd]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    setShowSoundHint(false);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[99] bg-black transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src="/videos/rio-hero.mp4"
        preload="auto"
        className="w-full h-full object-cover"
        playsInline
        onEnded={onEnd}
      />

      {/* Sound hint */}
      {showSoundHint && (
        <div className="absolute top-16 left-0 right-0 flex justify-center pointer-events-none animate-fade-in">
          <span className="px-4 py-2 bg-black/60 backdrop-blur-sm text-white text-sm rounded-full">
            Toque para ativar o som
          </span>
        </div>
      )}

      {/* Volume toggle — bottom left */}
      <button
        onClick={toggleMute}
        className="absolute bottom-12 left-6 p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-colors"
        aria-label={muted ? "Ativar som" : "Silenciar"}
      >
        {muted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Skip button — bottom right */}
      <button
        onClick={onSkip}
        className="absolute bottom-12 right-6 px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30 hover:bg-white/30 transition-colors"
      >
        Pular
      </button>
    </div>
  );
};

export default HeroVideo;
