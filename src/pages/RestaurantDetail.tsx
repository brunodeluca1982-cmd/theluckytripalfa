import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Plus, ExternalLink, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemSave } from "@/hooks/use-item-save";
import { getRestaurantImage } from "@/data/place-images";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useExternalRestaurants, normalizeNeighborhood, generateRestaurantSlug } from "@/hooks/use-external-restaurants";
import { useMemo } from "react";

/**
 * RESTAURANT DETAIL PAGE
 * Uses exclusively external Supabase data. No static fallback.
 */

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();
  const { data: externalRestaurants, isLoading } = useExternalRestaurants();

  const restaurant = useMemo(() => {
    if (!externalRestaurants || !id) return null;
    return externalRestaurants.find((r) => generateRestaurantSlug(r.nome) === id) || null;
  }, [externalRestaurants, id]);

  const from = searchParams.get("from");
  const backPath = from ? `/onde-comer/${from}` : "/eat-map-view";

  const neighborhoodSlug = restaurant ? normalizeNeighborhood(restaurant.bairro) : "";
  const placeQuery = restaurant ? buildPlaceQuery(restaurant.nome, restaurant.bairro) : "";
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(
    id || "", "restaurant", placeQuery, !!restaurant
  );
  const heroImage = photoUrl || (restaurant ? getRestaurantImage(neighborhoodSlug) : "");

  if (isLoading) {
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
          <Link to="/" className="text-foreground underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveItem(id || "", "restaurant", restaurant.nome, false);
  };

  const cleanUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image — full top */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        {photoLoading && !heroImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
          </div>
        ) : (
          <img
            src={heroImage}
            alt={restaurant.nome}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center justify-between z-10">
          <Link
            to={backPath}
            className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <button
            onClick={handleSave}
            className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="pb-12">

        {/* Restaurant Info */}
        <div className="px-6 pt-8">
          {/* Category & Neighborhood */}
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
            {restaurant.categoria} • {restaurant.bairro}
          </p>

          {/* Title */}
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight mb-4">
            {restaurant.nome}
          </h1>

          {/* Especialidade */}
          {restaurant.especialidade && (
            <p className="text-sm text-muted-foreground italic mb-4">
              {restaurant.especialidade}
            </p>
          )}

          {/* Description (meu_olhar) */}
          {restaurant.meu_olhar && (
            <div className="space-y-2 mb-6">
              {restaurant.meu_olhar.split('\n').map((paragraph, index) => (
                <p key={index} className="text-base text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Perfil público */}
          {restaurant.perfil_publico && (
            <p className="text-sm text-muted-foreground mb-6">
              Perfil: {restaurant.perfil_publico}
            </p>
          )}

          {/* Links */}
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            {restaurant.google_maps_url && (
              <p>
                <a
                  href={cleanUrl(restaurant.google_maps_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver no Google Maps
                </a>
              </p>
            )}
            {restaurant.instagram && (
              <p>
                <a
                  href={`https://instagram.com/${restaurant.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  {restaurant.instagram}
                </a>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {restaurant.bairro}
        </p>
      </footer>
    </div>
  );
};

export default RestaurantDetail;
