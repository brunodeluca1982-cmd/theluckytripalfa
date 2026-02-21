import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { curatedDestinations, Destination } from "@/data/destinations-database";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import FlowHeroBackground from "@/components/roteiro/FlowHeroBackground";

const MeuRoteiro = () => {
  const navigate = useNavigate();
  const { draft, setDestination, setArrival, setDeparture, isDestinationSelected, tripDays } = useTripDraft();
  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);

  const datesValid = draft.arrivalAt !== null && draft.departureAt !== null && draft.departureAt >= draft.arrivalAt;
  const showDateError = draft.arrivalAt && draft.departureAt && draft.departureAt < draft.arrivalAt;
  const canContinue = isDestinationSelected && datesValid;

  const handleSelectDestination = (destination: Destination) => {
    if (!destination.available) {
      toast({ title: "Em breve!", description: `${destination.name} estará disponível em breve.` });
      return;
    }
    setDestination(destination.id, destination.name, destination.id, destination.imageUrl || '');
  };

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

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return format(date, "dd 'de' MMM", { locale: ptBR });
  };

  const handleContinue = () => {
    navigate('/meu-roteiro/preferencias');
  };

  const heroImageUrl = draft.destinationImageUrl || undefined;

  return (
    <FlowHeroBackground imageUrl={heroImageUrl}>
      <div className="min-h-screen pb-32">
        {/* Header — glass style */}
        <header className="sticky top-0 z-50 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="p-2 -m-2 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">Monte seu roteiro</h1>
            <div className="w-9" /> {/* spacer */}
          </div>
        </header>

        <main className="px-4 py-4 space-y-6">
          {/* Section title */}
          <div>
            <h2 className="text-2xl font-serif font-semibold text-white mb-1">
              {isDestinationSelected ? draft.destinationName : 'Pra onde você vai?'}
            </h2>
            {!isDestinationSelected && (
              <p className="text-white/60 text-sm">Escolha seu destino para começar.</p>
            )}
          </div>

          {/* Destination grid — compact cards */}
          <section>
            <div className="grid grid-cols-3 gap-2.5">
              {curatedDestinations.map((destination, index) => {
                const isDisabled = !destination.available;
                const isSelected = draft.destinationId === destination.id;

                return (
                  <motion.button
                    key={destination.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelectDestination(destination)}
                    disabled={isDisabled}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden transition-all",
                      isDisabled && "opacity-40 grayscale-[40%]",
                      isSelected && "ring-2 ring-white ring-offset-2 ring-offset-transparent"
                    )}
                  >
                    {destination.imageUrl ? (
                      <img
                        src={destination.imageUrl}
                        alt={destination.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white/50" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent",
                      isSelected && "from-primary/60 via-primary/20 to-transparent"
                    )} />

                    {/* Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-medium leading-tight truncate">
                        {destination.name}
                      </p>
                    </div>

                    {/* Check */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-primary" />
                      </motion.div>
                    )}

                    {/* Em breve */}
                    {isDisabled && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/50 rounded-full">
                        <span className="text-[9px] text-white/80 font-medium">Em breve</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* Date section — glass panel */}
          <AnimatePresence>
            {isDestinationSelected && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-white/70" />
                  <h3 className="text-sm font-semibold text-white">Quando você vai?</h3>
                </div>

                {/* Arrival */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/60">Data de ida</label>
                  <Popover open={arrivalOpen} onOpenChange={setArrivalOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/15 hover:text-white",
                          !draft.arrivalAt && "text-white/50"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4 text-white/50" />
                        {draft.arrivalAt ? formatDate(draft.arrivalAt) : "Selecione a data de ida"}
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
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/60">Data de volta</label>
                  <Popover open={departureOpen} onOpenChange={setDepartureOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/15 hover:text-white",
                          !draft.departureAt && "text-white/50"
                        )}
                        disabled={!draft.arrivalAt}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4 text-white/50" />
                        {draft.departureAt ? formatDate(draft.departureAt) : "Selecione a data de volta"}
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

                {/* Date error */}
                {showDateError && (
                  <p className="text-sm text-red-300">
                    A data de volta deve ser igual ou posterior à data de ida.
                  </p>
                )}

                {/* Duration badge */}
                {datesValid && tripDays > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center"
                  >
                    <p className="text-xs text-white/60">Duração</p>
                    <p className="text-xl font-bold text-white">
                      {tripDays} {tripDays === 1 ? 'dia' : 'dias'}
                    </p>
                  </motion.div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        {/* Fixed CTA */}
        <div className="fixed bottom-safe-cta left-0 right-0 p-4 z-40">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
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

export default MeuRoteiro;
