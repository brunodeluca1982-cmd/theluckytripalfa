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
    { 
      name: "Janeiro Hotel", 
      price: "$$$$", 
      description: "Minimalista, silencioso e luminoso. Atrai quem gosta de design, arte e acordar com o mar sem perder o clima de bairro do Leblon.",
      address: "https://maps.google.com/?q=Janeiro+Hotel+Leblon",
      instagram: "@janeirolifestyle",
      externalLink: ""
    },
    { 
      name: "Ritz Leblon", 
      price: "$$$", 
      description: "Discreto e confortável. Vejo muita gente que grava, escreve ou trabalha na Zona Sul escolhendo o Ritz justamente pelo silêncio e localização.",
      address: "https://maps.google.com/?q=Ritz+Leblon",
      instagram: "@ritzleblon",
      externalLink: ""
    },
    { 
      name: "Promenade Palladium", 
      price: "$$", 
      description: "Tem cara de residência do bairro. Muito usado por quem vem trabalhar no Rio e prefere discrição e praticidade.",
      address: "https://maps.google.com/?q=Promenade+Palladium+Leblon",
      instagram: "@promenadehotels",
      externalLink: ""
    },
  ],
  copacabana: [
    { 
      name: "Copacabana Palace", 
      price: "$$$$", 
      description: "Ícone absoluto do Brasil. Mesmo quando não fico, é referência. Presidentes, artistas, jogadores e grandes eventos passam por aqui há décadas.",
      address: "https://maps.google.com/?q=Copacabana+Palace",
      instagram: "@copacabanapalace",
      externalLink: ""
    },
    { 
      name: "Emiliano Rio", 
      price: "$$$$", 
      description: "Arquitetura elegante, serviço preciso e rooftop reservado. Muito escolhido por quem quer luxo discreto e boa localização.",
      address: "https://maps.google.com/?q=Hotel+Emiliano+Rio",
      instagram: "@emiliano_rio",
      externalLink: ""
    },
    { 
      name: "Fairmont Rio", 
      price: "$$$$", 
      description: "O antigo Rio Palace. Da piscina, o Pão de Açúcar entra no enquadramento como se fosse cenário montado.",
      address: "https://maps.google.com/?q=Fairmont+Rio+Copacabana",
      instagram: "@fairmontricopacabana",
      externalLink: ""
    },
    { 
      name: "Hilton Copacabana", 
      price: "$$$", 
      description: "Hotel grande, vista panorâmica e logística fácil. Muito usado por bandas, equipes esportivas e grandes produções.",
      address: "https://maps.google.com/?q=Hilton+Copacabana",
      instagram: "@hiltoncopacabana",
      externalLink: ""
    },
  ],
  leme: [
    { 
      name: "Windsor Leme", 
      price: "$$$", 
      description: "Mais silencioso, com clima de bairro e mar na porta. Boa escolha pra quem quer dormir bem.",
      address: "https://maps.google.com/?q=Windsor+Leme",
      instagram: "@windsorhoteis",
      externalLink: ""
    },
    { 
      name: "Arena Leme", 
      price: "$$", 
      description: "Moderno, funcional e bem localizado. Base frequente de produções que filmam na Urca e no Forte do Leme.",
      address: "https://maps.google.com/?q=Arena+Leme+Hotel",
      instagram: "@arenahotels",
      externalLink: ""
    },
  ],
  "sao-conrado": [
    { 
      name: "Hotel Nacional", 
      price: "$$$$", 
      description: "Projeto de Niemeyer à beira-mar. Já recebeu presidentes, músicos internacionais e grandes eventos. Hoje é escolha de quem quer vista e história.",
      address: "https://maps.google.com/?q=Hotel+Nacional+Rio",
      instagram: "@hotelnacionalrio",
      externalLink: ""
    },
  ],
  "barra-da-tijuca": [
    { 
      name: "Hyatt Regency Barra", 
      price: "$$$$", 
      description: "Clima de resort dentro da cidade. Muito usado por bandas e equipes de grandes shows.",
      address: "https://maps.google.com/?q=Hyatt+Regency+Barra+da+Tijuca",
      instagram: "@hyattregencyrio",
      externalLink: ""
    },
    { 
      name: "Windsor Barra", 
      price: "$$$", 
      description: "Clássico da orla. Recebe delegações esportivas e congressos.",
      address: "https://maps.google.com/?q=Windsor+Barra",
      instagram: "@windsorhoteis",
      externalLink: ""
    },
    { 
      name: "LSH Hotel", 
      price: "$$$", 
      description: "Compacto, moderno e bem localizado. Ótimo pra quem quer viver o Jardim Oceânico a pé.",
      address: "https://maps.google.com/?q=LSH+Hotel+Barra",
      instagram: "@lshhotel",
      externalLink: ""
    },
    { 
      name: "Laghetto Stilo Barra", 
      price: "$$", 
      description: "Boa relação custo-benefício para trabalho e eventos.",
      address: "https://maps.google.com/?q=Laghetto+Stilo+Barra",
      instagram: "@laghettostilobarra",
      externalLink: ""
    },
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
