import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, UtensilsCrossed } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useExternalRestaurants, normalizeNeighborhood, type ExternalRestaurant } from "@/hooks/use-external-restaurants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const RestaurantCard = ({ r }: { r: ExternalRestaurant }) => {
  const [loaded, setLoaded] = useState(false);
  const query = buildPlaceQuery(r.nome, r.bairro);
  const { photoUrl, isLoading } = usePlacePhoto(`home-rest-${r.id}`, "restaurant", query);
  const from = normalizeNeighborhood(r.bairro);

  return (
    <Link
      to={`/restaurante/${r.id}?from=${from}`}
      className="block rounded-2xl overflow-hidden border border-border bg-card"
    >
      <div className="relative aspect-[4/3] bg-muted">
        {(!loaded || isLoading) && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}
        {photoUrl && (
          <img
            src={photoUrl}
            alt={r.nome}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          {r.bairro}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <UtensilsCrossed className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">{r.categoria || "Restaurante"}</span>
        </div>
        <p className="text-foreground text-sm font-medium leading-tight line-clamp-2">{r.nome}</p>
      </div>
    </Link>
  );
};

const RestaurantesCarousel = () => {
  const { data: restaurants = [], isLoading } = useExternalRestaurants();

  const rioRestaurants = restaurants
    .filter((r) => r.ativo && r.cidade?.toLowerCase().includes("rio"))
    .slice(0, 10);

  if (isLoading || rioRestaurants.length === 0) return null;

  return (
    <section className="py-8 px-5">
      <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-1">
        Onde comer
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        Os melhores restaurantes do Rio.
      </p>

      <Carousel
        opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
        className="w-full -mx-5"
      >
        <CarouselContent className="ml-3 pr-5">
          {rioRestaurants.map((r) => (
            <CarouselItem key={r.id} className="pl-3 basis-[200px]">
              <RestaurantCard r={r} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default RestaurantesCarousel;
