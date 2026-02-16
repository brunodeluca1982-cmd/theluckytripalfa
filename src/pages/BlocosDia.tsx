import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Clock } from "lucide-react";
import { useState } from "react";
import { getBlocksByDate } from "@/data/carnival-blocks";
import { festasData } from "@/data/festas-bailes-data";
import { formatCarnavalDateTitle } from "@/lib/carnaval-date-utils";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

// Short display name for list only — never overwrites stored name
function shortenBlocoName(name: string): string {
  if (name === "Exaltação ao Samba de Enredo") return "Exaltação";
  if (name === "Enredo do Meu Samba") return "E. do Meu Samba";
  let s = name;
  const prefixes = ["Cordão da ", "Cordão do ", "Banda do ", "Bloco do ", "Bloco da ", "Bloco de "];
  for (const p of prefixes) {
    if (s.startsWith(p)) { s = s.slice(p.length); break; }
  }
  if (s.length > 20) s = s.replace(/^Enredo /, "E. ");
  return s;
}

const NEIGHBORHOOD_SHORT: Record<string, string> = {
  "Copacabana": "Copa",
  "Ipanema": "Ipa",
  "Arpoador": "Arpex",
  "Santa Teresa": "S. Teresa",
  "Flamengo": "Fla",
  "Botafogo": "Bota",
  "Jardim Botânico": "J Botânico",
};
function shortenNeighborhood(n: string): string {
  return NEIGHBORHOOD_SHORT[n] ?? n;
}

type Filter = "blocos" | "festas";

const BlocosDia = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = searchParams.get("date") || "";
  const [filter, setFilter] = useState<Filter>("blocos");

  const blocos = getBlocksByDate(selectedDate);
  const festas = festasData.filter((f) => f.dateISO === selectedDate).sort((a, b) => a.time.localeCompare(b.time));
  const hasFestas = festas.length > 0;

  const showBlocos = filter === "blocos";
  const items = showBlocos ? blocos : festas;
  const countLabel = showBlocos
    ? `${blocos.length} ${blocos.length === 1 ? "bloco" : "blocos"}`
    : `${festas.length} ${festas.length === 1 ? "evento" : "eventos"}`;

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(4px) contrast(0.9)", transform: "scale(1.05)" }} />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full overflow-y-auto pb-24">
        <header className="px-5 pt-14 pb-4 flex items-center">
          <Link to="/calendario-carnaval" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>

        <div className="px-5 pb-4 text-center">
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">
            {selectedDate ? formatCarnavalDateTitle(selectedDate) : ""}
          </h1>
          <p className="text-xs text-white/60 mt-1 tracking-widest uppercase">
            {countLabel}
          </p>
        </div>

        {/* Filter tabs — only show if there are festas for this date */}
        {hasFestas && (
          <div className="mx-4 mb-4 flex gap-2">
            <button
              onClick={() => setFilter("blocos")}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                showBlocos
                  ? "backdrop-blur-md bg-white/25 text-white border border-white/40"
                  : "backdrop-blur-md bg-white/10 text-white/60 border border-white/15 hover:bg-white/15"
              }`}
            >
              Blocos de Rua 🥁
            </button>
            <button
              onClick={() => setFilter("festas")}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                !showBlocos
                  ? "backdrop-blur-md bg-white/25 text-white border border-white/40"
                  : "backdrop-blur-md bg-white/10 text-white/60 border border-white/15 hover:bg-white/15"
              }`}
            >
              Festas e Bailes 🎭
            </button>
          </div>
        )}

        <div className="mx-4 space-y-2">
          {items.length === 0 && (
            <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 text-center">
              <p className="text-white/60 text-sm">Programação encerrada. Confira os próximos eventos.</p>
            </div>
          )}

          {showBlocos
            ? blocos.map((bloco) => (
                <button
                  key={bloco.id}
                  onClick={() => navigate(`/bloco-detalhe/${bloco.id}?date=${selectedDate}`)}
                  className="w-full rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock className="w-4 h-4 text-white/50" />
                    <span className="text-white font-medium text-sm w-6 text-center">{parseInt(bloco.time)}</span>
                  </div>
                  <span className="text-white text-sm font-medium min-w-0 flex-1 truncate">{shortenBlocoName(bloco.name)}</span>
                  <span className="text-white/60 text-sm shrink-0">📍 {shortenNeighborhood(bloco.neighborhoodShort || bloco.neighborhood || "")}</span>
                  {bloco.tag && <span className="text-white/40 text-[11px] italic shrink-0">✨ {bloco.tag}</span>}
                  <ChevronLeft className="w-4 h-4 text-white/40 ml-auto rotate-180 shrink-0" />
                </button>
              ))
            : festas.map((festa) => (
                <button
                  key={festa.id}
                  onClick={() => navigate(`/festa-detalhe/${festa.id}`)}
                  className="w-full rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock className="w-4 h-4 text-white/50" />
                    <span className="text-white font-medium text-sm w-14 text-center">{festa.timeDisplay}</span>
                  </div>
                  <span className="text-white text-sm font-medium min-w-0 flex-1 truncate">{festa.name}</span>
                  <span className="text-white/60 text-sm shrink-0">📍 {shortenNeighborhood(festa.neighborhood)}</span>
                  <span className="text-white/40 text-[11px] italic shrink-0">✨ {festa.tag}</span>
                  <ChevronLeft className="w-4 h-4 text-white/40 ml-auto rotate-180 shrink-0" />
                </button>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default BlocosDia;
