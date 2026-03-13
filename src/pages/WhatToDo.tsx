import { Link, useNavigate } from "react-router-dom";
import { Clapperboard, Music, ArrowLeft, Lock, Clock, Zap, Loader2, RefreshCw } from "lucide-react";
import { useCallback } from "react";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";
import { useEventMode } from "@/contexts/EventModeContext";
import { clearVideoSeen } from "@/pages/DestinationVideoIntro";
import { useCityHero } from "@/contexts/CityHeroContext";
import { useOQueFazer, type OQueFazerItem } from "@/hooks/use-o-que-fazer";
import { usePlacePhoto, buildPlaceQuery } from "@/hooks/use-place-photo";

/* ───── Slugify helper for cache keys ───── */
function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ───── Lucky List Teaser (blurred) ───── */

const TEASER_CTAS = [
  "Descubra o momento certo",
  "O segredo está nos detalhes",
  "Tem mais por trás disso",
  "Existe um jeito melhor",
  "Quem sabe, sabe",
];

function LuckyListTeaser({ text, index }: { text: string; index: number }) {
  const cta = TEASER_CTAS[index % TEASER_CTAS.length];
  return (
    <Link
      to="/lucky-list"
      className="relative block mt-3 rounded-xl overflow-hidden border border-white/15"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-3 backdrop-blur-xl bg-white/5 select-none" style={{ filter: "blur(5px)" }}>
        <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{text}</p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px]">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20">
          <Lock className="w-3 h-3 text-white/70" />
          <span className="text-[11px] font-medium text-white/85 tracking-wide">{cta}</span>
        </div>
      </div>
    </Link>
  );
}

/* ───── Item Card ───── */

function OQueFazerCard({ item, index, onTap }: { item: OQueFazerItem; index: number; onTap: () => void }) {
  const placeQuery = buildPlaceQuery(item.nome, item.bairro || undefined);
  const itemSlug = slugify(item.nome);
  const { photoUrl, isLoading: photoLoading } = usePlacePhoto(itemSlug, "attraction", placeQuery);

  return (
    <button
      onClick={onTap}
      className="w-full text-left py-5 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors rounded-lg -mx-1 px-1"
    >
      {/* Hero Image */}
      {(photoUrl || photoLoading) && (
        <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 relative bg-white/5">
          {photoLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-white/30" />
            </div>
          )}
          {photoUrl && (
            <img
              src={photoUrl}
              alt={item.nome}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      )}

      {!photoUrl && !photoLoading && (
        <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 relative bg-white/5 flex items-center justify-center">
          <span className="text-xs text-white/45">Imagem indisponível</span>
        </div>
      )}

      {/* Category + Bairro */}
      <div className="flex items-center gap-2 mb-1">
        {item.categoria && (
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">{item.categoria}</span>
        )}
        {item.bairro && (
          <>
            <span className="text-white/20">·</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">{item.bairro}</span>
          </>
        )}
      </div>

      {/* Nome */}
      <h2 className="text-lg font-serif font-medium text-white leading-snug mb-1.5">
        {item.nome}
      </h2>

      {/* Meu olhar excerpt */}
      {item.meu_olhar && (
        <p className="text-sm text-white/70 leading-relaxed line-clamp-2 mb-2">
          {item.meu_olhar.split("\n")[0]}
        </p>
      )}

      {/* Metadata pills */}
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {item.vibe && (
          <span className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-white/40">
            {item.vibe}
          </span>
        )}
        {item.duracao_media && (
          <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
            <Clock className="w-3 h-3" /> {item.duracao_media}
          </span>
        )}
        {item.energia && (
          <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
            <Zap className="w-3 h-3" /> {item.energia}
          </span>
        )}
      </div>

      {/* Lucky List teaser */}
      {item.momento_lucky_list && (
        <LuckyListTeaser text={item.momento_lucky_list} index={index} />
      )}
    </button>
  );
}

/* ───── Main Page ───── */

const WhatToDo = () => {
  const navigate = useNavigate();
  const { active, activate, openSheet } = useSpotifyPlayer();
  const { evento, getPlacement } = useEventMode();
  const { heroUrl } = useCityHero();
  const { data: items, isLoading, isError, error, refetch, isFetching } = useOQueFazer();
  const [selectedItem, setSelectedItem] = useState<OQueFazerItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleMusicTap = useCallback(() => {
    if (!active) activate();
    else openSheet();
  }, [active, activate, openSheet]);

  const handleReplayIntro = useCallback(() => {
    clearVideoSeen("rio-de-janeiro");
    navigate("/destino/rio-de-janeiro/intro", { replace: true });
  }, [navigate]);

  const handleCardTap = useCallback((item: OQueFazerItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  }, []);

  const topPlacement = getPlacement("o_que_fazer_top");

  return (
    <div className="min-h-screen relative pb-20 flex flex-col">
      {/* Full-screen background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroUrl})` }}
      />
      <div className="fixed inset-0 bg-black/[0.27]" />

      {/* Sepia editorial overlay */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-[400ms]"
        style={{
          backgroundColor: "hsla(35, 30%, 20%, 0.35)",
          mixBlendMode: "color",
          opacity: evento ? 0 : 1,
        }}
      />

      {/* Header buttons */}
      <div className="relative z-30 flex items-center justify-between px-4 pt-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReplayIntro}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
            aria-label="Replay intro video"
          >
            <Clapperboard className="w-4 h-4" />
          </button>
          <button
            onClick={handleMusicTap}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-colors"
            style={{ backgroundColor: "hsla(141, 73%, 42%, 0.25)", color: "hsla(141, 73%, 72%, 1)" }}
            aria-label="Abrir player de música"
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 flex flex-col items-center mt-6 mb-2 px-6">
        <h1 className="text-[2.75rem] font-serif font-medium text-white leading-none text-center drop-shadow-lg tracking-tight">
          O Que Fazer
        </h1>
        <p className="text-xs tracking-[0.35em] text-white/70 uppercase mt-2">
          no rio
        </p>

        {evento && (
          <div className="flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
            <span className="text-xs text-white/80 font-medium">{evento.titulo}</span>
          </div>
        )}
      </div>

      {/* Sponsor placement banner */}
      {topPlacement && (
        <div className="relative z-20 px-6 mb-2">
          <div className="p-3 rounded-xl border border-white/20 backdrop-blur-md bg-white/10">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                {topPlacement.titulo && (
                  <p className="text-sm font-semibold text-white truncate">{topPlacement.titulo}</p>
                )}
                {topPlacement.subtitulo && (
                  <p className="text-xs text-white/70">{topPlacement.subtitulo}</p>
                )}
              </div>
              {topPlacement.evento_sponsors && (
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/20 text-white/80 font-medium flex-shrink-0 uppercase">
                  {topPlacement.evento_sponsors.badge_texto}
                </span>
              )}
            </div>
            {topPlacement.cta_label && topPlacement.cta_link && (
              <a
                href={topPlacement.cta_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-medium text-white/90 hover:text-white"
              >
                {topPlacement.cta_label} →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="relative z-20 px-6 mt-4 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-white/60" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-white/80 text-center">
              Não conseguimos carregar as atividades agora.
            </p>
            <p className="text-xs text-white/50 text-center max-w-xs">
              {error instanceof Error ? error.message : "Erro de leitura da base oficial o_que_fazer_rio."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 text-xs text-white/80 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`} />
              Tentar novamente
            </button>
          </div>
        ) : items && items.length > 0 ? (
          <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 px-4">
            {items.map((item, i) => (
              <OQueFazerCard key={item.id} item={item} index={i} onTap={() => handleCardTap(item)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-white/60 text-center">
              Nenhuma atividade disponível ainda.
            </p>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <OQueFazerDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        item={selectedItem}
      />
    </div>
  );
};

export default WhatToDo;
