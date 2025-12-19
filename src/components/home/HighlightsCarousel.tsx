import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
}

// Structural placeholder data
const highlights: Highlight[] = [
  {
    id: "rio-update",
    title: "Rio de Janeiro",
    subtitle: "Guia atualizado",
    type: "destination",
    path: "/destino/rio-de-janeiro",
  },
  {
    id: "new-spots",
    title: "Novos Spots",
    subtitle: "Lucky List",
    type: "guide",
    path: "/lucky-list",
  },
  {
    id: "weekend-trip",
    title: "Fim de Semana",
    subtitle: "Roteiros curtos",
    type: "trip",
    path: "/destinos",
  },
];

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
                className="block aspect-[16/10] bg-muted rounded-lg border border-border overflow-hidden hover:border-foreground transition-colors"
              >
                <div className="h-full flex flex-col justify-end p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {highlight.subtitle}
                  </p>
                  <h3 className="text-lg font-serif font-medium text-foreground">
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
