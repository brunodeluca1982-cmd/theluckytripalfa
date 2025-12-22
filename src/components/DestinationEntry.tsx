import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Bed, Utensils, Compass, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * DESTINATION ENTRY SCREEN — STRUCTURAL + VISUAL LOCK
 * 
 * First screen user sees after selecting a destination.
 * Uses full-screen background with circular icon buttons.
 * 
 * PRIMARY ACTIONS (FIXED, EXACTLY 5):
 * 1. Como Chegar (Chegar)
 * 2. Onde Ficar (Ficar)
 * 3. Onde Comer (Comer)
 * 4. O Que Fazer (Fazer)
 * 5. Lucky List (central emphasis)
 * 
 * VISUAL REFERENCE: Circular buttons in grid layout
 * No list-based layouts. Button-centric interaction model.
 * 
 * RULES:
 * - Exists at destination level only
 * - No additional modules on this screen
 * - No editorial blocks (Meu Olhar, História, Hoje em Dia)
 * - No personalization or saved items
 * - Structure identical across all destinations
 */

interface DestinationAction {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  icon: LucideIcon;
  isSpecial?: boolean;
}

interface DestinationEntryProps {
  name: string;
  country: string;
  backgroundImage: string;
  actions: DestinationAction[];
}

const DestinationEntry = ({ name, country, backgroundImage, actions }: DestinationEntryProps) => {
  // Split actions: first 3 for top row, last 2 for bottom row (with Lucky List centered)
  const topRow = actions.slice(0, 3);
  const bottomRow = actions.slice(3, 5);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-screen background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col pb-24">
        {/* Header */}
        <header className="px-6 pt-12 pb-8">
          <Link 
            to="/destinos" 
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          
          <h1 className="text-5xl font-serif font-medium text-white leading-tight">
            {name}
          </h1>
          <p className="text-sm tracking-[0.3em] text-white/80 uppercase mt-2">
            {country}
          </p>
        </header>

        {/* Action Buttons Grid */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-8">
          {/* Top Row - 3 buttons */}
          <div className="flex justify-center gap-4 mb-4">
            {topRow.map((action) => (
              <ActionButton key={action.id} action={action} />
            ))}
          </div>
          
          {/* Bottom Row - 2 buttons centered */}
          <div className="flex justify-center gap-4">
            {bottomRow.map((action) => (
              <ActionButton key={action.id} action={action} />
            ))}
          </div>
        </main>
        
        {/* Swipe Hint - Access to Secondary Modules */}
        <div className="px-6 pb-28">
          <Link
            to="/destino/rio-de-janeiro/explorar"
            className="flex items-center justify-center gap-2 py-3 text-white/70 hover:text-white transition-colors"
          >
            <span className="text-sm">Explorar mais</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ action }: { action: DestinationAction }) => {
  const Icon = action.icon;
  
  return (
    <Link
      to={action.path}
      className={`
        flex flex-col items-center justify-center
        w-24 h-24 rounded-full
        backdrop-blur-md transition-all duration-200
        ${action.isSpecial 
          ? "bg-white/30 border-2 border-white/50 hover:bg-white/40 hover:scale-105" 
          : "bg-white/20 border border-white/30 hover:bg-white/30 hover:scale-105"
        }
      `}
    >
      <Icon className={`w-7 h-7 text-white mb-1.5 ${action.isSpecial ? "drop-shadow-lg" : ""}`} />
      <span className="text-white text-sm font-medium tracking-wide">
        {action.shortLabel}
      </span>
    </Link>
  );
};

export default DestinationEntry;

// Export icons for use in destination pages
export { MapPin, Bed, Utensils, Compass, Sparkles };
