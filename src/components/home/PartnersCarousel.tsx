import { useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllPartners } from "@/data/partners-data";

/**
 * VIAJE COMO ELES
 * Horizontal scrollable partner cards matching the design reference.
 */

const PartnersCarousel = () => {
  const partners = getAllPartners();

  return (
    <section className="py-8 px-5">
      {/* Separator */}
      <div className="border-t border-border mb-8" />

      <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary mb-2">
        Viaje como eles
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        Siga os passos de quem você admira. Tenha acesso aos roteiros
        detalhados, segredos e dicas pessoais.
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    </section>
  );
};

interface PartnerCardProps {
  partner: ReturnType<typeof getAllPartners>[number];
}

const PartnerCard = ({ partner }: PartnerCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const itineraryCount = partner.destinations.length > 0
    ? String(partner.destinations.length).padStart(2, "0")
    : "00";

  return (
    <Link
      to={`/partner/${partner.id}`}
      className="flex-shrink-0 w-[170px] rounded-2xl overflow-hidden border border-border bg-card"
    >
      <div className="relative aspect-[4/5]">
        {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
        {partner.imageUrl && (
          <img
            src={partner.imageUrl}
            alt={partner.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        )}
        {/* Badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
            />
          </svg>
          <span className="text-[11px] text-white font-medium">
            Roteiros: {itineraryCount}
          </span>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-foreground text-sm font-medium truncate">
          {partner.name}
        </p>
      </div>
    </Link>
  );
};

export default PartnersCarousel;
