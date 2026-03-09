import { useState } from "react";
import { Music, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const playlists = [
  {
    id: "1",
    title: "Rio de Janeiro",
    subtitle: "Bossa, samba e pôr do sol",
    imageUrl: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=300&q=80",
  },
  {
    id: "2",
    title: "Lisboa",
    subtitle: "Fado, wine bars e ruas de pedra",
    imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=300&q=80",
  },
  {
    id: "3",
    title: "Paris",
    subtitle: "Jazz, cafés e romance",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&q=80",
  },
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
        A trilha sonora perfeita para cada destino.
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
        {playlists.map((pl) => (
          <PlaylistCard key={pl.id} playlist={pl} />
        ))}
      </div>
    </section>
  );
};

const PlaylistCard = ({ playlist }: { playlist: (typeof playlists)[number] }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <button className="relative flex-shrink-0 w-[170px] rounded-2xl overflow-hidden border border-border bg-card">
      <div className="relative aspect-square">
        {!loaded && <Skeleton className="absolute inset-0 w-full h-full rounded-none" />}
        <img
          src={playlist.imageUrl}
          alt={playlist.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center">
          <Play className="w-3.5 h-3.5 text-foreground ml-0.5" />
        </div>
      </div>
      <div className="px-3 py-2.5 text-left">
        <p className="text-sm font-medium text-foreground">{playlist.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{playlist.subtitle}</p>
      </div>
    </button>
  );
};

export default PlaylistViagem;
