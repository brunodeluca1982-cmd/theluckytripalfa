import { useParams, useSearchParams, Link } from "react-router-dom";
import { ChevronLeft, Clock, MapPin, Music, Users, Sparkles } from "lucide-react";
import { getBlockById } from "@/data/carnival-blocks";
import SaveToRoteiroButton from "@/components/SaveToRoteiroButton";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

const BlocoDetalhe = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date") || "";

  const bloco = id ? getBlockById(id) : undefined;

  if (!bloco) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Bloco não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(4px) contrast(0.9)", transform: "scale(1.05)" }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full overflow-y-auto pb-24">
        <header className="px-5 pt-14 pb-4">
          <Link to={`/blocos-dia?date=${date}`} className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>

        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 pb-6 space-y-5">
          <h1 className="text-2xl font-serif font-semibold text-white">{bloco.name}</h1>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-white/60 shrink-0" />
              <span className="text-sm text-white">{bloco.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-white/60 shrink-0" />
              <span className="text-sm text-white">{bloco.neighborhood}</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-white/60 shrink-0" />
              <span className="text-sm text-white">{bloco.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-white/60 shrink-0" />
              <span className="text-sm text-white">{bloco.description}</span>
            </div>
          </div>

          <SaveToRoteiroButton
            itemId={bloco.id}
            itemType="activity"
            itemTitle={bloco.name}
            className="w-full justify-center"
          />

          <Link
            to={`/bloco-info/${bloco.id}?date=${date}`}
            className="mt-4 mb-0 flex items-center justify-center w-full py-3 rounded-2xl border border-white/40 text-white text-sm font-medium backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            Saiba mais
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlocoDetalhe;
