import { useState, useRef, useEffect, useCallback, TouchEvent } from "react";
import logoSymbol from "@/assets/brand/logo-l-creme.png";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  destinationSlug: string | null;
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
  const { isAuthenticated } = useSubscription();

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
    if (slide.destinationSlug) {
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
