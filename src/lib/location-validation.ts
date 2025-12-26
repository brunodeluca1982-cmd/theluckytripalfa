/**
 * LOCATION VALIDATION SYSTEM
 * 
 * Single source of truth for all geographic data.
 * All places must have validated location data before being used in itineraries.
 * 
 * RULES:
 * - Full address is required
 * - Neighborhood must be from validated list
 * - City must be specified
 * - Latitude and longitude must be real coordinates
 * - No guessing, approximating, or inferring locations
 */

export interface ValidatedLocation {
  fullAddress: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
}

export interface PlaceWithLocation {
  id: string;
  name: string;
  location: ValidatedLocation;
}

// Validated neighborhoods for Rio de Janeiro with reference coordinates
export const VALIDATED_NEIGHBORHOODS: Record<string, { lat: number; lng: number }> = {
  'Ipanema': { lat: -22.9838, lng: -43.1985 },
  'Leblon': { lat: -22.9844, lng: -43.2232 },
  'Copacabana': { lat: -22.9697, lng: -43.1868 },
  'Leme': { lat: -22.9620, lng: -43.1690 },
  'Arpoador': { lat: -22.9885, lng: -43.1920 },
  'Urca': { lat: -22.9479, lng: -43.1655 },
  'Botafogo': { lat: -22.9507, lng: -43.1822 },
  'Flamengo': { lat: -22.9342, lng: -43.1756 },
  'Jardim Botânico': { lat: -22.9679, lng: -43.2247 },
  'Gávea': { lat: -22.9765, lng: -43.2347 },
  'Lagoa': { lat: -22.9716, lng: -43.2141 },
  'São Conrado': { lat: -22.9998, lng: -43.2625 },
  'Barra da Tijuca': { lat: -23.0000, lng: -43.3650 },
  'Jardim Oceânico': { lat: -23.0076, lng: -43.3210 },
  'Recreio': { lat: -23.0239, lng: -43.4700 },
  'Centro': { lat: -22.9028, lng: -43.1758 },
  'Santa Teresa': { lat: -22.9180, lng: -43.1900 },
  'Lapa': { lat: -22.9127, lng: -43.1812 },
  'Guaratiba': { lat: -23.0500, lng: -43.5700 },
  'Floresta da Tijuca': { lat: -22.9545, lng: -43.2880 },
};

/**
 * Validates that a location has all required fields
 */
export function isValidLocation(location: Partial<ValidatedLocation> | undefined): location is ValidatedLocation {
  if (!location) return false;
  
  const { fullAddress, neighborhood, city, lat, lng } = location;
  
  // All fields must be present
  if (!fullAddress || !neighborhood || !city) return false;
  
  // Coordinates must be valid numbers
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  
  // Coordinates must be in valid range for Rio de Janeiro
  // Approximate bounding box: lat -23.1 to -22.7, lng -43.8 to -43.0
  if (lat < -23.2 || lat > -22.6) return false;
  if (lng < -43.9 || lng > -42.9) return false;
  
  // Neighborhood must be in validated list
  if (!VALIDATED_NEIGHBORHOODS[neighborhood]) return false;
  
  return true;
}

/**
 * Validates a place has complete location data
 */
export function validatePlace<T extends { id: string; name: string; location?: ValidatedLocation }>(
  place: T
): place is T & { location: ValidatedLocation } {
  if (!place.location) {
    console.warn(`[LocationValidation] Skipping place "${place.name}" (${place.id}): Missing location data`);
    return false;
  }
  
  if (!isValidLocation(place.location)) {
    console.warn(`[LocationValidation] Skipping place "${place.name}" (${place.id}): Invalid location data`);
    return false;
  }
  
  return true;
}

/**
 * Filters an array of places to only include those with valid locations
 */
export function filterValidatedPlaces<T extends { id: string; name: string; location?: ValidatedLocation }>(
  places: T[]
): (T & { location: ValidatedLocation })[] {
  return places.filter(validatePlace);
}

/**
 * Calculates real distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Sorts places by proximity to a reference point
 */
export function sortByProximity<T extends { location: ValidatedLocation }>(
  places: T[],
  referenceLat: number,
  referenceLng: number
): T[] {
  return [...places].sort((a, b) => {
    const distA = calculateDistance(referenceLat, referenceLng, a.location.lat, a.location.lng);
    const distB = calculateDistance(referenceLat, referenceLng, b.location.lat, b.location.lng);
    return distA - distB;
  });
}

/**
 * Gets transport mode and estimated time based on real distance
 */
export function getTransportDetails(distanceKm: number): {
  mode: 'walking' | 'uber';
  durationMin: number;
  durationText: string;
} {
  if (distanceKm <= 0.5) {
    return { mode: 'walking', durationMin: 7, durationText: '5-10 min' };
  }
  if (distanceKm <= 1) {
    return { mode: 'walking', durationMin: 12, durationText: '10-15 min' };
  }
  if (distanceKm <= 1.5) {
    return { mode: 'walking', durationMin: 20, durationText: '15-25 min' };
  }
  
  // For longer distances, use car/Uber
  // Estimate: ~3 min per km in Rio traffic (average)
  const durationMin = Math.ceil(distanceKm * 3);
  const lowerBound = Math.max(5, durationMin - 5);
  const upperBound = durationMin + 10;
  
  return {
    mode: 'uber',
    durationMin,
    durationText: `${lowerBound}-${upperBound} min`,
  };
}
