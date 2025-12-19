import { ChevronDown, User, Star } from "lucide-react";
import { useState } from "react";
import { ReferenceItinerary } from "@/data/reference-itineraries";

/**
 * SOURCE SELECTOR
 * 
 * Allows user to switch between reference itinerary sources.
 * The Lucky Trip curated content is always available as default.
 * Partner itineraries (like Bruno De Luca) appear as additional options.
 * 
 * RULES:
 * - Switching source does NOT affect user's draft
 * - Sources inspire, never impose
 * - No "best" or "correct" labeling
 */

interface SourceSelectorProps {
  currentSourceId: string;
  sources: Array<{
    id: string;
    label: string;
    author?: string;
    isDefault?: boolean;
  }>;
  onSourceChange: (sourceId: string) => void;
}

export const SourceSelector = ({ 
  currentSourceId, 
  sources, 
  onSourceChange 
}: SourceSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentSource = sources.find(s => s.id === currentSourceId) || sources[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-left w-full"
      >
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {currentSource.isDefault ? (
            <Star className="w-3 h-3 text-primary" />
          ) : (
            <User className="w-3 h-3 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate">
            {currentSource.label}
          </p>
          {currentSource.author && (
            <p className="text-[10px] text-muted-foreground truncate">
              por {currentSource.author}
            </p>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => {
                  onSourceChange(source.id);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center gap-2 px-3 py-2.5 w-full text-left transition-colors
                  ${source.id === currentSourceId 
                    ? 'bg-primary/5' 
                    : 'hover:bg-muted/50'
                  }
                `}
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {source.isDefault ? (
                    <Star className="w-3 h-3 text-primary" />
                  ) : (
                    <User className="w-3 h-3 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {source.label}
                  </p>
                  {source.author && (
                    <p className="text-[10px] text-muted-foreground truncate">
                      por {source.author}
                    </p>
                  )}
                </div>
                {source.id === currentSourceId && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SourceSelector;
