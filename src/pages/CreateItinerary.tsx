import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, X, MapPin, Calendar, Clock, Users, Baby, Plus, Minus, ChevronLeft, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { curatedDestinations, searchDestinations, Destination } from "@/data/destinations-database";
import { useTripSetup, Child } from "@/hooks/use-trip-setup";
import { toast } from "@/hooks/use-toast";

/**
 * CREATE ITINERARY PRE-FLOW
 * 
 * Guided setup before the itinerary organization screen:
 * Step 1: Destination search (internal database only)
 * Step 2: Trip details (dates, times, travelers)
 * Step 3: Navigate to planner
 */

type Step = 'destination' | 'details' | 'complete';

const CreateItinerary = () => {
  const navigate = useNavigate();
  const {
    tripSetup,
    tripDays,
    isValid,
    setDestination,
    setDates,
    setTimes,
    setAdultsCount,
    toggleHasChildren,
    addChild,
    removeChild,
    updateChildAge,
  } = useTripSetup();

  const [step, setStep] = useState<Step>('destination');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Search results
  const searchResults = useMemo(() => {
    return searchDestinations(searchQuery);
  }, [searchQuery]);

  // Handle destination selection
  const handleSelectDestination = useCallback((destination: Destination) => {
    if (!destination.available) {
      toast({ 
        title: "Em breve!", 
        description: `${destination.name} estará disponível em breve.` 
      });
      return;
    }
    setSelectedDestination(destination);
    setDestination(destination.id);
    setStep('details');
  }, [setDestination]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (step === 'details') {
      setStep('destination');
    } else {
      navigate(-1);
    }
  }, [step, navigate]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (!isValid) {
      toast({ 
        title: "Preencha todos os campos", 
        description: "Alguns campos obrigatórios estão faltando." 
      });
      return;
    }

    // Navigate to planner with trip setup
    navigate(`/planejar/${tripSetup.destinationId}`);
  }, [isValid, navigate, tripSetup.destinationId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 flex items-center gap-2">
            {/* Step indicators */}
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                step === 'destination' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-primary/20 text-primary"
              )}>
                {step !== 'destination' ? <Check className="w-3.5 h-3.5" /> : '1'}
              </div>
              <span className={cn(
                "hidden sm:block",
                step === 'destination' ? "text-foreground" : "text-muted-foreground"
              )}>
                Destino
              </span>
              
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                step === 'details' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                2
              </div>
              <span className={cn(
                "hidden sm:block",
                step === 'details' ? "text-foreground" : "text-muted-foreground"
              )}>
                Detalhes
              </span>
              
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              
              <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                3
              </div>
              <span className="hidden sm:block text-muted-foreground">
                Montar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-24">
        <AnimatePresence mode="wait">
          {step === 'destination' && (
            <DestinationStep
              key="destination"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              onSelect={handleSelectDestination}
            />
          )}
          
          {step === 'details' && selectedDestination && (
            <DetailsStep
              key="details"
              destination={selectedDestination}
              tripSetup={tripSetup}
              tripDays={tripDays}
              onSetDates={setDates}
              onSetTimes={setTimes}
              onSetAdults={setAdultsCount}
              onToggleChildren={toggleHasChildren}
              onAddChild={addChild}
              onRemoveChild={removeChild}
              onUpdateChildAge={updateChildAge}
              onSubmit={handleSubmit}
              isValid={isValid}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============= STEP 1: DESTINATION =============
interface DestinationStepProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Destination[];
  onSelect: (destination: Destination) => void;
}

const DestinationStep = ({ searchQuery, setSearchQuery, searchResults, onSelect }: DestinationStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4"
    >
      {/* Search header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Vai pra onde?</h1>
        <p className="text-muted-foreground">Escolha seu destino para começar</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar destino..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-10 h-14 text-lg bg-muted/50 border-0 rounded-2xl focus-visible:ring-primary"
          autoFocus
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

      {/* Results */}
      <div className="space-y-2">
        {searchResults.map((destination) => (
          <motion.button
            key={destination.id}
            onClick={() => onSelect(destination)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl transition-all",
              destination.available 
                ? "bg-card hover:bg-accent active:scale-[0.98]" 
                : "bg-muted/30 opacity-60"
            )}
            whileTap={destination.available ? { scale: 0.98 } : undefined}
          >
            {destination.imageUrl ? (
              <img 
                src={destination.imageUrl} 
                alt={destination.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                <MapPin className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-foreground">{destination.name}</h3>
              <p className="text-sm text-muted-foreground">
                {destination.region ? `${destination.region}, ` : ''}{destination.country}
              </p>
            </div>
            
            {destination.available ? (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            ) : (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                Em breve
              </span>
            )}
          </motion.button>
        ))}
        
        {searchResults.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">Nenhum destino encontrado</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============= STEP 2: DETAILS =============
interface DetailsStepProps {
  destination: Destination;
  tripSetup: ReturnType<typeof useTripSetup>['tripSetup'];
  tripDays: number;
  onSetDates: (start: Date | null, end: Date | null) => void;
  onSetTimes: (arrival: string, departure: string) => void;
  onSetAdults: (count: number) => void;
  onToggleChildren: (has: boolean) => void;
  onAddChild: () => void;
  onRemoveChild: (id: string) => void;
  onUpdateChildAge: (id: string, age: number) => void;
  onSubmit: () => void;
  isValid: boolean;
}

const DetailsStep = ({ 
  destination, 
  tripSetup, 
  tripDays,
  onSetDates, 
  onSetTimes, 
  onSetAdults,
  onToggleChildren,
  onAddChild,
  onRemoveChild,
  onUpdateChildAge,
  onSubmit, 
  isValid 
}: DetailsStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4"
    >
      {/* Destination preview */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{destination.name}</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Detalhes da viagem</h1>
        <p className="text-muted-foreground">Quando você vai e quem vai com você?</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Dates */}
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Datas da viagem</h3>
              {tripDays > 0 && (
                <p className="text-sm text-muted-foreground">{tripDays} {tripDays === 1 ? 'dia' : 'dias'}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 justify-start text-left font-normal rounded-xl",
                    !tripSetup.tripStartDate && "text-muted-foreground"
                  )}
                >
                  {tripSetup.tripStartDate 
                    ? format(tripSetup.tripStartDate, "dd/MM/yy", { locale: ptBR })
                    : "Ida"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={tripSetup.tripStartDate || undefined}
                  onSelect={(date) => onSetDates(date || null, tripSetup.tripEndDate)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 justify-start text-left font-normal rounded-xl",
                    !tripSetup.tripEndDate && "text-muted-foreground"
                  )}
                >
                  {tripSetup.tripEndDate 
                    ? format(tripSetup.tripEndDate, "dd/MM/yy", { locale: ptBR })
                    : "Volta"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={tripSetup.tripEndDate || undefined}
                  onSelect={(date) => onSetDates(tripSetup.tripStartDate, date || null)}
                  disabled={(date) => date < (tripSetup.tripStartDate || new Date())}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Times */}
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Horários</h3>
              <p className="text-sm text-muted-foreground">Chegada e partida local</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Chegada</label>
              <Input
                type="time"
                value={tripSetup.arrivalTime}
                onChange={(e) => onSetTimes(e.target.value, tripSetup.departureTime)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Partida</label>
              <Input
                type="time"
                value={tripSetup.departureTime}
                onChange={(e) => onSetTimes(tripSetup.arrivalTime, e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Travelers */}
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Viajantes</h3>
              <p className="text-sm text-muted-foreground">Quem vai nessa?</p>
            </div>
          </div>

          {/* Adults counter */}
          <div className="flex items-center justify-between py-2">
            <span className="text-foreground">Adultos</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full"
                onClick={() => onSetAdults(tripSetup.adultsCount - 1)}
                disabled={tripSetup.adultsCount <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{tripSetup.adultsCount}</span>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full"
                onClick={() => onSetAdults(tripSetup.adultsCount + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Children toggle */}
          <div className="flex items-center justify-between py-2 border-t border-border">
            <div className="flex items-center gap-3">
              <Baby className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Tem crianças?</span>
            </div>
            <Switch
              checked={tripSetup.hasChildren}
              onCheckedChange={onToggleChildren}
            />
          </div>

          {/* Children list */}
          <AnimatePresence>
            {tripSetup.hasChildren && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {tripSetup.children.map((child, index) => (
                  <ChildRow
                    key={child.id}
                    child={child}
                    index={index}
                    onUpdateAge={(age) => onUpdateChildAge(child.id, age)}
                    onRemove={() => onRemoveChild(child.id)}
                  />
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={onAddChild}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar criança
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit button */}
        <Button
          onClick={onSubmit}
          disabled={!isValid}
          className="w-full h-14 text-lg font-semibold rounded-2xl"
        >
          Montar roteiro
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

// ============= CHILD ROW =============
interface ChildRowProps {
  child: Child;
  index: number;
  onUpdateAge: (age: number) => void;
  onRemove: () => void;
}

const ChildRow = ({ child, index, onUpdateAge, onRemove }: ChildRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 py-2 pl-2"
    >
      <span className="text-sm text-muted-foreground flex-1">
        Criança {index + 1}
      </span>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="w-7 h-7 rounded-full"
          onClick={() => onUpdateAge(child.age - 1)}
          disabled={child.age <= 0}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-10 text-center text-sm">
          {child.age} {child.age === 1 ? 'ano' : 'anos'}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="w-7 h-7 rounded-full"
          onClick={() => onUpdateAge(child.age + 1)}
          disabled={child.age >= 17}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="w-7 h-7 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default CreateItinerary;
