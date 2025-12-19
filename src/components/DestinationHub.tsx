import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getPartnersForDestination } from "@/data/partners-data";

/**
 * DESTINATION HUB — STRICT LAYOUT LOCK
 * 
 * THREE VERTICAL ZONES (FIXED):
 * 
 * ZONE 1 — HERO (fixed)
 *   • Full-width background image
 *   • Destination title
 *   • Country subtitle
 *   • Back button
 *   • ONE single circular avatar (Partner on Trip)
 *   • NOTHING else
 * 
 * ZONE 2 — PRIMARY ACTIONS (fixed)
 *   • Single horizontal carousel of translucent circular buttons
 *   • EXACTLY 5 buttons: Como Chegar, Onde Ficar, Onde Comer, O Que Fazer, Lucky List
 *   • No vertical stacking, only horizontal swipe
 *   • Lucky List visually emphasized
 * 
 * ZONE 3 — SYSTEM NAVIGATION (fixed)
 *   • Bottom navigation bar (handled by MainLayout)
 * 
 * GLOBAL RULES:
 *   • No element may float between zones
 *   • No automatic repositioning
 *   • No additional CTA text
 *   • Generous spacing and visual calm
 *   • Applies to ALL destinations
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
  // Get first partner for this destination (single avatar)
  const partners = getPartnersForDestination(destinationId);
  const primaryPartner = partners[0] || null;

  return (
    <div className="h-screen overflow-hidden relative flex flex-col">
      
      {/* ═══════════════════════════════════════════════════════════════
          ZONE 1 — HERO (FIXED)
          Full-width background, title, country, back button, ONE avatar
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative flex-1 flex flex-col">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-8">
          {/* Back Button */}
          <Link 
            to="/destinos" 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors self-start"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Title Block + Partner Avatar */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-5xl font-serif font-medium text-white leading-tight">
                {name}
              </h1>
              <p className="text-sm tracking-[0.3em] text-white/80 uppercase mt-2">
                {country}
              </p>
            </div>

            {/* Single Partner Avatar */}
            {primaryPartner && (
              <Link
                to={`/partner/${primaryPartner.id}/roteiro/${destinationId}`}
                className="flex flex-col items-center gap-1 ml-4"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                  {primaryPartner.imageUrl ? (
                    <img 
                      src={primaryPartner.imageUrl}
                      alt={primaryPartner.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-white">
                      {primaryPartner.initials}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/70 text-center">
                  {primaryPartner.name.split(" ")[0]}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ZONE 2 — PRIMARY ACTIONS (FIXED)
          Horizontal carousel of 5 buttons, no vertical stacking
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 bg-gradient-to-t from-black/80 to-transparent py-8 pb-24">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-6 min-w-min">
            {actions.map((action) => (
              <CircularButton 
                key={action.id} 
                icon={action.icon}
                label={action.shortLabel}
                path={action.path}
                isSpecial={action.isSpecial}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ZONE 3 — SYSTEM NAVIGATION
          Bottom nav bar handled by MainLayout — DO NOT TOUCH
          ═══════════════════════════════════════════════════════════════ */}
    </div>
  );
};

/**
 * Circular Button — Translucent action button
 * Lucky List receives visual emphasis via isSpecial
 */
interface CircularButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isSpecial?: boolean;
}

const CircularButton = ({ icon: Icon, label, path, isSpecial }: CircularButtonProps) => {
  return (
    <Link
      to={path}
      className={`
        flex flex-col items-center justify-center flex-shrink-0
        w-20 h-20 rounded-full
        backdrop-blur-md transition-all duration-200
        ${isSpecial 
          ? "bg-white/35 border-2 border-white/60 hover:bg-white/45 hover:scale-105" 
          : "bg-white/20 border border-white/30 hover:bg-white/30 hover:scale-105"
        }
      `}
    >
      <Icon className={`w-6 h-6 text-white mb-1 ${isSpecial ? "drop-shadow-lg" : ""}`} />
      <span className="text-white text-[10px] font-medium tracking-wide text-center px-1 leading-tight">
        {label}
      </span>
    </Link>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
