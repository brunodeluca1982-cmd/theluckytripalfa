import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Clock, Baby, Shield, Loader2, Bookmark, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemSave } from "@/hooks/use-item-save";
import { activitiesByNeighborhood, cityLevelActivities, Activity } from "@/data/what-to-do-data";
import { guideActivities } from "@/data/rio-guide-data";
import { getAttractionImage } from "@/data/place-images";
import { useExternalExperiencias, normalizeNeighborhood } from "@/hooks/use-external-experiencias";
import type { ExternalExperiencia } from "@/hooks/use-external-experiencias";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const guideIdToWhatToDoId: Record<string, string> = {
  "praia-ipanema": "praia-ipanema",
  "por-sol-arpoador": "por-do-sol-arpoador",
  "sup-arpoador": "sup-arpoador",
  "pista-coutinho": "pista-coutinho",
  "trilha-urca": "trilha-urca",
  "mureta-urca": "mureta-urca",
  "pao-acucar": "pao-de-acucar",
  "jardim-botanico": "jardim-botanico-parque",
  "parque-lage": "parque-lage",
  "voo-livre": "voo-asa-delta",
  "pedra-bonita": "pedra-bonita",
  "pedra-gavea": "pedra-gavea",
  "cristo-redentor": "cristo-redentor",
  "ciclovia-barra": "ciclovia-barra",
  "por-sol-pier": "por-do-sol-pier-barra",
  "prainha": "prainha",
  "grumari": "grumari",
  "ccbb": "ccbb-rio",
  "museu-amanha": "museu-amanha",
  "aquario": "aquario",
  "rua-mercado": "rua-do-mercado",
  "bondinho-st": "bondinho-st",
};

const findStaticActivityById = (
  id: string
): { activity: Activity; neighborhoodName: string; neighborhoodId: string } | null => {
  const mappedId = guideIdToWhatToDoId[id] || id;
  for (const [neighborhoodId, data] of Object.entries(activitiesByNeighborhood)) {
    const activity = data.activities.find((a) => a.id === mappedId);
    if (activity) return { activity, neighborhoodName: data.neighborhoodName, neighborhoodId };
  }
  const cityActivity = cityLevelActivities.find((a) => a.id === mappedId);
  if (cityActivity) {
    return {
      activity: { id: cityActivity.id, title: cityActivity.title, category: "Experiência Icônica", description: cityActivity.description },
      neighborhoodName: "Rio de Janeiro",
      neighborhoodId: "city",
    };
  }
  const guideActivity = guideActivities.find((a) => a.id === id || a.id === mappedId);
  if (guideActivity) {
    return {
      activity: { id: guideActivity.id, title: guideActivity.name, category: guideActivity.category, description: guideActivity.description },
      neighborhoodName: guideActivity.neighborhood,
      neighborhoodId: guideActivity.neighborhood.toLowerCase().replace(/\s+/g, "-"),
    };
  }
  return null;
};

interface MediaRow { type: "image" | "video"; url: string; title?: string; }

function useExperienciaMedia(experienciaId: string | undefined) {
  return useQuery({
    queryKey: ["experiencia-media", experienciaId],
    queryFn: async (): Promise<MediaRow[]> => {
      if (!experienciaId) return [];
      const { data, error } = await supabase
        .from("experiencia_media")
        .select("type, url")
        .eq("experiencia_id", experienciaId)
        .order("ordem", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MediaRow[];
    },
    enabled: !!experienciaId,
    staleTime: 5 * 60 * 1000,
  });
}

function useExperienceMediaBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["experience-media-slug", slug],
    queryFn: async (): Promise<MediaRow[]> => {
      if (!slug) return [];
      const { data, error } = await supabase
        .from("experience_media")
        .select("media_type, media_url, title")
        .eq("experience_slug", slug)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        type: r.media_type as "image" | "video",
        url: r.media_url,
        title: r.title,
      }));
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

function isActivitySavedLocally(activityId: string) {
  const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
  return draft.some((item: { id: string; type: string }) => item.id === activityId && item.type === "activity");
}

/** External experiencia detail view — dark card layout */
const ExternalActivityView = ({ exp, backPath }: { exp: ExternalExperiencia; backPath: string }) => {
  const { saveItem } = useItemSave();
  const slug = normalizeNeighborhood(exp.bairro);
  const { data: mediaList } = useExperienciaMedia(exp.id);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isActivitySavedLocally(exp.id));
  }, [exp.id]);

  const handleSave = () => {
    saveItem(exp.id, "activity", exp.nome, false);
    setIsSaved(true);
  };

  const hasMedia = mediaList && mediaList.length > 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        {hasMedia && mediaList.length > 1 ? (
          <Carousel className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent className="ml-0 h-full">
              {mediaList.map((m, i) => (
                <CarouselItem key={i} className="pl-0 h-full">
                  {m.type === "video" ? (
                    <video src={m.url} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
                  ) : (
                    <img src={m.url} alt={exp.nome} className="w-full h-full object-cover" />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : hasMedia ? (
          mediaList[0].type === "video" ? (
            <video src={mediaList[0].url} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
          ) : (
            <img src={mediaList[0].url} alt={exp.nome} className="w-full h-full object-cover" />
          )
        ) : (
          <img src={getAttractionImage(slug)} alt={exp.nome} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center z-10">
          <Link to={backPath} className="inline-flex items-center gap-1.5 text-sm text-white/90 font-medium">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </div>

      {/* Content — dark */}
      <div className="relative bg-black/90 backdrop-blur-sm px-5 pt-7 pb-24">

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {exp.categoria && (
            <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
              {exp.categoria}
            </span>
          )}
          <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
            {exp.bairro}
          </span>
          {exp.vibe && (
            <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
              {exp.vibe}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-serif font-semibold text-white leading-tight mb-5">
          {exp.nome}
        </h1>

        {/* Meta pills row */}
        <div className="flex flex-wrap gap-2 mb-6">
          {exp.duracao && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">
              <Clock className="w-3 h-3" /> {exp.duracao}
            </span>
          )}
          {exp.melhor_horario && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">
              🕐 {exp.melhor_horario}
            </span>
          )}
          {exp.com_criancas && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">
              <Baby className="w-3 h-3" /> Kids OK
            </span>
          )}
          {exp.seguro_mulher_sozinha && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">
              <Shield className="w-3 h-3" /> Safe solo
            </span>
          )}
          {exp.precisa_reserva && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70">
              📋 Reserva necessária
            </span>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3 mb-6">
          {exp.meu_olhar.split("\n").map((paragraph, index) => (
            <p key={index} className="text-base text-white/75 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full h-14 rounded-full bg-white text-black font-semibold text-base flex items-center justify-center gap-2 mb-6 active:scale-[0.98] transition-transform"
        >
          <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Salvo" : "Salvar"}
        </button>

        {/* Secondary links */}
        {exp.google_maps_url && (
          <a
            href={exp.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Ver no Google Maps
          </a>
        )}

        <p className="text-xs text-white/20 mt-10">The Lucky Trip — {exp.bairro}</p>
      </div>
    </div>
  );
};

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();

  const { data: experiencias, isLoading } = useExternalExperiencias();

  const from = searchParams.get("from");
  const backPath = from === "city" ? "/o-que-fazer" : from ? `/o-que-fazer/${from}` : "/o-que-fazer";

  const externalMatch = (experiencias || []).find((e) => e.id === id);
  const result = findStaticActivityById(id || "");

  const staticActivityId = result?.activity.id;
  const staticActivityTitle = result?.activity.title;

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!staticActivityId) return;
    setIsSaved(isActivitySavedLocally(staticActivityId));
  }, [staticActivityId]);

  const handlePrimarySave = () => {
    if (!staticActivityId || !staticActivityTitle) return;
    saveItem(staticActivityId, "activity", staticActivityTitle, false);
    setIsSaved(true);
  };

  if (externalMatch) {
    return <ExternalActivityView exp={externalMatch} backPath={backPath} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <header className="px-6 py-4 border-b border-border">
          <Link to="/o-que-fazer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <p className="text-lg text-foreground font-medium mb-2">Atividade não encontrada</p>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Esta atividade pode ter sido removida ou o link está incorreto.
          </p>
          <Button asChild variant="outline">
            <Link to="/o-que-fazer">Voltar para O Que Fazer</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { activity, neighborhoodName } = result;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Image */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        <img src={getAttractionImage(from || "")} alt={activity.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center z-10">
          <Link to={backPath} className="inline-flex items-center gap-1.5 text-sm text-white/90 font-medium">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </div>

      {/* Content — dark */}
      <div className="relative bg-black/90 backdrop-blur-sm px-5 pt-7 pb-24">

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
            {activity.category}
          </span>
          <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
            {neighborhoodName}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-serif font-semibold text-white leading-tight mb-5">
          {activity.title}
        </h1>

        {activity.price && (
          <p className="text-sm text-white/60 mb-5">{activity.price}</p>
        )}

        {/* Description */}
        <div className="space-y-3 mb-6">
          {activity.description.split("\n").map((paragraph, index) => (
            <p key={index} className="text-base text-white/75 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={handlePrimarySave}
          className="w-full h-14 rounded-full bg-white text-black font-semibold text-base flex items-center justify-center gap-2 mb-6 active:scale-[0.98] transition-transform"
        >
          <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Salvo" : "Salvar"}
        </button>

        {/* Secondary links */}
        <div className="space-y-3">
          {activity.googleMaps && (
            <a href={activity.googleMaps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
              <MapPin className="w-4 h-4" />
              Ver no Google Maps
            </a>
          )}
          {activity.instagram && (
            <a href={`https://instagram.com/${activity.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              {activity.instagram}
            </a>
          )}
          {activity.externalLink && (
            <a href={activity.externalLink} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white/80 transition-colors underline">
              Reservar / Saber mais
            </a>
          )}
        </div>

        <p className="text-xs text-white/20 mt-10">The Lucky Trip — {neighborhoodName}</p>
      </div>
    </div>
  );
};

export default ActivityDetail;
