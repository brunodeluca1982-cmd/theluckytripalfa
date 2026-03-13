import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  // Cast to 'any' because the generated types don't yet include this new table
  const { data, error } = await (supabase as any)
    .from("o_que_fazer_rio")
    .select("*")
    .eq("ativo", true)
    .eq("cidade", "Rio de Janeiro")
    .order("ordem", { ascending: true });

  if (error) throw error;

  return ((data as any[]) || []).map((r) => ({
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
  }));
}

export function useOQueFazer() {
  return useQuery({
    queryKey: ["o-que-fazer-rio"],
    queryFn: fetchOQueFazer,
    staleTime: 5 * 60 * 1000,
    select: smartSort,
  });
}

/** Fetch a single O Que Fazer item by id */
export function useOQueFazerItem(id: string | undefined) {
  return useQuery({
    queryKey: ["o-que-fazer-rio", id],
    enabled: !!id,
    queryFn: async (): Promise<OQueFazerItem | null> => {
      const { data, error } = await (supabase as any)
        .from("o_que_fazer_rio")
        .select("*")
        .eq("id", id!)
        .eq("ativo", true)
        .single();

      if (error) return null;
      if (!data) return null;

      const r = data as any;
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
