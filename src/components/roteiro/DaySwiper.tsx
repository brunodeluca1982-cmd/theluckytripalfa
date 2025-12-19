import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * DAY SWIPER
 * 
 * Horizontal swipe navigation for days.
 * Shows day tabs with swipe gesture support.
 */

interface DaySwiperProps {
  totalDays: number;
  currentDay: number;
  onDayChange: (day: number) => void;
}

export const DaySwiper = ({ totalDays, currentDay, onDayChange }: DaySwiperProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentDay < totalDays) {
        onDayChange(currentDay + 1);
      } else if (diff < 0 && currentDay > 1) {
        onDayChange(currentDay - 1);
      }
    }
    setTouchStart(null);
  };

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div 
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Arrows */}
      {currentDay > 1 && (
        <button
          onClick={() => onDayChange(currentDay - 1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      
      {currentDay < totalDays && (
        <button
          onClick={() => onDayChange(currentDay + 1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Day Tabs */}
      <div 
        ref={scrollRef}
        className="flex items-center justify-center gap-2 px-10 py-2 overflow-x-auto scrollbar-hide"
      >
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${currentDay === day 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            Dia {day}
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1.5 mt-2">
        {days.map((day) => (
          <div
            key={day}
            className={`
              h-1 rounded-full transition-all duration-300
              ${currentDay === day ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default DaySwiper;
