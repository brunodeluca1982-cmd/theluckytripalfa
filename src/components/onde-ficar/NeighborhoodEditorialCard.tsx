import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useExternalNeighborhood } from "@/hooks/use-external-neighborhoods";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  neighborhoodId: string;
  neighborhoodName: string;
  onViewHotels: () => void;
}

interface SectionProps {
  title: string;
  content: string | string[] | null;
}

function EditorialSection({ title, content }: SectionProps) {
  const [open, setOpen] = useState(false);
  if (!content) return null;

  const text = Array.isArray(content) ? content.join("\n") : content;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 border-t border-white/10 text-left">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="text-sm text-muted-foreground/90 pb-4 leading-relaxed whitespace-pre-line"
        >
          {text}
        </motion.p>
      </CollapsibleContent>
    </Collapsible>
  );
}

function GlassButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`flex-1 py-3 px-4 text-xs font-medium text-foreground rounded-full backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-colors duration-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

export default function NeighborhoodEditorialCard({ neighborhoodId, neighborhoodName, onViewHotels }: Props) {
  const { data: neighborhood, isLoading } = useExternalNeighborhood(neighborhoodId);
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="mx-4 mt-4 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-6 relative z-20 shadow-2xl"
      >
        <div className="h-6 bg-white/10 rounded w-1/2 mb-4 animate-pulse" />
        <div className="h-3 bg-white/8 rounded w-full mb-2 animate-pulse" />
        <div className="h-3 bg-white/8 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-3 bg-white/8 rounded w-2/3 animate-pulse" />
      </motion.div>
    );
  }

  const summary = neighborhood?.identity_phrase;
  const hasSections = neighborhood?.my_view || neighborhood?.how_to_live;
  const bestForText = [neighborhood?.best_for_1, neighborhood?.best_for_2, neighborhood?.best_for_3]
    .filter(Boolean)
    .join("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      layout
      layoutDependency={expanded}
      className="mx-4 mt-4 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-6 relative z-20 shadow-2xl"
    >
      <h3 className="text-2xl font-serif font-medium text-foreground mb-3 tracking-tight">
        {neighborhood?.neighborhood_name || neighborhoodName}
      </h3>

      {summary && (
        <p className="text-sm text-muted-foreground/90 leading-relaxed mb-6">
          {summary}
        </p>
      )}

      {!summary && !hasSections && (
        <p className="text-sm text-muted-foreground/90 leading-relaxed mb-6">
          Conteúdo editorial em breve.
        </p>
      )}

      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex gap-3"
          >
            {hasSections && (
              <GlassButton onClick={() => setExpanded(true)}>
                Por dentro de {neighborhood?.neighborhood_name || neighborhoodName}
              </GlassButton>
            )}
            <GlassButton onClick={onViewHotels} className="bg-white/15 border-white/25">
              Ver hotéis
            </GlassButton>
          </motion.div>
        ) : (
          <motion.div
            key="editorial"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="mt-2 overflow-hidden"
          >
            <EditorialSection title="Meu olhar" content={neighborhood?.my_view ?? null} />
            <EditorialSection title="Como viver esse bairro" content={neighborhood?.how_to_live ?? null} />
            <EditorialSection title="Melhor para" content={bestForText || null} />

            <GlassButton onClick={onViewHotels} className="w-full mt-5 bg-white/15 border-white/25">
              Ver hotéis neste bairro
            </GlassButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
