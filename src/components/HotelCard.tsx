interface HotelCardProps {
  name: string;
  price: string;
  description?: string;
}

const HotelCard = ({ name, price, description }: HotelCardProps) => {
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
      
      {/* Inactive CTA Placeholder */}
      <span className="text-xs text-muted-foreground/60 cursor-default select-none">
        View availability
      </span>
    </div>
  );
};

export default HotelCard;
