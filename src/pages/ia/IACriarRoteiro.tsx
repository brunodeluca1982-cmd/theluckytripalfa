import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, Calendar, User, Users, Heart, UserCircle, Palmtree, Building2, Utensils, TreePine, Music, Waves, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CRIAR ROTEIRO — 5-STEP WIZARD (PT-BR)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * STEPS:
 * 1. Quantos dias? (2-8)
 * 2. Estilo: Leve / Equilibrado / Intenso
 * 3. Com quem vai: Sozinho / Casal / Família / Amigos
 * 4. Bairro base: Ipanema / Leblon / Copacabana / Barra
 * 5. Prioridade: Gastronomia / Natureza / Cultura / Praias / Vida noturna
 * 
 * OUTPUT:
 * - Generate draft itinerary based on templates
 * - Save to localStorage as itinerary_draft
 * - Navigate to /meu-roteiro
 * ═══════════════════════════════════════════════════════════════════════════
 */

type Step = 'days' | 'style' | 'company' | 'neighborhood' | 'priority' | 'generating' | 'done';

const styles = [
  { id: 'leve', label: 'Leve', description: 'Poucas atividades, ritmo tranquilo' },
  { id: 'equilibrado', label: 'Equilibrado', description: 'Mix de passeios e descanso' },
  { id: 'intenso', label: 'Intenso', description: 'Aproveitar ao máximo cada dia' },
];

const companies = [
  { id: 'sozinho', label: 'Sozinho', icon: User },
  { id: 'casal', label: 'Casal', icon: Heart },
  { id: 'familia', label: 'Família', icon: Users },
  { id: 'amigos', label: 'Amigos', icon: UserCircle },
];

const neighborhoods = [
  { id: 'ipanema', label: 'Ipanema', description: 'Vibrante, central, jovem' },
  { id: 'leblon', label: 'Leblon', description: 'Exclusivo, familiar, sofisticado' },
  { id: 'copacabana', label: 'Copacabana', description: 'Clássico, acessível, movimentado' },
  { id: 'barra', label: 'Barra da Tijuca', description: 'Praias amplas, shoppings, carro' },
];

const priorities = [
  { id: 'gastronomia', label: 'Gastronomia', icon: Utensils },
  { id: 'natureza', label: 'Natureza', icon: TreePine },
  { id: 'cultura', label: 'Cultura', icon: Building2 },
  { id: 'praias', label: 'Praias', icon: Waves },
  { id: 'vida-noturna', label: 'Vida noturna', icon: Music },
];

// Template items for itinerary generation
const templateItems = {
  essentials: [
    { id: 'cristo', title: 'Cristo Redentor', category: 'cultura', time: 'manhã' },
    { id: 'pao-acucar', title: 'Pão de Açúcar', category: 'cultura', time: 'tarde' },
  ],
  gastronomia: [
    { id: 'ct-boucherie', title: 'CT Boucherie', category: 'gastronomia', time: 'jantar' },
    { id: 'zaza', title: 'Zazá Bistrô', category: 'gastronomia', time: 'jantar' },
    { id: 'talho', title: 'Talho Capixaba', category: 'gastronomia', time: 'manhã' },
    { id: 'jobi', title: 'Jobi', category: 'gastronomia', time: 'tarde' },
  ],
  natureza: [
    { id: 'jardim-botanico', title: 'Jardim Botânico', category: 'natureza', time: 'manhã' },
    { id: 'parque-lage', title: 'Parque Lage', category: 'natureza', time: 'manhã' },
    { id: 'dois-irmaos', title: 'Trilha Dois Irmãos', category: 'natureza', time: 'manhã' },
  ],
  cultura: [
    { id: 'santa-teresa', title: 'Santa Teresa', category: 'cultura', time: 'tarde' },
    { id: 'selaron', title: 'Escadaria Selarón', category: 'cultura', time: 'tarde' },
    { id: 'mam', title: 'MAM Rio', category: 'cultura', time: 'manhã' },
  ],
  praias: [
    { id: 'ipanema-praia', title: 'Praia de Ipanema', category: 'praias', time: 'manhã' },
    { id: 'arpoador', title: 'Pôr do sol no Arpoador', category: 'praias', time: 'tarde' },
    { id: 'prainha', title: 'Prainha', category: 'praias', time: 'dia inteiro' },
  ],
  'vida-noturna': [
    { id: 'lapa', title: 'Lapa', category: 'vida-noturna', time: 'noite' },
    { id: 'baixo-gavea', title: 'Baixo Gávea', category: 'vida-noturna', time: 'noite' },
    { id: 'leblon-bar', title: 'Bares do Leblon', category: 'vida-noturna', time: 'noite' },
  ],
};

const IACriarRoteiro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('days');
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState<string | null>(null);
  const [company, setCompany] = useState<string | null>(null);
  const [neighborhood, setNeighborhood] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);

  const generateItinerary = () => {
    setStep('generating');
    
    // Calculate items per day based on style
    const itemsPerDay = style === 'leve' ? 2 : style === 'equilibrado' ? 3 : 4;
    
    // Build itinerary
    const itinerary: Record<number, any[]> = {};
    const allGeneratedItems: any[] = [];
    
    for (let day = 1; day <= days; day++) {
      const dayItems: any[] = [];
      
      // Day 1 always has Cristo
      if (day === 1 && dayItems.length < itemsPerDay) {
        dayItems.push({ ...templateItems.essentials[0], day });
      }
      
      // Add priority items
      if (priority && templateItems[priority as keyof typeof templateItems]) {
        const priorityItems = templateItems[priority as keyof typeof templateItems];
        const availableItems = priorityItems.filter(item => 
          !dayItems.some(di => di.id === item.id) &&
          !allGeneratedItems.some(gi => gi.id === item.id)
        );
        while (dayItems.length < itemsPerDay && availableItems.length > 0) {
          const item = availableItems.shift();
          if (item) dayItems.push({ ...item, day });
        }
      }
      
      // Fill remaining with essentials/praias
      if (day === 2 && dayItems.length < itemsPerDay) {
        dayItems.push({ ...templateItems.essentials[1], day }); // Pão de Açúcar
      }
      
      const beachItems = templateItems.praias.filter(item => 
        !dayItems.some(di => di.id === item.id) &&
        !allGeneratedItems.some(gi => gi.id === item.id)
      );
      while (dayItems.length < itemsPerDay && beachItems.length > 0) {
        const item = beachItems.shift();
        if (item) dayItems.push({ ...item, day });
      }
      
      itinerary[day] = dayItems;
      allGeneratedItems.push(...dayItems);
    }

    // ─── Converge into Minha Viagem (draft-roteiro) ──────────────────────────
    // Transform generated items into SavedItem format so both flows
    // (manual saves + criar roteiro) land in the same place.
    const DRAFT_KEY = 'draft-roteiro';
    const existing: any[] = (() => {
      try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); }
      catch { return []; }
    })();

    const categoryToType = (cat: string): string => {
      if (cat === 'gastronomia') return 'restaurant';
      if (cat === 'praias' || cat === 'natureza' || cat === 'cultura') return 'activity';
      if (cat === 'vida-noturna') return 'nightlife';
      return 'activity';
    };

    const newItems = allGeneratedItems
      .filter(item => !existing.some((e: any) => e.id === item.id))
      .map(item => ({
        id: item.id,
        type: categoryToType(item.category),
        title: item.title,
        savedAt: new Date().toISOString(),
        isPremium: false,
        destinationId: 'rio-de-janeiro',
        destinationName: 'Rio de Janeiro',
      }));

    const merged = [...existing, ...newItems];
    localStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('roteiro-updated'));

    // Also keep legacy keys for backward compat
    const legacyDraft = {
      destinationId: 'rio-de-janeiro',
      totalDays: days,
      items: itinerary,
      status: 'rascunho',
      preferences: { style, company, neighborhood, priority },
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('user-roteiro-rio-de-janeiro', JSON.stringify(legacyDraft));
    // ─────────────────────────────────────────────────────────────────────────
    
    setTimeout(() => {
      setStep('done');
    }, 2000);
  };

  const canProceed = () => {
    switch (step) {
      case 'days': return [2, 3, 5, 7].includes(days);
      case 'style': return style !== null;
      case 'company': return company !== null;
      case 'neighborhood': return neighborhood !== null;
      case 'priority': return priority !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    switch (step) {
      case 'days': setStep('style'); break;
      case 'style': setStep('company'); break;
      case 'company': setStep('neighborhood'); break;
      case 'neighborhood': setStep('priority'); break;
      case 'priority': generateItinerary(); break;
    }
  };

  const getProgress = () => {
    const steps: Step[] = ['days', 'style', 'company', 'neighborhood', 'priority'];
    const idx = steps.indexOf(step as any);
    return idx >= 0 ? ((idx + 1) / 5) * 100 : 0;
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
          Criar meu roteiro
        </h1>
        <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase mt-2">
          Rio de Janeiro
        </p>
        
        {/* Progress Bar */}
        {step !== 'generating' && step !== 'done' && (
          <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        
        {/* STEP 1 — DAYS */}
        {step === 'days' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg text-foreground/80 font-light">
                Quantos dias?
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Viagens mais longas são organizadas em partes para facilitar ajustes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[2, 3, 5, 7].map((dayOption) => (
                <button
                  key={dayOption}
                  onClick={() => setDays(dayOption)}
                  className={`
                    flex flex-col items-center gap-2 p-5 rounded-xl border transition-all
                    ${days === dayOption 
                      ? "bg-primary/10 border-primary" 
                      : "bg-card border-border hover:bg-muted"
                    }
                  `}
                >
                  <span className={`text-3xl font-serif font-medium ${days === dayOption ? "text-primary" : "text-foreground"}`}>
                    {dayOption}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {dayOption === 2 ? "dias" : dayOption === 3 ? "dias" : dayOption === 5 ? "dias" : "dias"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — STYLE */}
        {step === 'style' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg text-foreground/80 font-light">
                Qual seu estilo de viagem?
              </p>
            </div>

            <div className="space-y-3">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-xl border transition-all
                    ${style === s.id 
                      ? "bg-primary/10 border-primary" 
                      : "bg-card border-border hover:bg-muted"
                    }
                  `}
                >
                  <div className="text-left">
                    <p className="font-medium text-foreground">{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                  {style === s.id && <Check className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — COMPANY */}
        {step === 'company' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg text-foreground/80 font-light">
                Com quem vai?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCompany(c.id)}
                  className={`
                    flex flex-col items-center gap-3 p-5 rounded-xl border transition-all
                    ${company === c.id 
                      ? "bg-primary/10 border-primary" 
                      : "bg-card border-border hover:bg-muted"
                    }
                  `}
                >
                  <c.icon className={`w-7 h-7 ${company === c.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-medium text-foreground text-sm">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — NEIGHBORHOOD */}
        {step === 'neighborhood' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg text-foreground/80 font-light">
                Bairro base?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Onde você vai ficar hospedado
              </p>
            </div>

            <div className="space-y-3">
              {neighborhoods.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNeighborhood(n.id)}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-xl border transition-all
                    ${neighborhood === n.id 
                      ? "bg-primary/10 border-primary" 
                      : "bg-card border-border hover:bg-muted"
                    }
                  `}
                >
                  <div className="text-left">
                    <p className="font-medium text-foreground">{n.label}</p>
                    <p className="text-sm text-muted-foreground">{n.description}</p>
                  </div>
                  {neighborhood === n.id && <Check className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5 — PRIORITY */}
        {step === 'priority' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg text-foreground/80 font-light">
                Sua prioridade?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                O que não pode faltar
              </p>
            </div>

            <div className="space-y-3">
              {priorities.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriority(p.id)}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl border transition-all
                    ${priority === p.id 
                      ? "bg-primary/10 border-primary" 
                      : "bg-card border-border hover:bg-muted"
                    }
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${priority === p.id ? "bg-primary/20" : "bg-muted"}
                  `}>
                    <p.icon className={`w-5 h-5 ${priority === p.id ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <span className="font-medium text-foreground">{p.label}</span>
                  {priority === p.id && <Check className="w-5 h-5 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GENERATING */}
        {step === 'generating' && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <p className="text-foreground/80 text-center">
              Criando seu roteiro...
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Baseado nas suas preferências
            </p>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Check className="w-7 h-7 text-primary" />
            </div>
            <p className="text-lg text-foreground text-center font-medium mb-2">
              Lugares adicionados à sua viagem
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-xs mb-8">
              Acesse Minha Viagem e peça para o Lucky organizar seu roteiro.
            </p>

            <div className="space-y-3 w-full max-w-xs">
              <Button
                onClick={() => navigate("/minha-viagem")}
                className="w-full"
                size="lg"
              >
                Ver Minha Viagem
              </Button>
              <Button
                onClick={() => navigate("/ia")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Pedir ao Lucky para organizar
              </Button>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {step !== 'generating' && step !== 'done' && (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full mt-8"
            size="lg"
          >
            {step === 'priority' ? 'Gerar meu roteiro' : 'Continuar'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default IACriarRoteiro;
