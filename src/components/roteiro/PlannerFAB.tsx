import { useState } from "react";
import { Plus, X, Pencil, Star, Search, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GooglePlacesAutocomplete, PlaceData } from "./GooglePlacesAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * PLANNER FAB
 * 
 * Single "+" button with 4 actions:
 * 1. Add manually (write)
 * 2. Add from The Lucky Trip (curated)
 * 3. Add from Google (Places Autocomplete)
 * 4. Add with AI (free text → suggestions)
 * 
 * All options return draggable cards.
 * Nothing is added automatically.
 */

interface PlannerFABProps {
  totalDays: number;
  onAddManual?: (name: string, day: number) => void;
  onAddFromGoogle?: (place: PlaceData, day: number) => void;
  onAddWithAI?: (prompt: string) => void;
  onShowCuratedPicker?: () => void;
}

type ActionType = 'manual' | 'google' | 'ai' | 'curated' | null;
type Step = 'actions' | 'input' | 'select-day';

export const PlannerFAB = ({
  totalDays,
  onAddManual,
  onAddFromGoogle,
  onAddWithAI,
  onShowCuratedPicker,
}: PlannerFABProps) => {
  const [open, setOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType>(null);
  const [step, setStep] = useState<Step>('actions');
  const [manualName, setManualName] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleClose = () => {
    setOpen(false);
    setCurrentAction(null);
    setStep('actions');
    setManualName('');
    setSelectedPlace(null);
    setAiPrompt('');
  };

  const handleActionSelect = (action: ActionType) => {
    if (action === 'curated') {
      onShowCuratedPicker?.();
      handleClose();
      return;
    }
    setCurrentAction(action);
    setStep('input');
  };

  const handleManualSubmit = () => {
    if (manualName.trim()) {
      setStep('select-day');
    }
  };

  const handleGoogleSelect = (place: PlaceData) => {
    setSelectedPlace(place);
    setStep('select-day');
  };

  const handleAISubmit = () => {
    if (aiPrompt.trim()) {
      onAddWithAI?.(aiPrompt);
      handleClose();
    }
  };

  const handleDaySelect = (day: number) => {
    if (currentAction === 'manual' && manualName.trim()) {
      onAddManual?.(manualName.trim(), day);
    } else if (currentAction === 'google' && selectedPlace) {
      onAddFromGoogle?.(selectedPlace, day);
    }
    handleClose();
  };

  const actions = [
    {
      id: 'manual' as ActionType,
      icon: Pencil,
      label: 'Escrever manualmente',
      description: 'Digite o nome do local',
    },
    {
      id: 'curated' as ActionType,
      icon: Star,
      label: 'Adicionar do Lucky Trip',
      description: 'Conteúdo curado + premium',
    },
    {
      id: 'google' as ActionType,
      icon: Search,
      label: 'Buscar no Google',
      description: 'Google Places Autocomplete',
    },
    {
      id: 'ai' as ActionType,
      icon: Sparkles,
      label: 'Sugerir com IA',
      description: 'Texto livre → sugestões',
    },
  ];

  const renderContent = () => {
    if (step === 'actions') {
      return (
        <div className="space-y-2 pb-8">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionSelect(action.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      );
    }

    if (step === 'input') {
      if (currentAction === 'manual') {
        return (
          <div className="space-y-4 pb-8">
            <Input
              placeholder="Nome do local..."
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              autoFocus
            />
            <Button 
              onClick={handleManualSubmit} 
              disabled={!manualName.trim()}
              className="w-full"
            >
              Continuar
            </Button>
          </div>
        );
      }

      if (currentAction === 'google') {
        return (
          <div className="pb-8">
            <GooglePlacesAutocomplete
              onPlaceSelect={handleGoogleSelect}
              placeholder="Buscar local..."
            />
          </div>
        );
      }

      if (currentAction === 'ai') {
        return (
          <div className="space-y-4 pb-8">
            <Input
              placeholder="Descreva o que você quer fazer..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAISubmit()}
              autoFocus
            />
            <Button 
              onClick={handleAISubmit} 
              disabled={!aiPrompt.trim()}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar sugestões
            </Button>
          </div>
        );
      }
    }

    if (step === 'select-day') {
      return (
        <div className="space-y-2 pb-8">
          <p className="text-sm text-muted-foreground mb-4">
            Adicionar {currentAction === 'google' ? selectedPlace?.name : manualName} em qual dia?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => handleDaySelect(day)}
                className="p-3 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors text-center font-medium"
              >
                Dia {day}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const getTitle = () => {
    if (step === 'actions') return 'Adicionar local';
    if (step === 'select-day') return 'Escolher dia';
    if (currentAction === 'manual') return 'Escrever manualmente';
    if (currentAction === 'google') return 'Buscar no Google';
    if (currentAction === 'ai') return 'Sugerir com IA';
    return 'Adicionar local';
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all flex items-center justify-center active:scale-95"
          aria-label="Adicionar local"
        >
          {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            {step !== 'actions' && (
              <button
                onClick={() => setStep('actions')}
                className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <SheetTitle>{getTitle()}</SheetTitle>
          </div>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
};

export default PlannerFAB;
