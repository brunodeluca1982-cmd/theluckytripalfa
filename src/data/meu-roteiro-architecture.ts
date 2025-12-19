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
 * USER DRAFT STRUCTURAL LOCK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CORE CONCEPT:
 * "Meu Roteiro" starts as a DRAFT.
 * It is a flexible workspace where the user organizes their trip ideas
 * before final optimization.
 * 
 * GLOBAL RULES:
 * - Do NOT define visual design, layout, spacing, colors, or typography
 * - Do NOT generate or edit any Portuguese content
 * - Do NOT define pricing or subscriptions
 * - This is a structural and behavioral prompt only
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// USER DRAFT STRUCTURAL LOCK — CORE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DRAFT VIEW (DEFAULT)
 * 
 * Structure:
 * - The draft is organized by DAYS (Day 1, Day 2, Day 3…)
 * - Each day contains a vertical list of items
 * - Days are scrollable vertically
 * - Items inside a day are reorderable via drag-and-drop
 */
export const DRAFT_VIEW_STRUCTURE = {
  organizedBy: 'days',
  dayLabeling: 'Day 1, Day 2, Day 3...',
  itemLayout: 'vertical-list-per-day',
  scrollDirection: 'vertical',
  itemsReorderable: true,
  reorderMethod: 'drag-and-drop',
} as const;

/**
 * ITEM SOURCE TYPES
 * 
 * Items may come from:
 * - Curated content (Bruno / Partners on Trip)
 * - User-added places (Google Places only)
 */
export type DraftItemSource = 'curated' | 'user-added';

/**
 * DRAFT ITEM RETENTION
 * 
 * Each item must retain:
 * - Name
 * - Location (neighborhood or city)
 * - Source (Curated or User-added)
 * - Original destination
 */
export const DRAFT_ITEM_RETENTION = {
  requiredFields: ['name', 'location', 'source', 'originalDestination'] as const,
  locationGranularity: 'neighborhood-or-city',
  sourceTypes: ['curated', 'user-added'] as DraftItemSource[],
} as const;

/**
 * DRAG & DROP BEHAVIOR
 * 
 * Users can drag items:
 * - Between days
 * - Within the same day
 * - Curated items into their own draft
 * 
 * Dragging does not duplicate logic or content — only reference.
 */
export const DRAFT_DRAG_DROP_BEHAVIOR = {
  allowedOperations: {
    dragBetweenDays: true,
    dragWithinSameDay: true,
    dragCuratedIntoDraft: true,
  },
  duplicationBehavior: 'reference-only',
  noDuplicateLogicOrContent: true,
} as const;

/**
 * NO TIME LOGIC (FOR NOW)
 * 
 * At this stage, the draft does NOT include:
 * - Hours
 * - Durations
 * - Travel time
 * - Costs
 * 
 * This is intentional.
 * The draft is about thinking, not executing.
 */
export const DRAFT_NO_TIME_LOGIC = {
  includesHours: false,
  includesDurations: false,
  includesTravelTime: false,
  includesCosts: false,
  reason: 'draft-is-about-thinking-not-executing',
} as const;

/**
 * INTELLIGENCE (PASSIVE)
 * 
 * - The system may observe distances and patterns silently
 * - No alerts, warnings, or corrections are shown yet
 * - Intelligence layers will be added later
 */
export const DRAFT_PASSIVE_INTELLIGENCE = {
  observesDistances: true,
  observesPatterns: true,
  showsAlerts: false,
  showsWarnings: false,
  showsCorrections: false,
  intelligenceLayersAddedLater: true,
} as const;

/**
 * NAVIGATION
 * 
 * - "Meu Roteiro" is always accessible from the destination context
 * - Returning from the draft sends the user back to the last destination view
 * - No forced login inside the draft stage
 */
export const DRAFT_NAVIGATION = {
  accessibleFromDestinationContext: true,
  returnBehavior: 'back-to-last-destination-view',
  forcedLoginInsideDraft: false,
} as const;

/**
 * SCALABILITY RULE
 * 
 * This draft structure must support future layers:
 * - Time scheduling
 * - Distance optimization
 * - Cost estimation
 * - AI suggestions
 * - Map visualization
 * 
 * Without refactoring.
 */
export const DRAFT_SCALABILITY = {
  futureLayers: [
    'time-scheduling',
    'distance-optimization',
    'cost-estimation',
    'ai-suggestions',
    'map-visualization',
  ] as const,
  requiresRefactoring: false,
} as const;

/**
 * USER DRAFT OUTCOME
 * 
 * After this lock:
 * - Users can build a real itinerary draft
 * - Curated content gains practical value
 * - The journey feels complete even with one destination
 */
export const DRAFT_OUTCOME = {
  userCanBuildRealDraft: true,
  curatedContentGainsPracticalValue: true,
  journeyFeelsCompleteWithOneDestination: true,
} as const;

/**
 * COMPLETE USER DRAFT STRUCTURAL LOCK
 */
export const USER_DRAFT_STRUCTURAL_LOCK = {
  viewStructure: DRAFT_VIEW_STRUCTURE,
  itemRetention: DRAFT_ITEM_RETENTION,
  dragDropBehavior: DRAFT_DRAG_DROP_BEHAVIOR,
  noTimeLogic: DRAFT_NO_TIME_LOGIC,
  passiveIntelligence: DRAFT_PASSIVE_INTELLIGENCE,
  navigation: DRAFT_NAVIGATION,
  scalability: DRAFT_SCALABILITY,
  outcome: DRAFT_OUTCOME,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TIME, DISTANCE & CONSISTENCY INTELLIGENCE — STRUCTURAL LOCK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXECUTION INTELLIGENCE LAYER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GOAL:
 * Layer execution intelligence on top of the existing draft,
 * while preserving user freedom and curated differentiation.
 * 
 * PREREQUISITE:
 * This step builds on the existing DRAFT structure
 * with days and draggable items already defined.
 * 
 * GLOBAL RULES:
 * - Do NOT define UI, layout, spacing, colors, typography, or animations
 * - Do NOT generate or edit any Portuguese content
 * - Do NOT define pricing or subscription logic
 * - This defines behavior and logic only
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * 1) TIME ASSIGNMENT (OPTIONAL, USER-LED)
 * 
 * - Users may assign a start time to any item
 * - Time is optional, not mandatory
 * - If no time is assigned, the item remains flexible
 */
export const TIME_ASSIGNMENT_RULES = {
  isOptional: true,
  isUserLed: true,
  isMandatory: false,
  defaultState: 'flexible',
  allowsStartTime: true,
  allowsEndTime: false, // derived from duration
} as const;

/**
 * Duration source priority
 */
export type DurationSource = 'curated' | 'google-places' | 'user-defined' | 'default';

/**
 * 2) DURATION ESTIMATION
 * 
 * - Each item may have an estimated duration
 * - Duration may come from:
 *   - Curated database (preferred)
 *   - Google Places data (fallback)
 * - Duration is an estimate, not a promise
 */
export const DURATION_ESTIMATION_RULES = {
  isEstimate: true,
  isNotAPromise: true,
  sources: ['curated', 'google-places', 'user-defined', 'default'] as DurationSource[],
  sourcePriority: {
    first: 'curated',
    fallback: 'google-places',
    userOverride: 'user-defined',
    lastResort: 'default',
  },
  defaultDurationMinutes: 60,
} as const;

/**
 * Travel mode types
 */
export type TravelMode = 'walk' | 'car' | 'transit' | 'bike' | 'unknown';

/**
 * 3) DISTANCE & TRAVEL TIME
 * 
 * - The system calculates distance and travel time between consecutive items
 * - Travel mode may be inferred (walk / car / transit)
 * - Distances are displayed contextually, per transition
 */
export const DISTANCE_TRAVEL_TIME_RULES = {
  calculatesDistance: true,
  calculatesTravelTime: true,
  scopeIsConsecutiveItems: true,
  travelModes: ['walk', 'car', 'transit', 'bike'] as TravelMode[],
  travelModeInference: true,
  displayContext: 'per-transition',
  requiresGeoData: true,
} as const;

/**
 * Consistency warning types
 */
export type ConsistencyWarningType = 
  | 'overlapping-times'
  | 'unrealistic-travel-gap'
  | 'excessive-distance'
  | 'outside-logical-hours';

/**
 * 4) CONSISTENCY CHECKS (INTELLIGENT WARNINGS)
 * 
 * The system may detect and flag:
 * - Overlapping times
 * - Unrealistic travel gaps
 * - Excessive distances between consecutive items
 * - Items placed outside logical hours
 * 
 * Rules:
 * - Warnings are advisory, not blocking
 * - The user may ignore all warnings
 * - No automatic correction is applied
 */
export const CONSISTENCY_CHECK_RULES = {
  detectableIssues: [
    'overlapping-times',
    'unrealistic-travel-gap',
    'excessive-distance',
    'outside-logical-hours',
  ] as ConsistencyWarningType[],
  warningBehavior: {
    isAdvisory: true,
    isBlocking: false,
    userCanIgnore: true,
    automaticCorrection: false,
  },
  thresholds: {
    excessiveDistanceKm: 15,
    unrealisticTravelGapMinutes: 15,
    logicalHoursStart: 6, // 6 AM
    logicalHoursEnd: 24, // midnight
  },
} as const;

/**
 * Day feasibility levels
 */
export type DayFeasibilityLevel = 'light' | 'balanced' | 'heavy';

/**
 * 5) DAILY SUMMARY
 * 
 * For each day, the system may calculate:
 * - Total planned duration
 * - Total estimated travel time
 * - General feasibility indicator (light / balanced / heavy)
 * 
 * No scoring, no judgment.
 */
export const DAILY_SUMMARY_RULES = {
  calculatesTotalPlannedDuration: true,
  calculatesTotalTravelTime: true,
  providesFeasibilityIndicator: true,
  feasibilityLevels: ['light', 'balanced', 'heavy'] as DayFeasibilityLevel[],
  noScoring: true,
  noJudgment: true,
  thresholds: {
    lightMaxHours: 4,
    balancedMaxHours: 8,
    heavyMinHours: 8,
  },
} as const;

/**
 * 6) USER-ADDED PLACES RULE
 * 
 * - User-added places must exist in Google Places and have a valid place_id
 * - These places may be used ONLY for:
 *   - Distance calculation
 *   - Travel time estimation
 *   - Schedule consistency checks
 * - The system must NOT recommend, describe, or suggest user-added places
 * - All recommendations must come exclusively from the curated database
 */
export const USER_ADDED_PLACES_INTELLIGENCE_RULES = {
  requiresGooglePlaces: true,
  requiresValidPlaceId: true,
  allowedUseCases: [
    'distance-calculation',
    'travel-time-estimation',
    'schedule-consistency-checks',
  ] as const,
  forbiddenActions: {
    recommend: true,
    describe: true,
    suggest: true,
  },
  recommendationsSource: 'curated-database-only',
} as const;

/**
 * 7) CURATION PRIORITY
 * 
 * - Curated items always retain priority in suggestions
 * - The system may suggest replacing a user-added item
 *   with a curated alternative, but never automatically
 */
export const CURATION_PRIORITY_RULES = {
  curatedHasPriorityInSuggestions: true,
  mayOfferCuratedAlternatives: true,
  automaticReplacement: false,
  userMustConfirmReplacement: true,
} as const;

/**
 * NAVIGATION RULES
 * 
 * - All intelligence appears within the context of "Meu Roteiro"
 * - No redirection to Home or external screens
 * - The user always stays inside their planning flow
 */
export const INTELLIGENCE_NAVIGATION_RULES = {
  contextIsWithinMeuRoteiro: true,
  noRedirectionToHome: true,
  noRedirectionToExternalScreens: true,
  userStaysInPlanningFlow: true,
} as const;

/**
 * SCALABILITY RULE
 * 
 * This layer must support future extensions:
 * - Cost estimation
 * - Booking integrations
 * - Map export
 * - Public itinerary pages
 * 
 * Without refactoring.
 */
export const INTELLIGENCE_SCALABILITY = {
  futureExtensions: [
    'cost-estimation',
    'booking-integrations',
    'map-export',
    'public-itinerary-pages',
  ] as const,
  requiresRefactoring: false,
} as const;

/**
 * INTELLIGENCE OUTCOME
 * 
 * After this lock:
 * - "Meu Roteiro" becomes executable, not just inspirational
 * - The app matches and exceeds core planning power
 * - Curated content gains measurable, practical value
 * - The product feels complete even with a single destination
 */
export const INTELLIGENCE_OUTCOME = {
  roteiroBecomesExecutable: true,
  matchesPlanningPower: true,
  curatedContentGainsMeasurableValue: true,
  productFeelsCompleteWithOneDestination: true,
} as const;

/**
 * COMPLETE TIME, DISTANCE & CONSISTENCY INTELLIGENCE LOCK
 */
export const EXECUTION_INTELLIGENCE_LOCK = {
  timeAssignment: TIME_ASSIGNMENT_RULES,
  durationEstimation: DURATION_ESTIMATION_RULES,
  distanceTravelTime: DISTANCE_TRAVEL_TIME_RULES,
  consistencyChecks: CONSISTENCY_CHECK_RULES,
  dailySummary: DAILY_SUMMARY_RULES,
  userAddedPlaces: USER_ADDED_PLACES_INTELLIGENCE_RULES,
  curationPriority: CURATION_PRIORITY_RULES,
  navigation: INTELLIGENCE_NAVIGATION_RULES,
  scalability: INTELLIGENCE_SCALABILITY,
  outcome: INTELLIGENCE_OUTCOME,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER TYPES FOR INTELLIGENCE LAYER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Item with time intelligence data
 */
export interface IntelligentRoteiroItem {
  id: string;
  name: string;
  source: DraftItemSource;
  
  // Time intelligence (optional)
  startTime?: string; // HH:mm format
  estimatedDurationMinutes?: number;
  durationSource?: DurationSource;
  
  // Location intelligence
  placeId?: string; // Google Places ID
  coordinates?: { lat: number; lng: number };
  neighborhood?: string;
  
  // Derived data
  calculatedEndTime?: string;
}

/**
 * Transition between two items
 */
export interface ItemTransition {
  fromItemId: string;
  toItemId: string;
  distanceKm: number;
  estimatedTravelMinutes: number;
  inferredTravelMode: TravelMode;
  hasWarning: boolean;
  warningType?: ConsistencyWarningType;
}

/**
 * Daily summary data
 */
export interface DaySummary {
  dayNumber: number;
  itemCount: number;
  totalPlannedMinutes: number;
  totalTravelMinutes: number;
  feasibilityLevel: DayFeasibilityLevel;
  warnings: ConsistencyWarningType[];
}

// ═══════════════════════════════════════════════════════════════════════════
// MAP VIEW + GOOGLE MAPS EXPORT — STRUCTURAL LOCK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAP VIEW + GOOGLE MAPS EXPORT LAYER
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GOAL:
 * Allow the user to visualize each day on a map
 * and export the planned day (or full trip) to Google Maps,
 * using place_id as the canonical location key.
 * 
 * GLOBAL RULES:
 * - Do NOT define UI, layout, spacing, colors, typography, or animations
 * - Do NOT generate or edit any Portuguese content
 * - Do NOT define pricing or subscription logic
 * - This defines behavior and logic only
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * DATA REQUIREMENT (CANONICAL LOCATION)
 * 
 * Every item that appears in "Meu Roteiro" must have:
 * - place_id (Google Places)
 * - lat/lng (resolved from place_id)
 * - destination_id
 * - day_index
 * 
 * If an item does not have a place_id:
 * - It cannot be mapped or exported
 * - The system must request the user to search/select a Google place match
 */
export const MAP_DATA_REQUIREMENTS = {
  requiredFields: ['place_id', 'lat', 'lng', 'destination_id', 'day_index'] as const,
  placeIdSource: 'google-places',
  coordinatesResolvedFrom: 'place_id',
  missingPlaceIdBehavior: {
    canBeMapped: false,
    canBeExported: false,
    mustRequestUserMatch: true,
  },
} as const;

/**
 * Mappable item with canonical location
 */
export interface MappableItem {
  id: string;
  name: string;
  placeId: string; // Required for mapping
  lat: number;
  lng: number;
  destinationId: string;
  dayIndex: number;
  orderInDay: number;
  source: DraftItemSource;
}

/**
 * MAP VIEW (IN-APP)
 * 
 * Provide a "Map View" mode for "Meu Roteiro".
 * Map View must support:
 * 1) Day filter (view Day 1, Day 2, etc.)
 * 2) All-days view (optional)
 * 3) Pins for each item in the selected day
 * 4) Ordered path visualization (A → B → C) based on item order
 * 
 * The map is a visualization only:
 * - No booking
 * - No new recommendations
 * - No content rewrite
 */
export const MAP_VIEW_CAPABILITIES = {
  modes: ['single-day', 'all-days'] as const,
  features: {
    dayFilter: true,
    allDaysView: true,
    pinsPerItem: true,
    orderedPathVisualization: true,
  },
  restrictions: {
    noBooking: true,
    noNewRecommendations: true,
    noContentRewrite: true,
  },
  visualizationOnly: true,
} as const;

/**
 * Map view mode type
 */
export type MapViewMode = 'single-day' | 'all-days';

/**
 * ROUTE LOGIC (PER DAY)
 * 
 * - If the day has 2+ items, compute an ordered route using:
 *   - item order in the day as the route order
 * - Show travel segments using the same travel mode logic
 *   (walk/car/transit inference)
 */
export const MAP_ROUTE_LOGIC = {
  minimumItemsForRoute: 2,
  routeOrderDerivedFrom: 'item-order-in-day',
  travelModeInference: true,
  usesSharedTravelModeLogic: true,
} as const;

/**
 * Route segment for map visualization
 */
export interface RouteSegment {
  fromItem: MappableItem;
  toItem: MappableItem;
  distanceKm: number;
  estimatedTravelMinutes: number;
  travelMode: TravelMode;
  polyline?: string; // Encoded polyline for rendering
}

/**
 * Day route data for map
 */
export interface DayRouteData {
  dayIndex: number;
  items: MappableItem[];
  segments: RouteSegment[];
  totalDistanceKm: number;
  totalTravelMinutes: number;
}

/**
 * Export action types
 */
export type ExportAction = 'export-day' | 'export-full-trip';

/**
 * EXPORT TO GOOGLE MAPS (CORE)
 * 
 * Add export actions (logic only):
 * 1) Export Day to Google Maps
 * 2) Export Full Trip to Google Maps (multi-day as separate lists)
 */
export const GOOGLE_MAPS_EXPORT_ACTIONS = {
  availableActions: ['export-day', 'export-full-trip'] as ExportAction[],
  exportDayBehavior: 'single-day-as-route',
  exportFullTripBehavior: 'multi-day-as-separate-lists',
} as const;

/**
 * Export format types
 */
export type ExportFormat = 'saved-list' | 'shareable-link' | 'directions-link';

/**
 * EXPORT FORMAT (PREFERRED)
 * 
 * Generate a Google Maps "Saved list" or "shareable map link"
 * using place_ids in order.
 * 
 * If direct list creation is not available:
 * - Generate a Google Maps Directions link for each day
 * - Use origin + waypoints + destination derived from ordered place_ids
 * - Keep within Google Maps waypoint limits by splitting into multiple links
 */
export const GOOGLE_MAPS_EXPORT_FORMAT = {
  preferredFormats: ['saved-list', 'shareable-link'] as ExportFormat[],
  fallbackFormat: 'directions-link',
  directionsLinkStructure: {
    origin: 'first-item-place_id',
    waypoints: 'middle-items-place_ids',
    destination: 'last-item-place_id',
  },
  waypointLimits: {
    maxWaypointsPerLink: 10, // Google Maps limit
    splitBehavior: 'multiple-links',
  },
  usesPlaceIdAsKey: true,
} as const;

/**
 * Export link data
 */
export interface ExportLinkData {
  dayIndex: number;
  format: ExportFormat;
  url: string;
  itemCount: number;
  requiresSplit: boolean;
  splitLinks?: string[]; // If exceeds waypoint limit
}

/**
 * Full trip export data
 */
export interface FullTripExportData {
  destinationId: string;
  totalDays: number;
  dayExports: ExportLinkData[];
}

/**
 * USER-ADDED PLACES COMPLIANCE
 * 
 * - User-added places are allowed in map/export ONLY if they have a valid place_id
 * - They may appear as pins and waypoints
 * - The system must not recommend or describe them
 */
export const MAP_USER_ADDED_PLACES_RULES = {
  allowedInMap: true,
  allowedInExport: true,
  requiresValidPlaceId: true,
  mayAppearAsPins: true,
  mayAppearAsWaypoints: true,
  systemMustNotRecommend: true,
  systemMustNotDescribe: true,
} as const;

/**
 * CURATION RULE
 * 
 * - Export includes both curated and user-added items
 * - Recommendations still come only from the curated database
 */
export const MAP_CURATION_RULES = {
  exportIncludesCurated: true,
  exportIncludesUserAdded: true,
  recommendationsOnlyFromCurated: true,
} as const;

/**
 * NAVIGATION RULES
 * 
 * - Map View lives inside "Meu Roteiro"
 * - Returning from Map View returns to "Meu Roteiro" (same day context)
 * - No redirect to Home
 */
export const MAP_NAVIGATION_RULES = {
  livesInsideMeuRoteiro: true,
  returnBehavior: 'back-to-meu-roteiro-same-day-context',
  noRedirectToHome: true,
} as const;

/**
 * SCALABILITY
 * 
 * This structure must allow future extensions:
 * - Offline map pack
 * - Public share page per trip/day
 * - Booking layer per item
 */
export const MAP_SCALABILITY = {
  futureExtensions: [
    'offline-map-pack',
    'public-share-page-per-trip',
    'public-share-page-per-day',
    'booking-layer-per-item',
  ] as const,
  requiresRefactoring: false,
} as const;

/**
 * MAP OUTCOME
 * 
 * After this lock:
 * - The user can see the plan spatially
 * - The user can execute the trip using Google Maps
 * - The app matches practical utility while keeping curated advantage
 */
export const MAP_OUTCOME = {
  userCanSeePlanSpatially: true,
  userCanExecuteTripWithGoogleMaps: true,
  matchesPracticalUtility: true,
  keepsCuratedAdvantage: true,
} as const;

/**
 * COMPLETE MAP VIEW + GOOGLE MAPS EXPORT LOCK
 */
export const MAP_EXPORT_LOCK = {
  dataRequirements: MAP_DATA_REQUIREMENTS,
  viewCapabilities: MAP_VIEW_CAPABILITIES,
  routeLogic: MAP_ROUTE_LOGIC,
  exportActions: GOOGLE_MAPS_EXPORT_ACTIONS,
  exportFormat: GOOGLE_MAPS_EXPORT_FORMAT,
  userAddedPlacesRules: MAP_USER_ADDED_PLACES_RULES,
  curationRules: MAP_CURATION_RULES,
  navigation: MAP_NAVIGATION_RULES,
  scalability: MAP_SCALABILITY,
  outcome: MAP_OUTCOME,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS FOR MAP & EXPORT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if an item is mappable (has required place_id)
 */
export const isItemMappable = (item: { placeId?: string }): boolean => {
  return !!item.placeId && item.placeId.length > 0;
};

/**
 * Generate Google Maps directions URL from ordered place_ids
 */
export const generateDirectionsUrl = (
  placeIds: string[],
  travelMode: TravelMode = 'car'
): string => {
  if (placeIds.length < 2) return '';
  
  const origin = `place_id:${placeIds[0]}`;
  const destination = `place_id:${placeIds[placeIds.length - 1]}`;
  const waypoints = placeIds.slice(1, -1).map(id => `place_id:${id}`).join('|');
  
  const modeMap: Record<TravelMode, string> = {
    walk: 'walking',
    car: 'driving',
    transit: 'transit',
    bike: 'bicycling',
    unknown: 'driving',
  };
  
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${modeMap[travelMode]}`;
  
  if (waypoints) {
    url += `&waypoints=${encodeURIComponent(waypoints)}`;
  }
  
  return url;
};

/**
 * Split items into chunks respecting waypoint limits
 */
export const splitItemsForExport = (
  items: MappableItem[],
  maxWaypoints: number = 10
): MappableItem[][] => {
  if (items.length <= maxWaypoints + 1) {
    return [items];
  }
  
  const chunks: MappableItem[][] = [];
  let remaining = [...items];
  
  while (remaining.length > 0) {
    // Take up to maxWaypoints + 1 (origin + waypoints, next chunk starts with last as origin)
    const chunk = remaining.slice(0, maxWaypoints + 1);
    chunks.push(chunk);
    
    // Next chunk starts with the last item of this chunk
    if (remaining.length > maxWaypoints + 1) {
      remaining = remaining.slice(maxWaypoints);
    } else {
      break;
    }
  }
  
  return chunks;
};

/**
 * Check if all items in a day are mappable
 */
export const isDayFullyMappable = (items: { placeId?: string }[]): boolean => {
  return items.every(isItemMappable);
};

/**
 * Get unmappable items in a day
 */
export const getUnmappableItems = <T extends { placeId?: string; id: string }>(
  items: T[]
): T[] => {
  return items.filter(item => !isItemMappable(item));
};

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
// LOCATION & CONTEXT INTELLIGENCE — CORE PRINCIPLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CORE PRINCIPLE
 * 
 * The product must UNDERSTAND location before it SHOWS location.
 * Every saved or browsed item must carry invisible spatial meaning.
 */
export const LOCATION_INTELLIGENCE_PRINCIPLE = {
  understandBeforeShow: true,
  everyItemCarriesSpatialMeaning: true,
  invisibleAtThisStage: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION ATTRIBUTES (INTERNAL)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Environment type for items
 */
export type EnvironmentType = 'indoor' | 'outdoor' | 'mixed';

/**
 * GEOLOCATION DATA (ENHANCED)
 * 
 * Every item in "Meu Roteiro" must internally retain:
 * - City
 * - Neighborhood
 * - Latitude (future-ready)
 * - Longitude (future-ready)
 * - Category (food, activity, nightlife, etc.)
 * - Indoor / Outdoor (when applicable)
 * 
 * These attributes are INTERNAL only.
 * They are NOT user-facing at this stage.
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  neighborhood: string;
  city: string;
  country: string;
}

/**
 * Extended location attributes (internal)
 */
export interface LocationAttributes {
  geo: GeoLocation;
  category: RoteiroItemType;
  environment: EnvironmentType;
  effortLevel?: 'low' | 'medium' | 'high';
  typicalDuration?: number; // in minutes
}

/**
 * LOCATION ATTRIBUTES RULES
 */
export const LOCATION_ATTRIBUTES_RULES = {
  requiredFields: ['city', 'neighborhood', 'latitude', 'longitude', 'category'] as const,
  optionalFields: ['environment', 'effortLevel', 'typicalDuration'] as const,
  isUserFacing: false,
  isInternal: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DISTANCE AWARENESS (PASSIVE)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DISTANCE AWARENESS (PASSIVE)
 * 
 * The system must be CAPABLE of:
 * - Calculating distance between items
 * - Understanding neighborhood adjacency
 * - Identifying extreme displacements
 * - Detecting incompatible groupings
 * 
 * NO action is taken yet.
 * NO warnings are shown yet.
 */
export const DISTANCE_AWARENESS = {
  capabilities: {
    calculateDistanceBetweenItems: true,
    understandNeighborhoodAdjacency: true,
    identifyExtremeDisplacements: true,
    detectIncompatibleGroupings: true,
  },
  currentBehavior: {
    actionsTaken: false,
    warningsShown: false,
    passiveOnly: true,
  },
} as const;

/**
 * Neighborhood adjacency map for Rio de Janeiro
 */
export const RIO_NEIGHBORHOOD_ADJACENCY: Record<string, string[]> = {
  'ipanema': ['leblon', 'arpoador', 'copacabana', 'lagoa'],
  'leblon': ['ipanema', 'gavea', 'jardim-botanico', 'lagoa'],
  'copacabana': ['ipanema', 'leme', 'botafogo'],
  'leme': ['copacabana'],
  'arpoador': ['ipanema', 'copacabana'],
  'botafogo': ['copacabana', 'flamengo', 'urca', 'humaita'],
  'flamengo': ['botafogo', 'catete', 'laranjeiras', 'centro'],
  'urca': ['botafogo'],
  'lagoa': ['ipanema', 'leblon', 'jardim-botanico', 'gavea', 'humaita'],
  'jardim-botanico': ['leblon', 'gavea', 'lagoa', 'humaita'],
  'gavea': ['leblon', 'jardim-botanico', 'sao-conrado'],
  'sao-conrado': ['gavea', 'barra'],
  'barra': ['sao-conrado', 'recreio'],
  'recreio': ['barra'],
  'centro': ['flamengo', 'santa-teresa', 'lapa'],
  'santa-teresa': ['centro', 'lapa'],
  'lapa': ['centro', 'santa-teresa'],
  'humaita': ['botafogo', 'lagoa', 'jardim-botanico'],
  'catete': ['flamengo', 'laranjeiras'],
  'laranjeiras': ['flamengo', 'catete'],
};

// ═══════════════════════════════════════════════════════════════════════════
// COHERENCE READINESS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Future coherence condition types
 */
export type CoherenceCondition = 
  | 'items-far-apart-same-day'
  | 'excessive-zone-backtrack'
  | 'outdoor-items-incompatible-weather'
  | 'high-effort-consecutive';

/**
 * COHERENCE READINESS
 * 
 * Mark the following future conditions as DETECTABLE:
 * - Items very far apart on the same day (future)
 * - Excessive back-and-forth between zones
 * - Outdoor items grouped in incompatible weather windows
 * - High-effort items grouped consecutively
 * 
 * These signals remain DORMANT.
 */
export const COHERENCE_CONDITIONS: readonly CoherenceCondition[] = [
  'items-far-apart-same-day',
  'excessive-zone-backtrack',
  'outdoor-items-incompatible-weather',
  'high-effort-consecutive',
] as const;

export const COHERENCE_READINESS = {
  detectableConditions: COHERENCE_CONDITIONS,
  conditionStatus: 'dormant',
  activeAtThisStage: false,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// NO JUDGMENT RULE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NO JUDGMENT RULE
 * 
 * At this stage:
 * - The system NEVER blocks actions
 * - The system NEVER forces corrections
 * - The system NEVER warns the user
 * 
 * It only UNDERSTANDS.
 */
export const NO_JUDGMENT_RULE = {
  blocksActions: false,
  forcesCorrections: false,
  warnsUser: false,
  onlyUnderstands: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION READINESS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * External API compatibility types
 */
export type ExternalApiType = 
  | 'google-maps'
  | 'apple-maps'
  | 'distance-api'
  | 'weather-api'
  | 'time-estimation-api';

/**
 * INTEGRATION READINESS
 * 
 * This intelligence must be compatible with:
 * - Google Maps
 * - Apple Maps
 * - Distance APIs
 * - Weather APIs
 * - Time estimation APIs
 * 
 * Without structural refactor.
 */
export const INTEGRATION_READINESS = {
  compatibleWith: [
    'google-maps',
    'apple-maps',
    'distance-api',
    'weather-api',
    'time-estimation-api',
  ] as ExternalApiType[],
  requiresStructuralRefactor: false,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION INTELLIGENCE SCALABILITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SCALABILITY RULE
 * 
 * This intelligence applies to:
 * - All destinations
 * - All items
 * - All future planning layers
 */
export const LOCATION_SCALABILITY = {
  appliesToAllDestinations: true,
  appliesToAllItems: true,
  appliesToAllFuturePlanningLayers: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// GEOLOCATION DATA STRUCTURE (GOOGLE MAPS READY)
// ═══════════════════════════════════════════════════════════════════════════

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
  
  // Extended location attributes (internal)
  environment?: EnvironmentType;
  effortLevel?: 'low' | 'medium' | 'high';
  typicalDuration?: number;
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
// ENHANCED LOCATION INTELLIGENCE & COHERENCE LOGIC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LOCATION DATA SOURCE
 * 
 * Each item added to "Meu Roteiro" must be associated internally with:
 * - Google Maps location data (latitude / longitude)
 * - Neighborhood (when applicable)
 * - Destination context
 * 
 * This data is used for ANALYSIS ONLY, not visualization.
 */
export const LOCATION_DATA_SOURCE = {
  requiredData: {
    googleMapsCoordinates: true,
    latitude: true,
    longitude: true,
    neighborhood: true,
    destinationContext: true,
  },
  usageMode: 'analysis-only',
  notForVisualization: true,
} as const;

/**
 * Zone types for cross-zone detection
 */
export type RioZone = 
  | 'zona-sul'
  | 'zona-norte'
  | 'zona-oeste'
  | 'barra'
  | 'centro';

/**
 * Transport mode for cluster analysis
 */
export type TransportMode = 'walkable' | 'car-dependent' | 'mixed';

/**
 * INTELLIGENCE FUNCTION 1: ENHANCED DISTANCE AWARENESS
 * 
 * - Detect when saved items are geographically distant
 * - Identify clusters that are walkable vs. car-dependent
 * - Recognize cross-zone jumps (e.g. Zona Sul → Barra)
 */
export const ENHANCED_DISTANCE_AWARENESS = {
  enabled: true,
  capabilities: {
    detectGeographicallyDistantItems: true,
    identifyWalkableClusters: true,
    identifyCarDependentClusters: true,
    recognizeCrossZoneJumps: true,
  },
  crossZoneExamples: [
    ['zona-sul', 'barra'],
    ['zona-sul', 'zona-norte'],
    ['centro', 'barra'],
  ] as Array<[RioZone, RioZone]>,
} as const;

/**
 * Coherence issue types
 */
export type CoherenceIssueType = 
  | 'too-many-distant-items'
  | 'impractical-single-outing'
  | 'different-time-of-day-required';

/**
 * INTELLIGENCE FUNCTION 2: LOGICAL COHERENCE
 * 
 * Detect potential friction such as:
 * - Too many distant items grouped together
 * - Impractical combinations for a single outing
 * - Items that usually require different times of day
 * 
 * These are SUGGESTIONS ONLY, never errors.
 */
export const LOGICAL_COHERENCE = {
  enabled: true,
  detects: {
    tooManyDistantItemsGrouped: true,
    impracticalSingleOutingCombinations: true,
    differentTimeOfDayRequired: true,
  },
  outputType: 'suggestions-only',
  neverErrors: true,
  neverBlocks: true,
} as const;

/**
 * Contextual warning types
 */
export type ContextualWarningType = 
  | 'places-far-apart'
  | 'requires-car'
  | 'works-better-split';

/**
 * INTELLIGENCE FUNCTION 3: CONTEXTUAL WARNINGS (SOFT)
 * 
 * The system may surface gentle insights such as:
 * - "These places are far apart"
 * - "This group may require a car"
 * - "This works better if split"
 * 
 * No alert is mandatory.
 * No blocking behavior is allowed.
 */
export const CONTEXTUAL_WARNINGS = {
  enabled: true,
  warningTypes: [
    'places-far-apart',
    'requires-car',
    'works-better-split',
  ] as ContextualWarningType[],
  behavior: {
    alertMandatory: false,
    blockingAllowed: false,
    toneIsGentle: true,
    toneIsInsightful: true,
  },
} as const;

/**
 * USER CONTROL PRINCIPLE
 * 
 * - The user ALWAYS remains in control
 * - The system NEVER says "wrong"
 * - The system NEVER enforces changes
 * - Intelligence is SUGGESTIVE, not corrective
 */
export const USER_CONTROL_PRINCIPLE = {
  userAlwaysInControl: true,
  systemNeverSaysWrong: true,
  systemNeverEnforcesChanges: true,
  intelligenceMode: 'suggestive',
  notCorrective: true,
} as const;

/**
 * INTEGRATION WITH MEU ROTEIRO
 * 
 * - Intelligence operates inside the roteiro context
 * - Suggestions appear only when relevant
 * - Dismissing a suggestion never penalizes the user
 */
export const INTELLIGENCE_INTEGRATION = {
  operatesInsideRoteiroContext: true,
  suggestionsAppearWhenRelevant: true,
  dismissingSuggestionNeverPenalizes: true,
} as const;

/**
 * ENHANCED SCALABILITY
 * 
 * - This intelligence applies identically to all destinations
 * - Future layers (map view, timeline, optimization)
 *   may build on this logic without refactoring
 */
export const ENHANCED_INTELLIGENCE_SCALABILITY = {
  appliesToAllDestinations: true,
  logicIdenticalAcrossDestinations: true,
  futureLayersCanBuildOn: true,
  noRefactoringRequired: true,
  futureLayers: [
    'map-view',
    'timeline',
    'optimization',
  ] as const,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED INTELLIGENCE HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Determine transport mode for a cluster of items
 */
export const determineTransportMode = (
  maxDistanceKm: number
): TransportMode => {
  if (maxDistanceKm <= 1) return 'walkable';
  if (maxDistanceKm >= 5) return 'car-dependent';
  return 'mixed';
};

/**
 * Check if two zones are considered a cross-zone jump
 */
export const isCrossZoneJump = (
  zone1: RioZone,
  zone2: RioZone
): boolean => {
  if (zone1 === zone2) return false;
  
  const significantJumps: Array<[RioZone, RioZone]> = [
    ['zona-sul', 'barra'],
    ['zona-sul', 'zona-norte'],
    ['centro', 'barra'],
    ['zona-norte', 'barra'],
  ];
  
  return significantJumps.some(
    ([a, b]) => (zone1 === a && zone2 === b) || (zone1 === b && zone2 === a)
  );
};

/**
 * Generate contextual warning based on analysis
 */
export const generateContextualWarning = (
  issueType: CoherenceIssueType
): ContextualWarningType => {
  switch (issueType) {
    case 'too-many-distant-items':
      return 'places-far-apart';
    case 'impractical-single-outing':
      return 'works-better-split';
    case 'different-time-of-day-required':
      return 'works-better-split';
    default:
      return 'places-far-apart';
  }
};

/**
 * Soft coherence analysis result
 */
export interface SoftCoherenceInsight {
  type: ContextualWarningType;
  affectedItemIds: string[];
  suggestion: string;
  isMandatory: false;
  canBeDismissed: true;
}

/**
 * Create a soft coherence insight (always dismissable)
 */
export const createSoftInsight = (
  type: ContextualWarningType,
  affectedItemIds: string[],
  suggestionKey: string
): SoftCoherenceInsight => ({
  type,
  affectedItemIds,
  suggestion: suggestionKey,
  isMandatory: false,
  canBeDismissed: true,
});

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESSIVE AUTHENTICATION (MEU ROTEIRO)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AUTHENTICATION PHILOSOPHY
 * 
 * The product must follow a: "Value first, login later" model.
 * 
 * Users must be allowed to explore, save, and experiment
 * before being asked to authenticate.
 */
export const AUTH_PHILOSOPHY = {
  model: 'value-first-login-later',
  allowExploreBeforeAuth: true,
  allowSaveBeforeAuth: true,
  allowExperimentBeforeAuth: true,
} as const;

/**
 * Roteiro-specific auth trigger types
 */
export type RoteiroAuthTrigger = 
  | 'persist-data-across-sessions'
  | 'access-premium-locked-action'
  | 'access-roteiro-beyond-session';

/**
 * LOGIN TRIGGERS (ALLOWED)
 * 
 * Authentication may be requested ONLY when:
 * 
 * 1) The user attempts to persist data across sessions
 *    (saving draft items permanently)
 * 
 * 2) The user attempts to access a premium-locked action
 *    (e.g. saving Lucky List items)
 * 
 * 3) The user explicitly chooses to access "Meu Roteiro"
 *    beyond the current session
 */
export const ALLOWED_ROTEIRO_AUTH_TRIGGERS: readonly RoteiroAuthTrigger[] = [
  'persist-data-across-sessions',
  'access-premium-locked-action',
  'access-roteiro-beyond-session',
] as const;

export const AUTH_TRIGGERS_ALLOWED = {
  persistDataAcrossSessions: true,
  accessPremiumLockedAction: true,
  accessRoteiroBeyondSession: true,
} as const;

/**
 * LOGIN TRIGGERS (NOT ALLOWED)
 * 
 * - Login must NOT be required at app entry
 * - Login must NOT be required to browse content
 * - Login must NOT be required to add free items to a draft roteiro
 * - Login must NOT interrupt reading or navigation flows
 */
export const AUTH_TRIGGERS_NOT_ALLOWED = {
  requiredAtAppEntry: false,
  requiredToBrowseContent: false,
  requiredToAddFreeItemsToDraft: false,
  interruptsReadingFlows: false,
  interruptsNavigationFlows: false,
} as const;

/**
 * DRAFT MIGRATION RULE
 * 
 * - When a user logs in,
 *   all existing draft items must migrate automatically
 *   to the saved roteiro
 * - No confirmation or re-selection is required
 */
export const DRAFT_MIGRATION_RULES = {
  migratesAutomaticallyOnLogin: true,
  confirmationRequired: false,
  reselectionRequired: false,
  preservesItemOrder: true,
  preservesItemData: true,
} as const;

/**
 * FAIL-SAFE RULE
 * 
 * - If the user declines login,
 *   they must be returned to their previous context
 *   without losing navigation state
 */
export const AUTH_FAILSAFE_RULES = {
  returnToPreviousContextOnDecline: true,
  preservesNavigationState: true,
  noDataLossOnDecline: true,
  draftRemainsIntact: true,
} as const;

/**
 * PROGRESSIVE AUTH SCALABILITY
 * 
 * - This authentication logic applies to all destinations
 * - Future features must respect this progressive model
 */
export const PROGRESSIVE_AUTH_SCALABILITY = {
  appliesToAllDestinations: true,
  futureFeaturesMustRespect: true,
  modelIsConsistent: true,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESSIVE AUTH HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if an action requires authentication
 */
export const requiresAuthForAction = (
  action: RoteiroAuthTrigger,
  isLoggedIn: boolean
): boolean => {
  if (isLoggedIn) return false;
  return ALLOWED_ROTEIRO_AUTH_TRIGGERS.includes(action);
};

/**
 * Check if login should be triggered for a save action
 */
export const shouldTriggerLoginForSave = (
  isPermanentSave: boolean,
  isLuckyListItem: boolean,
  isLoggedIn: boolean
): boolean => {
  if (isLoggedIn) return false;
  if (isPermanentSave) return true;
  if (isLuckyListItem) return true;
  return false;
};

/**
 * Get the auth trigger type for a given action
 */
export const getAuthTriggerType = (
  isPermanentSave: boolean,
  isLuckyListItem: boolean
): RoteiroAuthTrigger | null => {
  if (isLuckyListItem) return 'access-premium-locked-action';
  if (isPermanentSave) return 'persist-data-across-sessions';
  return null;
};

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

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION & CONTEXT INTELLIGENCE HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if two neighborhoods are adjacent
 */
export const areNeighborhoodsAdjacent = (
  neighborhood1: string,
  neighborhood2: string
): boolean => {
  const adjacentTo = RIO_NEIGHBORHOOD_ADJACENCY[neighborhood1.toLowerCase()];
  if (!adjacentTo) return false;
  return adjacentTo.includes(neighborhood2.toLowerCase());
};

/**
 * Calculate approximate distance between two coordinates (Haversine formula)
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate distance between two roteiro items
 */
export const calculateItemDistance = (
  item1: RoteiroItem,
  item2: RoteiroItem
): number => {
  return calculateDistanceKm(
    item1.geo.latitude,
    item1.geo.longitude,
    item2.geo.latitude,
    item2.geo.longitude
  );
};

/**
 * Detect if a coherence condition exists (dormant - returns but doesn't warn)
 */
export const detectCoherenceCondition = (
  items: RoteiroItem[],
  condition: CoherenceCondition
): boolean => {
  switch (condition) {
    case 'items-far-apart-same-day':
      // Check if any two items are more than 10km apart
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          if (calculateItemDistance(items[i], items[j]) > 10) {
            return true;
          }
        }
      }
      return false;
      
    case 'excessive-zone-backtrack':
      return detectNeighborhoodBacktrack(items).length > 1;
      
    case 'high-effort-consecutive':
      for (let i = 0; i < items.length - 1; i++) {
        if (items[i].effortLevel === 'high' && items[i + 1].effortLevel === 'high') {
          return true;
        }
      }
      return false;
      
    case 'outdoor-items-incompatible-weather':
      // Placeholder - requires weather API integration
      return false;
      
    default:
      return false;
  }
};

/**
 * Get all coherence conditions for a roteiro (dormant analysis)
 */
export const analyzeRoteiroCoherence = (
  items: RoteiroItem[]
): Record<CoherenceCondition, boolean> => {
  return {
    'items-far-apart-same-day': detectCoherenceCondition(items, 'items-far-apart-same-day'),
    'excessive-zone-backtrack': detectCoherenceCondition(items, 'excessive-zone-backtrack'),
    'outdoor-items-incompatible-weather': detectCoherenceCondition(items, 'outdoor-items-incompatible-weather'),
    'high-effort-consecutive': detectCoherenceCondition(items, 'high-effort-consecutive'),
  };
};

/**
 * Get total estimated duration for roteiro items
 */
export const getTotalEstimatedDuration = (items: RoteiroItem[]): number => {
  return items.reduce((total, item) => total + (item.typicalDuration || 0), 0);
};

/**
 * Group items by environment type
 */
export const groupByEnvironment = (
  items: RoteiroItem[]
): Record<EnvironmentType, RoteiroItem[]> => {
  return items.reduce((acc, item) => {
    const env = item.environment || 'mixed';
    if (!acc[env]) {
      acc[env] = [];
    }
    acc[env].push(item);
    return acc;
  }, {} as Record<EnvironmentType, RoteiroItem[]>);
};
