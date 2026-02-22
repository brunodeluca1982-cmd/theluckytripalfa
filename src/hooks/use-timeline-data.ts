import { useMemo } from "react";
import { ItineraryItem } from "@/components/roteiro/ItineraryCard";
import {
  calculateDistance,
  estimateTravelTime,
  parseDuration,
  calculateEndTime,
  checkTravelFeasibility,
  generateDefaultTimes,
} from "@/lib/travel-calculator";

/**
 * USE TIMELINE DATA
 * 
 * Transforms raw itinerary items into timeline-ready data with:
 * - Start/end times
 * - Travel blocks between activities
 * - Conflict detection
 * - Issue counting
 */

interface ActivityWithMeta extends ItineraryItem {
  startTime?: string;
  endTime?: string;
  hasConflict?: boolean;
  conflictMessage?: string;
}

interface TravelInfo {
  distanceKm: number;
  durationMinutes: number;
  isImpossible: boolean;
  warningMessage?: string;
}

interface DayData {
  dayNumber: number;
  activities: ActivityWithMeta[];
  travelBlocks: (TravelInfo | null)[];
  hasIssues: boolean;
  issueCount: number;
  weatherIcon?: string;
  weatherLabel?: string;
}

interface UseTimelineDataProps {
  items: Record<number, ItineraryItem[]>;
  totalDays: number;
}

export const useTimelineData = ({
  items,
  totalDays,
}: UseTimelineDataProps): DayData[] => {
  return useMemo(() => {
    const days: DayData[] = [];

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const dayItems = items[dayNum] || [];
      const activities: ActivityWithMeta[] = [];
      const travelBlocks: (TravelInfo | null)[] = [];
      let issueCount = 0;

      // Generate default times if not provided
      const defaultTimes = generateDefaultTimes(dayItems.length);

      dayItems.forEach((item, index) => {
        const durationMinutes = parseDuration(item.duration || item.time);
        const startTime = defaultTimes[index];
        const endTime = calculateEndTime(startTime, durationMinutes);

        const activity: ActivityWithMeta = {
          ...item,
          startTime,
          endTime,
        };

        // Check for travel feasibility if there's a previous item
        if (index > 0) {
          const prevItem = dayItems[index - 1];
          const prevActivity = activities[index - 1];

          // Calculate travel if both items have coordinates
          if (
            item.lat !== undefined &&
            item.lng !== undefined &&
            prevItem.lat !== undefined &&
            prevItem.lng !== undefined
          ) {
            const distance = calculateDistance(
              { lat: prevItem.lat, lng: prevItem.lng },
              { lat: item.lat, lng: item.lng }
            );

            const travelEstimate = estimateTravelTime(distance);
            
            // Check if there's enough time for travel
            if (prevActivity.endTime) {
              const feasibility = checkTravelFeasibility(
                prevActivity.endTime,
                startTime,
                travelEstimate.durationMinutes
              );

              if (!feasibility.feasible) {
                activity.hasConflict = true;
                activity.conflictMessage = `Tempo insuficiente para deslocamento (${travelEstimate.durationMinutes} min necessários)`;
                issueCount++;
              }

              if (travelEstimate.isImpossible) {
                issueCount++;
              }
            }

            travelBlocks.push({
              distanceKm: travelEstimate.distanceKm,
              durationMinutes: travelEstimate.durationMinutes,
              isImpossible: travelEstimate.isImpossible,
              warningMessage: travelEstimate.warningMessage,
            });
          } else {
            // No coordinates, insert null placeholder
            travelBlocks.push(null);
          }
        }

        activities.push(activity);
      });

      // Add null for last item (no travel after)
      if (activities.length > 0) {
        travelBlocks.push(null);
      }

      days.push({
        dayNumber: dayNum,
        activities,
        travelBlocks,
        hasIssues: issueCount > 0,
        issueCount,
      });
    }

    return days;
  }, [items, totalDays]);
};

export default useTimelineData;
