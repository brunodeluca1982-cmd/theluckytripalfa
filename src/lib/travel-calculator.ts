/**
 * TRAVEL CALCULATOR
 * 
 * Calculates distance and travel time between activities.
 * Uses Haversine formula for distance estimation.
 * Estimates travel time based on mode (walk vs car).
 */

interface Coordinates {
  lat: number;
  lng: number;
}

interface TravelEstimate {
  distanceKm: number;
  durationMinutes: number;
  mode: 'walk' | 'car' | 'unknown';
  isImpossible: boolean;
  warningMessage?: string;
}

// Haversine formula to calculate distance between two points
export const calculateDistance = (
  from: Coordinates,
  to: Coordinates
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => deg * (Math.PI / 180);

// Estimate travel time based on distance
export const estimateTravelTime = (distanceKm: number): TravelEstimate => {
  // Walking speed: ~5 km/h
  // Driving speed in city: ~25 km/h (accounting for traffic, parking, etc.)
  
  const isWalkable = distanceKm <= 1.5;
  
  if (isWalkable) {
    const walkingMinutes = Math.ceil((distanceKm / 5) * 60);
    return {
      distanceKm,
      durationMinutes: walkingMinutes,
      mode: 'walk',
      isImpossible: false,
    };
  }
  
  // For driving, add extra time for parking, walking to/from car
  const drivingMinutes = Math.ceil((distanceKm / 25) * 60) + 10; // +10 min buffer
  
  // Flag as potentially impossible if > 50km between consecutive activities
  const isImpossible = distanceKm > 50;
  
  return {
    distanceKm,
    durationMinutes: drivingMinutes,
    mode: 'car',
    isImpossible,
    warningMessage: isImpossible 
      ? 'Distância muito grande entre atividades'
      : undefined,
  };
};

// Parse duration string to minutes
export const parseDuration = (duration?: string): number => {
  if (!duration) return 60; // Default 1 hour
  
  const hourMatch = duration.match(/(\d+)\s*h/i);
  const minMatch = duration.match(/(\d+)\s*min/i);
  
  let totalMinutes = 0;
  if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
  if (minMatch) totalMinutes += parseInt(minMatch[1]);
  
  // Handle formats like "1h30" or "2h"
  if (!hourMatch && !minMatch) {
    const simpleHour = duration.match(/^(\d+(?:\.\d+)?)\s*h?$/i);
    if (simpleHour) totalMinutes = parseFloat(simpleHour[1]) * 60;
  }
  
  return totalMinutes || 60;
};

// Calculate end time based on start time and duration
export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

// Check if two time ranges overlap
export const checkTimeConflict = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };
  
  const s1 = toMinutes(start1);
  const e1 = toMinutes(end1);
  const s2 = toMinutes(start2);
  const e2 = toMinutes(end2);
  
  return s1 < e2 && s2 < e1;
};

// Check if there's enough time for travel between activities
export const checkTravelFeasibility = (
  endTimeA: string,
  startTimeB: string,
  travelMinutes: number
): { feasible: boolean; gapMinutes: number } => {
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };
  
  const endA = toMinutes(endTimeA);
  const startB = toMinutes(startTimeB);
  const gapMinutes = startB - endA;
  
  return {
    feasible: gapMinutes >= travelMinutes,
    gapMinutes,
  };
};

// Generate default start times for activities without explicit times
export const generateDefaultTimes = (
  activityCount: number,
  startHour: number = 9
): string[] => {
  const times: string[] = [];
  let currentMinutes = startHour * 60;
  
  for (let i = 0; i < activityCount; i++) {
    const hours = Math.floor(currentMinutes / 60) % 24;
    const minutes = currentMinutes % 60;
    times.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    currentMinutes += 120; // Default 2 hours between activities
  }
  
  return times;
};

export default {
  calculateDistance,
  estimateTravelTime,
  parseDuration,
  calculateEndTime,
  checkTimeConflict,
  checkTravelFeasibility,
  generateDefaultTimes,
};
