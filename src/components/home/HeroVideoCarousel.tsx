import { useState, useRef, useEffect, useCallback, TouchEvent } from "react";
import logoSymbol from "@/assets/brand/logo-l-creme.png";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  destinationSlug: string | null;
  permalink: string | null;
  videoUrl?: string;
  imageUrl?: string;
  title: string;
  subtitle?: string;
  buttonLabel: string;
}

const AUTO_ADVANCE_MS = 6000;

const HeroVideoCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();
  const { active: spotifyActive, activate: activateSpotify, openSheet: openSpotifySheet } = useSpotifyPlayer();

  // Load hero items from the official home_hero_items table
  const { data: heroItems } = useQuery({
    queryKey: ["home-hero-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("home_hero_items")
        .select("*")
        .eq("is_active", true)
        .eq("show_on_home", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Build slides from home_hero_items
  const heroSlides: HeroSlide[] = (() => {
    if (!heroItems || heroItems.length === 0) return [];

    return heroItems
      .filter((item) => item.video_url || item.thumbnail_url)
      .map((item) => ({
        id: item.id,
        destinationSlug: item.destination_slug,
        permalink: item.permalink ?? null,
        videoUrl: item.video_url ?? undefined,
        imageUrl: item.thumbnail_url ?? item.video_url ?? undefined,
        title: item.title,
        subtitle: item.subtitle ?? undefined,
        buttonLabel: item.button_label,
      }));
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

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null || heroSlides.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goTo((current + 1) % heroSlides.length);
      } else {
        goTo((current - 1 + heroSlides.length) % heroSlides.length);
      }
    }
    touchStartX.current = null;
  };

  const handleSlideAction = (slide: HeroSlide) => {
    // Priority: permalink (direct item link) > destination hub
    if (slide.permalink) {
      navigate(slide.permalink);
    } else if (slide.destinationSlug) {
      navigate(`/destino/${slide.destinationSlug}`);
    }
  };

  if (heroSlides.length === 0) {
    return (
      <section className="relative w-full aspect-[9/16] max-h-[75vh] overflow-hidden bg-gradient-to-br from-[hsl(30,10%,15%)] via-[hsl(35,8%,12%)] to-[hsl(30,10%,10%)]" />
    );
  }

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full aspect-[9/16] max-h-[75vh] overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
          onClick={() => spotifyActive ? openSpotifySheet() : activateSpotify()}
          className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20"
          style={{ backgroundColor: "hsla(141, 73%, 42%, 0.25)" }}
          aria-label="Música"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
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
