import { useExternalExperiencias, type ExternalExperiencia } from "@/hooks/use-external-experiencias";

/**
 * Wrapper around useExternalExperiencias with filtering and fallback.
 * Never returns undefined — always an array.
 */
export function useExperiencias(filters?: {
  cidade?: string;
  categoria?: string;
  limit?: number;
}) {
  const query = useExternalExperiencias();

  const data: ExternalExperiencia[] = (() => {
    let items = query.data || [];
    if (filters?.cidade) {
      const c = filters.cidade.toLowerCase();
      items = items.filter((e) => e.cidade?.toLowerCase() === c);
    }
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
  const query = useExternalExperiencias();
  const item = id ? (query.data || []).find((e) => e.id === id) || null : null;
  return { ...query, data: item };
}

export type { ExternalExperiencia };
