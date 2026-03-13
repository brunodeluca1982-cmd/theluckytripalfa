import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, UtensilsCrossed, Hotel, Compass, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlacePhoto } from "@/hooks/use-place-photo";
import type { PoolItem } from "@/hooks/use-home-content-pool";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const TIPO_ICON = {
  hotel: Hotel,
  restaurante: UtensilsCrossed,
  "experiência": Compass,
  lucky: Star,
} as const;

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
      <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
        <MapPin className="w-2.5 h-2.5" />
        {item.bairro}
      </span>
    </div>
  );
};

interface CuradosParaVoceProps {
  items: PoolItem[];
}

const CuradosParaVoce = ({ items }: CuradosParaVoceProps) => {
  if (items.length === 0) return null;

  return (
    <section className="py-8 px-5">
      <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-1">
        Curados para você
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        Hotéis, restaurantes e experiências no Rio.
      </p>

      <Carousel
        opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
        className="w-full -mx-5"
      >
        <CarouselContent className="ml-3 pr-5">
          {items.map((item) => {
            const Icon = TIPO_ICON[item.tipo] || Compass;
            const label = item.tipo === "lucky" ? "Lucky List" : item.tipo;
            return (
              <CarouselItem key={item.id} className="pl-3 basis-[200px]">
                <Link
                  to={item.link}
                  className="block rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <CardImage item={item} />
                  <div className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {label}
                      </span>
                    </div>
                    <p className="text-foreground text-sm font-medium leading-tight line-clamp-2">
                      {item.nome}
                    </p>
                    {item.descricao && (
                      <p className="text-muted-foreground text-[11px] mt-1 line-clamp-2">
                        {item.descricao}
                      </p>
                    )}
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default CuradosParaVoce;
