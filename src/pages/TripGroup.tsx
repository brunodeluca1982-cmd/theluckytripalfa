import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Users, Baby, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { cn } from "@/lib/utils";

/**
 * TRIP GROUP (Step 2: Group Composition)
 * 
 * Route: /meu-roteiro/grupo
 * 
 * Shows ONLY:
 * - Adults counter (min 1, default 1)
 * - Children counter (min 0, default 0)
 * - Age inputs for each child (if children > 0)
 * 
 * After valid input, navigates to dates step.
 */

interface ChildAgeInputProps {
  childIndex: number;
  value: number;
  onChange: (index: number, age: number) => void;
}

const ChildAgeInput = ({ childIndex, value, onChange }: ChildAgeInputProps) => {
  const [localValue, setLocalValue] = useState(String(value));
  const [hasError, setHasError] = useState(false);

  // Select all text on focus so user can type to replace
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Use setTimeout to ensure selection happens after focus
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Allow empty for typing
    if (rawValue === '') {
      setLocalValue('');
      setHasError(false);
      return;
    }
    
    // Only allow digits
    if (!/^\d*$/.test(rawValue)) {
      return;
    }
    
    // Strip leading zeros
    const stripped = rawValue.replace(/^0+/, '') || '0';
    const numValue = parseInt(stripped, 10);
    
    // Validate range 0-17
    if (numValue < 0 || numValue > 17) {
      setLocalValue(stripped);
      setHasError(true);
      return;
    }
    
    setLocalValue(stripped);
    setHasError(false);
    onChange(childIndex, numValue);
  };

  const handleBlur = () => {
    // On blur, ensure valid value
    const numValue = parseInt(localValue, 10);
    if (isNaN(numValue) || numValue < 0) {
      setLocalValue('0');
      setHasError(false);
      onChange(childIndex, 0);
    } else if (numValue > 17) {
      setLocalValue('17');
      setHasError(false);
      onChange(childIndex, 17);
    } else {
      setLocalValue(String(numValue));
      setHasError(false);
    }
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={localValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        "w-16 h-10 rounded-xl text-center",
        hasError && "border-destructive focus-visible:ring-destructive"
      )}
      aria-label={`Idade da criança ${childIndex + 1}`}
    />
  );
};

const TripGroup = () => {
  const navigate = useNavigate();
  const { draft, setAdults, setChildren, setChildAge, isDestinationSelected } = useTripDraft();

  // If no destination selected, go back to step 1
  if (!isDestinationSelected) {
    navigate('/meu-roteiro', { replace: true });
    return null;
  }

  const handleContinue = () => {
    // Navigate to dates step
    navigate('/meu-roteiro/datas');
  };

  const handleBack = () => {
    navigate('/meu-roteiro');
  };

  // Validation: at least 1 adult
  const isValid = draft.adults >= 1;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Monte seu roteiro</h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        {/* Destination summary */}
        <div className="mb-6 p-3 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground">Destino</p>
          <p className="font-semibold text-foreground">{draft.destinationName}</p>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Quem vai viajar?
          </h2>
          <p className="text-muted-foreground text-sm">
            Informe quantos viajantes vão na sua jornada.
          </p>
        </div>

        {/* Travelers section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Viajantes</h3>
          </div>

          <div className="bg-card rounded-2xl p-4 space-y-4">
            {/* Adults counter */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Adultos</p>
                <p className="text-sm text-muted-foreground">13+ anos</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setAdults(draft.adults - 1)}
                  disabled={draft.adults <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold text-lg">
                  {draft.adults}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setAdults(draft.adults + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Children counter */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="font-medium text-foreground">Crianças</p>
                <p className="text-sm text-muted-foreground">0-12 anos</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setChildren(draft.children - 1)}
                  disabled={draft.children <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold text-lg">
                  {draft.children}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setChildren(draft.children + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Children ages */}
            {draft.children > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-4 border-t border-border space-y-3"
              >
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Baby className="w-4 h-4" />
                  Idades das crianças
                </p>
                <div className="flex flex-wrap gap-2">
                  {draft.childrenAges.map((age, index) => (
                    <div key={`child-age-${index}`} className="flex items-center gap-2">
                      <ChildAgeInput
                        childIndex={index}
                        value={age}
                        onChange={setChildAge}
                      />
                      <span className="text-sm text-muted-foreground">anos</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Fixed CTA - positioned above bottom nav with safe area */}
      <div className="fixed bottom-safe-cta left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <Button
          onClick={handleContinue}
          disabled={!isValid}
          className="w-full h-14 text-lg font-semibold rounded-2xl"
        >
          Continuar
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TripGroup;
