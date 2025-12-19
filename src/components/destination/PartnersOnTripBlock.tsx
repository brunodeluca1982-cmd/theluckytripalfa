import { Link } from "react-router-dom";
import { getPartnersForDestination } from "@/data/partners-data";

/**
 * PARTNERS ON TRIP BLOCK — INSIDE DESTINATION
 * 
 * PRIMARY PLACEMENT for partner discovery.
 * Shows partners who have curated this destination.
 * 
 * RULES:
 * - Displayed inside each destination after hero context
 * - Tapping a partner opens their roteiro for this destination
 * - No forced actions
 */

interface PartnersOnTripBlockProps {
  destinationId: string;
}

const PartnersOnTripBlock = ({ destinationId }: PartnersOnTripBlockProps) => {
  const partners = getPartnersForDestination(destinationId);

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <p className="text-xs tracking-widest text-white/60 uppercase mb-3 px-6">
        Partners on Trip
      </p>
      
      <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide">
        {partners.map((partner) => {
          // Find the roteiro for this destination
          const destRoteiro = partner.destinations.find(
            d => d.destinationId === destinationId
          );
          
          const linkPath = destRoteiro 
            ? `/partner/${partner.id}/roteiro/${destinationId}`
            : `/partner/${partner.id}`;

          return (
            <Link
              key={partner.id}
              to={linkPath}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                {partner.imageUrl ? (
                  <img 
                    src={partner.imageUrl}
                    alt={partner.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">
                    {partner.initials}
                  </span>
                )}
              </div>
              <span className="text-xs text-white/80 text-center max-w-[64px] truncate">
                {partner.name.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default PartnersOnTripBlock;
