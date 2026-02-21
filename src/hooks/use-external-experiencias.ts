import { useQuery } from "@tanstack/react-query";

export interface ExternalExperiencia {
  id: string;
  nome: string;
  bairro: string;
  categoria: string;
  cidade: string;
  com_criancas: boolean;
  duracao: string | null;
  google_maps_url: string | null;
  melhor_horario: string | null;
  meu_olhar: string;
  nivel_esforco: number;
  ordem_bairro: number;
  ordem_item: number;
  precisa_reserva: boolean;
  seguro_mulher_sozinha: boolean;
  tipo_experiencia: string | null;
  vibe: string | null;
  ativo: boolean;
  created_at: string;
}

const URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/external-experiencias`;

async function fetchExternalExperiencias(): Promise<ExternalExperiencia[]> {
  const resp = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) throw new Error("Failed to fetch experiencias");
  const json = await resp.json();
  return json.experiencias || [];
}

export function useExternalExperiencias() {
  return useQuery({
    queryKey: ["external-experiencias"],
    queryFn: fetchExternalExperiencias,
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

/** Group experiencias by normalized neighborhood */
export function groupByNeighborhood(
  experiencias: ExternalExperiencia[]
): Record<string, ExternalExperiencia[]> {
  const groups: Record<string, ExternalExperiencia[]> = {};
  for (const exp of experiencias) {
    const key = normalizeNeighborhood(exp.bairro);
    if (!groups[key]) groups[key] = [];
    groups[key].push(exp);
  }
  return groups;
}
