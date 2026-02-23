import { useExternalHotels, type ExternalHotel } from "@/hooks/use-external-hotels";
import { generateHotelSlug } from "@/pages/HotelDetail";

/**
 * Wrapper around useExternalHotels with filtering and fallback.
 */
export function useHotels(filters?: { bairro?: string }) {
  const query = useExternalHotels();
  const data: ExternalHotel[] = (() => {
    let items = query.data || [];
    if (filters?.bairro) {
      const b = filters.bairro.toLowerCase();
      items = items.filter(
        (h) =>
          h.bairro
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-") === b
      );
    }
    return items;
  })();
  return { ...query, data };
}

export function useHotelBySlug(slug: string | undefined) {
  const query = useExternalHotels();
  const item = slug
    ? (query.data || []).find((h) => generateHotelSlug(h.nome) === slug) || null
    : null;
  return { ...query, data: item };
}

/** Find hotel by partial name match (for Fasano-type lookups) */
export function useHotelByName(name: string | undefined) {
  const query = useExternalHotels();
  if (!name) return { ...query, data: null };
  const n = name.toLowerCase();
  const item = (query.data || []).find((h) => h.nome.toLowerCase().includes(n)) || null;
  return { ...query, data: item };
}

export type { ExternalHotel };
