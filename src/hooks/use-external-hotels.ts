import { useQuery } from "@tanstack/react-query";

export interface ExternalHotel {
  id: string;
  nome: string;
  bairro: string;
  bairro_slug: string;
  categoria: string;
  atmosfera: string;
  meu_olhar: string;
  perfil_publico: string;
  instagram: string;
  site_oficial: string;
  google_maps_url: string;
  preco_medio_diaria: string | null;
  ordem_bairro: number;
  ativo: boolean;
  cidade: string;
  reserve_url: string | null;
  identity_phrase: string | null;
  how_to_enjoy: string[] | null;
  best_for_1: string | null;
  best_for_2: string | null;
  best_for_3: string | null;
  front_beach: boolean | null;
  rooftop: boolean | null;
  featured_restaurant: string | null;
  safety_solo_woman: string | null;
  ai_tags: string[] | null;
  neighborhood_id: string | null;
}

const HOTELS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/external-hotels`;

/**
 * Maps the new v_stay_hotels_full schema to the ExternalHotel interface
 * used across the app, preserving backward compatibility.
 */
function mapHotel(raw: any): ExternalHotel {
  return {
    id: raw.id,
    nome: raw.hotel_name || raw.nome || "",
    bairro: raw.neighborhood_name || raw.bairro || "",
    bairro_slug: raw.neighborhood_slug || "",
    categoria: raw.hotel_category || raw.categoria || "",
    atmosfera: raw.audience || raw.atmosfera || "",
    meu_olhar: raw.my_view || raw.meu_olhar || "",
    perfil_publico: raw.audience || raw.perfil_publico || "",
    instagram: raw.instagram || "",
    site_oficial: raw.site_oficial || "",
    google_maps_url: raw.google_maps || raw.google_maps_url || "",
    preco_medio_diaria: raw.preco_medio_diaria || null,
    ordem_bairro: raw.neighborhood_order ?? raw.ordem_bairro ?? 0,
    ativo: raw.active ?? raw.ativo ?? true,
    cidade: raw.city || raw.cidade || "Rio de Janeiro",
    reserve_url: raw.reserve_url || null,
    identity_phrase: raw.identity_phrase || null,
    how_to_enjoy: raw.how_to_enjoy || null,
    best_for_1: raw.best_for_1 || null,
    best_for_2: raw.best_for_2 || null,
    best_for_3: raw.best_for_3 || null,
    front_beach: raw.front_beach ?? null,
    rooftop: raw.rooftop ?? null,
    featured_restaurant: raw.featured_restaurant || null,
    safety_solo_woman: raw.safety_solo_woman || null,
    ai_tags: raw.ai_tags || null,
    neighborhood_id: raw.neighborhood_id || null,
  };
}

async function fetchExternalHotels(): Promise<ExternalHotel[]> {
  const resp = await fetch(HOTELS_URL, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) throw new Error("Failed to fetch hotels");
  const json = await resp.json();
  return (json.hotels || []).map(mapHotel);
}

export function useExternalHotels() {
  return useQuery({
    queryKey: ["external-hotels"],
    queryFn: fetchExternalHotels,
    staleTime: 5 * 60 * 1000,
  });
}
