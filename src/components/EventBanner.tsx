import { useEventMode, type EventoPlacement } from "@/contexts/EventModeContext";

/**
 * EventBanner — generic event placement block.
 * Renders a banner/card for a given placement key.
 * Shows sponsor badge only when sponsor is linked.
 * Opens links in new tab.
 */
interface EventBannerProps {
  placementKey: string;
  className?: string;
}

export const EventBanner = ({ placementKey, className = "" }: EventBannerProps) => {
  const { evento, getPlacement } = useEventMode();
  const placement = getPlacement(placementKey);

  if (!evento || !placement) return null;

  const sponsor = placement.evento_sponsors;
  const hasMedia = !!placement.media_url;

  return (
    <div className={`rounded-xl border border-border overflow-hidden bg-card ${className}`}>
      {hasMedia && (
        <div className="w-full aspect-[3/1] bg-muted overflow-hidden">
          <img
            src={placement.media_url!}
            alt={placement.titulo || evento.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {placement.titulo && (
              <h3 className="text-sm font-semibold text-foreground">{placement.titulo}</h3>
            )}
            {placement.subtitulo && (
              <p className="text-xs text-muted-foreground mt-0.5">{placement.subtitulo}</p>
            )}
          </div>
          {sponsor && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium flex-shrink-0 uppercase tracking-wider">
              {sponsor.badge_texto}
            </span>
          )}
        </div>

        {/* Sponsor logo */}
        {sponsor?.logo_url && (
          <div className="flex items-center gap-2 pt-1">
            <img src={sponsor.logo_url} alt={sponsor.sponsor_nome} className="h-5 object-contain" />
            <span className="text-xs text-muted-foreground">{sponsor.sponsor_nome}</span>
          </div>
        )}

        {/* CTA */}
        {placement.cta_label && placement.cta_link && (
          <a
            href={placement.cta_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs font-medium text-primary hover:underline"
          >
            {placement.cta_label} →
          </a>
        )}
      </div>
    </div>
  );
};

/**
 * EventTopBanner — simplified top banner for destination hub.
 * Only renders if there's an active event.
 */
export const EventTopBanner = ({ className = "" }: { className?: string }) => {
  const { evento } = useEventMode();

  if (!evento) return null;

  return (
    <div
      className={`mx-4 p-3 rounded-xl border border-white/20 backdrop-blur-md bg-white/10 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-white/60 uppercase tracking-wider font-medium">Evento ativo</p>
          <p className="text-sm font-semibold text-white truncate">{evento.titulo}</p>
          {evento.descricao_curta && (
            <p className="text-xs text-white/70 mt-0.5 line-clamp-1">{evento.descricao_curta}</p>
          )}
        </div>
        {evento.botao_label && evento.botao_link && (
          <a
            href={evento.botao_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-white bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors flex-shrink-0"
          >
            {evento.botao_label}
          </a>
        )}
      </div>
    </div>
  );
};

export default EventBanner;
