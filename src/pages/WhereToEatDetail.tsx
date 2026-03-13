import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { getRestaurantImage } from "@/data/place-images";
import { useNeighborhoodHero } from "@/hooks/use-neighborhood-hero";
import { useExternalRestaurants, normalizeNeighborhood } from "@/hooks/use-external-restaurants";
import { useMemo } from "react";
import { GooglePlaceSearchSection } from "@/components/GooglePlaceSearchSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { PlaceResult } from "@/lib/search-places";

/**
 * ONDE COMER — NEIGHBORHOOD RESTAURANT LIST
 * Uses exclusively external Supabase data. No static fallback.
 */


const WhereToEatDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const [searchParams] = useSearchParams();
  const { data: externalRestaurants, isLoading } = useExternalRestaurants();

  const handleAddToRoteiro = async (place: PlaceResult) => {
    const { error } = await supabase.from("roteiro_itens").insert({
      roteiro_id: "rio-de-janeiro-draft",
      source: "google",
      ref_table: "places_cache",
      place_id: place.placeId,
      name: place.name,
      address: place.address,
      neighborhood: neighborhood || null,
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

  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodData?.name || neighborhood || "Bairro";
  const description = `Descubra onde comer em ${name}.`;
  const { heroUrl } = useNeighborhoodHero("rio-de-janeiro", neighborhood || "", "Rio de Janeiro", name, getRestaurantImage(neighborhood || ""));

  const from = searchParams.get("from");
  const backPath = from === "map" ? "/eat-map-view" : "/eat-map-view";

  // Group restaurants by categoria for this neighborhood
  const groupedRestaurants = useMemo(() => {
    if (!externalRestaurants) return {};
    const filtered = externalRestaurants.filter(
      (r) => normalizeNeighborhood(r.bairro) === neighborhood
    );
    const groups: Record<string, typeof filtered> = {};
    for (const r of filtered) {
      const cat = r.categoria || "Outros";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    }
    return groups;
  }, [externalRestaurants, neighborhood]);

  const hasRestaurants = Object.keys(groupedRestaurants).length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image — photo-first */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={heroUrl}
          alt={`Onde comer em ${name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center justify-between z-10">
          <Link
            to={backPath}
            className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <RoteiroAccessLink />
        </div>
      </div>

      <main className="pb-12">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            Onde comer em {name}
          </h1>
        </div>

        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mx-6 border-t border-border" />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
          </div>
        ) : hasRestaurants ? (
          Object.entries(groupedRestaurants).map(([cuisineType, restaurantList]) => (
            <section key={cuisineType} className="px-6 pt-8">
              <h2 className="text-xl font-serif font-medium text-foreground mb-6">
                {cuisineType}
              </h2>
              <div>
                {restaurantList.map((restaurant) => {
                  const slug = generateRestaurantSlug(restaurant.nome);
                  return (
                    <RestaurantCard
                      key={restaurant.id}
                      name={restaurant.nome}
                      description={restaurant.meu_olhar || ""}
                      slug={slug}
                      neighborhood={neighborhood}
                      imageUrl={getRestaurantImage(neighborhood || "")}
                    />
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="px-6 pt-8">
            <p className="text-sm text-muted-foreground">
              Recomendações de restaurantes em breve.
            </p>
          </div>
        )}

        {/* Google Places search section */}
        <div className="px-6 pt-8">
          <GooglePlaceSearchSection
            city="Rio de Janeiro"
            bairro={name}
            type="restaurant"
            title="Outras opções (Google)"
            placeholder="Buscar restaurantes no Google..."
            onAddToRoteiro={handleAddToRoteiro}
          />
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {name}
        </p>
      </footer>
    </div>
  );
};

export default WhereToEatDetail;
