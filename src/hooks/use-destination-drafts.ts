import { useState, useEffect, useCallback, useMemo } from "react";
import { SavedItem } from "./use-item-save";

/**
 * DESTINATION DRAFTS HOOK
 * 
 * Manages destination-based draft itineraries from saved items.
 * 
 * Behavior:
 * - Groups saved items by destinationId
 * - Sorts items alphabetically by title within each destination
 * - Provides real-time updates when items are saved/removed
 * - No dates, no order, just a container for saved ideas
 */

export interface DestinationDraft {
  destinationId: string;
  destinationName: string;
  items: SavedItem[];
}

const STORAGE_KEY = 'draft-roteiro';

export const useDestinationDrafts = () => {
  const [drafts, setDrafts] = useState<DestinationDraft[]>([]);

  // Load and group items from localStorage
  const loadDrafts = useCallback(() => {
    const savedItems: SavedItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Group by destinationId
    const grouped = savedItems.reduce((acc, item) => {
      // Ensure item has destinationId (backward compatibility)
      const destId = item.destinationId || 'rio-de-janeiro';
      const destName = item.destinationName || 'Rio de Janeiro';
      
      if (!acc[destId]) {
        acc[destId] = {
          destinationId: destId,
          destinationName: destName,
          items: [],
        };
      }
      acc[destId].items.push(item);
      return acc;
    }, {} as Record<string, DestinationDraft>);
    
    // Sort items alphabetically within each destination
    Object.values(grouped).forEach(draft => {
      draft.items.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    });
    
    // Convert to array and sort destinations alphabetically
    const draftsArray = Object.values(grouped).sort((a, b) => 
      a.destinationName.localeCompare(b.destinationName, 'pt-BR')
    );
    
    setDrafts(draftsArray);
  }, []);

  // Load on mount
  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  // Listen for changes
  useEffect(() => {
    const handleUpdate = () => loadDrafts();
    window.addEventListener('roteiro-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('roteiro-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadDrafts]);

  // Remove item from draft
  const removeItem = useCallback((itemId: string, itemType: string) => {
    const savedItems: SavedItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = savedItems.filter(
      (item) => !(item.id === itemId && item.type === itemType)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('roteiro-updated'));
  }, []);

  // Get draft for specific destination
  const getDraftForDestination = useCallback((destinationId: string): DestinationDraft | null => {
    return drafts.find(d => d.destinationId === destinationId) || null;
  }, [drafts]);

  // Total saved items count
  const totalItems = useMemo(() => {
    return drafts.reduce((sum, draft) => sum + draft.items.length, 0);
  }, [drafts]);

  return {
    drafts,
    totalItems,
    removeItem,
    getDraftForDestination,
    refresh: loadDrafts,
  };
};

export default useDestinationDrafts;
