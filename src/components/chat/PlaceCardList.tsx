import { Link } from "react-router-dom";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { MapPin } from "lucide-react";

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

function PlaceCard({ item }: { item: PlaceItem }) {
  const placeQuery = buildPlaceQuery(item.nome, item.bairro);
  const itemType = item.type === "experience" ? "attraction" : item.type;
  const { photoUrl, isLoading } = usePlacePhoto(
    generateSlug(item.nome),
    itemType as "hotel" | "restaurant" | "attraction",
    placeQuery
  );

  return (
    <Link
      to={getDetailUrl(item)}
      className="flex gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-all active:scale-[0.98]"
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={item.nome}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
            ) : (
              <span className="text-lg text-white/20">{item.nome.charAt(0)}</span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-medium text-white truncate">{item.nome}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-white/40" />
          <span className="text-xs text-white/50">{item.bairro}</span>
        </div>
        {item.meu_olhar && (
          <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
            {item.meu_olhar}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function PlaceCardList({ items }: { items: PlaceItem[] }) {
  return (
    <div className="flex flex-col gap-2 my-1">
      {items.map((item, i) => (
        <PlaceCard key={`${item.nome}-${i}`} item={item} />
      ))}
    </div>
  );
}
