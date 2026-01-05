/**
 * ITINERARY COHERENCE INTELLIGENCE
 * 
 * Analyzes itinerary for:
 * - Distance/travel time between consecutive items
 * - Time conflicts (travel overlaps next item)
 * - Long travel warnings
 * - Day length warnings
 * 
 * Provides optimization suggestions without forcing changes.
 */

import { useMemo } from 'react';
import { calculateDistance, getTransportDetails } from '@/lib/location-validation';
import { getValidatedLocation, VALIDATED_LOCATIONS } from '@/data/validated-locations';
import { VALIDATED_NEIGHBORHOODS } from '@/lib/location-validation';

interface ItinerarySlot {
  time: string;
  type: 'activity' | 'meal' | 'sunset' | 'transport' | 'departure';
  item: { id: string; name: string; neighborhood: string; description: string; address?: string };
  transport?: {
    from: string;
    to: string;
    mode: 'walking' | 'uber';
    duration: string;
    distanceKm: number;
  };
  timeBlock?: 'morning' | 'afternoon' | 'evening';
}

export interface TravelSegment {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  distanceKm: number;
  durationMin: number;
  mode: 'walking' | 'uber';
  durationText: string;
}

export interface CoherenceWarning {
  type: 'time_overlap' | 'long_travel' | 'day_too_long' | 'tight_schedule';
  message: string;
  severity: 'info' | 'warning';
  segmentIndex?: number;
}

export interface DayCoherence {
  dayNumber: number;
  segments: TravelSegment[];
  warnings: CoherenceWarning[];
  totalTravelMin: number;
  totalTravelKm: number;
  hasIssues: boolean;
  canOptimize: boolean;
}

/**
 * Parse time string to minutes since midnight
 */
const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Get location coordinates for an item (curated or external)
 */
const getItemLocation = (item: { id: string; neighborhood: string }): { lat: number; lng: number } | null => {
  // Try validated location first
  const validated = getValidatedLocation(item.id);
  if (validated) {
    return { lat: validated.lat, lng: validated.lng };
  }
  
  // For external items, try to use neighborhood center
  const neighborhood = VALIDATED_NEIGHBORHOODS[item.neighborhood];
  if (neighborhood) {
    return neighborhood;
  }
  
  return null;
};

/**
 * Calculate travel segments between consecutive items
 */
const calculateTravelSegments = (slots: ItinerarySlot[]): TravelSegment[] => {
  const segments: TravelSegment[] = [];
  
  // Filter out transport slots - we want to calculate between actual places
  const placeSlots = slots.filter(s => s.type !== 'transport');
  
  for (let i = 0; i < placeSlots.length - 1; i++) {
    const from = placeSlots[i];
    const to = placeSlots[i + 1];
    
    const fromLocation = getItemLocation(from.item);
    const toLocation = getItemLocation(to.item);
    
    if (fromLocation && toLocation) {
      const distanceKm = calculateDistance(
        fromLocation.lat, fromLocation.lng,
        toLocation.lat, toLocation.lng
      );
      
      const transport = getTransportDetails(distanceKm);
      
      segments.push({
        fromId: from.item.id,
        toId: to.item.id,
        fromName: from.item.name,
        toName: to.item.name,
        distanceKm: Math.round(distanceKm * 10) / 10,
        durationMin: transport.durationMin,
        mode: transport.mode,
        durationText: transport.durationText,
      });
    }
  }
  
  return segments;
};

/**
 * Detect coherence issues in a day's itinerary
 */
const detectWarnings = (slots: ItinerarySlot[], segments: TravelSegment[]): CoherenceWarning[] => {
  const warnings: CoherenceWarning[] = [];
  const placeSlots = slots.filter(s => s.type !== 'transport');
  
  // Check each segment for issues
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const fromSlot = placeSlots[i];
    const toSlot = placeSlots[i + 1];
    
    if (!fromSlot || !toSlot) continue;
    
    const fromTime = parseTimeToMinutes(fromSlot.time);
    const toTime = parseTimeToMinutes(toSlot.time);
    const availableMinutes = toTime - fromTime;
    
    // Assume minimum activity duration of 60 minutes
    const minActivityDuration = 60;
    const neededTime = minActivityDuration + segment.durationMin;
    
    // Time overlap: travel time + minimum activity exceeds available time
    if (neededTime > availableMinutes && availableMinutes > 0) {
      warnings.push({
        type: 'time_overlap',
        message: 'O tempo entre esses locais pode ficar apertado.',
        severity: 'warning',
        segmentIndex: i,
      });
    }
    
    // Long travel: more than 45 minutes of travel
    if (segment.durationMin > 45) {
      warnings.push({
        type: 'long_travel',
        message: 'Esse deslocamento é longo para o mesmo dia.',
        severity: 'warning',
        segmentIndex: i,
      });
    }
  }
  
  // Check total day length
  if (placeSlots.length >= 2) {
    const firstTime = parseTimeToMinutes(placeSlots[0].time);
    const lastTime = parseTimeToMinutes(placeSlots[placeSlots.length - 1].time);
    const dayLengthHours = (lastTime - firstTime) / 60;
    
    if (dayLengthHours > 14) {
      warnings.push({
        type: 'day_too_long',
        message: 'Talvez esse dia fique corrido demais.',
        severity: 'info',
      });
    }
  }
  
  // Check total travel time
  const totalTravelMin = segments.reduce((acc, s) => acc + s.durationMin, 0);
  if (totalTravelMin > 120) {
    warnings.push({
      type: 'tight_schedule',
      message: 'Muitos deslocamentos neste dia.',
      severity: 'info',
    });
  }
  
  return warnings;
};

/**
 * Hook to analyze itinerary coherence
 */
export const useItineraryCoherence = (
  itinerary: Record<number, ItinerarySlot[]>
): Record<number, DayCoherence> => {
  return useMemo(() => {
    const analysis: Record<number, DayCoherence> = {};
    
    for (const [dayStr, slots] of Object.entries(itinerary)) {
      const dayNumber = parseInt(dayStr);
      const segments = calculateTravelSegments(slots);
      const warnings = detectWarnings(slots, segments);
      
      const totalTravelMin = segments.reduce((acc, s) => acc + s.durationMin, 0);
      const totalTravelKm = segments.reduce((acc, s) => acc + s.distanceKm, 0);
      
      analysis[dayNumber] = {
        dayNumber,
        segments,
        warnings,
        totalTravelMin,
        totalTravelKm: Math.round(totalTravelKm * 10) / 10,
        hasIssues: warnings.length > 0,
        canOptimize: warnings.some(w => w.type === 'time_overlap' || w.type === 'long_travel'),
      };
    }
    
    return analysis;
  }, [itinerary]);
};

/**
 * Get the travel segment between two consecutive slots
 */
export const getTravelBetweenSlots = (
  fromSlot: ItinerarySlot,
  toSlot: ItinerarySlot
): TravelSegment | null => {
  const fromLocation = getItemLocation(fromSlot.item);
  const toLocation = getItemLocation(toSlot.item);
  
  if (!fromLocation || !toLocation) return null;
  
  const distanceKm = calculateDistance(
    fromLocation.lat, fromLocation.lng,
    toLocation.lat, toLocation.lng
  );
  
  const transport = getTransportDetails(distanceKm);
  
  return {
    fromId: fromSlot.item.id,
    toId: toSlot.item.id,
    fromName: fromSlot.item.name,
    toName: toSlot.item.name,
    distanceKm: Math.round(distanceKm * 10) / 10,
    durationMin: transport.durationMin,
    mode: transport.mode,
    durationText: transport.durationText,
  };
};

export default useItineraryCoherence;
