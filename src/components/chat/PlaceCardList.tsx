import { Link } from "react-router-dom";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { MapPin, Bookmark } from "lucide-react";
import { useItemSave } from "@/hooks/use-item-save";
import { useState, useEffect, useMemo } from "react";
import { useOQueFazer } from "@/hooks/use-o-que-fazer";
import { useExternalRestaurants } from "@/hooks/use-external-restaurants";
import { useExternalHotels } from "@/hooks/use-external-hotels";

interface PlaceItem {
  id?: string;
  type: "restaurant" | "hotel" | "experience";
  nome: string;
  bairro: string;
  meu_olhar?: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function mapItemType(type: PlaceItem["type"]): "activity" | "restaurant" | "hotel" {
  if (type === "experience") return "activity";
  return type;
}

function PlaceCard({ item }: { item: PlaceItem }) {
  const { data: experiences = [] } = useOQueFazer();
  const { data: restaurants = [] } = useExternalRestaurants();
  const { data: hotels = [] } = useExternalHotels();

  const from = normalize(item.bairro);

  const resolvedId = useMemo(() => {
    if (item.id) return String(item.id);

    const nameKey = normalize(item.nome);

    if (item.type === "experience") {
      const match = experiences.find((e) => normalize(e.nome) === nameKey);
      return match?.id;
    }

    if (item.type === "restaurant") {
      const match = restaurants.find((r) => normalize(r.nome) === nameKey);
      return match ? String(match.id) : undefined;
    }

    const match = hotels.find((h) => normalize(h.nome) === nameKey);
    return match?.id;
  }, [item.id, item.nome, item.type, experiences, restaurants, hotels]);

  const detailUrl = useMemo(() => {
    if (!resolvedId) return undefined;
    if (item.type === "restaurant") return `/restaurante/${resolvedId}?from=${from}`;
    if (item.type === "hotel") return `/hotel/${resolvedId}?from=${from}`;
    return `/atividade/${resolvedId}?from=${from}`;
  }, [resolvedId, item.type, from]);

  const placeQuery = buildPlaceQuery(item.nome, item.bairro);
  const itemType = item.type === "experience" ? "attraction" : item.type;
  const { photoUrl, isLoading } = usePlacePhoto(
    resolvedId || normalize(item.nome),
    itemType as "hotel" | "restaurant" | "attraction",
    placeQuery
  );

  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!resolvedId) {
      setIsSaved(false);
      return;
    }
    try {
      const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
      const saved = draft.some(
        (d: { id: string; type: string }) =>
          d.id === resolvedId && d.type === mapItemType(item.type)
      );
      setIsSaved(saved);
    } catch {
      setIsSaved(false);
    }
  }, [resolvedId, item.type]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!resolvedId || isSaved) return;
    const success = saveItem(resolvedId, mapItemType(item.type), item.nome, false, { neighborhood: item.bairro || undefined });
    if (success) setIsSaved(true);
  };

  const cardInner = (
    <>
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={item.nome}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
            ) : (
              <span className="text-lg text-muted-foreground/30">{item.nome.charAt(0)}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-medium text-foreground truncate">{item.nome}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{item.bairro}</span>
        </div>
        {item.meu_olhar && (
          <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2 leading-relaxed">
            {item.meu_olhar}
          </p>
        )}
      </div>
    </>
  );

  return (
    <div className="rounded-xl overflow-hidden bg-muted/60 border border-border/50">
      {detailUrl ? (
        <Link
          to={detailUrl}
          className="flex gap-3 p-3 hover:bg-muted transition-colors active:scale-[0.98]"
        >
          {cardInner}
        </Link>
      ) : (
        <div className="flex gap-3 p-3 opacity-80">{cardInner}</div>
      )}

      <button
        onClick={handleSave}
        disabled={!resolvedId}
        className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium border-t border-border/50 transition-colors ${
          isSaved
            ? "text-primary bg-primary/5"
            : "text-foreground/70 hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent"
        }`}
      >
        <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
        {isSaved ? "Salvo" : "Salvar"}
      </button>
    </div>
  );
}

export default function PlaceCardList({ items }: { items: PlaceItem[] }) {
  return (
    <div className="flex flex-col gap-3 my-2">
      {items.map((item, i) => (
        <PlaceCard key={`${item.id || item.nome}-${i}`} item={item} />
      ))}
    </div>
  );
}
