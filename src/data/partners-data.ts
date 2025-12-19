/**
 * PARTNERS ON TRIP — DATA REGISTRY
 * 
 * STRUCTURAL LOCK
 * 
 * Partners are human curators who create reference itineraries.
 * Each partner may have itineraries for multiple destinations.
 * 
 * RULES:
 * - Partners are editorial, not algorithmic
 * - Each partner links to their reference itineraries
 * - This structure supports future partners without refactoring
 */

export interface Partner {
  id: string;
  name: string;
  initials: string;
  bio?: string;
  imageUrl?: string;
  destinations: PartnerDestination[];
}

export interface PartnerDestination {
  destinationId: string;
  destinationName: string;
  referenceItineraryId: string;
}

/**
 * Partner Registry
 * 
 * Each partner lists their curated destinations.
 * referenceItineraryId links to reference-itineraries.ts
 */
export const partners: Partner[] = [
  {
    id: "bruno-de-luca",
    name: "Bruno De Luca",
    initials: "BD",
    bio: "Apresentador e viajante",
    destinations: [
      {
        destinationId: "rio-de-janeiro",
        destinationName: "Rio de Janeiro",
        referenceItineraryId: "bruno-de-luca-rio",
      },
    ],
  },
  {
    id: "carolina-dieckmann",
    name: "Carolina Dieckmann",
    initials: "CD",
    bio: "Atriz e exploradora",
    destinations: [],
  },
  {
    id: "celina-locks",
    name: "Celina Locks",
    initials: "CL",
    bio: "Modelo e viajante",
    destinations: [],
  },
  {
    id: "di-ferrero",
    name: "Di Ferrero",
    initials: "DF",
    bio: "Músico e aventureiro",
    destinations: [],
  },
  {
    id: "isabeli-fontana",
    name: "Isabeli Fontana",
    initials: "IF",
    bio: "Top model internacional",
    destinations: [],
  },
];

// Get partner by ID
export const getPartner = (id: string): Partner | null => {
  return partners.find(p => p.id === id) || null;
};

// Get partners for a specific destination
export const getPartnersForDestination = (destinationId: string): Partner[] => {
  return partners.filter(p => 
    p.destinations.some(d => d.destinationId === destinationId)
  );
};

// Get all partners
export const getAllPartners = (): Partner[] => partners;
