import { useQuery } from "@tanstack/react-query";

export interface ExternalNeighborhood {
  id: string;
  neighborhood_name: string;
  neighborhood_slug: string;
  title: string;
  city: string;
  category_neighborhood: string | null;
  display_order: number;
  identity_phrase: string | null;
  my_view: string | null;
  how_to_live: string[] | null;
  best_for_1: string | null;
  best_for_2: string | null;
  best_for_3: string | null;
  better_for: string | null;
  google_maps: string | null;
  walkable: string | null;
  nightlife: string | null;
  gastronomy: string | null;
  scenery: string | null;
  safety_solo_woman: string | null;
  ai_tags: string[] | null;
  active: boolean;
}

const NEIGHBORHOODS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/external-neighborhoods`;

async function fetchExternalNeighborhoods(): Promise<ExternalNeighborhood[]> {
  const resp = await fetch(NEIGHBORHOODS_URL, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) throw new Error("Failed to fetch neighborhoods");
  const json = await resp.json();
  return (json.neighborhoods || []).map((raw: any): ExternalNeighborhood => ({
    id: raw.id,
    neighborhood_name: raw.neighborhood_name || raw.title || "",
    neighborhood_slug: raw.neighborhood_slug || "",
    title: raw.title || raw.neighborhood_name || "",
    city: raw.city || "Rio de Janeiro",
    category_neighborhood: raw.category_neighborhood || null,
    display_order: raw.display_order ?? 0,
    identity_phrase: raw.identity_phrase || null,
    my_view: raw.my_view || null,
    how_to_live: raw.how_to_live || null,
    best_for_1: raw.best_for_1 || null,
    best_for_2: raw.best_for_2 || null,
    best_for_3: raw.best_for_3 || null,
    better_for: raw.better_for || null,
    google_maps: raw.google_maps || null,
    walkable: raw.walkable || null,
    nightlife: raw.nightlife || null,
    gastronomy: raw.gastronomy || null,
    scenery: raw.scenery || null,
    safety_solo_woman: raw.safety_solo_woman || null,
    ai_tags: raw.ai_tags || null,
    active: raw.active ?? true,
  }));
}

export function useExternalNeighborhoods() {
  return useQuery({
    queryKey: ["external-neighborhoods"],
    queryFn: fetchExternalNeighborhoods,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExternalNeighborhood(slug: string | undefined) {
  const query = useExternalNeighborhoods();
  const item = slug
    ? (query.data || []).find((n) => n.neighborhood_slug === slug) || null
    : null;
  return { ...query, data: item };
}
