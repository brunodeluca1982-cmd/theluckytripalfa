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
 * Item type classification for grouping and analysis
 */
export type RoteiroItemType = 
  | 'activity'
  | 'restaurant'
  | 'bar'
  | 'experience';

// ═══════════════════════════════════════════════════════════════════════════
// GEOLOCATION DATA STRUCTURE (GOOGLE MAPS READY)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GEOLOCATION DATA
 * 
 * Every item in "Meu Roteiro" must internally retain geolocation data
 * for future Google Maps integration and route coherence analysis.
 * 
 * These fields may remain INVISIBLE to the user at this stage.
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  neighborhood: string;
  city: string;
  country: string;
}

/**
 * Individual item saved to roteiro (with geolocation)
 */
export interface RoteiroItem {
  id: string;
  originalDestination: string;
  originalNeighborhood: string | null;
  sourceModule: RoteiroSourceModule;
  itemType: RoteiroItemType;
  isPremium: boolean;
  addedAt: Date;
  order: number;
  
  // Geolocation data (Google Maps ready)
  geo: GeoLocation;
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
 * - Its geolocation data (latitude, longitude, neighborhood, city, country)
 * - Its item type (activity, restaurant, bar, experience)
 */
export const ITEM_RETENTION_RULES = {
  mustRetainOriginalDestination: true,
  mustRetainOriginalNeighborhood: true,
  mustRetainSourceModule: true,
  mustRetainPremiumStatus: true,
  mustRetainGeolocation: true,
  mustRetainItemType: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// GOOGLE MAPS COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GOOGLE MAPS COMPATIBILITY RULES
 * 
 * - Item structure must be compatible with Google Maps APIs
 * - Items must be identifiable as map points
 * - No routing or distance calculation is triggered at this stage
 */
export const GOOGLE_MAPS_COMPATIBILITY = {
  structureCompatible: true,
  itemsIdentifiableAsMapPoints: true,
  routingTriggeredAtThisStage: false,
  distanceCalculationAtThisStage: false,
  
  // Required fields for map point identification
  requiredGeoFields: ['latitude', 'longitude', 'neighborhood', 'city', 'country'] as const,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ROUTE COHERENCE PREPARATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * COHERENCE PREPARATION RULES
 * 
 * The system must be CAPABLE (in the future) of detecting:
 * - Excessive distance between items
 * - Impractical sequences (time/location)
 * 
 * NO alerts, warnings, or corrections are shown in the MVP.
 */
export const COHERENCE_PREPARATION = {
  futureCapabilities: {
    detectExcessiveDistance: true,
    detectImpracticalSequences: true,
    detectTimeConflicts: true,
  },
  mvpBehavior: {
    showAlerts: false,
    showWarnings: false,
    showCorrections: false,
    blockUserFromSaving: false,
  },
} as const;

/**
 * USER EXPERIENCE RULES FOR COHERENCE
 * 
 * - User is NEVER blocked from saving items
 * - "Incoherent" routes are ALLOWED
 * - Intelligence is ADVISORY, never RESTRICTIVE
 */
export const COHERENCE_UX_RULES = {
  userNeverBlocked: true,
  incoherentRoutesAllowed: true,
  intelligenceMode: 'advisory' as const,
  restrictiveMode: false,
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
 * Create a new roteiro item with required retention fields and geolocation
 */
export const createRoteiroItem = (
  id: string,
  destination: string,
  neighborhood: string | null,
  sourceModule: RoteiroSourceModule,
  itemType: RoteiroItemType,
  order: number,
  geo: GeoLocation
): RoteiroItem => ({
  id,
  originalDestination: destination,
  originalNeighborhood: neighborhood,
  sourceModule,
  itemType,
  isPremium: sourceModule === 'lucky-list',
  addedAt: new Date(),
  order,
  geo,
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

// ═══════════════════════════════════════════════════════════════════════════
// GEOLOCATION HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate that a GeoLocation object has all required fields
 */
export const isValidGeoLocation = (geo: Partial<GeoLocation>): geo is GeoLocation => {
  return (
    typeof geo.latitude === 'number' &&
    typeof geo.longitude === 'number' &&
    typeof geo.neighborhood === 'string' &&
    typeof geo.city === 'string' &&
    typeof geo.country === 'string'
  );
};

/**
 * Check if item is map-ready (has valid geolocation)
 */
export const isMapReady = (item: RoteiroItem): boolean => {
  return isValidGeoLocation(item.geo);
};

/**
 * Extract map points from roteiro items
 * Returns array of lat/lng pairs compatible with Google Maps
 */
export const extractMapPoints = (items: RoteiroItem[]): Array<{
  id: string;
  lat: number;
  lng: number;
  itemType: RoteiroItemType;
}> => {
  return items
    .filter(isMapReady)
    .map(item => ({
      id: item.id,
      lat: item.geo.latitude,
      lng: item.geo.longitude,
      itemType: item.itemType,
    }));
};

/**
 * Group roteiro items by neighborhood for map clustering
 */
export const groupByNeighborhood = (
  items: RoteiroItem[]
): Record<string, RoteiroItem[]> => {
  return items.reduce((acc, item) => {
    const key = item.geo.neighborhood;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, RoteiroItem[]>);
};

/**
 * Group roteiro items by type for filtering
 */
export const groupByItemType = (
  items: RoteiroItem[]
): Record<RoteiroItemType, RoteiroItem[]> => {
  return items.reduce((acc, item) => {
    if (!acc[item.itemType]) {
      acc[item.itemType] = [];
    }
    acc[item.itemType].push(item);
    return acc;
  }, {} as Record<RoteiroItemType, RoteiroItem[]>);
};
