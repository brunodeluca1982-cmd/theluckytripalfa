import { Link, useLocation } from "react-router-dom";
import { Compass, MapPin, Briefcase, Sparkles, User } from "lucide-react";
import { useEffect, useState, forwardRef } from "react";

/**
 * GLOBAL BOTTOM NAVIGATION
 *
 * 5 fixed tabs — iOS-style translucent bar.
 * "Viagem" is the focal tab (center, slightly emphasized).
 */

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  isFocus?: boolean;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Compass, path: "/" },
  { id: "destinos", label: "Destinos", icon: MapPin, path: "/destinos" },
  { id: "viagem", label: "Viagem", icon: Briefcase, path: "/minha-viagem", isFocus: true },
  { id: "lucky", label: "Lucky", icon: Sparkles, path: "/ia" },
  { id: "perfil", label: "Perfil", icon: User, path: "/perfil" },
];

const BottomNavigation = forwardRef<HTMLElement>((_, ref) => {
  const location = useLocation();
  const [savedItemsCount, setSavedItemsCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const items = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
      setSavedItemsCount(items.length);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("roteiro-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("roteiro-updated", updateCount);
    };
  }, []);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
    setSavedItemsCount(items.length);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 pb-safe backdrop-blur-xl bg-background/70">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isViagem = item.id === "viagem";
          const hasItems = isViagem && savedItemsCount > 0;

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
                <Icon
                  className={`h-5 w-5 ${active ? "stroke-[2.5]" : "stroke-[1.5]"}`}
                />
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
