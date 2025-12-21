import SearchField from "@/components/home/SearchField";
import PartnersSection from "@/components/home/PartnersSection";
import HighlightsCarousel from "@/components/home/HighlightsCarousel";
import DestinationsPortal from "@/components/home/DestinationsPortal";
import BrandLogo from "@/components/home/BrandLogo";

/**
 * HOME SCREEN — THE LUCKY TRIP
 * 
 * Primary entry point of the app after onboarding.
 * Serves as discovery hub, personal control center,
 * and gateway to destinations and planning.
 * 
 * STRUCTURE (TOP TO BOTTOM):
 * 1. Brand Header
 * 2. Search / Prompt Field
 * 3. Partners on Trip
 * 4. Highlights Carousel
 * 5. Destinations Portal
 * 
 * Bottom navigation handled separately in layout.
 */

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* 1) BRAND HEADER */}
      <header className="px-6 pt-12 pb-6 text-center">
        <BrandLogo />
      </header>

      {/* 2) SEARCH / PROMPT FIELD */}
      <SearchField />

      {/* 3) PARTNERS ON TRIP */}
      <PartnersSection />

      {/* 4) HIGHLIGHTS CAROUSEL */}
      <HighlightsCarousel />

      {/* 5) DESTINATIONS PORTAL */}
      <DestinationsPortal />
    </div>
  );
};

export default Index;
