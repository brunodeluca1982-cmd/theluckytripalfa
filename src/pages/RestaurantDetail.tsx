import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Bookmark, MapPin, Instagram } from "lucide-react";
import { useItemSave } from "@/hooks/use-item-save";
import { getRestaurantImage } from "@/data/place-images";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import {
  useExternalRestaurants,
  normalizeNeighborhood,
  generateRestaurantSlug,
} from "@/hooks/use-external-restaurants";
import { useMemo, useState, useEffect } from "react";

function isRestaurantSaved(id: string) {
  const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
  return draft.some(
    (item: { id: string; type: string }) => item.id === id && item.type === "restaurant"
  );
}

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();
  const { data: externalRestaurants, isLoading } = useExternalRestaurants();
  const [isSaved, setIsSaved] = useState(false);

  const restaurant = useMemo(() => {
    if (!externalRestaurants || !id) return null;
    return (
      externalRestaurants.find((r) => generateRestaurantSlug(r.nome) === id) || null
    );
  }, [externalRestaurants, id]);

  useEffect(() => {
    if (id) setIsSaved(isRestaurantSaved(id));
  }, [id]);

  const from = searchParams.get("from");
  const backPath = from ? `/onde-comer/${from}` : "/eat-map-view";

  const neighborhoodSlug = restaurant ? normalizeNeighborhood(restaurant.bairro) : "";
  const placeQuery = restaurant
    ? buildPlaceQuery(restaurant.nome, restaurant.bairro)
    : "";
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(
    id || "",
    "restaurant",
    placeQuery,
    !!restaurant
  );
  const heroImage =
    photoUrl || (restaurant ? getRestaurantImage(neighborhoodSlug) : "");

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
    setIsSaved(true);
  };

  const cleanUrl = (url: string) =>
    url?.startsWith("http") ? url : `https://${url}`;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Image */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        {photoLoading && !heroImage ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
          </div>
        ) : (
          <img
            src={heroImage}
            alt={restaurant.nome}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center justify-center z-10">
          <Link
            to={backPath}
            className="absolute left-4 inline-flex items-center gap-1.5 text-sm text-white/90 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium"
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Salvo" : "Salvar"}
          </button>
        </div>
      </div>

      {/* Content — dark */}
      <div className="relative bg-black/90 backdrop-blur-sm px-5 pt-7 pb-24">

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {restaurant.categoria && (
            <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
              {restaurant.categoria}
            </span>
          )}
          <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
            {restaurant.bairro}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-serif font-semibold text-white leading-tight mb-5">
          {restaurant.nome}
        </h1>

        {/* Especialidade */}
        {restaurant.especialidade && (
          <p className="text-sm italic text-white/60 mb-5">{restaurant.especialidade}</p>
        )}

        {/* Description */}
        {restaurant.meu_olhar && (
          <div className="space-y-3 mb-6">
            {restaurant.meu_olhar.split("\n").map((paragraph, index) => (
              <p key={index} className="text-base text-white/75 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}


        {/* Secondary links */}
        <div className="space-y-3">
          {restaurant.google_maps_url && (
            <a
              href={cleanUrl(restaurant.google_maps_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Ver no Google Maps
            </a>
          )}
          {restaurant.instagram && (
            <a
              href={`https://instagram.com/${restaurant.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              {restaurant.instagram}
            </a>
          )}
        </div>

        <p className="text-xs text-white/20 mt-10">
          The Lucky Trip — {restaurant.bairro}
        </p>
      </div>
    </div>
  );
};

export default RestaurantDetail;
