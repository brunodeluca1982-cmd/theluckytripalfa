/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DESTINATION CREATION AND VALIDATION LOCK
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file governs how new destinations are created, filled, and approved.
 * Every destination must follow the exact same structure, logic, and
 * cognitive order defined for the product.
 * 
 * TEAM SAFETY RULE:
 * - Editors can write and update TEXT
 * - Editors CANNOT alter structure
 * - Structural changes require a new architecture prompt
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  PRIMARY_MODULES,
  SECONDARY_MODULES,
  EDITORIAL_SECTIONS,
  type PrimaryModule,
  type SecondaryModule,
  type EditorialSection,
} from './destination-architecture';

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type DestinationStatus = 
  | 'DRAFT'           // Structure created, content incomplete
  | 'READY_FOR_REVIEW' // All blocks present, content filled
  | 'APPROVED'        // Reviewed and validated against structure rules
  | 'PUBLISHED';      // Visible to users

export interface BlockContent {
  id: string;
  content: string;
  isEmpty: boolean;
  lastUpdated?: Date;
  updatedBy?: string;
}

export interface LuckyListConfig {
  teaserEntries: string[];  // Visible to non-subscribers
  premiumEntries: string[]; // Gated content
  isGated: boolean;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  status: DestinationStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Primary Decision Layer
  primaryBlocks: Map<string, BlockContent>;
  
  // Secondary Operational Modules
  secondaryBlocks: Map<string, BlockContent>;
  
  // Editorial Immersion Layer
  editorialBlocks: Map<string, BlockContent>;
  
  // Lucky List Configuration
  luckyList: LuckyListConfig;
  
  // Validation state
  validationErrors: string[];
  isStructureComplete: boolean;
  isContentComplete: boolean;
}

export interface ValidationReport {
  isValid: boolean;
  canPublish: boolean;
  missingBlocks: string[];
  emptyBlocks: string[];
  structuralErrors: string[];
  warnings: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATION TEMPLATE (MANDATORY)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CREATION RULES:
 * - All blocks must be created, even if content is temporarily empty
 * - Empty blocks must remain visible internally for completion tracking
 * - No block may be skipped, merged, or renamed
 * - No destination may be published without this full structure
 */
export const createDestination = (
  id: string,
  name: string,
  slug: string
): Destination => {
  const now = new Date();
  
  // Initialize primary blocks (1-5)
  const primaryBlocks = new Map<string, BlockContent>();
  PRIMARY_MODULES.forEach(module => {
    primaryBlocks.set(module.id, {
      id: module.id,
      content: '',
      isEmpty: true,
      lastUpdated: now,
    });
  });
  
  // Initialize secondary blocks (6-15)
  const secondaryBlocks = new Map<string, BlockContent>();
  SECONDARY_MODULES.forEach(module => {
    secondaryBlocks.set(module.id, {
      id: module.id,
      content: '',
      isEmpty: true,
      lastUpdated: now,
    });
  });
  
  // Initialize editorial blocks (16: Entender o Destino)
  const editorialBlocks = new Map<string, BlockContent>();
  EDITORIAL_SECTIONS.forEach(section => {
    editorialBlocks.set(section.id, {
      id: section.id,
      content: '',
      isEmpty: true,
      lastUpdated: now,
    });
  });
  
  return {
    id,
    name,
    slug,
    status: 'DRAFT',
    createdAt: now,
    updatedAt: now,
    primaryBlocks,
    secondaryBlocks,
    editorialBlocks,
    luckyList: {
      teaserEntries: [],
      premiumEntries: [],
      isGated: true, // Always gated by default
    },
    validationErrors: [],
    isStructureComplete: true, // Structure is always complete on creation
    isContentComplete: false,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT INSERTION RULES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CONTENT INSERTION RULES:
 * - Content may only be inserted inside existing blocks
 * - Editors may not create new sections or sub-sections
 * - Long-form text belongs only to "ENTENDER O DESTINO"
 * - Operational text belongs only to its respective module
 */
export const updateBlockContent = (
  destination: Destination,
  blockId: string,
  content: string,
  updatedBy?: string
): Destination => {
  const now = new Date();
  const blockContent: BlockContent = {
    id: blockId,
    content,
    isEmpty: content.trim().length === 0,
    lastUpdated: now,
    updatedBy,
  };
  
  // Check which layer the block belongs to
  if (destination.primaryBlocks.has(blockId)) {
    destination.primaryBlocks.set(blockId, blockContent);
  } else if (destination.secondaryBlocks.has(blockId)) {
    destination.secondaryBlocks.set(blockId, blockContent);
  } else if (destination.editorialBlocks.has(blockId)) {
    destination.editorialBlocks.set(blockId, blockContent);
  } else {
    // Block doesn't exist - cannot create new blocks
    throw new Error(`Block "${blockId}" does not exist. Editors cannot create new sections.`);
  }
  
  destination.updatedAt = now;
  destination.isContentComplete = checkContentComplete(destination);
  
  return destination;
};

// ─────────────────────────────────────────────────────────────────────────────
// LUCKY LIST RULES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * LUCKY LIST RULES:
 * - Lucky List is always premium
 * - Lucky List may contain teaser entries visible to non-subscribers
 * - Full Lucky List content must remain gated
 * - Lucky List content never appears in other modules
 */
export const updateLuckyList = (
  destination: Destination,
  config: Partial<LuckyListConfig>
): Destination => {
  destination.luckyList = {
    ...destination.luckyList,
    ...config,
    isGated: true, // Always enforce gating
  };
  destination.updatedAt = new Date();
  return destination;
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION & STATUS LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if all content is filled
 */
const checkContentComplete = (destination: Destination): boolean => {
  const allBlocks = [
    ...Array.from(destination.primaryBlocks.values()),
    ...Array.from(destination.secondaryBlocks.values()),
    ...Array.from(destination.editorialBlocks.values()),
  ];
  
  return allBlocks.every(block => !block.isEmpty);
};

/**
 * Validate destination against all rules
 */
export const validateDestination = (destination: Destination): ValidationReport => {
  const missingBlocks: string[] = [];
  const emptyBlocks: string[] = [];
  const structuralErrors: string[] = [];
  const warnings: string[] = [];
  
  // Check primary blocks
  PRIMARY_MODULES.forEach(module => {
    if (!destination.primaryBlocks.has(module.id)) {
      missingBlocks.push(`Primary: ${module.label}`);
    } else if (destination.primaryBlocks.get(module.id)?.isEmpty) {
      emptyBlocks.push(`Primary: ${module.label}`);
    }
  });
  
  // Check secondary blocks
  SECONDARY_MODULES.forEach(module => {
    if (!destination.secondaryBlocks.has(module.id)) {
      missingBlocks.push(`Secondary: ${module.label}`);
    } else if (destination.secondaryBlocks.get(module.id)?.isEmpty) {
      emptyBlocks.push(`Secondary: ${module.label}`);
    }
  });
  
  // Check editorial blocks
  EDITORIAL_SECTIONS.forEach(section => {
    if (!destination.editorialBlocks.has(section.id)) {
      missingBlocks.push(`Editorial: ${section.label}`);
    } else if (destination.editorialBlocks.get(section.id)?.isEmpty) {
      // Editorial can be empty but should warn
      warnings.push(`Editorial section "${section.label}" is empty`);
    }
  });
  
  // Check Lucky List positioning
  if (!destination.primaryBlocks.has('lucky-list')) {
    structuralErrors.push('Lucky List is missing from primary layer');
  }
  
  if (!destination.luckyList.isGated) {
    structuralErrors.push('Lucky List must remain gated');
  }
  
  // Check structural order integrity
  const primaryOrder = Array.from(destination.primaryBlocks.keys());
  const expectedOrder = PRIMARY_MODULES.map(m => m.id);
  if (JSON.stringify(primaryOrder) !== JSON.stringify(expectedOrder)) {
    structuralErrors.push('Primary modules are not in correct order');
  }
  
  const isValid = missingBlocks.length === 0 && structuralErrors.length === 0;
  const canPublish = isValid && emptyBlocks.length === 0;
  
  return {
    isValid,
    canPublish,
    missingBlocks,
    emptyBlocks,
    structuralErrors,
    warnings,
  };
};

/**
 * VALIDATION & STATUS LOGIC:
 * 
 * - DRAFT: structure created, content incomplete
 * - READY_FOR_REVIEW: all blocks present, content filled
 * - APPROVED: reviewed and validated against structure rules
 * - PUBLISHED: visible to users
 * 
 * A destination may only move to PUBLISHED if:
 * - All mandatory blocks exist
 * - Structural order is intact
 * - Lucky List is correctly positioned
 * - Editorial block exists (even if accessed optionally)
 */
export const updateDestinationStatus = (
  destination: Destination,
  newStatus: DestinationStatus
): Destination => {
  const validation = validateDestination(destination);
  
  switch (newStatus) {
    case 'DRAFT':
      // Can always go back to draft
      break;
      
    case 'READY_FOR_REVIEW':
      if (!validation.isValid) {
        throw new Error(
          `Cannot mark as Ready for Review. Issues: ${validation.structuralErrors.join(', ')}`
        );
      }
      break;
      
    case 'APPROVED':
      if (!validation.isValid) {
        throw new Error(
          `Cannot approve. Structural errors: ${validation.structuralErrors.join(', ')}`
        );
      }
      break;
      
    case 'PUBLISHED':
      if (!validation.canPublish) {
        const issues = [
          ...validation.missingBlocks,
          ...validation.emptyBlocks,
          ...validation.structuralErrors,
        ];
        throw new Error(`Cannot publish. Issues: ${issues.join(', ')}`);
      }
      break;
  }
  
  destination.status = newStatus;
  destination.updatedAt = new Date();
  destination.validationErrors = [
    ...validation.missingBlocks,
    ...validation.structuralErrors,
  ];
  
  return destination;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get completion percentage for a destination
 */
export const getCompletionPercentage = (destination: Destination): number => {
  const allBlocks = [
    ...Array.from(destination.primaryBlocks.values()),
    ...Array.from(destination.secondaryBlocks.values()),
    ...Array.from(destination.editorialBlocks.values()),
  ];
  
  const filledBlocks = allBlocks.filter(block => !block.isEmpty).length;
  return Math.round((filledBlocks / allBlocks.length) * 100);
};

/**
 * Get list of empty blocks for completion tracking
 */
export const getEmptyBlocks = (destination: Destination): string[] => {
  const emptyBlocks: string[] = [];
  
  destination.primaryBlocks.forEach((block, id) => {
    if (block.isEmpty) emptyBlocks.push(id);
  });
  
  destination.secondaryBlocks.forEach((block, id) => {
    if (block.isEmpty) emptyBlocks.push(id);
  });
  
  destination.editorialBlocks.forEach((block, id) => {
    if (block.isEmpty) emptyBlocks.push(id);
  });
  
  return emptyBlocks;
};

/**
 * Check if destination can be published
 */
export const canPublish = (destination: Destination): boolean => {
  return validateDestination(destination).canPublish;
};

// ─────────────────────────────────────────────────────────────────────────────
// SCALABILITY RULE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SCALABILITY RULE:
 * - This creation template applies to all future destinations
 * - No destination may define its own structure
 * - Product evolution must extend this system, not bypass it
 * 
 * OUTCOME:
 * - Creating a new destination becomes a controlled process
 * - Quality stays high even with multiple contributors
 * - The app scales without cognitive or structural drift
 */
