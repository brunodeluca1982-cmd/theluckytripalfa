import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlacePhoto } from "@/hooks/use-place-photo";
import type { PoolItem } from "@/hooks/use-home-content-pool";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function getCurrentMomentoLabel(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "Manhã no Rio";
  if (h >= 12 && h < 18) return "Tarde no Rio";
  return "Noite no Rio";
}

const CardImage = ({ item }: { item: PoolItem }) => {
  const [loaded, setLoaded] = useState(false);
  const { photoUrl, isLoading } = usePlacePhoto(
    item.photoKey,
    item.photoType,
    item.photoQuery
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

interface OQueFazerAgoraProps {
  items: PoolItem[];
}

const OQueFazerAgora = ({ items }: OQueFazerAgoraProps) => {
  const momentoLabel = getCurrentMomentoLabel();

  if (items.length === 0) return null;

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

      <Carousel
        opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
        className="w-full -mx-5"
      >
        <CarouselContent className="ml-3 pr-5">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-3 basis-[180px]">
              <Link
                to={item.link}
                className="block rounded-2xl overflow-hidden border border-border bg-card"
              >
                <CardImage item={item} />
                <div className="px-3 py-2.5">
                  <p className="text-foreground text-sm font-medium leading-tight line-clamp-2">
                    {item.nome}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default OQueFazerAgora;
