import { useState, useMemo } from "react";
import { Search, Check } from "lucide-react";
import { motion } from "framer-motion";
import { curatedDestinations, type Destination } from "@/data/destinations-database";

interface Props {
  selectedId: string;
  onSelect: (d: Destination) => void;
  onNext: () => void;
}

// Extended destinations for the flow (including Miami)
const flowDestinations: Destination[] = [
  ...curatedDestinations,
  ...(curatedDestinations.find((d) => d.id === "miami")
    ? []
    : [
        {
          id: "miami",
          name: "Miami",
          country: "Estados Unidos",
          imageUrl:
            "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=600&q=80",
          available: false,
        },
      ]),
];

const StepDestination = ({ selectedId, onSelect, onNext }: Props) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return flowDestinations;
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return flowDestinations.filter((d) => {
      const n = d.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const c = d.country
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return n.includes(q) || c.includes(q);
    });
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-5"
    >
      {/* Section title */}
      <h2 className="text-xl font-semibold text-white font-[var(--font-serif)]">
        Vai pra onde?
      </h2>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
        <input
          type="text"
          placeholder="Buscar cidade, país..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm text-white placeholder:text-white/50 border border-white/20 outline-none focus:border-white/40 transition text-sm"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((d) => {
          const isSelected = d.id === selectedId;
          return (
            <button
              key={d.id}
              onClick={() => d.available && onSelect(d)}
              className={`relative aspect-[3/4] rounded-xl overflow-hidden group transition-all ${
                !d.available ? "opacity-50" : ""
              } ${isSelected ? "ring-2 ring-white" : ""}`}
            >
              <img
                src={d.imageUrl}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 right-2 text-left">
                <p className="text-white text-sm font-semibold leading-tight">
                  {d.name}
                </p>
                <p className="text-white/70 text-[11px]">
                  {d.name} - {d.country}
                </p>
              </div>
              {!d.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-white/80 text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded-full">
                    Em breve
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        disabled={!selectedId}
        onClick={onNext}
        className={`w-full py-3.5 rounded-xl text-sm font-medium transition-all ${
          selectedId
            ? "bg-white text-foreground hover:bg-white/90"
            : "bg-white/20 text-white/40 cursor-not-allowed"
        }`}
      >
        Continuar →
      </button>
    </motion.div>
  );
};

export default StepDestination;
