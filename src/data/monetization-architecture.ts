/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MONETIZATION ARCHITECTURE LOCK
 * The Lucky Trip — Content Access Layers
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GOAL:
 * Define content access layers without fixing final pricing or plans.
 * Product supports future monetization changes without refactoring
 * content or navigation.
 * 
 * RULES:
 * - No prices displayed
 * - No final subscription values defined
 * - No paywall UI
 * - Access logic only
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type AccessLayer = 'free' | 'base' | 'premium-addon';

export type PurchaseMethod = 'addon-subscription' | 'one-time-purchase';

export interface ContentAccess {
  contentId: string;
  contentType: string;
  requiredLayer: AccessLayer;
  /**
   * For premium add-ons, how they can be accessed
   */
  purchaseMethods?: PurchaseMethod[];
}

export interface UserEntitlements {
  hasBaseSubscription: boolean;
  premiumAddons: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS LAYERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * LAYER 1 — BASE SUBSCRIPTION
 * 
 * Includes:
 * - Onde ficar
 * - Onde comer
 * - O que fazer
 * - Lucky List (Bruno's personal tips)
 */
export const BASE_SUBSCRIPTION_CONTENT = [
  'onde-ficar',
  'onde-comer',
  'o-que-fazer',
  'lucky-list',
] as const;

/**
 * LAYER 2 — PREMIUM ADD-ONS
 * 
 * Not included in base subscription:
 * - Roteiros do Bruno
 * - Curated tips from invited creators
 */
export const PREMIUM_ADDON_CONTENT = [
  'roteiros-do-bruno',
  'creator-curated-tips',
] as const;

/**
 * FREE CONTENT
 * 
 * Always accessible without subscription
 */
export const FREE_CONTENT = [
  'como-chegar',
  'entender-o-destino',
  // Secondary modules (operational info)
  'mover',
  'vida-noturna',
  'sabores-locais',
  'dinheiro',
  'documentos-visto',
  'melhor-epoca',
  'o-que-levar',
  'gastos-viagem',
  'links-uteis',
  'checklist-final',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS LAYER DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const ACCESS_LAYERS = {
  /**
   * Layer 0 — Free
   * Always accessible
   */
  free: {
    name: 'Free',
    content: FREE_CONTENT,
    requiresPayment: false,
  },
  
  /**
   * Layer 1 — Base Subscription
   */
  base: {
    name: 'Base Subscription',
    content: BASE_SUBSCRIPTION_CONTENT,
    requiresPayment: true,
    // Pricing to be defined later
  },
  
  /**
   * Layer 2 — Premium Add-ons
   */
  premiumAddon: {
    name: 'Premium Add-ons',
    content: PREMIUM_ADDON_CONTENT,
    requiresPayment: true,
    /**
     * ACCESS RULES:
     * Premium Add-ons may be accessed via:
     * a) Add-on subscription
     * b) One-time purchase
     * Exact pricing to be defined later.
     */
    purchaseMethods: ['addon-subscription', 'one-time-purchase'] as PurchaseMethod[],
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT TYPE MAPPING
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENT_ACCESS_MAP: Record<string, AccessLayer> = {
  // Free content
  'como-chegar': 'free',
  'entender-o-destino': 'free',
  'meu-olhar': 'free',
  'historia': 'free',
  'hoje-em-dia': 'free',
  'mover': 'free',
  'vida-noturna': 'free',
  'sabores-locais': 'free',
  'dinheiro': 'free',
  'documentos-visto': 'free',
  'melhor-epoca': 'free',
  'o-que-levar': 'free',
  'gastos-viagem': 'free',
  'links-uteis': 'free',
  'checklist-final': 'free',
  
  // Base subscription content
  'onde-ficar': 'base',
  'onde-comer': 'base',
  'o-que-fazer': 'base',
  'lucky-list': 'base',
  
  // Premium add-on content
  'roteiros-do-bruno': 'premium-addon',
  'creator-curated-tips': 'premium-addon',
};

// ─────────────────────────────────────────────────────────────────────────────
// UI MESSAGING RULES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * UI RULE:
 * 
 * When encountering Premium Add-on content:
 * Show neutral messaging such as:
 * - "Conteúdo adicional"
 * - "Acesso especial"
 */
export const UI_MESSAGING = {
  /**
   * Neutral messaging for premium add-ons
   */
  premiumAddon: {
    labels: [
      'Conteúdo adicional',
      'Acesso especial',
    ] as const,
    
    /**
     * Forbidden messaging patterns
     */
    forbidden: [
      'premium',
      'exclusive',
      'VIP',
      'buy now',
      'limited time',
      'special offer',
    ],
  },
  
  /**
   * Base subscription messaging
   */
  baseSubscription: {
    labels: [
      'Desbloquear acesso',
      'Acessar conteúdo',
    ] as const,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS CONTROL FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get required access layer for content
 */
export const getRequiredLayer = (contentId: string): AccessLayer => {
  return CONTENT_ACCESS_MAP[contentId] || 'free';
};

/**
 * Check if user can access content
 */
export const canAccessContent = (
  contentId: string,
  entitlements: UserEntitlements
): boolean => {
  const requiredLayer = getRequiredLayer(contentId);
  
  switch (requiredLayer) {
    case 'free':
      return true;
      
    case 'base':
      return entitlements.hasBaseSubscription;
      
    case 'premium-addon':
      return entitlements.premiumAddons.includes(contentId);
      
    default:
      return false;
  }
};

/**
 * Get appropriate messaging for locked content
 */
export const getLockedContentMessage = (contentId: string): string => {
  const layer = getRequiredLayer(contentId);
  
  if (layer === 'premium-addon') {
    return UI_MESSAGING.premiumAddon.labels[0];
  }
  
  return UI_MESSAGING.baseSubscription.labels[0];
};

/**
 * Check if content is premium add-on
 */
export const isPremiumAddon = (contentId: string): boolean => {
  return getRequiredLayer(contentId) === 'premium-addon';
};

/**
 * Check if content requires base subscription
 */
export const requiresBaseSubscription = (contentId: string): boolean => {
  return getRequiredLayer(contentId) === 'base';
};

/**
 * Get available purchase methods for premium add-on
 */
export const getPurchaseMethods = (contentId: string): PurchaseMethod[] => {
  if (!isPremiumAddon(contentId)) return [];
  return ACCESS_LAYERS.premiumAddon.purchaseMethods;
};

// ─────────────────────────────────────────────────────────────────────────────
// ENTITLEMENTS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initialize empty entitlements (free user)
 */
export const initializeEntitlements = (): UserEntitlements => {
  return {
    hasBaseSubscription: false,
    premiumAddons: [],
  };
};

/**
 * Grant base subscription
 */
export const grantBaseSubscription = (
  entitlements: UserEntitlements
): UserEntitlements => {
  return {
    ...entitlements,
    hasBaseSubscription: true,
  };
};

/**
 * Grant premium add-on access
 */
export const grantPremiumAddon = (
  entitlements: UserEntitlements,
  addonId: string
): UserEntitlements => {
  if (entitlements.premiumAddons.includes(addonId)) {
    return entitlements;
  }
  
  return {
    ...entitlements,
    premiumAddons: [...entitlements.premiumAddons, addonId],
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SCALABILITY RULE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SCALABILITY RULE:
 * 
 * - This architecture applies to ALL destinations
 * - Pricing and plans may evolve without changing structure
 * 
 * OUTCOME:
 * Product supports future monetization changes
 * without refactoring content or navigation.
 */
export const SCALABILITY = {
  /**
   * Applies to all destinations
   */
  appliesToAllDestinations: true,
  
  /**
   * Future-proof capabilities
   */
  futureReady: [
    'pricing-changes',
    'new-subscription-tiers',
    'bundle-offers',
    'creator-monetization',
    'destination-specific-pricing',
    'promotional-access',
  ] as const,
  
  /**
   * No refactoring required for changes
   */
  refactoringRequired: false,
} as const;
