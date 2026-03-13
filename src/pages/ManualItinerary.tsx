import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Calendar, Users, Plus, GripVertical, Trash2, Clock, Sun, Sunset, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useTripDraft } from "@/hooks/use-trip-draft";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * MANUAL ITINERARY BUILDER
 * Uses trip draft data (destination, dates, travelers) - no redundant questions.
 * All text in Portuguese (pt-BR).
 */

interface Experience {
  id: string;
  name: string;
  neighborhood: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  note: string;
}

interface Day {
  id: string;
  dayNumber: number;
  date: Date | null;
  experiences: Experience[];
}

const ManualItinerary = () => {
  const navigate = useNavigate();
  const { draft, tripDays } = useTripDraft();
  
  // Redirect if no destination selected
  if (!draft.destinationId) {
    navigate('/meu-roteiro', { replace: true });
    return null;
  }
  
  const actualTripDays = Math.max(1, tripDays);
  
  // Initialize days based on trip dates
  const [days, setDays] = useState<Day[]>(() => 
    Array.from({ length: actualTripDays }, (_, i) => {
      const dayDate = draft.arrivalAt ? new Date(draft.arrivalAt.getTime() + i * 24 * 60 * 60 * 1000) : null;
      return {
        id: `day-${i + 1}`,
        dayNumber: i + 1,
        date: dayDate,
        experiences: []
      };
    })
  );
  
  // Modal state
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);
  const [currentDayId, setCurrentDayId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    name: "",
    neighborhood: "",
    timeOfDay: "morning",
    note: ""
  });

  // Open add experience modal
  const openAddExperience = (dayId: string) => {
    setCurrentDayId(dayId);
    setNewExperience({ name: "", neighborhood: "", timeOfDay: "morning", note: "" });
    setIsAddExperienceOpen(true);
  };

  // Add experience to day
  const handleAddExperience = () => {
    if (!newExperience.name.trim()) {
      toast.error("Digite o nome da experiência");
      return;
    }

    setDays(prevDays => 
      prevDays.map(day => {
        if (day.id === currentDayId) {
          return {
            ...day,
            experiences: [
              ...day.experiences,
              { ...newExperience, id: `exp-${Date.now()}` }
            ]
          };
        }
        return day;
      })
    );

    setIsAddExperienceOpen(false);
    toast.success("Experiência adicionada");
  };

  // Remove experience
  const removeExperience = (dayId: string, experienceId: string) => {
    setDays(prevDays =>
      prevDays.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            experiences: day.experiences.filter(exp => exp.id !== experienceId)
          };
        }
        return day;
      })
    );
  };

  // Add new day at the end
  const addDay = () => {
    const newDayNumber = days.length + 1;
    const lastDayDate = days.length > 0 && days[days.length - 1].date 
      ? new Date(days[days.length - 1].date!.getTime() + 24 * 60 * 60 * 1000) 
      : null;
    setDays([...days, {
      id: `day-${newDayNumber}-${Date.now()}`,
      dayNumber: newDayNumber,
      date: lastDayDate,
      experiences: []
    }]);
  };

  // Remove day
  const removeDay = (dayId: string) => {
    if (days.length <= 1) {
      toast.error("Você precisa de pelo menos um dia");
      return;
    }
    
    setDays(prevDays => {
      const filtered = prevDays.filter(d => d.id !== dayId);
      return filtered.map((day, idx) => ({ ...day, dayNumber: idx + 1 }));
    });
  };

  // Move day up
  const moveDayUp = (index: number) => {
    if (index === 0) return;
    setDays(prevDays => {
      const newDays = [...prevDays];
      [newDays[index - 1], newDays[index]] = [newDays[index], newDays[index - 1]];
      return newDays.map((day, idx) => ({ ...day, dayNumber: idx + 1 }));
    });
  };

  // Move day down
  const moveDayDown = (index: number) => {
    if (index === days.length - 1) return;
    setDays(prevDays => {
      const newDays = [...prevDays];
      [newDays[index], newDays[index + 1]] = [newDays[index + 1], newDays[index]];
      return newDays.map((day, idx) => ({ ...day, dayNumber: idx + 1 }));
    });
  };

  // Save itinerary
  const handleSave = () => {
    // Convert to the format used by the app
    const itineraryData = {
      destination: draft.destinationName,
      destinationId: draft.destinationId,
      numberOfDays: days.length,
      adults: draft.adults,
      children: draft.children,
      tripStyles: draft.tripStyles,
      days: days.reduce((acc, day) => {
        acc[day.dayNumber] = day.experiences.map(exp => ({
          id: exp.id,
          name: exp.name,
          category: 'custom' as const,
          duration: '2h',
          source: 'manual' as const,
          time: exp.timeOfDay === 'morning' ? '09:00' : exp.timeOfDay === 'afternoon' ? '14:00' : '19:00',
          editorial: exp.note || undefined,
          neighborhood: exp.neighborhood || undefined
        }));
        return acc;
      }, {} as Record<number, any[]>),
      createdAt: new Date().toISOString(),
      type: 'manual'
    };

    // Save to localStorage
    localStorage.setItem('meuRoteiro', JSON.stringify(itineraryData));
    
    toast.success("Roteiro salvo");
    navigate('/meu-roteiro');
  };

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'morning': return <Sun className="w-3.5 h-3.5" />;
      case 'afternoon': return <Sunset className="w-3.5 h-3.5" />;
      case 'evening': return <Moon className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getTimeLabel = (time: string) => {
    switch (time) {
      case 'morning': return 'Manhã';
      case 'afternoon': return 'Tarde';
      case 'evening': return 'Noite';
      default: return time;
    }
  };

  // Format date for display
  const formatDayDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, "EEE, d MMM", { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/meu-roteiro/decisao')}
            className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Criar roteiro manual</h1>
            <p className="text-xs text-muted-foreground">Monte seu roteiro do zero</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* Trip Summary (read-only) */}
        <div className="bg-primary/10 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{draft.destinationName}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {days.length} {days.length === 1 ? 'dia' : 'dias'}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {draft.adults} {draft.adults === 1 ? 'adulto' : 'adultos'}
              {draft.children > 0 && `, ${draft.children} ${draft.children === 1 ? 'criança' : 'crianças'}`}
            </span>
          </div>
        </div>

        {/* Intro */}
        <div className="text-center pb-2">
          <p className="text-muted-foreground text-sm">
            Monte seu roteiro do zero, escolhendo cada experiência no seu ritmo.
          </p>
        </div>

        {/* Itinerary Structure */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dias do roteiro</h2>
          
          <div className="space-y-3">
            {days.map((day, index) => (
              <div key={day.id} className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Day header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveDayUp(index)}
                        disabled={index === 0}
                        className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-semibold text-foreground">
                      Dia {day.dayNumber}
                      {day.date && <span className="font-normal text-muted-foreground ml-2 text-sm">{formatDayDate(day.date)}</span>}
                    </span>
                  </div>
                  <button
                    onClick={() => removeDay(day.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Experiences list */}
                <div className="p-4 space-y-2">
                  {day.experiences.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Nenhuma experiência ainda
                    </p>
                  ) : (
                    day.experiences.map(exp => (
                      <div
                        key={exp.id}
                        className="flex items-start justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {getTimeIcon(exp.timeOfDay)}
                              {getTimeLabel(exp.timeOfDay)}
                            </span>
                          </div>
                          <p className="font-medium text-foreground text-sm">{exp.name}</p>
                          {exp.neighborhood && (
                            <p className="text-xs text-muted-foreground">{exp.neighborhood}</p>
                          )}
                          {exp.note && (
                            <p className="text-xs text-muted-foreground italic mt-1">{exp.note}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeExperience(day.id, exp.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}

                  {/* Add experience button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddExperience(day.id)}
                    className="w-full mt-2 h-10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar experiência
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add new day */}
          <Button
            variant="outline"
            onClick={addDay}
            className="w-full h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar novo dia
          </Button>
        </section>
      </main>

      {/* Fixed save button - positioned above bottom nav with safe area */}
      <div className="fixed bottom-safe-cta left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <Button
          onClick={handleSave}
          className="w-full h-14 text-base font-medium rounded-xl"
        >
          Salvar meu roteiro
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Você pode editar este roteiro depois.
        </p>
      </div>

      {/* Add Experience Modal */}
      <Dialog open={isAddExperienceOpen} onOpenChange={setIsAddExperienceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar experiência</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Experience name */}
            <div className="space-y-2">
              <Label htmlFor="exp-name">Nome da experiência / lugar</Label>
              <Input
                id="exp-name"
                placeholder="Ex: Visitar Cristo Redentor"
                value={newExperience.name}
                onChange={(e) => setNewExperience({ ...newExperience, name: e.target.value })}
              />
            </div>

            {/* Neighborhood */}
            <div className="space-y-2">
              <Label htmlFor="exp-neighborhood">Bairro (opcional)</Label>
              <Input
                id="exp-neighborhood"
                placeholder="Ex: Santa Teresa"
                value={newExperience.neighborhood}
                onChange={(e) => setNewExperience({ ...newExperience, neighborhood: e.target.value })}
              />
            </div>

            {/* Time of day */}
            <div className="space-y-2">
              <Label>Time of day</Label>
              <RadioGroup
                value={newExperience.timeOfDay}
                onValueChange={(v) => setNewExperience({ ...newExperience, timeOfDay: v as 'morning' | 'afternoon' | 'evening' })}
                className="flex gap-2"
              >
                {[
                  { value: 'morning', label: 'Morning', icon: Sun },
                  { value: 'afternoon', label: 'Afternoon', icon: Sunset },
                  { value: 'evening', label: 'Evening', icon: Moon }
                ].map(option => (
                  <div key={option.value} className="flex-1">
                    <RadioGroupItem
                      value={option.value}
                      id={`time-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`time-${option.value}`}
                      className="flex flex-col items-center gap-1 cursor-pointer rounded-lg border border-border p-3 text-center text-xs font-medium transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary hover:bg-muted/50"
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Personal note */}
            <div className="space-y-2">
              <Label htmlFor="exp-note">Personal note (optional)</Label>
              <Textarea
                id="exp-note"
                placeholder="Any details you want to remember..."
                value={newExperience.note}
                onChange={(e) => setNewExperience({ ...newExperience, note: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExperienceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExperience}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManualItinerary;
