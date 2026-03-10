import { useEffect, useState } from "react";
import logoSymbol from "@/assets/brand/logo-l-correct.png";

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
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1500);

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
        className={`text-center flex flex-col items-center transition-all duration-700 ${
          isExiting 
            ? "opacity-0 translate-y-2" 
            : "opacity-100 translate-y-0 animate-fade-in"
        }`}
      >
        <img src={logoSymbol} alt="L." className="h-20 w-auto select-none" />
        {/* Brand name */}
        <span className="text-sm font-serif font-medium tracking-[0.25em] text-foreground uppercase mt-3">
          The Lucky Trip
        </span>
        {/* Brand name */}
        <span className="text-sm font-serif font-medium tracking-[0.25em] text-foreground uppercase mt-4">
          The Lucky Trip
        </span>
        <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase mt-3">
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
