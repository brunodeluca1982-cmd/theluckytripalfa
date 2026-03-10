import { useState, useCallback } from "react";

export interface CreateItineraryState {
  step: number;
  destinationId: string;
  destinationName: string;
  destinationCountry: string;
  destinationImageUrl: string;
  arrivalDate: string | null;
  departureDate: string | null;
  travelPace: string;
  travelIntentions: string[];
  travelCompany: string;
  inspirationTags: string[];
  travelVibe: string;
  budgetStyle: string;
}

const STORAGE_KEY = "create-itinerary-draft";

const createEmpty = (): CreateItineraryState => ({
  step: 1,
  destinationId: "",
  destinationName: "",
  destinationCountry: "",
  destinationImageUrl: "",
  arrivalDate: null,
  departureDate: null,
  travelPace: "",
  travelIntentions: [],
  travelCompany: "",
  inspirationTags: [],
  travelVibe: "",
  budgetStyle: "",
});

const load = (): CreateItineraryState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...createEmpty(), ...JSON.parse(raw) };
  } catch {}
  return createEmpty();
};

export const useCreateItinerary = () => {
  const [state, setState] = useState<CreateItineraryState>(load);

  const update = useCallback((patch: Partial<CreateItineraryState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const goTo = useCallback((step: number) => update({ step }), [update]);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(createEmpty());
  }, []);

  const tripDays =
    state.arrivalDate && state.departureDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(state.departureDate).getTime() -
              new Date(state.arrivalDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  return { state, update, goTo, clear, tripDays };
};
