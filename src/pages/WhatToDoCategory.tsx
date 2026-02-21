import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { getAttractionImage } from "@/data/place-images";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { useExternalExperiencias, normalizeNeighborhood } from "@/hooks/use-external-experiencias";

const CATEGORY_LABELS: Record<string, string> = {
  classico: "Clássico",
  praia: "Praia",
  cultura: "Cultura",
  aventura: "Aventura",
  relax: "Relax",
  festa: "Festa",
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  classico: ["clássico", "classico", "experiência", "mirante", "urbano"],
  praia: ["praia"],
  cultura: ["cultura", "parque"],
  aventura: ["aventura", "atividade ao ar livre", "trilha"],
  relax: ["relax", "relaxamento", "natureza"],
  festa: ["festa", "baladas", "noite", "nightlife"],
};

const WhatToDoCategory = () => {
  const { category } = useParams<{ category: string }>();
  const cat = category || "";
  const label = CATEGORY_LABELS[cat] || cat;
  const aliases = CATEGORY_ALIASES[cat] || [cat];

  const { data: experiencias, isLoading } = useExternalExperiencias();

  const matched = (experiencias || [])
    .filter((e) => aliases.some((alias) => e.categoria.toLowerCase().includes(alias)))
    .map((e) => ({
      ...e,
      neighborhoodSlug: normalizeNeighborhood(e.bairro),
    }));

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
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : matched.length > 0 ? (
            <div className="space-y-8">
              {matched.map((exp) => (
                <Link
                  key={exp.id}
                  to={`/atividade/${exp.id}?from=${exp.neighborhoodSlug}`}
                  className="block border-b border-border pb-8 last:border-b-0 hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
                >
                  <div className="w-full aspect-[16/9] bg-muted/50 rounded overflow-hidden mb-4">
                    <img
                      src={getAttractionImage(exp.neighborhoodSlug)}
                      alt={exp.nome}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs tracking-widest text-muted-foreground uppercase mb-1">
                    {exp.bairro}
                  </p>
                  <h2 className="text-2xl font-serif font-medium text-foreground mb-3">
                    {exp.nome}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
                    {exp.meu_olhar.split("\n")[0]}
                  </p>
                  {exp.vibe && (
                    <span className="inline-block mt-2 text-[10px] tracking-widest uppercase text-muted-foreground/70">
                      {exp.vibe}
                    </span>
                  )}
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
