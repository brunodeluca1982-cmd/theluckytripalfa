import { motion } from "framer-motion";
import { MapPin, Calendar, Compass, Heart } from "lucide-react";
import type { CreateItineraryState } from "@/hooks/use-create-itinerary";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  state: CreateItineraryState;
  tripDays: number;
  onGenerate: () => void;
}

const Row = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <Icon className="h-4 w-4 mt-0.5 text-white/50 shrink-0" />
    <div>
      <p className="text-white/50 text-xs">{label}</p>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  </div>
);

const StepPreview = ({ state, tripDays, onGenerate }: Props) => {
  const dateStr = (() => {
    if (!state.arrivalDate) return "Datas flexíveis";
    const a = format(new Date(state.arrivalDate), "dd MMM", { locale: ptBR });
    if (!state.departureDate) return `A partir de ${a}`;
    const d = format(new Date(state.departureDate), "dd MMM", { locale: ptBR });
    return `${a} – ${d} (${tripDays} dias)`;
  })();

  const styleStr = [state.travelPace, state.travelCompany || state.travelVibe]
    .filter(Boolean)
    .join(" · ") || "Não definido";

  const tagsStr =
    state.inspirationTags.length > 0
      ? state.inspirationTags
          .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
          .join(", ")
      : state.travelIntentions.join(", ") || "Geral";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white font-[var(--font-serif)]">
          Sua viagem está quase pronta
        </h1>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-4 border border-white/10">
        <Row icon={MapPin} label="Destino" value={state.destinationName} />
        <Row icon={Calendar} label="Datas" value={dateStr} />
        <Row icon={Compass} label="Estilo" value={styleStr} />
        <Row icon={Heart} label="Interesses" value={tagsStr} />
      </div>

      <p className="text-white/60 text-sm text-center leading-relaxed">
        Vamos montar um roteiro com os melhores lugares escolhidos pelo Bruno.
      </p>

      <button
        onClick={onGenerate}
        className="w-full py-3.5 rounded-xl text-sm font-semibold bg-white text-foreground hover:bg-white/90 transition-all"
      >
        Gerar meu roteiro →
      </button>
    </motion.div>
  );
};

export default StepPreview;
