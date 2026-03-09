import { Music } from "lucide-react";

const playlists = [
  { id: "1", title: "Rio Sunset", mood: "Chill & Tropical", emoji: "🌅" },
  { id: "2", title: "Carnaval Energy", mood: "Festivo & Animado", emoji: "🎉" },
  { id: "3", title: "Bossa Nova Clássica", mood: "Relaxante", emoji: "🎶" },
];

const PlaylistViagem = () => {
  return (
    <section className="py-8 px-5">
      <div className="flex items-center gap-2 mb-2">
        <Music className="w-4 h-4 text-primary" />
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">
          Playlist da viagem
        </h2>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        A trilha sonora perfeita para cada momento da sua viagem.
      </p>

      <div className="flex flex-col gap-3">
        {playlists.map((pl) => (
          <button
            key={pl.id}
            className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:bg-accent transition-colors"
          >
            <span className="text-2xl">{pl.emoji}</span>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{pl.title}</p>
              <p className="text-xs text-muted-foreground">{pl.mood}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default PlaylistViagem;
