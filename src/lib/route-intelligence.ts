/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROUTE INTELLIGENCE v1.5 — STRUCTURAL LOCK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GOAL:
 * Lightweight intelligence layer for "Meu Roteiro" that helps users
 * evaluate and improve their saved itinerary WITHOUT changing UI or layout.
 * 
 * CORE PRINCIPLES:
 * ═══════════════════════════════════════════════════════════════════════════
 * - This is an INVISIBLE logic layer only
 * - Execute SILENTLY — no UI, no alerts, no badges
 * - NEVER auto-reorder items
 * - NEVER block user actions
 * - NEVER force corrections
 * - All analysis is PASSIVE and ADVISORY only
 * 
 * ACTIVATION RULES:
 * ═══════════════════════════════════════════════════════════════════════════
 * - Activates ONLY when user explicitly requests "Improve my itinerary"
 * - Or when user opens the IA flow related to roteiro
 * - NO automatic interruptions
 * 
 * SCOPE LIMITATIONS:
 * ═══════════════════════════════════════════════════════════════════════════
 * - No hours / time slots
 * - No calendar logic
 * - No booking / prices / tickets
 * - No maps rendered (coordinates used for distance only)
 * 
 * SCALABILITY:
 * ═══════════════════════════════════════════════════════════════════════════
 * - Supports future upgrades: timed schedules, maps, distance optimization
 * - Without refactor
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ItineraryItem } from "@/components/roteiro/ItineraryCard";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ItemWithCoords extends ItineraryItem {
  lat?: number;
  lng?: number;
}

export interface DayAnalysis {
  dayNumber: number;
  itemCount: number;
  hasCoordinates: number;
  totalDistanceKm: number;
  maxDistanceBetweenItemsKm: number;
  densityLevel: 'light' | 'moderate' | 'dense';
  dispersionLevel: 'compact' | 'spread' | 'scattered';
  potentialIssues: RouteIssue[];
}

export interface RouteIssue {
  type: 'overloaded_day' | 'far_apart_items' | 'high_dispersion';
  severity: 'low' | 'medium' | 'high';
  dayNumber: number;
  description: string;
  itemIds?: string[];
}

export interface RouteAnalysis {
  totalDays: number;
  totalItems: number;
  daysWithItems: number;
  dayAnalyses: DayAnalysis[];
  issues: RouteIssue[];
  overallBalance: 'balanced' | 'uneven' | 'front_heavy' | 'back_heavy';
}

export interface RouteSuggestion {
  type: 'rebalance' | 'group_nearby' | 'split_day' | 'combine_days';
  description: string;
  priority: 'low' | 'medium' | 'high';
  affectedDays: number[];
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const THRESHOLDS = {
  OVERLOADED_ITEMS: 6,          // Items per day considered dense
  FAR_DISTANCE_KM: 15,          // Distance considered far apart
  HIGH_DISPERSION_KM: 25,       // Total dispersion considered scattered
  MODERATE_ITEMS: 4,            // Items per day considered moderate
  LIGHT_ITEMS: 2,               // Items per day considered light
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate distance between two geo points using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistanceKm = (point1: GeoPoint, point2: GeoPoint): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(point2.lat - point1.lat);
  const dLon = toRadians(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

/**
 * Extract items with valid coordinates
 */
const getItemsWithCoords = (items: ItemWithCoords[]): ItemWithCoords[] => {
  return items.filter(item => 
    item.lat !== undefined && 
    item.lng !== undefined && 
    !isNaN(item.lat) && 
    !isNaN(item.lng)
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DAY ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analyze a single day's items for distance, density, and dispersion
 * PASSIVE ANALYSIS ONLY — no modifications
 */
export const analyzeDayItems = (
  dayNumber: number, 
  items: ItemWithCoords[]
): DayAnalysis => {
  const itemsWithCoords = getItemsWithCoords(items);
  const issues: RouteIssue[] = [];
  
  let totalDistanceKm = 0;
  let maxDistanceBetweenItemsKm = 0;
  
  // Calculate distances between consecutive items
  if (itemsWithCoords.length >= 2) {
    for (let i = 0; i < itemsWithCoords.length - 1; i++) {
      const current = itemsWithCoords[i];
      const next = itemsWithCoords[i + 1];
      
      const distance = calculateDistanceKm(
        { lat: current.lat!, lng: current.lng! },
        { lat: next.lat!, lng: next.lng! }
      );
      
      totalDistanceKm += distance;
      
      if (distance > maxDistanceBetweenItemsKm) {
        maxDistanceBetweenItemsKm = distance;
      }
      
      // Identify far apart items (advisory only)
      if (distance > THRESHOLDS.FAR_DISTANCE_KM) {
        issues.push({
          type: 'far_apart_items',
          severity: distance > THRESHOLDS.FAR_DISTANCE_KM * 2 ? 'high' : 'medium',
          dayNumber,
          description: `Itens distantes: ${current.title || current.name} e ${next.title || next.name}`,
          itemIds: [current.id, next.id],
        });
      }
    }
  }
  
  // Determine density level
  let densityLevel: 'light' | 'moderate' | 'dense' = 'light';
  if (items.length >= THRESHOLDS.OVERLOADED_ITEMS) {
    densityLevel = 'dense';
    issues.push({
      type: 'overloaded_day',
      severity: items.length >= THRESHOLDS.OVERLOADED_ITEMS + 2 ? 'high' : 'medium',
      dayNumber,
      description: `Dia ${dayNumber} pode estar carregado com ${items.length} itens`,
    });
  } else if (items.length >= THRESHOLDS.MODERATE_ITEMS) {
    densityLevel = 'moderate';
  }
  
  // Determine dispersion level
  let dispersionLevel: 'compact' | 'spread' | 'scattered' = 'compact';
  if (totalDistanceKm > THRESHOLDS.HIGH_DISPERSION_KM) {
    dispersionLevel = 'scattered';
    issues.push({
      type: 'high_dispersion',
      severity: 'medium',
      dayNumber,
      description: `Dia ${dayNumber} tem itens muito espalhados (~${Math.round(totalDistanceKm)}km total)`,
    });
  } else if (totalDistanceKm > THRESHOLDS.FAR_DISTANCE_KM) {
    dispersionLevel = 'spread';
  }
  
  return {
    dayNumber,
    itemCount: items.length,
    hasCoordinates: itemsWithCoords.length,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    maxDistanceBetweenItemsKm: Math.round(maxDistanceBetweenItemsKm * 10) / 10,
    densityLevel,
    dispersionLevel,
    potentialIssues: issues,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// FULL ROUTE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analyze full itinerary across all days
 * PASSIVE ANALYSIS ONLY — called only when user requests it
 */
export const analyzeRoute = (
  itemsByDay: Record<number, ItemWithCoords[]>,
  totalDays: number
): RouteAnalysis => {
  const dayAnalyses: DayAnalysis[] = [];
  const allIssues: RouteIssue[] = [];
  
  let daysWithItems = 0;
  let totalItems = 0;
  const itemCounts: number[] = [];
  
  // Analyze each day
  for (let day = 1; day <= totalDays; day++) {
    const items = itemsByDay[day] || [];
    const analysis = analyzeDayItems(day, items);
    
    dayAnalyses.push(analysis);
    allIssues.push(...analysis.potentialIssues);
    
    if (items.length > 0) {
      daysWithItems++;
      totalItems += items.length;
    }
    itemCounts.push(items.length);
  }
  
  // Determine overall balance
  let overallBalance: 'balanced' | 'uneven' | 'front_heavy' | 'back_heavy' = 'balanced';
  
  if (totalDays >= 2 && totalItems > 0) {
    const midPoint = Math.floor(totalDays / 2);
    const firstHalfItems = itemCounts.slice(0, midPoint).reduce((a, b) => a + b, 0);
    const secondHalfItems = itemCounts.slice(midPoint).reduce((a, b) => a + b, 0);
    
    const imbalanceRatio = Math.abs(firstHalfItems - secondHalfItems) / totalItems;
    
    if (imbalanceRatio > 0.5) {
      overallBalance = firstHalfItems > secondHalfItems ? 'front_heavy' : 'back_heavy';
    } else if (imbalanceRatio > 0.3) {
      overallBalance = 'uneven';
    }
  }
  
  return {
    totalDays,
    totalItems,
    daysWithItems,
    dayAnalyses,
    issues: allIssues,
    overallBalance,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// SUGGESTION GENERATION (IA FLOW ONLY)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate suggestions based on route analysis
 * Called ONLY when user explicitly requests improvement
 * All suggestions are ADVISORY ONLY
 */
export const generateSuggestions = (analysis: RouteAnalysis): RouteSuggestion[] => {
  const suggestions: RouteSuggestion[] = [];
  
  // Suggest rebalancing if days are uneven
  if (analysis.overallBalance === 'front_heavy') {
    suggestions.push({
      type: 'rebalance',
      description: 'Os primeiros dias estão mais cheios. Considere redistribuir algumas atividades.',
      priority: 'low',
      affectedDays: analysis.dayAnalyses
        .filter(d => d.densityLevel === 'dense')
        .map(d => d.dayNumber),
    });
  } else if (analysis.overallBalance === 'back_heavy') {
    suggestions.push({
      type: 'rebalance',
      description: 'Os últimos dias estão mais cheios. Considere redistribuir algumas atividades.',
      priority: 'low',
      affectedDays: analysis.dayAnalyses
        .filter(d => d.densityLevel === 'dense')
        .map(d => d.dayNumber),
    });
  }
  
  // Suggest splitting overloaded days
  for (const dayAnalysis of analysis.dayAnalyses) {
    if (dayAnalysis.densityLevel === 'dense') {
      suggestions.push({
        type: 'split_day',
        description: `Dia ${dayAnalysis.dayNumber} tem ${dayAnalysis.itemCount} itens. Pode ser cansativo.`,
        priority: dayAnalysis.itemCount >= 8 ? 'high' : 'medium',
        affectedDays: [dayAnalysis.dayNumber],
      });
    }
    
    // Suggest grouping nearby items
    if (dayAnalysis.dispersionLevel === 'scattered') {
      suggestions.push({
        type: 'group_nearby',
        description: `Dia ${dayAnalysis.dayNumber} tem itens espalhados. Agrupar por região economiza tempo.`,
        priority: 'medium',
        affectedDays: [dayAnalysis.dayNumber],
      });
    }
  }
  
  // Suggest combining light days
  const lightDays = analysis.dayAnalyses.filter(d => d.densityLevel === 'light' && d.itemCount > 0);
  if (lightDays.length >= 2) {
    suggestions.push({
      type: 'combine_days',
      description: `Dias ${lightDays.map(d => d.dayNumber).join(', ')} têm poucos itens. Podem ser combinados.`,
      priority: 'low',
      affectedDays: lightDays.map(d => d.dayNumber),
    });
  }
  
  return suggestions;
};

// ═══════════════════════════════════════════════════════════════════════════
// FORMATTED OUTPUT FOR IA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format analysis for IA response
 * Returns structured data for IA to interpret and present to user
 */
export const formatAnalysisForIA = (analysis: RouteAnalysis): string => {
  const lines: string[] = [];
  
  lines.push(`Roteiro: ${analysis.totalItems} itens em ${analysis.daysWithItems} dias`);
  lines.push(`Balanceamento: ${translateBalance(analysis.overallBalance)}`);
  lines.push('');
  
  for (const day of analysis.dayAnalyses) {
    if (day.itemCount > 0) {
      lines.push(`Dia ${day.dayNumber}: ${day.itemCount} itens (${translateDensity(day.densityLevel)})`);
      if (day.hasCoordinates > 0) {
        lines.push(`  → Distância total: ~${day.totalDistanceKm}km`);
        lines.push(`  → Dispersão: ${translateDispersion(day.dispersionLevel)}`);
      }
    }
  }
  
  if (analysis.issues.length > 0) {
    lines.push('');
    lines.push('Pontos de atenção:');
    for (const issue of analysis.issues) {
      lines.push(`  • ${issue.description}`);
    }
  }
  
  return lines.join('\n');
};

// Translation helpers
const translateBalance = (balance: RouteAnalysis['overallBalance']): string => {
  switch (balance) {
    case 'balanced': return 'equilibrado';
    case 'uneven': return 'desigual';
    case 'front_heavy': return 'mais atividades nos primeiros dias';
    case 'back_heavy': return 'mais atividades nos últimos dias';
  }
};

const translateDensity = (density: DayAnalysis['densityLevel']): string => {
  switch (density) {
    case 'light': return 'leve';
    case 'moderate': return 'moderado';
    case 'dense': return 'intenso';
  }
};

const translateDispersion = (dispersion: DayAnalysis['dispersionLevel']): string => {
  switch (dispersion) {
    case 'compact': return 'concentrado';
    case 'spread': return 'espalhado';
    case 'scattered': return 'muito disperso';
  }
};

export default {
  calculateDistanceKm,
  analyzeDayItems,
  analyzeRoute,
  generateSuggestions,
  formatAnalysisForIA,
};
