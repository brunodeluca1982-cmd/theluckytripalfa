import { useState, useEffect, useRef } from "react";
import {
  resolveExperienceCoords,
  getCachedCoords,
  type GeoCoord,
} from "@/lib/geo/resolveExperienceCoords";
import type { ExternalExperiencia } from "@/hooks/use-external-experiencias";

export interface MapItem {
  id: string;
  nome: string;
  bairro: string;
  lat: number;
  lng: number;
  neighborhoodSlug: string;
}

/**
 * Asynchronously resolves coordinates for a list of experiencias.
 * Returns only items with valid coords, keyed by id.
 * Re-renders as coords resolve progressively.
 */
export function useItemCoordinates(
  items: (ExternalExperiencia & { neighborhoodSlug: string })[]
): MapItem[] {
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const batchRef = useRef(0);

  useEffect(() => {
    if (!items.length) {
      setMapItems([]);
      return;
    }

    const batch = ++batchRef.current;

    // Start with any already-cached results
    const initial: MapItem[] = [];
    const toResolve: (ExternalExperiencia & { neighborhoodSlug: string })[] = [];

    items.forEach((item) => {
      const cached = getCachedCoords(item.id);
      if (cached) {
        initial.push({
          id: item.id,
          nome: item.nome,
          bairro: item.bairro,
          lat: cached.lat,
          lng: cached.lng,
          neighborhoodSlug: item.neighborhoodSlug,
        });
      } else {
        toResolve.push(item);
      }
    });

    setMapItems(initial);

    // Resolve remaining in parallel (batched to avoid rate limits)
    const BATCH_SIZE = 5;
    let resolved = [...initial];

    (async () => {
      for (let i = 0; i < toResolve.length; i += BATCH_SIZE) {
        if (batch !== batchRef.current) return; // stale

        const chunk = toResolve.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
          chunk.map(async (item): Promise<MapItem | null> => {
            const coord = await resolveExperienceCoords({
              id: item.id,
              nome: item.nome,
              bairro: item.bairro,
              cidade: item.cidade,
              lat: (item as any).lat,
              lng: (item as any).lng,
            });
            if (!coord) return null;
            return {
              id: item.id,
              nome: item.nome,
              bairro: item.bairro,
              lat: coord.lat,
              lng: coord.lng,
              neighborhoodSlug: item.neighborhoodSlug,
            };
          })
        );

        if (batch !== batchRef.current) return; // stale
        const valid = results.filter(Boolean) as MapItem[];
        resolved = [...resolved, ...valid];
        setMapItems([...resolved]);
      }
    })();
  }, [items]);

  return mapItems;
}
