import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemSave } from "@/hooks/use-item-save";
import { getHotelImage } from "@/data/place-images";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useExternalHotels } from "@/hooks/use-external-hotels";
import { useMemo } from "react";

/**
 * HOTEL DETAIL PAGE
 *
 * Renders hotel details exclusively from the external Supabase database.
 * No static/fallback data. No dollar-sign price indicators.
 */

// Helper to generate slug from hotel name
export const generateHotelSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();
  const { data: externalHotels, isLoading } = useExternalHotels();

  const hotel = useMemo(() => {
    if (!externalHotels || !id) return null;
    return externalHotels.find((h) => generateHotelSlug(h.nome) === id) || null;
  }, [externalHotels, id]);

  const from = searchParams.get("from");
  const getBackPath = () => {
    if (from && from !== "list" && from !== "map") return `/onde-ficar/${from}`;
    return "/onde-ficar-rio";
  };
  const backPath = getBackPath();

  const neighborhoodName = hotel?.bairro || "";
  const placeQuery = hotel ? buildPlaceQuery(hotel.nome, neighborhoodName) : "";
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(
    id || "",
    "hotel",
    placeQuery,
    !!hotel
  );

  const normalizeNeighborhood = (bairro: string) =>
    bairro
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  const heroImage =
    photoUrl || (hotel ? getHotelImage(normalizeNeighborhood(hotel.bairro)) : "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Hotel não encontrado</p>
          <Link to="/onde-ficar-rio" className="text-foreground underline">
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveItem(id || "", "hotel", hotel.nome, false);
  };

  const cleanUrl = (raw: string | null | undefined): string | null => {
    if (!raw) return null;
    const match = raw.match(/https?:\/\/[^\s)]+/);
    return match ? match[0] : null;
  };

  const mapsUrl = cleanUrl(hotel.google_maps_url);
  const siteUrl = cleanUrl(hotel.site_oficial);

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
            alt={hotel.nome}
            className="w-full h-full object-cover"
          />
        )}
        {/* Gradient for button legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        {/* Overlay nav */}
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

        {/* Hotel Info */}
        <div className="px-6 pt-8">
          {/* Category */}
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">
            {hotel.categoria?.trim() || "Hotel"} • {hotel.bairro}
          </p>

          {/* Title */}
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight mb-4">
            {hotel.nome}
          </h1>

          {/* Price — only real value, no symbols */}
          {hotel.preco_medio_diaria && (
            <p className="text-sm text-muted-foreground mb-4">
              Diária média: R$ {hotel.preco_medio_diaria}
            </p>
          )}

          {/* Description (meu_olhar) */}
          {hotel.meu_olhar && (
            <div className="space-y-2 mb-6">
              {hotel.meu_olhar.split("\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Atmosfera */}
          {hotel.atmosfera && (
            <p className="text-sm italic text-muted-foreground/80 mb-6">
              {hotel.atmosfera}
            </p>
          )}

          {/* Metadata */}
          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            {mapsUrl && (
              <p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline"
                >
                  Ver no Google Maps
                </a>
              </p>
            )}
            {hotel.instagram && (
              <p>
                <a
                  href={`https://instagram.com/${hotel.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {hotel.instagram}
                </a>
              </p>
            )}
            {siteUrl && (
              <p>
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline"
                >
                  Site oficial
                </a>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {hotel.bairro}
        </p>
      </footer>
    </div>
  );
};

export default HotelDetail;
