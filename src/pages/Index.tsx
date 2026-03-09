import HeroVideoCarousel from "@/components/home/HeroVideoCarousel";
import CitiesSection from "@/components/home/CitiesSection";
import PartnersCarousel from "@/components/home/PartnersCarousel";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* 1) HERO VIDEO CAROUSEL */}
      <HeroVideoCarousel />

      {/* 2) CONHEÇA AS CIDADES MAIS BUSCADAS */}
      <CitiesSection />

      {/* 3) VIAJE COMO ELES */}
      <PartnersCarousel />
    </div>
  );
};

export default Index;
