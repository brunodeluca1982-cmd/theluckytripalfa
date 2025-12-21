/**
 * BRAND LOGO — THE LUCKY TRIP
 * 
 * Premium, editorial brand header with:
 * - Stylized handwritten "l." symbol (SVG)
 * - "THE LUCKY TRIP" in elegant serif
 * - Subtitle in clean sans-serif
 */

const LuckySymbol = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 60 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Stylized handwritten "l." mark */}
    <path 
      d="M30 8C30 8 22 12 22 28C22 44 30 56 30 56C30 56 24 64 18 64C12 64 10 58 14 52C18 46 28 48 32 54C36 60 34 68 26 72"
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* The dot */}
    <circle 
      cx="42" 
      cy="56" 
      r="4.5" 
      fill="currentColor"
    />
  </svg>
);

const BrandLogo = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Symbol */}
      <LuckySymbol className="w-12 h-16 text-foreground mb-3" />
      
      {/* Brand Name */}
      <h1 className="text-xl tracking-[0.25em] font-serif font-medium text-foreground uppercase">
        The Lucky Trip
      </h1>
      
      {/* Subtitle */}
      <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-1.5 font-sans">
        Inteligência Humana em Viagens
      </p>
    </div>
  );
};

export default BrandLogo;
