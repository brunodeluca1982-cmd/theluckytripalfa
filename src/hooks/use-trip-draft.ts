import { useState, useCallback, useEffect } from "react";

/**
 * TRIP DRAFT STATE HOOK
 * 
 * Manages the pre-planning state for the "Monte seu roteiro" flow:
 * - Destination selection
 * - Trip dates and times
 * - Travelers (adults, children)
 * - Trip styles/preferences
 * 
 * Persists to localStorage for session continuity.
 */

export interface TripDraft {
  destinationId: string;
  destinationName: string;
  destinationSlug: string;
  destinationImageUrl: string;
  arrivalAt: Date | null;
  arrivalTime: string;
  departureAt: Date | null;
  departureTime: string;
  adults: number;
  children: number;
  childrenAges: number[];
  tripStyles: string[];
  createdAt: string;
}

const STORAGE_KEY = 'trip-draft';

const createEmptyDraft = (): TripDraft => ({
  destinationId: '',
  destinationName: '',
  destinationSlug: '',
  destinationImageUrl: '',
  arrivalAt: null,
  arrivalTime: '',
  departureAt: null,
  departureTime: '',
  adults: 1,
  children: 0,
  childrenAges: [],
  tripStyles: [],
  createdAt: new Date().toISOString(),
});

const parseDraft = (stored: string): TripDraft | null => {
  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      arrivalAt: parsed.arrivalAt ? new Date(parsed.arrivalAt) : null,
      departureAt: parsed.departureAt ? new Date(parsed.departureAt) : null,
    };
  } catch {
    return null;
  }
};

export const useTripDraft = () => {
  const [draft, setDraft] = useState<TripDraft>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseDraft(stored);
      if (parsed) return parsed;
    }
    return createEmptyDraft();
  });

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const updateDraft = useCallback((updates: Partial<TripDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const setDestination = useCallback((
    id: string, 
    name: string, 
    slug: string, 
    imageUrl: string
  ) => {
    updateDraft({ 
      destinationId: id, 
      destinationName: name, 
      destinationSlug: slug,
      destinationImageUrl: imageUrl,
    });
  }, [updateDraft]);

  const setArrival = useCallback((date: Date | null, time: string) => {
    updateDraft({ arrivalAt: date, arrivalTime: time });
  }, [updateDraft]);

  const setDeparture = useCallback((date: Date | null, time: string) => {
    updateDraft({ departureAt: date, departureTime: time });
  }, [updateDraft]);

  const setAdults = useCallback((count: number) => {
    updateDraft({ adults: Math.max(1, count) });
  }, [updateDraft]);

  const setChildren = useCallback((count: number) => {
    const newCount = Math.max(0, count);
    const newAges = draft.childrenAges.slice(0, newCount);
    // Fill in default ages for new children
    while (newAges.length < newCount) {
      newAges.push(5);
    }
    updateDraft({ children: newCount, childrenAges: newAges });
  }, [updateDraft, draft.childrenAges]);

  const setChildAge = useCallback((index: number, age: number) => {
    const newAges = [...draft.childrenAges];
    newAges[index] = Math.max(0, Math.min(17, age));
    updateDraft({ childrenAges: newAges });
  }, [updateDraft, draft.childrenAges]);

  const setTripStyles = useCallback((styles: string[]) => {
    updateDraft({ tripStyles: styles });
  }, [updateDraft]);

  const toggleTripStyle = useCallback((style: string) => {
    const current = draft.tripStyles;
    const newStyles = current.includes(style)
      ? current.filter(s => s !== style)
      : [...current, style];
    updateDraft({ tripStyles: newStyles });
  }, [updateDraft, draft.tripStyles]);

  const clearDraft = useCallback(() => {
    const empty = createEmptyDraft();
    setDraft(empty);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Validation
  const isStep1Valid = 
    draft.destinationId !== '' &&
    draft.arrivalAt !== null &&
    draft.departureAt !== null;

  const tripDays = draft.arrivalAt && draft.departureAt
    ? Math.ceil((draft.departureAt.getTime() - draft.arrivalAt.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  return {
    draft,
    tripDays,
    isStep1Valid,
    // Actions
    updateDraft,
    setDestination,
    setArrival,
    setDeparture,
    setAdults,
    setChildren,
    setChildAge,
    setTripStyles,
    toggleTripStyle,
    clearDraft,
  };
};

export default useTripDraft;
