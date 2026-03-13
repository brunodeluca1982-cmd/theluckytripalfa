/**
 * Stripe price and product mapping for The Lucky Trip
 */

export const STRIPE_CONFIG = {
  product: {
    id: 'prod_U7n9q0p7VbaRfP',
    name: 'The Lucky Trip Premium',
  },
  prices: {
    weekly: {
      id: 'price_1T9XZ6J2w2OK6FGMPG0Yx3t8',
      amount: 990,
      label: 'Semanal',
      interval: 'week' as const,
      description: 'R$ 9,90/semana',
    },
    monthly: {
      id: 'price_1T9XcNJ2w2OK6FGMJN565MWx',
      amount: 2990,
      label: 'Mensal',
      interval: 'month' as const,
      description: 'R$ 29,90/mês',
      popular: true,
    },
    yearly: {
      id: 'price_1T9YqIJ2w2OK6FGMSod2kUak',
      amount: 9700,
      label: 'Anual',
      interval: 'year' as const,
      description: 'R$ 97,00/ano',
      savings: 'Plano fundador — melhor escolha',
      recommended: true,
    },
  },
  guidePurchase: {
    priceId: 'price_1T9XcNJ2w2OK6FGMUMmwTkwE',
    amount: 19700,
    description: 'R$ 197,00 (acesso vitalício)',
  },
  roteiroPurchase: {
    priceId: 'price_1T9XcNJ2w2OK6FGMUMmwTkwE',
    amount: 15000,
    description: 'R$ 150,00 (roteiro avulso)',
  },
} as const;

export type PlanType = keyof typeof STRIPE_CONFIG.prices;

export const PREMIUM_FEATURES = [
  { id: 'lucky-list', label: 'Lucky List completa', description: 'Todos os segredos exclusivos' },
  { id: 'ia-unlimited', label: 'IA ilimitada', description: 'Sugestões e planejamento sem limites' },
  { id: 'unlimited-trips', label: 'Viagens ilimitadas', description: 'Planeje quantas viagens quiser' },
  { id: 'unlimited-edits', label: 'Edições ilimitadas', description: 'Edite e refine seus roteiros' },
  { id: 'auto-organize', label: 'Organização inteligente', description: 'Roteiros organizados automaticamente' },
] as const;

export type PremiumFeatureId = typeof PREMIUM_FEATURES[number]['id'];

export const isPremiumFeature = (featureId: string): boolean => {
  return PREMIUM_FEATURES.some(f => f.id === featureId);
};
