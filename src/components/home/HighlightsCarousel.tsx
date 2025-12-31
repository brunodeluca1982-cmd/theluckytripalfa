import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

import rioHeroImg from "@/assets/highlights/rio-de-janeiro-hero.jpg";
import luckyListHeroImg from "@/assets/highlights/lucky-list-hero.jpg";
import saoPauloHeroImg from "@/assets/highlights/sao-paulo-hero.jpg";

/**
 * HIGHLIGHTS CAROUSEL
 * 
 * Horizontal carousel, Netflix-style.
 * Used for new destinations, recently updated guides, featured trips.
 * Acts as a living editorial feed.
 */

interface Highlight {
  id: string;
  title: string;
  subtitle: string;
  type: "destination" | "guide" | "trip";
  path: string;
  imageUrl?: string;
}

// Structural placeholder data
const highlights: Highlight[] = [
  {
    id: "rio-update",
    title: "Rio de Janeiro",
    subtitle: "Guia atualizado",
    type: "destination",
    path: "/destino/rio-de-janeiro",
    imageUrl: rioHeroImg,
  },
  {
    id: "new-spots",
    title: "Novos Spots",
    subtitle: "Lucky List",
    type: "guide",
    path: "/lucky-list",
    imageUrl: luckyListHeroImg,
  },
  {
    id: "weekend-trip",
    title: "Fim de Semana em São Paulo",
    subtitle: "Roteiros curtos",
    type: "trip",
    path: "/destinos",
    imageUrl: saoPauloHeroImg,
  },
];

const HighlightImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <>
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};

const HighlightsCarousel = () => {
  return (
    <section className="py-6">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 px-6">
          {highlights.map((highlight) => (
            <CarouselItem key={highlight.id} className="pl-2 basis-[280px]">
              <Link
                to={highlight.path}
                className="block aspect-[16/10] bg-muted rounded-lg border border-border overflow-hidden hover:border-foreground transition-colors relative"
              >
                {highlight.imageUrl && (
                  <>
                    <HighlightImage src={highlight.imageUrl} alt={highlight.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </>
                )}
                <div className="h-full flex flex-col justify-end p-4 relative z-10">
                  <p className={`text-xs uppercase tracking-wide ${highlight.imageUrl ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {highlight.subtitle}
                  </p>
                  <h3 className={`text-lg font-serif font-medium ${highlight.imageUrl ? 'text-white' : 'text-foreground'}`}>
                    {highlight.title}
                  </h3>
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
