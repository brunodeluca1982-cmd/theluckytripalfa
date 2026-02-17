import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Check, Share2, MapPin, Crown, Users, Sparkles, Camera } from "lucide-react";
import { honestRanking, strategicCategories, type Camarote } from "@/data/camarotes-data";
import { useItemSave } from "@/hooks/use-item-save";
import { upsertSavedItem, removeSavedItem, isItemSaved } from "@/hooks/use-saved-items";
import { useState, useEffect, useMemo } from "react";
import carnavalBlocoBg from "@/assets/highlights/carnaval-bloco-bg.jpeg";

function camaroteToSavedItem(cam: Camarote) {
  return {
    id: cam.id,
    type: "activity" as const,
    title: cam.name,
    neighborhood_full: "Marquês de Sapucaí",
    neighborhood_short: "Sapucaí",
    vibe_one_word: "camarote",
    location_label: "Sambódromo da Marquês de Sapucaí",
    gmaps_url: "https://www.google.com/maps/search/?api=1&query=Samb%C3%B3dromo+Marqu%C3%AAs+de+Sapuca%C3%AD+Rio+de+Janeiro",
    notes_full: `${cam.reality} | ${cam.whatToExpect}`,
    created_at: new Date().toISOString(),
    rsvp: false,
  };
}

const iconMap: Record<string, React.ReactNode> = {
  crown: <Crown className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
};

const CamaroteDetail = () => {
  const { id } = useParams();
  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);

  const cam = honestRanking.find((c) => c.id === id);

  // Find which strategic categories mention this camarote
  const relevantCategories = useMemo(() => {
    if (!cam) return [];
    return strategicCategories.filter((cat) =>
      cat.camarotes.some((c) => c.name === cam.name)
    );
  }, [cam]);

  useEffect(() => {
    if (!cam) return;
    setIsSaved(isItemSaved(cam.id, "activity"));
  }, [cam]);

  const handleToggleSave = () => {
    if (!cam) return;
    if (isSaved) {
      removeSavedItem(cam.id, "activity");
      setIsSaved(false);
    } else {
      saveItem(cam.id, "activity", cam.name, false);
      upsertSavedItem(camaroteToSavedItem(cam));
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    if (!cam) return;
    const text = `${cam.name} — Camarote Sapucaí\n${cam.energy}\n${cam.reality}`;
    if (navigator.share) {
      navigator.share({ title: cam.name, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  if (!cam) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Camarote não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${carnavalBlocoBg})`, filter: "blur(6px) contrast(0.9)", transform: "scale(1.05)" }} />
      <div className="fixed inset-0 bg-black/55" />

      <div className="relative z-10 pb-28">
        <header className="px-5 pt-14 pb-4 flex items-center justify-between">
          <Link to="/camarotes" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm">
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
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-3">
            {cam.energy}
          </span>
          <h1 className="text-3xl font-serif font-semibold text-white tracking-tight">{cam.name}</h1>
          <p className="text-white/40 text-xs mt-2">📍 Sambódromo da Marquês de Sapucaí</p>
        </div>

        {/* Tags */}
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs backdrop-blur-md bg-white/10 text-white/60 border border-white/15">🎭 Camarote</span>
          <span className="px-3 py-1 rounded-full text-xs backdrop-blur-md bg-white/10 text-white/60 border border-white/15">💎 Premium</span>
          <span className="px-3 py-1 rounded-full text-xs backdrop-blur-md bg-white/10 text-white/60 border border-white/15">🌙 Noite</span>
        </div>

        {/* Reality */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-4 mb-3">
          <h3 className="text-sm font-semibold text-white">🎯 Leitura Honesta</h3>
          <p className="text-sm text-white/80 italic leading-relaxed">"{cam.reality}"</p>
        </div>

        {/* Details */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-4 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">👥 Quem frequenta</h3>
            <p className="text-sm text-white/80 leading-relaxed">{cam.whoAttends}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">✨ O que esperar</h3>
            <p className="text-sm text-white/80 leading-relaxed">{cam.whatToExpect}</p>
          </div>
        </div>

        {/* Strategic categories */}
        {relevantCategories.length > 0 && (
          <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-3 mb-3">
            <h3 className="text-sm font-semibold text-white mb-2">🏆 Destaque em</h3>
            {relevantCategories.map((cat) => {
              const entry = cat.camarotes.find((c) => c.name === cam.name);
              return (
                <div key={cat.id} className="flex items-start gap-3 py-2">
                  <span className="text-amber-400 mt-0.5">{iconMap[cat.icon]}</span>
                  <div>
                    <p className="text-sm text-white font-medium">{cat.label}</p>
                    {entry && <p className="text-xs text-white/60 mt-0.5">{entry.reason}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Practical info */}
        <div className="mx-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-5 space-y-2 mb-3">
          <h3 className="text-sm font-semibold text-white mb-2">📋 Info prática</h3>
          <div className="text-sm text-white/80 space-y-1">
            <p><span className="text-white/50">Datas:</span> 17 de fevereiro, 2026</p>
            <p><span className="text-white/50">Horário:</span> A partir de 20h</p>
            <p><span className="text-white/50">Local:</span> Sambódromo da Marquês de Sapucaí</p>
            <p><span className="text-white/50">Perfil:</span> {cam.whoAttends}</p>
          </div>
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

        {/* You may also like */}
        <div className="mx-4 mt-6">
          <h3 className="text-sm font-semibold text-white mb-3">Você também pode gostar</h3>
          <div className="space-y-2">
            {honestRanking.filter((c) => c.id !== cam.id).slice(0, 3).map((other) => (
              <Link
                key={other.id}
                to={`/camarote/${other.id}`}
                className="flex items-center gap-3 rounded-2xl backdrop-blur-xl bg-white/8 border border-white/15 p-4 hover:bg-white/15 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{other.name}</p>
                  <p className="text-xs text-white/50">{other.energy}</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-white/30 rotate-180" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamaroteDetail;
