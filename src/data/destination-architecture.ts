/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLOBAL DESTINATION ARCHITECTURE LOCK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file defines the MANDATORY structure for ALL destinations.
 * Every destination must follow this cognitive, editorial, and operational
 * architecture to prevent structural drift.
 * 
 * TEAM SAFETY RULE:
 * - Editors may add or update CONTENT inside sections
 * - Editors may NOT alter structure, order, or naming
 * - Structural changes require a new explicit architecture prompt
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DESTINATION CORE STRUCTURE (LOCKED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Every destination must contain, in this EXACT order:
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ PRIMARY DECISION LAYER (First Screen)                                   │
 * │   1) COMO CHEGAR                                                        │
 * │   2) ONDE FICAR                                                         │
 * │   3) ONDE COMER                                                         │
 * │   4) O QUE FAZER                                                        │
 * │   5) LUCKY LIST (highlighted, premium element)                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ SECONDARY OPERATIONAL MODULES (Paginated / Swipe Flow)                  │
 * │   6) MOVER (Como se locomover)                                          │
 * │   7) VIDA NOTURNA                                                       │
 * │   8) SABORES LOCAIS                                                     │
 * │   9) DINHEIRO                                                           │
 * │   10) DOCUMENTOS & VISTO                                                │
 * │   11) MELHOR ÉPOCA                                                      │
 * │   12) O QUE LEVAR                                                       │
 * │   13) GASTOS DA VIAGEM                                                  │
 * │   14) LINKS ÚTEIS                                                       │
 * │   15) CHECKLIST FINAL                                                   │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ EDITORIAL IMMERSION LAYER (Separate Block)                              │
 * │   16) ENTENDER O DESTINO                                                │
 * │       - MEU OLHAR                                                       │
 * │       - HISTÓRIA                                                        │
 * │       - HOJE EM DIA                                                     │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface PrimaryModule {
  id: string;
  label: string;
  order: number;
  type: 'primary' | 'premium';
}

export interface SecondaryModule {
  id: string;
  label: string;
  order: number;
  screen: 'A' | 'B' | 'C';
}

export interface EditorialSection {
  id: string;
  label: string;
  order: number;
}

export interface DestinationArchitecture {
  id: string;
  name: string;
  primaryModules: PrimaryModule[];
  secondaryModules: SecondaryModule[];
  editorialSections: EditorialSection[];
}

export interface ValidationResult {
  isValid: boolean;
  missingBlocks: string[];
  errors: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMARY DECISION LAYER (LOCKED)
// ─────────────────────────────────────────────────────────────────────────────

export const PRIMARY_MODULES: PrimaryModule[] = [
  { id: 'como-chegar', label: 'Como Chegar', order: 1, type: 'primary' },
  { id: 'onde-ficar', label: 'Onde Ficar', order: 2, type: 'primary' },
  { id: 'onde-comer', label: 'Onde Comer', order: 3, type: 'primary' },
  { id: 'o-que-fazer', label: 'O Que Fazer', order: 4, type: 'primary' },
  { id: 'lucky-list', label: 'Lucky List', order: 5, type: 'premium' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECONDARY OPERATIONAL MODULES (LOCKED)
// ─────────────────────────────────────────────────────────────────────────────

export const SECONDARY_MODULES: SecondaryModule[] = [
  // Screen A
  { id: 'mover', label: 'Mover', order: 6, screen: 'A' },
  { id: 'vida-noturna', label: 'Vida Noturna', order: 7, screen: 'A' },
  { id: 'sabores-locais', label: 'Sabores Locais', order: 8, screen: 'A' },
  { id: 'dinheiro', label: 'Dinheiro', order: 9, screen: 'A' },
  // Screen B
  { id: 'documentos-visto', label: 'Documentos & Visto', order: 10, screen: 'B' },
  { id: 'melhor-epoca', label: 'Melhor Época', order: 11, screen: 'B' },
  { id: 'o-que-levar', label: 'O Que Levar', order: 12, screen: 'B' },
  { id: 'gastos-viagem', label: 'Gastos da Viagem', order: 13, screen: 'B' },
  // Screen C
  { id: 'links-uteis', label: 'Links Úteis', order: 14, screen: 'C' },
  { id: 'checklist-final', label: 'Checklist Final', order: 15, screen: 'C' },
];

// ─────────────────────────────────────────────────────────────────────────────
// EDITORIAL IMMERSION LAYER (LOCKED)
// ─────────────────────────────────────────────────────────────────────────────

export const EDITORIAL_SECTIONS: EditorialSection[] = [
  { id: 'meu-olhar', label: 'Meu Olhar', order: 1 },
  { id: 'historia', label: 'História', order: 2 },
  { id: 'hoje-em-dia', label: 'Hoje em Dia', order: 3 },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURAL RULES (ENFORCED)
// ─────────────────────────────────────────────────────────────────────────────

export const ARCHITECTURE_RULES = {
  /**
   * No destination may add, remove, rename, or reorder these blocks
   */
  structureLocked: true,
  
  /**
   * Editorial layers must never mix with operational modules
   */
  editorialSeparation: true,
  
  /**
   * Lucky List is premium, distinct, and never grouped with other modules
   */
  luckyListIsPremium: true,
  luckyListIsDistinct: true,
  
  /**
   * "Entender o Destino" is non-transactional and optional to enter
   */
  editorialIsOptional: true,
  editorialIsNonTransactional: true,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * VALIDATION RULE:
 * When a new destination is created, verify the presence of all locked blocks.
 * Missing blocks must be flagged internally.
 * The destination cannot be considered complete without this structure.
 */
export const validateDestinationArchitecture = (
  destination: Partial<DestinationArchitecture>
): ValidationResult => {
  const errors: string[] = [];
  const missingBlocks: string[] = [];

  // Validate primary modules
  const requiredPrimaryIds = PRIMARY_MODULES.map(m => m.id);
  const providedPrimaryIds = destination.primaryModules?.map(m => m.id) || [];
  
  requiredPrimaryIds.forEach(id => {
    if (!providedPrimaryIds.includes(id)) {
      missingBlocks.push(`Primary: ${id}`);
    }
  });

  // Validate secondary modules
  const requiredSecondaryIds = SECONDARY_MODULES.map(m => m.id);
  const providedSecondaryIds = destination.secondaryModules?.map(m => m.id) || [];
  
  requiredSecondaryIds.forEach(id => {
    if (!providedSecondaryIds.includes(id)) {
      missingBlocks.push(`Secondary: ${id}`);
    }
  });

  // Validate editorial sections
  const requiredEditorialIds = EDITORIAL_SECTIONS.map(s => s.id);
  const providedEditorialIds = destination.editorialSections?.map(s => s.id) || [];
  
  requiredEditorialIds.forEach(id => {
    if (!providedEditorialIds.includes(id)) {
      missingBlocks.push(`Editorial: ${id}`);
    }
  });

  // Check order integrity
  if (destination.primaryModules) {
    const isOrderValid = destination.primaryModules.every((m, i) => 
      m.id === PRIMARY_MODULES[i]?.id
    );
    if (!isOrderValid) {
      errors.push('Primary modules are not in correct order');
    }
  }

  return {
    isValid: missingBlocks.length === 0 && errors.length === 0,
    missingBlocks,
    errors,
  };
};

/**
 * Check if a destination is complete
 */
export const isDestinationComplete = (
  destination: Partial<DestinationArchitecture>
): boolean => {
  return validateDestinationArchitecture(destination).isValid;
};

/**
 * Get all required block IDs for a complete destination
 */
export const getRequiredBlockIds = (): string[] => {
  return [
    ...PRIMARY_MODULES.map(m => m.id),
    ...SECONDARY_MODULES.map(m => m.id),
    ...EDITORIAL_SECTIONS.map(s => `entender-${s.id}`),
  ];
};

// ─────────────────────────────────────────────────────────────────────────────
// SCALABILITY RULE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * This architecture applies IDENTICALLY to all destinations.
 * Future features must plug into existing layers,
 * not create parallel structures.
 * 
 * All destinations share the same cognitive map.
 * UX remains predictable, calm, and premium.
 * The product scales without architectural erosion.
 */
export const createDestinationArchitecture = (
  id: string,
  name: string
): DestinationArchitecture => {
  return {
    id,
    name,
    primaryModules: [...PRIMARY_MODULES],
    secondaryModules: [...SECONDARY_MODULES],
    editorialSections: [...EDITORIAL_SECTIONS],
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// RIO DE JANEIRO IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

export const RIO_DE_JANEIRO = createDestinationArchitecture(
  'rio-de-janeiro',
  'Rio de Janeiro'
);
