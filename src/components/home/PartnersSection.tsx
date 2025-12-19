import { Link } from "react-router-dom";
import { getAllPartners } from "@/data/partners-data";

/**
 * PARTNERS ON TRIP — HOME SECTION
 * 
 * SECONDARY PLACEMENT
 * 
 * Horizontal row of circular profile avatars representing travel curators.
 * Tapping an avatar opens that partner's list of curated destinations.
 * 
 * RULES:
 * - From Home, tapping a Partner opens their profile (list of destinations)
 * - Selecting a destination then opens the partner's roteiro
 */

const PartnersSection = () => {
  const partners = getAllPartners();

  return (
    <section className="py-6">
      <p className="text-xs tracking-widest text-muted-foreground uppercase mb-4 px-6">
        Partners on Trip
      </p>
      
      <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide">
        {partners.map((partner) => (
          <Link
            key={partner.id}
            to={`/partner/${partner.id}`}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center hover:border-foreground transition-colors">
              {partner.imageUrl ? (
                <img 
                  src={partner.imageUrl}
                  alt={partner.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  {partner.initials}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground text-center max-w-[64px] truncate">
              {partner.name.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
