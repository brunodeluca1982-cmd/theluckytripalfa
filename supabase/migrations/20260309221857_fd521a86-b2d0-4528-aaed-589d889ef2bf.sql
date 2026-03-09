
CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  city text,
  country text,
  neighborhood text,
  category text,
  short_description text,
  full_description text,
  instagram_permalink text,
  is_active boolean NOT NULL DEFAULT true,
  show_on_home boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active experiences"
  ON public.experiences FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage experiences"
  ON public.experiences FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_experiences_slug ON public.experiences (slug);
CREATE INDEX idx_experiences_home ON public.experiences (show_on_home, is_active, sort_order);
