import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { luckyListIntro, getLuckyListByNeighborhood } from "@/data/lucky-list-data";
import luckyListHero from "@/assets/highlights/lucky-list-hero.jpg";
import { useEventMode } from "@/contexts/EventModeContext";
import { EventBanner } from "@/components/EventBanner";
import { GooglePlaceSearchSection } from "@/components/GooglePlaceSearchSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { PlaceResult } from "@/lib/search-places";

const LuckyList = () => {
  const groupedItems = getLuckyListByNeighborhood();
  const neighborhoods = Object.keys(groupedItems);
  const { evento } = useEventMode();

  const handleAddToRoteiro = async (place: PlaceResult) => {
    const { error } = await supabase.from("roteiro_itens").insert({
      roteiro_id: "rio-de-janeiro-draft",
      source: "google",
      ref_table: "places_cache",
      place_id: place.placeId,
      name: place.name,
      address: place.address,
      city: "Rio de Janeiro",
      lat: place.lat,
      lng: place.lng,
      day_index: 1,
      order_in_day: 0,
    });
    if (error) {
      toast({ title: "Erro ao adicionar", description: "Tente novamente.", variant: "destructive" });
    } else {
      toast({ title: "Adicionado ao roteiro!", description: place.name });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/destino/rio-de-janeiro"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
      </header>

      <main className="pb-12">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            The Lucky List
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Rio de Janeiro
          </p>
        </div>

        <div className="w-full aspect-[16/9] bg-muted overflow-hidden">
          <img
            src={luckyListHero}
            alt="Lucky List - Rio de Janeiro"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-6 pt-8 pb-10">
          {luckyListIntro.split('\n').map((paragraph, index) => (
            <p key={index} className="text-base text-muted-foreground leading-relaxed mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mx-6 border-t border-border" />

        {/* Event sponsor placement */}
        <EventBanner placementKey="lucky_list_top" className="mx-6 mt-6" />

        {/* Lucky List Items by Neighborhood */}
        {neighborhoods.map((neighborhoodName) => (
          <section key={neighborhoodName} className="px-6 pt-8">
            <div className="mb-4">
              <h2 className="text-xs tracking-widest text-muted-foreground uppercase mb-1">
                {neighborhoodName}
              </h2>
              <p className="text-xs text-muted-foreground/60 italic">
                Lucky List only — premium layer
              </p>
            </div>

            <div className="space-y-4">
              {groupedItems[neighborhoodName].map((item) => (
                <Link
                  key={item.id}
                  to={`/lucky-list/${item.id}`}
                  className="block p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-serif font-medium text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.teaser}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-8 border-t border-border" />
          </section>
        ))}

        {/* Google Places search */}
        <div className="px-6 pt-8">
          <GooglePlaceSearchSection
            city="Rio de Janeiro"
            title="Adicionar item do Google"
            placeholder="Buscar lugares no Google..."
            onAddToRoteiro={handleAddToRoteiro}
          />
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default LuckyList;
