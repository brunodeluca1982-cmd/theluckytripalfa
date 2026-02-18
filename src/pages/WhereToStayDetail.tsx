import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import HotelCard from "@/components/HotelCard";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { getHotelImage } from "@/data/place-images";
import { useExternalHotels } from "@/hooks/use-external-hotels";
import { useMemo } from "react";

/**
 * ONDE FICAR — NEIGHBORHOOD HOTEL LIST
 * Uses exclusively external Supabase data. No static fallback.
 */

const neighborhoodDescriptions: Record<string, string> = {
  ipanema: "Bairro icônico do Rio clássico.",
  leblon: "Mais residencial, organizado e tradicional. Frequentado por famílias antigas, gente que mora há décadas no bairro e um público mais maduro. É elegante, seguro e previsível, no bom sentido.",
  copacabana: "Intensa, histórica e muito movimentada. Recebe gente do mundo inteiro e funciona quase como um bairro internacional dentro do Rio.",
  arpoador: "Arpoador é onde o Rio respira. Ponto de encontro entre Ipanema e Copacabana, com pedra icônica e pôr do sol aplaudido.",
  leme: "Mais calmo, residencial e com clima de bairro. É uma extensão tranquila de Copacabana.",
  "sao-conrado": "Silencioso, contemplativo e menos urbano. Mistura moradores antigos, gente ligada ao esporte e quem busca tranquilidade.",
  "barra-da-tijuca": "A Barra é o Rio em versão expandida. Avenida larga, prédios modernos, condomínio com portaria e uma praia imensa.",
  recreio: "Jovem, esportivo e mais selvagem. Muito surf, corrida, bicicleta e contato direto com a natureza.",
  "santa-teresa": "Artístico, histórico e cheio de personalidade. Frequentado por artistas, estrangeiros e gente que busca uma experiência menos óbvia do Rio.",
  centro: "O coração histórico do Rio. Arquitetura grandiosa, instituições culturais e um vislumbre do passado da cidade.",
  "jardim-botanico": "Verde, silencioso e mais familiar. Menos turístico e mais local.",
  gavea: "Boêmia, universitária e ao mesmo tempo residencial. Mistura jovens, famílias e vida noturna mais informal.",
  botafogo: "Urbano, prático e diverso. Atrai gente jovem, profissionais, criativos e moradores antigos.",
  flamengo: "Residencial, organizado e funcional. Muito usado como base por quem quer fácil acesso ao Centro e à Zona Sul.",
};

function normalizeNeighborhood(bairro: string): string {
  return bairro
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

const WhereToStayDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const { data: externalHotels, isLoading } = useExternalHotels();

  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodData?.name || neighborhood || "Bairro";
  const description = neighborhoodDescriptions[neighborhood || ""] || `Descubra onde ficar em ${name}.`;

  const hotels = useMemo(() => {
    if (!externalHotels) return [];
    return externalHotels
      .filter((h) => normalizeNeighborhood(h.bairro) === neighborhood)
      .map((h) => ({
        name: h.nome,
        description: h.meu_olhar || "",
        slug: h.nome
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-"),
        categoria: h.categoria?.trim() || "",
      }));
  }, [externalHotels, neighborhood]);

  const backPath = "/onde-ficar-rio";

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b border-border flex items-center justify-between">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <RoteiroAccessLink />
      </header>

      <main className="pb-12">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            Onde ficar em {name}
          </h1>
        </div>

        <div className="w-full aspect-[16/9] bg-muted overflow-hidden">
          <img
            src={getHotelImage(neighborhood || "")}
            alt={`Onde ficar em ${name}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mx-6 border-t border-border" />

        <section className="px-6 pt-8">
          <h2 className="text-xl font-serif font-medium text-foreground mb-6">
            Hotéis
          </h2>

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
                  imageUrl={getHotelImage(neighborhood || "")}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Recomendações de hotéis em breve.
            </p>
          )}
        </section>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {name}
        </p>
      </footer>
    </div>
  );
};

export default WhereToStayDetail;
