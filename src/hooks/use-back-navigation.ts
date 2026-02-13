import { useSearchParams } from "react-router-dom";

/**
 * Hook to determine the correct back navigation path based on origin.
 * Always returns /onde-ficar-rio (single map version).
 */
export const useBackNavigation = () => {
  return "/onde-ficar-rio";
};
