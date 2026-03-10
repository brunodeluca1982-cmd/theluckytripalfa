import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Bookmark, MapPin, Loader2, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemSave } from "@/hooks/use-item-save";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";

interface MediaRow {
  type: "image" | "video";
  url: string;
  title?: string;
}

function useExperience(slug: string | undefined) {
  return useQuery({
    queryKey: ["experience", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("slug", slug!)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

function useExperienceMedia(slug: string | undefined) {
  return useQuery({
    queryKey: ["experience-media-slug", slug],
    queryFn: async (): Promise<MediaRow[]> => {
      const { data, error } = await supabase
        .from("experience_media")
        .select("media_type, media_url, title")
        .eq("experience_slug", slug!)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        type: r.media_type as "image" | "video",
        url: r.media_url,
        title: r.title,
      }));
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

function isExpSavedLocally(slug: string) {
  const draft = JSON.parse(localStorage.getItem("draft-roteiro") || "[]");
  return draft.some((item: { id: string; type: string }) => item.id === slug && item.type === "activity");
}

function useLinkedInstagramPost(postId: string | null | undefined) {
  return useQuery({
    queryKey: ["instagram-post", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("imported_instagram_posts")
        .select("permalink, caption, media_url, thumbnail_url, location_name")
        .eq("id", postId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!postId,
    staleTime: 10 * 60 * 1000,
  });
}

const ExperienceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { saveItem } = useItemSave();
  const { data: exp, isLoading } = useExperience(slug);
  const { data: mediaList } = useExperienceMedia(slug);
  const { data: igPost } = useLinkedInstagramPost(exp?.instagram_post_id);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (slug) setIsSaved(isExpSavedLocally(slug));
  }, [slug]);

  const handleSave = () => {
    if (!exp) return;
    saveItem(exp.slug, "activity", exp.title, false);
    setIsSaved(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!exp) {
    return (
      <div className="min-h-screen bg-background">
        <header className="px-6 py-4 border-b border-border">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <p className="text-lg text-foreground font-medium mb-2">Experiência não encontrada</p>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Esta experiência pode ter sido removida ou o link está incorreto.
          </p>
          <Button asChild variant="outline">
            <Link to="/">Voltar para Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasMedia = mediaList && mediaList.length > 0;
  const subtitle = exp.country || exp.city || exp.subtitle || null;
  const description = exp.full_description || exp.short_description || "";

  // Separate videos and images for smart rendering
  const videos = hasMedia ? mediaList.filter((m) => m.type === "video") : [];
  const images = hasMedia ? mediaList.filter((m) => m.type === "image") : [];
  const posterUrl = images.length > 0 ? images[0].url : undefined;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero media — video gets priority with poster fallback */}
      <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
        {videos.length > 0 ? (
          <>
            <video
              src={videos[0].url}
              poster={posterUrl}
              autoPlay
              loop
              playsInline
              muted
              controls
              preload="auto"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLVideoElement).style.display = 'none';
              }}
            />
            {/* Fallback image behind the video in case .mov doesn't render */}
            {posterUrl && (
              <img
                src={posterUrl}
                alt={exp.title}
                className="absolute inset-0 w-full h-full object-cover -z-10"
              />
            )}
          </>
        ) : images.length > 1 ? (
          <Carousel className="w-full h-full" opts={{ loop: true }}>
            <CarouselContent className="ml-0 h-full">
              {images.map((m, i) => (
                <CarouselItem key={i} className="pl-0 h-full">
                  <img src={m.url} alt={exp.title} className="w-full h-full object-cover" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : images.length === 1 ? (
          <img src={images[0].url} alt={exp.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Sem mídia disponível</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute top-0 left-0 right-0 px-4 pt-[env(safe-area-inset-top,12px)] pb-2 flex items-center z-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/90 font-medium">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="relative bg-black/90 backdrop-blur-sm px-5 pt-7 pb-24">
        {/* Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {exp.category && (
            <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
              {exp.category}
            </span>
          )}
          {exp.neighborhood && (
            <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
              {exp.neighborhood}
            </span>
          )}
          {exp.city && (
            <span className="text-[11px] font-medium tracking-widest uppercase text-white/70 border border-white/20 rounded-full px-3 py-1">
              {exp.city}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-serif font-semibold text-white leading-tight mb-2">
          {exp.title}
        </h1>

        {subtitle && (
          <p className="text-sm text-white/60 mb-5">{subtitle}</p>
        )}

        {/* Description */}
        {description && (
          <div className="space-y-3 mb-6">
            {description.split("\n").map((paragraph, index) => (
              <p key={index} className="text-base text-white/75 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full h-14 rounded-full bg-white text-black font-semibold text-base flex items-center justify-center gap-2 mb-6 active:scale-[0.98] transition-transform"
        >
          <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Salvo" : "Salvar"}
        </button>

        {/* Instagram source badge */}
        {igPost?.permalink && (
          <a
            href={igPost.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors mb-3 px-3 py-2 rounded-full bg-white/5 border border-white/10"
          >
            <Instagram className="w-4 h-4" />
            Inspirado por um post no Instagram
          </a>
        )}

        {/* Instagram permalink fallback */}
        {!igPost?.permalink && exp.instagram_permalink && (
          <a
            href={exp.instagram_permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Ver no Instagram
          </a>
        )}

        <p className="text-xs text-white/20 mt-10">The Lucky Trip — {exp.city || exp.neighborhood || ""}</p>
      </div>
    </div>
  );
};

export default ExperienceDetail;
