import { Link } from "react-router-dom";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { MapPin, Bookmark } from "lucide-react";
import { useItemSave } from "@/hooks/use-item-save";
import { useState, useEffect } from "react";

interface PlaceItem {
  type: "restaurant" | "hotel" | "experience";
  nome: string;
  bairro: string;
  meu_olhar?: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function getDetailUrl(item: PlaceItem): string {
  const slug = generateSlug(item.nome);
  const from = generateSlug(item.bairro);
  switch (item.type) {
    case "restaurant":
      return `/restaurante/${slug}?from=${from}`;
    case "hotel":
      return `/hotel/${slug}?from=${from}`;
    case "experience":
      return `/atividade/${slug}?from=${from}`;
    default:
      return "#";
  }
}

function mapItemType(type: PlaceItem["type"]): "activity" | "restaurant" | "hotel" {
  if (type === "experience") return "activity";
  return type;
}

function PlaceCard({ item }: { item: PlaceItem }) {
  const placeQuery = buildPlaceQuery(item.nome, item.bairro);
  const itemType = item.type === "experience" ? "attraction" : item.type;
  const { photoUrl, isLoading } = usePlacePhoto(
    generateSlug(item.nome),
    itemType as "hotel" | "restaurant" | "attraction",
    placeQuery
  );

  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);
  const slug = generateSlug(item.nome);

  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
      const saved = draft.some(
        (d: { id: string; type: string }) =>
          d.id === slug && d.type === mapItemType(item.type)
      );
      setIsSaved(saved);
    } catch {}
  }, [slug, item.type]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) return;
    const success = saveItem(slug, mapItemType(item.type), item.nome, false);
    if (success) setIsSaved(true);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-muted/60 border border-border/50">
      <Link
        to={getDetailUrl(item)}
        className="flex gap-3 p-3 hover:bg-muted transition-colors active:scale-[0.98]"
      >
        {/* Thumbnail */}
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

        {/* Info */}
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
      </Link>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium border-t border-border/50 transition-colors ${
          isSaved
            ? "text-primary bg-primary/5"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
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
        <PlaceCard key={`${item.nome}-${i}`} item={item} />
      ))}
    </div>
  );
}
