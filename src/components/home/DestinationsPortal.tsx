import { Link } from "react-router-dom";

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
}

// Structural placeholder data
const destinations: Destination[] = [
  {
    id: "rio-de-janeiro",
    name: "Rio de Janeiro",
    country: "Brasil",
    available: true,
    path: "/destino/rio-de-janeiro/intro",
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    country: "Brasil",
    available: false,
    path: "/destino/sao-paulo",
  },
  {
    id: "lisboa",
    name: "Lisboa",
    country: "Portugal",
    available: false,
    path: "/destino/lisboa",
  },
];

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
            className={`block aspect-[2/1] bg-muted rounded-lg border overflow-hidden transition-colors ${
              destination.available 
                ? "border-border hover:border-foreground cursor-pointer" 
                : "border-border/50 opacity-50 cursor-not-allowed"
            }`}
            onClick={(e) => !destination.available && e.preventDefault()}
          >
            <div className="h-full flex flex-col justify-end p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {destination.country}
              </p>
              <h3 className="text-xl font-serif font-medium text-foreground">
                {destination.name}
              </h3>
              {!destination.available && (
                <span className="text-xs text-muted-foreground mt-1">
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
