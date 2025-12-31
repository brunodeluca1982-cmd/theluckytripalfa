import { useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * DESTINATIONS PORTAL
 * 
 * Section showing selected destinations as image/video frames.
 * Functions as a curated travel news portal.
 * Emphasis on organization and clarity, not volume.
 */

interface Destination {
  id: string;
  name: string;
  country: string;
  available: boolean;
  path: string;
  imageUrl?: string;
}

// Structural placeholder data
const destinations: Destination[] = [
  {
    id: "rio-de-janeiro",
    name: "Rio de Janeiro",
    country: "Brasil",
    available: true,
    path: "/destino/rio-de-janeiro/intro",
    imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600",
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

const DestinationImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <>
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      <img 
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover destination-card-image transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};

const DestinationsPortal = () => {
  return (
    <section className="py-6 px-6">
      <p className="text-xs tracking-widest text-muted-foreground uppercase mb-4">
        Destinos
      </p>
      
      <div className="space-y-3">
        {destinations.map((destination) => (
          <Link
            key={destination.id}
            to={destination.available ? destination.path : "#"}
            className={`block aspect-[2/1] rounded-lg border overflow-hidden transition-colors relative ${
              destination.available 
                ? "border-border hover:border-foreground cursor-pointer" 
                : "border-border/50 opacity-50 cursor-not-allowed"
            }`}
            onClick={(e) => !destination.available && e.preventDefault()}
          >
            {/* Hero Image */}
            {destination.imageUrl ? (
              <DestinationImage src={destination.imageUrl} alt={destination.name} />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 destination-card-overlay pointer-events-none" />
            
            <div className="h-full flex flex-col justify-end p-4 relative z-10">
              <p className="text-xs text-white/80 uppercase tracking-wide drop-shadow-sm">
                {destination.country}
              </p>
              <h3 className="text-xl font-serif font-medium text-white drop-shadow-md">
                {destination.name}
              </h3>
              {!destination.available && (
                <span className="text-xs text-white/70 mt-1">
                  Em breve
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DestinationsPortal;
