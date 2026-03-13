import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LuckyListItem {
  id: string;
  created_at: string;
  cidade: string;
  bairro: string | null;
  nome: string;
  tipo_item: string | null;
  categoria_experiencia: string | null;
  google_maps: string | null;
  meu_olhar: string | null;
  como_fazer: string | null;
  tags_ia: string[] | null;
  nivel_esforco: string | null;
  com_criancas: boolean | null;
  seguro_mulher_sozinha: boolean | null;
  ativo: boolean;
  horarios: string | null;
  contato_instagram: string | null;
  contato_telefone: string | null;
  quando_tem_musica: string | null;
}

export function useLuckyList() {
  return useQuery({
    queryKey: ["lucky-list-rio", "v2"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lucky_list_rio")
        .select("*")
        .eq("ativo", true)
        .eq("cidade", "Rio de Janeiro")
        .order("created_at", { ascending: true })
        .order("id", { ascending: true });

      if (error) throw error;
      return (data as LuckyListItem[]) || [];
    },
  });
}

export function useLuckyListItem(id: string | undefined) {
  return useQuery({
    queryKey: ["lucky-list-rio", "item", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lucky_list_rio")
        .select("*")
        .eq("id", id!)
        .eq("ativo", true)
        .eq("cidade", "Rio de Janeiro")
        .single();

      if (error) throw error;
      return data as LuckyListItem;
    },
  });
}

/** Group items by bairro */
export function groupByBairro(items: LuckyListItem[]): Record<string, LuckyListItem[]> {
  const grouped: Record<string, LuckyListItem[]> = {};
  items.forEach((item) => {
    const key = item.bairro || "Fora do Mapa";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });
  return grouped;
}
