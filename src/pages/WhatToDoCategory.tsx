import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Loader2, MapPin } from "lucide-react";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { useOQueFazer, type OQueFazerItem, slugifyOQueFazer } from "@/hooks/use-o-que-fazer";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";

/* ───── Category labels ───── */
const CATEGORY_LABELS: Record<string, string> = {
  classicos: "Clássicos",
  classico: "Clássicos",
  praias: "Praias",
  praia: "Praias",
  cultura: "Cultura",
  aventura: "Aventura",
  relax: "Relax",
  festa: "Festa",
};

/* ───── Smart filter: maps UI category → filter function ───── */
function normalizeStr(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const CLASSIC_NAMES = [
  "pao de acucar", "cristo redentor", "corcovado", "jardim botanico",
  "lagoa rodrigo de freitas", "escadaria selaron", "arcos da lapa",
  "maracana", "museu do amanha", "aquario do rio", "mureta da urca",
  "por do sol no arpoador",
];

const classicosFilter = (e: OQueFazerItem) => {
  const cat = normalizeStr(e.categoria);
  const nome = normalizeStr(e.nome);
  if (["mirante", "urbano"].includes(cat)) return true;
  if ((e.tags_ia || []).some(t => normalizeStr(t).includes("classico"))) return true;
  return CLASSIC_NAMES.some((c) => nome.includes(c));
};

const praiasFilter = (e: OQueFazerItem) => normalizeStr(e.categoria) === "praia";

const CATEGORY_FILTERS: Record<string, (e: OQueFazerItem) => boolean> = {
  classicos: classicosFilter,
  classico: classicosFilter,
  praias: praiasFilter,
  praia: praiasFilter,
  cultura: (e) => {
    const cat = normalizeStr(e.categoria);
    return cat.includes("cultur") || cat.includes("museu") || cat.includes("teatro");
  },
  aventura: (e) => {
    const cat = normalizeStr(e.categoria);
    return ["aventura", "caminhada", "trilha"].includes(cat);
  },
  relax: (e) => {
    const cat = normalizeStr(e.categoria);
    return ["relax", "relaxamento", "natureza"].includes(cat);
  },
  festa: (e) => {
    const cat = normalizeStr(e.categoria);
    return ["festa", "balada", "bar", "samba", "noite", "nightlife"].some((t) => cat.includes(t));
  },
};

/* ───── Per-item photo card ───── */
function CategoryItemCard({ item }: { item: OQueFazerItem }) {
  const placeQuery = buildPlaceQuery(item.nome, item.bairro || undefined);
  const itemSlug = slugifyOQueFazer(item.nome);
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(itemSlug, "attraction", placeQuery);

  return (
    <Link
      to={`/atividade/${item.id}?from=category`}
      className="block border-b border-border pb-8 last:border-b-0 hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
    >
      <div className="w-full aspect-[16/9] bg-muted/50 rounded overflow-hidden mb-4 relative">
        {photoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {photoUrl && (
          <img src={photoUrl} alt={item.nome} className="w-full h-full object-cover" loading="lazy" />
        )}
      </div>
      <p className="text-xs tracking-widest text-muted-foreground uppercase mb-1">
        {item.bairro || item.categoria}
      </p>
      <h2 className="text-2xl font-serif font-medium text-foreground mb-3">{item.nome}</h2>
      {item.meu_olhar && (
        <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
          {item.meu_olhar.split("\n")[0]}
        </p>
      )}
      {item.vibe && (
        <span className="inline-block mt-2 text-[10px] tracking-widest uppercase text-muted-foreground/70">
          {item.vibe}
        </span>
      )}

      {item.google_maps && (
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary">
          <MapPin className="w-3.5 h-3.5" />
          Ver no mapa
        </div>
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

  const { data: allItems, isLoading } = useOQueFazer();

  const matched = (allItems || [])
    .filter((e) => (filterFn ? filterFn(e) : false))
    .sort((a, b) => a.ordem - b.ordem);

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
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">{label}</h1>
          <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase mt-2">no rio</p>
        </div>

        <div className="px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : matched.length > 0 ? (
            <div className="space-y-8">
              {matched.map((item) => (
                <CategoryItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-base text-muted-foreground">Sem sugestões por aqui ainda.</p>
          )}
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">The Lucky Trip — {label}</p>
      </footer>
    </div>
  );
};

export default WhatToDoCategory;
