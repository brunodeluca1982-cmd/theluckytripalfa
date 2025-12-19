import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";
import { activitiesByNeighborhood } from "@/data/what-to-do-data";
import SaveToRoteiroButton from "@/components/SaveToRoteiroButton";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";

/**
 * O QUE FAZER — ACTIVITY DETAIL
 * 
 * PUBLIC LAYER - Consistent template for all activities
 * 
 * Reserved fields (always present, even if empty):
 * - External booking / partner link
 * - Media area
 */

const WhatToDoDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  
  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodData?.name || "Bairro";
  const data = activitiesByNeighborhood[neighborhood || ""];
  const activities = data?.activities || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Save Action */}
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link
          to="/o-que-fazer"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-4">
          <RoteiroAccessLink />
          {activities.length > 0 && (
            <SaveToRoteiroButton
              itemId={`whatodo-${neighborhood}`}
              itemType="activity"
              itemTitle={`O que fazer em ${name}`}
            />
          )}
        </div>
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
                <article key={activity.id} className="border-b border-border pb-8 last:border-b-0">
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
                  
                  {/* Metadata */}
                  <div className="space-y-1 text-sm text-muted-foreground">
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
                      <p>Instagram: {activity.instagram}</p>
                    )}
                    {activity.price && (
                      <p>Preço: {activity.price}</p>
                    )}
                  </div>
                  
                  {/* External booking / partner link (reserved field) */}
                  {activity.externalLink && (
                    <div className="mt-4">
                      <a 
                        href={activity.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
                      >
                        Reservar / Saber mais
                      </a>
                    </div>
                  )}
                </article>
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
