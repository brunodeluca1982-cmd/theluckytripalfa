import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ideas = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=400&q=80",
    title: "3 dias em Fernando de Noronha",
    days: "3 dias",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1588001832198-c15cff59b078?w=400&q=80",
    title: "Weekend em Florianópolis",
    days: "2 dias",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1580610447943-1bfbef5efe07?w=400&q=80",
    title: "4 dias em Salvador",
    days: "4 dias",
  },
];

const MiniFerias = () => {
  return (
    <section className="py-8 px-5">
      <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-2">
        Ideias para mini férias
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        Roteiros prontos para escapadas rápidas. Escolha, personalize e viaje.
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </section>
  );
};

const IdeaCard = ({ idea }: { idea: (typeof ideas)[number] }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <button className="relative flex-shrink-0 w-[220px] aspect-[16/10] rounded-2xl overflow-hidden">
      {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
      <img
        src={idea.imageUrl}
        alt={idea.title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute top-2 right-2">
        <span className="px-2 py-0.5 rounded-full bg-background/80 text-foreground text-[10px] font-medium">
          {idea.days}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-sm font-medium leading-tight">{idea.title}</p>
      </div>
    </button>
  );
};

export default MiniFerias;
