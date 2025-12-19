import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Calendar, Clock } from "lucide-react";
import { getPartner } from "@/data/partners-data";
import { getReferenceItinerary, ReferenceDay } from "@/data/reference-itineraries";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * PARTNER ROTEIRO PAGE
 * 
 * Full view of a partner's reference itinerary for a destination.
 * Users can explore the complete itinerary and choose to plan with it.
 * 
 * RULES:
 * - Read-only view
 * - Viewable without login
 * - Links to Meu Roteiro with this source pre-selected
 * - No forced actions, no pop-ups
 */

const PartnerRoteiro = () => {
  const { partnerId, destinationId } = useParams<{ partnerId: string; destinationId: string }>();
  const partner = getPartner(partnerId || "");
  
  const partnerDest = partner?.destinations.find(d => d.destinationId === destinationId);
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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-border">
        <Link 
          to={`/partner/${partnerId}`}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-2xl font-serif font-medium text-foreground mb-2">
          {itinerary.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          Por {partner.name}
        </p>
        {itinerary.description && (
          <p className="text-sm text-muted-foreground">
            {itinerary.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{days.length} dias</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{totalItems} atividades</span>
          </div>
        </div>
      </header>

      {/* CTA to Plan */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <Link
          to={`/planejar/${destinationId}?source=${itinerary.id}`}
          className="block w-full text-center py-3 px-6 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
        >
          Planejar com este roteiro
        </Link>
      </div>

      {/* Days List */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6 space-y-8">
          {days.map((day) => (
            <DaySection key={day.dayNumber} day={day} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface DaySectionProps {
  day: ReferenceDay;
}

const DaySection = ({ day }: DaySectionProps) => {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-medium text-foreground">
          {day.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {day.subtitle}
        </p>
      </div>

      <div className="space-y-3">
        {day.items.map((item) => (
          <div 
            key={item.id}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-start gap-3">
              {item.time && (
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                  {item.time}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">
                  {item.name}
                </h3>
                {item.editorial && (
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                    {item.editorial}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnerRoteiro;
