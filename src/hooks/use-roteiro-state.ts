import { useState, useEffect, useCallback } from "react";
import { ItineraryItem } from "@/components/roteiro/ItineraryCard";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROTEIRO STATE HOOK — BEHAVIORAL LOCK (VALIDATED / FROZEN)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * LOCKED BEHAVIORS — DO NOT MODIFY:
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. Items CAN be saved WITHOUT login (localStorage draft state)
 * 2. Login only UPGRADES persistence, NEVER blocks usage
 * 3. NO forced login at entry
 * 4. NO authentication checks before state operations
 * 5. All operations work in draft (rascunho) mode by default
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * FORBIDDEN FEATURES — DO NOT INTRODUCE:
 * ═══════════════════════════════════════════════════════════════════════════
 * - NO scheduling functionality
 * - NO maps integration  
 * - NO timelines or calendar views
 * - NO login gates or auth walls
 * - NO mandatory cloud sync
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * TWO MENTAL STATES:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 1. RASCUNHO (Draft) — DEFAULT
 *    - Free, imperfect, reversible
 *    - All actions allowed without validation
 *    - No warnings, no "errors"
 *    - A playground for exploration
 *    - Works WITHOUT login
 * 
 * 2. ROTEIRO FINAL (Finalized)
 *    - Intentional and assumed
 *    - Still fully editable
 *    - May receive advisory suggestions (never blocking)
 *    - User can return to Rascunho anytime
 * 
 * PSYCHOLOGICAL RULES:
 * - Never imply something is "wrong" or "incomplete"
 * - Never auto-finalize or auto-validate
 * - Never punish or lock-in
 * - The system is a guide, not a judge
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type RoteiroStatus = 'rascunho' | 'final';

export interface RoteiroState {
  destinationId: string;
  totalDays: number;
  items: Record<number, ItineraryItem[]>;
  status: RoteiroStatus;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'user-roteiro';

const createEmptyRoteiro = (destinationId: string, totalDays: number): RoteiroState => ({
  destinationId,
  totalDays,
  items: Object.fromEntries(
    Array.from({ length: totalDays }, (_, i) => [i + 1, []])
  ),
  status: 'rascunho', // Always starts as draft
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useRoteiroState = (destinationId: string, totalDays: number = 3) => {
  const [roteiro, setRoteiro] = useState<RoteiroState>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${destinationId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure all days exist
        for (let i = 1; i <= totalDays; i++) {
          if (!parsed.items[i]) parsed.items[i] = [];
        }
        // Ensure status exists (migration for old data)
        if (!parsed.status) parsed.status = 'rascunho';
        return parsed;
      } catch {
        return createEmptyRoteiro(destinationId, totalDays);
      }
    }
    return createEmptyRoteiro(destinationId, totalDays);
  });

  // Persist to localStorage on change
  useEffect(() => {
    const updated = { ...roteiro, updatedAt: new Date().toISOString() };
    localStorage.setItem(`${STORAGE_KEY}-${destinationId}`, JSON.stringify(updated));
  }, [roteiro, destinationId]);

  // === ITEM OPERATIONS ===
  // All operations work identically in both states (rascunho/final)
  // No validation, no warnings, no blocking

  const addItem = useCallback((day: number, item: ItineraryItem, sourceItemId?: string) => {
    setRoteiro(prev => {
      const newItem: ItineraryItem = {
        ...item,
        id: `user-${sourceItemId || item.id}-${Date.now()}`,
      };
      return {
        ...prev,
        items: {
          ...prev.items,
          [day]: [...(prev.items[day] || []), newItem],
        },
      };
    });
  }, []);

  const removeItem = useCallback((day: number, itemId: string) => {
    setRoteiro(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [day]: prev.items[day].filter(i => i.id !== itemId),
      },
    }));
  }, []);

  const reorderItems = useCallback((day: number, oldIndex: number, newIndex: number) => {
    setRoteiro(prev => {
      const items = [...prev.items[day]];
      const [removed] = items.splice(oldIndex, 1);
      items.splice(newIndex, 0, removed);
      return {
        ...prev,
        items: { ...prev.items, [day]: items },
      };
    });
  }, []);

  const moveItemBetweenDays = useCallback((fromDay: number, toDay: number, itemId: string) => {
    setRoteiro(prev => {
      const item = prev.items[fromDay].find(i => i.id === itemId);
      if (!item) return prev;
      return {
        ...prev,
        items: {
          ...prev.items,
          [fromDay]: prev.items[fromDay].filter(i => i.id !== itemId),
          [toDay]: [...(prev.items[toDay] || []), item],
        },
      };
    });
  }, []);

  const setDayItems = useCallback((day: number, items: ItineraryItem[]) => {
    setRoteiro(prev => ({
      ...prev,
      items: { ...prev.items, [day]: items },
    }));
  }, []);

  const clearRoteiro = useCallback(() => {
    setRoteiro(createEmptyRoteiro(destinationId, totalDays));
  }, [destinationId, totalDays]);

  // === STATUS TRANSITIONS ===
  // User-initiated only. Never auto-triggered.

  const finalize = useCallback(() => {
    setRoteiro(prev => ({ ...prev, status: 'final' }));
  }, []);

  const returnToRascunho = useCallback(() => {
    setRoteiro(prev => ({ ...prev, status: 'rascunho' }));
  }, []);

  // === QUERIES ===

  const hasItem = useCallback((sourceId: string): boolean => {
    return Object.values(roteiro.items).some(
      dayItems => dayItems.some(item => item.id.includes(sourceId))
    );
  }, [roteiro.items]);

  const totalItems = Object.values(roteiro.items).reduce(
    (sum, items) => sum + items.length, 0
  );

  const getItemsForDay = useCallback((day: number): ItineraryItem[] => {
    return roteiro.items[day] || [];
  }, [roteiro.items]);

  const isRascunho = roteiro.status === 'rascunho';
  const isFinal = roteiro.status === 'final';

  return {
    roteiro,
    items: roteiro.items,
    status: roteiro.status,
    isRascunho,
    isFinal,
    totalItems,
    // Item operations
    addItem,
    removeItem,
    reorderItems,
    moveItemBetweenDays,
    setDayItems,
    clearRoteiro,
    // Status transitions
    finalize,
    returnToRascunho,
    // Queries
    hasItem,
    getItemsForDay,
  };
};

export default useRoteiroState;
