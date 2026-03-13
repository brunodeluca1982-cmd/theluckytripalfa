import { Link, useParams } from "react-router-dom";
import { Loader2, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useItemSave } from "@/hooks/use-item-save";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import DetailHeroLayout from "@/components/detail/DetailHeroLayout";

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
            Voltar
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <p className="text-lg text-foreground font-medium mb-2">Experiência não encontrada</p>
          <Button asChild variant="outline">
            <Link to="/">Voltar para Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const description = exp.full_description || exp.short_description || "";
  const pills = [exp.category, exp.neighborhood, exp.city].filter(Boolean) as string[];

  // Filter playable videos
  const canPlayMov = typeof document !== "undefined" && document.createElement("video").canPlayType("video/quicktime") !== "";
  const allMedia = mediaList || [];
  const playableMedia = allMedia.filter((m) => {
    if (m.type === "video" && m.url.toLowerCase().endsWith(".mov") && !canPlayMov) return false;
    return true;
  });

  return (
    <DetailHeroLayout
      backPath="/"
      title={exp.title}
      subtitle={exp.country || exp.city || exp.subtitle || null}
      pills={pills}
      media={playableMedia}
      isSaved={isSaved}
      onSave={handleSave}
      footer={`The Lucky Trip — ${exp.city || exp.neighborhood || ""}`}
    >
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

      {/* Instagram source badge */}
      {igPost?.permalink && (
        <a
          href={igPost.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors px-3 py-2 rounded-full bg-white/5 border border-white/10"
        >
          <Instagram className="w-4 h-4" />
          Inspirado por um post no Instagram
        </a>
      )}

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
    </DetailHeroLayout>
  );
};

export default ExperienceDetail;
