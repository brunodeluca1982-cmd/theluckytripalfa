import { useState } from "react";
import { MapPin, Utensils, Sun, Moon, Coffee, Hotel } from "lucide-react";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";
import type { SlotKind } from "@/lib/auto-roteiro-v2";

const slotIcons: Record<string, React.ElementType> = {
  morning: Sun,
  lunch: Utensils,
  afternoon: Sun,
  evening: Moon,
  extra: Coffee,
  hotel: Hotel,
};

interface SlotItemPhotoProps {
  itemId: string;
  itemName: string;
  neighborhood: string;
  slotKind: SlotKind | "hotel";
  className?: string;
}

export const SlotItemPhoto = ({ itemId, itemName, neighborhood, slotKind, className = "" }: SlotItemPhotoProps) => {
  const [imgError, setImgError] = useState(false);
  const query = buildPlaceQuery(itemName, neighborhood);
  const itemType = slotKind === "hotel" ? "hotel" : slotKind === "lunch" || slotKind === "evening" || slotKind === "extra" ? "restaurant" : "attraction";
  const { photoUrl, isLoading } = usePlacePhoto(itemId, itemType, query);

  const FallbackIcon = slotIcons[slotKind] || MapPin;

  if (photoUrl && !imgError) {
    return (
      <div className={`overflow-hidden rounded-lg bg-muted flex-shrink-0 ${className}`}>
        <img
          src={photoUrl}
          alt={itemName}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg bg-muted/60 flex-shrink-0 flex items-center justify-center ${className}`}>
      <FallbackIcon className="w-5 h-5 text-muted-foreground/40" />
    </div>
  );
};
