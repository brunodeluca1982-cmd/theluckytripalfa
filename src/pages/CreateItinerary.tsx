import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, X, MapPin, Calendar, Clock, Users, Baby, Plus, Minus, ChevronLeft, Check, Plane } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { curatedDestinations, searchDestinations, Destination, getDestination } from "@/data/destinations-database";
import { useTripSetup, Child, SetupStep } from "@/hooks/use-trip-setup";
import { toast } from "@/hooks/use-toast";

/**
 * CREATE ITINERARY PRE-FLOW (MANDATORY)
 * 
 * Blocking setup before itinerary access:
 * Step 1: Destination search (internal database only)
 * Step 2: Travel dates & times
 * Step 3: Travel party (adults, children)
 * Step 4: Confirmation summary
 * 
 * User cannot access planner until setup is complete.
 */

const CreateItinerary = () => {
  const navigate = useNavigate();
  const {
    tripSetup,
    tripDays,
    isValid,
    isDestinationValid,
    isDatesValid,
    isTravelersValid,
    setDestination,
    setDates,
    setTimes,
    setAdultsCount,
    toggleHasChildren,
    addChild,
    removeChild,
    updateChildAge,
    setCurrentStep,
    completeSetup,
  } = useTripSetup();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(() => {
    if (tripSetup.destinationId) {
      return getDestination(tripSetup.destinationId) || null;
    }
    return null;
  });

  // Resume from last incomplete step
  useEffect(() => {
    if (tripSetup.setupComplete) {
      // Already complete, go to planner
      navigate(`/planejar/${tripSetup.destinationId}`, { replace: true });
    }
  }, [tripSetup.setupComplete, tripSetup.destinationId, navigate]);

  const step = tripSetup.currentStep;

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
    setCurrentStep('dates');
  }, [setDestination, setCurrentStep]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (step === 'dates') {
      setCurrentStep('destination');
    } else if (step === 'travelers') {
      setCurrentStep('dates');
    } else if (step === 'confirmation') {
      setCurrentStep('travelers');
    } else {
      navigate(-1);
    }
  }, [step, navigate, setCurrentStep]);

  // Handle step navigation
  const handleNextStep = useCallback(() => {
    if (step === 'dates' && isDatesValid) {
      setCurrentStep('travelers');
    } else if (step === 'travelers' && isTravelersValid) {
      setCurrentStep('confirmation');
    }
  }, [step, isDatesValid, isTravelersValid, setCurrentStep]);

  // Handle final confirmation
  const handleConfirm = useCallback(() => {
    if (!isValid) {
      toast({ 
        title: "Preencha todos os campos", 
        description: "Alguns campos obrigatórios estão faltando." 
      });
      return;
    }

    completeSetup();
    navigate(`/planejar/${tripSetup.destinationId}`);
  }, [isValid, completeSetup, navigate, tripSetup.destinationId]);

  // Progress calculation
  const stepOrder: SetupStep[] = ['destination', 'dates', 'travelers', 'confirmation'];
  const currentStepIndex = stepOrder.indexOf(step);
  const progress = ((currentStepIndex + 1) / 4) * 100;

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
          
          <div className="flex-1">
            {/* Progress bar */}
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* Step indicators */}
            <div className="flex items-center justify-between mt-2 text-xs font-medium">
              {stepOrder.map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors",
                    currentStepIndex > i 
                      ? "bg-primary text-primary-foreground" 
                      : currentStepIndex === i 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                  )}>
                    {currentStepIndex > i ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-24">
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
          
          {step === 'dates' && selectedDestination && (
            <DatesStep
              key="dates"
              destination={selectedDestination}
              tripSetup={tripSetup}
              tripDays={tripDays}
              onSetDates={setDates}
              onSetTimes={setTimes}
              onNext={handleNextStep}
              isValid={isDatesValid}
            />
          )}

          {step === 'travelers' && selectedDestination && (
            <TravelersStep
              key="travelers"
              tripSetup={tripSetup}
              onSetAdults={setAdultsCount}
              onToggleChildren={toggleHasChildren}
              onAddChild={addChild}
              onRemoveChild={removeChild}
              onUpdateChildAge={updateChildAge}
              onNext={handleNextStep}
              isValid={isTravelersValid}
            />
          )}

          {step === 'confirmation' && selectedDestination && (
            <ConfirmationStep
              key="confirmation"
              destination={selectedDestination}
              tripSetup={tripSetup}
              tripDays={tripDays}
              onConfirm={handleConfirm}
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
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Where are you going?</h1>
        <p className="text-muted-foreground">Select your destination to continue</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search destination..."
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
                Coming soon
              </span>
            )}
          </motion.button>
        ))}
        
        {searchResults.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">No destinations found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============= STEP 2: DATES & TIMES =============
interface DatesStepProps {
  destination: Destination;
  tripSetup: ReturnType<typeof useTripSetup>['tripSetup'];
  tripDays: number;
  onSetDates: (start: Date | null, end: Date | null) => void;
  onSetTimes: (arrival: string, departure: string) => void;
  onNext: () => void;
  isValid: boolean;
}

const DatesStep = ({ 
  destination, 
  tripSetup, 
  tripDays,
  onSetDates, 
  onSetTimes, 
  onNext, 
  isValid 
}: DatesStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{destination.name}</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">When are you traveling?</h1>
        <p className="text-muted-foreground">Set your arrival and departure</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Dates */}
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Travel dates</h3>
              {tripDays > 0 && (
                <p className="text-sm text-muted-foreground">{tripDays} {tripDays === 1 ? 'day' : 'days'}</p>
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
                    ? format(tripSetup.tripStartDate, "MMM dd", { locale: ptBR })
                    : "Arrival"
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
                    ? format(tripSetup.tripEndDate, "MMM dd", { locale: ptBR })
                    : "Departure"
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
              <h3 className="font-semibold text-foreground">Local times</h3>
              <p className="text-sm text-muted-foreground">When do you arrive/leave?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Arrival time</label>
              <Input
                type="time"
                value={tripSetup.arrivalTime}
                onChange={(e) => onSetTimes(e.target.value, tripSetup.departureTime)}
                className="h-12 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Departure time</label>
              <Input
                type="time"
                value={tripSetup.departureTime}
                onChange={(e) => onSetTimes(tripSetup.arrivalTime, e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={onNext}
          disabled={!isValid}
          className="w-full h-14 text-lg font-semibold rounded-2xl"
        >
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

// ============= STEP 3: TRAVELERS =============
interface TravelersStepProps {
  tripSetup: ReturnType<typeof useTripSetup>['tripSetup'];
  onSetAdults: (count: number) => void;
  onToggleChildren: (has: boolean) => void;
  onAddChild: () => void;
  onRemoveChild: (id: string) => void;
  onUpdateChildAge: (id: string, age: number) => void;
  onNext: () => void;
  isValid: boolean;
}

const TravelersStep = ({ 
  tripSetup, 
  onSetAdults,
  onToggleChildren,
  onAddChild,
  onRemoveChild,
  onUpdateChildAge,
  onNext, 
  isValid 
}: TravelersStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Who's traveling?</h1>
        <p className="text-muted-foreground">Tell us about your travel party</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="bg-card rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Travelers</h3>
              <p className="text-sm text-muted-foreground">Adults and children</p>
            </div>
          </div>

          {/* Adults counter */}
          <div className="flex items-center justify-between py-2">
            <span className="text-foreground">Adults</span>
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
              <span className="text-foreground">Any children?</span>
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
                  Add child
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={onNext}
          disabled={!isValid}
          className="w-full h-14 text-lg font-semibold rounded-2xl"
        >
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

// ============= STEP 4: CONFIRMATION =============
interface ConfirmationStepProps {
  destination: Destination;
  tripSetup: ReturnType<typeof useTripSetup>['tripSetup'];
  tripDays: number;
  onConfirm: () => void;
}

const ConfirmationStep = ({ destination, tripSetup, tripDays, onConfirm }: ConfirmationStepProps) => {
  const totalTravelers = tripSetup.adultsCount + tripSetup.children.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4"
    >
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Plane className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Ready to plan!</h1>
        <p className="text-muted-foreground">Review your trip details</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {/* Destination */}
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Destination</p>
              <p className="font-semibold text-foreground">{destination.name}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Dates</p>
              <p className="font-semibold text-foreground">
                {tripSetup.tripStartDate && tripSetup.tripEndDate 
                  ? `${format(tripSetup.tripStartDate, "MMM dd")} - ${format(tripSetup.tripEndDate, "MMM dd, yyyy")}`
                  : 'Not set'
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{tripDays}</p>
              <p className="text-xs text-muted-foreground">{tripDays === 1 ? 'day' : 'days'}</p>
            </div>
          </div>
        </div>

        {/* Times */}
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Local times</p>
              <div className="flex gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Arrival: </span>
                  <span className="font-semibold text-foreground">{tripSetup.arrivalTime || '--:--'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Departure: </span>
                  <span className="font-semibold text-foreground">{tripSetup.departureTime || '--:--'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travelers */}
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Travelers</p>
              <p className="font-semibold text-foreground">
                {tripSetup.adultsCount} {tripSetup.adultsCount === 1 ? 'adult' : 'adults'}
                {tripSetup.children.length > 0 && (
                  <span>, {tripSetup.children.length} {tripSetup.children.length === 1 ? 'child' : 'children'}</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{totalTravelers}</p>
              <p className="text-xs text-muted-foreground">total</p>
            </div>
          </div>
        </div>

        <Button
          onClick={onConfirm}
          className="w-full h-14 text-lg font-semibold rounded-2xl mt-6"
        >
          Create my itinerary
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
        Child {index + 1}
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
          {child.age} {child.age === 1 ? 'yr' : 'yrs'}
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
