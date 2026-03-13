import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, ArrowRight } from "lucide-react";
import { getPartner } from "@/data/partners-data";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DestinationCard = ({ dest, partnerId }: { dest: { destinationId: string; destinationName: string }; partnerId: string }) => {
  const [loaded, setLoaded] = useState(false);
  const query = buildPlaceQuery(dest.destinationName);
  const { photoUrl, isLoading } = usePlacePhoto(`partner-dest-${dest.destinationId}`, "attraction", query);

  return (
    <Link
      to={`/partner/${partnerId}/roteiro/${dest.destinationId}`}
      className="block rounded-2xl overflow-hidden border border-border bg-card"
    >
      <div className="relative aspect-[16/9] bg-muted">
        {(!loaded || isLoading) && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}
        {photoUrl && (
          <img
            src={photoUrl}
            alt={dest.destinationName}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-serif text-lg font-medium">{dest.destinationName}</p>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-sm">Ver roteiro completo</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </Link>
  );
};

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
      <header className="px-5 pt-12 pb-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground active:scale-95 transition-transform mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Partner Avatar */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full border-2 border-border overflow-hidden mb-4 shadow-lg">
            {partner.imageUrl ? (
              <img
                src={partner.imageUrl}
                alt={partner.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-medium text-muted-foreground">
                  {partner.initials}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-serif font-medium text-foreground">
            {partner.name}
          </h1>
          {partner.bio && (
            <p className="text-sm text-muted-foreground mt-2 max-w-[280px] leading-relaxed">
              {partner.bio}
            </p>
          )}
        </div>
      </header>

      {/* Destinations Section */}
      <section className="px-5">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-4">
          Roteiros curados
        </p>

        {partner.destinations.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-border bg-card/50">
            <p className="text-muted-foreground text-sm">
              Em breve novos roteiros
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {partner.destinations.map((dest) => (
              <DestinationCard key={dest.destinationId} dest={dest} partnerId={partner.id} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PartnerProfile;
