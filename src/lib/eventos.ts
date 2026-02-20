import { supabase } from "@/integrations/supabase/client";

export interface ActiveEvent {
  id: string;
  destino: string;
  titulo: string;
  slug: string;
  descricao_curta: string | null;
  cor_hex: string | null;
  hero_media_url: string | null;
  botao_label: string | null;
  botao_link: string | null;
  data_inicio: string | null;
  data_fim: string | null;
}

/**
 * Get the highest-priority active event for a destination.
 * Returns null if no active event exists.
 */
export async function getActiveEvent(destino: string): Promise<ActiveEvent | null> {
  const { data } = await supabase
    .from("eventos")
    .select("id, destino, titulo, slug, descricao_curta, cor_hex, hero_media_url, botao_label, botao_link, data_inicio, data_fim")
    .eq("destino", destino)
    .eq("ativo", true)
    .order("prioridade", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as ActiveEvent | null;
}
