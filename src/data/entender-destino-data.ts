/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STRUCTURAL LOCK — ENTENDER O DESTINO
 * Editorial Immersion Layer
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE:
 * Long-form editorial immersion layer that provides context,
 * emotional connection, and understanding of the destination.
 * 
 * SEPARATION RULE:
 * This block is SEPARATE from ALL operational modules:
 * - Como Chegar
 * - Onde Ficar
 * - Onde Comer
 * - O Que Fazer
 * - Lucky List
 * - All secondary modules (Mover, Vida Noturna, etc.)
 * 
 * CHARACTERISTICS:
 * - Non-transactional
 * - Long-form friendly
 * - Optimized for immersive reading moments (flight, hotel, pre-trip)
 * - Identical in structure across ALL destinations
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface EditorialSection {
  id: string;
  label: string;
  order: number;
  route: string;
}

export interface DestinationEditorial {
  destinationId: string;
  destinationName: string;
  sections: {
    meuOlhar: EditorialContent;
    historia: EditorialContent;
    hojeEmDia: EditorialContent;
  };
}

export interface EditorialContent {
  title: string;
  content: string;
  // Reserved fields - NO operational content allowed
  // NO CTAs, prices, maps, booking links, or partner links
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INTERNAL STRUCTURE (FIXED AND LOCKED ORDER)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Inside "ENTENDER O DESTINO", enforce exactly three sub-sections,
 * in this EXACT order:
 * 
 * 1) MEU OLHAR
 * 2) HISTÓRIA
 * 3) HOJE EM DIA
 * 
 * RULES FOR SUB-SECTIONS:
 * - Editorial, narrative, and contextual
 * - May contain long-form text
 * - Must NOT contain: CTAs, Prices, Maps, Booking links, Partner links
 * - Do NOT belong to Lucky List
 * - Do NOT belong to the first operational decision layer
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const EDITORIAL_SECTIONS: EditorialSection[] = [
  {
    id: 'meu-olhar',
    label: 'Meu Olhar',
    order: 1,
    route: '/entender/meu-olhar',
  },
  {
    id: 'historia',
    label: 'História',
    order: 2,
    route: '/entender/historia',
  },
  {
    id: 'hoje-em-dia',
    label: 'Hoje em Dia',
    order: 3,
    route: '/entender/hoje-em-dia',
  },
];

/**
 * Get editorial sections in fixed order
 */
export const getEditorialSections = (): EditorialSection[] => {
  return [...EDITORIAL_SECTIONS].sort((a, b) => a.order - b.order);
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION RULES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ACCESS:
 * - Must be optional and intentional
 * - Entry may occur via: secondary button, swipe, reading mode, or modal
 * - Entry must NEVER interrupt the main decision flow
 * 
 * EXIT:
 * - Must always return user to destination context, NEVER to Home
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const EDITORIAL_NAVIGATION = {
  parentRoute: '/', // Returns to destination context (First Destination Screen)
  accessType: 'optional-intentional',
  interruptsDecisionFlow: false,
} as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COGNITIVE RULE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * "Entender o Destino" exists for IMMERSION and UNDERSTANDING.
 * Operational decisions happen elsewhere.
 * 
 * NEVER mix this block with:
 * - Logistics
 * - Neighborhoods
 * - Activities
 * - Booking/transactions
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const EDITORIAL_CONTENT_RULES = {
  allowsLongFormText: true,
  allowsCTAs: false,
  allowsPrices: false,
  allowsMaps: false,
  allowsBookingLinks: false,
  allowsPartnerLinks: false,
  belongsToLuckyList: false,
  belongsToOperationalLayer: false,
} as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCALABILITY RULE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * - This block MUST exist in ALL destinations
 * - Structure is FIXED and MANDATORY
 * - Content may vary, but ORDER and NAMING never change
 * 
 * SEPARATION:
 * DECISION (operational layers) vs IMMERSION (editorial layer)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Rio de Janeiro editorial content placeholder
 * Content to be populated - structure is locked
 */
export const RIO_EDITORIAL: DestinationEditorial = {
  destinationId: 'rio-de-janeiro',
  destinationName: 'Rio de Janeiro',
  sections: {
    meuOlhar: {
      title: 'Meu Olhar',
      content: '', // Editorial content to be added
    },
    historia: {
      title: 'História',
      content: '', // Editorial content to be added
    },
    hojeEmDia: {
      title: 'Hoje em Dia',
      content: '', // Editorial content to be added
    },
  },
};
