import { ChevronLeft, ExternalLink, Instagram, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";
import { getRestaurantImage } from "@/data/place-images";
import { useNeighborhoodHero } from "@/hooks/use-neighborhood-hero";
import { generateRestaurantSlug } from "@/hooks/use-external-restaurants";

interface Restaurant {
  id: string;
  name: string;
  neighborhood: string;
  tag: string;
  category?: string;
  mapsLink?: string;
  instagram?: string;
  editorial?: string;
}

interface NeighborhoodDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  neighborhoodId: string | null;
  restaurants: Restaurant[];
}

const neighborhoodIntros: Record<string, string> = {
  ipanema: "Ipanema é onde o Rio fica mais \"curado\": bonito, caminhável e com uma cena gastronômica que vai do boteco perfeito à alta cozinha mais séria. Funciona para jantar especial, almoço sem pressa e começo de noite com clima leve.",
  leblon: "Leblon é mais maduro: cozinha sólida, serviço bom e lugares onde você volta porque entrega sempre. É ótimo para almoço longo, jantar calmo e programas que não dependem de moda.",
  copacabana: "Copacabana tem aquela mistura de clássico e grandioso: hotéis históricos, ocasiões especiais e jantar com sensação de \"evento\". Ótimo quando você quer um programa marcante, sem pressa.",
  "jardim-botanico": "Jardim Botânico é charme com repertório: lugares autorais, bons encontros e uma energia mais \"bairro\", sem perder sofisticação. Funciona muito bem de dia e à noite.",
  lagoa: "Lagoa é vista e respiro: lugares que funcionam bem no almoço, no fim de tarde e em jantares leves, com o entorno ajudando a experiência. Bom para programar sem correria.",
  "sao-conrado": "São Conrado é cenário e logística: um bairro com poucos pontos certeiros, então quando funciona, vira porto seguro. Aqui vale muito mais a atmosfera, a vista e a praticidade do que \"caçar novidade\".",
  "barra-da-tijuca": "Barra é ampla e confortável: restaurantes grandes, fáceis para grupo e com cara de programa completo. Tem muito churrasco, japonês, casas maiores e opções que funcionam sem susto. Jardim Oceânico entra aqui como a parte mais caminhável e \"bairro\" da Barra.",
  gavea: "Gávea é boteco bom e conversa: lugar de rotina carioca, sem frescura, com aquele clima de \"sempre acontece\". Ótimo pra ir com amigos e emendar a noite.",
  "santa-teresa": "Santa Teresa é programa com história: vista, clima de bairro antigo e lugares que pedem tempo. Aqui o certo é ir sem pressa e transformar a refeição em memória.",
};

const NeighborhoodDetailSheet = ({
  open,
  onOpenChange,
  neighborhoodId,
  restaurants,
}: NeighborhoodDetailSheetProps) => {
  const navigate = useNavigate();
  const neighborhood = neighborhoodId ? getNeighborhoodById(neighborhoodId) : null;
  const neighborhoodName = neighborhood?.name || neighborhoodId || "";
  const { heroUrl } = useNeighborhoodHero("rio-de-janeiro", neighborhoodId || "", "Rio de Janeiro", neighborhoodName, getRestaurantImage(neighborhoodId || ""));

  const filteredRestaurants = restaurants.filter(
    (r) => r.neighborhood === neighborhoodId
  );

  const introText = neighborhoodId
    ? neighborhoodIntros[neighborhoodId] || ""
    : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <header className="px-6 py-4 border-b border-border flex items-center gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Hero Image */}
            <div className="w-full h-48 bg-muted overflow-hidden border-b border-border">
              <img
                src={heroUrl}
                alt={`Onde comer em ${neighborhood?.name || neighborhoodId}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="px-6 py-6">
              <h1 className="text-2xl font-serif font-medium text-foreground mb-2">
                Onde comer em {neighborhood?.name || neighborhoodId}
              </h1>

              {introText && (
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                  {introText}
                </p>
              )}

              {filteredRestaurants.length > 0 ? (
                <div className="space-y-6">
                  {filteredRestaurants.map((restaurant) => {
                    const slug = generateRestaurantSlug(restaurant.name);
                    return (
                    <button
                      key={restaurant.id}
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/restaurante/${slug}?from=${neighborhoodId || ''}`);
                      }}
                      className="w-full text-left pb-6 border-b border-border last:border-0 hover:bg-muted/30 transition-colors rounded -mx-2 px-2 pt-2"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-medium text-foreground">
                          {restaurant.name}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50 mt-1 flex-shrink-0" />
                      </div>

                      {restaurant.category && (
                        <span className="inline-block text-xs text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded mb-3">
                          {restaurant.category}
                        </span>
                      )}

                      {restaurant.editorial && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3 whitespace-pre-line">
                          {restaurant.editorial}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        {restaurant.mapsLink && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(restaurant.mapsLink, '_blank');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Google Maps
                          </span>
                        )}
                        {restaurant.instagram && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://instagram.com/${restaurant.instagram!.replace('@', '')}`, '_blank');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                          >
                            <Instagram className="w-3.5 h-3.5" />
                            {restaurant.instagram}
                          </span>
                        )}
                      </div>
                    </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum restaurante cadastrado neste bairro
                </p>
              )}
            </div>
          </div>

          <footer className="px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              The Lucky Trip — {neighborhood?.name || neighborhoodId}
            </p>
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NeighborhoodDetailSheet;
