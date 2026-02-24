import { useState, useCallback, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Loader2, MapPin } from "lucide-react";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import {
  useExternalExperiencias,
  normalizeNeighborhood,
  type ExternalExperiencia,
} from "@/hooks/use-external-experiencias";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { getAttractionImage } from "@/data/place-images";
import CategoryMapPreview from "@/components/category-map/CategoryMapPreview";
import ExpandedMapSheet from "@/components/category-map/ExpandedMapSheet";
import { useItemCoordinates, type MapItem } from "@/components/category-map/useItemCoordinates";
import { resolveExperienceCoords, getCachedCoords } from "@/lib/geo/resolveExperienceCoords";
import { toast } from "sonner";

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

const CLASSIC_NAMES = [
  "pao de acucar", "cristo redentor", "corcovado", "jardim botanico",
  "lagoa rodrigo de freitas", "escadaria selaron", "arcos da lapa",
  "maracana", "museu do amanha", "aquario do rio", "mureta da urca",
  "por do sol no arpoador",
];

function normalizeStr(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const classicosFilter = (e: ExternalExperiencia) => {
  const cat = normalizeStr(e.categoria);
  const nome = normalizeStr(e.nome);
  const vibe = normalizeStr(e.vibe || "");
  if (["mirante", "urbano"].includes(cat)) return true;
  if (vibe.includes("classico do rio")) return true;
  return CLASSIC_NAMES.some((c) => nome.includes(c));
};

const praiasFilter = (e: ExternalExperiencia) => normalizeStr(e.categoria) === "praia";

const CATEGORY_FILTERS: Record<string, (e: ExternalExperiencia) => boolean> = {
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
    if (["aventura", "caminhada"].includes(cat)) return true;
    if (cat === "natureza" && e.nivel_esforco >= 2) return true;
    return false;
  },
  relax: (e) => {
    const cat = normalizeStr(e.categoria);
    if (["relax", "relaxamento"].includes(cat)) return true;
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

function CategoryItemCard({
  exp,
  isHighlighted,
  onViewOnMap,
  hasCoords,
  cardRef,
}: {
  exp: ExternalExperiencia & { neighborhoodSlug: string };
  isHighlighted: boolean;
  onViewOnMap: () => void;
  hasCoords: boolean;
  cardRef?: React.Ref<HTMLDivElement>;
}) {
  const placeQuery = buildPlaceQuery(exp.nome, exp.bairro);
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(
    exp.id,
    "attraction",
    placeQuery,
    true
  );
  const fallbackImage = getAttractionImage(exp.neighborhoodSlug);
  const heroImage = photoUrl || fallbackImage;

  // Background-resolve coords so "Ver no mapa" appears when ready
  const [coordReady, setCoordReady] = useState(hasCoords);
  useEffect(() => {
    if (hasCoords) { setCoordReady(true); return; }
    let cancelled = false;
    resolveExperienceCoords({
      id: exp.id,
      nome: exp.nome,
      bairro: exp.bairro,
      cidade: exp.cidade,
      lat: (exp as any).lat,
      lng: (exp as any).lng,
    }).then((c) => {
      if (!cancelled && c) setCoordReady(true);
    });
    return () => { cancelled = true; };
  }, [exp.id, hasCoords]);

  return (
    <div
      ref={cardRef}
      className={`block border-b border-border pb-8 last:border-b-0 transition-colors -mx-2 px-2 rounded ${
        isHighlighted
          ? "bg-primary/5 ring-1 ring-primary/20"
          : ""
      }`}
    >
      <Link
        to={`/atividade/${exp.id}?from=${exp.neighborhoodSlug}`}
        className="block hover:bg-muted/30 transition-colors rounded"
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

      {coordReady && (
        <button
          onClick={onViewOnMap}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          Ver no mapa
        </button>
      )}
    </div>
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

  const mapItems = useItemCoordinates(matched);
  const coordsSet = new Set(mapItems.map((m) => m.id));

  const [mapSheetOpen, setMapSheetOpen] = useState(false);
  const [focusItemId, setFocusItemId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Clear highlight after a few seconds
  useEffect(() => {
    if (!highlightedId) return;
    const t = setTimeout(() => setHighlightedId(null), 3000);
    return () => clearTimeout(t);
  }, [highlightedId]);

  const handleViewOnMap = useCallback(async (id: string) => {
    const item = matched.find((m) => m.id === id);
    if (!item) return;
    const coord = await resolveExperienceCoords({
      id: item.id,
      nome: item.nome,
      bairro: item.bairro,
      cidade: item.cidade,
      lat: (item as any).lat,
      lng: (item as any).lng,
    });
    if (!coord) {
      toast("Localização não encontrada");
      return;
    }
    setFocusItemId(id);
    setMapSheetOpen(true);
  }, [matched]);

  const handleMapSelectItem = useCallback((id: string) => {
    setHighlightedId(id);
  }, []);

  const handleSheetClose = useCallback(() => {
    setMapSheetOpen(false);
    setFocusItemId(null);

    // Auto-scroll to highlighted card when sheet closes
    if (highlightedId) {
      const el = cardRefs.current.get(highlightedId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 350);
      }
    }
  }, [highlightedId]);

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
            <>
              <CategoryMapPreview
                items={mapItems}
                onOpen={() => {
                  setFocusItemId(null);
                  setMapSheetOpen(true);
                }}
              />

              <div className="space-y-8">
                {matched.map((exp) => (
                  <CategoryItemCard
                    key={exp.id}
                    exp={exp}
                    isHighlighted={highlightedId === exp.id}
                    hasCoords={coordsSet.has(exp.id)}
                    onViewOnMap={() => handleViewOnMap(exp.id)}
                    cardRef={(el) => {
                      if (el) cardRefs.current.set(exp.id, el);
                      else cardRefs.current.delete(exp.id);
                    }}
                  />
                ))}
              </div>
            </>
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

      <ExpandedMapSheet
        open={mapSheetOpen}
        onClose={handleSheetClose}
        categoryLabel={label}
        items={mapItems}
        focusItemId={focusItemId}
        onSelectItem={handleMapSelectItem}
      />
    </div>
  );
};

export default WhatToDoCategory;
