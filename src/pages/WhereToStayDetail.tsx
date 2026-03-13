import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import HotelCard from "@/components/HotelCard";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { getHotelImage } from "@/data/place-images";
import { useNeighborhoodHero } from "@/hooks/use-neighborhood-hero";
import { useExternalHotels } from "@/hooks/use-external-hotels";
import { useExternalNeighborhood } from "@/hooks/use-external-neighborhoods";
import { useMemo } from "react";


function normalizeNeighborhood(bairro: string): string {
  return bairro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
}

const WhereToStayDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const { data: externalHotels, isLoading } = useExternalHotels();
  const { data: neighborhoodEditorial } = useExternalNeighborhood(neighborhood);

  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodEditorial?.neighborhood_name || neighborhoodData?.name || neighborhood || "Bairro";
  const description = neighborhoodEditorial?.identity_phrase || neighborhoodDescriptions[neighborhood || ""] || `Descubra onde ficar em ${name}.`;
  const { heroUrl } = useNeighborhoodHero("rio-de-janeiro", neighborhood || "", "Rio de Janeiro", name, getHotelImage(neighborhood || ""));

  const hotels = useMemo(() => {
    if (!externalHotels) return [];
    return externalHotels
      .filter((h) => h.bairro_slug === neighborhood || normalizeNeighborhood(h.bairro) === neighborhood)
      .map((h) => ({
        name: h.nome,
        description: h.meu_olhar || "",
        slug: h.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"),
        categoria: h.categoria?.trim() || "",
      }));
  }, [externalHotels, neighborhood]);

  // Back to Rio hub (not app home)
  const backPath = "/onde-ficar-rio";

  return (
    <div className="min-h-screen bg-background">
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={heroUrl}
          alt={`Onde ficar em ${name}`}
          className="w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = getHotelImage(neighborhood || ""); }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center justify-between z-10">
          <Link to={backPath} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <RoteiroAccessLink />
        </div>
      </div>

      <main className="pb-12">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">Onde ficar em {name}</h1>
        </div>
        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <div className="mx-6 border-t border-border" />

        <section className="px-6 pt-8">
          <h2 className="text-xl font-serif font-medium text-foreground mb-6">Hotéis</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
            </div>
          ) : hotels.length > 0 ? (
            <div>
              {hotels.map((hotel, index) => (
                <HotelCard
                  key={index}
                  name={hotel.name}
                  description={hotel.description}
                  slug={hotel.slug}
                  neighborhood={neighborhood}
                  categoria={hotel.categoria}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Recomendações de hotéis em breve.</p>
          )}
        </section>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">The Lucky Trip — {name}</p>
      </footer>
    </div>
  );
};

export default WhereToStayDetail;
