import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Palmtree, Utensils, Landmark, Shuffle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CREATE ITINERARY — AI DRAFT GENERATOR
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE:
 * - Generate a draft itinerary (not final)
 * - Short setup flow: dates + travel style
 * - Auto-save to "My Itinerary"
 * 
 * RULES:
 * - Result is a starting point, not definitive
 * - User can always edit after generation
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
  const [step, setStep] = useState<"style" | "dates" | "generating" | "done">("style");
  const [selectedStyle, setSelectedStyle] = useState<TravelStyle | null>(null);
  const [days, setDays] = useState(3);

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
              onClick={() => setStep("dates")}
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
        {step === "dates" && (
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
              Based on curated recommendations
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

export default IACreateItinerary;
