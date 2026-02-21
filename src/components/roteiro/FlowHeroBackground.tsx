import { ReactNode } from "react";
import rioHeroFallback from "@/assets/highlights/rio-de-janeiro-hero.jpg";

/**
 * FlowHeroBackground
 * 
 * Full-bleed hero background used across all "Monte seu roteiro" wizard steps.
 * Renders destination image with gradient overlays for text legibility.
 */
interface FlowHeroBackgroundProps {
  imageUrl?: string;
  children: ReactNode;
}

const FlowHeroBackground = ({ imageUrl, children }: FlowHeroBackgroundProps) => {
  const bgImage = imageUrl || rioHeroFallback;

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark gradient overlay — bottom-heavy for readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />

      {/* Subtle noise/blur layer */}
      <div className="fixed inset-0 z-0 backdrop-blur-[1px]" />

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default FlowHeroBackground;
