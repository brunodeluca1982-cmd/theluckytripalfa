import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, BedDouble } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useExternalHotels, type ExternalHotel } from "@/hooks/use-external-hotels";
import { normalizeNeighborhood } from "@/hooks/use-external-restaurants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const HotelCard = ({ h }: { h: ExternalHotel }) => {
  const [loaded, setLoaded] = useState(false);
  const query = buildPlaceQuery(h.nome, h.bairro);
  const { photoUrl, isLoading } = usePlacePhoto(`home-hotel-${h.id}`, "hotel", query);
  const from = normalizeNeighborhood(h.bairro);

  return (
    <Link
      to={`/hotel/${h.id}?from=${from}`}
      className="block rounded-2xl overflow-hidden border border-border bg-card"
    >
      <div className="relative aspect-[4/3] bg-muted">
        {(!loaded || isLoading) && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}
        {photoUrl && (
          <img
            src={photoUrl}
            alt={h.nome}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          {h.bairro}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <BedDouble className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">{h.categoria || "Hotel"}</span>
        </div>
        <p className="text-foreground text-sm font-medium leading-tight line-clamp-2">{h.nome}</p>
      </div>
    </Link>
  );
};

const HoteisCarousel = () => {
  const { data: hotels = [], isLoading } = useExternalHotels();

  const rioHotels = hotels
    .filter((h) => h.ativo && h.cidade?.toLowerCase().includes("rio"))
    .slice(0, 10);

  if (isLoading || rioHotels.length === 0) return null;

  return (
    <section className="py-8 px-5">
      <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-1">
        Onde ficar
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        Hotéis selecionados no Rio.
      </p>

      <Carousel
        opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
        className="w-full -mx-5"
      >
        <CarouselContent className="ml-3 pr-5">
          {rioHotels.map((h) => (
            <CarouselItem key={h.id} className="pl-3 basis-[200px]">
              <HotelCard h={h} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default HoteisCarousel;
