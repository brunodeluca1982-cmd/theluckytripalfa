/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔒 PARTNER ON TRIP — STRUCTURAL LOCK (DO NOT MODIFY STRUCTURE)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * DEFINITION
 * A Partner on Trip is a trusted individual who provides curated travel
 * content based on real experience. Partners are authoritative human curators
 * whose content can be explored, referenced, and reused by users.
 * 
 * PARTNER IDENTITY
 * Each Partner has:
 * - Profile identity (name + image)
 * - One or more destination-specific reference itineraries
 * - Personal travel logic and style
 * 
 * PARTNER CONTENT SCOPE
 * Partners MAY provide:
 * - Reference itineraries ("Roteiros de Referência")
 * - Destination-specific selections
 * 
 * Partners DO NOT:
 * - Replace the main destination guide
 * - Override operational content
 * - Act as generic influencers
 * 
 * STRUCTURAL RULES
 * - Partners are editorial, not algorithmic
 * - Each partner links to their reference itineraries
 * - Partners may be added or removed without affecting app logic
 * - This structure applies to all current and future partners
 * 
 * IMMUTABILITY
 * - Interface structure is LOCKED
 * - Field names must NOT be renamed
 * - New optional fields may be added, but existing ones must NOT be removed
 * ═══════════════════════════════════════════════════════════════════════════
 */

import brunoDeLucaImg from "@/assets/partners/bruno-de-luca.jpeg";
import carolinaDieckmannImg from "@/assets/partners/carolina-dieckmann.jpeg";
import carolinaDieckmannHeroImg from "@/assets/partners/carolina-dieckmann-hero.jpeg";
import celinaLocksImg from "@/assets/partners/celina-locks.jpeg";
import diFerreroImg from "@/assets/partners/di-ferrero.jpeg";
import isabeliFontanaImg from "@/assets/partners/isabeli-fontana.jpeg";
import ronaldImg from "@/assets/partners/ronald.jpeg";

export interface Partner {
  id: string;                           // Unique identifier (kebab-case)
  name: string;                         // Display name
  initials: string;                     // Fallback for avatar
  bio?: string;                         // Short description
  imageUrl?: string;                    // Profile image
  heroImageUrl?: string;                // Optional large hero/portrait image
  destinations: PartnerDestination[];   // Curated destinations
}

export interface PartnerDestination {
  destinationId: string;                // Links to destination
  destinationName: string;              // Display name
  referenceItineraryId: string;         // Links to reference-itineraries.ts
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
    imageUrl: brunoDeLucaImg,
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
    imageUrl: carolinaDieckmannImg,
    destinations: [
      {
        destinationId: "rio-de-janeiro",
        destinationName: "Rio de Janeiro",
        referenceItineraryId: "carolina-dieckmann-rio",
      },
    ],
  },
  {
    id: "celina-locks",
    name: "Celina Locks",
    initials: "CL",
    bio: "Modelo e viajante",
    imageUrl: celinaLocksImg,
    destinations: [],
  },
  {
    id: "di-ferrero",
    name: "Di Ferrero",
    initials: "DF",
    bio: "Músico e aventureiro",
    imageUrl: diFerreroImg,
    destinations: [],
  },
  {
    id: "isabeli-fontana",
    name: "Isabeli Fontana",
    initials: "IF",
    bio: "Top model internacional",
    imageUrl: isabeliFontanaImg,
    destinations: [],
  },
  {
    id: "ronald",
    name: "Ronald",
    initials: "RO",
    bio: "Jogador e viajante",
    imageUrl: ronaldImg,
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
