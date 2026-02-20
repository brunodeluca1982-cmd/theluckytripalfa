import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ───────────────────────────────────────────────────────

export interface EventoSponsor {
  sponsor_nome: string;
  sponsor_slug: string;
  logo_url: string | null;
  badge_texto: string;
  link_url: string | null;
}

export interface EventoPlacement {
  id: string;
  placement: string;
  titulo: string | null;
  subtitulo: string | null;
  media_url: string | null;
  cta_label: string | null;
  cta_link: string | null;
  ordem: number;
  evento_sponsors: EventoSponsor | null;
}

export interface ActiveEvento {
  id: string;
  destino: string;
  titulo: string;
  slug: string;
  descricao_curta: string | null;
  descricao_longa: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  cor_hex: string | null;
  hero_media_url: string | null;
  botao_label: string | null;
  botao_link: string | null;
  sponsors: EventoSponsor[];
  placements: EventoPlacement[];
  item_counts: Record<string, number>;
}

interface EventModeContextValue {
  evento: ActiveEvento | null;
  isLoading: boolean;
  getPlacement: (placementKey: string) => EventoPlacement | null;
  getPlacements: (placementKey: string) => EventoPlacement[];
}

const EventModeContext = createContext<EventModeContextValue | null>(null);

export const EventModeProvider = ({ destino, children }: { destino: string; children: ReactNode }) => {
  const [evento, setEvento] = useState<ActiveEvento | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-active-event", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: undefined,
        });

        // Use direct fetch since invoke doesn't support GET params well
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/get-active-event?destino=${encodeURIComponent(destino)}`,
          { headers: { apikey: anonKey } }
        );
        const json = await res.json();
        setEvento(json?.evento || null);
      } catch {
        setEvento(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [destino]);

  const getPlacement = (placementKey: string): EventoPlacement | null => {
    if (!evento) return null;
    return evento.placements.find((p) => p.placement === placementKey) || null;
  };

  const getPlacements = (placementKey: string): EventoPlacement[] => {
    if (!evento) return [];
    return evento.placements.filter((p) => p.placement === placementKey);
  };

  return (
    <EventModeContext.Provider value={{ evento, isLoading, getPlacement, getPlacements }}>
      {children}
    </EventModeContext.Provider>
  );
};

export const useEventMode = () => {
  const ctx = useContext(EventModeContext);
  if (!ctx) {
    // Return safe default when used outside provider (fallback)
    return {
      evento: null,
      isLoading: false,
      getPlacement: () => null,
      getPlacements: () => [],
    };
  }
  return ctx;
};
