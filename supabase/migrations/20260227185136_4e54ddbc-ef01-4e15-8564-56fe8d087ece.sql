CREATE TABLE public.experiencia_media (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiencia_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  url text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.experiencia_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read experiencia_media"
ON public.experiencia_media FOR SELECT
USING (true);

CREATE INDEX idx_experiencia_media_exp_id ON public.experiencia_media (experiencia_id, ordem);