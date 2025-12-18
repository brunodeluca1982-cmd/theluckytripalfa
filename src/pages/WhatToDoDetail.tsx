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
    { title: "Activity Placeholder", description: "Beach and surf culture." },
  ],
  leblon: [
    { title: "Activity Placeholder", description: "Sunset at Mirante do Leblon." },
  ],
  copacabana: [
    { title: "Activity Placeholder", description: "Walk the iconic promenade." },
  ],
  leme: [],
  "sao-conrado": [
    { title: "Activity Placeholder", description: "Paragliding landing point." },
  ],
  "barra-da-tijuca": [],
  recreio: [],
  "santa-teresa": [
    { title: "Activity Placeholder", description: "Explore the art galleries." },
  ],
  centro: [
    { title: "Activity Placeholder", description: "Historic walking tour." },
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
          Back
        </Link>
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            What to do in {name}
          </h1>
        </div>

        {/* Media Placeholder - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Image or video placeholder</p>
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
              Activities coming soon.
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
