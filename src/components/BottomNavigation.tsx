import { Link, useLocation } from "react-router-dom";
import { Home, Search, Route, BookmarkCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * GLOBAL BOTTOM NAVIGATION
 * 
 * Persistent navigation bar visible across the entire app.
 * 
 * FIXED ITEMS (exactly 5):
 * 1. Home - Main discovery hub
 * 2. Destinos - Destinations portal
 * 3. Meu Roteiro - Personal saved items (shows count badge when active)
 * 4. IA - AI assistance
 * 5. Perfil - User profile
 * 
 * HOME AWARENESS:
 * - Meu Roteiro shows a badge when items are saved
 * - Empty state vs active state is reflected visually
 */

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "destinos", label: "Destinos", icon: Search, path: "/destinos" },
  { id: "roteiro", label: "Minhas viagens", icon: BookmarkCheck, path: "/minha-viagem" },
  { id: "criar", label: "Criar roteiro", icon: Route, path: "/ia" },
];

const BottomNavigation = () => {
  const location = useLocation();
  const [savedItemsCount, setSavedItemsCount] = useState(0);

  // Listen for saved items changes
  useEffect(() => {
    const updateCount = () => {
      const items = JSON.parse(localStorage.getItem('draft-roteiro') || '[]');
      setSavedItemsCount(items.length);
    };

    updateCount();

    // Listen for storage changes and custom events
    window.addEventListener('storage', updateCount);
    window.addEventListener('roteiro-updated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('roteiro-updated', updateCount);
    };
  }, []);

  // Also update on route change (in case item was saved)
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('draft-roteiro') || '[]');
    setSavedItemsCount(items.length);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isRoteiro = item.id === "roteiro";
          const hasItems = isRoteiro && savedItemsCount > 0;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                {/* Badge indicator for saved items */}
                {hasItems && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-primary text-primary-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
                    {savedItemsCount > 9 ? "9+" : savedItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
