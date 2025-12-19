import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemSave } from "@/hooks/use-item-save";
import { useState, useEffect } from "react";

/**
 * SAVE TO ROTEIRO BUTTON
 * 
 * Structural interaction element for all item detail pages.
 * 
 * Behavior:
 * - Shows visual feedback when saved
 * - Uses centralized save logic from useItemSave hook
 * - Animates on save action
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
  const { saveItem } = useItemSave();
  const [isSaved, setIsSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if already saved on mount
  useEffect(() => {
    const draftRoteiro = JSON.parse(localStorage.getItem('draft-roteiro') || '[]');
    const alreadySaved = draftRoteiro.some(
      (item: { id: string; type: string }) => item.id === itemId && item.type === itemType
    );
    setIsSaved(alreadySaved);
  }, [itemId, itemType]);

  const handleSave = () => {
    if (isSaved) {
      // Already saved, just show toast via hook
      saveItem(itemId, itemType, itemTitle, itemType === 'lucky-list');
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    
    const isPremiumItem = itemType === 'lucky-list';
    const success = saveItem(itemId, itemType, itemTitle, isPremiumItem);
    
    if (success) {
      setIsSaved(true);
    }

    // Reset animation after delay
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <Button
      onClick={handleSave}
      variant={isSaved ? "secondary" : "default"}
      size="sm"
      className={`gap-2 transition-all duration-300 ${isAnimating ? "scale-105" : ""} ${className}`}
    >
      {isSaved ? (
        <>
          <Check className={`w-4 h-4 ${isAnimating ? "animate-scale-in" : ""}`} />
          Salvo
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Salvar no Meu Roteiro
        </>
      )}
    </Button>
  );
};

export default SaveToRoteiroButton;
