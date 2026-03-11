import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import FlowHeroBackground from "@/components/roteiro/FlowHeroBackground";
import { useCreateItinerary } from "@/hooks/use-create-itinerary";
import type { Destination } from "@/data/destinations-database";

import StepDestination from "./criar-roteiro/StepDestination";
import StepDates from "./criar-roteiro/StepDates";
import StepStyle from "./criar-roteiro/StepStyle";
import StepInspiration from "./criar-roteiro/StepInspiration";
import StepPreview from "./criar-roteiro/StepPreview";
import StepGenerating from "./criar-roteiro/StepGenerating";

import logoSymbol from "@/assets/brand/logo-l-correct.png";
import { useSubscription } from "@/hooks/use-subscription";

const CriarRoteiro = () => {
  const navigate = useNavigate();
  const { state, update, goTo, clear, tripDays } = useCreateItinerary();
  const { isAuthenticated } = useSubscription();
  const step = state.step;

  const handleSelectDestination = useCallback(
    (d: Destination) => {
      update({
        destinationId: d.id,
        destinationName: d.name,
        destinationCountry: d.country,
        destinationImageUrl: d.imageUrl || "",
      });
    },
    [update]
  );

  const handleBack = useCallback(() => {
    if (step <= 1) {
      navigate("/");
    } else {
      goTo(step - 1);
    }
  }, [step, navigate, goTo]);

  const handleGenerate = useCallback(async () => {
    goTo(6); // show generating screen

    try {
      // Get current user (optional — works for anon too)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Save to Supabase
      const { data, error } = await supabase
        .from("user_itineraries")
        .insert({
          user_id: user?.id || null,
          destination_id: state.destinationId,
          destination_name: state.destinationName,
          destination_image_url: state.destinationImageUrl || null,
          arrival_date: state.arrivalDate
            ? new Date(state.arrivalDate).toISOString().split("T")[0]
            : null,
          departure_date: state.departureDate
            ? new Date(state.departureDate).toISOString().split("T")[0]
            : null,
          travel_pace: state.travelPace || null,
          travel_intentions: state.travelIntentions.length
            ? state.travelIntentions
            : null,
          travel_company: state.travelCompany || state.travelVibe || null,
          inspiration_tags: state.inspirationTags.length
            ? state.inspirationTags
            : null,
          budget_style: state.budgetStyle || null,
          status: "generating",
        })
        .select("id")
        .single();

      if (error) throw error;

      // Simulate AI generation time (replace with real AI call later)
      await new Promise((r) => setTimeout(r, 3000));

      // Update status
      await supabase
        .from("user_itineraries")
        .update({ status: "active", generated_at: new Date().toISOString() })
        .eq("id", data.id);

      clear();
      navigate(`/meus-roteiros/${data.id}`);
    } catch (err) {
      console.error("Error creating itinerary:", err);
      toast.error("Erro ao criar roteiro. Tente novamente.");
      goTo(5); // back to preview
    }
  }, [state, goTo, clear, navigate]);

  const bgImage = state.destinationImageUrl || undefined;

  return (
    <FlowHeroBackground imageUrl={bgImage}>
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={handleBack} className="p-1">
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <img src={logoSymbol} alt="Lucky Trip" className="h-8 brightness-0 invert" />
        <button
          onClick={() =>
            navigate(isAuthenticated ? "/perfil" : "/auth")
          }
          className="w-9 h-9 rounded-full bg-primary/80 flex items-center justify-center"
        >
          <span className="text-primary-foreground text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
        </button>
      </div>

      {/* Title for steps 1-2 */}
      {step <= 2 && (
        <div className="px-6 pt-2 pb-4 text-center">
          <h1 className="text-3xl font-bold text-white font-[var(--font-serif)] italic">
            Criar roteiro
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Vamos organizar sua viagem em poucos passos.
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="px-5 pb-28">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepDestination
              key="dest"
              selectedId={state.destinationId}
              onSelect={handleSelectDestination}
              onNext={() => goTo(2)}
            />
          )}
          {step === 2 && (
            <StepDates
              key="dates"
              arrivalDate={state.arrivalDate}
              departureDate={state.departureDate}
              onUpdate={update}
              onNext={() => goTo(3)}
            />
          )}
          {step === 3 && (
            <StepStyle
              key="style"
              travelPace={state.travelPace}
              travelIntentions={state.travelIntentions}
              travelCompany={state.travelCompany}
              onUpdate={update}
              onNext={() => goTo(4)}
            />
          )}
          {step === 4 && (
            <StepInspiration
              key="inspo"
              inspirationTags={state.inspirationTags}
              travelVibe={state.travelVibe}
              budgetStyle={state.budgetStyle}
              onUpdate={update}
              onNext={() => goTo(5)}
            />
          )}
          {step === 5 && (
            <StepPreview
              key="preview"
              state={state}
              tripDays={tripDays}
              onGenerate={handleGenerate}
            />
          )}
          {step === 6 && <StepGenerating key="gen" />}
        </AnimatePresence>
      </div>
    </FlowHeroBackground>
  );
};

export default CriarRoteiro;
