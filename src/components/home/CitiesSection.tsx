import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { curatedDestinations } from "@/data/destinations-database";

/**
 * CONHEÇA AS CIDADES MAIS BUSCADAS
 * Horizontal scrollable city cards matching the design reference.
 */

const featuredCities = curatedDestinations.filter((d) =>
  ["rio-de-janeiro", "lisboa"].includes(d.id)
);

const CityImage = ({ src, alt }: { src: string; alt: string }) => {
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

const CitiesSection = () => {
  return (
    <section className="py-8 px-5">
      <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-5">
        Conheça as cidades mais buscadas
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
        {featuredCities.map((city) => {
          const isAvailable = city.available;
          const Wrapper = isAvailable ? Link : "div";
          const wrapperProps = isAvailable
            ? { to: `/destino/${city.id}/intro` }
            : {};

          return (
            <Wrapper
              key={city.id}
              {...(wrapperProps as any)}
              className="relative flex-shrink-0 w-[200px] aspect-[3/4] rounded-2xl overflow-hidden"
            >
              {city.imageUrl && <CityImage src={city.imageUrl} alt={city.name} />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-semibold text-sm leading-tight">
                  {city.name}
                </p>
                <p className="text-white/70 text-xs mt-0.5">{city.country}</p>
              </div>
              {!isAvailable && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 rounded-full">
                  <span className="text-[10px] text-white/80 font-medium">Em breve</span>
                </div>
              )}
            </Wrapper>
          );
        })}
      </div>

      <Link
        to="/destinos"
        className="inline-flex items-center gap-1 mt-4 px-4 py-2 rounded-full border border-border text-foreground text-xs font-medium hover:bg-accent transition-colors"
      >
        Veja todas
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
};

export default CitiesSection;
