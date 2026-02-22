import { guideHotels } from "@/data/rio-guide-data";
import { generateHotelSlug } from "@/pages/HotelDetail";

/**
 * Given a hotel ID (from guide data) or a hotel name,
 * resolve the correct /hotel/{slug} route.
 *
 * Priority:
 * 1. Look up guide hotel by ID → slugify its full name
 * 2. If name provided, slugify "hotel-" + name + "-" + city (if not already containing "hotel")
 * 3. Fallback: slugify whatever is given
 */
export function resolveHotelSlug(
  idOrName: string,
  cityName = "rio-de-janeiro"
): string {
  // Try matching guide hotel by ID
  const guideHotel = guideHotels.find((h) => h.id === idOrName);
  if (guideHotel) {
    return generateHotelSlug(guideHotel.name);
  }

  // If it looks like an already-valid slug (contains hyphens, no spaces), use as-is
  if (idOrName.includes("-") && !idOrName.includes(" ")) {
    return idOrName;
  }

  // Generate slug from name + city
  const base = idOrName.toLowerCase().startsWith("hotel")
    ? `${idOrName} ${cityName}`
    : `hotel ${idOrName} ${cityName}`;

  return generateHotelSlug(base);
}

/**
 * Returns the full route path for a hotel.
 */
export function resolveHotelRoute(
  idOrName: string,
  cityName = "rio-de-janeiro",
  fromNeighborhood?: string
): string {
  const slug = resolveHotelSlug(idOrName, cityName);
  const params = fromNeighborhood ? `?from=${fromNeighborhood}` : "";
  return `/hotel/${slug}${params}`;
}
