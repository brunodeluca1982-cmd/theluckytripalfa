import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/use-subscription";
import { useLuckyList, type LuckyListItem } from "@/hooks/use-lucky-list";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import LuckyProPaywall from "@/components/lucky-pro/LuckyProPaywall";
import brunImg from "@/assets/partners/bruno-de-luca.jpeg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const CardImage = ({ item }: { item: LuckyListItem }) => {
  const [loaded, setLoaded] = useState(false);
  const placeQuery = buildPlaceQuery(item.nome, item.bairro || undefined);
  const { photoUrl, isLoading } = usePlacePhoto(
    `bruno-${item.id}`,
    "attraction",
    placeQuery
  );

  return (
    <div className="relative aspect-[4/3] bg-muted">
      {(!loaded || isLoading) && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={item.nome}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary/30" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
      {item.bairro && (
        <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          {item.bairro}
        </span>
      )}
    </div>
  );
};

const DescobertasBruno = () => {
  const { isPremium } = useSubscription();
  const { data: items = [], isLoading } = useLuckyList();
  const [showPaywall, setShowPaywall] = useState(false);

  const discoveries = items.slice(0, 6);
  const freeLimit = 3;

  if (isLoading || discoveries.length === 0) return null;

  return (
    <>
      <section className="py-8 px-5">
        <div className="flex items-center gap-3 mb-1">
          <img
            src={brunImg}
            alt="Bruno De Luca"
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">
            Descobertas do Bruno
          </h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 ml-11">
          Os achados favoritos do nosso curador local no Rio.
        </p>

        <Carousel
          opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
          className="w-full -mx-5"
        >
          <CarouselContent className="ml-3 pr-5">
            {discoveries.map((item, i) => {
              const isLocked = !isPremium && i >= freeLimit;

              if (isLocked) {
                return (
                  <CarouselItem key={item.id} className="pl-3 basis-[200px]">
                    <button
                      onClick={() => setShowPaywall(true)}
                      className="w-full rounded-2xl overflow-hidden border border-border bg-card text-left relative"
                    >
                      <div className="relative aspect-[4/3] bg-muted">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 blur-[4px]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1.5 rounded-full">
                            <Lock className="w-3 h-3" />
                            Lucky Pro
                          </span>
                        </div>
                      </div>
                      <div className="px-3 py-3">
                        <p className="text-foreground text-sm font-medium leading-tight line-clamp-2 blur-[3px]">
                          {item.nome}
                        </p>
                        <p className="text-muted-foreground text-[11px] mt-1 blur-[3px]">
                          {item.meu_olhar}
                        </p>
                      </div>
                    </button>
                  </CarouselItem>
                );
              }

              return (
                <CarouselItem key={item.id} className="pl-3 basis-[200px]">
                  <Link
                    to={`/lucky-list/${item.id}`}
                    className="block rounded-2xl overflow-hidden border border-border bg-card"
                  >
                    <CardImage item={item} />
                    <div className="px-3 py-3">
                      <p className="text-foreground text-sm font-medium leading-tight line-clamp-2">
                        {item.nome}
                      </p>
                      <p className="text-muted-foreground text-[11px] mt-1 line-clamp-2">
                        {item.meu_olhar}
                      </p>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </section>
      <LuckyProPaywall open={showPaywall} onClose={() => setShowPaywall(false)} />
    </>
  );
};

export default DescobertasBruno;
