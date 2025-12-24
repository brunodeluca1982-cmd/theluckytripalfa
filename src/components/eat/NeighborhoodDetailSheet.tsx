import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";

interface Restaurant {
  id: string;
  name: string;
  neighborhood: string;
  tag: string;
}

interface NeighborhoodDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  neighborhoodId: string | null;
  restaurants: Restaurant[];
}

// Short descriptions for each neighborhood (static, 1 line)
const neighborhoodShortDescriptions: Record<string, string> = {
  ipanema: "Gastronomia diversa como a própria praia",
  leblon: "Restaurantes maduros, cozinhas sólidas",
  copacabana: "Tradição à mesa, restaurantes históricos",
  leme: "Discreto e local, clima de bairro",
  arpoador: "Pequeno no mapa, estratégico",
  "jardim-botanico": "Gastronomia verde, calma e cuidadosa",
  gavea: "Bares clássicos, extensão da sala de casa",
  botafogo: "Polo gastronômico criativo",
  flamengo: "Funcional, com boas surpresas",
  "santa-teresa": "Comer faz parte da experiência",
  "sao-conrado": "Poucas opções, bem pontuais",
  "barra-da-tijuca": "Restaurantes amplos e confortáveis",
  recreio: "Comida ligada ao esporte e natureza",
  centro: "Balcões históricos e confeitarias centenárias",
  lagoa: "Restaurantes sofisticados à beira d'água",
};

const NeighborhoodDetailSheet = ({
  open,
  onOpenChange,
  neighborhoodId,
  restaurants,
}: NeighborhoodDetailSheetProps) => {
  const neighborhood = neighborhoodId ? getNeighborhoodById(neighborhoodId) : null;
  
  // Filter restaurants for this neighborhood
  const filteredRestaurants = restaurants.filter(
    (r) => r.neighborhood === neighborhoodId
  );

  const shortDescription = neighborhoodId 
    ? neighborhoodShortDescriptions[neighborhoodId] || ""
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
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Neighborhood Title */}
            <h1 className="text-2xl font-serif font-medium text-foreground mb-1">
              {neighborhood?.name || neighborhoodId}
            </h1>
            
            {/* Short Description */}
            {shortDescription && (
              <p className="text-sm text-muted-foreground mb-6">
                {shortDescription}
              </p>
            )}

            {/* Restaurant List */}
            {filteredRestaurants.length > 0 ? (
              <div className="space-y-1">
                {filteredRestaurants.map((restaurant) => {
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
                        <p className="text-base text-foreground truncate">
                          {restaurant.name}
                        </p>
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
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum restaurante cadastrado neste bairro
              </p>
            )}
          </div>

          {/* Footer */}
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
