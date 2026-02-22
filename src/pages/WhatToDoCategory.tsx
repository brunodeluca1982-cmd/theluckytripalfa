import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import {
  useExternalExperiencias,
  normalizeNeighborhood,
  type ExternalExperiencia,
} from "@/hooks/use-external-experiencias";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { getAttractionImage } from "@/data/place-images";

/* ───── Category labels ───── */
const CATEGORY_LABELS: Record<string, string> = {
  classicos: "Clássicos",
  praias: "Praias",
  cultura: "Cultura",
  aventura: "Aventura",
  relax: "Relax",
  festa: "Festa",
};

/* ───── Smart filter: maps UI category → filter function ───── */

const CLASSIC_NAMES = [
  "pao de acucar", "cristo redentor", "corcovado", "jardim botanico",
  "lagoa rodrigo de freitas", "escadaria selaron", "arcos da lapa",
  "maracana", "museu do amanha", "aquario do rio", "mureta da urca",
  "por do sol no arpoador",
];

function normalizeStr(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const CATEGORY_FILTERS: Record<string, (e: ExternalExperiencia) => boolean> = {
  classicos: (e) => {
    const cat = normalizeStr(e.categoria);
    const nome = normalizeStr(e.nome);
    const vibe = normalizeStr(e.vibe || "");
    if (["mirante", "urbano"].includes(cat)) return true;
    if (vibe.includes("classico do rio")) return true;
    return CLASSIC_NAMES.some((c) => nome.includes(c));
  },
  praias: (e) => normalizeStr(e.categoria) === "praia",
  cultura: (e) => {
    const cat = normalizeStr(e.categoria);
    return cat.includes("cultur") || cat.includes("museu") || cat.includes("teatro");
  },
  aventura: (e) => {
    const cat = normalizeStr(e.categoria);
    if (["aventura", "caminhada"].includes(cat)) return true;
    // Natureza with high effort → adventure
    if (cat === "natureza" && e.nivel_esforco >= 2) return true;
    return false;
  },
  relax: (e) => {
    const cat = normalizeStr(e.categoria);
    if (["relax", "relaxamento"].includes(cat)) return true;
    // Natureza with low effort → relax (gardens, light parks)
    if (cat === "natureza" && e.nivel_esforco <= 1) return true;
    return false;
  },
  festa: (e) => {
    const cat = normalizeStr(e.categoria);
    return ["festa", "balada", "bar", "samba", "noite", "nightlife"].some((t) =>
      cat.includes(t)
    );
  },
};

/* ───── Per-item photo card ───── */

function CategoryItemCard({ exp }: { exp: ExternalExperiencia & { neighborhoodSlug: string } }) {
  const placeQuery = buildPlaceQuery(exp.nome, exp.bairro);
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(
    exp.id,
    "attraction",
    placeQuery,
    true
  );
  const fallbackImage = getAttractionImage(exp.neighborhoodSlug);
  const heroImage = photoUrl || fallbackImage;

  return (
    <Link
      to={`/atividade/${exp.id}?from=${exp.neighborhoodSlug}`}
      className="block border-b border-border pb-8 last:border-b-0 hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
    >
      <div className="w-full aspect-[16/9] bg-muted/50 rounded overflow-hidden mb-4 relative">
        {photoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
        <img
          src={heroImage}
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
  );
}

/* ───── Main page ───── */

const WhatToDoCategory = () => {
  const { category } = useParams<{ category: string }>();
  const cat = category || "";
  const label = CATEGORY_LABELS[cat] || cat;
  const filterFn = CATEGORY_FILTERS[cat];

  const { data: experiencias, isLoading } = useExternalExperiencias();

  const matched = (experiencias || [])
    .filter((e) => (filterFn ? filterFn(e) : false))
    .sort((a, b) => a.ordem_bairro - b.ordem_bairro || a.ordem_item - b.ordem_item)
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
                <CategoryItemCard key={exp.id} exp={exp} />
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
