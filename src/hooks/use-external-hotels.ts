import { useQuery } from "@tanstack/react-query";

export interface ExternalHotel {
  id: string;
  nome: string;
  bairro: string;
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
}

const HOTELS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/external-hotels`;

async function fetchExternalHotels(): Promise<ExternalHotel[]> {
  const resp = await fetch(HOTELS_URL, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) throw new Error("Failed to fetch hotels");
  const json = await resp.json();
  return json.hotels || [];
}

export function useExternalHotels() {
  return useQuery({
    queryKey: ["external-hotels"],
    queryFn: fetchExternalHotels,
    staleTime: 5 * 60 * 1000,
  });
}
