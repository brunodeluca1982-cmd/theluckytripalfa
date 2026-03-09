import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  videoUrl: string;
  destinationName: string;
  country: string;
  path: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: "rio",
    videoUrl: "/videos/rio-hero.mp4",
    destinationName: "Rio de Janeiro",
    country: "Brasil",
    path: "/destino/rio-de-janeiro/intro",
  },
  {
    id: "lisboa",
    videoUrl: "/videos/rio-hero.mp4",
    destinationName: "Lisboa",
    country: "Portugal",
    path: "/destinos",
  },
  {
    id: "paris",
    videoUrl: "/videos/rio-hero.mp4",
    destinationName: "Paris",
    country: "França",
    path: "/destinos",
  },
];

const AUTO_ADVANCE_MS = 6000;

const HeroVideoCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

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
    timerRef.current = setTimeout(() => {
      const next = (current + 1) % heroSlides.length;
      goTo(next);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, goTo]);

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

  const slide = heroSlides[current];

  return (
    <section className="relative w-full aspect-[9/16] max-h-[75vh] overflow-hidden">
      {/* Video layers */}
      {heroSlides.map((s, i) => (
        <video
          key={s.id}
          ref={(el) => { videoRefs.current[i] = el; }}
          src={s.videoUrl}
          muted
          loop
          playsInline
          preload={i <= 1 ? "auto" : "none"}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        />
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Header — logo + profile */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 pt-12 pb-4">
        <span className="font-serif text-3xl font-semibold text-white italic tracking-tight select-none">
          L.
        </span>
        <button
          onClick={() => navigate("/perfil")}
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
        {/* Label */}
        <span className="px-4 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium tracking-wide mb-4">
          Confira as novidades
        </span>

        {/* Destination */}
        <h2 className="text-4xl font-serif font-medium text-white text-center leading-tight drop-shadow-lg">
          {slide.destinationName}
        </h2>
        <p className="text-white/80 text-sm mt-1 mb-5">{slide.country}</p>

        {/* CTA */}
        <button
          onClick={() => navigate(slide.path)}
          className="w-full max-w-[280px] py-3.5 rounded-full bg-background text-foreground font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
        >
          Conferir agora
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
                i === current
                  ? "bg-white scale-110"
                  : "bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroVideoCarousel;
