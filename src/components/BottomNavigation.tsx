import { Link, useLocation } from "react-router-dom";
import { Home, Map, BookmarkCheck, Sparkles, User } from "lucide-react";

/**
 * GLOBAL BOTTOM NAVIGATION
 * 
 * Persistent navigation bar visible across the entire app.
 * 
 * FIXED ITEMS (exactly 5):
 * 1. Home - Main discovery hub
 * 2. Destinos - Destinations portal
 * 3. Meu Roteiro - Personal saved items
 * 4. IA - AI assistance
 * 5. Perfil - User profile
 */

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "destinos", label: "Destinos", icon: Map, path: "/destinos" },
  { id: "roteiro", label: "Meu Roteiro", icon: BookmarkCheck, path: "/meu-roteiro" },
  { id: "ia", label: "IA", icon: Sparkles, path: "/ia" },
  { id: "perfil", label: "Perfil", icon: User, path: "/perfil" },
];

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
