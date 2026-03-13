import { Link, useParams, useSearchParams } from "react-router-dom";
import { Clock, Baby, Shield, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemSave } from "@/hooks/use-item-save";
import { activitiesByNeighborhood, cityLevelActivities, Activity } from "@/data/what-to-do-data";
import { guideActivities } from "@/data/rio-guide-data";
import { getAttractionImage } from "@/data/place-images";
import { useExternalExperiencias, normalizeNeighborhood } from "@/hooks/use-external-experiencias";
import type { ExternalExperiencia } from "@/hooks/use-external-experiencias";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DetailHeroLayout from "@/components/detail/DetailHeroLayout";

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

/** External experiencia detail view */
const ExternalActivityView = ({ exp, backPath }: { exp: ExternalExperiencia; backPath: string }) => {
  const { saveItem } = useItemSave();
  const slug = normalizeNeighborhood(exp.bairro);
  const { data: slugMedia } = useExperienceMediaBySlug(exp.id);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isActivitySavedLocally(exp.id));
  }, [exp.id]);

  const handleSave = () => {
    saveItem(exp.id, "activity", exp.nome, false);
    setIsSaved(true);
  };

  const heroImage = getAttractionImage(slug);
  const pills = [exp.categoria, exp.bairro, exp.vibe].filter(Boolean) as string[];

  return (
    <DetailHeroLayout
      backPath={backPath}
      title={exp.nome}
      pills={pills}
      media={slugMedia || undefined}
      heroImageUrl={heroImage}
      isSaved={isSaved}
      onSave={handleSave}
      footer={`The Lucky Trip — ${exp.bairro}`}
    >
      {/* Meta pills */}
      <div className="flex flex-wrap gap-2 mb-5">
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
    </DetailHeroLayout>
  );
};

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();

  const { data: experiencias, isLoading } = useExternalExperiencias();
  const { data: slugMediaForStatic } = useExperienceMediaBySlug(id);

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

  const { activity, neighborhoodName } = result;
  const staticMedia = slugMediaForStatic && slugMediaForStatic.length > 0 ? slugMediaForStatic : undefined;
  const heroImage = getAttractionImage(from || "");
  const pills = [activity.category, neighborhoodName].filter(Boolean) as string[];

  return (
    <DetailHeroLayout
      backPath={backPath}
      title={activity.title}
      subtitle={activity.price || null}
      pills={pills}
      media={staticMedia}
      heroImageUrl={heroImage}
      isSaved={isSaved}
      onSave={handlePrimarySave}
      footer={`The Lucky Trip — ${neighborhoodName}`}
    >
      {/* Description */}
      <div className="space-y-3 mb-6">
        {activity.description.split("\n").map((paragraph, index) => (
          <p key={index} className="text-base text-white/75 leading-relaxed">{paragraph}</p>
        ))}
      </div>

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
    </DetailHeroLayout>
  );
};

export default ActivityDetail;
