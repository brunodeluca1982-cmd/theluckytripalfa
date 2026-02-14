import { useParams, useSearchParams, Link } from "react-router-dom";
import { ChevronLeft, Clock, MapPin, Music, Users, Sparkles, Navigation, ShieldCheck, Lightbulb } from "lucide-react";
import { carnavalBlocos } from "@/data/carnaval-blocos-data";
import { blocoExtendedInfo } from "@/data/bloco-extended-info";
import SaveToRoteiroButton from "@/components/SaveToRoteiroButton";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

const WEEKDAYS: Record<number, string> = {
  14: "Sábado", 15: "Domingo", 16: "Segunda-feira", 17: "Terça-feira",
  18: "Quarta-feira", 19: "Quinta-feira", 21: "Sábado", 22: "Domingo",
};

const BlocoInfo = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date") || "";
  const dateNum = Number(date);

  const bloco = carnavalBlocos.flatMap((d) => d.blocos).find((b) => b.id === id);
  const extra = id ? blocoExtendedInfo[id] : undefined;

  if (!bloco) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Bloco não encontrado.</p>
      </div>
    );
  }

  const fullDate = dateNum
    ? `${dateNum} de fevereiro de 2026 — ${WEEKDAYS[dateNum] || ""}`
    : "";

  return (
    <div className="min-h-screen relative">
      {/* Background — blurred Rio carnival */}
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

        {/* Info sections */}
        <div className="mx-4 space-y-3">
          {/* Basic info card */}
          <InfoCard>
            <InfoRow icon={Clock} label="Horário" value={extra?.horarioCompleto || `${bloco.startHour}h — Concentração`} />
            <InfoRow icon={MapPin} label="Endereço" value={extra?.endereco || bloco.location} />
            <InfoRow icon={Sparkles} label="Vibe" value={bloco.vibe} />
            <InfoRow icon={Users} label="Público" value={extra?.publicoDetalhado || bloco.publico} />
            <InfoRow icon={Music} label="Música" value={extra?.musicaDetalhada || bloco.musica} />
          </InfoCard>

          {/* Como chegar */}
          {extra?.comoChegar && (
            <InfoCard title="Como chegar">
              <div className="flex items-start gap-3">
                <Navigation className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
                <p className="text-sm text-white/90 leading-relaxed">{extra.comoChegar}</p>
              </div>
            </InfoCard>
          )}

          {/* Dicas práticas */}
          {extra?.dicas && extra.dicas.length > 0 && (
            <InfoCard title="Dicas práticas">
              <div className="space-y-3">
                {extra.dicas.map((dica, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {i === 0 ? <ShieldCheck className="w-4 h-4 text-white/60 shrink-0 mt-0.5" /> : <Lightbulb className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />}
                    <p className="text-sm text-white/90 leading-relaxed">{dica}</p>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}
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

/* Reusable glass card */
const InfoCard = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-4">
    {title && <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">{title}</h2>}
    {children}
  </div>
);

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
    <div>
      <span className="text-[11px] text-white/40 uppercase tracking-wider block">{label}</span>
      <span className="text-sm text-white leading-relaxed">{value}</span>
    </div>
  </div>
);

export default BlocoInfo;
