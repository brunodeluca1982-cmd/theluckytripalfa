/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VALUE MOMENTS & CONVERSION TIMING — STRUCTURAL LOCK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Define when and why premium access is suggested,
 * based on user intent and perceived value,
 * never by interruption or pressure.
 * 
 * This file defines BEHAVIORAL LOGIC only.
 * No UI, pricing, or payment values.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// CORE PRINCIPLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CORE PRINCIPLE
 * 
 * Premium should be suggested ONLY when the user demonstrates intent.
 * 
 * Never before.
 * Never randomly.
 * Never on entry.
 */
export const CONVERSION_CORE_PRINCIPLE = {
  suggestOnlyOnIntent: true,
  neverBefore: true,
  neverRandomly: true,
  neverOnEntry: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// VALUE MOMENTS (ALLOWED TRIGGERS)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Value moment types
 */
export type ValueMomentType = 
  | 'save-intent'
  | 'depth-intent'
  | 'planning-intent'
  | 'returning-intent';

/**
 * VALUE MOMENT 1: SAVE INTENT
 * 
 * User attempts to save a Lucky List item into "Meu Roteiro"
 */
export const SAVE_INTENT_MOMENT = {
  type: 'save-intent' as const,
  trigger: 'attempt-save-lucky-list-item',
  context: 'meu-roteiro',
  allowed: true,
} as const;

/**
 * VALUE MOMENT 2: DEPTH INTENT
 * 
 * User scrolls or navigates deeply inside Lucky List content
 */
export const DEPTH_INTENT_MOMENT = {
  type: 'depth-intent' as const,
  trigger: 'deep-scroll-or-navigation',
  context: 'lucky-list-content',
  allowed: true,
} as const;

/**
 * VALUE MOMENT 3: PLANNING INTENT
 * 
 * User builds a roteiro with multiple items
 * and attempts to refine or organize it
 */
export const PLANNING_INTENT_MOMENT = {
  type: 'planning-intent' as const,
  trigger: 'roteiro-refinement-attempt',
  context: 'meu-roteiro',
  allowed: true,
} as const;

/**
 * VALUE MOMENT 4: RETURNING INTENT
 * 
 * User repeatedly returns to Lucky List
 * across sessions or destinations
 */
export const RETURNING_INTENT_MOMENT = {
  type: 'returning-intent' as const,
  trigger: 'repeated-lucky-list-visits',
  context: 'cross-session',
  allowed: true,
} as const;

/**
 * All allowed value moments
 */
export const ALLOWED_VALUE_MOMENTS = {
  saveIntent: SAVE_INTENT_MOMENT,
  depthIntent: DEPTH_INTENT_MOMENT,
  planningIntent: PLANNING_INTENT_MOMENT,
  returningIntent: RETURNING_INTENT_MOMENT,
} as const;

/**
 * Value moment triggers as array
 */
export const VALUE_MOMENT_TRIGGERS: readonly ValueMomentType[] = [
  'save-intent',
  'depth-intent',
  'planning-intent',
  'returning-intent',
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// DISALLOWED MOMENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Disallowed moment types
 */
export type DisallowedMomentType = 
  | 'app-launch'
  | 'destination-entry'
  | 'passive-reading'
  | 'entender-o-destino'
  | 'basic-navigation';

/**
 * DISALLOWED MOMENTS
 * 
 * Premium must NOT be suggested:
 * - On app launch
 * - On destination entry
 * - During passive reading
 * - During "Entender o Destino"
 * - During basic navigation
 */
export const DISALLOWED_MOMENTS: readonly DisallowedMomentType[] = [
  'app-launch',
  'destination-entry',
  'passive-reading',
  'entender-o-destino',
  'basic-navigation',
] as const;

export const PREMIUM_MUST_NOT_TRIGGER = {
  onAppLaunch: true,
  onDestinationEntry: true,
  duringPassiveReading: true,
  duringEntenderODestino: true,
  duringBasicNavigation: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// COMMUNICATION RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * COMMUNICATION RULE
 * 
 * Premium suggestion must be framed as:
 * - "unlocking intelligence"
 * - "adding depth"
 * - "saving your discoveries"
 * 
 * Never as:
 * - urgency
 * - fear of missing out
 * - limited time pressure
 */
export const PREMIUM_COMMUNICATION = {
  framedAs: {
    unlockingIntelligence: true,
    addingDepth: true,
    savingDiscoveries: true,
  },
  neverFramedAs: {
    urgency: true,
    fearOfMissingOut: true,
    limitedTimePressure: true,
    scarcity: true,
  },
} as const;

/**
 * Premium framing keywords
 */
export const PREMIUM_FRAMING = {
  positive: [
    'unlock',
    'intelligence',
    'depth',
    'discover',
    'save',
    'refine',
    'insight',
  ] as const,
  negative: [
    'urgent',
    'limited',
    'last-chance',
    'hurry',
    'expires',
    'miss-out',
  ] as const,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN VS PREMIUM SEPARATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LOGIN VS PREMIUM
 * 
 * - Login may be suggested independently of premium
 * - Login is framed as saving progress
 * - Premium is framed as unlocking insight
 * 
 * They must NEVER be bundled cognitively.
 */
export const LOGIN_VS_PREMIUM = {
  loginIndependentOfPremium: true,
  loginFramedAs: 'saving-progress',
  premiumFramedAs: 'unlocking-insight',
  neverBundledCognitively: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ESCAPE RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ESCAPE RULE
 * 
 * - User must always be able to dismiss a premium suggestion
 * - Dismissal does not penalize experience
 * - The app continues to feel complete
 */
export const ESCAPE_RULES = {
  userCanAlwaysDismiss: true,
  dismissalPenalizesExperience: false,
  appFeelsCompleteAfterDismissal: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SCALABILITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SCALABILITY RULE
 * 
 * - This timing logic applies to all destinations
 * - Future premium features must reuse this system
 */
export const CONVERSION_SCALABILITY = {
  appliesToAllDestinations: true,
  logicIdenticalAcrossDestinations: true,
  futurePremiumFeaturesMustReuse: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a moment is a valid value moment for premium suggestion
 */
export const isAllowedValueMoment = (moment: string): moment is ValueMomentType => {
  return VALUE_MOMENT_TRIGGERS.includes(moment as ValueMomentType);
};

/**
 * Check if a moment is disallowed for premium suggestion
 */
export const isDisallowedMoment = (moment: string): moment is DisallowedMomentType => {
  return DISALLOWED_MOMENTS.includes(moment as DisallowedMomentType);
};

/**
 * Determine if premium should be suggested based on context
 */
export const shouldSuggestPremium = (
  moment: ValueMomentType | DisallowedMomentType,
  isSubscriber: boolean
): boolean => {
  if (isSubscriber) return false;
  if (isDisallowedMoment(moment)) return false;
  return isAllowedValueMoment(moment);
};

/**
 * Get the framing for a premium suggestion
 */
export const getPremiumFraming = (moment: ValueMomentType): string => {
  switch (moment) {
    case 'save-intent':
      return 'saving-discoveries';
    case 'depth-intent':
      return 'unlocking-intelligence';
    case 'planning-intent':
      return 'adding-depth';
    case 'returning-intent':
      return 'unlocking-insight';
    default:
      return 'unlocking-intelligence';
  }
};

/**
 * Check if current context allows premium suggestion
 */
export const canShowPremiumSuggestion = (
  context: string,
  isSubscriber: boolean
): boolean => {
  if (isSubscriber) return false;
  
  const disallowedContexts = [
    'app-launch',
    'destination-entry',
    'passive-reading',
    'entender-o-destino',
    'basic-navigation',
  ];
  
  return !disallowedContexts.includes(context);
};

/**
 * Track value moment for returning intent detection
 */
export interface ValueMomentTracker {
  luckyListVisits: number;
  sessionsWithLuckyListVisit: number;
  destinationsWithLuckyListVisit: string[];
}

/**
 * Check if returning intent threshold is met
 */
export const hasReturningIntent = (tracker: ValueMomentTracker): boolean => {
  return (
    tracker.luckyListVisits >= 3 ||
    tracker.sessionsWithLuckyListVisit >= 2 ||
    tracker.destinationsWithLuckyListVisit.length >= 2
  );
};
