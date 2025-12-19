import { useState } from "react";
import { Plus, X, Pencil, Star, Search, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GooglePlacesAutocomplete, PlaceData } from "./GooglePlacesAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * ADD ACTIVITY BUTTON
 * 
 * Inline "+" button for day headers with 4 actions:
 * 1. Add manually (write)
 * 2. Add from The Lucky Trip (curated)
 * 3. Add from Google (Places Autocomplete)
 * 4. Add with AI (free text → suggestions)
 */

interface AddActivityButtonProps {
  dayNumber: number;
  onAddManual?: (name: string, day: number) => void;
  onAddFromGoogle?: (place: PlaceData, day: number) => void;
  onAddWithAI?: (prompt: string, day: number) => void;
  onShowCuratedPicker?: (day: number) => void;
}

type ActionType = 'manual' | 'google' | 'ai' | 'curated' | null;
type Step = 'actions' | 'input';

export const AddActivityButton = ({
  dayNumber,
  onAddManual,
  onAddFromGoogle,
  onAddWithAI,
  onShowCuratedPicker,
}: AddActivityButtonProps) => {
  const [open, setOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType>(null);
  const [step, setStep] = useState<Step>('actions');
  const [manualName, setManualName] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const handleClose = () => {
    setOpen(false);
    setCurrentAction(null);
    setStep('actions');
    setManualName('');
    setAiPrompt('');
  };

  const handleActionSelect = (action: ActionType) => {
    if (action === 'curated') {
      onShowCuratedPicker?.(dayNumber);
      handleClose();
      return;
    }
    setCurrentAction(action);
    setStep('input');
  };

  const handleManualSubmit = () => {
    if (manualName.trim()) {
      onAddManual?.(manualName.trim(), dayNumber);
      handleClose();
    }
  };

  const handleGoogleSelect = (place: PlaceData) => {
    onAddFromGoogle?.(place, dayNumber);
    handleClose();
  };

  const handleAISubmit = () => {
    if (aiPrompt.trim()) {
      onAddWithAI?.(aiPrompt, dayNumber);
      handleClose();
    }
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
              Adicionar ao Dia {dayNumber}
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

    return null;
  };

  const getTitle = () => {
    if (step === 'actions') return `Adicionar ao Dia ${dayNumber}`;
    if (currentAction === 'manual') return 'Escrever manualmente';
    if (currentAction === 'google') return 'Buscar no Google';
    if (currentAction === 'ai') return 'Sugerir com IA';
    return `Adicionar ao Dia ${dayNumber}`;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors flex-shrink-0"
        aria-label={`Adicionar atividade ao Dia ${dayNumber}`}
      >
        <Plus className="w-3.5 h-3.5 text-primary" />
      </button>

      <Sheet open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
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
    </>
  );
};

export default AddActivityButton;
