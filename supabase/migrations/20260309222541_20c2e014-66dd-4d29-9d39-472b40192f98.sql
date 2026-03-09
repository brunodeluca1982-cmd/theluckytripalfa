
-- 1. Imported Instagram posts table
CREATE TABLE public.imported_instagram_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_media_id text UNIQUE,
  permalink text,
  caption text,
  media_type text NOT NULL DEFAULT 'IMAGE',
  media_url text,
  thumbnail_url text,
  timestamp timestamp with time zone,
  hashtags text[],
  location_name text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.imported_instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read imported instagram posts"
  ON public.imported_instagram_posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage imported instagram posts"
  ON public.imported_instagram_posts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_imported_ig_media_id ON public.imported_instagram_posts (instagram_media_id);
CREATE INDEX idx_imported_ig_status ON public.imported_instagram_posts (status);

-- 2. Add instagram_post_id to experiences
ALTER TABLE public.experiences
  ADD COLUMN instagram_post_id uuid REFERENCES public.imported_instagram_posts(id) ON DELETE SET NULL;

CREATE INDEX idx_experiences_ig_post ON public.experiences (instagram_post_id);
