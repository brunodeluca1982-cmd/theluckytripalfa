/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LUCKY LIST — PREMIUM ACCESS LOGIC
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Define how Lucky List content is accessed, previewed, and restricted.
 * 
 * This file defines STRUCTURE and BEHAVIOR only.
 * No UI, pricing, or payment flow.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// LUCKY LIST DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LUCKY LIST DEFINITION
 * 
 * Lucky List is a PREMIUM EDITORIAL LAYER
 * that reveals deeper, non-obvious ways
 * to experience a destination.
 * 
 * It is NOT a separate destination.
 * It is NOT mixed with public content.
 */
export const LUCKY_LIST_DEFINITION = {
  type: 'premium-editorial-layer',
  purpose: 'reveal-deeper-non-obvious-experiences',
  isSeparateDestination: false,
  isMixedWithPublicContent: false,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ACCESS LEVELS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Access level types
 */
export type LuckyListAccessLevel = 'preview' | 'limited' | 'full';

/**
 * ACCESS LEVEL 1: PREVIEW (non-logged user)
 * 
 * - User may see Lucky List entry points
 * - User may see titles and section headers
 * - User may see up to a limited teaser (free hook)
 * - Full content remains locked
 */
export const ACCESS_LEVEL_PREVIEW = {
  level: 'preview' as const,
  userState: 'anonymous',
  
  permissions: {
    seeEntryPoints: true,
    seeTitles: true,
    seeSectionHeaders: true,
    seeLimitedTeaser: true,
    accessFullContent: false,
    saveToRoteiro: false,
  },
  
  contentVisibility: {
    entryPoints: 'visible',
    titles: 'visible',
    sectionHeaders: 'visible',
    teaserContent: 'visible',
    fullContent: 'locked',
  },
} as const;

/**
 * ACCESS LEVEL 2: LIMITED (logged-in, non-subscriber)
 * 
 * - User may open Lucky List entries
 * - User may read the teaser content
 * - User may NOT save Lucky List items to "Meu Roteiro"
 * - Attempts to save trigger a premium access flow (defined later)
 */
export const ACCESS_LEVEL_LIMITED = {
  level: 'limited' as const,
  userState: 'logged-in',
  
  permissions: {
    seeEntryPoints: true,
    seeTitles: true,
    seeSectionHeaders: true,
    seeLimitedTeaser: true,
    openEntries: true,
    readTeaserContent: true,
    accessFullContent: false,
    saveToRoteiro: false,
  },
  
  saveAttemptBehavior: {
    triggersPremiumFlow: true,
    flowDefinedSeparately: true,
  },
  
  contentVisibility: {
    entryPoints: 'visible',
    titles: 'visible',
    sectionHeaders: 'visible',
    teaserContent: 'visible',
    fullContent: 'locked',
  },
} as const;

/**
 * ACCESS LEVEL 3: FULL (subscriber)
 * 
 * - User has full access to Lucky List content
 * - User may save Lucky List items to "Meu Roteiro"
 * - Lucky List items retain premium indicator inside the roteiro
 */
export const ACCESS_LEVEL_FULL = {
  level: 'full' as const,
  userState: 'subscriber',
  
  permissions: {
    seeEntryPoints: true,
    seeTitles: true,
    seeSectionHeaders: true,
    seeLimitedTeaser: true,
    openEntries: true,
    readTeaserContent: true,
    accessFullContent: true,
    saveToRoteiro: true,
  },
  
  roteiroIntegration: {
    canSaveItems: true,
    retainsPremiumIndicator: true,
  },
  
  contentVisibility: {
    entryPoints: 'visible',
    titles: 'visible',
    sectionHeaders: 'visible',
    teaserContent: 'visible',
    fullContent: 'visible',
  },
} as const;

/**
 * All access levels
 */
export const ACCESS_LEVELS = {
  preview: ACCESS_LEVEL_PREVIEW,
  limited: ACCESS_LEVEL_LIMITED,
  full: ACCESS_LEVEL_FULL,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTION RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * INTERACTION RULES
 * 
 * - Lucky List must always feel discoverable
 * - Locking must feel intentional, not punitive
 * - No dead ends: every blocked action must return the user
 *   to their previous context if they do not proceed
 */
export const INTERACTION_RULES = {
  feelsDiscoverable: true,
  lockingFeelsIntentional: true,
  lockingFeelsPunitive: false,
  noDeadEnds: true,
  blockedActionReturnsToPreviousContext: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// COGNITIVE POSITIONING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * COGNITIVE RULE
 * 
 * Lucky List is positioned as:
 * "what you only learn after being there"
 * 
 * It must feel EARNED, not hidden.
 */
export const COGNITIVE_POSITIONING = {
  position: 'what-you-only-learn-after-being-there',
  feelsEarned: true,
  feelsHidden: false,
  impliesInsiderKnowledge: true,
  impliesDepthNotBreadth: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Content visibility by access level
 */
export type ContentVisibility = 'visible' | 'locked' | 'teaser';

/**
 * Teaser content rules
 */
export const TEASER_CONTENT_RULES = {
  showsEnoughToIntrique: true,
  showsEnoughToFrustrate: false,
  createsDesireForMore: true,
  revealsFullValue: false,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SCALABILITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SCALABILITY RULE
 * 
 * - This logic applies identically to all destinations
 * - Future premium layers must respect the same access model
 */
export const PREMIUM_ACCESS_SCALABILITY = {
  appliesToAllDestinations: true,
  logicIdenticalAcrossDestinations: true,
  futurePremiumLayersMustRespect: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine access level based on user state
 */
export const determineAccessLevel = (
  isLoggedIn: boolean,
  isSubscriber: boolean
): LuckyListAccessLevel => {
  if (isSubscriber) return 'full';
  if (isLoggedIn) return 'limited';
  return 'preview';
};

/**
 * Get permissions for a given access level
 */
export const getAccessPermissions = (level: LuckyListAccessLevel) => {
  return ACCESS_LEVELS[level].permissions;
};

/**
 * Check if user can access full content
 */
export const canAccessFullContent = (level: LuckyListAccessLevel): boolean => {
  return ACCESS_LEVELS[level].permissions.accessFullContent === true;
};

/**
 * Check if user can save to roteiro
 */
export const canSaveToRoteiro = (level: LuckyListAccessLevel): boolean => {
  return ACCESS_LEVELS[level].permissions.saveToRoteiro === true;
};

/**
 * Check if save attempt should trigger premium flow
 */
export const shouldTriggerPremiumFlow = (level: LuckyListAccessLevel): boolean => {
  if (level === 'limited') {
    return ACCESS_LEVEL_LIMITED.saveAttemptBehavior.triggersPremiumFlow;
  }
  return level === 'preview';
};

/**
 * Get content visibility for a specific content type
 */
export const getContentVisibility = (
  level: LuckyListAccessLevel,
  contentType: keyof typeof ACCESS_LEVEL_FULL.contentVisibility
): string => {
  return ACCESS_LEVELS[level].contentVisibility[contentType];
};

/**
 * Check if content type is visible for access level
 */
export const isContentVisible = (
  level: LuckyListAccessLevel,
  contentType: keyof typeof ACCESS_LEVEL_FULL.contentVisibility
): boolean => {
  return ACCESS_LEVELS[level].contentVisibility[contentType] === 'visible';
};

/**
 * Get the required upgrade for an action
 */
export const getRequiredUpgrade = (
  currentLevel: LuckyListAccessLevel,
  action: 'access-full-content' | 'save-to-roteiro'
): LuckyListAccessLevel | null => {
  if (action === 'access-full-content' || action === 'save-to-roteiro') {
    if (currentLevel !== 'full') {
      return 'full';
    }
  }
  return null;
};
