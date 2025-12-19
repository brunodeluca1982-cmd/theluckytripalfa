import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HotelCardProps {
  name: string;
  price: string;
  description?: string;
  address?: string;
  instagram?: string;
  externalLink?: string;
  id?: string;
  onSave?: (id: string, name: string) => void;
}

const HotelCard = ({ 
  name, 
  price, 
  description, 
  address, 
  instagram, 
  externalLink,
  id,
  onSave 
}: HotelCardProps) => {
  const handleSave = () => {
    if (onSave && id) {
      onSave(id, name);
    }
  };

  return (
    <div className="py-6 border-b border-border last:border-b-0">
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

      {/* Links */}
      <div className="flex items-center gap-4 mb-3">
        {address && (
          <a 
            href={address} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View on map
          </a>
        )}
        {instagram && (
          <a 
            href={`https://instagram.com/${instagram.replace('@', '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {instagram}
          </a>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-3">
        {id && onSave && (
          <Button
            onClick={handleSave}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <Plus className="w-3 h-3" />
            Salvar
          </Button>
        )}
        {externalLink ? (
          <a 
            href={externalLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-foreground underline"
          >
            View availability
          </a>
        ) : (
          <span className="text-xs text-muted-foreground/60 cursor-default select-none">
            View availability
          </span>
        )}
      </div>
    </div>
  );
};

export default HotelCard;
