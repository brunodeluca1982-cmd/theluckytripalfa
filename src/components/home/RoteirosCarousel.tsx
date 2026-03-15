import { Link } from "react-router-dom";
import { Map, Sparkles, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import rioHero from "@/assets/highlights/rio-de-janeiro-hero.jpg";

const SUGGESTED_ITINERARIES = [
  {
    id: "criar-roteiro",
    title: "Crie seu roteiro personalizado",
    subtitle: "Escolha datas, estilo e preferências",
    icon: Sparkles,
    link: "/criar-roteiro",
    accent: true,
  },
  {
    id: "ia-roteiro",
    title: "Roteiro com IA",
    subtitle: "Monte automaticamente a partir dos seus salvos",
    icon: Map,
    link: "/ia/roteiro-salvos",
    accent: false,
  },
  {
    id: "roteiros-inteligentes",
    title: "Roteiros Inteligentes",
    subtitle: "Sugestões editoriais prontas",
    icon: Map,
    link: "/ia/roteiros-inteligentes",
    accent: false,
  },
];

const RoteirosCarousel = () => {
  return (
    <section className="py-8 px-5">
      <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-1">
        Roteiros
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        Monte sua viagem do seu jeito.
      </p>

      <Carousel
        opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
        className="w-full -mx-5"
      >
        <CarouselContent className="ml-3 pr-5">
          {SUGGESTED_ITINERARIES.map((item) => {
            const Icon = item.icon;
            return (
              <CarouselItem key={item.id} className="pl-3 basis-[240px]">
                <Link
                  to={item.link}
                  className={`block rounded-2xl overflow-hidden border ${
                    item.accent
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-card"
                  } p-4 h-full`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                    item.accent
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-foreground text-sm font-medium leading-tight mb-1">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed mb-3">
                    {item.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                    Começar <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default RoteirosCarousel;
