import luckyTripLogo from "@/assets/brand/lucky-trip-logo.png";

const BrandLogo = () => {
  return (
    <div className="flex flex-col items-center">
      <img 
        src={luckyTripLogo} 
        alt="The Lucky Trip" 
        className="h-20 w-auto"
      />
      <p className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase mt-2">
        Inteligência Humana em Viagens
      </p>
    </div>
  );
};

export default BrandLogo;
