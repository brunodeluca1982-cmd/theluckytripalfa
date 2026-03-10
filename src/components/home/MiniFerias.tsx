import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";

const ideas = [
  {
    id: "mini-hotel-boutique",
    title: "Hotel boutique no Rio",
    tag: "Hospedagem",
    placeName: "Hotel boutique",
    neighborhood: "Ipanema",
    fallbackUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  },
  {
    id: "mini-passeio-barco",
    title: "Passeio de barco na Baía",
    tag: "Passeio",
    placeName: "Baía de Guanabara",
    neighborhood: "Centro",
    fallbackUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
  },
  {
    id: "mini-jantar-ipanema",
    title: "Jantar especial em Ipanema",
    tag: "Gastronomia",
    placeName: "Restaurante Ipanema",
    neighborhood: "Ipanema",
    fallbackUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  },
];

const MiniFerias = () => {
  return (
    <section className="py-8 px-5">
      <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-2">
        Ideias para mini férias
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        Experiências únicas para escapadas rápidas. Escolha e viaje.
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
  const placeQuery = buildPlaceQuery(idea.placeName, idea.neighborhood);
  const { photoUrl } = usePlacePhoto(idea.id, "attraction", placeQuery);
  // Priority: Google Places photo → fallback Unsplash
  const displayImage = photoUrl || idea.fallbackUrl;

  return (
    <button className="relative flex-shrink-0 w-[200px] aspect-[3/4] rounded-2xl overflow-hidden">
      {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
      <img
        src={displayImage}
        alt={idea.title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute top-2 left-2">
        <span className="px-2 py-0.5 rounded-full bg-background/80 text-foreground text-[10px] font-medium">
          {idea.tag}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-sm font-medium leading-tight">{idea.title}</p>
      </div>
    </button>
  );
};

export default MiniFerias;
