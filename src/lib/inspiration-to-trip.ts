/**
 * INSPIRATION-TO-TRIP ENGINE
 * 
 * Maps a social media link analysis result (anchor) to a GeneratorInput
 * that drives the auto-roteiro-v2 itinerary generator.
 * 
 * RULES:
 * - Only uses places from the curated database
 * - Interprets the anchor's theme/activity to set preference weights
 * - Always generates a complete trip (hotel + restaurants + experiences)
 * - MVP: Rio de Janeiro only
 */

import type { PreferenceKey, GeneratorInput, TravelStyle } from "@/lib/auto-roteiro-v2";

export interface InspirationAnchor {
  interpretation: string;
  detected?: {
    location: string;
    city: string;
    activity: string;
    neighborhood?: string;
  };
  suggestions: Array<{
    type: "experience" | "restaurant" | "hotel";
    id: string;
    nome: string;
    bairro: string;
    meu_olhar?: string;
  }>;
  meta?: {
    title: string;
    description: string;
    siteName: string;
  };
  sourceUrl: string;
  source: "instagram" | "tiktok" | "link";
}

/**
 * Activity keywords → preference mapping
 * The anchor's activity/theme gets mapped to weighted preferences
 */
const ACTIVITY_PREFERENCE_MAP: Record<string, Partial<Record<PreferenceKey, number>>> = {
  // Nature & outdoors
  sunset: { relaxamento: 5, natureza: 4, gastronomia: 3 },
  beach: { natureza: 5, relaxamento: 4, gastronomia: 3 },
  praia: { natureza: 5, relaxamento: 4, gastronomia: 3 },
  "pôr do sol": { relaxamento: 5, natureza: 4, gastronomia: 3 },
  hike: { aventura: 5, natureza: 5, relaxamento: 2 },
  trilha: { aventura: 5, natureza: 5, relaxamento: 2 },
  nature: { natureza: 5, relaxamento: 4, aventura: 3 },
  natureza: { natureza: 5, relaxamento: 4, aventura: 3 },
  viewpoint: { natureza: 4, relaxamento: 4, cultura: 3 },
  mirante: { natureza: 4, relaxamento: 4, cultura: 3 },

  // Gastronomy
  food: { gastronomia: 5, cultura: 3, relaxamento: 2 },
  restaurant: { gastronomia: 5, cultura: 3, relaxamento: 3 },
  restaurante: { gastronomia: 5, cultura: 3, relaxamento: 3 },
  bar: { festa: 4, gastronomia: 4, relaxamento: 2 },
  café: { gastronomia: 4, relaxamento: 4, cultura: 3 },
  coffee: { gastronomia: 4, relaxamento: 4, cultura: 3 },
  "fine dining": { gastronomia: 5, relaxamento: 3, cultura: 2 },
  gastronomia: { gastronomia: 5, cultura: 3, relaxamento: 3 },

  // Culture
  museum: { cultura: 5, relaxamento: 3, gastronomia: 2 },
  museu: { cultura: 5, relaxamento: 3, gastronomia: 2 },
  art: { cultura: 5, relaxamento: 3, gastronomia: 2 },
  arte: { cultura: 5, relaxamento: 3, gastronomia: 2 },
  culture: { cultura: 5, gastronomia: 3, relaxamento: 3 },
  cultura: { cultura: 5, gastronomia: 3, relaxamento: 3 },
  history: { cultura: 5, relaxamento: 3, gastronomia: 2 },
  história: { cultura: 5, relaxamento: 3, gastronomia: 2 },

  // Adventure
  surf: { aventura: 5, natureza: 4, festa: 2 },
  sport: { aventura: 5, natureza: 3, relaxamento: 2 },
  adventure: { aventura: 5, natureza: 4, festa: 2 },
  aventura: { aventura: 5, natureza: 4, festa: 2 },

  // Nightlife
  nightlife: { festa: 5, gastronomia: 3, cultura: 2 },
  samba: { festa: 5, cultura: 4, gastronomia: 3 },
  party: { festa: 5, gastronomia: 3, aventura: 2 },
  festa: { festa: 5, gastronomia: 3, cultura: 3 },

  // Relaxation
  spa: { relaxamento: 5, gastronomia: 3, natureza: 3 },
  pool: { relaxamento: 5, natureza: 3, gastronomia: 3 },
  hotel: { relaxamento: 5, gastronomia: 4, natureza: 3 },
  luxury: { relaxamento: 4, gastronomia: 5, cultura: 3 },
};

const DEFAULT_PREFERENCES: Record<PreferenceKey, number> = {
  gastronomia: 3,
  natureza: 3,
  cultura: 2,
  aventura: 2,
  relaxamento: 3,
  festa: 1,
};

/**
 * Converts an inspiration anchor into weighted preferences for the itinerary generator
 */
export function anchorToPreferences(anchor: InspirationAnchor): Record<PreferenceKey, number> {
  const prefs: Record<PreferenceKey, number> = { ...DEFAULT_PREFERENCES };
  const activity = (anchor.detected?.activity || "").toLowerCase();
  const interpretation = (anchor.interpretation || "").toLowerCase();
  const combined = `${activity} ${interpretation}`;

  // Match against known activity patterns
  let matched = false;
  for (const [keyword, weights] of Object.entries(ACTIVITY_PREFERENCE_MAP)) {
    if (combined.includes(keyword)) {
      matched = true;
      for (const [pref, weight] of Object.entries(weights)) {
        const key = pref as PreferenceKey;
        prefs[key] = Math.max(prefs[key], weight);
      }
    }
  }

  // If no keyword matched, use suggestion types as signal
  if (!matched && anchor.suggestions.length > 0) {
    const types = anchor.suggestions.map((s) => s.type);
    if (types.includes("restaurant")) prefs.gastronomia = 4;
    if (types.includes("experience")) prefs.natureza = 4;
    if (types.includes("hotel")) prefs.relaxamento = 4;
  }

  return prefs;
}

/**
 * Determines travel style from the anchor context
 */
export function anchorToStyle(anchor: InspirationAnchor): TravelStyle {
  const combined = `${anchor.interpretation} ${anchor.detected?.activity || ""}`.toLowerCase();

  if (
    combined.includes("luxury") ||
    combined.includes("luxo") ||
    combined.includes("fine dining") ||
    combined.includes("premium") ||
    combined.includes("5 estrelas")
  ) {
    return "luxo";
  }

  if (
    combined.includes("barato") ||
    combined.includes("econômic") ||
    combined.includes("budget") ||
    combined.includes("mochileiro")
  ) {
    return "economico";
  }

  return null;
}

/**
 * Main function: converts an InspirationAnchor into a GeneratorInput
 */
export function inspirationToGeneratorInput(
  anchor: InspirationAnchor,
  days: number = 3
): GeneratorInput {
  return {
    city: anchor.detected?.city || "Rio de Janeiro",
    days,
    preferences: anchorToPreferences(anchor),
    style: anchorToStyle(anchor),
  };
}

/**
 * Extracts a human-readable theme label from the anchor
 */
export function getInspirationTheme(anchor: InspirationAnchor): string {
  const activity = anchor.detected?.activity || "";
  const neighborhood = anchor.detected?.neighborhood || "";

  if (activity && neighborhood) {
    return `${activity} em ${neighborhood}`;
  }
  if (activity) return activity;
  if (neighborhood) return neighborhood;
  return "Rio de Janeiro";
}
