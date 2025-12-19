import { useState, useEffect, useCallback } from "react";
import { ItineraryItem } from "@/components/roteiro/ItineraryCard";

/**
 * ROTEIRO STATE HOOK
 * 
 * STRUCTURAL LOCK — Core state management for Meu Roteiro
 * 
 * This hook manages the user's personal itinerary with:
 * - Persistence to localStorage
 * - Day-based organization
 * - Item operations (add, remove, reorder, move)
 * 
 * ARCHITECTURE NOTES:
 * - User itinerary is fully editable
 * - Curated source remains unchanged
 * - State syncs automatically
 * - Supports future layers (map, time, cost, sharing)
 */

export interface RoteiroState {
  destinationId: string;
  totalDays: number;
  items: Record<number, ItineraryItem[]>;
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useRoteiroState = (destinationId: string, totalDays: number = 3) => {
  const [roteiro, setRoteiro] = useState<RoteiroState>(() => {
    // Load from localStorage on init
    const stored = localStorage.getItem(`${STORAGE_KEY}-${destinationId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure all days exist
        for (let i = 1; i <= totalDays; i++) {
          if (!parsed.items[i]) parsed.items[i] = [];
        }
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

  // Add item to a specific day
  const addItem = useCallback((day: number, item: ItineraryItem, sourceItemId?: string) => {
    setRoteiro(prev => {
      // Create unique ID for user's copy
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

  // Remove item from roteiro
  const removeItem = useCallback((day: number, itemId: string) => {
    setRoteiro(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [day]: prev.items[day].filter(i => i.id !== itemId),
      },
    }));
  }, []);

  // Move item within same day (reorder)
  const reorderItems = useCallback((day: number, oldIndex: number, newIndex: number) => {
    setRoteiro(prev => {
      const items = [...prev.items[day]];
      const [removed] = items.splice(oldIndex, 1);
      items.splice(newIndex, 0, removed);
      
      return {
        ...prev,
        items: {
          ...prev.items,
          [day]: items,
        },
      };
    });
  }, []);

  // Move item between days
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

  // Set items for a day (used by AI fill)
  const setDayItems = useCallback((day: number, items: ItineraryItem[]) => {
    setRoteiro(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [day]: items,
      },
    }));
  }, []);

  // Clear entire roteiro
  const clearRoteiro = useCallback(() => {
    setRoteiro(createEmptyRoteiro(destinationId, totalDays));
  }, [destinationId, totalDays]);

  // Check if item already exists (by original source ID)
  const hasItem = useCallback((sourceId: string): boolean => {
    return Object.values(roteiro.items).some(
      dayItems => dayItems.some(item => item.id.includes(sourceId))
    );
  }, [roteiro.items]);

  // Get total item count
  const totalItems = Object.values(roteiro.items).reduce(
    (sum, items) => sum + items.length, 0
  );

  // Get items for a specific day
  const getItemsForDay = useCallback((day: number): ItineraryItem[] => {
    return roteiro.items[day] || [];
  }, [roteiro.items]);

  return {
    roteiro,
    items: roteiro.items,
    totalItems,
    addItem,
    removeItem,
    reorderItems,
    moveItemBetweenDays,
    setDayItems,
    clearRoteiro,
    hasItem,
    getItemsForDay,
  };
};

export default useRoteiroState;
