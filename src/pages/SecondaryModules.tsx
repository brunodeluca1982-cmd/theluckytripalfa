import { useParams } from "react-router-dom";
import SecondaryModulesSwiper from "@/components/SecondaryModulesSwiper";

/**
 * SECONDARY MODULES PAGE
 * 
 * Container for horizontal swipe navigation of secondary destination modules.
 * Accessed after the first destination screen (5 primary buttons).
 * 
 * ROUTE: /destino/:destinationId/explorar
 */

const DESTINATION_NAMES: Record<string, string> = {
  'rio-de-janeiro': 'Rio de Janeiro',
};

const SecondaryModules = () => {
  const { destinationId = 'rio-de-janeiro' } = useParams();
  const destinationName = DESTINATION_NAMES[destinationId] || 'Destino';

  return (
    <SecondaryModulesSwiper
      destinationId={destinationId}
      destinationName={destinationName}
    />
  );
};

export default SecondaryModules;
