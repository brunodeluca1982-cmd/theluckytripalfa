import { useParams, useSearchParams, Link } from "react-router-dom";
import { ChevronLeft, Clock, Check, Share2, MapPin } from "lucide-react";
import { getBlockById, getBlocksByDate } from "@/data/carnival-blocks";
import { formatCarnavalDateFull } from "@/lib/carnaval-date-utils";
import { useItemSave } from "@/hooks/use-item-save";
import { upsertSavedItem, removeSavedItem, isItemSaved } from "@/hooks/use-saved-items";
import { useState, useEffect } from "react";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/** Build a normalized SavedItemRecord from a CarnivalBlock */
function blockToSavedItem(bloco: ReturnType<typeof getBlockById>, rsvp: boolean) {
  if (!bloco) return null;
  const addr = bloco.extraDetails?.concentration || bloco.address || bloco.neighborhood;
  return {
    id: bloco.id,
    type: "block" as const,
    title: bloco.name,
    date_iso: bloco.dateISO,
    start_time_24h: bloco.time,
    start_hour_display: String(parseInt(bloco.time)),
    neighborhood_full: bloco.neighborhood,
    neighborhood_short: bloco.neighborhoodShort,
    vibe_one_word: bloco.tag,
    location_label: addr,
    gmaps_url: mapsUrl(addr + ", Rio de Janeiro"),
    notes_full: [
      bloco.shortDescription,
      bloco.extraDetails?.vibe?.join(" "),
      bloco.extraDetails?.my_reading?.join(" "),
    ].filter(Boolean).join(" | "),
    created_at: new Date().toISOString(),
    rsvp,
  };
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
    setIsSaved(isItemSaved(bloco.id, "block"));
  }, [bloco]);

  const handleToggleSave = () => {
    if (!bloco) return;

    if (isSaved) {
      // Remove from SavedItems
      removeSavedItem(bloco.id, "block");
      // Also remove from legacy draft-roteiro
      try {
        const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
        const filtered = draft.filter((item: { id: string }) => item.id !== bloco.id);
        localStorage.setItem("draft-roteiro", JSON.stringify(filtered));
      } catch {}
      setIsSaved(false);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    } else {
      // Legacy save
      saveItem(bloco.id, "activity", bloco.name, false);
      // Normalized save with rsvp=true
      const record = blockToSavedItem(bloco, true);
      if (record) upsertSavedItem(record);
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const text = `${bloco.name} — ${bloco.neighborhood}\n${fullDate}`;
                navigator.share ? navigator.share({ title: bloco.name, text }) : navigator.clipboard.writeText(text);
              }}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white/70 hover:bg-white/20"
            >
              <Share2 className="w-4 h-4" />
            </button>
          <button
            onClick={handleToggleSave}
            
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
          </div>
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
              <a href={mapsUrl(extra.concentration + ", Rio de Janeiro")} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-300 underline underline-offset-2">{extra.concentration}</a>
            </div>
          )}
          {extra?.route && (
            <div>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">📌 Percurso</p>
              <a href={mapsUrl(extra.route + ", Rio de Janeiro")} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-300 underline underline-offset-2">{extra.route}</a>
            </div>
          )}
          {extra?.dispersal && (
            <div>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">📌 Dispersão</p>
              <a href={mapsUrl(extra.dispersal + ", Rio de Janeiro")} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-300 underline underline-offset-2">{extra.dispersal}</a>
            </div>
          )}
          {!extra?.concentration && bloco.address && (
            <div>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">📌 Endereço</p>
              <a href={mapsUrl(bloco.address + ", Rio de Janeiro")} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-300 underline underline-offset-2">{bloco.address}</a>
            </div>
          )}
        </div>

        {/* 4️⃣ Content Sections */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-5">
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
          {extra?.vibe && (
            <Section title="🔥 A vibe">
              <ul className="space-y-1.5">
                {extra.vibe.map((v, i) => (
                  <li key={i} className="text-sm text-white/80 leading-relaxed">• {v}</li>
                ))}
              </ul>
            </Section>
          )}
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
          {extra?.end_time && (
            <Section title="⏰ Termina por volta de">
              <p className="text-sm text-white/80 leading-relaxed">
                {Array.isArray(extra.end_time) ? extra.end_time.join(" ") : extra.end_time}
              </p>
            </Section>
          )}
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

        {/* Google Maps button */}
        <div className="mx-4 mt-3">
          <a
            href={mapsUrl((extra?.concentration || bloco.address || bloco.neighborhood) + ", Rio de Janeiro")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Abrir no Maps
          </a>
        </div>

        {/* You may also like */}
        {(() => {
          const others = getBlocksByDate(date).filter((b) => b.id !== bloco.id).slice(0, 3);
          if (others.length === 0) return null;
          return (
            <div className="mx-4 mt-6">
              <h3 className="text-sm font-semibold text-white mb-3">Você também pode gostar</h3>
              <div className="space-y-2">
                {others.map((other) => (
                  <Link
                    key={other.id}
                    to={`/bloco-detalhe/${other.id}?date=${date}`}
                    className="flex items-center gap-3 rounded-2xl backdrop-blur-xl bg-white/8 border border-white/15 p-4 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-white/50" />
                      <span className="text-white/70 text-xs">{parseInt(other.time)}h</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{other.name}</p>
                      <p className="text-xs text-white/50">📍 {other.neighborhoodShort || other.neighborhood}</p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-white/30 rotate-180 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
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
