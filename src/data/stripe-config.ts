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
      id: 'price_1T9XcNJ2w2OK6FGM4ZtNrpMO',
      amount: 19700,
      label: 'Anual',
      interval: 'year' as const,
      description: 'R$ 197,00/ano',
      savings: 'Economize 45%',
    },
  },
  guidePurchase: {
    priceId: 'price_1T9XcNJ2w2OK6FGMUMmwTkwE',
    amount: 19700,
    description: 'R$ 197,00 (acesso vitalício)',
  },
} as const;

export type PlanType = keyof typeof STRIPE_CONFIG.prices;

export const PREMIUM_FEATURES = [
  { id: 'lucky-list', label: 'The Lucky List', description: 'Dicas exclusivas do Bruno' },
  { id: 'itinerary-editing', label: 'Edição de Roteiro', description: 'Monte e edite roteiros inteligentes' },
  { id: 'multiple-trips', label: 'Múltiplas Viagens', description: 'Planeje viagens simultâneas' },
  { id: 'travel-intelligence', label: 'Inteligência de Viagem', description: 'Análise avançada com IA' },
] as const;

export type PremiumFeatureId = typeof PREMIUM_FEATURES[number]['id'];

/**
 * Check if a feature is gated behind premium
 */
export const isPremiumFeature = (featureId: string): boolean => {
  return PREMIUM_FEATURES.some(f => f.id === featureId);
};
