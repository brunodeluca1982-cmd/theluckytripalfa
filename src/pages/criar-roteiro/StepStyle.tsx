import { motion } from "framer-motion";

interface Props {
  travelPace: string;
  travelIntentions: string[];
  travelCompany: string;
  onUpdate: (patch: {
    travelPace?: string;
    travelIntentions?: string[];
    travelCompany?: string;
  }) => void;
  onNext: () => void;
}

const paceOptions = ["Tranquilo", "Equilibrado", "Intenso"];
const intentionOptions = ["Cultural", "Natureza", "Festas", "Misto"];
const companyOptions = ["Sozinho", "Família", "Amigos"];

const Chip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
      active
        ? "bg-white/25 border-white/50 text-white"
        : "bg-white/8 border-white/15 text-white/70 hover:bg-white/15"
    }`}
  >
    {label}
  </button>
);

const StepStyle = ({
  travelPace,
  travelIntentions,
  travelCompany,
  onUpdate,
  onNext,
}: Props) => {
  const toggleIntention = (val: string) => {
    const next = travelIntentions.includes(val)
      ? travelIntentions.filter((v) => v !== val)
      : [...travelIntentions, val];
    onUpdate({ travelIntentions: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-white font-[var(--font-serif)]">
          Como você prefere viajar?
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Suas escolhas ajudam a personalizar o roteiro.
        </p>
      </div>

      {/* Ritmo */}
      <div className="space-y-3">
        <p className="text-white/80 text-sm font-medium">Ritmo da viagem:</p>
        <div className="flex flex-wrap gap-2">
          {paceOptions.map((o) => (
            <Chip
              key={o}
              label={o}
              active={travelPace === o}
              onClick={() => onUpdate({ travelPace: o })}
            />
          ))}
        </div>
      </div>

      {/* Intenção */}
      <div className="space-y-3">
        <p className="text-white/80 text-sm font-medium">Intenção geral</p>
        <div className="flex flex-wrap gap-2">
          {intentionOptions.map((o) => (
            <Chip
              key={o}
              label={o}
              active={travelIntentions.includes(o)}
              onClick={() => toggleIntention(o)}
            />
          ))}
        </div>
      </div>

      {/* Estilo */}
      <div className="space-y-3">
        <p className="text-white/80 text-sm font-medium">Estilo</p>
        <div className="flex flex-wrap gap-2">
          {companyOptions.map((o) => (
            <Chip
              key={o}
              label={o}
              active={travelCompany === o}
              onClick={() => onUpdate({ travelCompany: o })}
            />
          ))}
        </div>
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

export default StepStyle;
