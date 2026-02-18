import { useQuery } from "@tanstack/react-query";

export interface ExternalRestaurant {
  id: number;
  nome: string;
  bairro: string;
  categoria: string;
  especialidade: string;
  meu_olhar: string;
  perfil_publico: string;
  instagram: string;
  google_maps_url: string;
  preco_nivel: number | null;
  ordem_bairro: number;
  ativo: boolean;
  cidade: string;
}

const URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/external-restaurantes`;

async function fetchExternalRestaurants(): Promise<ExternalRestaurant[]> {
  const resp = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) throw new Error("Failed to fetch restaurants");
  const json = await resp.json();
  return json.restaurants || [];
}

export function useExternalRestaurants() {
  return useQuery({
    queryKey: ["external-restaurants"],
    queryFn: fetchExternalRestaurants,
    staleTime: 5 * 60 * 1000,
  });
}

/** Normalize bairro string to slug form for URL matching */
export function normalizeNeighborhood(bairro: string): string {
  return bairro
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

/** Generate URL slug from restaurant name */
export function generateRestaurantSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
