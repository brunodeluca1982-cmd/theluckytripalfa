import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOQueFazer, type OQueFazerItem } from "@/hooks/use-o-que-fazer";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

/** Keywords that signal a "classic" experience */
const CLASSIC_KEYWORDS = [
  "cristo", "pão de açúcar", "sugarloaf", "corcovado",
  "copacabana", "ipanema", "lapa", "maracanã",
  "jardim botânico", "arpoador", "praia", "beach",
  "selaron", "santa teresa",
];

function isClassic(item: OQueFazerItem): boolean {
  const text = `${item.nome} ${item.categoria} ${item.bairro || ""} ${(item.tags_ia || []).join(" ")}`.toLowerCase();
  return CLASSIC_KEYWORDS.some((kw) => text.includes(kw));
}

const CardImage = ({ item }: { item: OQueFazerItem }) => {
  const [loaded, setLoaded] = useState(false);
  const placeQuery = buildPlaceQuery(item.nome, item.bairro || undefined);
  const { photoUrl, isLoading } = usePlacePhoto(
    `classic-${item.id}`,
    "attraction",
    placeQuery
  );

  return (
    <div className="relative aspect-[3/4] bg-muted">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      {item.bairro && (
        <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          {item.bairro}
        </span>
      )}
    </div>
  );
};

const ClassicosDoRio = () => {
  const { data: items = [], isLoading } = useOQueFazer();
  const classics = items.filter(isClassic).slice(0, 10);

  if (isLoading || classics.length === 0) return null;

  return (
    <section className="py-8 px-5">
      <div className="flex items-center gap-2 mb-1">
        <Star className="w-4 h-4 text-primary" />
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">
          Clássicos do Rio
        </h2>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5 ml-6">
        Os imperdíveis para qualquer viagem ao Rio.
      </p>

      <Carousel
        opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
        className="w-full -mx-5"
      >
        <CarouselContent className="ml-3 pr-5">
          {classics.map((item) => (
            <CarouselItem key={item.id} className="pl-3 basis-[160px]">
              <Link
                to="/o-que-fazer"
                className="relative block rounded-2xl overflow-hidden"
              >
                <CardImage item={item} />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium leading-tight line-clamp-2">
                    {item.nome}
                  </p>
                  {item.categoria && (
                    <p className="text-white/60 text-[10px] mt-0.5">
                      {item.categoria}
                    </p>
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ClassicosDoRio;
