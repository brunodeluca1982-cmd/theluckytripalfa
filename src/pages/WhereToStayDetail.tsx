import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import HotelCard from "@/components/HotelCard";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";

// Neighborhood descriptions for staying
const neighborhoodDescriptions: Record<string, string> = {
  ipanema: "The epitome of Rio chic. Ipanema offers a perfect blend of beach life, upscale dining, and cultural sophistication in a walkable, vibrant neighborhood.",
  leblon: "Rio's most exclusive address. A quieter, more refined alternative to Ipanema with top restaurants, boutique shopping, and pristine beaches.",
  copacabana: "The iconic crescent beach with endless energy. From grand historic hotels to modern apartments, Copacabana offers classic Rio at every price point.",
  leme: "A peaceful extension of Copacabana with a village-like atmosphere. Perfect for those seeking beach access with tranquility.",
  "sao-conrado": "An upscale enclave between mountains and sea. Home to luxury condos, a world-class golf course, and dramatic natural beauty.",
  "barra-da-tijuca": "Modern, spacious, and family-friendly. Long beaches, shopping malls, and contemporary apartments for those who prefer a suburban vibe.",
  recreio: "The last beach frontier. A laid-back neighborhood with pristine sands, surfer culture, and genuine local character.",
  "santa-teresa": "Bohemian charm in the hills. Colonial mansions, artist studios, and panoramic views make this Rio's most atmospheric neighborhood.",
  centro: "The historic heart of Rio. Grand architecture, cultural institutions, and a glimpse into the city's past. Best for culture-focused travelers.",
};

// Hotel data by neighborhood
const hotelsByNeighborhood: Record<string, { 
  name: string; 
  price: string; 
  description: string;
  address?: string;
  instagram?: string;
  externalLink?: string;
}[]> = {
  ipanema: [
    { 
      name: "Hotel Fasano Rio de Janeiro", 
      price: "$$$$", 
      description: "The most classic luxury address in Rio. The rooftop has become the setting for campaigns, interviews and important meetings. I've seen football players, people from cinema, fashion and music there — all looking for view, discretion and impeccable service.",
      address: "https://maps.google.com/?q=Hotel+Fasano+Rio+de+Janeiro",
      instagram: "@fasano",
      externalLink: ""
    },
    { 
      name: "Ipanema Inn", 
      price: "$$$", 
      description: "Small, welcoming and with a home-like feeling. Perfect for those who come and go all day without depending on a car.",
      address: "https://maps.google.com/?q=Ipanema+Inn",
      instagram: "@ipanemainn",
      externalLink: ""
    },
    { 
      name: "Mar Ipanema Hotel", 
      price: "$$$", 
      description: "Urban, practical and extremely well located. Works very well for those who want to live Ipanema intensely.",
      address: "https://maps.google.com/?q=Mar+Ipanema+Hotel",
      instagram: "@mariipanemahotel",
      externalLink: ""
    },
  ],
  leblon: [
    { name: "Hotel Placeholder", price: "$$$$", description: "Ultra-luxury with private beach service." },
    { name: "Hotel Placeholder", price: "$$$", description: "Elegant suites in a quiet location." },
  ],
  copacabana: [
    { name: "Hotel Placeholder", price: "$$$$", description: "Historic palace on the promenade." },
    { name: "Hotel Placeholder", price: "$$$", description: "Modern tower with rooftop pool." },
    { name: "Hotel Placeholder", price: "$$", description: "Budget-friendly with ocean views." },
    { name: "Hotel Placeholder", price: "$", description: "Backpacker hostel near the beach." },
  ],
  leme: [
    { name: "Hotel Placeholder", price: "$$$", description: "Quiet retreat at the end of Copacabana." },
    { name: "Hotel Placeholder", price: "$$", description: "Family-run hotel with local charm." },
  ],
  "sao-conrado": [
    { name: "Hotel Placeholder", price: "$$$$", description: "Resort-style luxury with golf access." },
  ],
  "barra-da-tijuca": [
    { name: "Hotel Placeholder", price: "$$$", description: "Modern resort with family amenities." },
    { name: "Hotel Placeholder", price: "$$", description: "Beach hotel with sports facilities." },
  ],
  recreio: [],
  "santa-teresa": [
    { name: "Hotel Placeholder", price: "$$$", description: "Colonial mansion with city views." },
    { name: "Hotel Placeholder", price: "$$", description: "Artistic guesthouse in the hills." },
  ],
  centro: [
    { name: "Hotel Placeholder", price: "$$", description: "Business hotel near cultural sites." },
  ],
};

const WhereToStayDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const [searchParams] = useSearchParams();
  
  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodData?.name || "Neighborhood";
  const description = neighborhoodDescriptions[neighborhood || ""] || `Placeholder description for ${name}.`;
  const hotels = hotelsByNeighborhood[neighborhood || ""] || [];
  
  const from = searchParams.get("from");
  const backPath = from === "map" ? "/city-view" : "/onde-ficar-rio";

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
            Where to stay in {name}
          </h1>
        </div>

        {/* Media Placeholder - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Image or video placeholder</p>
        </div>

        {/* Description */}
        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Hotels List */}
        <section className="px-6 pt-8">
          <h2 className="text-xl font-serif font-medium text-foreground mb-6">
            Hotels
          </h2>
          
          {hotels.length > 0 ? (
            <div>
              {hotels.map((hotel, index) => (
                <HotelCard
                  key={index}
                  name={hotel.name}
                  price={hotel.price}
                  description={hotel.description}
                  address={hotel.address}
                  instagram={hotel.instagram}
                  externalLink={hotel.externalLink}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Hotel recommendations coming soon.
            </p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {name}
        </p>
      </footer>
    </div>
  );
};

export default WhereToStayDetail;
