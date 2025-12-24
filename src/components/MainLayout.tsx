import { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

/**
 * MAIN LAYOUT
 * 
 * Wraps all pages with persistent bottom navigation.
 * Ensures "Meu Roteiro" is always accessible.
 */

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      {children}
      
      {/* Concierge WhatsApp Placeholder - Visual only, no integration */}
      <div className="fixed bottom-20 left-0 right-0 z-40 pointer-events-none">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/80 backdrop-blur-sm rounded-full border border-border/50">
            <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                Concierge The Lucky Trip
              </span>
              <span className="text-[8px] text-muted-foreground/70 leading-tight">
                Em breve
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </>
  );
};

export default MainLayout;
