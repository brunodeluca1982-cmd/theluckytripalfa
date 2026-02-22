import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * DESTINOS PAGE
 * 
 * List of all available destinations.
 * Accessible from bottom navigation.
 */

interface Destination {
  id: string;
  name: string;
  country: string;
  available: boolean;
  path: string;
  imageUrl: string;
}

const destinations: Destination[] = [
  {
    id: "rio-de-janeiro",
    name: "Rio de Janeiro",
    country: "Brasil",
    available: true,
    path: "/destino/rio-de-janeiro/intro",
    imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800",
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    country: "Brasil",
    available: false,
    path: "/destino/sao-paulo",
    imageUrl: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=600",
  },
  {
    id: "lisboa",
    name: "Lisboa",
    country: "Portugal",
    available: false,
    path: "/destino/lisboa",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
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

const Destinos = () => {
  const [featured, ...rest] = destinations;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 pt-12 pb-6">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-serif font-medium text-foreground">
          Destinos
        </h1>
      </header>

      {/* Destinations Grid */}
      <main className="px-6">
      {/* Featured Card */}
        <Link
          to={featured.available ? featured.path : "#"}
          className={`block relative overflow-hidden rounded-[22px] h-[210px] md:h-[240px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ${
            !featured.available ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={(e) => !featured.available && e.preventDefault()}
        >
          <CardImage src={featured.imageUrl} alt={featured.name} />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.35) 100%)" }}
          />
          <div className="absolute bottom-4 left-4 z-10">
            <h2 className="text-xl font-serif font-bold text-white leading-tight">
              {featured.name}
            </h2>
            <p className="text-xs text-white/75 mt-0.5">
              Cidade · {featured.country}
            </p>
          </div>
        </Link>

        {/* Grid Cards */}
        <div className="grid grid-cols-2 mt-3.5" style={{ gap: 12 }}>
          {rest.map((dest) => (
            <Link
              key={dest.id}
              to={dest.available ? dest.path : "#"}
              className={`block relative overflow-hidden rounded-[22px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] ${
                !dest.available ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ aspectRatio: "4/5" }}
              onClick={(e) => !dest.available && e.preventDefault()}
            >
              <CardImage src={dest.imageUrl} alt={dest.name} />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.35) 100%)" }}
              />
              <div className="absolute bottom-3.5 left-3.5 z-10">
                <h2 className="text-base font-serif font-bold text-white leading-tight">
                  {dest.name}
                </h2>
                <p className="text-[11px] text-white/75 mt-0.5">
                  Cidade · {dest.country}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Destinos;
