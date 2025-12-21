import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";
import { activitiesByNeighborhood } from "@/data/what-to-do-data";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { getAttractionImage } from "@/data/place-images";

/**
 * O QUE FAZER — NEIGHBORHOOD ACTIVITY LIST
 * 
 * PUBLIC LAYER - Lists activities for a neighborhood
 * 
 * SAVING BEHAVIOR: Save actions are NOT allowed on this page.
 * Users must navigate to individual activity detail pages to save.
 */

const WhatToDoDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  
  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodData?.name || "Bairro";
  const data = activitiesByNeighborhood[neighborhood || ""];
  const activities = data?.activities || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - No page-level save button */}
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link
          to="/o-que-fazer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <RoteiroAccessLink />
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            O que fazer em {name}
          </h1>
        </div>

        {/* Media Placeholder - Full Width (reserved field) */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Espaço para imagem ou vídeo</p>
        </div>

        {/* Activities */}
        <div className="px-6 pt-8">
          {activities.length > 0 ? (
            <div className="space-y-8">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  to={`/atividade/${activity.id}?from=${neighborhood}`}
                  className="block border-b border-border pb-8 last:border-b-0 hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
                >
                  {/* Thumbnail Image */}
                  <div className="w-full aspect-[16/9] bg-muted/50 rounded overflow-hidden mb-4">
                    <img 
                      src={activity.mediaUrl || getAttractionImage(neighborhood || "")} 
                      alt={activity.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Category */}
                  <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
                    {activity.category}
                  </p>
                  
                  {/* Title */}
                  <h2 className="text-2xl font-serif font-medium text-foreground mb-4">
                    {activity.title}
                  </h2>
                  
                  {/* Description */}
                  <div className="space-y-2 mb-4">
                    {activity.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-base text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {/* View indicator */}
                  <span className="text-xs text-muted-foreground/60">
                    Ver detalhes
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-base text-muted-foreground">
              Atividades em breve.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {name}
        </p>
      </footer>
    </div>
  );
};

export default WhatToDoDetail;
