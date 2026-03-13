import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-white/10 text-left">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="text-sm text-muted-foreground pb-3 leading-relaxed whitespace-pre-line">
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
      <div className="mx-6 mt-4 rounded-2xl backdrop-blur-xl bg-background/70 border border-white/10 p-5 animate-pulse">
        <div className="h-5 bg-muted/40 rounded w-1/2 mb-3" />
        <div className="h-3 bg-muted/30 rounded w-full mb-2" />
        <div className="h-3 bg-muted/30 rounded w-3/4" />
      </div>
    );
  }

  const summary = editorial?.summary;
  const hasSections = editorial?.como_e_ficar || editorial?.pra_quem || editorial?.o_que_faz_especial || editorial?.o_que_considerar;

  return (
    <div className="mx-6 mt-4 rounded-2xl backdrop-blur-xl bg-background/70 border border-white/10 p-5 animate-fade-in">
      {/* Header */}
      <h3 className="text-lg font-serif font-medium text-foreground mb-2">
        {neighborhoodName}
      </h3>

      {/* Summary */}
      {summary && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {summary}
        </p>
      )}

      {!summary && !hasSections && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Conteúdo editorial em breve.
        </p>
      )}

      {/* Action buttons */}
      {!expanded && (
        <div className="flex gap-3">
          {hasSections && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs backdrop-blur-sm bg-background/50 border-white/15"
              onClick={() => setExpanded(true)}
            >
              Por dentro de {neighborhoodName}
            </Button>
          )}
          <Button
            size="sm"
            className="flex-1 text-xs"
            onClick={onViewHotels}
          >
            Ver hotéis
          </Button>
        </div>
      )}

      {/* Expanded editorial sections */}
      {expanded && (
        <div className="mt-2">
          <EditorialSection title="Como é ficar aqui" content={editorial?.como_e_ficar ?? null} />
          <EditorialSection title="Pra quem esse bairro faz sentido" content={editorial?.pra_quem ?? null} />
          <EditorialSection title="O que faz esse bairro especial" content={editorial?.o_que_faz_especial ?? null} />
          <EditorialSection title="O que vale considerar" content={editorial?.o_que_considerar ?? null} />

          <Button
            size="sm"
            className="w-full mt-4 text-xs"
            onClick={onViewHotels}
          >
            Ver hotéis neste bairro
          </Button>
        </div>
      )}
    </div>
  );
}
