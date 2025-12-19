import { useState, useCallback } from "react";

/**
 * TRIP SETUP STATE HOOK
 * 
 * Manages the pre-flow state for creating an itinerary:
 * - Destination selection
 * - Trip dates
 * - Arrival/departure times
 * - Traveler information
 */

export interface Child {
  id: string;
  age: number;
}

export interface TripSetup {
  destinationId: string;
  tripStartDate: Date | null;
  tripEndDate: Date | null;
  arrivalTime: string;
  departureTime: string;
  adultsCount: number;
  hasChildren: boolean;
  children: Child[];
  createdAt: string;
}

const STORAGE_KEY = 'trip-setup';

const createEmptyTripSetup = (): TripSetup => ({
  destinationId: '',
  tripStartDate: null,
  tripEndDate: null,
  arrivalTime: '',
  departureTime: '',
  adultsCount: 2,
  hasChildren: false,
  children: [],
  createdAt: new Date().toISOString(),
});

export const useTripSetup = () => {
  const [tripSetup, setTripSetup] = useState<TripSetup>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return {
          ...parsed,
          tripStartDate: parsed.tripStartDate ? new Date(parsed.tripStartDate) : null,
          tripEndDate: parsed.tripEndDate ? new Date(parsed.tripEndDate) : null,
        };
      } catch {
        return createEmptyTripSetup();
      }
    }
    return createEmptyTripSetup();
  });

  const updateSetup = useCallback((updates: Partial<TripSetup>) => {
    setTripSetup(prev => {
      const updated = { ...prev, ...updates };
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setDestination = useCallback((destinationId: string) => {
    updateSetup({ destinationId });
  }, [updateSetup]);

  const setDates = useCallback((startDate: Date | null, endDate: Date | null) => {
    updateSetup({ tripStartDate: startDate, tripEndDate: endDate });
  }, [updateSetup]);

  const setTimes = useCallback((arrivalTime: string, departureTime: string) => {
    updateSetup({ arrivalTime, departureTime });
  }, [updateSetup]);

  const setAdultsCount = useCallback((count: number) => {
    updateSetup({ adultsCount: Math.max(1, count) });
  }, [updateSetup]);

  const toggleHasChildren = useCallback((hasChildren: boolean) => {
    updateSetup({ 
      hasChildren,
      children: hasChildren ? tripSetup.children : [],
    });
  }, [updateSetup, tripSetup.children]);

  const addChild = useCallback(() => {
    const newChild: Child = { id: `child-${Date.now()}`, age: 5 };
    updateSetup({ children: [...tripSetup.children, newChild] });
  }, [updateSetup, tripSetup.children]);

  const removeChild = useCallback((childId: string) => {
    updateSetup({ children: tripSetup.children.filter(c => c.id !== childId) });
  }, [updateSetup, tripSetup.children]);

  const updateChildAge = useCallback((childId: string, age: number) => {
    updateSetup({
      children: tripSetup.children.map(c => 
        c.id === childId ? { ...c, age: Math.max(0, Math.min(17, age)) } : c
      ),
    });
  }, [updateSetup, tripSetup.children]);

  const clearSetup = useCallback(() => {
    const empty = createEmptyTripSetup();
    setTripSetup(empty);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Calculate trip duration
  const tripDays = tripSetup.tripStartDate && tripSetup.tripEndDate
    ? Math.ceil((tripSetup.tripEndDate.getTime() - tripSetup.tripStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // Validation
  const isValid = 
    tripSetup.destinationId !== '' &&
    tripSetup.tripStartDate !== null &&
    tripSetup.tripEndDate !== null &&
    tripSetup.tripEndDate >= tripSetup.tripStartDate &&
    tripSetup.arrivalTime !== '' &&
    tripSetup.departureTime !== '' &&
    (!tripSetup.hasChildren || tripSetup.children.length > 0);

  return {
    tripSetup,
    tripDays,
    isValid,
    // Actions
    setDestination,
    setDates,
    setTimes,
    setAdultsCount,
    toggleHasChildren,
    addChild,
    removeChild,
    updateChildAge,
    clearSetup,
    updateSetup,
  };
};

export default useTripSetup;
