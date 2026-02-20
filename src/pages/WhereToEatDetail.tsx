import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import { getNeighborhoodById } from "@/data/rio-neighborhoods";
import RoteiroAccessLink from "@/components/RoteiroAccessLink";
import { getRestaurantImage } from "@/data/place-images";
import { useExternalRestaurants, normalizeNeighborhood, generateRestaurantSlug } from "@/hooks/use-external-restaurants";
import { useMemo } from "react";
import { GooglePlaceSearchSection } from "@/components/GooglePlaceSearchSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { PlaceResult } from "@/lib/search-places";

/**
 * ONDE COMER — NEIGHBORHOOD RESTAURANT LIST
 * Uses exclusively external Supabase data. No static fallback.
 */

const neighborhoodDescriptions: Record<string, string> = {
  ipanema: "Aqui a gastronomia é diversa como a própria praia. Tem alta cozinha, bistrôs autorais, cafés modernos, botecos clássicos e lugares onde você entra pra almoçar e acaba ficando até o jantar.",
  leblon: "No Leblon, os restaurantes são mais maduros. Menos moda, mais constância. Cozinhas sólidas, serviço afinado e um público que volta porque confia.",
  copacabana: "Copacabana é tradição à mesa. Restaurantes históricos, hotéis clássicos e cozinhas que atravessaram décadas sem perder o nível.",
  leme: "Mais discreto e local. Poucos restaurantes, mas bem escolhidos, com clima de bairro e menos pressa.",
  arpoador: "Pequeno no mapa, mas estratégico. Comer aqui é quase sempre combinado com praia, pôr do sol ou uma pausa entre caminhadas.",
  "jardim-botanico": "A gastronomia aqui é mais verde, mais calma e mais cuidadosa. Restaurantes que valorizam tempo, ambiente e ingredientes.",
  gavea: "Bairro de bares clássicos e restaurantes que funcionam como extensão da sala de casa. Muito encontro, muita conversa e pouca formalidade.",
  botafogo: "Um dos polos gastronômicos mais criativos do Rio. Restaurantes novos, cozinhas autorais, bares híbridos e muita experimentação.",
  flamengo: "Mais funcional do que gastronômico, mas com boas surpresas. Restaurantes tradicionais, opções honestas e lugares que servem bem sem chamar atenção.",
  "santa-teresa": "Aqui comer faz parte da experiência. Vista, atmosfera e história pesam tanto quanto o prato.",
  "sao-conrado": "Poucas opções, mas bem pontuais. A gastronomia aparece como apoio ao dia de praia ou ao fim de tarde.",
  "barra-da-tijuca": "Restaurantes amplos, confortáveis e bem estruturados. Muito churrasco, japonês, casas grandes e opções para grupos.",
  recreio: "Comida ligada ao esporte e à natureza. Lugares simples, pós-praia, com foco em peixe, sucos, açaí e refeições diretas.",
  centro: "Balcões de almoço históricos, bares tradicionais e confeitarias centenárias preservando os sabores do Rio antigo.",
  lagoa: "Um dos cartões-postais do Rio, com restaurantes sofisticados à beira d'água e opções para todos os momentos do dia.",
};

const WhereToEatDetail = () => {
  const { neighborhood } = useParams<{ neighborhood: string }>();
  const [searchParams] = useSearchParams();
  const { data: externalRestaurants, isLoading } = useExternalRestaurants();

  const handleAddToRoteiro = async (place: PlaceResult) => {
    const { error } = await supabase.from("roteiro_itens").insert({
      roteiro_id: "rio-de-janeiro-draft",
      source: "google",
      ref_table: "places_cache",
      place_id: place.placeId,
      name: place.name,
      address: place.address,
      neighborhood: neighborhood || null,
      city: "Rio de Janeiro",
      lat: place.lat,
      lng: place.lng,
      day_index: 1,
      order_in_day: 0,
    });
    if (error) {
      toast({ title: "Erro ao adicionar", description: "Tente novamente.", variant: "destructive" });
    } else {
      toast({ title: "Adicionado ao roteiro!", description: place.name });
    }
  };

  const neighborhoodData = getNeighborhoodById(neighborhood || "");
  const name = neighborhoodData?.name || neighborhood || "Bairro";
  const description = neighborhoodDescriptions[neighborhood || ""] || `Descubra onde comer em ${name}.`;

  const from = searchParams.get("from");
  const backPath = from === "map" ? "/eat-map-view" : "/eat-map-view";

  // Group restaurants by categoria for this neighborhood
  const groupedRestaurants = useMemo(() => {
    if (!externalRestaurants) return {};
    const filtered = externalRestaurants.filter(
      (r) => normalizeNeighborhood(r.bairro) === neighborhood
    );
    const groups: Record<string, typeof filtered> = {};
    for (const r of filtered) {
      const cat = r.categoria || "Outros";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    }
    return groups;
  }, [externalRestaurants, neighborhood]);

  const hasRestaurants = Object.keys(groupedRestaurants).length > 0;

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
            Onde comer em {name}
          </h1>
        </div>

        <div className="w-full aspect-[16/9] bg-muted overflow-hidden">
          <img
            src={getRestaurantImage(neighborhood || "")}
            alt={`Onde comer em ${name}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-6 pt-8 pb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mx-6 border-t border-border" />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground/70 rounded-full animate-spin" />
          </div>
        ) : hasRestaurants ? (
          Object.entries(groupedRestaurants).map(([cuisineType, restaurantList]) => (
            <section key={cuisineType} className="px-6 pt-8">
              <h2 className="text-xl font-serif font-medium text-foreground mb-6">
                {cuisineType}
              </h2>
              <div>
                {restaurantList.map((restaurant) => {
                  const slug = generateRestaurantSlug(restaurant.nome);
                  return (
                    <RestaurantCard
                      key={restaurant.id}
                      name={restaurant.nome}
                      description={restaurant.meu_olhar || ""}
                      slug={slug}
                      neighborhood={neighborhood}
                      imageUrl={getRestaurantImage(neighborhood || "")}
                    />
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="px-6 pt-8">
            <p className="text-sm text-muted-foreground">
              Recomendações de restaurantes em breve.
            </p>
          </div>
        )}

        {/* Google Places search section */}
        <div className="px-6 pt-8">
          <GooglePlaceSearchSection
            city="Rio de Janeiro"
            bairro={name}
            type="restaurant"
            title="Outras opções (Google)"
            placeholder="Buscar restaurantes no Google..."
            onAddToRoteiro={handleAddToRoteiro}
          />
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — {name}
        </p>
      </footer>
    </div>
  );
};

export default WhereToEatDetail;
