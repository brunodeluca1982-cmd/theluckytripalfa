import { useParams, useSearchParams, Link } from "react-router-dom";
import { ChevronLeft, Clock, Check, Plus } from "lucide-react";
import { getBlockById } from "@/data/carnival-blocks";
import { formatCarnavalDateFull } from "@/lib/carnaval-date-utils";
import { useItemSave } from "@/hooks/use-item-save";
import { useState, useEffect } from "react";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const BlocoDetalhe = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date") || "";
  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const bloco = id ? getBlockById(id) : undefined;

  useEffect(() => {
    if (!bloco) return;
    const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
    setIsSaved(draft.some((item: { id: string }) => item.id === bloco.id));
  }, [bloco]);

  const handleSave = () => {
    if (!bloco || isSaved) return;
    const success = saveItem(bloco.id, "activity", bloco.name, false);
    if (success) {
      setIsSaved(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  if (!bloco) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Bloco não encontrado.</p>
      </div>
    );
  }

  const fullDate = date ? formatCarnavalDateFull(date) : "";
  const hour = parseInt(bloco.time);
  const extra = bloco.extraDetails;

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(6px) contrast(0.9)", transform: "scale(1.05)" }}
      />
      <div className="fixed inset-0 bg-black/55" />

      <div className="relative z-10 pb-28">
        {/* 1️⃣ Header */}
        <header className="px-5 pt-14 pb-4 flex items-center justify-between">
          <Link
            to={`/blocos-dia?date=${date}`}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              isSaved
                ? "backdrop-blur-md bg-white/20 text-white/70 border border-white/20"
                : "backdrop-blur-md bg-white/15 text-white border border-white/25 hover:bg-white/25 active:scale-95"
            } ${isAnimating ? "scale-105" : ""}`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Adicionado
              </>
            ) : (
              "Eu vou"
            )}
          </button>
        </header>

        {/* 2️⃣ Block Header */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-4 h-4 text-white/50" />
            <span className="text-white/70 text-sm font-medium">{hour}h</span>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">{bloco.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <span className="text-sm text-white/70">📍 {bloco.neighborhood}</span>
            {bloco.tag && <span className="text-sm text-white/50 italic">✨ {bloco.tag}</span>}
          </div>
          {fullDate && <p className="text-xs text-white/40 mt-2">{fullDate}</p>}
        </div>

        {/* 3️⃣ Address Section – Google Maps links */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-3 mb-3">
          {extra?.concentration && (
            <div>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">📌 Concentração</p>
              <a
                href={mapsUrl(extra.concentration + ", Rio de Janeiro")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-300 underline underline-offset-2"
              >
                {extra.concentration}
              </a>
            </div>
          )}
          {extra?.dispersal && (
            <div>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">📌 Dispersão</p>
              <a
                href={mapsUrl(extra.dispersal + ", Rio de Janeiro")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-300 underline underline-offset-2"
              >
                {extra.dispersal}
              </a>
            </div>
          )}
          {!extra?.concentration && bloco.address && (
            <div>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">📌 Endereço</p>
              <a
                href={mapsUrl(bloco.address + ", Rio de Janeiro")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-300 underline underline-offset-2"
              >
                {bloco.address}
              </a>
            </div>
          )}
        </div>

        {/* 4️⃣ Content Sections */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-5">
          {/* Como eu chego */}
          {(extra?.how_to_get_full || bloco.howToGetShort) && (
            <Section title="🚇 Como eu chego">
              {extra?.how_to_get_full ? (
                <ul className="space-y-1.5">
                  {extra.how_to_get_full.map((v, i) => (
                    <li key={i} className="text-sm text-white/80 leading-relaxed">• {v}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/80 leading-relaxed">{bloco.howToGetShort}</p>
              )}
            </Section>
          )}

          {/* A vibe */}
          {extra?.vibe && (
            <Section title="🔥 A vibe">
              <ul className="space-y-1.5">
                {extra.vibe.map((v, i) => (
                  <li key={i} className="text-sm text-white/80 leading-relaxed">• {v}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Estilo musical */}
          {(extra?.music_style || bloco.musicShort) && (
            <Section title="🎶 Estilo musical">
              {extra?.music_style ? (
                <ul className="space-y-1.5">
                  {extra.music_style.map((v, i) => (
                    <li key={i} className="text-sm text-white/80 leading-relaxed">• {v}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/80 leading-relaxed">{bloco.musicShort}</p>
              )}
            </Section>
          )}

          {/* Estrutura */}
          {extra?.structure && (
            <Section title="🏗 Estrutura">
              {Array.isArray(extra.structure) ? (
                <ul className="space-y-1.5">
                  {extra.structure.map((v, i) => (
                    <li key={i} className="text-sm text-white/80 leading-relaxed">• {v}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/80 leading-relaxed">{extra.structure}</p>
              )}
            </Section>
          )}

          {/* Termina por volta de */}
          {extra?.end_time && (
            <Section title="⏰ Termina por volta de">
              <p className="text-sm text-white/80 leading-relaxed">
                {Array.isArray(extra.end_time) ? extra.end_time.join(" ") : extra.end_time}
              </p>
            </Section>
          )}

          {/* Minha leitura */}
          {extra?.my_reading && (
            <Section title="🎯 Minha leitura">
              <ul className="space-y-1.5">
                {extra.my_reading.map((v, i) => (
                  <li key={i} className="text-sm text-white/80 leading-relaxed">• {v}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      {children}
    </div>
  );
}

export default BlocoDetalhe;
