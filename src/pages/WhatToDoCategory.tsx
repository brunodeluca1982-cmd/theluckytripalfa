import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { activitiesByNeighborhood } from "@/data/what-to-do-data";
import { getAttractionImage } from "@/data/place-images";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";

const CATEGORY_LABELS: Record<string, string> = {
  classico: "Clássico",
  praia: "Praia",
  cultura: "Cultura",
  aventura: "Aventura",
  relax: "Relax",
  festa: "Festa",
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  classico: ["clássico", "classico", "experiência"],
  praia: ["praia"],
  cultura: ["cultura", "parque"],
  aventura: ["aventura", "atividade ao ar livre"],
  relax: ["relax", "relaxamento"],
  festa: ["festa", "baladas", "noite", "nightlife"],
};

const WhatToDoCategory = () => {
  const { category } = useParams<{ category: string }>();
  const cat = category || "";
  const label = CATEGORY_LABELS[cat] || cat;
  const aliases = CATEGORY_ALIASES[cat] || [cat];

  // Gather all activities across neighborhoods matching the category
  const matched = Object.values(activitiesByNeighborhood).flatMap((nh) =>
    nh.activities
      .filter((a) => aliases.some((alias) => a.category.toLowerCase().includes(alias)))
      .map((a) => ({ ...a, neighborhoodId: nh.neighborhoodId, neighborhoodName: nh.neighborhoodName }))
  );

  return (
    <div className="min-h-screen bg-background">
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

      <main className="pb-12">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            {label}
          </h1>
          <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase mt-2">
            no rio
          </p>
        </div>

        <div className="px-6">
          {matched.length > 0 ? (
            <div className="space-y-8">
              {matched.map((activity) => (
                <Link
                  key={activity.id}
                  to={`/atividade/${activity.id}?from=${activity.neighborhoodId}`}
                  className="block border-b border-border pb-8 last:border-b-0 hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
                >
                  <div className="w-full aspect-[16/9] bg-muted/50 rounded overflow-hidden mb-4">
                    <img
                      src={activity.mediaUrl || getAttractionImage(activity.neighborhoodId)}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs tracking-widest text-muted-foreground uppercase mb-1">
                    {activity.neighborhoodName}
                  </p>
                  <h2 className="text-2xl font-serif font-medium text-foreground mb-3">
                    {activity.title}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
                    {activity.description.split("\n")[0]}
                  </p>
                  <span className="text-xs text-muted-foreground/60 mt-2 inline-block">
                    Ver detalhes
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-base text-muted-foreground">
              Sem sugestões por aqui ainda.
            </p>
          )}
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {label}
        </p>
      </footer>
    </div>
  );
};

export default WhatToDoCategory;
