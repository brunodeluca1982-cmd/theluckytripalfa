import { useEffect } from "react";
import { trackEvent, Events } from "@/lib/analytics";
import HeroVideoCarousel from "@/components/home/HeroVideoCarousel";
import OQueFazerAgora from "@/components/home/OQueFazerAgora";
import CuradosParaVoce from "@/components/home/CuradosDoRio";
import SeuRioMaisLucky from "@/components/home/SeuRioMaisLucky";
import PartnersCarousel from "@/components/home/PartnersCarousel";
import CriarRoteiroCTA from "@/components/home/CriarRoteiroCTA";
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

      {/* 2) O QUE FAZER AGORA — contextual, time-aware */}
      {!isLoading && <OQueFazerAgora items={contextual} />}

      {/* 3) CURADOS PARA VOCÊ — diverse editorial discovery */}
      {!isLoading && <CuradosParaVoce items={editorial} />}

      {/* 4) SEU RIO MAIS LUCKY — identity & aspiration moods */}
      {!isLoading && <SeuRioMaisLucky moods={moods} />}

      {/* 5) VIAJE COMO ELES */}
      <PartnersCarousel />

      {/* 6) CRIAR ROTEIRO CTA */}
      <CriarRoteiroCTA />
    </div>
  );
};

export default Index;
