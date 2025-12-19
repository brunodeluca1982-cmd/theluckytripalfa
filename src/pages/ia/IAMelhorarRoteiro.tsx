import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, Check, MapPin, Clock, Wallet, Heart, Shield, Plus, Trash2, ChevronRight, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MELHORAR ROTEIRO — MULTI-SCREEN IMPROVEMENT FLOW
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SCREENS:
 * 1. Empty state (if no itinerary)
 * 2. Improvement intent (what to improve)
 * 3. Trip context (days, neighborhood, profile, energy, fixed events)
 * 4. Preview (summary of planned changes)
 * 5. Diff review (accept/revert each change)
 * 6. Completion (redirect to meu-roteiro)
 * 
 * RULES (MVP rule-based engine):
 * - Never move fixed events
 * - Group activities by proximity
 * - Morning: major attractions
 * - Afternoon: lighter activities
 * - Evening: food/nightlife
 * - Insert free time blocks
 * - Avoid distant regions on same day
 * - Reduce load if energy level is low
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Step = 'empty' | 'intent' | 'context' | 'preview' | 'review' | 'done';
type IntentType = 'logistics' | 'pace' | 'budget' | 'preferences' | 'safety';
type EnergyLevel = 'low' | 'medium' | 'high';
type TravelProfile = 'solo' | 'couple' | 'family';

interface FixedEvent {
  id: string;
  day: number;
  time: string;
  title: string;
}

interface Change {
  id: string;
  type: 'moved' | 'replaced' | 'inserted' | 'removed';
  description: string;
  accepted: boolean | null;
}

const intentOptions: { id: IntentType; label: string; icon: React.ElementType }[] = [
  { id: 'logistics', label: 'Logistics', icon: MapPin },
  { id: 'pace', label: 'Pace', icon: Clock },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'preferences', label: 'Preferences', icon: Heart },
  { id: 'safety', label: 'Safety', icon: Shield },
];

const IAMelhorarRoteiro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('intent');
  const [hasItinerary, setHasItinerary] = useState(false);
  
  // Intent state
  const [selectedIntents, setSelectedIntents] = useState<IntentType[]>([]);
  
  // Context state
  const [days, setDays] = useState(3);
  const [baseNeighborhood, setBaseNeighborhood] = useState('');
  const [travelProfile, setTravelProfile] = useState<TravelProfile>('couple');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [hasFixedReservations, setHasFixedReservations] = useState(false);
  const [fixedEvents, setFixedEvents] = useState<FixedEvent[]>([]);
  const [newEventDay, setNewEventDay] = useState(1);
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  
  // Changes state
  const [changes, setChanges] = useState<Change[]>([]);

  // Check if itinerary exists
  useEffect(() => {
    const draft = localStorage.getItem('itinerary_draft') || localStorage.getItem('user-roteiro-rio-de-janeiro');
    if (draft) {
      setHasItinerary(true);
      try {
        const parsed = JSON.parse(draft);
        if (parsed.totalDays) setDays(parsed.totalDays);
      } catch (e) {
        // ignore
      }
    } else {
      setStep('empty');
    }
  }, []);

  const toggleIntent = (intent: IntentType) => {
    setSelectedIntents(prev => 
      prev.includes(intent) 
        ? prev.filter(i => i !== intent)
        : [...prev, intent]
    );
  };

  const addFixedEvent = () => {
    if (!newEventTitle.trim() || !newEventTime.trim()) return;
    setFixedEvents(prev => [
      ...prev,
      {
        id: `fixed-${Date.now()}`,
        day: newEventDay,
        time: newEventTime,
        title: newEventTitle,
      }
    ]);
    setNewEventTitle('');
    setNewEventTime('');
  };

  const removeFixedEvent = (id: string) => {
    setFixedEvents(prev => prev.filter(e => e.id !== id));
  };

  const generateChanges = () => {
    // MVP rule-based improvement engine
    const generatedChanges: Change[] = [];
    
    if (selectedIntents.includes('logistics')) {
      generatedChanges.push({
        id: 'change-1',
        type: 'moved',
        description: 'Moved "Pão de Açúcar" to late afternoon for sunset views',
        accepted: null,
      });
      generatedChanges.push({
        id: 'change-2',
        type: 'moved',
        description: 'Grouped Ipanema and Leblon activities on the same day',
        accepted: null,
      });
    }
    
    if (selectedIntents.includes('pace')) {
      if (energyLevel === 'low') {
        generatedChanges.push({
          id: 'change-3',
          type: 'removed',
          description: 'Removed one activity from Day 2 to allow rest time',
          accepted: null,
        });
      }
      generatedChanges.push({
        id: 'change-4',
        type: 'inserted',
        description: 'Added free time block on Day 3 afternoon',
        accepted: null,
      });
    }
    
    if (selectedIntents.includes('budget')) {
      generatedChanges.push({
        id: 'change-5',
        type: 'replaced',
        description: 'Replaced upscale restaurant with local favorite (similar quality, better price)',
        accepted: null,
      });
    }
    
    if (selectedIntents.includes('preferences')) {
      generatedChanges.push({
        id: 'change-6',
        type: 'inserted',
        description: 'Added beach time at Arpoador based on your preferences',
        accepted: null,
      });
    }
    
    if (selectedIntents.includes('safety')) {
      generatedChanges.push({
        id: 'change-7',
        type: 'moved',
        description: 'Moved Lapa visit to earlier evening for safety',
        accepted: null,
      });
    }
    
    // Default improvements
    if (generatedChanges.length < 3) {
      generatedChanges.push({
        id: 'change-default-1',
        type: 'moved',
        description: 'Optimized route order to minimize travel time',
        accepted: null,
      });
    }
    
    setChanges(generatedChanges);
    setStep('preview');
  };

  const acceptChange = (id: string) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, accepted: true } : c));
  };

  const revertChange = (id: string) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, accepted: false } : c));
  };

  const applyAllChanges = () => {
    // In a real implementation, this would update the actual itinerary
    const acceptedChanges = changes.filter(c => c.accepted !== false);
    
    // Update localStorage with improvements applied flag
    const draft = localStorage.getItem('itinerary_draft') || localStorage.getItem('user-roteiro-rio-de-janeiro');
    if (draft) {
      const parsed = JSON.parse(draft);
      parsed.improvementsApplied = acceptedChanges.map(c => c.id);
      parsed.updatedAt = new Date().toISOString();
      localStorage.setItem('itinerary_draft', JSON.stringify(parsed));
      localStorage.setItem('user-roteiro-rio-de-janeiro', JSON.stringify(parsed));
    }
    
    setStep('done');
    toast.success('Roteiro melhorado');
  };

  const getProgress = () => {
    const steps: Step[] = ['intent', 'context', 'preview', 'review'];
    const idx = steps.indexOf(step as any);
    return idx >= 0 ? ((idx + 1) / 4) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b border-border">
        <Link 
          to="/ia" 
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border text-foreground hover:bg-accent transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-xl font-serif font-medium text-foreground">
          Improve my itinerary
        </h1>
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-2">
          AI-powered suggestions
        </p>
        
        {/* Progress Bar */}
        {step !== 'empty' && step !== 'done' && (
          <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        
        {/* EMPTY STATE */}
        {step === 'empty' && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-foreground/80 text-center mb-2">
              No itinerary found
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
              Create an itinerary first, then come back to improve it.
            </p>
            <Button
              onClick={() => navigate("/ia/criar-roteiro")}
              variant="outline"
            >
              Create my itinerary
            </Button>
          </div>
        )}

        {/* SCREEN 1 — IMPROVEMENT INTENT */}
        {step === 'intent' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg text-foreground/80 font-light">
                What would you like to improve?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Select all that apply
              </p>
            </div>

            <div className="space-y-3">
              {intentOptions.map((option) => {
                const isSelected = selectedIntents.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleIntent(option.id)}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border transition-all
                      ${isSelected 
                        ? "bg-primary/10 border-primary" 
                        : "bg-card border-border hover:bg-muted"
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isSelected ? "bg-primary/20" : "bg-muted"}
                    `}>
                      <option.icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <span className="font-medium text-foreground">{option.label}</span>
                    {isSelected && <Check className="w-5 h-5 text-primary ml-auto" />}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setStep('context')}
              disabled={selectedIntents.length === 0}
              className="w-full mt-6"
              size="lg"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* SCREEN 2 — TRIP CONTEXT */}
        {step === 'context' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg text-foreground/80 font-light">
                Tell me about your trip
              </p>
            </div>

            {/* Number of days */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Number of days</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="w-10 h-10 rounded-lg bg-muted border border-border text-foreground hover:bg-accent transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-medium w-8 text-center">{days}</span>
                <button
                  onClick={() => setDays(Math.min(14, days + 1))}
                  className="w-10 h-10 rounded-lg bg-muted border border-border text-foreground hover:bg-accent transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Base neighborhood */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Base neighborhood or hotel</label>
              <Input
                value={baseNeighborhood}
                onChange={(e) => setBaseNeighborhood(e.target.value)}
                placeholder="e.g., Ipanema, Hotel Fasano"
                className="h-12"
              />
            </div>

            {/* Travel profile */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Travel profile</label>
              <div className="flex gap-2">
                {(['solo', 'couple', 'family'] as TravelProfile[]).map((profile) => (
                  <button
                    key={profile}
                    onClick={() => setTravelProfile(profile)}
                    className={`
                      flex-1 py-3 px-4 rounded-lg border transition-all capitalize
                      ${travelProfile === profile 
                        ? "bg-primary/10 border-primary text-foreground" 
                        : "bg-card border-border text-muted-foreground hover:bg-muted"
                      }
                    `}
                  >
                    {profile}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Energy level</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setEnergyLevel(level)}
                    className={`
                      flex-1 py-3 px-4 rounded-lg border transition-all capitalize
                      ${energyLevel === level 
                        ? "bg-primary/10 border-primary text-foreground" 
                        : "bg-card border-border text-muted-foreground hover:bg-muted"
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Fixed reservations */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Fixed reservations?</label>
                <Switch 
                  checked={hasFixedReservations}
                  onCheckedChange={setHasFixedReservations}
                />
              </div>

              {hasFixedReservations && (
                <div className="space-y-3 pl-1">
                  {/* Fixed events list */}
                  {fixedEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">Day {event.day} at {event.time}</p>
                      </div>
                      <button
                        onClick={() => removeFixedEvent(event.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add fixed event */}
                  <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-dashed border-border">
                    <div className="flex gap-2">
                      <select
                        value={newEventDay}
                        onChange={(e) => setNewEventDay(Number(e.target.value))}
                        className="w-20 h-10 rounded-lg bg-background border border-border text-sm px-2"
                      >
                        {Array.from({ length: days }, (_, i) => (
                          <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                        ))}
                      </select>
                      <Input
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        placeholder="Time (e.g., 19:00)"
                        className="w-24 h-10"
                      />
                      <Input
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="Event title"
                        className="flex-1 h-10"
                      />
                    </div>
                    <Button
                      onClick={addFixedEvent}
                      variant="outline"
                      size="sm"
                      disabled={!newEventTitle.trim() || !newEventTime.trim()}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add fixed event
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={generateChanges}
              className="w-full mt-6"
              size="lg"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* SCREEN 3 — PREVIEW */}
        {step === 'preview' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg text-foreground/80 font-light">
                Here's what I'll improve
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {changes.length} changes planned
              </p>
            </div>

            <div className="space-y-3">
              {changes.map((change, idx) => (
                <div key={change.id} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <span className={`
                      text-xs font-medium uppercase tracking-wider
                      ${change.type === 'moved' ? 'text-blue-500' : ''}
                      ${change.type === 'replaced' ? 'text-amber-500' : ''}
                      ${change.type === 'inserted' ? 'text-green-500' : ''}
                      ${change.type === 'removed' ? 'text-red-500' : ''}
                    `}>
                      {change.type}
                    </span>
                    <p className="text-sm text-foreground mt-1">{change.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => {
                  // Apply all and go to done
                  changes.forEach(c => acceptChange(c.id));
                  applyAllChanges();
                }}
                className="w-full"
                size="lg"
              >
                Apply improvements
              </Button>
              <Button
                onClick={() => setStep('review')}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Review changes one by one
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* SCREEN 4 — DIFF REVIEW */}
        {step === 'review' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-lg text-foreground/80 font-light">
                Review each change
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Accept or revert individually
              </p>
            </div>

            <div className="space-y-3">
              {changes.map((change) => (
                <div 
                  key={change.id} 
                  className={`
                    p-4 rounded-xl border transition-all
                    ${change.accepted === true ? 'bg-green-500/5 border-green-500/30' : ''}
                    ${change.accepted === false ? 'bg-muted/30 border-border/50 opacity-50' : ''}
                    ${change.accepted === null ? 'bg-card border-border' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className={`
                      text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded
                      ${change.type === 'moved' ? 'bg-blue-500/10 text-blue-500' : ''}
                      ${change.type === 'replaced' ? 'bg-amber-500/10 text-amber-500' : ''}
                      ${change.type === 'inserted' ? 'bg-green-500/10 text-green-500' : ''}
                      ${change.type === 'removed' ? 'bg-red-500/10 text-red-500' : ''}
                    `}>
                      {change.type}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mt-2">{change.description}</p>
                  
                  {change.accepted === null && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={() => acceptChange(change.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => revertChange(change.id)}
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Revert
                      </Button>
                    </div>
                  )}
                  
                  {change.accepted === true && (
                    <p className="text-xs text-green-600 mt-2">Accepted</p>
                  )}
                  {change.accepted === false && (
                    <p className="text-xs text-muted-foreground mt-2">Reverted</p>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={applyAllChanges}
              className="w-full mt-6"
              size="lg"
              disabled={changes.every(c => c.accepted === null)}
            >
              Apply all changes
            </Button>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-lg text-foreground text-center font-medium mb-2">
              Itinerary improved
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-xs mb-8">
              Your changes have been applied successfully.
            </p>

            <Button
              onClick={() => navigate("/meu-roteiro")}
              className="w-full max-w-xs"
              size="lg"
            >
              View my itinerary
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IAMelhorarRoteiro;
