import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { useItemSave } from "@/hooks/use-item-save";

/**
 * RESTAURANT DETAIL PAGE
 * 
 * Individual detail view for a single restaurant.
 * Each restaurant has its own unique URL.
 * 
 * SAVING SCOPE: Only this individual restaurant can be saved (item level).
 */

// Restaurant data store (mirrors WhereToEatDetail data)
const restaurantData: Record<string, {
  name: string;
  description: string;
  price?: string;
  address?: string;
  instagram?: string;
  cuisineType: string;
  neighborhood: string;
  neighborhoodName: string;
}> = {
  // Ipanema restaurants
  "nido-ristorante": {
    name: "Nido Ristorante",
    description: "Meu italiano afetivo. Massas impecáveis, ambiente acolhedor, comida honesta. Restaurante de rotina boa, conversa longa e conforto emocional.",
    price: "$$$",
    address: "https://maps.google.com/?q=Nido+Ristorante+Av.+Gen.+San+Martin+1011+Leblon+Rio+de+Janeiro",
    instagram: "@nidorestaurante",
    cuisineType: "Italiana",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  "francese-brasserie": {
    name: "Francese Brasserie",
    description: "(sem texto editorial no trecho aprovado)",
    price: "$$$",
    address: "https://maps.google.com/?q=Francese+Brasserie+Ipanema+Rio+de+Janeiro",
    instagram: "@francesebrasserie",
    cuisineType: "Italiana",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  "gero-rio": {
    name: "Gero Rio",
    description: "(sem texto editorial no trecho aprovado)",
    price: "$$$$",
    address: "https://maps.google.com/?q=Gero+Rio+Fasano+Ipanema+Av.+Vieira+Souto+80+Rio+de+Janeiro",
    instagram: "@fasano",
    cuisineType: "Italiana",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  "jobi": {
    name: "Jobi",
    description: "Clássico absoluto. Chope bem tirado, comida correta e mesas que misturam gerações. Frequento há anos e sempre encontro alguém conhecido.",
    price: "$$",
    address: "https://maps.google.com/?q=Jobi+Rua+Ataulfo+de+Paiva+1166+Leblon+Rio+de+Janeiro",
    instagram: "@jobi_oficial",
    cuisineType: "Boteco",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  "barzin": {
    name: "Barzin",
    description: "Boa opção pra começar a noite. Ambiente animado, público bonito e clima de paquera leve, sem exagero.",
    price: "$$$",
    address: "https://maps.google.com/?q=Barzin+Ipanema+Rio+de+Janeiro",
    instagram: "@barzin",
    cuisineType: "Boteco",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  "teva": {
    name: "Teva",
    description: "Vegetariano sofisticado, técnica apurada e apresentação cuidadosa.",
    price: "$$$",
    address: "https://maps.google.com/?q=Teva+Ipanema+Rio+de+Janeiro",
    instagram: "@tevavegetariano",
    cuisineType: "Vegetariana",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  "rancho-portugues": {
    name: "Rancho Português",
    description: "(sem texto editorial no trecho aprovado)",
    price: "$$$$",
    address: "https://maps.google.com/?q=Rancho+Portugu%C3%AAs+Av.+Bartolomeu+Mitre+264+Leblon+Rio+de+Janeiro",
    instagram: "@ranchoportugues",
    cuisineType: "Portuguesa",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  // Leblon restaurants
  "mr-lam": {
    name: "Mr. Lam",
    description: "Asiático sofisticado, ambiente elegante e execução precisa. Funciona muito bem para jantar especial, com pegada internacional.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Mr.+Lam+Rua+Maria+Ang%C3%A9lica+21+Leblon+Rio+de+Janeiro",
    instagram: "@mrlamrio",
    cuisineType: "Japonesa",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "san-omakase": {
    name: "San Omakase",
    description: "Japonês de precisão. Você senta, confia e deixa a experiência conduzir.",
    price: "$$$$",
    address: "https://maps.google.com/?q=San+Omakase+Leblon+Rio+de+Janeiro",
    instagram: "@sanrestaurante",
    cuisineType: "Japonesa",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "mitsuba": {
    name: "Mitsubá",
    description: "(sem texto editorial no trecho aprovado)",
    price: "$$$",
    address: "https://maps.google.com/?q=Mitsub%C3%A1+Rua+Dias+Ferreira+284+Leblon+Rio+de+Janeiro",
    instagram: "@mitsubarj",
    cuisineType: "Japonesa",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "satyricon": {
    name: "Satyricon",
    description: "Meu restaurante de peixes. Não deixo passar um fim de semana sem vir. Clássico, elegante, produto impecável e constância rara.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Satyricon+Rua+Bar%C3%A3o+da+Torre+192+Ipanema+Rio+de+Janeiro",
    instagram: "@satyriconrio",
    cuisineType: "Alta Gastronomia",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "ocya": {
    name: "Ocyá",
    description: "Quando eu quero marisco bem tratado, sem firula, penso aqui. Sabor, técnica e clima de noite bem vivida.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Ocy%C3%A1+Leblon+Rio+de+Janeiro",
    instagram: "@ocya.rio",
    cuisineType: "Alta Gastronomia",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "boteco-rainha": {
    name: "Boteco Rainha",
    description: "Comida brasileira muito bem executada. Ambiente animado, ótimo para almoço longo ou jantar descontraído.",
    price: "$$$",
    address: "https://maps.google.com/?q=Boteco+Rainha+Leblon+Rio+de+Janeiro",
    instagram: "@botecorainhaleblon",
    cuisineType: "Brasileira",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "gula-gula": {
    name: "Gula Gula",
    description: "Restaurante carioca raiz. Funciona sempre. Vou há anos.",
    price: "$$",
    address: "https://maps.google.com/?q=Gula+Gula+Leblon+Rio+de+Janeiro",
    instagram: "@gulagulaoficial",
    cuisineType: "Brasileira",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "academia-da-cachaca": {
    name: "Academia da Cachaça",
    description: "Instituição carioca. Comida brasileira, chope gelado e clima democrático.",
    price: "$$",
    address: "https://maps.google.com/?q=Academia+da+Cacha%C3%A7a+Leblon+Rio+de+Janeiro",
    instagram: "@academiadacachaca",
    cuisineType: "Brasileira",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "casa-tua-leblon": {
    name: "Casa Tua – Leblon",
    description: "Italiano para ir sem pressa. Clima de casa, massa bem feita e conversa que dura.",
    price: "$$$",
    address: "https://maps.google.com/?q=Casa+Tua+Leblon+Rio+de+Janeiro",
    instagram: "@casatua",
    cuisineType: "Italiana",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "malta-steakhouse": {
    name: "Malta Steakhouse",
    description: "Boa carne, ambiente confortável e serviço direto.",
    price: "$$$",
    address: "https://maps.google.com/?q=Malta+Steakhouse+Leblon+Rio+de+Janeiro",
    instagram: "@maltasteakhouse",
    cuisineType: "Carnes",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "giuseppe-grill": {
    name: "Giuseppe Grill",
    description: "Clássico da carne bem feita, sem firula.",
    price: "$$$",
    address: "https://maps.google.com/?q=Giuseppe+Grill+Leblon+Rio+de+Janeiro",
    instagram: "@giuseppegrill",
    cuisineType: "Carnes",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "rufino-parrilla": {
    name: "Rufino Parrilla",
    description: "(sem texto editorial no trecho aprovado)",
    price: "$$$$",
    address: "https://maps.google.com/?q=Rufino+Parrilla+Leblon+Rua+Dias+Ferreira+84+Rio+de+Janeiro",
    instagram: "@rufinorj",
    cuisineType: "Carnes",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "belmonte-praia": {
    name: "Belmonte Praia",
    description: "Clássico de frente para o mar. O rooftop é um espetáculo.",
    price: "$$",
    address: "https://maps.google.com/?q=Belmonte+Praia+Leblon+Rio+de+Janeiro",
    instagram: "@belmonteoficial",
    cuisineType: "Boteco",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  // Botafogo restaurants
  "lasai": {
    name: "Lasai",
    description: "Um dos restaurantes mais impactantes do Brasil. O Lasai não serve só comida, serve uma experiência inteira. Silêncio, precisão, profundidade e Brasil no prato. É o tipo de jantar que muda sua régua gastronômica.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Lasai+Rua+Conde+de+Iraj%C3%A1+191+Botafogo+Rio+de+Janeiro",
    instagram: "@lasai_rj",
    cuisineType: "Alta Gastronomia",
    neighborhood: "botafogo",
    neighborhoodName: "Botafogo",
  },
  "oteque": {
    name: "Oteque",
    description: "Entrar no Oteque é como entrar numa cena lenta de cinema. Luz baixa, cozinha impecável, ritmo calmo e intensidade em cada detalhe. Um jantar que vira capítulo da vida.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Oteque+Rua+Conde+de+Iraj%C3%A1+581+Botafogo+Rio+de+Janeiro",
    instagram: "@oteque_rj",
    cuisineType: "Alta Gastronomia",
    neighborhood: "botafogo",
    neighborhoodName: "Botafogo",
  },
  // Copacabana restaurants
  "mee": {
    name: "Mee",
    description: "Alta gastronomia asiática, precisa e silenciosa. Experiência para ocasiões especiais.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Mee+Copacabana+Palace+Rio+de+Janeiro",
    instagram: "@meerestaurante",
    cuisineType: "Alta Gastronomia",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  "cipriani": {
    name: "Cipriani",
    description: "Italiano clássico, serviço impecável e clima sofisticado.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Cipriani+Copacabana+Palace+Rio+de+Janeiro",
    instagram: "@ciprianiristorante",
    cuisineType: "Alta Gastronomia",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  "esplanada-grill": {
    name: "Esplanada Grill",
    description: "Carne no ponto, serviço rodado e casa com história.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Esplanada+Grill+Rio+de+Janeiro",
    instagram: "@esplanadagrillrio",
    cuisineType: "Carnes",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  "adega-perola": {
    name: "Adega Pérola",
    description: "Mais bar que restaurante. Petiscos portugueses e noites cheias.",
    price: "$$",
    address: "https://maps.google.com/?q=Adega+P%C3%A9rola+Copacabana+Rio+de+Janeiro",
    instagram: "@adegaperola",
    cuisineType: "Boteco",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  "polvo-bar": {
    name: "Polvo Bar",
    description: "Frutos do mar com clima animado para a noite.",
    price: "$$$",
    address: "https://maps.google.com/?q=Polvo+Bar+Copacabana+Rio+de+Janeiro",
    instagram: "@polvobar",
    cuisineType: "Peixes e Frutos do Mar",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  "labuta-mar": {
    name: "Labuta Mar",
    description: "Produto bom, clima informal e começo de noite leve.",
    price: "$$",
    address: "https://maps.google.com/?q=Labuta+Mar+Copacabana+Rio+de+Janeiro",
    instagram: "@labutamar",
    cuisineType: "Peixes e Frutos do Mar",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  "haru": {
    name: "Haru",
    description: "Japonês tradicional, discreto e consistente.",
    price: "$$$",
    address: "https://maps.google.com/?q=Haru+Sushi+Copacabana+Rio+de+Janeiro",
    instagram: "@haru_sushi",
    cuisineType: "Japonesa",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  // Jardim Botânico restaurants
  "chez-claude": {
    name: "Chez Claude",
    description: "Francês contemporâneo sólido e sofisticado.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Chez+Claude+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
    instagram: "@chezclauderio",
    cuisineType: "Alta Gastronomia",
    neighborhood: "jardim-botanico",
    neighborhoodName: "Jardim Botânico",
  },
  "rubaiyat": {
    name: "Rubaiyat",
    description: "(sem texto editorial no trecho aprovado)",
    price: "$$$$",
    address: "https://maps.google.com/?q=Rubaiyat+Rio+Rua+Jardim+Bot%C3%A2nico+971+Rio+de+Janeiro",
    instagram: "@rubaiyat",
    cuisineType: "Alta Gastronomia",
    neighborhood: "jardim-botanico",
    neighborhoodName: "Jardim Botânico",
  },
  "casa-201": {
    name: "Casa 201",
    description: "(sem texto editorial no trecho aprovado)",
    price: "$$$",
    address: "https://maps.google.com/?q=Casa+201+Rua+Lopes+Quint%C3%A3s+201+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
    instagram: "@casa201rj",
    cuisineType: "Alta Gastronomia",
    neighborhood: "jardim-botanico",
    neighborhoodName: "Jardim Botânico",
  },
  "grado": {
    name: "Grado",
    description: "(sem texto editorial no trecho aprovado)",
    price: "$$$",
    address: "https://maps.google.com/?q=Grado+Rua+Visconde+de+Caranda%C3%AD+31+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
    instagram: "@grado",
    cuisineType: "Alta Gastronomia",
    neighborhood: "jardim-botanico",
    neighborhoodName: "Jardim Botânico",
  },
  "elena": {
    name: "Elena",
    description: "Funciona para casal, solteiro e paquera. Boa música, público interessante e energia boa.",
    price: "$$$$",
    address: "https://maps.google.com/?q=Elena+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
    instagram: "@elenarestaurante.rj",
    cuisineType: "Experiência Gastronômica",
    neighborhood: "jardim-botanico",
    neighborhoodName: "Jardim Botânico",
  },
  "ella-pizzaria": {
    name: "Ella Pizzaria",
    description: "Pizza de personalidade, massa leve e borda crocante.",
    price: "$$",
    address: "https://maps.google.com/?q=Ella+Pizzaria+Rua+Pacheco+Le%C3%A3o+656+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
    instagram: "@ellapizzaria",
    cuisineType: "Casual",
    neighborhood: "jardim-botanico",
    neighborhoodName: "Jardim Botânico",
  },
  "emporio-jardim": {
    name: "Empório Jardim",
    description: "Café da manhã e brunch consistentes, inclusive com crianças.",
    price: "$$",
    address: "https://maps.google.com/?q=Emp%C3%B3rio+Jardim+Rua+Maria+Ang%C3%A9lica+120+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
    instagram: "@emporiojardim",
    cuisineType: "Café / Brunch",
    neighborhood: "jardim-botanico",
    neighborhoodName: "Jardim Botânico",
  },
  // Gávea restaurants
  "braseiro-da-gavea": {
    name: "Braseiro da Gávea",
    description: "Carne, chope e conversa. Sempre cheio, sempre bom.",
    price: "$$",
    address: "https://maps.google.com/?q=Braseiro+da+G%C3%A1vea+Pra%C3%A7a+Santos+Dumont+116+G%C3%A1vea+Rio+de+Janeiro",
    instagram: "@braseirodagavea",
    cuisineType: "Boteco",
    neighborhood: "gavea",
    neighborhoodName: "Gávea",
  },
  // Barra da Tijuca restaurants
  "org-bistro": {
    name: "Org Bistrô",
    description: "Opção leve, saudável e informal para o dia a dia.",
    price: "$$",
    address: "https://maps.google.com/?q=Org+Bistr%C3%B4+Av.+Oleg%C3%A1rio+Maciel+175+Loja+G+Barra+da+Tijuca+Rio+de+Janeiro",
    instagram: "@orgbistro",
    cuisineType: "Vegetariana",
    neighborhood: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
  },
  "mocellin": {
    name: "Mocellin",
    description: "Carne de verdade, tradição e constância. A Barra cresceu junto com o Mocellin.",
    price: "$$$",
    address: "https://maps.google.com/?q=Mocellin+Steak+Av.+Armando+Lombardi+1010+Barra+da+Tijuca+Rio+de+Janeiro",
    instagram: "@mocelinrestaurante",
    cuisineType: "Carnes",
    neighborhood: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
  },
  "barra-grill-steakhouse": {
    name: "Barra Grill Steakhouse",
    description: "Churrasco premium, ambiente grande e serviço eficiente.",
    price: "$$$",
    address: "https://maps.google.com/?q=Barra+Grill+Steakhouse+Barra+da+Tijuca+Rio+de+Janeiro",
    instagram: "@barragrillrestaurante",
    cuisineType: "Carnes",
    neighborhood: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
  },
  "churrascaria-tourao": {
    name: "Churrascaria Tourão",
    description: "Clássico sem frescura. Come bem e sai feliz.",
    price: "$$",
    address: "https://maps.google.com/?q=Churrascaria+Tour%C3%A3o+Barra+da+Tijuca+Rio+de+Janeiro",
    instagram: "@churrascariatourao",
    cuisineType: "Carnes",
    neighborhood: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
  },
  "mocellin-mar": {
    name: "Mocellin Mar",
    description: "Peixe de frente para o mar. Vista aberta e fim de tarde perfeito.",
    price: "$$$",
    address: "https://maps.google.com/?q=Mocellin+Mar+Barra+da+Tijuca+Rio+de+Janeiro",
    instagram: "@mocellinmar",
    cuisineType: "Peixes e Frutos do Mar",
    neighborhood: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
  },
};

// Helper to generate slug from restaurant name
export const generateRestaurantSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();
  
  const restaurant = restaurantData[id || ""];
  const from = searchParams.get("from");
  const backPath = from ? `/onde-comer/${from}` : "/";

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Restaurante não encontrado</p>
          <Link to="/" className="text-foreground underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveItem(id || "", "restaurant", restaurant.name, false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <RoteiroAccessLink />
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Media Placeholder */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Espaço para imagem ou vídeo</p>
        </div>

        {/* Restaurant Info */}
        <div className="px-6 pt-8">
          {/* Category */}
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
            {restaurant.cuisineType} • {restaurant.neighborhoodName}
          </p>
          
          {/* Title */}
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight mb-4">
            {restaurant.name}
          </h1>
          
          {/* Price */}
          {restaurant.price && (
            <p className="text-sm text-muted-foreground mb-4">{restaurant.price}</p>
          )}
          
          {/* Description */}
          <div className="space-y-2 mb-6">
            {restaurant.description.split('\n').map((paragraph, index) => (
              <p key={index} className="text-base text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Metadata */}
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            {restaurant.address && (
              <p>
                <a 
                  href={restaurant.address} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline"
                >
                  Ver no Google Maps
                </a>
              </p>
            )}
            {restaurant.instagram && (
              <p>
                <a 
                  href={`https://instagram.com/${restaurant.instagram.replace('@', '')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {restaurant.instagram}
                </a>
              </p>
            )}
          </div>
          
          {/* Save Action */}
          <Button
            onClick={handleSave}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <Plus className="w-3 h-3" />
            Salvar
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {restaurant.neighborhoodName}
        </p>
      </footer>
    </div>
  );
};

export default RestaurantDetail;
