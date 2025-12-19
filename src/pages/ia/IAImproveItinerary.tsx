import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles, Clock, MapPin, LayoutGrid, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IMPROVE ITINERARY — AI ANALYSIS & SUGGESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE:
 * - Analyze existing itinerary
 * - Suggest improvements without deleting user choices
 * - Feels like an editor, not a replacement
 * 
 * ANALYSIS:
 * - Time distribution
 * - Location logic
 * - Category balance
 * 
 * RULES:
 * - Only active if user has items in "My Itinerary"
 * - Suggestions enhance, never replace
 * ═══════════════════════════════════════════════════════════════════════════
 */

const IAImproveItinerary = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"check" | "analyzing" | "suggestions">("check");
  
  // Simulated: would check actual roteiro state
  const hasItinerary = true;

  const handleAnalyze = () => {
    setStep("analyzing");
    setTimeout(() => {
      setStep("suggestions");
    }, 2000);
  };

  const suggestions = [
    {
      icon: Clock,
      title: "Time distribution",
      description: "Day 2 seems packed. Consider moving Sugarloaf to Day 3 morning.",
      status: "suggestion"
    },
    {
      icon: MapPin,
      title: "Location logic",
      description: "Group Ipanema and Leblon visits on the same day to save travel time.",
      status: "suggestion"
    },
    {
      icon: LayoutGrid,
      title: "Category balance",
      description: "Your itinerary is food-heavy. Consider adding a cultural experience.",
      status: "suggestion"
    },
  ];

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
          Improve my itinerary
        </h1>
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-2">
          AI-powered suggestions
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        
        {/* CHECK STATE */}
        {step === "check" && (
          <div className="space-y-6">
            {hasItinerary ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-lg text-foreground/80 font-light">
                    Ready to analyze your itinerary
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    I'll review timing, locations, and balance
                  </p>
                </div>

                <div className="space-y-3 py-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground/70">Time distribution</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground/70">Location logic</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                    <LayoutGrid className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-foreground/70">Category balance</span>
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  className="w-full mt-6"
                  size="lg"
                >
                  Analyze my itinerary
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-foreground/80 text-center mb-2">
                  No itinerary found
                </p>
                <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                  Create an itinerary first, then come back here to improve it.
                </p>
                <Button
                  onClick={() => navigate("/ia/create-itinerary")}
                  variant="outline"
                >
                  Create itinerary
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ANALYZING */}
        {step === "analyzing" && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <p className="text-foreground/80 text-center">
              Analyzing your itinerary...
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Looking for improvements
            </p>
          </div>
        )}

        {/* SUGGESTIONS */}
        {step === "suggestions" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg text-foreground font-medium">
                3 suggestions found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Apply the ones that work for you
              </p>
            </div>

            <div className="space-y-4">
              {suggestions.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button className="text-xs text-primary font-medium hover:underline">
                      Apply suggestion
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 space-y-3">
              <Button
                onClick={() => navigate("/meu-roteiro")}
                className="w-full"
                size="lg"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Done reviewing
              </Button>
              <Button
                onClick={() => setStep("check")}
                variant="outline"
                className="w-full"
              >
                Analyze again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IAImproveItinerary;
