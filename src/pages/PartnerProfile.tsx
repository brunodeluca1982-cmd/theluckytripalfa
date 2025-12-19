import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin } from "lucide-react";
import { getPartner } from "@/data/partners-data";

/**
 * PARTNER PROFILE PAGE
 * 
 * Shows a partner's curated destinations.
 * Tapping a destination opens their reference itinerary.
 * 
 * RULES:
 * - Viewable without login
 * - No forced actions
 * - Links to partner's roteiro for each destination
 */

const PartnerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const partner = getPartner(id || "");

  if (!partner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Parceiro não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Partner Avatar */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center mb-4">
            {partner.imageUrl ? (
              <img 
                src={partner.imageUrl} 
                alt={partner.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-medium text-muted-foreground">
                {partner.initials}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-serif font-medium text-foreground">
            {partner.name}
          </h1>
          {partner.bio && (
            <p className="text-sm text-muted-foreground mt-1">
              {partner.bio}
            </p>
          )}
        </div>
      </header>

      {/* Destinations Section */}
      <section className="px-6">
        <p className="text-xs tracking-widest text-muted-foreground uppercase mb-4">
          Roteiros curados
        </p>

        {partner.destinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Em breve novos roteiros
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {partner.destinations.map((dest) => (
              <Link
                key={dest.destinationId}
                to={`/partner/${partner.id}/roteiro/${dest.destinationId}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-foreground/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {dest.destinationName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ver roteiro completo
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PartnerProfile;
