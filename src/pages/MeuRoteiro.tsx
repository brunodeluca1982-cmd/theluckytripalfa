import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Heart, Search, X, MapPin, Calendar, Clock, 
  Users, Baby, Plus, Minus, ChevronRight 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { curatedDestinations, searchDestinations, Destination } from "@/data/destinations-database";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { toast } from "@/hooks/use-toast";

/**
 * MONTE SEU ROTEIRO — Entry Screen (Step 1)
 * 
 * Route: /meu-roteiro
 * 
 * Netflix-style destination carousel + search + trip parameters.
 * CTA navigates to preferences (Step 2).
 */

const MeuRoteiro = () => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const { 
    draft, 
    isStep1Valid,
    setDestination, 
    setArrival, 
    setDeparture, 
    setAdults, 
    setChildren, 
    setChildAge 
  } = useTripDraft();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Search results
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
    setDestination(
      destination.id, 
      destination.name, 
      destination.id, 
      destination.imageUrl || ''
    );
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleContinue = () => {
    if (!isStep1Valid) {
      toast({ 
        title: "Complete os campos", 
        description: "Selecione destino e datas para continuar." 
      });
      return;
    }
    navigate('/meu-roteiro/preferencias');
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Selected destination object
  const selectedDestination = useMemo(() => {
    return curatedDestinations.find(d => d.id === draft.destinationId) || null;
  }, [draft.destinationId]);

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
              const isSelected = draft.destinationId === destination.id;
              
              return (
                <motion.button
                  key={destination.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectDestination(destination)}
                  className={cn(
                    "relative flex-shrink-0 w-40 aspect-[3/4] rounded-2xl overflow-hidden transition-all",
                    isSelected 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]" 
                      : "ring-0",
                    !destination.available && "opacity-60"
                  )}
                  style={{ scrollSnapAlign: 'start' }}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {destination.name}
                    </h3>
                    <p className="text-white/70 text-xs truncate">
                      {destination.country}
                    </p>
                  </div>

                  {/* Coming soon badge */}
                  {!destination.available && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded-full">
                      <span className="text-[10px] text-white font-medium">Em breve</span>
                    </div>
                  )}

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <svg 
                        className="w-4 h-4 text-primary-foreground" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
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

          {/* Search results dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-lg border border-border z-50 max-h-64 overflow-y-auto"
            >
              {searchResults.map((destination) => (
                <button
                  key={destination.id}
                  onClick={() => handleSelectDestination(destination)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors first:rounded-t-2xl last:rounded-b-2xl",
                    !destination.available && "opacity-60"
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
                  {!destination.available && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      Em breve
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </section>

        {/* Selected destination indicator */}
        {selectedDestination && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl"
          >
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">
              {selectedDestination.name}, {selectedDestination.country}
            </span>
          </motion.div>
        )}

        {/* Trip dates */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Data e horário
          </h2>

          {/* Arrival */}
          <div className="bg-card rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Chegada</p>
            <div className="grid grid-cols-2 gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 justify-start text-left font-normal rounded-xl",
                      !draft.arrivalAt && "text-muted-foreground"
                    )}
                  >
                    {draft.arrivalAt 
                      ? format(draft.arrivalAt, "dd MMM yyyy", { locale: ptBR })
                      : "Data"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={draft.arrivalAt || undefined}
                    onSelect={(date) => setArrival(date || null, draft.arrivalTime)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Input
                type="time"
                value={draft.arrivalTime}
                onChange={(e) => setArrival(draft.arrivalAt, e.target.value)}
                className="h-12 rounded-xl"
                placeholder="Horário"
              />
            </div>
          </div>

          {/* Departure */}
          <div className="bg-card rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Partida</p>
            <div className="grid grid-cols-2 gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 justify-start text-left font-normal rounded-xl",
                      !draft.departureAt && "text-muted-foreground"
                    )}
                  >
                    {draft.departureAt 
                      ? format(draft.departureAt, "dd MMM yyyy", { locale: ptBR })
                      : "Data"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={draft.departureAt || undefined}
                    onSelect={(date) => setDeparture(date || null, draft.departureTime)}
                    disabled={(date) => date < (draft.arrivalAt || new Date())}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Input
                type="time"
                value={draft.departureTime}
                onChange={(e) => setDeparture(draft.departureAt, e.target.value)}
                className="h-12 rounded-xl"
                placeholder="Horário"
              />
            </div>
          </div>
        </section>

        {/* Travelers */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Viajantes
          </h2>

          <div className="bg-card rounded-2xl p-4 space-y-4">
            {/* Adults counter */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Adultos</p>
                <p className="text-sm text-muted-foreground">13+ anos</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setAdults(draft.adults - 1)}
                  disabled={draft.adults <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold text-lg">
                  {draft.adults}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setAdults(draft.adults + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Children counter */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="font-medium text-foreground">Crianças</p>
                <p className="text-sm text-muted-foreground">0-12 anos</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setChildren(draft.children - 1)}
                  disabled={draft.children <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold text-lg">
                  {draft.children}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => setChildren(draft.children + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Children ages */}
            {draft.children > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-4 border-t border-border space-y-3"
              >
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Baby className="w-4 h-4" />
                  Idades das crianças
                </p>
                <div className="flex flex-wrap gap-2">
                  {draft.childrenAges.map((age, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={12}
                        value={age}
                        onChange={(e) => setChildAge(index, parseInt(e.target.value) || 0)}
                        className="w-16 h-10 rounded-xl text-center"
                      />
                      <span className="text-sm text-muted-foreground">anos</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Fixed CTA */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button
          onClick={handleContinue}
          disabled={!isStep1Valid}
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
