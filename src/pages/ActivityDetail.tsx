import { Link, useParams, useSearchParams } from "react-router-dom";
import { Clock, Zap, Loader2, MapPin, ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemSave } from "@/hooks/use-item-save";
import { useOQueFazerItem } from "@/hooks/use-o-que-fazer";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DetailHeroLayout from "@/components/detail/DetailHeroLayout";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function isActivitySavedLocally(activityId: string) {
  const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
  return draft.some((item: { id: string; type: string }) => item.id === activityId && item.type === "activity");
}

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();
  const { data: item, isLoading } = useOQueFazerItem(id);

  const from = searchParams.get("from");
  const backPath = from === "city" ? "/o-que-fazer" : from ? `/o-que-fazer/${from}` : "/o-que-fazer";

  const placeQuery = buildPlaceQuery(item?.nome || "", item?.bairro || undefined);
  const itemSlug = item ? slugify(item.nome) : "";
  const { photoUrl } = usePlacePhoto(itemSlug, "attraction", placeQuery, !!item);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) setIsSaved(isActivitySavedLocally(id));
  }, [id]);

  const handleSave = () => {
    if (!item) return;
    saveItem(item.id, "activity", item.nome, false);
    setIsSaved(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <header className="px-6 py-4 border-b border-border">
          <Link to="/o-que-fazer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Voltar
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <p className="text-lg text-foreground font-medium mb-2">Atividade não encontrada</p>
          <Button asChild variant="outline">
            <Link to="/o-que-fazer">Voltar para O Que Fazer</Link>
          </Button>
        </div>
      </div>
    );
  }

  const pills = [item.categoria, item.bairro, item.vibe].filter(Boolean) as string[];

  return (
    <DetailHeroLayout
      backPath={backPath}
      title={item.nome}
      pills={pills}
      heroImageUrl={photoUrl || undefined}
      isSaved={isSaved}
      onSave={handleSave}
      footer={`The Lucky Trip — ${item.bairro || "Rio de Janeiro"}`}
    >
      {/* Meu olhar */}
      {item.meu_olhar && (
        <div className="space-y-3 mb-6">
          {item.meu_olhar.split("\n").map((paragraph, index) => (
            <p key={index} className="text-base text-white/75 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      )}

      {/* Como fazer */}
      {item.como_fazer && (
        <div className="mb-6 space-y-1.5">
          <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Como fazer</p>
          {item.como_fazer.split("\n").filter(Boolean).map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] text-white/30 font-mono mt-0.5 flex-shrink-0">{i + 1}.</span>
              <p className="text-sm text-white/60 leading-relaxed">{step.trim()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Metadata pills */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {item.duracao_media && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">
            <Clock className="w-3 h-3" /> {item.duracao_media}
          </span>
        )}
        {item.energia && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">
            <Zap className="w-3 h-3" /> {item.energia}
          </span>
        )}
        {item.momento_ideal && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">
            🕐 {item.momento_ideal}
          </span>
        )}
      </div>

      {/* Google Maps */}
      {item.google_maps && (
        <a
          href={item.google_maps}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Ver no Google Maps
          <ExternalLink className="w-3 h-3 opacity-50" />
        </a>
      )}

      {/* Lucky List teaser */}
      {item.momento_lucky_list && (
        <Link
          to="/lucky-list"
          className="relative block mt-6 rounded-xl overflow-hidden border border-white/15"
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
    </DetailHeroLayout>
  );
};

export default ActivityDetail;
