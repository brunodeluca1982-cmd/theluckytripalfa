import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";

/**
 * What to Do Detail - Neighborhood-specific activities
 * 
 * Uses the same template as other neighborhood detail pages
 */

// Placeholder activity data by neighborhood
const activitiesByNeighborhood: Record<string, { title: string; description: string }[]> = {
  ipanema: [
    { title: "Placeholder de Atividade", description: "Cultura de praia e surfe." },
  ],
  leblon: [
    { title: "Placeholder de Atividade", description: "Pôr do sol no Mirante do Leblon." },
  ],
  copacabana: [
    { title: "Placeholder de Atividade", description: "Caminhar pelo calçadão icônico." },
  ],
  leme: [],
  "sao-conrado": [
    { title: "Placeholder de Atividade", description: "Ponto de pouso de parapente." },
  ],
  "barra-da-tijuca": [],
  recreio: [],
  "santa-teresa": [
    { title: "Placeholder de Atividade", description: "Explorar as galerias de arte." },
  ],
  centro: [
    { title: "Placeholder de Atividade", description: "Tour histórico a pé." },
  ],
};

const WhatToDoDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  
  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodData?.name || "Neighborhood";
  const activities = activitiesByNeighborhood[neighborhood || ""] || [];

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

      {/* Content */}
      <main className="pb-12">
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            O que fazer em {name}
          </h1>
        </div>

        {/* Media Placeholder - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Espaço para imagem ou vídeo</p>
        </div>

        {/* Content */}
        <div className="px-6 pt-8">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="p-4 bg-card border border-border rounded-lg">
                  <h2 className="text-lg font-serif font-medium text-foreground mb-1">
                    {activity.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
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
