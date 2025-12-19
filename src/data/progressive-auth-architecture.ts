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
// CORE LOGIN PRINCIPLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CORE PRINCIPLE
 * 
 * Login must be:
 * - Contextual
 * - Optional at first
 * - Value-driven
 * - Never mandatory at entry
 */
export const LOGIN_CORE_PRINCIPLE = {
  isContextual: true,
  isOptionalAtFirst: true,
  isValueDriven: true,
  mandatoryAtEntry: false,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED LOGIN TRIGGERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Login trigger context types
 */
export type LoginTriggerContext = 
  | 'save-permanently'
  | 'save-lucky-list-item'
  | 'session-end-risk'
  | 'cross-device-access';

/**
 * LOGIN TRIGGERS (CONTEXTUAL ONLY)
 * 
 * Login may be SUGGESTED when:
 * - User attempts to save permanently
 * - User attempts to save a Lucky List item
 * - User risks losing a draft (session end)
 * - User wants cross-device access
 */
export const CONTEXTUAL_LOGIN_TRIGGERS: readonly LoginTriggerContext[] = [
  'save-permanently',
  'save-lucky-list-item',
  'session-end-risk',
  'cross-device-access',
] as const;

export const LOGIN_SUGGESTED_WHEN = {
  attemptsSavePermanently: true,
  attemptsSaveLuckyListItem: true,
  risksLosingDraft: true,
  wantsCrossDeviceAccess: true,
} as const;

/**
 * LOGIN MUST NOT BE TRIGGERED
 * 
 * - On first app open
 * - On destination entry
 * - On casual browsing
 */
export const LOGIN_MUST_NOT_TRIGGER = {
  onFirstAppOpen: true,
  onDestinationEntry: true,
  onCasualBrowsing: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DATA MIGRATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DATA MIGRATION RULE
 * 
 * - Upon login, any existing draft data
 *   must migrate automatically to the authenticated state
 * - No data loss is allowed
 */
export const DATA_MIGRATION_RULES = {
  migratesAutomaticallyOnLogin: true,
  noDataLossAllowed: true,
  draftToAuthenticatedMigration: true,
  preservesAllItemData: true,
  preservesItemOrder: true,
  preservesItemMetadata: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// FAIL-SAFE RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FAIL-SAFE RULE
 * 
 * - If login is skipped or fails,
 *   the user must return to the exact previous context
 * - No reset, no forced restart
 */
export const LOGIN_FAILSAFE_RULES = {
  onSkipOrFail: {
    returnToExactPreviousContext: true,
    noReset: true,
    noForcedRestart: true,
    preservesDraftData: true,
    preservesNavigationState: true,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SCALABILITY RULES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SCALABILITY
 * 
 * - This authentication logic applies to ALL destinations
 * - Future features (payments, Google Maps, AI) must respect these states
 * - Future authentication methods (Google, Apple, email)
 *   may be added without refactoring
 */
export const AUTH_SCALABILITY = {
  appliesToAllDestinations: true,
  appliesToAllFeatures: true,
  futureFeaturesMustRespectStates: true,
  affectedFeatures: ['payments', 'google-maps', 'ai', 'sync'] as const,
  futureAuthMethodsNoRefactor: true,
  supportedFutureMethods: ['google', 'apple', 'email', 'phone'] as const,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DATA PERSISTENCE STATES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Persistence state types
 */
export type PersistenceState = 'local' | 'cloud' | 'synced';

/**
 * Data persistence by auth state
 */
export const PERSISTENCE_BY_AUTH_STATE = {
  anonymous: {
    storage: 'local' as PersistenceState,
    persistsAcrossSessions: false,
    persistsAcrossDevices: false,
    dataMayBeLost: true,
    userInformed: true,
  },
  'logged-in': {
    storage: 'cloud' as PersistenceState,
    persistsAcrossSessions: true,
    persistsAcrossDevices: true,
    dataMayBeLost: false,
    automaticSync: true,
  },
  subscriber: {
    storage: 'synced' as PersistenceState,
    persistsAcrossSessions: true,
    persistsAcrossDevices: true,
    dataMayBeLost: false,
    automaticSync: true,
    premiumDataIncluded: true,
  },
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

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED LOGIN HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if login should be suggested for a given context
 */
export const shouldSuggestLogin = (
  context: LoginTriggerContext,
  isLoggedIn: boolean
): boolean => {
  if (isLoggedIn) return false;
  return CONTEXTUAL_LOGIN_TRIGGERS.includes(context);
};

/**
 * Check if current context should NOT trigger login
 */
export const shouldNotTriggerLogin = (
  context: 'first-app-open' | 'destination-entry' | 'casual-browsing'
): boolean => {
  const blockedContexts = {
    'first-app-open': LOGIN_MUST_NOT_TRIGGER.onFirstAppOpen,
    'destination-entry': LOGIN_MUST_NOT_TRIGGER.onDestinationEntry,
    'casual-browsing': LOGIN_MUST_NOT_TRIGGER.onCasualBrowsing,
  };
  return blockedContexts[context] === true;
};

/**
 * Get persistence configuration for auth state
 */
export const getPersistenceConfig = (state: AuthState) => {
  return PERSISTENCE_BY_AUTH_STATE[state];
};

/**
 * Check if data migration is needed after login
 */
export const needsDataMigration = (
  hadDraftData: boolean,
  justLoggedIn: boolean
): boolean => {
  return hadDraftData && justLoggedIn && DATA_MIGRATION_RULES.migratesAutomaticallyOnLogin;
};

/**
 * Get fail-safe behavior for login skip/fail
 */
export const getFailSafeBehavior = () => {
  return LOGIN_FAILSAFE_RULES.onSkipOrFail;
};

/**
 * Check if user data persists across sessions
 */
export const dataPeristsAcrossSessions = (state: AuthState): boolean => {
  return PERSISTENCE_BY_AUTH_STATE[state].persistsAcrossSessions;
};

/**
 * Check if user should be warned about data loss
 */
export const shouldWarnAboutDataLoss = (state: AuthState): boolean => {
  return PERSISTENCE_BY_AUTH_STATE[state].dataMayBeLost === true;
};
