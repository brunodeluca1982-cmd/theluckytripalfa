import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export interface OQueFazerItem {
  id: string;
  nome: string;
  categoria: string;
  bairro: string | null;
  google_maps: string | null;
  meu_olhar: string | null;
  momento_ideal: string | null;
  momento_lucky_list: string | null;
  como_fazer: string | null;
  tags_ia: string[];
  vibe: string | null;
  energia: string | null;
  duracao_media: string | null;
  ordem: number;
}

type OQueFazerRow = Tables<"o_que_fazer_rio">;
const O_QUE_FAZER_QUERY_KEY = ["o-que-fazer-rio", "v2"] as const;

/**
 * Returns the current approximate period of day:
 * manhã (6-12), tarde (12-18), noite (18-6)
 */
function getCurrentMomento(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "manhã";
  if (h >= 12 && h < 18) return "tarde";
  return "noite";
}

function mapRowToItem(r: OQueFazerRow): OQueFazerItem {
  return {
    id: r.id,
    nome: r.nome,
    categoria: r.categoria ?? "",
    bairro: r.bairro ?? null,
    google_maps: r.google_maps ?? null,
    meu_olhar: r.meu_olhar ?? null,
    momento_ideal: r.momento_ideal ?? null,
    momento_lucky_list: r.momento_lucky_list ?? null,
    como_fazer: r.como_fazer ?? null,
    tags_ia: r.tags_ia ?? [],
    vibe: r.vibe ?? null,
    energia: r.energia ?? null,
    duracao_media: r.duracao_media ?? null,
    ordem: r.ordem ?? 0,
  };
}

/**
 * Smart sort: prioritise items whose momento_ideal matches now,
 * then fall back to the `ordem` field.
 */
function smartSort(items: OQueFazerItem[]): OQueFazerItem[] {
  const now = getCurrentMomento();
  return [...items].sort((a, b) => {
    const aMatch = a.momento_ideal?.toLowerCase().includes(now) ? 0 : 1;
    const bMatch = b.momento_ideal?.toLowerCase().includes(now) ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    return a.ordem - b.ordem;
  });
}

async function fetchOQueFazer(): Promise<OQueFazerItem[]> {
  const { data, error } = await supabase
    .from("o_que_fazer_rio")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapRowToItem);
}

export function useOQueFazer() {
  return useQuery({
    queryKey: O_QUE_FAZER_QUERY_KEY,
    queryFn: fetchOQueFazer,
    staleTime: 0,
    refetchOnMount: "always",
    select: smartSort,
  });
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Fetch a single O Que Fazer item by id OR slugified name.
 * This avoids invalid UUID errors when legacy links pass slug text.
 */
export function useOQueFazerItem(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: [...O_QUE_FAZER_QUERY_KEY, idOrSlug],
    enabled: !!idOrSlug,
    queryFn: async (): Promise<OQueFazerItem | null> => {
      if (!idOrSlug) return null;

      if (UUID_REGEX.test(idOrSlug)) {
        const { data, error } = await supabase
          .from("o_que_fazer_rio")
          .select("*")
          .eq("id", idOrSlug)
          .eq("ativo", true)
          .maybeSingle();

        if (error || !data) return null;
        return mapRowToItem(data);
      }

      const { data, error } = await supabase
        .from("o_que_fazer_rio")
        .select("*")
        .eq("ativo", true);

      if (error || !data) return null;

      const match = data.find(
        (row) => slugifyOQueFazer(row.nome) === slugifyOQueFazer(idOrSlug)
      );

      return match ? mapRowToItem(match) : null;
    },
  });
}

/** Slugify helper */
export function slugifyOQueFazer(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
