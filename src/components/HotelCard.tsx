import { Link } from "react-router-dom";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";

interface HotelCardProps {
  name: string;
  description?: string;
  slug?: string;
  neighborhood?: string;
  imageUrl?: string;
  categoria?: string;
}

const HotelCard = ({
  name,
  description,
  slug,
  neighborhood,
  imageUrl,
  categoria,
}: HotelCardProps) => {
  const detailUrl = slug ? `/hotel/${slug}?from=${neighborhood || ""}` : undefined;
  const placeQuery = buildPlaceQuery(name, neighborhood);
  const { photoUrl, isLoading } = usePlacePhoto(slug || name, "hotel", placeQuery, !imageUrl);
  // Priority: 1) Supabase imageUrl (prop) → 2) Google Places photo → 3) none
  const displayImage = imageUrl || photoUrl;

  const CardContent = () => (
    <>
      {/* Thumbnail Image */}
      <div className="w-full aspect-[16/9] bg-muted/50 rounded overflow-hidden mb-4">
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
            ) : (
              <span className="text-2xl text-muted-foreground/30">{name.charAt(0)}</span>
            )}
          </div>
        )}
      </div>

      {/* Hotel Info */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-base text-foreground">{name}</p>
        {categoria && (
          <span className="text-xs text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded">
            {categoria}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
          {description}
        </p>
      )}

      {/* View indicator */}
      <span className="text-xs text-muted-foreground/60">Ver detalhes</span>
    </>
  );

  if (detailUrl) {
    return (
      <Link
        to={detailUrl}
        className="block py-6 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors -mx-2 px-2 rounded"
      >
        <CardContent />
      </Link>
    );
  }

  return (
    <div className="py-6 border-b border-border last:border-b-0">
      <CardContent />
    </div>
  );
};

export default HotelCard;
