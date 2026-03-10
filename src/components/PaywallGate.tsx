import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { Lock, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { PREMIUM_FEATURES, STRIPE_CONFIG, type PremiumFeatureId } from '@/data/stripe-config';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LuckyProPaywall from '@/components/lucky-pro/LuckyProPaywall';

interface PaywallGateProps {
  featureId: PremiumFeatureId;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wraps premium content. Shows Lucky Pro paywall when non-premium user tries to access.
 */
export const PaywallGate = ({ featureId, children, fallback }: PaywallGateProps) => {
  const { isPremium, isAuthenticated, isLoading } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  if (isLoading) return null;
  if (isPremium) return <>{children}</>;

  const feature = PREMIUM_FEATURES.find(f => f.id === featureId);

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

      <LuckyProPaywall open={showPaywall} onClose={() => setShowPaywall(false)} />
    </>
  );
};

/**
 * Guide-specific paywall gate.
 * Allows access if user is premium OR has purchased the specific guide.
 */
interface GuidePaywallGateProps {
  guideId: string;
  guideName?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const GuidePaywallGate = ({ guideId, guideName, children, fallback }: GuidePaywallGateProps) => {
  const { isPremium, isAuthenticated, isLoading, checkGuideAccess } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return null;
  if (isPremium || checkGuideAccess(guideId)) return <>{children}</>;

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      redirectToAuth({ type: "buy_guide", payload: { guideId }, returnTo: window.location.pathname });
      setShowPaywall(false);
      return;
    }

    setPurchaseLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-guide-purchase', {
        body: { guideId, guideName: guideName || guideId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao iniciar compra');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleSubscribe = () => {
    navigate('/perfil/assinatura');
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
            {guideName || 'Guia Premium'}
          </p>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Compre este guia ou assine para desbloquear tudo
          </p>
          <span className="text-xs text-primary font-medium flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" /> Desbloquear
          </span>
        </button>
      )}

      <Sheet open={showPaywall} onOpenChange={setShowPaywall}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              {guideName || 'Guia Premium'}
            </SheetTitle>
            <SheetDescription>
              Escolha como desbloquear este conteúdo
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-3">
            <Button
              onClick={handlePurchase}
              className="w-full"
              size="lg"
              disabled={purchaseLoading}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Comprar guia — {STRIPE_CONFIG.guidePurchase.description}
            </Button>

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button onClick={handleSubscribe} variant="outline" className="w-full" size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Assinar e desbloquear tudo
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