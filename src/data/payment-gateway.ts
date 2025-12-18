/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PAYMENT GATEWAY AND ACCESS LOGIC LOCK
 * The Lucky Trip — Premium Access Infrastructure
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GATEWAY DEFINITION:
 * - Stripe is the EXCLUSIVE payment processor
 * - Stripe operates as a BACKEND GATEWAY only
 * - Users never "pay Stripe" — they UNLOCK access
 * 
 * COGNITIVE RULE:
 * Payment must feel like: Unlocking, Continuing, Gaining access
 * Never like: Buying, Subscribing, Being sold to
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type AccessLevel = 'free' | 'premium';

export type PaymentStatus = 
  | 'none'
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'canceled';

export interface UserAccessState {
  /**
   * Current access level
   */
  level: AccessLevel;
  
  /**
   * Whether premium is unlocked
   */
  isPremium: boolean;
  
  /**
   * Timestamp of when premium was unlocked
   */
  unlockedAt?: Date;
  
  /**
   * Last known position in the app flow
   */
  lastPosition?: NavigationPosition;
  
  /**
   * Content that triggered the unlock flow
   */
  unlockTrigger?: string;
}

export interface NavigationPosition {
  /**
   * Route where user was before unlock flow
   */
  route: string;
  
  /**
   * Specific content being accessed
   */
  contentId?: string;
  
  /**
   * Scroll position for seamless return
   */
  scrollPosition?: number;
  
  /**
   * Destination context
   */
  destinationId?: string;
}

export interface PaymentResult {
  status: PaymentStatus;
  accessGranted: boolean;
  returnPosition: NavigationPosition | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS MODEL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ACCESS MODEL:
 * 
 * - Premium access is DESTINATION-AGNOSTIC:
 *   Once unlocked, it applies across ALL destinations
 *   unless otherwise specified in future rules
 * 
 * - Unlocking Lucky List grants:
 *   • Full access to Lucky List content
 *   • Removal of teaser limits
 *   • Persistent premium state across sessions
 */
export const ACCESS_MODEL = {
  /**
   * Premium applies to all destinations
   */
  isDestinationAgnostic: true,
  
  /**
   * What premium unlocks
   */
  premiumGrants: [
    'full-lucky-list-access',
    'teaser-limit-removal',
    'persistent-premium-state',
  ] as const,
  
  /**
   * Premium persists across sessions
   */
  persistsAcrossSessions: true,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// GATEWAY RULES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GATEWAY DEFINITION:
 * 
 * - Stripe is exclusive payment processor
 * - Operates as backend gateway only
 * - Never exposed to user experience
 */
export const GATEWAY_RULES = {
  /**
   * Payment provider (infrastructure only)
   */
  provider: 'stripe',
  
  /**
   * Stripe branding must never be visible to users
   */
  exposeProviderBranding: false,
  
  /**
   * Payment operates silently in background
   */
  operationMode: 'backend-gateway',
  
  /**
   * User-facing language
   */
  userFacingTerms: {
    // What we say
    allowed: ['unlock', 'access', 'continue', 'gain access'],
    // What we never say
    forbidden: ['buy', 'purchase', 'subscribe', 'pay', 'payment'],
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// STATE MEMORY RULES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * STATE MEMORY RULE:
 * 
 * The app must remember:
 * - Whether the user is free or premium
 * - Which content is unlocked
 * - Where the user last exited the flow
 */
export const STATE_MEMORY = {
  /**
   * What to persist
   */
  persistedState: [
    'access-level',
    'unlocked-content',
    'last-exit-position',
    'unlock-timestamp',
  ] as const,
  
  /**
   * Storage mechanism (to be implemented)
   */
  storageType: 'persistent', // localStorage + backend sync
  
  /**
   * Session continuity
   */
  maintainAcrossSessions: true,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS BEHAVIOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AFTER PAYMENT SUCCESS:
 * 
 * - User returns EXACTLY to the point of interruption
 * - Content unlocks seamlessly
 * - No forced redirection to Home or generic success screens
 */
export const SUCCESS_BEHAVIOR = {
  /**
   * Return to exact position
   */
  returnToExactPosition: true,
  
  /**
   * No generic success screens
   */
  showGenericSuccessScreen: false,
  
  /**
   * No forced Home redirect
   */
  forceHomeRedirect: false,
  
  /**
   * Content unlocks immediately
   */
  immediateContentUnlock: true,
  
  /**
   * Seamless continuation
   */
  seamlessContinuation: true,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FAILURE & EXIT BEHAVIOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FAILURE & EXIT RULES:
 * 
 * If payment is canceled or fails:
 * - User returns to the Lucky List preview
 * - No loss of navigation context
 * - No punitive messaging
 */
export const FAILURE_BEHAVIOR = {
  /**
   * Return destination on cancel/fail
   */
  returnTo: 'lucky-list-preview',
  
  /**
   * Preserve navigation context
   */
  preserveNavigationContext: true,
  
  /**
   * No punitive or guilt messaging
   */
  punitiveMessaging: false,
  
  /**
   * Allowed messaging tone
   */
  allowedMessaging: [
    'neutral',
    'understanding',
    'inviting-retry',
  ] as const,
  
  /**
   * Forbidden messaging patterns
   */
  forbiddenMessaging: [
    'urgency',
    'scarcity',
    'guilt',
    'disappointment',
    'missed-opportunity',
  ] as const,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS CONTROL FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initialize user access state
 */
export const initializeAccessState = (): UserAccessState => {
  return {
    level: 'free',
    isPremium: false,
    unlockedAt: undefined,
    lastPosition: undefined,
    unlockTrigger: undefined,
  };
};

/**
 * Save navigation position before unlock flow
 */
export const saveNavigationPosition = (
  state: UserAccessState,
  position: NavigationPosition,
  trigger: string
): UserAccessState => {
  return {
    ...state,
    lastPosition: position,
    unlockTrigger: trigger,
  };
};

/**
 * Handle successful unlock
 */
export const handleUnlockSuccess = (
  state: UserAccessState
): UserAccessState => {
  return {
    ...state,
    level: 'premium',
    isPremium: true,
    unlockedAt: new Date(),
    // Keep lastPosition for return navigation
  };
};

/**
 * Get return position after payment
 */
export const getReturnPosition = (
  state: UserAccessState,
  paymentStatus: PaymentStatus
): NavigationPosition | null => {
  if (!state.lastPosition) return null;
  
  // On success or cancel/fail, return to saved position
  return state.lastPosition;
};

/**
 * Check if user has premium access
 */
export const hasPremiumAccess = (state: UserAccessState): boolean => {
  return state.isPremium && state.level === 'premium';
};

/**
 * Clear unlock flow state (after successful return)
 */
export const clearUnlockFlowState = (
  state: UserAccessState
): UserAccessState => {
  return {
    ...state,
    lastPosition: undefined,
    unlockTrigger: undefined,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SCALABILITY RULE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SCALABILITY RULE:
 * 
 * This gateway logic must support:
 * - Future pricing models
 * - Future bundles
 * - Future creator access
 * without structural changes.
 * 
 * OUTCOME:
 * - Stripe is fully integrated at infrastructure level
 * - Premium access feels invisible and fluid
 * - Monetization is decoupled from UX and content
 */
export const SCALABILITY = {
  /**
   * Extensible for future models
   */
  supportsExtension: true,
  
  /**
   * Future-ready capabilities
   */
  futureReady: [
    'pricing-models',
    'bundles',
    'creator-access',
    'destination-specific-access',
    'time-limited-access',
  ] as const,
  
  /**
   * No structural changes required for extension
   */
  requiresStructuralChanges: false,
} as const;
