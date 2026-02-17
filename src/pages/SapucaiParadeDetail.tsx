import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Clock, Check, ExternalLink, Music, Crown, Share2, MapPin } from "lucide-react";
import { sapucaiParades, type SapucaiParade } from "@/data/sapucai-parades-data";
import { useItemSave } from "@/hooks/use-item-save";
import { upsertSavedItem, removeSavedItem, isItemSaved } from "@/hooks/use-saved-items";
import { useState, useEffect } from "react";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

function paradeToSavedItem(parade: SapucaiParade) {
  return {
    id: parade.id,
    type: "activity" as const,
    title: parade.school_name,
    date_iso: parade.date_iso,
    start_time_24h: parade.start_time_24h,
    start_hour_display: parade.start_hour_display,
    neighborhood_full: "Marquês de Sapucaí",
    neighborhood_short: "Sapucaí",
    vibe_one_word: "desfile",
    location_label: "Sambódromo da Marquês de Sapucaí",
    gmaps_url: "https://www.google.com/maps/search/?api=1&query=Samb%C3%B3dromo+Marqu%C3%AAs+de+Sapuca%C3%AD+Rio+de+Janeiro",
    notes_full: `${parade.group_name} | ${parade.vibe_details}`,
    created_at: new Date().toISOString(),
    rsvp: false,
    priority: "fixed" as const,
  };
}

const SapucaiParadeDetail = () => {
  const { id } = useParams();
  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);

  const parade = sapucaiParades.find((p) => p.id === id);

  useEffect(() => {
    if (!parade) return;
    setIsSaved(isItemSaved(parade.id, "activity"));
  }, [parade]);

  const handleToggleSave = () => {
    if (!parade) return;
    if (isSaved) {
      removeSavedItem(parade.id, "activity");
      setIsSaved(false);
    } else {
      saveItem(parade.id, "activity", parade.school_name, false);
      const record = paradeToSavedItem(parade);
      upsertSavedItem(record);
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    if (!parade) return;
    const text = `${parade.school_name} — ${parade.group_name}\n${parade.date_display}\nHorário: ${parade.start_hour_display}`;
    if (navigator.share) {
      navigator.share({ title: parade.school_name, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  if (!parade) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Desfile não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(6px) contrast(0.9)", transform: "scale(1.05)" }} />
      <div className="fixed inset-0 bg-black/55" />

      <div className="relative z-10 pb-28">
        <header className="px-5 pt-14 pb-4 flex items-center justify-between">
          <Link to="/desfiles-sapucai" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="inline-flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white/70 hover:bg-white/20">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isSaved
                  ? "backdrop-blur-md bg-white/20 text-white/70 border border-white/20"
                  : "backdrop-blur-md bg-white/15 text-white border border-white/25 hover:bg-white/25 active:scale-95"
              }`}
            >
              {isSaved ? <><Check className="w-3.5 h-3.5" /> Salvo</> : "Salvar"}
            </button>
          </div>
        </header>

        {/* Header */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-white/15 text-white/70 border border-white/20">
              {parade.group_name}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">{parade.school_name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-white/50" />
              <span className="text-white/70 text-sm">{parade.start_hour_display}</span>
            </div>
            <span className="text-white/40 text-xs">{parade.date_display}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs backdrop-blur-md bg-white/10 text-white/60 border border-white/15">📍 Sapucaí</span>
          <span className="px-3 py-1 rounded-full text-xs backdrop-blur-md bg-white/10 text-white/60 border border-white/15">🎭 Desfile</span>
          <span className="px-3 py-1 rounded-full text-xs backdrop-blur-md bg-white/10 text-white/60 border border-white/15">🌙 Noite</span>
        </div>

        {/* Vibe */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-4 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">🔥 Por que vale a pena</h3>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{parade.vibe_details}</p>
          </div>
        </div>

        {/* Samba-enredo */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-4 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-4 h-4 text-white/50" />
            <h3 className="text-sm font-semibold text-white">Samba-enredo</h3>
          </div>
          <p className="text-sm text-white/90 font-medium">{parade.samba_title}</p>
          {parade.samba_summary !== "—" && <p className="text-sm text-white/70">{parade.samba_summary}</p>}
          {parade.samba_excerpt !== "—" && <p className="text-sm text-white/60 italic">"{parade.samba_excerpt}"</p>}
          {parade.samba_full_lyrics_url && (
            <a href={parade.samba_full_lyrics_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-300 text-xs">
              <ExternalLink className="w-3 h-3" /> Letra completa
            </a>
          )}
        </div>

        {/* Musas & Rainhas */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-3 mb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-white/50" />
            <h3 className="text-sm font-semibold text-white">Musas e Rainhas</h3>
          </div>
          <p className="text-sm text-white/80 whitespace-pre-line">{parade.muses_and_queens}</p>
        </div>

        {/* Practical info */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-3 mb-3">
          <h3 className="text-sm font-semibold text-white mb-2">📋 Info prática</h3>
          <div className="space-y-2 text-sm text-white/80">
            <p><span className="text-white/50">Data:</span> {parade.date_display}</p>
            <p><span className="text-white/50">Horário:</span> {parade.start_hour_display}</p>
            <p><span className="text-white/50">Local:</span> Sambódromo da Marquês de Sapucaí</p>
            <p><span className="text-white/50">Perfil:</span> Todos os públicos</p>
          </div>
          <p className="text-sm text-white/70 whitespace-pre-line mt-3">{parade.how_to_get_there}</p>
        </div>

        {/* Action buttons */}
        <div className="mx-4 flex gap-3">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Samb%C3%B3dromo+Marqu%C3%AAs+de+Sapuca%C3%AD+Rio+de+Janeiro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Abrir no Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default SapucaiParadeDetail;
