import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  planType: string | null;
  subscriptionEnd: string | null;
  purchasedGuides: string[];
  userId: string | null;
  userEmail: string | null;
}

interface SubscriptionContextType extends SubscriptionState {
  refreshSubscription: () => Promise<void>;
  checkGuideAccess: (guideId: string) => boolean;
  hasFeatureAccess: (featureId: string) => boolean;
}

const defaultState: SubscriptionState = {
  isLoading: true,
  isAuthenticated: false,
  isPremium: false,
  planType: null,
  subscriptionEnd: null,
  purchasedGuides: [],
  userId: null,
  userEmail: null,
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  ...defaultState,
  refreshSubscription: async () => {},
  checkGuideAccess: () => false,
  hasFeatureAccess: () => false,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SubscriptionState>(defaultState);

  const refreshSubscription = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, isPremium: false, userId: null, userEmail: null }));
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: true,
          userId: session.user.id,
          userEmail: session.user.email || null,
        }));
        return;
      }

      setState({
        isLoading: false,
        isAuthenticated: true,
        isPremium: data.subscribed || data.level === 'premium',
        planType: data.plan_type || null,
        subscriptionEnd: data.subscription_end || null,
        purchasedGuides: data.purchases || [],
        userId: session.user.id,
        userEmail: session.user.email || null,
      });
    } catch (err) {
      console.error('Subscription check failed:', err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const checkGuideAccess = useCallback((guideId: string): boolean => {
    return state.isPremium || state.purchasedGuides.includes(guideId);
  }, [state.isPremium, state.purchasedGuides]);

  const hasFeatureAccess = useCallback((featureId: string): boolean => {
    return state.isPremium;
  }, [state.isPremium]);

  useEffect(() => {
    refreshSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        refreshSubscription();
      } else {
        setState({ ...defaultState, isLoading: false });
      }
    });

    // Refresh every 60s
    const interval = setInterval(refreshSubscription, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [refreshSubscription]);

  return (
    <SubscriptionContext.Provider value={{ ...state, refreshSubscription, checkGuideAccess, hasFeatureAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
