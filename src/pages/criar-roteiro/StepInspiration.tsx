import { motion } from "framer-motion";
import { Check } from "lucide-react";

import naturezaImg from "@/assets/inspiration/natureza.jpg";
import gastronomiaImg from "@/assets/inspiration/gastronomia.jpg";
import culturaImg from "@/assets/inspiration/cultura.jpg";
import aventuraImg from "@/assets/inspiration/aventura.jpg";
import relaxamentoImg from "@/assets/inspiration/relaxamento.jpg";
import festaImg from "@/assets/inspiration/festa.jpg";

interface Props {
  inspirationTags: string[];
  travelVibe: string;
  budgetStyle: string;
  onUpdate: (patch: {
    inspirationTags?: string[];
    travelVibe?: string;
    budgetStyle?: string;
  }) => void;
  onNext: () => void;
}

const inspirationGrid = [
  { id: "natureza", label: "Natureza", img: naturezaImg },
  { id: "gastronomia", label: "Gastronomia", img: gastronomiaImg },
  { id: "cultura", label: "Cultura", img: culturaImg },
  { id: "aventura", label: "Aventura", img: aventuraImg },
  { id: "relaxamento", label: "Relaxamento", img: relaxamentoImg },
  { id: "festa", label: "Festa", img: festaImg },
];

const vibeOptions = ["Sozinho", "Família", "Amigos"];
const budgetOptions = [
  { id: "essencial", label: "Essencial", symbol: "$" },
  { id: "conforto", label: "Conforto", symbol: "$$" },
  { id: "sofisticado", label: "Sofisticado", symbol: "$$$" },
];

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

const StepInspiration = ({
  inspirationTags,
  travelVibe,
  budgetStyle,
  onUpdate,
  onNext,
}: Props) => {
  const toggleTag = (id: string) => {
    const next = inspirationTags.includes(id)
      ? inspirationTags.filter((t) => t !== id)
      : [...inspirationTags, id];
    onUpdate({ inspirationTags: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-7"
    >
      <div>
        <h1 className="text-2xl font-bold text-white font-[var(--font-serif)]">
          O que te inspira?
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Selecione o que você ama para personalizarmos seu roteiro.
        </p>
      </div>

      {/* Inspiration grid */}
      <div className="grid grid-cols-3 gap-3">
        {inspirationGrid.map((item) => {
          const active = inspirationTags.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleTag(item.id)}
              className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                active ? "ring-2 ring-white" : ""
              }`}
            >
              <img
                src={item.img}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {active && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </div>
              )}
              <span className="absolute bottom-2 left-2 text-white text-xs font-semibold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vibe */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-white/10">
        <p className="text-white/80 text-sm font-medium text-center">
          Qual a vibe da viagem?
        </p>
        <div className="flex justify-center gap-2">
          {vibeOptions.map((o) => (
            <Chip
              key={o}
              label={o}
              active={travelVibe === o}
              onClick={() => onUpdate({ travelVibe: o })}
            />
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-white/10">
        <p className="text-white/80 text-sm font-medium text-center">
          Estilo da viagem (opcional)
        </p>
        <div className="flex justify-center gap-2">
          {budgetOptions.map((o) => (
            <button
              key={o.id}
              onClick={() => onUpdate({ budgetStyle: o.id })}
              className={`flex flex-col items-center px-5 py-3 rounded-xl text-sm font-medium transition-all border ${
                budgetStyle === o.id
                  ? "bg-white/25 border-white/50 text-white"
                  : "bg-white/8 border-white/15 text-white/70 hover:bg-white/15"
              }`}
            >
              <span className="text-base font-bold">{o.symbol}</span>
              <span className="text-xs mt-0.5">{o.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-xl text-sm font-medium bg-white text-foreground hover:bg-white/90 transition-all"
      >
        Criar meu roteiro →
      </button>
    </motion.div>
  );
};

export default StepInspiration;
