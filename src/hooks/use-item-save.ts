import { toast } from "@/hooks/use-toast";

/**
 * ITEM SAVE HOOK
 * 
 * Handles saving individual items to Meu Roteiro.
 * Only atomic content items can be saved (restaurants, hotels, activities, bars).
 */

interface SavedItem {
  id: string;
  type: 'activity' | 'restaurant' | 'hotel' | 'lucky-list' | 'nightlife' | 'local-flavor';
  title: string;
  savedAt: string;
  isPremium: boolean;
}

export const useItemSave = () => {
  const saveItem = (
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
        title: "Já salvo",
        description: `${itemTitle} já está no seu roteiro.`,
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
    
    toast({
      title: "Salvo no Meu Roteiro",
      description: isPremium 
        ? `${itemTitle} foi salvo. Crie uma conta para manter seu roteiro.`
        : `${itemTitle} foi adicionado ao seu roteiro.`,
    });
    
    return true;
  };

  return { saveItem };
};
