import DestinationEntry from "@/components/DestinationEntry";

/**
 * RIO DE JANEIRO — DESTINATION ENTRY SCREEN
 * 
 * Instance of the locked destination entry template.
 * Contains exactly 5 primary actions.
 */

const rioActions = [
  { id: "como-chegar", label: "Como Chegar", path: "/como-chegar" },
  { id: "onde-ficar", label: "Onde Ficar", path: "/city-view" },
  { id: "onde-comer", label: "Onde Comer", path: "/eat-map-view" },
  { id: "o-que-fazer", label: "O Que Fazer", path: "/o-que-fazer" },
  { id: "lucky-list", label: "Lucky List", path: "/lucky-list", isSpecial: true },
];

const DestinationRio = () => {
  return (
    <DestinationEntry
      name="Rio de Janeiro"
      country="Brasil"
      actions={rioActions}
    />
  );
};

export default DestinationRio;
