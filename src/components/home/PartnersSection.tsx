import { Link } from "react-router-dom";
import { getAllPartners } from "@/data/partners-data";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 PARTNERS ON TRIP — STRUCTURAL LOCK (HOME SCREEN ONLY)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SCOPE
 * This is the ONLY location where Partners on Trip appear in the app.
 * 
 * PLACEMENT RULES
 * - Partners MUST appear exclusively on the Home screen
 * - Do NOT display partners inside destinations, guides, itineraries, or AI
 * - Do NOT reference partners elsewhere in the app
 * 
 * DISPLAY FORMAT
 * - Horizontal list of circular avatars
 * - Each avatar uses the real photo of the person
 * - Person's name appears below the avatar
 * - No additional text, description, or call to action
 * 
 * FUNCTION
 * - Discovery and authority layer only
 * - Partners act as trusted references, not navigation shortcuts
 * 
 * COST OPTIMIZATION
 * - Do not generate new content
 * - Do not duplicate partner data across screens
 * - Reuse the same partner entity from partners-data.ts
 * 
 * LOCK
 * This behavior is final until explicitly changed.
 * ═══════════════════════════════════════════════════════════════════════════
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
            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center liquid-bubble">
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
