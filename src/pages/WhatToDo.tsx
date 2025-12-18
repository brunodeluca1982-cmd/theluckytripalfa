import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { RIO_NEIGHBORHOODS } from "@/data/rio-neighborhoods";

/**
 * What to Do - Activities and experiences
 * 
 * Rules:
 * - Can be neighborhood-based or city-level
 * - Must support both without duplication
 */

// City-level activities
const cityActivities = [
  {
    id: "christ-the-redeemer",
    title: "Cristo Redentor",
    description: "A icônica estátua no topo do Corcovado.",
  },
  {
    id: "sugarloaf",
    title: "Pão de Açúcar",
    description: "Passeio de bondinho com vistas panorâmicas.",
  },
];

const WhatToDo = () => {
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
            O Que Fazer
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
            Dos pontos turísticos icônicos às joias escondidas dos bairros, descubra o que torna o Rio inesquecível.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* City-Level Activities */}
        <section className="px-6 pt-8">
          <h2 className="text-xs tracking-widest text-muted-foreground uppercase mb-4">
            Experiências Icônicas
          </h2>
          <div className="space-y-4">
            {cityActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 bg-card border border-border rounded-lg"
              >
                <h3 className="text-lg font-serif font-medium text-foreground mb-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="mx-6 mt-8 border-t border-border" />

        {/* Neighborhood-Based Activities */}
        <section className="px-6 pt-8">
          <h2 className="text-xs tracking-widest text-muted-foreground uppercase mb-4">
            Explorar por Bairro
          </h2>
          <div className="space-y-3">
            {RIO_NEIGHBORHOODS.map((neighborhood) => (
              <Link
                key={neighborhood.id}
                to={`/o-que-fazer/${neighborhood.id}`}
                className="block p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <h3 className="text-lg font-serif font-medium text-foreground">
                  {neighborhood.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Atividades em breve
                </p>
              </Link>
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

export default WhatToDo;
