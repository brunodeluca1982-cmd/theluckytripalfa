import { Link, useParams, useSearchParams } from "react-router-dom";
import { MapPin, Instagram } from "lucide-react";
import { useItemSave } from "@/hooks/use-item-save";
import { getRestaurantImage } from "@/data/place-images";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import {
  useExternalRestaurants,
  normalizeNeighborhood,
  generateRestaurantSlug,
} from "@/hooks/use-external-restaurants";
import { useMemo, useState, useEffect } from "react";
import DetailHeroLayout from "@/components/detail/DetailHeroLayout";

function isRestaurantSaved(id: string) {
  const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
  return draft.some((item: { id: string; type: string }) => item.id === id && item.type === "restaurant");
}

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();
  const { data: externalRestaurants, isLoading } = useExternalRestaurants();
  const [isSaved, setIsSaved] = useState(false);

  const restaurant = useMemo(() => {
    if (!externalRestaurants || !id) return null;
    // Support lookup by numeric ID, slug, or name slug
    return externalRestaurants.find((r) => String(r.id) === id)
      || externalRestaurants.find((r) => generateRestaurantSlug(r.nome) === id)
      || null;
  }, [externalRestaurants, id]);

  useEffect(() => {
    if (restaurant?.id) setIsSaved(isRestaurantSaved(String(restaurant.id)));
  }, [restaurant?.id]);

  const from = searchParams.get("from");
  const backPath = from ? `/onde-comer/${from}` : "/eat-map-view";

  const neighborhoodSlug = restaurant ? normalizeNeighborhood(restaurant.bairro) : "";
  const placeQuery = restaurant ? buildPlaceQuery(restaurant.nome, restaurant.bairro) : "";
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(id || "", "restaurant", placeQuery, !!restaurant);
  const heroImage = photoUrl || (restaurant ? getRestaurantImage(neighborhoodSlug) : "");

  if (isLoading || (photoLoading && !heroImage)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Restaurante não encontrado</p>
          <Link to="/" className="text-foreground underline">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveItem(String(restaurant.id), "restaurant", restaurant.nome, false, { neighborhood: restaurant.bairro || undefined });
    setIsSaved(true);
  };

  const cleanUrl = (url: string) => (url?.startsWith("http") ? url : `https://${url}`);
  const pills = [restaurant.categoria, restaurant.bairro].filter(Boolean) as string[];

  return (
    <DetailHeroLayout
      backPath={backPath}
      title={restaurant.nome}
      subtitle={restaurant.especialidade || null}
      pills={pills}
      heroImageUrl={heroImage}
      isSaved={isSaved}
      onSave={handleSave}
      footer={`The Lucky Trip — ${restaurant.bairro}`}
    >
      {/* Description */}
      {restaurant.meu_olhar && (
        <div className="space-y-3 mb-6">
          {restaurant.meu_olhar.split("\n").map((paragraph, index) => (
            <p key={index} className="text-base text-white/75 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      )}

      {/* Secondary links */}
      <div className="space-y-3">
        {restaurant.google_maps_url && (
          <a href={cleanUrl(restaurant.google_maps_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
            <MapPin className="w-4 h-4" />
            Ver no Google Maps
          </a>
        )}
        {restaurant.instagram && (
          <a href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
            <Instagram className="w-4 h-4" />
            {restaurant.instagram}
          </a>
        )}
      </div>
    </DetailHeroLayout>
  );
};

export default RestaurantDetail;
