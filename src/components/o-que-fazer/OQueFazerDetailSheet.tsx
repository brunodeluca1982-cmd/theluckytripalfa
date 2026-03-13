import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MapPin, ExternalLink, Clock, Zap, Bookmark, ChevronLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import type { OQueFazerItem } from "@/hooks/use-o-que-fazer";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useItemSave } from "@/hooks/use-item-save";
import { useState, useEffect } from "react";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function isActivitySavedLocally(activityId: string) {
  const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
  return draft.some((item: { id: string; type: string }) => item.id === activityId && item.type === "activity");
}

interface OQueFazerDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: OQueFazerItem | null;
}

const OQueFazerDetailSheet = ({ open, onOpenChange, item }: OQueFazerDetailSheetProps) => {
  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);

  const placeQuery = buildPlaceQuery(item?.nome || "", item?.bairro || undefined);
  const itemSlug = item ? slugify(item.nome) : "";
  const { photoUrl } = usePlacePhoto(itemSlug, "attraction", placeQuery, !!item);

  useEffect(() => {
    if (item) setIsSaved(isActivitySavedLocally(item.id));
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    saveItem(item.id, "activity", item.nome, false);
    setIsSaved(true);
  };

  // Get first 2-3 sentences of meu_olhar as excerpt
  const excerpt = item.meu_olhar
    ? item.meu_olhar.split("\n")[0].slice(0, 220) + (item.meu_olhar.length > 220 ? "…" : "")
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] p-0 rounded-t-2xl border-t border-white/15 bg-transparent">
        <div className="flex flex-col h-full backdrop-blur-2xl bg-black/85 rounded-t-2xl">
          {/* Handle bar */}
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 rounded-full bg-white/25" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            {/* Hero Image */}
            {photoUrl && (
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                <img src={photoUrl} alt={item.nome} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Category + Bairro */}
            <div className="flex items-center gap-2 mb-1">
              {item.categoria && (
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">{item.categoria}</span>
              )}
              {item.bairro && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">{item.bairro}</span>
                </>
              )}
            </div>

            {/* Name */}
            <h2 className="text-2xl font-serif font-medium text-white leading-snug mb-3">
              {item.nome}
            </h2>

            {/* Excerpt of meu_olhar */}
            {excerpt && (
              <p className="text-sm text-white/65 leading-relaxed mb-5">
                {excerpt}
              </p>
            )}

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {item.vibe && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-white/60 border border-white/10">
                  {item.vibe}
                </span>
              )}
              {item.duracao_media && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-white/60 border border-white/10">
                  <Clock className="w-3 h-3" /> {item.duracao_media}
                </span>
              )}
              {item.energia && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-white/60 border border-white/10">
                  <Zap className="w-3 h-3" /> {item.energia}
                </span>
              )}
              {item.momento_ideal && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-white/60 border border-white/10">
                  🕐 {item.momento_ideal}
                </span>
              )}
            </div>

            {/* Tags IA */}
            {item.tags_ia && item.tags_ia.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {item.tags_ia.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-white/8 text-[10px] text-white/45 border border-white/8">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Como fazer (steps) */}
            {item.como_fazer && (
              <div className="mb-5 space-y-1.5">
                <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Como fazer</p>
                {item.como_fazer.split("\n").filter(Boolean).map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[10px] text-white/30 font-mono mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <p className="text-xs text-white/55 leading-relaxed">{step.trim()}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5 mt-2">
              {item.google_maps && (
                <a
                  href={item.google_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/8 border border-white/12 hover:bg-white/12 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/80 flex-1">Ver no mapa</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/30" />
                </a>
              )}

              <button
                onClick={handleSave}
                disabled={isSaved}
                className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/8 border border-white/12 hover:bg-white/12 transition-colors disabled:opacity-50"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "text-primary fill-primary" : "text-white/60"}`} />
                <span className="text-sm text-white/80 flex-1 text-left">
                  {isSaved ? "Salvo na viagem" : "Salvar na viagem"}
                </span>
              </button>

              <Link
                to={`/atividade/${item.id}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/8 border border-white/12 hover:bg-white/12 transition-colors"
              >
                <span className="text-sm text-white/80 flex-1">Ver página completa</span>
                <ChevronLeft className="w-3.5 h-3.5 text-white/30 rotate-180" />
              </Link>
            </div>

            {/* Lucky List teaser */}
            {item.momento_lucky_list && (
              <Link
                to="/lucky-list"
                onClick={() => onOpenChange(false)}
                className="relative block mt-5 rounded-xl overflow-hidden border border-white/15"
              >
                <div className="px-4 py-3 backdrop-blur-xl bg-white/5 select-none" style={{ filter: "blur(5px)" }}>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{item.momento_lucky_list}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px]">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20">
                    <Lock className="w-3 h-3 text-white/70" />
                    <span className="text-[11px] font-medium text-white/85 tracking-wide">Descubra o momento certo</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OQueFazerDetailSheet;
