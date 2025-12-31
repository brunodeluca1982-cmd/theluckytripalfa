import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { useItemSave } from "@/hooks/use-item-save";

/**
 * HOTEL DETAIL PAGE
 * 
 * Individual detail view for a single hotel.
 * Each hotel has its own unique URL.
 * 
 * SAVING SCOPE: Only this individual hotel can be saved (item level).
 */

// Hotel data store (mirrors WhereToStayDetail data)
const hotelData: Record<string, {
  name: string;
  price: string;
  description: string;
  address?: string;
  instagram?: string;
  externalLink?: string;
  neighborhood: string;
  neighborhoodName: string;
}> = {
  // Ipanema hotels
  "hotel-fasano-rio-de-janeiro": {
    name: "Hotel Fasano Rio de Janeiro",
    price: "$$$$",
    description: "O endereço de luxo mais clássico do Rio. O rooftop virou cenário de campanhas, entrevistas e reuniões importantes. Já vi jogadores de futebol, gente do cinema, moda e música ali — todos buscando vista, discrição e serviço impecável.",
    address: "https://maps.google.com/?q=Hotel+Fasano+Rio+de+Janeiro",
    instagram: "@fasano",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  "ipanema-inn": {
    name: "Ipanema Inn",
    price: "$$$",
    description: "Pequeno, acolhedor e com cara de casa. Perfeito pra quem vai e vem o dia todo sem depender de carro.",
    address: "https://maps.google.com/?q=Ipanema+Inn",
    instagram: "@ipanemainn",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  "mar-ipanema-hotel": {
    name: "Mar Ipanema Hotel",
    price: "$$$",
    description: "Urbano, prático e extremamente bem localizado. Funciona muito bem pra quem quer viver Ipanema intensamente.",
    address: "https://maps.google.com/?q=Mar+Ipanema+Hotel",
    instagram: "@mariipanemahotel",
    neighborhood: "ipanema",
    neighborhoodName: "Ipanema",
  },
  // Leblon hotels
  "janeiro-hotel": {
    name: "Janeiro Hotel",
    price: "$$$$",
    description: "Minimalista, silencioso e luminoso. Atrai quem gosta de design, arte e acordar com o mar sem perder o clima de bairro do Leblon.",
    address: "https://maps.google.com/?q=Janeiro+Hotel+Leblon",
    instagram: "@janeirolifestyle",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "ritz-leblon": {
    name: "Ritz Leblon",
    price: "$$$",
    description: "Discreto e confortável. Vejo muita gente que grava, escreve ou trabalha na Zona Sul escolhendo o Ritz justamente pelo silêncio e localização.",
    address: "https://maps.google.com/?q=Ritz+Leblon",
    instagram: "@ritzleblon",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  "promenade-palladium": {
    name: "Promenade Palladium",
    price: "$$",
    description: "Tem cara de residência do bairro. Muito usado por quem vem trabalhar no Rio e prefere discrição e praticidade.",
    address: "https://maps.google.com/?q=Promenade+Palladium+Leblon",
    instagram: "@promenadehotels",
    neighborhood: "leblon",
    neighborhoodName: "Leblon",
  },
  // Copacabana hotels
  "copacabana-palace": {
    name: "Copacabana Palace",
    price: "$$$$",
    description: "Ícone absoluto do Brasil. Mesmo quando não fico, é referência. Presidentes, artistas, jogadores e grandes eventos passam por aqui há décadas.",
    address: "https://maps.google.com/?q=Copacabana+Palace",
    instagram: "@copacabanapalace",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  "emiliano-rio": {
    name: "Emiliano Rio",
    price: "$$$$",
    description: "Arquitetura elegante, serviço preciso e rooftop reservado. Muito escolhido por quem quer luxo discreto e boa localização.",
    address: "https://maps.google.com/?q=Hotel+Emiliano+Rio",
    instagram: "@emiliano_rio",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  "fairmont-rio": {
    name: "Fairmont Rio",
    price: "$$$$",
    description: "O antigo Rio Palace. Da piscina, o Pão de Açúcar entra no enquadramento como se fosse cenário montado.",
    address: "https://maps.google.com/?q=Fairmont+Rio+Copacabana",
    instagram: "@fairmontricopacabana",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  "hilton-copacabana": {
    name: "Hilton Copacabana",
    price: "$$$",
    description: "Hotel grande, vista panorâmica e logística fácil. Muito usado por bandas, equipes esportivas e grandes produções.",
    address: "https://maps.google.com/?q=Hilton+Copacabana",
    instagram: "@hiltoncopacabana",
    neighborhood: "copacabana",
    neighborhoodName: "Copacabana",
  },
  // Leme hotels
  "windsor-leme": {
    name: "Windsor Leme",
    price: "$$$",
    description: "Mais silencioso, com clima de bairro e mar na porta. Boa escolha pra quem quer dormir bem.",
    address: "https://maps.google.com/?q=Windsor+Leme",
    instagram: "@windsorhoteis",
    neighborhood: "leme",
    neighborhoodName: "Leme",
  },
  "arena-leme": {
    name: "Arena Leme",
    price: "$$",
    description: "Moderno, funcional e bem localizado. Base frequente de produções que filmam na Urca e no Forte do Leme.",
    address: "https://maps.google.com/?q=Arena+Leme+Hotel",
    instagram: "@arenahotels",
    neighborhood: "leme",
    neighborhoodName: "Leme",
  },
  // São Conrado hotels
  "hotel-nacional": {
    name: "Hotel Nacional",
    price: "$$$$",
    description: "Projeto de Niemeyer à beira-mar. Já recebeu presidentes, músicos internacionais e grandes eventos. Hoje é escolha de quem quer vista e história.",
    address: "https://maps.google.com/?q=Hotel+Nacional+Rio",
    instagram: "@hotelnacionalrio",
    neighborhood: "sao-conrado",
    neighborhoodName: "São Conrado",
  },
  // Barra da Tijuca hotels
  "hyatt-regency-barra": {
    name: "Hyatt Regency Barra",
    price: "$$$$",
    description: "Clima de resort dentro da cidade. Muito usado por bandas e equipes de grandes shows.",
    address: "https://maps.google.com/?q=Hyatt+Regency+Barra+da+Tijuca",
    instagram: "@hyattregencyrio",
    neighborhood: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
  },
  "windsor-barra": {
    name: "Windsor Barra",
    price: "$$$",
    description: "Clássico da orla. Recebe delegações esportivas e congressos.",
    address: "https://maps.google.com/?q=Windsor+Barra",
    instagram: "@windsorhoteis",
    neighborhood: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
  },
  "lsh-hotel": {
    name: "LSH Hotel",
    price: "$$$",
    description: "Compacto, moderno e bem localizado. Ótimo pra quem quer viver o Jardim Oceânico a pé.",
    address: "https://maps.google.com/?q=LSH+Hotel+Barra",
    instagram: "@lshhotel",
    neighborhood: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
  },
  "laghetto-stilo-barra": {
    name: "Laghetto Stilo Barra",
    price: "$$",
    description: "Boa relação custo-benefício para trabalho e eventos.",
    address: "https://maps.google.com/?q=Laghetto+Stilo+Barra",
    instagram: "@laghettostilobarra",
    neighborhood: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
  },
  // Recreio hotels
  "c-design-hotel": {
    name: "C Design Hotel",
    price: "$$$",
    description: "Pé na areia, fachada marcante e clima jovem. Muito usado por surfistas e equipes esportivas.",
    address: "https://maps.google.com/?q=C+Design+Hotel",
    instagram: "@cdesignhotel",
    neighborhood: "recreio",
    neighborhoodName: "Recreio",
  },
  // Santa Teresa hotels
  "santa-teresa-hotel-rj-mgallery": {
    name: "Santa Teresa Hotel RJ MGallery",
    price: "$$$$",
    description: "Refúgio criativo. Amy Winehouse, Alicia Keys e Alanis Morissette já se hospedaram aqui.",
    address: "https://maps.google.com/?q=Santa+Teresa+Hotel+RJ",
    instagram: "@santateresahotel",
    neighborhood: "santa-teresa",
    neighborhoodName: "Santa Teresa",
  },
  "mama-shelter-rio": {
    name: "Mama Shelter Rio",
    price: "$$",
    description: "Colorido, jovem e animado. Boa mistura de hospedagem e vida social.",
    address: "https://maps.google.com/?q=Mama+Shelter+Rio",
    instagram: "@mamashelterrj",
    neighborhood: "santa-teresa",
    neighborhoodName: "Santa Teresa",
  },
  // Centro hotels
  "prodigy-santos-dumont-by-wish": {
    name: "Prodigy Santos Dumont by Wish",
    price: "$$",
    description: "Funcional e estratégico pra quem chega ou sai pelo Santos Dumont. O diferencial é o rooftop com piscina e vista da Baía, mas a proposta aqui é praticidade, não luxo.",
    address: "https://maps.google.com/?q=Prodigy+Santos+Dumont+by+Wish",
    instagram: "@prodigysantosdumont",
    neighborhood: "centro",
    neighborhoodName: "Centro",
  },
  "windsor-guanabara-hotel": {
    name: "Windsor Guanabara Hotel",
    price: "$$",
    description: "Hotel tradicional do Centro, com estrutura grande e operação eficiente. Funciona bem pra quem vai circular entre Centro, Lapa e compromissos de trabalho, sem expectativa de experiência sofisticada.",
    address: "https://maps.google.com/?q=Windsor+Guanabara+Hotel",
    instagram: "@windsorhoteis",
    neighborhood: "centro",
    neighborhoodName: "Centro",
  },
};

// Mapping from guide data IDs to detail page slugs
const guideIdToSlug: Record<string, string> = {
  "fasano": "hotel-fasano-rio-de-janeiro",
  "janeiro": "janeiro-hotel",
  "ritz-leblon": "ritz-leblon",
  "ipanema-inn": "ipanema-inn",
  "mar-ipanema": "mar-ipanema-hotel",
  "promenade-palladium": "promenade-palladium",
  "copa-palace": "copacabana-palace",
  "emiliano": "emiliano-rio",
  "fairmont": "fairmont-rio",
  "hilton-copa": "hilton-copacabana",
  "windsor-leme": "windsor-leme",
  "arena-leme": "arena-leme",
  "nacional": "hotel-nacional",
  "hyatt-barra": "hyatt-regency-barra",
  "windsor-barra": "windsor-barra",
  "lsh-barra": "lsh-hotel",
  "laghetto-barra": "laghetto-stilo-barra",
  "c-design": "c-design-hotel",
  "santa-teresa-mgallery": "santa-teresa-hotel-rj-mgallery",
  "mama-shelter": "mama-shelter-rio",
};

// Helper to generate slug from hotel name
export const generateHotelSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();
  
  // Try direct lookup first, then try guide ID mapping
  const resolvedSlug = guideIdToSlug[id || ""] || id || "";
  const hotel = hotelData[resolvedSlug];
  const from = searchParams.get("from");
  // Back navigation: list → onde-ficar-rio, map → city-view, neighborhood → neighborhood detail
  const getBackPath = () => {
    if (from === "list") return "/onde-ficar-rio";
    if (from === "map") return "/city-view";
    if (from) return `/onde-ficar/${from}`;
    return "/city-view"; // Default to map view
  };
  const backPath = getBackPath();

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Hotel não encontrado</p>
          <Link to="/" className="text-foreground underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveItem(resolvedSlug, "hotel", hotel.name, false);
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

        {/* Hotel Info */}
        <div className="px-6 pt-8">
          {/* Category */}
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
            Hotel • {hotel.neighborhoodName}
          </p>
          
          {/* Title */}
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight mb-4">
            {hotel.name}
          </h1>
          
          {/* Price */}
          <p className="text-sm text-muted-foreground mb-4">{hotel.price}</p>
          
          {/* Description */}
          <div className="space-y-2 mb-6">
            {hotel.description.split('\n').map((paragraph, index) => (
              <p key={index} className="text-base text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Metadata */}
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            {hotel.address && (
              <p>
                <a 
                  href={hotel.address} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline"
                >
                  Ver no Google Maps
                </a>
              </p>
            )}
            {hotel.instagram && (
              <p>
                <a 
                  href={`https://instagram.com/${hotel.instagram.replace('@', '')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {hotel.instagram}
                </a>
              </p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3 h-3" />
              Salvar
            </Button>
            
            {hotel.externalLink && (
              <a 
                href={hotel.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-foreground underline"
              >
                Ver disponibilidade
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {hotel.neighborhoodName}
        </p>
      </footer>
    </div>
  );
};

export default HotelDetail;
