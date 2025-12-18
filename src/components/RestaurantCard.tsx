interface RestaurantCardProps {
  name: string;
  description?: string;
}

const RestaurantCard = ({ name, description }: RestaurantCardProps) => {
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
      
      {/* Inactive CTA Placeholder */}
      <span className="text-xs text-muted-foreground/60 cursor-default select-none">
        View restaurant
      </span>
    </div>
  );
};

export default RestaurantCard;
