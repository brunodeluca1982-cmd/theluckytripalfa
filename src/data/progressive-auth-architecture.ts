/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROGRESSIVE AUTHENTICATION — STRUCTURAL LOCK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Allow users to explore, save, and plan without forced login,
 * introducing authentication only when value is clear.
 * 
 * This file defines BEHAVIOR only.
 * No UI, pricing, or subscription logic.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTICATION STATES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The product supports exactly THREE user states
 */
export type AuthState = 'anonymous' | 'logged-in' | 'subscriber';

/**
 * STATE 1: ANONYMOUS (no login)
 * 
 * - User may explore all public content
 * - User may add items to "Meu Roteiro" (Draft state)
 * - Data is stored locally/session-based
 * - User is informed gently that progress may be lost
 */
export const ANONYMOUS_STATE = {
  state: 'anonymous' as const,
  hasLogin: false,
  
  permissions: {
    explorePublicContent: true,
    addItemsToRoteiro: true,
    roteiroState: 'draft' as const,
    viewPremiumPreviews: false,
    saveLuckyListItems: false,
    syncAcrossDevices: false,
  },
  
  dataPersistence: {
    storage: 'local-session',
    persistsAcrossSessions: false,
    persistsAcrossDevices: false,
    progressMayBeLost: true,
    userMustBeInformedGently: true,
  },
} as const;

/**
 * STATE 2: LOGGED-IN (free account)
 * 
 * - User data persists across sessions and devices
 * - Draft roteiro migrates automatically upon login
 * - User may save unlimited public items
 * - User may view premium content previews
 */
export const LOGGED_IN_STATE = {
  state: 'logged-in' as const,
  hasLogin: true,
  hasPremium: false,
  
  permissions: {
    explorePublicContent: true,
    addItemsToRoteiro: true,
    roteiroState: 'saved' as const,
    viewPremiumPreviews: true,
    saveLuckyListItems: false,
    syncAcrossDevices: true,
    unlimitedPublicItems: true,
  },
  
  dataPersistence: {
    storage: 'cloud',
    persistsAcrossSessions: true,
    persistsAcrossDevices: true,
    draftMigratesAutomatically: true,
  },
} as const;

/**
 * STATE 3: SUBSCRIBER (premium)
 * 
 * - User may save Lucky List items
 * - User gains full access to premium layers (defined later)
 */
export const SUBSCRIBER_STATE = {
  state: 'subscriber' as const,
  hasLogin: true,
  hasPremium: true,
  
  permissions: {
    explorePublicContent: true,
    addItemsToRoteiro: true,
    roteiroState: 'premium' as const,
    viewPremiumPreviews: true,
    saveLuckyListItems: true,
    syncAcrossDevices: true,
    unlimitedPublicItems: true,
    fullPremiumAccess: true,
  },
  
  dataPersistence: {
    storage: 'cloud',
    persistsAcrossSessions: true,
    persistsAcrossDevices: true,
  },
} as const;

/**
 * All authentication states
 */
export const AUTH_STATES = {
  anonymous: ANONYMOUS_STATE,
  'logged-in': LOGGED_IN_STATE,
  subscriber: SUBSCRIBER_STATE,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN TRIGGERS (CONTEXTUAL ONLY)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Authentication trigger types
 */
export type AuthTrigger = 
  | 'save-progress-permanently'
  | 'save-lucky-list-item'
  | 'sync-across-devices';

/**
 * LOGIN TRIGGERS
 * 
 * Authentication may be requested ONLY when:
 * - User attempts to save progress permanently
 * - User attempts to save a Lucky List item
 * - User attempts to sync across devices
 */
export const ALLOWED_AUTH_TRIGGERS: readonly AuthTrigger[] = [
  'save-progress-permanently',
  'save-lucky-list-item',
  'sync-across-devices',
] as const;

/**
 * Actions that must NOT require login
 */
export const NO_LOGIN_REQUIRED = {
  browseDestinations: true,
  readContent: true,
  startBuildingRoteiro: true,
  viewPublicModules: true,
  navigateBetweenScreens: true,
} as const;

/**
 * Check if an action should trigger authentication
 */
export const shouldTriggerAuth = (
  action: string,
  currentState: AuthState
): boolean => {
  if (currentState !== 'anonymous') {
    return false;
  }
  return ALLOWED_AUTH_TRIGGERS.includes(action as AuthTrigger);
};

/**
 * Check if an action requires premium
 */
export const requiresPremium = (action: string): boolean => {
  const premiumActions = ['save-lucky-list-item'];
  return premiumActions.includes(action);
};

// ═══════════════════════════════════════════════════════════════════════════
// AUTH METHODS (ABSTRACT)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AUTH METHODS
 * 
 * - Authentication method is ABSTRACTED (email, Google, Apple, etc.)
 * - Specific providers are NOT defined at this stage
 * - Future integrations must plug into this logic
 */
export type AuthMethod = 
  | 'email'
  | 'google'
  | 'apple'
  | 'other';

export const AUTH_METHOD_RULES = {
  methodIsAbstracted: true,
  specificProvidersNotDefined: true,
  futureIntegrationsMustPlugIn: true,
  supportedMethods: ['email', 'google', 'apple', 'other'] as AuthMethod[],
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NAVIGATION RULES
 * 
 * - Login flow must NOT break destination context
 * - After login, user returns to the EXACT previous screen
 * - NEVER redirect to Home unexpectedly
 */
export const AUTH_NAVIGATION_RULES = {
  loginFlowPreservesContext: true,
  returnToExactPreviousScreen: true,
  neverRedirectToHomeUnexpectedly: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SCALABILITY RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SCALABILITY
 * 
 * - This authentication logic applies to ALL destinations
 * - Future features (payments, Google Maps, AI) must respect these states
 */
export const AUTH_SCALABILITY = {
  appliesToAllDestinations: true,
  futureFeaturesMustRespectStates: true,
  affectedFeatures: ['payments', 'google-maps', 'ai', 'sync'] as const,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine auth state from user status
 */
export const determineAuthState = (
  isLoggedIn: boolean,
  isSubscriber: boolean
): AuthState => {
  if (!isLoggedIn) return 'anonymous';
  if (isSubscriber) return 'subscriber';
  return 'logged-in';
};

/**
 * Get permissions for a given auth state
 */
export const getPermissions = (state: AuthState) => {
  return AUTH_STATES[state].permissions;
};

/**
 * Check if user can perform an action
 */
export const canPerformAction = (
  state: AuthState,
  action: keyof typeof ANONYMOUS_STATE.permissions
): boolean => {
  const permissions = AUTH_STATES[state].permissions;
  return permissions[action] === true;
};

/**
 * Check if user can save Lucky List items
 */
export const canSaveLuckyListItems = (state: AuthState): boolean => {
  return AUTH_STATES[state].permissions.saveLuckyListItems === true;
};

/**
 * Check if user data persists across sessions
 */
export const dataPersistsAcrossSessions = (state: AuthState): boolean => {
  const persistence = AUTH_STATES[state].dataPersistence;
  return 'persistsAcrossSessions' in persistence && persistence.persistsAcrossSessions === true;
};

/**
 * Get the required auth state for an action
 */
export const getRequiredAuthState = (action: AuthTrigger): AuthState => {
  switch (action) {
    case 'save-lucky-list-item':
      return 'subscriber';
    case 'save-progress-permanently':
    case 'sync-across-devices':
      return 'logged-in';
    default:
      return 'anonymous';
  }
};

/**
 * Check if upgrade is needed for an action
 */
export const needsUpgrade = (
  currentState: AuthState,
  action: AuthTrigger
): boolean => {
  const requiredState = getRequiredAuthState(action);
  const stateHierarchy: AuthState[] = ['anonymous', 'logged-in', 'subscriber'];
  const currentIndex = stateHierarchy.indexOf(currentState);
  const requiredIndex = stateHierarchy.indexOf(requiredState);
  return currentIndex < requiredIndex;
};

/**
 * Get upgrade path for user
 */
export const getUpgradePath = (
  currentState: AuthState,
  targetAction: AuthTrigger
): AuthState | null => {
  if (!needsUpgrade(currentState, targetAction)) {
    return null;
  }
  return getRequiredAuthState(targetAction);
};
