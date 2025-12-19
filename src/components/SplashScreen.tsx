import { useEffect, useState } from "react";

/**
 * SPLASH SCREEN — THE LUCKY TRIP
 * 
 * Brand vinheta at app launch.
 * Establishes identity and emotional tone.
 * 
 * BEHAVIOR:
 * - Displays for ~2 seconds
 * - Auto-transitions to Home
 * - Not part of navigation history
 * - Cannot be revisited manually
 */

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 1.5s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1500);

    // Complete transition after animation (1.5s + 0.5s fade)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Brand Content */}
      <div
        className={`text-center transition-all duration-700 ${
          isExiting 
            ? "opacity-0 translate-y-2" 
            : "opacity-100 translate-y-0 animate-fade-in"
        }`}
      >
        <h1 className="text-4xl font-serif font-medium text-foreground mb-3">
          The Lucky Trip
        </h1>
        <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
          Inteligência Humana em Viagens
        </p>
      </div>

      {/* Subtle decorative element */}
      <div
        className={`absolute bottom-12 transition-opacity duration-500 delay-300 ${
          isExiting ? "opacity-0" : "opacity-50"
        }`}
      >
        <span className="text-xs text-muted-foreground">✦</span>
      </div>
    </div>
  );
};

export default SplashScreen;
