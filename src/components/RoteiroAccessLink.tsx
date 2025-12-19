import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";

/**
 * ROTEIRO ACCESS LINK
 * 
 * Navigation element for accessing Meu Roteiro from any detail page.
 * Visible without scrolling, one action away.
 */

interface RoteiroAccessLinkProps {
  className?: string;
}

const RoteiroAccessLink = ({ className = "" }: RoteiroAccessLinkProps) => {
  return (
    <Link
      to="/meu-roteiro"
      className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${className}`}
      aria-label="Acessar Meu Roteiro"
    >
      <Bookmark className="w-4 h-4" />
      <span className="hidden sm:inline">Meu Roteiro</span>
    </Link>
  );
};

export default RoteiroAccessLink;
