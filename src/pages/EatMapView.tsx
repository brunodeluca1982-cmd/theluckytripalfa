import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RIO_NEIGHBORHOODS, getNeighborhoodById } from "@/data/rio-neighborhoods";
import LuckyListMarker from "@/components/LuckyListMarker";
import LuckyListPreviewSheet from "@/components/LuckyListPreviewSheet";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import NeighborhoodDetailSheet from "@/components/eat/NeighborhoodDetailSheet";

// Fixed editorial neighborhood order
const NEIGHBORHOOD_ORDER = [
  "ipanema",
  "leblon",
  "copacabana",
  "jardim-botanico",
  "lagoa",
  "sao-conrado",
  "barra-da-tijuca",
  "gavea",
  "santa-teresa",
];

// Lucky List items with map positions (editorial placement)
const luckyListMarkers = [
  { id: "confeitaria-colombo", top: "20%", left: "60%" },
];

// Full restaurant data with editorial content
export const restaurantListData = [
  // IPANEMA
  {
    id: "lasai",
    name: "Lasai",
    neighborhood: "ipanema",
    tag: "Alta Gastronomia",
    category: "Alta Gastronomia",
    price: "$$$$",
    mapsLink: "https://maps.google.com/?q=Lasai+Rio+de+Janeiro",
    instagram: "@lasai_rj",
    editorial: "Um dos restaurantes mais impactantes do Brasil.\nO Lasai não serve só comida — serve uma experiência inteira.\nSilêncio, precisão, profundidade, Brasil no prato.\nÉ o tipo de jantar que muda sua régua gastronômica."
  },
  {
    id: "oteque",
    name: "Oteque",
    neighborhood: "ipanema",
    tag: "Alta Gastronomia",
    category: "Alta Gastronomia",
    price: "$$$$",
    mapsLink: "https://maps.google.com/?q=Oteque+Rio+de+Janeiro",
    instagram: "@oteque_rj",
    editorial: "Entrar no Oteque é como entrar numa cena lenta de cinema.\nLuz baixa, cozinha impecável, ritmo calmo e intensidade em cada detalhe.\nUm jantar que vira capítulo da vida."
  },
  {
    id: "nido-ristorante",
    name: "Nido Ristorante",
    neighborhood: "ipanema",
    tag: "Italiano",
    category: "Italiano",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Nido+Ristorante+Ipanema",
    instagram: "@nidorestaurante",
    editorial: "Meu italiano afetivo.\nMassas impecáveis, ambiente acolhedor, comida honesta.\nRestaurante de rotina boa, conversa longa e conforto emocional."
  },
  {
    id: "zaza-bistro",
    name: "Zazá Bistrô Café",
    neighborhood: "ipanema",
    tag: "Café/Bistrô",
    category: "Café/Bistrô",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Zazá+Bistrô+Ipanema",
    instagram: "@zazabistro",
    editorial: "Delicinhas a qualquer hora do dia.\nFunciona para almoço leve, café demorado ou jantar sem cerimônia.\nÉ aquele lugar que você entra sem planejar e acaba ficando."
  },
  {
    id: "jobi",
    name: "Jobi",
    neighborhood: "ipanema",
    tag: "Boteco",
    category: "Boteco",
    price: "$$",
    mapsLink: "https://maps.google.com/?q=Jobi+Ipanema",
    instagram: "@jobi_oficial",
    editorial: "Clássico absoluto.\nChope bem tirado, comida correta e mesas que misturam gerações.\nFrequento há anos e sempre encontro alguém conhecido."
  },
  {
    id: "barzin",
    name: "Barzin",
    neighborhood: "ipanema",
    tag: "Bar",
    category: "Bar",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Barzin+Ipanema",
    instagram: "@barzin",
    editorial: "Boa opção pra começar a noite.\nAmbiente animado, público bonito e clima de paquera leve, sem exagero."
  },
  // LEBLON
  {
    id: "satyricon",
    name: "Satyricon",
    neighborhood: "leblon",
    tag: "Peixes",
    category: "Peixes",
    price: "$$$$",
    mapsLink: "https://maps.google.com/?q=Satyricon+Leblon",
    instagram: "@satyriconrio",
    editorial: "Meu restaurante de peixes.\nNão passo um fim de semana sem vir.\nClássico, elegante, produto impecável e constância rara."
  },
  {
    id: "boteco-rainha",
    name: "Boteco Rainha",
    neighborhood: "leblon",
    tag: "Brasileira",
    category: "Brasileira",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Boteco+Rainha+Leblon",
    instagram: "@botecorainhaleblon",
    editorial: "Comida brasileira muito bem executada.\nAmbiente animado, perfeito pra almoço longo ou jantar descontraído."
  },
  {
    id: "gula-gula-leblon",
    name: "Gula Gula",
    neighborhood: "leblon",
    tag: "Carioca",
    category: "Carioca",
    price: "$$",
    mapsLink: "https://maps.google.com/?q=Gula+Gula+Leblon",
    instagram: "@gulagulaoficial",
    editorial: "Restaurante carioca raiz.\nFunciona sempre.\nVou há anos, tanto na Zona Sul quanto na Barra."
  },
  {
    id: "casa-tua",
    name: "Casa Tua",
    neighborhood: "leblon",
    tag: "Italiano",
    category: "Italiano",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Casa+Tua+Leblon",
    instagram: "@casatua",
    editorial: "Italiano com clima de casa.\nMassas bem feitas, serviço próximo, sem afetação.\nÓtimo pra encontros tranquilos."
  },
  {
    id: "belmonte-praia",
    name: "Belmonte Praia",
    neighborhood: "leblon",
    tag: "Clássico",
    category: "Clássico",
    price: "$$",
    mapsLink: "https://maps.google.com/?q=Belmonte+Praia+Leblon",
    instagram: "@belmonteoficial",
    editorial: "Clássico de frente pro mar.\nO rooftop é um espetáculo.\nSe tiver fila lá em cima, sentar embaixo também vale muito a pena."
  },
  // COPACABANA
  {
    id: "mee",
    name: "Mee",
    neighborhood: "copacabana",
    tag: "Alta Gastronomia",
    category: "Alta Gastronomia",
    price: "$$$$",
    mapsLink: "https://maps.google.com/?q=Mee+Copacabana+Palace",
    instagram: "@meerestaurante",
    editorial: "Alta gastronomia asiática dentro do Copacabana Palace.\nPreciso, elegante e silencioso.\nExperiência especial, sem pressa."
  },
  {
    id: "cipriani",
    name: "Cipriani",
    neighborhood: "copacabana",
    tag: "Italiano",
    category: "Italiano",
    price: "$$$$",
    mapsLink: "https://maps.google.com/?q=Cipriani+Copacabana+Palace",
    instagram: "@ciprianiristorante",
    editorial: "Italiano clássico, serviço de alto nível e ambiente sofisticado.\nRestaurante para ocasiões marcantes."
  },
  // JARDIM BOTÂNICO
  {
    id: "elena",
    name: "Elena",
    neighborhood: "jardim-botanico",
    tag: "Contemporâneo/Autoral",
    category: "Contemporâneo/Autoral",
    price: "$$$$",
    mapsLink: "https://maps.google.com/?q=Elena+Jardim+Botânico",
    instagram: "@elenarestaurante.rj",
    editorial: "Restaurante contemporâneo, sofisticado e animado.\nFunciona muito bem para casal, mas também para solteiros e paquera.\nBoa música, público interessante e cozinha autoral."
  },
  {
    id: "ella-pizzaria",
    name: "Ella Pizzaria",
    neighborhood: "jardim-botanico",
    tag: "Pizzaria",
    category: "Pizzaria",
    price: "$$",
    mapsLink: "https://maps.google.com/?q=Ella+Pizzaria+Jardim+Botânico",
    instagram: "@ellapizzaria",
    editorial: "Pizza de personalidade.\nMassa leve, borda crocante e sabor marcante.\nUma das minhas preferidas do Rio."
  },
  {
    id: "emporio-jardim",
    name: "Empório Jardim",
    neighborhood: "jardim-botanico",
    tag: "Café/Brunch",
    category: "Café/Brunch",
    price: "$$",
    mapsLink: "https://maps.google.com/?q=Empório+Jardim",
    instagram: "@emporiojardim",
    editorial: "Café da manhã e brunch dos mais consistentes do Rio.\nBom pra ir sem pressa, inclusive com crianças."
  },
  // LAGOA
  {
    id: "capricciosa",
    name: "Capricciosa",
    neighborhood: "lagoa",
    tag: "Contemporâneo/Autoral",
    category: "Contemporâneo/Autoral",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Capricciosa+Lagoa",
    instagram: "@capricciosaoficial",
    editorial: "Italiano contemporâneo com vista privilegiada da Lagoa.\nAmbiente bonito, cardápio variado e clima que funciona tanto de dia quanto à noite."
  },
  {
    id: "gula-gula-lagoa",
    name: "Gula Gula",
    neighborhood: "lagoa",
    tag: "Brasileiro/Carioca",
    category: "Brasileiro/Carioca",
    price: "$$",
    mapsLink: "https://maps.google.com/?q=Gula+Gula+Lagoa",
    instagram: "@gulagulaoficial",
    editorial: "Restaurante carioca de rotina boa.\nFunciona sempre, com cardápio democrático e ambiente leve."
  },
  {
    id: "ct-boucherie",
    name: "CT Boucherie – Claude Troisgros",
    neighborhood: "lagoa",
    tag: "Contemporâneo/Autoral",
    category: "Contemporâneo/Autoral",
    price: "$$$$",
    mapsLink: "https://maps.google.com/?q=CT+Boucherie+Lagoa",
    instagram: "@ctboucherie",
    editorial: "Cozinha autoral com técnica francesa e produto brasileiro.\nExperiência gastronômica sólida, elegante e sem exageros."
  },
  // SÃO CONRADO
  {
    id: "a-sereia",
    name: "A Sereia",
    neighborhood: "sao-conrado",
    tag: "Experiência/Vista",
    category: "Experiência/Vista",
    price: "$$$",
    mapsLink: "",
    instagram: "@hotelnacionalrio",
    editorial: "Restaurant inside the iconic Hotel Nacional.\nStrong focus on view, atmosphere and calm rhythm.\nWorks more as an experience than a gastronomic destination.\nIdeal for guests staying in the hotel or for a sunset meal with scenery as the main character."
  },
  {
    id: "gurume-fashion-mall",
    name: "Gurumê – Fashion Mall",
    neighborhood: "sao-conrado",
    tag: "Japonês",
    category: "Japonês",
    price: "$$$",
    mapsLink: "",
    instagram: "@gurume_oficial",
    editorial: "Reliable contemporary Japanese cuisine.\nComfortable, precise and consistent.\nOften chosen for business lunches or easy dinners without surprises.\nThe mall location makes logistics simple in a neighborhood with few dining options."
  },
  {
    id: "qui-qui",
    name: "Qui Qui",
    neighborhood: "sao-conrado",
    tag: "Quiosque/Praia",
    category: "Quiosque/Praia",
    price: "$$",
    mapsLink: "",
    instagram: "",
    editorial: "Beach kiosk experience at Praia do Pepino.\nCasual, informal and connected to the local surf and hang-gliding scene.\nWorks best during the day, between beach time and sunset.\nNot about haute cuisine — about atmosphere and place."
  },
  // BARRA DA TIJUCA (including Jardim Oceânico)
  {
    id: "mocellin",
    name: "Mocellin",
    neighborhood: "barra-da-tijuca",
    tag: "Carnes",
    category: "Carnes",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Mocellin+Barra+da+Tijuca",
    instagram: "@mocelinrestaurante",
    editorial: "Carne de verdade, tradição e sabor forte.\nA Barra cresceu junto com o Mocellin.\nSempre volto."
  },
  {
    id: "barra-grill",
    name: "Barra Grill",
    neighborhood: "barra-da-tijuca",
    tag: "Carnes",
    category: "Carnes",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Barra+Grill",
    instagram: "@barragrillrestaurante",
    editorial: "Clássico absoluto de carnes na Barra.\nProduto bom, serviço rápido e ambiente que funciona sempre."
  },
  {
    id: "mocellin-mar",
    name: "Mocellin Mar",
    neighborhood: "barra-da-tijuca",
    tag: "Peixes",
    category: "Peixes",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Mocellin+Mar+Barra",
    instagram: "@mocelinmar",
    editorial: "Especializado em peixes, literalmente de frente pra praia.\nBoa comida, vista aberta e clima de fim de tarde perfeito."
  },
  {
    id: "gurume-barra",
    name: "Gurumê",
    neighborhood: "barra-da-tijuca",
    tag: "Japonês",
    category: "Japonês",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Gurumê+Barra",
    instagram: "@gurume_oficial",
    editorial: "Japonês moderno, constante e confiável.\nBom pra almoço ou jantar sem erro."
  },
  {
    id: "pobre-juan",
    name: "Pobre Juan – VillageMall",
    neighborhood: "barra-da-tijuca",
    tag: "Steakhouse",
    category: "Steakhouse",
    price: "$$$",
    mapsLink: "https://maps.google.com/?q=Pobre+Juan+VillageMall",
    instagram: "@restaurantepobrejuan",
    editorial: "Vou pela carne e pela música.\nJazz e bossa nova ao vivo transformam o jantar numa experiência muito carioca."
  },
  {
    id: "tt-burger",
    name: "TT Burger",
    neighborhood: "barra-da-tijuca",
    tag: "Lanches/Carioca",
    category: "Lanches/Carioca",
    price: "$$",
    mapsLink: "https://maps.google.com/?q=TT+Burger+Barra",
    instagram: "@ttburger",
    editorial: "Hambúrguer bem feito, direto ao ponto.\nFunciona rápido e sempre cheio."
  },
  {
    id: "golden-sucos",
    name: "Golden Sucos – Posto 7",
    neighborhood: "barra-da-tijuca",
    tag: "Lanches/Carioca",
    category: "Lanches/Carioca",
    price: "$",
    mapsLink: "https://maps.google.com/?q=Golden+Sucos+Barra",
    instagram: "@goldensucos",
    editorial: "Clássico absoluto do pós-praia da Barra.\nAçaí forte, sanduíches rápidos e sol na cara."
  },
  {
    id: "joao-padeiro",
    name: "João Padeiro",
    neighborhood: "barra-da-tijuca",
    tag: "Padaria/Café",
    category: "Padaria/Café",
    price: "$",
    mapsLink: "https://maps.google.com/?q=João+Padeiro+Jardim+Oceânico",
    instagram: "@joaopadeiro",
    editorial: "Padaria moderna com alma de bairro.\nPães ótimos, cafés bons, clima afetivo.\nPerfeita pra começar o dia."
  },
  // GÁVEA
  {
    id: "braseiro-da-gavea",
    name: "Braseiro da Gávea",
    neighborhood: "gavea",
    tag: "Boteco",
    category: "Boteco",
    price: "$$",
    mapsLink: "https://maps.google.com/?q=Braseiro+da+Gávea",
    instagram: "@braseirodagavea",
    editorial: "Boteco tradicional.\nCarne, chope e conversa.\nSempre cheio, sempre bom."
  },
  // SANTA TERESA
  {
    id: "aprazivel",
    name: "Aprazível",
    neighborhood: "santa-teresa",
    tag: "Brasileira",
    category: "Brasileira",
    price: "$$$$",
    mapsLink: "https://maps.google.com/?q=Aprazível+Santa+Teresa",
    instagram: "@aprazivel",
    editorial: "Vista absurda, cozinha brasileira refinada e clima especial.\nIdeal para ocasiões importantes ou jantares longos."
  },
  {
    id: "bar-do-mineiro",
    name: "Bar do Mineiro",
    neighborhood: "santa-teresa",
    tag: "Boteco",
    category: "Boteco",
    price: "$$",
    mapsLink: "https://maps.google.com/?q=Bar+do+Mineiro+Santa+Teresa",
    instagram: "@bardomineiro",
    editorial: "Feijoada famosa, ambiente simples e honesto.\nPrograma clássico do bairro."
  },
];

const EatMapView = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [neighborhoodSheetOpen, setNeighborhoodSheetOpen] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  
  // Mock subscriber state - replace with actual auth logic
  const isSubscriber = false;

  const handleLockedTap = () => {
    setPreviewOpen(true);
  };

  const handleNeighborhoodTap = (neighborhoodId: string) => {
    setSelectedNeighborhood(neighborhoodId);
    setNeighborhoodSheetOpen(true);
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Fixed map width - matching OndeficarRio for consistency
  const MAP_WIDTH = 900;

  // Set initial scroll to center
  useEffect(() => {
    if (mapContainerRef.current) {
      const container = mapContainerRef.current;
      const initialScroll = (MAP_WIDTH - container.clientWidth) / 2;
      container.scrollLeft = Math.max(0, initialScroll);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mapContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - mapContainerRef.current.offsetLeft);
    setScrollLeft(mapContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mapContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - mapContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    mapContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!mapContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - mapContainerRef.current.offsetLeft);
    setScrollLeft(mapContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !mapContainerRef.current) return;
    const x = e.touches[0].pageX - mapContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    mapContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Meu Roteiro access */}
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <RoteiroAccessLink />
      </header>

      {/* Title */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-3xl font-serif font-medium text-foreground">
          Onde Comer
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Rio de Janeiro
        </p>
      </div>

      {/* Map Area - Fixed at top, matching OndeficarRio sizing */}
      <div 
        ref={mapContainerRef}
        className="relative w-full h-[40vh] overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing flex-shrink-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div 
          ref={mapContentRef}
          className="relative h-full"
          style={{ width: `${MAP_WIDTH}px`, minWidth: `${MAP_WIDTH}px` }}
        >
          {/* 3D Illustrated Map Background */}
          <img 
            src="/assets/maps/rio-3d-map-eat.png" 
            alt="Rio de Janeiro 3D Map"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />

          {/* Tappable neighborhood markers - anchored to map coordinates */}
          {RIO_NEIGHBORHOODS.map((neighborhood) => (
            <button
              key={neighborhood.id}
              onClick={(e) => {
                e.stopPropagation();
                handleNeighborhoodTap(neighborhood.id);
              }}
              className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full bg-foreground/10 border border-foreground/20 hover:bg-foreground/20 hover:border-foreground/40 transition-colors flex items-center justify-center"
              style={{ top: neighborhood.mapPosition.top, left: neighborhood.mapPosition.left }}
              aria-label={`Explorar restaurantes em ${neighborhood.name}`}
            >
              <div className="w-2 h-2 rounded-full bg-foreground/60" />
            </button>
          ))}

          {/* Lucky List markers */}
          {luckyListMarkers.map((marker) => (
            <LuckyListMarker
              key={marker.id}
              id={marker.id}
              top={marker.top}
              left={marker.left}
              isSubscriber={isSubscriber}
              onLockedTap={handleLockedTap}
            />
          ))}
        </div>
      </div>

      {/* Instruction */}
      <div className="px-6 py-4 border-b border-border">
        <p className="text-sm text-muted-foreground text-center">
          Toque em um bairro para explorar onde comer
        </p>
      </div>

      {/* Restaurant List - Grouped by editorial neighborhood order */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <h2 className="text-lg font-serif font-medium text-foreground mb-4">
            Restaurantes
          </h2>
          <div className="space-y-6">
            {NEIGHBORHOOD_ORDER.map((neighborhoodId) => {
              const neighborhoodRestaurants = restaurantListData.filter(
                (r) => r.neighborhood === neighborhoodId
              );
              
              // Skip neighborhoods with no restaurants
              if (neighborhoodRestaurants.length === 0) return null;
              
              const neighborhoodData = getNeighborhoodById(neighborhoodId);
              
              return (
                <div key={neighborhoodId}>
                  {/* Section Header */}
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    {neighborhoodData?.name || neighborhoodId}
                  </h3>
                  <div className="space-y-1">
                    {neighborhoodRestaurants.map((restaurant) => {
                      const slug = restaurant.name
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-");
                      
                      return (
                        <Link
                          key={restaurant.id}
                          to={`/restaurante/${slug}?from=${restaurant.neighborhood}`}
                          className="flex items-center justify-between py-4 border-b border-border hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-base text-foreground truncate">{restaurant.name}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded">
                              {restaurant.tag}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>

      {/* Lucky List Preview Sheet */}
      <LuckyListPreviewSheet open={previewOpen} onOpenChange={setPreviewOpen} />

      {/* Neighborhood Detail Sheet */}
      <NeighborhoodDetailSheet
        open={neighborhoodSheetOpen}
        onOpenChange={setNeighborhoodSheetOpen}
        neighborhoodId={selectedNeighborhood}
        restaurants={restaurantListData}
      />
    </div>
  );
};

export default EatMapView;