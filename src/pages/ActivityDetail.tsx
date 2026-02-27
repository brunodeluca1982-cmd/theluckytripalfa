import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Plus, Clock, Baby, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemSave } from "@/hooks/use-item-save";
import { activitiesByNeighborhood, cityLevelActivities, Activity } from "@/data/what-to-do-data";
import { guideActivities } from "@/data/rio-guide-data";
import { getAttractionImage } from "@/data/place-images";
import { useExternalExperiencias, normalizeNeighborhood } from "@/hooks/use-external-experiencias";
import type { ExternalExperiencia } from "@/hooks/use-external-experiencias";
import { supabase } from "@/integrations/supabase/client";

/**
 * ACTIVITY DETAIL PAGE
 * 
 * Resolves activity from:
 * 1. External Supabase (experiencias table) — primary source
 * 2. Static what-to-do-data — fallback
 * 3. Guide activities — last resort
 */

// Mapping from guide data IDs to what-to-do-data IDs
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

// Static fallback finder
const findStaticActivityById = (id: string): { activity: Activity; neighborhoodName: string; neighborhoodId: string } | null => {
  const mappedId = guideIdToWhatToDoId[id] || id;

  for (const [neighborhoodId, data] of Object.entries(activitiesByNeighborhood)) {
    const activity = data.activities.find(a => a.id === mappedId);
    if (activity) return { activity, neighborhoodName: data.neighborhoodName, neighborhoodId };
  }

  const cityActivity = cityLevelActivities.find(a => a.id === mappedId);
  if (cityActivity) {
    return {
      activity: { id: cityActivity.id, title: cityActivity.title, category: "Experiência Icônica", description: cityActivity.description },
      neighborhoodName: "Rio de Janeiro",
      neighborhoodId: "city",
    };
  }

  const guideActivity = guideActivities.find(a => a.id === id || a.id === mappedId);
  if (guideActivity) {
    return {
      activity: { id: guideActivity.id, title: guideActivity.name, category: guideActivity.category, description: guideActivity.description },
      neighborhoodName: guideActivity.neighborhood,
      neighborhoodId: guideActivity.neighborhood.toLowerCase().replace(/\s+/g, "-"),
    };
  }

  return null;
};

/** Resolve storage media URL for an experiencia */
function getStorageMediaUrl(exp: ExternalExperiencia): { url: string; type: "video" | "image" } | null {
  const BUCKET = "experiencia_media";
  if (exp.hero_video_path) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(exp.hero_video_path);
    return { url: data.publicUrl, type: "video" };
  }
  if (exp.hero_image_path) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(exp.hero_image_path);
    return { url: data.publicUrl, type: "image" };
  }
  return null;
}

/** Render for an external experiencia */
const ExternalActivityView = ({ exp, backPath }: { exp: ExternalExperiencia; backPath: string }) => {
  const { saveItem } = useItemSave();
  const slug = normalizeNeighborhood(exp.bairro);
  const media = getStorageMediaUrl(exp);
  const [searchParams] = useSearchParams();

  if (searchParams.get("debug") === "1") {
    console.log({ hero_video_path: exp.hero_video_path, publicUrl: media?.url ?? null });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — full top */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        {media?.type === "video" ? (
          <video
            src={media.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={media?.type === "image" ? media.url : getAttractionImage(slug)}
            alt={exp.nome}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center justify-between z-10">
          <Link to={backPath} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <button onClick={() => saveItem(exp.id, "activity", exp.nome, false)} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="pb-12">

        <div className="px-6 pt-8">
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
            {exp.categoria} • {exp.bairro}
          </p>

          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight mb-4">
            {exp.nome}
          </h1>

          {/* Metadata pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {exp.duracao && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                <Clock className="w-3 h-3" /> {exp.duracao}
              </span>
            )}
            {exp.melhor_horario && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                🕐 {exp.melhor_horario}
              </span>
            )}
            {exp.vibe && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                ✨ {exp.vibe}
              </span>
            )}
            {exp.com_criancas && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                <Baby className="w-3 h-3" /> Kids OK
              </span>
            )}
            {exp.seguro_mulher_sozinha && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                <Shield className="w-3 h-3" /> Safe solo
              </span>
            )}
            {exp.precisa_reserva && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground">
                📋 Reserva necessária
              </span>
            )}
          </div>

          <div className="space-y-2 mb-6">
            {exp.meu_olhar.split("\n").map((paragraph, index) => (
              <p key={index} className="text-base text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {exp.google_maps_url && (
            <a href={exp.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline">
              Ver no Google Maps
            </a>
          )}
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">The Lucky Trip — {exp.bairro}</p>
      </footer>
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

  // 1. Try external experiencias first (by UUID)
  const externalMatch = (experiencias || []).find((e) => e.id === id);
  if (externalMatch) {
    return <ExternalActivityView exp={externalMatch} backPath={backPath} />;
  }

  // 2. Still loading external? Show spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 3. Static fallback
  const result = findStaticActivityById(id || "");

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
    <div className="min-h-screen bg-background">
      {/* Hero Image — full top */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        <img src={getAttractionImage(from || "")} alt={activity.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center justify-between z-10">
          <Link to={backPath} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <button onClick={() => saveItem(activity.id, "activity", activity.title, false)} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="pb-12">

        <div className="px-6 pt-8">
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
            {activity.category} • {neighborhoodName}
          </p>
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight mb-4">
            {activity.title}
          </h1>
          {activity.price && <p className="text-sm text-muted-foreground mb-4">{activity.price}</p>}
          <div className="space-y-2 mb-6">
            {activity.description.split("\n").map((paragraph, index) => (
              <p key={index} className="text-base text-muted-foreground leading-relaxed">{paragraph}</p>
            ))}
          </div>
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            {activity.googleMaps && (
              <p><a href={activity.googleMaps} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline">Ver no Google Maps</a></p>
            )}
            {activity.instagram && (
              <p><a href={`https://instagram.com/${activity.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{activity.instagram}</a></p>
            )}
          </div>
          {activity.externalLink && (
            <a href={activity.externalLink} target="_blank" rel="noopener noreferrer" className="inline-block py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
              Reservar / Saber mais
            </a>
          )}
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">The Lucky Trip — {neighborhoodName}</p>
      </footer>
    </div>
  );
};

export default ActivityDetail;
