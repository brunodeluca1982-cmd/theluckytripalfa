import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import HotelCard from "@/components/HotelCard";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { getHotelImage } from "@/data/place-images";

/**
 * ONDE FICAR — NEIGHBORHOOD HOTEL LIST
 * 
 * SAVING BEHAVIOR: Save actions are NOT allowed on this page.
 * Users must navigate to individual hotel detail pages to save.
 */

// Neighborhood descriptions for staying
const neighborhoodDescriptions: Record<string, string> = {
  ipanema: "Bairro icônico do Rio clássico.",
  leblon: "Mais residencial, organizado e tradicional. Frequentado por famílias antigas, gente que mora há décadas no bairro e um público mais maduro. É elegante, seguro e previsível, no bom sentido. Também dá pra fazer tudo a pé: praia, restaurantes e serviços. É ótimo pra quem quer conforto, tranquilidade e boa estrutura, sem abrir mão da Zona Sul. Menos agitado que Ipanema, mais estável.",
  copacabana: "Intensa, histórica e muito movimentada. Recebe gente do mundo inteiro e funciona quase como um bairro internacional dentro do Rio. Tem prédios antigos, comércio forte e vida acontecendo o dia inteiro. Tudo é acessível a pé: praia, metrô, mercados e restaurantes. É prático para quem vem pela primeira vez e quer logística fácil. Não é o bairro mais silencioso, mas é um dos mais completos.",
  arpoador: "Arpoador é onde o Rio respira. Ponto de encontro entre Ipanema e Copacabana, com pedra icônica e pôr do sol aplaudido.",
  leme: "Mais calmo, residencial e com clima de bairro. É uma extensão tranquila de Copacabana, muito procurada por famílias e por quem quer dormir melhor à noite. Dá pra fazer tudo a pé dentro do bairro e chegar facilmente a Copacabana caminhando. Ótima opção pra quem quer praia, vista bonita e menos agitação.",
  "sao-conrado": "Silencioso, contemplativo e menos urbano. Mistura moradores antigos, gente ligada ao esporte e quem busca tranquilidade entre a Zona Sul e a Barra. Carro ou aplicativo são praticamente obrigatórios. A praia é próxima, mas o bairro não é caminhável. Bom pra quem quer sossego e natureza.",
  "barra-da-tijuca": "A Barra é o Rio em versão expandida. Avenida larga, prédios modernos, condomínio com portaria e uma praia imensa que parece não ter fim. Aqui o ritmo é outro: menos aperto, menos caos, mais espaço.\n\nEu acompanhei esse bairro crescer. Vivi fases importantes aqui. A Barra não tenta ser Ipanema — e quando você entende isso, ela começa a fazer muito sentido.",
  recreio: "Jovem, esportivo e mais selvagem. Muito surf, corrida, bicicleta e contato direto com a natureza.\n\nCarro é indispensável. Não é a melhor escolha para primeira viagem sem planejamento.\n\nEu tenho uma história especial aqui. Morei seis meses no C Design com a Sthefany durante a reforma da minha casa e a gravidez dela. Um período que poderia ser tenso virou prazeroso.",
  "santa-teresa": "Artístico, histórico e cheio de personalidade. Frequentado por artistas, estrangeiros e gente que busca uma experiência menos óbvia do Rio. Não é bairro pra fazer tudo a pé nem pra praia. Exige táxi ou aplicativo. Ideal pra quem quer charme, vista e clima cultural acima de praticidade.",
  centro: "O coração histórico do Rio. Arquitetura grandiosa, instituições culturais e um vislumbre do passado da cidade. Ideal para viajantes focados em cultura.",
  "jardim-botanico": "Verde, silencioso e mais familiar. Mistura moradores tradicionais com famílias jovens e gente que busca qualidade de vida. É menos turístico e mais local. Não é o melhor lugar pra fazer tudo a pé, mas dá pra circular bem dentro do bairro. Praia exige deslocamento curto de carro ou aplicativo. Ótimo pra quem quer calma e contato com a natureza.",
  gavea: "Boêmia, universitária e ao mesmo tempo residencial. Mistura jovens, famílias e vida noturna mais informal. É um bairro vivo, mas não turístico. Dá pra circular a pé dentro do bairro, mas praia e outros pontos exigem carro ou aplicativo. Boa escolha pra quem gosta de bares, restaurantes e um clima mais local.",
  botafogo: "Urbano, prático e diverso. Atrai gente jovem, profissionais, criativos e moradores antigos. Menos \"cartão-postal\" e mais vida real. É fácil andar a pé, usar metrô e aplicativos. Praia não é o foco, mas a logística é excelente. Bom pra quem quer mobilidade, variedade e boa conexão com o resto da cidade.",
  flamengo: "Residencial, organizado e funcional. Muito usado como base por quem quer fácil acesso ao Centro e à Zona Sul, com preços mais equilibrados. Dá pra andar a pé no bairro e usar metrô com facilidade. A praia é mais contemplativa do que de banho. Ótimo custo-benefício e logística simples.",
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
      description: "Ícone absoluto da hotelaria carioca, com vista para o Arpoador.",
      address: "https://maps.google.com/?q=Hotel+Fasano+Rio+de+Janeiro",
      instagram: "@fasano",
      externalLink: "https://fasano.com.br"
    },
    { 
      name: "Emiliano Rio", 
      price: "$$$$", 
      description: "Sofisticação contemporânea com spa e design minimalista.",
      address: "https://maps.google.com/?q=Emiliano+Rio",
      instagram: "@emilianorio",
      externalLink: "https://www.emiliano.com.br/"
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
      name: "Fairmont Rio de Janeiro Copacabana", 
      price: "$$$$", 
      description: "Charme francês com vista para a Praia de Copacabana.",
      address: "https://maps.google.com/?q=Fairmont+Rio+de+Janeiro+Copacabana",
      instagram: "@fairmontcopacabana",
      externalLink: "https://www.fairmont.com/copacabana-rio/"
    },
  ],
  arpoador: [
    { 
      name: "Hotel Arpoador", 
      price: "$$$", 
      description: "Hotel boutique pé na areia com clima descontraído.",
      address: "https://maps.google.com/?q=Hotel+Arpoador",
      instagram: "@hotelarpoador",
      externalLink: "https://hotelarpoador.com/"
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
      name: "Grand Hyatt Rio de Janeiro", 
      price: "$$$$", 
      description: "Luxo contemporâneo com arquitetura elegante e integração total com a natureza da Reserva. Quartos amplos, spa sofisticado e atmosfera tranquila.",
      address: "https://maps.google.com/?q=Grand+Hyatt+Rio+de+Janeiro",
      instagram: "@grandhyattrio",
      externalLink: "https://www.hyatt.com/grand-hyatt/pt-BR/riogh-grand-hyatt-rio-de-janeiro"
    },
    { 
      name: "Windsor Barra", 
      price: "$$$$", 
      description: "Clássico da orla, muito usado para eventos. Vista frontal para o mar e localização estratégica.",
      address: "https://maps.google.com/?q=Windsor+Barra+Hotel",
      instagram: "@windsorhoteis",
      externalLink: "https://windsorhoteis.com/hotel/windsor-barra/"
    },
    { 
      name: "ibis Rio de Janeiro Barra da Tijuca", 
      price: "$$", 
      description: "Prático, funcional e direto ao ponto. Boa localização e custo eficiente.",
      address: "https://maps.google.com/?q=ibis+Rio+de+Janeiro+Barra+da+Tijuca",
      instagram: "@ibisrio",
      externalLink: "https://all.accor.com/"
    },
  ],
  recreio: [
    { 
      name: "C Design Hotel", 
      price: "$$$", 
      description: "Design contemporâneo, vista frontal para o mar e clima leve.",
      address: "https://maps.google.com/?q=C+Design+Hotel+Recreio",
      instagram: "@cdesignhotel",
      externalLink: "https://www.cdesignhotel.com.br/"
    },
  ],
  "santa-teresa": [
    { 
      name: "Santa Teresa Hotel RJ MGallery", 
      price: "$$$$", 
      description: "Refúgio criativo. Amy Winehouse, Alicia Keys e Alanis Morissette já se hospedaram aqui.",
      address: "https://maps.google.com/?q=Santa+Teresa+Hotel+RJ",
      instagram: "@santateresahotel",
      externalLink: ""
    },
    { 
      name: "Mama Shelter Rio", 
      price: "$$", 
      description: "Colorido, jovem e animado. Boa mistura de hospedagem e vida social.",
      address: "https://maps.google.com/?q=Mama+Shelter+Rio",
      instagram: "@mamashelterrj",
      externalLink: ""
    },
  ],
  centro: [
    { 
      name: "Prodigy Santos Dumont by Wish", 
      price: "$$", 
      description: "Funcional e estratégico pra quem chega ou sai pelo Santos Dumont. O diferencial é o rooftop com piscina e vista da Baía, mas a proposta aqui é praticidade, não luxo.",
      address: "https://maps.google.com/?q=Prodigy+Santos+Dumont+by+Wish",
      instagram: "@prodigysantosdumont",
      externalLink: ""
    },
    { 
      name: "Windsor Guanabara Hotel", 
      price: "$$", 
      description: "Hotel tradicional do Centro, com estrutura grande e operação eficiente. Funciona bem pra quem vai circular entre Centro, Lapa e compromissos de trabalho, sem expectativa de experiência sofisticada.",
      address: "https://maps.google.com/?q=Windsor+Guanabara+Hotel",
      instagram: "@windsorhoteis",
      externalLink: ""
    },
  ],
};

const WhereToStayDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const [searchParams] = useSearchParams();
  
  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodData?.name || "Neighborhood";
  const description = neighborhoodDescriptions[neighborhood || ""] || `Placeholder description for ${name}.`;
  const hotels = hotelsByNeighborhood[neighborhood || ""] || [];
  
  const backPath = "/onde-ficar-rio";

  return (
    <div className="min-h-screen bg-background">
      {/* Header - No page-level save button */}
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
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            Onde ficar em {name}
          </h1>
        </div>

        {/* Hero Image - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted overflow-hidden">
          <img 
            src={getHotelImage(neighborhood || "")} 
            alt={`Onde ficar em ${name}`}
            className="w-full h-full object-cover"
          />
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
            Hotéis
          </h2>
          
          {hotels.length > 0 ? (
            <div>
              {hotels.map((hotel, index) => {
                const slug = hotel.name
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-");
                return (
                  <HotelCard
                    key={index}
                    name={hotel.name}
                    price={hotel.price}
                    description={hotel.description}
                    slug={slug}
                    neighborhood={neighborhood}
                    imageUrl={getHotelImage(neighborhood || "")}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Recomendações de hotéis em breve.
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
