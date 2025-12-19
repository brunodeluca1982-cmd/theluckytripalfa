import DestinationHub, { MapPin, Bed, Utensils, Compass, Sparkles } from "@/components/DestinationHub";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RIO DE JANEIRO — DESTINATION HUB
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🔒 HUB STRUCTURE — FINAL LOCK (DO NOT MODIFY)
 * 
 * This hub contains exactly 5 circular buttons (IMMUTABLE):
 * 1. Chegar
 * 2. Ficar
 * 3. Comer
 * 4. Fazer
 * 5. Lucky List (center)
 * 
 * RULES:
 * - Labels are final and immutable
 * - No synonyms, translations, or optimizations
 * - No A/B variants
 * - Hub never changes based on user behavior
 * - Hub never adapts content
 * - Hub never collapses to fewer buttons
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
  { id: "chegar", label: "Como Chegar", shortLabel: "Chegar", path: "/como-chegar", icon: MapPin },
  { id: "ficar", label: "Onde Ficar", shortLabel: "Ficar", path: "/city-view", icon: Bed },
  { id: "comer", label: "Onde Comer", shortLabel: "Comer", path: "/eat-map-view", icon: Utensils },
  { id: "lucky-list", label: "Lucky List", shortLabel: "Lucky List", path: "/lucky-list", icon: Sparkles, isSpecial: true },
  { id: "fazer", label: "O Que Fazer", shortLabel: "Fazer", path: "/o-que-fazer", icon: Compass },
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
