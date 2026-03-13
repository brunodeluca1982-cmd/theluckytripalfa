import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, MapPin, UtensilsCrossed, Hotel, Compass, Star, Music } from "lucide-react";
import { getPartner } from "@/data/partners-data";
import { getReferenceItinerary, ReferenceDay, ReferenceItem } from "@/data/reference-itineraries";
import CreatorItineraryPaywall, { isPremiumCreator } from "@/components/lucky-pro/CreatorItineraryPaywall";
import { useCityHero } from "@/contexts/CityHeroContext";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_META: Record<string, { icon: typeof MapPin; label: string }> = {
  hotel: { icon: Hotel, label: "Hotel" },
  food: { icon: UtensilsCrossed, label: "Gastronomia" },
  attraction: { icon: Star, label: "Atração" },
  experience: { icon: Compass, label: "Experiência" },
  custom: { icon: MapPin, label: "Lugar" },
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const ItemCardImage = ({ name, category }: { name: string; category: string }) => {
  const [loaded, setLoaded] = useState(false);
  const query = buildPlaceQuery(name, "Rio de Janeiro");
  const itemType = category === "hotel" ? "hotel" : category === "food" ? "restaurant" : "attraction";
  const { photoUrl, isLoading } = usePlacePhoto(slugify(name), itemType, query);

  if (!photoUrl && !isLoading) return null;

  return (
    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
      {(!loaded || isLoading) && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
      {photoUrl && (
        <img
          src={photoUrl}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

const ItemCard = ({ item }: { item: ReferenceItem }) => {
  const meta = CATEGORY_META[item.category] || CATEGORY_META.custom;
  const Icon = meta.icon;

  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4">
      <div className="flex items-start gap-3">
        <ItemCardImage name={item.name} category={item.category} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {item.time && (
              <span className="text-[10px] font-medium text-white/90 bg-white/15 px-2 py-0.5 rounded-full">
                {item.time}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] text-white/50 uppercase tracking-wider">
              <Icon className="w-3 h-3" />
              {meta.label}
            </span>
          </div>
          <h3 className="font-medium text-white text-[15px] leading-snug">
            {item.name}
          </h3>
          {item.editorial && (
            <p className="text-sm text-white/60 mt-1 leading-relaxed line-clamp-2">
              {item.editorial}
            </p>
          )}
          {item.duration && (
            <span className="inline-flex items-center gap-1 text-[11px] text-white/40 mt-1.5">
              <Clock className="w-3 h-3" />
              {item.duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const DaySection = ({ day }: { day: ReferenceDay }) => (
  <section className="mb-8">
    <div className="mb-4">
      <h2 className="text-lg font-serif font-medium text-white">{day.title}</h2>
      <p className="text-sm text-white/50">{day.subtitle}</p>
    </div>
    <div className="space-y-3">
      {day.items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  </section>
);

const PartnerRoteiro = () => {
  const { partnerId, destinationId } = useParams<{ partnerId: string; destinationId: string }>();
  const partner = getPartner(partnerId || "");
  const { heroUrl } = useCityHero();
  const { openSheet } = useSpotifyPlayer();

  const partnerDest = partner?.destinations.find((d) => d.destinationId === destinationId);
  const itinerary = partnerDest ? getReferenceItinerary(partnerDest.referenceItineraryId) : null;

  if (!partner || !itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white/50">Roteiro não encontrado</p>
      </div>
    );
  }

  const days = Object.values(itinerary.days);
  const totalItems = days.reduce((sum, day) => sum + day.items.length, 0);

  const content = (
    <div className="relative min-h-screen pb-24">
      {/* City hero background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroUrl})` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />

      {/* Header — glass controls */}
      <header className="sticky top-0 z-30 px-5 pt-12 pb-4 flex items-center justify-between">
        <Link
          to={`/partner/${partnerId}`}
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

      {/* Partner hero section */}
      <div className="relative z-10 px-5 pb-6">
        {/* Partner badge */}
        <div className="flex items-center gap-3 mb-5">
          {partner.imageUrl && (
            <img
              src={partner.imageUrl}
              alt={partner.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg"
            />
          )}
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Roteiro por</p>
            <p className="text-sm font-medium text-white">{partner.name}</p>
          </div>
        </div>

        <h1 className="text-3xl font-serif font-medium text-white leading-tight mb-2">
          {itinerary.title}
        </h1>

        {itinerary.description && (
          <p className="text-sm text-white/60 leading-relaxed mb-5">
            {itinerary.description}
          </p>
        )}

        {/* Stats pills */}
        <div className="flex gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs text-white/70 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            {days.length} dias
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-white/70 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            {totalItems} atividades
          </span>
        </div>

        {/* CTA */}
        <Link
          to={`/planejar/${destinationId}?source=${itinerary.id}`}
          className="block w-full text-center py-3.5 rounded-full bg-white text-black font-semibold text-sm active:scale-[0.98] transition-transform shadow-lg"
        >
          Planejar com este roteiro
        </Link>
      </div>

      {/* Days content */}
      <div className="relative z-10 px-5">
        {days.map((day) => (
          <DaySection key={day.dayNumber} day={day} />
        ))}
      </div>
    </div>
  );

  if (isPremiumCreator(partnerId || "")) {
    return (
      <CreatorItineraryPaywall
        partnerId={partnerId || ""}
        partnerName={partner.name}
        partnerImageUrl={partner.imageUrl}
        itinerary={itinerary}
      >
        {content}
      </CreatorItineraryPaywall>
    );
  }

  return content;
};

export default PartnerRoteiro;
