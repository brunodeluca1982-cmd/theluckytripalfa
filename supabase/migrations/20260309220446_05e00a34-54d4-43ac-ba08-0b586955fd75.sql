
CREATE TABLE public.experience_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_slug text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  media_url text NOT NULL,
  title text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.experience_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active experience media"
  ON public.experience_media FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage experience media"
  ON public.experience_media FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_experience_media_slug ON public.experience_media (experience_slug);
