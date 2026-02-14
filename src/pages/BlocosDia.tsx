import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Clock } from "lucide-react";
import { carnavalBlocos } from "@/data/carnaval-blocos-data";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

const BlocosDia = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = Number(searchParams.get("date") || 0);

  const dayData = carnavalBlocos.find((d) => d.date === selectedDate);
  const blocos = dayData?.blocos || [];

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(4px) contrast(0.9)", transform: "scale(1.05)" }} />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full overflow-y-auto pb-24">
        <header className="px-5 pt-14 pb-4 flex items-center gap-3">
          <Link to="/calendario-carnaval" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>

        <div className="px-5 pb-6 text-center">
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">
            {selectedDate} de Fevereiro
          </h1>
          <p className="text-xs text-white/60 mt-1 tracking-widest uppercase">
            {blocos.length} {blocos.length === 1 ? "bloco" : "blocos"}
          </p>
        </div>

        <div className="mx-4 space-y-2">
          {blocos.length === 0 && (
            <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 text-center">
              <p className="text-white/60 text-sm">Nenhum bloco neste dia.</p>
            </div>
          )}
          {blocos.map((bloco) => (
            <button
              key={bloco.id}
              onClick={() => navigate(`/bloco-detalhe/${bloco.id}?date=${selectedDate}`)}
              className="w-full rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-2 shrink-0">
                <Clock className="w-4 h-4 text-white/50" />
                <span className="text-white font-medium text-sm w-10">{bloco.startHour}h</span>
              </div>
              <span className="text-white text-sm font-medium truncate">{bloco.name}</span>
              <ChevronLeft className="w-4 h-4 text-white/40 ml-auto rotate-180 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlocosDia;
