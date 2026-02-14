import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Search, X, MapPin, ChevronRight, Check, Trash2, Utensils, BedDouble, Camera, Star, PartyPopper, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { curatedDestinations, searchDestinations, Destination } from "@/data/destinations-database";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { useDestinationDrafts, DestinationDraft } from "@/hooks/use-destination-drafts";
import { toast } from "@/hooks/use-toast";

/**
 * MONTE SEU ROTEIRO — Entry Screen (Step 1: Destination Only)
 * 
 * Route: /meu-roteiro
 * 
 * Shows:
 * - Netflix-style destination carousel
 * - Search input with "Vai pra onde?" placeholder
 * - "Continuar" CTA (disabled until destination selected)
 * - Destination-based draft itineraries (grouped saved items)
 * 
 * After pressing Continuar, navigates to /meu-roteiro/grupo.
 */

// Type badge icons
const typeIcons: Record<string, React.ReactNode> = {
  'restaurant': <Utensils className="w-3 h-3" />,
  'hotel': <BedDouble className="w-3 h-3" />,
  'activity': <Camera className="w-3 h-3" />,
  'lucky-list': <Star className="w-3 h-3" />,
  'nightlife': <PartyPopper className="w-3 h-3" />,
  'local-flavor': <Leaf className="w-3 h-3" />,
};

const typeLabels: Record<string, string> = {
  'restaurant': 'Restaurante',
  'hotel': 'Hotel',
  'activity': 'Atividade',
  'lucky-list': 'Lucky List',
  'nightlife': 'Vida Noturna',
  'local-flavor': 'Sabor Local',
};

// Draft item card component
const DraftItemCard = ({ 
  item, 
  onRemove 
}: { 
  item: { id: string; type: string; title: string; isPremium: boolean };
  onRemove: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
  >
    <div className={cn(
      "flex items-center justify-center w-8 h-8 rounded-lg",
      item.isPremium ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
    )}>
      {typeIcons[item.type] || <MapPin className="w-3 h-3" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
      <p className="text-xs text-muted-foreground">{typeLabels[item.type] || item.type}</p>
    </div>
    <button
      onClick={onRemove}
      className="p-2 -m-1 text-muted-foreground hover:text-destructive transition-colors"
      aria-label="Remover item"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </motion.div>
);

// Destination draft section component
const DestinationDraftSection = ({ 
  draft, 
  onRemoveItem,
  onSelectDestination,
}: { 
  draft: DestinationDraft;
  onRemoveItem: (itemId: string, itemType: string) => void;
  onSelectDestination: (destId: string) => void;
}) => {
  const destination = curatedDestinations.find(d => d.id === draft.destinationId);
  
  return (
    <section className="space-y-3">
      <button
        onClick={() => onSelectDestination(draft.destinationId)}
        className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity"
      >
        {destination?.imageUrl ? (
          <img 
            src={destination.imageUrl} 
            alt={draft.destinationName}
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{draft.destinationName}</h3>
          <p className="text-xs text-muted-foreground">
            {draft.items.length} {draft.items.length === 1 ? 'item salvo' : 'itens salvos'}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
      
      <div className="space-y-2 pl-13">
        <AnimatePresence>
          {draft.items.map((item) => (
            <DraftItemCard
              key={`${item.type}-${item.id}`}
              item={item}
              onRemove={() => onRemoveItem(item.id, item.type)}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

const MeuRoteiro = () => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const { draft, setDestination, isDestinationSelected } = useTripDraft();
  const { drafts, removeItem } = useDestinationDrafts();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showError, setShowError] = useState(false);

  // Search results - ONLY from internal database
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchDestinations(searchQuery);
  }, [searchQuery]);

  // Handle destination selection from carousel or search
  const handleSelectDestination = (destination: Destination) => {
    if (!destination.available) {
      toast({ 
        title: "Em breve!", 
        description: `${destination.name} estará disponível em breve.` 
      });
      return;
    }
    
    // Set destination in draft (persisted to localStorage via hook)
    setDestination(
      destination.id, 
      destination.name, 
      destination.id, 
      destination.imageUrl || ''
    );
    
    // Clear search and hide error
    setSearchQuery('');
    setIsSearchFocused(false);
    setShowError(false);
  };

  // Handle destination selection from draft section
  const handleSelectDestinationById = (destId: string) => {
    const destination = curatedDestinations.find(d => d.id === destId);
    if (destination && destination.available) {
      handleSelectDestination(destination);
    }
  };

  // Handle remove item from draft
  const handleRemoveItem = (itemId: string, itemType: string) => {
    removeItem(itemId, itemType);
    toast({
      title: "Item removido",
      description: "O item foi removido do seu roteiro.",
    });
  };

  // Handle continue button
  const handleContinue = () => {
    if (!isDestinationSelected) {
      setShowError(true);
      return;
    }
    navigate('/meu-roteiro/datas');
  };

  // Fixed back navigation - always go to home
  const handleBack = () => {
    navigate('/');
  };

  // Get selected destination info for display
  const selectedDestination = useMemo(() => {
    if (!draft.destinationId) return null;
    return curatedDestinations.find(d => d.id === draft.destinationId) || {
      id: draft.destinationId,
      name: draft.destinationName,
      imageUrl: draft.destinationImageUrl,
    };
  }, [draft.destinationId, draft.destinationName, draft.destinationImageUrl]);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-lg font-semibold text-foreground">Monte seu roteiro</h1>
          
          <button
            onClick={() => navigate('/favoritos')}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Netflix-style destination carousel */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Escolha seu destino
          </h2>
          
          <div 
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {curatedDestinations.map((destination, index) => {
              const isDisabled = !destination.available;
              const isSelected = draft.destinationId === destination.id;
              
              return (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectDestination(destination)}
                  className={cn(
                    "relative flex-shrink-0 w-40 aspect-[3/4] rounded-2xl overflow-hidden transition-all",
                    isDisabled && "opacity-50 cursor-not-allowed grayscale-[30%]",
                    !isDisabled && "cursor-pointer hover:scale-[1.02]",
                    isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  style={{ scrollSnapAlign: 'start' }}
                  role="button"
                  aria-disabled={isDisabled}
                  aria-selected={isSelected}
                  tabIndex={isDisabled ? -1 : 0}
                >
                  {destination.imageUrl ? (
                    <img
                      src={destination.imageUrl}
                      alt={destination.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent",
                    isSelected && "from-primary/70 via-primary/20"
                  )} />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {destination.name}
                    </h3>
                    <p className="text-white/70 text-xs truncate">
                      {destination.country}
                    </p>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  )}

                  {/* Coming soon badge */}
                  {isDisabled && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded-full">
                      <span className="text-[10px] text-white font-medium">Em breve</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Search bar */}
        <section className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Vai pra onde?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="pl-12 pr-10 h-14 text-base bg-muted/50 border-0 rounded-2xl focus-visible:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search results dropdown - ONLY from internal database */}
          {isSearchFocused && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-lg border border-border z-50 max-h-64 overflow-y-auto"
            >
              {searchResults.map((destination) => {
                const isSelected = draft.destinationId === destination.id;
                
                return (
                  <button
                    key={destination.id}
                    onClick={() => handleSelectDestination(destination)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors first:rounded-t-2xl last:rounded-b-2xl",
                      !destination.available && "opacity-60",
                      isSelected && "bg-primary/10"
                    )}
                  >
                    {destination.imageUrl ? (
                      <img 
                        src={destination.imageUrl} 
                        alt={destination.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{destination.name}</p>
                      <p className="text-sm text-muted-foreground">{destination.country}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                    {!destination.available && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        Em breve
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </section>

        {/* Selected destination display */}
        {selectedDestination && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 rounded-2xl p-4 border border-primary/20"
          >
            <p className="text-sm text-muted-foreground mb-1">Destino selecionado</p>
            <p className="font-semibold text-foreground">{selectedDestination.name}</p>
          </motion.section>
        )}

        {/* Error message */}
        {showError && !isDestinationSelected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-destructive text-center"
          >
            Escolha um destino para continuar.
          </motion.p>
        )}

        {/* Destination-based draft itineraries */}
        {drafts.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Ideias salvas
            </h2>
            
            <div className="space-y-6">
              {drafts.map((draft) => (
                <DestinationDraftSection
                  key={draft.destinationId}
                  draft={draft}
                  onRemoveItem={handleRemoveItem}
                  onSelectDestination={handleSelectDestinationById}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Fixed CTA - positioned above bottom nav with safe area */}
      <div className="fixed bottom-safe-cta left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <Button
          onClick={handleContinue}
          disabled={!isDestinationSelected}
          className="w-full h-14 text-lg font-semibold rounded-2xl"
        >
          Continuar
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MeuRoteiro;
