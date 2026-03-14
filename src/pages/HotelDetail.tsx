import { Link, useParams, useSearchParams } from "react-router-dom";
import { MapPin, Instagram } from "lucide-react";
import { useItemSave } from "@/hooks/use-item-save";
import { getHotelImage } from "@/data/place-images";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useExternalHotels } from "@/hooks/use-external-hotels";
import { useMemo, useState, useEffect } from "react";
import DetailHeroLayout from "@/components/detail/DetailHeroLayout";

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

function isHotelSaved(id: string) {
  const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
  return draft.some((item: { id: string; type: string }) => item.id === id && item.type === "hotel");
}

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { saveItem } = useItemSave();
  const { data: externalHotels, isLoading } = useExternalHotels();
  const [isSaved, setIsSaved] = useState(false);

  const hotel = useMemo(() => {
    if (!externalHotels || !id) return null;
    // Support lookup by external ID, slug, or name slug
    return externalHotels.find((h) => String(h.id) === id)
      || externalHotels.find((h) => generateHotelSlug(h.nome) === id)
      || null;
  }, [externalHotels, id]);

  useEffect(() => {
    if (hotel?.id) setIsSaved(isHotelSaved(String(hotel.id)));
  }, [hotel?.id]);

  const from = searchParams.get("from");
  const backPath = from && from !== "list" && from !== "map" ? `/onde-ficar/${from}` : "/onde-ficar-rio";

  const neighborhoodName = hotel?.bairro || "";
  const placeQuery = hotel ? buildPlaceQuery(hotel.nome, neighborhoodName) : "";
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(id || "", "hotel", placeQuery, !!hotel);

  const normalizeNeighborhood = (bairro: string) =>
    bairro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");

  const heroImage = photoUrl || (hotel ? getHotelImage(normalizeNeighborhood(hotel.bairro)) : "");

  if (isLoading || (photoLoading && !heroImage)) {
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
          <Link to="/onde-ficar-rio" className="text-foreground underline">Voltar</Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveItem(String(hotel.id), "hotel", hotel.nome, false);
    setIsSaved(true);
  };

  const cleanUrl = (raw: string | null | undefined): string | null => {
    if (!raw) return null;
    const match = raw.match(/https?:\/\/[^\s)]+/);
    return match ? match[0] : null;
  };

  const mapsUrl = cleanUrl(hotel.google_maps_url);
  const pills = [hotel.categoria, hotel.bairro].filter(Boolean) as string[];
  const reserveLink = hotel.reserve_url || "https://tidd.ly/4kOcJUx";

  return (
    <DetailHeroLayout
      backPath={backPath}
      title={hotel.nome}
      subtitle={hotel.preco_medio_diaria ? `Diária média: R$ ${hotel.preco_medio_diaria}` : null}
      pills={pills}
      heroImageUrl={heroImage}
      isSaved={isSaved}
      onSave={handleSave}
      footer={`The Lucky Trip — ${hotel.bairro}`}
    >
      {/* Description */}
      {hotel.meu_olhar && (
        <div className="space-y-3 mb-6">
          {hotel.meu_olhar.split("\n").map((paragraph, index) => (
            <p key={index} className="text-base text-white/75 leading-relaxed">{paragraph}</p>
          ))}
        </div>
      )}

      {hotel.atmosfera && (
        <p className="text-sm italic text-white/50 mb-6">{hotel.atmosfera}</p>
      )}

      {/* Secondary links */}
      <div className="space-y-3">
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
            <MapPin className="w-4 h-4" />
            Ver no Google Maps
          </a>
        )}
        {hotel.instagram && (
          <a href={`https://instagram.com/${hotel.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
            <Instagram className="w-4 h-4" />
            {hotel.instagram}
          </a>
        )}
        <a href={reserveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
          Reserve aqui
        </a>
      </div>
    </DetailHeroLayout>
  );
};

export default HotelDetail;
