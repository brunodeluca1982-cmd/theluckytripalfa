import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, Bookmark, MapPin, Instagram } from "lucide-react";
import { useItemSave } from "@/hooks/use-item-save";
import { getHotelImage } from "@/data/place-images";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import { useExternalHotels } from "@/hooks/use-external-hotels";
import { useMemo, useState, useEffect } from "react";

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
    return externalHotels.find((h) => generateHotelSlug(h.nome) === id) || null;
  }, [externalHotels, id]);

  useEffect(() => {
    if (id) setIsSaved(isHotelSaved(id));
  }, [id]);

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
    bairro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");

  const heroImage = photoUrl || (hotel ? getHotelImage(normalizeNeighborhood(hotel.bairro)) : "");

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
          <Link to="/onde-ficar-rio" className="text-foreground underline">Voltar</Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    saveItem(id || "", "hotel", hotel.nome, false);
    setIsSaved(true);
  };

  const cleanUrl = (raw: string | null | undefined): string | null => {
    if (!raw) return null;
    const match = raw.match(/https?:\/\/[^\s)]+/);
    return match ? match[0] : null;
  };

  const mapsUrl = cleanUrl(hotel.google_maps_url);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Image */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        {photoLoading && !heroImage ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
          </div>
        ) : (
          <img src={heroImage} alt={hotel.nome} className="w-full h-full object-cover" />
        )}
        {/* Top gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        {/* Nav overlay */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center justify-between z-10">
          <Link
            to={backPath}
            className="inline-flex items-center gap-1.5 text-sm text-white/90 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </div>

      {/* Content — dark background matching reference */}
      <div className="relative bg-black/90 backdrop-blur-sm px-5 pt-7 pb-24">

        {/* Category + Neighborhood pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {hotel.categoria && (
            <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
              {hotel.categoria}
            </span>
          )}
          <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
            {hotel.bairro}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-serif font-semibold text-white leading-tight mb-5">
          {hotel.nome}
        </h1>

        {/* Price */}
        {hotel.preco_medio_diaria && (
          <p className="text-sm text-white/60 mb-5">
            Diária média: R$ {hotel.preco_medio_diaria}
          </p>
        )}

        {/* Description */}
        {hotel.meu_olhar && (
          <div className="space-y-3 mb-6">
            {hotel.meu_olhar.split("\n").map((paragraph, index) => (
              <p key={index} className="text-base text-white/75 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Atmosfera */}
        {hotel.atmosfera && (
          <p className="text-sm italic text-white/50 mb-6">{hotel.atmosfera}</p>
        )}

        {/* Save button — full width white */}
        <button
          onClick={handleSave}
          className="w-full h-14 rounded-full bg-white text-black font-semibold text-base flex items-center justify-center gap-2 mb-6 active:scale-[0.98] transition-transform"
        >
          <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Salvo" : "Salvar"}
        </button>

        {/* Secondary links */}
        <div className="space-y-3">
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Ver no Google Maps
            </a>
          )}
          {hotel.instagram && (
            <a
              href={`https://instagram.com/${hotel.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              {hotel.instagram}
            </a>
          )}
          <a
            href="https://tidd.ly/4kOcJUx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            Reserve aqui
          </a>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/20 mt-10">
          The Lucky Trip — {hotel.bairro}
        </p>
      </div>
    </div>
  );
};

export default HotelDetail;
