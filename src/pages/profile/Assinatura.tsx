import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, CreditCard, Check, Sparkles, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/use-subscription';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_CONFIG, PREMIUM_FEATURES, type PlanType } from '@/data/stripe-config';
import { toast } from 'sonner';

const Assinatura = () => {
  const { isPremium, planType, subscriptionEnd, isAuthenticated, isLoading, refreshSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Faça login para assinar');
      return;
    }

    setCheckoutLoading(true);
    try {
      const priceId = STRIPE_CONFIG.prices[selectedPlan].id;
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao iniciar checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao abrir portal');
    } finally {
      setPortalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 py-4 border-b border-border">
        <Link to="/perfil" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>
      </header>

      <main className="px-6 pt-8 max-w-md mx-auto">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
          >
            <p className="text-sm text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
              <Check className="w-4 h-4" /> Assinatura ativada com sucesso!
            </p>
          </motion.div>
        )}

        <h1 className="text-3xl font-serif font-semibold text-foreground leading-tight mb-2">
          {isPremium ? 'Seu Plano' : 'Desbloqueie tudo'}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isPremium
            ? `Plano ${planType || 'premium'} ativo`
            : 'Inteligência humana em viagens, sem limites.'}
        </p>

        {/* Premium Features */}
        <div className="space-y-3 mb-8">
          {PREMIUM_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/30"
            >
              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {isPremium ? (
          /* Active subscription management */
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Plano {planType}</span>
              </div>
              {subscriptionEnd && (
                <p className="text-xs text-muted-foreground">
                  Próxima renovação: {new Date(subscriptionEnd).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleManageSubscription}
              disabled={portalLoading}
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ExternalLink className="w-4 h-4 mr-2" />}
              Gerenciar assinatura
            </Button>

            <Button variant="ghost" className="w-full text-xs" onClick={refreshSubscription}>
              Atualizar status
            </Button>
          </div>
        ) : (
          /* Plan selection */
          <div className="space-y-4">
            <div className="space-y-2">
              {(Object.entries(STRIPE_CONFIG.prices) as [PlanType, typeof STRIPE_CONFIG.prices[PlanType]][]).map(([key, plan]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedPlan === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{plan.label}</span>
                        {'popular' in plan && plan.popular && (
                          <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === key ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                    }`}>
                      {selectedPlan === key && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                  {'savings' in plan && plan.savings && (
                    <p className="text-xs text-primary font-medium mt-1">{plan.savings}</p>
                  )}
                </button>
              ))}
            </div>

            <Button onClick={handleCheckout} className="w-full" size="lg" disabled={checkoutLoading}>
              {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Assinar agora
            </Button>

            <p className="text-[10px] text-muted-foreground text-center">
              Cancele quando quiser. Pagamento seguro via Stripe.
            </p>
          </div>
        )}
      </main>

      <footer className="px-6 py-8 border-t border-border mt-8">
        <p className="text-xs text-muted-foreground">The Lucky Trip</p>
      </footer>
    </div>
  );
};

export default Assinatura;
