import DestinationEntry, { MapPin, Bed, Utensils, Compass, Sparkles } from "@/components/DestinationEntry";

/**
 * RIO DE JANEIRO — DESTINATION ENTRY SCREEN
 * 
 * Instance of the locked destination entry template.
 * Contains exactly 5 primary actions with circular icon buttons.
 * 
 * Visual: Full-screen background with grid of action buttons.
 */

// TODO: Replace with actual high-quality Rio de Janeiro image
const RIO_BACKGROUND = "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop";

const rioActions = [
  { id: "como-chegar", label: "Como Chegar", shortLabel: "Chegar", path: "/como-chegar", icon: MapPin },
  { id: "onde-ficar", label: "Onde Ficar", shortLabel: "Ficar", path: "/city-view", icon: Bed },
  { id: "onde-comer", label: "Onde Comer", shortLabel: "Comer", path: "/eat-map-view", icon: Utensils },
  { id: "lucky-list", label: "Lucky List", shortLabel: "Lucky List", path: "/lucky-list", icon: Sparkles, isSpecial: true },
  { id: "o-que-fazer", label: "O Que Fazer", shortLabel: "Fazer", path: "/o-que-fazer", icon: Compass },
];

const DestinationRio = () => {
  return (
    <DestinationEntry
      name="Rio de Janeiro"
      country="Brasil"
      backgroundImage={RIO_BACKGROUND}
      actions={rioActions}
    />
  );
};

export default DestinationRio;
