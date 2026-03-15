import { useEffect } from "react";
import { trackEvent, Events } from "@/lib/analytics";
import HeroVideoCarousel from "@/components/home/HeroVideoCarousel";
import HighlightsCarousel from "@/components/home/HighlightsCarousel";
import OQueFazerAgora from "@/components/home/OQueFazerAgora";
import CuradosParaVoce from "@/components/home/CuradosDoRio";
import SeuRioMaisLucky from "@/components/home/SeuRioMaisLucky";
import PartnersCarousel from "@/components/home/PartnersCarousel";
import CriarRoteiroCTA from "@/components/home/CriarRoteiroCTA";
import RestaurantesCarousel from "@/components/home/RestaurantesCarousel";
import HoteisCarousel from "@/components/home/HoteisCarousel";
import RoteirosCarousel from "@/components/home/RoteirosCarousel";
import LuckyListCTA from "@/components/home/LuckyListCTA";
import { useHomeContentPool } from "@/hooks/use-home-content-pool";

const Index = () => {
  useEffect(() => {
    trackEvent(Events.HOME_VIEW);
  }, []);

  const { contextual, editorial, moods, isLoading } = useHomeContentPool();

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* 1) HERO VIDEO CAROUSEL */}
      <HeroVideoCarousel />

      {/* 1.5) DESTAQUES — horizontal highlight cards */}
      <HighlightsCarousel />

      {/* 2) O QUE FAZER AGORA — contextual, time-aware */}
      {!isLoading && <OQueFazerAgora items={contextual} />}

      {/* 3) CURADOS PARA VOCÊ — diverse editorial discovery */}
      {!isLoading && <CuradosParaVoce items={editorial} />}

      {/* 4) RESTAURANTES — dedicated restaurant carousel */}
      <RestaurantesCarousel />

      {/* 5) HOTÉIS — dedicated hotel carousel */}
      <HoteisCarousel />

      {/* 6) LUCKY LIST CTA — premium teaser */}
      <LuckyListCTA />

      {/* 7) SEU RIO MAIS LUCKY — identity & aspiration moods */}
      {!isLoading && <SeuRioMaisLucky moods={moods} />}

      {/* 8) ROTEIROS — itinerary options */}
      <RoteirosCarousel />

      {/* 9) VIAJE COMO ELES */}
      <PartnersCarousel />

      {/* 10) CRIAR ROTEIRO CTA */}
      <CriarRoteiroCTA />
    </div>
  );
};

export default Index;
