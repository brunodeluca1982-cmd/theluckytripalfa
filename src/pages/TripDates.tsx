import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import FlowHeroBackground from "@/components/roteiro/FlowHeroBackground";

const TripDates = () => {
  const navigate = useNavigate();
  const { draft, setArrival, setDeparture, isDestinationSelected, tripDays } = useTripDraft();

  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);

  if (!isDestinationSelected) {
    navigate('/meu-roteiro', { replace: true });
    return null;
  }

  const handleContinue = () => navigate('/meu-roteiro/preferencias');
  const handleBack = () => navigate('/meu-roteiro');

  const handleArrivalSelect = (date: Date | undefined) => {
    if (date) {
      setArrival(date, draft.arrivalTime || '');
      setArrivalOpen(false);
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

  const isValid = draft.arrivalAt !== null && draft.departureAt !== null;

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
  };

  return (
    <FlowHeroBackground imageUrl={draft.destinationImageUrl || undefined}>
      <div className="min-h-screen pb-32">
        {/* Header */}
        <header className="sticky top-0 z-50 px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 -m-2 text-white/80 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">Monte seu roteiro</h1>
          </div>
        </header>

        <main className="px-4 py-6 space-y-6">
          {/* Trip summary — glass panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
            <p className="text-xs text-white/50">Destino</p>
            <p className="font-semibold text-white">{draft.destinationName}</p>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-serif font-semibold text-white mb-2">
              Quando você vai?
            </h2>
            <p className="text-white/60 text-sm">Selecione as datas da sua viagem.</p>
          </div>

          {/* Date pickers — glass panel */}
          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-4 border border-white/15">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-4 h-4 text-white/70" />
              <h3 className="text-sm font-semibold text-white">Datas</h3>
            </div>

            {/* Arrival */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60">Chegada</label>
              <Popover open={arrivalOpen} onOpenChange={setArrivalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/15 hover:text-white",
                      !draft.arrivalAt && "text-white/50"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-white/50" />
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
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Departure */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <label className="text-xs font-medium text-white/60">Partida</label>
              <Popover open={departureOpen} onOpenChange={setDepartureOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/15 hover:text-white",
                      !draft.departureAt && "text-white/50"
                    )}
                    disabled={!draft.arrivalAt}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-white/50" />
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
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Trip duration */}
            {isValid && tripDays > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-white/10"
              >
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-xs text-white/60 mb-1">Duração da viagem</p>
                  <p className="text-2xl font-bold text-white">
                    {tripDays} {tripDays === 1 ? 'dia' : 'dias'}
                  </p>
                </div>
              </motion.div>
            )}
          </section>
        </main>

        {/* Fixed CTA */}
        <div className="fixed bottom-safe-cta left-0 right-0 p-4 z-40">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <Button
              onClick={handleContinue}
              disabled={!isValid}
              className="w-full h-14 text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40"
            >
              Continuar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </FlowHeroBackground>
  );
};

export default TripDates;
