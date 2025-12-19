import { ReactNode } from "react";
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
      <BottomNavigation />
    </>
  );
};

export default MainLayout;
