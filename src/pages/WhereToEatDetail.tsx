import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";

const neighborhoodData: Record<string, { name: string; description: string }> = {
  copacabana: {
    name: "Copacabana",
    description: "From traditional Portuguese taverns to contemporary seafood restaurants, Copacabana offers an eclectic dining scene shaped by decades of cultural diversity.",
  },
  ipanema: {
    name: "Ipanema",
    description: "A refined food scene where organic bistros meet inventive fusion kitchens, reflecting the neighborhood's sophisticated yet laid-back character.",
  },
  leblon: {
    name: "Leblon",
    description: "Rio's most exclusive dining destination, home to award-winning chefs and intimate restaurants that define contemporary Brazilian gastronomy.",
  },
  leme: {
    name: "Leme",
    description: "A quieter culinary pocket with family-run establishments serving generous portions of traditional carioca comfort food.",
  },
  "sao-conrado": {
    name: "São Conrado",
    description: "An upscale residential enclave with select dining options, from elegant hotel restaurants to casual beachside spots.",
  },
  "barra-da-tijuca": {
    name: "Barra da Tijuca",
    description: "Modern dining hubs and beachfront restaurants catering to families and groups with diverse international options.",
  },
  "santa-teresa": {
    name: "Santa Teresa",
    description: "Bohemian eateries and artist-run cafés tucked into colonial buildings, offering creative takes on Brazilian classics.",
  },
  centro: {
    name: "Centro",
    description: "Historic lunch counters, traditional bars, and century-old confeitarias preserving the flavors of old Rio.",
  },
};

const restaurantsByNeighborhood: Record<string, Record<string, { name: string; description: string }[]>> = {
  copacabana: {
    Brazilian: [
      { name: "Restaurant Placeholder", description: "Traditional feijoada and regional specialties." },
      { name: "Restaurant Placeholder", description: "Classic churrascaria experience." },
    ],
    Japanese: [
      { name: "Restaurant Placeholder", description: "Fresh sushi with Brazilian influences." },
    ],
    Italian: [
      { name: "Restaurant Placeholder", description: "Handmade pasta in a cozy setting." },
    ],
    "Casual / Cafés": [
      { name: "Restaurant Placeholder", description: "Coffee and pastries with ocean views." },
      { name: "Restaurant Placeholder", description: "Quick bites and fresh juices." },
    ],
  },
  ipanema: {
    Brazilian: [
      { name: "Restaurant Placeholder", description: "Contemporary carioca cuisine." },
    ],
    Japanese: [
      { name: "Restaurant Placeholder", description: "Omakase experience by the beach." },
      { name: "Restaurant Placeholder", description: "Casual sushi bar." },
    ],
    Italian: [
      { name: "Restaurant Placeholder", description: "Neapolitan pizza and natural wines." },
    ],
    "Casual / Cafés": [
      { name: "Restaurant Placeholder", description: "Organic brunch spot." },
      { name: "Restaurant Placeholder", description: "Açaí and healthy bowls." },
    ],
  },
  leblon: {
    Brazilian: [
      { name: "Restaurant Placeholder", description: "Fine dining Brazilian tasting menu." },
      { name: "Restaurant Placeholder", description: "Modern interpretations of regional dishes." },
    ],
    Japanese: [
      { name: "Restaurant Placeholder", description: "High-end omakase." },
    ],
    Italian: [
      { name: "Restaurant Placeholder", description: "Elegant Italian with local ingredients." },
    ],
    "Casual / Cafés": [
      { name: "Restaurant Placeholder", description: "Upscale café and patisserie." },
    ],
  },
  leme: {
    Brazilian: [
      { name: "Restaurant Placeholder", description: "Homestyle cooking and generous portions." },
    ],
    "Casual / Cafés": [
      { name: "Restaurant Placeholder", description: "Neighborhood bakery and café." },
    ],
  },
  "barra-da-tijuca": {
    Brazilian: [
      { name: "Restaurant Placeholder", description: "Family-style churrascaria." },
    ],
    Japanese: [
      { name: "Restaurant Placeholder", description: "Contemporary Japanese fusion." },
    ],
    Italian: [
      { name: "Restaurant Placeholder", description: "Wood-fired pizzas." },
    ],
    "Casual / Cafés": [
      { name: "Restaurant Placeholder", description: "Beachfront juice bar." },
    ],
  },
  "sao-conrado": {},
  "santa-teresa": {
    Brazilian: [
      { name: "Restaurant Placeholder", description: "Creative Brazilian in a colonial house." },
    ],
    "Casual / Cafés": [
      { name: "Restaurant Placeholder", description: "Artist-run café with live music." },
      { name: "Restaurant Placeholder", description: "Bohemian bar with petiscos." },
    ],
  },
  centro: {
    Brazilian: [
      { name: "Restaurant Placeholder", description: "Historic lunch counter since 1920." },
      { name: "Restaurant Placeholder", description: "Traditional boteco experience." },
    ],
    "Casual / Cafés": [
      { name: "Restaurant Placeholder", description: "Century-old confeitaria." },
    ],
  },
};

const WhereToEatDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const [searchParams] = useSearchParams();
  
  const data = neighborhoodData[neighborhood || ""] || { name: "Neighborhood", description: "" };
  const restaurants = restaurantsByNeighborhood[neighborhood || ""] || {};
  
  const from = searchParams.get("from");
  const backPath = from === "map" ? "/eat-map-view" : "/eat-map-view";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            Where to eat in {data.name}
          </h1>
        </div>

        {/* Media Placeholder - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Image or video placeholder</p>
        </div>

        {/* Description */}
        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            {data.description || `Placeholder description for ${data.name}'s food scene.`}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Restaurants by Cuisine Type */}
        {Object.entries(restaurants).map(([cuisineType, restaurantList]) => (
          <section key={cuisineType} className="px-6 pt-8">
            <h2 className="text-xl font-serif font-medium text-foreground mb-6">
              {cuisineType}
            </h2>
            
            <div>
              {restaurantList.map((restaurant, index) => (
                <RestaurantCard
                  key={index}
                  name={restaurant.name}
                  description={restaurant.description}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {data.name}
        </p>
      </footer>
    </div>
  );
};

export default WhereToEatDetail;
