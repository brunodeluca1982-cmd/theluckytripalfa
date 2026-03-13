import { Link } from "react-router-dom";
import { ChevronLeft, Bookmark } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { ReactNode } from "react";

interface MediaItem {
  type: "image" | "video";
  url: string;
  posterUrl?: string;
}

interface DetailHeroLayoutProps {
  backPath: string;
  title: string;
  subtitle?: string | null;
  pills?: string[];
  media?: MediaItem[];
  heroImageUrl?: string;
  isSaved: boolean;
  onSave: () => void;
  children: ReactNode;
  footer?: string;
}

/**
 * Shared cinematic detail page layout.
 * Full-bleed hero → title overlay → glassmorphism controls → scrollable content.
 */
export default function DetailHeroLayout({
  backPath,
  title,
  subtitle,
  pills = [],
  media,
  heroImageUrl,
  isSaved,
  onSave,
  children,
  footer,
}: DetailHeroLayoutProps) {
  const hasMedia = media && media.length > 0;
  const images = hasMedia ? media.filter((m) => m.type === "image") : [];
  const videos = hasMedia ? media.filter((m) => m.type === "video") : [];
  const posterUrl = images.length > 0 ? images[0].url : undefined;
  const singleImage = heroImageUrl || (images.length === 1 ? images[0].url : undefined);

  return (
    <div className="min-h-screen bg-black">
      {/* ─── Hero Section ─── */}
      <div className="relative w-full min-h-[56vh] overflow-hidden">
        {/* Media */}
        {videos.length > 0 ? (
          <>
            <video
              src={videos[0].url}
              poster={posterUrl || heroImageUrl}
              autoPlay
              loop
              playsInline
              muted
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLVideoElement).style.display = "none";
              }}
            />
            {(posterUrl || heroImageUrl) && (
              <img
                src={posterUrl || heroImageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover -z-10"
              />
            )}
          </>
        ) : images.length > 1 ? (
          <Carousel className="absolute inset-0 w-full h-full" opts={{ loop: true }}>
            <CarouselContent className="ml-0 h-full">
              {images.map((m, i) => (
                <CarouselItem key={i} className="pl-0 h-full">
                  <img src={m.url} alt={title} className="w-full h-full object-cover" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : singleImage ? (
          <img src={singleImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80" />

        {/* ─── Top Bar: Back + Save ─── */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-[max(env(safe-area-inset-top,12px),12px)] flex items-center justify-between">
          <Link
            to={backPath}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/25 backdrop-blur-md border border-white/15 text-white/90 active:scale-95 transition-all"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <button
            onClick={onSave}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/25 backdrop-blur-md border border-white/15 text-white/90 active:scale-95 transition-all"
            aria-label={isSaved ? "Salvo" : "Salvar"}
          >
            <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* ─── Title overlay at bottom of hero ─── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-6">
          {pills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/80 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1"
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-[2.25rem] leading-[1.1] font-serif font-semibold text-white drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-white/65 mt-1.5 drop-shadow">{subtitle}</p>
          )}
        </div>
      </div>

      {/* ─── Content Section ─── */}
      <div className="relative bg-black/90 px-5 pt-6 pb-28">
        {children}

        {/* Full-width save CTA */}
        <button
          onClick={onSave}
          className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-white text-black text-sm font-medium active:scale-[0.98] transition-transform"
        >
          <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Salvo" : "Salvar"}
        </button>

        {/* Footer */}
        {footer && (
          <p className="text-xs text-white/20 mt-8 text-center">{footer}</p>
        )}
      </div>
    </div>
  );
}
