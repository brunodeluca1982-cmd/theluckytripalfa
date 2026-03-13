import { useEffect } from "react";
import { trackEvent, Events } from "@/lib/analytics";
import HeroVideoCarousel from "@/components/home/HeroVideoCarousel";
import OQueFazerAgora from "@/components/home/OQueFazerAgora";
import ClassicosDoRio from "@/components/home/ClassicosDoRio";
import DescobertasBruno from "@/components/home/DescobertasBruno";
import CitiesSection from "@/components/home/CitiesSection";
import PartnersCarousel from "@/components/home/PartnersCarousel";
import PlaylistViagem from "@/components/home/PlaylistViagem";
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

      {/* 3) CLÁSSICOS DO RIO — editorial essentials */}
      <ClassicosDoRio />

      {/* 4) DESCOBERTAS DO BRUNO — curated insider picks */}
      <DescobertasBruno />

      {/* 5) VIAJE NOS MAIS BUSCADOS */}
      <CitiesSection />

      {/* 6) VIAJE COMO ELES */}
      <PartnersCarousel />

      {/* 7) PLAYLIST DA VIAGEM */}
      <PlaylistViagem />

      {/* 8) CRIAR ROTEIRO CTA */}
      <CriarRoteiroCTA />
    </div>
  );
};

export default Index;
