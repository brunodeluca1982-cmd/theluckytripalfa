import { Link } from "react-router-dom";

interface HotelCardProps {
  name: string;
  price: string;
  description?: string;
  slug?: string;
  neighborhood?: string;
}

const HotelCard = ({ 
  name, 
  price, 
  description, 
  slug,
  neighborhood,
}: HotelCardProps) => {
  const detailUrl = slug ? `/hotel/${slug}?from=${neighborhood || ''}` : undefined;

  const CardContent = () => (
    <>
      {/* Media Placeholder */}
      <div className="w-full aspect-[16/9] bg-muted/50 flex items-center justify-center mb-4 rounded">
        <p className="text-xs text-muted-foreground">Photo placeholder</p>
      </div>
      
      {/* Hotel Info */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-base text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{price}</p>
      </div>
      
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

export default HotelCard;
