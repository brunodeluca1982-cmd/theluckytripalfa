import logoFull from "@/assets/brand/logo-the-lucky-trip.png";

const BrandLogo = () => {
  return (
    <div className="flex flex-col items-center">
      <img src={logoFull} alt="The Lucky Trip" className="h-16 w-auto" />
      <p className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase mt-1">
        Inteligência Humana em Viagens
      </p>
    </div>
  );
};

export default BrandLogo;
