import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { ChevronLeft, MapPin, Bed, Utensils, Compass, Sparkles, Car, Moon, Coffee, Wallet, FileText, Sun, Briefcase, Receipt, Link2, CheckSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * DESTINATION HUB — CENTERED ACTION LOCK (FINAL)
 * 
 * STRUCTURE:
 * - Full-screen hero image (100vh)
 * - Destination name + country centered near top
 * - PRIMARY BUTTONS: Centered vertically, floating over hero (5 buttons in 3+2 grid)
 * - HORIZONTAL SWIPE: Secondary modules on same screen
 * - Pagination dots for secondary swipe
 * 
 * HARD CONSTRAINTS:
 * - Buttons stay centered vertically
 * - No vertical scroll
 * - No page transitions
 * - No layout reinterpretation
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
  const [currentPage, setCurrentPage] = useState(0);
  const [showSecondary, setShowSecondary] = useState(false);
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
    <div className="fixed inset-0 overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          FULL-SCREEN HERO BACKGROUND (100vh)
          ═══════════════════════════════════════════════════════════════ */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

      {/* ═══════════════════════════════════════════════════════════════
          BACK BUTTON — Top Left
          ═══════════════════════════════════════════════════════════════ */}
      <Link 
        to="/destinos" 
        className="absolute top-12 left-6 z-30 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {/* ═══════════════════════════════════════════════════════════════
          DESTINATION TITLE — Near Top, Centered
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute top-24 left-0 right-0 z-20 flex flex-col items-center">
        <h1 className="text-5xl font-serif font-medium text-white leading-tight text-center drop-shadow-lg">
          {name}
        </h1>
        <p className="text-xs tracking-[0.3em] text-white/80 uppercase mt-3">
          {country}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PRIMARY + SECONDARY BUTTONS — CENTERED, FLOATING
          ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pb-20">
        
        {/* Horizontal Swipe Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          <div 
            className="flex" 
            style={{ width: `${(1 + SECONDARY_PAGES.length) * 100}%` }}
          >
            {/* PAGE 0: Primary Actions (5 buttons in 3+2 grid) */}
            <div 
              className="flex-shrink-0 snap-center flex flex-col items-center justify-center px-6"
              style={{ width: `${100 / (1 + SECONDARY_PAGES.length)}%` }}
            >
              {/* Row 1: 3 buttons */}
              <div className="flex justify-center gap-5 mb-5">
                {primaryActions.slice(0, 3).map((action) => (
                  <CircularButton 
                    key={action.id} 
                    icon={action.icon}
                    label={action.shortLabel}
                    path={action.path}
                  />
                ))}
              </div>
              {/* Row 2: 2 buttons (O Que Fazer + Lucky List centered) */}
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

            {/* SECONDARY PAGES */}
            {SECONDARY_PAGES.map((page, pageIndex) => (
              <div 
                key={pageIndex}
                className="flex-shrink-0 snap-center flex items-center justify-center px-6"
                style={{ width: `${100 / (1 + SECONDARY_PAGES.length)}%` }}
              >
                <div className="flex justify-center gap-4 flex-wrap max-w-xs">
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

        {/* Pagination Dots */}
        <div className="flex flex-col items-center gap-3 mt-8">
          <div className="flex gap-2">
            {[0, ...SECONDARY_PAGES.map((_, i) => i + 1)].map((index) => (
              <div 
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  index === currentPage 
                    ? 'w-6 h-2 bg-white/90' 
                    : 'w-2 h-2 bg-white/40'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-white/60 tracking-[0.2em] uppercase">
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
  const size = isLarge ? 'w-[92px] h-[92px]' : 'w-[80px] h-[80px]';
  
  return (
    <Link
      to={path}
      className={`
        flex flex-col items-center justify-center flex-shrink-0
        ${size} rounded-full
        backdrop-blur-md transition-all duration-200
        ${isSpecial 
          ? "bg-white/25 border-2 border-white/60 hover:bg-white/35 hover:scale-105 shadow-lg shadow-white/20" 
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
      className="flex flex-col items-center justify-center flex-shrink-0 w-[72px] h-[72px] rounded-full bg-white/15 border border-white/25 backdrop-blur-md hover:bg-white/25 hover:scale-105 transition-all duration-200"
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
