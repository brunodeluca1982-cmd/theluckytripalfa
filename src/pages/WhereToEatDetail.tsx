import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";
import SaveToRoteiroButton from "@/components/SaveToRoteiroButton";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";

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
    "Italiana": [
      { 
        name: "Nido Ristorante", 
        description: "Meu italiano afetivo. Massas impecáveis, ambiente acolhedor, comida honesta. Restaurante de rotina boa, conversa longa e conforto emocional.",
        price: "$$$",
        address: "https://maps.google.com/?q=Nido+Ristorante+Av.+Gen.+San+Martin+1011+Leblon+Rio+de+Janeiro",
        instagram: "@nidorestaurante",
      },
      { 
        name: "Francese Brasserie", 
        description: "(sem texto editorial no trecho aprovado)",
        price: "$$$",
        address: "https://maps.google.com/?q=Francese+Brasserie+Ipanema+Rio+de+Janeiro",
        instagram: "@francesebrasserie",
      },
      { 
        name: "Gero Rio", 
        description: "(sem texto editorial no trecho aprovado)",
        price: "$$$$",
        address: "https://maps.google.com/?q=Gero+Rio+Fasano+Ipanema+Av.+Vieira+Souto+80+Rio+de+Janeiro",
        instagram: "@fasano",
      },
    ],
    "Boteco": [
      { 
        name: "Jobi", 
        description: "Clássico absoluto. Chope bem tirado, comida correta e mesas que misturam gerações. Frequento há anos e sempre encontro alguém conhecido.",
        price: "$$",
        address: "https://maps.google.com/?q=Jobi+Rua+Ataulfo+de+Paiva+1166+Leblon+Rio+de+Janeiro",
        instagram: "@jobi_oficial",
      },
      { 
        name: "Barzin", 
        description: "Boa opção pra começar a noite. Ambiente animado, público bonito e clima de paquera leve, sem exagero.",
        price: "$$$",
        address: "https://maps.google.com/?q=Barzin+Ipanema+Rio+de+Janeiro",
        instagram: "@barzin",
      },
    ],
    "Vegetariana": [
      { 
        name: "Teva", 
        description: "Vegetariano sofisticado, técnica apurada e apresentação cuidadosa.",
        price: "$$$",
        address: "https://maps.google.com/?q=Teva+Ipanema+Rio+de+Janeiro",
        instagram: "@tevavegetariano",
      },
    ],
    "Portuguesa": [
      { 
        name: "Rancho Português", 
        description: "(sem texto editorial no trecho aprovado)",
        price: "$$$$",
        address: "https://maps.google.com/?q=Rancho+Portugu%C3%AAs+Av.+Bartolomeu+Mitre+264+Leblon+Rio+de+Janeiro",
        instagram: "@ranchoportugues",
      },
    ],
  },
  leblon: {
    "Japonesa": [
      { 
        name: "Mr. Lam", 
        description: "Asiático sofisticado, ambiente elegante e execução precisa. Funciona muito bem para jantar especial, com pegada internacional.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Mr.+Lam+Rua+Maria+Ang%C3%A9lica+21+Leblon+Rio+de+Janeiro",
        instagram: "@mrlamrio",
      },
      { 
        name: "San Omakase", 
        description: "Japonês de precisão. Você senta, confia e deixa a experiência conduzir.",
        price: "$$$$",
        address: "https://maps.google.com/?q=San+Omakase+Leblon+Rio+de+Janeiro",
        instagram: "@sanrestaurante",
      },
      { 
        name: "Mitsubá", 
        description: "(sem texto editorial no trecho aprovado)",
        price: "$$$",
        address: "https://maps.google.com/?q=Mitsub%C3%A1+Rua+Dias+Ferreira+284+Leblon+Rio+de+Janeiro",
        instagram: "@mitsubarj",
      },
    ],
    "Alta Gastronomia": [
      { 
        name: "Satyricon", 
        description: "Meu restaurante de peixes. Não deixo passar um fim de semana sem vir. Clássico, elegante, produto impecável e constância rara.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Satyricon+Rua+Bar%C3%A3o+da+Torre+192+Ipanema+Rio+de+Janeiro",
        instagram: "@satyriconrio",
      },
      { 
        name: "Ocyá", 
        description: "Quando eu quero marisco bem tratado, sem firula, penso aqui. Sabor, técnica e clima de noite bem vivida.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Ocy%C3%A1+Leblon+Rio+de+Janeiro",
        instagram: "@ocya.rio",
      },
    ],
    "Brasileira": [
      { 
        name: "Boteco Rainha", 
        description: "Comida brasileira muito bem executada. Ambiente animado, ótimo para almoço longo ou jantar descontraído.",
        price: "$$$",
        address: "https://maps.google.com/?q=Boteco+Rainha+Leblon+Rio+de+Janeiro",
        instagram: "@botecorainhaleblon",
      },
      { 
        name: "Gula Gula", 
        description: "Restaurante carioca raiz. Funciona sempre. Vou há anos.",
        price: "$$",
        address: "https://maps.google.com/?q=Gula+Gula+Leblon+Rio+de+Janeiro",
        instagram: "@gulagulaoficial",
      },
      { 
        name: "Academia da Cachaça", 
        description: "Instituição carioca. Comida brasileira, chope gelado e clima democrático.",
        price: "$$",
        address: "https://maps.google.com/?q=Academia+da+Cacha%C3%A7a+Leblon+Rio+de+Janeiro",
        instagram: "@academiadacachaca",
      },
    ],
    "Italiana": [
      { 
        name: "Casa Tua – Leblon", 
        description: "Italiano para ir sem pressa. Clima de casa, massa bem feita e conversa que dura.",
        price: "$$$",
        address: "https://maps.google.com/?q=Casa+Tua+Leblon+Rio+de+Janeiro",
        instagram: "@casatua",
      },
    ],
    "Carnes": [
      { 
        name: "Malta Steakhouse", 
        description: "Boa carne, ambiente confortável e serviço direto.",
        price: "$$$",
        address: "https://maps.google.com/?q=Malta+Steakhouse+Leblon+Rio+de+Janeiro",
        instagram: "@maltasteakhouse",
      },
      { 
        name: "Giuseppe Grill", 
        description: "Clássico da carne bem feita, sem firula.",
        price: "$$$",
        address: "https://maps.google.com/?q=Giuseppe+Grill+Leblon+Rio+de+Janeiro",
        instagram: "@giuseppegrill",
      },
      { 
        name: "Rufino Parrilla", 
        description: "(sem texto editorial no trecho aprovado)",
        price: "$$$$",
        address: "https://maps.google.com/?q=Rufino+Parrilla+Leblon+Rua+Dias+Ferreira+84+Rio+de+Janeiro",
        instagram: "@rufinorj",
      },
    ],
    "Boteco": [
      { 
        name: "Belmonte Praia", 
        description: "Clássico de frente para o mar. O rooftop é um espetáculo.",
        price: "$$",
        address: "https://maps.google.com/?q=Belmonte+Praia+Leblon+Rio+de+Janeiro",
        instagram: "@belmonteoficial",
      },
    ],
  },
  botafogo: {
    "Alta Gastronomia": [
      { 
        name: "Lasai", 
        description: "Um dos restaurantes mais impactantes do Brasil. O Lasai não serve só comida, serve uma experiência inteira. Silêncio, precisão, profundidade e Brasil no prato. É o tipo de jantar que muda sua régua gastronômica.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Lasai+Rua+Conde+de+Iraj%C3%A1+191+Botafogo+Rio+de+Janeiro",
        instagram: "@lasai_rj",
      },
      { 
        name: "Oteque", 
        description: "Entrar no Oteque é como entrar numa cena lenta de cinema. Luz baixa, cozinha impecável, ritmo calmo e intensidade em cada detalhe. Um jantar que vira capítulo da vida.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Oteque+Rua+Conde+de+Iraj%C3%A1+581+Botafogo+Rio+de+Janeiro",
        instagram: "@oteque_rj",
      },
    ],
  },
  copacabana: {
    "Alta Gastronomia": [
      { 
        name: "Mee", 
        description: "Alta gastronomia asiática, precisa e silenciosa. Experiência para ocasiões especiais.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Mee+Copacabana+Palace+Rio+de+Janeiro",
        instagram: "@meerestaurante",
      },
      { 
        name: "Cipriani", 
        description: "Italiano clássico, serviço impecável e clima sofisticado.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Cipriani+Copacabana+Palace+Rio+de+Janeiro",
        instagram: "@ciprianiristorante",
      },
    ],
    "Carnes": [
      { 
        name: "Esplanada Grill", 
        description: "Carne no ponto, serviço rodado e casa com história.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Esplanada+Grill+Rio+de+Janeiro",
        instagram: "@esplanadagrillrio",
      },
    ],
    "Boteco": [
      { 
        name: "Adega Pérola", 
        description: "Mais bar que restaurante. Petiscos portugueses e noites cheias.",
        price: "$$",
        address: "https://maps.google.com/?q=Adega+P%C3%A9rola+Copacabana+Rio+de+Janeiro",
        instagram: "@adegaperola",
      },
    ],
    "Peixes e Frutos do Mar": [
      { 
        name: "Polvo Bar", 
        description: "Frutos do mar com clima animado para a noite.",
        price: "$$$",
        address: "https://maps.google.com/?q=Polvo+Bar+Copacabana+Rio+de+Janeiro",
        instagram: "@polvobar",
      },
      { 
        name: "Labuta Mar", 
        description: "Produto bom, clima informal e começo de noite leve.",
        price: "$$",
        address: "https://maps.google.com/?q=Labuta+Mar+Copacabana+Rio+de+Janeiro",
        instagram: "@labutamar",
      },
    ],
    "Japonesa": [
      { 
        name: "Haru", 
        description: "Japonês tradicional, discreto e consistente.",
        price: "$$$",
        address: "https://maps.google.com/?q=Haru+Sushi+Copacabana+Rio+de+Janeiro",
        instagram: "@haru_sushi",
      },
    ],
  },
  leme: {},
  "jardim-botanico": {
    "Alta Gastronomia": [
      { 
        name: "Chez Claude", 
        description: "Francês contemporâneo sólido e sofisticado.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Chez+Claude+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
        instagram: "@chezclauderio",
      },
      { 
        name: "Rubaiyat", 
        description: "(sem texto editorial no trecho aprovado)",
        price: "$$$$",
        address: "https://maps.google.com/?q=Rubaiyat+Rio+Rua+Jardim+Bot%C3%A2nico+971+Rio+de+Janeiro",
        instagram: "@rubaiyat",
      },
      { 
        name: "Casa 201", 
        description: "(sem texto editorial no trecho aprovado)",
        price: "$$$",
        address: "https://maps.google.com/?q=Casa+201+Rua+Lopes+Quint%C3%A3s+201+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
        instagram: "@casa201rj",
      },
      { 
        name: "Grado", 
        description: "(sem texto editorial no trecho aprovado)",
        price: "$$$",
        address: "https://maps.google.com/?q=Grado+Rua+Visconde+de+Caranda%C3%AD+31+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
        instagram: "@grado",
      },
    ],
    "Experiência Gastronômica": [
      { 
        name: "Elena", 
        description: "Funciona para casal, solteiro e paquera. Boa música, público interessante e energia boa.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Elena+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
        instagram: "@elenarestaurante.rj",
      },
    ],
    "Casual": [
      { 
        name: "Ella Pizzaria", 
        description: "Pizza de personalidade, massa leve e borda crocante.",
        price: "$$",
        address: "https://maps.google.com/?q=Ella+Pizzaria+Rua+Pacheco+Le%C3%A3o+656+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
        instagram: "@ellapizzaria",
      },
    ],
    "Café / Brunch": [
      { 
        name: "Empório Jardim", 
        description: "Café da manhã e brunch consistentes, inclusive com crianças.",
        price: "$$",
        address: "https://maps.google.com/?q=Emp%C3%B3rio+Jardim+Rua+Maria+Ang%C3%A9lica+120+Jardim+Bot%C3%A2nico+Rio+de+Janeiro",
        instagram: "@emporiojardim",
      },
    ],
  },
  gavea: {
    "Boteco": [
      { 
        name: "Braseiro da Gávea", 
        description: "Carne, chope e conversa. Sempre cheio, sempre bom.",
        price: "$$",
        address: "https://maps.google.com/?q=Braseiro+da+G%C3%A1vea+Pra%C3%A7a+Santos+Dumont+116+G%C3%A1vea+Rio+de+Janeiro",
        instagram: "@braseirodagavea",
      },
    ],
  },
  "barra-da-tijuca": {
    "Vegetariana": [
      { 
        name: "Org Bistrô", 
        description: "Opção leve, saudável e informal para o dia a dia.",
        price: "$$",
        address: "https://maps.google.com/?q=Org+Bistr%C3%B4+Av.+Oleg%C3%A1rio+Maciel+175+Loja+G+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@orgbistro",
      },
    ],
    "Carnes": [
      { 
        name: "Mocellin", 
        description: "Carne de verdade, tradição e constância. A Barra cresceu junto com o Mocellin.",
        price: "$$$",
        address: "https://maps.google.com/?q=Mocellin+Steak+Av.+Armando+Lombardi+1010+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@mocelinrestaurante",
      },
      { 
        name: "Barra Grill Steakhouse", 
        description: "Churrasco premium, ambiente grande e serviço eficiente.",
        price: "$$$",
        address: "https://maps.google.com/?q=Barra+Grill+Steakhouse+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@barragrillrestaurante",
      },
      { 
        name: "Churrascaria Tourão", 
        description: "Clássico sem frescura. Come bem e sai feliz.",
        price: "$$",
        address: "https://maps.google.com/?q=Churrascaria+Tour%C3%A3o+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@churrascariatourao",
      },
    ],
    "Peixes e Frutos do Mar": [
      { 
        name: "Mocellin Mar", 
        description: "Peixe de frente para o mar. Vista aberta e fim de tarde perfeito.",
        price: "$$$",
        address: "https://maps.google.com/?q=Mocellin+Mar+Av.+do+Pep%C3%AA+32+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@mocelinmar",
      },
    ],
    "Japonesa": [
      { 
        name: "Gurumê – Barra da Tijuca", 
        description: "Japonês moderno, constante e confiável.",
        price: "$$$",
        address: "https://maps.google.com/?q=Gurum%C3%AA+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@gurume_oficial",
      },
      { 
        name: "Naga", 
        description: "Elegante, preciso e sempre constante.",
        price: "$$$",
        address: "https://maps.google.com/?q=Naga+VillageMall+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@nagarestaurante",
      },
    ],
    "Casual": [
      { 
        name: "TT Burger", 
        description: "Hambúrguer direto ao ponto e sempre cheio.",
        price: "$$",
        address: "https://maps.google.com/?q=TT+Burger+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@ttburger",
      },
    ],
    "Café / Brunch": [
      { 
        name: "Golden Sucos", 
        description: "Clássico absoluto do pós-praia da Barra.",
        price: "$",
        address: "https://maps.google.com/?q=Golden+Sucos+Posto+7+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@goldensucos",
      },
      { 
        name: "João Padeiro", 
        description: "Padaria com alma de bairro e café bem tirado.",
        price: "$",
        address: "https://maps.google.com/?q=Jo%C3%A3o+Padeiro+Jardim+Oce%C3%A2nico+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@joaopadeiro",
      },
    ],
    "Italiana": [
      { 
        name: "Casa Tua – Barra da Tijuca", 
        description: "Italiano para ir sem pressa, com conversa longa.",
        price: "$$$",
        address: "https://maps.google.com/?q=Casa+Tua+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@casatua",
      },
    ],
    "Brasileira": [
      { 
        name: "EA Gastronomia", 
        description: "Brasileiro contemporâneo com proposta autoral.",
        price: "$$$",
        address: "https://maps.google.com/?q=EA+Gastronomia+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@eagastronomia",
      },
      { 
        name: "Proa", 
        description: "Casual, bem executado e clima leve.",
        price: "$$",
        address: "https://maps.google.com/?q=Proa+Restaurante+Barra+da+Tijuca+Rio+de+Janeiro",
        instagram: "@proarestaurante",
      },
    ],
  },
  recreio: {},
  "santa-teresa": {
    "Experiência Gastronômica": [
      { 
        name: "Aprazível", 
        description: "Vista absurda, cozinha brasileira refinada e clima especial.",
        price: "$$$$",
        address: "https://maps.google.com/?q=Apraz%C3%ADvel+Santa+Teresa+Rio+de+Janeiro",
        instagram: "@aprazivel",
      },
    ],
    "Brasileira": [
      { 
        name: "Bar do Mineiro", 
        description: "Feijoada famosa e ambiente simples e honesto.",
        price: "$$",
        address: "https://maps.google.com/?q=Bar+do+Mineiro+Santa+Teresa+Rio+de+Janeiro",
        instagram: "@bardomineiro",
      },
    ],
  },
  centro: {},
  lagoa: {},
  "sao-conrado": {},
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
      {/* Header with Save Action */}
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="flex items-center gap-4">
          <RoteiroAccessLink />
          {hasRestaurants && (
            <SaveToRoteiroButton
              itemId={`eat-${neighborhood}`}
              itemType="restaurant"
              itemTitle={`Onde comer em ${name}`}
            />
          )}
        </div>
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
