/**
 * PREMIUM ACCESS & PAYWALL BEHAVIOR
 * Structural Lock
 * 
 * Defines how premium content behaves, how access is gated,
 * and how users are educated about value.
 * 
 * NO pricing, plans, payment UI, or Portuguese content.
 * Behavioral and access logic only.
 */

// =============================================================================
// CORE PRINCIPLE
// =============================================================================

export const PREMIUM_CORE_PRINCIPLE = {
  statement: 'The product feels generous, not gated.',
  noHardWallAtEntry: true,
  valueBeforeRestriction: true,
  firstContactFeelsLikeDiscovery: true,
} as const;

// =============================================================================
// PREMIUM LAYER DEFINITION
// =============================================================================

export const PREMIUM_GATED_ELEMENTS = [
  'lucky-list-content',
  'lucky-list-save-to-roteiro',
] as const;

export const FREE_ELEMENTS = [
  'public-content',
  'entender-destino',
  'what-to-do',
  'where-to-eat',
  'where-to-stay',
  'how-to-get-there',
  'neighborhood-browsing',
  'lucky-list-previews',
  'meu-roteiro-public-items',
] as const;

export type PremiumGatedElement = typeof PREMIUM_GATED_ELEMENTS[number];
export type FreeElement = typeof FREE_ELEMENTS[number];

// =============================================================================
// ACCESS STATES
// =============================================================================

export type AccessState = 'visitor' | 'logged-in' | 'premium';

export interface AccessStateDefinition {
  id: AccessState;
  isAuthenticated: boolean;
  hasPremium: boolean;
  permissions: {
    browsePublicContent: boolean;
    seeLuckyListPreviews: boolean;
    tapLuckyListItems: boolean;
    accessFullLuckyListContent: boolean;
    saveLuckyListItems: boolean;
    savePublicItemsToRoteiro: boolean;
    persistAcrossSessions: boolean;
  };
  onPremiumAttempt: 'trigger-education-flow' | 'trigger-access-flow' | 'allow';
}

export const ACCESS_STATES: Record<AccessState, AccessStateDefinition> = {
  visitor: {
    id: 'visitor',
    isAuthenticated: false,
    hasPremium: false,
    permissions: {
      browsePublicContent: true,
      seeLuckyListPreviews: true,
      tapLuckyListItems: true,
      accessFullLuckyListContent: false,
      saveLuckyListItems: false,
      savePublicItemsToRoteiro: false, // Draft only, not persisted
      persistAcrossSessions: false,
    },
    onPremiumAttempt: 'trigger-education-flow',
  },
  'logged-in': {
    id: 'logged-in',
    isAuthenticated: true,
    hasPremium: false,
    permissions: {
      browsePublicContent: true,
      seeLuckyListPreviews: true,
      tapLuckyListItems: true,
      accessFullLuckyListContent: false,
      saveLuckyListItems: false,
      savePublicItemsToRoteiro: true,
      persistAcrossSessions: true,
    },
    onPremiumAttempt: 'trigger-access-flow',
  },
  premium: {
    id: 'premium',
    isAuthenticated: true,
    hasPremium: true,
    permissions: {
      browsePublicContent: true,
      seeLuckyListPreviews: true,
      tapLuckyListItems: true,
      accessFullLuckyListContent: true,
      saveLuckyListItems: true,
      savePublicItemsToRoteiro: true,
      persistAcrossSessions: true,
    },
    onPremiumAttempt: 'allow',
  },
} as const;

// =============================================================================
// PREMIUM EDUCATION PRINCIPLE
// =============================================================================

export const PREMIUM_EDUCATION = {
  principle: 'Education over obstruction',
  
  neverDo: [
    'block-abruptly',
    'shame-the-user',
    'use-aggressive-language',
    'force-subscribe-at-entry',
    'treat-as-paywall-content',
  ],
  
  alwaysDo: [
    'explain-what-user-gains',
    'show-contextual-value',
    'reinforce-hidden-layer-framing',
    'demonstrate-value-first',
  ],
  
  framing: {
    luckyListAs: 'hidden-layer',
    notAs: 'paywall-content',
    toneIs: 'inviting',
    toneIsNot: 'restrictive',
  },
  
  contextualValue: {
    showWhatTheyWereAboutToAccess: true,
    previewContentBeforeGate: true,
    neverHideCompletelyBeforeEducation: true,
  },
} as const;

// =============================================================================
// NO HARD WALL RULE
// =============================================================================

export const NO_HARD_WALL_RULE = {
  atEntry: {
    neverForceSubscription: true,
    neverBlockBrowsing: true,
    neverRequireLoginToExplore: true,
  },
  
  valueFirst: {
    demonstrateBeforeRestrict: true,
    allowDiscoveryBeforeCommitment: true,
    firstContactIsDiscovery: true,
  },
  
  luckyListFirstContact: {
    feelsLike: 'discovery',
    notLike: 'restriction',
    showPreviews: true,
    allowTapping: true,
    educateOnDeepAccess: true,
  },
} as const;

// =============================================================================
// PAYMENT READINESS (NON-ACTIVE)
// =============================================================================

export const PAYMENT_READINESS = {
  status: 'prepared-not-active',
  
  compatibleWith: [
    'stripe',
    'subscription-models',
    'add-ons',
    'one-off-purchases',
  ],
  
  activeIntegrations: [] as string[],
  
  futureVariations: [
    'annual-vs-monthly',
    'destination-based-access',
    'curator-routes-addon',
    'bundles',
  ],
  
  structuralRefactorRequired: false,
} as const;

// =============================================================================
// SCALABILITY
// =============================================================================

export const PREMIUM_SCALABILITY = {
  supportsAllDestinations: true,
  supportsMultiplePremiumLayers: true,
  supportsFutureAddons: true,
  supportsBundles: true,
  requiresNoRefactorForNewModels: true,
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Determine user's access state
 */
export const determineAccessState = (
  isAuthenticated: boolean,
  hasPremium: boolean
): AccessState => {
  if (!isAuthenticated) return 'visitor';
  if (hasPremium) return 'premium';
  return 'logged-in';
};

/**
 * Get permissions for an access state
 */
export const getPermissions = (state: AccessState) => {
  return ACCESS_STATES[state].permissions;
};

/**
 * Check if user can perform a specific action
 */
export const canPerformAction = (
  state: AccessState,
  action: keyof AccessStateDefinition['permissions']
): boolean => {
  return ACCESS_STATES[state].permissions[action];
};

/**
 * Check if element is premium-gated
 */
export const isPremiumGated = (element: string): boolean => {
  return PREMIUM_GATED_ELEMENTS.includes(element as PremiumGatedElement);
};

/**
 * Check if element is free
 */
export const isFreeElement = (element: string): boolean => {
  return FREE_ELEMENTS.includes(element as FreeElement);
};

/**
 * Get the flow to trigger when premium is attempted
 */
export const getPremiumAttemptFlow = (
  state: AccessState
): 'trigger-education-flow' | 'trigger-access-flow' | 'allow' => {
  return ACCESS_STATES[state].onPremiumAttempt;
};

/**
 * Check if user should see education flow (visitor) or access flow (logged-in)
 */
export const shouldTriggerEducationFlow = (state: AccessState): boolean => {
  return ACCESS_STATES[state].onPremiumAttempt === 'trigger-education-flow';
};

/**
 * Check if user should see access flow (logged-in, non-premium)
 */
export const shouldTriggerAccessFlow = (state: AccessState): boolean => {
  return ACCESS_STATES[state].onPremiumAttempt === 'trigger-access-flow';
};

/**
 * Check if premium access is allowed (premium user)
 */
export const hasPremiumAccess = (state: AccessState): boolean => {
  return ACCESS_STATES[state].onPremiumAttempt === 'allow';
};

/**
 * Validate that education principles are followed
 */
export const validateEducationApproach = (approach: {
  blocksAbruptly?: boolean;
  shamesUser?: boolean;
  usesAggressiveLanguage?: boolean;
  forcesSubscribeAtEntry?: boolean;
}): boolean => {
  return (
    !approach.blocksAbruptly &&
    !approach.shamesUser &&
    !approach.usesAggressiveLanguage &&
    !approach.forcesSubscribeAtEntry
  );
};

/**
 * Get framing for premium content
 */
export const getPremiumFraming = () => {
  return {
    describeAs: PREMIUM_EDUCATION.framing.luckyListAs,
    neverDescribeAs: PREMIUM_EDUCATION.framing.notAs,
    tone: PREMIUM_EDUCATION.framing.toneIs,
  };
};
