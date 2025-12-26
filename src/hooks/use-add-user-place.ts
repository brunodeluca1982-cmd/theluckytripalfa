import { useCallback } from "react";
import { HybridPlaceResult } from "@/components/roteiro/HybridPlaceSearch";
import { toast } from "sonner";

/**
 * User-added place item structure
 * Compliant with MAP_DATA_REQUIREMENTS from architecture
 * 
 * Supports both curated and non-curated (Google) places:
 * - curated=true: From Lucky Trip database, AI can recommend
 * - curated=false: From Google, AI must NOT recommend
 */
export interface UserAddedPlace {
  id: string;
  name: string;
  placeId: string; // Google Places ID (for Google sources) or internal ID (for curated)
  lat: number | null;
  lng: number | null;
  address: string;
  neighborhood: string | null;
  city: string | null;
  source: 'curated' | 'google';
  curated: boolean;
  addedAt: string;
}

const STORAGE_KEY = 'user-added-places';

/**
 * Hook for managing user-added places
 * 
 * Per architectural rules:
 * - User-added places must have valid place_id
 * - They can only be used for distance/travel time calculations
 * - System must NOT recommend or describe them
 */
export const useAddUserPlace = () => {
  // Get all user-added places from localStorage
  const getUserPlaces = useCallback((): UserAddedPlace[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Save a new user-added place
  const addUserPlace = useCallback((placeData: HybridPlaceResult): UserAddedPlace => {
    const placeId = placeData.placeId || placeData.id;
    
    const newPlace: UserAddedPlace = {
      id: `user-place-${placeId}-${Date.now()}`,
      name: placeData.name,
      placeId: placeId,
      lat: placeData.lat,
      lng: placeData.lng,
      address: placeData.address,
      neighborhood: placeData.neighborhood,
      city: null,
      source: placeData.source,
      curated: placeData.curated,
      addedAt: new Date().toISOString(),
    };

    const existingPlaces = getUserPlaces();
    
    // Check if place already exists
    const exists = existingPlaces.some(p => p.placeId === placeId);
    if (exists) {
      toast.info("Local já adicionado");
      return existingPlaces.find(p => p.placeId === placeId)!;
    }

    const updatedPlaces = [...existingPlaces, newPlace];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaces));
    
    return newPlace;
  }, [getUserPlaces]);

  // Remove a user-added place
  const removeUserPlace = useCallback((placeId: string) => {
    const existingPlaces = getUserPlaces();
    const updatedPlaces = existingPlaces.filter(p => p.placeId !== placeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaces));
  }, [getUserPlaces]);

  // Check if a place is already added
  const hasPlace = useCallback((placeId: string): boolean => {
    const places = getUserPlaces();
    return places.some(p => p.placeId === placeId);
  }, [getUserPlaces]);

  // Clear all user-added places
  const clearAllPlaces = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    getUserPlaces,
    addUserPlace,
    removeUserPlace,
    hasPlace,
    clearAllPlaces,
  };
};

export default useAddUserPlace;
