import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Map, Calendar, Info, Ticket, Utensils } from "lucide-react";

/**
 * ITINERARY TABS
 * 
 * Top-level navigation for the trip experience.
 * Default view: Itinerary
 * 
 * Tabs:
 * - General: Overview of the trip
 * - Itinerary: Multi-day timeline (default)
 * - Details: Trip logistics
 * - Tickets: Reservations and tickets
 * - Food: Restaurant reservations
 */

interface ItineraryTabsProps {
  defaultValue?: string;
  children: {
    general: React.ReactNode;
    itinerary: React.ReactNode;
    details: React.ReactNode;
    tickets: React.ReactNode;
    food: React.ReactNode;
  };
}

const tabs = [
  { id: 'general', label: 'Geral', icon: Map },
  { id: 'itinerary', label: 'Roteiro', icon: Calendar },
  { id: 'details', label: 'Detalhes', icon: Info },
  { id: 'tickets', label: 'Ingressos', icon: Ticket },
  { id: 'food', label: 'Comida', icon: Utensils },
];

export const ItineraryTabs = ({ 
  defaultValue = 'itinerary',
  children 
}: ItineraryTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="w-full justify-start gap-1 bg-transparent border-b border-border rounded-none h-auto p-0 px-4">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary transition-all"
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="general" className="mt-0">
        {children.general}
      </TabsContent>
      <TabsContent value="itinerary" className="mt-0">
        {children.itinerary}
      </TabsContent>
      <TabsContent value="details" className="mt-0">
        {children.details}
      </TabsContent>
      <TabsContent value="tickets" className="mt-0">
        {children.tickets}
      </TabsContent>
      <TabsContent value="food" className="mt-0">
        {children.food}
      </TabsContent>
    </Tabs>
  );
};

export default ItineraryTabs;
