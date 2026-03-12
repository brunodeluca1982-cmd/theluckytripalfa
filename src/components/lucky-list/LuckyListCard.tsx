import { MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import type { LuckyListItem } from "@/hooks/use-lucky-list";

interface LuckyListCardProps {
  item: LuckyListItem;
}

const slugify = (id: string) =>
  id
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

export function LuckyListCard({ item }: LuckyListCardProps) {
  const placeQuery = buildPlaceQuery(item.nome, item.bairro ?? undefined);
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(
    slugify(item.nome),
    "attraction",
    placeQuery
  );

  const mapsUrl =
    item.google_maps ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${item.nome}, ${item.bairro || "Rio de Janeiro"}`
    )}`;

  return (
    <article className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/15 transition-all hover:bg-white/15">
      {/* Image */}
      <div className="relative aspect-[16/9] bg-white/5 overflow-hidden">
        {photoLoading ? (
          <div className="absolute inset-0 animate-pulse bg-white/10" />
        ) : photoUrl ? (
          <img
            src={photoUrl}
            alt={item.nome}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
            <MapPin className="w-8 h-8 text-white/20" />
          </div>
        )}
        {item.categoria_experiencia && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-[11px] font-medium text-white/80 tracking-wide uppercase">
            {item.categoria_experiencia}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">
            {item.nome}
          </h3>
        </div>

        {item.bairro && (
          <p className="text-xs text-white/50 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {item.bairro}
          </p>
        )}

        {item.meu_olhar && (
          <p className="text-sm text-white/70 leading-relaxed line-clamp-2 italic">
            "{item.meu_olhar}"
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Link
            to={`/lucky-list/${item.id}`}
            className="flex-1 text-center px-3 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Detalhes
          </Link>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver no Mapa
          </a>
        </div>
      </div>
    </article>
  );
}
