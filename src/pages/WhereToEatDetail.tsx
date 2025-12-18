import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";

// Neighborhood descriptions for the food scene
const neighborhoodDescriptions: Record<string, string> = {
  ipanema: "A refined food scene where organic bistros meet inventive fusion kitchens, reflecting the neighborhood's sophisticated yet laid-back character.",
  leblon: "Rio's most exclusive dining destination, home to award-winning chefs and intimate restaurants that define contemporary Brazilian gastronomy.",
  copacabana: "From traditional Portuguese taverns to contemporary seafood restaurants, Copacabana offers an eclectic dining scene shaped by decades of cultural diversity.",
  leme: "A quieter culinary pocket with family-run establishments serving generous portions of traditional carioca comfort food.",
  "sao-conrado": "An upscale residential enclave with select dining options, from elegant hotel restaurants to casual beachside spots.",
  "barra-da-tijuca": "Modern dining hubs and beachfront restaurants catering to families and groups with diverse international options.",
  recreio: "A laid-back beach neighborhood with casual eateries, fresh seafood spots, and family-friendly dining options.",
  "santa-teresa": "Bohemian eateries and artist-run cafés tucked into colonial buildings, offering creative takes on Brazilian classics.",
  centro: "Historic lunch counters, traditional bars, and century-old confeitarias preserving the flavors of old Rio.",
  "jardim-botanico": "A leafy, upscale neighborhood with contemporary restaurants and cozy pizzerias nestled near the botanical gardens.",
  gavea: "A traditional neighborhood where academia meets leisure, known for its lively botecos and neighborhood gathering spots.",
};

// Restaurant data by neighborhood and cuisine type
const restaurantsByNeighborhood: Record<string, Record<string, { name: string; description: string; price?: string; address?: string; instagram?: string; externalLink?: string }[]>> = {
  ipanema: {
    "Authorial Cuisine / Fine Dining": [
      { 
        name: "Lasai", 
        description: "Um dos restaurantes mais impactantes do Brasil. O Lasai não serve só comida — serve uma experiência inteira. Silêncio, precisão, profundidade, Brasil no prato. É o tipo de jantar que muda sua régua gastronômica.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Lasai+Rio+de+Janeiro",
        instagram: "@lasai_rj",
        externalLink: ""
      },
      { 
        name: "Oteque", 
        description: "Entrar no Oteque é como entrar numa cena lenta de cinema. Luz baixa, cozinha impecável, ritmo calmo e intensidade em cada detalhe. Um jantar que vira capítulo da vida.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Oteque+Rio+de+Janeiro",
        instagram: "@oteque_rj",
        externalLink: ""
      },
    ],
    Italian: [
      { 
        name: "Nido Ristorante", 
        description: "Meu italiano afetivo. Massas impecáveis, ambiente acolhedor, comida honesta. Restaurante de rotina boa, conversa longa e conforto emocional.",
        price: "$$$",
        address: "https://maps.google.com/?q=Nido+Ristorante+Ipanema",
        instagram: "@nidorestaurante",
        externalLink: ""
      },
    ],
    "Cafés / Bistrôs / Carioca": [
      { 
        name: "Zazá Bistrô Café", 
        description: "Delicinhas a qualquer hora do dia. Funciona para almoço leve, café demorado ou jantar sem cerimônia. É aquele lugar que você entra sem planejar e acaba ficando.",
        price: "$$$",
        address: "https://maps.google.com/?q=Zazá+Bistrô+Ipanema",
        instagram: "@zazabistro",
        externalLink: ""
      },
    ],
    "Boteco / Carioca": [
      { 
        name: "Jobi", 
        description: "Clássico absoluto. Chope bem tirado, comida correta e mesas que misturam gerações. Frequento há anos e sempre encontro alguém conhecido.",
        price: "$$",
        address: "https://maps.google.com/?q=Jobi+Ipanema",
        instagram: "@jobi_oficial",
        externalLink: ""
      },
      { 
        name: "Barzin", 
        description: "Boa opção pra começar a noite. Ambiente animado, público bonito e clima de paquera leve, sem exagero.",
        price: "$$$",
        address: "https://maps.google.com/?q=Barzin+Ipanema",
        instagram: "@barzin",
        externalLink: ""
      },
    ],
  },
  leblon: {
    "Peixes & Frutos do Mar": [
      { 
        name: "Satyricon", 
        description: "Meu restaurante de peixes. Não passo um fim de semana sem vir. Clássico, elegante, produto impecável e constância rara.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Satyricon+Leblon",
        instagram: "@satyriconrio",
        externalLink: ""
      },
    ],
    "Brasileiro / Carioca": [
      { 
        name: "Boteco Rainha", 
        description: "Comida brasileira muito bem executada. Ambiente animado, perfeito pra almoço longo ou jantar descontraído.",
        price: "$$$",
        address: "https://maps.google.com/?q=Boteco+Rainha+Leblon",
        instagram: "@botecorainhaleblon",
        externalLink: ""
      },
      { 
        name: "Gula Gula", 
        description: "Restaurante carioca raiz. Funciona sempre. Vou há anos, tanto na Zona Sul quanto na Barra.",
        price: "$$",
        address: "https://maps.google.com/?q=Gula+Gula+Leblon",
        instagram: "@gulagulaoficial",
        externalLink: ""
      },
    ],
    Italian: [
      { 
        name: "Casa Tua", 
        description: "Italiano com clima de casa. Massas bem feitas, serviço próximo, sem afetação. Ótimo pra encontros tranquilos.",
        price: "$$$",
        address: "https://maps.google.com/?q=Casa+Tua+Leblon",
        instagram: "@casatua",
        externalLink: ""
      },
    ],
    "Praia / Carioca": [
      { 
        name: "Belmonte Praia", 
        description: "Clássico de frente pro mar. O rooftop é um espetáculo. Se tiver fila lá em cima, sentar embaixo também vale muito a pena.",
        price: "$$",
        address: "https://maps.google.com/?q=Belmonte+Praia+Leblon",
        instagram: "@belmonteoficial",
        externalLink: ""
      },
    ],
  },
  copacabana: {
    "Fine Dining": [
      { 
        name: "Mee", 
        description: "Alta gastronomia asiática dentro do Copacabana Palace. Preciso, elegante e silencioso. Experiência especial, sem pressa.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Mee+Copacabana+Palace",
        instagram: "@meerestaurante",
        externalLink: ""
      },
      { 
        name: "Cipriani", 
        description: "Italiano clássico, serviço de alto nível e ambiente sofisticado. Restaurante para ocasiões marcantes.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Cipriani+Copacabana+Palace",
        instagram: "@ciprianiristorante",
        externalLink: ""
      },
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
  "sao-conrado": {},
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
  recreio: {},
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
  "jardim-botanico": {
    "Contemporary / Authorial": [
      { 
        name: "Elena", 
        description: "Restaurante contemporâneo, sofisticado e animado. Funciona muito bem para casal, mas também para solteiros e paquera. Boa música, público interessante e cozinha autoral.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Elena+Jardim+Botânico",
        instagram: "@elenarestaurante.rj",
        externalLink: ""
      },
    ],
    Pizzeria: [
      { 
        name: "Ella Pizzaria", 
        description: "Pizza de personalidade. Massa leve, borda crocante e sabor marcante. Uma das minhas preferidas do Rio.",
        price: "$$",
        address: "https://maps.google.com/?q=Ella+Pizzaria+Jardim+Botânico",
        instagram: "@ellapizzaria",
        externalLink: ""
      },
    ],
  },
  gavea: {
    "Boteco / Carioca": [
      { 
        name: "Braseiro da Gávea", 
        description: "Traditional neighborhood boteco. Meat, cold beer and conversation. Always busy. Always good.",
        price: "$$",
        address: "https://maps.google.com/?q=Braseiro+da+Gávea",
        instagram: "@braseirodagavea",
        externalLink: ""
      },
      { 
        name: "Guimas", 
        description: "Classic Gávea meeting point. Simple food, cold beer and tables that turn into long nights.",
        price: "$$",
        address: "https://maps.google.com/?q=Guimas+Gávea",
        instagram: "@guimas",
        externalLink: ""
      },
      { 
        name: "Brewteco", 
        description: "Craft beer bar with a lively atmosphere. Good food, rotating taps and a social crowd.",
        price: "$$",
        address: "https://maps.google.com/?q=Brewteco+Gávea",
        instagram: "@brewteco",
        externalLink: ""
      },
    ],
  },
};

const WhereToEatDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const [searchParams] = useSearchParams();
  
  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodData?.name || "Neighborhood";
  const description = neighborhoodDescriptions[neighborhood || ""] || `Placeholder description for ${name}'s food scene.`;
  const restaurants = restaurantsByNeighborhood[neighborhood || ""] || {};
  
  const from = searchParams.get("from");
  const backPath = from === "map" ? "/eat-map-view" : "/eat-map-view";

  const hasRestaurants = Object.keys(restaurants).length > 0;

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
            Where to eat in {name}
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

        {/* Restaurants by Cuisine Type */}
        {hasRestaurants ? (
          Object.entries(restaurants).map(([cuisineType, restaurantList]) => (
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
          ))
        ) : (
          <div className="px-6 pt-8">
            <p className="text-sm text-muted-foreground">
              Restaurant recommendations coming soon.
            </p>
          </div>
        )}
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

export default WhereToEatDetail;
