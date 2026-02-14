import { Link } from "react-router-dom";
import type { ImageStatus } from "@/data/carnival-blocks";
import { getApprovedImageUrl } from "@/lib/image-utils";

interface RestaurantCardProps {
  name: string;
  description?: string;
  id?: string;
  slug?: string;
  neighborhood?: string;
  imageUrl?: string;
  image_url?: string | null;
  image_source_url?: string | null;
  image_credit?: string | null;
  image_status?: ImageStatus;
}

const RestaurantCard = ({ name, description, slug, neighborhood, imageUrl, image_url, image_status, image_credit }: RestaurantCardProps) => {
  const detailUrl = slug ? `/restaurante/${slug}?from=${neighborhood || ''}` : undefined;
  const approvedImage = getApprovedImageUrl(image_url, image_status) || imageUrl;

  const CardContent = () => (
    <>
      {/* Thumbnail Image */}
      <div className="w-full aspect-[16/9] bg-muted/50 rounded overflow-hidden mb-4">
        {approvedImage ? (
          <img 
            src={approvedImage} 
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
            <span className="text-2xl text-muted-foreground/30">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      {image_credit && approvedImage && (
        <p className="text-[10px] text-muted-foreground/50 -mt-3 mb-2">📷 {image_credit}</p>
      )}
      
      {/* Restaurant Info */}
      <p className="text-base text-foreground mb-2">{name}</p>
      
      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {description}
        </p>
      )}
      
      {/* View indicator */}
      <span className="text-xs text-muted-foreground/60">
        Ver detalhes
      </span>
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

export default RestaurantCard;
