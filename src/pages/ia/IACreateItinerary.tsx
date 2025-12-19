import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Palmtree, Utensils, Landmark, Shuffle, ArrowRight, Users, Star, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { curators, getCuratorsForDestination, getPrimaryCurator, Curator } from "@/data/curator-system";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CREATE ITINERARY — AI DRAFT GENERATOR WITH CURATOR SELECTION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE:
 * - Select which curators to use as sources
 * - Generate a draft itinerary mixing human curators
 * - Auto-save to "My Itinerary"
 * 
 * CURATOR RULES:
 * - Bruno De Luca has editorial priority by default
 * - Partners complement, never override Bruno
 * - "Surprise me" = balanced mix
 * 
 * MIXING RULES:
 * - Avoid style mismatch in same day
 * - Avoid duplicate experiences
 * - Respect geographic logic
 * ═══════════════════════════════════════════════════════════════════════════
 */

type TravelStyle = "relaxed" | "cultural" | "food" | "mix";

const travelStyles: { id: TravelStyle; label: string; icon: React.ElementType; description: string }[] = [
  { id: "relaxed", label: "Relaxed", icon: Palmtree, description: "Beach, calm, slow pace" },
  { id: "cultural", label: "Cultural", icon: Landmark, description: "Museums, history, art" },
  { id: "food", label: "Food", icon: Utensils, description: "Restaurants, local flavors" },
  { id: "mix", label: "Mix", icon: Shuffle, description: "A bit of everything" },
];

const IACreateItinerary = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"sources" | "style" | "days" | "generating" | "done">("sources");
  const [selectedCurators, setSelectedCurators] = useState<string[]>([]);
  const [surpriseMe, setSurpriseMe] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<TravelStyle | null>(null);
  const [days, setDays] = useState(3);

  const destinationId = "rio-de-janeiro";
  const availableCurators = getCuratorsForDestination(destinationId);
  const primaryCurator = getPrimaryCurator();

  const toggleCurator = (curatorId: string) => {
    setSurpriseMe(false);
    setSelectedCurators(prev => 
      prev.includes(curatorId) 
        ? prev.filter(id => id !== curatorId)
        : [...prev, curatorId]
    );
  };

  const handleSurpriseMe = () => {
    setSurpriseMe(true);
    setSelectedCurators([]);
  };

  const canProceedFromSources = surpriseMe || selectedCurators.length > 0;

  const handleGenerate = () => {
    setStep("generating");
    // Simulate generation
    setTimeout(() => {
      setStep("done");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-border">
        <Link 
          to="/ia" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-xl font-serif font-medium text-foreground">
          Create my itinerary
        </h1>
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-2">
          Rio de Janeiro
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        
        {/* STEP 0 — SOURCE SELECTION (NEW) */}
        {step === "sources" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg text-foreground/80 font-light">
                Choose your sources
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Select curators to inspire your itinerary
              </p>
            </div>

            {/* Surprise Me Option */}
            <button
              onClick={handleSurpriseMe}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border transition-all
                ${surpriseMe 
                  ? "bg-primary/10 border-primary" 
                  : "bg-card border-border hover:bg-muted"
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${surpriseMe ? "bg-primary/20" : "bg-muted"}
              `}>
                <Shuffle className={`w-5 h-5 ${surpriseMe ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-foreground">Surprise me</p>
                <p className="text-sm text-muted-foreground">Balanced mix of all curators</p>
              </div>
              {surpriseMe && <Check className="w-5 h-5 text-primary" />}
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">or select</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Curator List */}
            <div className="space-y-3">
              {availableCurators.map((curator) => (
                <CuratorOption
                  key={curator.id}
                  curator={curator}
                  isSelected={selectedCurators.includes(curator.id)}
                  isPrimary={curator.role === 'primary'}
                  onToggle={() => toggleCurator(curator.id)}
                />
              ))}
            </div>

            <Button
              onClick={() => setStep("style")}
              disabled={!canProceedFromSources}
              className="w-full mt-6"
              size="lg"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 1 — TRAVEL STYLE */}
        {step === "style" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg text-foreground/80 font-light">
                What's your travel style?
              </p>
            </div>

            <div className="space-y-3">
              {travelStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl border transition-all
                    ${selectedStyle === style.id 
                      ? "bg-primary/10 border-primary" 
                      : "bg-card border-border hover:bg-muted"
                    }
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${selectedStyle === style.id ? "bg-primary/20" : "bg-muted"}
                  `}>
                    <style.icon className={`w-5 h-5 ${selectedStyle === style.id ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{style.label}</p>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={() => setStep("days")}
              disabled={!selectedStyle}
              className="w-full mt-6"
              size="lg"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 2 — DAYS */}
        {step === "days" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg text-foreground/80 font-light">
                How many days?
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 py-8">
              <button
                onClick={() => setDays(Math.max(1, days - 1))}
                className="w-12 h-12 rounded-full bg-muted border border-border text-foreground text-xl font-medium hover:bg-accent transition-colors"
              >
                -
              </button>
              <div className="w-24 text-center">
                <span className="text-4xl font-serif font-medium text-foreground">{days}</span>
                <p className="text-sm text-muted-foreground mt-1">{days === 1 ? "day" : "days"}</p>
              </div>
              <button
                onClick={() => setDays(Math.min(14, days + 1))}
                className="w-12 h-12 rounded-full bg-muted border border-border text-foreground text-xl font-medium hover:bg-accent transition-colors"
              >
                +
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 py-4">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Specific dates are optional
              </p>
            </div>

            {/* Selected Sources Summary */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sources</p>
              <p className="text-sm text-foreground">
                {surpriseMe 
                  ? "Balanced mix of all curators" 
                  : selectedCurators.map(id => 
                      availableCurators.find(c => c.id === id)?.name
                    ).join(', ')
                }
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full mt-6"
              size="lg"
            >
              Generate itinerary
            </Button>
          </div>
        )}

        {/* STEP 3 — GENERATING */}
        {step === "generating" && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <p className="text-foreground/80 text-center">
              Creating your itinerary...
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Mixing content from selected curators
            </p>
          </div>
        )}

        {/* STEP 4 — DONE */}
        {step === "done" && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <Calendar className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-lg text-foreground text-center font-medium mb-2">
              Itinerary created
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-xs mb-8">
              This is a starting point. You can edit it anytime in My Itinerary.
            </p>

            <div className="space-y-3 w-full max-w-xs">
              <Button
                onClick={() => navigate("/meu-roteiro")}
                className="w-full"
                size="lg"
              >
                View my itinerary
              </Button>
              <Button
                onClick={() => navigate("/ia")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Back to assistant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Curator Option Component
 */
interface CuratorOptionProps {
  curator: Curator;
  isSelected: boolean;
  isPrimary: boolean;
  onToggle: () => void;
}

const CuratorOption = ({ curator, isSelected, isPrimary, onToggle }: CuratorOptionProps) => {
  return (
    <button
      onClick={onToggle}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl border transition-all
        ${isSelected 
          ? "bg-primary/10 border-primary" 
          : "bg-card border-border hover:bg-muted"
        }
      `}
    >
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
        ${isSelected 
          ? "bg-primary text-primary-foreground" 
          : isPrimary 
            ? "bg-amber-500/20 text-amber-600" 
            : "bg-muted text-muted-foreground"
        }
      `}>
        {curator.initials}
      </div>
      <div className="text-left flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{curator.name}</p>
          {isPrimary && (
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">{curator.bio}</p>
      </div>
      {isSelected && <Check className="w-5 h-5 text-primary" />}
    </button>
  );
};

export default IACreateItinerary;
