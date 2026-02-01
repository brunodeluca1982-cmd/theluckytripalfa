import DestinationHub, { MapPin, Bed, Utensils, Compass, Sparkles } from "@/components/DestinationHub";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RIO DE JANEIRO — DESTINATION HUB (STRUCTURAL & UX LOCK)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * LOCKED DESTINATION JOURNEY:
 * 1. User clicks destination → Hero video plays (15-30s)
 * 2. Video ends → Automatic transition to THIS hub
 * 3. Hub displays EXACTLY 5 central transparent buttons
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * PRIMARY HUB — 5 BUTTONS (IMMUTABLE):
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. Como Chegar (top-left)
 * 2. Onde Ficar (top-right)
 * 3. Onde Comer (bottom-left)
 * 4. O Que Fazer (bottom-right)
 * 5. Lucky List (CENTER, smaller, emphasized)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * IMMUTABILITY RULES — DO NOT MODIFY:
 * ═══════════════════════════════════════════════════════════════════════════
 * - Labels are FINAL and IMMUTABLE
 * - No synonyms, translations, or optimizations
 * - No A/B variants
 * - Hub NEVER changes based on user behavior
 * - Hub NEVER adapts content
 * - Hub NEVER collapses to fewer buttons
 * - Buttons MUST remain centered on screen
 * - Buttons MUST remain transparent (glass effect)
 * - NO list-based layout allowed
 * - NO additional modules allowed on this screen
 * 
 * This structure applies to ALL destinations.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const RIO_BACKGROUND = "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop";

/**
 * PRIMARY HUB ACTIONS — LOCKED
 * 
 * These 5 buttons are permanent navigation anchors.
 * IDs must match exactly what DestinationHub expects.
 */
const rioActions = [
  { id: "ficar", label: "Onde Ficar", shortLabel: "Ficar", path: "/onde-ficar-rio", icon: Bed },
  { id: "comer", label: "Onde Comer", shortLabel: "Comer", path: "/eat-map-view", icon: Utensils },
  { id: "fazer", label: "O Que Fazer", shortLabel: "Fazer", path: "/o-que-fazer", icon: Compass },
  { id: "lucky-list", label: "Lucky List", shortLabel: "Lucky List", path: "/lucky-list", icon: Sparkles, isSpecial: true },
  { id: "chegar", label: "Como Chegar", shortLabel: "Chegar", path: "/como-chegar", icon: MapPin },
];

const DestinationRio = () => {
  return (
    <DestinationHub
      destinationId="rio-de-janeiro"
      name="Rio de Janeiro"
      country="Brasil"
      backgroundImage={RIO_BACKGROUND}
      actions={rioActions}
    />
  );
};

export default DestinationRio;
