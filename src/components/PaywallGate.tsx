import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/use-subscription';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { PREMIUM_FEATURES, type PremiumFeatureId } from '@/data/stripe-config';

interface PaywallGateProps {
  featureId: PremiumFeatureId;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wraps premium content. Shows paywall sheet when non-premium user tries to access.
 */
export const PaywallGate = ({ featureId, children, fallback }: PaywallGateProps) => {
  const { isPremium, isAuthenticated, isLoading } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return null;

  if (isPremium) return <>{children}</>;

  const feature = PREMIUM_FEATURES.find(f => f.id === featureId);

  const handleAction = () => {
    if (!isAuthenticated) {
      navigate('/perfil/assinatura?from=' + featureId);
    } else {
      navigate('/perfil/assinatura');
    }
    setShowPaywall(false);
  };

  return (
    <>
      {fallback || (
        <button
          onClick={() => setShowPaywall(true)}
          className="w-full p-6 rounded-2xl bg-muted/50 border border-border flex flex-col items-center gap-3 text-center hover:bg-muted/70 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">
            {feature?.label || 'Conteúdo Premium'}
          </p>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            {feature?.description || 'Desbloqueie com uma assinatura'}
          </p>
          <span className="text-xs text-primary font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Desbloquear acesso
          </span>
        </button>
      )}

      <Sheet open={showPaywall} onOpenChange={setShowPaywall}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {feature?.label || 'Acesso Premium'}
            </SheetTitle>
            <SheetDescription>
              {feature?.description || 'Desbloqueie todo o conteúdo com uma assinatura.'}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-4">
            <div className="space-y-2">
              {PREMIUM_FEATURES.map(f => (
                <div key={f.id} className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{f.label}</span>
                </div>
              ))}
            </div>

            <Button onClick={handleAction} className="w-full" size="lg">
              {isAuthenticated ? 'Ver planos' : 'Criar conta e desbloquear'}
            </Button>

            <button
              onClick={() => setShowPaywall(false)}
              className="w-full text-center text-xs text-muted-foreground py-2"
            >
              Agora não
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

/**
 * Simple hook-based paywall check for inline usage
 */
export const usePaywallCheck = (featureId: PremiumFeatureId) => {
  const { isPremium, isAuthenticated } = useSubscription();
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);

  const checkAccess = (): boolean => {
    if (isPremium) return true;
    setShowPaywall(true);
    return false;
  };

  const goToPlans = () => {
    navigate('/perfil/assinatura');
    setShowPaywall(false);
  };

  return { hasAccess: isPremium, checkAccess, showPaywall, setShowPaywall, goToPlans, isAuthenticated };
};
