import logoSymbol from "@/assets/brand/logo-l-symbol.png";

const BrandLogo = () => {
  return (
    <div className="flex flex-col items-center">
      <img src={logoSymbol} alt="L." className="h-10 w-auto select-none" />
      <span className="text-[10px] font-serif font-medium tracking-[0.2em] text-foreground uppercase mt-1.5">
        The Lucky Trip
      </span>
      <p className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase mt-1">
        Inteligência Humana em Viagens
      </p>
    </div>
  );
};

export default BrandLogo;
