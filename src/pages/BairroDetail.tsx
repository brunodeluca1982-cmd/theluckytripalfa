import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const neighborhoodData: Record<string, { name: string; description: string }> = {
  copacabana: {
    name: "Copacabana",
    description: "Bairro icônico com a famosa orla de 4km, vida noturna agitada e fácil acesso a diversos pontos turísticos. Ideal para quem busca conveniência e a energia típica do Rio.",
  },
  ipanema: {
    name: "Ipanema",
    description: "Conhecido pela praia elegante e ruas arborizadas, Ipanema oferece ótimas opções de restaurantes, lojas e galerias. Perfeito para quem valoriza sofisticação e qualidade de vida.",
  },
  leblon: {
    name: "Leblon",
    description: "O bairro mais exclusivo da zona sul, com ambiente familiar e seguro. Excelentes restaurantes e proximidade com a natureza. Para quem busca tranquilidade sem abrir mão do conforto.",
  },
  "santa-teresa": {
    name: "Santa Teresa",
    description: "Bairro histórico com ruas de paralelepípedo, ateliês e vista panorâmica da cidade. Atmosfera boêmia e artística única. Indicado para viajantes que buscam autenticidade.",
  },
  botafogo: {
    name: "Botafogo",
    description: "Bairro em ascensão com vida cultural intensa, bares descolados e vista para o Pão de Açúcar. Boa localização entre a zona sul e o centro. Para quem gosta de explorar.",
  },
  lapa: {
    name: "Lapa",
    description: "Coração da vida noturna carioca com os famosos Arcos da Lapa. Música ao vivo, bares e casas de show. Ideal para quem quer mergulhar na cultura popular brasileira.",
  },
};

const placeholderHotels = [
  { name: "Hotel Placeholder Premium", price: "R$ 1.200/noite", category: "Luxo" },
  { name: "Hotel Placeholder Superior", price: "R$ 850/noite", category: "Superior" },
  { name: "Hotel Placeholder Comfort", price: "R$ 550/noite", category: "Conforto" },
  { name: "Hotel Placeholder Standard", price: "R$ 380/noite", category: "Standard" },
  { name: "Hostel Placeholder", price: "R$ 120/noite", category: "Econômico" },
];

const BairroDetail = () => {
  const { id } = useParams<{ id: string }>();
  const neighborhood = neighborhoodData[id || ""] || {
    name: "Bairro",
    description: "Descrição do bairro será adicionada aqui.",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/onde-ficar-rio"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Onde Ficar
        </Link>
      </header>

      {/* Image Placeholder */}
      <div className="w-full aspect-[16/10] bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Imagem ou vídeo</p>
          <p className="text-muted-foreground text-xs mt-1">(placeholder)</p>
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-8">
        <h1 className="text-4xl font-serif font-medium text-foreground mb-4">
          {neighborhood.name}
        </h1>
        
        <p className="text-base text-muted-foreground leading-relaxed mb-10">
          {neighborhood.description}
        </p>

        {/* Hotels Section */}
        <section>
          <h2 className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
            Onde Dormir
          </h2>
          
          <div className="space-y-3">
            {placeholderHotels.map((hotel, index) => (
              <div
                key={index}
                className="p-4 bg-card border border-border rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {hotel.category}
                    </p>
                    <h3 className="text-base font-serif font-medium text-foreground">
                      {hotel.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {hotel.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border mt-8">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {neighborhood.name}, Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default BairroDetail;
