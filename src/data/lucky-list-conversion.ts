/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LUCKY LIST PREVIEW AND CONVERSION LOCK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file governs access logic and narrative positioning for Lucky List.
 * It defines how content is previewed, teased, and converted from free
 * to premium.
 * 
 * LUCKY LIST ROLE:
 * - A premium insider layer
 * - A trust-based discovery mechanism
 * - A value amplifier, not a content dump
 * - Positioned as a "quiet advantage", not a hard sell
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type UserAccessLevel = 'free' | 'premium';

export interface TeaserItem {
  id: string;
  title: string;
  category: string;
  neighborhood: string;
  /**
   * Partial content that creates curiosity without delivering full value
   * Must stop BEFORE key insight, timing, or execution detail
   */
  teaserContent: string;
  /**
   * The hidden part - only visible to premium users
   */
  insiderDetail: string;
  /**
   * Where the teaser cuts off
   */
  revealBoundary: 'before-key-insight' | 'before-timing' | 'before-execution';
}

export interface LuckyListAccess {
  destinationId: string;
  userLevel: UserAccessLevel;
  canSeeTitle: boolean;
  canSeePositioning: boolean;
  canSeeStructure: boolean;
  teaserItemCount: number;
  canAccessFullItems: boolean;
  canAccessHiddenDetails: boolean;
  canAccessInsiderExecution: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW RULES (FREE USERS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PREVIEW RULES:
 * 
 * Free users may see:
 * - The Lucky List title
 * - Its positioning between operational modules
 * - A short preview of content structure
 * - Up to TWO teaser entries per destination
 */
export const FREE_USER_ACCESS: LuckyListAccess = {
  destinationId: '*', // Applies to all destinations
  userLevel: 'free',
  canSeeTitle: true,
  canSeePositioning: true,
  canSeeStructure: true,
  teaserItemCount: 2, // Maximum teaser items
  canAccessFullItems: false,
  canAccessHiddenDetails: false,
  canAccessInsiderExecution: false,
};

export const PREMIUM_USER_ACCESS: LuckyListAccess = {
  destinationId: '*',
  userLevel: 'premium',
  canSeeTitle: true,
  canSeePositioning: true,
  canSeeStructure: true,
  teaserItemCount: Infinity, // All items
  canAccessFullItems: true,
  canAccessHiddenDetails: true,
  canAccessInsiderExecution: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// TEASER RULES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * TEASER ENTRY RULES:
 * 
 * Teaser entries must:
 * - Be real Lucky List items
 * - Appear partially revealed
 * - Never deliver full operational value
 * - Stop BEFORE key insight, timing, or execution detail
 * 
 * Teasers must create:
 * - Curiosity
 * - Perceived insider access
 * - Desire to "do it right"
 */
export const TEASER_RULES = {
  /**
   * Teasers are real items, not fake previews
   */
  useRealItems: true,
  
  /**
   * Content is partially revealed
   */
  partialReveal: true,
  
  /**
   * Never deliver full operational value to free users
   */
  deliverFullValue: false,
  
  /**
   * Where to cut the teaser
   */
  revealBoundaries: [
    'before-key-insight',
    'before-timing',
    'before-execution',
  ] as const,
  
  /**
   * Emotional goals of teasers
   */
  emotionalGoals: [
    'curiosity',
    'perceived-insider-access',
    'desire-to-do-it-right',
  ] as const,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSION BOUNDARY RULE
// ─────────────────────────────────────────────────────────────────────────────

export type ProtectedContent = 
  | 'full-lucky-list-item'
  | 'hidden-details'
  | 'insider-execution-layers';

/**
 * CONVERSION BOUNDARY:
 * 
 * Any attempt to access protected content must trigger premium access flow.
 * 
 * The conversion moment must feel:
 * - Contextual
 * - Natural
 * - Non-intrusive
 * - Like unlocking, not paying
 */
export const CONVERSION_TRIGGERS: ProtectedContent[] = [
  'full-lucky-list-item',
  'hidden-details',
  'insider-execution-layers',
];

export const CONVERSION_EXPERIENCE = {
  /**
   * Must feel contextual to the content being accessed
   */
  contextual: true,
  
  /**
   * Must feel like a natural next step
   */
  natural: true,
  
  /**
   * Must not interrupt or annoy
   */
  nonIntrusive: true,
  
  /**
   * Framing: "unlocking" not "paying"
   */
  framing: 'unlocking',
  
  /**
   * Anti-patterns to avoid
   */
  avoid: [
    'hard-sell',
    'urgency-tactics',
    'countdown-timers',
    'popup-interruptions',
    'guilt-messaging',
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// NARRATIVE RULE (CRITICAL)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NARRATIVE RULE:
 * 
 * Lucky List must NEVER:
 * - Explain itself as a feature
 * - Justify why it exists
 * - Sound like marketing copy
 * 
 * The value is implied by:
 * - Precision
 * - Discretion
 * - What is NOT said
 */
export const NARRATIVE_RULES = {
  /**
   * What Lucky List must NEVER do
   */
  forbidden: [
    'explain-itself-as-feature',
    'justify-existence',
    'marketing-copy-tone',
    'promotional-language',
    'sales-pitch',
  ],
  
  /**
   * How value is communicated
   */
  valueSignals: [
    'precision',
    'discretion',
    'what-is-not-said',
    'assumed-trust',
    'insider-tone',
  ],
  
  /**
   * The feeling Lucky List should evoke
   */
  targetFeeling: 'quiet-advantage',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// POSITIONING RULE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POSITIONING RULE:
 * 
 * Lucky List must always appear:
 * - AFTER initial decision confidence is built
 * - BEFORE secondary operational overload
 * - As a "quiet interruption" in the flow
 */
export const POSITIONING_RULES = {
  /**
   * User must first understand the destination
   */
  prerequisite: 'decision-confidence-built',
  
  /**
   * Appears before cognitive overload
   */
  timing: 'before-secondary-overload',
  
  /**
   * Style of appearance
   */
  style: 'quiet-interruption',
  
  /**
   * Position in destination flow
   */
  flowPosition: {
    after: ['como-chegar', 'onde-ficar', 'onde-comer', 'o-que-fazer'],
    before: ['mover', 'vida-noturna', 'sabores-locais'], // Secondary modules
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COGNITIVE RULE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * COGNITIVE JOURNEY:
 * 
 * 1. User must first think: "Ok, I understand this destination."
 * 2. Then feel: "There's more here if I want to do it better."
 * 3. Only then be invited to unlock.
 */
export const COGNITIVE_JOURNEY = {
  stage1: {
    thought: 'Ok, I understand this destination.',
    trigger: 'completion-of-primary-modules',
  },
  stage2: {
    feeling: 'There is more here if I want to do it better.',
    trigger: 'lucky-list-teaser-visibility',
  },
  stage3: {
    action: 'Invitation to unlock',
    trigger: 'user-attempts-to-access-protected-content',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS CONTROL FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get access level for a user
 */
export const getAccessLevel = (
  isPremium: boolean
): LuckyListAccess => {
  return isPremium ? PREMIUM_USER_ACCESS : FREE_USER_ACCESS;
};

/**
 * Check if content requires premium access
 */
export const requiresPremiumAccess = (
  contentType: ProtectedContent
): boolean => {
  return CONVERSION_TRIGGERS.includes(contentType);
};

/**
 * Check if user can access specific Lucky List content
 */
export const canAccessContent = (
  isPremium: boolean,
  contentType: ProtectedContent
): boolean => {
  if (isPremium) return true;
  return !requiresPremiumAccess(contentType);
};

/**
 * Get teaser items for free users (limited to max count)
 */
export const getTeaserItems = <T extends { id: string }>(
  allItems: T[],
  maxTeasers: number = FREE_USER_ACCESS.teaserItemCount
): T[] => {
  return allItems.slice(0, maxTeasers);
};

/**
 * Check if conversion flow should be triggered
 */
export const shouldTriggerConversion = (
  isPremium: boolean,
  attemptedAccess: ProtectedContent
): boolean => {
  if (isPremium) return false;
  return requiresPremiumAccess(attemptedAccess);
};

// ─────────────────────────────────────────────────────────────────────────────
// SCALABILITY RULE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SCALABILITY RULE:
 * 
 * - This logic applies IDENTICALLY to all destinations
 * - Number of teaser items may vary, but partial revelation rule is fixed
 * - No destination may fully expose Lucky List content to free users
 * 
 * OUTCOME:
 * - Lucky List becomes a discovery mechanism, not a paywall
 * - Premium feels like access, not upsell
 * - Conversion respects intelligence and trust
 */
