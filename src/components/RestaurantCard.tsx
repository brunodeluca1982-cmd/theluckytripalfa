import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestaurantCardProps {
  name: string;
  description?: string;
  id?: string;
  onSave?: (id: string, name: string) => void;
}

const RestaurantCard = ({ name, description, id, onSave }: RestaurantCardProps) => {
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
      
      {/* Restaurant Info */}
      <p className="text-base text-foreground mb-2">{name}</p>
      
      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {description}
        </p>
      )}
      
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
        <span className="text-xs text-muted-foreground/60 cursor-default select-none">
          View restaurant
        </span>
      </div>
    </div>
  );
};

export default RestaurantCard;
