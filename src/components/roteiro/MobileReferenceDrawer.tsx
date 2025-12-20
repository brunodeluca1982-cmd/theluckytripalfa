import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { PartnersOnTripPanel } from "./ReferencesPanel";
import { ItineraryItem } from "./ItineraryCard";
import { ReferenceItinerary } from "@/data/reference-itineraries";

interface Source {
  id: string;
  label: string;
  author?: string;
  isDefault?: boolean;
  isPremium?: boolean;
  isLocked?: boolean;
}

interface MobileReferenceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources: Source[];
  selectedSources: string[];
  onSourceToggle: (sourceId: string) => void;
  currentDay: number;
  curatedItems: ItineraryItem[];
  referenceItineraries: ReferenceItinerary[];
  tripDestinationIds: string[];
}

export const MobileReferenceDrawer = ({
  open,
  onOpenChange,
  sources,
  selectedSources,
  onSourceToggle,
  currentDay,
  curatedItems,
  referenceItineraries,
  tripDestinationIds,
}: MobileReferenceDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex items-center justify-between pb-2">
          <DrawerTitle className="text-base font-semibold">
            Roteiro de Referência
          </DrawerTitle>
          <DrawerClose asChild>
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="px-4 pb-6 overflow-y-auto flex-1">
          <PartnersOnTripPanel
            sources={sources}
            selectedSources={selectedSources}
            onSourceToggle={onSourceToggle}
            currentDay={currentDay}
            curatedItems={curatedItems}
            referenceItineraries={referenceItineraries}
            tripDestinationIds={tripDestinationIds}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileReferenceDrawer;
