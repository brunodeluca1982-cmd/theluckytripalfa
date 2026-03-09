import { toast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ITEM SAVE HOOK — BEHAVIORAL LOCK (VALIDATED / FROZEN)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * LOCKED BEHAVIORS — DO NOT MODIFY:
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. Saves SINGLE ATOMIC ITEMS (cards), never full pages
 * 2. Works WITHOUT login — localStorage draft state
 * 3. NO authentication check before save
 * 4. NO forced redirects to login
 * 5. Toast feedback always includes "Ver roteiro" action
 * 6. Items are automatically grouped by destinationId
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ALLOWED ITEM TYPES (ATOMIC CONTENT ONLY):
 * ═══════════════════════════════════════════════════════════════════════════
 * - activity (O Que Fazer)
 * - restaurant (Onde Comer)
 * - hotel (Onde Ficar)
 * - lucky-list (Lucky List items)
 * - nightlife (Vida Noturna)
 * - local-flavor (Sabores Locais)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * PERSISTENCE:
 * ═══════════════════════════════════════════════════════════════════════════
 * - Always saves to localStorage first (instant, offline-capable)
 * - Login upgrades persistence but NEVER blocks the save action
 * 
 * NAVIGATION:
 * - After save: toast includes action to go to Meu Roteiro
 * - Stores last destination path for return navigation
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SavedItem {
  id: string;
  type: 'activity' | 'restaurant' | 'hotel' | 'lucky-list' | 'nightlife' | 'local-flavor';
  title: string;
  savedAt: string;
  isPremium: boolean;
  destinationId: string;
  destinationName: string;
  source?: 'instagram' | 'tiktok' | 'link';
  sourceLabel?: string;
  sourceUrl?: string;
  neighborhood?: string;
}

const STORAGE_KEY = 'draft-roteiro';

// Extract destination context from current path
const extractDestinationFromPath = (pathname: string): { id: string; name: string } => {
  // Default to Rio de Janeiro as it's the only available destination
  const defaultDest = { id: 'rio-de-janeiro', name: 'Rio de Janeiro' };
  
  // Check for destination in URL patterns
  if (pathname.includes('/destino/rio-de-janeiro') || 
      pathname.includes('/onde-ficar-rio') ||
      pathname.includes('/o-que-fazer') ||
      pathname.includes('/lucky-list') ||
      pathname.includes('/onde-comer') ||
      pathname.includes('/eat-map-view')) {
    return defaultDest;
  }
  
  // Try to extract from generic destination pattern
  const destMatch = pathname.match(/\/destino\/([^/]+)/);
  if (destMatch) {
    const destId = destMatch[1];
    // Map known destinations
    const destNames: Record<string, string> = {
      'rio-de-janeiro': 'Rio de Janeiro',
      'sao-paulo': 'São Paulo',
      'salvador': 'Salvador',
      'florianopolis': 'Florianópolis',
    };
    return { id: destId, name: destNames[destId] || destId };
  }
  
  return defaultDest;
};

export const useItemSave = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Store destination context for return navigation
  useEffect(() => {
    const path = location.pathname;
    // Store if we're in a destination context
    if (path.includes('/destino/') || path.includes('/onde-') || path.includes('/o-que-fazer') || path.includes('/lucky-list')) {
      localStorage.setItem('last-destination-context', path);
    }
  }, [location.pathname]);

  const goToRoteiro = useCallback(() => {
    navigate('/minha-viagem');
  }, [navigate]);

  const saveItem = useCallback((
    itemId: string,
    itemType: SavedItem['type'],
    itemTitle: string,
    isPremium: boolean = false
  ) => {
    const draftRoteiro: SavedItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Check if already saved
    const alreadySaved = draftRoteiro.some(
      (item) => item.id === itemId && item.type === itemType
    );
    
    if (alreadySaved) {
      toast({
        title: "Já está no seu roteiro",
        description: `${itemTitle} já foi salvo.`,
        action: (
          <ToastAction altText="Ver roteiro" onClick={goToRoteiro}>
            Ver roteiro
          </ToastAction>
        ),
      });
      return false;
    }
    
    // Get destination context from current path
    const destination = extractDestinationFromPath(location.pathname);
    
    // Save item with destination info
    draftRoteiro.push({
      id: itemId,
      type: itemType,
      title: itemTitle,
      savedAt: new Date().toISOString(),
      isPremium,
      destinationId: destination.id,
      destinationName: destination.name,
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftRoteiro));
    
    // Dispatch event for bottom navigation to update badge
    window.dispatchEvent(new CustomEvent('roteiro-updated'));
    
    // Success feedback with item count
    const itemCount = draftRoteiro.length;
    
    toast({
      title: "Adicionado ao roteiro ✓",
      description: isPremium 
        ? `${itemTitle} — ${itemCount} ${itemCount === 1 ? 'item' : 'itens'} no total`
        : `${itemTitle} — ${itemCount} ${itemCount === 1 ? 'item' : 'itens'} salvos`,
      action: (
        <ToastAction altText="Ver roteiro" onClick={goToRoteiro}>
          Ver roteiro
        </ToastAction>
      ),
    });
    
    return true;
  }, [goToRoteiro, location.pathname]);

  const removeItem = useCallback((itemId: string, itemType: SavedItem['type']) => {
    const draftRoteiro: SavedItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = draftRoteiro.filter(
      (item) => !(item.id === itemId && item.type === itemType)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('roteiro-updated'));
  }, []);

  return { saveItem, removeItem, goToRoteiro };
};
