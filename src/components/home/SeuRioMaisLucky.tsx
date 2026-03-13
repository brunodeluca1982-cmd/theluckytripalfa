import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlacePhoto } from "@/hooks/use-place-photo";
import type { PoolItem, MoodSet } from "@/hooks/use-home-content-pool";

/* ── Card Image ── */
const MoodCardImage = ({ item }: { item: PoolItem }) => {
  const [loaded, setLoaded] = useState(false);
  const { photoUrl, isLoading } = usePlacePhoto(
    item.photoKey,
    item.photoType,
    item.photoQuery
  );

  return (
    <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden">
      {(!loaded || isLoading) && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      {photoUrl && (
        <img
          src={photoUrl}
          alt={item.nome}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-white text-xs font-medium leading-tight line-clamp-2 drop-shadow-md">
          {item.nome}
        </p>
        {item.bairro && (
          <span className="inline-flex items-center gap-0.5 text-[9px] text-white/70 mt-0.5">
            <MapPin className="w-2 h-2" />
            {item.bairro}
          </span>
        )}
      </div>
    </div>
  );
};

/* ── Mood Card (3 items in a triptych) ── */
const MoodCard = ({ mood }: { mood: MoodSet }) => {
  const [a, b, c] = mood.items;

  return (
    <div className="flex-shrink-0 w-[300px] rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-base">{mood.emoji}</span>
          <h3 className="text-sm font-semibold text-foreground">{mood.label}</h3>
        </div>
        <p className="text-[11px] text-muted-foreground">{mood.subtitle}</p>
      </div>

      {/* Triptych grid */}
      <div className="grid grid-cols-3 gap-1.5 px-3 pb-3">
        {[a, b, c].map((item) => (
          <Link key={item.id} to={item.link} className="block">
            <MoodCardImage item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ── Section ── */
interface SeuRioMaisLuckyProps {
  moods: MoodSet[];
}

const SeuRioMaisLucky = ({ moods }: SeuRioMaisLuckyProps) => {
  if (moods.length === 0) return null;

  return (
    <section className="py-8 px-5">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">
          Seu Rio Mais Lucky
        </h2>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5 ml-6">
        Mini-mundos para inspirar sua viagem.
      </p>

      <div className="flex gap-4 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-none">
        {moods.map((mood) => (
          <MoodCard key={mood.id} mood={mood} />
        ))}
      </div>
    </section>
  );
};

export default SeuRioMaisLucky;
