import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  arrivalDate: string | null;
  departureDate: string | null;
  onUpdate: (patch: { arrivalDate?: string | null; departureDate?: string | null }) => void;
  onNext: () => void;
}

const StepDates = ({ arrivalDate, departureDate, onUpdate, onNext }: Props) => {
  const arrival = arrivalDate ? new Date(arrivalDate) : undefined;
  const departure = departureDate ? new Date(departureDate) : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-white font-[var(--font-serif)]">
          Quando será a viagem?
        </h2>
        <p className="text-white/60 text-sm mt-1">
          Informe as datas de chegada e partida. (Opcional)
        </p>
      </div>

      {/* Arrival */}
      <div className="space-y-2">
        <label className="text-white/80 text-sm font-medium">Data de chegada</label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-left">
              <CalendarIcon className="h-5 w-5 text-white/50" />
              <span className={arrival ? "text-white text-sm" : "text-white/40 text-sm"}>
                {arrival ? format(arrival, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Selecionar data"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={arrival}
              onSelect={(d) =>
                onUpdate({ arrivalDate: d ? d.toISOString() : null })
              }
              disabled={(d) => d < today}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Departure */}
      <div className="space-y-2">
        <label className="text-white/80 text-sm font-medium">Data de partida</label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-left">
              <CalendarIcon className="h-5 w-5 text-white/50" />
              <span className={departure ? "text-white text-sm" : "text-white/40 text-sm"}>
                {departure ? format(departure, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Selecionar data"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={departure}
              onSelect={(d) =>
                onUpdate({ departureDate: d ? d.toISOString() : null })
              }
              disabled={(d) => d < (arrival || today)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-xl text-sm font-medium bg-white text-foreground hover:bg-white/90 transition-all"
      >
        Continuar →
      </button>
    </motion.div>
  );
};

export default StepDates;
