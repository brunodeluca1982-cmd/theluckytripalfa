import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

/**
 * TIME EDIT SHEET
 * 
 * Simple time picker for editing itinerary item start/end times.
 * No validation blocking - user has full control.
 */

interface TimeEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  startTime: string;
  endTime: string;
  onSave: (startTime: string, endTime: string) => void;
}

// Generate time options in 15-minute intervals
const generateTimeOptions = (): string[] => {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export const TimeEditSheet = ({
  open,
  onOpenChange,
  itemName,
  startTime,
  endTime,
  onSave,
}: TimeEditSheetProps) => {
  const [newStartTime, setNewStartTime] = useState(startTime || '09:00');
  const [newEndTime, setNewEndTime] = useState(endTime || '10:00');

  const handleSave = () => {
    onSave(newStartTime, newEndTime);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[50vh]">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-left flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Editar horário
          </SheetTitle>
          <p className="text-sm text-muted-foreground text-left">
            {itemName}
          </p>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Start Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Início
            </label>
            <select
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground text-base focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={`start-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Término
            </label>
            <select
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground text-base focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {TIME_OPTIONS.map((time) => (
                <option key={`end-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-12 rounded-xl"
            >
              Salvar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TimeEditSheet;
