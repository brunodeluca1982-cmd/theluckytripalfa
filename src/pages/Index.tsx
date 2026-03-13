import { useEffect } from "react";
import { trackEvent, Events } from "@/lib/analytics";
import HeroVideoCarousel from "@/components/home/HeroVideoCarousel";
import OQueFazerAgora from "@/components/home/OQueFazerAgora";
import CuradosDoRio from "@/components/home/CuradosDoRio";
import DescobertasBruno from "@/components/home/DescobertasBruno";
import PartnersCarousel from "@/components/home/PartnersCarousel";
import CriarRoteiroCTA from "@/components/home/CriarRoteiroCTA";

const Index = () => {
  useEffect(() => {
    trackEvent(Events.HOME_VIEW);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* 1) HERO VIDEO CAROUSEL */}
      <HeroVideoCarousel />

      {/* 2) O QUE FAZER AGORA — smart time-based rail */}
      <OQueFazerAgora />

      {/* 3) CURADOS DO RIO — hotels, restaurants, experiences */}
      <CuradosDoRio />

      {/* 4) DESCOBERTAS DO BRUNO — curated insider picks */}
      <DescobertasBruno />

      {/* 5) VIAJE COMO ELES */}
      <PartnersCarousel />

      {/* 6) CRIAR ROTEIRO CTA */}
      <CriarRoteiroCTA />
    </div>
  );
};

export default Index;
