import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNeighborhoodEditorial } from "@/hooks/use-neighborhood-editorial";

interface Props {
  neighborhoodId: string;
  neighborhoodName: string;
  onViewHotels: () => void;
}

interface SectionProps {
  title: string;
  content: string | null;
}

function EditorialSection({ title, content }: SectionProps) {
  const [open, setOpen] = useState(false);
  if (!content) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 border-t border-white/10 text-left">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="text-sm text-muted-foreground/90 pb-4 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function NeighborhoodEditorialCard({ neighborhoodId, neighborhoodName, onViewHotels }: Props) {
  const { data: editorial, isLoading } = useNeighborhoodEditorial(neighborhoodId);
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-4 mt-4 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-6 animate-pulse relative z-20 shadow-2xl">
        <div className="h-6 bg-white/10 rounded w-1/2 mb-4" />
        <div className="h-3 bg-white/8 rounded w-full mb-2" />
        <div className="h-3 bg-white/8 rounded w-3/4 mb-2" />
        <div className="h-3 bg-white/8 rounded w-2/3" />
      </div>
    );
  }

  const summary = editorial?.summary;
  const hasSections = editorial?.como_e_ficar || editorial?.pra_quem || editorial?.o_que_faz_especial || editorial?.o_que_considerar;

  return (
    <div className="mx-4 mt-4 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/15 p-6 animate-fade-in relative z-20 shadow-2xl">
      {/* Neighborhood name — large editorial typography */}
      <h3 className="text-2xl font-serif font-medium text-foreground mb-3 tracking-tight">
        {neighborhoodName}
      </h3>

      {/* Summary */}
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

      {/* Action buttons — capsule glass style */}
      {!expanded && (
        <div className="flex gap-3">
          {hasSections && (
            <button
              className="flex-1 py-3 px-4 text-xs font-medium text-foreground rounded-full backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200"
              onClick={() => setExpanded(true)}
            >
              Por dentro de {neighborhoodName}
            </button>
          )}
          <button
            className="flex-1 py-3 px-4 text-xs font-medium text-foreground rounded-full backdrop-blur-xl bg-white/15 border border-white/25 hover:bg-white/20 transition-all duration-200"
            onClick={onViewHotels}
          >
            Ver hotéis
          </button>
        </div>
      )}

      {/* Expanded editorial sections */}
      {expanded && (
        <div className="mt-2">
          <EditorialSection title="Como é ficar aqui" content={editorial?.como_e_ficar ?? null} />
          <EditorialSection title="Pra quem esse bairro faz sentido" content={editorial?.pra_quem ?? null} />
          <EditorialSection title="O que faz esse bairro especial" content={editorial?.o_que_faz_especial ?? null} />
          <EditorialSection title="O que vale considerar" content={editorial?.o_que_considerar ?? null} />

          <button
            className="w-full mt-5 py-3 px-4 text-xs font-medium text-foreground rounded-full backdrop-blur-xl bg-white/15 border border-white/25 hover:bg-white/20 transition-all duration-200"
            onClick={onViewHotels}
          >
            Ver hotéis neste bairro
          </button>
        </div>
      )}
    </div>
  );
}
