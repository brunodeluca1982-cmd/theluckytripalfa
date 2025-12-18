import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";

// Neighborhood descriptions for the food scene
const neighborhoodDescriptions: Record<string, string> = {
  ipanema: "Aqui a gastronomia é diversa como a própria praia. Tem alta cozinha, bistrôs autorais, cafés modernos, botecos clássicos e lugares onde você entra pra almoçar e acaba ficando até o jantar.\n\nÉ um bairro onde a comida acompanha o ritmo da rua. Tudo acontece perto, sem cerimônia, com mesas cheias, conversas cruzadas e aquela mistura boa de local com gente do mundo inteiro.",
  leblon: "No Leblon, os restaurantes são mais maduros. Menos moda, mais constância. Cozinhas sólidas, serviço afinado e um público que volta porque confia.\n\nÉ onde a gastronomia funciona todos os dias, sem precisar provar nada. Ótimo pra almoços longos, jantares tranquilos e lugares que fazem parte da rotina de quem mora no bairro.",
  copacabana: "Copacabana é tradição à mesa. Restaurantes históricos, hotéis clássicos e cozinhas que atravessaram décadas sem perder o nível.\n\nAqui convivem o luxo dos grandes salões com lugares simples e honestos. É um bairro onde comer também é revisitar a história do Rio.",
  leme: "Mais discreto e local. Poucos restaurantes, mas bem escolhidos, com clima de bairro e menos pressa.\n\nA gastronomia acompanha o ritmo mais calmo da região: refeições sem alarde, boa comida e mesas que não precisam competir com o barulho da cidade.",
  arpoador: "Pequeno no mapa, mas estratégico. Comer aqui é quase sempre combinado com praia, pôr do sol ou uma pausa entre caminhadas.\n\nOs lugares são práticos, bem localizados e funcionam como apoio perfeito para quem passa o dia fora e quer comer bem sem deslocamento.",
  "jardim-botanico": "A gastronomia aqui é mais verde, mais calma e mais cuidadosa. Restaurantes que valorizam tempo, ambiente e ingredientes.\n\nÓtimo para cafés da manhã longos, almoços tranquilos e jantares sem pressa, muitas vezes perto de árvores, parques e ruas silenciosas.",
  gavea: "Bairro de bares clássicos e restaurantes que funcionam como extensão da sala de casa. Muito encontro, muita conversa e pouca formalidade.\n\nAqui a comida é direta, bem feita e social. Ideal pra quem gosta de comer cercado de gente e histórias acontecendo ao redor.",
  botafogo: "Um dos polos gastronômicos mais criativos do Rio. Restaurantes novos, cozinhas autorais, bares híbridos e muita experimentação.\n\nÉ onde você encontra desde comida casual até projetos mais ousados. Um bairro que testa tendências antes do resto da cidade.",
  flamengo: "Mais funcional do que gastronômico, mas com boas surpresas. Restaurantes tradicionais, opções honestas e lugares que servem bem sem chamar atenção.\n\nFunciona muito bem para refeições práticas, antes ou depois de passeios pelo Centro e pela Zona Sul.",
  "santa-teresa": "Aqui comer faz parte da experiência. Vista, atmosfera e história pesam tanto quanto o prato.\n\nOs restaurantes valorizam o tempo, o ritual e o cenário. Ideal para jantares especiais e programas que vão além da comida.",
  "sao-conrado": "Poucas opções, mas bem pontuais. A gastronomia aparece como apoio ao dia de praia ou ao fim de tarde.\n\nNão é bairro de sair para comer, mas sim de comer bem quando se está ali, com vista aberta e menos ruído urbano.",
  "barra-da-tijuca": "Restaurantes amplos, confortáveis e bem estruturados. Muito churrasco, japonês, casas grandes e opções para grupos.\n\nAqui a gastronomia acompanha o estilo de vida mais espaçoso e familiar. Menos rua, mais destino certo.",
  recreio: "Comida ligada ao esporte e à natureza. Lugares simples, pós-praia, com foco em peixe, sucos, açaí e refeições diretas.\n\nÉ menos sobre cena gastronômica e mais sobre comer bem depois de um dia inteiro ao ar livre.",
  centro: "Balcões de almoço históricos, bares tradicionais e confeitarias centenárias preservando os sabores do Rio antigo.",
  lagoa: "Um dos cartões-postais do Rio, com restaurantes sofisticados à beira d'água e opções para todos os momentos do dia.",
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
    Italiano: [
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
    Italiano: [
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
    "Alta Gastronomia": [
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
    Brasileiro: [
      { name: "Placeholder de Restaurante", description: "Cozinha caseira e porções generosas." },
    ],
    "Casual / Cafés": [
      { name: "Placeholder de Restaurante", description: "Padaria e café do bairro." },
    ],
  },
  "sao-conrado": {
    "Hotel / Experiência": [
      { 
        name: "A Sereia", 
        description: "Restaurante dentro do icônico Hotel Nacional. Foco em vista, atmosfera e ritmo calmo. Funciona mais como experiência do que como destino gastronômico. Ideal para hóspedes do hotel ou para uma refeição ao pôr do sol com a paisagem como protagonista.",
        price: "$$$",
        address: "https://maps.google.com/?q=A+Sereia+Hotel+Nacional+São+Conrado",
        instagram: "@hotelnacionalrio",
        externalLink: ""
      },
    ],
    "Japonês / Contemporâneo": [
      { 
        name: "Gurumê – Fashion Mall", 
        description: "Culinária japonesa contemporânea confiável. Confortável, preciso e consistente. Frequentemente escolhido para almoços de negócios ou jantares fáceis sem surpresas. A localização no shopping facilita a logística em um bairro com poucas opções gastronômicas.",
        price: "$$$",
        address: "https://maps.google.com/?q=Gurumê+Fashion+Mall+São+Conrado",
        instagram: "@gurume_oficial",
        externalLink: ""
      },
    ],
    "Praia / Casual": [
      { 
        name: "Qui Qui", 
        description: "Experiência de quiosque de praia na Praia do Pepino. Casual, informal e conectado à cena local de surfe e voo livre. Funciona melhor durante o dia, entre o tempo de praia e o pôr do sol. Não é sobre alta gastronomia — é sobre atmosfera e lugar.",
        price: "$$",
        address: "https://maps.google.com/?q=Qui+Qui+Praia+do+Pepino+São+Conrado",
        instagram: "",
        externalLink: ""
      },
    ],
  },
  "barra-da-tijuca": {
    Brasileiro: [
      { name: "Placeholder de Restaurante", description: "Churrascaria familiar." },
    ],
    Japonês: [
      { name: "Placeholder de Restaurante", description: "Fusão japonesa contemporânea." },
    ],
    Italiano: [
      { name: "Placeholder de Restaurante", description: "Pizzas de forno a lenha." },
    ],
    "Casual / Cafés": [
      { name: "Placeholder de Restaurante", description: "Bar de sucos à beira-mar." },
    ],
  },
  recreio: {},
  "santa-teresa": {
    Brasileiro: [
      { name: "Placeholder de Restaurante", description: "Brasileiro criativo em casarão colonial." },
    ],
    "Casual / Cafés": [
      { name: "Placeholder de Restaurante", description: "Café de artista com música ao vivo." },
      { name: "Placeholder de Restaurante", description: "Bar boêmio com petiscos." },
    ],
  },
  centro: {
    Brasileiro: [
      { name: "Placeholder de Restaurante", description: "Balcão de almoço histórico desde 1920." },
      { name: "Placeholder de Restaurante", description: "Experiência de boteco tradicional." },
    ],
    "Casual / Cafés": [
      { name: "Placeholder de Restaurante", description: "Confeitaria centenária." },
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
    Pizzaria: [
      { 
        name: "Ella Pizzaria", 
        description: "Pizza de personalidade. Massa leve, borda crocante e sabor marcante. Uma das minhas preferidas do Rio.",
        price: "$$",
        address: "https://maps.google.com/?q=Ella+Pizzaria+Jardim+Botânico",
        instagram: "@ellapizzaria",
        externalLink: ""
      },
    ],
    "Café / Brunch": [
      { 
        name: "Empório Jardim", 
        description: "Café da manhã e brunch dos mais consistentes do Rio. Bom pra ir sem pressa, inclusive com crianças.",
        price: "$$",
        address: "https://maps.google.com/?q=Empório+Jardim",
        instagram: "@emporiojardim",
        externalLink: ""
      },
    ],
  },
  gavea: {
    "Boteco / Carioca": [
      { 
        name: "Braseiro da Gávea", 
        description: "Boteco tradicional do bairro. Carne, cerveja gelada e conversa. Sempre cheio. Sempre bom.",
        price: "$$",
        address: "https://maps.google.com/?q=Braseiro+da+Gávea",
        instagram: "@braseirodagavea",
        externalLink: ""
      },
      { 
        name: "Guimas", 
        description: "Ponto de encontro clássico da Gávea. Comida simples, cerveja gelada e mesas que viram noites longas.",
        price: "$$",
        address: "https://maps.google.com/?q=Guimas+Gávea",
        instagram: "@guimas",
        externalLink: ""
      },
      { 
        name: "Brewteco", 
        description: "Bar de cerveja artesanal com atmosfera animada. Boa comida, torneiras rotativas e público sociável.",
        price: "$$",
        address: "https://maps.google.com/?q=Brewteco+Gávea",
        instagram: "@brewteco",
        externalLink: ""
      },
    ],
  },
  lagoa: {
    "Contemporâneo / Autor": [
      { 
        name: "Capricciosa", 
        description: "Italiano contemporâneo com vista privilegiada da Lagoa. Ambiente bonito, cardápio variado e clima que funciona tanto de dia quanto à noite.",
        price: "$$$",
        address: "https://maps.google.com/?q=Capricciosa+Lagoa",
        instagram: "@capricciosaoficial",
        externalLink: ""
      },
      { 
        name: "CT Boucherie – Claude Troisgros", 
        description: "Cozinha autoral com técnica francesa e produto brasileiro. Experiência gastronômica sólida, elegante e sem exageros.",
        price: "$$$$",
        address: "https://maps.google.com/?q=CT+Boucherie+Lagoa",
        instagram: "@ctboucherie",
        externalLink: ""
      },
    ],
    "Brasileiro / Carioca": [
      { 
        name: "Gula Gula", 
        description: "Restaurante carioca de rotina boa. Funciona sempre, com cardápio democrático e ambiente leve.",
        price: "$$",
        address: "https://maps.google.com/?q=Gula+Gula+Lagoa",
        instagram: "@gulagulaoficial",
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
          Voltar
        </Link>
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            Onde comer em {name}
          </h1>
        </div>

        {/* Media Placeholder - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Espaço para imagem ou vídeo</p>
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
              Recomendações de restaurantes em breve.
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
