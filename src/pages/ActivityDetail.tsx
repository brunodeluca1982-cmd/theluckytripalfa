import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { useItemSave } from "@/hooks/use-item-save";
import { activitiesByNeighborhood, cityLevelActivities, Activity } from "@/data/what-to-do-data";

/**
 * ACTIVITY DETAIL PAGE
 * 
 * Individual detail view for a single activity.
 * Each activity has its own unique URL.
 * 
 * SAVING SCOPE: Only this individual activity can be saved (item level).
 */

// Helper to find activity by ID across all neighborhoods AND city-level activities
const findActivityById = (id: string): { activity: Activity; neighborhoodName: string; neighborhoodId: string } | null => {
  // Debug log to verify which ID is being searched
  console.log('[ActivityDetail] Searching for activity with id:', id);
  
  // First, search in neighborhood activities
  for (const [neighborhoodId, data] of Object.entries(activitiesByNeighborhood)) {
    const activity = data.activities.find(a => a.id === id);
    if (activity) {
      console.log('[ActivityDetail] Found activity in neighborhood:', neighborhoodId, activity.title);
      return {
        activity,
        neighborhoodName: data.neighborhoodName,
        neighborhoodId,
      };
    }
  }
  
  // Second, search in city-level activities
  const cityActivity = cityLevelActivities.find(a => a.id === id);
  if (cityActivity) {
    console.log('[ActivityDetail] Found city-level activity:', cityActivity.title);
    // Convert city-level activity to full Activity format
    const fullActivity: Activity = {
      id: cityActivity.id,
      title: cityActivity.title,
      category: "Experiência Icônica",
      description: cityActivity.description,
    };
    return {
      activity: fullActivity,
      neighborhoodName: "Rio de Janeiro",
      neighborhoodId: "city",
    };
  }
  
  console.log('[ActivityDetail] Activity not found for id:', id);
  return null;
};

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();
  
  const result = findActivityById(id || "");
  const from = searchParams.get("from");
  const backPath = from === "city" ? "/o-que-fazer" : from ? `/o-que-fazer/${from}` : "/o-que-fazer";

  if (!result) {
    console.log('[ActivityDetail] Rendering not-found state for id:', id);
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="px-6 py-4 border-b border-border">
          <Link
            to="/o-que-fazer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>
        
        {/* Error State */}
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <p className="text-lg text-foreground font-medium mb-2">Atividade não encontrada</p>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Esta atividade pode ter sido removida ou o link está incorreto.
          </p>
          <Button asChild variant="outline">
            <Link to="/o-que-fazer">
              Voltar para O Que Fazer
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { activity, neighborhoodName } = result;

  const handleSave = () => {
    saveItem(activity.id, "activity", activity.title, false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <RoteiroAccessLink />
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Media Placeholder */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Espaço para imagem ou vídeo</p>
        </div>

        {/* Activity Info */}
        <div className="px-6 pt-8">
          {/* Category */}
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
            {activity.category} • {neighborhoodName}
          </p>
          
          {/* Title */}
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight mb-4">
            {activity.title}
          </h1>
          
          {/* Price */}
          {activity.price && (
            <p className="text-sm text-muted-foreground mb-4">{activity.price}</p>
          )}
          
          {/* Description */}
          <div className="space-y-2 mb-6">
            {activity.description.split('\n').map((paragraph, index) => (
              <p key={index} className="text-base text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Metadata */}
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            {activity.googleMaps && (
              <p>
                <a 
                  href={activity.googleMaps} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline"
                >
                  Ver no Google Maps
                </a>
              </p>
            )}
            {activity.instagram && (
              <p>
                <a 
                  href={`https://instagram.com/${activity.instagram.replace('@', '')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {activity.instagram}
                </a>
              </p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3 h-3" />
              Salvar
            </Button>
            
            {activity.externalLink && (
              <a 
                href={activity.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                Reservar / Saber mais
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {neighborhoodName}
        </p>
      </footer>
    </div>
  );
};

export default ActivityDetail;
