import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOQueFazer, type OQueFazerItem } from "@/hooks/use-o-que-fazer";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";

function getCurrentMomentoLabel(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "Manhã no Rio";
  if (h >= 12 && h < 18) return "Tarde no Rio";
  return "Noite no Rio";
}

const CardImage = ({ item }: { item: OQueFazerItem }) => {
  const [loaded, setLoaded] = useState(false);
  const placeQuery = buildPlaceQuery(item.nome, item.bairro || undefined);
  const { photoUrl, isLoading } = usePlacePhoto(
    item.id,
    "attraction",
    placeQuery
  );

  return (
    <div className="relative aspect-[4/3] bg-muted">
      {(!loaded || isLoading) && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      {photoUrl && (
        <img
          src={photoUrl}
          alt={item.nome}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {item.bairro && (
        <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          {item.bairro}
        </span>
      )}
      {item.vibe && (
        <span className="absolute top-2 left-2 text-[10px] font-medium text-white bg-primary/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
          {item.vibe}
        </span>
      )}
    </div>
  );
};

const OQueFazerAgora = () => {
  const { data: items = [], isLoading } = useOQueFazer();
  // Already smart-sorted by momento_ideal match from the hook
  const topItems = items.slice(0, 8);
  const momentoLabel = getCurrentMomentoLabel();

  if (isLoading || topItems.length === 0) return null;

  return (
    <section className="py-8 px-5">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-4 h-4 text-primary" />
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">
          O que fazer agora
        </h2>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5 ml-6">
        {momentoLabel} — o melhor para este momento.
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
        {topItems.map((item) => (
          <Link
            key={item.id}
            to="/o-que-fazer"
            className="flex-shrink-0 w-[180px] rounded-2xl overflow-hidden border border-border bg-card"
          >
            <CardImage item={item} />
            <div className="px-3 py-2.5">
              <p className="text-foreground text-sm font-medium leading-tight line-clamp-2">
                {item.nome}
              </p>
              {item.duracao_media && (
                <p className="text-muted-foreground text-[10px] mt-1">
                  {item.duracao_media}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default OQueFazerAgora;
