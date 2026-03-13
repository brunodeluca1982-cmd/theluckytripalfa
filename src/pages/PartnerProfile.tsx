import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, ArrowRight, Music } from "lucide-react";
import { getPartner } from "@/data/partners-data";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useCityHero } from "@/contexts/CityHeroContext";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/* ── Destination card with Google Places photo ── */
const DestinationCard = ({
  dest,
  partnerId,
}: {
  dest: { destinationId: string; destinationName: string };
  partnerId: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  const query = buildPlaceQuery(dest.destinationName);
  const { photoUrl, isLoading } = usePlacePhoto(
    `partner-dest-${dest.destinationId}`,
    "attraction",
    query,
  );

  return (
    <Link
      to={`/partner/${partnerId}/roteiro/${dest.destinationId}`}
      className="block rounded-2xl overflow-hidden border border-white/15 bg-white/10 backdrop-blur-xl"
    >
      <div className="relative aspect-[16/9] bg-white/5">
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
          <p className="text-white font-serif text-lg font-medium drop-shadow-lg">
            {dest.destinationName}
          </p>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/50">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-sm">Ver roteiro completo</span>
        </div>
        <ArrowRight className="w-4 h-4 text-white/50" />
      </div>
    </Link>
  );
};

/* ── Main page ── */
const PartnerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const partner = getPartner(id || "");
  const { heroUrl } = useCityHero();
  const { openSheet } = useSpotifyPlayer();
  const [heroLoaded, setHeroLoaded] = useState(false);

  if (!partner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white/50">Parceiro não encontrado</p>
      </div>
    );
  }

  const partnerHero = partner.heroImageUrl || partner.imageUrl;

  return (
    <div className="relative min-h-screen pb-24">
      {/* Layer 1 — Rio de Janeiro city hero as full page background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroUrl})` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />

      {/* Header — glass controls */}
      <header className="sticky top-0 z-30 px-5 pt-12 pb-4 flex items-center justify-between">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <button
          onClick={openSheet}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white active:scale-95 transition-transform"
          aria-label="Música"
        >
          <Music className="w-5 h-5" />
        </button>
      </header>

      {/* Layer 2 — Partner hero portrait */}
      {partnerHero && (
        <div className="relative z-10 mx-5 mb-2 rounded-2xl overflow-hidden aspect-[4/5] max-h-[50vh]">
          {!heroLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
          )}
          <img
            src={partnerHero}
            alt={partner.name}
            className={`absolute inset-0 w-full h-[180%] object-cover object-top transition-opacity duration-500 ${heroLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setHeroLoaded(true)}
          />
          {/* Gradient for text legibility over the portrait */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Name + bio overlaid on the portrait */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h1 className="text-3xl font-serif font-medium text-white drop-shadow-lg leading-tight">
              {partner.name}
            </h1>
            {partner.bio && (
              <p className="text-sm text-white/60 mt-1.5 leading-relaxed max-w-[280px]">
                {partner.bio}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Fallback: no hero image — show avatar + text */}
      {!partnerHero && (
        <div className="relative z-10 flex flex-col items-center text-center px-5 mb-8">
          <div className="w-24 h-24 rounded-full border-2 border-white/20 overflow-hidden mb-4 shadow-xl bg-white/10 flex items-center justify-center">
            <span className="text-2xl font-medium text-white/60">
              {partner.initials}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-medium text-white drop-shadow-lg">
            {partner.name}
          </h1>
          {partner.bio && (
            <p className="text-sm text-white/50 mt-2 max-w-[280px] leading-relaxed">
              {partner.bio}
            </p>
          )}
        </div>
      )}

      {/* Destinations Section */}
      <section className="relative z-10 px-5">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">
          Roteiros curados
        </p>

        {partner.destinations.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
            <p className="text-white/40 text-sm">Em breve novos roteiros</p>
          </div>
        ) : (
          <div className="space-y-4">
            {partner.destinations.map((dest) => (
              <DestinationCard
                key={dest.destinationId}
                dest={dest}
                partnerId={partner.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PartnerProfile;
