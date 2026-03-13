import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

import rioHeroImg from "@/assets/highlights/rio-de-janeiro-hero.jpg";
import luckyListHeroImg from "@/assets/highlights/lucky-list-hero.jpg";
import saoPauloHeroImg from "@/assets/highlights/sao-paulo-hero.jpg";

interface Highlight {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  imageUrl: string;
}

// Static fallbacks
const STATIC_HIGHLIGHTS: Highlight[] = [
  { id: "rio-update", title: "Rio de Janeiro", subtitle: "Guia atualizado", path: "/destino/rio-de-janeiro", imageUrl: rioHeroImg },
  { id: "new-spots", title: "Novos Spots", subtitle: "Lucky List", path: "/lucky-list", imageUrl: luckyListHeroImg },
  { id: "weekend-trip", title: "Fim de Semana em São Paulo", subtitle: "Roteiros curtos", path: "/destinos", imageUrl: saoPauloHeroImg },
];

async function fetchHighlights(): Promise<Highlight[]> {
  const { data, error } = await supabase
    .from("home_hero_items")
    .select("*")
    .eq("is_active", true)
    .eq("show_on_home", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return STATIC_HIGHLIGHTS;

  return data.map((item) => {
    const image = item.thumbnail_url || item.video_url || "";
    const path = item.destination_slug
      ? `/destino/${item.destination_slug}`
      : item.permalink || "/destinos";

    return {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || item.button_label || "",
      path,
      imageUrl: image,
    };
  }).filter((h) => h.imageUrl);
}

const HighlightImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};

const HighlightsCarousel = () => {
  const { data: highlights = STATIC_HIGHLIGHTS } = useQuery({
    queryKey: ["home-highlights"],
    queryFn: fetchHighlights,
    staleTime: 5 * 60 * 1000,
  });

  // Never show items without images
  const visibleHighlights = highlights.filter((h) => h.imageUrl);
  if (visibleHighlights.length === 0) return null;

  return (
    <section className="py-6">
      <Carousel
        opts={{ align: "start", loop: false, dragFree: true, containScroll: "trimSnaps" }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 px-6">
          {visibleHighlights.map((highlight) => (
            <CarouselItem key={highlight.id} className="pl-2 basis-[280px]">
              <Link
                to={highlight.path}
                className="block aspect-[16/10] bg-muted rounded-lg border border-border overflow-hidden hover:border-foreground transition-colors relative"
              >
                <HighlightImage src={highlight.imageUrl} alt={highlight.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="h-full flex flex-col justify-end p-4 relative z-10">
                  <p className="text-xs uppercase tracking-wide text-white/80">{highlight.subtitle}</p>
                  <h3 className="text-lg font-serif font-medium text-white">{highlight.title}</h3>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default HighlightsCarousel;
