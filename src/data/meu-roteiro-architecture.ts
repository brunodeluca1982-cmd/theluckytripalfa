/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEU ROTEIRO — STRUCTURAL LOCK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * "Meu Roteiro" is the central personal planning object of the app.
 * Users collect, organize, and review saved items across destinations.
 * 
 * This file defines STRUCTURE and BEHAVIOR only.
 * No UI, pricing, or monetization logic.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * CORE DEFINITION
 * 
 * "Meu Roteiro" is a personal container that stores items selected
 * by the user during exploration of a destination.
 * 
 * It exists INDEPENDENTLY from content modules.
 * It PERSISTS across the destination experience.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Source modules from which items can be added
 */
export type RoteiroSourceModule = 
  | 'o-que-fazer'
  | 'onde-comer'
  | 'vida-noturna'
  | 'sabores-locais'
  | 'lucky-list';

/**
 * Modules explicitly EXCLUDED from Meu Roteiro
 */
export type ExcludedFromRoteiro = 
  | 'roteiro-do-bruno'
  | 'curator-itineraries'
  | 'memory-replay-diary'
  | 'entender-o-destino';

/**
 * The three defined states of a roteiro
 */
export type RoteiroState = 'draft' | 'saved' | 'premium';

/**
 * Individual item saved to roteiro
 */
export interface RoteiroItem {
  id: string;
  originalDestination: string;
  originalNeighborhood: string | null;
  sourceModule: RoteiroSourceModule;
  isPremium: boolean;
  addedAt: Date;
  order: number;
}

/**
 * The roteiro container
 */
export interface MeuRoteiro {
  id: string;
  userId: string | null;
  destinationId: string;
  state: RoteiroState;
  items: RoteiroItem[];
  createdAt: Date;
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// SOURCE MODULE RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * WHAT CAN BE ADDED TO "MEU ROTEIRO"
 */
export const ALLOWED_SOURCE_MODULES: readonly RoteiroSourceModule[] = [
  'o-que-fazer',
  'onde-comer',
  'vida-noturna',
  'sabores-locais',
  'lucky-list',
] as const;

/**
 * WHAT MUST NOT BE ADDED (at this stage)
 */
export const EXCLUDED_FROM_ROTEIRO: readonly ExcludedFromRoteiro[] = [
  'roteiro-do-bruno',
  'curator-itineraries',
  'memory-replay-diary',
  'entender-o-destino',
] as const;

/**
 * Check if a module is allowed as a source
 */
export const isAllowedSource = (module: string): module is RoteiroSourceModule => {
  return ALLOWED_SOURCE_MODULES.includes(module as RoteiroSourceModule);
};

// ═══════════════════════════════════════════════════════════════════════════
// ITEM BEHAVIOR RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ITEM RETENTION RULES
 * 
 * Each saved item MUST retain:
 * - Its original destination
 * - Its original neighborhood (when applicable)
 * - Its original source module
 * - Its premium status (if Lucky List)
 */
export const ITEM_RETENTION_RULES = {
  mustRetainOriginalDestination: true,
  mustRetainOriginalNeighborhood: true,
  mustRetainSourceModule: true,
  mustRetainPremiumStatus: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ROTEIRO STATES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * STATE 1: DRAFT (no login)
 */
export const DRAFT_STATE_RULES = {
  state: 'draft' as const,
  requiresLogin: false,
  persistence: 'local-session',
  canAddItems: true,
  canRemoveItems: true,
  canReorderItems: true,
  progressMayBeLost: true,
  userMustBeInformed: true,
} as const;

/**
 * STATE 2: SAVED (logged-in user)
 */
export const SAVED_STATE_RULES = {
  state: 'saved' as const,
  requiresLogin: true,
  persistence: 'cross-session-cross-device',
  canAddItems: true,
  canRemoveItems: true,
  canReorderItems: true,
  draftItemsMigrateAutomatically: true,
} as const;

/**
 * STATE 3: PREMIUM (subscriber)
 */
export const PREMIUM_STATE_RULES = {
  state: 'premium' as const,
  requiresLogin: true,
  requiresSubscription: true,
  canSaveLuckyListItems: true,
  nonSubscriberBehavior: {
    canViewLuckyListItems: true,
    canSaveLuckyListItems: false,
    attemptToSaveTriggersPremiumFlow: true,
  },
} as const;

/**
 * All state definitions
 */
export const ROTEIRO_STATES = {
  draft: DRAFT_STATE_RULES,
  saved: SAVED_STATE_RULES,
  premium: PREMIUM_STATE_RULES,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ALLOWED ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ACTIONS ALLOWED inside "Meu Roteiro"
 */
export const ALLOWED_ACTIONS = {
  addItems: true,
  removeItems: true,
  reorderItems: true,
  viewGroupedByDestination: true,
  viewGroupedByType: true,
} as const;

/**
 * ACTIONS NOT ALLOWED (at this stage)
 */
export const EXCLUDED_ACTIONS = {
  advancedScheduling: false,
  timingLogic: false,
  dayByDayPlanning: false,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN LOGIC (PROGRESSIVE)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PROGRESSIVE LOGIN RULES
 * 
 * - Login is NOT required to START building a roteiro
 * - Login is REQUIRED to save permanently
 * - Login may be triggered contextually when needed
 * - NO forced login at entry
 */
export const LOGIN_RULES = {
  requiredToStart: false,
  requiredToSavePermanently: true,
  triggeredContextually: true,
  forcedAtEntry: false,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NAVIGATION BEHAVIOR
 * 
 * - "Meu Roteiro" must ALWAYS remain accessible from destination context
 * - Returning sends user back to last destination view
 * - NEVER redirect to Home unexpectedly
 */
export const NAVIGATION_RULES = {
  alwaysAccessibleFromDestination: true,
  returnToLastDestinationView: true,
  neverRedirectToHomeUnexpectedly: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SCALABILITY RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SCALABILITY REQUIREMENTS
 * 
 * - This structure applies to ALL destinations
 * - Logic must remain IDENTICAL across destinations
 * - Future features may EXTEND but NOT BREAK this object
 */
export const SCALABILITY_RULES = {
  appliesToAllDestinations: true,
  logicIdenticalAcrossDestinations: true,
  futureFeaturesMayExtend: true,
  futureFeaturesMustNotBreak: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine roteiro state based on user status
 */
export const determineRoteiroState = (
  isLoggedIn: boolean,
  isSubscriber: boolean
): RoteiroState => {
  if (!isLoggedIn) return 'draft';
  if (isSubscriber) return 'premium';
  return 'saved';
};

/**
 * Check if user can save a specific item
 */
export const canSaveItem = (
  item: { sourceModule: RoteiroSourceModule },
  roteiroState: RoteiroState
): boolean => {
  // Lucky List items require premium state
  if (item.sourceModule === 'lucky-list') {
    return roteiroState === 'premium';
  }
  // All other items can be saved in any state
  return true;
};

/**
 * Check if saving attempt should trigger premium flow
 */
export const shouldTriggerPremiumFlow = (
  item: { sourceModule: RoteiroSourceModule },
  roteiroState: RoteiroState
): boolean => {
  return item.sourceModule === 'lucky-list' && roteiroState !== 'premium';
};

/**
 * Create a new roteiro item with required retention fields
 */
export const createRoteiroItem = (
  id: string,
  destination: string,
  neighborhood: string | null,
  sourceModule: RoteiroSourceModule,
  order: number
): RoteiroItem => ({
  id,
  originalDestination: destination,
  originalNeighborhood: neighborhood,
  sourceModule,
  isPremium: sourceModule === 'lucky-list',
  addedAt: new Date(),
  order,
});

/**
 * Create an empty roteiro container
 */
export const createEmptyRoteiro = (
  destinationId: string,
  userId: string | null = null
): MeuRoteiro => ({
  id: crypto.randomUUID(),
  userId,
  destinationId,
  state: userId ? 'saved' : 'draft',
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});
