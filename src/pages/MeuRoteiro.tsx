import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Trash2, MapPin, Utensils, Bed, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

/**
 * MEU ROTEIRO — SAVED ITEMS PAGE
 * 
 * User journey completion:
 * - Displays all saved items from draft roteiro
 * - Allows removal of items
 * - Returns to last exploration context
 */

interface SavedItem {
  id: string;
  type: 'activity' | 'restaurant' | 'hotel' | 'lucky-list' | 'nightlife' | 'local-flavor';
  title: string;
  savedAt: string;
  isPremium: boolean;
}

const getItemIcon = (type: SavedItem['type']) => {
  switch (type) {
    case 'restaurant':
      return <Utensils className="w-4 h-4" />;
    case 'hotel':
      return <Bed className="w-4 h-4" />;
    case 'lucky-list':
      return <Star className="w-4 h-4" />;
    case 'activity':
    default:
      return <MapPin className="w-4 h-4" />;
  }
};

const getItemTypeLabel = (type: SavedItem['type']) => {
  switch (type) {
    case 'restaurant':
      return 'Onde Comer';
    case 'hotel':
      return 'Onde Ficar';
    case 'lucky-list':
      return 'Lucky List';
    case 'activity':
      return 'O Que Fazer';
    case 'nightlife':
      return 'Vida Noturna';
    case 'local-flavor':
      return 'Sabores Locais';
    default:
      return 'Item';
  }
};

const MeuRoteiro = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('draft-roteiro') || '[]');
    setSavedItems(items);
  }, []);

  const handleRemoveItem = (itemId: string, itemType: string) => {
    const updatedItems = savedItems.filter(
      item => !(item.id === itemId && item.type === itemType)
    );
    setSavedItems(updatedItems);
    localStorage.setItem('draft-roteiro', JSON.stringify(updatedItems));
    
    // Dispatch event for bottom navigation to update badge
    window.dispatchEvent(new CustomEvent('roteiro-updated'));
    
    toast({
      title: "Removido",
      description: "Item removido do seu roteiro.",
    });
  };

  const handleGoBack = () => {
    // Check if there's navigation history, otherwise go to home
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            Meu Roteiro
          </h1>
          {savedItems.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {savedItems.length} {savedItems.length === 1 ? 'item salvo' : 'itens salvos'}
            </p>
          )}
        </div>

        {/* Draft Notice */}
        {savedItems.length > 0 && (
          <div className="mx-6 mb-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Rascunho — crie uma conta para salvar permanentemente</span>
            </div>
          </div>
        )}

        {/* Saved Items List */}
        <div className="px-6">
          {savedItems.length > 0 ? (
            <div className="space-y-4">
              {savedItems.map((item, index) => (
                <article 
                  key={`${item.type}-${item.id}-${index}`}
                  className="flex items-start justify-between p-4 border border-border rounded-lg bg-card"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {getItemIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {getItemTypeLabel(item.type)}
                        {item.isPremium && (
                          <span className="ml-2 text-primary">★ Premium</span>
                        )}
                      </p>
                      <h3 className="text-base font-medium text-foreground truncate">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveItem(item.id, item.type)}
                    aria-label="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            /* EMPTY STATE - Explains what Meu Roteiro is */
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-serif font-medium text-foreground mb-2">
                Seu roteiro está vazio
              </h2>
              <p className="text-sm text-muted-foreground mb-2 max-w-xs mx-auto">
                Aqui ficam os lugares que você salvar durante sua exploração.
              </p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                Funciona como um bolso — salve restaurantes, hotéis e atividades para montar seu roteiro perfeito.
              </p>
              <Link 
                to="/destinos"
                className="inline-block py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                Explorar destinos
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MeuRoteiro;
