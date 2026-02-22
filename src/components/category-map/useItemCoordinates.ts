import { useMemo } from "react";
import { VALIDATED_NEIGHBORHOODS } from "@/lib/location-validation";
import { VALIDATED_LOCATIONS } from "@/data/validated-locations";
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
 * Resolves coordinates for experiencias using:
 * 1. VALIDATED_LOCATIONS by normalized name
 * 2. VALIDATED_NEIGHBORHOODS centroid by bairro (with jitter to avoid overlap)
 */
function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function resolveCoords(
  exp: ExternalExperiencia,
  index: number
): { lat: number; lng: number } | null {
  // Try validated locations by normalized name
  const key = normalizeKey(exp.nome);
  const validated = VALIDATED_LOCATIONS[key];
  if (validated) return { lat: validated.lat, lng: validated.lng };

  // Try neighborhood centroid with deterministic jitter
  const nh = VALIDATED_NEIGHBORHOODS[exp.bairro];
  if (nh) {
    // Small jitter so markers in same neighborhood don't stack
    const jitter = (index % 7 - 3) * 0.0008;
    const jitter2 = ((index * 3) % 5 - 2) * 0.0006;
    return { lat: nh.lat + jitter, lng: nh.lng + jitter2 };
  }

  return null;
}

export function useItemCoordinates(
  items: (ExternalExperiencia & { neighborhoodSlug: string })[]
): MapItem[] {
  return useMemo(() => {
    const result: MapItem[] = [];
    items.forEach((item, i) => {
      const coords = resolveCoords(item, i);
      if (coords) {
        result.push({
          id: item.id,
          nome: item.nome,
          bairro: item.bairro,
          lat: coords.lat,
          lng: coords.lng,
          neighborhoodSlug: item.neighborhoodSlug,
        });
      }
    });
    return result;
  }, [items]);
}
