import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Clock, Check, Share2, MapPin } from "lucide-react";
import { getFestaById, festasData } from "@/data/festas-bailes-data";
import { formatCarnavalDateFull } from "@/lib/carnaval-date-utils";
import { useItemSave } from "@/hooks/use-item-save";
import { upsertSavedItem, removeSavedItem, isItemSaved } from "@/hooks/use-saved-items";
import { useState, useEffect } from "react";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

function festaToSavedItem(festa: ReturnType<typeof getFestaById>, rsvp: boolean) {
  if (!festa) return null;
  // Determine if this festa has a fixed time
  const hasFixedTime = festa.time !== "TBD" && /^\d{2}:\d{2}$/.test(festa.time);
  return {
    id: festa.id,
    type: "festa" as const,
    title: festa.name,
    date_iso: festa.dateISO,
    start_time_24h: festa.time,
    start_hour_display: festa.timeDisplay,
    neighborhood_full: festa.neighborhood,
    neighborhood_short: festa.neighborhood,
    vibe_one_word: festa.tag,
    location_label: festa.location,
    gmaps_url: festa.gmapsUrl || null,
    gmaps_urls: festa.gmapsUrl ? [festa.gmapsUrl] : [],
    notes_full: [festa.description, festa.music].filter(Boolean).join(" | "),
    created_at: new Date().toISOString(),
    rsvp,
    priority: hasFixedTime ? "fixed" as const : "preferred" as const,
  };
}

const FestaDetalhe = () => {
  const { id } = useParams();
  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const festa = id ? getFestaById(id) : undefined;

  useEffect(() => {
    if (!festa) return;
    setIsSaved(isItemSaved(festa.id, "festa"));
  }, [festa]);

  const handleToggleSave = () => {
    if (!festa) return;
    if (isSaved) {
      removeSavedItem(festa.id, "festa");
      try {
        const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
        localStorage.setItem("draft-roteiro", JSON.stringify(draft.filter((i: { id: string }) => i.id !== festa.id)));
      } catch {}
      setIsSaved(false);
    } else {
      saveItem(festa.id, "activity", festa.name, false);
      const record = festaToSavedItem(festa, true);
      if (record) upsertSavedItem(record);
      setIsSaved(true);
    }
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (!festa) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Evento não encontrado.</p>
      </div>
    );
  }

  const fullDate = formatCarnavalDateFull(festa.dateISO);

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(6px) contrast(0.9)", transform: "scale(1.05)" }}
      />
      <div className="fixed inset-0 bg-black/55" />

      <div className="relative z-10 pb-28">
        {/* Header */}
        <header className="px-5 pt-14 pb-4 flex items-center justify-between">
          <Link
            to="/festas-bailes"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const text = `${festa.name} — ${festa.neighborhood}\n${fullDate}`;
                navigator.share ? navigator.share({ title: festa.name, text }) : navigator.clipboard.writeText(text);
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

        {/* Event Header */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-4 h-4 text-white/50" />
            <span className="text-white/70 text-sm font-medium">{festa.timeDisplay}h</span>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">{festa.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <span className="text-sm text-white/70">📍 {festa.neighborhood}</span>
            <span className="text-sm text-white/50 italic">✨ {festa.tag}</span>
          </div>
          <p className="text-xs text-white/40 mt-2">{fullDate}</p>
        </div>

        {/* Location */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-3 mb-3">
          <div>
            <p className="text-xs text-white/50 font-semibold uppercase tracking-wider mb-1">📌 Local</p>
            {festa.gmapsUrl ? (
              <a
                href={festa.gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-300 underline underline-offset-2"
              >
                {festa.location}
              </a>
            ) : (
              <p className="text-sm text-white/80">{festa.location}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">🎉 Sobre</h3>
            <p className="text-sm text-white/80 leading-relaxed">{festa.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">🎶 Estilo musical</h3>
            <p className="text-sm text-white/80 leading-relaxed">{festa.music}</p>
          </div>
        </div>

        {/* Google Maps button */}
        {festa.gmapsUrl && (
          <div className="mx-4 mt-3">
            <a
              href={festa.gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Abrir no Maps
            </a>
          </div>
        )}

        {/* You may also like */}
        {(() => {
          const others = festasData.filter((f) => f.id !== festa.id).slice(0, 3);
          if (others.length === 0) return null;
          return (
            <div className="mx-4 mt-6">
              <h3 className="text-sm font-semibold text-white mb-3">Você também pode gostar</h3>
              <div className="space-y-2">
                {others.map((other) => (
                  <Link
                    key={other.id}
                    to={`/festa-detalhe/${other.id}`}
                    className="flex items-center gap-3 rounded-2xl backdrop-blur-xl bg-white/8 border border-white/15 p-4 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{other.name}</p>
                      <p className="text-xs text-white/50">📍 {other.neighborhood} · {other.timeDisplay}h</p>
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

export default FestaDetalhe;
