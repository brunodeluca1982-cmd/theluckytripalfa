import HeroVideoCarousel from "@/components/home/HeroVideoCarousel";
import CitiesSection from "@/components/home/CitiesSection";
import PartnersCarousel from "@/components/home/PartnersCarousel";
import DescobertasBruno from "@/components/home/DescobertasBruno";
import MiniFerias from "@/components/home/MiniFerias";
import PlaylistViagem from "@/components/home/PlaylistViagem";
import CriarRoteiroCTA from "@/components/home/CriarRoteiroCTA";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* 1) HERO VIDEO CAROUSEL */}
      <HeroVideoCarousel />

      {/* 2) DESCOBERTAS DO BRUNO */}
      <DescobertasBruno />

      {/* 3) VIAJE NOS MAIS BUSCADOS */}
      <CitiesSection />

      {/* 4) VIAJE COMO ELES */}
      <PartnersCarousel />

      {/* 5) IDEIAS PARA MINI FÉRIAS */}
      <MiniFerias />

      {/* 6) PLAYLIST DA VIAGEM */}
      <PlaylistViagem />

      {/* 7) CRIAR ROTEIRO CTA */}
      <CriarRoteiroCTA />
    </div>
  );
};

export default Index;
