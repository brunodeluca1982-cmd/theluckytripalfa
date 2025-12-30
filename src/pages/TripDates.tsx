import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

/**
 * TRIP DATES (Step 3: Travel Dates)
 * 
 * Route: /meu-roteiro/datas
 * 
 * Shows ONLY:
 * - Arrival date picker
 * - Departure date picker
 * - Trip duration summary (derived from dates)
 * 
 * After valid input, navigates to preferences step.
 */

const TripDates = () => {
  const navigate = useNavigate();
  const { draft, setArrival, setDeparture, isDestinationSelected, tripDays } = useTripDraft();

  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);

  // If no destination selected, go back to step 1
  if (!isDestinationSelected) {
    navigate('/meu-roteiro', { replace: true });
    return null;
  }

  // If no group info, go back to step 2
  if (draft.adults < 1) {
    navigate('/meu-roteiro/grupo', { replace: true });
    return null;
  }

  const handleContinue = () => {
    // Navigate to preferences step
    navigate('/meu-roteiro/preferencias');
  };

  const handleBack = () => {
    navigate('/meu-roteiro/grupo');
  };

  const handleArrivalSelect = (date: Date | undefined) => {
    if (date) {
      setArrival(date, draft.arrivalTime || '');
      setArrivalOpen(false);
      
      // If departure is before arrival, clear it
      if (draft.departureAt && draft.departureAt < date) {
        setDeparture(null, '');
      }
    }
  };

  const handleDepartureSelect = (date: Date | undefined) => {
    if (date) {
      setDeparture(date, draft.departureTime || '');
      setDepartureOpen(false);
    }
  };

  // Validation: both dates must be selected
  const isValid = draft.arrivalAt !== null && draft.departureAt !== null;

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
  };

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
        {/* Trip summary */}
        <div className="mb-6 p-3 bg-muted/50 rounded-xl space-y-1">
          <div>
            <p className="text-xs text-muted-foreground">Destino</p>
            <p className="font-semibold text-foreground">{draft.destinationName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Viajantes</p>
            <p className="text-sm text-foreground">
              {draft.adults} {draft.adults === 1 ? 'adulto' : 'adultos'}
              {draft.children > 0 && `, ${draft.children} ${draft.children === 1 ? 'criança' : 'crianças'}`}
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
            Quando você vai?
          </h2>
          <p className="text-muted-foreground text-sm">
            Selecione as datas da sua viagem.
          </p>
        </div>

        {/* Date pickers section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Datas</h3>
          </div>

          <div className="bg-card rounded-2xl p-4 space-y-4">
            {/* Arrival date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Chegada</label>
              <Popover open={arrivalOpen} onOpenChange={setArrivalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 rounded-xl",
                      !draft.arrivalAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {draft.arrivalAt ? formatDate(draft.arrivalAt) : "Selecione a data de chegada"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={draft.arrivalAt || undefined}
                    onSelect={handleArrivalSelect}
                    disabled={(date) => date < new Date()}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Departure date */}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-sm font-medium text-foreground">Partida</label>
              <Popover open={departureOpen} onOpenChange={setDepartureOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 rounded-xl",
                      !draft.departureAt && "text-muted-foreground"
                    )}
                    disabled={!draft.arrivalAt}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {draft.departureAt ? formatDate(draft.departureAt) : "Selecione a data de partida"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={draft.departureAt || undefined}
                    onSelect={handleDepartureSelect}
                    disabled={(date) => 
                      date < new Date() || 
                      (draft.arrivalAt ? date < draft.arrivalAt : false)
                    }
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Trip duration */}
            {isValid && tripDays > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-border"
              >
                <div className="bg-primary/10 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Duração da viagem</p>
                  <p className="text-2xl font-bold text-primary">
                    {tripDays} {tripDays === 1 ? 'dia' : 'dias'}
                  </p>
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

export default TripDates;
