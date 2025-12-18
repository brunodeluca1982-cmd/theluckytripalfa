/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EDITORIAL VOICE AND READING RHYTHM LOCK
 * The Lucky Trip Brand Bible — Operational Rules
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file translates the brand bible into operational editorial rules.
 * All editorial content must follow these constraints.
 * 
 * TEAM ENFORCEMENT RULE:
 * - Contributors may write freely inside blocks
 * - Contributors may NOT change tone rules
 * - Any content that violates this lock must be flagged internally
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// EDITORIAL VOICE RULES (GLOBAL)
// ─────────────────────────────────────────────────────────────────────────────

export const VOICE_RULES = {
  /**
   * Narrative perspective
   */
  perspective: 'first-person', // "eu" when applicable
  
  /**
   * Core voice characteristics
   */
  characteristics: [
    'calm',
    'confident',
    'experienced',
    'human',
    'adult',
    'clear',
  ],
  
  /**
   * What the voice is NOT
   */
  antiPatterns: [
    'promotional',
    'sensationalist',
    'exaggerated',
    'clickbait',
    'tourist-cliché',
    'impersonal',
  ],
  
  /**
   * Authority source
   */
  authoritySource: 'lived-experience', // Not exaggeration
  
  /**
   * Forbidden elements
   */
  forbidden: [
    'emojis',
    'slang',
    'clickbait-headlines',
    'tourism-clichés',
    'promotional-language',
    'sensationalist-claims',
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TEXT DENSITY RULES
// ─────────────────────────────────────────────────────────────────────────────

export const DENSITY_RULES = {
  /**
   * Mobile reading comfort
   */
  preferredParagraphLength: '1-3 lines',
  
  /**
   * Content structure
   */
  breakLongExplanations: true,
  avoidDenseTextWalls: true,
  
  /**
   * Long-form exception
   */
  longFormAllowedIn: ['entender-o-destino'],
  
  /**
   * Operational modules must be scannable
   */
  operationalModulesScannability: 'required',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// MODULE-SPECIFIC RULES
// ─────────────────────────────────────────────────────────────────────────────

export type ModuleType = 'operational' | 'lucky-list' | 'editorial';

export interface ModuleVoiceRules {
  type: ModuleType;
  tone: string[];
  allows: string[];
  forbids: string[];
  focus: string;
}

/**
 * 1) OPERATIONAL MODULES
 * (Como chegar, Onde ficar, Onde comer, O que fazer, Mover, etc.)
 */
export const OPERATIONAL_VOICE: ModuleVoiceRules = {
  type: 'operational',
  tone: [
    'practical',
    'objective',
    'scannable',
    'confident',
    'clear',
  ],
  allows: [
    'bullet-points',
    'short-paragraphs',
    'direct-statements',
    'practical-advice',
  ],
  forbids: [
    'historical-digressions',
    'emotional-digressions',
    'metaphors',
    'poetic-language',
    'long-form-narrative',
  ],
  focus: 'decisions, clarity, and confidence',
};

/**
 * 2) LUCKY LIST
 */
export const LUCKY_LIST_VOICE: ModuleVoiceRules = {
  type: 'lucky-list',
  tone: [
    'insider',
    'discreet',
    'precise',
    'intimate',
    'trusting',
  ],
  allows: [
    'assumed-knowledge',
    'subtle-recommendations',
    'personal-insights',
    'exclusive-details',
  ],
  forbids: [
    'explaining-the-obvious',
    'self-justification',
    'promotional-tone',
    'generic-descriptions',
  ],
  focus: 'advice from someone who knows',
};

/**
 * 3) ENTENDER O DESTINO (Editorial Immersion Layer)
 */
export const EDITORIAL_VOICE: ModuleVoiceRules = {
  type: 'editorial',
  tone: [
    'emotional',
    'contextual',
    'reflective',
    'narrative',
    'personal',
  ],
  allows: [
    'long-form-narrative',
    'storytelling',
    'memory',
    'culture',
    'history',
    'personal-perspective',
  ],
  forbids: [
    'prices',
    'maps',
    'CTAs',
    'logistics',
    'booking-links',
    'partner-links',
  ],
  focus: 'immersive reading moments (plane, hotel, pre-trip)',
};

// ─────────────────────────────────────────────────────────────────────────────
// MODULE CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

export const MODULE_VOICE_MAP: Record<string, ModuleVoiceRules> = {
  // Primary Decision Layer - Operational
  'como-chegar': OPERATIONAL_VOICE,
  'onde-ficar': OPERATIONAL_VOICE,
  'onde-comer': OPERATIONAL_VOICE,
  'o-que-fazer': OPERATIONAL_VOICE,
  
  // Lucky List - Premium
  'lucky-list': LUCKY_LIST_VOICE,
  
  // Secondary Modules - Operational
  'mover': OPERATIONAL_VOICE,
  'vida-noturna': OPERATIONAL_VOICE,
  'sabores-locais': OPERATIONAL_VOICE,
  'dinheiro': OPERATIONAL_VOICE,
  'documentos-visto': OPERATIONAL_VOICE,
  'melhor-epoca': OPERATIONAL_VOICE,
  'o-que-levar': OPERATIONAL_VOICE,
  'gastos-viagem': OPERATIONAL_VOICE,
  'links-uteis': OPERATIONAL_VOICE,
  'checklist-final': OPERATIONAL_VOICE,
  
  // Editorial Immersion Layer
  'meu-olhar': EDITORIAL_VOICE,
  'historia': EDITORIAL_VOICE,
  'hoje-em-dia': EDITORIAL_VOICE,
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSISTENCY RULES
// ─────────────────────────────────────────────────────────────────────────────

export const CONSISTENCY_RULES = {
  /**
   * Same destination maintains same tone across all modules
   */
  intraDestinationConsistency: true,
  
  /**
   * Different destinations feel authored by the same voice
   */
  crossDestinationConsistency: true,
  
  /**
   * Editorial personality never shifts by section or contributor
   */
  voiceStability: 'absolute',
  
  /**
   * The app reads like a single author, even with a team
   */
  singleAuthorFeel: true,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export interface VoiceValidation {
  isValid: boolean;
  violations: string[];
  warnings: string[];
}

/**
 * Get voice rules for a specific module
 */
export const getVoiceRulesForModule = (moduleId: string): ModuleVoiceRules => {
  return MODULE_VOICE_MAP[moduleId] || OPERATIONAL_VOICE;
};

/**
 * Check if content contains forbidden elements
 */
export const containsForbiddenElements = (content: string): string[] => {
  const violations: string[] = [];
  
  // Check for emojis
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  if (emojiRegex.test(content)) {
    violations.push('Contains emojis');
  }
  
  // Check for excessive exclamation marks (clickbait indicator)
  if ((content.match(/!/g) || []).length > 2) {
    violations.push('Excessive exclamation marks (potential clickbait)');
  }
  
  // Check for ALL CAPS words (sensationalist indicator)
  const capsWords = content.match(/\b[A-Z]{4,}\b/g) || [];
  const allowedCaps = ['COMO', 'ONDE', 'QUE', 'LUCKY', 'LIST', 'RIO', 'JANEIRO'];
  const suspiciousCaps = capsWords.filter(w => !allowedCaps.includes(w));
  if (suspiciousCaps.length > 0) {
    violations.push(`Suspicious ALL CAPS: ${suspiciousCaps.join(', ')}`);
  }
  
  return violations;
};

/**
 * Validate content against module voice rules
 */
export const validateVoice = (
  content: string,
  moduleId: string
): VoiceValidation => {
  const violations: string[] = [];
  const warnings: string[] = [];
  
  // Check forbidden elements
  violations.push(...containsForbiddenElements(content));
  
  const rules = getVoiceRulesForModule(moduleId);
  
  // Check for forbidden patterns based on module type
  if (rules.type === 'operational') {
    // Check for long paragraphs in operational content
    const paragraphs = content.split(/\n\n+/);
    paragraphs.forEach((p, i) => {
      if (p.length > 500) {
        warnings.push(`Paragraph ${i + 1} may be too long for operational content`);
      }
    });
  }
  
  if (rules.type === 'editorial') {
    // Check for operational content in editorial sections
    const operationalPatterns = [/R\$\s*\d+/, /\d+h às \d+h/, /google\.com\/maps/i];
    operationalPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        violations.push('Editorial content contains operational elements (prices, hours, or maps)');
      }
    });
  }
  
  return {
    isValid: violations.length === 0,
    violations,
    warnings,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SCALABILITY RULE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SCALABILITY RULE:
 * - These editorial rules apply GLOBALLY
 * - New destinations inherit this lock automatically
 * - Brand voice must scale without manual correction
 * 
 * OUTCOME:
 * - The app reads like a single author, even with a team
 * - Content feels premium, calm, and trustworthy
 * - Long-form and decision-making content never conflict
 */
