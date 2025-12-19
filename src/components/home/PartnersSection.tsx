import { Link } from "react-router-dom";

/**
 * PARTNERS ON TRIP
 * 
 * Horizontal row of circular profile avatars representing travel curators.
 * Tapping an avatar opens that partner's destinations or content.
 */

interface Partner {
  id: string;
  name: string;
  initials: string;
}

// Structural placeholder data - content to be provided externally
const partners: Partner[] = [
  { id: "bruno-de-luca", name: "Bruno De Luca", initials: "BD" },
  { id: "carolina-dieckmann", name: "Carolina Dieckmann", initials: "CD" },
  { id: "celina-locks", name: "Celina Locks", initials: "CL" },
  { id: "di-ferrero", name: "Di Ferrero", initials: "DF" },
  { id: "isabeli-fontana", name: "Isabeli Fontana", initials: "IF" },
];

const PartnersSection = () => {
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
              <span className="text-sm font-medium text-muted-foreground">
                {partner.initials}
              </span>
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
