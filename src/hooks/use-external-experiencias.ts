import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Canonical experience interface — maps to the `experiences` table.
 * Keeps the same shape as the old ExternalExperiencia for backward compatibility.
 */
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
  hero_video_path: string | null;
  hero_image_path: string | null;
}

/**
 * Maps a row from the `experiences` table to the ExternalExperiencia shape.
 */
function mapRow(row: any): ExternalExperiencia {
  return {
    id: row.slug,                              // use slug as id for route compatibility
    nome: row.title,
    bairro: row.neighborhood || row.city || "",
    categoria: row.category || "",
    cidade: row.city || "",
    com_criancas: false,
    duracao: null,
    google_maps_url: null,
    melhor_horario: null,
    meu_olhar: row.full_description || row.short_description || "",
    nivel_esforco: 0,
    ordem_bairro: row.sort_order || 0,
    ordem_item: row.sort_order || 0,
    precisa_reserva: false,
    seguro_mulher_sozinha: false,
    tipo_experiencia: row.category || null,
    vibe: null,
    ativo: row.is_active,
    created_at: row.created_at,
    hero_video_path: null,
    hero_image_path: null,
  };
}

async function fetchExperiences(): Promise<ExternalExperiencia[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapRow);
}

export function useExternalExperiencias() {
  return useQuery({
    queryKey: ["experiences-canonical"],
    queryFn: fetchExperiences,
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
