import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Trash2, MapPin, Utensils, Bed, Star, Compass, Sparkles, Moon, Coffee, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { AddPlaceSheet } from "@/components/roteiro/AddPlaceSheet";
import { PlaceData } from "@/components/roteiro/GooglePlacesAutocomplete";
import { useRoteiroState } from "@/hooks/use-roteiro-state";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEU ROTEIRO — BEHAVIORAL LOCK (VALIDATED / FROZEN)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * LOCKED BEHAVIORS — DO NOT MODIFY:
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. Saving an item saves a SINGLE CARD, not a full page
 * 2. Items CAN be saved WITHOUT login (draft state in localStorage)
 * 3. Saved items are accessible via the top-right icon (always visible)
 * 4. Login only UPGRADES persistence, NEVER blocks usage
 * 5. NO forced login at entry — feature is always accessible
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * FORBIDDEN FEATURES — DO NOT INTRODUCE:
 * ═══════════════════════════════════════════════════════════════════════════
 * - NO scheduling functionality
 * - NO maps integration
 * - NO timelines or calendar views
 * - NO login gates or auth walls
 * - NO data sync requirements
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * PERSISTENCE MODEL:
 * ═══════════════════════════════════════════════════════════════════════════
 * - Draft state: localStorage (always available)
 * - Logged in: upgrades to cloud sync (optional, non-blocking)
 * - Transition is seamless, never loses data
 * 
 * USER JOURNEY:
 * - Displays all saved items from draft roteiro
 * - Allows removal of items
 * - Returns to last destination context
 * - Feels like progress, not storage
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface SavedItem {
  id: string;
  type: 'activity' | 'restaurant' | 'hotel' | 'lucky-list' | 'nightlife' | 'local-flavor' | 'custom';
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
    case 'nightlife':
      return <Moon className="w-4 h-4" />;
    case 'local-flavor':
      return <Coffee className="w-4 h-4" />;
    case 'custom':
      return <Navigation className="w-4 h-4" />;
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
    case 'custom':
      return 'Local Adicionado';
    default:
      return 'Item';
  }
};

const TOTAL_DAYS = 3; // Default trip length

const MeuRoteiro = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [lastDestination, setLastDestination] = useState<string | null>(null);
  const { addItem } = useRoteiroState('rio-de-janeiro', TOTAL_DAYS);
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('draft-roteiro') || '[]');
    setSavedItems(items);
    
    // Get last visited destination for back navigation
    const lastDest = localStorage.getItem('last-destination-context');
    setLastDestination(lastDest);
  }, []);

  const handleAddPlace = (day: number, place: PlaceData) => {
    // Add to roteiro state (structured itinerary)
    addItem(day, {
      id: place.placeId,
      title: place.name,
      time: '',
      category: 'custom',
      location: place.neighborhood || place.city || '',
      placeId: place.placeId,
      lat: place.lat,
      lng: place.lng,
    });

    // Also add to saved items list for display
    const newItem: SavedItem = {
      id: place.placeId,
      type: 'custom',
      title: place.name,
      savedAt: new Date().toISOString(),
      isPremium: false,
    };
    
    const updatedItems = [...savedItems, newItem];
    setSavedItems(updatedItems);
    localStorage.setItem('draft-roteiro', JSON.stringify(updatedItems));
    
    // Dispatch event for bottom navigation to update badge
    window.dispatchEvent(new CustomEvent('roteiro-updated'));
  };

  const handleRemoveItem = (itemId: string, itemType: string, itemTitle: string) => {
    const updatedItems = savedItems.filter(
      item => !(item.id === itemId && item.type === itemType)
    );
    setSavedItems(updatedItems);
    localStorage.setItem('draft-roteiro', JSON.stringify(updatedItems));
    
    // Dispatch event for bottom navigation to update badge
    window.dispatchEvent(new CustomEvent('roteiro-updated'));
    
    toast({
      title: "Removido do roteiro",
      description: `${itemTitle} foi removido.`,
    });
  };

  const handleGoBack = () => {
    // Return to last destination context if available
    if (lastDestination) {
      navigate(lastDestination);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Calculate progress indication
  const getProgressMessage = () => {
    const count = savedItems.length;
    if (count === 0) return null;
    if (count === 1) return "Seu roteiro está começando a tomar forma.";
    if (count <= 3) return "Ótimo começo! Continue explorando.";
    if (count <= 6) return "Sua viagem está ficando incrível.";
    return "Roteiro completo! Você está pronto para viajar.";
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
            <>
              <p className="text-sm text-muted-foreground mt-2">
                {savedItems.length} {savedItems.length === 1 ? 'item salvo' : 'itens salvos'}
              </p>
              {/* Progress message */}
              <p className="text-sm text-primary mt-1 font-medium">
                {getProgressMessage()}
              </p>
            </>
          )}
        </div>

        {/* Saved Items List */}
        <div className="px-6">
          {savedItems.length > 0 ? (
            <div className="space-y-3">
              {savedItems.map((item, index) => (
                <article 
                  key={`${item.type}-${item.id}-${index}`}
                  className="flex items-start justify-between p-4 border border-border rounded-lg bg-card animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      item.isPremium ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {getItemIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {getItemTypeLabel(item.type)}
                        {item.isPremium && (
                          <span className="ml-2 text-primary">★</span>
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
                    className="flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveItem(item.id, item.type, item.title)}
                    aria-label="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            /* EMPTY STATE - Explains what Meu Roteiro is, invites exploration */
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Compass className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-medium text-foreground mb-3">
                Sua viagem começa aqui
              </h2>
              <p className="text-base text-muted-foreground mb-2 max-w-sm mx-auto leading-relaxed">
                O Meu Roteiro é onde sua viagem toma forma.
              </p>
              <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                Salve restaurantes, hotéis e experiências enquanto explora — ou planeje seu roteiro arrastando atividades.
              </p>
              <div className="flex flex-col gap-3 items-center">
                <Link 
                  to="/destinos"
                  className="inline-flex items-center gap-2 py-3 px-6 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-4 h-4" />
                  Começar a explorar
                </Link>
                <Link 
                  to="/planejar/rio-de-janeiro"
                  className="inline-flex items-center gap-2 py-3 px-6 border border-border text-foreground rounded-full text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  Planejar roteiro
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* FAB for adding places */}
      <AddPlaceSheet 
        totalDays={TOTAL_DAYS} 
        onAddPlace={handleAddPlace} 
      />
    </div>
  );
};

export default MeuRoteiro;
