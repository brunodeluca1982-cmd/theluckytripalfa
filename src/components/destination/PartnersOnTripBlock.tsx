/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⛔ DEPRECATED — DO NOT USE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This component has been deprecated per structural lock.
 * 
 * REASON
 * Partners on Trip must appear EXCLUSIVELY on the Home screen.
 * They must NOT be displayed inside destinations, guides, itineraries, or AI.
 * 
 * USE INSTEAD
 * For partner discovery, see: src/components/home/PartnersSection.tsx
 * 
 * This file returns null and will be removed in a future cleanup.
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface PartnersOnTripBlockProps {
  destinationId: string;
}

const PartnersOnTripBlock = ({ destinationId: _destinationId }: PartnersOnTripBlockProps) => {
  // DEPRECATED: Partners only appear on Home screen
  return null;
};

export default PartnersOnTripBlock;
