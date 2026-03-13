import { useState, useRef, useEffect, useCallback, TouchEvent } from "react";
import logoSymbol from "@/assets/brand/logo-l-creme.png";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  slug: string;
  videoUrl?: string;
  imageUrl?: string;
  title: string;
  subtitle?: string;
  buttonLabel: string;
}

// No fallback slides — hero is fully driven by database

const AUTO_ADVANCE_MS = 6000;

const HeroVideoCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useSubscription();

  const HERO_SLUGS = ["cristo-redentor", "museu-do-amanha", "praia-de-ipanema"];

  // 1. Load hero experiences
  const { data: experiences } = useQuery({
    queryKey: ["home-hero-experiences", HERO_SLUGS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("id, slug, title, subtitle, city, country")
        .in("slug", HERO_SLUGS)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 2. Load all active media (video + image) for those slugs
  const { data: mediaRows } = useQuery({
    queryKey: ["home-hero-media", HERO_SLUGS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience_media")
        .select("experience_slug, media_type, media_url")
        .in("experience_slug", HERO_SLUGS)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 2b. Fallback: load Google Places photos for slugs missing Supabase media
  const slugsMissingMedia = (() => {
    if (!experiences || !mediaRows) return [];
    const slugsWithMedia = new Set(mediaRows.map((m) => m.experience_slug));
    return experiences.filter((e) => !slugsWithMedia.has(e.slug)).map((e) => e.slug);
  })();

  const { data: placePhotos } = useQuery({
    queryKey: ["home-hero-place-photos", slugsMissingMedia],
    queryFn: async () => {
      if (slugsMissingMedia.length === 0) return [];
      const { data, error } = await supabase
        .from("place_photos")
        .select("item_id, photo_url, photo_source")
        .in("item_id", slugsMissingMedia)
        .not("photo_url", "is", null);
      if (error) throw error;
      return data;
    },
    enabled: slugsMissingMedia.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // 3. Build slides — Supabase media first, then place_photos fallback
  const heroSlides: HeroSlide[] = (() => {
    if (!experiences || !mediaRows) return [];

    // Priority 1: Supabase experience_media (exact slug match)
    const mediaBySlug = new Map<string, { video?: string; image?: string }>();
    for (const m of mediaRows) {
      const entry = mediaBySlug.get(m.experience_slug) ?? {};
      if (m.media_type === "video" && !entry.video) entry.video = m.media_url;
      if (m.media_type === "image" && !entry.image) entry.image = m.media_url;
      mediaBySlug.set(m.experience_slug, entry);
    }

    // Priority 2: Google Places photos (from place_photos table)
    const placePhotoBySlug = new Map<string, string>();
    if (placePhotos) {
      for (const p of placePhotos) {
        if (p.photo_url && !placePhotoBySlug.has(p.item_id)) {
          placePhotoBySlug.set(p.item_id, p.photo_url);
        }
      }
    }

    const slides: HeroSlide[] = [];
    for (const exp of experiences) {
      const media = mediaBySlug.get(exp.slug);
      const hasSupabaseMedia = media && (media.video || media.image);
      const fallbackPhoto = placePhotoBySlug.get(exp.slug);

      // Skip if no media from any source
      if (!hasSupabaseMedia && !fallbackPhoto) continue;

      slides.push({
        id: exp.id,
        slug: exp.slug,
        videoUrl: hasSupabaseMedia ? media.video : undefined,
        imageUrl: hasSupabaseMedia ? (media.image || media.video) : fallbackPhoto,
        title: exp.title,
        subtitle: exp.city || exp.country || exp.subtitle || undefined,
        buttonLabel: "Conferir agora",
      });
    }

    return slides;
  })();

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [current, isTransitioning]
  );

  // Auto-advance
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    timerRef.current = setTimeout(() => {
      const next = (current + 1) % heroSlides.length;
      goTo(next);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, goTo, heroSlides.length]);

  // Play current video, pause others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === current) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [current]);

  const handleSlideAction = (slide: HeroSlide) => {
    navigate(`/experiencia/${slide.slug}`);
  };

  if (heroSlides.length === 0) {
    return (
      <section className="relative w-full aspect-[9/16] max-h-[75vh] overflow-hidden bg-gradient-to-br from-[hsl(30,10%,15%)] via-[hsl(35,8%,12%)] to-[hsl(30,10%,10%)]" />
    );
  }

  const slide = heroSlides[current];

  return (
    <section className="relative w-full aspect-[9/16] max-h-[75vh] overflow-hidden">
      {/* Media layers */}
      {heroSlides.map((s, i) => {
        const canPlayMov = typeof document !== 'undefined' &&
          document.createElement('video').canPlayType('video/quicktime') !== '';
        const isMov = s.videoUrl?.toLowerCase().endsWith('.mov');
        const useVideo = s.videoUrl && (!isMov || canPlayMov);

        return useVideo ? (
          <video
            key={s.id}
            ref={(el) => { videoRefs.current[i] = el; }}
            src={s.videoUrl}
            poster={s.imageUrl}
            muted
            loop
            playsInline
            preload={i <= 1 ? "auto" : "none"}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            onError={(e) => {
              (e.target as HTMLVideoElement).style.display = 'none';
            }}
          />
        ) : (
          <img
            key={s.id}
            src={s.imageUrl}
            alt={s.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          />
        );
      })}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Header — logo + profile */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-12 pb-4">
        <img src={logoSymbol} alt="L." className="h-8 w-auto brightness-0 invert select-none drop-shadow-md" />
        <button
          onClick={() => navigate(isAuthenticated ? "/perfil" : "/auth")}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
          aria-label="Perfil"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </button>
      </header>

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center pb-8 px-6">
        <span className="px-4 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium tracking-wide mb-4">
          Confira as novidades
        </span>

        <h2 className="text-4xl font-serif font-medium text-white text-center leading-tight drop-shadow-lg">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="text-white/80 text-sm mt-1 mb-5">{slide.subtitle}</p>
        )}

        <button
          onClick={() => handleSlideAction(slide)}
          className="w-full max-w-[280px] py-3.5 rounded-full bg-background text-foreground font-semibold text-base shadow-lg hover:opacity-90 transition-opacity mt-5"
        >
          {slide.buttonLabel}
        </button>

        {/* Dots */}
        <div className="flex gap-2 mt-5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === current ? "bg-white scale-110" : "bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroVideoCarousel;
