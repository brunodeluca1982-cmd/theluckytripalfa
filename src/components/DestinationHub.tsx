import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles, Car, Moon, Coffee, Wallet, FileText, Sun, Briefcase, Receipt, Link2, CheckSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getPartnersForDestination } from "@/data/partners-data";

/**
 * DESTINATION HUB — FINAL STRUCTURAL LOCK
 * 
 * THREE VERTICAL ZONES (LOCKED):
 * 
 * ZONE 1 — HERO IMAGE (60-65vh)
 *   • Full-width background image
 *   • Gradient overlay (top transparent → bottom rgba(0,0,0,0.30))
 *   • Centered destination name (serif) + country (small caps)
 *   • Partner avatar in lower-right corner (44-48px)
 *   • Back button
 * 
 * ZONE 2 — PRIMARY ACTIONS (FIXED)
 *   • 5 circular buttons in 3+2 grid
 *   • Row 1: Como Chegar, Onde Ficar, Onde Comer
 *   • Row 2: O Que Fazer, Lucky List (emphasized, larger)
 *   • 72-80px diameter, glass effect
 *   • MUST NOT overlap hero
 * 
 * ZONE 2B — SECONDARY MODULES (HORIZONTAL SWIPE)
 *   • Swipeable pages of secondary circular buttons
 *   • Same visual style as primary
 *   • Subtle page indicator + "Swipe to explore"
 * 
 * ZONE 3 — SYSTEM NAVIGATION (handled by MainLayout)
 */

interface DestinationAction {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  icon: LucideIcon;
  isSpecial?: boolean;
}

interface SecondaryModuleButton {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface DestinationHubProps {
  destinationId: string;
  name: string;
  country: string;
  backgroundImage: string;
  actions: DestinationAction[];
}

// Secondary modules grouped into swipeable pages
const SECONDARY_PAGES: SecondaryModuleButton[][] = [
  [
    { id: 'mover', label: 'Mover', icon: Car, path: '/mover' },
    { id: 'vida-noturna', label: 'Vida Noturna', icon: Moon, path: '/vida-noturna' },
    { id: 'sabores-locais', label: 'Sabores', icon: Coffee, path: '/sabores-locais' },
    { id: 'dinheiro', label: 'Dinheiro', icon: Wallet, path: '/dinheiro' },
  ],
  [
    { id: 'documentos-visto', label: 'Documentos', icon: FileText, path: '/documentos-visto' },
    { id: 'melhor-epoca', label: 'Melhor Época', icon: Sun, path: '/melhor-epoca' },
    { id: 'o-que-levar', label: 'O Que Levar', icon: Briefcase, path: '/o-que-levar' },
    { id: 'gastos-viagem', label: 'Gastos', icon: Receipt, path: '/gastos-viagem' },
  ],
  [
    { id: 'links-uteis', label: 'Links Úteis', icon: Link2, path: '/links-uteis' },
    { id: 'checklist-final', label: 'Checklist', icon: CheckSquare, path: '/checklist-final' },
  ],
];

const DestinationHub = ({ destinationId, name, country, backgroundImage, actions }: DestinationHubProps) => {
  const partners = getPartnersForDestination(destinationId);
  const primaryPartner = partners[0] || null;
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Primary actions (first 5)
  const primaryActions = actions.slice(0, 5);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const pageWidth = scrollRef.current.offsetWidth;
      const newPage = Math.round(scrollLeft / pageWidth);
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto relative flex flex-col bg-black">
      
      {/* ═══════════════════════════════════════════════════════════════
          ZONE 1 — HERO IMAGE (60-65vh)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative h-[62vh] flex-shrink-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {/* Gradient Overlay: top transparent → bottom rgba(0,0,0,0.30) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

        {/* Back Button - Top Left */}
        <Link 
          to="/destinos" 
          className="absolute top-12 left-6 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Centered Title Block */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-5xl font-serif font-medium text-white leading-tight text-center drop-shadow-lg">
            {name}
          </h1>
          <p className="text-xs tracking-[0.3em] text-white/80 uppercase mt-3">
            {country}
          </p>
        </div>

        {/* Partner Avatar - Lower Right Corner */}
        {primaryPartner && (
          <Link
            to={`/partner/${primaryPartner.id}/roteiro/${destinationId}`}
            className="absolute bottom-6 right-6 z-20"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/30 transition-colors overflow-hidden">
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
          </Link>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ZONE 2 — PRIMARY ACTIONS (3+2 GRID)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 bg-black/80 backdrop-blur-md py-6 px-4">
        {/* Row 1: 3 buttons */}
        <div className="flex justify-center gap-4 mb-4">
          {primaryActions.slice(0, 3).map((action) => (
            <CircularButton 
              key={action.id} 
              icon={action.icon}
              label={action.shortLabel}
              path={action.path}
            />
          ))}
        </div>
        {/* Row 2: 2 buttons (O Que Fazer + Lucky List) */}
        <div className="flex justify-center gap-6">
          {primaryActions.slice(3, 4).map((action) => (
            <CircularButton 
              key={action.id} 
              icon={action.icon}
              label={action.shortLabel}
              path={action.path}
            />
          ))}
          {primaryActions.slice(4, 5).map((action) => (
            <CircularButton 
              key={action.id} 
              icon={action.icon}
              label={action.shortLabel}
              path={action.path}
              isSpecial={action.isSpecial}
              isLarge
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ZONE 2B — SECONDARY MODULES (HORIZONTAL SWIPE)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 bg-black/60 backdrop-blur-sm pb-28">
        {/* Swipeable Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          <div className="flex" style={{ width: `${SECONDARY_PAGES.length * 100}%` }}>
            {SECONDARY_PAGES.map((page, pageIndex) => (
              <div 
                key={pageIndex}
                className="flex-shrink-0 snap-center py-6 px-4"
                style={{ width: `${100 / SECONDARY_PAGES.length}%` }}
              >
                <div className="flex justify-center gap-4 flex-wrap">
                  {page.map((module) => (
                    <SecondaryButton
                      key={module.id}
                      icon={module.icon}
                      label={module.label}
                      path={`/destino/${destinationId}${module.path}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Indicator + Swipe Text */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="flex gap-1.5">
            {SECONDARY_PAGES.map((_, index) => (
              <div 
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentPage ? 'bg-white/80 w-3' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-white/50 tracking-wider uppercase">
            Swipe to explore
          </p>
        </div>
      </div>

      {/* ZONE 3 — SYSTEM NAVIGATION handled by MainLayout */}
    </div>
  );
};

/**
 * Primary Circular Button — 72-80px, glass effect
 */
interface CircularButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isSpecial?: boolean;
  isLarge?: boolean;
}

const CircularButton = ({ icon: Icon, label, path, isSpecial, isLarge }: CircularButtonProps) => {
  const size = isLarge ? 'w-[88px] h-[88px]' : 'w-[76px] h-[76px]';
  
  return (
    <Link
      to={path}
      className={`
        flex flex-col items-center justify-center flex-shrink-0
        ${size} rounded-full
        backdrop-blur-md transition-all duration-200
        ${isSpecial 
          ? "bg-white/30 border-2 border-white/60 hover:bg-white/40 hover:scale-105 shadow-lg shadow-white/10" 
          : "bg-white/15 border border-white/30 hover:bg-white/25 hover:scale-105"
        }
      `}
    >
      <Icon className={`${isLarge ? 'w-7 h-7' : 'w-6 h-6'} text-white mb-1.5 ${isSpecial ? "drop-shadow-lg" : ""}`} />
      <span className={`text-white ${isLarge ? 'text-[11px]' : 'text-[10px]'} font-medium tracking-wide text-center px-1 leading-tight`}>
        {label}
      </span>
    </Link>
  );
};

/**
 * Secondary Circular Button — Smaller, same glass style
 */
interface SecondaryButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
}

const SecondaryButton = ({ icon: Icon, label, path }: SecondaryButtonProps) => {
  return (
    <Link
      to={path}
      className="flex flex-col items-center justify-center flex-shrink-0 w-[68px] h-[68px] rounded-full bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 hover:scale-105 transition-all duration-200"
    >
      <Icon className="w-5 h-5 text-white/90 mb-1" />
      <span className="text-white/80 text-[9px] font-medium tracking-wide text-center px-1 leading-tight">
        {label}
      </span>
    </Link>
  );
};

export default DestinationHub;

export { MapPin, Bed, Utensils, Compass, Sparkles };
