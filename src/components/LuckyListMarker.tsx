import { Link, useNavigate } from "react-router-dom";

interface LuckyListMarkerProps {
  id: string;
  top: string;
  left: string;
  isSubscriber?: boolean;
  onLockedTap?: () => void;
}

const LuckyListMarker = ({ 
  id, 
  top, 
  left, 
  isSubscriber = false, 
  onLockedTap 
}: LuckyListMarkerProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isSubscriber) {
      navigate(`/lucky-list/${id}`);
    } else {
      onLockedTap?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-amber-100/70 border border-amber-200/60 hover:bg-amber-100/90 hover:border-amber-300/80 transition-colors flex items-center justify-center"
      style={{ top, left }}
      aria-label="Lucky List item"
    >
      <span className="text-xs font-serif font-semibold text-amber-700/80">
        L
      </span>
    </button>
  );
};

export default LuckyListMarker;
