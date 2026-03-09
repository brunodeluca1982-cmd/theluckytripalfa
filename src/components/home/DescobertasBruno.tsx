import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import brunImg from "@/assets/partners/bruno-de-luca.jpeg";

const discoveries = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80",
    title: "Speakeasy do Leblon",
    tag: "Noite",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80",
    title: "Pôr do sol no Arpoador",
    tag: "Experiência",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80",
    title: "Jazz escondido em Ipanema",
    tag: "Música",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    title: "Restaurante secreto em Santa Teresa",
    tag: "Gastronomia",
  },
];

const CardImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};

const DescobertasBruno = () => {
  return (
    <section className="py-8 px-5">
      <div className="flex items-center gap-3 mb-1">
        <img
          src={brunImg}
          alt="Bruno de Luca"
          className="w-8 h-8 rounded-full object-cover border border-border"
        />
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">
          Descobertas do Bruno
        </h2>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5 ml-11">
        Os achados favoritos do nosso curador local no Rio.
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
        {discoveries.map((item) => (
          <button
            key={item.id}
            className="relative flex-shrink-0 w-[160px] aspect-[3/4] rounded-2xl overflow-hidden group"
          >
            <CardImage src={item.imageUrl} alt={item.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 rounded-full bg-background/80 text-foreground text-[10px] font-medium">
                {item.tag}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-xs font-medium leading-tight">
                {item.title}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default DescobertasBruno;
