import { useLocation } from "react-router-dom";

/**
 * Hook to determine the correct back navigation path based on context.
 * If user is within the Rio de Janeiro destination flow, returns Rio hub.
 * Otherwise returns app home.
 */

const RIO_ROUTES = [
  "/onde-ficar", "/hotel/", "/eat-map-view", "/onde-comer/", "/restaurante/",
  "/o-que-fazer", "/atividade/", "/experiencia/", "/lucky-list", "/como-chegar",
];

export const useBackNavigation = () => {
  const { pathname } = useLocation();

  // If within Rio destination context, go back to Rio hub
  const isRioContext = RIO_ROUTES.some((r) => pathname.startsWith(r));
  if (isRioContext) return "/destino/rio-de-janeiro";

  return "/";
};
