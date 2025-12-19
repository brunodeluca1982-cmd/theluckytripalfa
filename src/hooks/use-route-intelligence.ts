import { useMemo, useCallback } from "react";
import { ItineraryItem } from "@/components/roteiro/ItineraryCard";
import { 
  analyzeRoute, 
  generateSuggestions, 
  formatAnalysisForIA,
  RouteAnalysis,
  RouteSuggestion,
  ItemWithCoords,
} from "@/lib/route-intelligence";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * USE ROUTE INTELLIGENCE HOOK — v1.5
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * BEHAVIORAL LOCK:
 * - This hook provides PASSIVE analysis only
 * - Analysis is computed on-demand, not continuously
 * - NEVER triggers UI changes, alerts, or badges
 * - Used ONLY when user explicitly requests improvement via IA
 * 
 * ACTIVATION:
 * - Call analyzeCurrentRoute() when user requests analysis
 * - Call getSuggestions() when user wants improvement ideas
 * - Call getFormattedAnalysis() for IA-ready output
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface UseRouteIntelligenceProps {
  items: Record<number, ItineraryItem[]>;
  totalDays: number;
}

interface UseRouteIntelligenceReturn {
  // Analysis functions (call only when needed)
  analyzeCurrentRoute: () => RouteAnalysis;
  getSuggestions: () => RouteSuggestion[];
  getFormattedAnalysis: () => string;
  
  // Quick stats (lightweight, can be computed)
  getQuickStats: () => {
    totalItems: number;
    daysWithItems: number;
    averageItemsPerDay: number;
  };
  
  // Day-specific helpers
  getDayItemCount: (day: number) => number;
  hasItemsWithCoords: () => boolean;
}

export const useRouteIntelligence = ({
  items,
  totalDays,
}: UseRouteIntelligenceProps): UseRouteIntelligenceReturn => {
  
  // Cast items to include optional coords
  const itemsWithCoords = useMemo(() => {
    const result: Record<number, ItemWithCoords[]> = {};
    for (const day of Object.keys(items)) {
      result[Number(day)] = items[Number(day)] as ItemWithCoords[];
    }
    return result;
  }, [items]);

  /**
   * Analyze current route
   * CALL ONLY when user explicitly requests it
   */
  const analyzeCurrentRoute = useCallback((): RouteAnalysis => {
    return analyzeRoute(itemsWithCoords, totalDays);
  }, [itemsWithCoords, totalDays]);

  /**
   * Get improvement suggestions
   * CALL ONLY when user explicitly requests improvement
   */
  const getSuggestions = useCallback((): RouteSuggestion[] => {
    const analysis = analyzeCurrentRoute();
    return generateSuggestions(analysis);
  }, [analyzeCurrentRoute]);

  /**
   * Get formatted analysis for IA
   * Returns string ready for IA to interpret
   */
  const getFormattedAnalysis = useCallback((): string => {
    const analysis = analyzeCurrentRoute();
    return formatAnalysisForIA(analysis);
  }, [analyzeCurrentRoute]);

  /**
   * Quick stats - lightweight computation
   */
  const getQuickStats = useCallback(() => {
    let totalItems = 0;
    let daysWithItems = 0;
    
    for (let day = 1; day <= totalDays; day++) {
      const dayItems = items[day] || [];
      if (dayItems.length > 0) {
        daysWithItems++;
        totalItems += dayItems.length;
      }
    }
    
    return {
      totalItems,
      daysWithItems,
      averageItemsPerDay: daysWithItems > 0 
        ? Math.round((totalItems / daysWithItems) * 10) / 10 
        : 0,
    };
  }, [items, totalDays]);

  /**
   * Get item count for specific day
   */
  const getDayItemCount = useCallback((day: number): number => {
    return (items[day] || []).length;
  }, [items]);

  /**
   * Check if any items have coordinates
   */
  const hasItemsWithCoords = useCallback((): boolean => {
    for (const day of Object.keys(items)) {
      const dayItems = items[Number(day)] as ItemWithCoords[];
      for (const item of dayItems) {
        if (item.lat !== undefined && item.lng !== undefined) {
          return true;
        }
      }
    }
    return false;
  }, [items]);

  return {
    analyzeCurrentRoute,
    getSuggestions,
    getFormattedAnalysis,
    getQuickStats,
    getDayItemCount,
    hasItemsWithCoords,
  };
};

export default useRouteIntelligence;
