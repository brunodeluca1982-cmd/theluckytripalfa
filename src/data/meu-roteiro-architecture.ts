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
// SAVE ACTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SAVE ACTION DEFINITION
 * 
 * Any eligible item must expose a single, consistent save action
 * that allows the user to add it to "Meu Roteiro".
 * 
 * The save action must be:
 * - Contextual (exists where the item is presented)
 * - Reversible (user can remove later)
 * - Lightweight (no forced login at first interaction)
 */
export const SAVE_ACTION_DEFINITION = {
  actionType: 'single-consistent-save',
  isContextual: true,
  isReversible: true,
  isLightweight: true,
  forcesLoginAtFirstInteraction: false,
} as const;

/**
 * ELIGIBLE SOURCE MODULES FOR SAVE ACTION
 * 
 * Items that may be saved originate from:
 * - O QUE FAZER
 * - ONDE COMER
 * - VIDA NOTURNA
 * - SABORES LOCAIS
 * - LUCKY LIST (premium layer, with restrictions)
 */
export const SAVE_ELIGIBLE_MODULES: readonly RoteiroSourceModule[] = [
  'o-que-fazer',
  'onde-comer',
  'vida-noturna',
  'sabores-locais',
  'lucky-list',
] as const;

/**
 * SAVE RULES BY USER STATE
 */

/**
 * DRAFT STATE (not logged in)
 * 
 * - User may save any free item
 * - Items are stored locally
 * - User is informed that progress is temporary
 */
export const SAVE_RULES_DRAFT = {
  state: 'draft' as const,
  canSaveFreeItems: true,
  canSaveLuckyListItems: false,
  storage: 'local',
  progressIsTemporary: true,
  userMustBeInformed: true,
} as const;

/**
 * SAVED STATE (logged in, non-subscriber)
 * 
 * - Free items are saved permanently
 * - Lucky List items cannot eliminate the save action,
 *   but saving them must trigger a premium access flow (defined later)
 */
export const SAVE_RULES_SAVED = {
  state: 'saved' as const,
  canSaveFreeItems: true,
  canSaveLuckyListItems: false,
  luckyListSaveActionVisible: true,
  luckyListSaveTriggersPremiumFlow: true,
  storage: 'cloud',
  progressIsPermanent: true,
} as const;

/**
 * PREMIUM STATE (subscriber)
 * 
 * - All eligible items may be saved permanently
 */
export const SAVE_RULES_PREMIUM = {
  state: 'premium' as const,
  canSaveFreeItems: true,
  canSaveLuckyListItems: true,
  storage: 'cloud',
  progressIsPermanent: true,
} as const;

/**
 * All save rules by state
 */
export const SAVE_RULES_BY_STATE = {
  draft: SAVE_RULES_DRAFT,
  saved: SAVE_RULES_SAVED,
  premium: SAVE_RULES_PREMIUM,
} as const;

/**
 * SAVE BEHAVIOR RULES
 * 
 * - Saving an item must NOT interrupt navigation
 * - Saving must NOT redirect the user
 * - The user remains in the same content context
 */
export const SAVE_BEHAVIOR_RULES = {
  interruptsNavigation: false,
  redirectsUser: false,
  userRemainsInContext: true,
} as const;

/**
 * SAVE FEEDBACK RULE
 * 
 * - The system must provide immediate confirmation
 *   that the item was added to "Meu Roteiro"
 * - No modal or blocking confirmation is allowed
 */
export const SAVE_FEEDBACK_RULES = {
  providesImmediateConfirmation: true,
  modalConfirmation: false,
  blockingConfirmation: false,
  confirmationType: 'non-blocking',
} as const;

/**
 * SAVE ACTION SCALABILITY
 * 
 * - This save logic applies identically across all destinations
 * - Future content types must plug into this same save action
 */
export const SAVE_ACTION_SCALABILITY = {
  appliesToAllDestinations: true,
  logicIdenticalAcrossDestinations: true,
  futureContentTypesPlugIn: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SAVE ACTION HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if an item can be saved based on user state and source module
 */
export const canSaveItemFromModule = (
  sourceModule: RoteiroSourceModule,
  userState: RoteiroState
): { canSave: boolean; triggersPremiumFlow: boolean } => {
  const isLuckyList = sourceModule === 'lucky-list';
  
  if (!isLuckyList) {
    return { canSave: true, triggersPremiumFlow: false };
  }
  
  // Lucky List items
  switch (userState) {
    case 'premium':
      return { canSave: true, triggersPremiumFlow: false };
    case 'saved':
      return { canSave: false, triggersPremiumFlow: true };
    case 'draft':
      return { canSave: false, triggersPremiumFlow: true };
    default:
      return { canSave: false, triggersPremiumFlow: true };
  }
};

/**
 * Check if save action should be visible for an item
 * (Save action is always visible, even for Lucky List)
 */
export const isSaveActionVisible = (sourceModule: RoteiroSourceModule): boolean => {
  return SAVE_ELIGIBLE_MODULES.includes(sourceModule);
};

/**
 * Get storage type based on user state
 */
export const getSaveStorageType = (userState: RoteiroState): 'local' | 'cloud' => {
  return userState === 'draft' ? 'local' : 'cloud';
};

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
// LOCATION INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CORE PRINCIPLE
 * 
 * "Meu Roteiro" is LOCATION-AWARE, but NOT route-optimized at MVP level.
 * Each saved item is treated as a POINT IN SPACE, not yet as a timed event.
 */

/**
 * Item categories for coherence analysis
 */
export type ItemCategory = 
  | 'food'
  | 'activity'
  | 'nightlife'
  | 'experience'
  | 'attraction';

/**
 * Time-of-day context for soft coherence checks
 */
export type TimeOfDayContext = 
  | 'breakfast'
  | 'lunch'
  | 'afternoon'
  | 'dinner'
  | 'nightlife'
  | 'any';

/**
 * LOCATION DATA MODEL (ABSTRACT)
 * 
 * Each item in "Meu Roteiro" must internally store:
 * - Destination (city)
 * - Neighborhood (when applicable)
 * - Approximate geographic reference (place-level)
 * - Category (food, activity, nightlife, etc.)
 * 
 * No exact coordinates are required at this stage.
 */
export interface LocationDataModel {
  destination: string;
  neighborhood: string | null;
  approximateReference: string;
  category: ItemCategory;
  timeOfDayContext?: TimeOfDayContext;
}

export const LOCATION_DATA_REQUIREMENTS = {
  requiredFields: ['destination', 'neighborhood', 'approximateReference', 'category'] as const,
  exactCoordinatesRequired: false,
  exactCoordinatesOptional: true,
} as const;

/**
 * COHERENCE CHECK TYPES
 */
export type CoherenceCheckType = 
  | 'distance-warning'
  | 'sequence-incompatibility'
  | 'neighborhood-backtrack';

/**
 * Coherence check result
 */
export interface CoherenceCheckResult {
  type: CoherenceCheckType;
  severity: 'info' | 'suggestion';
  itemIds: string[];
  message: string;
  userCanIgnore: true;
}

/**
 * COHERENCE CHECKS (SOFT LOGIC)
 * 
 * The system may detect and flag:
 * - Items located very far apart within the same roteiro
 * - Items that are commonly incompatible in sequence
 *   (e.g. breakfast-only place saved after nightlife)
 * - Excessive back-and-forth between distant neighborhoods
 * 
 * These checks must be:
 * - Suggestive, not blocking
 * - Informational, not prescriptive
 * - Expressed as guidance, not error
 */
export const SOFT_COHERENCE_CHECKS = {
  distanceCheck: {
    enabled: true,
    detects: 'items-very-far-apart',
    behavior: 'suggestive',
    blocking: false,
  },
  sequenceCheck: {
    enabled: true,
    detects: 'commonly-incompatible-sequences',
    examples: ['breakfast-after-nightlife', 'morning-activity-after-late-dinner'],
    behavior: 'informational',
    blocking: false,
  },
  neighborhoodBacktrackCheck: {
    enabled: true,
    detects: 'excessive-back-and-forth',
    behavior: 'guidance',
    blocking: false,
  },
} as const;

/**
 * INCOMPATIBLE SEQUENCE DEFINITIONS
 * 
 * Pairs of time-of-day contexts that are commonly incompatible in sequence
 */
export const INCOMPATIBLE_SEQUENCES: Array<[TimeOfDayContext, TimeOfDayContext]> = [
  ['nightlife', 'breakfast'],
  ['dinner', 'breakfast'],
  ['breakfast', 'nightlife'],
];

/**
 * USER FEEDBACK RULE
 * 
 * When a potential incoherence is detected:
 * - The user may ignore it freely
 * - No action is forced
 * - The app maintains a supportive, advisory tone
 */
export const USER_FEEDBACK_RULES = {
  userMayIgnoreFreely: true,
  noActionForced: true,
  toneIsSupportive: true,
  toneIsAdvisory: true,
  toneIsNotPrescriptive: true,
} as const;

/**
 * NO TIME ASSUMPTIONS
 * 
 * At this stage:
 * - No dates
 * - No hours
 * - No day-by-day structure
 * - No travel duration calculation
 * 
 * These will be layered later.
 */
export const TIME_ASSUMPTIONS_MVP = {
  useDates: false,
  useHours: false,
  useDayByDayStructure: false,
  useTravelDurationCalculation: false,
  willBeLayeredLater: true,
} as const;

/**
 * NAVIGATION RULES FOR LOCATION INTELLIGENCE
 * 
 * - Location intelligence must NOT interrupt browsing
 * - Feedback may appear inside "Meu Roteiro" context ONLY
 * - No modal interruptions at MVP stage
 */
export const LOCATION_INTELLIGENCE_NAVIGATION = {
  interruptsBrowsing: false,
  feedbackOnlyInRoteiroContext: true,
  modalInterruptionsAtMVP: false,
} as const;

/**
 * SCALABILITY FOR LOCATION INTELLIGENCE
 * 
 * - This logic applies to all destinations
 * - Future Google Maps integration will ENHANCE this layer, not replace it
 * - This structure must support future features
 */
export const LOCATION_INTELLIGENCE_SCALABILITY = {
  appliesToAllDestinations: true,
  googleMapsWillEnhance: true,
  googleMapsWillNotReplace: true,
  futureFeatureSupport: {
    distanceCalculation: true,
    routeGrouping: true,
    timeBasedLogic: true,
  },
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
// MVP EXPERIENCE LOCK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * MEU ROTEIRO — MVP STRUCTURE
 * 
 * "Meu Roteiro" has a dedicated screen accessible from:
 * - Destination context
 * - Saved item actions
 */
export const MVP_SCREEN_ACCESS = {
  dedicatedScreen: true,
  accessibleFromDestinationContext: true,
  accessibleFromSavedItemActions: true,
} as const;

/**
 * CONTENT DISPLAY RULES (MVP)
 * 
 * Inside "Meu Roteiro", display items as a simple list with:
 * - Item name
 * - Item type (activity, restaurant, bar, experience)
 * - Neighborhood
 * - Origin module (O que fazer, Onde comer, Lucky List, etc.)
 * - Premium indicator (if applicable)
 */
export const MVP_CONTENT_DISPLAY = {
  displayFormat: 'simple-list',
  visibleFields: [
    'itemName',
    'itemType',
    'neighborhood',
    'originModule',
    'premiumIndicator',
  ] as const,
} as const;

/**
 * GROUPING LOGIC (MVP)
 * 
 * - Default grouping: by destination
 * - Secondary grouping option: by item type
 * - No date or time grouping at MVP stage
 */
export const MVP_GROUPING = {
  defaultGrouping: 'by-destination',
  secondaryGroupingOption: 'by-item-type',
  dateGrouping: false,
  timeGrouping: false,
} as const;

/**
 * ACTIONS AVAILABLE (MVP)
 * 
 * Users may:
 * - Remove items
 * - Reorder items manually
 * - Tap an item to return to its original content context
 */
export const MVP_ACTIONS = {
  removeItems: true,
  reorderItemsManually: true,
  tapToReturnToOriginalContext: true,
  
  // Explicitly excluded from MVP
  smartReordering: false,
  autoOptimization: false,
  suggestions: false,
} as const;

/**
 * MAP PRESENCE (MVP-LIGHT)
 * 
 * - A map view may exist as an optional secondary view
 * - Map shows pins for saved items
 * - No route drawing
 * - No distance calculation
 * - No optimization logic
 */
export const MVP_MAP = {
  mapViewExists: true,
  mapViewIsOptional: true,
  showPinsForSavedItems: true,
  
  // Explicitly excluded from MVP
  routeDrawing: false,
  distanceCalculation: false,
  optimizationLogic: false,
} as const;

/**
 * LOGIN INTERACTION (MVP)
 * 
 * - Logged-out users may build and view a draft roteiro
 * - When attempting to save permanently or access premium items,
 *   trigger authentication flow (defined later)
 */
export const MVP_LOGIN_INTERACTION = {
  loggedOutCanBuildDraft: true,
  loggedOutCanViewDraft: true,
  permanentSaveTriggerAuth: true,
  premiumItemTriggerAuth: true,
  authFlowDefinedSeparately: true,
} as const;

/**
 * MVP NAVIGATION RULES
 * 
 * - Entering "Meu Roteiro" preserves destination context
 * - Exiting returns the user to the last viewed destination screen
 * - Never redirect to Home unexpectedly
 */
export const MVP_NAVIGATION = {
  preservesDestinationContext: true,
  exitReturnsToLastDestinationScreen: true,
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
 * - Advanced features may layer on top without breaking MVP logic
 */
export const SCALABILITY_RULES = {
  appliesToAllDestinations: true,
  logicIdenticalAcrossDestinations: true,
  futureFeaturesMayExtend: true,
  futureFeaturesMustNotBreak: true,
  advancedFeaturesLayerOnTop: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL ORGANIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CORE CONCEPT
 * 
 * "Meu Roteiro" is presented as a READABLE, FLEXIBLE list,
 * not as a schedule.
 * 
 * The goal is CLARITY, not execution.
 */
export const VISUAL_ORGANIZATION_CORE = {
  presentationStyle: 'readable-flexible-list',
  notASchedule: true,
  goal: 'clarity',
  notExecution: true,
} as const;

/**
 * PRIMARY VIEW (DEFAULT)
 * 
 * Items inside "Meu Roteiro" must be displayed as:
 * - A vertical list
 * - Ordered manually or automatically
 * - Easy to scan and understand
 */
export const PRIMARY_VIEW = {
  format: 'vertical-list',
  orderingMode: 'manual-or-automatic',
  easyToScan: true,
  easyToUnderstand: true,
} as const;

/**
 * ITEM DISPLAY FIELDS
 * 
 * Each item must retain and display:
 * - Name
 * - Neighborhood
 * - Source module (e.g. O Que Fazer, Onde Comer, Lucky List)
 * - Premium indicator (if applicable)
 */
export const ITEM_DISPLAY_FIELDS = {
  required: ['name', 'neighborhood', 'sourceModule'] as const,
  conditional: ['premiumIndicator'] as const,
  premiumIndicatorShowsWhen: 'item-is-from-lucky-list',
} as const;

/**
 * GROUPING OPTIONS
 */
export type GroupingMode = 'flat' | 'by-neighborhood' | 'by-category';

/**
 * GROUPING LOGIC (OPTIONAL TOGGLE)
 * 
 * The user may switch between:
 * - Flat list (default)
 * - Grouped by neighborhood
 * - Grouped by category (food, activity, nightlife)
 * 
 * No grouping is mandatory.
 */
export const VISUAL_GROUPING = {
  defaultMode: 'flat' as GroupingMode,
  availableModes: ['flat', 'by-neighborhood', 'by-category'] as GroupingMode[],
  groupingMandatory: false,
  userCanToggle: true,
} as const;

/**
 * ORDERING RULES
 * 
 * - Items may be reordered freely by the user
 * - No "correct" order is imposed
 * - The system may suggest grouping (based on location intelligence),
 *   but never force reordering
 */
export const ORDERING_RULES = {
  userCanReorderFreely: true,
  noCorrectOrderImposed: true,
  systemMaySuggestGrouping: true,
  systemNeverForcesReordering: true,
} as const;

/**
 * NO TIME AXIS
 * 
 * At this stage:
 * - No hours
 * - No dates
 * - No day separation
 * - No "morning / afternoon / night"
 * 
 * This is INTENTIONAL.
 */
export const NO_TIME_AXIS = {
  useHours: false,
  useDates: false,
  useDaySeparation: false,
  useMorningAfternoonNight: false,
  intentional: true,
} as const;

/**
 * VISUAL ORGANIZATION NAVIGATION RULES
 * 
 * - "Meu Roteiro" must feel lightweight and reversible
 * - Returning always sends the user back to the last destination view
 * - No dead ends
 */
export const VISUAL_ORGANIZATION_NAVIGATION = {
  feelsLightweight: true,
  feelsReversible: true,
  returnToLastDestinationView: true,
  noDeadEnds: true,
} as const;

/**
 * VISUAL ORGANIZATION SCALABILITY
 * 
 * This structure must support future layers:
 * - Map view
 * - Day-by-day timeline
 * - Distance optimization
 * - Export / share
 * 
 * Without refactor.
 */
export const VISUAL_ORGANIZATION_SCALABILITY = {
  mustSupportFutureLayers: true,
  futureLayersSupported: [
    'map-view',
    'day-by-day-timeline',
    'distance-optimization',
    'export-share',
  ] as const,
  requiresRefactorForFuture: false,
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

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION INTELLIGENCE HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if two items are in different neighborhoods
 */
export const areInDifferentNeighborhoods = (
  item1: RoteiroItem,
  item2: RoteiroItem
): boolean => {
  return item1.geo.neighborhood !== item2.geo.neighborhood;
};

/**
 * Detect neighborhood backtracking in item sequence
 * Returns pairs of indices where backtracking occurs
 */
export const detectNeighborhoodBacktrack = (
  items: RoteiroItem[]
): Array<[number, number]> => {
  const backtracks: Array<[number, number]> = [];
  const visitedNeighborhoods: string[] = [];
  
  items.forEach((item, index) => {
    const neighborhood = item.geo.neighborhood;
    const lastVisitIndex = visitedNeighborhoods.lastIndexOf(neighborhood);
    
    if (lastVisitIndex !== -1 && lastVisitIndex < visitedNeighborhoods.length - 1) {
      backtracks.push([lastVisitIndex, index]);
    }
    
    visitedNeighborhoods.push(neighborhood);
  });
  
  return backtracks;
};

/**
 * Check if two time-of-day contexts are incompatible in sequence
 */
export const areIncompatibleInSequence = (
  first: TimeOfDayContext,
  second: TimeOfDayContext
): boolean => {
  return INCOMPATIBLE_SEQUENCES.some(
    ([a, b]) => a === first && b === second
  );
};

/**
 * Run soft coherence checks on roteiro items
 * Returns array of check results (all ignorable)
 */
export const runSoftCoherenceChecks = (
  items: RoteiroItem[]
): CoherenceCheckResult[] => {
  const results: CoherenceCheckResult[] = [];
  
  // Check for neighborhood backtracking
  const backtracks = detectNeighborhoodBacktrack(items);
  backtracks.forEach(([fromIndex, toIndex]) => {
    results.push({
      type: 'neighborhood-backtrack',
      severity: 'suggestion',
      itemIds: [items[fromIndex].id, items[toIndex].id],
      message: 'roteiro-backtrack-suggestion',
      userCanIgnore: true,
    });
  });
  
  return results;
};

/**
 * Get unique neighborhoods in roteiro
 */
export const getUniqueNeighborhoods = (items: RoteiroItem[]): string[] => {
  const neighborhoods = new Set(items.map(item => item.geo.neighborhood));
  return Array.from(neighborhoods);
};

/**
 * Count items per neighborhood
 */
export const countItemsPerNeighborhood = (
  items: RoteiroItem[]
): Record<string, number> => {
  return items.reduce((acc, item) => {
    const key = item.geo.neighborhood;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};
