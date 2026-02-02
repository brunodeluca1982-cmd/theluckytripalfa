import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { RIO_NEIGHBORHOODS } from "@/data/rio-neighborhoods";
import { whatToDoIntro, cityLevelActivities, activitiesByNeighborhood } from "@/data/what-to-do-data";
import rioHero from "@/assets/highlights/rio-de-janeiro-hero.jpg";

/**
 * O QUE FAZER — RIO DE JANEIRO
 * 
 * PUBLIC LAYER - Accessible to all users
 * 
 * Rules:
 * - Organized strictly by neighborhood
 * - Each item belongs to ONE neighborhood only
 * - Uses consistent Activity Detail template
 * - Only BASE MAP neighborhoods appear here
 */

const WhatToDo = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/destino/rio-de-janeiro"
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

        {/* Hero Image - Full Width */}
        <div className="w-full aspect-[16/9] bg-muted overflow-hidden">
          <img 
            src={rioHero} 
            alt="O Que Fazer no Rio de Janeiro"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description */}
        <div className="px-6 pt-8 pb-10">
          {whatToDoIntro.split('\n').map((paragraph, index) => (
            <p key={index} className="text-base text-muted-foreground leading-relaxed mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* City-Level Activities */}
        <section className="px-6 pt-8">
          <h2 className="text-xs tracking-widest text-muted-foreground uppercase mb-4">
            Experiências Icônicas
          </h2>
          <div className="space-y-4">
            {cityLevelActivities.map((activity) => (
              <Link
                key={activity.id}
                to={`/atividade/${activity.id}?from=city`}
                className="block p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <h3 className="text-lg font-serif font-medium text-foreground mb-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </Link>
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
            {RIO_NEIGHBORHOODS.map((neighborhood) => {
              const data = activitiesByNeighborhood[neighborhood.id];
              const activityCount = data?.activities?.length || 0;
              
              return (
                <Link
                  key={neighborhood.id}
                  to={`/o-que-fazer/${neighborhood.id}`}
                  className="block p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <h3 className="text-lg font-serif font-medium text-foreground">
                    {neighborhood.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activityCount > 0 
                      ? `${activityCount} ${activityCount === 1 ? 'atividade' : 'atividades'}`
                      : 'Atividades em breve'
                    }
                  </p>
                </Link>
              );
            })}
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
