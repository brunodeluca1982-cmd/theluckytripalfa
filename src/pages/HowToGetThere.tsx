import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * How to Get There - City-level only
 * 
 * Rules:
 * - City-level only (not neighborhood-based)
 * - May contain outbound links (flights, transport, tickets)
 */

const transportOptions = [
  {
    title: "Por Avião",
    description: "O Rio de Janeiro tem dois aeroportos: Galeão Internacional (GIG) para a maioria dos voos internacionais, e Santos Dumont (SDU) para rotas domésticas.",
    ctaLabel: "Buscar voos",
  },
  {
    title: "Do Aeroporto",
    description: "As opções incluem táxis oficiais, aplicativos de transporte, ônibus do aeroporto (BRT) e transfers privados. A viagem até a Zona Sul leva de 30 a 60 minutos dependendo do trânsito.",
    ctaLabel: "Reservar transfer",
  },
  {
    title: "Circulando pela Cidade",
    description: "O metrô conecta os principais bairros. Táxis e aplicativos são acessíveis. Para as praias, caminhar costuma ser a melhor opção.",
    ctaLabel: "Ver mapa de transporte",
  },
];

const HowToGetThere = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/"
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
            Como Chegar
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Rio de Janeiro
          </p>
        </div>

        {/* Media Placeholder - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Espaço para imagem ou vídeo</p>
        </div>

        {/* Description */}
        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            Tudo o que você precisa saber para chegar ao Rio de Janeiro e se locomover pela cidade.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* Transport Options */}
        <section className="px-6 pt-8">
          <div className="space-y-6">
            {transportOptions.map((option, index) => (
              <div key={index} className="pb-6 border-b border-border last:border-0">
                <h2 className="text-lg font-serif font-medium text-foreground mb-2">
                  {option.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {option.description}
                </p>
                {/* Inactive CTA Placeholder */}
                <div className="py-2 px-3 bg-muted/50 rounded inline-block">
                  <p className="text-sm text-muted-foreground">
                    {option.ctaLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default HowToGetThere;
