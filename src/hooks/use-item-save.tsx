import { toast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";

/**
 * ITEM SAVE HOOK
 * 
 * Handles saving individual items to Meu Roteiro.
 * Only atomic content items can be saved (restaurants, hotels, activities, bars).
 * 
 * NAVIGATION VISIBILITY:
 * - After save: toast includes action to go to Meu Roteiro
 * - User always knows where saved items live
 * 
 * DESTINATION CONTEXT:
 * - Stores last destination path for return navigation
 */

interface SavedItem {
  id: string;
  type: 'activity' | 'restaurant' | 'hotel' | 'lucky-list' | 'nightlife' | 'local-flavor';
  title: string;
  savedAt: string;
  isPremium: boolean;
}

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
    navigate('/meu-roteiro');
  }, [navigate]);

  const saveItem = useCallback((
    itemId: string,
    itemType: SavedItem['type'],
    itemTitle: string,
    isPremium: boolean = false
  ) => {
    const draftRoteiro: SavedItem[] = JSON.parse(localStorage.getItem('draft-roteiro') || '[]');
    
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
    
    // Save item
    draftRoteiro.push({
      id: itemId,
      type: itemType,
      title: itemTitle,
      savedAt: new Date().toISOString(),
      isPremium,
    });
    
    localStorage.setItem('draft-roteiro', JSON.stringify(draftRoteiro));
    
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
  }, [goToRoteiro]);

  return { saveItem, goToRoteiro };
};
