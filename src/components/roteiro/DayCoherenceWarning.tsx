/**
 * DAY COHERENCE WARNING
 * 
 * Shows friendly warnings when a day has coherence issues.
 * Includes optional "Otimizar este dia" button.
 * Never blocks or forces changes.
 */

import { AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoherenceWarning } from "@/hooks/use-itinerary-coherence";

interface DayCoherenceWarningProps {
  warnings: CoherenceWarning[];
  onOptimize?: () => void;
  canOptimize: boolean;
}

export const DayCoherenceWarning = ({
  warnings,
  onOptimize,
  canOptimize,
}: DayCoherenceWarningProps) => {
  if (warnings.length === 0) return null;

  // Get the most severe warning to display
  const primaryWarning = warnings.find(w => w.severity === 'warning') || warnings[0];

  return (
    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {primaryWarning.message}
          </p>
          {warnings.length > 1 && (
            <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
              +{warnings.length - 1} {warnings.length === 2 ? 'outro aviso' : 'outros avisos'}
            </p>
          )}
        </div>
      </div>
      
      {canOptimize && onOptimize && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOptimize}
          className="mt-3 w-full h-9 text-xs border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
        >
          <Sparkles className="w-3 h-3 mr-1.5" />
          Otimizar este dia
        </Button>
      )}
    </div>
  );
};

export default DayCoherenceWarning;
