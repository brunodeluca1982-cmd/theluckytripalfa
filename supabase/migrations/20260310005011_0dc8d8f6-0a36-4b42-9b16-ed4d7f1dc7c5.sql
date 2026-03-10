
-- Insert praia-de-ipanema and cristo-redentor experiences
INSERT INTO public.experiences (slug, title, subtitle, city, country, category, short_description, full_description, is_active, show_on_home, sort_order)
VALUES
  ('praia-de-ipanema', 'Praia de Ipanema', 'A praia mais famosa do Rio', 'Rio de Janeiro', 'Brasil', 'destino', 'Descubra Ipanema, a praia mais icônica do Rio de Janeiro.', 'Ipanema é mais do que uma praia: é um estado de espírito carioca.', true, true, 0),
  ('cristo-redentor', 'Cristo Redentor', 'Uma das 7 maravilhas do mundo', 'Rio de Janeiro', 'Brasil', 'destino', 'Visite o Cristo Redentor, cartão postal do Rio.', 'O Cristo Redentor é uma das sete maravilhas do mundo moderno, no topo do Corcovado.', true, true, 1)
ON CONFLICT (slug) DO UPDATE SET
  show_on_home = true,
  is_active = true,
  sort_order = EXCLUDED.sort_order,
  title = EXCLUDED.title,
  city = EXCLUDED.city,
  country = EXCLUDED.country;

-- Insert media for praia-de-ipanema
INSERT INTO public.experience_media (experience_slug, media_type, media_url, title, sort_order, is_active)
VALUES
  ('praia-de-ipanema', 'video', '/videos/rio-hero.mp4', 'Ipanema Hero Video', 0, true),
  ('praia-de-ipanema', 'image', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200', 'Ipanema Hero Image', 1, true);

-- Insert media for cristo-redentor
INSERT INTO public.experience_media (experience_slug, media_type, media_url, title, sort_order, is_active)
VALUES
  ('cristo-redentor', 'video', '/videos/rio-hero.mp4', 'Cristo Redentor Hero Video', 0, true),
  ('cristo-redentor', 'image', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200', 'Cristo Redentor Hero Image', 1, true);

-- Update existing experiences to adjust sort_order so new ones come first
UPDATE public.experiences SET sort_order = 10 WHERE slug = 'rio-de-janeiro';
UPDATE public.experiences SET sort_order = 11 WHERE slug = 'lisboa';
UPDATE public.experiences SET sort_order = 12 WHERE slug = 'paris';
