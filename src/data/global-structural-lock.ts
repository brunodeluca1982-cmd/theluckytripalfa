/**
 * GLOBAL STRUCTURAL LOCK v1.0
 * 
 * This file defines the frozen architecture of the application.
 * All elements listed here are FINAL and MUST NOT be altered
 * without explicit user request.
 * 
 * Created: 2025-01-19
 * Status: LOCKED
 */

// ============================================================
// 1. DESTINATION HUB - FIRST SCREEN
// ============================================================

export const DESTINATION_HUB_LOCK = {
  layout: 'centered-buttons',
  allowedLayouts: ['centered-buttons'] as const,
  forbiddenLayouts: ['list', 'grid', 'vertical-stack'] as const,
  
  primaryButtons: [
    { id: 'como-chegar', label: 'Como Chegar', order: 1, position: 'top' },
    { id: 'onde-ficar', label: 'Onde Ficar', order: 2, position: 'left' },
    { id: 'lucky-list', label: 'Lucky List', order: 3, position: 'center', emphasis: true },
    { id: 'onde-comer', label: 'Onde Comer', order: 4, position: 'right' },
    { id: 'o-que-fazer', label: 'O Que Fazer', order: 5, position: 'bottom' },
  ] as const,
  
  buttonCount: 5,
  centerEmphasis: 'lucky-list',
  swipeNavigation: true,
  backgroundStyle: 'transparent-buttons',
} as const;

// ============================================================
// 2. SWIPE-BASED SECONDARY MODULES
// ============================================================

export const SECONDARY_MODULES_LOCK = {
  orderFixed: true,
  visualStyle: 'match-first-screen',
  backgroundStyle: 'transparent-buttons',
  alternativeLayoutsAllowed: false,
  
  modules: [
    { id: 'mover', label: 'Mover', screen: 'A', order: 1 },
    { id: 'vida-noturna', label: 'Vida Noturna', screen: 'A', order: 2 },
    { id: 'compras', label: 'Compras', screen: 'B', order: 3 },
    { id: 'natureza', label: 'Natureza', screen: 'B', order: 4 },
    { id: 'praias', label: 'Praias', screen: 'C', order: 5 },
    { id: 'passeios', label: 'Passeios', screen: 'C', order: 6 },
  ] as const,
} as const;

// ============================================================
// 3. LUCKY LIST
// ============================================================

export const LUCKY_LIST_LOCK = {
  accessLevel: 'premium-only',
  visualDifferentiation: true,
  canMergeWithFreeContent: false,
  
  rules: {
    alwaysPremium: true,
    visuallyDistinct: true,
    separateFromFreeContent: true,
  },
} as const;

// ============================================================
// 4. ENTENDER O DESTINO
// ============================================================

export const ENTENDER_DESTINO_LOCK = {
  type: 'editorial-block',
  mixWithOperationalModules: false,
  
  sections: [
    { id: 'meu-olhar', label: 'Meu Olhar', order: 1 },
    { id: 'historia', label: 'História', order: 2 },
    { id: 'hoje-em-dia', label: 'Hoje em Dia', order: 3 },
  ] as const,
  
  sectionCount: 3,
  contentType: 'editorial-only',
} as const;

// ============================================================
// 5. MEU ROTEIRO
// ============================================================

export const MEU_ROTEIRO_LOCK = {
  type: 'persistent-user-container',
  
  accessModes: {
    draft: { requiresLogin: false },
    saved: { requiresLogin: true },
    premium: { requiresLogin: true, requiresSubscription: true },
  },
  
  itemMetadata: {
    retainSource: true,
    retainNeighborhood: true,
    retainPremiumStatus: true,
  },
  
  timelineLogic: false,
  calendarLogic: false,
} as const;

// ============================================================
// 6. AI BEHAVIOR
// ============================================================

export const AI_BEHAVIOR_LOCK = {
  recommendationSource: 'curated-database-only',
  userPlacesUsage: ['distance-check', 'time-check', 'consistency-check'] as const,
  
  fallbackResponse: {
    enabled: true,
    message: "Ih! Essa aí eu não sei te responder… quer falar com o Bruno? Chama ele no WhatsApp! 21998102132",
  },
  
  rules: {
    recommendOnlyFromCurated: true,
    noInventedContent: true,
    noExternalSources: true,
  },
} as const;

// ============================================================
// 7. NAVIGATION
// ============================================================

export const NAVIGATION_LOCK = {
  contextPersistence: 'destination',
  forcedRedirects: false,
  unexpectedHomeReturns: false,
  
  rules: {
    stayInsideDestination: true,
    noForcedRedirects: true,
    noUnexpectedReturns: true,
  },
} as const;

// ============================================================
// GLOBAL LOCK MANIFEST
// ============================================================

export const GLOBAL_STRUCTURAL_LOCK = {
  version: '1.0',
  createdAt: '2025-01-19',
  status: 'LOCKED' as const,
  
  locks: {
    destinationHub: DESTINATION_HUB_LOCK,
    secondaryModules: SECONDARY_MODULES_LOCK,
    luckyList: LUCKY_LIST_LOCK,
    entenderDestino: ENTENDER_DESTINO_LOCK,
    meuRoteiro: MEU_ROTEIRO_LOCK,
    aiBehavior: AI_BEHAVIOR_LOCK,
    navigation: NAVIGATION_LOCK,
  },
  
  globalRules: {
    noModifyScreens: true,
    noModifyButtons: true,
    noModifyLabels: true,
    noModifyOrder: true,
    noModifyLayout: true,
    noRenameModules: true,
    noReinterpretModules: true,
    noAutoOptimize: true,
    noAutoRestructure: true,
    noInferMissingElements: true,
    noIntroduceNewLogic: true,
    noIntroduceNewScreens: true,
    noIntroduceNewFlows: true,
    preserveCurrentBehavior: true,
  },
} as const;

// Type exports for enforcement
export type DestinationHubLock = typeof DESTINATION_HUB_LOCK;
export type SecondaryModulesLock = typeof SECONDARY_MODULES_LOCK;
export type LuckyListLock = typeof LUCKY_LIST_LOCK;
export type EntenderDestinoLock = typeof ENTENDER_DESTINO_LOCK;
export type MeuRoteiroLock = typeof MEU_ROTEIRO_LOCK;
export type AIBehaviorLock = typeof AI_BEHAVIOR_LOCK;
export type NavigationLock = typeof NAVIGATION_LOCK;
export type GlobalStructuralLock = typeof GLOBAL_STRUCTURAL_LOCK;
