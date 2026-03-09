
CREATE TABLE public.home_hero_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_media_id text,
  title text NOT NULL,
  subtitle text,
  button_label text NOT NULL DEFAULT 'Conferir agora',
  video_url text,
  thumbnail_url text,
  permalink text,
  destination_slug text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  show_on_home boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.home_hero_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active home hero items"
  ON public.home_hero_items FOR SELECT
  TO public
  USING (is_active = true AND show_on_home = true);

CREATE POLICY "Admins can manage home hero items"
  ON public.home_hero_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
