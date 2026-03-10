
ALTER TABLE public.imported_instagram_posts
  ADD COLUMN IF NOT EXISTS should_create_experience boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_imported_ig_should_create ON public.imported_instagram_posts (should_create_experience) WHERE should_create_experience = true;
