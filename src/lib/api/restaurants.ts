import { useExternalRestaurants, type ExternalRestaurant } from "@/hooks/use-external-restaurants";

/**
 * Wrapper around useExternalRestaurants with filtering and fallback.
 */
export function useRestaurants(filters?: { bairro?: string; categoria?: string }) {
  const query = useExternalRestaurants();
  const data: ExternalRestaurant[] = (() => {
    let items = query.data || [];
    if (filters?.bairro) {
      const b = filters.bairro.toLowerCase();
      items = items.filter(
        (r) =>
          r.bairro
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-") === b
      );
    }
    if (filters?.categoria) {
      const c = filters.categoria.toLowerCase();
      items = items.filter((r) => r.categoria?.toLowerCase() === c);
    }
    return items;
  })();
  return { ...query, data };
}

export type { ExternalRestaurant };
