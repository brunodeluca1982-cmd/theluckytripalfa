import { useOQueFazer, type OQueFazerItem } from "@/hooks/use-o-que-fazer";

/**
 * Wrapper around useOQueFazer with filtering.
 * Now reads from the canonical `o_que_fazer_rio` table.
 */
export function useExperiencias(filters?: {
  cidade?: string;
  categoria?: string;
  limit?: number;
}) {
  const query = useOQueFazer();

  const data: OQueFazerItem[] = (() => {
    let items = query.data || [];
    if (filters?.categoria) {
      const cat = filters.categoria.toLowerCase();
      items = items.filter((e) => e.categoria?.toLowerCase() === cat);
    }
    if (filters?.limit) {
      items = items.slice(0, filters.limit);
    }
    return items;
  })();

  return { ...query, data };
}

export function useExperienciaById(id: string | undefined) {
  const query = useOQueFazer();
  const item = id ? (query.data || []).find((e) => e.id === id) || null : null;
  return { ...query, data: item };
}

export type { OQueFazerItem };
