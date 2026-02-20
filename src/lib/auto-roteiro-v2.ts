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

/**
 * AUTO-ROTEIRO V2 — Preference-aware itinerary generator
 *
 * Scoring:
 *   score = base(1) + preference_match(0-10) + editorial(0-20)
 *         + style_bonus(0-10) - diversity_penalty(0-15) + jitter(0-3)
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
}

export interface DayPlan {
  dayIndex: number;
  slots: Record<SlotKind, SlotItem | null>;
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
  priceLevel: number; // 1-4
  mealTypes?: string[];
  bestTime?: string;
  iconic?: boolean;
  isNightlife?: boolean;
  source: "curated";
  score: number;
  scoreBreakdown: string;
}

function scoreCandidate(
  candidate: Omit<ScoredCandidate, "score" | "scoreBreakdown">,
  preferences: Record<PreferenceKey, number>,
  style: TravelStyle,
  usedBairrosToday: Set<string>,
  lastCategory: string | null
): ScoredCandidate {
  let score = 1;
  const parts: string[] = ["base:1"];

  // Preference match (best matching tag × 10)
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

  // Diversity penalties
  if (usedBairrosToday.has(candidate.neighborhood)) {
    score -= 15;
    parts.push("bairro_rep:-15");
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
  }));
}

// ─── Slot selection helpers ──────────────────────────────────────

function pickBest(
  candidates: Omit<ScoredCandidate, "score" | "scoreBreakdown">[],
  preferences: Record<PreferenceKey, number>,
  style: TravelStyle,
  usedBairros: Set<string>,
  lastCat: string | null,
  usedIds: Set<string>,
  filter?: (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => boolean
): ScoredCandidate | null {
  let pool = candidates.filter((c) => !usedIds.has(c.id));
  if (filter) pool = pool.filter(filter);
  if (pool.length === 0) return null;

  const scored = pool.map((c) =>
    scoreCandidate(c, preferences, style, usedBairros, lastCat)
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
  };
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

  log.push(`=== Gerando roteiro: ${days} dias ===`);
  log.push(`Preferências: ${JSON.stringify(preferences)}`);
  log.push(`Estilo: ${style || "nenhum"}`);
  log.push(`Restaurantes: ${restaurants.length}, Atividades: ${activities.length}, Nightlife: ${nightlife.length}`);

  const dayPlans: DayPlan[] = [];

  for (let d = 1; d <= days; d++) {
    const usedBairros = new Set<string>();
    let lastCat: string | null = null;
    const slots: Record<SlotKind, SlotItem | null> = {
      morning: null,
      lunch: null,
      afternoon: null,
      evening: null,
      extra: null,
    };

    log.push(`\n--- Dia ${d} ---`);

    // ── MORNING: prefer natureza/cultura/relaxamento activities ──
    const morningFilter = (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => {
      if (c.bestTime === "pôr do sol") return false;
      if (c.bestTime === "manhã" || c.bestTime === "qualquer" || !c.bestTime) return true;
      return true;
    };

    // Prefer adventure if weight high
    const morningTagFilter = aventuraWeight >= 4
      ? (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => morningFilter(c) && c.tags.some(t => t === "aventura" || t === "natureza")
      : morningFilter;

    let morning = pickBest(activities, preferences, style, usedBairros, lastCat, usedIds, morningTagFilter);
    if (!morning && aventuraWeight >= 4) {
      morning = pickBest(activities, preferences, style, usedBairros, lastCat, usedIds, morningFilter);
    }
    if (morning) {
      slots.morning = toSlotItem(morning, "morning");
      usedIds.add(morning.id);
      usedBairros.add(morning.neighborhood);
      lastCat = morning.category;
      log.push(`  Manhã: ${morning.name} [${morning.scoreBreakdown}]`);
    } else {
      log.push(`  Manhã: VAZIO (sem candidatos)`);
    }

    // ── LUNCH: restaurant ──
    const lunchFilter = (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => {
      if (!c.mealTypes) return true;
      return c.mealTypes.includes("lunch") || c.mealTypes.includes("brunch");
    };

    const lunchGastroFilter = gastroWeight >= 4
      ? (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => lunchFilter(c) && c.priceLevel >= 3
      : lunchFilter;

    let lunch = pickBest(restaurants, preferences, style, usedBairros, lastCat, usedIds, lunchGastroFilter);
    if (!lunch && gastroWeight >= 4) {
      lunch = pickBest(restaurants, preferences, style, usedBairros, lastCat, usedIds, lunchFilter);
    }
    if (lunch) {
      slots.lunch = toSlotItem(lunch, "lunch");
      usedIds.add(lunch.id);
      usedBairros.add(lunch.neighborhood);
      lastCat = lunch.category;
      log.push(`  Almoço: ${lunch.name} [${lunch.scoreBreakdown}]`);
    } else {
      log.push(`  Almoço: VAZIO`);
    }

    // ── AFTERNOON: activity (cultura/natureza/aventura) ──
    const afternoonFilter = (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => {
      if (c.bestTime === "manhã") return false; // already passed
      return true;
    };

    // Prefer cultura if weight high
    const afternoonTagFilter = culturaWeight >= 4
      ? (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => afternoonFilter(c) && c.tags.includes("cultura")
      : relaxWeight >= 4
      ? (c: Omit<ScoredCandidate, "score" | "scoreBreakdown">) => afternoonFilter(c) && c.tags.includes("relaxamento")
      : afternoonFilter;

    let afternoon = pickBest(activities, preferences, style, usedBairros, lastCat, usedIds, afternoonTagFilter);
    if (!afternoon) {
      afternoon = pickBest(activities, preferences, style, usedBairros, lastCat, usedIds, afternoonFilter);
    }
    if (afternoon) {
      slots.afternoon = toSlotItem(afternoon, "afternoon");
      usedIds.add(afternoon.id);
      usedBairros.add(afternoon.neighborhood);
      lastCat = afternoon.category;
      log.push(`  Tarde: ${afternoon.name} [${afternoon.scoreBreakdown}]`);
    } else {
      log.push(`  Tarde: VAZIO`);
    }

    // ── EVENING: restaurant OR nightlife ──
    const useNightlife = festaWeight >= 4 && d % 2 === 0; // alternate days

    if (useNightlife) {
      const eveningNight = pickBest(nightlife, preferences, style, usedBairros, lastCat, usedIds);
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

      let dinner = pickBest(restaurants, preferences, style, usedBairros, lastCat, usedIds, dinnerGastroFilter);
      if (!dinner && gastroWeight >= 4) {
        dinner = pickBest(restaurants, preferences, style, usedBairros, lastCat, usedIds, dinnerFilter);
      }
      if (dinner) {
        slots.evening = toSlotItem(dinner, "evening");
        usedIds.add(dinner.id);
        usedBairros.add(dinner.neighborhood);
        lastCat = dinner.category;
        log.push(`  Noite: ${dinner.name} [${dinner.scoreBreakdown}]`);
      } else {
        log.push(`  Noite: VAZIO`);
      }
    }

    // ── EXTRA: short item (café/mirante/bar) ──
    const extraCandidates = [
      ...restaurants.filter((r) =>
        r.mealTypes?.some((m) => ["breakfast", "brunch", "drinks"].includes(m))
      ),
      ...activities.filter((a) => a.bestTime === "pôr do sol"),
    ];
    const extra = pickBest(extraCandidates, preferences, style, usedBairros, lastCat, usedIds);
    if (extra) {
      slots.extra = toSlotItem(extra, "extra");
      usedIds.add(extra.id);
      log.push(`  Extra: ${extra.name} [${extra.scoreBreakdown}]`);
    }

    dayPlans.push({ dayIndex: d, slots });
  }

  const totalItemsPlaced = dayPlans.reduce(
    (acc, dp) => acc + Object.values(dp.slots).filter(Boolean).length,
    0
  );
  log.push(`\n=== Total: ${totalItemsPlaced} itens em ${days} dias ===`);

  return { days: dayPlans, log, totalItemsPlaced };
}

// ─── Persist to roteiro_itens ────────────────────────────────────

export async function persistItineraryToDb(
  roteiroId: string,
  result: GeneratorResult
): Promise<void> {
  // Delete existing items for this roteiro
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
      prefs[s as PreferenceKey] = 5; // selected = max weight
    }
  }

  // Default weights for unselected (so itinerary isn't empty)
  for (const key of Object.keys(prefs) as PreferenceKey[]) {
    if (prefs[key] === 0) prefs[key] = 1;
  }

  return prefs;
}
