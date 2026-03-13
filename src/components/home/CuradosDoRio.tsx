import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, UtensilsCrossed, Hotel, Compass } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOQueFazer, type OQueFazerItem } from "@/hooks/use-o-que-fazer";
import { useExternalRestaurants, generateRestaurantSlug, type ExternalRestaurant } from "@/hooks/use-external-restaurants";
import { useExternalHotels, type ExternalHotel } from "@/hooks/use-external-hotels";
import { generateHotelSlug } from "@/pages/HotelDetail";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

/* ── Unified card item ── */
interface CuratedItem {
  id: string;
  nome: string;
  bairro: string;
  tipo: "hotel" | "restaurante" | "experiência";
  descricao?: string;
  link: string;
  photoKey: string;
  photoQuery: string;
  photoType: "hotel" | "restaurant" | "attraction";
}

function mapExperience(e: OQueFazerItem): CuratedItem {
  return {
    id: `exp-${e.id}`,
    nome: e.nome,
    bairro: e.bairro || "Rio de Janeiro",
    tipo: "experiência",
    descricao: e.meu_olhar || undefined,
    link: "/o-que-fazer",
    photoKey: `curado-exp-${e.id}`,
    photoQuery: buildPlaceQuery(e.nome, e.bairro || undefined),
    photoType: "attraction",
  };
}

function mapRestaurant(r: ExternalRestaurant): CuratedItem {
  const slug = generateRestaurantSlug(r.nome);
  return {
    id: `rest-${r.id}`,
    nome: r.nome,
    bairro: r.bairro,
    tipo: "restaurante",
    descricao: r.meu_olhar || undefined,
    link: `/restaurante/${slug}?from=${r.bairro}`,
    photoKey: `curado-rest-${r.id}`,
    photoQuery: buildPlaceQuery(r.nome, r.bairro),
    photoType: "restaurant",
  };
}

function mapHotel(h: ExternalHotel): CuratedItem {
  const slug = generateHotelSlug(h.nome);
  return {
    id: `hotel-${h.id}`,
    nome: h.nome,
    bairro: h.bairro,
    tipo: "hotel",
    descricao: h.meu_olhar || undefined,
    link: `/hotel/${slug}?from=${h.bairro}`,
    photoKey: `curado-hotel-${h.id}`,
    photoQuery: buildPlaceQuery(h.nome, h.bairro),
    photoType: "hotel",
  };
}

const TIPO_ICON = {
  hotel: Hotel,
  restaurante: UtensilsCrossed,
  "experiência": Compass,
} as const;

/* ── Card Image ── */
const CardImage = ({ item }: { item: CuratedItem }) => {
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

/* ── Main Section ── */
const CuradosDoRio = () => {
  const { data: experiences = [], isLoading: loadExp } = useOQueFazer();
  const { data: restaurants = [], isLoading: loadRest } = useExternalRestaurants();
  const { data: hotels = [], isLoading: loadHotel } = useExternalHotels();

  const isLoading = loadExp || loadRest || loadHotel;

  // Filter Rio only
  const rioRestaurants = restaurants
    .filter((r) => r.ativo && r.cidade?.toLowerCase().includes("rio"))
    .slice(0, 4);
  const rioHotels = hotels
    .filter((h) => h.ativo && h.cidade?.toLowerCase().includes("rio"))
    .slice(0, 4);
  const rioExperiences = experiences.slice(0, 4); // already filtered by hook

  // Interleave: experience, restaurant, hotel, experience, restaurant, hotel...
  const curated: CuratedItem[] = [];
  const maxLen = Math.max(rioExperiences.length, rioRestaurants.length, rioHotels.length);
  const seen = new Set<string>();

  for (let i = 0; i < maxLen; i++) {
    const items = [
      rioExperiences[i] ? mapExperience(rioExperiences[i]) : null,
      rioRestaurants[i] ? mapRestaurant(rioRestaurants[i]) : null,
      rioHotels[i] ? mapHotel(rioHotels[i]) : null,
    ];
    for (const item of items) {
      if (item && !seen.has(item.nome)) {
        seen.add(item.nome);
        curated.push(item);
      }
    }
  }

  if (isLoading || curated.length === 0) return null;

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
          {curated.map((item) => {
            const Icon = TIPO_ICON[item.tipo];
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
                        {item.tipo}
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

export default CuradosDoRio;
