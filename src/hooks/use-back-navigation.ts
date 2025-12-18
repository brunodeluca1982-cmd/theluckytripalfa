import { useSearchParams } from "react-router-dom";

/**
 * Hook to determine the correct back navigation path based on origin.
 * - If from=map, returns /city-view
 * - If from=list, returns /onde-ficar-rio  
 * - Default (no param or unknown): /city-view (Map View is the primary parent)
 */
export const useBackNavigation = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  
  if (from === "list") {
    return "/onde-ficar-rio";
  }
  
  // Default to map view (primary parent context)
  return "/city-view";
};
