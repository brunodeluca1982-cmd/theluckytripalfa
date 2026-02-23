import { generateHotelSlug } from "@/pages/HotelDetail";

/**
 * Given a hotel name, resolve the correct /hotel/{slug} route.
 * Uses the SAME slug generation as HotelDetail page.
 */
export function resolveHotelSlug(nameOrSlug: string): string {
  // If it looks like an already-valid slug (contains hyphens, no spaces), use as-is
  if (nameOrSlug.includes("-") && !nameOrSlug.includes(" ")) {
    return nameOrSlug;
  }
  return generateHotelSlug(nameOrSlug);
}

/**
 * Returns the full route path for a hotel.
 */
export function resolveHotelRoute(
  nameOrSlug: string,
  _cityName = "rio-de-janeiro",
  fromNeighborhood?: string
): string {
  const slug = resolveHotelSlug(nameOrSlug);
  const params = fromNeighborhood ? `?from=${fromNeighborhood}` : "";
  return `/hotel/${slug}${params}`;
}
