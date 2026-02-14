import { useParams, useSearchParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getBlockById } from "@/data/carnival-blocks";
import { formatCarnavalDateFull } from "@/lib/carnaval-date-utils";
import SaveToRoteiroButton from "@/components/SaveToRoteiroButton";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

const BlocoInfo = () => {
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

  const fullDate = date ? formatCarnavalDateFull(date) : "";

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(6px) contrast(0.9)", transform: "scale(1.05)" }}
      />
      <div className="fixed inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 pb-28">
        <header className="px-5 pt-14 pb-4">
          <Link
            to={`/bloco-detalhe/${id}?date=${date}`}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>

        {/* Title */}
        <div className="px-5 pb-6">
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">
            {bloco.name}
          </h1>
          {fullDate && (
            <p className="text-sm text-white/60 mt-1">{fullDate}</p>
          )}
        </div>

        {/* Full text content */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5">
          <div className="text-sm text-white/90 leading-relaxed whitespace-pre-line">
            {bloco.fullDetails}
          </div>
        </div>
      </div>

      {/* Fixed bottom save button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent">
        <SaveToRoteiroButton
          itemId={bloco.id}
          itemType="activity"
          itemTitle={bloco.name}
          className="w-full justify-center"
        />
      </div>
    </div>
  );
};

export default BlocoInfo;
