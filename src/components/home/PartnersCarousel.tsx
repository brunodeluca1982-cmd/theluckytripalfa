import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllPartners } from "@/data/partners-data";
import { getReferenceItinerary } from "@/data/reference-itineraries";

/**
 * VIAJE COMO ELES
 * Horizontal scrollable partner cards matching the design reference.
 */

const PartnersCarousel = () => {
  const partners = getAllPartners();

  return (
    <section className="py-8 px-5">
      {/* Separator */}
      <div className="border-t border-border mb-8" />

      <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-2">
        Viaje como eles
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        Siga os passos de quem você admira. Tenha acesso aos roteiros
        detalhados, segredos e dicas pessoais.
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    </section>
  );
};

interface PartnerCardProps {
  partner: ReturnType<typeof getAllPartners>[number];
}

const PartnerCard = ({ partner }: PartnerCardProps) => {
  const [loaded, setLoaded] = useState(false);

  const placeCount = useMemo(() => {
    let total = 0;
    for (const dest of partner.destinations) {
      const itinerary = getReferenceItinerary(dest.referenceItineraryId);
      if (itinerary) {
        total += Object.values(itinerary.days).reduce((sum, day) => sum + day.items.length, 0);
      }
    }
    return total;
  }, [partner.destinations]);

  const firstName = partner.name.split(" ")[0];
  const hasPlaces = placeCount > 0;

  return (
    <Link
      to={`/partner/${partner.id}`}
      className="flex-shrink-0 w-[170px] rounded-2xl overflow-hidden border border-border bg-card"
    >
      <div className="relative aspect-[4/5]">
        {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
        {partner.imageUrl && (
          <img
            src={partner.imageUrl}
            alt={partner.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        )}
        {/* Badge */}
        {hasPlaces && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-white/80" />
            <span className="text-[11px] text-white font-medium">
              {placeCount} lugares
            </span>
          </div>
        )}
      </div>
      <div className="px-3 py-2.5">
        <p className="text-foreground text-sm font-medium truncate">
          {partner.name}
        </p>
        {hasPlaces && (
          <p className="text-muted-foreground text-[11px] mt-0.5 truncate">
            {placeCount} lugares favoritos
          </p>
        )}
      </div>
    </Link>
  );
};

export default PartnersCarousel;
