import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Clock, Check } from "lucide-react";
import { getBlocksByDate } from "@/data/carnival-blocks";
import { formatCarnavalDateTitle } from "@/lib/carnaval-date-utils";
import { useItemSave } from "@/hooks/use-item-save";
import { useState, useEffect, useCallback } from "react";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

const BlocosDia = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = searchParams.get("date") || "";
  const { saveItem } = useItemSave();
  const [allSaved, setAllSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const blocos = getBlocksByDate(selectedDate);

  // Check if all blocos for this day are already saved
  useEffect(() => {
    if (blocos.length === 0) return;
    const draft = JSON.parse(localStorage.getItem('draft-roteiro') || '[]');
    const allAlreadySaved = blocos.every((b) =>
      draft.some((item: { id: string }) => item.id === b.id)
    );
    setAllSaved(allAlreadySaved);
  }, [blocos]);

  const handleSaveAll = useCallback(() => {
    if (allSaved) return;
    blocos.forEach((bloco) => {
      saveItem(bloco.id, 'activity', bloco.name, false);
    });
    setAllSaved(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  }, [blocos, saveItem, allSaved]);

  if (blocos.length === 0 && selectedDate) {
    console.log("[BlocosDia debug]", { selectedDate });
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(4px) contrast(0.9)", transform: "scale(1.05)" }} />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full overflow-y-auto pb-24">
        <header className="px-5 pt-14 pb-4 flex items-center justify-between">
          <Link to="/calendario-carnaval" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <button
            onClick={handleSaveAll}
            disabled={allSaved}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              allSaved
                ? "backdrop-blur-md bg-white/20 text-white/70 border border-white/20"
                : "backdrop-blur-md bg-white/15 text-white border border-white/25 hover:bg-white/25 active:scale-95"
            } ${isAnimating ? "scale-105" : ""}`}
          >
            {allSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Adicionado
              </>
            ) : (
              "Eu vou"
            )}
          </button>
        </header>

        <div className="px-5 pb-6 text-center">
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">
            {selectedDate ? formatCarnavalDateTitle(selectedDate) : ""}
          </h1>
          <p className="text-xs text-white/60 mt-1 tracking-widest uppercase">
            {blocos.length} {blocos.length === 1 ? "bloco" : "blocos"}
          </p>
        </div>

        <div className="mx-4 space-y-2">
          {blocos.length === 0 && (
            <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 text-center">
              <p className="text-white/60 text-sm">Programação em atualização.</p>
            </div>
          )}
          {blocos.map((bloco) => (
            <button
              key={bloco.id}
              onClick={() => navigate(`/bloco-detalhe/${bloco.id}?date=${selectedDate}`)}
              className="w-full rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-1.5 shrink-0">
                <Clock className="w-4 h-4 text-white/50" />
                <span className="text-white font-medium text-sm w-6 text-center">{parseInt(bloco.time)}</span>
              </div>
              <span className="text-white text-sm font-medium min-w-0 flex-1 truncate">{bloco.name}</span>
              <span className="text-white/60 text-sm shrink-0">📍 {bloco.neighborhood?.replace("Jardim Botânico", "J Botânico")}</span>
              {bloco.tag && <span className="text-white/40 text-[11px] italic shrink-0">✨ {bloco.tag}</span>}
              <ChevronLeft className="w-4 h-4 text-white/40 ml-auto rotate-180 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlocosDia;
