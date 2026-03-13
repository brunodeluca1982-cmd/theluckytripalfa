import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, MapPin, UtensilsCrossed, Hotel, Compass, Star } from "lucide-react";
import { getPartner } from "@/data/partners-data";
import { getReferenceItinerary, ReferenceDay, ReferenceItem } from "@/data/reference-itineraries";
import CreatorItineraryPaywall, { isPremiumCreator } from "@/components/lucky-pro/CreatorItineraryPaywall";

const CATEGORY_META: Record<string, { icon: typeof MapPin; label: string }> = {
  hotel: { icon: Hotel, label: "Hotel" },
  food: { icon: UtensilsCrossed, label: "Gastronomia" },
  attraction: { icon: Star, label: "Atração" },
  experience: { icon: Compass, label: "Experiência" },
  custom: { icon: MapPin, label: "Lugar" },
};

const ItemCard = ({ item }: { item: ReferenceItem }) => {
  const meta = CATEGORY_META[item.category] || CATEGORY_META.custom;
  const Icon = meta.icon;

  return (
    <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border p-4">
      <div className="flex items-start gap-3">
        {item.time && (
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap">
            {item.time}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {meta.label}
            </span>
          </div>
          <h3 className="font-medium text-foreground text-[15px] leading-snug">
            {item.name}
          </h3>
          {item.editorial && (
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line">
              {item.editorial}
            </p>
          )}
          {item.duration && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70 mt-2">
              <Clock className="w-3 h-3" />
              {item.duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const DaySection = ({ day }: { day: ReferenceDay }) => {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-serif font-medium text-foreground">
          {day.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {day.subtitle}
        </p>
      </div>
      <div className="space-y-3">
        {day.items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

const PartnerRoteiro = () => {
  const { partnerId, destinationId } = useParams<{ partnerId: string; destinationId: string }>();
  const partner = getPartner(partnerId || "");

  const partnerDest = partner?.destinations.find((d) => d.destinationId === destinationId);
  const itinerary = partnerDest ? getReferenceItinerary(partnerDest.referenceItineraryId) : null;

  if (!partner || !itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Roteiro não encontrado</p>
      </div>
    );
  }

  const days = Object.values(itinerary.days);
  const totalItems = days.reduce((sum, day) => sum + day.items.length, 0);

  const content = (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-5 pt-12 pb-6">
        <Link
          to={`/partner/${partnerId}`}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground active:scale-95 transition-transform mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Partner badge */}
        <div className="flex items-center gap-3 mb-4">
          {partner.imageUrl && (
            <img
              src={partner.imageUrl}
              alt={partner.name}
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
          )}
          <div>
            <p className="text-xs text-muted-foreground">Roteiro por</p>
            <p className="text-sm font-medium text-foreground">{partner.name}</p>
          </div>
        </div>

        <h1 className="text-2xl font-serif font-medium text-foreground leading-tight mb-2">
          {itinerary.title}
        </h1>

        {itinerary.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {itinerary.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-card/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            {days.length} dias
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-card/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            {totalItems} atividades
          </span>
        </div>
      </header>

      {/* CTA */}
      <div className="px-5 pb-6">
        <Link
          to={`/planejar/${destinationId}?source=${itinerary.id}`}
          className="block w-full text-center py-3.5 rounded-full bg-foreground text-background font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          Planejar com este roteiro
        </Link>
      </div>

      {/* Days */}
      <div className="px-5">
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
