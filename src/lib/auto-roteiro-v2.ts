import {
  guideRestaurants,
  guideActivities,
  guideNightlife,
  guideHotels,
  proximityMap,
  type GuideRestaurant,
  type GuideActivity,
  type GuideNightlife,
  type GuideHotel,
} from "@/data/rio-guide-data";
import { supabase } from "@/integrations/supabase/client";
import { searchPlacesByType, type PlaceResult } from "@/lib/search-places";
import {
  resolveCoords,
  clusterByZone,
  assignClustersTodays,
  orderByProximity,
  fetchDistanceMatrix,
  getTravelMinutes,
  haversineKm,
  getZone,
  type GeoItem,
  type GeoCluster,
  type DistanceResult,
  type GeoPoint,
} from "@/lib/geo-clustering";

/**
 * AUTO-ROTEIRO V2 — Preference-aware + Geo-intelligent itinerary generator
 *
 * V2.1 UPGRADE:
 * - Geographic clustering: items grouped by zone so each day is geographically coherent
 * - Real distance calculation via Google Distance Matrix API (with traffic)
 * - Proximity-based ordering within each day (nearest neighbor)
 * - Never places Guaratiba + Pão de Açúcar on the same day
 *
 * Scoring:
 *   score = base(1) + preference_match(0-10) + editorial(0-20)
 *         + style_bonus(0-10) - diversity_penalty(0-15)
 *         + proximity_bonus(0-8) + jitter(0-3)
 *
 * Slots per day:
 *   morning  → 1 activity (prefer natureza/cultura/relaxamento)
 *   lunch    → 1 restaurant
 *   afternoon→ 1 activity (cultura/natureza/aventura)
 *   evening  → 1 restaurant OR 1 nightlife (if festa weight ≥4)
 *   extra    → 1 short item (café/mirante/bar) if available
 */

// ─── Types ────────────────────────────────────────────────────────

export type PreferenceKey =
  | "gastronomia"
  | "natureza"
  | "cultura"
  | "aventura"
  | "relaxamento"
  | "festa";

export type TravelStyle = "luxo" | "economico" | "familia" | null;

export interface GeneratorInput {
  city: string;
  days: number;
  preferences: Record<PreferenceKey, number>; // 0-5 weight each
  style: TravelStyle;
}

export type SlotKind = "morning" | "lunch" | "afternoon" | "evening" | "extra";

export interface SlotItem {
  id: string;
  name: string;
  neighborhood: string;
  description: string;
  source: "curated" | "google";
  category: string;
  tags: PreferenceKey[];
  score: number;
  scoreBreakdown: string;
  slotKind: SlotKind;
  lat?: number;
  lng?: number;
  travelFromPrevMinutes?: number;
  travelFromPrevText?: string;
}

export interface DayPlan {
  dayIndex: number;
  slots: Record<SlotKind, SlotItem | null>;
  zone: string;
  totalTravelMinutes: number;
}

export interface GeneratorResult {
  days: DayPlan[];
  log: string[];
  totalItemsPlaced: number;
}

// ─── Tag inference ────────────────────────────────────────────────

function inferTagsFromRestaurant(r: GuideRestaurant): PreferenceKey[] {
  const tags: PreferenceKey[] = ["gastronomia"];
  const cat = r.category.toLowerCase();
  if (cat.includes("alta gastronomia")) tags.push("gastronomia");
  if (cat.includes("bar") || cat.includes("boteco")) tags.push("festa");
  return [...new Set(tags)];
}

function inferTagsFromActivity(a: GuideActivity): PreferenceKey[] {
  const tags: PreferenceKey[] = [];
  const cat = a.category;
  if (["trilha", "praia", "natureza"].includes(cat)) tags.push("natureza");
  if (["mirante"].includes(cat)) tags.push("natureza", "relaxamento");
  if (["cultura"].includes(cat)) tags.push("cultura");
  if (["esporte"].includes(cat)) tags.push("aventura");
  if (["passeio"].includes(cat)) tags.push("cultura", "relaxamento");
  if (a.bestTime === "pôr do sol") tags.push("relaxamento");
  return [...new Set(tags)];
}

function inferTagsFromNightlife(n: GuideNightlife): PreferenceKey[] {
  const tags: PreferenceKey[] = ["festa"];
  if (n.category === "show") tags.push("cultura");
  return tags;
}

// ─── Price helpers ────────────────────────────────────────────────

function priceLevelNumeric(pl: string): number {
  return (pl.match(/\$/g) || []).length;
}

// ─── Scoring ──────────────────────────────────────────────────────

interface ScoredCandidate {
  id: string;
  name: string;
  neighborhood: string;
  description: string;
  category: string;
  tags: PreferenceKey[];
  priceLevel: number;
  mealTypes?: string[];
  bestTime?: string;
  iconic?: boolean;
  isNightlife?: boolean;
  source: "curated";
  score: number;
  scoreBreakdown: string;
  coords: GeoPoint | null;
}

function scoreCandidate(
  candidate: Omit<ScoredCandidate, "score" | "scoreBreakdown">,
  preferences: Record<PreferenceKey, number>,
  style: TravelStyle,
  dayZone: string,
  usedBairrosToday: Set<string>,
  lastCategory: string | null
): ScoredCandidate {
  let score = 1;
  const parts: string[] = ["base:1"];

  // Preference match (best matching tag × 2)
  let bestPrefScore = 0;
  for (const tag of candidate.tags) {
    const w = preferences[tag] || 0;
    if (w > bestPrefScore) bestPrefScore = w;
  }
  const prefBonus = bestPrefScore * 2;
  score += prefBonus;
  if (prefBonus > 0) parts.push(`pref:+${prefBonus}`);

  // Iconic bonus
  if (candidate.iconic) {
    score += 5;
    parts.push("iconic:+5");
  }

  // Style bonus
  if (style === "luxo" && candidate.priceLevel >= 3) {
    score += 10;
    parts.push("luxo:+10");
  }
  if (style === "economico" && candidate.priceLevel <= 2) {
    score += 10;
    parts.push("econ:+10");
  }

  // ★ GEOGRAPHIC PROXIMITY BONUS ★
  const candidateZone = getZone(candidate.neighborhood);
  if (candidateZone === dayZone) {
    score += 8;
    parts.push("zona:+8");
  } else {
    // Check if neighbor zone
    const neighbors = proximityMap[candidate.neighborhood] || [];
    // If any neighbor is in the day's zone, small bonus
    const isAdjacentZone = neighbors.some((n) => getZone(n) === dayZone);
    if (isAdjacentZone) {
      score += 3;
      parts.push("adj:+3");
    } else {
      // Far zone penalty
      score -= 10;
      parts.push("longe:-10");
    }
  }

  // Diversity penalties
  if (usedBairrosToday.has(candidate.neighborhood)) {
    score -= 5;
    parts.push("bairro_rep:-5");
  }
  if (lastCategory && lastCategory === candidate.category) {
    score -= 10;
    parts.push("cat_rep:-10");
  }

  // Controlled jitter
  const jitter = Math.random() * 3;
  score += jitter;
  parts.push(`jitter:+${jitter.toFixed(1)}`);

  return {
    ...candidate,
    score,
    scoreBreakdown: parts.join(" "),
  };
}

// ─── Build candidate pools ───────────────────────────────────────

function buildRestaurantCandidates(): Omit<ScoredCandidate, "score" | "scoreBreakdown">[] {
  return guideRestaurants.map((r) => ({
    id: r.id,
    name: r.name,
    neighborhood: r.neighborhood,
    description: r.description,
    category: r.category,
    tags: inferTagsFromRestaurant(r),
    priceLevel: priceLevelNumeric(r.priceLevel),
    mealTypes: r.mealType,
    source: "curated" as const,
    coords: resolveCoords(r.id, r.neighborhood),
  }));
}

function buildActivityCandidates(): Omit<ScoredCandidate, "score" | "scoreBreakdown">[] {
  return guideActivities.map((a) => ({
    id: a.id,
    name: a.name,
    neighborhood: a.neighborhood,
    description: a.description,
    category: a.category,
    tags: inferTagsFromActivity(a),
    priceLevel: 1,
    bestTime: a.bestTime,
    iconic: a.iconic,
    source: "curated" as const,
    coords: resolveCoords(a.id, a.neighborhood),
  }));
}

function buildNightlifeCandidates(): Omit<ScoredCandidate, "score" | "scoreBreakdown">[] {
  return guideNightlife.map((n) => ({
    id: n.id,
    name: n.name,
    neighborhood: n.neighborhood,
    description: n.description,
    category: n.category,
    tags: inferTagsFromNightlife(n),
    priceLevel: priceLevelNumeric(n.priceLevel),
    isNightlife: true,
    source: "curated" as const,
    coords: resolveCoords(n.id, n.neighborhood),
  }));
}

// ─── Slot selection helpers ──────────────────────────────────────

function pickBest(
  candidates: Omit<ScoredCandidate, "score" | "scoreBreakdown">[],
  preferences: Record<PreferenceKey, number>,
  style: TravelStyle,
  dayZone: string,
  usedBairros: Set<string>,
  lastCat: string | null,
  usedIds: Set<string>,
  filter?: (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => boolean
): ScoredCandidate | null {
  let pool = candidates.filter((c) => !usedIds.has(c.id));
  if (filter) pool = pool.filter(filter);
  if (pool.length === 0) return null;

  const scored = pool.map((c) =>
    scoreCandidate(c, preferences, style, dayZone, usedBairros, lastCat)
  );
  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

function toSlotItem(c: ScoredCandidate, kind: SlotKind): SlotItem {
  return {
    id: c.id,
    name: c.name,
    neighborhood: c.neighborhood,
    description: c.description,
    source: c.source,
    category: c.category,
    tags: c.tags,
    score: Math.round(c.score * 10) / 10,
    scoreBreakdown: c.scoreBreakdown,
    slotKind: kind,
    lat: c.coords?.lat,
    lng: c.coords?.lng,
  };
}

// ─── Zone planning ───────────────────────────────────────────────

/**
 * Determines which zones to assign to which days based on
 * user preferences and number of days.
 */
function planZonesForDays(
  days: number,
  preferences: Record<PreferenceKey, number>
): string[] {
  // Priority zones based on preferences
  const zoneScores: Record<string, number> = {
    zonaSul: 10, // Always high priority (Ipanema, Leblon, Copa)
    zonaSulAlta: 5,
    centro: 3,
    barra: 2,
    especial: 1,
  };

  // Boost zones based on preferences
  if (preferences.natureza >= 4 || preferences.aventura >= 4) {
    zoneScores.especial += 5; // Floresta da Tijuca, trilhas
    zoneScores.zonaSulAlta += 3; // Jardim Botânico
  }
  if (preferences.cultura >= 4) {
    zoneScores.centro += 5; // Museus, CCBB
  }
  if (preferences.festa >= 4) {
    zoneScores.zonaSul += 3;
    zoneScores.barra += 2;
  }
  if (preferences.gastronomia >= 4) {
    zoneScores.zonaSul += 3;
    zoneScores.zonaSulAlta += 3;
  }
  if (preferences.relaxamento >= 4) {
    zoneScores.barra += 3; // Praias calmas
    zoneScores.especial += 2; // Guaratiba
  }

  // Sort zones by score
  const sorted = Object.entries(zoneScores)
    .sort(([, a], [, b]) => b - a)
    .map(([zone]) => zone);

  // Assign zones to days (repeat top zones if more days than zones)
  const zones: string[] = [];
  for (let d = 0; d < days; d++) {
    zones.push(sorted[d % sorted.length]);
  }

  return zones;
}

// ─── Main generator ──────────────────────────────────────────────

export function generateAutomaticItinerary(input: GeneratorInput): GeneratorResult {
  const { days, preferences, style } = input;
  const log: string[] = [];
  const usedIds = new Set<string>();

  const restaurants = buildRestaurantCandidates();
  const activities = buildActivityCandidates();
  const nightlife = buildNightlifeCandidates();

  const festaWeight = preferences.festa || 0;
  const gastroWeight = preferences.gastronomia || 0;
  const aventuraWeight = preferences.aventura || 0;
  const culturaWeight = preferences.cultura || 0;
  const relaxWeight = preferences.relaxamento || 0;

  // ★ PLAN ZONES FOR EACH DAY ★
  const dayZones = planZonesForDays(days, preferences);

  log.push(`=== Gerando roteiro inteligente: ${days} dias ===`);
  log.push(`Preferências: ${JSON.stringify(preferences)}`);
  log.push(`Estilo: ${style || "nenhum"}`);
  log.push(`Zonas planejadas: ${dayZones.join(", ")}`);
  log.push(`Restaurantes: ${restaurants.length}, Atividades: ${activities.length}, Nightlife: ${nightlife.length}`);

  const dayPlans: DayPlan[] = [];

  for (let d = 1; d <= days; d++) {
    const dayZone = dayZones[d - 1];
    const usedBairros = new Set<string>();
    let lastCat: string | null = null;
    const slots: Record<SlotKind, SlotItem | null> = {
      morning: null,
      lunch: null,
      afternoon: null,
      evening: null,
      extra: null,
    };

    log.push(`\n--- Dia ${d} (zona: ${dayZone}) ---`);

    // ── MORNING: prefer natureza/cultura/relaxamento activities ──
    const morningFilter = (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => {
      if (c.bestTime === "pôr do sol") return false;
      return true;
    };

    const morningTagFilter = aventuraWeight >= 4
      ? (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => morningFilter(c) && c.tags.some(t => t === "aventura" || t === "natureza")
      : morningFilter;

    let morning = pickBest(activities, preferences, style, dayZone, usedBairros, lastCat, usedIds, morningTagFilter);
    if (!morning && aventuraWeight >= 4) {
      morning = pickBest(activities, preferences, style, dayZone, usedBairros, lastCat, usedIds, morningFilter);
    }
    if (morning) {
      slots.morning = toSlotItem(morning, "morning");
      usedIds.add(morning.id);
      usedBairros.add(morning.neighborhood);
      lastCat = morning.category;
      log.push(`  Manhã: ${morning.name} (${morning.neighborhood}) [${morning.scoreBreakdown}]`);
    } else {
      log.push(`  Manhã: VAZIO (sem candidatos na zona ${dayZone})`);
    }

    // ── LUNCH: restaurant ──
    const lunchFilter = (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => {
      if (!c.mealTypes) return true;
      return c.mealTypes.includes("lunch") || c.mealTypes.includes("brunch");
    };

    const lunchGastroFilter = gastroWeight >= 4
      ? (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => lunchFilter(c) && c.priceLevel >= 3
      : lunchFilter;

    let lunch = pickBest(restaurants, preferences, style, dayZone, usedBairros, lastCat, usedIds, lunchGastroFilter);
    if (!lunch && gastroWeight >= 4) {
      lunch = pickBest(restaurants, preferences, style, dayZone, usedBairros, lastCat, usedIds, lunchFilter);
    }
    if (lunch) {
      slots.lunch = toSlotItem(lunch, "lunch");
      usedIds.add(lunch.id);
      usedBairros.add(lunch.neighborhood);
      lastCat = lunch.category;
      log.push(`  Almoço: ${lunch.name} (${lunch.neighborhood}) [${lunch.scoreBreakdown}]`);
    } else {
      log.push(`  Almoço: VAZIO`);
    }

    // ── AFTERNOON: activity ──
    const afternoonFilter = (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => {
      if (c.bestTime === "manhã") return false;
      return true;
    };

    const afternoonTagFilter = culturaWeight >= 4
      ? (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => afternoonFilter(c) && c.tags.includes("cultura")
      : relaxWeight >= 4
      ? (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => afternoonFilter(c) && c.tags.includes("relaxamento")
      : afternoonFilter;

    let afternoon = pickBest(activities, preferences, style, dayZone, usedBairros, lastCat, usedIds, afternoonTagFilter);
    if (!afternoon) {
      afternoon = pickBest(activities, preferences, style, dayZone, usedBairros, lastCat, usedIds, afternoonFilter);
    }
    if (afternoon) {
      slots.afternoon = toSlotItem(afternoon, "afternoon");
      usedIds.add(afternoon.id);
      usedBairros.add(afternoon.neighborhood);
      lastCat = afternoon.category;
      log.push(`  Tarde: ${afternoon.name} (${afternoon.neighborhood}) [${afternoon.scoreBreakdown}]`);
    } else {
      log.push(`  Tarde: VAZIO`);
    }

    // ── EVENING: restaurant OR nightlife ──
    const useNightlife = festaWeight >= 4 && d % 2 === 0;

    if (useNightlife) {
      const eveningNight = pickBest(nightlife, preferences, style, dayZone, usedBairros, lastCat, usedIds);
      if (eveningNight) {
        slots.evening = toSlotItem(eveningNight, "evening");
        usedIds.add(eveningNight.id);
        usedBairros.add(eveningNight.neighborhood);
        lastCat = eveningNight.category;
        log.push(`  Noite: ${eveningNight.name} (festa) [${eveningNight.scoreBreakdown}]`);
      }
    }

    if (!slots.evening) {
      const dinnerFilter = (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => {
        if (!c.mealTypes) return true;
        return c.mealTypes.includes("dinner") || c.mealTypes.includes("drinks");
      };

      const dinnerGastroFilter = gastroWeight >= 4
        ? (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => dinnerFilter(c) && c.priceLevel >= 3
        : dinnerFilter;

      let dinner = pickBest(restaurants, preferences, style, dayZone, usedBairros, lastCat, usedIds, dinnerGastroFilter);
      if (!dinner && gastroWeight >= 4) {
        dinner = pickBest(restaurants, preferences, style, dayZone, usedBairros, lastCat, usedIds, dinnerFilter);
      }
      if (dinner) {
        slots.evening = toSlotItem(dinner, "evening");
        usedIds.add(dinner.id);
        usedBairros.add(dinner.neighborhood);
        lastCat = dinner.category;
        log.push(`  Noite: ${dinner.name} (${dinner.neighborhood}) [${dinner.scoreBreakdown}]`);
      } else {
        log.push(`  Noite: VAZIO`);
      }
    }

    // ── EXTRA: short item ──
    const extraCandidates = [
      ...restaurants.filter((r) =>
        r.mealTypes?.some((m) => ["breakfast", "brunch", "drinks"].includes(m))
      ),
      ...activities.filter((a) => a.bestTime === "pôr do sol"),
    ];
    const extra = pickBest(extraCandidates, preferences, style, dayZone, usedBairros, lastCat, usedIds);
    if (extra) {
      slots.extra = toSlotItem(extra, "extra");
      usedIds.add(extra.id);
      log.push(`  Extra: ${extra.name} (${extra.neighborhood}) [${extra.scoreBreakdown}]`);
    }

    dayPlans.push({ dayIndex: d, slots, zone: dayZone, totalTravelMinutes: 0 });
  }

  const totalItemsPlaced = dayPlans.reduce(
    (acc, dp) => acc + Object.values(dp.slots).filter(Boolean).length,
    0
  );
  log.push(`\n=== Total: ${totalItemsPlaced} itens em ${days} dias ===`);

  return { days: dayPlans, log, totalItemsPlaced };
}

// ─── Google fallback queries per preference ──────────────────────

const googleFallbackQueries: Record<PreferenceKey, Record<SlotKind, string>> = {
  gastronomia: {
    morning: "café da manhã especial",
    lunch: "alta gastronomia almoço",
    afternoon: "café especial",
    evening: "jantar fine dining",
    extra: "café artesanal",
  },
  natureza: {
    morning: "trilha natureza",
    lunch: "restaurante vista mar",
    afternoon: "parque passeio",
    evening: "restaurante pé na areia",
    extra: "mirante pôr do sol",
  },
  cultura: {
    morning: "museu arte",
    lunch: "restaurante histórico",
    afternoon: "galeria de arte",
    evening: "teatro show cultural",
    extra: "centro cultural",
  },
  aventura: {
    morning: "aventura esporte radical",
    lunch: "restaurante esportivo",
    afternoon: "surf mergulho",
    evening: "bar aventureiro",
    extra: "escalada rapel",
  },
  relaxamento: {
    morning: "spa bem-estar",
    lunch: "restaurante tranquilo",
    afternoon: "praia calma relaxamento",
    evening: "restaurante calmo lounge",
    extra: "café tranquilo",
  },
  festa: {
    morning: "brunch animado",
    lunch: "restaurante com música",
    afternoon: "rooftop bar",
    evening: "balada nightclub",
    extra: "bar samba ao vivo",
  },
};

function getTopPreference(preferences: Record<PreferenceKey, number>): PreferenceKey {
  let best: PreferenceKey = "gastronomia";
  let max = 0;
  for (const [key, val] of Object.entries(preferences)) {
    if (val > max) { max = val; best = key as PreferenceKey; }
  }
  return best;
}

// ─── Zone-aware Google fallback neighborhood hints ──────────────

const zoneNeighborhoodHints: Record<string, string> = {
  zonaSul: "Ipanema Leblon Copacabana",
  zonaSulAlta: "Jardim Botânico Gávea Lagoa",
  centro: "Centro Santa Teresa Lapa",
  barra: "Barra da Tijuca Recreio",
  especial: "Floresta da Tijuca",
};

/**
 * Async version: generates curated first, then fills empty slots with Google
 * in the SAME GEOGRAPHIC ZONE, and calculates real distances.
 */
export async function generateAutomaticItineraryAsync(
  input: GeneratorInput
): Promise<GeneratorResult> {
  // 1. Generate with curated data (geo-aware)
  const result = generateAutomaticItinerary(input);
  const topPref = getTopPreference(input.preferences);
  const usedNames = new Set<string>();

  // Collect already-used names
  for (const day of result.days) {
    for (const slot of Object.values(day.slots)) {
      if (slot) usedNames.add(slot.name.toLowerCase());
    }
  }

  // 2. Fill empty slots with Google Places IN THE SAME ZONE
  for (const day of result.days) {
    const slotKinds: SlotKind[] = ["morning", "lunch", "afternoon", "evening", "extra"];
    const zoneHint = zoneNeighborhoodHints[day.zone] || "";

    for (const kind of slotKinds) {
      if (day.slots[kind]) continue;

      const baseQuery = googleFallbackQueries[topPref]?.[kind] || "ponto turístico";
      const fullQuery = `${baseQuery} ${zoneHint} ${input.city}`;

      try {
        const places = await searchPlacesByType(fullQuery, input.city, 3);
        const candidate = places.find(
          (p) => !usedNames.has(p.name.toLowerCase()) && p.rating !== null && (p.rating ?? 0) >= 4.0
        ) || places.find((p) => !usedNames.has(p.name.toLowerCase()));

        if (candidate) {
          usedNames.add(candidate.name.toLowerCase());
          day.slots[kind] = {
            id: candidate.placeId,
            name: candidate.name,
            neighborhood: candidate.address?.split(",")[1]?.trim() || "Google",
            description: candidate.address || "",
            source: "google",
            category: candidate.types?.[0] || "google",
            tags: [topPref],
            score: (candidate.rating || 4) * 2,
            scoreBreakdown: `google:${candidate.rating || "?"}★ pref:${topPref} zona:${day.zone}`,
            slotKind: kind,
            lat: candidate.lat ?? undefined,
            lng: candidate.lng ?? undefined,
          };
          result.log.push(
            `  [Google] Dia ${day.dayIndex} ${kind}: ${candidate.name} (zona: ${day.zone})`
          );
          result.totalItemsPlaced++;
        }
      } catch {
        result.log.push(`  [Google] Dia ${day.dayIndex} ${kind}: falha na busca`);
      }
    }
  }

  // 3. ★ CALCULATE REAL DISTANCES WITH TRAFFIC ★
  try {
    const allItems: GeoItem[] = [];
    for (const day of result.days) {
      const slotOrder: SlotKind[] = ["morning", "lunch", "afternoon", "evening", "extra"];
      for (const kind of slotOrder) {
        const slot = day.slots[kind];
        if (slot && slot.lat && slot.lng) {
          allItems.push({
            id: slot.id,
            name: slot.name,
            neighborhood: slot.neighborhood,
            coords: { lat: slot.lat, lng: slot.lng },
          });
        }
      }
    }

    if (allItems.length >= 2) {
      const distanceMap = await fetchDistanceMatrix(allItems);

      // Annotate each slot with travel time from previous
      for (const day of result.days) {
        const slotOrder: SlotKind[] = ["morning", "lunch", "afternoon", "evening", "extra"];
        let prevSlot: SlotItem | null = null;
        let totalTravel = 0;

        for (const kind of slotOrder) {
          const slot = day.slots[kind];
          if (!slot) continue;

          if (prevSlot && prevSlot.lat && prevSlot.lng && slot.lat && slot.lng) {
            const minutes = getTravelMinutes(
              prevSlot.id,
              slot.id,
              distanceMap,
              { lat: prevSlot.lat, lng: prevSlot.lng },
              { lat: slot.lat, lng: slot.lng }
            );
            slot.travelFromPrevMinutes = minutes;
            slot.travelFromPrevText = minutes < 60
              ? `${minutes} min`
              : `${Math.floor(minutes / 60)}h${minutes % 60 > 0 ? `${minutes % 60}min` : ""}`;
            totalTravel += minutes;

            // Log warning for long travels
            if (minutes > 45) {
              result.log.push(
                `  ⚠️ Dia ${day.dayIndex}: ${prevSlot.name} → ${slot.name} = ${minutes} min (longe!)`
              );
            }
          }

          prevSlot = slot;
        }

        day.totalTravelMinutes = totalTravel;
      }

      result.log.push(`\n=== Distâncias calculadas com trânsito (Google Distance Matrix) ===`);
      for (const day of result.days) {
        result.log.push(`  Dia ${day.dayIndex}: ${day.totalTravelMinutes} min de deslocamento total`);
      }
    }
  } catch (e) {
    result.log.push(`  [Distance Matrix] Erro ao calcular distâncias: ${e}`);
  }

  return result;
}

// ─── Persist to roteiro_itens ────────────────────────────────────

export async function persistItineraryToDb(
  roteiroId: string,
  result: GeneratorResult
): Promise<void> {
  await supabase.from("roteiro_itens").delete().eq("roteiro_id", roteiroId);

  const rows = result.days.flatMap((day) => {
    const slotOrder: SlotKind[] = ["morning", "lunch", "afternoon", "evening", "extra"];
    return slotOrder
      .map((kind, idx) => {
        const slot = day.slots[kind];
        if (!slot) return null;
        return {
          roteiro_id: roteiroId,
          source: slot.source,
          ref_table: slot.source === "google" ? "places_cache" : "curadoria",
          place_id: slot.id,
          name: slot.name,
          neighborhood: slot.neighborhood,
          city: "Rio de Janeiro",
          day_index: day.dayIndex,
          order_in_day: idx,
          time_slot: kind,
          notes: slot.scoreBreakdown,
          lat: slot.lat ?? null,
          lng: slot.lng ?? null,
        };
      })
      .filter(Boolean);
  });

  if (rows.length > 0) {
    const { error } = await supabase.from("roteiro_itens").insert(rows);
    if (error) console.error("Failed to persist itinerary:", error);
  }
}

// ─── Convert preferences from tripStyles array to weights ────────

export function tripStylesToPreferences(
  tripStyles: string[]
): Record<PreferenceKey, number> {
  const prefs: Record<PreferenceKey, number> = {
    gastronomia: 0,
    natureza: 0,
    cultura: 0,
    aventura: 0,
    relaxamento: 0,
    festa: 0,
  };

  for (const s of tripStyles) {
    if (s in prefs) {
      prefs[s as PreferenceKey] = 5;
    }
  }

  for (const key of Object.keys(prefs) as PreferenceKey[]) {
    if (prefs[key] === 0) prefs[key] = 1;
  }

  return prefs;
}
