import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DESTINATION VIDEO INTRO — STRUCTURAL & UX LOCK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * LOCKED FLOW (STEP 1 OF DESTINATION JOURNEY):
 * 1. Destination click → Hero video plays (15–30s)
 * 2. Video ends → Automatic transition to destination hub
 * 3. User can skip anytime with "Pular" button
 * 
 * IMMUTABILITY RULES:
 * - Video must auto-play on entry
 * - Video must auto-advance to hub on completion
 * - Skip button must always be visible
 * - Replace history entry (no back to video from hub)
 * 
 * DO NOT MODIFY:
 * - Flow sequence (video → hub)
 * - Skip button behavior
 * - Auto-advance behavior
 * - History replacement logic
 * 
 * SCALABLE:
 * - Add video URLs to destinationVideos object for new destinations
 * - Same flow applies to ALL destinations
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface DestinationConfig {
  videoUrl: string;
  hubPath: string;
  name: string;
}

// Official destination hero videos
const destinationVideos: Record<string, DestinationConfig> = {
  "rio-de-janeiro": {
    videoUrl: "/videos/rio-hero.mp4",
    hubPath: "/destino/rio-de-janeiro",
    name: "Rio de Janeiro",
  },
  // Add more destinations here as they become available
  // "sao-paulo": { videoUrl: "...", hubPath: "/destino/sao-paulo", name: "São Paulo" },
  // "lisboa": { videoUrl: "...", hubPath: "/destino/lisboa", name: "Lisboa" },
};

const DestinationVideoIntro = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const config = id ? destinationVideos[id] : null;

  const goToHub = useCallback(() => {
    if (config) {
      // Replace current history entry so back from hub doesn't return to video
      navigate(config.hubPath, { replace: true });
    }
  }, [config, navigate]);

  const handleSkip = useCallback(() => {
    goToHub();
  }, [goToHub]);

  const handleVideoEnd = useCallback(() => {
    goToHub();
  }, [goToHub]);

  useEffect(() => {
    // If no valid destination, redirect to destinos list
    if (!config) {
      navigate("/destinos", { replace: true });
      return;
    }

    // Auto-play video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If autoplay fails (browser policy), skip to hub
        goToHub();
      });
    }
  }, [config, navigate, goToHub]);

  if (!config) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Video */}
      <video
        ref={videoRef}
        src={config.videoUrl}
        className="w-full h-full object-cover"
        muted
        playsInline
        autoPlay
        onEnded={handleVideoEnd}
      />

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Destination name */}
      <div className="absolute top-12 left-0 right-0 text-center pointer-events-none">
        <p className="text-white/70 text-sm uppercase tracking-widest mb-1">
          Descobrindo
        </p>
        <h1 className="text-white text-3xl font-serif font-medium">
          {config.name}
        </h1>
      </div>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-12 right-6 px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30 hover:bg-white/30 transition-colors"
      >
        Pular
      </button>
    </div>
  );
};

export default DestinationVideoIntro;
