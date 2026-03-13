import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NeighborhoodEditorial {
  id: string;
  neighborhood_id: string;
  neighborhood_name: string;
  summary: string | null;
  como_e_ficar: string | null;
  pra_quem: string | null;
  o_que_faz_especial: string | null;
  o_que_considerar: string | null;
}

export function useNeighborhoodEditorial(neighborhoodId: string | null) {
  return useQuery({
    queryKey: ["neighborhood-editorial", neighborhoodId],
    queryFn: async () => {
      if (!neighborhoodId) return null;
      const { data, error } = await supabase
        .from("neighborhood_editorial" as any)
        .select("*")
        .eq("neighborhood_id", neighborhoodId)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as NeighborhoodEditorial | null;
    },
    enabled: !!neighborhoodId,
  });
}
