import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

/**
 * SAVE TO ROTEIRO BUTTON
 * 
 * Structural interaction element for all item detail pages.
 * 
 * Behavior:
 * - If not logged in: Save to Draft state
 * - If Lucky List + not premium: Trigger premium access flow (defined later)
 * - Always visible without scrolling (placed in header area)
 */

interface SaveToRoteiroButtonProps {
  itemId: string;
  itemType: 'activity' | 'restaurant' | 'hotel' | 'lucky-list' | 'nightlife' | 'local-flavor';
  itemTitle: string;
  className?: string;
}

const SaveToRoteiroButton = ({ 
  itemId, 
  itemType, 
  itemTitle,
  className = "" 
}: SaveToRoteiroButtonProps) => {
  
  const handleSave = () => {
    // Check if item is Lucky List (premium-gated)
    const isPremiumItem = itemType === 'lucky-list';
    
    // For now: Save to draft state (localStorage simulation)
    // Future: Check auth state and trigger appropriate flow
    const draftRoteiro = JSON.parse(localStorage.getItem('draft-roteiro') || '[]');
    
    // Check if already saved
    const alreadySaved = draftRoteiro.some(
      (item: { id: string; type: string }) => item.id === itemId && item.type === itemType
    );
    
    if (alreadySaved) {
      toast({
        title: "Já salvo",
        description: `${itemTitle} já está no seu roteiro.`,
      });
      return;
    }
    
    // If premium item and not premium user (future: check premium state)
    // For now, save to draft and show toast
    if (isPremiumItem) {
      // Future: Trigger premium access flow
      // For now, allow draft save with premium indicator
      draftRoteiro.push({
        id: itemId,
        type: itemType,
        title: itemTitle,
        savedAt: new Date().toISOString(),
        isPremium: true,
      });
    } else {
      draftRoteiro.push({
        id: itemId,
        type: itemType,
        title: itemTitle,
        savedAt: new Date().toISOString(),
        isPremium: false,
      });
    }
    
    localStorage.setItem('draft-roteiro', JSON.stringify(draftRoteiro));
    
    toast({
      title: "Salvo no Meu Roteiro",
      description: isPremiumItem 
        ? `${itemTitle} foi salvo. Crie uma conta para manter seu roteiro.`
        : `${itemTitle} foi adicionado ao seu roteiro.`,
    });
  };

  return (
    <Button
      onClick={handleSave}
      variant="default"
      size="sm"
      className={`gap-2 ${className}`}
    >
      <Plus className="w-4 h-4" />
      Salvar no Meu Roteiro
    </Button>
  );
};

export default SaveToRoteiroButton;
