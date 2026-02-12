import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Play, Pause, ChevronUp, X } from "lucide-react";

const PLAYLIST_URL = "https://open.spotify.com/embed/playlist/242Q0AaUu4kqsANYUaEufj?utm_source=generator&theme=0";

const PersistentSpotifyPlayer = () => {
  const { active, sheetOpen, openSheet, closeSheet, dismiss } = useSpotifyPlayer();

  if (!active) return null;

  return (
    <>
      {/* Always-mounted iframe (hidden when sheet closed, visible when open) */}
      <div
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{ visibility: sheetOpen ? "visible" : "hidden", opacity: sheetOpen ? 1 : 0 }}
      >
        {/* We use the Drawer for the sheet UI but keep iframe always mounted */}
      </div>

      {/* Drawer — controls visibility only, iframe stays mounted */}
      <Drawer open={sheetOpen} onOpenChange={(open) => { if (!open) closeSheet(); }}>
        <DrawerContent className="rounded-t-2xl">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="text-lg font-serif font-semibold text-foreground">
              🎵 Playlist — Rio de Janeiro
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <iframe
              style={{ borderRadius: "12px" }}
              src={PLAYLIST_URL}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Playlist"
            />
            <p className="text-xs text-muted-foreground text-center mt-3">
              Toque ▶ para ouvir
            </p>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Mini-player bar — shown when sheet is closed but player is active */}
      {!sheetOpen && (
        <div className="fixed bottom-[4.5rem] left-0 right-0 z-40 px-3 animate-fade-in">
          <div
            className="flex items-center justify-between rounded-xl px-4 py-2.5 backdrop-blur-md border border-white/15 shadow-lg"
            style={{ backgroundColor: "hsla(141, 40%, 20%, 0.85)" }}
          >
            <button
              onClick={openSheet}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "hsla(141, 73%, 42%, 0.3)" }}>
                <Play className="w-4 h-4" style={{ color: "hsla(141, 73%, 72%, 1)" }} />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-white truncate">Playlist Rio</p>
                <p className="text-xs text-white/50">Spotify</p>
              </div>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={openSheet}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Expandir player"
              >
                <ChevronUp className="w-4 h-4 text-white/70" />
              </button>
              <button
                onClick={dismiss}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Fechar player"
              >
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersistentSpotifyPlayer;
